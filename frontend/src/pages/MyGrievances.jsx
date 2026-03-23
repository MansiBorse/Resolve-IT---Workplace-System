import { useEffect, useState } from "react";

export default function MyGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("lastLoggedInEmail");
    const token = localStorage.getItem("token");
    if (!email) { setLoading(false); return; }

    fetch(`http://localhost:8080/api/grievances/employee/${email}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setGrievances(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching grievances:", err))
      .finally(() => setLoading(false));
  }, []);

  const copyId = (ticketId) => {
    navigator.clipboard.writeText(ticketId);
    setCopied(ticketId);
    setTimeout(() => setCopied(null), 2000);
  };

  const statusStyle = (status) => {
    if (status === "Pending")
      return { bg: "#fef9c3", color: "#92400e", dot: "#f59e0b" };
    if (status === "In Progress")
      return { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" };
    return { bg: "#dcfce7", color: "#166534", dot: "#22c55e" };
  };

  const COLS = ["Ticket ID", "Title", "Date", "Status", "Action"];

  return (
    <div
      style={{
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background: "#f1f5f9",
        minHeight: "100vh",
        padding: "32px 36px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .mgtr:hover td { background: #f8fafc; }
        .mgtr td { transition: background 0.1s; }
        .copy-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:8px; border:1px solid #e2e8f0; background:white; font-size:12px; font-weight:500; color:#374151; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .copy-btn:hover { border-color:#3b82f6; color:#3b82f6; }
        .copy-btn.copied { border-color:#22c55e; color:#166534; background:#dcfce7; }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
          My Grievances
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
          {grievances.length} grievance{grievances.length !== 1 ? "s" : ""} raised
        </p>
      </div>

      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ margin: "0 auto 12px", display: "block", animation: "spin 1s linear infinite" }}>
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Loading your grievances...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ margin: "0 auto 14px", display: "block" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500, margin: 0 }}>
              No grievances raised yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {COLS.map((h) => (
                    <th key={h} style={{ padding: "13px 20px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left", whiteSpace: "nowrap", background: "#fafafa" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grievances.map((g) => {
                  const ss = statusStyle(g.status);
                  const isCopied = copied === g.ticketId;
                  return (
                    <tr key={g.id} className="mgtr" style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#3b82f6" }}>{g.ticketId}</span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>
                          {g.title}
                        </p>
                        {g.description && (
                          <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>
                            {g.description}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 12.5, color: "#374151" }}>
                          {new Date(g.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: ss.bg, color: ss.color, whiteSpace: "nowrap" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: ss.dot, flexShrink: 0 }} />
                          {g.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button className={`copy-btn${isCopied ? " copied" : ""}`} onClick={() => copyId(g.ticketId)}>
                          {isCopied ? (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              Copy ID
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}