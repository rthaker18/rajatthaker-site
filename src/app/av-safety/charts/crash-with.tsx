"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS_TICK, GRID_STROKE, TOOLTIP_PROPS } from "./theme";

export default function CrashWith({ data }: { data: { counterparty: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 30)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} />
        <YAxis type="category" dataKey="counterparty" width={128} tick={AXIS_TICK} interval={0} />
        <Tooltip {...TOOLTIP_PROPS} />
        <Bar dataKey="count" name="Reports" fill="#38bdf8" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
