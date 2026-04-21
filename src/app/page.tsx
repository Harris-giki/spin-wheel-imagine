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
  // Modal auto-opens when a spin resolves; closing it keeps the user on the
  // main (wheel) screen with a persistent win banner rather than signing out.
  const [resultModalOpen, setResultModalOpen] = useState(false);
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
      setAlreadySpun(true);
      setResultModalOpen(true);
      setStage("result");
    } catch {
      setErrorModal("NETWORK");
      setStage("ready");
    }
  }

  function closeResultModal() {
    setResultModalOpen(false);
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-x-hidden">
      <TopBar />

      <div className="flex-1 flex items-start md:items-center justify-center px-4 py-6 sm:py-10 relative z-10">
        <AnimatePresence mode="wait">
          {stage === "email" && (
            <motion.div
              key="email"
              className="w-full max-w-[520px]"
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
              className="w-full max-w-[980px] flex flex-col gap-5"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              {stage === "result" && result && !resultModalOpen && (
                <WinBanner
                  result={result}
                  email={email}
                  onReopen={() => setResultModalOpen(true)}
                />
              )}
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
        {stage === "result" && result && resultModalOpen && (
          <ResultModal result={result} email={email} onClose={closeResultModal} />
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
          className="block dark:hidden h-7 sm:h-8 w-auto"
        />
        <Image
          src="/Layer_1.png"
          alt="ImagineArt"
          width={180}
          height={36}
          priority
          className="hidden dark:block h-7 sm:h-8 w-auto"
        />
      </a>
      <div className="flex items-center gap-3">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-900/5 dark:bg-white/[0.06] border border-ink-100 dark:border-white/10 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700/80 dark:text-white/80">
          <Sparkle className="h-3 w-3 text-lilac-500 dark:text-lilac-300" />
          Spin &amp; Win
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-5 py-6 text-center text-[11px] text-ink-700/55 dark:text-white/45 tracking-wide">
      1 spin per account · Codes valid 48h · Questions? @ImagineArt
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

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

function WinBanner({
  result,
  email,
  onReopen,
}: {
  result: SpinResult;
  email: string;
  onReopen: () => void;
}) {
  if (result.kind === "consolation_luck") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-900/5 dark:bg-white/[0.06] border border-ink-100 dark:border-white/10 text-[9.5px] font-bold tracking-[0.24em] uppercase text-ink-700/75 dark:text-white/75 mb-2">
              Better luck next time
            </div>
            <h3 className="font-display text-[22px] sm:text-[26px] font-bold text-ink-900 dark:text-white tracking-[-0.02em] leading-tight">
              {result.title}
            </h3>
            <p className="text-ink-700/70 dark:text-white/65 text-[12.5px] mt-1 truncate">
              {result.subtitle} · <span className="font-medium text-ink-900/85 dark:text-white/85">{email}</span>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href="https://instagram.com/imagineart"
              target="_blank"
              rel="noreferrer"
              className="btn-gradient rounded-[12px] text-white font-bold tracking-wide px-4 py-2.5 text-[12.5px] text-center whitespace-nowrap"
            >
              Follow on Instagram
            </a>
            <button
              onClick={onReopen}
              className="rounded-[12px] border border-ink-200 dark:border-white/15 text-ink-900 dark:text-white font-semibold tracking-wide px-4 py-2.5 text-[12.5px] hover:bg-ink-50 dark:hover:bg-white/[0.06] transition"
            >
              Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const isCredits =
    result.kind === "consolation_credits" ||
    (result.kind === "prize" && result.category === "credits");
  const tag =
    result.kind === "consolation_credits" ? "Consolation win" : "You won";
  const code = result.code;
  const link = result.redemptionLink;
  const ctaLabel = isCredits ? "Access credits form →" : "Redeem discount →";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-5 sm:p-6 overflow-hidden"
    >
      <div className="glow-behind" />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Prize + email */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lilac-gradient text-white text-[9.5px] font-bold tracking-[0.26em] uppercase mb-2 shadow-glow">
            <Sparkle className="h-2.5 w-2.5" />
            {tag}
          </div>
          <h3 className="font-display text-[24px] sm:text-[28px] font-bold leading-[1] tracking-[-0.02em]">
            <span className="bg-lilac-gradient bg-clip-text text-transparent">{result.title}</span>
          </h3>
          <p className="text-ink-700/70 dark:text-white/65 text-[12.5px] mt-1.5 truncate">
            {result.subtitle} · <span className="font-semibold text-ink-900 dark:text-white">{email}</span>
          </p>
        </div>

        {/* Code box */}
        <div className="shrink-0 rounded-[14px] border border-dashed border-lilac-300/70 dark:border-lilac-400/50 bg-lilac-50/60 dark:bg-lilac-400/[0.06] px-4 py-2.5 min-w-[160px] text-center">
          <div className="text-[9px] uppercase tracking-[0.24em] text-ink-700/60 dark:text-white/55 mb-0.5 font-bold">
            {isCredits ? "Reference" : "Promo code"}
          </div>
          <div className="font-display font-bold text-[15px] tracking-[0.06em] select-all text-ink-900 dark:text-white break-all">
            {code}
          </div>
          <div className="text-[9.5px] text-ink-700/55 dark:text-white/45 mt-1.5 leading-snug">
            Codes are valid for 48 hours after redemption.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="btn-gradient rounded-[12px] text-white font-bold tracking-wide px-4 py-2.5 text-[12.5px] text-center whitespace-nowrap"
            >
              {ctaLabel}
            </a>
          )}
          <button
            onClick={onReopen}
            className="rounded-[12px] border border-ink-200 dark:border-white/15 text-ink-900 dark:text-white font-semibold tracking-wide px-4 py-2.5 text-[12.5px] hover:bg-ink-50 dark:hover:bg-white/[0.06] transition whitespace-nowrap"
          >
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

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
    <div className="glass-card p-7 sm:p-9">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lilac-gradient text-white text-[9.5px] font-bold tracking-[0.26em] uppercase mb-6 shadow-glow">
        <Sparkle className="h-2.5 w-2.5" />
        World Creativity &amp; Innovation Day
      </div>

      <h1 className="font-display text-[40px] sm:text-[48px] leading-[0.98] font-bold text-ink-900 dark:text-white tracking-[-0.035em]">
        Spin once.
        <br />
        <span className="bg-lilac-gradient bg-clip-text text-transparent">
          Win Upto 70% OFF
          <br />
          on Yearly Plans
        </span>
      </h1>
      <p className="text-ink-700/75 dark:text-white/70 text-[14.5px] leading-relaxed mt-4 mb-7 max-w-[380px]">
        Enter the email tied to your ImagineArt account to claim your one-time spin.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col">
        <label className="block text-[9.5px] uppercase tracking-[0.24em] font-semibold text-ink-700/55 dark:text-white/55 mb-2">
          Account email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[14px] bg-ink-50 dark:bg-white/[0.04] border border-ink-100 dark:border-white/10 focus:border-lilac-500 dark:focus:border-lilac-400 focus:bg-white dark:focus:bg-white/[0.07] text-ink-900 dark:text-white placeholder:text-ink-700/35 dark:placeholder:text-white/30 px-[18px] py-4 text-[15px] transition"
        />

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="btn-gradient rounded-[14px] text-white font-bold tracking-wide px-4 py-4 text-[13.5px] transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? "Checking…" : "Continue →"}
        </button>
      </form>

      <p className="text-[11px] text-ink-700/50 dark:text-white/45 text-center mt-5 leading-relaxed">
        1 spin per account · Codes valid 48h
      </p>
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
    <div className="glass-card p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lilac-gradient text-white text-[9.5px] font-bold tracking-[0.26em] uppercase mb-3 shadow-glow">
          <Sparkle className="h-2.5 w-2.5" />
          {alreadySpun ? "Already spun" : "World Creativity & Innovation Day"}
        </div>
        <h2 className="font-display text-[28px] sm:text-[34px] leading-[1.02] font-bold text-ink-900 dark:text-white tracking-[-0.03em]">
          {alreadySpun ? (
            "You've already spun."
          ) : spinning ? (
            "Good luck…"
          ) : (
            <>
              Win Upto 70% OFF
              <br />
              <span className="bg-lilac-gradient bg-clip-text text-transparent">
                on Yearly Plans
              </span>
            </>
          )}
        </h2>
        <p className="text-ink-700/70 dark:text-white/65 text-[13.5px] mt-2">
          {alreadySpun
            ? "Here's the prize we saved for you."
            : spinning
            ? "Picking your prize from 500 slots."
            : "One spin only. Make it count."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Left: wheel + CTA */}
        <div className="flex flex-col items-center">
          <Wheel ref={wheelRef} size={320} disabled={done || spinning} />

          <div className="mt-7 flex flex-col items-center gap-2.5 w-full max-w-[320px]">
            <button
              onClick={onSpin}
              disabled={spinning || done}
              className="btn-gradient w-full rounded-[14px] text-white font-bold tracking-[0.18em] uppercase py-3.5 text-[12px] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {spinning ? "Spinning…" : done ? "Spin used" : "Spin now"}
            </button>
            <p className="text-[11px] text-ink-700/55 dark:text-white/55 tracking-wide">
              <span className="font-medium text-ink-900/80 dark:text-white/85">{email}</span> ·{" "}
              {done ? "0 spins left" : "1 spin remaining"}
            </p>
          </div>
        </div>

        {/* Right: prize pool */}
        <PrizeLegend wonPrizeKey={wonPrizeKey} />
      </div>
    </div>
  );
}

function PrizeLegend({ wonPrizeKey }: { wonPrizeKey: string | null }) {
  return (
    <div className="rounded-[18px] bg-ink-50/60 dark:bg-white/[0.03] border border-ink-100 dark:border-white/[0.07] p-4 sm:p-5 max-h-[520px] md:max-h-[560px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-[14px] font-bold text-ink-900 dark:text-white tracking-tight">
          Prize pool
        </h3>
        <span className="text-[9px] uppercase tracking-[0.22em] text-ink-700/55 dark:text-white/55 font-semibold">
          15 rewards
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {PRIZES.map((p, i) => {
          const highlight = wonPrizeKey === p.key;
          const number = i + 1;
          return (
            <div
              key={p.key}
              className={
                "flex items-center gap-2 rounded-[10px] px-2.5 py-2 border transition " +
                (highlight
                  ? "bg-lilac-gradient border-transparent shadow-glow animate-pop-in"
                  : "bg-white/60 dark:bg-white/[0.02] border-ink-100 dark:border-white/[0.04] hover:bg-white dark:hover:bg-white/[0.05]")
              }
            >
              <span
                className="w-[22px] h-[22px] rounded-md shrink-0 grid place-items-center text-[10px] font-bold font-display"
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
                    "text-[11.5px] font-bold leading-tight truncate " +
                    (highlight ? "text-white" : "text-ink-900 dark:text-white")
                  }
                >
                  {p.title}
                </div>
                <div
                  className={
                    "text-[10px] leading-tight truncate " +
                    (highlight ? "text-white/85" : "text-ink-700/60 dark:text-white/55")
                  }
                >
                  {p.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Modals                                                                     */
/* -------------------------------------------------------------------------- */

function ModalShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-ink-900/60 dark:bg-black/70 backdrop-blur-md" />
      <motion.div
        className={
          "glass-card relative w-full p-6 sm:p-8 overflow-hidden " +
          (wide ? "max-w-[480px]" : "max-w-[440px]")
        }
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
      >
        <div className="glow-behind" />
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
        <div className="w-[54px] h-[54px] mx-auto mb-4 rounded-full grid place-items-center text-[26px] font-bold text-[#4a0f06]" style={{ background: "linear-gradient(135deg, #ffb4a3, #ff8066)" }}>
          !
        </div>
        <h3 className="font-display text-[24px] font-bold mb-2 text-ink-900 dark:text-white tracking-[-0.02em]">
          {title}
        </h3>
        <p className="text-ink-700/75 dark:text-white/65 text-[13.5px] leading-relaxed mb-5">{body}</p>
        <button
          onClick={onPrimary}
          className="btn-gradient w-full rounded-[14px] text-white font-bold tracking-wide py-3.5 text-[13px]"
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
  // Credits winners go through a 2-step flow: first they screenshot, then
  // we reveal the link to the claim form. Discount winners don't need this.
  const [confirmed, setConfirmed] = useState(false);
  if (result.kind === "consolation_luck") {
    return (
      <ModalShell>
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-900/5 dark:bg-white/[0.06] border border-ink-100 dark:border-white/10 text-[9.5px] font-bold tracking-[0.26em] uppercase text-ink-700/75 dark:text-white/75 mb-5">
            Better luck next time
          </div>
          <h3 className="font-display text-[28px] sm:text-[32px] font-bold mb-3 text-ink-900 dark:text-white tracking-[-0.025em] leading-[1.05]">
            All rewards have<br />
            <span className="bg-lilac-gradient bg-clip-text text-transparent">been claimed.</span>
          </h3>
          <p className="text-ink-700/70 dark:text-white/65 text-[13.5px] leading-relaxed mb-5 max-w-[340px] mx-auto">
            {result.subtitle}
          </p>
          <div className="rounded-[12px] bg-ink-50/70 dark:bg-white/[0.04] border border-ink-100 dark:border-white/10 px-3 py-2 text-[11.5px] text-ink-700/70 dark:text-white/65 mb-5">
            Registered to <span className="font-semibold text-ink-900 dark:text-white">{email}</span>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://instagram.com/imagineart"
              target="_blank"
              rel="noreferrer"
              className="btn-gradient w-full rounded-[14px] text-white font-bold tracking-wide py-3.5 text-[13px]"
            >
              Follow on Instagram
            </a>
            <button
              onClick={onClose}
              className="w-full rounded-[14px] border border-ink-200 dark:border-white/15 text-ink-900 dark:text-white font-semibold tracking-wide py-3 text-[13px] hover:bg-ink-50 dark:hover:bg-white/[0.06] transition"
            >
              Back to wheel
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
    result.kind === "consolation_credits" ? "Consolation win" : "Congrats, you won";
  const code = result.code;
  const link = result.redemptionLink;

  return (
    <ModalShell>
      <div>
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lilac-gradient text-white text-[9.5px] font-bold tracking-[0.26em] uppercase mb-4 shadow-glow">
            <Sparkle className="h-2.5 w-2.5" />
            {tag}
          </div>
          <h3 className="font-display text-[56px] sm:text-[64px] font-bold leading-[0.9] tracking-[-0.04em]">
            <span className="bg-lilac-gradient bg-clip-text text-transparent">{result.title}</span>
          </h3>
          <p className="text-ink-700/70 dark:text-white/70 text-[14.5px] mt-3">{result.subtitle}</p>

          <div className="mt-5 inline-block px-5 py-3 rounded-[14px] border border-dashed border-lilac-300/70 dark:border-lilac-400/50 bg-lilac-50/60 dark:bg-lilac-400/[0.06]">
            <div className="text-[9px] uppercase tracking-[0.26em] text-ink-700/55 dark:text-white/55 font-bold mb-0.5">
              {isCredits ? "Reference code" : "Promo code"}
            </div>
            <div className="font-display font-bold text-[20px] tracking-[0.08em] select-all text-ink-900 dark:text-white break-all">
              {code}
            </div>
            <div className="text-[10px] text-ink-700/55 dark:text-white/45 mt-2">
              Codes are valid for 48 hours after redemption.
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2 text-ink-700/60 dark:text-white/55">
            How to claim
          </div>
          {isCredits ? (
            <ol className="text-[13px] leading-[1.65] list-decimal pl-5 space-y-1 text-ink-700/80 dark:text-white/70">
              <li>
                <strong className="text-ink-900 dark:text-white">Screenshot this entire card</strong>{" "}
                — your email &amp; code must both be visible.
              </li>
              <li>
                Open the claim form and submit your code with the email{" "}
                <strong className="text-ink-900 dark:text-white">{email}</strong>.
              </li>
              <li>We credit your balance within 24 hours.</li>
            </ol>
          ) : (
            <ol className="text-[13px] leading-[1.65] list-decimal pl-5 space-y-1 text-ink-700/80 dark:text-white/70">
              <li>
                Tap <strong className="text-ink-900 dark:text-white">Redeem discount</strong> — the
                code is pre-applied on the plan page.
              </li>
              <li>
                Checkout using <strong className="text-ink-900 dark:text-white">{email}</strong> to
                lock in the reward.
              </li>
            </ol>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isCredits && !confirmed ? (
            <motion.div
              key="screenshot-step"
              className="flex flex-col gap-2 mt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setConfirmed(true)}
                className="btn-gradient w-full rounded-[14px] text-white font-bold tracking-wide py-3.5 text-[13px]"
              >
                I&apos;ve screenshotted it →
              </button>
              <p className="text-[11px] text-center text-ink-700/55 dark:text-white/50">
                Save a shot of this card before continuing — you&apos;ll need the code &amp; email to
                claim.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="link-step"
              className="flex gap-2 mt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gradient flex-1 rounded-[14px] text-white font-bold tracking-wide py-3.5 text-[13px] text-center"
                >
                  {isCredits ? "Access claim form →" : "Redeem discount →"}
                </a>
              )}
              <button
                onClick={onClose}
                className="rounded-[14px] border border-ink-200 dark:border-white/15 text-ink-900 dark:text-white font-semibold tracking-wide px-5 py-3.5 text-[13px] hover:bg-ink-50 dark:hover:bg-white/[0.06] transition"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 text-center text-[11px] text-ink-700/50 dark:text-white/45 tracking-wide">
          Registered to <strong className="text-ink-900 dark:text-white font-semibold">{email}</strong>
        </div>
      </div>
    </ModalShell>
  );
}
