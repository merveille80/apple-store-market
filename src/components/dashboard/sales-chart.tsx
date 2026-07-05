"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/* ---------------------------------------------------------------- */
/* Graphique en aire — Chiffre d'affaires                            */
/* ---------------------------------------------------------------- */

const areaConfig = {
  revenue: { label: "CA", color: "#0071e3" },
} satisfies ChartConfig

export type RevenuePoint = { label: string; revenue: number; units: number }

export function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  const hasData = data.some((d) => d.revenue > 0)

  if (!hasData) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center text-center px-6">
        <p className="text-[15px] font-medium text-[#1d1d1f]">Aucune vente sur la période</p>
        <p className="text-[13px] text-[#86868b] mt-1 max-w-[280px]">
          Marquez un iPhone comme « Vendu » dans vos annonces pour suivre votre chiffre d&apos;affaires ici.
        </p>
      </div>
    )
  }

  return (
    <ChartContainer config={areaConfig} className="h-[260px] w-full">
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0071e3" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#0071e3" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={28}
          fontSize={12}
          stroke="#86868b"
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          fontSize={12}
          stroke="#86868b"
          tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
        />
        <ChartTooltip
          cursor={{ stroke: "rgba(0,113,227,0.25)", strokeWidth: 1 }}
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
        <Area
          dataKey="revenue"
          type="monotone"
          stroke="#0071e3"
          strokeWidth={2.25}
          fill="url(#fillRevenue)"
          dot={false}
          activeDot={{ r: 4, fill: "#0071e3", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

/* ---------------------------------------------------------------- */
/* Donut — Répartition de la valeur du stock par modèle             */
/* ---------------------------------------------------------------- */

export type DonutSlice = { name: string; value: number }

const DONUT_COLORS = ["#0071e3", "#34c759", "#5e5ce6", "#ff9500", "#86868b"]

export function StockDonut({ data }: { data: DonutSlice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  if (total === 0) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center text-center px-6">
        <p className="text-[14px] text-[#6e6e73]">Aucun stock disponible à répartir pour le moment.</p>
      </div>
    )
  }

  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.name, { label: d.name, color: DONUT_COLORS[i % DONUT_COLORS.length] }])
  )

  return (
    <div className="flex flex-col items-center">
      <ChartContainer config={config} className="h-[200px] w-full max-w-[240px]">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span className="flex flex-col">
                    <span className="font-semibold text-[#1d1d1f]">${Number(value).toLocaleString("fr-FR")}</span>
                    <span className="text-[#86868b]">{name} · {Math.round((Number(value) / total) * 100)}%</span>
                  </span>
                )}
              />
            }
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Légende */}
      <div className="mt-2 w-full space-y-1.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className="text-[#6e6e73] truncate">{d.name}</span>
            </span>
            <span className="font-medium text-[#1d1d1f] shrink-0 ml-2">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
