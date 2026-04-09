export interface QueryRequest {
  query: string;
  thread_id?: string;
  user_role?: string;
  datasource?: string;
}

export interface ClarificationAnswer {
  field: string;
  answer: string;
}

export interface ClarifyRequest {
  thread_id: string;
  answers: ClarificationAnswer[];
}

export interface ApproveRequest {
  thread_id: string;
  decision: "approve" | "reject" | "feedback";
  edited_sql?: string;
}

export interface QueryResponse {
  status: "completed" | "pending_approval" | "needs_clarification" | "error";
  result?: {
    query?: string;
    generated_sql?: string;
    sql_explanation?: string;
    execution_result?: any;
    formatted_result?: any;
    summary?: string;
    approval_decision?: any;
    clarification_history?: any[];
  };
  error?: string;
  thread_id?: string;
  pending_info?: {
    query: string;
    generated_sql?: string;
    sql_explanation?: string;
    message: string;
  };
  clarification_info?: {
    round: number;
    max_rounds: number;
    questions: { field: string; question: string }[];
    current_intent?: any;
    message: string;
  };
}

export interface StatusResponse {
  thread_id: string;
  status: string;
  current_state?: any;
  next_node?: string;
  error?: string;
}
