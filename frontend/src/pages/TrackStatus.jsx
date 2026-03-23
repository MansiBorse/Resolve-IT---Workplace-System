import { useState } from "react";
import {
  Search,
  Ticket,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
} from "lucide-react";

const statusConfig = {
  Pending: {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    dot: "#f59e0b",
    icon: AlertCircle,
  },
  "In Progress": {
    color: "#4f46e5",
    bg: "#f0f4ff",
    border: "#c7d2fe",
    dot: "#6366f1",
    icon: Clock,
  },
  Resolved: {
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    dot: "#10b981",
    icon: CheckCircle2,
  },
  // Progress update entries in history
  Update: {
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    dot: "#f59e0b",
    icon: MessageSquare,
  },
};

const STEPS = ["Pending", "In Progress", "Resolved"];

export default function TrackStatus() {
  const [ticketId, setTicketId] = useState("");
  const [grievance, setGrievance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [focused, setFocused] = useState(false);

  const searchTicket = async () => {
    if (!ticketId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setGrievance(null);
    setHistory([]);
    try {
      const res = await fetch(
        `http://localhost:8080/api/grievances/${ticketId}`,
      );
      const data = await res.json();
      if (!data || !data.ticketId) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setGrievance(data);
      const histRes = await fetch(
        `http://localhost:8080/api/grievances/history/${ticketId}`,
      );
      const histData = await histRes.json();
      setHistory(Array.isArray(histData) ? histData : []);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") searchTicket();
  };
  const clear = () => {
    setTicketId("");
    setGrievance(null);
    setHistory([]);
    setNotFound(false);
  };

  const sc = grievance
    ? statusConfig[grievance.status] || statusConfig["Pending"]
    : null;
  const currentStepIdx = grievance ? STEPS.indexOf(grievance.status) : -1;

  // Detect if a history entry is a progress update vs status change
  const isProgressUpdate = (h) =>
    h.status === "In Progress" &&
    h.comment &&
    !h.comment.startsWith("Status updated") &&
    !h.comment.startsWith("Grievance submitted");

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Lora:wght@600;700&display=swap');
        @keyframes fade-up   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop-in    { 0%{opacity:0;transform:scale(0.96) translateY(8px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        .fade-in  { animation: fade-up 0.35s ease both; }
        .pop-in   { animation: pop-in 0.3s cubic-bezier(0.34,1.3,0.64,1) both; }
        .search-btn { padding:0 20px; height:46px; border-radius:11px; border:none; background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; white-space:nowrap; transition:all 0.2s; box-shadow:0 4px 14px rgba(15,23,42,0.18); display:flex; align-items:center; gap:6px; }
        .search-btn:hover:not(:disabled) { background:linear-gradient(135deg,#2563eb,#1d4ed8); transform:translateY(-1px); }
        .search-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; animation:spin 0.7s linear infinite; }
        .timeline-line { position:absolute; left:15px; top:0; bottom:0; width:2px; background:#f1f5f9; }
        .timeline-line-fill { position:absolute; left:0; top:0; width:100%; background:linear-gradient(180deg,#2563eb,#6366f1); transition:height 1s ease; }
      `}</style>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Lora',serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          Track Grievance
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>
          Enter your Ticket ID to view status and full history.
        </p>
      </div>

      {/* Search bar */}
      <div
        className="fade-in"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          animationDelay: "0.05s",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <Search
              size={15}
              color={focused ? "#2563eb" : "#94a3b8"}
              style={{ transition: "color 0.18s" }}
            />
          </div>
          <input
            placeholder="e.g. GRV-1001"
            value={ticketId}
            onChange={(e) => {
              setTicketId(e.target.value);
              setNotFound(false);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            style={{
              width: "100%",
              padding: "11px 40px 11px 40px",
              borderRadius: 11,
              border: `1.5px solid ${focused ? "#2563eb" : "#e2e8f0"}`,
              background: focused ? "#fafbff" : "#fff",
              fontSize: 14,
              fontFamily: "'Outfit',sans-serif",
              color: "#0f172a",
              outline: "none",
              transition: "all 0.18s",
              boxSizing: "border-box",
            }}
          />
          {ticketId && (
            <button
              onClick={clear}
              style={{
                position: "absolute",
                right: 11,
                top: "50%",
                transform: "translateY(-50%)",
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#f1f5f9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={11} color="#94a3b8" />
            </button>
          )}
        </div>
        <button
          className="search-btn"
          onClick={searchTicket}
          disabled={!ticketId.trim() || loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Searching
            </>
          ) : (
            <>
              <Search size={13} />
              Search
            </>
          )}
        </button>
      </div>

      {/* Empty state */}
      {!grievance && !notFound && !loading && (
        <div
          className="fade-in"
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e8edf5",
            padding: "44px 24px",
            textAlign: "center",
            boxShadow: "0 1px 6px rgba(15,23,42,0.04)",
            animationDelay: "0.08s",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Ticket size={22} color="#cbd5e1" />
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 4,
            }}
          >
            No ticket entered
          </p>
          <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
            Type your Ticket ID above and press Search.
          </p>
        </div>
      )}

      {/* Not found */}
      {notFound && (
        <div
          className="pop-in"
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #fecaca",
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#dc2626",
              marginBottom: 4,
            }}
          >
            Ticket not found
          </p>
          <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
            No grievance matches{" "}
            <span style={{ fontWeight: 600, color: "#0f172a" }}>
              "{ticketId}"
            </span>
            . Check the ID and try again.
          </p>
        </div>
      )}

      {/* Result */}
      {grievance && (
        <div
          className="pop-in"
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid #e8edf5",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg,#2563eb,#6366f1,#8b5cf6)",
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "20px 22px 16px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Ticket size={18} color="#2563eb" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Ticket
                </p>
                <p
                  style={{
                    fontFamily: "'Lora',serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {grievance.ticketId}
                </p>
              </div>
            </div>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 100,
                background: sc.bg,
                color: sc.color,
                border: `1.5px solid ${sc.border}`,
                fontSize: 12.5,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {/* Pulsing dot for In Progress */}
              {grievance.status === "In Progress" ? (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: sc.dot,
                    animation: "pulse-dot 2s ease infinite",
                  }}
                />
              ) : (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: sc.dot,
                  }}
                />
              )}
              {grievance.status}
            </span>
          </div>

          {/* Meta */}
          <div
            style={{
              padding: "14px 22px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 120 }}>
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                Issue
              </p>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>
                {grievance.title}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                Department
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#2563eb",
                  background: "#eff6ff",
                  padding: "4px 11px",
                  borderRadius: 8,
                  border: "1px solid #bfdbfe",
                }}
              >
                <Building2 size={11} /> {grievance.department}
              </span>
            </div>
          </div>

          {/* Progress steps */}
          <div
            style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}
          >
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Progress
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              {STEPS.map((step, i) => {
                const done = i <= currentStepIdx;
                const current = i === currentStepIdx;
                const stc = statusConfig[step];
                return (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: i < STEPS.length - 1 ? 1 : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: done ? stc.bg : "#f8fafc",
                          border: `2px solid ${done ? stc.dot : "#e2e8f0"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: current
                            ? `0 0 0 4px ${stc.dot}22`
                            : "none",
                          transition: "all 0.3s",
                        }}
                      >
                        {done ? (
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: stc.dot,
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#e2e8f0",
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: current ? 700 : 500,
                          color: done ? stc.color : "#cbd5e1",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: 2,
                          background:
                            i < currentStepIdx ? "#2563eb" : "#e2e8f0",
                          margin: "0 6px",
                          marginBottom: 18,
                          borderRadius: 2,
                          transition: "background 0.5s",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resolution note */}
          {grievance.status === "Resolved" && grievance.resolutionNote && (
            <div
              style={{
                padding: "14px 22px",
                borderBottom: "1px solid #f1f5f9",
                background: "#f0fdf4",
              }}
            >
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Resolution
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#065f46",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                ✓ {grievance.resolutionNote}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div style={{ padding: "18px 22px 20px" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Status History{" "}
              {history.length > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontSize: 10,
                    padding: "1px 7px",
                    borderRadius: 100,
                    border: "1px solid #bfdbfe",
                    fontWeight: 700,
                  }}
                >
                  {history.length}
                </span>
              )}
            </p>

            {history.length === 0 ? (
              <p
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  textAlign: "center",
                  padding: "16px 0",
                }}
              >
                No history available yet.
              </p>
            ) : (
              <div style={{ position: "relative", paddingLeft: 38 }}>
                <div className="timeline-line">
                  <div
                    className="timeline-line-fill"
                    style={{
                      height: `${((history.length - 1) / Math.max(history.length - 1, 1)) * 100}%`,
                    }}
                  />
                </div>
                {history.map((h, i) => {
                  const isUpdate = isProgressUpdate(h);
                  const hsc = isUpdate
                    ? statusConfig["Update"]
                    : statusConfig[h.status] || statusConfig["Pending"];
                  const HIcon = hsc.icon;
                  const isLast = i === history.length - 1;
                  const date = new Date(h.updatedAt).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" },
                  );
                  const time = new Date(h.updatedAt).toLocaleTimeString(
                    "en-IN",
                    { hour: "2-digit", minute: "2-digit", hour12: true },
                  );

                  return (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        marginBottom: isLast ? 0 : 20,
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        animation: `fade-up 0.3s ease ${i * 0.07}s both`,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: -38,
                          top: 2,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: hsc.bg,
                          border: `2px solid ${hsc.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: isLast ? `0 0 0 4px ${hsc.dot}22` : "none",
                          zIndex: 1,
                          flexShrink: 0,
                        }}
                      >
                        <HIcon size={13} color={hsc.color} />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: isLast ? hsc.bg : "#f8fafc",
                          border: `1px solid ${isLast ? hsc.border : "#f1f5f9"}`,
                          borderRadius: 12,
                          padding: "10px 14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: hsc.color,
                              }}
                            >
                              {isUpdate ? "Progress Update" : h.status}
                            </span>
                            {isUpdate && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  background: "#fffbeb",
                                  color: "#b45309",
                                  padding: "1px 7px",
                                  borderRadius: 100,
                                  border: "1px solid #fde68a",
                                }}
                              >
                                from admin
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "#94a3b8",
                                fontWeight: 500,
                              }}
                            >
                              {time}
                            </span>
                            <span
                              style={{
                                width: 3,
                                height: 3,
                                borderRadius: "50%",
                                background: "#e2e8f0",
                                display: "inline-block",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                color: "#94a3b8",
                                fontWeight: 500,
                              }}
                            >
                              {date}
                            </span>
                          </div>
                        </div>
                        {(h.comment || h.remark) && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 5,
                              lineHeight: 1.5,
                            }}
                          >
                            {h.comment || h.remark}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <p
        className="fade-in"
        style={{
          textAlign: "center",
          fontSize: 11.5,
          color: "#e2e8f0",
          marginTop: 16,
        }}
      >
        🔒 Status updates are real-time and only visible to you.
      </p>
    </div>
  );
}
