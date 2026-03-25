import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Building2,
  Briefcase,
  DollarSign,
  MapPin,
  Loader2,
  AlertCircle,
  Search,
  Trash2,
} from "lucide-react";
import { getMySavedJobs, unsaveJobForSeeker } from "../../../services/jobSeekerService";
import "./SavedJobs.css";

const formatSalary = (min, max) => {
  const hasMin = typeof min === "number" && !Number.isNaN(min);
  const hasMax = typeof max === "number" && !Number.isNaN(max);
  const fmt = (n) => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
    } catch {
      return `₹${n}`;
    }
  };
  if (hasMin && hasMax) return `${fmt(min)} – ${fmt(max)}`;
  if (hasMin) return `${fmt(min)}+`;
  if (hasMax) return `Up to ${fmt(max)}`;
  return "";
};

const shortText = (text = "", max = 120) => {
  const t = String(text || "").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
};

const formatSavedDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
};

export default function SavedJobs() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: getMySavedJobs,
  });

  const savedRows = useMemo(() => data?.savedJobs || [], [data]);

  const removeMutation = useMutation({
    mutationFn: (jobId) => unsaveJobForSeeker(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobSeekerDashboard"] });
    },
  });

  const errMsg = error?.response?.data?.message || error?.message;

  const sorted = useMemo(() => {
    return [...savedRows].sort((a, b) => {
      const da = new Date(b.savedAt || 0).getTime();
      const db = new Date(a.savedAt || 0).getTime();
      return da - db;
    });
  }, [savedRows]);

  return (
    <div className="sj-page">
      <header className="sj-hero">
        <div className="sj-hero__inner">
          <div className="sj-hero__icon" aria-hidden>
            <Bookmark size={24} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="sj-hero__title">Saved jobs</h1>
            <p className="sj-hero__sub">Jobs you bookmarked for later. Remove or apply from job search anytime.</p>
          </div>
        </div>
        <Link className="sj-hero__cta" to="/jobSeeker/jobSearch">
          <Search size={16} />
          Find more jobs
        </Link>
      </header>

      <div className="sj-shell">
        {isError && (
          <div className="sj-banner sj-banner--error" role="alert">
            <AlertCircle size={18} />
            <span>{errMsg || "Could not load saved jobs."}</span>
          </div>
        )}

        {isLoading && (
          <div className="sj-loading" role="status">
            <Loader2 className="sj-loading__spin" size={36} aria-hidden />
            <p>Loading your saved jobs…</p>
          </div>
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <div className="sj-empty">
            <div className="sj-empty__icon" aria-hidden>
              <Bookmark size={40} strokeWidth={1.5} />
            </div>
            <h2 className="sj-empty__title">No saved jobs yet</h2>
            <p className="sj-empty__text">Browse jobs and tap the bookmark icon on any card to save it here.</p>
            <Link className="sj-empty__btn" to="/jobSeeker/jobSearch">
              Search jobs
            </Link>
          </div>
        )}

        {!isLoading && !isError && sorted.length > 0 && (
          <>
            <p className="sj-count">
              <span className="sj-count__num">{sorted.length}</span>
              {sorted.length === 1 ? "job saved" : "jobs saved"}
            </p>
            <div className="sj-grid">
              {sorted.map((row) => {
                const job = row.job;
                const jobId = job?._id;
                const jid = String(jobId || "");
                const active = job?.status === "active";
                const salary = formatSalary(job?.salaryMin, job?.salaryMax);
                const desc = shortText(job?.description, 140);

                return (
                  <article key={row._id || jid} className="sj-card">
                    <div className="sj-card__top">
                      <div className="sj-card__badge" aria-hidden>
                        <Building2 size={18} />
                      </div>
                      <div className="sj-card__head">
                        <h2 className="sj-card__title">{job?.jobTitle || "Job"}</h2>
                        <p className="sj-card__company">{job?.company || "Company"}</p>
                      </div>
                      <span className={`sj-pill ${active ? "sj-pill--ok" : "sj-pill--muted"}`}>
                        {active ? "Active" : "Unavailable"}
                      </span>
                    </div>

                    <div className="sj-card__tags">
                      {job?.jobType && (
                        <span className="sj-tag">
                          <Briefcase size={13} />
                          {job.jobType}
                        </span>
                      )}
                      {salary && (
                        <span className="sj-tag sj-tag--salary">
                          {salary}
                        </span>
                      )}
                    </div>

                    {desc ? <p className="sj-card__desc">{desc}</p> : null}

                    <div className="sj-card__loc">
                      <MapPin size={14} aria-hidden />
                      {job?.location || "Location not specified"}
                    </div>

                    <div className="sj-card__meta">
                      Saved {formatSavedDate(row.savedAt)}
                    </div>

                    <div className="sj-card__actions">
                      <button
                        type="button"
                        className="sj-btn sj-btn--ghost"
                        disabled={removeMutation.isPending}
                        onClick={() => jobId && removeMutation.mutate(String(jobId))}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                      <Link className="sj-btn sj-btn--primary" to="/jobSeeker/jobSearch">
                        Open job search
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
