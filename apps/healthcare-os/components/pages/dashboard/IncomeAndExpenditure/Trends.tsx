import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'; // prettier-ignore
import { trends } from '@healthcare/utils';
import styled from 'styled-components';

import ToolTipContent from '../../../libs/Tooltip';

function Trends({
  dates,
  data,
}: {
  dates: string[];
  data: { label: string; income: number; expense: number }[];
}) {
  const trendsData = data ? trends.trends(dates, data) : [];

  return (
    <div>
      <StyledTrends className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={1000}
            height={300}
            data={trendsData}
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
              cursor={false}
              content={({ payload, label }) => (
                <ToolTipContent {...{ payload, label }} />
              )}
            />
            <Bar
              dataKey="expense"
              stackId="a"
              fill="#F87171"
              barSize={32}
              radius={8}
            />
            <Bar
              dataKey="income"
              stackId="a"
              fill="#86EFAC"
              barSize={32}
              radius={8}
            />
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
