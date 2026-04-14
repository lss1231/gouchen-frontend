import { useState } from "react";

interface ApprovalPanelProps {
  sql: string;
  explanation?: string;
  onApprove: (editedSql?: string) => void;
  onReject: () => void;
}

export function ApprovalPanel({ sql, explanation, onApprove, onReject }: ApprovalPanelProps) {
  const [editedSql, setEditedSql] = useState(sql);

  return (
    <div className="bg-[#262626] border border-[#333] rounded-2xl p-5 my-3 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        <p className="text-sm font-medium text-gray-100">SQL 已生成，请审核后执行</p>
      </div>
      {explanation && <p className="text-sm text-gray-400 mb-3">{explanation}</p>}
      <textarea
        className="w-full h-32 border border-[#3a3a3a] rounded-xl p-3 text-sm font-mono bg-[#1a1a1a] text-gray-200 focus:outline-none focus:border-blue-500 transition"
        value={editedSql}
        onChange={(e) => setEditedSql(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
          onClick={() => onApprove(editedSql !== sql ? editedSql : undefined)}
        >
          通过
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          onClick={() => onApprove(editedSql)}
        >
          编辑后通过
        </button>
        <button
          className="px-4 py-2 bg-[#333] text-gray-200 border border-[#444] text-sm rounded-lg hover:bg-[#3a3a3a] transition"
          onClick={onReject}
        >
          拒绝
        </button>
      </div>
    </div>
  );
}
