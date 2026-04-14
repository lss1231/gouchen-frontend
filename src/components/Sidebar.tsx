import { useEffect, useRef, useState } from "react";

interface Session {
  threadId: string;
  title: string;
}

interface SidebarProps {
  sessions: Session[];
  activeThreadId?: string;
  onNewChat: () => void;
  onSelect: (threadId: string) => void;
  onPin?: (threadId: string) => void;
  onRename?: (threadId: string, title: string) => void;
  onDelete?: (threadId: string) => void;
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  );
}

export function Sidebar({
  sessions,
  activeThreadId,
  onNewChat,
  onSelect,
  onPin,
  onRename,
  onDelete,
}: SidebarProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [menuOpenId]);

  const startRename = (s: Session) => {
    setMenuOpenId(null);
    setEditingId(s.threadId);
    setEditValue(s.title || "新对话");
  };

  const confirmRename = () => {
    if (editingId && onRename) {
      onRename(editingId, editValue.trim() || "新对话");
    }
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="w-64 h-full bg-[#262626] border-r border-[#333] flex flex-col shrink-0">
      <div className="p-4 border-b border-[#333] flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          钩
        </div>
        <h1 className="font-semibold text-gray-100">钩沉 NL2SQL</h1>
      </div>
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2.5 bg-[#333] border border-[#444] text-gray-100 text-sm rounded-xl hover:bg-[#3a3a3a] hover:border-[#555] transition flex items-center justify-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          新对话
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {sessions.length === 0 && (
          <div className="text-xs text-gray-500 px-3 py-2">暂无历史对话</div>
        )}
        {sessions.map((s) => (
          <div
            key={s.threadId}
            onClick={() => onSelect(s.threadId)}
            className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition cursor-pointer ${
              s.threadId === activeThreadId
                ? "bg-[#333] text-gray-100 border border-[#444]"
                : "hover:bg-[#333]/60 text-gray-300"
            }`}
          >
            {editingId === s.threadId ? (
              <input
                autoFocus
                className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg px-2 py-1 text-gray-100 outline-none focus:border-blue-500"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename();
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditValue("");
                  }
                }}
                onBlur={confirmRename}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span className="truncate pr-2 flex-1">{s.title || "新对话"}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === s.threadId ? null : s.threadId);
                  }}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md hover:bg-[#444] text-gray-400 hover:text-gray-200 transition"
                >
                  <MoreIcon />
                </button>
              </>
            )}

            {menuOpenId === s.threadId && editingId !== s.threadId && (
              <div
                ref={menuRef}
                className="absolute right-2 top-9 z-50 w-28 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(null);
                    onPin?.(s.threadId);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-[#2a2a2a] transition"
                >
                  置顶
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startRename(s);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-[#2a2a2a] transition"
                >
                  重命名
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(null);
                    onDelete?.(s.threadId);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] transition"
                >
                  删除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-[#333] text-xs text-gray-500 flex items-center justify-between">
        <span>v0.1.0</span>
        <span>本地模式</span>
      </div>
    </div>
  );
}
