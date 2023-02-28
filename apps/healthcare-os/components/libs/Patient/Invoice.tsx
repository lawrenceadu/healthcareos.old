import { useState } from 'react';
import { Accordion, Badge, Button, Field, Filter } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';

import AddForm from './Invoice/Add';
import EditForm from './Invoice/Edit';

export function Invoice() {
  /**
   * state
   */
  const [filters, setFilters] = useState<
    Partial<{ search: string; filter: string }>
  >({});

  return (
    <div>
      <div className="flex gap-4 items-center mb-6">
        <Field.Search
          onSearch={(key) => setFilters({ ...filters, search: key })}
        />
        <Filter.Dropdown
          label="Filters"
          value={filters?.filter}
          options={[{ label: 'Outpatient', value: 'outpatient' }]}
          onClick={({ value }: { value: string }) =>
            setFilters({ ...filters, filter: value })
          }
        />
      </div>

      <Accordion className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Accordion.Item
            key={i}
            actions={
              <Badge
                variant={(() => {
                  if (i === 0) return 'pending';
                  if (i === 1) return 'success';
                  return 'draft';
                })()}
              >
                {(i === 0 && 'Unpaid') ||
                  (i === 1 && 'Paid') ||
                  (i === 2 && 'Draft')}
              </Badge>
            }
            className="rounded-lg p-4 border border-gray-200 font-medium"
            header={
              <p className="text-lg font-bold">Invoice HMS-1281-012023</p>
            }
          >
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-green-600">Outpatient</p>
                <p className="text-sm">
                  Invoiced on 04 Jan. 2023 by Doctor Agnes Ofori
                </p>
              </div>
              <div>
                {Array.from({ length: 2 }, (_, i) => (
                  <div
                    key={i}
                    className={helpers.classNames(
                      'grid grid-cols-2 gap-x-4 gap-y-2 py-1',
                      i !== 0 && 'border-t border-gray-200'
                    )}
                  >
                    {[
                      {
                        label: 'Item',
                        value: 'Acetazolamide 500mg solution for injection',
                      },
                      {
                        label: 'Revenue dept',
                        value: 'Inpatient - Paediatric',
                      },
                      { label: 'Quantity', value: '20' },
                      { label: 'Price', value: 'Ghs 50.00' },
                    ].map((i, key) => (
                      <div key={key}>
                        <p className="text-xs text-gray-600">{i.label}</p>
                        <p className="text-sm">{i.value}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm mb-1 font-bold">Insurance</p>

                <div
                  key={i}
                  className={helpers.classNames(
                    'grid grid-cols-2 gap-x-4 gap-y-2'
                  )}
                >
                  {[
                    {
                      label: 'Item',
                      value: 'Nationwide Medical Insurance',
                    },
                    { label: 'Amount', value: 'Ghs 20.00' },
                  ].map((i, key) => (
                    <div key={key}>
                      <p className="text-xs text-gray-600">{i.label}</p>
                      <p className="text-sm">{i.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-1 font-bold">Invoice summary</p>

                <div
                  key={i}
                  className={helpers.classNames(
                    'grid grid-cols-3 gap-x-4 gap-y-2'
                  )}
                >
                  {[
                    { label: 'Total', value: 'Ghs 50.00' },
                    { label: 'Insurance', value: 'Ghs 20.00' },
                    { label: 'Balance', value: 'Ghs 30.00' },
                  ].map((i, key) => (
                    <div key={key}>
                      <p className="text-xs text-gray-600">{i.label}</p>
                      <p className="text-sm">{i.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {[0, 2].includes(i) && (
                <div className="flex justify-end">
                  {i === 0 && (
                    <Button className="btn-sm btn-primary !h-10">
                      Take payment
                    </Button>
                  )}
                  {i === 2 && (
                    <EditForm>
                      {({ proceed }) => (
                        <Button
                          onClick={() => proceed()}
                          className="btn-sm btn-primary !h-10"
                        >
                          Update Invoice
                        </Button>
                      )}
                    </EditForm>
                  )}
                </div>
              )}
            </div>
          </Accordion.Item>
        ))}
      </Accordion>

      <AddForm>
        {({ proceed }) => (
          <Button
            onClick={() => proceed()}
            className={helpers.classNames(
              'btn-primary !rounded-full',
              'fixed bottom-4 md:right-[3rem] xl:right-[544px]'
            )}
          >
            <PlusIcon />
            <span>Create invoice</span>
          </Button>
        )}
      </AddForm>
    </div>
  );
}

export default Invoice;
