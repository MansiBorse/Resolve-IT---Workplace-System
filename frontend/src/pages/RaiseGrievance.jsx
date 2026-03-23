import { useState } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  Building2,
  AlignLeft,
  Paperclip,
  X,
  CheckCircle2,
  Ticket,
  Tag,
  EyeOff,
} from "lucide-react";

const DEPT_CATEGORIES = {
  HR: [
    "Workplace Harassment",
    "Discrimination",
    "Leave Issue",
    "Attendance Issue",
    "Probation / Contract",
    "Termination / Resignation",
    "HR Policy Concern",
    "Other HR Issue",
  ],
  Finance: [
    "Salary Not Credited",
    "Wrong Salary Deduction",
    "Reimbursement Pending",
    "Bonus / Incentive Issue",
    "Tax / PF Deduction",
    "Expense Claim",
    "Other Finance Issue",
  ],
  IT: [
    "Laptop / System Not Working",
    "Software Access Issue",
    "Internet / Network Problem",
    "Email Issue",
    "Hardware Request",
    "Data / Security Concern",
    "Other IT Issue",
  ],
  Operations: [
    "Work Overload",
    "Process / Workflow Issue",
    "Shift Timing Problem",
    "Transport Issue",
    "Target / KPI Concern",
    "Other Operations Issue",
  ],
  Admin: [
    "AC / Ventilation Not Working",
    "Seating / Workspace Issue",
    "Cafeteria / Food Issue",
    "Cleanliness / Hygiene",
    "Parking Issue",
    "Security Concern",
    "Other Admin Issue",
  ],
};

const DEPARTMENTS = Object.keys(DEPT_CATEGORIES);

const PRIORITIES = [
  {
    value: "High",
    label: "High",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    dot: "#ef4444",
  },
  {
    value: "Medium",
    label: "Medium",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    dot: "#f59e0b",
  },
  {
    value: "Low",
    label: "Low",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    dot: "#10b981",
  },
];

