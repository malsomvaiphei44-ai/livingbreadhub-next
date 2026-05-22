"use client";

import { useEffect, useRef, useState } from "react";
import { languages } from "./lib/languages";
import { dailyVerses } from "./lib/verses";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [lang, setLang] = useState("en");
  const todayIndex = new Date().getDate() % dailyVerses.length;
const verseData = dailyVerses[todayIndex][lang as "en" | "hi" | "ng"];
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updated = [...messages, { role: "user", content: input }];

    setMessages(updated);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", content: data.reply },
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>
  🙏 {languages[lang].title}
</h2>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 10 }}>
  <button onClick={() => setLang("en")}>EN</button>
  <button onClick={() => setLang("hi")}>HI</button>
  <button onClick={() => setLang("ng")}>NG</button>
</div>
<div
  style={{
    background: "#fff8e7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    border: "1px solid #f0d98a",
  }}
>
  <h3 style={{ marginBottom: 10 }}>
    📖 {lang === "hi"
      ? "आज का बाइबल वचन"
      : lang === "ng"
      ? "Aji Laga Bible Verse"
      : "Daily Bible Verse"}
  </h3>

  <p>
    <strong>{verseData.verse}</strong>
  </p>

  <p style={{ marginTop: 8 }}>
    "{verseData.text}"
  </p>

  <p style={{ marginTop: 10, fontStyle: "italic" }}>
    ✨ {verseData.inspiration}
  </p>

  <p style={{ marginTop: 10 }}>
    🙏 {verseData.prayer}
  </p>
</div>
      <div
        style={{
          minHeight: "200px",
maxHeight: "60vh",
overflowY: "auto",
          
          border: "1px solid #ddd",
          padding: 10,
          borderRadius: 10,
          background: "#fafafa",
        }}
      >
        {messages.length === 0 && (
  <p style={{ textAlign: "center", color: "#888" }}>
    Start chatting with LivingBreadHub AI 🙏
  </p>
)}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background: m.role === "user" ? "#DCF8C6" : "#F1F0F0",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
  lang === "en"
    ? "Ask something..."
    : lang === "hi"
    ? "कुछ पूछें..."
    : "Ki hudibo? (ask something)"
          }
          style={{ flex: 1, padding: 10, borderRadius: 8 }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10, padding: 10 }}>
          {lang === "en" ? "Send" : lang === "hi" ? "भेजें" : "Thawn"}
        </button>
      </div>
    </main>
  );
        }
