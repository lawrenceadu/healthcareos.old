import { IconProps, Template } from './Template';

export default function ArrowRight(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M4 12H20M20 12L14 6M20 12L14 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
