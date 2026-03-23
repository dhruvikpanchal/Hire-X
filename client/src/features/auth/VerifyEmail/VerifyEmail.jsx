import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ ADD useLocation
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

// import files
import "./VerifyEmail.css";
import { Image } from "../../../utils/image_paths.js";
import authService from "../../../services/authService.js"; // ✅ ADD

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ GET email from previous page
  const [loading, setLoading] = useState(false);

  const email = location.state?.email; // ✅ get email

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const showErrors = (errors) => {
    const messages = Object.values(errors).map((err) => err.message);

    messages.forEach((msg, index) => {
      toast.custom(
        (t) => (
          <div
            style={{
              background: "#ef4444",
              color: "#fff",
              fontSize: "14px",
              padding: "10px 14px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {msg}
          </div>
        ),
        {
          duration: 2500 + index * 150,
          position: "top-right",
        }
      );
    });
  };

  // ✅ UPDATED SUBMIT FUNCTION
  const onSubmit = async (data) => {
    try {
      if (!email) {
        toast.error("Email missing. Please try again.");
        navigate("/forgot-password");
        return;
      }

      setLoading(true);

      const res = await authService.verifyOTP({
        email,
        otp: data.otp,
      });

      if (res.success) {
        toast.success(res.message || "OTP verified");

        // 👉 go to reset password page with email
        navigate("/reset-password", {
          state: { email },
        });
      } else {
        toast.error(res.message || "Invalid OTP");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESEND OTP
  const handleResend = async () => {
    try {
      if (!email) {
        toast.error("Email missing");
        return;
      }

      const res = await authService.forgotPassword(email);

      if (res.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error resending OTP");
    }
  };

  return (
    <div className="verify-email-page">
      <div
        className="verify-card"
      >
        {/* Logo */}
        <Link to="/">
          <div className="verify-logo">
            <img src={Image.logo} alt="Logo" className="logo-img" />
            <span className="logo-name">Hire X</span>
          </div>
        </Link>

        {/* Header */}
        <div className="verify-header">
          <h1>OTP Verification</h1>
          <p>Enter the 6-digit OTP sent to your email.</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit, showErrors)}
          className="verify-form"
        >
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <div className="input-wrapper">
              <KeyRound size={16} className="input-icon" />
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit code"
                maxLength={6}
                autoComplete="one-time-code"
                {...register("otp", {
                  required: "OTP required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 digits",
                  },
                })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="form-footer-links">
            <p className="resend-text">
              Didn't receive any code?{" "}
              <button
                type="button"
                className="resend-btn"
                onClick={handleResend} // ✅ ADD
              >
                Resend
              </button>
            </p>

            <Link to="/login" className="back-link">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;