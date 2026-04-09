import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  it("renders headers and rows", () => {
    const data = [
      { region: "East", sales: 100 },
      { region: "West", sales: 200 },
    ];
    render(<DataTable data={data} />);
    expect(screen.getByText("region")).toBeDefined();
    expect(screen.getByText("East")).toBeDefined();
    expect(screen.getByText("200")).toBeDefined();
  });

  it("renders empty state for empty data", () => {
    render(<DataTable data={[]} />);
    expect(screen.getByText("无数据")).toBeDefined();
  });
});
