"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export default function RuixenMoonChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "assistant"; content: string }>>([
    {
      type: "assistant",
      content: "Hi! I'm Aria, your women's health companion. Ask me anything about your health, and I'm here to help. 💜",
    },
  ]);

  const handleSendMessage = async (message: string, files?: File[]) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: message }]);
    
    // Add assistant placeholder
    setMessages((prev) => [...prev, { type: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.map((m) => ({
            role: m.type === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        let errorMessage = "API Error";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        
        // Handle error gracefully without throwing
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === "assistant") {
            newMessages[newMessages.length - 1].content = `Sorry, I encountered an error: ${errorMessage}. Please make sure the backend server (api_server.py) is running on port 8000.`;
          }
          return newMessages;
        });
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentFullResponse = "";

      // Read streaming response
      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep the last partial line in the buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
            
            if (trimmedLine.startsWith("data: ")) {
              try {
                const data = JSON.parse(trimmedLine.slice(6));
                if (data.message?.content) {
                  currentFullResponse += data.message.content;
                  
                  // Update the last message in real-time
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0) {
                      newMessages[newMessages.length - 1].content = currentFullResponse;
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error("Failed to parse SSE line:", trimmedLine, e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessages((prev) => {
        const newMessages = [...prev];
        // If we just added a placeholder, replace it with the error
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === "assistant" && newMessages[newMessages.length - 1].content === "") {
          newMessages[newMessages.length - 1].content = `Sorry, I encountered an error: ${errorMessage}. Please make sure the backend server (api_server.py) is running on port 8000.`;
        } else {
          newMessages.push({
            type: "assistant",
            content: `Sorry, I encountered an error: ${errorMessage}. Please make sure the backend server (api_server.py) is running on port 8000.`,
          });
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center bg-fixed"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(236, 72, 153, 0.6) 0%, rgba(190, 24, 93, 0.5) 25%, rgba(88, 28, 135, 0.4) 50%, rgba(15, 23, 42, 1) 100%)`,
      }}
    >
      {/* Content Wrapper */}
      <div className="w-full h-full flex flex-col">
        {/* Title Section */}
        <div className="flex-shrink-0 text-center pt-8 pb-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Aria
          </h1>
          <p className="mt-2 text-neutral-100 text-lg">
            Your trusted women's health companion
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 max-w-2xl mx-auto w-full">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md rounded-2xl px-4 py-3 ${
                  msg.type === "user"
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-white/10 backdrop-blur-md text-white rounded-bl-none border border-white/20"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl rounded-bl-none border border-white/20 px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Box Section - Centered */}
        <div className="flex-shrink-0 w-full max-w-2xl px-6 pb-8 mx-auto">
          <PromptInputBox
            onSend={handleSendMessage}
            isLoading={isLoading}
            placeholder="Ask about women's health..."
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
}

function QuickAction({ icon, label }: QuickActionProps) {
  return null;
}
