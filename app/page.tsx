
"use client";

import { useState } from "react";
import { Bot, Send, Plus, Menu, Sparkles } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const text = input.trim();
    const next = [...messages, { role: "user", content: text }];

    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMessages([
        ...next,
        { role: "assistant", content: data.reply }
      ]);
    } catch (error) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "ไม่สามารถเชื่อมต่อ AI ได้ กรุณาตรวจสอบการตั้งค่า API"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#090d16",
      color: "white",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      <header style={{
        padding: "18px",
        borderBottom: "1px solid #263247",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <Bot color="#82baff" size={30} />
        <div>
          <b>GPT SEAPUS 5.5</b>
          <div style={{ fontSize: 11, color: "#8da4c2" }}>
            AI STUDIO
          </div>
        </div>
        <span style={{ marginLeft: "auto", color: "#66d5a3" }}>
          ● ONLINE UI
        </span>
      </header>

      <section style={{
        flex: 1,
        width: "100%",
        maxWidth: 850,
        margin: "auto",
        padding: 20,
        boxSizing: "border-box"
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "15vh" }}>
            <Sparkles size={35} color="#82baff" />
            <h1>มีอะไรให้ช่วยในวันนี้?</h1>
            <p style={{ color: "#8999b0" }}>
              Your AI workspace. Think beyond limits.
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{
              margin: "18px 0",
              padding: 15,
              borderRadius: 12,
              background: m.role === "user" ? "#193352" : "#131e30",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap"
            }}>
              <b>{m.role === "user" ? "คุณ" : "GPT SEAPUS 5.5"}</b>
              <div>{m.content}</div>
            </div>
          ))
        )}

        {loading && <p style={{ color: "#82baff" }}>กำลังคิดคำตอบ...</p>}
      </section>

      <footer style={{
        width: "100%",
        maxWidth: 850,
        margin: "0 auto",
        padding: 15,
        boxSizing: "border-box"
      }}>
        <div style={{
          display: "flex",
          gap: 10,
          padding: 10,
          background: "#131e30",
          border: "1px solid #34445e",
          borderRadius: 14
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="ส่งข้อความถึง GPT SEAPUS 5.5..."
            style={{
              flex: 1,
              minWidth: 0,
              background: "transparent",
              color: "white",
              border: 0,
              outline: 0,
              padding: 10
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              background: "#82baff",
              border: 0,
              borderRadius: 10,
              padding: "10px 14px",
              color: "#071323"
            }}
          >
            <Send size={19} />
          </button>
        </div>
        <p style={{
          textAlign: "center",
          color: "#64758e",
          fontSize: 11
        }}>
          GPT SEAPUS 5.5 AI STUDIO
        </p>
      </footer>
    </main>
  );
}
