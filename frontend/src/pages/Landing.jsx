import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#fff",
        color: "#1a2340",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Fraunces:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .nav-link {
          color: #4a5568; text-decoration: none;
          font-size: 15px; font-weight: 600; transition: color 0.2s;
        }
        .nav-link:hover { color: #1a2340; }

        .primary-btn {
          background: #1a2340; color: #fff; border: none;
          padding: 13px 30px; border-radius: 8px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .primary-btn:hover { background: #2d3f6e; transform: translateY(-1px); }

        .feature-card {
          padding: 30px 26px; border-radius: 14px;
          background: #f7f9ff; border: 1px solid #e4eaf5;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .feature-card:hover {
          box-shadow: 0 10px 36px rgba(26,35,64,0.09);
          transform: translateY(-4px);
        }

        .contact-input {
          width: 100%; background: #f7f9ff;
          border: 1.5px solid #dde3f0; border-radius: 10px;
          padding: 13px 16px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px; color: #1a2340; outline: none;
          transition: border-color 0.2s;
        }
        .contact-input:focus { border-color: #3b82f6; background: #fff; }
        .contact-input::placeholder { color: #a0aec0; }
      `}</style>

      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled
            ? "1px solid #e8edf5"
            : "1px solid transparent",
          transition: "border-color 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 68,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "#1a2340",
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
                fontFamily: "'Fraunces', serif",
                fontWeight: 800,
                fontSize: 20,
                color: "#1a2340",
                letterSpacing: "-0.02em",
              }}
            >
              Resolve<span style={{ color: "#3b82f6" }}>IT</span>
            </span>
          </div>
          {/* Links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        id="home"
        style={{
          paddingTop: 68,
          background: "linear-gradient(160deg, #eef3ff 0%, #ffffff 65%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "72px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Text */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "#deeaff",
                borderRadius: 100,
                padding: "6px 14px",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#3b82f6",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                Workplace Resolution
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 52,
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#1a2340",
                marginBottom: 20,
              }}
            >
              Resolve Workplace
              <br />
              <span style={{ color: "#3b82f6" }}>Issues Faster</span>
            </h1>

            <p
              style={{
                fontSize: 17,
                color: "#64748b",
                lineHeight: 1.78,
                maxWidth: 420,
                marginBottom: 36,
                fontWeight: 500,
              }}
            >
              A centralized platform that lets employees submit grievances
              securely while giving administrators the tools to track and
              resolve every case efficiently.
            </p>

            <button
              className="primary-btn"
              style={{ fontSize: 16, padding: "14px 34px" }}
              onClick={() => navigate("/register")}
            >
              Get Started Free →
            </button>

            {/* Slide dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 52 }}>
              {[true, false, false].map((active, i) => (
                <div
                  key={i}
                  style={{
                    width: active ? 28 : 8,
                    height: 8,
                    borderRadius: 100,
                    background: active ? "#1a2340" : "#c7d6f0",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hero Illustration */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 380,
                height: 380,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.05)",
                zIndex: 0,
              }}
            />
            <svg
              viewBox="0 0 520 460"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: "100%",
                maxWidth: 500,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* ── GROUND SHADOW ── */}
              <ellipse
                cx="260"
                cy="430"
                rx="200"
                ry="16"
                fill="#CBD5E1"
                opacity="0.4"
              />

              {/* BIG SHIELD */}
              <path
                d="M260 60 L370 110 L370 230 Q370 310 260 360 Q150 310 150 230 L150 110 Z"
                fill="#1a2340"
              />
              <path
                d="M260 82 L352 126 L352 228 Q352 296 260 340 Q168 296 168 228 L168 126 Z"
                fill="#243a5a"
              />
              <path
                d="M260 104 L338 142 L338 226 Q338 284 260 322 Q182 284 182 226 L182 142 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                opacity="0.5"
              />
              <circle cx="260" cy="220" r="44" fill="#3b82f6" opacity="0.15" />
              <circle cx="260" cy="220" r="34" fill="#3b82f6" opacity="0.2" />
              <path
                d="M242 220 l12 14 24-24"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Card 1 — Submit */}
              <g
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(26,35,64,0.14))",
                }}
              >
                <rect
                  x="30"
                  y="80"
                  width="156"
                  height="88"
                  rx="14"
                  fill="white"
                />
                <rect
                  x="30"
                  y="80"
                  width="156"
                  height="28"
                  rx="14"
                  fill="#1a2340"
                />
                <rect x="30" y="94" width="156" height="14" fill="#1a2340" />
                <rect
                  x="44"
                  y="87"
                  width="70"
                  height="8"
                  rx="4"
                  fill="white"
                  opacity="0.7"
                />
                <circle cx="168" cy="91" r="8" fill="#3b82f6" />
                <rect
                  x="44"
                  y="122"
                  width="80"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
                <rect
                  x="44"
                  y="133"
                  width="110"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
                <rect
                  x="44"
                  y="144"
                  width="64"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
                <rect
                  x="44"
                  y="156"
                  width="60"
                  height="6"
                  rx="3"
                  fill="#FCD34D"
                  opacity="0.9"
                />
              </g>

              {/* Card 2 — Track */}
              <g
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(26,35,64,0.14))",
                }}
              >
                <rect
                  x="334"
                  y="72"
                  width="156"
                  height="88"
                  rx="14"
                  fill="white"
                />
                <rect
                  x="334"
                  y="72"
                  width="156"
                  height="28"
                  rx="14"
                  fill="#3b82f6"
                />
                <rect x="334" y="86" width="156" height="14" fill="#3b82f6" />
                <rect
                  x="348"
                  y="79"
                  width="70"
                  height="8"
                  rx="4"
                  fill="white"
                  opacity="0.8"
                />
                <rect
                  x="348"
                  y="114"
                  width="108"
                  height="8"
                  rx="4"
                  fill="#E2E8F0"
                />
                <rect
                  x="348"
                  y="114"
                  width="78"
                  height="8"
                  rx="4"
                  fill="#3b82f6"
                />
                <rect
                  x="348"
                  y="128"
                  width="108"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
                <rect
                  x="348"
                  y="139"
                  width="90"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
                <rect
                  x="348"
                  y="150"
                  width="50"
                  height="6"
                  rx="3"
                  fill="#BFDBFE"
                />
              </g>

              {/* Card 3 — Resolved */}
              <g
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(26,35,64,0.14))",
                }}
              >
                <rect
                  x="36"
                  y="310"
                  width="156"
                  height="88"
                  rx="14"
                  fill="white"
                />
                <rect
                  x="36"
                  y="310"
                  width="156"
                  height="28"
                  rx="14"
                  fill="#15803d"
                />
                <rect x="36" y="324" width="156" height="14" fill="#15803d" />
                <rect
                  x="50"
                  y="317"
                  width="70"
                  height="8"
                  rx="4"
                  fill="white"
                  opacity="0.8"
                />
                <circle cx="174" cy="321" r="8" fill="#dcfce7" />
                <path
                  d="M170 321l3 3.5 6-5.5"
                  stroke="#15803d"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="114" cy="358" r="18" fill="#dcfce7" />
                <path
                  d="M105 358l6 7 15-13"
                  stroke="#15803d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="50"
                  y="382"
                  width="108"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
              </g>

              {/* Card 4 — Notify */}
              <g
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(26,35,64,0.14))",
                }}
              >
                <rect
                  x="328"
                  y="318"
                  width="156"
                  height="88"
                  rx="14"
                  fill="white"
                />
                <rect
                  x="328"
                  y="318"
                  width="156"
                  height="28"
                  rx="14"
                  fill="#7c3aed"
                />
                <rect x="328" y="332" width="156" height="14" fill="#7c3aed" />
                <rect
                  x="342"
                  y="325"
                  width="70"
                  height="8"
                  rx="4"
                  fill="white"
                  opacity="0.8"
                />
                <path
                  d="M400 348 Q400 344 406 344 Q412 344 412 348 L413 360 Q414 363 417 364 L395 364 Q398 363 399 360 Z"
                  fill="#7c3aed"
                  opacity="0.3"
                />
                <path
                  d="M403 364 Q406 368 409 364"
                  stroke="#7c3aed"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="456" cy="348" r="8" fill="#ede9fe" />
                <rect
                  x="342"
                  y="372"
                  width="100"
                  height="6"
                  rx="3"
                  fill="#E2E8F0"
                />
                <rect
                  x="342"
                  y="383"
                  width="76"
                  height="6"
                  rx="3"
                  fill="#DDD6FE"
                />
              </g>

              {/* Person Left — employee */}
              <ellipse
                cx="110"
                cy="426"
                rx="30"
                ry="8"
                fill="#94a3b8"
                opacity="0.25"
              />
              <rect
                x="96"
                y="370"
                width="14"
                height="50"
                rx="6"
                fill="#334155"
              />
              <rect
                x="114"
                y="374"
                width="14"
                height="46"
                rx="6"
                fill="#1e293b"
              />
              <rect
                x="92"
                y="414"
                width="20"
                height="9"
                rx="4"
                fill="#0f172a"
              />
              <rect
                x="112"
                y="414"
                width="20"
                height="9"
                rx="4"
                fill="#0f172a"
              />
              <rect
                x="86"
                y="298"
                width="52"
                height="76"
                rx="14"
                fill="#3b82f6"
              />
              <rect
                x="100"
                y="301"
                width="24"
                height="36"
                rx="3"
                fill="#eff6ff"
              />
              <polygon
                points="112,304 116,318 112,332 108,318"
                fill="#2563eb"
              />
              <path
                d="M86 315 Q68 300 62 280"
                stroke="#3b82f6"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <rect
                x="42"
                y="254"
                width="32"
                height="40"
                rx="5"
                fill="white"
                style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.15))" }}
              />
              <rect
                x="47"
                y="261"
                width="22"
                height="4"
                rx="2"
                fill="#3b82f6"
                opacity="0.7"
              />
              <rect
                x="47"
                y="269"
                width="18"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="47"
                y="275"
                width="20"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="47"
                y="281"
                width="14"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <path
                d="M138 320 Q152 330 156 340"
                stroke="#3b82f6"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <rect
                x="100"
                y="278"
                width="24"
                height="22"
                rx="6"
                fill="#FBBF91"
              />
              <circle cx="112" cy="260" r="26" fill="#FBBF91" />
              <path
                d="M86 253 Q88 234 112 230 Q136 234 138 253 Q128 242 112 240 Q96 242 86 253Z"
                fill="#92400E"
              />

              {/* Person Right — HR */}
              <ellipse
                cx="410"
                cy="426"
                rx="30"
                ry="8"
                fill="#94a3b8"
                opacity="0.25"
              />
              <rect
                x="396"
                y="370"
                width="14"
                height="50"
                rx="6"
                fill="#1e40af"
              />
              <rect
                x="414"
                y="374"
                width="14"
                height="46"
                rx="6"
                fill="#1e3a8a"
              />
              <rect
                x="392"
                y="414"
                width="20"
                height="9"
                rx="4"
                fill="#0f172a"
              />
              <rect
                x="412"
                y="414"
                width="20"
                height="9"
                rx="4"
                fill="#0f172a"
              />
              <rect
                x="386"
                y="298"
                width="52"
                height="76"
                rx="14"
                fill="#1a2340"
              />
              <rect
                x="400"
                y="301"
                width="24"
                height="36"
                rx="3"
                fill="#e8edf5"
              />
              <polygon
                points="412,304 416,318 412,332 408,318"
                fill="#3b82f6"
              />
              <path
                d="M386 315 Q370 330 366 345"
                stroke="#1a2340"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M438 315 Q455 300 460 280"
                stroke="#1a2340"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <rect
                x="448"
                y="248"
                width="36"
                height="46"
                rx="6"
                fill="#f1f5f9"
                style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.12))" }}
              />
              <rect
                x="456"
                y="243"
                width="20"
                height="10"
                rx="3"
                fill="#94a3b8"
              />
              <rect
                x="453"
                y="258"
                width="26"
                height="4"
                rx="2"
                fill="#3b82f6"
                opacity="0.8"
              />
              <rect
                x="453"
                y="266"
                width="22"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="453"
                y="272"
                width="24"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <rect
                x="453"
                y="278"
                width="18"
                height="3"
                rx="1.5"
                fill="#CBD5E1"
              />
              <circle cx="465" cy="288" r="6" fill="#dcfce7" />
              <path
                d="M462 288l2 2.5 5-4"
                stroke="#15803d"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="400"
                y="278"
                width="24"
                height="22"
                rx="6"
                fill="#F9C78A"
              />
              <circle cx="412" cy="260" r="26" fill="#F9C78A" />
              <path
                d="M386 253 Q388 234 412 230 Q436 234 438 253"
                fill="#1a2340"
              />
              <circle cx="412" cy="248" r="10" fill="#1a2340" />
              <circle cx="404" cy="258" r="3" fill="#1a2340" />
              <circle cx="420" cy="258" r="3" fill="#1a2340" />

              {/* Connecting dashed arrows */}
              <path
                d="M186 124 Q218 150 230 170"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                opacity="0.5"
              />
              <path
                d="M334 116 Q302 142 290 168"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                opacity="0.5"
              />
              <path
                d="M222 340 Q190 360 192 382"
                stroke="#15803d"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                opacity="0.5"
              />
              <path
                d="M298 340 Q322 362 330 382"
                stroke="#7c3aed"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                opacity="0.5"
              />

              <circle cx="260" cy="46" r="5" fill="#3b82f6" opacity="0.5" />
              <circle cx="246" cy="46" r="3" fill="#3b82f6" opacity="0.3" />
              <circle cx="274" cy="46" r="3" fill="#3b82f6" opacity="0.3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section
        style={{
          padding: "48px 0",
          borderTop: "1px solid #e8edf5",
          borderBottom: "1px solid #e8edf5",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#a0aec0",
              fontWeight: 800,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Trusted by teams at
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 56,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {[
              "TechCorp",
              "Mediax",
              "Buildex",
              "Nexflow",
              "Vantis",
              "Cloudive",
            ].map((name, i) => (
              <span
                key={name}
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#b0bdd4",
                  letterSpacing: "-0.01em",
                }}
              >
                {["◈", "◉", "◆", "◎", "⬡", "◍"][i]} {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "100px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 68 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#3b82f6",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              What We Offer
            </p>
            <h2
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 42,
                fontWeight: 900,
                color: "#1a2340",
                letterSpacing: "-0.02em",
                marginBottom: 16,
                lineHeight: 1.15,
              }}
            >
              A Better Way to Manage
              <br />
              Workplace Grievances
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 500,
                margin: "0 auto",
                lineHeight: 1.72,
                fontWeight: 500,
              }}
            >
              Resolve IT simplifies grievance management through structured
              reporting, transparent tracking, and efficient resolution.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
              marginBottom: 80,
            }}
          >
            {[
              {
                icon: (
                  <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
                    <rect
                      x="6"
                      y="8"
                      width="28"
                      height="24"
                      rx="4"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    <path
                      d="M13 20l4 4 10-8"
                      stroke="#3b82f6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Secure Reporting",
                desc: "Employees submit workplace grievances through an encrypted, centralized platform with full privacy controls.",
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
                    <circle
                      cx="20"
                      cy="20"
                      r="13"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 13v7l4.5 2.5"
                      stroke="#3b82f6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                title: "Transparent Tracking",
                desc: "Monitor complaint progress with real-time status updates and full workflow visibility from submission to resolution.",
              },
              {
                icon: (
                  <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
                    <path
                      d="M8 20h24M26 14l6 6-6 6"
                      stroke="#3b82f6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                title: "Faster Resolution",
                desc: "Administrators review, communicate, and close cases efficiently — cutting average resolution time by up to 60%.",
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div
                  style={{
                    marginBottom: 16,
                    background: "#e8f0ff",
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#1a2340",
                    marginBottom: 10,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    lineHeight: 1.72,
                    fontWeight: 500,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div
            style={{
              background: "#1a2340",
              borderRadius: 20,
              padding: "52px 0",
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
            }}
          >
            {[
              ["12,000+", "Cases Resolved"],
              ["98%", "Resolution Rate"],
              ["500+", "Organizations"],
            ].map(([val, label], i) => (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  borderRight:
                    i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  padding: "0 40px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 46,
                    fontWeight: 900,
                    color: "#3b82f6",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    color: "#7a8daa",
                    fontSize: 14,
                    marginTop: 6,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        style={{ padding: "100px 0", background: "#eef3ff" }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#3b82f6",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Get In Touch
            </p>
            <h2
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 42,
                fontWeight: 900,
                color: "#1a2340",
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              Contact Us
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              Have questions about Resolve IT? Send us a message and we'll
              respond within 24 hours.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "48px 44px",
              boxShadow: "0 8px 48px rgba(26,35,64,0.07)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              <input className="contact-input" placeholder="Full Name" />
              <input
                className="contact-input"
                type="email"
                placeholder="Email Address"
              />
              <input
                className="contact-input"
                placeholder="Subject"
                style={{ gridColumn: "span 2" }}
              />
              <textarea
                className="contact-input"
                rows={5}
                placeholder="Your message..."
                style={{ gridColumn: "span 2", resize: "vertical" }}
              />
              <div style={{ gridColumn: "span 2" }}>
                <button
                  className="primary-btn"
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: 15,
                    justifyContent: "center",
                  }}
                >
                  Send Message →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#1a2340",
          padding: "36px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" width="13" height="13">
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
              fontFamily: "'Fraunces', serif",
              fontWeight: 800,
              fontSize: 17,
              color: "#fff",
            }}
          >
            Resolve<span style={{ color: "#3b82f6" }}>IT</span>
          </span>
        </div>
        <p style={{ color: "#4a5d7a", fontSize: 13, fontWeight: 600 }}>
          © 2026 Resolve IT. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
