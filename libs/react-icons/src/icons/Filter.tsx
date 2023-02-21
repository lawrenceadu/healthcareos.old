import { Template, IconProps } from './Template';

export function Filter(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M6 12H18M3 6H21M9 18H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}

export default Filter;
