import { ButtonHTMLAttributes, forwardRef } from 'react';
import { SpinnerIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import styled from 'styled-components';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
  contentClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, disabled, isSubmitting = false, contentClassName, ...props },
    ref
  ) => {
    /**
     * variables
     */
    disabled = (() => {
      if (isSubmitting) {
        return true;
      }
      return disabled;
    })();

    return (
      <StyledButton ref={ref} {...{ disabled, ...props }}>
        {isSubmitting ? <SpinnerIcon /> : ''}
        <div
          className={helpers.classNames(
            contentClassName,
            'flex items-center justify-center gap-2'
          )}
        >
          {children}
        </div>
      </StyledButton>
    );
  }
);

/**
 * styles
 */
const StyledButton = styled.button`
  outline: 0;
  gap: 0.5rem;
  height: 3rem;
  display: flex;
  padding: 0 1rem;
  font-size: 1rem;
  font-weight: 500;
  user-select: none;
  white-space: nowrap;
  align-items: center;
  border-radius: 0.5rem;
  justify-content: center;

  border-width: 1px;
  border-color: transparent;

  &:disabled {
    pointer-events: none;
  }
  &:active {
    box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
  }
`;

export default Button;
