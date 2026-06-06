interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      {!isUser && (
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
        }}>
          🌸
        </div>
      )}
      <div
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
            : "rgba(255,255,255,0.06)",
          border: isUser ? "none" : "1px solid rgba(139, 92, 246, 0.15)",
          color: "#f0eaff",
          fontSize: "15px",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </div>
    </div>
  );
}