import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Newspaper,
  Building2,
  MapPin,
  Search,
  X,
  PencilLine,
} from "lucide-react";
import {
  getMyRecruiterProfile,
  getRecruiterFeedPosts,
  getRecruiterConnections,
  sendRecruiterConnectionRequest,
  acceptRecruiterConnectionRequest,
  removeRecruiterConnection,
} from "../../../services/recruiterService.js";
import { toPublicUrl } from "../../../utils/mediaUrl.js";
import "./RecruiterFeed.css";

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (a + b).toUpperCase() || "R";
};

function Avatar({ user }) {
  const label = user?.fullName || user?.email || "?";
  const url = toPublicUrl(user?.avatar);
  return (
    <div className="rf-avatar" aria-hidden>
      {url ? <img src={url} alt="" className="rf-avatar__img" /> : initials(label)}
    </div>
  );
}

function formatWhen(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

export default function RecruiterFeed() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ type: "", message: "" });
  const [keyword, setKeyword] = useState("");

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast({ type: "", message: "" }), 3200);
  };

  const invalidateSocial = () => {
    queryClient.invalidateQueries({ queryKey: ["recruiterFeedPosts"] });
    queryClient.invalidateQueries({ queryKey: ["recruiterConnections"] });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({ queryKey: ["chatRequests"] });
  };

  const { data: profileData } = useQuery({
    queryKey: ["recruiterProfile"],
    queryFn: getMyRecruiterProfile,
  });

  const myUserId = profileData?.recruiter?.user?._id || profileData?.recruiter?.user;

  const { data: feedRes, isLoading: loadingFeed } = useQuery({
    queryKey: ["recruiterFeedPosts"],
    queryFn: getRecruiterFeedPosts,
  });

  const { data: connRes, isLoading: loadingConn } = useQuery({
    queryKey: ["recruiterConnections"],
    queryFn: getRecruiterConnections,
  });

  const posts = useMemo(() => feedRes?.posts || [], [feedRes]);
  const connections = useMemo(() => connRes?.connections || [], [connRes]);
  const pendingIncoming = useMemo(() => connRes?.pendingIncoming || [], [connRes]);
  const pendingOutgoing = useMemo(() => connRes?.pendingOutgoing || [], [connRes]);

  const friendIds = useMemo(() => {
    const s = new Set();
    connections.forEach((row) => {
      if (row.user?._id) s.add(String(row.user._id));
    });
    return s;
  }, [connections]);

  const outgoingIds = useMemo(() => {
    const s = new Set();
    pendingOutgoing.forEach((p) => {
      if (p.user?._id) s.add(String(p.user._id));
    });
    return s;
  }, [pendingOutgoing]);

  const incomingByUserId = useMemo(() => {
    const m = new Map();
    pendingIncoming.forEach((p) => {
      if (p.user?._id) m.set(String(p.user._id), p);
    });
    return m;
  }, [pendingIncoming]);

  const sendMut = useMutation({
    mutationFn: (recruiterId) => sendRecruiterConnectionRequest(recruiterId),
    onSuccess: (data) => {
      invalidateSocial();
      showToast("success", data?.message || "Request sent");
    },
    onError: (err) => {
      showToast("error", err?.message || "Could not send request");
    },
  });

  const acceptMut = useMutation({
    mutationFn: (requestId) => acceptRecruiterConnectionRequest(requestId),
    onSuccess: (data) => {
      invalidateSocial();
      showToast("success", data?.message || "Connected");
    },
    onError: (err) => {
      showToast("error", err?.message || "Could not accept");
    },
  });

  const removeMut = useMutation({
    mutationFn: (otherUserId) => removeRecruiterConnection(otherUserId),
    onSuccess: (data) => {
      invalidateSocial();
      showToast("success", data?.message || "Connection removed");
    },
    onError: (err) => {
      showToast("error", err?.message || "Could not remove connection");
    },
  });

  const loading = loadingFeed || loadingConn;

  const filteredPosts = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return posts.filter((post) => {
      const author = post.author || {};
      if (!k) return true;
      const blob = [
        author.fullName,
        author.email,
        author.companyName,
        author.location,
        post.jobTitle,
        post.company,
        post.location,
        post.jobType,
        post.status,
        post.description,
        ...(Array.isArray(post.skills) ? post.skills : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(k);
    });
  }, [posts, keyword]);

  return (
    <div className="rf-page">
      <header className="rf-hero">
        <div className="rf-hero__icon" aria-hidden>
          <Newspaper size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="rf-hero__title">Recruiter feed</h1>
          <p className="rf-hero__sub">
            See all recruiter posts, filter quickly, and connect or message from one place.
          </p>
        </div>
      </header>

      {toast.message && (
        <div
          className={`rf-toast ${toast.type === "error" ? "rf-toast--err" : "rf-toast--ok"}`}
          role="status"
        >
          {toast.message}
        </div>
      )}

      {loading && (
        <div className="rf-loading">
          <Loader2 className="rf-loading__spin" size={32} aria-hidden />
          <span>Loading feed…</span>
        </div>
      )}

      {!loading && (
        <>
          <section className="rf-filter" aria-label="Filter posts">
            <div className="rf-filter__field rf-filter__field--grow">
              <span className="rf-filter__icon" aria-hidden>
                <Search size={17} />
              </span>
              <input
                type="search"
                className="rf-filter__input"
                placeholder="Filter by recruiter, company, or post text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword ? (
                <button
                  type="button"
                  className="rf-filter__clear"
                  onClick={() => setKeyword("")}
                  aria-label="Clear filter"
                >
                  <X size={15} />
                </button>
              ) : null}
            </div>
          </section>

          {pendingIncoming.length > 0 && (
            <section className="rf-section">
              <h2 className="rf-section__title">Connection requests</h2>
              <p className="rf-section__hint">Accept to unlock direct messages with these recruiters.</p>
              <div className="rf-requests">
                {pendingIncoming.map((row) => {
                  const u = row.user;
                  if (!u) return null;
                  return (
                    <article key={String(row.connectionId)} className="rf-request-card">
                      <Avatar user={u} />
                      <div className="rf-request-card__main">
                        <div className="rf-request-card__name">{u.fullName || u.email}</div>
                        {u.companyName && (
                          <div className="rf-request-card__meta">
                            <Building2 size={14} aria-hidden />
                            {u.companyName}
                          </div>
                        )}
                        {u.location && (
                          <div className="rf-request-card__meta">
                            <MapPin size={14} aria-hidden />
                            {u.location}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="rf-btn rf-btn--primary"
                        disabled={acceptMut.isPending}
                        onClick={() => acceptMut.mutate(row.connectionId)}
                      >
                        Accept
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <section className="rf-section">
            <h2 className="rf-section__title">My connections</h2>
            {connections.length === 0 ? (
              <p className="rf-empty">No connections yet.</p>
            ) : (
              <div className="rf-requests">
                {connections.map((row) => {
                  const u = row.user;
                  if (!u) return null;
                  return (
                    <article key={String(row.connectionId)} className="rf-request-card">
                      <Avatar user={u} />
                      <div className="rf-request-card__main">
                        <div className="rf-request-card__name">{u.fullName || u.email}</div>
                        {u.companyName && (
                          <div className="rf-request-card__meta">
                            <Building2 size={14} aria-hidden />
                            {u.companyName}
                          </div>
                        )}
                      </div>
                      <div className="rf-row-actions">
                        <Link to="/recruiter/messages" className="rf-btn rf-btn--outline">
                          Message
                        </Link>
                        <button
                          type="button"
                          className="rf-btn rf-btn--danger"
                          disabled={removeMut.isPending}
                          onClick={() => removeMut.mutate(u._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rf-section">
            <h2 className="rf-section__title">All posts</h2>
            {posts.length === 0 ? (
              <p className="rf-empty">No posts found yet.</p>
            ) : filteredPosts.length === 0 ? (
              <p className="rf-empty">No posts match your filters.</p>
            ) : (
              <ul className="rf-feed">
                {filteredPosts.map((post) => {
                  const author = post.author;
                  if (!author?._id) return null;
                  const uid = String(author._id);
                  const isSelf = myUserId && String(myUserId) === uid;
                  const isConnected = friendIds.has(uid);
                  const isOutgoing = outgoingIds.has(uid);
                  const incoming = incomingByUserId.get(uid);

                  return (
                    <li key={String(post._id)} className="rf-card">
                      <div className="rf-card__head">
                        <Avatar user={author} />
                        <div className="rf-card__meta">
                          <div className="rf-card__name-row">
                            <span className="rf-card__name">{author.fullName || author.email}</span>
                            {isSelf && <span className="rf-badge">You</span>}
                          </div>
                          {author.companyName && (
                            <div className="rf-card__company">
                              <Building2 size={14} aria-hidden />
                              {author.companyName}
                            </div>
                          )}
                          <time className="rf-card__time" dateTime={post.createdAt}>
                            {formatWhen(post.createdAt)}
                          </time>
                        </div>
                        {!isSelf && (
                          <div className="rf-card__actions">
                            {isConnected ? (
                              <div className="rf-row-actions">
                                <Link to="/recruiter/messages" className="rf-btn rf-btn--outline">
                                  Message
                                </Link>
                                <button
                                  type="button"
                                  className="rf-btn rf-btn--danger"
                                  disabled={removeMut.isPending}
                                  onClick={() => removeMut.mutate(uid)}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : incoming ? (
                              <button
                                type="button"
                                className="rf-btn rf-btn--primary"
                                disabled={acceptMut.isPending}
                                onClick={() => acceptMut.mutate(incoming.connectionId)}
                              >
                                Accept
                              </button>
                            ) : isOutgoing ? (
                              <button type="button" className="rf-btn rf-btn--ghost" disabled>
                                Pending
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="rf-btn rf-btn--primary"
                                disabled={sendMut.isPending}
                                onClick={() => sendMut.mutate(uid)}
                              >
                                Request
                              </button>
                            )}
                          </div>
                        )}
                        {isSelf && (
                          <div className="rf-card__actions">
                            <button
                              type="button"
                              className="rf-btn rf-btn--outline"
                              onClick={() => navigate(`/recruiter/jobs/edit/${post._id}`)}
                            >
                              <PencilLine size={15} aria-hidden />
                              Update
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="rf-card__body">
                        <div className="rf-job__title">{post.jobTitle || "Untitled role"}</div>
                        <div className="rf-job__meta">
                          <span>{post.company || author.companyName || "Company"}</span>
                          {post.location ? <span>{post.location}</span> : null}
                          {post.jobType ? <span>{post.jobType}</span> : null}
                          {post.status ? (
                            <span className={`rf-job__status rf-job__status--${String(post.status).toLowerCase()}`}>
                              {post.status}
                            </span>
                          ) : null}
                        </div>
                        <p className="rf-job__desc">{post.description || "No description available."}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
