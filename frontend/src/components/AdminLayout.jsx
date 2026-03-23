import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  ChevronRight,
  Shield,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
    { name: "Manage Grievances", icon: FileText, path: "/manage-grievances" },
    { name: "Manage Feedback", icon: MessageSquare, path: "/manage-feedback" },
    { name: "Reports", icon: BarChart3, path: "/admin-reports" },
    { name: "Audit Logs", icon: ClipboardList, path: "/admin-audit-logs" },
  ];

  const currentPage =
    menu.find((m) => m.path === location.pathname)?.name || "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Sora','DM Sans',sans-serif",
        background: "#f4f5f7",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        .anav {
          display:flex; align-items:center; gap:11px;
          padding:9px 13px; border-radius:8px;
          color:rgba(255,255,255,0.38);
          font-size:12.5px; font-weight:500; letter-spacing:0.01em;
          cursor:pointer; transition:all 0.17s ease;
          border:none; background:none; width:100%; text-align:left;
          font-family:'Sora',sans-serif; position:relative;
        }
        .anav:hover {
          background:rgba(255,255,255,0.06);
          color:rgba(255,255,255,0.78);
          padding-left:17px;
        }
        .anav.active {
          background:rgba(255,255,255,0.09);
          color:#fff; font-weight:600;
        }
        .anav.active::before {
          content:'';
          position:absolute; left:0; top:7px; bottom:7px;
          width:3px; border-radius:0 3px 3px 0;
          background:#e2c97e;
        }
        .anav-icon {
          width:30px; height:30px; border-radius:7px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          transition:background 0.17s;
        }
        .anav.active .anav-icon { background:rgba(226,201,126,0.15); color:#e2c97e; }
        .anav:not(.active):hover .anav-icon { background:rgba(255,255,255,0.07); }

        .aside-label {
          font-size:8.5px; font-weight:700;
          color:rgba(255,255,255,0.18);
          letter-spacing:0.16em; text-transform:uppercase;
          padding:0 13px; margin-bottom:4px; margin-top:20px;
          display:block;
        }

        .a-logout {
          display:flex; align-items:center; gap:7px;
          padding:7px 14px; border-radius:9px; border:none;
          background:#fef2f2; color:#dc2626;
          font-family:'Sora',sans-serif; font-size:12px; font-weight:600;
          cursor:pointer; transition:all 0.17s;
        }
        .a-logout:hover { background:#fee2e2; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
      `}</style>

      {/* ════════ SIDEBAR ════════ */}
      <aside
        style={{
          width: 232,
          background:
            "linear-gradient(170deg, #1c1f26 0%, #22262f 60%, #1a1d24 100%)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "4px 0 20px rgba(0,0,0,0.22)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "22px 16px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                flexShrink: 0,
                background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                <path
                  d="M4 10l4 4 8-8"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#fff",
                  letterSpacing: "-0.3px",
                }}
              >
                Resolve<span style={{ color: "#818cf8" }}>IT</span>
              </span>
              <p
                style={{
                  fontSize: 8.5,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Admin badge */}
        <div
          style={{
            margin: "12px 14px 0",
            padding: "8px 12px",
            borderRadius: 9,
            background: "rgba(226,201,126,0.07)",
            border: "1px solid rgba(226,201,126,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Shield size={12} color="#e2c97e" />
          <span
            style={{
              fontSize: 11,
              color: "#e2c97e",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            Admin Access
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 9,
              fontWeight: 700,
              background: "rgba(226,201,126,0.15)",
              color: "#e2c97e",
              padding: "1px 6px",
              borderRadius: 10,
              fontFamily: "'DM Mono',monospace",
            }}
          >
            PRO
          </span>
        </div>

        {/* Nav */}
        <nav style={{ padding: "2px 10px 0", flex: 1, overflowY: "auto" }}>
          <span className="aside-label">Main Menu</span>
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.name}
                className={`anav ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="anav-icon">
                  <Icon size={14} />
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            margin: "0 16px",
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* User footer */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg,#374151,#4b5563)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
                border: "2px solid rgba(226,201,126,0.25)",
              }}
            >
              A
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.65)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Administrator
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  marginTop: 1,
                }}
              >
                ResolveIT v2.1.0
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════ MAIN ════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e9eaec",
            padding: "0 28px",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "rgba(30,58,95,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={12} color="#1e3a5f" />
            </div>
            <span style={{ fontSize: 12.5, color: "#9ca3af" }}>Admin</span>
            <ChevronRight size={12} color="#d1d5db" />
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "#111",
                letterSpacing: "-0.2px",
              }}
            >
              {currentPage}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="a-logout" onClick={handleLogout}>
              <LogOut size={13} /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "24px 28px",
            overflowY: "auto",
            background: "#f4f5f7",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
