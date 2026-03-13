import React, { useState, useRef, useEffect } from "react";
import "./Messages.css";

/* ── Static seed data ── */
const CONVERSATIONS = [
  {
    id: 1,
    recruiterName: "Sarah Mitchell",
    company: "Nexora Technologies",
    avatar: "SM",
    avatarColor: "#2563eb",
    online: true,
    unread: 2,
    lastMessage: "We'd love to schedule a technical interview with you.",
    lastTime: "10:42 AM",
    messages: [
      { id: 1, from: "recruiter", text: "Hi! I came across your profile and I think you'd be a great fit for our Senior Frontend Engineer role at Nexora.", time: "9:15 AM", date: "Today" },
      { id: 2, from: "me", text: "Thank you Sarah! I'm definitely interested. Could you tell me more about the role and the team structure?", time: "9:28 AM", date: "Today" },
      { id: 3, from: "recruiter", text: "Of course! You'd be joining a team of 8 engineers working on our core product. The stack is React, TypeScript, and GraphQL. The role involves building new features and improving performance.", time: "9:45 AM", date: "Today" },
      { id: 4, from: "recruiter", text: "The position offers competitive salary, remote-first culture, equity options, and a generous L&D budget.", time: "9:46 AM", date: "Today" },
      { id: 5, from: "me", text: "That sounds really exciting. I have strong experience with that stack. What does the interview process look like?", time: "10:10 AM", date: "Today" },
      { id: 6, from: "recruiter", text: "We'd love to schedule a technical interview with you.", time: "10:42 AM", date: "Today" },
    ],
  },
  {
    id: 2,
    recruiterName: "James Ortega",
    company: "CloudBridge Inc.",
    avatar: "JO",
    avatarColor: "#0891b2",
    online: false,
    unread: 0,
    lastMessage: "Please send over your updated portfolio when you get a chance.",
    lastTime: "Yesterday",
    messages: [
      { id: 1, from: "recruiter", text: "Hey! We reviewed your application for the Full Stack Engineer position and we're impressed with your background.", time: "2:00 PM", date: "Yesterday" },
      { id: 2, from: "me", text: "That's great to hear! CloudBridge has been on my radar for a while.", time: "2:14 PM", date: "Yesterday" },
      { id: 3, from: "recruiter", text: "Please send over your updated portfolio when you get a chance.", time: "2:30 PM", date: "Yesterday" },
    ],
  },
  {
    id: 3,
    recruiterName: "Priya Nair",
    company: "Luminary Labs",
    avatar: "PN",
    avatarColor: "#7c3aed",
    online: true,
    unread: 1,
    lastMessage: "Congrats! You've been shortlisted for the next round 🎉",
    lastTime: "Mon",
    messages: [
      { id: 1, from: "recruiter", text: "Hello! I'm Priya from Luminary Labs. We're hiring a Product Designer and your profile caught our attention.", time: "11:00 AM", date: "Monday" },
      { id: 2, from: "me", text: "Hi Priya! Thanks for reaching out. I'd love to learn more about this opportunity.", time: "11:22 AM", date: "Monday" },
      { id: 3, from: "recruiter", text: "Congrats! You've been shortlisted for the next round 🎉", time: "3:45 PM", date: "Monday" },
    ],
  },
  {
    id: 4,
    recruiterName: "Derek Walsh",
    company: "Arctix Systems",
    avatar: "DW",
    avatarColor: "#059669",
    online: false,
    unread: 0,
    lastMessage: "Thanks for your time today. We'll be in touch by Friday.",
    lastTime: "Mar 8",
    messages: [
      { id: 1, from: "recruiter", text: "Hi there! Following up after our call yesterday — just wanted to check if you had any more questions.", time: "10:00 AM", date: "Mar 8" },
      { id: 2, from: "me", text: "No further questions from my side. I'm very excited about the opportunity!", time: "10:18 AM", date: "Mar 8" },
      { id: 3, from: "recruiter", text: "Thanks for your time today. We'll be in touch by Friday.", time: "10:35 AM", date: "Mar 8" },
    ],
  },
];

