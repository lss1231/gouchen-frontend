interface SidebarProps {
  sessions: { threadId: string; title: string }[];
  activeThreadId?: string;
  onNewChat: () => void;
  onSelect: (threadId: string) => void;
}

export function Sidebar({ sessions, activeThreadId, onNewChat, onSelect }: SidebarProps) {
  return (
    <div className="w-64 h-full border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="font-semibold text-gray-800">钩沉 NL2SQL</h1>
      </div>
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          + 新对话
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {sessions.map((s) => (
          <button
            key={s.threadId}
            onClick={() => onSelect(s.threadId)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm truncate ${
              s.threadId === activeThreadId
                ? "bg-blue-100 text-blue-900"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="p-3 border-t text-xs text-gray-500">
        {/* 预留管理入口 */}
        <span>v0.1.0</span>
      </div>
    </div>
  );
}
