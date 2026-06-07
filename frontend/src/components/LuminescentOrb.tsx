"use client";

import { motion } from "framer-motion";

export default function LuminescentOrb() {
  return (
    <div className="relative flex flex-col items-center gap-0">
      {/* ── Outer Aura — soft pink + purple, blurred, low opacity, extends ~50px ── */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        initial={false}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 184,
          height: 184,
          top: -50,
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 38% 40%, rgba(232,96,127,0.22) 0%, rgba(181,41,78,0.12) 35%, rgba(123,63,160,0.14) 60%, transparent 80%)",
          filter: "blur(18px)",
          zIndex: 0,
        }}
      />

      {/* ── Secondary purple haze — depth layer ─────────────────── */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        initial={false}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220,
          height: 220,
          top: -68,
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 62% 55%, rgba(123,63,160,0.18) 0%, rgba(181,41,78,0.08) 45%, transparent 70%)",
          filter: "blur(28px)",
          zIndex: 0,
        }}
      />

      {/* ── The Cloud Orb Core — 84px, no ring, no border ───────── */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        initial={false}
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: 84,
          height: 84,
          zIndex: 1,
        }}
      >
        {/* Foggy cloud base — no sharp edges */}
        <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-md" />

        {/* ── Drifting inner gradient layer 1 — pink ─────────────── */}
        <motion.div
          animate={{ x: [-6, 6, -6], y: [-4, 4, -4] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          initial={false}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 35% 38%, rgba(232,96,127,0.55) 0%, rgba(244,114,182,0.3) 40%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />

        {/* ── Drifting inner gradient layer 2 — purple ───────────── */}
        <motion.div
          animate={{ x: [6, -6, 6], y: [4, -4, 4] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          initial={false}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 68% 62%, rgba(123,63,160,0.5) 0%, rgba(167,139,250,0.28) 40%, transparent 70%)",
            filter: "blur(14px)",
          }}
        />

        {/* ── Drifting inner gradient layer 3 — plum depth ───────── */}
        <motion.div
          animate={{ x: [-4, 4, -4], y: [5, -5, 5] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 7 }}
          initial={false}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(181,41,78,0.35) 0%, transparent 65%)",
            filter: "blur(10px)",
          }}
        />

        {/* ── Soft highlight — top-left gleam ─────────────────────── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "55%",
            height: "45%",
            top: "12%",
            left: "18%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)",
            filter: "blur(6px)",
          }}
        />
      </motion.div>

      {/* ── ARIA Label ───────────────────────────────────────────── */}
      <motion.div
        animate={{ opacity: [0.55, 0.72, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        initial={false}
        className="relative flex items-center gap-2 mt-2.5"
        style={{ zIndex: 1 }}
      >
        {/* Breathing glow dot */}
        <motion.span
          animate={{
            opacity: [0.35, 0.9, 0.35],
            boxShadow: [
              "0 0 3px rgba(232,96,127,0.2), 0 0 6px rgba(232,96,127,0.1)",
              "0 0 6px rgba(232,96,127,0.65), 0 0 14px rgba(232,96,127,0.35), 0 0 24px rgba(181,41,78,0.15)",
              "0 0 3px rgba(232,96,127,0.2), 0 0 6px rgba(232,96,127,0.1)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          initial={false}
          className="inline-block w-[5px] h-[5px] rounded-full flex-shrink-0"
          style={{
            background:
              "radial-gradient(circle, #f472b6 0%, #e8607f 55%, #b5294e 100%)",
          }}
        />

        <span
          className="text-[10px] uppercase font-medium leading-none"
          style={{
            letterSpacing: "0.38em",
            color: "rgba(232, 96, 127, 0.72)",
          }}
        >
          Aria
        </span>
      </motion.div>
    </div>
  );
}
