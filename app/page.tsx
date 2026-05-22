"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", content: data.reply },
    ]);
  };

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🙏 LivingBreadHub AI</h1>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.content}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{ padding: 8, marginTop: 20, width: "70%" }}
      />

      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>
        Send
      </button>
    </main>
  );
}
