import { useState, useEffect, useContext, createContext } from "react";
import {
  LayoutDashboard,
  FilePlus,
  List,
  MessageSquare,
  Bell,
  LogOut,
  User,
  Edit,
  CheckCheck,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { GrievanceContext } from "../context/GrievanceContext";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, markAsRead, markAllRead, clearNotifications } =
    useContext(GrievanceContext);

  const [dropdown, setDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const rawName =
    user?.name || localStorage.getItem("employeeName") || "Employee";
  const displayName = rawName.includes("@") ? rawName.split("@")[0] : rawName;
  const nameParts = displayName
    .split(/[\s._-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const prettyName = nameParts.join(" ").replace(/\d+/g, "");
  const initials = nameParts
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("employeeName");
    window.location.replace("/");
  };

  useEffect(() => {
    const close = () => {
      setDropdown(false);
      setNotifOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/employee-dashboard" },
    { name: "Raise Grievance", icon: FilePlus, path: "/raise-grievance" },
    { name: "Track Status", icon: List, path: "/track-status" },
    { name: "Feedback", icon: MessageSquare, path: "/feedback" },
    { name: "My Grievances", icon: List, path: "/my-grievances" },
  ];

  const unreadCount = notifications?.filter((n) => !n.read)?.length ?? 0;
  const activeLabel =
    menu.find((m) => location.pathname === m.path)?.name || "Dashboard";

  const C = {
    bg: isDark ? "#0f1117" : "#f0f4fa",
    surface: isDark ? "#161b27" : "#ffffff",
    surface2: isDark ? "#1e2436" : "#f8fafc",
    border: isDark ? "rgba(255,255,255,0.07)" : "#e8edf5",
    text: isDark ? "#e8eaf2" : "#0f172a",
    textSub: isDark ? "#8892b0" : "#64748b",
    textMute: isDark ? "#4a5568" : "#94a3b8",
    shadow: isDark
      ? "0 1px 8px rgba(0,0,0,0.45)"
      : "0 1px 6px rgba(15,23,42,0.05)",
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "'Outfit', sans-serif",
          background: C.bg,
          transition: "background 0.25s",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Lora:wght@600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }

          .nav-item {
            display: flex; align-items: center; gap: 12px;
            padding: 11px 14px; border-radius: 10px;
            color: rgba(255,255,255,0.45); font-size: 13.5px; font-weight: 500;
            cursor: pointer; transition: all 0.18s ease;
            border: none; background: none; width: 100%; text-align: left;
            font-family: 'Outfit', sans-serif; letter-spacing: 0.01em;
          }
          .nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); padding-left: 18px; }
          .nav-item.active { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; font-weight: 600; box-shadow: 0 4px 14px rgba(37,99,235,0.35); }
          .nav-item .icon-wrap { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; transition: background 0.18s; flex-shrink: 0; }
          .nav-item.active .icon-wrap { background: rgba(255,255,255,0.15); }
          .nav-item:not(.active):hover .icon-wrap { background: rgba(255,255,255,0.08); }

          .notif-item {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            cursor: pointer;
            transition: background 0.15s;
          }
          .notif-item:last-child { border-bottom: none; }
          .notif-item:hover { filter: brightness(0.97); }

          .profile-circle {
            width: 36px; height: 36px; border-radius: 50%;
            background: linear-gradient(135deg, #0f172a, #2563eb);
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 12px; font-weight: 700;
            letter-spacing: 0.03em; flex-shrink: 0; cursor: pointer;
            transition: all 0.2s; border: 2px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(37,99,235,0.2);
          }
          .profile-circle:hover { border-color: #2563eb; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transform: scale(1.05); }

          .topbar-icon {
            width: 36px; height: 36px; border-radius: 9px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.15s; position: relative;
            flex-shrink: 0; border: none;
          }

          .dropdown-item {
            display: flex; align-items: center; gap: 10px;
            padding: 9px 13px; border-radius: 8px;
            font-size: 13px; font-weight: 500; color: #1e293b;
            cursor: pointer; transition: background 0.15s;
            font-family: 'Outfit', sans-serif;
          }
          .dropdown-item:hover { background: #f1f5f9; }
          .dropdown-item.danger { color: #ef4444; }
          .dropdown-item.danger:hover { background: #fef2f2; }

          .sidebar-section-label {
            font-size: 9.5px; font-weight: 700; color: rgba(255,255,255,0.18);
            letter-spacing: 0.12em; text-transform: uppercase;
            padding: 0 14px; margin-bottom: 8px; margin-top: 6px;
          }

          @keyframes notif-drop {
            from { opacity:0; transform: translateY(-8px) scale(0.97); }
            to   { opacity:1; transform: translateY(0) scale(1); }
          }
          @keyframes badge-pop {
            0%   { transform: scale(0); }
            70%  { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes bell-ring {
            0%,100% { transform: rotate(0); }
            15% { transform: rotate(15deg); }
            30% { transform: rotate(-12deg); }
            45% { transform: rotate(10deg); }
            60% { transform: rotate(-8deg); }
            75% { transform: rotate(5deg); }
          }
          .bell-ring { animation: bell-ring 1s ease 0.3s; }
          .notif-dropdown { animation: notif-drop 0.2s cubic-bezier(.34,1.2,.64,1) both; }
          .badge-animate { animation: badge-pop 0.3s cubic-bezier(.34,1.56,.64,1) both; }
        `}</style>

        {/* ── Sidebar ── */}
        <aside
          style={{
            width: 230,
            background: "linear-gradient(180deg, #0f172a 0%, #1a2540 100%)",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              padding: "22px 18px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
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
              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 700,
                  fontSize: 19,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}
              >
                Resolve<span style={{ color: "#60a5fa" }}>IT</span>
              </span>
            </div>
          </div>

          <nav style={{ padding: "16px 10px", flex: 1, overflowY: "auto" }}>
            <p className="sidebar-section-label">Main Menu</p>
            {menu.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  className={`nav-item ${active ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="icon-wrap">
                    <Icon size={15} />
                  </span>
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div
            style={{
              padding: "14px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
              ResolveIT v2.1.0
            </p>
          </div>
        </aside>

        {/* ── Main ── */}
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
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
              padding: "0 24px",
              height: 62,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 50,
              boxShadow: C.shadow,
              transition: "background 0.25s, border-color 0.25s",
            }}
          >
            {/* Left: breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: C.textMute,
              }}
            >
              <span>ResolveIT</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
              <span style={{ color: C.text, fontWeight: 600 }}>
                {activeLabel}
              </span>
            </div>

            {/* Right controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="topbar-icon"
                style={{
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  color: C.textSub,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.textSub;
                }}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* Bell */}
              <div
                style={{ position: "relative" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifOpen(!notifOpen);
                  setDropdown(false);
                }}
              >
                <button
                  className="topbar-icon"
                  style={{
                    background: C.surface2,
                    border: `1px solid ${C.border}`,
                    color: unreadCount > 0 ? "#2563eb" : C.textSub,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color =
                      unreadCount > 0 ? "#2563eb" : C.textSub;
                  }}
                >
                  <span className={unreadCount > 0 ? "bell-ring" : ""}>
                    <Bell size={15} />
                  </span>
                  {unreadCount > 0 && (
                    <span
                      className="badge-animate"
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        minWidth: 17,
                        height: 17,
                        borderRadius: 9,
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                        border: `2px solid ${C.surface}`,
                        fontFamily: "inherit",
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {notifOpen && (
                  <div
                    className="notif-dropdown"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      width: 320,
                      background: "#fff",
                      borderRadius: 14,
                      boxShadow: "0 12px 40px rgba(15,23,42,0.14)",
                      border: "1px solid #e8edf5",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "14px 16px 12px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "#0f172a",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        Notifications
                        {unreadCount > 0 && (
                          <span
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 7px",
                              borderRadius: 100,
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        {unreadCount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllRead();
                            }}
                            style={{
                              fontSize: 11,
                              color: "#2563eb",
                              fontWeight: 600,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontFamily: "'Outfit',sans-serif",
                            }}
                          >
                            <CheckCheck size={12} /> Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotifications();
                            }}
                            style={{
                              fontSize: 11,
                              color: "#94a3b8",
                              fontWeight: 500,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "'Outfit',sans-serif",
                            }}
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                      {!notifications?.length ? (
                        <div
                          style={{ padding: "28px 16px", textAlign: "center" }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              background: "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 10px",
                            }}
                          >
                            <Bell size={18} color="#e2e8f0" />
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#94a3b8",
                              fontWeight: 500,
                            }}
                          >
                            You're all caught up!
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#cbd5e1",
                              marginTop: 4,
                            }}
                          >
                            No new notifications
                          </p>
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((n, i) => (
                          <div
                            key={i}
                            className="notif-item"
                            style={{ background: n.read ? "#fff" : "#f0fdf4" }}
                            onClick={() => markAsRead(n.ticketId || n.id)}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                              }}
                            >
                              {/* Icon */}
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  flexShrink: 0,
                                  marginTop: 1,
                                  background:
                                    n.type === "resolved"
                                      ? "#dcfce7"
                                      : "#eff6ff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {n.type === "resolved" ? (
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#16a34a"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                ) : (
                                  <Bell size={13} color="#2563eb" />
                                )}
                              </div>

                              {/* Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    fontSize: 12.5,
                                    color: "#1e293b",
                                    fontWeight: n.read ? 500 : 700,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {n.message}
                                </p>
                                {n.resolutionNote && (
                                  <p
                                    style={{
                                      fontSize: 11.5,
                                      color: "#16a34a",
                                      marginTop: 2,
                                      fontWeight: 500,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ✓ {n.resolutionNote}
                                  </p>
                                )}
                                <p
                                  style={{
                                    fontSize: 11,
                                    color: "#94a3b8",
                                    marginTop: 3,
                                  }}
                                >
                                  {timeAgo(n.createdAt)}
                                </p>
                              </div>

                              {/* Unread dot */}
                              {!n.read && (
                                <span
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: "#ef4444",
                                    flexShrink: 0,
                                    marginTop: 5,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div
                        style={{
                          padding: "10px 16px",
                          borderTop: "1px solid #f1f5f9",
                          background: "#fafafa",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                          {notifications.length} total · {unreadCount} unread
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 24, background: C.border }} />

              {/* Profile */}
              <div
                style={{ position: "relative" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(!dropdown);
                  setNotifOpen(false);
                }}
              >
                <div className="profile-circle">{initials}</div>

                {dropdown && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      width: 230,
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow: "0 16px 48px rgba(15,23,42,0.16)",
                      border: "1px solid #e8edf5",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        padding: 16,
                        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #2563eb, #60a5fa)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 16,
                          fontWeight: 700,
                          flexShrink: 0,
                          border: "2px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: "#fff",
                            lineHeight: 1.3,
                          }}
                        >
                          {prettyName}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginTop: 3,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#10b981",
                            }}
                          />
                          <p
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,0.45)",
                            }}
                          >
                            Employee · Active
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "6px" }}>
                      <div
                        className="dropdown-item"
                        onClick={() => navigate("/view-profile")}
                      >
                        <User size={14} color="#2563eb" /> View Profile
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => navigate("/edit-profile")}
                      >
                        <Edit size={14} color="#4f46e5" /> Edit Profile
                      </div>
                      <div
                        style={{
                          height: 1,
                          background: "#f1f5f9",
                          margin: "4px 0",
                        }}
                      />
                      <div
                        className="dropdown-item danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={14} /> Logout
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main
            style={{
              flex: 1,
              padding: "26px 28px",
              overflowY: "auto",
              background: C.bg,
              color: C.text,
              transition: "background 0.25s, color 0.25s",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
