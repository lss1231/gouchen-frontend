import { useState } from "react";

export function SqlPanel({ sql }: { sql?: string }) {
  const [open, setOpen] = useState(false);
  if (!sql) return null;
  return (
    <div className="my-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {open ? "▲ 隐藏 SQL" : "▼ 查看生成的 SQL"}
      </button>
      {open && (
        <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-md text-xs overflow-x-auto">
          <code>{sql}</code>
        </pre>
      )}
    </div>
  );
}
