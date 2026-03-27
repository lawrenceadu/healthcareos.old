/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

// Compatibility shim: @types/react@18.3 removed these props but some
// third-party type declarations (formik, framer-motion) still reference them.
import 'react';
declare module 'react' {
  interface DOMAttributes<T> {
    onPointerEnterCapture?: PointerEventHandler<T> | undefined;
    onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
    placeholder?: string | undefined;
  }
}
