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
    <div className="bg-orange-50 border border-orange-200 rounded-md p-4 my-2">
      <p className="text-sm font-medium text-orange-800 mb-2">SQL 已生成，请审核：</p>
      {explanation && <p className="text-sm text-gray-700 mb-2">{explanation}</p>}
      <textarea
        className="w-full h-24 border rounded-md p-2 text-xs font-mono bg-white"
        value={editedSql}
        onChange={(e) => setEditedSql(e.target.value)}
      />
      <div className="flex gap-2 mt-3">
        <button
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          onClick={() => onApprove(editedSql !== sql ? editedSql : undefined)}
        >
          通过
        </button>
        <button
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          onClick={() => onApprove(editedSql)}
        >
          编辑后通过
        </button>
        <button
          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          onClick={onReject}
        >
          拒绝
        </button>
      </div>
    </div>
  );
}
