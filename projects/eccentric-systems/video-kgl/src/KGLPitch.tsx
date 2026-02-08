import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Easing,
} from "remotion";

// KGL Brand Colors
const colors = {
  bg: "#0f1419",
  bgLight: "#1a1f26",
  primary: "#c9a227", // Gold
  secondary: "#ffffff",
  accent: "#2d9cdb", // Blue accent
  text: "#ffffff",
  textMuted: "#8899a6",
  success: "#17bf63",
  warning: "#ffad1f",
  danger: "#e0245e",
};

// Animated text with fade and slide
const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  weight?: number;
  align?: "left" | "center" | "right";
  maxWidth?: number;
}> = ({ children, delay = 0, size = 48, color = colors.text, weight = 600, align = "center", maxWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const y = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const translateY = interpolate(y, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: size,
        fontWeight: weight,
        color,
        fontFamily: "Inter, system-ui, sans-serif",
        textAlign: align,
        lineHeight: 1.3,
        maxWidth: maxWidth || "100%",
      }}
    >
      {children}
    </div>
  );
};

// Stat box component
const StatBox: React.FC<{
  value: string;
  label: string;
  delay: number;
  color?: string;
}> = ({ value, label, delay, color = colors.primary }) => {
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
        padding: "30px 40px",
        backgroundColor: colors.bgLight,
        borderRadius: 16,
        border: `2px solid ${color}33`,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: color,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 20,
          color: colors.textMuted,
          fontFamily: "Inter, system-ui, sans-serif",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Problem point with icon
const ProblemPoint: React.FC<{
  icon: string;
  text: string;
  delay: number;
}> = ({ icon, text, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(frame - delay, [0, 20], [-30, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "16px 0",
      }}
    >
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span
        style={{
          fontSize: 28,
          color: colors.text,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Solution point with checkmark
const SolutionPoint: React.FC<{
  text: string;
  delay: number;
}> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame - delay, [0, 20], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 0",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: colors.success,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        ✓
      </div>
      <span
        style={{
          fontSize: 26,
          color: colors.text,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Comparison row
const CompareRow: React.FC<{
  label: string;
  before: string;
  after: string;
  delay: number;
}> = ({ label, before, after, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 20,
        padding: "16px 0",
        borderBottom: `1px solid ${colors.bgLight}`,
      }}
    >
      <div style={{ fontSize: 24, color: colors.textMuted, fontFamily: "Inter", fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, color: colors.danger, fontFamily: "Inter", fontWeight: 600, textAlign: "center" }}>
        {before}
      </div>
      <div style={{ fontSize: 24, color: colors.success, fontFamily: "Inter", fontWeight: 600, textAlign: "center" }}>
        {after}
      </div>
    </div>
  );
};

// SLIDE 1: Opening - Personalized Hook
const Slide1: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={42} color={colors.textMuted} delay={0} weight={400}>
        A message for the team at
      </AnimatedText>
      <div style={{ height: 30 }} />
      <AnimatedText size={72} color={colors.primary} delay={20} weight={700}>
        KGL Realty Pro
      </AnimatedText>
      <div style={{ height: 40 }} />
      <AnimatedText size={36} color={colors.textMuted} delay={45} weight={400}>
        Lagos' Premier Luxury Real Estate Agency
      </AnimatedText>
    </AbsoluteFill>
  );
};

// SLIDE 2: Recognition - What They're Doing Well
const Slide2: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={48} color={colors.text} delay={0}>
        We've Been Watching Your Work
      </AnimatedText>
      <div style={{ height: 50 }} />
      <div style={{ display: "flex", gap: 30 }}>
        <StatBox value="SEO" label="Strong blog content" delay={20} color={colors.success} />
        <StatBox value="UK/UAE" label="International expansion" delay={35} color={colors.success} />
        <StatBox value="Lekki" label="Market authority" delay={50} color={colors.success} />
      </div>
      <div style={{ height: 40 }} />
      <AnimatedText size={28} color={colors.textMuted} delay={70} weight={400}>
        Your content on Lekki Phase 1 pricing is excellent.
      </AnimatedText>
    </AbsoluteFill>
  );
};

// SLIDE 3: The Gap - What's Missing
const Slide3: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 100,
      }}
    >
      <AnimatedText size={48} color={colors.warning} delay={0}>
        But Here's What We Noticed...
      </AnimatedText>
      <div style={{ height: 50 }} />
      <ProblemPoint icon="⏰" text="WhatsApp inquiries wait hours for response" delay={25} />
      <ProblemPoint icon="📱" text="Social content could be 10x more frequent" delay={40} />
      <ProblemPoint icon="🔄" text="No automated lead follow-up system" delay={55} />
      <ProblemPoint icon="🌙" text="After-hours leads go cold overnight" delay={70} />
      <ProblemPoint icon="📊" text="SEO blog traffic isn't converting to bookings" delay={85} />
    </AbsoluteFill>
  );
};

