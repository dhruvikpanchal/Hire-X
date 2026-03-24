import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  clearConversationForMe,
  deleteMessage,
  editMessage,
  getBlockedUsers,
  getConversations,
  getMessagesByConversation,
  sendMessage,
  unblockUser,
} from "../../../services/messageService";
import { toPublicUrl } from "../../../utils/mediaUrl.js";
import ChatRequestModal from "./ChatRequestModal";
import "./ChatPage.css";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const BlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
  </svg>
);

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (first + second).toUpperCase() || "U";
};

function UserAvatar({ user, className = "", size = "md" }) {
  const label = user?.fullName || user?.email || "User";
  const url = toPublicUrl(user?.avatar);
  const sizeMod = size === "sm" ? " chat__avatar--sm" : size === "xs" ? " chat__avatar--xs" : "";
  return (
    <div className={`chat__avatar${sizeMod} ${className}`.trim()} aria-hidden>
      {url ? <img src={url} alt="" className="chat__avatarImg" /> : initials(label)}
    </div>
  );
}

const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const formatDayLabel = (iso) => {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return "Today";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

export default function ChatPage({ role }) {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("chats"); // chats | blocked
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [toast, setToast] = useState({ type: "", message: "" });
  const [openRequestModal, setOpenRequestModal] = useState(false);

  const scrollRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchInterval: 8000,
  });

  const { data: blockedData, isLoading: blockedLoading } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  const blockedList = blockedData?.blocked || [];

  const conversations = useMemo(() => data?.conversations || [], [data]);
  const targetUserId = searchParams.get("userId");

  useEffect(() => {
    if (!targetUserId || conversations.length === 0) return;
    const targetConversation = conversations.find(
      (conversation) => String(conversation?.otherUser?._id) === String(targetUserId),
    );
    if (targetConversation?._id) {
      setActiveId(String(targetConversation._id));
    }
  }, [targetUserId, conversations]);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const name = c.otherUser?.fullName || c.otherUser?.email || "";
      const last = c.lastMessage?.content || "";
      return name.toLowerCase().includes(q) || last.toLowerCase().includes(q);
    });
  }, [conversations, search]);

  const activeConversationId = activeId || conversations[0]?._id || null;

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeConversationId) || null,
    [conversations, activeConversationId],
  );

  const otherUser = activeConversation?.otherUser || null;

  const {
    data: messagesData,
    isLoading: messagesLoading,
  } = useQuery({
    queryKey: ["messages", activeConversationId],
    queryFn: () => getMessagesByConversation(activeConversationId),
    enabled: Boolean(activeConversationId),
  });

  const messages = messagesData?.messages || [];
  const block = messagesData?.block || { canSend: true, viewerBlockedOther: false, otherBlockedViewer: false };
  const chatRequest = messagesData?.chatRequest || { status: "none", canChat: false, requestId: null };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [activeConversationId, messages.length, messagesLoading]);

  const showToast = (type, message, ms = 3000) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", message: "" }), ms);
  };

  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (resData) => {
      setText("");
      const convId = resData?.conversationId;
      const newMsg = resData?.message;

      if (convId) {
        setActiveId(convId);

        if (newMsg) {
          queryClient.setQueryData(["messages", convId], (old) => {
            if (!old) return old;
            const list = old.messages || [];
            if (list.some((m) => String(m._id) === String(newMsg._id))) return old;
            return { ...old, messages: [...list, newMsg] };
          });

          queryClient.setQueryData(["conversations"], (old) => {
            if (!old?.conversations) return old;
            let found = false;
            const next = old.conversations.map((c) => {
              if (String(c._id) !== String(convId)) return c;
              found = true;
              return {
                ...c,
                lastMessage: {
                  content: newMsg.content,
                  senderId: newMsg.senderId,
                  createdAt: newMsg.createdAt,
                },
                updatedAt: newMsg.createdAt,
              };
            });
            return found ? { ...old, conversations: next } : old;
          });
        }

        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["messages", convId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
      }
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to send message.";
      showToast("error", msg, 3500);
    },
  });

  const blockMutation = useMutation({
    mutationFn: (blockedUserId) => blockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      showToast("success", "User blocked.", 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to block user.";
      showToast("error", msg, 3500);
    },
  });

  const unblockMutation = useMutation({
    mutationFn: (blockedUserId) => unblockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      showToast("success", "User unblocked.", 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to unblock user.";
      showToast("error", msg, 3500);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (resData) => {
      const deletedMessageId = String(resData?.deletedMessageId || "");
      const conversationId = String(resData?.conversationId || activeConversationId || "");
      const mode = String(resData?.mode || "me");

      if (conversationId && deletedMessageId) {
        queryClient.setQueryData(["messages", conversationId], (old) => {
          if (!old) return old;
          if (mode === "everyone") {
            return {
              ...old,
              messages: (old.messages || []).map((m) =>
                String(m._id) === deletedMessageId
                  ? { ...m, content: "This message was deleted", deletedForEveryone: true }
                  : m,
              ),
            };
          }
          return {
            ...old,
            messages: (old.messages || []).filter((m) => String(m._id) !== deletedMessageId),
          };
        });
      }

      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      showToast("success", mode === "everyone" ? "Deleted for everyone." : "Deleted for you.", 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to delete message.";
      showToast("error", msg, 3200);
    },
  });

  const clearForMeMutation = useMutation({
    mutationFn: clearConversationForMe,
    onSuccess: (resData) => {
      const conversationId = String(resData?.conversationId || activeConversationId || "");
      if (conversationId) {
        queryClient.setQueryData(["messages", conversationId], (old) => {
          if (!old) return old;
          return { ...old, messages: [] };
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      showToast("success", "Chat cleared for your side.", 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to clear chat.";
      showToast("error", msg, 3200);
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: editMessage,
    onSuccess: (resData) => {
      const conversationId = String(resData?.conversationId || activeConversationId || "");
      const updated = resData?.updatedMessage;
      if (conversationId && updated?._id) {
        queryClient.setQueryData(["messages", conversationId], (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: (old.messages || []).map((m) =>
              String(m._id) === String(updated._id)
                ? { ...m, content: updated.content, updatedAt: updated.updatedAt }
                : m,
            ),
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setEditingMessageId(null);
      setEditingText("");
      showToast("success", "Message updated.", 2000);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to edit message.";
      showToast("error", msg, 3200);
    },
  });

  const onSend = () => {
    if (!otherUser?._id) return;
    if (!block.canSend || !chatRequest.canChat) return;
    const content = text.trim();
    if (!content) return;
    sendMutation.mutate({
      receiverId: otherUser._id,
      content,
      conversationId: activeConversationId,
    });
  };

  const onCopyMessage = async (content) => {
    const textToCopy = String(content || "");
    if (!textToCopy.trim()) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const helper = document.createElement("textarea");
        helper.value = textToCopy;
        helper.setAttribute("readonly", "");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        document.body.removeChild(helper);
      }
      showToast("success", "Message copied.", 1800);
    } catch {
      showToast("error", "Could not copy message.", 2200);
    }
  };

  return (
    <div
      className={`chat chat--${role}`}
    >
      <div className="chat__shell">
        <div className="chat__sidebar">
          <div className="chat__sidebarHead">
            <div className="chat__brand">
              <h2 className="chat__brandTitle">Messages</h2>
              <p className="chat__brandSub">{role === "recruiter" ? "Candidate inbox" : "Recruiter chats"}</p>
            </div>

            <div className="chat__sidebarTabs" role="tablist" aria-label="Inbox sections">
              <button
                type="button"
                role="tab"
                aria-selected={sidebarTab === "chats"}
                className={`chat__tab ${sidebarTab === "chats" ? "chat__tab--active" : ""}`}
                onClick={() => setSidebarTab("chats")}
              >
                Chats
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={sidebarTab === "blocked"}
                className={`chat__tab ${sidebarTab === "blocked" ? "chat__tab--active" : ""}`}
                onClick={() => setSidebarTab("blocked")}
              >
                Blocked
                {blockedList.length > 0 ? <span className="chat__tabBadge">{blockedList.length}</span> : null}
              </button>
            </div>

            {sidebarTab === "chats" && (
              <div className="chat__search">
                <span className="chat__searchIcon"><SearchIcon /></span>
                <input
                  className="chat__searchInput"
                  placeholder="Search conversations…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="chat__convoList">
            {sidebarTab === "chats" && (
              <>
                {isLoading && (
                  <div className="chat__convoSkelWrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="chat__convoSkel" />
                    ))}
                  </div>
                )}
                {isError && (
                  <div className="chat__empty">
                    <p className="chat__emptyTitle">Could not load conversations</p>
                    <p className="chat__emptyDesc">{error?.response?.data?.message || "Please try again."}</p>
                  </div>
                )}
                {!isLoading && !isError && filteredConversations.length === 0 && (
                  <div className="chat__empty">
                    <p className="chat__emptyTitle">No conversations</p>
                    <p className="chat__emptyDesc">Once you start chatting, it will appear here.</p>
                  </div>
                )}

                  {!isLoading && !isError && filteredConversations.map((c) => {
                    const name = c.otherUser?.fullName || c.otherUser?.email || "User";
                    const preview = c.lastMessage?.content || "No messages yet";
                    const t = c.lastMessage?.createdAt || c.updatedAt;
                    return (
                      <button
                        key={c._id}
                        className={`chat__convo ${c._id === activeConversationId ? "chat__convo--active" : ""}`}
                        onClick={() => setActiveId(c._id)}
                      >
                        <UserAvatar user={c.otherUser} />
                        <div className="chat__convoMain">
                          <div className="chat__convoTop">
                            <span className="chat__convoName">{name}</span>
                            <span className="chat__convoTime">{formatDayLabel(t)}</span>
                          </div>
                          <div className="chat__convoPreview">{preview}</div>
                        </div>
                      </button>
                    );
                  })}
              </>
            )}

            {sidebarTab === "blocked" && (
              <div className="chat__blockedPanel">
                {blockedLoading && (
                  <div className="chat__convoSkelWrap">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="chat__convoSkel" />
                    ))}
                  </div>
                )}
                {!blockedLoading && blockedList.length === 0 && (
                  <div className="chat__empty chat__empty--tight">
                    <p className="chat__emptyTitle">No blocked users</p>
                    <p className="chat__emptyDesc">People you block appear here. You can unblock anytime.</p>
                  </div>
                )}
                {!blockedLoading && blockedList.length > 0 && (
                  <ul className="chat__blockedList">
                    {blockedList.map((u) => (
                      <li key={String(u._id)} className="chat__blockedRow">
                        <UserAvatar user={u} />
                        <div className="chat__blockedInfo">
                          <div className="chat__blockedName">{u.fullName || u.email}</div>
                          <div className="chat__blockedMeta">{u.role === "recruiter" ? "Recruiter" : "Job seeker"}</div>
                        </div>
                        <button
                          type="button"
                          className="chat__blockedUnblock"
                          disabled={unblockMutation.isPending}
                          onClick={() => unblockMutation.mutate(u._id)}
                        >
                          Unblock
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="chat__main">
          <div className="chat__header">
            <div className="chat__headerLeft">
              {otherUser ? (
                <>
                  <UserAvatar user={otherUser} className="chat__avatar--header" />
                  <div>
                    <div className="chat__headerName">
                      {otherUser.fullName || otherUser.email}
                    </div>
                    <div className="chat__headerMeta">
                      {role === "recruiter" ? "Candidate" : "Recruiter"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="chat__headerPlaceholder">
                  Select a conversation
                </div>
              )}
            </div>

            <div className="chat__headerRight">
              {otherUser && (
                <button
                  className="chat__clearBtn"
                  type="button"
                  onClick={() => {
                    if (!activeConversationId) return;
                    const ok = window.confirm("Clear this chat only for your side?");
                    if (ok) clearForMeMutation.mutate(activeConversationId);
                  }}
                  disabled={clearForMeMutation.isPending}
                >
                  Clear My Chat
                </button>
              )}
              <button
                className="chat__reqBtn"
                type="button"
                onClick={() => setOpenRequestModal(true)}
              >
                Request Chat
              </button>

              {otherUser && (
                <button
                  className={`chat__blockBtn ${block.viewerBlockedOther ? "chat__blockBtn--on" : ""}`}
                  type="button"
                  onClick={() => {
                    if (!otherUser?._id) return;
                    if (block.viewerBlockedOther) unblockMutation.mutate(otherUser._id);
                    else blockMutation.mutate(otherUser._id);
                  }}
                  disabled={blockMutation.isPending || unblockMutation.isPending}
                >
                  <BlockIcon />
                  {block.viewerBlockedOther ? "Unblock" : "Block"}
                </button>
              )}
            </div>
          </div>

          <div className="chat__body" ref={scrollRef}>
            {messagesLoading && (
              <div className="chat__msgSkelWrap">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`chat__msgSkel ${i % 2 === 0 ? "chat__msgSkel--me" : ""}`} />
                ))}
              </div>
            )}
            {!messagesLoading && otherUser && messages.length === 0 && (
              <div className="chat__empty chat__empty--center">
                <p className="chat__emptyTitle">No messages yet</p>
                <p className="chat__emptyDesc">Say hello to start the conversation.</p>
              </div>
            )}

            {!messagesLoading && messages.length > 0 && (
              <div
                className="chat__msgs"
              >
                {messages.map((m) => {
                  const mine = String(m.senderId) !== String(otherUser?._id);
                  const themUser = m.sender && !mine ? m.sender : otherUser;
                  const isEditing = editingMessageId === String(m._id);
                  return (
                    <div
                      key={m._id}
                      className={`chat__msgRow ${mine ? "chat__msgRow--me" : ""}`}
                    >
                      {!mine && (
                        <UserAvatar user={themUser} size="xs" className="chat__msgAvatar" />
                      )}
                      <div className={`chat__bubble ${mine ? "chat__bubble--me" : "chat__bubble--them"}`}>
                        <div className="chat__messageActions">
                          <button
                            type="button"
                            className="chat__messageAction"
                            onClick={() => onCopyMessage(m.content)}
                            disabled={Boolean(m.deletedForEveryone)}
                          >
                            Copy
                          </button>
                          {mine && !m.deletedForEveryone && (
                            <button
                              type="button"
                              className="chat__messageAction"
                              onClick={() => {
                                setEditingMessageId(String(m._id));
                                setEditingText(String(m.content || ""));
                              }}
                            >
                              Edit
                            </button>
                          )}
                          {!m.deletedForEveryone && (
                            <button
                              type="button"
                              className="chat__messageAction chat__messageAction--danger"
                              onClick={() => deleteMessageMutation.mutate({ messageId: m._id, mode: "me" })}
                              disabled={deleteMessageMutation.isPending}
                            >
                              Delete for me
                            </button>
                          )}
                          {mine && !m.deletedForEveryone && (
                            <button
                              type="button"
                              className="chat__messageAction chat__messageAction--danger"
                              onClick={() => deleteMessageMutation.mutate({ messageId: m._id, mode: "everyone" })}
                              disabled={deleteMessageMutation.isPending}
                            >
                              Delete for everyone
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="chat__editWrap">
                            <textarea
                              className="chat__editInput"
                              rows={2}
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            />
                            <div className="chat__editActions">
                              <button
                                type="button"
                                className="chat__messageAction"
                                onClick={() => {
                                  setEditingMessageId(null);
                                  setEditingText("");
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="chat__messageAction"
                                onClick={() => {
                                  const next = editingText.trim();
                                  if (!next) return;
                                  editMessageMutation.mutate({ messageId: m._id, content: next });
                                }}
                                disabled={editMessageMutation.isPending}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`chat__bubbleText ${m.deletedForEveryone ? "chat__bubbleText--deleted" : ""}`}>
                            {m.content}
                          </div>
                        )}
                        <div className="chat__bubbleTime">{formatTime(m.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="chat__composer">
            {!otherUser ? (
              <div className="chat__composerHint">Select a conversation to start chatting.</div>
            ) : !block.canSend ? (
              <div className="chat__blocked">
                {block.viewerBlockedOther
                  ? "You blocked this user. Unblock to send messages."
                  : "You cannot send messages to this user."}
              </div>
            ) : !chatRequest.canChat ? (
              <div className="chat__composerHint">
                Chat is locked until a request is accepted.{" "}
                <button className="chat__inlineLink" type="button" onClick={() => setOpenRequestModal(true)}>
                  Open requests
                </button>
              </div>
            ) : (
              <>
                <textarea
                  className="chat__input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message…"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                />
                <button className="chat__sendBtn" type="button" onClick={onSend} disabled={sendMutation.isPending}>
                  <SendIcon />
                  {sendMutation.isPending ? "Sending…" : "Send"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ChatRequestModal
        open={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
        role={role}
        activeOtherUserId={otherUser?._id}
        onRequestStateChange={() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["messages", activeConversationId] });
        }}
      />

        {toast.message && (
          <div
            className={`chat__toast ${toast.type === "error" ? "chat__toast--error" : "chat__toast--success"}`}
          >
            {toast.message}
          </div>
        )}
    </div>
  );
}
