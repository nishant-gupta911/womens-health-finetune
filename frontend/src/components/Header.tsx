Looking at your project structure, the issue is likely the streaming response handling. Here's a focused fix prompt:

---

```
Fix the chat API response not displaying in the UI. Do NOT change any other files.

## STEP 1 — Check frontend/src/app/api/chat/route.ts

Open the file and read it. Do not modify it. Just identify:
- What format does it return? (streaming text, JSON, SSE?)
- What is the response Content-Type?

## STEP 2 — Fix page.tsx sendMessage function

Replace ONLY the sendMessage function in page.tsx with this logic that handles all response types:

```tsx
const sendMessage = async (content: string) => {
  if (!content.trim() || isLoading) return;

  const userMessage: Message = { role: "user", content };
  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setIsLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    // Handle streaming response
    if (contentType.includes("text/plain") || contentType.includes("text/event-stream") || response.body) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add empty assistant message first
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
          // Handle SSE format (data: ...\n\n)
          if (chunk.includes("data:")) {
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const parsed = JSON.parse(line.slice(6));
                  const token = parsed?.message?.content || parsed?.choices?.[0]?.delta?.content || "";
                  assistantContent += token;
                } catch {
                  assistantContent += line.slice(6);
                }
              }
            }
          } else {
            // Plain text stream
            assistantContent += chunk;
          }

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantContent,
            };
            return updated;
          });
        }
      }
    } else {
      // Handle JSON response
      const data = await response.json();
      const content = data?.message?.content || data?.response || data?.content || JSON.stringify(data);
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    }

  } catch (err) {
    console.error("Chat error:", err);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Connection error: ${err instanceof Error ? err.message : "Make sure Ollama is running (ollama serve)"}`,
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
```

## STEP 3 — Verify Ollama is configured correctly in route.ts

Check if route.ts calls `http://localhost:11434`. If it uses a different port or URL, 
tell me what it says so I can fix it.

## STEP 4 — Add a console.log temporarily

In the sendMessage catch block, add:
```tsx
console.error("Full error:", err);
```
Then open browser DevTools → Console and tell me what error appears when you send a message.

## VERIFICATION
- Open browser DevTools → Network tab
- Send a message
- Click the /api/chat request
- Check: Status code? Response body? 
- Report back what you see
```

---

**Most likely causes** based on your setup:

1. **Ollama not running** — you need `ollama serve` running before the app
2. **SSE format mismatch** — Ollama streams in `data: {"message":...}` format, the old code assumed raw text
3. **Port mismatch** — route.ts might hardcode `11434` but Ollama is on a different port

Check the Network tab in DevTools first — it'll tell you exactly which one it is.export default function Header() {
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div style={{ fontSize: "48px", marginBottom: "4px" }}>🌸</div>
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 700,
          color: "#f0eaff",
          margin: 0,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        What's on your mind?
      </h1>
      <p style={{ color: "#9d8ec7", fontSize: "15px", margin: 0, maxWidth: "440px", lineHeight: 1.5 }}>
        Ask Aria anything about your health — privately, honestly, without judgment.
      </p>
    </div>
  );
}