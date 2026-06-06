"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowUpIcon, Paperclip } from "lucide-react";

interface InputBarProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function InputBar({ onSend, isLoading }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "60px";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = "60px";
  }, []);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "60px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: "16px",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.2s",
      }}
      onFocus={() => {}}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => { setValue(e.target.value); adjustHeight(); }}
        onKeyDown={handleKeyDown}
        placeholder="Ask about periods, PCOS, hormones, or anything else..."
        disabled={isLoading}
        style={{
          width: "100%",
          minHeight: "60px",
          maxHeight: "200px",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          padding: "18px 20px 0",
          color: "#f0eaff",
          fontSize: "15px",
          lineHeight: 1.5,
          fontFamily: "inherit",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px 12px",
        }}
      >
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "8px",
            color: "#7c6fa0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Paperclip size={16} />
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "none",
            cursor: value.trim() && !isLoading ? "pointer" : "not-allowed",
            background: value.trim() && !isLoading
              ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
              : "rgba(255,255,255,0.08)",
            color: value.trim() && !isLoading ? "white" : "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          {isLoading ? (
            <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <ArrowUpIcon size={16} />
          )}
        </button>
      </div>
    </div>
  );
}