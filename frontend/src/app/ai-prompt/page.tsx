"use client";

import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { useState } from "react";

export default function AIPromptBoxDemo() {
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>(
    [{ type: "ai", content: "Hi! I'm here to help you with any women's health questions. Ask me anything!" }]
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string, files?: File[]) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: message }]);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: `I received your message: "${message}"${files && files.length > 0 ? ` with ${files.length} file(s)` : ""}. How else can I help?`,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#333333] bg-[#1F2023]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-white text-xl font-semibold">Aria - Women's Health AI</h1>
          <p className="text-gray-400 text-sm mt-1">Ask your health questions privately</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-6 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 ${
                msg.type === "user"
                  ? "bg-white text-[#1F2023] rounded-br-none"
                  : "bg-[#2E3033] text-gray-100 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="bg-[#2E3033] text-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#333333] bg-[#1F2023]/50 backdrop-blur-md sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
