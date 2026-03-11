import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";

// import files
import "./ResetPassword.css";
import { Image } from "../../../utils/image_paths.js";

const ResetPassword = () => {
  const navigate = useNavigate();
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
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: t.visible ? 1 : 0, x: t.visible ? 0 : 200 }}
            transition={{ duration: 0.1 }}
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
          </motion.div>
        ),
        {
          duration: 2500 + index * 150, // staggered duration prevents overlapping glitch
          position: "top-right",
        }
      );
    });
  };

  const onSubmit = (data) => {
    console.log("Reset password submitted:", data);
    // Add password update logic here
    navigate("/login");
  };

  return (
    <div className="reset-password-page">
      <motion.div
        className="reset-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        <form onSubmit={handleSubmit(onSubmit, showErrors)} className="reset-form">
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-submit"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Password
          </motion.button>

          <div className="form-footer-links">
            <Link to="/login" className="back-link">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
