function Table({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <tr key={i}>
          {Array.from({ length: count }, (_, i) => (
            <td key={i}>
              <div className="h-[14px] w-[144px] bg-neutral-100 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default Object.assign({}, { Table });
