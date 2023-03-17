import { helpers } from '@healthcare/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export interface ChartProps {
  color?: string;
  title: string;
  data: { label: string; value: number }[];
}

function Chart({ color, title, data }: ChartProps) {
  /**
   * variables
   */
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },

    scales: {
      y: {
        border: {
          display: false,
        },
        ticks: {
          stepSize: 10,
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          color: '#E5E7EB',
        },
      },
    },
  };

  const _data: ChartData<'line'> = {
    labels: data.map(({ label }) => label),
    datasets: [
      {
        fill: true,
        label: title,
        data: data.map(({ value }) => value),
        borderWidth: 4,
        borderColor: color || 'red',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={helpers.classNames('p-6', 'border border-gray-200')}>
      <p className="text-lg font-bold mb-4">{title}</p>
      <div className="relative">
        <Line options={options} data={_data} />
      </div>
    </div>
  );
}

export default Chart;
