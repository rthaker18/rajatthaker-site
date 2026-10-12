"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ACCENT, AXIS_TICK, GRID_STROKE, TOOLTIP_PROPS } from "./theme";

const TOP_N = 10;

export default function ReportsByEntity({ data }: { data: { entity: string; count: number }[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const rest = sorted.slice(TOP_N).reduce((sum, d) => sum + d.count, 0);
  const rows = rest > 0 ? [...sorted.slice(0, TOP_N), { entity: "Other", count: rest }] : sorted;

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, rows.length * 30)}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} />
        <YAxis type="category" dataKey="entity" width={96} tick={AXIS_TICK} interval={0} />
        <Tooltip {...TOOLTIP_PROPS} />
        <Bar dataKey="count" name="Reports" fill={ACCENT} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
