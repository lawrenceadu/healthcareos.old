import { Template, IconProps } from './Template';

export function Menu(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M3 12H21M3 6H21M3 18H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}

export default Menu;