// SLIDE 4: The Cost of Slow Response
const Slide4: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={44} color={colors.text} delay={0}>
        In Lagos Real Estate...
      </AnimatedText>
      <div style={{ height: 50 }} />
      <AnimatedText size={72} color={colors.danger} delay={25}>
        Speed Wins Deals
      </AnimatedText>
      <div style={{ height: 50 }} />
      <div style={{ display: "flex", gap: 40 }}>
        <StatBox value="78%" label="of leads go to first responder" delay={50} color={colors.warning} />
        <StatBox value="5 min" label="ideal response window" delay={65} color={colors.warning} />
        <StatBox value="₦2M+" label="lost per slow response" delay={80} color={colors.danger} />
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 5: The Scenario
const Slide5: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={36} color={colors.textMuted} delay={0} weight={400}>
        Picture this...
      </AnimatedText>
      <div style={{ height: 30 }} />
      <AnimatedText size={44} color={colors.text} delay={20} maxWidth={1200}>
        A diaspora buyer in London finds your blog post on
      </AnimatedText>
      <div style={{ height: 10 }} />
      <AnimatedText size={44} color={colors.primary} delay={35}>
        "Lekki Phase 1 Property Prices 2026"
      </AnimatedText>
      <div style={{ height: 30 }} />
      <AnimatedText size={40} color={colors.text} delay={55}>
        They message you at 11pm Lagos time.
      </AnimatedText>
      <div style={{ height: 40 }} />
      <AnimatedText size={48} color={colors.danger} delay={80}>
        Your reply comes at 9am.
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={32} color={colors.textMuted} delay={100} weight={400}>
        By then, they've contacted 3 other agencies.
      </AnimatedText>
    </AbsoluteFill>
  );
};

// SLIDE 6: The Solution Intro
const Slide6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={36} color={colors.textMuted} delay={0} weight={400}>
        What if you could respond
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={64} color={colors.success} delay={20}>
        In Under 30 Seconds?
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={36} color={colors.textMuted} delay={45} weight={400}>
        Every inquiry. Every time. Even at 3am.
      </AnimatedText>
      <div style={{ height: 60 }} />
      <div style={{ transform: `scale(${logoScale})`, opacity: logoScale }}>
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: colors.primary,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Eccentric Systems
        </span>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 7: What We Deploy
const Slide7: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 100,
      }}
    >
      <AnimatedText size={48} color={colors.text} delay={0}>
        We Deploy An AI Assistant That:
      </AnimatedText>
      <div style={{ height: 40 }} />
      <SolutionPoint text="Responds to WhatsApp inquiries instantly, 24/7" delay={20} />
      <SolutionPoint text="Qualifies leads — budget, timeline, property type" delay={35} />
      <SolutionPoint text="Books viewings directly into your calendar" delay={50} />
      <SolutionPoint text="Follows up with leads who go quiet" delay={65} />
      <SolutionPoint text="Answers FAQs about pricing, documents, areas" delay={80} />
      <SolutionPoint text="Speaks like your best agent — professional, warm" delay={95} />
    </AbsoluteFill>
  );
};

// SLIDE 8: Before/After Comparison
const Slide8: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={48} color={colors.text} delay={0}>
        The Transformation
      </AnimatedText>
      <div style={{ height: 50 }} />
      <div style={{ width: "100%", maxWidth: 1000 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            padding: "16px 0",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 20, color: colors.textMuted, fontFamily: "Inter" }}></div>
          <div style={{ fontSize: 20, color: colors.danger, fontFamily: "Inter", fontWeight: 600, textAlign: "center" }}>
            TODAY
          </div>
          <div style={{ fontSize: 20, color: colors.success, fontFamily: "Inter", fontWeight: 600, textAlign: "center" }}>
            WITH AI
          </div>
        </div>
        <CompareRow label="Response Time" before="4-6 hours" after="30 seconds" delay={20} />
        <CompareRow label="After-Hours Coverage" before="None" after="24/7" delay={35} />
        <CompareRow label="Lead Follow-Up Rate" before="~40%" after="100%" delay={50} />
        <CompareRow label="Leads Lost to Delay" before="20-30%" after="Near Zero" delay={65} />
        <CompareRow label="Agent Admin Time" before="4 hrs/day" after="30 mins" delay={80} />
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 9: ROI Math
const Slide9: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={44} color={colors.text} delay={0}>
        Let's Do The Math
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={28} color={colors.textMuted} delay={15} weight={400}>
        If KGL gets 50 inquiries per month...
      </AnimatedText>
      <div style={{ height: 40 }} />
      <div style={{ display: "flex", gap: 30 }}>
        <StatBox value="10-15" label="leads currently lost to slow response" delay={30} color={colors.danger} />
        <StatBox value="₦500K-2M" label="average commission per sale" delay={45} color={colors.textMuted} />
      </div>
      <div style={{ height: 40 }} />
      <AnimatedText size={36} color={colors.text} delay={65}>
        Even 2 extra closings per month =
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={72} color={colors.success} delay={85}>
        ₦1M - ₦4M
      </AnimatedText>
      <AnimatedText size={28} color={colors.textMuted} delay={100} weight={400}>
        additional monthly revenue
      </AnimatedText>
    </AbsoluteFill>
  );
};

