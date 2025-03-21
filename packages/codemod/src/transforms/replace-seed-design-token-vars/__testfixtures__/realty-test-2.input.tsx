// @ts-nocheck
import { vars } from '@seed-design/design-token';

const Component = () => {
  const data = useMemo(() => {
    const maxN = n > 2 ? 2 : n;
    return [
      {
        name: '',
        value: 1,
        color: vars.$scale.color.gray500,
        fontColor: vars.$scale.color.gray600,
      },
      {
        name: '',
        value: 1 + maxN * 3.5,
        color: vars.$scale.color.gray800,
        fontColor: vars.$scale.color.gray900,
        label: `${n}배`,
      },
    ];
  }, [target]);

  const PropertyText = useMemo(
    () => (animate ? <RollingText text={property} /> : <>{property}</>),
    [target, animate]
  );

  return (
    <ImpressionLog>
      <Stack spacing={12}>
        <Title>
          지금 광고하면 {''}
          {PropertyText}가{' '}
          <span>
            {n}배 {''}
          </span>
          많아져요.
        </Title>
        <Chart data={data} />
      </Stack>
    </ImpressionLog>
  );
};

export default Component;

const Chart = ({ data }: { data: BarChartData[] }) => {
  return (
    <div className="flex justify-center">
      <ResponsiveContainer width="100%" height={105}>
        <BarChart data={data} barSize={48} margin={{ top: 5, bottom: 5 }}>
          <CartesianGrid
            vertical={false}
            stroke={vars.$semantic.color.divider1}
            horizontalValues={[0]}
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={(props) => <CustomTick {...props} data={data} />}
          />

          <Bar
            dataKey="value"
            radius={3}
            fill={vars.$scale.color.carrot500}
            label={(props) => <CustomLabel {...props} data={data} />}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
