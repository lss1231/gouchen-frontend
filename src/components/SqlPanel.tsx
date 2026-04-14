import { useState } from "react";

export function SqlPanel({ sql }: { sql?: string }) {
  const [open, setOpen] = useState(false);
  if (!sql) return null;
  return (
    <div className="my-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
      >
        {open ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        )}
        {open ? "隐藏 SQL" : "查看生成的 SQL"}
      </button>
      {open && (
        <pre className="mt-2 p-4 bg-[#1a1a1a] text-gray-100 rounded-xl text-xs overflow-x-auto border border-[#333]">
          <code>{sql}</code>
        </pre>
      )}
    </div>
  );
}
