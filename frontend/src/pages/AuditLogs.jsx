import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/audit-logs")
      .then((res) => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const badgeStyles = {
    LOGIN: { bg: "#F1EFE8", color: "#5F5E5A" },
    CREATED_USER: { bg: "#EAF3DE", color: "#3B6D11" },
    CREATED_GRIEVANCE: { bg: "#EAF3DE", color: "#3B6D11" },
    SUBMITTED_FEEDBACK: { bg: "#EEEDFE", color: "#534AB7" },
    RESOLVED_GRIEVANCE: { bg: "#E1F5EE", color: "#0F6E56" },
    REJECTED_GRIEVANCE: { bg: "#FCEBEB", color: "#A32D2D" },
    STATUS_CHANGED: { bg: "#E6F1FB", color: "#185FA5" },
    SEND_OTP: { bg: "#FAEEDA", color: "#854F0B" },
    RESET_PASSWORD: { bg: "#FAECE7", color: "#993C1D" },
  };

  const filtered = logs.filter(
    (l) =>
      (!search ||
        l.adminEmail?.toLowerCase().includes(search.toLowerCase()) ||
        l.details?.toLowerCase().includes(search.toLowerCase()) ||
        l.entityId?.toLowerCase().includes(search.toLowerCase())) &&
      (!filterAction || l.action === filterAction),
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (email) => {
    if (!email) return "?";
    return email.substring(0, 2).toUpperCase();
  };

  const th = {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#999",
    borderBottom: "1px solid #f0f0f0",
    background: "#fafafa",
  };
  const td = { padding: "10px 14px", verticalAlign: "middle" };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "4px" }}
        >
          Audit Logs
        </h2>
        <p style={{ fontSize: "13px", color: "#888" }}>
          Track all admin and user actions in the system
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by email, details, ticket ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "8px 12px",
            fontSize: "13px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
          }}
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: "13px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="">All Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="CREATED_USER">CREATED USER</option>
          <option value="CREATED_GRIEVANCE">CREATED GRIEVANCE</option>
          <option value="RESOLVED_GRIEVANCE">RESOLVED GRIEVANCE</option>
          <option value="REJECTED_GRIEVANCE">REJECTED GRIEVANCE</option>
          <option value="STATUS_CHANGED">STATUS CHANGED</option>
          <option value="SUBMITTED_FEEDBACK">SUBMITTED FEEDBACK</option>
          <option value="SEND_OTP">SEND OTP</option>
          <option value="RESET_PASSWORD">RESET PASSWORD</option>
        </select>
      </div>

      {/* Count */}
      <p style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>
        Showing {filtered.length} of {logs.length} logs
      </p>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
          Loading logs...
        </p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
          No logs found
        </p>
      ) : (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Action</th>
                <th style={th}>Target</th>
                <th style={th}>Details</th>
                <th style={th}>IP Address</th>
                <th style={th}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const badge = badgeStyles[log.action] || {
                  bg: "#F1EFE8",
                  color: "#5F5E5A",
                };
                return (
                  <tr
                    key={log.id}
                    style={{ borderTop: "1px solid #f0f0f0" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafafa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#E6F1FB",
                            color: "#185FA5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: "600",
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(log.adminEmail)}
                        </div>
                        <span style={{ color: "#333" }}>{log.adminEmail}</span>
                      </div>
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          padding: "3px 10px",
                          borderRadius: "99px",
                          fontSize: "11px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {log.action?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ ...td, color: "#888" }}>
                      {log.entityId || "—"}
                    </td>
                    <td style={{ ...td, color: "#888", maxWidth: "220px" }}>
                      {log.details}
                    </td>
                    <td
                      style={{
                        ...td,
                        color: "#aaa",
                        fontFamily: "monospace",
                        fontSize: "12px",
                      }}
                    >
                      {log.ipAddress || "—"}
                    </td>
                    <td style={{ ...td, color: "#aaa", whiteSpace: "nowrap" }}>
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
