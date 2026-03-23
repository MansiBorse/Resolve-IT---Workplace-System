import { useContext, useMemo, useState, useEffect } from "react";

import {
  Layers,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Animated counter ── */
function Num({ to, duration = 900 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!to) {
      setV(0);
      return;
    }
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * to));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [to, duration]);
  return <>{v}</>;
}

const STATUS_CFG = {
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.09)", label: "Pending" },
  "In Progress": {
    color: "#6366f1",
    bg: "rgba(99,102,241,0.09)",
    label: "In Progress",
  },
  Resolved: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.09)",
    label: "Resolved",
  },
};

const PRI_DOT = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };

const DEPT_COLOR = {
  HR: "#8b5cf6",
  Finance: "#f59e0b",
  IT: "#0ea5e9",
  Operations: "#10b981",
  Admin: "#ef4444",
};

export default function AdminDashboard() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/grievances")
      .then((res) => res.json())
      .then((data) => setGrievances(data))
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

  const total = grievances.length;
  const pending = grievances.filter((g) => g.status === "Pending").length;
  const inProgress = grievances.filter(
    (g) => g.status === "In Progress",
  ).length;
  const resolved = grievances.filter((g) => g.status === "Resolved").length;
  const resRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const recent = useMemo(
    () => [...grievances].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3),
    [grievances],
  );

  const deptMap = useMemo(() => {
    const m = {};
    grievances.forEach((g) => {
      if (g.department) m[g.department] = (m[g.department] || 0) + 1;
    });
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [grievances]);

  const circumference = 2 * Math.PI * 38;

  return (
    <div
      style={{
        fontFamily: "'Sora','DM Sans',sans-serif",
        background: "#f7f7f5",
        minHeight: "100%",
        paddingBottom: 40,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulseDot {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.7); opacity:0.4; }
        }

        .fu { animation: fadeUp 0.42s cubic-bezier(.22,.68,0,1.2) both; }

        .kpi {
          background:#fff; border-radius:16px; border:1px solid #eaeae7;
          padding:20px 22px;
          transition: box-shadow .18s, transform .18s;
        }
        .kpi:hover { box-shadow:0 8px 28px rgba(0,0,0,0.07); transform:translateY(-2px); }

        .panel {
          background:#fff; border-radius:20px; border:1px solid #eaeae7;
          overflow:hidden;
        }

        .g-row {
          display:grid;
          grid-template-columns: 88px 1fr 150px 96px;
          align-items:center; gap:10px;
          padding:14px 22px;
          border-bottom:1px solid #f3f3f0;
          cursor:pointer;
          transition:background .12s;
        }
        .g-row:last-child { border-bottom:none; }
        .g-row:hover { background:#fafaf8; }

        .pill {
          display:inline-flex; align-items:center; gap:5px;
          font-size:10.5px; font-weight:600;
          padding:3px 9px; border-radius:20px;
          font-family:'DM Mono',monospace; white-space:nowrap;
        }

        .vbtn {
          display:inline-flex; align-items:center; gap:4px;
          font-size:12px; font-weight:600; color:#6366f1;
          background:none; border:none; cursor:pointer;
          font-family:'Sora',sans-serif; padding:0;
          transition:gap .14s;
        }
        .vbtn:hover { gap:7px; }

        .live-dot {
          width:7px; height:7px; border-radius:50%;
          background:#10b981; display:inline-block;
          animation: pulseDot 2s ease-in-out infinite;
        }

        .dept-bar { height:3px; border-radius:3px; background:#f0f0ed; margin-top:5px; overflow:hidden; }
        .dept-fill { height:100%; border-radius:3px; transition:width 1.1s cubic-bezier(.22,.68,0,1.2); }
      `}</style>

      {/* ── Hero ── */}
      <div
        className="fu"
        style={{
          borderRadius: 20,
          marginBottom: 18,
          background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
          padding: "26px 30px",
          position: "relative",
          overflow: "hidden",
          animationDelay: "0s",
        }}
      >
        {/* glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: 80,
            width: 220,
            height: 220,
            background:
              "radial-gradient(circle,rgba(99,102,241,.35) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 120,
            width: 180,
            height: 180,
            background:
              "radial-gradient(circle,rgba(16,185,129,.2) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,.3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 7,
              }}
            >
              Overview
            </p>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.4px",
                marginBottom: 5,
              }}
            >
              Grievance Dashboard
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>
              {pending > 0
                ? `${pending} grievance${pending > 1 ? "s" : ""} need${pending === 1 ? "s" : ""} your attention.`
                : "All caught up — no pending grievances."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Open", val: pending + inProgress, c: "#f59e0b" },
              { label: "Resolved", val: resolved, c: "#10b981" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,.07)",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.1)",
                  padding: "10px 20px",
                  textAlign: "center",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                    letterSpacing: "-1px",
                  }}
                >
                  {s.val}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: s.c,
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div
        className="fu"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 18,
          animationDelay: "0.08s",
        }}
      >
        {[
          {
            label: "Total",
            value: total,
            Icon: Layers,
            color: "#6366f1",
            bg: "rgba(99,102,241,.08)",
          },
          {
            label: "Pending",
            value: pending,
            Icon: AlertTriangle,
            color: "#f59e0b",
            bg: "rgba(245,158,11,.08)",
          },
          {
            label: "In Progress",
            value: inProgress,
            Icon: Clock,
            color: "#3b82f6",
            bg: "rgba(59,130,246,.08)",
          },
          {
            label: "Resolved",
            value: resolved,
            Icon: CheckCircle,
            color: "#10b981",
            bg: "rgba(16,185,129,.08)",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="kpi fu"
            style={{ animationDelay: `${0.12 + i * 0.06}s` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <s.Icon size={18} color={s.color} strokeWidth={1.8} />
              </div>
              {s.color === "#10b981" && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#10b981",
                    background: "rgba(16,185,129,.1)",
                    padding: "2px 7px",
                    borderRadius: 20,
                  }}
                >
                  {resRate}%
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#111",
                lineHeight: 1,
                letterSpacing: "-1px",
                marginBottom: 4,
              }}
            >
              <Num to={s.value} />
            </p>
            <p style={{ fontSize: 11.5, color: "#a0a09a", fontWeight: 500 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main content row ── */}
      <div
        className="fu"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 290px",
          gap: 16,
          animationDelay: "0.3s",
        }}
      >
        {/* Recent Grievances */}
        <div className="panel">
          {/* header */}
          <div
            style={{
              padding: "16px 22px 13px",
              borderBottom: "1px solid #f3f3f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span className="live-dot" />
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#111",
                  letterSpacing: "-0.2px",
                }}
              >
                Recent Grievances
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#6366f1",
                  background: "rgba(99,102,241,.09)",
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {recent.length}
              </span>
            </div>
            <button
              className="vbtn"
              onClick={() => navigate("/manage-grievances")}
            >
              View all <ArrowUpRight size={12} />
            </button>
          </div>

          {/* col heads */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "88px 1fr 150px 96px",
              gap: 10,
              padding: "8px 22px",
              background: "#fafaf8",
              borderBottom: "1px solid #f3f3f0",
            }}
          >
            {["Ticket", "Issue", "Employee", "Status"].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#b8b8b0",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {recent.length === 0 ? (
            <div
              style={{
                padding: "44px",
                textAlign: "center",
                color: "#b8b8b0",
                fontSize: 13,
              }}
            >
              No grievances yet.
            </div>
          ) : (
            recent.map((g, i) => {
              const ss = STATUS_CFG[g.status] || STATUS_CFG["Pending"];
              const priDot = PRI_DOT[g.priority];
              const name = g.isAnonymous
                ? "Anonymous"
                : g.employeeEmail || g.employee || "?";
              const initials = g.isAnonymous ? "?" : name[0].toUpperCase();
              const avatarHue = (name.charCodeAt(0) * 47) % 360;
              return (
                <div
                  key={g.id}
                  className="g-row"
                  onClick={() => navigate("/manage-grievances")}
                >
                  {/* ticket */}
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: "#6366f1",
                      background: "rgba(99,102,241,.07)",
                      padding: "3px 8px",
                      borderRadius: 6,
                      display: "inline-block",
                    }}
                  >
                    {g.ticketId || `#${String(g.id).padStart(3, "0")}`}
                  </span>

                  {/* issue */}
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 220,
                        marginBottom: 2,
                      }}
                    >
                      {g.title}
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      {priDot && (
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: priDot,
                            display: "inline-block",
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          color: "#a0a09a",
                          fontWeight: 500,
                        }}
                      >
                        {g.department || "—"}
                      </span>
                    </div>
                  </div>

                  {/* employee */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: `hsl(${avatarHue},55%,58%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {initials}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#555",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 105,
                      }}
                    >
                      {name}
                    </span>
                  </div>

                  {/* status */}
                  <span
                    className="pill"
                    style={{ background: ss.bg, color: ss.color }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: ss.color,
                        flexShrink: 0,
                      }}
                    />
                    {ss.label}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Side panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Resolution rate — arc */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #eaeae7",
              padding: "20px 20px 18px",
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111",
                marginBottom: 2,
              }}
            >
              Resolution Rate
            </p>
            <p style={{ fontSize: 11, color: "#a0a09a", marginBottom: 18 }}>
              {resolved} of {total} closed
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* arc */}
              <div
                style={{
                  position: "relative",
                  width: 96,
                  height: 96,
                  flexShrink: 0,
                }}
              >
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 96 96"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <defs>
                    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke="#f0f0ed"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke="url(#g1)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - resRate / 100)}
                    style={{
                      transition:
                        "stroke-dashoffset 1.2s cubic-bezier(.22,.68,0,1.2)",
                    }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#111",
                      letterSpacing: "-1px",
                      lineHeight: 1,
                    }}
                  >
                    <Num to={resRate} />%
                  </span>
                </div>
              </div>

              {/* legend */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  flex: 1,
                }}
              >
                {[
                  { label: "Resolved", val: resolved, c: "#10b981" },
                  { label: "In Progress", val: inProgress, c: "#6366f1" },
                  { label: "Pending", val: pending, c: "#f59e0b" },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: l.c,
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: "#a0a09a",
                          fontWeight: 500,
                        }}
                      >
                        {l.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#111",
                        fontFamily: "'DM Mono',monospace",
                      }}
                    >
                      {l.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department breakdown */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #eaeae7",
              padding: "20px 20px 18px",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                By Department
              </p>
              <TrendingUp size={13} color="#a0a09a" />
            </div>
            {deptMap.length === 0 ? (
              <p style={{ fontSize: 12, color: "#b8b8b0" }}>No data yet.</p>
            ) : (
              deptMap.map(([d, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const col = DEPT_COLOR[d] || "#6366f1";
                return (
                  <div key={d} style={{ marginBottom: 13 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: `${col}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 8.5,
                            fontWeight: 800,
                            color: col,
                          }}
                        >
                          {d.slice(0, 2).toUpperCase()}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#374151",
                            fontWeight: 600,
                          }}
                        >
                          {d}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 7,
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 10.5, color: "#b8b8b0" }}>
                          {pct}%
                        </span>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: col,
                            background: `${col}12`,
                            padding: "1px 7px",
                            borderRadius: 10,
                            fontFamily: "'DM Mono',monospace",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    </div>
                    <div className="dept-bar">
                      <div
                        className="dept-fill"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg,${col}77,${col})`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
