"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  revenue: {
    label: "CA ($)",
    color: "#0071e3",
  },
} satisfies ChartConfig

export type MonthlyPoint = { month: string; revenue: number; units: number }

export function SalesChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some((d) => d.revenue > 0)

  if (!hasData) {
    return (
      <div className="flex h-[240px] flex-col items-center justify-center text-center px-6">
        <p className="text-[15px] font-medium text-[#1d1d1f]">Aucune vente enregistrée</p>
        <p className="text-[13px] text-[#86868b] mt-1 max-w-[260px]">
          Marquez un iPhone comme « Vendu » dans vos annonces pour suivre votre chiffre d&apos;affaires ici.
        </p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          stroke="#86868b"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          fontSize={12}
          stroke="#86868b"
          tickFormatter={(v) => `$${v}`}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(0,113,227,0.06)" }}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => (
                <span className="flex flex-col">
                  <span className="font-semibold text-[#1d1d1f]">{value}$ encaissés</span>
                  <span className="text-[#86868b]">{item?.payload?.units ?? 0} iPhone(s) vendu(s)</span>
                </span>
              )}
            />
          }
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  )
}
