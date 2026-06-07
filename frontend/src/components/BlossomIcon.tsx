"use client";

import { motion } from "framer-motion";

export default function BlossomIcon() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* 🌸 emoji with subtle breathing animation */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        initial={false}
        style={{
          fontSize: "60px",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        🌸
      </motion.div>

      {/* ARIA label */}
      <motion.span
        animate={{ opacity: [0.65, 0.7, 0.65] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        initial={false}
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.38em",
          color: "rgba(232, 96, 127, 0.65)",
          userSelect: "none",
        }}
      >
        Aria
      </motion.span>
    </div>
  );
}