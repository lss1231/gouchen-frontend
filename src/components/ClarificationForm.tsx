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
    <div className="bg-[#262626] border border-[#333] rounded-2xl p-5 my-3 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <p className="text-sm font-medium text-gray-100">查询存在歧义，请补充以下信息</p>
      </div>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.field}>
            <label className="block text-sm text-gray-300 mb-1.5">{q.question}</label>
            <input
              type="text"
              className="w-full border border-[#3a3a3a] rounded-lg px-3 py-2 text-sm bg-[#1a1a1a] text-gray-100 focus:outline-none focus:border-blue-500 transition"
              placeholder="请输入..."
              value={answers[q.field]}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.field]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        onClick={() => onSubmit(questions.map((q) => ({ field: q.field, answer: answers[q.field] })))}
      >
        提交
      </button>
    </div>
  );
}
