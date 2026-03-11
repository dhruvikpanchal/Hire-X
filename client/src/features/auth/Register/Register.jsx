import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Briefcase,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

// import files
import "./Register.css";
import { Image } from "../../../utils/image_paths.js";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("jobseeker");

  // react hook form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  // React Query Mutation
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );
    },
  });

  // Submit Handler
  const onSubmit = (data) => {
    registerMutation.mutate({
      ...data,
      role: selectedRole,
    });
  };

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

  return (
    <div className="register-page">
      {/* Left Section - Form */}

      <div className="register-form-container">
        {/* Logo */}
        <Link to="/">
          <div className="register-logo">
            <img src={Image.logo} alt="Logo" className="logo-img" />
            <span className="logo-name">Hire X</span>
          </div>
        </Link>

        {/* Header */}
        <div className="register-header">
          <h1>Create account</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit, showErrors)}
          className="register-form"
        >
          {/* Full Name & Username - Side by Side */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter Your Name"
                  {...register("fullName", {
                    required: "Name required",
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter Your Display Name"
                  {...register("username", {
                    required: "Username required",
                  })}
                />
              </div>
            </div>
          </div>

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

          {/* Password & Confirm Password - Side by Side */}
          <div className="form-row">
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
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="form-group">
            <label>I am a</label>
            <div className="role-selector">
              <motion.button
                type="button"
                className={`role-option ${selectedRole === "jobseeker" ? "active" : ""}`}
                onClick={() => setSelectedRole("jobseeker")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Briefcase size={18} />
                <span>Job Seeker</span>
              </motion.button>
              <motion.button
                type="button"
                className={`role-option ${selectedRole === "employer" ? "active" : ""}`}
                onClick={() => setSelectedRole("employer")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Building2 size={18} />
                <span>Employer</span>
              </motion.button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                {...register("agreeToTerms", {
                  required: "Accept terms",
                })}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                I agree to the <a href="#">Terms & Conditions</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="btn-submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </motion.button>

          {/* Sign In Link */}
          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
