"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const LOCAL_STORAGE_KEY = "claimedBonuses";

export default function BonusPage() {
  const searchParams = useSearchParams();
  const userKey = searchParams.get("user");

  const [userData, setUserData] = useState<any>(null);
  const [claimed, setClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Ambil data user dari localStorage
  useEffect(() => {
    if (!userKey) return;

    const stored = JSON.parse(localStorage.getItem("bonusData") || "[]");
    const user = stored.find((entry: any) => entry.id === userKey);
    setUserData(user);

    const claimedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    if (claimedData[userKey]) setClaimed(true);
  }, [userKey]);

  // Countdown
  useEffect(() => {
    if (!userData?.deadline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(userData.deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("❌ Waktu habis");
      } else {
        const h = Math.floor(diff / 1000 / 60 / 60);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${h}j ${m}m ${s}d`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userData]);

  // Klaim bonus
  const handleClaim = () => {
    const claimedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    claimedData[userKey as string] = true;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(claimedData));
    setClaimed(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #d1fae5, #10b981, #064e3b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: "100%",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          padding: "32px 24px",
        }}
      >
        {!userData ? (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#dc2626" }}>
              ❌ Bonus Tidak Ditemukan
            </h1>
            <p style={{ marginTop: 10, color: "#6b7280" }}>
              Link tidak valid atau bonus belum tersedia.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10, color: "#064e3b" }}>
              🎁 Halo, {userData.name}!
            </h1>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>
              Kamu mendapatkan bonus spesial dari kami:
            </p>

            <div
              style={{
                background: "#fefce8",
                border: "1px solid #fde68a",
                padding: "20px",
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 600, color: "#92400e", marginBottom: 8 }}>
                Bonus Kamu:
              </p>

              <ul style={{ paddingLeft: 20, color: "#92400e", margin: 0, listStyleType: "disc" }}>
                {userData.bonus.split("\n").map((item: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: 6 }}>{item}</li>
                ))}
              </ul>

              <p style={{ marginTop: 16, color: "#92400e" }}>
                ⏳ Berlaku hingga: <strong>{timeLeft}</strong>
              </p>
            </div>

            {!claimed ? (
              <button
                onClick={handleClaim}
                style={{
                  background: "#10b981",
                  color: "#fff",
                  padding: "12px 24px",
                  fontSize: 16,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                🎉 Klaim Bonus Sekarang
              </button>
            ) : (
              <p
                style={{
                  background: "#ecfdf5",
                  padding: "12px 16px",
                  borderRadius: 10,
                  color: "#065f46",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                ✅ Bonus sudah berhasil diklaim. Selamat ya!
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
