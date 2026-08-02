import { useEffect, useState } from "react";

export default function MessagingSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/client/messages", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => setMessages([]));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
          const res = await fetch("http://localhost:5000/api/client/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: input })
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages([...messages, msg]);
      setInput("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
      <h2 className="font-bold text-xl mb-2">Messagerie</h2>
      <div className="flex-1 mb-2 overflow-y-auto max-h-40">
        {messages.length === 0 && <div className="text-gray-500">Aucun message.</div>}
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            <span className="font-semibold">{msg.from}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-2xl px-3 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Votre message..."
        />
        <button
          className="bg-primary text-white px-4 py-1 rounded-2xl"
          onClick={handleSend}
          type="button"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
} 