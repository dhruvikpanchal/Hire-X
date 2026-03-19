import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  getConversations,
  getMessagesByConversation,
  sendMessage,
  unblockUser,
} from "../../../services/messageService";
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
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [toast, setToast] = useState({ type: "", message: "" });
  const [openRequestModal, setOpenRequestModal] = useState(false);

  const scrollRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchInterval: 8000,
  });

  const conversations = data?.conversations || [];

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const name = c.otherUser?.fullName || c.otherUser?.email || "";
      const last = c.lastMessage?.content || "";
      return name.toLowerCase().includes(q) || last.toLowerCase().includes(q);
    });
  }, [conversations, search]);

  useEffect(() => {
    if (!activeId && conversations.length) {
      setActiveId(conversations[0]._id);
    }
  }, [activeId, conversations]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeId) || null,
    [conversations, activeId],
  );

  const otherUser = activeConversation?.otherUser || null;

  const {
    data: messagesData,
    isLoading: messagesLoading,
  } = useQuery({
    queryKey: ["messages", activeId],
    queryFn: () => getMessagesByConversation(activeId),
    enabled: Boolean(activeId),
  });

  const messages = messagesData?.messages || [];
  const block = messagesData?.block || { canSend: true, viewerBlockedOther: false, otherBlockedViewer: false };
  const chatRequest = messagesData?.chatRequest || { status: "none", canChat: false, requestId: null };

  useEffect(() => {
    // auto scroll on message load/update
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [activeId, messages.length]);

  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (res) => {
      setText("");
      const newConversationId = res?.conversationId;
      if (newConversationId && newConversationId !== activeId) setActiveId(newConversationId);
      queryClient.invalidateQueries(["conversations"]);
      queryClient.invalidateQueries(["messages", activeId]);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to send message.";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast({ type: "", message: "" }), 3000);
    },
  });

  const blockMutation = useMutation({
    mutationFn: (blockedUserId) => blockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", activeId]);
      setToast({ type: "success", message: "User blocked." });
      setTimeout(() => setToast({ type: "", message: "" }), 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to block user.";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast({ type: "", message: "" }), 3000);
    },
  });

  const unblockMutation = useMutation({
    mutationFn: (blockedUserId) => unblockUser(blockedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", activeId]);
      setToast({ type: "success", message: "User unblocked." });
      setTimeout(() => setToast({ type: "", message: "" }), 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to unblock user.";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast({ type: "", message: "" }), 3000);
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
      conversationId: activeId,
    });
  };

  return (
    <motion.div
      className={`chat chat--${role}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="chat__shell">
        <div className="chat__sidebar">
          <div className="chat__sidebarHead">
            <div className="chat__brand">
              <h2 className="chat__brandTitle">Messages</h2>
              <p className="chat__brandSub">{role === "recruiter" ? "Candidate inbox" : "Recruiter chats"}</p>
            </div>
            <div className="chat__search">
              <span className="chat__searchIcon"><SearchIcon /></span>
              <input
                className="chat__searchInput"
                placeholder="Search conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="chat__convoList">
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

            <AnimatePresence initial={false}>
              {!isLoading && !isError && filteredConversations.map((c) => {
                const name = c.otherUser?.fullName || c.otherUser?.email || "User";
                const preview = c.lastMessage?.content || "No messages yet";
                const t = c.lastMessage?.createdAt || c.updatedAt;
                return (
                  <motion.button
                    key={c._id}
                    className={`chat__convo ${c._id === activeId ? "chat__convo--active" : ""}`}
                    onClick={() => setActiveId(c._id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="chat__avatar">{initials(name)}</div>
                    <div className="chat__convoMain">
                      <div className="chat__convoTop">
                        <span className="chat__convoName">{name}</span>
                        <span className="chat__convoTime">{formatDayLabel(t)}</span>
                      </div>
                      <div className="chat__convoPreview">{preview}</div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="chat__main">
        <div className="chat__header">
  <div className="chat__headerLeft">
    {otherUser ? (
      <>
        <div className="chat__headerAvatar">
          {initials(otherUser.fullName || otherUser.email)}
        </div>
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

  {/* ✅ ALWAYS SHOW BUTTON */}
  <div className="chat__headerRight">
    <button
      className="chat__reqBtn"
      type="button"
      onClick={() => setOpenRequestModal(true)}
    >
      Request Chat
    </button>

    {otherUser && (
      <button
        className={`chat__blockBtn ${
          block.viewerBlockedOther ? "chat__blockBtn--on" : ""
        }`}
        onClick={() => {
          if (!otherUser?._id) return;
          if (block.viewerBlockedOther)
            unblockMutation.mutate(otherUser._id);
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
              <motion.div
                className="chat__msgs"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
                }}
              >
                {messages.map((m) => {
                  const mine = String(m.senderId) !== String(otherUser?._id);
                  return (
                    <motion.div
                      key={m._id}
                      className={`chat__msgRow ${mine ? "chat__msgRow--me" : ""}`}
                      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    >
                      <div className={`chat__bubble ${mine ? "chat__bubble--me" : "chat__bubble--them"}`}>
                        <div className="chat__bubbleText">{m.content}</div>
                        <div className="chat__bubbleTime">{formatTime(m.createdAt)}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
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
                <button className="chat__sendBtn" onClick={onSend} disabled={sendMutation.isPending}>
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
          queryClient.invalidateQueries(["conversations"]);
          queryClient.invalidateQueries(["messages", activeId]);
        }}
      />

      <AnimatePresence>
        {toast.message && (
          <motion.div
            className={`chat__toast ${toast.type === "error" ? "chat__toast--error" : "chat__toast--success"}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

