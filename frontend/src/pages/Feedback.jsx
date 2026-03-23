import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MessageSquare,
  Building2,
  Smile,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const EXPERIENCES = [
  {
    label: "Excellent",
    emoji: "🌟",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    label: "Satisfactory",
    emoji: "👍",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    label: "Needs Improvement",
    emoji: "💬",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function Feedback() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  const employeeName = user?.email;
  const token = localStorage.getItem("token");

  const [resolvedCases, setResolvedCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [step, setStep] = useState(1);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [form, setForm] = useState({ experience: "", message: "" });
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCases, setLoadingCases] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/grievances/employee/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const resolved = data.filter((g) => g.status === "Resolved");
        setResolvedCases(resolved);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCases(false));
  }, [email]);

  const handleSelectCase = (grievance) => {
    setSelectedCase(grievance);
    setStep(2);
    setRating(0);
    setForm({ experience: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeName: employeeName,
          department: selectedCase.department,
          experience: form.experience,
          message: form.message,
          rating,
        }),
      });
      if (response.ok) {
        alert("✅ Feedback submitted successfully!");
        navigate("/employee-dashboard");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = rating > 0 && form.experience && form.message;

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Lora:wght@600;700&display=swap');
        @keyframes fade-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .feedback-card { animation: fade-up 0.35s ease both; }
        .star-btn { background:none; border:none; cursor:pointer; padding:2px; transition:transform 0.12s; }
        .star-btn:hover { transform:scale(1.2); }
        .exp-btn { cursor:pointer; border-radius:10px; padding:9px 12px; border:1.5px solid; transition:all 0.15s; font-family:'Outfit',sans-serif; font-size:12.5px; font-weight:500; text-align:center; }
        .exp-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.07); }
        .submit-btn { flex:1; padding:11px; border-radius:10px; border:none; background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 14px rgba(15,23,42,0.15); }
        .submit-btn:hover:not(:disabled) { background:linear-gradient(135deg,#2563eb,#1d4ed8); transform:translateY(-1px); box-shadow:0 6px 20px rgba(37,99,235,0.28); }
        .submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .cancel-btn { flex:1; padding:11px; border-radius:10px; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .cancel-btn:hover { background:#f8fafc; border-color:#cbd5e1; }
        .field-label { font-size:11px; font-weight:700; color:#94a3b8; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
        .case-card { border:1.5px solid #e2e8f0; border-radius:12px; padding:14px 16px; cursor:pointer; transition:all 0.15s; background:#fff; display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .case-card:hover { border-color:#2563eb; background:#f8fbff; box-shadow:0 4px 12px rgba(37,99,235,0.08); }
        .spinner { width:15px; height:15px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .back-btn { background:none; border:none; color:#64748b; font-family:'Outfit',sans-serif; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:4px; padding:0; margin-bottom:16px; }
        .back-btn:hover { color:#1e293b; }
      `}</style>

      <div className="feedback-card" style={{ width: "100%", maxWidth: 500 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <MessageSquare size={20} color="#2563eb" />
          </div>
          <h1
            style={{
              fontFamily: "'Lora',serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            {step === 1 ? "Select a Case" : "Share Feedback"}
          </h1>
          <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
            {step === 1
              ? "Choose a resolved grievance to give feedback on"
              : "Help us improve the grievance resolution process."}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            border: "1px solid #e8edf5",
            boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg,#2563eb,#6366f1,#8b5cf6)",
            }}
          />

          <div style={{ padding: "22px 22px 20px" }}>
            {/* STEP 1 — Pick case */}
            {step === 1 && (
              <>
                {loadingCases ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px 0",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    Loading resolved cases...
                  </div>
                ) : resolvedCases.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0" }}>
                    <CheckCircle
                      size={36}
                      color="#e2e8f0"
                      style={{ marginBottom: 10 }}
                    />
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "#94a3b8",
                        fontWeight: 500,
                      }}
                    >
                      No resolved cases found.
                    </p>
                    <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>
                      Feedback can only be given on resolved grievances.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {resolvedCases.map((g) => (
                      <div
                        key={g.id}
                        className="case-card"
                        onClick={() => handleSelectCase(g)}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 5,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#2563eb",
                                background: "#eff6ff",
                                padding: "2px 8px",
                                borderRadius: 6,
                              }}
                            >
                              {g.ticketId}
                            </span>
                            {g.category && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "#7c3aed",
                                  background: "#f5f3ff",
                                  padding: "2px 8px",
                                  borderRadius: 6,
                                }}
                              >
                                {g.category}
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: "#1e293b",
                              marginBottom: 3,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {g.title}
                          </p>
                          <p style={{ fontSize: 11.5, color: "#94a3b8" }}>
                            Resolved on{" "}
                            {new Date(g.resolvedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <ChevronRight size={16} color="#cbd5e1" />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  <button className="cancel-btn" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 — Fill feedback form */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(1)}
                >
                  ← Back to cases
                </button>

                {/* Selected case info */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#2563eb",
                        background: "#eff6ff",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {selectedCase.ticketId}
                    </span>
                    {selectedCase.category && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#7c3aed",
                          background: "#f5f3ff",
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {selectedCase.category}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {selectedCase.title}
                  </p>
                </div>

                {/* Experience */}
                <div style={{ marginBottom: 18 }}>
                  <p className="field-label">
                    <Smile size={10} color="#94a3b8" />
                    Overall Experience
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {EXPERIENCES.map((opt) => {
                      const sel = form.experience === opt.label;
                      return (
                        <div
                          key={opt.label}
                          className="exp-btn"
                          onClick={() =>
                            setForm({ ...form, experience: opt.label })
                          }
                          style={{
                            borderColor: sel ? opt.color : "#e2e8f0",
                            background: sel ? opt.bg : "#f8fafc",
                            color: sel ? opt.color : "#94a3b8",
                            boxShadow: sel
                              ? `0 0 0 3px ${opt.color}18`
                              : "none",
                          }}
                        >
                          <div style={{ fontSize: 18, marginBottom: 3 }}>
                            {opt.emoji}
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              fontWeight: sel ? 700 : 500,
                              lineHeight: 1.3,
                            }}
                          >
                            {opt.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Star Rating */}
                <div style={{ marginBottom: 18 }}>
                  <p className="field-label">
                    <Star size={10} color="#94a3b8" />
                    Rate Our Service
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hover || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          className="star-btn"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <Star
                            size={26}
                            fill={active ? "#fbbf24" : "none"}
                            color={active ? "#fbbf24" : "#e2e8f0"}
                            strokeWidth={1.5}
                          />
                        </button>
                      );
                    })}
                    {rating > 0 && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#f59e0b",
                          background: "#fffbeb",
                          padding: "3px 10px",
                          borderRadius: 100,
                          border: "1px solid #fde68a",
                        }}
                      >
                        {RATING_LABELS[rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div style={{ marginBottom: 20 }}>
                  <p className="field-label">
                    <MessageSquare size={10} color="#94a3b8" />
                    Additional Comments
                  </p>
                  <textarea
                    rows={3}
                    placeholder="Share your detailed feedback..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onFocus={() => setFocused("msg")}
                    onBlur={() => setFocused("")}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 13px",
                      borderRadius: 10,
                      border: `1.5px solid ${focused === "msg" ? "#2563eb" : "#e2e8f0"}`,
                      background: focused === "msg" ? "#fafbff" : "#fff",
                      fontSize: 13,
                      fontFamily: "'Outfit',sans-serif",
                      color: "#0f172a",
                      outline: "none",
                      resize: "none",
                      transition: "all 0.18s",
                      boxShadow:
                        focused === "msg"
                          ? "0 0 0 3px rgba(37,99,235,0.08)"
                          : "none",
                      lineHeight: 1.6,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={!canSubmit || loading}
                  >
                    {loading ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <div className="spinner" />
                        Submitting…
                      </span>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11.5,
            color: "#cbd5e1",
            marginTop: 14,
          }}
        >
          🔒 Your feedback is anonymous and helps us serve you better.
        </p>
      </div>
    </div>
  );
}
