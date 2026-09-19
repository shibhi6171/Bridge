import React, { useRef, useState } from "react";
import { useChat } from "../context/ChatContext.jsx";

const TYPING_TIMEOUT_MS = 1500;

export default function MessageInput() {
  const { sendMessage, setTyping } = useChat();
  const [text, setText] = useState("");
  const typingRef = useRef(false);
  const timeoutRef = useRef(null);

  function handleChange(e) {
    setText(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      setTyping(true);
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      typingRef.current = false;
      setTyping(false);
    }, TYPING_TIMEOUT_MS);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
    clearTimeout(timeoutRef.current);
    typingRef.current = false;
    setTyping(false);
  }

  return (
    <form className="ig-composer" onSubmit={handleSubmit}>
      <input
        className="ig-composer-input"
        placeholder="Message..."
        value={text}
        onChange={handleChange}
        maxLength={2000}
      />
      <button type="submit" className="ig-send-btn" disabled={!text.trim()} aria-label="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </form>
  );
}
