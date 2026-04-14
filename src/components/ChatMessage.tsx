import { useState, useRef, useEffect } from "react";
import { AutoChart } from "./AutoChart";
import { DataTable } from "./DataTable";
import { SqlPanel } from "./SqlPanel";

export interface ChatMessageData {
  role: "user" | "assistant" | "system";
  content?: string;
  sql?: string;
  explanation?: string;
  tableData?: Record<string, unknown>[];
  summary?: string;
}

export function ChatMessage({
  message,
  onCopy,
  onEdit,
}: {
  message: ChatMessageData;
  onCopy?: () => void;
  onEdit?: (text: string) => void;
}) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [isEditing]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-4 py-2 bg-red-900/30 text-red-300 border border-red-800/40 rounded-xl text-sm max-w-[90%]">
          {message.content}
        </div>
      </div>
    );
  }

  if (isUser) {
    if (isEditing) {
      return (
        <div className="flex justify-end my-3">
          <div className="max-w-[85%] w-full sm:w-auto space-y-2">
            <textarea
              ref={textareaRef}
              className="w-full bg-[#2a2a2a] text-gray-100 border border-[#555] rounded-2xl rounded-tr-sm px-5 py-3 text-base leading-relaxed outline-none focus:border-blue-500 min-h-[64px] resize-none"
              value={editText}
              rows={2}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditText(message.content || "");
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const trimmed = editText.trim();
                  if (trimmed) {
                    setIsEditing(false);
                    onEdit?.(trimmed);
                  }
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(message.content || "");
                }}
                className="px-3 py-1.5 text-sm text-gray-300 hover:text-gray-100 bg-[#333] rounded-lg transition"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const trimmed = editText.trim();
                  if (trimmed) {
                    setIsEditing(false);
                    onEdit?.(trimmed);
                  }
                }}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-end my-3 group">
        <div className="max-w-[85%]">
          <div className="bg-[#3a3a3a] text-gray-100 rounded-2xl rounded-tr-sm px-5 py-3 text-base leading-relaxed">
            {message.content}
          </div>
          <div className="hidden group-hover:flex gap-3 mt-1.5 justify-end text-xs text-gray-400">
            <button
              onClick={onCopy}
              className="hover:text-gray-200 transition flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              复制
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="hover:text-gray-200 transition flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              编辑
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start my-3 gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium shrink-0">
        AI
      </div>
      <div className="max-w-[85%] space-y-2">
        {message.summary && (
          <p className="text-base font-medium text-gray-100">{message.summary}</p>
        )}
        {message.content && (
          <div className="text-base text-gray-200 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        {message.tableData && message.tableData.length > 0 && (
          <div className="bg-[#262626] border border-[#333] rounded-xl p-3 shadow-sm">
            <AutoChart data={message.tableData} />
            <DataTable data={message.tableData} />
          </div>
        )}
        {message.sql && <SqlPanel sql={message.sql} />}
        {message.explanation && (
          <p className="text-sm text-gray-400">{message.explanation}</p>
        )}
      </div>
    </div>
  );
}
