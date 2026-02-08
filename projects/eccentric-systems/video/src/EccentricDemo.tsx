import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

// Color palette
const colors = {
  bg: "#0a0a0f",
  primary: "#6366f1", // Indigo
  secondary: "#22d3ee", // Cyan
  accent: "#f472b6", // Pink
  text: "#ffffff",
  textMuted: "#94a3b8",
};

// Animated text component
const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
}> = ({ text, delay = 0, size = 64, color = colors.text, weight = 700 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const y = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const translateY = interpolate(y, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: size,
        fontWeight: weight,
        color,
        fontFamily: "Inter, system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

// Stat counter component
const StatCounter: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <div
      style={{
        opacity: scale,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: colors.secondary,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 24,
          color: colors.textMuted,
          fontFamily: "Inter, system-ui, sans-serif",
          marginTop: 10,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Slide 1: Opening hook
const Slide1: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedText
        text="Your competitors are using AI."
        size={56}
        color={colors.textMuted}
        delay={0}
      />
      <div style={{ height: 40 }} />
      <AnimatedText text="Are you?" size={96} delay={30} />
    </AbsoluteFill>
  );
};

// Slide 2: Problem stats
const Slide2: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AnimatedText
        text="You're Losing Money Every Day"
        size={64}
        delay={0}
        color={colors.accent}
      />
      <div style={{ height: 60 }} />
      <div style={{ display: "flex", gap: 60 }}>
        <StatCounter value="40%" label="of work is repetitive" delay={20} />
        <StatCounter value="23 hrs" label="per week on email" delay={35} />
        <StatCounter value="$1.8T" label="lost to poor service" delay={50} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 3: Solution intro
const Slide3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AnimatedText text="Introducing" size={36} color={colors.textMuted} delay={0} />
      <div style={{ height: 20 }} />
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoScale,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Eccentric Systems
        </span>
      </div>
      <div style={{ height: 40 }} />
      <AnimatedText
        text="Custom AI that actually understands your business"
        size={32}
        color={colors.textMuted}
        delay={40}
        weight={400}
      />
    </AbsoluteFill>
  );
};

// Slide 4: Features
const Slide4: React.FC = () => {
  const features = [
    { icon: "📧", text: "Instant email responses" },
    { icon: "📅", text: "Automated scheduling" },
    { icon: "🎯", text: "Lead capture & follow-up" },
    { icon: "🔍", text: "Document intelligence" },
    { icon: "💬", text: "24/7 customer support" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AnimatedText text="What We Deploy For You" size={56} delay={0} />
      <div style={{ height: 60 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 25,
        }}
      >
        {features.map((f, i) => (
          <AnimatedText
            key={i}
            text={`${f.icon}  ${f.text}`}
            size={40}
            delay={20 + i * 15}
            weight={500}
            color={colors.textMuted}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Slide 5: ROI
const Slide5: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AnimatedText text="The ROI Speaks For Itself" size={56} delay={0} />
      <div style={{ height: 60 }} />
      <div style={{ display: "flex", gap: 80 }}>
        <StatCounter value="3-10x" label="Return on Investment" delay={20} />
        <StatCounter value="48 hrs" label="Setup Time" delay={35} />
        <StatCounter value="$500" label="Starting at /month" delay={50} />
      </div>
    </AbsoluteFill>
  );
};

// Slide 6: CTA
const Slide6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin(frame * 0.1) * 0.05 + 1;

  const buttonScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <AnimatedText
        text="Stop leaving money on the table."
        size={48}
        color={colors.textMuted}
        delay={0}
        weight={400}
      />
      <div style={{ height: 40 }} />
      <AnimatedText text="Book your free discovery call" size={64} delay={20} />
      <div style={{ height: 60 }} />
      <div
        style={{
          transform: `scale(${buttonScale * pulse})`,
          opacity: buttonScale,
          padding: "24px 64px",
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: 16,
          fontSize: 32,
          fontWeight: 700,
          color: colors.text,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        cal.com/eccentric-systems
      </div>
      <div style={{ height: 40 }} />
      <AnimatedText
        text="amanda.hopkins.claw@gmail.com"
        size={28}
        color={colors.textMuted}
        delay={60}
        weight={400}
      />
    </AbsoluteFill>
  );
};

// Main composition
export const EccentricDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Slide 1: 0-5 sec */}
      <Sequence from={0} durationInFrames={150}>
        <Slide1 />
      </Sequence>

      {/* Slide 2: 5-10 sec */}
      <Sequence from={150} durationInFrames={150}>
        <Slide2 />
      </Sequence>

      {/* Slide 3: 10-15 sec */}
      <Sequence from={300} durationInFrames={150}>
        <Slide3 />
      </Sequence>

      {/* Slide 4: 15-20 sec */}
      <Sequence from={450} durationInFrames={150}>
        <Slide4 />
      </Sequence>

      {/* Slide 5: 20-25 sec */}
      <Sequence from={600} durationInFrames={150}>
        <Slide5 />
      </Sequence>

      {/* Slide 6: 25-30 sec */}
      <Sequence from={750} durationInFrames={150}>
        <Slide6 />
      </Sequence>
    </AbsoluteFill>
  );
};
