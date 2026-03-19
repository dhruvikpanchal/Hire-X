import React, { useState, useEffect } from "react";
import "./RecruiterEditProfile.css";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  uploadRecruiterImage,
} from "../../../services/recruiterService";

const RecruiterEditProfile = () => {
  const BASE_URL = "http://localhost:3000";
  const queryClient = useQueryClient();

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    recruiterName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    companyName: "",
    industry: "",
    companySize: "",
    companyWebsite: "",
    companyDescription: "",
  });

  // load recruiter profile
  const { data } = useQuery({
    queryKey: ["recruiterProfile"],
    queryFn: getMyRecruiterProfile,
  });

  useEffect(() => {
    if (data?.recruiter) {
      const r = data.recruiter;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        recruiterName: r.user?.fullName || "",
        email: r.user?.email || "",
        phone: r.user?.phone || "",
        location: r.user?.location || "",
        jobTitle: r.jobTitle || "",
        companyName: r.companyName || "",
        industry: r.industry || "",
        companySize: r.companySize || "",
        companyWebsite: r.companyWebsite || "",
        companyDescription: r.companyDescription || "",
      });

      setProfileImagePreview(
        r.user?.avatar ? `${BASE_URL}${r.user.avatar}` : null,
      );

      setCompanyLogoPreview(
        r.companyLogo ? `${BASE_URL}${r.companyLogo}` : null,
      );
    }
  }, [data]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: updateRecruiterProfile,
  });

  const uploadLogoMutation = useMutation({
    mutationFn: uploadCompanyLogo,
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadRecruiterImage,
  });

  // Input change Handler

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Image Handler
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCompanyLogoFile(file);
      setCompanyLogoPreview(URL.createObjectURL(file));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        recruiterName: formData.recruiterName,
        phone: formData.phone,
        location: formData.location,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        companyWebsite: formData.companyWebsite,
        companyDescription: formData.companyDescription,
      });

      if (companyLogoFile) {
        await uploadLogoMutation.mutateAsync(companyLogoFile);
      }

      if (profileImageFile) {
        await uploadImageMutation.mutateAsync(profileImageFile);
      }

      await queryClient.invalidateQueries({
        queryKey: ["recruiterProfile"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["recruiterDashboard"],
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Error updating profile");
    }
  };

  return (
    <div className="recruitereditprofile-page">
      <div className="recruitereditprofile-container">
        <header className="recruitereditprofile-header">
          <h1 className="recruitereditprofile-title">Edit Profile</h1>
          <p className="recruitereditprofile-subtitle">
            Update your recruiter and company information.
          </p>
        </header>

        <form className="recruitereditprofile-form" onSubmit={handleSubmit}>
          {/* ================= Profile Section ================= */}

          <section className="recruitereditprofile-section">
            <h2 className="recruitereditprofile-section-title">
              Profile Information
            </h2>

            <div className="recruitereditprofile-image-upload">
              <label className="recruitereditprofile-label">
                Recruiter Profile Image (optional)
              </label>

              <div className="recruitereditprofile-image-preview-wrapper">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="recruitereditprofile-preview-img"
                  />
                ) : (
                  <div className="recruitereditprofile-placeholder">
                    {" "}
                    No Image{" "}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="recruitereditprofile-file-input"
                />
              </div>
            </div>

            <div className="recruitereditprofile-grid">
              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">
                  Recruiter Name
                </label>

                <input
                  type="text"
                  name="recruiterName"
                  value={formData.recruiterName}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">
                  Job Title / Position
                </label>

                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="recruitereditprofile-input"
                  disabled
                />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>

              <div className="recruitereditprofile-input-group recruitereditprofile-full-width">
                <label className="recruitereditprofile-label">Location</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>
            </div>
          </section>

          {/* ================= Company Section ================= */}

          <section className="recruitereditprofile-section">
            <h2 className="recruitereditprofile-section-title">
              Company Information
            </h2>

            <div className="recruitereditprofile-image-upload">
              <label className="recruitereditprofile-label">Company Logo</label>

              <div className="recruitereditprofile-image-preview-wrapper">
                {companyLogoPreview ? (
                  <img
                    src={companyLogoPreview}
                    alt="Company Logo"
                    className="recruitereditprofile-preview-img"
                  />
                ) : (
                  <div className="recruitereditprofile-placeholder">
                    No Logo
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCompanyLogoChange}
                  className="recruitereditprofile-file-input"
                />
              </div>
            </div>

            <div className="recruitereditprofile-grid">
              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Industry</label>

                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">
                  Company Size
                </label>

                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                >
                  <option value="">Select Company Size</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">
                  Company Website
                </label>

                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="recruitereditprofile-input"
                />
              </div>

              <div className="recruitereditprofile-input-group recruitereditprofile-full-width">
                <label className="recruitereditprofile-label">
                  Company Description
                </label>

                <textarea
                  name="companyDescription"
                  rows="4"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  className="recruitereditprofile-input recruitereditprofile-textarea"
                />
              </div>
            </div>
          </section>

          {/* ================= Buttons ================= */}

          <div className="recruitereditprofile-actions">
            <button
              type="button"
              className="recruitereditprofile-btn recruitereditprofile-btn-cancel"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="recruitereditprofile-btn recruitereditprofile-btn-save"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterEditProfile;
