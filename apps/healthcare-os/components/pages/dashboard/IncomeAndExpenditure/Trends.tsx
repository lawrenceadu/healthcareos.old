import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'; // prettier-ignore
import styled from 'styled-components';

import ToolTipContent from '../../../libs/Tooltip';

const data = [
  {
    name: 'Page A',
    expense: 4000,
    income: 2400,
  },
  {
    name: 'Page B',
    expense: 3000,
    income: 1398,
  },
  {
    name: 'Page C',
    expense: 2000,
    income: 9800,
  },
  {
    name: 'Page D',
    expense: 2780,
    income: 3908,
  },
  {
    name: 'Page E',
    expense: 1890,
    income: 4800,
  },
  {
    name: 'Page F',
    expense: 2390,
    income: 3800,
  },
  {
    name: 'Page G',
    expense: 3490,
    income: 4300,
  },
];

function Trends() {
  return (
    <div>
      <StyledTrends className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={1000}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{
                style: { fontSize: 12, fontWeight: 500 },
              }}
            />
            <YAxis
              axisLine={false}
              tick={{
                style: { fontSize: 12, fontWeight: 500 },
              }}
            />
            <Tooltip
              content={({ payload, label }) => (
                <ToolTipContent {...{ payload, label }} />
              )}
            />
            <Bar dataKey="expense" stackId="a" fill="#F87171" barSize={32} />
            <Bar dataKey="income" stackId="a" fill="#86EFAC" barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </StyledTrends>
    </div>
  );
}

const StyledTrends = styled.div`
  overflow: hidden;

  .recharts-cartesian-axis-tick-line {
    display: none;
  }
`;

export default Trends;
