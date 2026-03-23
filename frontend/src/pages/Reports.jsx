import { useContext, useMemo, useState } from "react";
import { GrievanceContext } from "../context/GrievanceContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STATUS_CFG = {
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Pending" },
  "In Progress": {
    color: "#818cf8",
    bg: "rgba(129,140,248,0.12)",
    label: "In Progress",
  },
  Resolved: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    label: "Resolved",
  },
};

const DEPT_PALETTE = [
  "#818cf8",
  "#34d399",
  "#f472b6",
  "#fb923c",
  "#38bdf8",
  "#a78bfa",
  "#4ade80",
  "#fbbf24",
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e2130",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      {label && (
        <p style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
              display: "inline-block",
            }}
          />
          <span style={{ color: "#cbd5e1" }}>{p.name}:</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>
            {typeof p.value === "number" && p.name?.includes("%")
              ? `${p.value}%`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ label, value, sub, accent, icon, trend }) {
  const isUp = trend > 0;
  return (
    <div
      style={{
        background: "#141621",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        borderTop: `2px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#f1f5f9",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {trend !== undefined && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 20,
              background: isUp
                ? "rgba(52,211,153,0.15)"
                : "rgba(248,113,113,0.15)",
              color: isUp ? "#34d399" : "#f87171",
            }}
          >
            {isUp ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: "#475569" }}>{sub}</span>}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, action }) {
  return (
    <div
      style={{
        background: "#141621",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "22px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "#e2e8f0",
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const axisStyle = { fill: "#475569", fontSize: 11 };

export default function Reports() {
  // ← KEY CHANGE: use allGrievances for admin analytics
  const { allGrievances: grievances } = useContext(GrievanceContext);
  const [activeRange, setActiveRange] = useState(6);

  const total = grievances.length;
  const pending = grievances.filter((g) => g.status === "Pending").length;
  const inProgress = grievances.filter(
    (g) => g.status === "In Progress",
  ).length;
  const resolved = grievances.filter((g) => g.status === "Resolved").length;
  const resRate = total ? Math.round((resolved / total) * 100) : 0;

  const avgDays = useMemo(() => {
    const withDates = grievances.filter((g) => g.createdAt && g.resolvedAt);
    if (!withDates.length) return "—";
    const avg =
      withDates.reduce(
        (acc, g) =>
          acc + (new Date(g.resolvedAt) - new Date(g.createdAt)) / 86400000,
        0,
      ) / withDates.length;
    return avg.toFixed(1) + "d";
  }, [grievances]);

  const statusData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ].filter((d) => d.value > 0);

  const deptData = useMemo(() => {
    const map = {};
    grievances.forEach((g) => {
      if (g.department) map[g.department] = (map[g.department] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [grievances]);

  const trendData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: activeRange }, (_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - (activeRange - 1 - i),
        1,
      );
      const bucket = {
        month: MONTH_NAMES[d.getMonth()],
        year: d.getFullYear(),
        Pending: 0,
        "In Progress": 0,
        Resolved: 0,
        Total: 0,
      };
      grievances.forEach((g) => {
        const gd = new Date(g.createdAt || g.date || g.submittedAt);
        if (isNaN(gd)) return;
        if (
          gd.getFullYear() === d.getFullYear() &&
          gd.getMonth() === d.getMonth()
        ) {
          bucket.Total += 1;
          if (g.status in bucket) bucket[g.status] += 1;
        }
      });
      return bucket;
    });
  }, [grievances, activeRange]);

  const resolutionTrend = trendData.map((d) => ({
    month: d.month,
    "Resolution %": d.Total ? Math.round((d.Resolved / d.Total) * 100) : 0,
  }));

  const priorityData = useMemo(() => {
    const map = {};
    grievances.forEach((g) => {
      const p = g.priority || "Normal";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [grievances]);

  const RangeBtn = ({ n }) => (
    <button
      onClick={() => setActiveRange(n)}
      style={{
        padding: "4px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        border:
          activeRange === n
            ? "1px solid #818cf8"
            : "1px solid rgba(255,255,255,0.08)",
        background: activeRange === n ? "rgba(129,140,248,0.2)" : "transparent",
        color: activeRange === n ? "#818cf8" : "#475569",
      }}
    >
      {n}M
    </button>
  );

  return (
    <div
      style={{
        background: "#0d0f1a",
        minHeight: "100vh",
        padding: "28px 24px",
        fontFamily: "'DM Sans',system-ui,sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              color: "#475569",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Grievance Management System
          </p>
          <h1
            style={{
              margin: "6px 0 0",
              fontSize: 24,
              fontWeight: 700,
              color: "#f1f5f9",
            }}
          >
            Analytics Overview
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Live indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#34d399",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 8,
              padding: "5px 10px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#34d399",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            Live data
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#475569",
              background: "#141621",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8,
              padding: "6px 12px",
            }}
          >
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.4); }
        }
      `}</style>

      {/* Empty state */}
      {total === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#475569",
          }}
        >
          <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 6,
            }}
          >
            No grievance data yet
          </p>
          <p style={{ fontSize: 13 }}>
            Analytics will appear here once grievances are submitted.
          </p>
        </div>
      )}

      {total > 0 && (
        <>
          {/* KPI row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <KpiCard
              label="Total Cases"
              value={total}
              accent="#818cf8"
              icon="📋"
              sub="all time"
              trend={12}
            />
            <KpiCard
              label="Pending"
              value={pending}
              accent="#f59e0b"
              icon="⏳"
              sub="needs action"
              trend={pending > 0 ? -5 : 0}
            />
            <KpiCard
              label="In Progress"
              value={inProgress}
              accent="#38bdf8"
              icon="🔄"
              sub="being handled"
              trend={8}
            />
            <KpiCard
              label="Resolved"
              value={resolved}
              accent="#34d399"
              icon="✅"
              sub="closed"
              trend={18}
            />
            <KpiCard
              label="Resolution Rate"
              value={`${resRate}%`}
              accent="#f472b6"
              icon="📊"
              sub={`avg ${avgDays}`}
              trend={resRate > 60 ? 5 : -3}
            />
          </div>

          {/* Row 2: Trend + Donut */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <Panel
              title="Grievance Volume Trend"
              subtitle="Monthly breakdown by status"
              action={
                <div style={{ display: "flex", gap: 4 }}>
                  <RangeBtn n={3} />
                  <RangeBtn n={6} />
                  <RangeBtn n={12} />
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={trendData}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <defs>
                    {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                      <linearGradient
                        key={key}
                        id={`g-${key.replace(" ", "")}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={cfg.color}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor={cfg.color}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stackId="1"
                      stroke={cfg.color}
                      strokeWidth={2}
                      fill={`url(#g-${key.replace(" ", "")})`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
                {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                  <div
                    key={key}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: cfg.color,
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      {cfg.label}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Status Split" subtitle="Current snapshot">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_CFG[entry.name]?.color || "#64748b"}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {statusData.map((d) => {
                  const pct = total ? Math.round((d.value / total) * 100) : 0;
                  const cfg = STATUS_CFG[d.name] || {};
                  return (
                    <div
                      key={d.name}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: cfg.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>
                        {d.name}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#e2e8f0",
                        }}
                      >
                        {d.value}
                      </span>
                      <div
                        style={{
                          width: 60,
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: 4,
                          height: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: cfg.color,
                            borderRadius: 4,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#475569",
                          width: 28,
                          textAlign: "right",
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Row 3: Department bar + Resolution rate line */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <Panel title="Cases by Department" subtitle="Sorted by volume">
              {deptData.length === 0 ? (
                <p
                  style={{
                    color: "#475569",
                    fontSize: 12,
                    textAlign: "center",
                    marginTop: 40,
                  }}
                >
                  No department data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={deptData}
                    layout="vertical"
                    margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.04)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={axisStyle}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={axisStyle}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Cases"
                      radius={[0, 6, 6, 0]}
                      barSize={14}
                    >
                      {deptData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={DEPT_PALETTE[i % DEPT_PALETTE.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel title="Resolution Rate Trend" subtitle="Month-over-month %">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={resolutionTrend}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="Resolution %"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#34d399",
                      stroke: "#0d0f1a",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: "#34d399" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>

          {/* Row 4: Monthly volume + Priority */}
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
          >
            <Panel
              title="Monthly Case Volume"
              subtitle="Total new cases per month"
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={trendData}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="Total"
                    name="Total cases"
                    fill="#818cf8"
                    radius={[4, 4, 0, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Priority Distribution" subtitle="By urgency level">
              {priorityData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {priorityData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={DEPT_PALETTE[i % DEPT_PALETTE.length]}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    {priorityData.map((d, i) => (
                      <div
                        key={d.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: DEPT_PALETTE[i % DEPT_PALETTE.length],
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}
                        >
                          {d.name}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#e2e8f0",
                          }}
                        >
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p
                  style={{
                    color: "#475569",
                    fontSize: 12,
                    textAlign: "center",
                    marginTop: 40,
                  }}
                >
                  No priority data yet
                </p>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
