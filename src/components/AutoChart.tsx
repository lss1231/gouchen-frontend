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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={numberKey} stroke="#3b82f6" />
          </LineChart>
        ) : chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={numberKey} fill="#3b82f6" />
          </BarChart>
        ) : (
          <PieChart>
            <Tooltip />
            <Legend />
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
