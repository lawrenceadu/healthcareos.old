import React, { ReactElement, useState } from 'react';

export interface StatusProps {
  children: (props: { proceed: () => void }) => ReactElement;
}

function Status({ children }) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return <>{children({ proceed: () => setShow(false) })}</>;
}

export default Status;
