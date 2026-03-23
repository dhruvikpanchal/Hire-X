import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptChatRequest,
  getMyChatRequests,
  rejectChatRequest,
  searchUsers,
  sendChatRequest,
} from "../../../services/chatRequestService";
import { toPublicUrl } from "../../../utils/mediaUrl.js";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (a + b).toUpperCase() || "U";
};

function ReqUserAvatar({ user }) {
  const label = user?.fullName || user?.email || "User";
  const url = toPublicUrl(user?.avatar);
  return (
    <div className="chatreq__avatar" aria-hidden>
      {url ? <img src={url} alt="" className="chatreq__avatarImg" /> : initials(label)}
    </div>
  );
}

export default function ChatRequestModal({ open, onClose, role, activeOtherUserId, onRequestStateChange }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("send"); // send | received
  const [q, setQ] = useState("");

  const { data } = useQuery({
    queryKey: ["chatRequests"],
    queryFn: getMyChatRequests,
    enabled: open,
  });

  const sent = useMemo(() => data?.sent || [], [data]);
  const received = data?.received || [];

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["userSearch", q],
    queryFn: () => searchUsers(q),
    enabled: open && q.trim().length >= 2,
  });

  const results = searchData?.users || [];

  const sentByUserId = useMemo(() => {
    const map = new Map();
    sent.forEach((r) => map.set(String(r.user?._id), r));
    return map;
  }, [sent]);

  const sendMut = useMutation({
    mutationFn: (userId) => sendChatRequest(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chatRequests"] });
      if (onRequestStateChange) onRequestStateChange();
    },
  });

  const acceptMut = useMutation({
    mutationFn: (id) => acceptChatRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chatRequests"] });
      if (onRequestStateChange) onRequestStateChange();
    },
  });

  const rejectMut = useMutation({
    mutationFn: (id) => rejectChatRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chatRequests"] });
      if (onRequestStateChange) onRequestStateChange();
    },
  });

  const receivedPending = received.filter((r) => r.status === "pending");

  return open ? (
        <div
          className="chatreq"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            className={`chatreq__modal chatreq__modal--${role}`}
          >
            <div className="chatreq__head">
              <div>
                <div className="chatreq__title">Chat Requests</div>
                <div className="chatreq__sub">
                  {role === "recruiter" ? "Request chat with candidates" : "Request chat with recruiters"}
                </div>
              </div>
              <button className="chatreq__close" onClick={onClose} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            <div className="chatreq__tabs">
              <button className={`chatreq__tab ${tab === "send" ? "chatreq__tab--active" : ""}`} onClick={() => setTab("send")}>
                Send request
              </button>
              <button className={`chatreq__tab ${tab === "received" ? "chatreq__tab--active" : ""}`} onClick={() => setTab("received")}>
                Received ({receivedPending.length})
              </button>
            </div>

            {tab === "send" && (
              <div className="chatreq__body">
                <div className="chatreq__search">
                  <span className="chatreq__searchIcon"><SearchIcon /></span>
                  <input
                    className="chatreq__searchInput"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name or email…"
                    autoFocus
                  />
                </div>

                <div className="chatreq__list">
                  {q.trim().length < 2 ? (
                    <div className="chatreq__hint">Type at least 2 characters to search.</div>
                  ) : searchLoading ? (
                    <div className="chatreq__hint">Searching…</div>
                  ) : results.length === 0 ? (
                    <div className="chatreq__hint">No users found.</div>
                  ) : (
                    results.map((u) => {
                      const sentReq = sentByUserId.get(String(u._id));
                      const isSentPending = sentReq?.status === "pending";
                      const isAccepted = sentReq?.status === "accepted";
                      const isRejected = sentReq?.status === "rejected";
                      const isActiveOther = String(activeOtherUserId || "") === String(u._id);
                      const disabled = isSentPending || isAccepted || sendMut.isPending;
                      return (
                        <div key={u._id} className={`chatreq__row ${isActiveOther ? "chatreq__row--active" : ""}`}>
                          <ReqUserAvatar user={u} />
                          <div className="chatreq__info">
                            <div className="chatreq__name">{u.fullName || u.email}</div>
                            <div className="chatreq__meta">{u.email}</div>
                          </div>
                          <div className="chatreq__actions">
                            {isAccepted ? (
                              <span className="chatreq__pill chatreq__pill--ok">Chat enabled</span>
                            ) : isSentPending ? (
                              <span className="chatreq__pill">Request sent</span>
                            ) : isRejected ? (
                              <button
                                className="chatreq__btn chatreq__btn--ghost"
                                onClick={() => sendMut.mutate(u._id)}
                                disabled={sendMut.isPending}
                              >
                                Request again
                              </button>
                            ) : (
                              <button
                                className="chatreq__btn"
                                onClick={() => sendMut.mutate(u._id)}
                                disabled={disabled}
                              >
                                {sendMut.isPending ? "Sending…" : "Send request"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {tab === "received" && (
              <div className="chatreq__body">
                <div className="chatreq__list">
                  {received.length === 0 ? (
                    <div className="chatreq__hint">No requests received yet.</div>
                  ) : (
                    received.map((r) => {
                      const u = r.user;
                      const pending = r.status === "pending";
                      return (
                        <div key={r._id} className="chatreq__row">
                          <ReqUserAvatar user={u} />
                          <div className="chatreq__info">
                            <div className="chatreq__name">{u?.fullName || u?.email || "User"}</div>
                            <div className="chatreq__meta">{u?.email}</div>
                          </div>
                          <div className="chatreq__actions">
                            {pending ? (
                              <>
                                <button
                                  className="chatreq__btn chatreq__btn--ok"
                                  onClick={() => acceptMut.mutate(r._id)}
                                  disabled={acceptMut.isPending || rejectMut.isPending}
                                >
                                  Accept
                                </button>
                                <button
                                  className="chatreq__btn chatreq__btn--danger"
                                  onClick={() => rejectMut.mutate(r._id)}
                                  disabled={acceptMut.isPending || rejectMut.isPending}
                                >
                                  Reject
                                </button>
                              </>
                            ) : r.status === "accepted" ? (
                              <span className="chatreq__pill chatreq__pill--ok">Accepted</span>
                            ) : (
                              <span className="chatreq__pill chatreq__pill--bad">Rejected</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <div className="chatreq__foot">
              <button className="chatreq__btn chatreq__btn--ghost" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
  ) : null;
}