export default function RaiseGrievance() {
  const [form, setForm] = useState({
    title: "",
    priority: "",
    department: "",
    category: "",
    description: "",
    isAnonymous: false,
  });
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleDeptChange = (dept) => {
    setForm((f) => ({ ...f, department: dept, category: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // ✅ Use FormData to send both fields and file together
      const formData = new FormData();
      formData.append(
        "employeeEmail",
        localStorage.getItem("lastLoggedInEmail") || "",
      );
      formData.append("title", form.title);
      formData.append("priority", form.priority);
      formData.append("department", form.department);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("isAnonymous", String(form.isAnonymous));
      if (file) formData.append("file", file);

      const response = await fetch("http://localhost:8080/api/grievances", {
        method: "POST",
        headers: token ? { Authorization: "Bearer " + token } : {},
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Submit error:", response.status, errText);
        alert("Failed to submit: " + response.status + " — " + errText);
        setLoading(false);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setTicketId(data.ticketId);
        setSuccess(true);
        setForm({
          title: "",
          priority: "",
          department: "",
          category: "",
          description: "",
          isAnonymous: false,
        });
        setFile(null);
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "9px 13px 9px 34px",
    borderRadius: 9,
    border: `1.5px solid ${focused === field ? "#2563eb" : "#e2e8f0"}`,
    background: focused === field ? "#fafbff" : "#fff",
    fontSize: 13.5,
    fontFamily: "'Outfit', sans-serif",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.18s",
    boxSizing: "border-box",
    boxShadow: focused === field ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
  });

  const selectedPriority = PRIORITIES.find((p) => p.value === form.priority);
  const categories = form.department ? DEPT_CATEGORIES[form.department] : [];

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Lora:wght@600;700&display=swap');
        @keyframes slide-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes success-pop { 0%{opacity:0;transform:scale(0.93) translateY(6px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes cat-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: slide-in 0.3s ease both; }
        .cat-appear { animation: cat-in 0.25s ease both; }
        .submit-btn { width:100%; padding:11px; border-radius:10px; border:none; background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; transition:all 0.22s; box-shadow:0 4px 14px rgba(15,23,42,0.16); display:flex; align-items:center; justify-content:center; gap:8px; }
        .submit-btn:hover:not(:disabled) { background:linear-gradient(135deg,#2563eb,#1d4ed8); transform:translateY(-1px); box-shadow:0 6px 20px rgba(37,99,235,0.28); }
        .submit-btn:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
        .priority-pill { display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:100px; border:1.5px solid; cursor:pointer; font-size:12px; font-weight:600; transition:all 0.15s; font-family:'Outfit',sans-serif; background:none; }
        .priority-pill:hover { transform:translateY(-1px); }
        .dept-chip { padding:5px 12px; border-radius:8px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:12px; font-weight:500; color:#64748b; cursor:pointer; transition:all 0.15s; font-family:'Outfit',sans-serif; }
        .dept-chip:hover { border-color:#bfdbfe; background:#eff6ff; color:#2563eb; }
        .dept-chip.selected { border-color:#2563eb; background:#eff6ff; color:#2563eb; font-weight:600; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .cat-chip { padding:5px 11px; border-radius:8px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:11.5px; font-weight:500; color:#64748b; cursor:pointer; transition:all 0.15s; font-family:'Outfit',sans-serif; }
        .cat-chip:hover { border-color:#c7d2fe; background:#eef2ff; color:#4f46e5; }
        .cat-chip.selected { border-color:#4f46e5; background:#eef2ff; color:#4f46e5; font-weight:600; box-shadow:0 0 0 3px rgba(79,70,229,0.08); }
        .upload-zone { border:2px dashed #e2e8f0; border-radius:10px; padding:10px 14px; cursor:pointer; transition:all 0.18s; display:flex; align-items:center; gap:12px; background:#fafbfc; }
        .upload-zone:hover, .upload-zone.drag-over { border-color:#2563eb; background:#eff6ff; }
        .success-banner { animation:success-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; background:linear-gradient(135deg,#ecfdf5,#d1fae5); border:1.5px solid #a7f3d0; border-radius:12px; padding:13px 16px; display:flex; align-items:flex-start; gap:12px; }
        .field-label { font-size:10.5px; font-weight:700; color:#94a3b8; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:5px; }
        .spinner { width:15px; height:15px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; animation:spin 0.7s linear infinite; }
        .anon-toggle { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; border:1.5px solid #e2e8f0; background:#f8fafc; cursor:pointer; transition:all 0.15s; user-select:none; }
        .anon-toggle.active { border-color:#8b5cf6; background:#f5f3ff; }
        .anon-toggle:hover { border-color:#c4b5fd; }
      `}</style>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: 14 }}>
        <h1
          style={{
            fontFamily: "'Lora',serif",
            fontSize: 23,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            marginBottom: 3,
          }}
        >
          Raise a Grievance
        </h1>
        <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
          Submit your concern securely. Our team will review and respond
          promptly.
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="success-banner" style={{ marginBottom: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={16} color="#fff" />
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#065f46",
                marginBottom: 2,
              }}
            >
              Grievance submitted successfully!
            </p>
            {ticketId && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 3,
                }}
              >
                <Ticket size={12} color="#059669" />
                <span
                  style={{ fontSize: 12, color: "#047857", fontWeight: 600 }}
                >
                  Ticket ID:
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#065f46",
                    background: "#fff",
                    padding: "2px 9px",
                    borderRadius: 100,
                    border: "1px solid #a7f3d0",
                  }}
                >
                  {ticketId}
                </span>
              </div>
            )}
            <p style={{ fontSize: 11.5, color: "#059669", marginTop: 4 }}>
              Save your Ticket ID to track status later.
            </p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div
        className="fade-in"
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e8edf5",
          boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
          overflow: "hidden",
          animationDelay: "0.06s",
        }}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#2563eb,#6366f1,#8b5cf6)",
          }}
        />

        <form onSubmit={handleSubmit} style={{ padding: "18px 20px 16px" }}>
          {/* Anonymous toggle */}
          <div style={{ marginBottom: 14 }}>
            <div
              className={`anon-toggle ${form.isAnonymous ? "active" : ""}`}
              onClick={() =>
                setForm((f) => ({ ...f, isAnonymous: !f.isAnonymous }))
              }
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: form.isAnonymous ? "#ede9fe" : "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
              >
                <EyeOff
                  size={14}
                  color={form.isAnonymous ? "#7c3aed" : "#94a3b8"}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: form.isAnonymous ? "#6d28d9" : "#374151",
                  }}
                >
                  Submit Anonymously
                </p>
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                  Your name will not be visible to admin
                </p>
              </div>
              <div
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: form.isAnonymous ? "#7c3aed" : "#e2e8f0",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: form.isAnonymous ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 13 }}>
            <p className="field-label">
              <FileText size={10} color="#94a3b8" />
              Grievance Title
            </p>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                <FileText
                  size={13}
                  color={focused === "title" ? "#2563eb" : "#cbd5e1"}
                />
              </div>
              <input
                type="text"
                placeholder="Brief title of your concern"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onFocus={() => setFocused("title")}
                onBlur={() => setFocused("")}
                style={inputStyle("title")}
                required
              />
            </div>
          </div>

          {/* Priority + Department */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 13,
              marginBottom: 13,
            }}
          >
            <div>
              <p className="field-label">
                <AlertCircle size={10} color="#94a3b8" />
                Priority
              </p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {PRIORITIES.map((p) => {
                  const sel = form.priority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      className="priority-pill"
                      onClick={() => setForm({ ...form, priority: p.value })}
                      style={{
                        borderColor: sel ? p.color : "#e2e8f0",
                        background: sel ? p.bg : "#f8fafc",
                        color: sel ? p.color : "#94a3b8",
                        boxShadow: sel ? `0 0 0 3px ${p.color}18` : "none",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sel ? p.dot : "#cbd5e1",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="field-label">
                <Building2 size={10} color="#94a3b8" />
                Department
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`dept-chip ${form.department === d ? "selected" : ""}`}
                    onClick={() => handleDeptChange(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          {form.department && (
            <div className="cat-appear" style={{ marginBottom: 13 }}>
              <p className="field-label">
                <Tag size={10} color="#94a3b8" />
                Category
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 400,
                    color: "#cbd5e1",
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  — what best describes your issue?
                </span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-chip ${form.category === cat ? "selected" : ""}`}
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: 13 }}>
            <p className="field-label">
              <AlignLeft size={10} color="#94a3b8" />
              Description
            </p>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 10,
                  pointerEvents: "none",
                }}
              >
                <AlignLeft
                  size={13}
                  color={focused === "desc" ? "#2563eb" : "#cbd5e1"}
                />
              </div>
              <textarea
                rows={3}
                placeholder="Describe your concern in detail..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                onFocus={() => setFocused("desc")}
                onBlur={() => setFocused("")}
                required
                style={{
                  ...inputStyle("desc"),
                  paddingTop: 9,
                  paddingBottom: 9,
                  resize: "none",
                  lineHeight: 1.55,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 7,
                  right: 10,
                  fontSize: 10,
                  color: form.description.length > 800 ? "#f59e0b" : "#cbd5e1",
                }}
              >
                {form.description.length}/1000
              </div>
            </div>
          </div>

          {/* Attachment */}
          <div style={{ marginBottom: 14 }}>
            <p className="field-label">
              <Paperclip size={10} color="#94a3b8" />
              Attachment
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 400,
                  color: "#cbd5e1",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                — optional
              </span>
            </p>
            <label
              className={`upload-zone ${dragOver ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: dragOver ? "#dbeafe" : "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.18s",
                }}
              >
                <Upload size={13} color={dragOver ? "#2563eb" : "#94a3b8"} />
              </div>
              <div style={{ flex: 1 }}>
                {file ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#2563eb",
                        }}
                      >
                        {file.name}
                      </p>
                      <p
                        style={{
                          fontSize: 10.5,
                          color: "#94a3b8",
                          marginTop: 1,
                        }}
                      >
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                      }}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#fef2f2",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={11} color="#ef4444" />
                    </button>
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "#475569",
                    }}
                  >
                    Drop here or{" "}
                    <span style={{ color: "#2563eb", fontWeight: 600 }}>
                      browse
                    </span>
                    <span
                      style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}
                    >
                      PDF, DOC, PNG up to 10MB
                    </span>
                  </p>
                )}
              </div>
              <input
                type="file"
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* Summary chips */}
          {(form.department ||
            selectedPriority ||
            form.category ||
            form.isAnonymous) && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              {form.isAnonymous && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 100,
                    background: "#f5f3ff",
                    color: "#7c3aed",
                    border: "1px solid #ddd6fe",
                  }}
                >
                  🔒 Anonymous
                </span>
              )}
              {form.department && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 100,
                    background: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  📁 {form.department}
                </span>
              )}
              {form.category && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 100,
                    background: "#eef2ff",
                    color: "#4f46e5",
                    border: "1px solid #c7d2fe",
                  }}
                >
                  🏷 {form.category}
                </span>
              )}
              {selectedPriority && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 100,
                    background: selectedPriority.bg,
                    color: selectedPriority.color,
                    border: `1px solid ${selectedPriority.border}`,
                  }}
                >
                  ● {selectedPriority.label} Priority
                </span>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading ||
              !form.title ||
              !form.priority ||
              !form.department ||
              !form.category ||
              !form.description
            }
          >
            {loading ? (
              <>
                <div className="spinner" />
                Submitting…
              </>
            ) : (
              <>Submit Grievance</>
            )}
          </button>

          {form.department && !form.category && (
            <p
              style={{
                fontSize: 11,
                color: "#f59e0b",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Please select a category to continue
            </p>
          )}
        </form>
      </div>

      <p
        className="fade-in"
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#cbd5e1",
          marginTop: 10,
          animationDelay: "0.1s",
        }}
      >
        🔒 Your submission is encrypted and only visible to authorized HR
        personnel.
      </p>
    </div>
  );
}
