import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./MyApplications.css";
import ApplicationCard from "./ApplicationCard";
import { getMyApplicationsV2 } from "../../../services/applicationService";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

const normalizeStatus = (raw) => {
  const s = String(raw || "").toLowerCase();
  if (s === "shortlisted" || s === "interview" || s === "offered") return { key: "shortlisted", label: "Shortlisted" };
  if (s === "rejected") return { key: "rejected", label: "Rejected" };
  if (s === "viewed" || s === "under_review") return { key: "under_review", label: "Under Review" };
  return { key: "applied", label: "Applied" };
};

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const serverBase = apiBase.replace(/\/api\/?$/, "");
const toPublicUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return `${serverBase}/${String(p).replace(/^\/+/, "")}`;
};

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (first + second).toUpperCase() || "CO";
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

export default function MyApplications() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest"); // latest | oldest
  const [toast, setToast] = useState({ type: "", message: "" });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myApplicationsV2"],
    queryFn: getMyApplicationsV2,
  });

  const raw = data?.applications || [];

  const apps = useMemo(() => {
    return raw.map((a) => {
      const job = a?.job || {};
      const st = normalizeStatus(a?.status);
      return {
        id: a?._id,
        jobId: job?._id,
        jobTitle: job?.jobTitle || "Job",
        companyName: job?.company || "Company",
        location: job?.location || "",
        uiStatusKey: st.key,
        uiStatusLabel: st.label,
        appliedOnLabel: formatDate(a?.createdAt),
        resumeUrl: toPublicUrl(a?.resumeUrl?.url),
        message: a?.coverLetter || "",
        createdAt: a?.createdAt,
      };
    });
  }, [raw]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = apps;
    if (q) {
      list = list.filter(
        (a) =>
          a.jobTitle.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q),
      );
    }
    if (status !== "all") {
      list = list.filter((a) => a.uiStatusKey === status);
    }
    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "oldest" ? da - db : db - da;
    });
    return list;
  }, [apps, query, status, sort]);

  const counts = useMemo(() => {
    const c = { all: apps.length, applied: 0, under_review: 0, shortlisted: 0, rejected: 0 };
    apps.forEach((a) => { c[a.uiStatusKey] += 1; });
    return c;
  }, [apps]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  if (isError && toast.message === "") {
    const msg = error?.response?.data?.message || "Failed to load applications.";
    // avoid repeated setState loops
    setTimeout(() => showToast("error", msg), 0);
  }

  return (
    <motion.div
      className="ma-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="ma-hero">
        <div className="ma-hero__inner">
          <div className="ma-hero__title">
            <div className="ma-hero__icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="ma-hero__h1">My Applications</h1>
              <p className="ma-hero__sub">Track your applications and follow up faster.</p>
            </div>
          </div>

          <div className="ma-stats">
            <div className="ma-stat">
              <span className="ma-stat__num">{counts.all}</span>
              <span className="ma-stat__lbl">Total</span>
            </div>
            <div className="ma-stat">
              <span className="ma-stat__num ma-stat__num--yellow">{counts.under_review}</span>
              <span className="ma-stat__lbl">Under review</span>
            </div>
            <div className="ma-stat">
              <span className="ma-stat__num ma-stat__num--green">{counts.shortlisted}</span>
              <span className="ma-stat__lbl">Shortlisted</span>
            </div>
          </div>
        </div>
      </header>

      <div className="ma-shell">
        {toast.message && (
          <div className={`ma-toast ${toast.type === "error" ? "ma-toast--error" : "ma-toast--success"}`} role="status">
            {toast.message}
          </div>
        )}

        <div className="ma-controls">
          <div className="ma-search">
            <span className="ma-search__icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="ma-search__input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job title, company, location…"
            />
          </div>

          <div className="ma-selects">
            <label className="ma-select">
              <span className="ma-select__lbl">Status</span>
              <select className="ma-select__input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} ({counts[o.value] ?? counts.all})
                  </option>
                ))}
              </select>
            </label>

            <label className="ma-select">
              <span className="ma-select__lbl">Sort</span>
              <select className="ma-select__input" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>
        </div>

        <main className="ma-list">
          {isLoading && (
            <div className="ma-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="ma-skel" key={`sk-${i}`}>
                  <div className="ma-skel__row">
                    <div className="ma-skel__logo" />
                    <div className="ma-skel__main">
                      <div className="ma-skel__line ma-skel__line--lg" />
                      <div className="ma-skel__line ma-skel__line--md" />
                    </div>
                    <div className="ma-skel__pill" />
                  </div>
                  <div className="ma-skel__line ma-skel__line--sm" />
                  <div className="ma-skel__line ma-skel__line--md" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="ma-empty">
              <div className="ma-empty__icon" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="ma-empty__title">No applications yet</h3>
              <p className="ma-empty__desc">
                {query.trim()
                  ? `No results for "${query}". Try a different search.`
                  : "Start applying to jobs to see them here."}
              </p>
              <button className="ma-btn ma-btn--primary" onClick={() => navigate("/jobSeeker/jobSearch")}>
                Browse Jobs
              </button>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <motion.div
              className="ma-grid"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.06 } },
              }}
            >
              {filtered.map((a) => (
                <motion.div
                  key={a.id}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <ApplicationCard
                    application={a}
                    badge={initials(a.companyName)}
                    onOpenJob={() => a.jobId && navigate(`/jobs/${a.jobId}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
