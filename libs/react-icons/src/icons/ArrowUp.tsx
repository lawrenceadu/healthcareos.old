import { IconProps, Template } from './Template';

export default function ArrowUp(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M12 20V4M12 4L6 10M12 4L18 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}
