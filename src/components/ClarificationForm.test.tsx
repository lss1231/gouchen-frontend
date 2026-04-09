import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClarificationForm } from "./ClarificationForm";

describe("ClarificationForm", () => {
  it("renders questions and submits answers", () => {
    const onSubmit = vi.fn();
    const questions = [
      { field: "metric", question: "您想查哪个指标？" },
      { field: "time", question: "时间范围是？" },
    ];
    render(<ClarificationForm questions={questions} onSubmit={onSubmit} />);
    expect(screen.getByText("您想查哪个指标？")).toBeDefined();

    const inputs = screen.getAllByPlaceholderText("请输入...");
    fireEvent.change(inputs[0], { target: { value: "订单量" } });
    fireEvent.change(inputs[1], { target: { value: "最近7天" } });

    fireEvent.click(screen.getByText("提交"));
    expect(onSubmit).toHaveBeenCalledWith([
      { field: "metric", answer: "订单量" },
      { field: "time", answer: "最近7天" },
    ]);
  });
});
