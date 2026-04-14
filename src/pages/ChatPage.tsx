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

const EXAMPLE_PROMPTS = [
  "最近 7 天有多少订单？",
  "各省份销售额对比",
  "本月新增用户数",
  "订单总金额排名前 10 的商品",
];

export function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const raw = localStorage.getItem("gouchen_sessions");
    return raw ? JSON.parse(raw) : [];
  });
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [input, setInput] = useState("");
  const { state, messages, pendingInfo, clarificationInfo, submit, clarify, approve, editAndResubmit, reset, restore } =
    useQuery();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem("gouchen_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  useEffect(() => {
    if (!activeThreadId) {
      reset();
      return;
    }
    const raw = localStorage.getItem(`gouchen_msgs_${activeThreadId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // 兼容旧格式：纯消息数组
          restore(activeThreadId, { messages: parsed });
        } else {
          restore(activeThreadId, parsed);
        }
      } catch {
        reset();
      }
    } else {
      reset();
    }
  }, [activeThreadId]);

  useEffect(() => {
    if (activeThreadId && messages.length > 0) {
      const snapshot = {
        messages,
        state,
        pendingInfo,
        clarificationInfo,
      };
      localStorage.setItem(`gouchen_msgs_${activeThreadId}`, JSON.stringify(snapshot));
    }
  }, [messages, state, pendingInfo, clarificationInfo, activeThreadId]);

  const handleNewChat = () => {
    const newId = uuidv4();
    setActiveThreadId(newId);
  };

  const handleSend = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const tid = activeThreadId || uuidv4();
    if (!activeThreadId) {
      setActiveThreadId(tid);
    }
    setSessions((prev) => {
      if (prev.find((s) => s.threadId === tid)) return prev;
      return [{ threadId: tid, title: value.slice(0, 20) }, ...prev];
    });
    submit(value, tid);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const isBusy = state === "submitting" || state === "clarifying" || state === "pending_approval";

  const handlePin = (tid: string) => {
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.threadId === tid);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return next;
    });
  };

  const handleRename = (tid: string, title: string) => {
    setSessions((prev) => prev.map((s) => (s.threadId === tid ? { ...s, title } : s)));
  };

  const handleDelete = (tid: string) => {
    setSessions((prev) => prev.filter((s) => s.threadId !== tid));
    localStorage.removeItem(`gouchen_msgs_${tid}`);
    if (activeThreadId === tid) {
      setActiveThreadId("");
      reset();
    }
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <Sidebar
        sessions={sessions}
        activeThreadId={activeThreadId}
        onNewChat={handleNewChat}
        onSelect={(tid) => setActiveThreadId(tid)}
        onPin={handlePin}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-semibold text-gray-100 mb-3">钩沉 NL2SQL</h1>
                <p className="text-gray-400">自然语言数据查询助手，让数据触手可及</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full px-4">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] border border-[#3a3a3a] rounded-xl text-sm text-gray-200 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((m, idx) => (
                <ChatMessage
                  key={idx}
                  message={m}
                  onCopy={() => navigator.clipboard.writeText(m.content || "")}
                  onEdit={(text) => editAndResubmit(idx, text)}
                />
              ))}
              {state === "clarifying" && clarificationInfo && (
                <ClarificationForm
                  questions={clarificationInfo.questions.map((q) => ({
                    field: q.field,
                    question: q.question || q.field,
                  }))}
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
              {state === "submitting" && (
                <div className="flex justify-start my-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-sm text-gray-400">思考中…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="px-4 pb-6 pt-2">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-start gap-3 bg-[#2a2a2a] border border-[#444] rounded-2xl px-5 py-4 shadow-lg min-h-[112px]">
              <textarea
                ref={inputRef}
                className="flex-1 bg-transparent resize-none outline-none text-gray-100 placeholder:text-gray-500 text-base max-h-40 min-h-[80px] pt-0.5"
                rows={2}
                placeholder="问问数据…"
                value={input}
                disabled={isBusy}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isBusy || !input.trim()}
                className="mt-auto flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-600 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              内容由 AI 生成，请谨慎核查 SQL 与数据结果
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
