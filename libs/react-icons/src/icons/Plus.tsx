import { Template, IconProps } from './Template';

export default function Plus(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
