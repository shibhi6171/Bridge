import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { gradientFor, colorFor } from "../utils/avatar.js";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageList() {
  const { messages, username } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="ig-messages">
      {messages.length === 0 && (
        <div className="ig-messages-empty">
          <div className="ig-messages-empty-icon">💬</div>
          <p>No messages yet. Say hi!</p>
        </div>
      )}
      {messages.map((m, i) => {
        if (m.system) {
          return (
            <div className="ig-system-msg" key={m.id}>
              {m.text}
            </div>
          );
        }
        const isSelf = m.username === username;
        const prev = messages[i - 1];
        const isRunStart = !prev || prev.system || prev.username !== m.username;

        return (
          <div key={m.id} className={`ig-msg-row ${isSelf ? "is-self" : ""}`}>
            {!isSelf && isRunStart && (
              <div className="ig-msg-author" style={{ color: colorFor(m.username) }}>
                {m.username}
              </div>
            )}
            <div className="ig-bubble-wrap">
              {!isSelf && (
                <span
                  className={`ig-msg-avatar ${isRunStart ? "" : "ig-msg-avatar-spacer"}`}
                  style={isRunStart ? { background: gradientFor(m.username) } : undefined}
                >
                  {isRunStart ? m.username.slice(0, 1).toUpperCase() : ""}
                </span>
              )}
              <div
                className={`ig-bubble ${isSelf ? "ig-bubble-self" : "ig-bubble-other"}`}
                style={isSelf ? undefined : { background: colorFor(m.username) }}
              >
                {m.text}
              </div>
              <span className="ig-msg-time">{formatTime(m.at)}</span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
