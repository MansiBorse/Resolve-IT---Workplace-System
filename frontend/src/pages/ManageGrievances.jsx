import { useEffect, useState, useMemo } from "react";

export default function ManageGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [resolveModal, setResolveModal] = useState(null);
  const [resolveNote, setResolveNote] = useState("");
  const [resolving, setResolving] = useState(false);
  const [updateModal, setUpdateModal] = useState(null);
  const [updateNote, setUpdateNote] = useState("");
  const [updateSaving, setUpdateSaving] = useState(false);
  // ✅ NEW: attachment preview modal
  const [attachModal, setAttachModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/grievances");
      const data = await res.json();
      setGrievances(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, newStatus) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g)),
    );
    setUpdating(id);
    try {
      await fetch(
        `http://localhost:8080/api/grievances/update-status/${id}?status=${encodeURIComponent(newStatus)}&changedBy=Admin`,
        { method: "PUT" },
      );
    } catch (err) {
      console.error(err);
      load();
    } finally {
      setUpdating(null);
    }
  };

  const submitResolve = async () => {
    if (!resolveNote.trim()) return;
    setResolving(true);
    try {
      await fetch(
        `http://localhost:8080/api/grievances/update-status/${resolveModal.id}?status=Resolved&resolutionNote=${encodeURIComponent(resolveNote)}&changedBy=Admin`,
        { method: "PUT" },
      );
      setGrievances((prev) =>
        prev.map((g) =>
          g.id === resolveModal.id
            ? { ...g, status: "Resolved", resolutionNote: resolveNote }
            : g,
        ),
      );
      setResolveModal(null);
      setResolveNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  const submitUpdate = async () => {
    if (!updateNote.trim()) return;
    setUpdateSaving(true);
    try {
      await fetch(
        `http://localhost:8080/api/grievances/update-status/${updateModal.id}?status=In Progress&resolutionNote=${encodeURIComponent(updateNote)}&changedBy=Admin`,
        { method: "PUT" },
      );
      setUpdateModal(null);
      setUpdateNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateSaving(false);
    }
  };

  // ✅ View attachment inline (PDF preview in browser)
  const viewAttachment = (g) => {
    setAttachModal(g);
  };

  // ✅ Download attachment
  const downloadAttachment = (g) => {
    window.open(
      `http://localhost:8080/api/grievances/attachment/${g.ticketId}?download=true`,
      "_blank",
    );
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return grievances;
    return grievances.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.ticketId?.toLowerCase().includes(q) ||
        g.employeeEmail?.toLowerCase().includes(q) ||
        g.department?.toLowerCase().includes(q),
    );
  }, [grievances, search]);

  const counts = useMemo(
    () => ({
      total: grievances.length,
      pending: grievances.filter((g) => g.status === "Pending").length,
      inProgress: grievances.filter((g) => g.status === "In Progress").length,
      resolved: grievances.filter((g) => g.status === "Resolved").length,
      escalated: grievances.filter((g) => g.status === "Escalated").length,
    }),
    [grievances],
  );

  const statusCfg = (status) => {
    if (status === "Pending")
      return { dot: "#f59e0b", color: "#92400e", bg: "#fef9c3" };
    if (status === "In Progress")
      return { dot: "#3b82f6", color: "#1e40af", bg: "#dbeafe" };
    if (status === "Escalated")
      return { dot: "#ef4444", color: "#991b1b", bg: "#fee2e2" };
    return { dot: "#22c55e", color: "#166534", bg: "#dcfce7" };
  };

  const initials = (email = "") => {
    const name = email.includes("@") ? email.split("@")[0] : email;
    const parts = name.split(/[._-]/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const STAT_CARDS = [
    { label: "Total", value: counts.total, accent: "#e2e8f0" },
    { label: "Pending", value: counts.pending, accent: "#f59e0b" },
    { label: "In Progress", value: counts.inProgress, accent: "#3b82f6" },
    { label: "Resolved", value: counts.resolved, accent: "#22c55e" },
    { label: "Escalated", value: counts.escalated, accent: "#ef4444" },
  ];

  const UPDATE_SUGGESTIONS = [
    "Contacted the concerned team",
    "Waiting for response from department",
    "Under investigation",
    "Escalated to senior management",
    "Awaiting approval",
    "Partially resolved, working on full fix",
  ];

  // check if file is a PDF
  const isPDF = (name) => name && name.toLowerCase().endsWith(".pdf");

  return (
    <div
      style={{
        fontFamily: "\'Inter\',\'Segoe UI\',sans-serif",
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "32px 36px",
      }}
    >
      <style>{`
        @import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .mgtr td { transition: background 0.1s; }
        .mgtr:not(.resolved-row):hover td { background: #f8fafc; }
        .resolved-row td { background: #f8fffe !important; opacity: 0.82; }
        .escalated-row td { background: #fff8f8 !important; }
        .search-inp { width:290px; padding:9px 12px 9px 36px; border-radius:9px; border:1px solid #e2e8f0; background:white; font-size:13px; font-family:inherit; color:#1e293b; outline:none; transition:border-color .15s,box-shadow .15s; }
        .search-inp:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
        .refresh-btn { display:flex; align-items:center; gap:7px; padding:9px 16px; border-radius:9px; border:1px solid #e2e8f0; background:white; font-size:13px; font-weight:500; color:#374151; cursor:pointer; font-family:inherit; transition:border-color .15s,color .15s; box-shadow:0 1px 2px rgba(0,0,0,0.04); }
        .refresh-btn:hover { border-color:#3b82f6; color:#3b82f6; }
        .completed-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:8px; background:#f0fdf4; border:1px solid #bbf7d0; font-size:12px; font-weight:600; color:#166534; white-space:nowrap; }
        .ack-btn { padding:6px 12px; border-radius:8px; border:1.5px solid #3b82f6; background:#eff6ff; color:#1d4ed8; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .15s; }
        .ack-btn:hover { background:#dbeafe; }
        .ack-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .update-btn { padding:6px 12px; border-radius:8px; border:1.5px solid #f59e0b; background:#fffbeb; color:#b45309; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .15s; }
        .update-btn:hover { background:#fef3c7; }
        .update-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .resolve-btn { padding:6px 14px; border-radius:8px; border:none; background:#10b981; color:#fff; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .15s; }
        .resolve-btn:hover { background:#059669; transform:translateY(-1px); }
        .resolve-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .view-btn { padding:6px 12px; border-radius:8px; border:1.5px solid #8b5cf6; background:#f5f3ff; color:#6d28d9; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .15s; }
        .view-btn:hover { background:#ede9fe; }
        .dl-btn { padding:6px 12px; border-radius:8px; border:1.5px solid #0ea5e9; background:#f0f9ff; color:#0369a1; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .15s; }
        .dl-btn:hover { background:#e0f2fe; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:999; animation:fadeUp .2s ease; }
        .res-textarea { width:100%; padding:10px 12px; border-radius:10px; border:1.5px solid #e2e8f0; font-size:13px; font-family:inherit; resize:vertical; min-height:80px; outline:none; box-sizing:border-box; transition:border-color .15s; }
        .res-textarea:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.08); }
        .suggestion-chip { padding:4px 10px; border-radius:20px; border:1px solid #e2e8f0; background:#f8fafc; font-size:11px; font-weight:500; color:#64748b; cursor:pointer; font-family:inherit; transition:all .15s; white-space:nowrap; }
        .suggestion-chip:hover { border-color:#f59e0b; background:#fffbeb; color:#b45309; }
      `}</style>

      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1e293b",
              margin: "0 0 4px",
            }}
          >
            Manage Grievances
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            Review and update grievance statuses
          </p>
        </div>
        <button className="refresh-btn" onClick={load}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              borderTop: `3px solid ${s.accent}`,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color:
                  s.label === "Escalated" && s.value > 0
                    ? "#ef4444"
                    : "#1e293b",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-inp"
            placeholder="Search by title, ticket ID, employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        {search && (
          <span style={{ marginLeft: 12, fontSize: 12.5, color: "#94a3b8" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
            {search}"
          </span>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                margin: "0 auto 12px",
                display: "block",
                animation: "spin 1s linear infinite",
              }}
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              Loading grievances…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#94a3b8",
                margin: "0 0 8px",
              }}
            >
              No grievances found.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  fontSize: 12.5,
                  color: "#3b82f6",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {[
                    "Ticket ID",
                    "Employee",
                    "Title",
                    "Dept",
                    "Priority",
                    "Attachment",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        background: "#fafafa",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => {
                  const busy = updating === g.id;
                  const ss = statusCfg(g.status);
                  const ini = g.isAnonymous
                    ? "?"
                    : initials(g.employeeEmail || g.employee || "");
                  const isResolved = g.status === "Resolved";
                  const isInProgress = g.status === "In Progress";
                  const isEscalated = g.status === "Escalated";
                  const hasAttachment = g.attachment && g.attachmentUrl;

                  return (
                    <tr
                      key={g.id}
                      className={`mgtr${isResolved ? " resolved-row" : ""}${isEscalated ? " escalated-row" : ""}`}
                      style={{ borderBottom: "1px solid #f8fafc" }}
                    >
                      {/* Ticket ID */}
                      <td
                        style={{ padding: "14px 16px", whiteSpace: "nowrap" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {isEscalated && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#991b1b",
                                background: "#fee2e2",
                                padding: "2px 6px",
                                borderRadius: 4,
                              }}
                            >
                              ⚠ URGENT
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: isResolved
                                ? "#94a3b8"
                                : isEscalated
                                  ? "#ef4444"
                                  : "#3b82f6",
                            }}
                          >
                            {g.ticketId || `#${g.id}`}
                          </span>
                        </div>
                      </td>

                      {/* Employee */}
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: isEscalated ? "#fee2e2" : "#f1f5f9",
                              border: `1px solid ${isEscalated ? "#fca5a5" : "#e2e8f0"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10.5,
                              fontWeight: 600,
                              color: isEscalated ? "#991b1b" : "#475569",
                              flexShrink: 0,
                            }}
                          >
                            {ini}
                          </div>
                          <span
                            style={{
                              fontSize: 12.5,
                              color: "#374151",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 140,
                            }}
                          >
                            {g.isAnonymous
                              ? "Anonymous"
                              : g.employeeEmail || g.employee || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Title */}
                      <td style={{ padding: "14px 16px" }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: isResolved ? "#94a3b8" : "#1e293b",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 200,
                            textDecoration: isResolved
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {g.title || "—"}
                        </p>
                        {isResolved && g.resolutionNote && (
                          <p
                            style={{
                              fontSize: 11,
                              color: "#10b981",
                              margin: "3px 0 0",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 200,
                              fontWeight: 500,
                            }}
                          >
                            ✓ {g.resolutionNote}
                          </p>
                        )}
                        {isEscalated && (
                          <p
                            style={{
                              fontSize: 11,
                              color: "#ef4444",
                              margin: "3px 0 0",
                              fontWeight: 500,
                            }}
                          >
                            Not resolved within 7 days
                          </p>
                        )}
                      </td>

                      {/* Department */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 12.5, color: "#374151" }}>
                          {g.department || "—"}
                        </span>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: g.priority ? 500 : 400,
                            color:
                              g.priority === "High"
                                ? "#b91c1c"
                                : g.priority === "Medium"
                                  ? "#92400e"
                                  : g.priority === "Low"
                                    ? "#166534"
                                    : "#94a3b8",
                          }}
                        >
                          {g.priority || "—"}
                        </span>
                      </td>

                      {/* ✅ Attachment column */}
                      <td
                        style={{ padding: "14px 16px", whiteSpace: "nowrap" }}
                      >
                        {hasAttachment ? (
                          <div
                            style={{
                              display: "flex",
                              gap: 5,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              className="view-btn"
                              onClick={() => viewAttachment(g)}
                            >
                              View PDF
                            </button>
                            <button
                              className="dl-btn"
                              onClick={() => downloadAttachment(g)}
                            >
                              Download
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                            No file
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: ss.bg,
                            color: ss.color,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: ss.dot,
                              flexShrink: 0,
                            }}
                          />
                          {g.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: "14px 16px" }}>
                        {isResolved ? (
                          <div className="completed-chip">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#166534"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Completed
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            {g.status === "Pending" && (
                              <button
                                className="ack-btn"
                                disabled={busy}
                                onClick={() =>
                                  updateStatus(g.id, "In Progress")
                                }
                              >
                                Acknowledge
                              </button>
                            )}
                            {(isInProgress || isEscalated) && (
                              <>
                                <button
                                  className="update-btn"
                                  disabled={busy}
                                  onClick={() => {
                                    setUpdateModal(g);
                                    setUpdateNote("");
                                  }}
                                >
                                  + Update
                                </button>
                                <button
                                  className="resolve-btn"
                                  disabled={busy}
                                  onClick={() => {
                                    setResolveModal(g);
                                    setResolveNote("");
                                  }}
                                >
                                  Resolve
                                </button>
                              </>
                            )}
                            {busy && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#94a3b8"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                  animation: "spin 0.8s linear infinite",
                                  flexShrink: 0,
                                }}
                              >
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                              </svg>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Showing {filtered.length} of {grievances.length} grievances
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Attachment Preview Modal */}
      {attachModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAttachModal(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 0,
              width: "90%",
              maxWidth: 760,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  {attachModal.attachment}
                </p>
                <p
                  style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}
                >
                  {attachModal.ticketId} — {attachModal.title}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  className="dl-btn"
                  onClick={() => downloadAttachment(attachModal)}
                >
                  Download
                </button>
                <button
                  onClick={() => setAttachModal(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 22,
                    color: "#94a3b8",
                    lineHeight: 1,
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            {/* PDF iframe or image preview */}
            <div style={{ background: "#f8fafc", padding: 0 }}>
              {isPDF(attachModal.attachment) ? (
                <iframe
                  src={`http://localhost:8080/api/grievances/attachment/${attachModal.ticketId}?download=false`}
                  style={{ width: "100%", height: 520, border: "none" }}
                  title="PDF Preview"
                />
              ) : (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <img
                    src={`http://localhost:8080/api/grievances/attachment/${attachModal.ticketId}?download=false`}
                    alt="Attachment"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 480,
                      borderRadius: 8,
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {updateModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setUpdateModal(null);
              setUpdateNote("");
            }
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 28,
              width: 460,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: "0 0 3px",
                  }}
                >
                  Add Progress Update
                </h3>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                  {updateModal.ticketId} — {updateModal.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setUpdateModal(null);
                  setUpdateNote("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  color: "#94a3b8",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            {updateModal.status === "Escalated" && (
              <div
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#991b1b",
                  fontWeight: 600,
                }}
              >
                ⚠ This grievance has been auto-escalated due to no action for 7+
                days
              </div>
            )}
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 14,
                fontSize: 12,
                color: "#b45309",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b45309"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Employee will be notified and can see this update in their
              timeline
            </div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
                display: "block",
              }}
            >
              Quick suggestions
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {UPDATE_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => setUpdateNote(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
                display: "block",
              }}
            >
              Update message <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              className="res-textarea"
              placeholder="e.g. Contacted payroll team. Waiting for bank confirmation."
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              style={{ marginBottom: 18 }}
            />
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => {
                  setUpdateModal(null);
                  setUpdateNote("");
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#64748b",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitUpdate}
                disabled={!updateNote.trim() || updateSaving}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: updateNote.trim() ? "#f59e0b" : "#e2e8f0",
                  color: updateNote.trim() ? "#fff" : "#94a3b8",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: updateNote.trim() ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  transition: "all .15s",
                }}
              >
                {updateSaving ? "Saving..." : "Send Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setResolveModal(null);
              setResolveNote("");
            }
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 28,
              width: 440,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: "0 0 3px",
                  }}
                >
                  Mark as Resolved
                </h3>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                  {resolveModal.ticketId} — {resolveModal.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setResolveModal(null);
                  setResolveNote("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  color: "#94a3b8",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            {resolveModal.status === "Escalated" && (
              <div
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#991b1b",
                  fontWeight: 600,
                }}
              >
                ⚠ Escalated case — please provide a detailed resolution note
              </div>
            )}
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
                display: "block",
              }}
            >
              What was done? <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              className="res-textarea"
              placeholder="e.g. Salary credited. Confirmed with payroll and bank."
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              style={{ marginBottom: 14 }}
            />
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 18,
                fontSize: 12,
                color: "#166534",
              }}
            >
              Employee will see this note in their ticket tracking page.
            </div>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => {
                  setResolveModal(null);
                  setResolveNote("");
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#64748b",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitResolve}
                disabled={!resolveNote.trim() || resolving}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: resolveNote.trim() ? "#10b981" : "#e2e8f0",
                  color: resolveNote.trim() ? "#fff" : "#94a3b8",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: resolveNote.trim() ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  transition: "all .15s",
                }}
              >
                {resolving ? "Saving..." : "Mark Resolved"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
