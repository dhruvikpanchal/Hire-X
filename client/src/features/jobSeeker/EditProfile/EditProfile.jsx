import React, { useState, useRef } from "react";
import "./EditProfile.css";

/* ─── Default form values ─── */
const DEFAULT_FORM = {
  fullName: "Alex Morgan",
  email: "alex.morgan@email.com",
  phone: "+1 (415) 555-0192",
  location: "San Francisco, CA",
  jobTitle: "Senior Frontend Developer",
  skills: "React, TypeScript, Next.js, GraphQL, Node.js, Figma, CSS",
  bio: "Passionate frontend engineer with 6+ years of experience building scalable, pixel-perfect web applications. I specialize in React ecosystems, design systems, and bridging the gap between beautiful UI and clean code.",
  linkedin: "linkedin.com/in/alexmorgan",
  portfolio: "alexmorgan.dev",
};

/* ─── SVG Icons ─── */
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12 19.79 19.79 0 0 1 1.07 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);

/* ─── Field component ─── */
function Field({ label, hint, icon: Icon, error, children }) {
  return (
    <div className={`editprofile-field ${error ? "editprofile-field-error" : ""}`}>
      <label className="editprofile-label">
        {Icon && <span className="editprofile-label-icon"><Icon /></span>}
        {label}
        {hint && <span className="editprofile-label-hint">{hint}</span>}
      </label>
      {children}
      {error && <span className="editprofile-error-text">{error}</span>}
    </div>
  );
}

