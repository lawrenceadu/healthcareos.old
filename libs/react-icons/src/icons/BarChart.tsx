import { IconProps, Template } from './Template';

function BarChart(props: IconProps) {
  return (
    <Template {...props}>
      <path
        d="M18 20V10M12 20V4M6 20V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Template>
  );
}

export default BarChart;
