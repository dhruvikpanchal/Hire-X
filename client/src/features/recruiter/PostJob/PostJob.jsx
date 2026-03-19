import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PostJob.css";
import {
  createJob,
  getJobById,
  updateJob,
} from "../../../services/jobService.js";

/* ─── Constants ─── */
const STEPS = [
  { id: 1, label: "Basic Details", short: "Basics" },
  { id: 2, label: "Description", short: "Details" },
  { id: 3, label: "Requirements", short: "Skills" },
  { id: 4, label: "Review & Post", short: "Review" },
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Hybrid",
  "Internship",
  "Contract",
];
const EXPERIENCE_LEVELS = [
  "Entry Level (0–1 yrs)",
  "Junior (1–3 yrs)",
  "Mid-Level (3–5 yrs)",
  "Senior (5–8 yrs)",
  "Lead / Principal (8+ yrs)",
];
const EDUCATION_OPTIONS = [
  "No Requirement",
  "High School / GED",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
];

const EMPTY_FORM = {
  jobTitle: "",
  company: "",
  location: "",
  jobType: "",
  salaryMin: "",
  salaryMax: "",
  description: "",
  responsibilities: "",
  skills: [],
  skillInput: "",
  experience: "",
  education: "",
};

/* ─── Icons ─── */
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const RocketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const DollarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TagIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const GradCapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

/* ─── Field wrapper ─── */
function Field({ label, hint, icon: Icon, error, children, className = "" }) {
  return (
    <div
      className={`postjob-field ${error ? "postjob-field-error" : ""} ${className}`}
    >
      <label className="postjob-label">
        {Icon && (
          <span className="postjob-label-icon">
            <Icon />
          </span>
        )}
        <span>{label}</span>
        {hint && <span className="postjob-label-hint">{hint}</span>}
      </label>
      {children}
      {error && <span className="postjob-error-msg">{error}</span>}
    </div>
  );
}

/* ─── Review row ─── */
function ReviewRow({ label, value, onEdit, step }) {
  if (!value) return null;
  return (
    <div className="postjob-review-row">
      <span className="postjob-review-label">{label}</span>
      <span className="postjob-review-value">{value}</span>
      <button
        className="postjob-review-edit"
        onClick={() => onEdit(step)}
        title={`Edit ${label}`}
      >
        <EditIcon />
      </button>
    </div>
  );
}

