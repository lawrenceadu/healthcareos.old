import Chart from './Chart';

function Onboarding({
  data,
}: {
  data: { [x: string]: { label: string; value: number; color: string }[] };
}) {
  return (
    <>
      <div className="p-6 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold mb-6">Gender</p>
        <Chart label="Gender" items={data?.gender || []} />
      </div>
      <div className="p-6 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold mb-6">Age range</p>
        <Chart label="Age range" items={data?.age_groups || []} />
      </div>
    </>
  );
}

export default Onboarding;
