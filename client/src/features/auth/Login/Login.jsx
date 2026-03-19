import authService from "../../../services/authService.js";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Briefcase,
  Building2,
  CheckCircle2,
} from "lucide-react";

// import files
import "./Login.css";
import { Image } from "../../../utils/image_paths.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await authService.login(data);
    },

    onSuccess: (data) => {
      console.log("Login successful:", data);

      // ✅ SAVE TOKEN (THIS WAS MISSING)
      localStorage.setItem("token", data.token);

      // ✅ SAVE USER (ADD THIS HERE)
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");

      if (data.user.role === "jobseeker") {
        navigate("/jobseeker/dashboard");
      } else {
        navigate("/recruiter/dashboard");
      }
    },

    onError: (error) => {
      const errMessage =
        error.response?.data?.message || "Login failed!";
      toast.error(errMessage);
    },
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
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const stats = [
    { label: "Live Jobs", value: "25K+", icon: Briefcase },
    { label: "Companies", value: "10K+", icon: Building2 },
    { label: "New Jobs", value: "1.5K+", icon: CheckCircle2 },
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Section - Form */}
        <motion.div
          className="login-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-form-container">
            {/* Logo */}
            <Link to="/">
              <div className="login-logo">
                <img src={Image.logo} alt="Logo" className="logo-img" />
                <span className="logo-name">Hire X</span>
              </div>
            </Link>

            {/* Header */}
            <div className="login-header">
              <h1>Sign in</h1>
              <p>Welcome back! Please enter your details.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit, showErrors)} className="login-form">
              {/* Email */}
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

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password required",
                    })}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register("remember")}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="btn-submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </motion.button>

              {/* Footer */}
              <div className="form-footer">
                <p>
                  Don’t have an account?{" "}
                  <Link to="/register">Create account</Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Section - Visual */}
        <motion.div
          className="login-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={Image.login_page_banner}
            alt="Login page"
            className="login-image"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
