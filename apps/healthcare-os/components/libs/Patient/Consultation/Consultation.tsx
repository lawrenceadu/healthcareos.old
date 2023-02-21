import { HtmlHTMLAttributes, useState } from 'react';
import { Accordion } from '@healthcareos/react';

// eslint-disable-next-line
export interface ConsultationProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Consultation({ className, ...props }: ConsultationProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  return (
    <Accordion.Item
      className={className}
      header={<p className="text-lg font-bold">Malaria (confirmed)</p>}
    >
      <div className="flex flex-col"></div>
    </Accordion.Item>
  );
}

export default Consultation;
