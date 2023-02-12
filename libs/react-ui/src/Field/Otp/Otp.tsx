import OtpInput from 'react-otp-input';
import styled from 'styled-components';

import { InputProps } from '../Input/Input';

export function Otp(props: InputProps) {
  return (
    <StyledOtpInput
      numInputs={6}
      shouldAutoFocus
      containerStyle="gap-4 flex-nowrap justify-between w-full"
      {...props}
    />
  );
}

/**
 * styles
 */
const StyledOtpInput = styled(OtpInput)`
  input {
    padding: 0;
    height: 3rem;
    font-size: 1rem;
    width: 3rem !important;
    border-radius: 0.25rem;
    border: solid 1px var(--color-gray-200);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0px 0px 0px 4px rgba(var(--color-primary-rgb), 0.2);
    }
  }
`;

export default Otp;