/* ─── Main component ─── */
export default function EditProfile() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [skills, setSkills] = useState(
    DEFAULT_FORM.skills.split(",").map((s) => s.trim()).filter(Boolean)
  );
  const [skillInput, setSkillInput] = useState("");

  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  /* ── Handlers ── */
  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  /* Skills pill logic */
  const addSkill = (raw) => {
    const trimmed = raw.trim().replace(/,$/, "");
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && skills.length) {
      setSkills((prev) => prev.slice(0, -1));
    }
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  /* Validate */
  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.jobTitle.trim()) errs.jobTitle = "Job title is required.";
    if (!form.bio.trim()) errs.bio = "Please write a short bio.";
    return errs;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`ep-${firstKey}`)?.focus();
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm(DEFAULT_FORM);
    setSkills(DEFAULT_FORM.skills.split(",").map((s) => s.trim()).filter(Boolean));
    setErrors({});
    setAvatarSrc(null);
    setResumeFile(null);
  };

  /* ─── Render ─── */
  return (
    <div className="editprofile-page">

      {/* ── Page header ── */}
      <div className="editprofile-page-header">
        <div className="editprofile-page-header-inner">
          <div className="editprofile-page-title-group">
            <div className="editprofile-header-icon">
              <UserIcon />
            </div>
            <div>
              <h1 className="editprofile-page-title">Edit Profile</h1>
              <p className="editprofile-page-subtitle">Update your personal and professional details.</p>
            </div>
          </div>

          {saved && (
            <div className="editprofile-saved-toast">
              <CheckIcon />
              Profile saved successfully!
            </div>
          )}
        </div>
      </div>

      {/* ── Form container ── */}
      <div className="editprofile-container">
        <form className="editprofile-form" onSubmit={handleSave} noValidate>

          {/* ════ SECTION: Avatar ════ */}
          <div className="editprofile-section">
            <h2 className="editprofile-section-heading">
              <span className="editprofile-section-num">01</span>
              Profile Photo
            </h2>

            <div className="editprofile-avatar-row">
              <div className="editprofile-avatar-wrap">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile preview" className="editprofile-avatar-img" />
                ) : (
                  <div className="editprofile-avatar-placeholder">AM</div>
                )}
                <button
                  type="button"
                  className="editprofile-avatar-change-btn"
                  onClick={() => avatarInputRef.current?.click()}
                  title="Change photo"
                >
                  <CameraIcon />
                </button>
              </div>

              <div className="editprofile-avatar-info">
                <p className="editprofile-avatar-info-title">Upload a profile photo</p>
                <p className="editprofile-avatar-info-desc">JPG, PNG or GIF · Max 5 MB · Recommended 400×400px</p>
                <div className="editprofile-avatar-btns">
                  <button
                    type="button"
                    className="editprofile-btn editprofile-btn-outline-sm"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <CameraIcon /> Change Photo
                  </button>
                  {avatarSrc && (
                    <button
                      type="button"
                      className="editprofile-btn editprofile-btn-ghost-sm"
                      onClick={() => setAvatarSrc(null)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="editprofile-hidden-input"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="editprofile-divider" />

          {/* ════ SECTION: Personal Info ════ */}
          <div className="editprofile-section">
            <h2 className="editprofile-section-heading">
              <span className="editprofile-section-num">02</span>
              Personal Information
            </h2>

            <div className="editprofile-grid-2">
              <Field label="Full Name" icon={UserIcon} error={errors.fullName}>
                <input
                  id="ep-fullName"
                  className="editprofile-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </Field>

              <Field label="Email Address" icon={MailIcon} error={errors.email}>
                <input
                  id="ep-email"
                  className="editprofile-input"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Field>

              <Field label="Phone Number" icon={PhoneIcon} hint="optional">
                <input
                  className="editprofile-input"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </Field>

              <Field label="Location" icon={MapPinIcon}>
                <input
                  className="editprofile-input"
                  type="text"
                  placeholder="City, State or Remote"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="editprofile-divider" />

          {/* ════ SECTION: Professional Info ════ */}
          <div className="editprofile-section">
            <h2 className="editprofile-section-heading">
              <span className="editprofile-section-num">03</span>
              Professional Details
            </h2>

            <div className="editprofile-stack">
              <Field label="Job Title / Profession" icon={BriefcaseIcon} error={errors.jobTitle}>
                <input
                  id="ep-jobTitle"
                  className="editprofile-input"
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={form.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                />
              </Field>

              {/* Skills pill input */}
              <div className="editprofile-field">
                <label className="editprofile-label">
                  <span className="editprofile-label-icon"><TagIcon /></span>
                  Skills
                  <span className="editprofile-label-hint">press Enter or comma to add</span>
                </label>
                <div className="editprofile-skills-box">
                  {skills.map((skill) => (
                    <span key={skill} className="editprofile-skill-pill">
                      {skill}
                      <button
                        type="button"
                        className="editprofile-skill-remove"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                      >×</button>
                    </span>
                  ))}
                  <input
                    className="editprofile-skills-input"
                    type="text"
                    placeholder={skills.length === 0 ? "e.g. React, Node.js, Figma…" : "Add skill…"}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }}
                  />
                </div>
              </div>

              <Field label="Short Bio / About" icon={null} error={errors.bio}>
                <textarea
                  id="ep-bio"
                  className="editprofile-textarea"
                  placeholder="Write a short professional bio about yourself…"
                  rows={5}
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
                <span className="editprofile-char-count">{form.bio.length} / 600</span>
              </Field>
            </div>
          </div>

          <div className="editprofile-divider" />

          {/* ════ SECTION: Online Presence ════ */}
          <div className="editprofile-section">
            <h2 className="editprofile-section-heading">
              <span className="editprofile-section-num">04</span>
              Online Presence
            </h2>

            <div className="editprofile-grid-2">
              <Field label="LinkedIn Profile" icon={LinkedInIcon} hint="optional">
                <div className="editprofile-input-prefix-wrap">
                  <span className="editprofile-input-prefix">linkedin.com/in/</span>
                  <input
                    className="editprofile-input editprofile-input-with-prefix"
                    type="text"
                    placeholder="yourhandle"
                    value={form.linkedin.replace("linkedin.com/in/", "")}
                    onChange={(e) => handleChange("linkedin", "linkedin.com/in/" + e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Portfolio / Website" icon={GlobeIcon} hint="optional">
                <input
                  className="editprofile-input"
                  type="url"
                  placeholder="https://yoursite.com"
                  value={form.portfolio}
                  onChange={(e) => handleChange("portfolio", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="editprofile-divider" />

          {/* ════ SECTION: Resume ════ */}
          <div className="editprofile-section">
            <h2 className="editprofile-section-heading">
              <span className="editprofile-section-num">05</span>
              Resume
              <span className="editprofile-section-hint">optional</span>
            </h2>

            {resumeFile ? (
              <div className="editprofile-resume-preview">
                <div className="editprofile-resume-file-icon">
                  <FileIcon />
                </div>
                <div className="editprofile-resume-info">
                  <span className="editprofile-resume-name">{resumeFile.name}</span>
                  <span className="editprofile-resume-size">
                    {(resumeFile.size / 1024).toFixed(0)} KB · Uploaded just now
                  </span>
                </div>
                <button
                  type="button"
                  className="editprofile-resume-remove"
                  onClick={handleRemoveResume}
                  title="Remove resume"
                >
                  <TrashIcon />
                </button>
              </div>
            ) : (
              <div
                className="editprofile-resume-dropzone"
                onClick={() => resumeInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && resumeInputRef.current?.click()}
              >
                <div className="editprofile-resume-upload-icon">
                  <UploadIcon />
                </div>
                <p className="editprofile-resume-drop-title">
                  Click to upload your resume
                </p>
                <p className="editprofile-resume-drop-desc">PDF or DOC · Max 10 MB</p>
              </div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="editprofile-hidden-input"
              onChange={handleResumeChange}
            />
          </div>

          {/* ════ ACTIONS ════ */}
          <div className="editprofile-actions">
            <button
              type="button"
              className="editprofile-btn editprofile-btn-ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`editprofile-btn editprofile-btn-primary ${saved ? "editprofile-btn-saved" : ""}`}
            >
              {saved ? <><CheckIcon /> Saved!</> : <><SaveIcon /> Save Changes</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
