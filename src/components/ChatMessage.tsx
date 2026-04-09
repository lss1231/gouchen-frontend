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

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`max-w-[90%] rounded-lg px-4 py-2 text-sm ${
          isUser
            ? "bg-gray-200 text-gray-900"
            : message.role === "system"
            ? "bg-red-50 text-red-800 border border-red-200"
            : "bg-blue-50 text-gray-900 border border-blue-100"
        }`}
      >
        {message.summary && <p className="font-medium mb-1">{message.summary}</p>}
        {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
        {message.tableData && message.tableData.length > 0 && (
          <>
            <AutoChart data={message.tableData} />
            <DataTable data={message.tableData} />
          </>
        )}
        {message.sql && <SqlPanel sql={message.sql} />}
        {message.explanation && (
          <p className="text-xs text-gray-500 mt-1">{message.explanation}</p>
        )}
      </div>
    </div>
  );
}
