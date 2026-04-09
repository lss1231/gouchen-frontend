import type { QueryRequest, QueryResponse, ClarifyRequest, ApproveRequest, StatusResponse } from "../types/api";

const API_BASE = "http://localhost:8000/api/v1";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const queryApi = {
  createQuery: (req: QueryRequest) => post<QueryResponse>("/query", req),
  clarify: (req: ClarifyRequest) => post<QueryResponse>("/clarify", req),
  approve: (req: ApproveRequest) => post<QueryResponse>("/approve", req),
  getStatus: (threadId: string) => get<StatusResponse>(`/status/${threadId}`),
};
