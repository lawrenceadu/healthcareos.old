import { HtmlHTMLAttributes, useState } from 'react';
import { Accordion, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';

// eslint-disable-next-line
export interface AllergyProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Allergy({ className, ...props }: AllergyProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * variables
   */
  const items = [
    { label: 'Severity of reaction', value: 'Moderate' },
    { label: 'Symptoms', value: 'Swollen lips and face.' },
    { label: 'Notes', value: 'Stay away from any food with nuts in it.' },
    { label: 'Date added', value: '12/01/2023' },
  ];

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Allergy',
      message: (
        <>
          You are about to delete the <b>[insert substance name]</b>. Once you
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
        return;
      }
    });

  return (
    <Accordion.Item
      header={<p className="text-lg font-bold">Peanuts</p>}
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
