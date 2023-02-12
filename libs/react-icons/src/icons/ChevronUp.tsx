import { IconProps, Template } from './Template';

export default function ChevronUp(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M18 15L12 9L6 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
