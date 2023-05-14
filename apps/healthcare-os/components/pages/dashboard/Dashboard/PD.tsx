import Chart from './Chart';

function PD({
  data,
}: {
  data: { [x: string]: { label: string; value: number; color: string }[] };
}) {
  return (
    <>
      <div className="p-6 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold mb-6">Inpatient</p>
        <Chart items={data?.inpatient || []} />
      </div>
      <div className="p-6 rounded-lg border border-neutral-200">
        <p className="text-sm font-bold mb-6">Outpatient</p>
        <Chart items={data?.outpatient || []} />
      </div>
    </>
  );
}

export default PD;
