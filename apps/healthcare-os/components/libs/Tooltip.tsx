function Index({ label, payload }) {
  return (
    <div className="bg-white w-[144px] p-4 rounded shadow-md">
      <p className="small fw-bold mb-2">{label}</p>
      <div>
        {payload?.map((i, key) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="block rounded-full"
              style={{
                width: 8,
                height: 8,
                backgroundColor: i.color,
              }}
            />
            <div style={{ fontSize: 12 }}>
              {i.dataKey} - <b>{i.value}</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Index;
