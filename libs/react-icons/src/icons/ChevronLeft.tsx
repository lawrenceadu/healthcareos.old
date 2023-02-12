import { IconProps, Template } from './Template';

export default function ChevronLeft(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
