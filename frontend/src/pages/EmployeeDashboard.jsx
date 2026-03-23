import { useContext, useMemo, useState, useEffect } from "react";
import { GrievanceContext } from "../context/GrievanceContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const { grievances = [] } = useContext(GrievanceContext);
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // ✅ employeeName now stores the real first name (set correctly at login)
  const firstName = localStorage.getItem("employeeName") || "Employee";
  const userEmail = localStorage.getItem("lastLoggedInEmail") || "";

  const myGrievances = useMemo(
    () => grievances.filter((g) => g.employeeEmail === userEmail),
    [grievances, userEmail],
  );

  const total = myGrievances.length;
  const pending = myGrievances.filter((g) => g.status === "Pending").length;
  const inProgress = myGrievances.filter(
    (g) => g.status === "In Progress",
  ).length;
  const resolved = myGrievances.filter((g) => g.status === "Resolved").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const thisMonthCount = myGrievances.filter((g) => {
    if (!g.createdAt) return false;
    const d = new Date(g.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const tabs = ["All", "Pending", "In Progress", "Resolved"];

  const recent = useMemo(
    () =>
      [...myGrievances].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 2),
    [myGrievances],
  );

  const tabFiltered =
    activeTab === "All" ? recent : recent.filter((g) => g.status === activeTab);

  const stats = [
    {
      label: "TOTAL FILED",
      value: total,
      badge:
        thisMonthCount > 0
          ? `+${thisMonthCount} new this month`
          : "— No new this month",
      badgeColor: thisMonthCount > 0 ? "#16a34a" : "#6b7280",
      iconBg: "#dbeafe",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: "PENDING",
      value: pending,
      badge: pending > 0 ? "Needs attention" : "— All clear",
      badgeColor: pending > 0 ? "#d97706" : "#6b7280",
      iconBg: "#fef9c3",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: "IN PROGRESS",
      value: inProgress,
      badge: inProgress > 0 ? "Being handled" : "— Nothing active",
      badgeColor: "#6b7280",
      iconBg: "#ede9fe",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "RESOLVED",
      value: resolved,
      badge:
        resolutionRate >= 50
          ? `↑ ${resolutionRate}% rate`
          : `↓ ${resolutionRate}% rate`,
      badgeColor: resolutionRate >= 50 ? "#16a34a" : "#dc2626",
      iconBg: "#dcfce7",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  const statusStyle = (status) => {
    if (status === "Pending")
      return { bg: "#fef9c3", color: "#92400e", dot: "#f59e0b" };
    if (status === "In Progress")
      return { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" };
    return { bg: "#dcfce7", color: "#166534", dot: "#22c55e" };
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "32px 36px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .stat-card { background: white; border-radius: 16px; padding: 22px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .tab-btn { padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .grievance-row { display: flex; align-items: center; gap: 14px; padding: 14px 8px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.12s; border-radius: 8px; }
        .grievance-row:hover { background: #f8fafc; }
        .grievance-row:last-child { border-bottom: none; }
      `}</style>

      {/* Welcome — shows firstName fetched from API name, not email/password */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1e293b",
          margin: "0 0 6px",
        }}
      >
        Welcome, <span style={{ color: "#3b82f6" }}>{firstName}</span>
      </h1>
      <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 28px" }}>
        Here's an overview of your grievance activity
      </p>

      {/* Stat cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            flex: 1,
          }}
        >
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: s.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.icon}
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    color: s.badgeColor,
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  {s.badge}
                </span>
              </div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#1e293b",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94a3b8",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Resolution rate dark card */}
        <div
          style={{
            width: 230,
            background: "linear-gradient(145deg, #1e3a5f 0%, #0f2440 100%)",
            borderRadius: 16,
            padding: "22px 20px",
            color: "white",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 18,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#93c5fd",
                  letterSpacing: "0.1em",
                }}
              >
                RESOLUTION RATE
              </span>
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {resolutionRate}
              <span style={{ fontSize: 24, fontWeight: 500 }}>%</span>
            </div>
            <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 20 }}>
              {resolved} of {total} grievances resolved
            </div>
          </div>
          <div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 99,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  height: 4,
                  borderRadius: 99,
                  background: "#60a5fa",
                  width: `${resolutionRate}%`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#475569",
              }}
            >
              <span>0%</span>
              <span>Target: 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Grievances */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          padding: "22px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
              Recent Grievances
            </span>
            <span
              style={{
                background: "#dbeafe",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 600,
                padding: "2px 9px",
                borderRadius: 20,
              }}
            >
              {myGrievances.length}
            </span>
          </div>
          <span
            onClick={() => navigate("/track-status")}
            style={{
              fontSize: 13,
              color: "#3b82f6",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            View all
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className="tab-btn"
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#1e293b" : "transparent",
                color: activeTab === tab ? "white" : "#64748b",
                border:
                  activeTab === tab
                    ? "1px solid transparent"
                    : "1px solid #e2e8f0",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {tabFiltered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: "0 auto 14px", display: "block" }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                fontWeight: 500,
                margin: "0 0 10px",
              }}
            >
              No grievances filed yet.
            </p>
            <span
              onClick={() => navigate("/file-grievance")}
              style={{
                fontSize: 13,
                color: "#3b82f6",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              File your first grievance →
            </span>
          </div>
        ) : (
          tabFiltered.map((g) => {
            const ss = statusStyle(g.status);
            return (
              <div
                key={g.id}
                className="grievance-row"
                onClick={() => navigate("/track-status")}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {g.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                    {g.department}
                    {g.ticketId
                      ? ` · ${g.ticketId}`
                      : g.id
                        ? ` · #${g.id}`
                        : ""}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: ss.bg,
                      color: ss.color,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: ss.dot,
                      }}
                    />
                    {g.status}
                  </span>
                  {g.createdAt && (
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {new Date(g.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
