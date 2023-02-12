import { IconProps, Template } from './Template';

export default function ChevronRight(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M9 18L15 12L9 6"
        stroke="#121212"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