/* ─── Main Component ─── */
export default function PostJob() {
  const { id } = useParams();
  console.log(id); // should print job id

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [animKey, setAnimKey] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [published, setPublished] = useState(false);
  const formRef = useRef(null);

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await getJobById(id);

        console.log("Full Api : ", res);

        const job = res.job || res;
        setForm({
          jobTitle: job.jobTitle || "",
          company: job.company || "",
          location: job.location || "",
          jobType: job.jobType || "",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          description: job.description || "",
          responsibilities: job.responsibilities || "",
          skills: job.skills || [],
          skillInput: "",
          experience: job.experience || "",
          education: job.education || "",
        });
      } catch (err) {
        console.error("Error loading job:", err);
      }
    };

    fetchJob();
  }, [id]);

  /* Field helpers */
  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const addSkill = (raw) => {
    const trimmed = raw.trim().replace(/,$/, "");
    if (trimmed && !form.skills.includes(trimmed)) {
      set("skills", [...form.skills, trimmed]);
    }
    set("skillInput", "");
  };

  const removeSkill = (s) =>
    set(
      "skills",
      form.skills.filter((x) => x !== s),
    );

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(form.skillInput);
    } else if (
      e.key === "Backspace" &&
      !form.skillInput &&
      form.skills.length
    ) {
      set("skills", form.skills.slice(0, -1));
    }
  };

  /* Validation per step */
  const validate = (s) => {
    const errs = {};
    if (s === 1) {
      if (!form.jobTitle.trim()) errs.jobTitle = "Job title is required.";
      if (!form.company.trim()) errs.company = "Company name is required.";
      if (!form.location.trim()) errs.location = "Location is required.";
      if (!form.jobType) errs.jobType = "Please select a job type.";
    }
    if (s === 2) {
      if (!form.description.trim())
        errs.description = "Job description is required.";
      if (!form.responsibilities.trim())
        errs.responsibilities = "Responsibilities are required.";
    }
    if (s === 3) {
      if (form.skills.length === 0)
        errs.skills = "Add at least one required skill.";
      if (!form.experience)
        errs.experience = "Please select an experience level.";
    }
    return errs;
  };

  const goTo = (target, dir) => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setStep(target);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNext = () => {
    const errs = validate(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    goTo(step + 1, "forward");
  };

  const handleBack = () => goTo(step - 1, "backward");

  const handleEdit = (s) => goTo(s, "backward");

  const handlePublish = async () => {
    try {
      const payload = {
        jobTitle: form.jobTitle,
        company: form.company,
        location: form.location,
        jobType: form.jobType,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        description: form.description,
        responsibilities: form.responsibilities,
        skills: form.skills,
        experience: form.experience,
        education: form.education,
      };

      if (id) {
        // ✅ EDIT MODE
        await updateJob(id, payload);
      } else {
        // ✅ CREATE MODE
        await createJob(payload);
      }

      setPublished(true);
    } catch (error) {
      console.error("Job publish error:", error);
      alert("Failed to submit job");
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setPublished(false);
    setStep(1);
    setDirection("forward");
    setAnimKey((k) => k + 1);
  };

  /* ─── Published success screen ─── */
  if (published) {
    return (
      <div className="postjob-page">
        <div className="postjob-success">
          <div className="postjob-success-icon">
            <RocketIcon />
          </div>
          <h2 className="postjob-success-title">Job Posted Successfully!</h2>
          <p className="postjob-success-desc">
            <strong>{form.jobTitle}</strong> at <strong>{form.company}</strong>{" "}
            is now live and visible to candidates.
          </p>
          <div className="postjob-success-actions">
            <button
              className="postjob-btn postjob-btn-outline"
              onClick={handleReset}
            >
              Post Another Job
            </button>
            <button className="postjob-btn postjob-btn-primary">
              View Job Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="postjob-page">
      {/* ── Header ── */}
      <header className="postjob-header">
        <div className="postjob-header-bg" aria-hidden>
          <div className="pjh-dot-grid" />
          <div className="pjh-glow" />
        </div>
        <div className="postjob-header-inner">
          <div className="postjob-header-title-group">
            <div className="postjob-header-icon">
              <BriefcaseIcon />
            </div>
            <div>
              <h1 className="postjob-header-title">Post a New Job</h1>
              <p className="postjob-header-sub">
                Fill in the details below to publish your listing to thousands
                of candidates.
              </p>
            </div>
          </div>
          <div className="postjob-header-step-label">
            Step <strong>{step}</strong> of <strong>{STEPS.length}</strong>
          </div>
        </div>
      </header>

      <div className="postjob-container" ref={formRef}>
        {/* ── Step Progress ── */}
        <div className="postjob-steps">
          <div className="postjob-progress-track">
            <div
              className="postjob-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="postjob-step-nodes">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`postjob-step-node ${step === s.id ? "pj-step-active" : ""} ${step > s.id ? "pj-step-done" : ""}`}
              >
                <div className="postjob-step-circle">
                  {step > s.id ? <CheckIcon /> : <span>{s.id}</span>}
                </div>
                <span className="postjob-step-label">{s.label}</span>
                <span className="postjob-step-label-short">{s.short}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Card ── */}
        <div
          className={`postjob-card postjob-slide-${direction}`}
          key={animKey}
        >
          {/* ════ STEP 1: Basic Details ════ */}
          {step === 1 && (
            <div className="postjob-step-content">
              <div className="postjob-step-heading">
                <span className="postjob-step-num">01</span>
                <h2>Basic Job Details</h2>
              </div>
              <div className="postjob-grid-2">
                <Field
                  label="Job Title"
                  error={errors.jobTitle}
                  icon={BriefcaseIcon}
                >
                  <input
                    className="postjob-input"
                    placeholder="e.g. Senior React Developer"
                    value={form.jobTitle}
                    onChange={(e) => set("jobTitle", e.target.value)}
                  />
                </Field>
                <Field
                  label="Company Name"
                  error={errors.company}
                  icon={() => (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                >
                  <input
                    className="postjob-input"
                    placeholder="e.g. Nexora Technologies"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </Field>
              </div>

              <div className="postjob-grid-2">
                <Field
                  label="Job Location"
                  error={errors.location}
                  icon={MapPinIcon}
                >
                  <input
                    className="postjob-input"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </Field>
                <Field
                  label="Job Type"
                  error={errors.jobType}
                  icon={BriefcaseIcon}
                >
                  <div className="postjob-select-wrap">
                    <select
                      className="postjob-select"
                      value={form.jobType}
                      onChange={(e) => set("jobType", e.target.value)}
                    >
                      <option value="">Select job type…</option>
                      {JOB_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <span className="postjob-select-arrow">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </Field>
              </div>

              <Field label="Salary Range" hint="optional" icon={DollarIcon}>
                <div className="postjob-salary-row">
                  <input
                    className="postjob-input"
                    placeholder="Min (e.g. 80,000)"
                    value={form.salaryMin}
                    onChange={(e) => set("salaryMin", e.target.value)}
                  />
                  <span className="postjob-salary-sep">—</span>
                  <input
                    className="postjob-input"
                    placeholder="Max (e.g. 120,000)"
                    value={form.salaryMax}
                    onChange={(e) => set("salaryMax", e.target.value)}
                  />
                  <span className="postjob-salary-currency">INR / yr</span>
                </div>
              </Field>

              {/* Job type quick-select tiles */}
              <div className="postjob-type-tiles">
                {JOB_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`postjob-type-tile ${form.jobType === t ? "pj-tile-active" : ""}`}
                    onClick={() => set("jobType", t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════ STEP 2: Description ════ */}
          {step === 2 && (
            <div className="postjob-step-content">
              <div className="postjob-step-heading">
                <span className="postjob-step-num">02</span>
                <h2>Job Description</h2>
              </div>
              <Field
                label="Job Description"
                error={errors.description}
                icon={() => (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                )}
              >
                <textarea
                  className="postjob-textarea postjob-textarea-lg"
                  placeholder="Describe the role, team, and company culture. What will the successful candidate be working on day-to-day?"
                  rows={8}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <span className="postjob-char-count">
                  {form.description.length} characters
                </span>
              </Field>

              <Field
                label="Key Responsibilities"
                error={errors.responsibilities}
                icon={() => (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                )}
              >
                <textarea
                  className="postjob-textarea"
                  placeholder={
                    "• Lead development of new product features\n• Conduct code reviews and mentor junior engineers\n• Collaborate with design and product teams\n• Improve system performance and scalability"
                  }
                  rows={6}
                  value={form.responsibilities}
                  onChange={(e) => set("responsibilities", e.target.value)}
                />
                <span className="postjob-field-tip">
                  Tip: Use bullet points (•) for clarity.
                </span>
              </Field>
            </div>
          )}

          {/* ════ STEP 3: Requirements ════ */}
          {step === 3 && (
            <div className="postjob-step-content">
              <div className="postjob-step-heading">
                <span className="postjob-step-num">03</span>
                <h2>Job Requirements</h2>
              </div>

              {/* Skills pill input */}
              <Field
                label="Required Skills"
                error={errors.skills}
                icon={TagIcon}
              >
                <div
                  className={`postjob-skills-box ${errors.skills ? "postjob-skills-error" : ""}`}
                >
                  {form.skills.map((s) => (
                    <span key={s} className="postjob-skill-pill">
                      {s}
                      <button
                        type="button"
                        className="postjob-skill-remove"
                        onClick={() => removeSkill(s)}
                      >
                        <XIcon />
                      </button>
                    </span>
                  ))}
                  <input
                    className="postjob-skills-input"
                    type="text"
                    placeholder={
                      form.skills.length === 0
                        ? "e.g. React, Python, Figma… (Enter to add)"
                        : "Add skill…"
                    }
                    value={form.skillInput}
                    onChange={(e) => set("skillInput", e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={() => {
                      if (form.skillInput.trim()) addSkill(form.skillInput);
                    }}
                  />
                </div>
              </Field>

              <div className="postjob-grid-2">
                <Field
                  label="Experience Level"
                  error={errors.experience}
                  icon={() => (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  )}
                >
                  <div className="postjob-select-wrap">
                    <select
                      className="postjob-select"
                      value={form.experience}
                      onChange={(e) => set("experience", e.target.value)}
                    >
                      <option value="">Select level…</option>
                      {EXPERIENCE_LEVELS.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                    <span className="postjob-select-arrow">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </Field>

                <Field
                  label="Education Requirement"
                  hint="optional"
                  icon={GradCapIcon}
                >
                  <div className="postjob-select-wrap">
                    <select
                      className="postjob-select"
                      value={form.education}
                      onChange={(e) => set("education", e.target.value)}
                    >
                      {EDUCATION_OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <span className="postjob-select-arrow">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* ════ STEP 4: Review ════ */}
          {step === 4 && (
            <div className="postjob-step-content">
              <div className="postjob-step-heading">
                <span className="postjob-step-num">04</span>
                <h2>Review & Publish</h2>
              </div>

              <div className="postjob-review-banner">
                <span className="postjob-review-banner-icon">
                  <CheckIcon />
                </span>
                Everything looks great! Review the details below before
                publishing.
              </div>

              {/* Job header preview */}
              <div className="postjob-preview-card">
                <div className="postjob-preview-logo">
                  {form.company?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="postjob-preview-title">
                    {form.jobTitle || "—"}
                  </div>
                  <div className="postjob-preview-company">
                    {form.company || "—"}
                  </div>
                  <div className="postjob-preview-meta">
                    {form.location && <span>📍 {form.location}</span>}
                    {form.jobType && (
                      <span className="postjob-preview-type-badge">
                        {form.jobType}
                      </span>
                    )}
                    {(form.salaryMin || form.salaryMax) && (
                      <span>
                        💰 ${form.salaryMin}
                        {form.salaryMax ? `–$${form.salaryMax}` : "+"} INR/yr
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="postjob-review-sections">
                {/* Section: Description */}
                <div className="postjob-review-section">
                  <div className="postjob-review-section-header">
                    <span className="postjob-review-section-title">
                      Job Description
                    </span>
                    <button
                      className="postjob-review-section-edit"
                      onClick={() => handleEdit(2)}
                    >
                      <EditIcon /> Edit
                    </button>
                  </div>
                  <p className="postjob-review-text">
                    {form.description || "—"}
                  </p>
                </div>

                {/* Section: Responsibilities */}
                <div className="postjob-review-section">
                  <div className="postjob-review-section-header">
                    <span className="postjob-review-section-title">
                      Responsibilities
                    </span>
                    <button
                      className="postjob-review-section-edit"
                      onClick={() => handleEdit(2)}
                    >
                      <EditIcon /> Edit
                    </button>
                  </div>
                  <p className="postjob-review-text">
                    {form.responsibilities || "—"}
                  </p>
                </div>

                {/* Section: Requirements */}
                <div className="postjob-review-section">
                  <div className="postjob-review-section-header">
                    <span className="postjob-review-section-title">
                      Requirements
                    </span>
                    <button
                      className="postjob-review-section-edit"
                      onClick={() => handleEdit(3)}
                    >
                      <EditIcon /> Edit
                    </button>
                  </div>
                  <div className="postjob-review-skills">
                    {form.skills.length > 0 ? (
                      form.skills.map((s) => (
                        <span key={s} className="postjob-review-skill-chip">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="postjob-review-text">—</span>
                    )}
                  </div>
                  <div className="postjob-review-meta-grid">
                    {form.experience && (
                      <div className="postjob-review-meta-item">
                        <span className="postjob-review-meta-key">
                          Experience
                        </span>
                        <span className="postjob-review-meta-val">
                          {form.experience}
                        </span>
                      </div>
                    )}
                    {form.education && form.education !== "No Requirement" && (
                      <div className="postjob-review-meta-item">
                        <span className="postjob-review-meta-key">
                          Education
                        </span>
                        <span className="postjob-review-meta-val">
                          {form.education}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Nav Buttons ── */}
          <div className="postjob-actions">
            <button
              type="button"
              className={`postjob-btn postjob-btn-ghost ${step === 1 ? "postjob-btn-hidden" : ""}`}
              onClick={handleBack}
            >
              <ChevronLeftIcon /> Previous
            </button>
            <div className="postjob-actions-right">
              {step < 4 && (
                <button
                  type="button"
                  className="postjob-btn postjob-btn-primary"
                  onClick={handleNext}
                >
                  Continue <ChevronRightIcon />
                </button>
              )}
              {step === 4 && (
                <>
                  <button
                    type="button"
                    className="postjob-btn postjob-btn-outline"
                    onClick={handleBack}
                  >
                    <ChevronLeftIcon /> Go Back
                  </button>
                  <button
                    type="button"
                    className="postjob-btn postjob-btn-publish"
                    onClick={handlePublish}
                  >
                    <RocketIcon /> Publish Job
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
