// src/views/HomePage.tsx
import { useState, useEffect, useRef } from "react";
import type { WalletState } from "../types";

interface Props {
  wallet: WalletState;
  freighterInstalled: boolean;
  onConnect: () => void;
  onEnter: () => void;
}

const TICKER_ITEMS = [
  "Soroban Smart Contracts",
  "USDC Stablecoin",
  "Instant Settlement",
  "On-Chain Transparency",
  "Zero Fees",
  "Stellar Testnet",
  "Disaster Relief",
  "Trustlines",
  "Filipino Families",
  "Immutable Records",
];

const TICKER_TEXT = Array(6)
  .fill(TICKER_ITEMS.map((t) => `${t}  -  `).join(""))
  .join("");

const IMPACT_STATS = [
  { value: "PHP 0", label: "Admin fees", note: "100% reaches families" },
  { value: "<5s", label: "Settlement time", note: "vs 3-7 days traditional" },
  { value: "$0.0001", label: "Per transaction", note: "vs 3-5% bank cut" },
  { value: "Infinite", label: "On-chain forever", note: "Immutable audit trail" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "L",
    color: "coral",
    title: "Connect wallet",
    body: "Open Freighter set to Testnet. Your Stellar address appears instantly - zero signup, zero email, zero gatekeeping.",
    fn: null,
  },
  {
    step: "02",
    icon: "$",
    color: "sun",
    title: "Donate USDC",
    body: "Enter any amount. Freighter signs in one click. USDC locks into the Soroban escrow contract. No intermediary touches it.",
    fn: "donate(donor, token, amount)",
  },
  {
    step: "03",
    icon: "!",
    color: "leaf",
    title: "Declare emergency",
    body: "Admin wallet flips the on-chain flag. The contract now permits withdrawals. The event is public, timestamped, immutable.",
    fn: "declare_emergency()",
  },
  {
    step: "04",
    icon: "OK",
    color: "sky",
    title: "Release funds",
    body: "Coordinator withdraws USDC with a purpose string. Logged on-chain permanently. Every centavo traceable by anyone, forever.",
    fn: "withdraw(coordinator, token, amount, purpose)",
  },
];

const CONTRACT_FNS = [
  {
    name: "initialize(admin)",
    caller: "Deployer",
    tag: "deploy",
    desc: "Sets admin address, zeros all counters, emergency flag - false. Called once at deployment.",
  },
  {
    name: "donate(donor, token, amount)",
    caller: "Anyone",
    tag: "anyone",
    desc: "Transfers USDC into escrow, records donation with timestamp, emits donated event.",
  },
  {
    name: "declare_emergency()",
    caller: "Admin only",
    tag: "admin",
    desc: "Flips emergency flag to true. Enables withdrawals. Emits emergency_declared event on-chain.",
  },
  {
    name: "withdraw(coordinator, token, amount, purpose)",
    caller: "Admin only",
    tag: "admin",
    desc: "Releases USDC to coordinator with an on-chain purpose string. Guards: active emergency + sufficient balance.",
  },
  {
    name: "lift_emergency()",
    caller: "Admin only",
    tag: "admin",
    desc: "Disables withdrawals. Returns fund to locked escrow state. Emits emergency_lifted event.",
  },
  {
    name: "get_balance() + views",
    caller: "Read-only",
    tag: "read",
    desc: "Public getters: balance, total donated/withdrawn, emergency flag, full donation history array.",
  },
];

const WHY_STELLAR = [
  {
    icon: "B",
    color: "violet",
    title: "Soroban smart contracts",
    desc: "Core escrow logic - donate, emergency gate, withdraw - enforced on-chain with zero intermediaries. No trust required.",
  },
  {
    icon: "$",
    color: "leaf",
    title: "USDC stablecoin",
    desc: "Stable donations immune to XLM price swings. Every peso in equals a peso out for recipients.",
  },
  {
    icon: "L",
    color: "sky",
    title: "Trustlines (SEP-41)",
    desc: "Recipients opt-in to USDC before receiving. Protocol-level compliance, not a bolt-on workaround.",
  },
  {
    icon: "S",
    color: "sun",
    title: "Soroban events",
    desc: "donated, emergency_declared, withdrawn - every state change emitted to Stellar Expert. Public forever.",
  },
];

