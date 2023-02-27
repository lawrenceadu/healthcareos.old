import { Template, IconProps } from './Template';

function HeartBook({ variant = 'line', ...props }: IconProps) {
  return (
    <Template {...props}>
      {variant === 'line' && (
        <path
          d="M20 2C20.552 2 21 2.448 21 3V21C21 21.552 20.552 22 20 22H6C5.448 22 5 21.552 5 21V19H3V17H5V15H3V13H5V11H3V9H5V7H3V5H5V3C5 2.448 5.448 2 6 2H20ZM19 4H7V20H19V4ZM14 8V11H17V13H13.999L14 16H12L11.999 13H9V11H12V8H14Z"
          fill="currentColor"
        />
      )}

      {variant === 'solid' && (
        <path
          d="M20 2C20.552 2 21 2.448 21 3V21C21 21.552 20.552 22 20 22H6C5.448 22 5 21.552 5 21V19H3V17H5V15H3V13H5V11H3V9H5V7H3V5H5V3C5 2.448 5.448 2 6 2H20ZM14 8H12V11H9V13H11.999L12 16H14L13.999 13H17V11H14V8Z"
          fill="currentColor"
        />
      )}
    </Template>
  );
}

export default HeartBook;
