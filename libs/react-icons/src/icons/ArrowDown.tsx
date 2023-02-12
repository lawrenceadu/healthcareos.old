import { IconProps, Template } from './Template';

export default function ArrowDown(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M12 4V20M12 20L18 14M12 20L6 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
