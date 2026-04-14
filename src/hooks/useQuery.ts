import { useState, useCallback } from "react";
import { queryApi } from "../api/query";
import type { QueryResponse } from "../types/api";
import type { ChatMessageData } from "../components/ChatMessage";

export type QueryState = "idle" | "submitting" | "clarifying" | "pending_approval" | "completed" | "error";

export function useQuery() {
  const [state, setState] = useState<QueryState>("idle");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const [pendingInfo, setPendingInfo] = useState<QueryResponse["pending_info"] | null>(null);
  const [clarificationInfo, setClarificationInfo] = useState<QueryResponse["clarification_info"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const appendUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
  };

  const appendSystemMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "system", content: text }]);
  };

  const handleResponse = useCallback((res: QueryResponse) => {
    if (res.status === "completed") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.result?.summary || "查询完成",
          sql: res.result?.generated_sql,
          explanation: res.result?.sql_explanation,
          tableData: Array.isArray(res.result?.execution_result) ? res.result?.execution_result : undefined,
        },
      ]);
      setState("completed");
    } else if (res.status === "needs_clarification") {
      setClarificationInfo(res.clarification_info || null);
      setState("clarifying");
    } else if (res.status === "pending_approval") {
      setPendingInfo(res.pending_info || null);
      setState("pending_approval");
    } else if (res.status === "error") {
      appendSystemMessage(res.error || "未知错误");
      setState("error");
    }
  }, []);

  const submit = useCallback(async (text: string, tid: string) => {
    setThreadId(tid);
    setError(null);
    setPendingInfo(null);
    setClarificationInfo(null);
    appendUserMessage(text);
    setState("submitting");
    try {
      const res = await queryApi.createQuery({ query: text, thread_id: tid, user_role: "analyst" });
      handleResponse(res);
    } catch (e) {
      appendSystemMessage(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  }, [handleResponse]);

  const clarify = useCallback(
    async (answers: { field: string; answer: string }[]) => {
      setState("submitting");
      try {
        const res = await queryApi.clarify({ thread_id: threadId, answers });
        handleResponse(res);
      } catch (e) {
        appendSystemMessage(e instanceof Error ? e.message : String(e));
        setState("error");
      }
    },
    [threadId, handleResponse]
  );

  const approve = useCallback(
    async (decision: "approve" | "reject", editedSql?: string) => {
      setState("submitting");
      try {
        const res = await queryApi.approve({ thread_id: threadId, decision, edited_sql: editedSql });
        handleResponse(res);
      } catch (e) {
        appendSystemMessage(e instanceof Error ? e.message : String(e));
        setState("error");
      }
    },
    [threadId, handleResponse]
  );

  const editAndResubmit = useCallback(
    async (index: number, newText: string) => {
      if (!threadId) return;
      setMessages((prev) => {
        const next = prev.slice(0, index);
        next.push({ role: "user", content: newText });
        return next;
      });
      setPendingInfo(null);
      setClarificationInfo(null);
      setError(null);
      setState("submitting");
      try {
        const res = await queryApi.createQuery({ query: newText, thread_id: threadId, user_role: "analyst" });
        handleResponse(res);
      } catch (e) {
        appendSystemMessage(e instanceof Error ? e.message : String(e));
        setState("error");
      }
    },
    [threadId, handleResponse]
  );

  const reset = useCallback(() => {
    setState("idle");
    setMessages([]);
    setThreadId("");
    setPendingInfo(null);
    setClarificationInfo(null);
    setError(null);
  }, []);

  const restore = useCallback((
    tid: string,
    snapshot: {
      messages: ChatMessageData[];
      state?: QueryState;
      pendingInfo?: QueryResponse["pending_info"] | null;
      clarificationInfo?: QueryResponse["clarification_info"] | null;
    }
  ) => {
    setThreadId(tid);
    setMessages(snapshot.messages);
    setState(snapshot.state ?? "idle");
    setPendingInfo(snapshot.pendingInfo ?? null);
    setClarificationInfo(snapshot.clarificationInfo ?? null);
    setError(null);
  }, []);

  return {
    state,
    messages,
    threadId,
    pendingInfo,
    clarificationInfo,
    error,
    submit,
    clarify,
    approve,
    editAndResubmit,
    reset,
    restore,
  };
}
