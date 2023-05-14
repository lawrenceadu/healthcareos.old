import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { helpers, useWidth } from '@healthcare/utils';

function Chart({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  /**
   * variables
   */
  const width = useWidth();

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
                data={items.map(({ color, label, ...genders }) => ({
                  name: label,
                  ...genders,
                }))}
              >
                {items.map(({ color }, key) => (
                  <Cell key={`cell-${key}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
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
