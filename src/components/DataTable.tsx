export function DataTable({ data }: { data: Record<string, unknown>[] }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500 py-2">无数据</div>;
  }
  const headers = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto border rounded-md my-2">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              {headers.map((h) => (
                <td key={h} className="px-3 py-2 text-gray-800">
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
