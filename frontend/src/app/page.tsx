"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import InputBar from "@/components/InputBar";
import ExamplePills from "@/components/ExamplePills";
import DisclaimerModal from "@/components/DisclaimerModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            
            const jsonStr = trimmed.slice(5).trim(); // remove "data:" prefix
            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const token = parsed?.message?.content ?? "";
              assistantContent += token;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            } catch {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: err instanceof Error ? err.message : "Connection failed. Is Ollama running?",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
      }}
    >
      {showDisclaimer && (
        <DisclaimerModal onClose={() => setShowDisclaimer(false)} />
      )}

      {isEmpty ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            gap: "32px",
          }}
        >
          <Header />
          <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <InputBar onSend={sendMessage} isLoading={isLoading} />
            <ExamplePills onSelect={sendMessage} />
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🌸</span>
              <span style={{ color: "#a78bfa", fontWeight: 600, fontSize: "15px" }}>Aria</span>
            </div>
          </div>
          <ChatWindow messages={messages} isLoading={isLoading} />
          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
              <InputBar onSend={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}