"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Wheel, type WheelHandle } from "@/components/Wheel";
import { PRIZES } from "@/lib/prizes";
import { ThemeToggle } from "@/components/ThemeProvider";

type Stage = "email" | "ready" | "spinning" | "result";

type SpinResult =
  | {
      kind: "prize";
      prizeKey: string;
      title: string;
      subtitle: string;
      category: string;
      code: string;
      redemptionLink: string;
      codeExpiresAt: string;
    }
  | {
      kind: "consolation_credits";
      title: string;
      subtitle: string;
      code: string;
      redemptionLink: string;
      codeExpiresAt: string;
    }
  | {
      kind: "consolation_luck";
      title: string;
      subtitle: string;
    };

export default function HomePage() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<null | "INVALID_EMAIL" | "NETWORK">(null);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const wheelRef = useRef<WheelHandle>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 400) {
        setErrorModal("INVALID_EMAIL");
        return;
      }
      if (!res.ok) {
        setErrorModal("NETWORK");
        return;
      }
      const data = (await res.json()) as { ok: boolean; alreadySpun: boolean };
      setAlreadySpun(data.alreadySpun);
      setStage("ready");
    } catch {
      setErrorModal("NETWORK");
    } finally {
      setLoading(false);
    }
  }

  async function handleSpin() {
    if (stage !== "ready") return;
    setStage("spinning");
    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setErrorModal("NETWORK");
        setStage("ready");
        return;
      }
      const data = (await res.json()) as { ok: boolean; result: SpinResult };
      const landOn = data.result.kind === "prize" ? data.result.prizeKey : null;
      await wheelRef.current?.spinTo(landOn);
      setResult(data.result);
      setStage("result");
    } catch {
      setErrorModal("NETWORK");
      setStage("ready");
    }
  }

  function reset() {
    setStage("email");
    setEmail("");
    setAlreadySpun(false);
    setResult(null);
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-x-hidden">
      <BackgroundSparkles />
      <TopBar />

      <div className="flex-1 flex items-start md:items-center justify-center px-4 py-6 sm:py-10 relative z-10">
        <AnimatePresence mode="wait">
          {stage === "email" && (
            <motion.div
              key="email"
              className="w-full max-w-[460px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <EmailCard
                email={email}
                setEmail={setEmail}
                onSubmit={handleVerify}
                loading={loading}
              />
            </motion.div>
          )}

          {(stage === "ready" || stage === "spinning" || stage === "result") && (
            <motion.div
              key="wheel"
              className="w-full max-w-[980px]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <WheelCard
                wheelRef={wheelRef}
                email={email}
                alreadySpun={alreadySpun}
                stage={stage}
                onSpin={handleSpin}
                wonPrizeKey={result && result.kind === "prize" ? result.prizeKey : null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      <AnimatePresence>
        {errorModal === "INVALID_EMAIL" && (
          <GenericModal
            title="That email doesn't look right"
            body="Please enter a valid email address and try again."
            primaryLabel="OK"
            onPrimary={() => setErrorModal(null)}
          />
        )}
        {errorModal === "NETWORK" && (
          <GenericModal
            title="Something went wrong"
            body="We couldn't reach the server. Please check your connection and try again."
            primaryLabel="Try again"
            onPrimary={() => setErrorModal(null)}
          />
        )}
        {stage === "result" && result && (
          <ResultModal result={result} email={email} onClose={reset} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Chrome                                                                     */
/* -------------------------------------------------------------------------- */

function TopBar() {
  return (
    <header className="relative z-20 px-5 sm:px-8 py-5 flex items-center justify-between max-w-[1200px] mx-auto w-full gap-3">
      <a href="https://www.imagine.art" target="_blank" rel="noreferrer" className="flex items-center">
        <Image
          src="/logo-txt.png"
          alt="ImagineArt"
          width={180}
          height={36}
          priority
          className="block dark:hidden h-8 sm:h-9 w-auto"
        />
        <Image
          src="/Layer_1.png"
          alt="ImagineArt"
          width={180}
          height={36}
          priority
          className="hidden dark:block h-8 sm:h-9 w-auto"
        />
      </a>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-700/80 dark:text-white/70">
          <Sparkle className="h-3.5 w-3.5 text-lilac-500 dark:text-lilac-300" />
          Spin &amp; Win
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-5 py-6 text-center text-[11px] text-ink-700/55 dark:text-white/40 tracking-wide">
      1 spin per account · Codes valid 48h · DM @ImagineArt to redeem
    </footer>
  );
}

function Sparkle({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
}

function BackgroundSparkles() {
  const positions = [
    { top: "12%", left: "8%", size: 18, delay: "0s" },
    { top: "22%", right: "10%", size: 14, delay: "1.1s" },
    { top: "68%", left: "6%", size: 22, delay: "0.6s" },
    { top: "78%", right: "12%", size: 16, delay: "1.8s" },
    { top: "40%", right: "4%", size: 10, delay: "2.4s" },
    { top: "55%", left: "3%", size: 10, delay: "0.9s" },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {positions.map((p, i) => (
        <Sparkle
          key={i}
          className="spark text-lilac-400 animate-sparkle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            right: p.right,
            animationDelay: p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

function EmailCard({
  email,
  setEmail,
  onSubmit,
  loading,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <div className="relative">
      <div className="aurora rounded-[36px]" />
      <div className="relative rounded-[32px] bg-white dark:bg-[#140a35]/80 dark:backdrop-blur-xl border border-ink-100 dark:border-white/10 shadow-card-lg p-7 sm:p-8 grain">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] px-3 py-1.5 rounded-full bg-ink-900 dark:bg-white/10 text-white mb-5">
          <Sparkle className="h-3 w-3 text-lilac-300" />
          WORLD CREATIVITY &amp; INNOVATION DAY
        </div>
        <h1 className="font-display text-[36px] sm:text-[42px] leading-[1.02] font-bold text-ink-900 dark:text-white mb-3 tracking-tight">
          Spin &amp; Win
          <br />
          <span className="bg-lilac-gradient bg-clip-text text-transparent">
            Exclusive Rewards.
          </span>
        </h1>
        <p className="text-ink-700/75 dark:text-white/70 text-[14.5px] leading-relaxed mb-6">
          Enter your registered email to unlock your one-time spin.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="relative block">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl bg-ink-50 dark:bg-white/5 border border-ink-100 dark:border-white/10 focus:border-lilac-500 dark:focus:border-lilac-400 focus:bg-white dark:focus:bg-white/10 text-ink-900 dark:text-white placeholder:text-ink-700/35 dark:placeholder:text-white/30 px-4 py-3.5 text-[15px] transition"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="group relative rounded-2xl bg-brand-gradient text-white font-semibold tracking-wide px-4 py-3.5 text-[15px] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
          >
            {loading ? "Checking…" : "Continue →"}
          </button>
        </form>

        <p className="text-[11px] text-ink-700/50 dark:text-white/45 text-center mt-5 leading-relaxed">
          By continuing you agree to the campaign T&amp;Cs.
          <br />
          Limit: <span className="font-semibold text-ink-900 dark:text-white">1 spin per account</span>.
        </p>
      </div>
    </div>
  );
}

function WheelCard({
  wheelRef,
  email,
  alreadySpun,
  stage,
  onSpin,
  wonPrizeKey,
}: {
  wheelRef: React.RefObject<WheelHandle>;
  email: string;
  alreadySpun: boolean;
  stage: Stage;
  onSpin: () => void;
  wonPrizeKey: string | null;
}) {
  const spinning = stage === "spinning";
  const done = stage === "result" || alreadySpun;

  return (
    <div className="relative">
      <div className="aurora rounded-[36px]" />
      <div className="relative rounded-[32px] bg-white dark:bg-[#140a35]/80 dark:backdrop-blur-xl border border-ink-100 dark:border-white/10 shadow-card-lg p-6 sm:p-8 grain">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] px-3 py-1.5 rounded-full bg-lilac-gradient text-white mb-3 shadow-glow">
            <Sparkle className="h-3 w-3" />
            {alreadySpun ? "ALREADY SPUN" : "WORLD CREATIVITY & INNOVATION DAY"}
          </div>
          <h2 className="font-display text-[28px] sm:text-[32px] leading-tight font-bold text-ink-900 dark:text-white tracking-tight">
            {alreadySpun
              ? "You've already spun."
              : spinning
              ? "Good luck…"
              : "Tap to spin"}
          </h2>
          <p className="text-ink-700/70 dark:text-white/65 text-[13.5px] mt-1">
            {alreadySpun
              ? "Here's the prize we saved for you."
              : spinning
              ? "Hold tight while we pick your prize."
              : "One spin only. Make it count."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-6 md:gap-8 items-start">
          {/* Left: wheel + CTA */}
          <div className="flex flex-col items-center">
            <div className="py-2">
              <Wheel ref={wheelRef} size={340} disabled={done || spinning} />
            </div>

            <div className="mt-7 flex flex-col items-center gap-2 w-full max-w-[360px]">
              <button
                onClick={onSpin}
                disabled={spinning || done}
                className="w-full rounded-2xl bg-brand-gradient text-white font-bold tracking-wider uppercase py-4 text-[14px] transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-glow"
              >
                {spinning ? "Spinning…" : done ? "Spin used" : "Spin Now"}
              </button>
              <p className="text-[11.5px] text-ink-700/55 dark:text-white/55 mt-1">
                <span className="font-medium text-ink-900/80 dark:text-white/85">{email}</span> ·{" "}
                {done ? "0 spins left" : "1 spin remaining"}
              </p>
            </div>
          </div>

          {/* Right: prize legend */}
          <PrizeLegend wonPrizeKey={wonPrizeKey} />
        </div>
      </div>
    </div>
  );
}

function PrizeLegend({ wonPrizeKey }: { wonPrizeKey: string | null }) {
  const groups: { title: string; prizes: typeof PRIZES }[] = [
    { title: "Grand Prizes", prizes: PRIZES.filter((p) => p.category === "creator") },
    { title: "Ultimate Rewards", prizes: PRIZES.filter((p) => p.category === "ultimate") },
    { title: "Standard Deals", prizes: PRIZES.filter((p) => p.category === "standard") },
    { title: "Credit Packs", prizes: PRIZES.filter((p) => p.category === "credits") },
  ];

  return (
    <div className="rounded-2xl bg-ink-50/60 dark:bg-white/5 border border-ink-100 dark:border-white/10 p-4 sm:p-5 max-h-[520px] md:max-h-[560px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-[15px] font-bold text-ink-900 dark:text-white tracking-tight">
          Prize Pool
        </h3>
        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-700/55 dark:text-white/55 font-semibold">
          15 Rewards
        </span>
      </div>

      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-700/60 dark:text-white/55 font-bold mb-1.5 px-1">
              {g.title}
            </div>
            <ul className="space-y-1">
              {g.prizes.map((p) => {
                const highlight = wonPrizeKey === p.key;
                const number = PRIZES.findIndex((x) => x.key === p.key) + 1;
                return (
                  <li
                    key={p.key}
                    className={
                      "flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition " +
                      (highlight
                        ? "bg-lilac-gradient shadow-glow animate-pop-in"
                        : "hover:bg-white dark:hover:bg-white/10")
                    }
                  >
                    <span
                      className={
                        "w-6 h-6 rounded-md shrink-0 grid place-items-center text-[10px] font-bold " +
                        (highlight
                          ? "ring-2 ring-white/70"
                          : "ring-1 ring-ink-100 dark:ring-white/15")
                      }
                      style={{
                        background: p.color,
                        color: p.textColor,
                      }}
                    >
                      {number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={
                          "text-[13px] font-bold leading-tight truncate " +
                          (highlight ? "text-white" : "text-ink-900 dark:text-white")
                        }
                      >
                        {p.title}
                      </div>
                      <div
                        className={
                          "text-[11px] leading-tight truncate " +
                          (highlight ? "text-white/85" : "text-ink-700/65 dark:text-white/60")
                        }
                      >
                        {p.subtitle}
                      </div>
                    </div>
                    {highlight && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white shrink-0 pr-1">
                        Won
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Modals                                                                     */
/* -------------------------------------------------------------------------- */

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-ink-900/60 dark:bg-black/70 backdrop-blur-md" />
      <motion.div
        className="relative w-full max-w-[440px] rounded-[28px] bg-white dark:bg-[#140a35]/95 dark:backdrop-blur-xl border border-ink-100 dark:border-white/10 shadow-card-lg p-6 sm:p-7 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
      >
        <div className="aurora rounded-[28px]" />
        <div className="relative">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function GenericModal({
  title,
  body,
  primaryLabel,
  onPrimary,
}: {
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary: () => void;
}) {
  return (
    <ModalShell>
      <div className="text-center">
        <h3 className="font-display text-[26px] font-bold mb-2 text-ink-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-ink-700/75 dark:text-white/70 text-[14px] leading-relaxed mb-5">{body}</p>
        <button
          onClick={onPrimary}
          className="w-full rounded-2xl bg-brand-gradient text-white font-semibold tracking-wide py-3 text-[14px] shadow-glow"
        >
          {primaryLabel}
        </button>
      </div>
    </ModalShell>
  );
}

function ResultModal({
  result,
  email,
  onClose,
}: {
  result: SpinResult;
  email: string;
  onClose: () => void;
}) {
  if (result.kind === "consolation_luck") {
    return (
      <ModalShell>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] px-3 py-1.5 rounded-full bg-ink-900 dark:bg-white/10 text-white mb-4">
            BETTER LUCK NEXT TIME
          </div>
          <h3 className="font-display text-[26px] font-bold mb-2 text-ink-900 dark:text-white tracking-tight">
            {result.title}
          </h3>
          <p className="text-ink-700/75 dark:text-white/70 text-[14px] leading-relaxed mb-5">
            {result.subtitle}
          </p>
          <div className="rounded-xl bg-ink-50/70 dark:bg-white/5 border border-ink-100 dark:border-white/10 px-3 py-2 text-[12px] text-ink-700/70 dark:text-white/65 mb-4">
            Registered to <span className="font-semibold text-ink-900 dark:text-white">{email}</span>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://instagram.com/imagineart"
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-2xl bg-brand-gradient text-white font-semibold tracking-wide py-3 text-[14px] shadow-glow"
            >
              Follow on Instagram
            </a>
            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-ink-200 dark:border-white/15 text-ink-900 dark:text-white font-semibold tracking-wide py-3 text-[14px] hover:bg-ink-50 dark:hover:bg-white/10 transition"
            >
              Close
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  const isCredits =
    result.kind === "consolation_credits" ||
    (result.kind === "prize" && result.category === "credits");
  const tag =
    result.kind === "consolation_credits" ? "CONSOLATION WIN" : "CONGRATS, YOU WON!";
  const code = result.code;
  const expires = new Date(result.codeExpiresAt);
  const link = result.redemptionLink;

  return (
    <ModalShell>
      <div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] px-3 py-1.5 rounded-full bg-lilac-gradient text-white mb-3 shadow-glow">
            <Sparkle className="h-3 w-3" />
            {tag}
          </div>
          <h3 className="font-display text-[38px] font-bold leading-tight mb-1 tracking-tight">
            <span className="bg-lilac-gradient bg-clip-text text-transparent">{result.title}</span>
          </h3>
          <p className="text-ink-700/70 dark:text-white/65 text-[13.5px] mb-3">{result.subtitle}</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-ink-50/70 dark:bg-white/5 border border-ink-100 dark:border-white/10 px-3 py-1.5 text-[11.5px] text-ink-700/70 dark:text-white/65 mb-4">
            <span className="uppercase tracking-[0.18em] text-[10px] font-bold text-ink-700/55 dark:text-white/55">
              Winner
            </span>
            <span className="font-semibold text-ink-900 dark:text-white truncate max-w-[240px]">
              {email}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-ink-300 dark:border-white/20 bg-ink-50/70 dark:bg-white/5 p-4 mb-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-700/60 dark:text-white/55 mb-1">
            {isCredits ? "Your reference code" : "Your promo code"}
          </div>
          <div className="font-display font-bold text-xl tracking-wider select-all text-ink-900 dark:text-white break-all">
            {code}
          </div>
          <div className="text-[11px] text-ink-700/55 dark:text-white/50 mt-1">
            Valid until {expires.toLocaleString()}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-[0.18em] font-bold mb-2 text-ink-900 dark:text-white">
            How to claim
          </div>
          {isCredits ? (
            <ol className="text-[13.5px] leading-relaxed list-decimal pl-5 space-y-1 text-ink-700/80 dark:text-white/70">
              <li>
                <strong className="text-ink-900 dark:text-white">Screenshot this entire card</strong>{" "}
                — your email &amp; code must both be visible.
              </li>
              <li>
                Open the claim form below and submit your code along with the email{" "}
                <strong className="text-ink-900 dark:text-white">{email}</strong>.
              </li>
              <li>Our team credits your balance within 24 hours.</li>
            </ol>
          ) : (
            <ol className="text-[13.5px] leading-relaxed list-decimal pl-5 space-y-1 text-ink-700/80 dark:text-white/70">
              <li>
                Tap <strong className="text-ink-900 dark:text-white">Redeem my discount</strong> —
                your promo code is pre-applied on the plan page.
              </li>
              <li>
                Complete checkout using{" "}
                <strong className="text-ink-900 dark:text-white">{email}</strong> to lock in the
                reward.
              </li>
            </ol>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-2xl bg-brand-gradient text-white font-semibold tracking-wide py-3 text-[14px] shadow-glow text-center"
            >
              {isCredits ? "Open credits claim form" : "Redeem my discount"}
            </a>
          )}
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-ink-200 dark:border-white/15 text-ink-900 dark:text-white font-semibold tracking-wide py-3 text-[14px] hover:bg-ink-50 dark:hover:bg-white/10 transition"
          >
            {isCredits ? "I've screenshotted it" : "Close"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
