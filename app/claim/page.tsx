"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


interface BonusItem {
  id: string;
  name: string;
  bonus: string;
  deadline: string;
  eventName: string;
  isActive?: boolean;
}

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const userKey = searchParams.get("user");
  const [userData, setUserData] = useState<BonusItem | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bonusData") || "[]");
    const user = stored.find((item: BonusItem) => item.id === userKey);
    setUserData(user || null);
  }, [userKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!userData) return;
      const deadline = new Date(userData.deadline).getTime();
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
        return;
      }

      const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [userData]);

  if (!userData) {
    return (
      <main style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h1>Bonus Tidak Ditemukan</h1>
        <p>Link tidak valid atau bonus belum tersedia.</p>
      </main>
    );
  }



  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "6rem 1rem 4rem",
        background: "linear-gradient(to bottom right, #fefce8, #ecfdf5, #d1fae5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 1024,
          backgroundColor: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          padding: "0.75rem 1.5rem",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#26282a" }}>
          Shreya Reward
        </div>
        <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>Powered by Rindang</div>
      </div>

      {/* Ucapan Terima Kasih */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem",
        marginTop: "6rem",
        maxWidth: 600,
        padding: "0 1rem"
      }}>
        <h2 style={{
          fontSize: "3rem",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "0.5rem",
        }}>
          Hi, Terima Kasih Ya!
        </h2>
        <p style={{ fontSize: "1rem", color: "#4b5563", maxWidth: 480 }}>
          Terimakasih sudah berkunjung untuk mencicipi makanan dari Rindang Catering dan berkonsultasi dengan kami.
        </p>
      </div>

      {/* Konten utama */}
      <div
        style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          maxWidth: 480,
          width: "100%",
          marginTop: "0.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#065f46", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          🎁 Halo, {userData.name}!
        </h1>
        <p style={{ color: "#4b5563", marginBottom: 20 }}>
          Kamu mendapatkan bonus spesial dari kami:
        </p>

        {/* Bonus List */}
        <div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {userData.bonus
              .split("\n")
              .filter((line) => line.trim())
              .map((line, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: 10,
                    padding: "0.5rem 1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    backgroundColor: "#f9fafb",
                    color: "#374151",
                    textAlign: "left",
                  }}
                >
                  <span style={{ color: "#059669", fontWeight: "bold" }}>✓</span> {line}
                </li>
              ))}
          </ul>

          {/* Nama Event */}
          <div style={{ color: "#26282a", marginTop: "1rem", textAlign: "left" }}>
            <strong>Nama Event:</strong>{" "}
            <span style={{ color: "#26282a" }}>
              {userData.eventName || "Nama event tidak tersedia"}
            </span>
          </div>
        </div>

        {/* STATUS BONUS */}
        {!userData.isActive && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              padding: "1rem",
              borderRadius: "0.75rem",
              marginTop: "1rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Bonus ini sudah tidak berlaku ❌
          </div>
        )}

        {/* Timer & Button */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginTop: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#ecfdf5",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              color: "#047857",
              fontWeight: "600",
            }}
          >
            ⏱ Waktu tersisa: {timeLeft}
          </div>
          {userData.isActive && (
            <button
              style={{
                backgroundColor: "#10b981",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                fontSize: "1rem",
                fontWeight: "600",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
              onClick={() => setShowModal(true)}
            >
              Klaim Bonus Sekarang
            </button>
          )}
        </div>
      </div>

      {/* Popup */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
        <div
          style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          position: "relative", // Agar tombol X bisa diposisikan dengan benar
        }}
        >
        {/* Tombol silang (X) untuk menutup modal */}
        <button
          onClick={() => setShowModal(false)}
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#6b7280",
            cursor: "pointer",
          }}
        aria-label="Tutup"
        >
          ✖
        </button>

  <h2
    style={{
      color: "#10b981",
      fontSize: "1.25rem",
      fontWeight: 700,
      marginBottom: "1rem",
    }}
  >
    🎉 Bonus Kamu Sudah Diklaim!
  </h2>
  <p style={{ marginBottom: "1rem", color: "#374151" }}>
    Screenshoot list bonusnya dan tunjukkan ke tim yang handle kamu saat kamu datang kembali ke booth kami.
  </p>


  {/* Tombol WhatsApp Marketing */}
  <a
    href="https://wa.me/6282121219450" // Ganti dengan nomor WhatsApp lo
    target="_blank"
    rel="noopener noreferrer"
    style={{
      backgroundColor: "#22c55e",
      color: "#fff",
      padding: "0.5rem 1.25rem",
      borderRadius: "0.5rem",
      fontWeight: "bold",
      textDecoration: "none",
      display: "inline-block",
      marginBottom: 12,
    }}
    >
    💬 Hubungi Kami via WhatsApp
  </a>
  <br />  

      {/* Tombol ke Instagram */}
        <a
          href="https://www.instagram.com/rindang.amena" // Ganti dengan link Instagram lo
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          📸 Kunjungi Instagram
        </a>
        </div>

        </div>
      )}
    </main>
  );
}
