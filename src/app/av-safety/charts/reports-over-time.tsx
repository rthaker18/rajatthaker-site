"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ACCENT, AXIS_TICK, GRID_STROKE, TOOLTIP_PROPS } from "./theme";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth(iso: string): string {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} '${y.slice(2)}`;
}

export default function ReportsOverTime({ data }: { data: { month: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickFormatter={formatMonth} tick={AXIS_TICK} minTickGap={24} />
        <YAxis allowDecimals={false} tick={AXIS_TICK} />
        <Tooltip {...TOOLTIP_PROPS} cursor={{ stroke: GRID_STROKE }} labelFormatter={(m) => formatMonth(String(m))} />
        <Area type="monotone" dataKey="count" name="Reports" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
