import { EyeIcon, EyeOffIcon } from '@healthcare/icons';
import { useState } from 'react';

import Input, { InputProps } from '../Input/Input';
import Button from '../../Button/Button';

export function Password(props: InputProps) {
  /**
   * state
   */
  const [view, setView] = useState(false);

  return (
    <>
      <Input type={view ? 'text' : 'password'} {...props} />
      <Button type="button" onClick={() => setView(!view)}>
        {view && <EyeIcon />}
        {!view && <EyeOffIcon />}
      </Button>
    </>
  );
}

export default Password;
