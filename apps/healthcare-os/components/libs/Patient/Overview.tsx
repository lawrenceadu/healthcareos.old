import { Accordion, Button, Dropdown, Field } from '@healthcareos/react';
import { ChevronDownIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';

import DischargeForm from './Discharge';
import AdmitForm from './Admit';
import routes from '../../../routes';

function Overview() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * variables
   */
  const invoiceUrl = routes.dashboard.patients.details.index
    .replace('[id]', String(router.query.id))
    .replace('[tab]', 'invoice');

  return (
    <>
      <Accordion>
        <Accordion.Item
          defaultOpen
          className="mb-6"
          header={<h5 className="text-xl font-bold">Admission</h5>}
        >
          <div className="grid gap-4">
            {[
              { label: 'Admission diagnosis', value: 'Diarrhoea' },
              { label: 'Admitted by', value: 'Doctor Fred Osei' },
              { label: 'Admission date', value: '01 -  jan - 2023' },
              {
                label: 'Notes',
                value:
                  'This patient is being detain so we can conduct further investigations. ',
              },
            ].map((item, key) => (
              <div key={key} className="font-medium">
                <small className="block text-muted">{item.label}</small>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </Accordion.Item>

        <Accordion.Item
          defaultOpen
          header={<h5 className="text-xl font-bold">Detention</h5>}
        >
          <div className="grid gap-4">
            {[
              { label: 'Detention diagnosis', value: 'Diarrhoea' },
              { label: 'Detained by', value: 'Doctor Fred Osei' },
              { label: 'Detention date', value: '01 -  jan - 2023' },
              {
                label: 'Notes',
                value:
                  'This patient is being detain so we can conduct further investigations. ',
              },
            ].map((item, key) => (
              <div key={key} className="font-medium">
                <small className="block text-muted">{item.label}</small>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default Overview;
