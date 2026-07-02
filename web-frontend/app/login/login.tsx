//path : web-frontend/app/login/login.tsx
"use client"
import { useState, useEffect, useRef } from "react";
import BASE_URL from "../lib/api";
const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

const VIEWBOX = "0 0 210 130";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function UserIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function LockIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="3" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SpinnerIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function CheckIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7">
        <animate attributeName="stroke-dasharray" from="0 30" to="30 0" dur="0.4s" fill="freeze" />
      </path>
    </svg>
  );
}

export default function NammaByndoorLogin() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Phase: "idle" | "drawing" | "filling" | "form" | "loading" | "success" | "error"
  const [phase, setPhase] = useState("idle");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pathLength, setPathLength] = useState(0);
  const [drawProgress, setDrawProgress] = useState(0);
  const [fillOpacity, setFillOpacity] = useState(0);
  const [glowOpacity, setGlowOpacity] = useState(0);
  const [formOpacity, setFormOpacity] = useState(0);
  const [formY, setFormY] = useState(18);
  const [pageOpacity, setPageOpacity] = useState(0);
  const [mapScale, setMapScale] = useState(reduced ? 1 : 0.92);
  const [successScale, setSuccessScale] = useState(1);
  const [successOpacity, setSuccessOpacity] = useState(1);
  const [btnState, setBtnState] = useState("idle"); // idle | loading | success
  const pathRef = useRef(null);
  const usernameRef = useRef(null);

  // Measure path length
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, []);

  // Boot animation sequence
  useEffect(() => {
    if (pathLength === 0) return;
    if (reduced) {
      setPageOpacity(1);
      setMapScale(1);
      setDrawProgress(1);
      setFillOpacity(1);
      setGlowOpacity(0.7);
      setFormOpacity(1);
      setFormY(0);
      setPhase("form");
      return;
    }

    let raf;
    const timeline = [
      { delay: 80, fn: () => setPageOpacity(1) },
      { delay: 300, fn: () => setMapScale(1) },
      { delay: 500, fn: () => { setPhase("drawing"); animateDraw(); } },
    ];
    const timers = timeline.map(({ delay, fn }) => setTimeout(fn, delay));

    function animateDraw() {
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setDrawProgress(ease);
        if (t < 1) { raf = requestAnimationFrame(tick); }
        else {
          setPhase("filling");
          setTimeout(() => {
            animateFill();
          }, 120);
        }
      }
      raf = requestAnimationFrame(tick);
    }

    function animateFill() {
      const dur = 700;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        setFillOpacity(t);
        setGlowOpacity(t * 0.65);
        if (t < 1) { raf = requestAnimationFrame(tick); }
        else {
          setPhase("form");
          setTimeout(animateForm, 200);
        }
      }
      raf = requestAnimationFrame(tick);
    }

    function animateForm() {
      const dur = 600;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setFormOpacity(ease);
        setFormY(Math.round((1 - ease) * 18));
        if (t < 1) { raf = requestAnimationFrame(tick); }
        else {
          setTimeout(() => usernameRef.current?.focus(), 100);
        }
      }
      raf = requestAnimationFrame(tick);
    }

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [pathLength, reduced]);

  // Success screen animation
  useEffect(() => {
    if (btnState !== "success") return;
    let raf;
    setTimeout(() => {
      const dur = 1000;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setGlowOpacity(0.65 + ease * 0.35);
        setSuccessScale(1 + ease * 18);
        setSuccessOpacity(1 - ease);
        if (t < 1) { raf = requestAnimationFrame(tick); } 
      }
      raf = requestAnimationFrame(tick);
    }, 600);
    return () => cancelAnimationFrame(raf);
  }, [btnState]);

 async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!username.trim() || !password.trim()) {
    setErrorMsg("Please enter username and password.");
    return;
  }

  setErrorMsg("");
  setBtnState("loading");

  try {
   const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setBtnState("idle");
      setErrorMsg(data.message || "Login Failed");
      return;
    }

    // Save Token
    localStorage.setItem("token", data.token);

    // Save Admin
    localStorage.setItem("admin", JSON.stringify(data.admin));

    setBtnState("success");

    setTimeout(() => {
      window.location.href = "/admin";
    }, 1200);

  } catch (error) {
    setBtnState("idle");
    setErrorMsg("Cannot connect to server.");
  }
}
  // Stroke dash params
  const strokeDasharray = pathLength > 0 ? `${pathLength * drawProgress} ${pathLength * (1 - drawProgress)}` : "0 9999";

  const mapTransform = `scale(${mapScale})`;
  const mapTransformOrigin = "50% 50%";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #F8FCFF 0%, #EEF8FF 52%, #DDEEFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        opacity: pageOpacity,
        transition: reduced ? "none" : "opacity 0.5s ease",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 1rem",
      }}
      role="main"
    >
      {/* Subtle radial ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56,189,248,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Animated success overlay */}
      {btnState === "success" && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(135deg, #0284C7, #38BDF8)",
            opacity: 1 - successOpacity,
            zIndex: 100,
            pointerEvents: "none",
            transition: "none",
          }}
        />
      )}

      {isMobile ? (
        /* ── MOBILE LAYOUT ─────────────────────────────────── */
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          <LogoHeading />
          <div
            style={{
              transform: mapTransform,
              transformOrigin: mapTransformOrigin,
              transition: reduced ? "none" : "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
              width: 240,
              height: 160,
            }}
          >
            <MapSVG
              pathRef={pathRef}
              pathLength={pathLength}
              strokeDasharray={strokeDasharray}
              fillOpacity={fillOpacity}
              glowOpacity={glowOpacity}
              drawProgress={drawProgress}
              successScale={1}
              successOpacity={1}
              reduced={reduced}
            />
          </div>
          <MobileForm
            formOpacity={formOpacity}
            formY={formY}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            errorMsg={errorMsg}
            btnState={btnState}
            handleLogin={handleLogin}
            usernameRef={usernameRef}
            reduced={reduced}
          />
        </div>
      ) : (
        /* ── DESKTOP LAYOUT ─────────────────────────────────── */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <LogoHeading />
          <div style={{ position: "relative", width: 560, height: 360 }}>
            {/* Map */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: btnState === "success" ? `scale(${successScale})` : mapTransform,
                transformOrigin: "50% 50%",
                opacity: btnState === "success" ? successOpacity : 1,
                transition: reduced ? "none" : "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <MapSVG
                pathRef={pathRef}
                pathLength={pathLength}
                strokeDasharray={strokeDasharray}
                fillOpacity={fillOpacity}
                glowOpacity={glowOpacity}
                drawProgress={drawProgress}
                successScale={successScale}
                successOpacity={successOpacity}
                reduced={reduced}
              />
            </div>

            {/* Form overlaid on map */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, calc(-50% + ${formY}px))`,
                opacity: formOpacity,
                transition: reduced ? "none" : "none",
                width: 220,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                pointerEvents: phase === "form" || phase === "loading" || phase === "success" ? "auto" : "none",
              }}
              role="region"
              aria-label="Login form"
            >
              <LoginFields
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                errorMsg={errorMsg}
                btnState={btnState}
                handleLogin={handleLogin}
                usernameRef={usernameRef}
              />
            </div>
          </div>
          <Tagline />
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 40px rgba(255,255,255,0.85) inset !important; }
        .nb-input:focus-visible { outline: 2px solid #38BDF8; outline-offset: 0; box-shadow: 0 0 0 4px rgba(56,189,248,0.22); }
        .nb-btn { cursor: pointer; border: none; }
        .nb-btn:focus-visible { outline: 2px solid #38BDF8; outline-offset: 3px; }
        .nb-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(2,132,199,0.35); }
        .nb-btn:active:not(:disabled) { transform: scale(0.98) translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          .nb-btn:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}

function LogoHeading() {
  return (
    <div style={{ textAlign: "center", userSelect: "none" }}>
      <div style={{
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.38em",
        color: "#38BDF8",
        textTransform: "uppercase",
        marginBottom: 2,
      }}>
        NAMMA
      </div>
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        letterSpacing: "0.18em",
        color: "#0F172A",
        textTransform: "uppercase",
        lineHeight: 1,
      }}>
        BYNDOOR
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.22em",
        color: "#64748B",
        textTransform: "uppercase",
        marginTop: 4,
      }}>
        Admin Portal
      </div>
    </div>
  );
}

function Tagline() {
  return (
    <div style={{
      textAlign: "center",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.14em",
      color: "#94A3B8",
      textTransform: "uppercase",
      marginTop: 4,
    }}>
      Enter the Namma Byndoor Ecosystem
    </div>
  );
}

function MapSVG({ pathRef, pathLength, strokeDasharray, fillOpacity, glowOpacity, drawProgress, reduced }) {
  return (
    <svg
      viewBox={VIEWBOX}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Map of Byndoor — login visual"
      role="img"
    >
      <defs>
        <filter id="nb-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="nb-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(15,23,42,0.18)" floodOpacity="1" />
        </filter>
        <linearGradient id="nb-terrain" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="35%" stopColor="#7DD3FC" />
          <stop offset="65%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="nb-stroke-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id="nb-glow-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0)" />
        </radialGradient>
        <clipPath id="nb-map-clip">
          <path d={MAP_PATH} />
        </clipPath>
      </defs>

      {/* Glow halo behind map */}
      <ellipse
        cx="105" cy="65"
        rx="80" ry="55"
        fill="url(#nb-glow-fill)"
        opacity={glowOpacity * 0.9}
        aria-hidden="true"
      />

      {/* Terrain fill (clipped to map shape) */}
      <g clipPath="url(#nb-map-clip)" aria-hidden="true">
        <rect x="0" y="0" width="210" height="130" fill="url(#nb-terrain)" opacity={fillOpacity} />
        {/* Subtle coastal texture lines */}
        {fillOpacity > 0.3 && [0, 1, 2, 3].map(i => (
          <line
            key={i}
            x1="20" y1={30 + i * 22} x2="190" y2={20 + i * 22}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            opacity={fillOpacity * 0.5}
          />
        ))}
      </g>

      {/* Depth shadow on filled map */}
      {fillOpacity > 0.5 && (
        <path
          d={MAP_PATH}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="6"
          filter="url(#nb-shadow)"
          opacity={fillOpacity}
          aria-hidden="true"
        />
      )}

      {/* Drawing stroke — the animated outline */}
      {pathLength > 0 && (
        <path
          ref={pathRef}
          d={MAP_PATH}
          fill="none"
          stroke="url(#nb-stroke-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          aria-hidden="true"
        />
      )}
      {/* Invisible path for measurement */}
      {pathLength === 0 && (
        <path
          ref={pathRef}
          d={MAP_PATH}
          fill="none"
          stroke="transparent"
          strokeWidth="1"
          aria-hidden="true"
        />
      )}

      {/* Outer glow ring when filled */}
      <path
        d={MAP_PATH}
        fill="none"
        stroke="rgba(56,189,248,0.28)"
        strokeWidth="5"
        opacity={glowOpacity}
        aria-hidden="true"
      />

      {/* Location dot */}
      {fillOpacity > 0.8 && (
        <g opacity={fillOpacity} aria-hidden="true">
          <circle cx="105" cy="68" r="3.5" fill="white" opacity="0.9" />
          <circle cx="105" cy="68" r="6" fill="none" stroke="white" strokeWidth="1.2" opacity="0.4">
            <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
}

function LoginFields({ username, setUsername, password, setPassword, errorMsg, btnState, handleLogin, usernameRef }) {
  const inputStyle = {
    width: "100%",
    height: 48,
    padding: "0 14px 0 40px",
    background: "rgba(255,255,255,0.78)",
    border: "1.5px solid rgba(255,255,255,0.45)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 500,
    color: "#0F172A",
    letterSpacing: "0.01em",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleLogin} noValidate aria-label="Sign in to Namma Byndoor">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Username */}
        <div style={{ position: "relative" }}>
          <label htmlFor="nb-username" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Username</label>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#64748B", pointerEvents: "none", display: "flex" }}>
            <UserIcon size={16} />
          </span>
          <input
            ref={usernameRef}
            id="nb-username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="nb-input"
            style={inputStyle}
            aria-required="true"
            disabled={btnState !== "idle"}
          />
        </div>

        {/* Password */}
        <div style={{ position: "relative" }}>
          <label htmlFor="nb-password" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Password</label>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#64748B", pointerEvents: "none", display: "flex" }}>
            <LockIcon size={16} />
          </span>
          <input
            id="nb-password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="nb-input"
            style={inputStyle}
            aria-required="true"
            disabled={btnState !== "idle"}
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <div role="alert" style={{ fontSize: 11, color: "#DC2626", fontWeight: 500, textAlign: "center", letterSpacing: "0.01em" }}>
            {errorMsg}
          </div>
        )}

        {/* Login button */}
        <button
          type="submit"
          className="nb-btn"
          disabled={btnState === "loading" || btnState === "success"}
          aria-label={btnState === "loading" ? "Signing in…" : btnState === "success" ? "Signed in" : "Sign in"}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 999,
            background: btnState === "success"
              ? "linear-gradient(135deg, #16A34A, #22C55E)"
              : "linear-gradient(180deg, #0369A1 0%, #0284C7 50%, #38BDF8 100%)",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.4s, transform 0.15s, box-shadow 0.2s",
            boxShadow: "0 4px 16px rgba(2,132,199,0.30)",
            marginTop: 2,
          }}
        >
          {btnState === "loading" && <SpinnerIcon size={18} />}
          {btnState === "success" && <CheckIcon size={18} />}
          {btnState === "idle" && "LOGIN"}
          {btnState === "loading" && "Entering…"}
          {btnState === "success" && "Welcome"}
        </button>
      </div>
    </form>
  );
}

function MobileForm({ formOpacity, formY, username, setUsername, password, setPassword, errorMsg, btnState, handleLogin, usernameRef, reduced }) {
  return (
    <div
      style={{
        width: "100%",
        opacity: formOpacity,
        transform: reduced ? "none" : `translateY(${formY}px)`,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 24,
        border: "1.5px solid rgba(255,255,255,0.45)",
        padding: "24px 20px",
        boxShadow: "0 8px 32px rgba(15,23,42,0.10)",
      }}
      role="region"
      aria-label="Login form"
    >
      <LoginFields
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        errorMsg={errorMsg}
        btnState={btnState}
        handleLogin={handleLogin}
        usernameRef={usernameRef}
      />
    </div>
  );
}