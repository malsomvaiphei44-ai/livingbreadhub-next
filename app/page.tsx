"use client";

import { useEffect, useRef, useState } from "react";
import { languages } from "./lib/languages";
import { dailyVerses } from "./lib/verses";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [lang, setLang] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const todayIndex = new Date().getDate() % dailyVerses.length;
  const verseData = dailyVerses[todayIndex][lang as "en" | "hi" | "ng"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
      { role: "assistant", content: data.reply },
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (showSplash) {
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom, #111827, #1f2937)",
          color: "white",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
          alt="LivingBreadHub Logo"
          style={{
            width: 100,
            height: 100,
            marginBottom: 20,
            animation: "pulse 2s infinite",
          }}
        />

        <h1 style={{ fontSize: 32, marginBottom: 10 }}>
          🙏 LivingBreadHub
        </h1>

        <p style={{ opacity: 0.8 }}>
          Daily Faith • AI • Worship
        </p>

        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.08);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        background: darkMode
          ? "linear-gradient(to bottom, #111827, #1f2937)"
          : "linear-gradient(to bottom, #fdfcfb, #e2d1c3)",
        color: darkMode ? "white" : "black",
        transition: "0.3s",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1>🙏 {languages[lang].title}</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: darkMode ? "#374151" : "#111827",
              color: "white",
            }}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <button onClick={() => setLang("en")}>EN</button>
          <button onClick={() => setLang("hi")}>HI</button>
          <button onClick={() => setLang("ng")}>NG</button>
        </div>

        <div
          style={{
            background: darkMode ? "#1f2937" : "#fff8e7",
            padding: 20,
            borderRadius: 16,
            marginBottom: 20,
            border: darkMode
              ? "1px solid #374151"
              : "1px solid #f0d98a",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: 10 }}>
            📖 {lang === "hi"
              ? "आज का बाइबल वचन"
              : lang === "ng"
              ? "Aji Laga Bible Verse"
              : "Daily Bible Verse"}
          </h2>

          <p>
            <strong>{verseData.verse}</strong>
          </p>

          <p style={{ marginTop: 10 }}>
            "{verseData.text}"
          </p>

          <p style={{ marginTop: 12, fontStyle: "italic" }}>
            ✨ {verseData.inspiration}
          </p>

          <p style={{ marginTop: 12 }}>
            🙏 {verseData.prayer}
          </p>
        </div>

        <div
          style={{
            background: darkMode ? "#1f2937" : "white",
            padding: 20,
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: 15 }}>
            🤖 AI Faith Assistant
          </h2>

          <div
            style={{
              minHeight: 250,
              maxHeight: "50vh",
              overflowY: "auto",
              border: darkMode
                ? "1px solid #374151"
                : "1px solid #ddd",
              padding: 15,
              borderRadius: 12,
              background: darkMode ? "#111827" : "#fafafa",
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  opacity: 0.7,
                }}
              >
                Start chatting with LivingBreadHub AI 🙏
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign:
                    m.role === "user" ? "right" : "left",
                  margin: "12px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: 14,
                    background:
                      m.role === "user"
                        ? "#2563eb"
                        : darkMode
                        ? "#374151"
                        : "#f1f0f0",
                    color:
                      m.role === "user"
                        ? "white"
                        : darkMode
                        ? "white"
                        : "black",
                    maxWidth: "80%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 15,
              gap: 10,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === "en"
                  ? "Ask something..."
                  : lang === "hi"
                  ? "कुछ पूछें..."
                  : "Ki hudibo?"
              }
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                border: "none",
                outline: "none",
                background: darkMode ? "#374151" : "#f3f4f6",
                color: darkMode ? "white" : "black",
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              {lang === "en"
                ? "Send"
                : lang === "hi"
                ? "भेजें"
                : "Send"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
    }
