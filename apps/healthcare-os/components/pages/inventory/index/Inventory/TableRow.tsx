import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Dropdown, Field } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import { v4 } from 'uuid';

import ChangeForm from './Change';
import MoveForm from './Move';

function TableRow() {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  /**
   * variables
   */
  const uuid = v4();

  return (
    <>
      <tr
        className={helpers.classNames('cursor-pointer', toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td className="flex gap-2 items-center">
          <span>{toggle ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
          <span>Folic acid 5mg tablet</span>
        </td>
        <td>1,800</td>
        <td>12/2024</td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <ChangeForm>
                {({ proceed }) => (
                  <Dropdown.Item onClick={() => proceed()}>
                    Change
                  </Dropdown.Item>
                )}
              </ChangeForm>

              <MoveForm>
                {({ proceed }) => (
                  <Dropdown.Item onClick={() => proceed()}>Move</Dropdown.Item>
                )}
              </MoveForm>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      {toggle && (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <tr key={i}>
              <td className="flex gap-2 items-center">
                <Field.Checkbox
                  value={i + 1}
                  withFormik={false}
                  checked={!!selectedItems.includes(`${i + 1}`)}
                  onChange={({ currentTarget: { checked, value } }) => {
                    setSelectedItems(
                      !checked
                        ? selectedItems.filter((k) => k !== value)
                        : [...selectedItems, value]
                    );
                  }}
                >
                  Pharmacy
                </Field.Checkbox>
              </td>
              <td>600</td>
              <td>12/2024</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle className="mx-auto">
                    <DotsHorizIcon />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ChangeForm location="consulting">
                      {({ proceed }) => (
                        <Dropdown.Item onClick={() => proceed()}>
                          Change
                        </Dropdown.Item>
                      )}
                    </ChangeForm>

                    <MoveForm location="consulting">
                      {({ proceed }) => (
                        <Dropdown.Item onClick={() => proceed()}>
                          Move
                        </Dropdown.Item>
                      )}
                    </MoveForm>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
}

export default TableRow;
