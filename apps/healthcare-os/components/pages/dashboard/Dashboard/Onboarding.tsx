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
        <Chart items={data?.gender || []} />
      </div>
      <div className="p-6 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold mb-6">Age range</p>
        <Chart items={data?.age_groups || []} />
      </div>
    </>
  );
}

export default Onboarding;
