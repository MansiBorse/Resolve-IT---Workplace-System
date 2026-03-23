import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/api/auth/send-otp", {
        email: email.trim(), // FIXED: trim email before sending
      });

      alert(res.data);

      if (res.data === "OTP sent successfully") {
        setOtpSent(true);
        startResendTimer();
      }
    } catch (error) {
      alert("Failed to send OTP");
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!otp || !password) {
      alert("Enter OTP and new password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          email: email.trim(), // FIXED: trim email before sending
          otp: otp.trim(), // FIXED: trim otp before sending
          password,
        },
      );

      alert(res.data);

      if (res.data === "Password updated successfully") {
        navigate("/login");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f4f6fb",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "35px",
          borderRadius: "10px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Forgot Password
        </h2>

        <p style={{ textAlign: "center", color: "gray", marginBottom: "25px" }}>
          Reset your account password
        </p>

        {/* EMAIL */}
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            marginBottom: "18px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            background: otpSent ? "#f0f0f0" : "white",
            boxSizing: "border-box",
          }}
        />

        {/* SEND OTP */}
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1f2a44",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* OTP SECTION */}
        {otpSent && (
          <>
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                marginBottom: "18px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                marginBottom: "18px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={handleResetPassword}
              style={{
                width: "100%",
                padding: "10px",
                background: "#1f2a44",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Reset Password
            </button>

            <br />
            <br />

            {/* RESEND OTP */}
            <button
              onClick={handleSendOtp}
              disabled={resendTimer > 0}
              style={{
                background: "none",
                border: "none",
                color: resendTimer > 0 ? "gray" : "#1f2a44",
                cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>
          </>
        )}

        <br />
        <br />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#1f2a44",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
