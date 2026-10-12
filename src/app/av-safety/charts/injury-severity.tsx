"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { TOOLTIP_PROPS } from "./theme";

const COLORS: Record<string, string> = {
  Fatality: "#ef4444",
  Serious: "#f97316",
  Moderate: "#facc15",
  Minor: "#a3e635",
  "No injury": "#38bdf8",
  Unknown: "#a1a1aa",
};

export default function InjurySeverity({ data }: { data: { severity: string; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="severity" innerRadius="55%" outerRadius="95%" stroke="#18181b">
              {data.map((d) => (
                <Cell key={d.severity} fill={COLORS[d.severity] ?? COLORS.Unknown} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_PROPS} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full max-w-md space-y-1 text-sm">
        {data.map((d) => (
          <li key={d.severity} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS[d.severity] ?? COLORS.Unknown }}
            />
            <span className="flex-1 text-zinc-300">{d.severity}</span>
            <span className="tabular-nums text-zinc-100">{d.count}</span>
            <span className="w-12 text-right tabular-nums text-zinc-500">
              {total ? ((d.count / total) * 100).toFixed(1) : "0.0"}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
