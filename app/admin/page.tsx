"use client";

import { useState, useEffect } from "react";

interface BonusItem {
  id: string;
  name: string;
  bonus: string;
  deadline: string;
  eventName: string;
  isActive: boolean;
}

const formatTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function AdminPage() {
  const [name, setName] = useState("");
  const [bonus, setBonus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [eventName, setEventName] = useState("");
  const [data, setData] = useState<BonusItem[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bonusData") || "[]");
    setData(stored);

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    if (!name || !bonus || !deadline || !eventName) return;

    const id = name.toLowerCase().replace(/\s+/g, "") + Date.now();
    const newEntry: BonusItem = {
      id,
      name,
      bonus,
      deadline,
      eventName,
      isActive: true,
    };

    const updated = [...data, newEntry];
    localStorage.setItem("bonusData", JSON.stringify(updated));
    setData(updated);

    setName("");
    setBonus("");
    setDeadline("");
    setEventName("");
  };

  const handleToggle = (id: string) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    localStorage.setItem("bonusData", JSON.stringify(updated));
    setData(updated);
  };

  // Fungsi untuk menyalin link klaim
  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/claim?user=${encodeURIComponent(id)}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link Klaim telah disalin!");
    });
  };

  return (
    <main style={{ maxWidth: 600, margin: "4rem auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>🎯 Halaman Admin Bonus</h1>

      {/* Form Input Admin */}
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Nama Klien"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <textarea
          placeholder="Rincian Bonus"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Nama Event"
          style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: 10,
            border: "none",
            borderRadius: 5,
          }}
        >
          ➕ Tambah Bonus
        </button>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <h2>📋 Daftar Klien:</h2>
      <ul>
        {data.map((item) => {
          const deadlineMs = new Date(item.deadline).getTime();
          const remainingSec = Math.max(Math.floor((deadlineMs - now) / 1000), 0);

          return (
            <li
              key={item.id}
              style={{
                marginBottom: 25,
                padding: "1rem",
                borderRadius: "1rem",
                background: "#f9fafb",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                color: "#111827",
              }}
            >
              <strong>{item.name}</strong> — {item.bonus}
              <br />
              🕒 Batas klaim:{" "}
              {new Date(item.deadline).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })}
              <br />
              📍 Nama Event: {item.eventName}
              <br />
              ⏳ Waktu tersisa:{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  background: "#dcfce7",
                  padding: "4px 8px",
                  borderRadius: "0.4rem",
                  color: "#065f46",
                }}
              >
                {formatTime(remainingSec)}
              </span>
              <br />
              🔗 Link klaim: <code>/claim?user={encodeURIComponent(item.id)}</code>
              <br />
              
              {/* Tombol Salin Link Klaim */}
              <button
                onClick={() => handleCopyLink(item.id)}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  marginTop: 8,
                  cursor: "pointer",
                }}
              >
                📋 Salin Link Klaim
              </button>
              
              <br />
              <button
                onClick={() => handleToggle(item.id)}
                style={{
                  background: item.isActive ? "#facc15" : "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.75rem",
                  fontWeight: 600,
                  marginTop: 8,
                  cursor: "pointer",
                }}
              >
                {item.isActive ? "🚫 Nonaktifkan" : "✅ Aktifkan"}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
