import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Sidebar } from "../components/Sidebar";
import { ChatMessage } from "../components/ChatMessage";
import { ClarificationForm } from "../components/ClarificationForm";
import { ApprovalPanel } from "../components/ApprovalPanel";
import { useQuery } from "../hooks/useQuery";

interface Session {
  threadId: string;
  title: string;
}

export function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const raw = localStorage.getItem("gouchen_sessions");
    return raw ? JSON.parse(raw) : [];
  });
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [input, setInput] = useState("");
  const { state, messages, pendingInfo, clarificationInfo, submit, clarify, approve, reset } = useQuery();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("gouchen_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  const handleNewChat = () => {
    const newId = uuidv4();
    setActiveThreadId(newId);
    reset();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const tid = activeThreadId || uuidv4();
    if (!activeThreadId) {
      setActiveThreadId(tid);
    }
    // Add session entry on first message
    setSessions((prev) => {
      if (prev.find((s) => s.threadId === tid)) return prev;
      return [{ threadId: tid, title: input.slice(0, 20) }, ...prev];
    });
    submit(input.trim(), tid);
    setInput("");
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        sessions={sessions}
        activeThreadId={activeThreadId}
        onNewChat={handleNewChat}
        onSelect={(tid) => {
          setActiveThreadId(tid);
          reset();
        }}
      />
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.map((m, idx) => (
            <ChatMessage key={idx} message={m} />
          ))}
          {state === "clarifying" && clarificationInfo && (
            <ClarificationForm
              questions={clarificationInfo.questions.map((q) => ({ field: q.field, question: q.question || q.field }))}
              onSubmit={(answers) => clarify(answers)}
            />
          )}
          {state === "pending_approval" && pendingInfo && (
            <ApprovalPanel
              sql={pendingInfo.generated_sql || ""}
              explanation={pendingInfo.sql_explanation}
              onApprove={(edited) => approve("approve", edited)}
              onReject={() => approve("reject")}
            />
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t px-6 py-4 flex gap-2">
          <input
            className="flex-1 border rounded-md px-4 py-2 text-sm"
            placeholder="输入你的数据问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={state === "submitting" || state === "clarifying" || state === "pending_approval"}
          />
          <button
            onClick={handleSend}
            disabled={state === "submitting" || state === "clarifying" || state === "pending_approval"}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
