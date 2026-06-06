"use client";

import { HeartPulseIcon, ActivityIcon, FlaskConicalIcon, BabyIcon, BrainIcon, ThermometerIcon } from "lucide-react";

interface ExamplePillsProps {
  onSelect: (message: string) => void;
}

const TOPICS = [
  { icon: <ActivityIcon size={14} />, label: "Period Health", prompt: "What causes irregular periods and what can I do about it?" },
  { icon: <FlaskConicalIcon size={14} />, label: "PCOS", prompt: "What are the symptoms of PCOS and how is it treated?" },
  { icon: <HeartPulseIcon size={14} />, label: "Hormones", prompt: "How do hormones affect my mood and energy throughout my cycle?" },
  { icon: <ThermometerIcon size={14} />, label: "UTI & Infections", prompt: "What are signs of a UTI and when should I see a doctor?" },
  { icon: <BabyIcon size={14} />, label: "Fertility", prompt: "What factors affect fertility and how can I track ovulation?" },
  { icon: <BrainIcon size={14} />, label: "Mood & Mental Health", prompt: "How does my menstrual cycle affect my anxiety and depression?" },
];

export default function ExamplePills({ onSelect }: ExamplePillsProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
      {TOPICS.map((topic) => (
        <button
          key={topic.label}
          type="button"
          onClick={() => onSelect(topic.prompt)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: "999px",
            color: "#c4b5fd",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.22)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
            e.currentTarget.style.color = "#ede9fe";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
            e.currentTarget.style.color = "#c4b5fd";
          }}
        >
          {topic.icon}
          <span>{topic.label}</span>
        </button>
      ))}
    </div>
  );
}