import { Trophy, TrendUp, Shield, MagicWand, House, Lightbulb, Storefront, EnvelopeSimple } from '@phosphor-icons/react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string | number;
        exposure?: string | number;
        'environment-image'?: string;
        'disable-zoom'?: boolean;
        'camera-target'?: string;
        'camera-orbit'?: string;
        'field-of-view'?: string;
      };
    }
  }
}

const API_BASE = 'https://app.attnx.fun';

interface TournamentData {
  id: number;
  startTime: number;
  endTime: number;
  prizePool: string;
  entryCount: number;
  status: string;
}

interface LeaderboardEntry {
  address: string;
  username: string;
  score: number;
  rank: number;
  avatar: string | null;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: '0x1234...abcd', username: 'cryptowhale', score: 420, avatar: null },
  { rank: 2, address: '0x5678...efgh', username: 'degenking', score: 385, avatar: null },
  { rank: 3, address: '0x9abc...ijkl', username: 'alphatrader', score: 310, avatar: null },
];

export default function App() {
  const [isFusing, setIsFusing] = useState(false);
  const [fusionComplete, setFusionComplete] = useState(false);
  const legendaryCards = ['/images/openai.png', '/images/cursor.png', '/images/lovable.png', '/images/anthropic.png'];
  const [fusionResult, setFusionResult] = useState(() => legendaryCards[Math.floor(Math.random() * legendaryCards.length)]);
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(FALLBACK_LEADERBOARD);
  const [countdown, setCountdown] = useState('');
  const [prizePool, setPrizePool] = useState('1');

  // Waitlist form
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistWallet, setWaitlistWallet] = useState('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistMsg, setWaitlistMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistWallet.trim()) return;
    setWaitlistSubmitting(true);
    setWaitlistMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail.trim(), wallet: waitlistWallet.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setWaitlistMsg({ type: 'success', text: data.message || "You're on the list!" });
        setWaitlistEmail('');
        setWaitlistWallet('');
      } else {
        setWaitlistMsg({ type: 'error', text: data.error || 'Something went wrong.' });
      }
    } catch {
      setWaitlistMsg({ type: 'error', text: 'Network error. Please try again.' });
    }
    setWaitlistSubmitting(false);
  };

  // Nav active section tracking
  const NAV_SECTIONS = ['hero', 'how-it-works', 'leaderboard', 'marketplace'] as const;
  const NAV_LABELS: Record<string, string> = { hero: 'Home', 'how-it-works': 'How It Works', leaderboard: 'Leagues', marketplace: 'Marketplace' };
  const [activeSection, setActiveSection] = useState('hero');
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [dotStyle, setDotStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Update dot position when active section changes
  const updateDot = useCallback(() => {
    const btn = navLinkRefs.current[activeSection];
    const container = navContainerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setDotStyle({ left: bRect.left - cRect.left + bRect.width / 2 - 3, width: 6 });
  }, [activeSection]);

  useEffect(() => { updateDot(); }, [updateDot]);
  useEffect(() => { window.addEventListener('resize', updateDot); return () => window.removeEventListener('resize', updateDot); }, [updateDot]);

  // How It Works scroll tracker
  const howItWorksRef = useRef<HTMLElement>(null);
  const scrollTrackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!howItWorksRef.current || !scrollTrackerRef.current) return;
      const rect = howItWorksRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startOffset = windowHeight * 0.7;
      const scrollableDistance = rect.height;

      let scrolled = startOffset - rect.top;
      let progress = (scrolled / scrollableDistance) * 100;
      progress = Math.max(0, Math.min(100, progress));

      scrollTrackerRef.current.style.top = `${progress}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy — detect which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/tournaments/active`)
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          setTournament(res.data);
          setPrizePool(res.data.prizePool || '1');
          fetch(`${API_BASE}/api/leaderboard/${res.data.id}`)
            .then(r => r.json())
            .then(lb => {
              if (lb.success && Array.isArray(lb.data) && lb.data.length > 0) {
                setLeaderboard(lb.data.slice(0, 3));
              }
            })
            .catch(() => { });
        }
      })
      .catch(() => { });
  }, []);

  // Countdown timer — endTime is Unix timestamp in seconds
  useEffect(() => {
    if (!tournament?.endTime) return;
    const endMs = tournament.endTime * 1000;
    const update = () => {
      const diff = endMs - Date.now();
      if (diff <= 0) { setCountdown('Ended'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${d}d ${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [tournament?.endTime]);

  const handleFuse = () => {
    if (isFusing) return;
    if (fusionComplete) {
      // Reset for another fuse
      setFusionComplete(false);
      return;
    }
    setIsFusing(true);
    setFusionResult(legendaryCards[Math.floor(Math.random() * legendaryCards.length)]);
    setTimeout(() => {
      setIsFusing(false);
      setFusionComplete(true);
    }, 2000);
  };

  const shortenAddr = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-white/20 selection:text-white overflow-hidden relative scroll-smooth">
      {/* Global Background for lower sections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent_10%,#000_40%,#000_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,#000_40%,#000_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#A855F7_0%,transparent_100%)] opacity-[0.04]"></div>
      </div>

      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className={`flex items-center py-3 sm:py-4 max-w-[1400px] mx-auto transition-all duration-500 ${navScrolled ? 'justify-center px-4' : 'justify-between px-4 sm:px-6 flex-row-reverse sm:flex-row'}`}>
          <button onClick={() => scrollTo('hero')} className={`text-xl sm:text-2xl font-bold tracking-tighter transition-all duration-500 origin-right sm:origin-left ${navScrolled ? 'w-0 opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}>Attention<span className="text-[#A855F7]">X</span></button>

          <div ref={navContainerRef} className="hidden md:flex items-center gap-8 bg-white/[0.03] backdrop-blur-xl px-8 py-3.5 rounded-2xl border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] relative">
            {NAV_SECTIONS.map((id) => (
              <button
                key={id}
                ref={(el) => { navLinkRefs.current[id] = el; }}
                onClick={() => scrollTo(id)}
                className={`text-sm font-medium transition-colors duration-300 ${activeSection === id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {NAV_LABELS[id]}
              </button>
            ))}
            {/* Animated dot indicator */}
            <span
              className="absolute bottom-2 h-[5px] w-[5px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ left: dotStyle.left, opacity: dotStyle.width ? 1 : 0 }}
            />
          </div>

          <button onClick={() => scrollTo('waitlist')} className={`group relative bg-white text-black rounded-xl font-semibold text-xs sm:text-sm overflow-hidden transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 origin-right hidden md:block cursor-pointer ${navScrolled ? 'md:w-0 md:px-0 md:py-0 md:opacity-0 md:scale-75 md:pointer-events-none' : 'md:px-7 md:py-2.5 md:opacity-100 md:scale-100'}`}>
            <span className="relative z-10 whitespace-nowrap">Join Waitlist</span>
            <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-20 sm:pt-20 pb-12 sm:pb-6 min-h-[100dvh] flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-6 lg:gap-12 lg:items-end relative z-10">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[80%] rounded-full bg-[#A855F7]/8 blur-[100px] md:blur-[150px] pointer-events-none"></div>
        {/* Left Column */}
        <div className="space-y-4 sm:space-y-6 shrink-0 mt-auto mb-10 lg:mb-0 lg:mt-0 text-left flex flex-col items-start">
          {/* Trust Badge — hidden on mobile */}
          <div className="hidden sm:inline-flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl p-1.5 pr-5 rounded-xl border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <div className="bg-white text-black px-4 py-1.5 rounded-lg text-xs font-bold">
              Our Users
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-7 h-7 rounded-full border-2 border-white/10" />
                <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-7 h-7 rounded-full border-2 border-white/10" />
                <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-7 h-7 rounded-full border-2 border-white/10" />
              </div>
              <span className="text-xs text-gray-300 font-medium">Trusted by 24,000 degens</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[40px] sm:text-[48px] md:text-[56px] lg:text-[72px] font-bold leading-[1.05] tracking-tight">
            The Ultimate <br className="hidden lg:block" />
            Startup Fantasy <br className="hidden lg:block" />
            Trading Game
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
            <span className="sm:hidden">
              Trade cards of top AI & YC startups. Build your portfolio, compete, and win real rewards.
            </span>
            <span className="hidden sm:inline">
              Trade cards of top AI and YC startups. Build your portfolio, compete in weekly tournaments, and win real rewards based on real-world traction and hype.
            </span>
          </p>

          {/* Button */}
          <div className="pt-4 sm:pt-0">
            <button onClick={() => scrollTo('waitlist')} className="group relative inline-flex items-center gap-3 bg-white text-black px-8 sm:px-8 py-4 sm:py-3.5 rounded-2xl font-bold text-base sm:text-base overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.03] cursor-pointer">
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-[-4px]">Join the Waitlist</span>
              <svg className="relative z-10 w-5 h-5 transition-all duration-300 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="hidden lg:flex flex-1 relative mt-8 sm:mt-0 min-h-[300px] sm:min-h-[360px] lg:min-h-[560px] items-center sm:items-end justify-center [perspective:2000px]">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[350px] lg:w-[450px] h-[280px] sm:h-[350px] lg:h-[450px] bg-[#A855F7]/10 blur-[80px] sm:blur-[100px] lg:blur-[120px] rounded-full pointer-events-none"></div>

          {/* Cards Container */}
          <div className="relative w-[150px] sm:w-[180px] lg:w-[230px] h-[250px] sm:h-[310px] lg:h-[390px] [transform-style:preserve-3d] group">

            {/* Card 3 (Back left) - Lovable */}
            <img src="/images/lovable.png" alt="Lovable" className="absolute inset-0 w-full h-full rounded-[14px] sm:rounded-[18px] lg:rounded-[20px] shadow-2xl transition-all duration-500 transform -rotate-12 -translate-x-10 sm:-translate-x-14 lg:-translate-x-18 translate-y-4 sm:translate-y-7 scale-90 group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-100 cursor-pointer" />

            {/* Card 2 (Back right) - Cursor */}
            <img src="/images/cursor.png" alt="Cursor" className="absolute inset-0 w-full h-full rounded-[14px] sm:rounded-[18px] lg:rounded-[20px] shadow-2xl transition-all duration-500 transform rotate-12 translate-x-10 sm:translate-x-14 lg:translate-x-18 translate-y-3 scale-95 group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-100 cursor-pointer" />

            {/* Card 1 (Front center) - OpenAI */}
            <img src="/images/openai.png" alt="OpenAI" className="absolute inset-0 w-full h-full rounded-[14px] sm:rounded-[18px] lg:rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 transform z-10 group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-105 cursor-pointer" />

          </div>
        </div>
      </main>

      {/* Features Section — hidden for now */}

      {/* How it Works Section - Redesigned & Animated */}
      <section id="how-it-works" ref={howItWorksRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24 sm:pb-40 relative z-10 scroll-mt-24 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#A855F7]/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#A855F7]/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>

        <div className="text-center mb-20 md:mb-32 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-ping"></span>
            <p className="text-gray-300 text-xs sm:text-sm font-bold uppercase tracking-widest">The Process</p>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#DFB9FF]">Works</span></h2>
        </div>

        <div className="relative max-w-5xl mx-auto z-10">
          {/* Animated Vertical Line (Desktop) */}
          <div className="hidden md:block absolute top-[10%] bottom-[10%] left-1/2 -ml-[1px] w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent">
            {/* Moving Tracker on the line */}
            <div ref={scrollTrackerRef} className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-[#A855F7] to-transparent transition-all duration-75 ease-linear"></div>
          </div>

          <div className="space-y-16 md:space-y-24">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              {/* Connector Dot */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050507] border-2 border-[#A855F7]/40 items-center justify-center z-20 group-hover:border-[#A855F7] transition-all duration-500 group-hover:shadow-[0_0_20px_#A855F7]">
                <div className="w-2 h-2 rounded-full bg-[#A855F7] group-hover:scale-150 transition-transform duration-500"></div>
              </div>

              {/* Text Right, Box Left on Desktop */}
              <div className="w-full md:w-[45%] flex justify-end mb-8 md:mb-0 order-2 md:order-1 px-4 md:px-0">
                <div className="md:pr-12 text-center md:text-right w-full">
                  <div className="inline-block text-8xl font-black text-white/[0.03] -mb-8 select-none">01</div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#A855F7] transition-all duration-300">Assemble Your Portfolio</h3>
                  <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                    Purchase a starter pack containing 5 random YC startup cards. Will you pull the next unicorn?
                  </p>
                </div>
              </div>

              {/* Visual Card - Free Floating 3D Pack */}
              <div className="w-full md:w-[45%] order-1 md:order-2 px-4 md:px-0 flex justify-center md:justify-start">
                <div className="relative w-full max-w-sm h-[200px] sm:h-[300px] flex items-center justify-center group-hover:scale-[1.05] transition-transform duration-500 overflow-visible">
                  <div className="relative w-[500px] h-[600px] scale-[0.45] sm:scale-[0.55] z-20 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
                    {/* @ts-ignore */}
                    <model-viewer
                      src="/card-pack.glb"
                      environment-image="/env-city.hdr"
                      auto-rotate="true"
                      rotation-per-second="20deg"
                      camera-controls="true"
                      shadow-intensity="0"
                      exposure="1.1"
                      camera-orbit="0deg 75deg 7m"
                      field-of-view="25deg"
                      disable-zoom="true"
                      disable-pan="true"
                      interaction-prompt="none"
                      style={{ width: '100%', height: '100%', backgroundColor: 'transparent', outline: 'none' }}
                    ></model-viewer>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              {/* Connector Dot */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050507] border-2 border-[#A855F7]/40 items-center justify-center z-20 group-hover:border-[#A855F7] transition-all duration-500 group-hover:shadow-[0_0_20px_#A855F7]">
                <div className="w-2 h-2 rounded-full bg-[#A855F7] group-hover:scale-150 transition-transform duration-500"></div>
              </div>

              {/* Visual Card Left */}
              <div className="w-full md:w-[45%] order-1 md:order-1 px-4 md:px-0 flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm aspect-video rounded-3xl p-[1px] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#A855F7_360deg)] animate-[spin_4s_linear_infinite_reverse] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[1px] bg-[#0A0A0E] rounded-[23px] z-10"></div>
                  <div className="relative z-20 w-full h-full p-4 lg:p-8 border border-white/5 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center backdrop-blur-sm overflow-hidden min-h-[200px]">
                    <div className="flex -space-x-8 sm:-space-x-4 animate-[float_5s_ease-in-out_infinite] items-center justify-center perspective-[1000px]">
                      <img src="/images/anthropic.png" alt="Anthropic" className="w-14 sm:w-16 h-20 sm:h-24 object-cover rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-white/10 -rotate-12 translate-y-4" />
                      <img src="/images/cursor.png" alt="Cursor" className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-[#A855F7]/30 -rotate-6 translate-y-1 z-10" />
                      <img src="/images/openai.png" alt="OpenAI" className="w-20 sm:w-24 h-28 sm:h-32 object-cover rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.4)] border border-[#A855F7] z-20 backdrop-blur-md" />
                      <img src="/images/lovable.png" alt="Lovable" className="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-[#A855F7]/30 rotate-6 translate-y-1 z-10" />
                      <img src="/images/browseruse.png" alt="BrowserBase" className="w-14 sm:w-16 h-20 sm:h-24 object-cover rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-white/10 rotate-12 translate-y-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Right */}
              <div className="w-full md:w-[45%] flex justify-start mt-8 md:mt-0 order-2 md:order-2 px-4 md:px-0">
                <div className="md:pl-12 text-center md:text-left w-full">
                  <div className="inline-block text-8xl font-black text-white/[0.03] -mb-8 select-none">02</div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#A855F7] transition-all duration-300">Enter the Arena</h3>
                  <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                    Submit your best 5 cards to the weekly league. Your score is driven by real-world startup traction, news presence, and product launches.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              {/* Connector Dot */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#050507] border-2 border-[#A855F7]/40 items-center justify-center z-20 group-hover:border-[#A855F7] transition-all duration-500 group-hover:shadow-[0_0_20px_#A855F7]">
                <div className="w-2 h-2 rounded-full bg-[#A855F7] group-hover:scale-150 transition-transform duration-500"></div>
              </div>

              {/* Text Left */}
              <div className="w-full md:w-[45%] flex justify-end mb-8 md:mb-0 order-2 md:order-1 px-4 md:px-0">
                <div className="md:pr-12 text-center md:text-right w-full">
                  <div className="inline-block text-8xl font-black text-white/[0.03] -mb-8 select-none">03</div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#DFB9FF] transition-all duration-300">Reap the Rewards</h3>
                  <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                    Top the leaderboard and instantly claim your ETH from the prize pool. Smart contracts on the Rise blockchain handle payouts securely string.
                  </p>
                </div>
              </div>

              {/* Visual Card Right */}
              <div className="w-full md:w-[45%] order-1 md:order-2 px-4 md:px-0 flex justify-center md:justify-start">
                <div className="relative w-full max-w-sm aspect-video rounded-3xl p-[1px] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#A855F7_360deg)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[1px] bg-[#0A0A0E] rounded-[23px] z-10"></div>
                  <div className="relative z-20 w-full h-full p-8 border border-white/5 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-[#A855F7]/20 blur-xl absolute inset-0 group-hover:bg-[#A855F7]/40 transition-colors"></div>
                      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#DFB9FF] relative z-10 animate-[bounce_3s_infinite]">ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Leagues Section */}
      <section id="leaderboard" className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24 sm:pb-40 relative z-10 scroll-mt-24">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[80%] rounded-full bg-purple-500/6 blur-[100px] md:blur-[150px] pointer-events-none"></div>

        <div className="text-center mb-12 sm:mb-16 relative z-10">
          <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] mb-4">Compete & Earn</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Weekly Leagues</h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Lock your 5 best cards, compete against other players, and split the ETH prize pool.
          </p>
        </div>

        {/* Prize Pool + Timer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-12 sm:mb-16 relative z-10">
          <div className="text-center">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Prize Pool</div>
            <div className="flex items-baseline gap-2 justify-center">
              <span className="text-5xl sm:text-7xl font-black text-white">{prizePool}</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-500">ETH</span>
            </div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-white/10"></div>
          <div className="text-center">
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Ends In</div>
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white">{countdown || '7d 0h 0m'}</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white/80">Top Players</h3>
            <button onClick={() => scrollTo('waitlist')} className="text-gray-500 text-sm font-medium hover:text-white transition-colors cursor-pointer">View All</button>
          </div>

          <div className="space-y-3">
            {leaderboard.length > 0 ? leaderboard.map((entry, idx) => (
              <div key={entry.address} className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:bg-white/[0.04] ${idx === 0 ? 'bg-white/[0.04] border-yellow-500/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' : idx === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-amber-700/20 text-amber-600'}`}>
                    {idx + 1}
                  </div>
                  <img src={entry.avatar || `https://api.dicebear.com/9.x/identicon/svg?seed=${entry.username || entry.address}`} alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 bg-white/10 border border-white/10" />
                  <div className="min-w-0">
                    <span className="font-semibold text-sm sm:text-base block truncate">{entry.username || shortenAddr(entry.address)}</span>
                    <span className="text-gray-500 text-xs">{shortenAddr(entry.address)}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-mono font-bold text-sm sm:text-base text-white">{entry.score}</span>
                  <span className="text-gray-500 text-xs block">pts</span>
                </div>
              </div>
            )) : [1, 2, 3].map((pos) => (
              <div key={pos} className="flex items-center justify-between bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${pos === 1 ? 'bg-yellow-500/20 text-yellow-400' : pos === 2 ? 'bg-gray-400/20 text-gray-300' : 'bg-amber-700/20 text-amber-600'}`}>
                    {pos}
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 shrink-0"></div>
                  <span className="font-medium text-gray-500 text-sm">---</span>
                </div>
                <span className="font-mono text-gray-500 text-sm">-- pts</span>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div className="mt-8 text-center">
            <button onClick={() => scrollTo('waitlist')} className="group relative inline-flex items-center gap-3 bg-white text-black px-7 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.03] cursor-pointer">
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-[-4px]">Join This League</span>
              <svg className="relative z-10 w-5 h-5 transition-all duration-300 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Card Fusion Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20 sm:pb-32 relative z-10">
        <div className="absolute top-1/2 right-[-10%] w-[50%] h-[80%] rounded-full bg-purple-500/5 blur-[100px] md:blur-[150px] pointer-events-none -translate-y-1/2"></div>
        <div className="text-center mb-10 sm:mb-16 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Card Fusion</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Combine 3 cards of the same rarity to mint a new card of a higher tier. Higher rarity cards have better multipliers in tournaments.
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 md:p-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16">

            {/* Input Cards — 3 Epic cards */}
            <div className="flex -space-x-6 sm:-space-x-8 md:-space-x-12 group cursor-pointer">
              {['/images/browseruse.png', '/images/autumn.png', '/images/axiom.png'].map((src, i) => (
                <img key={i} src={src} alt="Epic card" className={`w-24 sm:w-32 md:w-40 aspect-[3/5] rounded-2xl shadow-xl object-cover transform transition-all duration-500 ${isFusing ? 'scale-0 opacity-0 translate-x-20' : fusionComplete ? 'scale-0 opacity-0' : 'group-hover:-translate-y-4'} ${i === 0 ? '-rotate-12' : i === 2 ? 'rotate-12' : 'z-10 -translate-y-2'}`} />
              ))}
            </div>

            {/* Fusion Animation / Button */}
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center relative transition-all duration-500 ${isFusing ? 'scale-150 shadow-[0_0_40px_rgba(255,255,255,0.15)]' : ''}`}>
                <div className={`absolute inset-0 rounded-full border-2 border-white/30 border-t-transparent ${isFusing ? 'animate-spin' : ''}`}></div>
                <MagicWand className={`w-6 h-6 text-white/60 ${isFusing ? 'animate-pulse' : ''}`} weight="fill" />
              </div>
              <button
                onClick={handleFuse}
                disabled={isFusing}
                className="group relative bg-white/10 text-white px-7 py-2.5 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 border border-white/20 hover:bg-white/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">{isFusing ? 'Fusing...' : fusionComplete ? 'Fuse Again' : 'Fuse Cards'}</span>
              </button>
            </div>

            {/* Output Card — hidden until fused */}
            <div className={`relative w-28 sm:w-40 md:w-48 aspect-[3/5] rounded-2xl overflow-hidden transform transition-all duration-1000 ${fusionComplete ? 'scale-100 opacity-100 shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 'scale-75 opacity-0 pointer-events-none'}`}>
              <img src={fusionResult} alt="Legendary card" className="w-full h-full object-cover rounded-2xl" />
            </div>

          </div>
        </div>
      </section>

      {/* NFT Marketplace Section */}
      <section id="marketplace" className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20 sm:pb-32 relative z-10 scroll-mt-24">
        <div className="absolute top-0 left-[-5%] w-[30%] h-[100%] rounded-full bg-purple-500/8 blur-[100px] md:blur-[120px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">NFT Marketplace</h2>
            <p className="text-gray-400 max-w-xl">
              Buy, sell, and trade your startup cards with other players. Build the perfect deck for the next tournament.
            </p>
          </div>
          <button onClick={() => scrollTo('waitlist')} className="group relative px-6 py-3 rounded-xl font-bold border border-white/20 hover:border-white/40 transition-all duration-300 whitespace-nowrap overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer">
            <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors duration-300">Explore Market</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {[
            { img: '/images/browseruse.png', price: '0.08' },
            { img: '/images/axiom.png', price: '0.04' },
            { img: '/images/autumn.png', price: '0.06' },
            { img: '/images/caretta.png', price: '0.02' },
          ].map((card, i) => (
            <div key={i} onClick={() => scrollTo('waitlist')} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[16px] sm:rounded-[24px] p-2.5 sm:p-4 hover:border-white/20 transition-colors group cursor-pointer">
              <div className="aspect-[3/5] rounded-lg sm:rounded-xl mb-2 sm:mb-3 relative overflow-hidden">
                <img src={card.img} alt="Card" className="w-full h-full rounded-xl" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-white">{card.price} ETH</span>
                <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/10 text-white/50 flex items-center justify-center text-xs sm:text-base group-hover:bg-white group-hover:text-black transition-all duration-300 group-hover:scale-110 shrink-0">
                  +
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24 relative z-10 scroll-mt-24">
        <div className="absolute bottom-0 right-[10%] w-[40%] h-[100%] rounded-full bg-purple-500/5 blur-[100px] md:blur-[150px] pointer-events-none"></div>
        <div className="bg-gradient-to-r from-white/[0.06] to-transparent border border-white/[0.1] rounded-[24px] sm:rounded-[40px] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Join the Waitlist</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Be the first to know when we launch. Enter your email and wallet address to secure your spot.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-gray-500 font-mono text-sm outline-none focus:border-[#A855F7] transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={waitlistWallet}
                  onChange={(e) => setWaitlistWallet(e.target.value)}
                  placeholder="0x..."
                  required
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-gray-500 font-mono text-sm outline-none focus:border-[#A855F7] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={waitlistSubmitting}
                className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-2xl font-bold text-base overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">{waitlistSubmitting ? 'Submitting...' : 'Join Waitlist'}</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </form>

            {waitlistMsg && (
              <div className={`mt-6 px-5 py-3 rounded-xl text-sm font-semibold inline-block ${waitlistMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {waitlistMsg.text}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 relative z-10 pb-20 md:pb-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <a href="#hero" className="text-2xl font-bold tracking-tighter">Attention<span className="text-[#A855F7]">X</span></a>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#leaderboard" className="hover:text-white transition-colors">Leagues</a>
            <a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a>
            <a href="#waitlist" className="hover:text-white transition-colors text-[#A855F7]">Waitlist</a>
          </div>
          <div className="text-sm text-gray-500">
            &copy; 2026 Attention<span className="text-[#A855F7]">X</span>. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
        <nav className="mx-4 mb-3 px-3 py-2 rounded-[28px] bg-[#050507]/80 backdrop-blur-[30px] border border-white/[0.08]">
          <div className="flex items-center gap-1">
            {([
              { id: 'hero', icon: House, label: 'Home' },
              { id: 'how-it-works', icon: Lightbulb, label: 'How' },
              { id: 'leaderboard', icon: Trophy, label: 'Leagues' },
              { id: 'marketplace', icon: Storefront, label: 'Market' },
            ] as const).map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollTo(tab.id)}
                  className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all duration-300 ${isActive
                    ? 'bg-white/[0.1] text-white'
                    : 'text-gray-500 active:scale-95'
                    }`}
                >
                  <tab.icon className="w-5 h-5" weight={isActive ? 'fill' : 'regular'} />
                  <span className={`text-[9px] mt-0.5 leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