/* ── Icon components ── */
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const ReplyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const TrashAllIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11l.5 5M14 11l-.5 5" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* ── Helpers ── */
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Messages() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(1);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [actionMenu, setActionMenu] = useState(null); // { msgId, x, y }
  const [copiedId, setCopiedId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  /* Auto-scroll to bottom */
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [activeId, activeConv?.messages?.length]);

  /* Close action menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Mark unread as read when opening */
  useEffect(() => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
    );
  }, [activeId]);

  const filteredConvs = conversations.filter(
    (c) =>
      c.recruiterName.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      date: "Today",
      replyTo: replyTo ? replyTo.text : null,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: newMsg.time }
          : c
      )
    );
    setInputText("");
    setReplyTo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openActionMenu = (e, msgId) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setActionMenu({ msgId, x: rect.left, y: rect.bottom + 4 });
  };

  const handleCopy = (msgId) => {
    const msg = activeConv.messages.find((m) => m.id === msgId);
    navigator.clipboard?.writeText(msg.text).catch(() => { });
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1800);
    setActionMenu(null);
  };

  const handleDeleteForMe = (msgId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) }
          : c
      )
    );
    setActionMenu(null);
  };

  const handleDeleteForBoth = (msgId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId ? { ...m, deleted: true, text: "This message was deleted." } : m
            ),
          }
          : c
      )
    );
    setActionMenu(null);
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
    inputRef.current?.focus();
    setActionMenu(null);
  };

  const openChat = (id) => {
    setActiveId(id);
    setMobileView("chat");
  };

  return (
    <div className="messages-page">
      <div className="messages-layout">
        {/* ══ SIDEBAR ══ */}
        <aside className={`messages-sidebar ${mobileView === "chat" ? "messages-sidebar-hidden" : ""}`}>
          {/* Sidebar header */}
          <div className="messages-sidebar-header">
            <div className="messages-sidebar-title-row">
              <h1 className="messages-sidebar-title">Messages</h1>
              <span className="messages-total-badge">
                {conversations.reduce((a, c) => a + c.unread, 0) > 0
                  ? conversations.reduce((a, c) => a + c.unread, 0)
                  : conversations.length}
              </span>
            </div>
            <div className="messages-search-wrap">
              <span className="messages-search-icon"><SearchIcon /></span>
              <input
                className="messages-search-input"
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="messages-conv-list">
            {filteredConvs.length === 0 ? (
              <div className="messages-no-convs">No conversations found.</div>
            ) : (
              filteredConvs.map((conv, i) => (
                <div
                  key={conv.id}
                  className={`messages-conversation-item ${conv.id === activeId ? "messages-conv-active" : ""}`}
                  onClick={() => openChat(conv.id)}
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <div className="messages-conv-avatar-wrap">
                    <div
                      className="messages-conv-avatar"
                      style={{ background: conv.avatarColor }}
                    >
                      {conv.avatar}
                    </div>
                    {conv.online && <span className="messages-online-dot" />}
                  </div>
                  <div className="messages-conv-body">
                    <div className="messages-conv-top">
                      <span className="messages-conv-name">{conv.recruiterName}</span>
                      <span className="messages-conv-time">{conv.lastTime}</span>
                    </div>
                    <div className="messages-conv-bottom">
                      <span className="messages-conv-company">{conv.company}</span>
                      {conv.unread > 0 && (
                        <span className="messages-unread-badge">{conv.unread}</span>
                      )}
                    </div>
                    <p className="messages-conv-preview">{conv.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ══ CHAT AREA ══ */}
        <section className={`messages-chat-area ${mobileView === "list" ? "messages-chat-hidden" : ""}`}>
          {!activeConv ? (
            <div className="messages-empty-state">
              <div className="messages-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="messages-empty-title">No Messages Yet</h3>
              <p className="messages-empty-desc">Select a conversation to start chatting with recruiters.</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="messages-chat-header">
                <button className="messages-back-btn" onClick={() => setMobileView("list")}>
                  <ChevronLeftIcon />
                </button>
                <div
                  className="messages-chat-avatar"
                  style={{ background: activeConv.avatarColor }}
                >
                  {activeConv.avatar}
                </div>
                <div className="messages-chat-header-info">
                  <span className="messages-chat-name">{activeConv.recruiterName}</span>
                  <span className="messages-chat-company">
                    <span className={`messages-chat-status-dot ${activeConv.online ? "online" : "offline"}`} />
                    {activeConv.company} · {activeConv.online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-chat-body">
                {activeConv.messages.length === 0 ? (
                  <div className="messages-chat-empty">No messages in this conversation yet.</div>
                ) : (
                  (() => {
                    let lastDate = null;
                    return activeConv.messages.map((msg, idx) => {
                      const showDate = msg.date !== lastDate;
                      lastDate = msg.date;
                      return (
                        <React.Fragment key={msg.id}>
                          {showDate && (
                            <div className="messages-date-divider">
                              <span>{msg.date}</span>
                            </div>
                          )}
                          <div
                            className={`messages-bubble-row ${msg.from === "me" ? "messages-bubble-row-me" : "messages-bubble-row-them"}`}
                            style={{ animationDelay: `${idx * 40}ms` }}
                          >
                            {msg.from === "recruiter" && (
                              <div
                                className="messages-bubble-avatar"
                                style={{ background: activeConv.avatarColor }}
                              >
                                {activeConv.avatar}
                              </div>
                            )}
                            <div className="messages-bubble-group">
                              {msg.replyTo && (
                                <div className={`messages-reply-preview ${msg.from === "me" ? "reply-me" : "reply-them"}`}>
                                  <span className="messages-reply-label">Replying to</span>
                                  <span className="messages-reply-text">{msg.replyTo}</span>
                                </div>
                              )}
                              <div
                                className={`messages-bubble ${msg.from === "me" ? "messages-bubble-me" : "messages-bubble-them"} ${msg.deleted ? "messages-bubble-deleted" : ""}`}
                              >
                                <p className="messages-bubble-text">{msg.text}</p>
                                <span className="messages-bubble-time">{msg.time}</span>
                                {copiedId === msg.id && (
                                  <span className="messages-copied-toast">Copied!</span>
                                )}
                              </div>
                              {!msg.deleted && (
                                <div className={`messages-actions ${msg.from === "me" ? "messages-actions-me" : "messages-actions-them"}`}>
                                  <button className="messages-action-btn" title="Reply" onClick={() => handleReply(msg)}>
                                    <ReplyIcon />
                                  </button>
                                  <button className="messages-action-btn" title="Copy" onClick={() => handleCopy(msg.id)}>
                                    <CopyIcon />
                                  </button>
                                  <button className="messages-action-btn messages-action-del" title="Delete for me" onClick={() => handleDeleteForMe(msg.id)}>
                                    <TrashIcon />
                                  </button>
                                  <button className="messages-action-btn messages-action-del" title="Delete for both" onClick={() => handleDeleteForBoth(msg.id)}>
                                    <TrashAllIcon />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    });
                  })()
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Reply preview */}
              {replyTo && (
                <div className="messages-reply-bar">
                  <div className="messages-reply-bar-content">
                    <span className="messages-reply-bar-label">Replying to</span>
                    <span className="messages-reply-bar-text">{replyTo.text}</span>
                  </div>
                  <button
                    className="messages-reply-bar-close"
                    onClick={() => setReplyTo(null)}
                    title="Cancel reply"
                  >✕</button>
                </div>
              )}

              {/* Input area */}
              <div className="messages-input-box">
                <textarea
                  ref={inputRef}
                  className="messages-input-field"
                  placeholder="Type a message…"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className={`messages-send-btn ${inputText.trim() ? "messages-send-active" : ""}`}
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
