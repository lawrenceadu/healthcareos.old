import { InputHTMLAttributes } from 'react';
import { helpers } from '@healthcare/utils';
import { Field } from 'formik';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  withFormik?: boolean;
}

export function Radio({
  children,
  withFormik = true,
  className,
  ...props
}: RadioProps) {
  /**
   * variables
   */
  const Input = withFormik ? Field : 'input';

  return (
    <label
      className={helpers.classNames(
        className,
        'inline-flex gap-2 items-center relative cursor-pointer'
      )}
    >
      <Input {...props} type="radio" className="sr-only peer" />
      <div className="w-6 h-6 flex rounded-full border transition border-neutral-200 peer-checked:border-primary relative after:content-[''] after:w-3.5 after:h-3.5 after:rounded-full peer-checked:after:bg-primary after:m-auto after:transition" />
      <div className="text-normal text-neutral-700 select-none">{children}</div>
    </label>
  );
}

export default Radio;
