import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ ADD useLocation
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

// import files
import "./ResetPassword.css";
import { Image } from "../../../utils/image_paths.js";
import authService from "../../../services/authService.js"; // ✅ ADD

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get email
  const [loading, setLoading] = useState(false);

  const email = location.state?.email; // ✅ get email

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // react hook form
  const {
    register,
    handleSubmit,
    watch,
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
        toast.error("Session expired. Please try again.");
        navigate("/forgot-password");
        return;
      }

      setLoading(true);

      const res = await authService.resetPassword({
        email,
        newPassword: data.password,
      });

      if (res.success) {
        toast.success(res.message || "Password updated successfully");

        // 👉 redirect to login
        navigate("/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div
        className="reset-card"
      >
        {/* Logo */}
        <Link to="/">
          <div className="reset-logo">
            <img src={Image.logo} alt="Logo" className="logo-img" />
            <span className="logo-name">Hire X</span>
          </div>
        </Link>

        {/* Header */}
        <div className="reset-header">
          <h1>Reset Password</h1>
          <p>
            Enter your new password below to update your account credentials.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit, showErrors)}
          className="reset-form"
        >
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 6,
                    message: "Min 6 chars in Password",
                  },
                })}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Confirm password required",
                  validate: (value) =>
                    value === watch("password") || "Passwords mismatch",
                })}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

          <div className="form-footer-links">
            <Link to="/login" className="back-link">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;