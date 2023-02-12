import { IconProps, Template } from './Template';

export default function ArrowLeft(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M20 12H4M4 12L10 18M4 12L10 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
