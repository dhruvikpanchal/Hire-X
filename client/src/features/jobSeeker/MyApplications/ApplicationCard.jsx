import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const extractFileName = (url = "") => {
  try {
    const u = String(url);
    const parts = u.split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || "");
  } catch {
    return "";
  }
};

export default function ApplicationCard({
  application,
  badge,
  onOpenJob,
}) {
  const [expanded, setExpanded] = useState(false);

  const resumeName = useMemo(() => extractFileName(application.resumeUrl), [application.resumeUrl]);

  return (
    <motion.article
      className="ma-card"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      <div className="ma-card__top">
        <div className="ma-card__logo" aria-hidden>
          {badge}
        </div>

        <div className="ma-card__main">
          <h3 className="ma-card__title">{application.jobTitle}</h3>
          <p className="ma-card__company">{application.companyName}</p>
        </div>

        <span className={`ma-badge ma-badge--${application.uiStatusKey}`}>
          {application.uiStatusLabel}
        </span>
      </div>

      <div className="ma-card__meta">
        <span className="ma-meta">
          <MapPinIcon /> {application.location || "Location not specified"}
        </span>
        <span className="ma-meta">
          <CalendarIcon /> Applied {application.appliedOnLabel}
        </span>
      </div>

      <div className="ma-card__divider" />

      <div className="ma-card__bottom">
        <div className="ma-card__left">
          <div className="ma-resume">
            <span className="ma-resume__label">Resume</span>
            {application.resumeUrl ? (
              <a className="ma-resume__link" href={application.resumeUrl} target="_blank" rel="noreferrer">
                <FileIcon />
                <span className="ma-resume__name">{resumeName || "Resume"}</span>
              </a>
            ) : (
              <span className="ma-resume__empty">Not available</span>
            )}
          </div>

          <button
            className="ma-expand"
            type="button"
            onClick={() => setExpanded((p) => !p)}
            aria-expanded={expanded}
          >
            <span>{expanded ? "Hide message" : "View message"}</span>
            <span className={`ma-expand__chev ${expanded ? "ma-expand__chev--open" : ""}`}>
              <ChevronIcon />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                className="ma-message"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <p className="ma-message__text">
                  {application.message || "No message provided."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="ma-card__actions">
          <button className="ma-btn ma-btn--ghost" type="button" onClick={onOpenJob}>
            View job
          </button>
        </div>
      </div>
    </motion.article>
  );
}