// SLIDE 10: Specific to KGL
const Slide10: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 100,
      }}
    >
      <AnimatedText size={44} color={colors.primary} delay={0}>
        Built Specifically For KGL
      </AnimatedText>
      <div style={{ height: 40 }} />
      <SolutionPoint text="Trained on Lekki Phase 1 pricing & market data" delay={20} />
      <SolutionPoint text="Knows your property portfolio and availability" delay={35} />
      <SolutionPoint text="Handles UK/Dubai investment questions for diaspora" delay={50} />
      <SolutionPoint text="Explains C of O verification, Governor's Consent" delay={65} />
      <SolutionPoint text="Speaks to HNW buyers the way they expect" delay={80} />
      <div style={{ height: 30 }} />
      <AnimatedText size={28} color={colors.textMuted} delay={100} weight={400}>
        This isn't generic AI. It's YOUR digital agent.
      </AnimatedText>
    </AbsoluteFill>
  );
};

// SLIDE 11: Social Media Bonus
const Slide11: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={44} color={colors.text} delay={0}>
        Plus: Your Content Machine
      </AnimatedText>
      <div style={{ height: 50 }} />
      <div style={{ display: "flex", gap: 30 }}>
        <StatBox value="📸" label="Instagram posts daily" delay={20} color={colors.accent} />
        <StatBox value="📝" label="Property descriptions" delay={35} color={colors.accent} />
        <StatBox value="📧" label="Email newsletters" delay={50} color={colors.accent} />
      </div>
      <div style={{ height: 40 }} />
      <AnimatedText size={32} color={colors.textMuted} delay={70} weight={400} maxWidth={900}>
        Turn your great SEO content into consistent social presence
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={32} color={colors.textMuted} delay={85} weight={400} maxWidth={900}>
        without adding to your team's workload
      </AnimatedText>
    </AbsoluteFill>
  );
};

// SLIDE 12: Call to Action
const Slide12: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.08) * 0.03 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <AnimatedText size={40} color={colors.textMuted} delay={0} weight={400}>
        Ready to never lose a lead again?
      </AnimatedText>
      <div style={{ height: 40 }} />
      <AnimatedText size={56} color={colors.text} delay={20}>
        Let's Talk For 30 Minutes
      </AnimatedText>
      <div style={{ height: 20 }} />
      <AnimatedText size={28} color={colors.textMuted} delay={40} weight={400}>
        No pitch. Just a conversation about your business.
      </AnimatedText>
      <div style={{ height: 50 }} />
      <div
        style={{
          transform: `scale(${pulse})`,
          padding: "24px 60px",
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.warning})`,
          borderRadius: 16,
          fontSize: 32,
          fontWeight: 700,
          color: colors.bg,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <AnimatedText size={32} color={colors.bg} delay={60} weight={700}>
          amanda.hopkins.claw@gmail.com
        </AnimatedText>
      </div>
      <div style={{ height: 40 }} />
      <AnimatedText size={24} color={colors.textMuted} delay={80} weight={400}>
        Amanda Hopkins | Eccentric Systems
      </AnimatedText>
    </AbsoluteFill>
  );
};

// Main composition
export const KGLPitch: React.FC = () => {
  // 12 slides × 5 seconds each = 60 seconds total
  const slideDuration = 150; // 5 sec at 30fps

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Sequence from={0} durationInFrames={slideDuration}><Slide1 /></Sequence>
      <Sequence from={slideDuration * 1} durationInFrames={slideDuration}><Slide2 /></Sequence>
      <Sequence from={slideDuration * 2} durationInFrames={slideDuration}><Slide3 /></Sequence>
      <Sequence from={slideDuration * 3} durationInFrames={slideDuration}><Slide4 /></Sequence>
      <Sequence from={slideDuration * 4} durationInFrames={slideDuration}><Slide5 /></Sequence>
      <Sequence from={slideDuration * 5} durationInFrames={slideDuration}><Slide6 /></Sequence>
      <Sequence from={slideDuration * 6} durationInFrames={slideDuration}><Slide7 /></Sequence>
      <Sequence from={slideDuration * 7} durationInFrames={slideDuration}><Slide8 /></Sequence>
      <Sequence from={slideDuration * 8} durationInFrames={slideDuration}><Slide9 /></Sequence>
      <Sequence from={slideDuration * 9} durationInFrames={slideDuration}><Slide10 /></Sequence>
      <Sequence from={slideDuration * 10} durationInFrames={slideDuration}><Slide11 /></Sequence>
      <Sequence from={slideDuration * 11} durationInFrames={slideDuration}><Slide12 /></Sequence>
    </AbsoluteFill>
  );
};
