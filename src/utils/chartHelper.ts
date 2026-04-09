export type ChartType = "line" | "bar" | "pie";

function isDateLike(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return !isNaN(Date.parse(value));
}

function isNumberLike(value: unknown): boolean {
  return typeof value === "number";
}

export function inferChartType(rows: Record<string, unknown>[]): ChartType | null {
  if (!rows || rows.length === 0) return null;
  const sample = rows[0];
  const keys = Object.keys(sample);
  if (keys.length < 2) return null;

  const types = keys.map((k) => {
    const v = sample[k];
    if (isDateLike(v)) return "date";
    if (isNumberLike(v)) return "number";
    return "category";
  });

  const hasDate = types.includes("date");
  const hasNumber = types.includes("number");
  const categoryCount = types.filter((t) => t === "category").length;

  if (hasDate && hasNumber) return "line";
  if (categoryCount >= 1 && hasNumber) {
    if (rows.length === 2 && categoryCount === 1) return "pie";
    return "bar";
  }
  if (hasNumber && keys.length > 2) return "bar";
  return null;
}
