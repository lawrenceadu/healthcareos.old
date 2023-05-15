import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { helpers, useWidth } from '@healthcare/utils';

import TooltipContent from '../../../libs/Tooltip';

function Chart({
  label,
  items,
}: {
  label?: string;
  items: { label: string; value: number; color: string }[];
}) {
  /**
   * variables
   */
  const width = useWidth();
  const total = items.reduce((a, b) => a + b.value, 0);

  return (
    <div className="flex gap-6 items-center">
      {width && (
        <div
          className={helpers.classNames(
            'w-[160px] lg:w-[228px]',
            'h-[160px] lg:h-[228px]'
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                paddingAngle={0}
                innerRadius={width >= 1024 ? 80 : 50}
                outerRadius={width >= 1024 ? 114 : 80}
                data={
                  total
                    ? items.map(({ label, value }) => ({
                        name: label,
                        value,
                      }))
                    : [{ name: '', value: 1 }]
                }
              >
                {!!total &&
                  items.map(({ color }, key) => (
                    <Cell
                      style={{ outline: 'none' }}
                      key={`cell-${key}`}
                      fill={color}
                    />
                  ))}
                {!total && (
                  <Cell
                    style={{ outline: 'none' }}
                    key="cell-default"
                    fill="#c3c3c3"
                  />
                )}
              </Pie>
              <Tooltip
                cursor={false}
                content={({ payload, label: localLabel }) => (
                  <TooltipContent
                    {...{ label: localLabel || label, payload }}
                  />
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="max-h-[160px] lg:max-h-[228px] overflow-auto">
        {[
          {
            label: 'Total',
            value: items.reduce((a, b) => a + b.value, 0),
            color: '',
          },
          ...items,
        ].map((item, key) => (
          <div key={key} className="flex items-center gap-1">
            {item.color && (
              <span>
                <span
                  className="w-2 h-2 block rounded-[1px]"
                  style={{ backgroundColor: item.color }}
                />
              </span>
            )}
            <p className="text-muted">{item.label}:</p>
            <p className="font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chart;