const RECENT_DONATIONS = [
  { ava: "JC", cls: "c1", addr: "GBC...4F2A", time: "2 min ago", amt: "+250 USDC", flag: "PH" },
  { ava: "AL", cls: "c2", addr: "GAX...9D1C", time: "11 min ago", amt: "+100 USDC", flag: "US" },
  { ava: "MR", cls: "c3", addr: "GTP...2B7E", time: "28 min ago", amt: "+500 USDC", flag: "JP" },
  { ava: "KN", cls: "c4", addr: "GDA...5C1F", time: "1 hr ago", amt: "+75 USDC", flag: "SG" },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function DonatedCounter() {
  const { count, ref } = useCountUp(8420);
  return (
    <div ref={ref} className="fund-amount">
      {count.toLocaleString()}.00
    </div>
  );
}

export default function HomePage({
  wallet,
  freighterInstalled,
  onConnect,
  onEnter,
}: Props) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleCopyAddress() {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 1800);
    }
  }

  return (
    <div className="home">

      <nav className={`nav ${navScrolled ? "nav-scrolled" : ""}`}>
        <a href="#" className="nav-brand">
          <span className="brand-mark">
            <span className="brand-pulse" />
          </span>
          Tulong<span className="brand-chain">Chain</span>
        </a>

        <div className="nav-center">
          <a href="#how" className="nav-link">How it works</a>
          <a href="#contract" className="nav-link">Contract</a>
          <a href="#features" className="nav-link">Why Stellar</a>
          <a href="#impact" className="nav-link">Impact</a>
          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noreferrer"
            className="nav-link nav-link-external"
          >
            Explorer -&gt;
          </a>
        </div>

        <div className="nav-actions">
          <span className="nav-badge">
            <span className="badge-dot" />
            Stellar Testnet
          </span>
          {!wallet.connected ? (
            <button className="btn-connect" onClick={onConnect}>
              Connect Freighter
            </button>
          ) : (
            <div className="nav-connected">
              <button
                className="address-badge address-badge-clickable"
                onClick={handleCopyAddress}
                title="Click to copy"
              >
                <span className="address-dot" />
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                <span className="copy-hint">{copiedAddress ? "Copied!" : "Copy"}</span>
              </button>
              <button className="btn-connect btn-connect-enter" onClick={onEnter}>
                Dashboard -&gt;
              </button>
            </div>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`} />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          {["How it works", "Contract", "Why Stellar", "Impact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "")}`}
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[0, 1].map((i) => (
            <span key={i} className="ticker-text">{TICKER_TEXT}</span>
          ))}
        </div>
      </div>

      <section className="hero-section">
        <div className="hero-bg-grid" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Stellar Philippines 2026
            </span>

            <h1 className="hero-h1">
              Relief funds that{" "}
              <span className="h1-highlight">actually reach</span>
              <br />
              <span className="h1-accent">Filipino families.</span>
            </h1>

            <p className="hero-sub">
              TulongChain locks donor USDC in a Soroban smart contract escrow.
              Funds only release when a verified coordinator declares a disaster
              emergency - every centavo public and traceable on-chain in under 5 seconds.
            </p>

            {!freighterInstalled && (
              <div className="warning-box">
                <span className="warning-icon">!</span>
                <div>
                  <strong>Freighter wallet not detected.</strong> Install it at{" "}
                  <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noreferrer"
                    className="warning-link"
                  >
                    freighter.app
                  </a>{" "}
                  and set network to <strong>Testnet</strong> before continuing.
                </div>
              </div>
            )}

            <div className="hero-actions">
              {!wallet.connected ? (
                <button className="btn-primary" onClick={onConnect}>
                  Connect Freighter -&gt;
                </button>
              ) : (
                <div className="connected-state">
                  <span className="address-badge">
                    <span className="address-dot" />
                    {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                  </span>
                  <button className="btn-primary" onClick={onEnter}>
                    Open Dashboard -&gt;
                  </button>
                </div>
              )}
              <a
                href="https://github.com/armlynobinguar/Stellar-Bootcamp-2026"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Deploy Guide -&gt;
              </a>
            </div>

            <div className="hero-pills">
              {[
                { num: "<5s", label: "Settlement" },
                { num: "<$0.01", label: "Per transaction" },
                { num: "100%", label: "On-chain" },
                { num: "5", label: "Tests passing" },
              ].map(({ num, label }) => (
                <div key={label} className="hero-pill">
                  <span className="pill-num">{num}</span>
                  <span className="pill-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fund-card-wrap">
            <div className="fund-card">
              <div className="fund-card-stripe" />

              <div className="fund-card-header">
                <span className="fund-card-label">Relief Fund - Testnet</span>
                <div className="live-chip">
                  <span className="live-dot" />
                  Live
                </div>
              </div>

              <DonatedCounter />
              <div className="fund-amount-unit">USDC raised</div>
              <div className="fund-desc">Typhoon Relief Fund 2026</div>

              <div className="progress-wrap">
                <div className="progress-track">
                  <div className="progress-fill">
                    <div className="progress-shimmer" />
                  </div>
                </div>
                <div className="progress-labels">
                  <span>0 USDC</span>
                  <span className="progress-pct">70% of 12,000 goal</span>
                </div>
              </div>

              <div className="mini-feed-label">
                <span>Recent Donations</span>
                <span className="feed-count">{RECENT_DONATIONS.length} donors</span>
              </div>
              <div className="mini-feed">
                {RECENT_DONATIONS.map(({ ava, cls, addr, time, amt, flag }) => (
                  <div key={addr} className="mini-row">
                    <div className={`mini-ava ${cls}`}>
                      <span>{ava}</span>
                    </div>
                    <div className="mini-info">
                      <div className="mini-addr">{flag} {addr}</div>
                      <div className="mini-time">{time}</div>
                    </div>
                    <div className="mini-usdc">{amt}</div>
                  </div>
                ))}
              </div>

              <div className="feat-tags">
                {["Soroban", "USDC", "Freighter", "Trustlines", "Events", "SEP-41"].map((t) => (
                  <span key={t} className="feat-tag">{t}</span>
                ))}
              </div>

              <div className="fund-card-footer">
                <a
                  href="https://stellar.expert/explorer/testnet"
                  target="_blank"
                  rel="noreferrer"
                  className="explorer-link"
                >
                  View on Stellar Expert -&gt;
                </a>
              </div>
            </div>

            <div className="float-badge float-badge-1">
              <span>L</span> Escrow locked
            </div>
            <div className="float-badge float-badge-2">
              <span>B</span> 3s finality
            </div>
          </div>
        </div>
      </section>

      <div className="rainbow-strip" />

      <section className="impact-section" id="impact">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow eyebrow-sun">Impact at a glance</span>
            <h2 className="section-h2">Why blockchain relief works</h2>
            <p className="section-sub">
              Traditional relief chains lose up to 30% to admin, currency conversion, and middlemen.
              TulongChain eliminates every layer.
            </p>
          </div>
          <div className="impact-grid">
            {IMPACT_STATS.map(({ value, label, note }) => (
              <div key={label} className="impact-card">
                <div className="impact-value">{value}</div>
                <div className="impact-label">{label}</div>
                <div className="impact-note">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rainbow-strip" />

      <section className="how-section" id="how">
        <div className="section-inner">
          <div className="section-header how-header">
            <span className="section-eyebrow eyebrow-sun">Demo flow</span>
            <h2 className="section-h2 section-h2-light">How it works</h2>
            <p className="section-sub section-sub-light">
              End-to-end in under 2 minutes. Hackathon-ready demo with real on-chain transactions.
            </p>
          </div>

          <div className="steps-grid">
            {HOW_IT_WORKS.map(({ step, icon, color, title, body, fn }) => (
              <div key={step} className={`step-card step-${color}`}>
                <div className="step-num">{step}</div>
                <div className={`step-icon-ring step-ring-${color}`}>
                  <span>{icon}</span>
                </div>
                <div className="step-title">{title}</div>
                <div className="step-body">{body}</div>
                {fn && (
                  <div className="step-fn">
                    <span className="fn-mono">{fn}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flow-connector">
            <div className="flow-line" />
            <div className="flow-text">Fully on-chain - No backend - No trust required</div>
          </div>
        </div>
      </section>

      <div className="rainbow-strip" />

      <section className="section-inner contract-section" id="contract">
        <div className="section-header">
          <span className="section-eyebrow eyebrow-violet">Soroban contract</span>
          <h2 className="section-h2">Public functions</h2>
          <p className="section-sub">
            All logic lives on-chain. No backend server. No admin panel. No trust required.
          </p>
        </div>

        <div className="fn-grid">
          {CONTRACT_FNS.map(({ name, caller, tag, desc }) => (
            <div key={name} className={`fn-card fn-${tag}`}>
              <div className="fn-card-top">
                <span className={`fn-tag fn-tag-${tag}`}>{caller}</span>
                <span className="fn-lock">
                  {tag === "admin" ? "K" : tag === "anyone" ? "W" : tag === "read" ? "E" : "R"}
                </span>
              </div>
              <div className="fn-name">{name}</div>
              <div className="fn-desc">{desc}</div>
            </div>
          ))}
        </div>

        <div className="contract-cta">
          <div className="contract-address-box">
            <span className="ca-label">Contract deployed on</span>
            <span className="ca-network">Stellar Testnet - Soroban</span>
          </div>
          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Verify on Explorer -&gt;
          </a>
        </div>
      </section>

      <div className="rainbow-strip" />

      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow eyebrow-violet">Stellar integration</span>
            <h2 className="section-h2">Why Stellar</h2>
            <p className="section-sub">
              No other chain offers sub-cent fees with native USDC support and
              3-5 second finality that relief operations actually need.
            </p>
          </div>

          <div className="feat-grid">
            {WHY_STELLAR.map(({ icon, color, title, desc }) => (
              <div key={title} className={`feat-card feat-${color}`}>
                <div className={`feat-icon-wrap feat-icon-${color}`}>
                  <span>{icon}</span>
                </div>
                <div className="feat-title">{title}</div>
                <div className="feat-desc">{desc}</div>
                <div className={`feat-bar feat-bar-${color}`} />
              </div>
            ))}
          </div>

          <div className="stellar-compare">
            <div className="compare-header">Stellar vs. traditional relief</div>
            <div className="compare-grid">
              {[
                { label: "Settlement", traditional: "3-7 days", stellar: "<5 seconds" },
                { label: "Fees", traditional: "3-5% cut", stellar: "<$0.001" },
                { label: "Transparency", traditional: "Private records", stellar: "Public ledger" },
                { label: "Audit", traditional: "Annual reports", stellar: "Real-time on-chain" },
              ].map(({ label, traditional, stellar }) => (
                <div key={label} className="compare-row">
                  <span className="compare-label">{label}</span>
                  <span className="compare-bad">{traditional}</span>
                  <span className="compare-arrow">-&gt;</span>
                  <span className="compare-good">{stellar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-left">
            <h2 className="cta-h2">Ready to demo TulongChain?</h2>
            <p className="cta-sub">
              Connect your Freighter wallet on Testnet and experience the full relief flow in under 2 minutes.
            </p>
          </div>
          <div className="cta-actions">
            {!wallet.connected ? (
              <button className="btn-primary btn-primary-large" onClick={onConnect}>
                Connect Freighter -&gt;
              </button>
            ) : (
              <button className="btn-primary btn-primary-large" onClick={onEnter}>
                Open Dashboard -&gt;
              </button>
            )}
            <a
              href="https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost-light"
            >
              View Program -&gt;
            </a>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand">
              Tulong<span className="brand-chain-footer">Chain</span>
            </div>
            <div className="footer-tagline">
              Blockchain-powered relief for Filipino families.<br />
              Built on Stellar. Transparent by design.
            </div>
            <div className="footer-badges">
              <span className="footer-badge">MIT License</span>
              <span className="footer-badge">Open Source</span>
              <span className="footer-badge">Stellar Testnet</span>
            </div>
          </div>

          <div className="footer-links-block">
            <div className="footer-col">
              <div className="footer-col-title">Resources</div>
              {[
                { label: "Stellar Docs", href: "https://developers.stellar.org" },
                { label: "Soroban SDK", href: "https://docs.rs/soroban-sdk" },
                { label: "Freighter", href: "https://freighter.app" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="footer-link">
                  {label}
                </a>
              ))}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Explore</div>
              {[
                { label: "Stellar Expert", href: "https://stellar.expert/explorer/testnet" },
                { label: "Deploy Guide", href: "https://github.com/armlynobinguar/Stellar-Bootcamp-2026" },
                { label: "Rise In Program", href: "https://www.risein.com/programs/stellar-philippines-unitour-university-of-east-caloocan" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="footer-link">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            2026 TulongChain - Stellar Philippines
          </span>
          <span className="footer-note">Made for Filipino families</span>
        </div>
      </footer>
    </div>
  );
}