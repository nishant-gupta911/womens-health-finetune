"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0,
            }}>🌸</div>
            <div style={{
              padding: "14px 18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              borderRadius: "18px 18px 18px 4px",
              display: "flex", gap: "5px", alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#8b5cf6",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  display: "inline-block",
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}