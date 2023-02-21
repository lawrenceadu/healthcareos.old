import { useRef } from 'react';
import { XMarkIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import * as Restart from '@restart/ui';

import Button from '../Button/Button';

/* eslint-disable-next-line */
export interface ModalProps extends Restart.ModalProps {
  index?: number;
  show: boolean;
  header?: string;
  onHide?: () => void;
  size?: 'sm' | 'lg' | 'xl' | 'full';
}

export function Modal({
  size,
  header,
  onHide,
  children,
  index = 0,
  backdrop,
  ...props
}: ModalProps) {
  /**
   * variables
   */
  const sizeClassName = (() => {
    switch (size) {
      case 'sm':
        return 'max-w-[432px] rounded-lg';
      case 'lg':
        return 'max-w-[820px] rounded-lg';
      case 'xl':
        return 'max-w-[1200px] rounded-lg';
      case 'full':
        return 'max-w-full h-screen overflow-y-auto';
      default:
        return 'max-w-[532px] rounded-lg';
    }
  })();

  const zIndex = 1050 + index * 5;

  /**
   * function
   */
  const handleClick = (e: any) => {
    if (backdrop === 'static') {
      return;
    }

    if (e.target !== e.currentTarget) {
      return;
    }

    onHide?.();
  };

  return (
    <Restart.Modal
      onClick={handleClick}
      aria-labelledby="modal"
      renderBackdrop={(props) => {
        return (
          <div
            {...props}
            style={{ zIndex }}
            className={helpers.classNames(
              'w-full h-full',
              `fixed top-0 left-0`,
              'bg-black opacity-25'
            )}
          />
        );
      }}
      style={{ zIndex: zIndex + 5 }}
      className={helpers.classNames(
        'w-full h-full',
        `fixed left-0 top-0`,
        'overflow-x-hidden overflow-y-auto'
      )}
      {...{ backdrop, onHide, ...props }}
    >
      <div
        className={helpers.classNames(
          sizeClassName,
          'relative',
          'flex items-center',
          'mx-auto w-full my-6',
          'min-h-[calc(100%-3rem)]'
        )}
      >
        <div
          className={helpers.classNames(
            'w-full rounded-lg mx-4',
            'shadow-3xl bg-white pointer-events-auto relative'
          )}
        >
          {header && (
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <h5 className="mb-0 text-xl font-bold">{header}</h5>
              <Button
                className="ml-auto !px-0 !h-6 !w-6 border-0 text-muted active:shadow-none"
                onClick={() => onHide?.()}
              >
                <XMarkIcon />
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    </Restart.Modal>
  );
}

export default Modal;
