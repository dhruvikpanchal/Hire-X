import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Mail,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

// import files
import { Image } from "../../../utils/image_paths.js";
import authService from "../../../services/authService.js"; 
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

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
          duration: 2500 + index * 150,
          position: "top-right",
        }
      );
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await authService.forgotPassword(data.email);

      if (res.success) {
        toast.success(res.message || "OTP sent to email");

        // 👉 pass email to next page
        navigate("/verify-email", {
          state: { email: data.email },
        });
      } else {
        toast.error(res.message || "Something went wrong");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Live Jobs", value: "25K+", icon: Briefcase },
    { label: "Companies", value: "10K+", icon: Building2 },
    { label: "New Jobs", value: "1.5K+", icon: CheckCircle2 },
  ];

  return (
    <div className="forgot-password-page">
      {/* Left Section - Form */}
      <motion.div
        className="forgot-left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="forgot-form-container">
          {/* Logo */}
          <Link to="/">
            <div className="forgot-logo">
              <img src={Image.logo} alt="Logo" className="logo-img" />
              <span className="logo-name">Hire X</span>
            </div>
          </Link>

          {/* Header */}
          <div className="forgot-header">
            <h1>Forgot Password</h1>
            <p>
              Enter your email address and we'll send you an OTP to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit, showErrors)}
            className="forgot-form"
          >
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="text"
                  id="email"
                  placeholder="Enter Your Email"
                  {...register("email", {
                    required: "Email required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </motion.button>

            {/* Links */}
            <div className="form-footer-links">
              <Link to="/login" className="back-link">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
              <Link to="/register" className="create-account-link">
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;