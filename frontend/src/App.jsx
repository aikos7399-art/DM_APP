import { useState, useEffect, useRef } from "react";

const styles = {
  bg: "#000",
  panel: "#16181c",
  border: "#2f3336",
  text: "#e7e9ea",
  sub: "#71767b",
  blue: "#1d9bf0"
};

export default function App() {
  const [messages, setMessages] = useState([
    { from: "them", text: "やっほー！元気？", time: "10:00" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  // ⚠️ ここあとでRenderのURLに変える
  const API_URL = "http://localhost:3001/chat";

  const send = async () => {
    if (!input.trim()) return;

    const myMsg = {
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString().slice(0,5)
    };

    setMessages(prev => [...prev, myMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          character: {
            name: "Yuki Tanaka",
            personality: "フレンドリーでちょっとオタク気質",
            tone: "カジュアル"
          },
          messages: [
            ...messages.map(m => ({
              role: m.from === "me" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: input }
          ]
        })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          from: "them",
          text: data.reply || "（返信エラー）",
          time: new Date().toLocaleTimeString().slice(0,5)
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          from: "them",
          text: "（通信エラー）",
          time: new Date().toLocaleTimeString().slice(0,5)
        }
      ]);
    }

    setTyping(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: styles.bg,
      color: styles.text,
      fontFamily: "sans-serif"
    }}>

      {/* メイン */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{
          padding: 12,
          borderBottom: `1px solid ${styles.border}`,
          fontWeight: "bold"
        }}>
          Yuki Tanaka
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 12
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.from === "me" ? "flex-end" : "flex-start",
              marginBottom: 8
            }}>
              <div style={{
                background: m.from === "me" ? styles.blue : styles.panel,
                padding: "10px 14px",
                borderRadius: 18,
                maxWidth: "70%"
              }}>
                {m.text}
                <div style={{
                  fontSize: 10,
                  color: styles.sub,
                  marginTop: 4,
                  textAlign: "right"
                }}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ color: styles.sub, fontSize: 12 }}>
              入力中...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: 10,
          borderTop: `1px solid ${styles.border}`,
          display: "flex",
          gap: 8
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="新しいメッセージ"
            style={{
              flex: 1,
              background: styles.panel,
              border: `1px solid ${styles.border}`,
              color: "#fff",
              borderRadius: 20,
              padding: "10px 14px"
            }}
            onKeyDown={e => {
              if (e.key === "Enter") send();
            }}
          />
          <button
            onClick={send}
            style={{
              background: styles.blue,
              border: "none",
              color: "#fff",
              padding: "0 16px",
              borderRadius: 20
            }}
          >
            送信
          </button>
        </div>

      </div>
    </div>
  );
}
