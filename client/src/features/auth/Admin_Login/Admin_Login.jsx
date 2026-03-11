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
} from "lucide-react";

// import files
import "./Admin_Login.css";
import { Image } from "../../../utils/image_paths.js";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

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
    console.log("Admin Sign in:", data);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">

        {/* Left Section */}
        <motion.div
          className="admin-login-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-login-form-container">

            {/* Logo */}
            <Link to="/">
              <div className="admin-login-logo">
                <img
                  src={Image.logo}
                  alt="Logo"
                  className="admin-login-logo-img"
                />
                <span className="admin-login-logo-name">
                  Hire X
                </span>
              </div>
            </Link>

            {/* Header */}
            <div className="admin-login-header">
              <h1>Admin Sign in</h1>
              <p>Enter admin credentials to access dashboard.</p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit, showErrors)}
              className="admin-login-form"
            >

              {/* Email */}
              <div className="admin-login-form-group">
                <label htmlFor="admin-email">
                  Email Address
                </label>

                <div className="admin-login-input-wrapper">
                  <Mail
                    size={16}
                    className="admin-login-input-icon"
                  />

                  <input
                    type="text"
                    id="admin-email"
                    placeholder="Enter Admin Email"
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
              <div className="admin-login-form-group">
                <label htmlFor="admin-password">
                  Password
                </label>

                <div className="admin-login-input-wrapper">
                  <Lock
                    size={16}
                    className="admin-login-input-icon"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password required",
                    })}
                  />

                  <button
                    type="button"
                    className="admin-login-toggle-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword
                      ? <EyeOff size={16} />
                      : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="admin-login-options-row">

                <label className="admin-login-checkbox-label">
                  <input
                    type="checkbox"
                    {...register("remember")}
                  />

                  <span className="admin-login-checkbox-custom"></span>

                  <span className="admin-login-checkbox-text">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="admin-login-forgot-link"
                >
                  Forgot password?
                </Link>

              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="admin-login-btn-submit"
              >
                Admin Sign In
              </motion.button>

              {/* Footer */}
              <div className="admin-login-form-footer">
                <p>
                  Admin access only
                </p>
              </div>

            </form>

          </div>
        </motion.div>


        {/* Right Section */}
        <motion.div
          className="admin-login-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >

          <img
            src={Image.adminLogin}
            alt="Admin Login"
            className="admin-login-image"
          />

        </motion.div>


      </div>
    </div>
  );
};

export default AdminLogin;
