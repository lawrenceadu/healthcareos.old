import { useState } from 'react';
import { Accordion, Button, Field } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';

import { usePatient, usePermissions } from '../../../hooks';
import { InvoiceModel } from '../../../models';
import AddForm from './Invoice/Add';
import Item from './Invoice/Item';

export function Invoice() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canView, canAdd] = usePermissions('invoice_view', 'invoice_add');

  /**
   * hooks
   */
  const { patient } = usePatient();

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    invoices: InvoiceModel[];
    total: number;
  }>(
    canView &&
      `/invoice?${queryString.stringify({
        ...filters,
        per_page: 10,
        page: (filters?.page || 0) + 1,
        patient: patient.id,
      })}`
  );

  /**
   * variables
   */
  const invoices = data?.invoices || [];

  return (
    <div>
      <div
        className={helpers.classNames(
          'mb-6',
          'flex flex-col gap-4 items-center',
          'md:flex-row md:justify-between'
        )}
      >
        <Field.Search
          onSearch={(key) => setFilters({ ...filters, search: key })}
        />

        {canAdd && (
          <AddForm {...{ mutate }}>
            {({ proceed }) => (
              <Button
                onClick={() => proceed()}
                className="btn-primary w-full md:w-auto"
              >
                <PlusIcon />
                <span>Create invoice</span>
              </Button>
            )}
          </AddForm>
        )}
      </div>

      {!data && !error && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="bg-neutral-100 animate-pulse h-[174px] rounded-lg"
            />
          ))}
        </div>
      )}

      {data && (
        <>
          {!invoices.length && <p>No invoices yet</p>}
          {!!invoices.length && (
            <Accordion className="flex flex-col gap-4 mb-8">
              {invoices.map((invoice, key) => (
                <Item key={key} {...{ invoice, mutate }} />
              ))}
            </Accordion>
          )}
        </>
      )}
    </div>
  );
}

export default Invoice;
