import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

// import files
import "./VerifyEmail.css";
import { Image } from "../../../utils/image_paths.js";

const VerifyEmail = () => {
  const navigate = useNavigate();

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
    console.log("Verification code submitted:", data);
    // Add verification logic here
    navigate("/reset-password");
  };

  return (
    <div className="verify-email-page">
      <motion.div
        className="verify-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
          <h1>Email Verification</h1>
          <p>
            We've sent a verification code to your email address. Please enter
            it below to confirm your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, showErrors)} className="verify-form">
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
                  minLength: { value: 6, message: "OTP must be 6 digits" }
                })}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="btn-submit"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Verify My Account
          </motion.button>

          <div className="form-footer-links">
            <p className="resend-text">
              Didn't receive any code?{" "}
              <button type="button" className="resend-btn">
                Resend
              </button>
            </p>
            <Link to="/login" className="back-link">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
