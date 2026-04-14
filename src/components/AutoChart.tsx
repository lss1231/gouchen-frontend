import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { inferChartType } from "../utils/chartHelper";
import { DataTable } from "./DataTable";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

export function AutoChart({ data }: { data: Record<string, unknown>[] }) {
  const chartType = inferChartType(data);
  if (!chartType) return <DataTable data={data} />;

  const keys = Object.keys(data[0]);
  const categoryKey =
    keys.find((k) => typeof data[0][k] === "string" && isNaN(Date.parse(String(data[0][k])))) ||
    keys.find((k) => typeof data[0][k] === "string") ||
    keys[0];
  const numberKey = keys.find((k) => typeof data[0][k] === "number") || keys[1];

  return (
    <div className="h-64 my-2">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#4b5563" }} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#4b5563" }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", backgroundColor: "#262626", color: "#e5e7eb" }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
            <Line type="monotone" dataKey={numberKey} stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        ) : chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#4b5563" }} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#4b5563" }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", backgroundColor: "#262626", color: "#e5e7eb" }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
            <Bar dataKey={numberKey} fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.3)", backgroundColor: "#262626", color: "#e5e7eb" }}
              itemStyle={{ color: "#e5e7eb" }}
            />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
            <Pie data={data} dataKey={numberKey} nameKey={categoryKey} cx="50%" cy="50%" outerRadius={80}>
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
