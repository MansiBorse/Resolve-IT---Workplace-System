import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [name, setName] = useState(storedUser?.name || "");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const rawName = storedUser?.name || "Employee";
  const displayName = rawName.includes("@") ? rawName.split("@")[0] : rawName;
  const initials = displayName
    .split(/[\s._-]/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const loadAvatar = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("avatar", reader.result);
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setError("");
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setError("Enter your current password.");
        return;
      }
      if (currentPassword !== storedUser.password) {
        setError("Current password is incorrect.");
        return;
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
    }
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        name,
        ...(newPassword ? { password: newPassword } : {}),
      }),
    );
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/view-profile");
    }, 1500);
  };

  const f = (field) => ({
    width: "100%",
    padding: "10px 13px 10px 13px",
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

  const pwStrength = !newPassword
    ? 0
    : newPassword.length < 6
      ? 1
      : newPassword.length < 10
        ? 2
        : 3;
  const strengthColor = ["#e2e8f0", "#ef4444", "#f59e0b", "#10b981"][
    pwStrength
  ];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][pwStrength];

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Lora:wght@700&display=swap');
        @keyframes fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fade-up 0.3s ease both; }
        .lbl { font-size:11px; font-weight:700; color:#94a3b8; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:6px; }
        .eye-btn { position:absolute; right:11px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#94a3b8; display:flex; padding:0; }
        .eye-btn:hover { color:#475569; }
        .save-btn { width:100%; padding:12px; border-radius:10px; border:none; background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; transition:all 0.2s; box-shadow:0 3px 12px rgba(15,23,42,0.15); display:flex; align-items:center; justify-content:center; gap:7px; }
        .save-btn:hover { background:linear-gradient(135deg,#2563eb,#1d4ed8); transform:translateY(-1px); box-shadow:0 5px 18px rgba(37,99,235,0.25); }
      `}</style>

      {/* Header */}
      <div className="fade-in" style={{ marginBottom: 18 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 12.5,
            fontWeight: 500,
            marginBottom: 10,
            padding: 0,
            fontFamily: "'Outfit',sans-serif",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <h1
          style={{
            fontFamily: "'Lora',serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            marginBottom: 2,
          }}
        >
          Edit Profile
        </h1>
        <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
          Update your info and password.
        </p>
      </div>

      {/* Card */}
      <div
        className="fade-in"
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e8edf5",
          overflow: "hidden",
          boxShadow: "0 2px 14px rgba(15,23,42,0.07)",
          animationDelay: "0.05s",
        }}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#2563eb,#6366f1,#8b5cf6)",
          }}
        />

        <div style={{ padding: "20px 22px 20px" }}>
          {/* ── Photo ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e2e8f0",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: 18,
                    fontWeight: 700,
                    border: "2px solid #e2e8f0",
                    letterSpacing: "0.03em",
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Upload / Remove */}
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0f172a",
                  marginBottom: 8,
                }}
              >
                Profile Photo
              </p>
              <div style={{ display: "flex", gap: 7 }}>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#bfdbfe";
                    e.currentTarget.style.color = "#2563eb";
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#475569";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => loadAvatar(e.target.files[0])}
                  />
                </label>
                {avatar && (
                  <button
                    onClick={() => {
                      localStorage.removeItem("avatar");
                      setAvatar("");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "1.5px solid #fecaca",
                      background: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#ef4444",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fef2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize: 11, color: "#cbd5e1", marginTop: 5 }}>
                JPG or PNG, max 5MB
              </p>
            </div>
          </div>

          {/* ── Name ── */}
          <div style={{ marginBottom: 14 }}>
            <p className="lbl">Full Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
              placeholder="Your full name"
              style={f("name")}
            />
          </div>

          {/* ── Email read-only ── */}
          {storedUser?.email && (
            <div
              style={{
                marginBottom: 18,
                paddingBottom: 18,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <p className="lbl">Email</p>
              <div
                style={{
                  padding: "10px 13px",
                  borderRadius: 9,
                  border: "1.5px solid #f1f5f9",
                  background: "#f8fafc",
                  fontSize: 13.5,
                  color: "#94a3b8",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                {storedUser.email}
              </div>
            </div>
          )}

          {/* ── Password heading ── */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Change Password{" "}
            <span
              style={{
                fontWeight: 400,
                textTransform: "none",
                color: "#cbd5e1",
                letterSpacing: 0,
              }}
            >
              — optional
            </span>
          </p>

          {/* Current */}
          <div style={{ marginBottom: 10 }}>
            <p className="lbl">Current Password</p>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onFocus={() => setFocused("cur")}
                onBlur={() => setFocused("")}
                style={{ ...f("cur"), paddingRight: 38 }}
              />
              <button
                className="eye-btn"
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New */}
          <div style={{ marginBottom: 6 }}>
            <p className="lbl">New Password</p>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocused("new")}
                onBlur={() => setFocused("")}
                style={{ ...f("new"), paddingRight: 38 }}
              />
              <button
                className="eye-btn"
                type="button"
                onClick={() => setShowNew((v) => !v)}
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Strength */}
          {newPassword.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: i <= pwStrength ? strengthColor : "#f1f5f9",
                    transition: "background 0.3s",
                  }}
                />
              ))}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: strengthColor,
                  minWidth: 36,
                }}
              >
                {strengthLabel}
              </span>
            </div>
          )}

          {/* Confirm */}
          <div style={{ marginBottom: 18 }}>
            <p className="lbl">Confirm New Password</p>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocused("conf")}
                onBlur={() => setFocused("")}
                style={{
                  ...f("conf"),
                  paddingRight: 38,
                  borderColor:
                    confirmPassword && newPassword !== confirmPassword
                      ? "#fecaca"
                      : focused === "conf"
                        ? "#2563eb"
                        : "#e2e8f0",
                }}
              />
              <button
                className="eye-btn"
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p
                style={{
                  fontSize: 11.5,
                  color: "#ef4444",
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                Passwords do not match
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "9px 13px",
                marginBottom: 12,
                fontSize: 12.5,
                color: "#dc2626",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {saved && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#ecfdf5",
                color: "#059669",
                border: "1px solid #a7f3d0",
                padding: "8px 13px",
                borderRadius: 100,
                fontSize: 12.5,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <CheckCircle2 size={13} /> Saved! Redirecting…
            </div>
          )}

          <button className="save-btn" onClick={handleSave}>
            <Save size={13} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
