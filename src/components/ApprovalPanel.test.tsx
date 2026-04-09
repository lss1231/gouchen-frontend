import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApprovalPanel } from "./ApprovalPanel";

describe("ApprovalPanel", () => {
  it("renders sql and explanation and calls onApprove", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(
      <ApprovalPanel
        sql="SELECT * FROM orders"
        explanation="查询所有订单"
        onApprove={onApprove}
        onReject={onReject}
      />
    );
    expect(screen.getByText("查询所有订单")).toBeDefined();
    fireEvent.click(screen.getByText("通过"));
    expect(onApprove).toHaveBeenCalledWith(undefined);
  });

  it("allows editing sql before approval", () => {
    const onApprove = vi.fn();
    render(
      <ApprovalPanel
        sql="SELECT * FROM orders"
        explanation="查询所有订单"
        onApprove={onApprove}
        onReject={() => {}}
      />
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "SELECT id FROM orders" } });
    fireEvent.click(screen.getByText("编辑后通过"));
    expect(onApprove).toHaveBeenCalledWith("SELECT id FROM orders");
  });
});
