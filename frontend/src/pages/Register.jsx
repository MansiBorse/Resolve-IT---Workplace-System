import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, Hash } from "lucide-react";
import grievanceImg from "../assets/employees.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [formData, setFormData] = useState({
    empid: "",
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.empid.trim()) newErrors.empid = "Employee ID required";
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter valid email";
    if (!formData.password) newErrors.password = "Password required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: formData.empid.trim(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const result = await response.text();
      if (result.trim() === "Registration Successful") {
        alert("Account created successfully!");
        window.location.href = "/login";
      } else {
        alert(result);
      }
    } catch {
      alert("Server error");
    }
    setLoading(false);
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

        .field-wrap { position: relative; display: flex; align-items: center; }

        .field-icon {
          position: absolute; left: 13px; color: #94a3b8;
          display: flex; align-items: center;
          pointer-events: none; transition: color 0.2s;
        }

        .field-input {
          width: 100%;
          padding: 11px 16px 11px 38px;
          border-radius: 9px;
          border: 1.5px solid #dde3f0;
          background: #f7f9ff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #1a2340; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
          border-color: #3b82f6; background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
        }
        .field-input.error { border-color: #ef4444; background: #fff9f9; }
        .field-input::placeholder { color: #c0cce0; }
        .field-wrap:focus-within .field-icon { color: #3b82f6; }

        .error-text { color: #ef4444; font-size: 11px; margin-top: 4px; font-weight: 500; }

        .reg-label {
          font-size: 12px; font-weight: 600; color: #64748b;
          margin-bottom: 6px; display: block;
          letter-spacing: 0.04em; text-transform: uppercase;
        }

        .submit-btn {
          width: 100%; background: #1a2340; color: #fff;
          border: none; padding: 13px; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 600; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.02em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #2d3f6e; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,35,64,0.18);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        @media (max-width: 768px) {
          .reg-left { display: none !important; }
          .two-col { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        className="reg-left"
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
            alt="Employees"
            style={{
              width: "100%",
              maxWidth: 340,
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
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
            background: "#fff",
            borderRadius: 18,
            padding: "38px 36px",
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 8px 40px rgba(26,35,64,0.08)",
            border: "1px solid #e8edf5",
          }}
        >
          <div style={{ marginBottom: 26 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "linear-gradient(135deg, #1a2340, #2d3f6e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={16} color="#fff" />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#1a2340",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  Create Account
                </h2>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  Fill in your details to get started
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              <div
                style={{
                  height: 3,
                  width: 28,
                  borderRadius: 2,
                  background: "#1a2340",
                }}
              />
              <div
                style={{
                  height: 3,
                  width: 14,
                  borderRadius: 2,
                  background: "#dde3f0",
                }}
              />
              <div
                style={{
                  height: 3,
                  width: 14,
                  borderRadius: 2,
                  background: "#dde3f0",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="two-col">
              <div>
                <label className="reg-label">Employee ID</label>
                <div className="field-wrap">
                  <span className="field-icon">
                    <Hash size={14} />
                  </span>
                  <input
                    className={`field-input${errors.empid ? " error" : ""}`}
                    type="text"
                    name="empid"
                    placeholder="e.g. 042"
                    value={formData.empid}
                    onChange={handleChange}
                    onFocus={() => setFocused("empid")}
                    onBlur={() => setFocused("")}
                  />
                </div>
                {errors.empid && <p className="error-text">{errors.empid}</p>}
              </div>

              <div>
                <label className="reg-label">Full Name</label>
                <div className="field-wrap">
                  <span className="field-icon">
                    <User size={14} />
                  </span>
                  <input
                    className={`field-input${errors.name ? " error" : ""}`}
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                  />
                </div>
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label className="reg-label">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Mail size={14} />
                </span>
                <input
                  className={`field-input${errors.email ? " error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label className="reg-label">Password</label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Lock size={14} />
                </span>
                <input
                  className={`field-input${errors.password ? " error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 13,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <button
              className="submit-btn"
              style={{ marginTop: 4 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e8edf5" }} />
            <span
              style={{
                fontSize: 11,
                color: "#cbd5e1",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              OR
            </span>
            <div style={{ flex: 1, height: 1, background: "#e8edf5" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#3b82f6",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
