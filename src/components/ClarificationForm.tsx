import { useState } from "react";

interface Question {
  field: string;
  question: string;
}

interface ClarificationFormProps {
  questions: Question[];
  onSubmit: (answers: { field: string; answer: string }[]) => void;
}

export function ClarificationForm({ questions, onSubmit }: ClarificationFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(questions.map((q) => [q.field, ""]))
  );

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 my-2">
      <p className="text-sm font-medium text-yellow-800 mb-2">查询存在歧义，请补充以下信息：</p>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.field}>
            <label className="block text-sm text-gray-700 mb-1">{q.question}</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="请输入..."
              value={answers[q.field]}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.field]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        onClick={() => onSubmit(questions.map((q) => ({ field: q.field, answer: answers[q.field] })))}
      >
        提交
      </button>
    </div>
  );
}
