import { HtmlHTMLAttributes, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface FadeProps extends HtmlHTMLAttributes<HTMLDivElement> {
  duration?: number;
  show: boolean;
  as?: any;
}

export function Fade({
  as: Component = motion.div,
  duration = 0.3,
  show = false,
  children,
  ...props
}: FadeProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * effect
   */
  useEffect(() => {
    if (show) {
      setToggle(true);
    }

    if (!show) {
      setTimeout(() => setToggle(false), duration * 1000);
    }
  }, [show, duration]);

  return (
    toggle && (
      <Component
        initial={{ height: 0, opacity: 0 }}
        transition={{ duration, ease: 'easeInOut' }}
        animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
        {...props}
      >
        {children}
      </Component>
    )
  );
}

export default Fade;
