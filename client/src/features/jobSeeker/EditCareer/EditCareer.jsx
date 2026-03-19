import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../../../services/jobSeekerService";
import React, { useState } from "react";
import "./EditCareer.css";

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const GraduationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EMPTY_EXPERIENCE = {
  jobRole: "",
  companyName: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
};
const EMPTY_EDUCATION = {
  degree: "",
  institution: "",
  startYear: "",
  endYear: "",
};

export default function EditCareer() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("experience");
  const [savedToast, setSavedToast] = useState(false);
  const [expForm, setExpForm] = useState(EMPTY_EXPERIENCE);
  const [eduForm, setEduForm] = useState(EMPTY_EDUCATION);
  const [editingExpId, setEditingExpId] = useState(null);
  const [editingEduId, setEditingEduId] = useState(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduError, setEduError] = useState("");

  const { data: expData, isLoading: expLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience,
  });
  const { data: eduData, isLoading: eduLoading } = useQuery({
    queryKey: ["education"],
    queryFn: getEducation,
  });

  const experience = expData?.experience ?? [];
  const education = eduData?.education ?? [];

  const addExpMutation = useMutation({
    mutationFn: addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries(["experience"]);
      setExpForm(EMPTY_EXPERIENCE);
      setShowExpForm(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    },
  });
  const updateExpMutation = useMutation({
    mutationFn: ({ id, data }) => updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["experience"]);
      setEditingExpId(null);
      setExpForm(EMPTY_EXPERIENCE);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    },
  });
  const deleteExpMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries(["experience"]);
      setEditingExpId(null);
      setShowExpForm(false);
      setExpForm(EMPTY_EXPERIENCE);
    },
  });

  const addEduMutation = useMutation({
    mutationFn: addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
      setEduForm(EMPTY_EDUCATION);
      setShowEduForm(false);
      setEduError("");
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    },
  });
  const updateEduMutation = useMutation({
    mutationFn: ({ id, data }) => updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
      setEditingEduId(null);
      setEduForm(EMPTY_EDUCATION);
      setEduError("");
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    },
  });
  const deleteEduMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
      setEditingEduId(null);
      setShowEduForm(false);
      setEduForm(EMPTY_EDUCATION);
      setEduError("");
    },
  });

  const handleExpChange = (field, value) => setExpForm((p) => ({ ...p, [field]: value }));
  const handleEduChange = (field, value) => {
    setEduForm((p) => ({ ...p, [field]: value }));
    if (eduError) setEduError("");
  };

  const openAddExp = () => {
    setExpForm(EMPTY_EXPERIENCE);
    setEditingExpId(null);
    setShowExpForm(true);
  };
  const openEditExp = (item) => {
    setExpForm({
      jobRole: item.jobRole || "",
      companyName: item.companyName || "",
      startDate: item.startDate || "",
      endDate: item.endDate || "",
      currentlyWorking: !!item.currentlyWorking,
      description: item.description || "",
    });
    setEditingExpId(item._id);
    setShowExpForm(true);
  };
  const cancelExpForm = () => {
    setShowExpForm(false);
    setEditingExpId(null);
    setExpForm(EMPTY_EXPERIENCE);
  };
  const saveExp = (e) => {
    e.preventDefault();
    if (editingExpId) {
      updateExpMutation.mutate({ id: editingExpId, data: expForm });
    } else {
      addExpMutation.mutate(expForm);
    }
  };
  const removeExp = (id) => {
    if (window.confirm("Delete this experience?")) deleteExpMutation.mutate(id);
  };

  const openAddEdu = () => {
    setEduForm(EMPTY_EDUCATION);
    setEditingEduId(null);
    setEduError("");
    setShowEduForm(true);
  };
  const openEditEdu = (item) => {
    setEduForm({
      degree: item.degree || "",
      institution: item.institution || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "",
    });
    setEditingEduId(item._id);
    setEduError("");
    setShowEduForm(true);
  };
  const cancelEduForm = () => {
    setShowEduForm(false);
    setEditingEduId(null);
    setEduForm(EMPTY_EDUCATION);
    setEduError("");
  };
  const validateEdu = () => {
    if (!eduForm.degree?.trim() || !eduForm.institution?.trim() || !eduForm.startYear?.trim() || !eduForm.endYear?.trim()) {
      setEduError("Degree, institution, start year, and end year are required.");
      return false;
    }
    setEduError("");
    return true;
  };
  const saveEdu = (e) => {
    e.preventDefault();
    if (!validateEdu()) return;
    if (editingEduId) {
      updateEduMutation.mutate({ id: editingEduId, data: eduForm });
    } else {
      addEduMutation.mutate(eduForm);
    }
  };
  const removeEdu = (id) => {
    if (education.length <= 1) {
      setEduError("At least one education entry is required.");
      return;
    }
    if (window.confirm("Delete this education?")) deleteEduMutation.mutate(id);
  };

  const isSaving =
    addExpMutation.isPending ||
    updateExpMutation.isPending ||
    deleteExpMutation.isPending ||
    addEduMutation.isPending ||
    updateEduMutation.isPending ||
    deleteEduMutation.isPending;
  const isLoading = expLoading || eduLoading;

  if (isLoading) {
    return (
      <div className="editcareer-page">
        <div className="editcareer-loading">Loading career details...</div>
      </div>
    );
  }

  return (
    <div className="editcareer-page">
      <div className="editcareer-page-header">
        <div className="editcareer-page-header-inner">
          <div className="editcareer-page-title-group">
            <div className="editcareer-header-icon">
              <BriefcaseIcon />
            </div>
            <div>
              <h1 className="editcareer-page-title">Edit Career</h1>
              <p className="editcareer-page-subtitle">Manage your experience and education.</p>
            </div>
          </div>
          {savedToast && (
            <div className="editcareer-saved-toast">
              <CheckIcon />
              Saved successfully!
            </div>
          )}
        </div>
      </div>

      <div className="editcareer-container">
        <div className="editcareer-tabs">
          <button
            type="button"
            className={`editcareer-tab ${activeTab === "experience" ? "editcareer-tab-active" : ""}`}
            onClick={() => setActiveTab("experience")}
          >
            <BriefcaseIcon />
            Experience
            <span className="editcareer-tab-hint">optional</span>
          </button>
          <button
            type="button"
            className={`editcareer-tab ${activeTab === "education" ? "editcareer-tab-active" : ""}`}
            onClick={() => setActiveTab("education")}
          >
            <GraduationIcon />
            Education
            <span className="editcareer-tab-hint">required</span>
          </button>
        </div>

        <div className="editcareer-content">
          {activeTab === "experience" && (
            <div className="editcareer-panel">
              <div className="editcareer-panel-head">
                <h2 className="editcareer-section-heading">Work Experience</h2>
                <button type="button" className="editcareer-btn editcareer-btn-primary-sm" onClick={openAddExp}>
                  <PlusIcon />
                  Add Experience
                </button>
              </div>

              {showExpForm && (
                <div className="editcareer-card editcareer-card-form">
                  <h3 className="editcareer-card-form-title">{editingExpId ? "Edit Experience" : "Add Experience"}</h3>
                  <form onSubmit={saveExp} className="editcareer-form">
                    <div className="editcareer-grid-2">
                      <div className="editcareer-field">
                        <label className="editcareer-label">Job role</label>
                        <input
                          className="editcareer-input"
                          value={expForm.jobRole}
                          onChange={(e) => handleExpChange("jobRole", e.target.value)}
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div className="editcareer-field">
                        <label className="editcareer-label">Company name</label>
                        <input
                          className="editcareer-input"
                          value={expForm.companyName}
                          onChange={(e) => handleExpChange("companyName", e.target.value)}
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                    <div className="editcareer-grid-2">
                      <div className="editcareer-field">
                        <label className="editcareer-label">Start date</label>
                        <input
                          type="month"
                          className="editcareer-input"
                          value={expForm.startDate}
                          onChange={(e) => handleExpChange("startDate", e.target.value)}
                        />
                      </div>
                      <div className="editcareer-field">
                        <label className="editcareer-label">End date</label>
                        <input
                          type="month"
                          className="editcareer-input"
                          value={expForm.endDate}
                          onChange={(e) => handleExpChange("endDate", e.target.value)}
                          disabled={expForm.currentlyWorking}
                          placeholder={expForm.currentlyWorking ? "Current" : "Month"}
                        />
                      </div>
                    </div>
                    <div className="editcareer-field editcareer-checkbox-wrap">
                      <label className="editcareer-checkbox-label">
                        <input
                          type="checkbox"
                          checked={expForm.currentlyWorking}
                          onChange={(e) => handleExpChange("currentlyWorking", e.target.checked)}
                        />
                        <span>Currently working here</span>
                      </label>
                    </div>
                    <div className="editcareer-field">
                      <label className="editcareer-label">Description</label>
                      <textarea
                        className="editcareer-textarea"
                        value={expForm.description}
                        onChange={(e) => handleExpChange("description", e.target.value)}
                        placeholder="Describe your role and achievements..."
                        rows={4}
                      />
                    </div>
                    <div className="editcareer-form-actions">
                      <button type="button" className="editcareer-btn editcareer-btn-ghost" onClick={cancelExpForm}>
                        <CloseIcon />
                        Cancel
                      </button>
                      <button type="submit" className="editcareer-btn editcareer-btn-primary" disabled={isSaving}>
                        <CheckIcon />
                        {editingExpId ? "Save" : "Add"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="editcareer-list">
                {experience.length === 0 && !showExpForm && (
                  <p className="editcareer-empty">No experience added yet. Click &quot;Add Experience&quot; to add one.</p>
                )}
                {experience.map((item) => (
                  <div key={item._id} className="editcareer-card">
                    <div className="editcareer-card-main">
                      <h3 className="editcareer-card-title">{item.jobRole || "Role"}</h3>
                      <p className="editcareer-card-subtitle">{item.companyName || "Company"}</p>
                      <p className="editcareer-card-meta">
                        {item.startDate || "—"}
                        {item.currentlyWorking ? " – Present" : item.endDate ? ` – ${item.endDate}` : ""}
                      </p>
                      {item.description && <p className="editcareer-card-desc">{item.description}</p>}
                    </div>
                    <div className="editcareer-card-actions">
                      <button type="button" className="editcareer-btn-icon" onClick={() => openEditExp(item)} title="Edit">
                        <PencilIcon />
                      </button>
                      <button type="button" className="editcareer-btn-icon editcareer-btn-icon-danger" onClick={() => removeExp(item._id)} title="Delete">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="editcareer-panel">
              <div className="editcareer-panel-head">
                <h2 className="editcareer-section-heading">Education</h2>
                <button type="button" className="editcareer-btn editcareer-btn-primary-sm" onClick={openAddEdu}>
                  <PlusIcon />
                  Add Education
                </button>
              </div>
              {eduError && <p className="editcareer-error-msg">{eduError}</p>}

              {showEduForm && (
                <div className="editcareer-card editcareer-card-form">
                  <h3 className="editcareer-card-form-title">{editingEduId ? "Edit Education" : "Add Education"}</h3>
                  <form onSubmit={saveEdu} className="editcareer-form">
                    <div className="editcareer-grid-2">
                      <div className="editcareer-field">
                        <label className="editcareer-label">Degree</label>
                        <input
                          className="editcareer-input"
                          value={eduForm.degree}
                          onChange={(e) => handleEduChange("degree", e.target.value)}
                          placeholder="e.g. B.Tech, MBA"
                        />
                      </div>
                      <div className="editcareer-field">
                        <label className="editcareer-label">Institution</label>
                        <input
                          className="editcareer-input"
                          value={eduForm.institution}
                          onChange={(e) => handleEduChange("institution", e.target.value)}
                          placeholder="School or university"
                        />
                      </div>
                    </div>
                    <div className="editcareer-grid-2">
                      <div className="editcareer-field">
                        <label className="editcareer-label">Start year</label>
                        <input
                          className="editcareer-input"
                          value={eduForm.startYear}
                          onChange={(e) => handleEduChange("startYear", e.target.value)}
                          placeholder="e.g. 2018"
                        />
                      </div>
                      <div className="editcareer-field">
                        <label className="editcareer-label">End year</label>
                        <input
                          className="editcareer-input"
                          value={eduForm.endYear}
                          onChange={(e) => handleEduChange("endYear", e.target.value)}
                          placeholder="e.g. 2022"
                        />
                      </div>
                    </div>
                    <div className="editcareer-form-actions">
                      <button type="button" className="editcareer-btn editcareer-btn-ghost" onClick={cancelEduForm}>
                        <CloseIcon />
                        Cancel
                      </button>
                      <button type="submit" className="editcareer-btn editcareer-btn-primary" disabled={isSaving}>
                        <CheckIcon />
                        {editingEduId ? "Save" : "Add"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="editcareer-list">
                {education.length === 0 && !showEduForm && (
                  <p className="editcareer-empty editcareer-empty-required">Add at least one education entry.</p>
                )}
                {education.map((item) => (
                  <div key={item._id} className="editcareer-card">
                    <div className="editcareer-card-main">
                      <h3 className="editcareer-card-title">{item.degree || "Degree"}</h3>
                      <p className="editcareer-card-subtitle">{item.institution || "Institution"}</p>
                      <p className="editcareer-card-meta">
                        {item.startYear || "—"} – {item.endYear || "—"}
                      </p>
                    </div>
                    <div className="editcareer-card-actions">
                      <button type="button" className="editcareer-btn-icon" onClick={() => openEditEdu(item)} title="Edit">
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className="editcareer-btn-icon editcareer-btn-icon-danger"
                        onClick={() => removeEdu(item._id)}
                        title="Delete"
                        disabled={education.length <= 1}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
