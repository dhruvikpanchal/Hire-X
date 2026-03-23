import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, UserMinus, Loader2, MapPin, Search, X } from "lucide-react";
import { getAllJobSeekers, getMyJobSeekerProfile } from "../../../services/jobSeekerService";
import {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from "../../../services/friendService";
import { toPublicUrl } from "../../../utils/mediaUrl.js";
import "./Candidates.css";

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (a + b).toUpperCase() || "U";
};

/** Filter by keyword (name, email, headline, location) + optional location substring */
function passesFilters({ user, jobTitle }, keyword, locationQ) {
  const u = user;
  if (!u) return false;
  const locField = String(u.location || "").toLowerCase();
  const lq = locationQ.trim().toLowerCase();
  if (lq && !locField.includes(lq)) return false;
  const k = keyword.trim().toLowerCase();
  if (!k) return true;
  const blob = [u.fullName, u.email, jobTitle, u.location]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return blob.includes(k);
}

function Avatar({ user }) {
  const label = user?.fullName || user?.email || "?";
  const url = toPublicUrl(user?.avatar);
  return (
    <div className="cand-avatar" aria-hidden>
      {url ? <img src={url} alt="" className="cand-avatar__img" /> : initials(label)}
    </div>
  );
}

export default function Candidates() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({ type: "", message: "" });
  const [keyword, setKeyword] = useState("");
  const [locationQ, setLocationQ] = useState("");

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast({ type: "", message: "" }), 2800);
  };

  const { data: profileData } = useQuery({
    queryKey: ["jobSeekerProfile"],
    queryFn: getMyJobSeekerProfile,
  });

  const myUserId = profileData?.profile?.user?._id || profileData?.profile?.user;

  const { data: seekersRes, isLoading: loadingSeekers } = useQuery({
    queryKey: ["allJobSeekers"],
    queryFn: getAllJobSeekers,
  });

  const { data: friendsRes, isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const jobSeekers = useMemo(() => seekersRes?.jobSeekers || [], [seekersRes]);
  const friends = useMemo(() => friendsRes?.friends || [], [friendsRes]);
  const pendingIncoming = useMemo(() => friendsRes?.pendingIncoming || [], [friendsRes]);
  const pendingOutgoing = useMemo(() => friendsRes?.pendingOutgoing || [], [friendsRes]);

  const friendIds = useMemo(() => {
    const s = new Set();
    friends.forEach((f) => {
      if (f.user?._id) s.add(String(f.user._id));
    });
    return s;
  }, [friends]);

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

  const others = useMemo(() => {
    return jobSeekers.filter((js) => {
      const uid = js?.user?._id || js?.user;
      if (!uid || !myUserId) return true;
      return String(uid) !== String(myUserId);
    });
  }, [jobSeekers, myUserId]);

  const filteredIncoming = useMemo(() => {
    return pendingIncoming.filter((row) =>
      passesFilters({ user: row.user, jobTitle: row.user?.jobTitle }, keyword, locationQ),
    );
  }, [pendingIncoming, keyword, locationQ]);

  const filteredFriends = useMemo(() => {
    return friends.filter((row) =>
      passesFilters({ user: row.user, jobTitle: row.user?.jobTitle }, keyword, locationQ),
    );
  }, [friends, keyword, locationQ]);

  const filteredDiscover = useMemo(() => {
    return others.filter((js) =>
      passesFilters({ user: js.user, jobTitle: js.jobTitle }, keyword, locationQ),
    );
  }, [others, keyword, locationQ]);

  const hasActiveFilters = Boolean(keyword.trim() || locationQ.trim());

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({ queryKey: ["chatRequests"] });
  };

  const sendMut = useMutation({
    mutationFn: (friendId) => sendFriendRequest(friendId),
    onSuccess: (data) => {
      invalidate();
      showToast("success", data?.message || "Request sent");
    },
    onError: (err) => {
      showToast("error", err?.response?.data?.message || "Could not send request");
    },
  });

  const acceptMut = useMutation({
    mutationFn: (requestId) => acceptFriendRequest(requestId),
    onSuccess: (data) => {
      invalidate();
      showToast("success", data?.message || "Friend request accepted");
    },
    onError: (err) => {
      showToast("error", err?.response?.data?.message || "Could not accept");
    },
  });

  const removeMut = useMutation({
    mutationFn: (userId) => removeFriend(userId),
    onSuccess: () => {
      invalidate();
      showToast("success", "Friend removed");
    },
    onError: (err) => {
      showToast("error", err?.response?.data?.message || "Could not remove friend");
    },
  });

  const loading = loadingSeekers || loadingFriends;

  return (
    <div className="cand-page">
      <header className="cand-hero">
        <div className="cand-hero__icon" aria-hidden>
          <Users size={26} strokeWidth={2} />
        </div>
        <div>
          <h1 className="cand-hero__title">Candidates</h1>
          <p className="cand-hero__sub">Discover other job seekers and connect as friends. When you accept a friend request, you can message each other right away.</p>
        </div>
      </header>

      {toast.message && (
        <div className={`cand-toast ${toast.type === "error" ? "cand-toast--err" : "cand-toast--ok"}`} role="status">
          {toast.message}
        </div>
      )}

      {loading && (
        <div className="cand-loading">
          <Loader2 className="cand-loading__spin" size={32} aria-hidden />
          <span>Loading…</span>
        </div>
      )}

      {!loading && (
        <>
          <div className="cand-search">
            <div className="cand-search__inner">
              <div className="cand-search__field cand-search__field--grow">
                <span className="cand-search__icon" aria-hidden>
                  <Search size={18} strokeWidth={2.2} />
                </span>
                <input
                  type="search"
                  className="cand-search__input"
                  placeholder="Search by name, email, or headline…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoComplete="off"
                  aria-label="Search candidates"
                />
                {keyword ? (
                  <button
                    type="button"
                    className="cand-search__clear"
                    onClick={() => setKeyword("")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>
              <div className="cand-search__field">
                <span className="cand-search__icon" aria-hidden>
                  <MapPin size={18} strokeWidth={2.2} />
                </span>
                <input
                  type="text"
                  className="cand-search__input"
                  placeholder="Location"
                  value={locationQ}
                  onChange={(e) => setLocationQ(e.target.value)}
                  autoComplete="off"
                  aria-label="Filter by location"
                />
                {locationQ ? (
                  <button
                    type="button"
                    className="cand-search__clear"
                    onClick={() => setLocationQ("")}
                    aria-label="Clear location"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>
            </div>
            {hasActiveFilters && (
              <p className="cand-search__hint">
                Filtering lists below
                <button type="button" className="cand-search__reset" onClick={() => { setKeyword(""); setLocationQ(""); }}>
                  Clear all
                </button>
              </p>
            )}
          </div>

          {pendingIncoming.length > 0 && (
            <section className="cand-section">
              <h2 className="cand-section__title">Friend requests</h2>
              <p className="cand-section__hint">Accept to become friends and unlock chat.</p>
              {filteredIncoming.length === 0 ? (
                <p className="cand-empty">No requests match your search.</p>
              ) : (
              <div className="cand-grid cand-grid--tight">
                {filteredIncoming.map((row) => {
                  const u = row.user;
                  if (!u) return null;
                  return (
                    <article key={row.friendshipId} className="cand-card cand-card--request">
                      <Avatar user={u} />
                      <div className="cand-card__main">
                        <div className="cand-card__name">{u.fullName || u.email}</div>
                        {u.location && (
                          <div className="cand-card__meta">
                            <MapPin size={13} aria-hidden />
                            {u.location}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="cand-btn cand-btn--primary"
                        disabled={acceptMut.isPending}
                        onClick={() => acceptMut.mutate(row.friendshipId)}
                      >
                        Accept
                      </button>
                    </article>
                  );
                })}
              </div>
              )}
            </section>
          )}

          <section className="cand-section">
            <h2 className="cand-section__title">My friends</h2>
            {friends.length === 0 ? (
              <p className="cand-empty">No friends yet. Send requests below or accept incoming requests.</p>
            ) : filteredFriends.length === 0 ? (
              <p className="cand-empty">No friends match your search.</p>
            ) : (
              <div className="cand-grid">
                {filteredFriends.map((row) => {
                  const u = row.user;
                  if (!u) return null;
                  return (
                    <article key={row.friendshipId} className="cand-card">
                      <Avatar user={u} />
                      <div className="cand-card__main">
                        <div className="cand-card__name">{u.fullName || u.email}</div>
                        {u.jobTitle && <div className="cand-card__job">{u.jobTitle}</div>}
                        {u.location && (
                          <div className="cand-card__meta">
                            <MapPin size={13} aria-hidden />
                            {u.location}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="cand-btn cand-btn--danger"
                        disabled={removeMut.isPending}
                        onClick={() => removeMut.mutate(u._id)}
                        title="Remove friend"
                      >
                        <UserMinus size={16} />
                        Remove
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="cand-section">
            <div className="cand-section__head">
              <h2 className="cand-section__title">Discover candidates</h2>
              {others.length > 0 && (
                <span className="cand-section__count">
                  Showing <strong>{filteredDiscover.length}</strong> of {others.length}
                </span>
              )}
            </div>
            {others.length === 0 ? (
              <p className="cand-empty">No other job seekers to show yet.</p>
            ) : filteredDiscover.length === 0 ? (
              <p className="cand-empty">No candidates match your filters. Try different keywords or clear the search.</p>
            ) : (
              <div className="cand-grid">
                {filteredDiscover.map((js) => {
                  const u = js.user;
                  if (!u?._id) return null;
                  const uid = String(u._id);
                  const isFriend = friendIds.has(uid);
                  const isOutgoing = outgoingIds.has(uid);
                  const incoming = incomingByUserId.get(uid);

                  return (
                    <article key={js._id || uid} className="cand-card">
                      <Avatar user={u} />
                      <div className="cand-card__main">
                        <div className="cand-card__name">{u.fullName || u.email}</div>
                        {js.jobTitle && <div className="cand-card__job">{js.jobTitle}</div>}
                        {u.location && (
                          <div className="cand-card__meta">
                            <MapPin size={13} aria-hidden />
                            {u.location}
                          </div>
                        )}
                      </div>
                      {isFriend ? (
                        <span className="cand-badge">Friends</span>
                      ) : incoming ? (
                        <button
                          type="button"
                          className="cand-btn cand-btn--primary"
                          disabled={acceptMut.isPending}
                          onClick={() => acceptMut.mutate(incoming.friendshipId)}
                        >
                          Accept
                        </button>
                      ) : isOutgoing ? (
                        <button type="button" className="cand-btn cand-btn--ghost" disabled>
                          Request sent
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="cand-btn cand-btn--primary"
                          disabled={sendMut.isPending}
                          onClick={() => sendMut.mutate(uid)}
                        >
                          Add friend
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
