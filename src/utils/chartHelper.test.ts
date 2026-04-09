import { inferChartType } from "./chartHelper";

describe("inferChartType", () => {
  it("returns line for date + number columns", () => {
    const rows = [{ date: "2024-01-01", value: 100 }];
    expect(inferChartType(rows)).toBe("line");
  });

  it("returns bar for category + number columns", () => {
    const rows = [{ region: "East", sales: 200 }];
    expect(inferChartType(rows)).toBe("bar");
  });

  it("returns pie for two rows with category + number (percentage-like)", () => {
    const rows = [
      { category: "A", value: 30 },
      { category: "B", value: 70 },
    ];
    expect(inferChartType(rows)).toBe("pie");
  });

  it("returns null for empty rows", () => {
    expect(inferChartType([])).toBeNull();
  });
});
