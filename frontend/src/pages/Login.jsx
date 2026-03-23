import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import grievanceImg from "../assets/employees.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (form.email === "admin@gmail.com" && form.password === "admin123") {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: form.email, role: "admin", name: "Admin" }),
      );
      navigate("/admin-dashboard");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ email: form.email, role: "employee" }),
        );
        // ✅ FIX: Save the actual name from API — employeeName stores the real name now
        const fullName = result.name || "";
        const firstName = fullName.trim().split(/\s+/)[0] || "Employee";
        localStorage.setItem("employeeName", firstName);

        // ✅ FIX: Clear old notifications when a different user logs in
        const prevEmail = localStorage.getItem("lastLoggedInEmail");
        if (prevEmail !== form.email.trim()) {
          localStorage.removeItem("employeeNotifs");
          localStorage.removeItem("notifiedTicketIds");
          localStorage.setItem("lastLoggedInEmail", form.email.trim());
        }

        navigate("/employee-dashboard");
      } else {
        setErrors({ password: "Invalid email or password." });
      }
    } catch {
      setErrors({ password: "Server error. Please try again." });
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: 9,
    border: `1.5px solid ${errors[name] ? "#ef4444" : focused === name ? "#3b82f6" : "#dde3f0"}`,
    background: focused === name ? "#fff" : "rgba(255,255,255,0.7)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "#1a2340",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  });

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    marginBottom: 5,
    display: "block",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .submit-btn {
          width: 100%;
          background: #1a2340;
          color: #fff;
          border: none;
          padding: 13px;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .submit-btn:hover { background: #2d3f6e; transform: translateY(-1px); }

        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { grid-column: span 2; }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        className="login-left"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(145deg, #1a2340 0%, #0f172a 55%, #1e3a5f 100%)",
          padding: "48px 40px",
          overflow: "hidden",
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 32,
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            Resolve<span style={{ color: "#3b82f6" }}>IT</span>
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 48,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              marginBottom: 18,
            }}
          >
            Welcome
            <br />
            <span style={{ color: "#3b82f6" }}>Back</span>
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 15,
              lineHeight: 1.78,
              marginBottom: 44,
              fontWeight: 400,
            }}
          >
            Built for organizational transparency and efficient grievance
            resolution. Manage workplace issues with clarity and accountability.
          </p>
          <img
            src={grievanceImg}
            alt="Employee Grievances Illustration"
            style={{
              width: "100%",
              maxWidth: 380,
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="login-right"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f5ff",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #ede9fe 100%)",
            borderRadius: 18,
            padding: "42px 38px",
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 8px 40px rgba(26,35,64,0.08)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #bfdbfe, #ddd6fe)",
                border: "3px solid rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                boxShadow: "0 4px 16px rgba(99,102,241,0.2)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="38" height="38">
                <circle cx="12" cy="8" r="4" fill="#6366f1" opacity="0.8" />
                <path
                  d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                  fill="#6366f1"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#1a2340",
              }}
            >
              Sign In
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
              />
              {errors.email && (
                <p style={{ color: "#ef4444", fontSize: 12 }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Password
                </label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    fontSize: 12,
                    color: "#3b82f6",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ ...inputStyle("password"), paddingRight: 44 }}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#94a3b8",
                  }}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </span>
              </div>
              {errors.password && (
                <p style={{ color: "#ef4444", fontSize: 12 }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Sign In →
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
