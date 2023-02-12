import { IconProps, Template } from './Template';

export default function ChevronDown(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
