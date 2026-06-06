"use client";

import { useEffect, useState } from "react";

interface DisclaimerModalProps {
  onClose: () => void;
}

export default function DisclaimerModal({ onClose }: DisclaimerModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(26, 26, 46, 0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          maxWidth: "448px",
          width: "90%",
          backgroundColor: "rgba(30, 30, 50, 0.95)",
          borderRadius: "28px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌸</div>

        {/* Title */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#a78bfa",
          }}
        >
          Welcome to Aria
        </h2>

        {/* Body text */}
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "24px",
            color: "#c4b5fd",
          }}
        >
          Aria is an AI trained on women's health topics. Ask anything about your body — periods,
          hormones, sexual health, PCOS, menopause — without embarrassment.
        </p>

        {/* Security note */}
        <div
          style={{
            marginBottom: "24px",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "12px",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            color: "#9d8ec7",
          }}
        >
          🔒 Runs locally on your device · No data sent anywhere · Not a substitute for medical advice
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          I understand — Let's talk 💬
        </button>
      </div>
    </div>
  );
}