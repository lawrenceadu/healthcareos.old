import { HtmlHTMLAttributes } from 'react';
import { helpers } from '@healthcare/utils';

// eslint-disable-next-line
export interface FloatProps extends HtmlHTMLAttributes<HTMLDivElement> {}

function Float({ children, className }: FloatProps) {
  return (
    <div
      className={helpers.classNames(
        'fixed bottom-4 right-4 md:right-[3rem] xl:right-[544px]',
        className
      )}
    >
      {children}
    </div>
  );
}

export default Float;
