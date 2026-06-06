export async function POST(req: Request) {
  const { message, history } = await req.json();

  try {
    // Call the Python FastAPI backend
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: "Model server error. Make sure api_server.py is running.",
          detail: errorText,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Forward the streaming response from the Python server to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to connect to model server. Start api_server.py with: python api_server.py",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
