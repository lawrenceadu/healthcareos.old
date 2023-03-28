import { HtmlHTMLAttributes, useState } from 'react';
import { ChevronDownIcon, MinusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import { v4 } from 'uuid';
import styled from 'styled-components';

import Button from '../../Button/Button';

// eslint-disable-next-line
export interface ItemProps extends HtmlHTMLAttributes<HTMLElement> {
  header: any;
  actions?: any;
  defaultOpen?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

export default function Item({
  header,
  actions,
  children,
  className,
  headerClassName,
  contentClassName,
  defaultOpen = false,
  ...props
}: ItemProps) {
  /**
   * variables
   */
  const id = v4();

  /**
   * state
   */
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={helpers.classNames(className)}>
      <div
        role="button"
        aria-controls={id}
        onClick={() => setOpen(!open)}
        aria-expanded={open ? 'true' : 'false'}
        className={helpers.classNames(
          'flex items-center justify-between w-full py-1',
          'select-none'
        )}
      >
        <StyledHead className={helpers.classNames(headerClassName)}>
          {header}
        </StyledHead>
        <div className="flex gap-4">
          {actions}
          <Button
            role="img"
            aria-label={open ? 'close' : 'open'}
            className="!px-0 !h-auto text-muted"
          >
            {open ? <MinusIcon /> : <ChevronDownIcon />}
          </Button>
        </div>
      </div>
      <motion.div
        id={id}
        aria-labelledby={id}
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: open ? 'auto' : 0,
          opacity: open ? 1 : 0,
          marginTop: open ? 8 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`overflow-hidden`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * styles
 */
const StyledHead = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`;
