"use client";

import { useEffect, useState } from "react";

export default function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [label, setLabel] = useState("breathe");

  useEffect(() => {
    const cycle = () => {
      setPhase("inhale");
      setLabel("inhale");
      setTimeout(() => {
        setPhase("exhale");
        setLabel("exhale");
      }, 4000);
    };

    cycle();
    const interval = setInterval(cycle, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-32 h-32 mb-6">
      
      {/* Outermost ring — slowest, most transparent */}
      <div
        className="absolute rounded-full transition-all duration-[4000ms] ease-in-out"
        style={{
          width: phase === "inhale" ? "128px" : "72px",
          height: phase === "inhale" ? "128px" : "72px",
          background: "radial-gradient(circle, rgba(181,41,78,0.06) 0%, transparent 70%)",
          border: "1px solid rgba(181,41,78,0.12)",
        }}
      />

      {/* Middle ring */}
      <div
        className="absolute rounded-full transition-all duration-[4000ms] ease-in-out"
        style={{
          width: phase === "inhale" ? "96px" : "52px",
          height: phase === "inhale" ? "96px" : "52px",
          background: "radial-gradient(circle, rgba(181,41,78,0.10) 0%, transparent 70%)",
          border: "1px solid rgba(181,41,78,0.20)",
        }}
      />

      {/* Inner ring */}
      <div
        className="absolute rounded-full transition-all duration-[4000ms] ease-in-out"
        style={{
          width: phase === "inhale" ? "68px" : "36px",
          height: phase === "inhale" ? "68px" : "36px",
          background: "radial-gradient(circle, rgba(181,41,78,0.18) 0%, rgba(123,63,160,0.10) 60%, transparent 100%)",
          border: "1px solid rgba(181,41,78,0.35)",
          boxShadow: phase === "inhale"
            ? "0 0 20px rgba(181,41,78,0.25), 0 0 40px rgba(123,63,160,0.15)"
            : "0 0 8px rgba(181,41,78,0.15)",
        }}
      />

      {/* Core — solid glowing center */}
      <div
        className="absolute rounded-full transition-all duration-[4000ms] ease-in-out"
        style={{
          width: phase === "inhale" ? "28px" : "18px",
          height: phase === "inhale" ? "28px" : "18px",
          background: "radial-gradient(circle, rgba(232,96,127,0.9) 0%, rgba(181,41,78,0.7) 50%, rgba(123,63,160,0.4) 100%)",
          boxShadow: phase === "inhale"
            ? "0 0 12px rgba(232,96,127,0.6), 0 0 24px rgba(181,41,78,0.4), 0 0 48px rgba(123,63,160,0.2)"
            : "0 0 6px rgba(232,96,127,0.4), 0 0 12px rgba(181,41,78,0.2)",
        }}
      />

      {/* Breathing label */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 transition-all duration-[4000ms] ease-in-out"
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(181,41,78,0.5)",
          fontFamily: "var(--font-dm-sans, sans-serif)",
          opacity: 0.7,
        }}
      >
        {label}
      </div>
    </div>
  );
}
