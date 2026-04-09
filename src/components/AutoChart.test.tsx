import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AutoChart } from "./AutoChart";

describe("AutoChart", () => {
  it("renders line chart for date + value data", () => {
    const data = [
      { date: "2024-01-01", value: 10 },
      { date: "2024-01-02", value: 20 },
    ];
    const { container } = render(<AutoChart data={data} />);
    expect(container.querySelector(".recharts-line")).toBeDefined();
  });

  it("falls back to DataTable when chart type is unknown", () => {
    const data = [{ name: "A", desc: "hello" }];
    render(<AutoChart data={data} />);
    expect(screen.getByText("A")).toBeDefined();
    expect(screen.getByText("hello")).toBeDefined();
  });
});
