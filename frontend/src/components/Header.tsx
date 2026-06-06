import BreathingCircle from "./BreathingCircle";

export default function Header() {
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <BreathingCircle />
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 700,
          color: "#f0eaff",
          margin: 0,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        What's on your mind?
      </h1>
      <p style={{ color: "#9d8ec7", fontSize: "15px", margin: 0, maxWidth: "440px", lineHeight: 1.5 }}>
        Ask Aria anything about your health — privately, honestly, without judgment.
      </p>
    </div>
  );
}