export function DataTable({ data }: { data: Record<string, unknown>[] }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-400 py-2">无数据</div>;
  }
  const headers = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto border border-[#333] rounded-lg my-2">
      <table className="min-w-full text-sm">
        <thead className="bg-[#1a1a1a]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-gray-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t border-[#333]">
              {headers.map((h) => (
                <td key={h} className="px-3 py-2 text-gray-200">
                  {String(row[h] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
