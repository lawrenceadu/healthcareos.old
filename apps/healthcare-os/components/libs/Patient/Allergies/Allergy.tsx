import { HtmlHTMLAttributes } from 'react';
import { Accordion, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteAllergyService } from '../../../../services/patient';
import { AllergyModel } from '../../../../models';
import { usePatient } from '../../../../hooks';

export interface AllergyProps extends HtmlHTMLAttributes<HTMLDivElement> {
  allergy: AllergyModel;
  mutate: () => void;
}

export function Allergy({
  mutate,
  allergy,
  className,
  ...props
}: AllergyProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Severity of reaction', value: allergy.severity_of_reaction },
    { label: 'Symptoms', value: allergy.symptoms },
    { label: 'Notes', value: allergy.notes },
    {
      label: 'Date added',
      value: dayjs(allergy.created_at).format('DD/MM/YYYY'),
    },
  ];

  /**
   * hook
   */
  const { patient, updateHistory } = usePatient();

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Allergy',
      message: (
        <>
          You are about to delete the <b>{allergy.substance}</b>. Once you
          delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          className: 'btn-error',
          value: 'Delete allergy',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteAllergyService(allergy.id).then(() => {
          toast.success('Allergy deleted successfully');
          updateHistory();
          mutate();
        });
      }
    });

  return (
    <Accordion.Item
      header={<p className="text-lg font-bold">{allergy.substance}</p>}
      actions={
        <Button
          aria-label="Delete"
          className="!px-0 !h-auto text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <DeleteIcon />
        </Button>
      }
      className={helpers.classNames(className)}
    >
      <div className="flex flex-col">
        {items.map((i, key) => (
          <div className="flex gap-4" key={key}>
            <div className="flex-[0_0_144px]">
              <small className="text-muted text-sm">{i.label}:</small>
            </div>
            <small className="text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Allergy;
