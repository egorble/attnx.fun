import { Trophy, TrendUp, Shield, MagicWand } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';

const API_BASE = 'https://app.attnx.fun';

interface TournamentData {
  id: number;
  name: string;
  prize_pool: string;
  status: string;
  end_date: string;
}

interface LeaderboardEntry {
  address: string;
  username: string;
  total_score: number;
  rank: number;
}

export default function App() {
  const [isFusing, setIsFusing] = useState(false);
  const [fusionComplete, setFusionComplete] = useState(false);
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Fetch active tournament
    fetch(`${API_BASE}/api/tournaments/active`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          setTournament(data);
          // Fetch leaderboard for active tournament
          fetch(`${API_BASE}/api/leaderboard/${data.id}`)
            .then(r => r.json())
            .then(lb => setLeaderboard(lb.slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!tournament?.end_date) return;
    const update = () => {
      const diff = new Date(tournament.end_date).getTime() - Date.now();
      if (diff <= 0) { setCountdown('Ended'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${d}d ${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [tournament?.end_date]);

  const handleFuse = () => {
    if (isFusing || fusionComplete) return;
    setIsFusing(true);
    setTimeout(() => {
      setIsFusing(false);
      setFusionComplete(true);
    }, 2000);
  };

  const shortenAddr = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-[#A855F7] selection:text-white overflow-hidden relative scroll-smooth">
      {/* Global Background for lower sections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent_10%,#000_40%,#000_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#A855F7_0%,transparent_100%)] opacity-[0.03]"></div>
      </div>

      <AnimatedBackground />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto relative z-10">
        <a href="#hero" className="text-2xl font-bold tracking-tighter">AttentionX</a>

        <div className="hidden md:flex items-center gap-8 bg-white/[0.03] backdrop-blur-xl px-8 py-3.5 rounded-full border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
          <a href="#hero" className="text-sm font-medium text-white hover:text-[#A855F7] transition-colors relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full">Home</a>
          <a href="#marketplace" className="text-sm font-medium text-gray-400 hover:text-[#A855F7] transition-colors">Marketplace</a>
          <a href="#leaderboard" className="text-sm font-medium text-gray-400 hover:text-[#A855F7] transition-colors">Leaderboard</a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-[#A855F7] transition-colors">How It Works</a>
        </div>

        <a href={`${API_BASE}`} target="_blank" rel="noopener noreferrer" className="bg-[#A855F7] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#9333EA] transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          Launch App
        </a>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="max-w-[1400px] mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[80%] rounded-full bg-[#A855F7]/15 blur-[150px] pointer-events-none"></div>
        {/* Left Column */}
        <div className="space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl p-1.5 pr-5 rounded-full border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <div className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold">
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
          <h1 className="text-[56px] lg:text-[72px] font-bold leading-[1.05] tracking-tight">
            The Ultimate <br />
            Startup Fantasy <br />
            Trading Game
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            Trade cards of top AI and YC startups. Build your portfolio, compete in weekly tournaments, and win real rewards based on real-world traction and hype.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <a href={`${API_BASE}`} target="_blank" rel="noopener noreferrer" className="bg-[#A855F7] text-white px-8 py-4 rounded-full font-bold hover:bg-[#9333EA] transition-colors shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              Get Started
            </a>
            <a href="#how-it-works" className="px-8 py-4 rounded-full font-bold border border-white/[0.15] bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.08] transition-colors">
              More Features
            </a>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="relative h-[600px] flex items-center justify-center [perspective:2000px]">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A855F7]/15 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Cards Container */}
          <div className="relative w-full max-w-[280px] aspect-[3/4] [transform-style:preserve-3d] group">

            {/* Card 3 (Back left) - Lovable */}
            <img src="/images/lovable.png" alt="Lovable" className="absolute inset-0 w-full h-full object-cover rounded-[24px] shadow-2xl transition-all duration-500 transform -rotate-12 -translate-x-20 translate-y-8 scale-90 group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-100 cursor-pointer" />

            {/* Card 2 (Back right) - Cursor */}
            <img src="/images/cursor.png" alt="Cursor" className="absolute inset-0 w-full h-full object-cover rounded-[24px] shadow-2xl transition-all duration-500 transform rotate-12 translate-x-20 translate-y-4 scale-95 group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-100 cursor-pointer" />

            {/* Card 1 (Front center) - OpenAI */}
            <img src="/images/openai.png" alt="OpenAI" className="absolute inset-0 w-full h-full object-cover rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(168,85,247,0.2)] transition-all duration-500 transform z-10 group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-105 cursor-pointer" />

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-[1400px] mx-auto px-6 pb-24 relative z-10 scroll-mt-24">
        <div className="absolute top-1/2 right-[-5%] w-[30%] h-[100%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none -translate-y-1/2"></div>
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {/* Feature 1 */}
          <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[32px] border border-white/[0.08] hover:border-[#A855F7]/30 hover:bg-white/[0.04] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6">
              <TrendUp className="w-5 h-5 text-white" weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Traction Data</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Card values fluctuate based on real-world metrics: Twitter mentions, GitHub stars, funding announcements, and product launches.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[32px] border border-white/[0.08] hover:border-[#A855F7]/30 hover:bg-white/[0.04] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-5 h-5 text-white" weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Weekly Tournaments</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Build your deck of 5 startups and compete against other degens. Top performing portfolios win a share of the prize pool.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-[32px] border border-white/[0.08] hover:border-[#A855F7]/30 hover:bg-white/[0.04] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-5 h-5 text-white" weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Fast Payouts</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Enjoy safe transactions, quick deposits, and instant withdrawals with trusted and encrypted crypto payments.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10 scroll-mt-24">
        <div className="absolute top-0 left-[20%] w-[60%] h-[100%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How AttentionX Works</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AttentionX is a game where you collect cards of YC startups, join leagues, and compete to win the prize pool powered by the Rise blockchain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#A855F7]/80 to-transparent -translate-y-1/2 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#050507] border-2 border-[#A855F7] flex items-center justify-center text-2xl font-bold text-[#A855F7] mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              1
            </div>
            <h3 className="text-2xl font-bold mb-3">Buy a Pack</h3>
            <p className="text-gray-400 leading-relaxed">
              Start your journey by purchasing a starter pack containing 5 random YC startup cards.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#050507] border-2 border-[#A855F7] flex items-center justify-center text-2xl font-bold text-[#A855F7] mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              2
            </div>
            <h3 className="text-2xl font-bold mb-3">Join Leagues</h3>
            <p className="text-gray-400 leading-relaxed">
              Enter weekly leagues with your best startup cards. Compete against other players based on real-world startup traction.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#050507] border-2 border-[#A855F7] flex items-center justify-center text-2xl font-bold text-[#A855F7] mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              3
            </div>
            <h3 className="text-2xl font-bold mb-3">Win on Rise</h3>
            <p className="text-gray-400 leading-relaxed">
              Top the leaderboard and win your share of the prize pool, distributed instantly and securely on the Rise blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* Prize Pool & Tournament Section */}
      <section id="leaderboard" className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10 scroll-mt-24">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[80%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none"></div>
        <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] rounded-[40px] p-10 md:p-16 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A855F7]/10 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#A855F7]/10 text-[#A855F7] px-4 py-2 rounded-full text-sm font-bold mb-6 border border-[#A855F7]/20">
                <Trophy className="w-4 h-4" weight="fill" />
                {tournament?.name || 'Weekly Tournament'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Win the Prize Pool</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Join the tournament, lock your 5 best NFT cards, and compete against other players. Top scorers win from the prize pool!
              </p>

              <div className="bg-black/40 border border-white/10 rounded-3xl p-8 inline-block">
                <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Current Prize Pool</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {tournament?.prize_pool || '0.162'}
                  </span>
                  <span className="text-2xl font-bold text-[#A855F7]">ETH</span>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {countdown ? <>Ends in: <span className="text-white font-mono">{countdown}</span></> : 'Loading...'}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A855F7]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="relative bg-white/[0.03] border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <span className="font-bold">Leaderboard</span>
                  <a href={`${API_BASE}`} target="_blank" rel="noopener noreferrer" className="text-[#A855F7] text-sm font-medium hover:underline">View All</a>
                </div>
                <div className="space-y-4">
                  {leaderboard.length > 0 ? leaderboard.map((entry, idx) => (
                    <div key={entry.address} className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : 'text-amber-600'}`}>#{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A855F7] to-purple-900"></div>
                          <span className="font-medium">{entry.username || shortenAddr(entry.address)}</span>
                        </div>
                      </div>
                      <span className="font-mono text-[#A855F7]">+{entry.total_score} pts</span>
                    </div>
                  )) : [1, 2, 3].map((pos) => (
                    <div key={pos} className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${pos === 1 ? 'text-yellow-400' : pos === 2 ? 'text-gray-300' : 'text-amber-600'}`}>#{pos}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A855F7] to-purple-900"></div>
                          <span className="font-medium text-gray-500">---</span>
                        </div>
                      </div>
                      <span className="font-mono text-gray-500">-- pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Fusion Section */}
      <section className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10">
        <div className="absolute top-1/2 right-[-10%] w-[50%] h-[80%] rounded-full bg-pink-500/10 blur-[150px] pointer-events-none -translate-y-1/2"></div>
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Card Fusion</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Combine 3 cards of the same rarity to mint a new card of a higher tier. Higher rarity cards have better multipliers in tournaments.
          </p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[40px] p-10 md:p-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">

            {/* Input Cards */}
            <div className="flex -space-x-8 md:-space-x-12 group cursor-pointer">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-32 md:w-40 aspect-[3/4] bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-xl rounded-2xl border border-blue-500/30 p-4 shadow-xl transform transition-all duration-500 ${isFusing ? 'scale-0 opacity-0 translate-x-20' : fusionComplete ? 'hidden' : 'group-hover:-translate-y-4'} ${i === 1 ? '-rotate-12' : i === 3 ? 'rotate-12' : 'z-10 -translate-y-2'}`}>
                  <div className="w-8 h-8 bg-white/10 rounded-lg mb-auto"></div>
                  <div className="mt-auto">
                    <div className="h-2 w-1/2 bg-white/20 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fusion Animation / Button */}
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/50 flex items-center justify-center relative transition-all duration-500 ${isFusing ? 'scale-150 shadow-[0_0_50px_rgba(168,85,247,0.8)]' : ''} ${fusionComplete ? 'hidden' : ''}`}>
                <div className={`absolute inset-0 rounded-full border-2 border-[#A855F7] border-t-transparent ${isFusing ? 'animate-spin' : ''}`}></div>
                <MagicWand className={`w-6 h-6 text-[#A855F7] ${isFusing ? 'animate-pulse' : ''}`} weight="fill" />
              </div>
              {!fusionComplete && (
                <button
                  onClick={handleFuse}
                  disabled={isFusing}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFusing ? 'Fusing...' : 'Fuse Cards'}
                </button>
              )}
            </div>

            {/* Output Card */}
            <div className={`w-40 md:w-48 aspect-[3/4] bg-gradient-to-b from-[#A855F7]/20 to-transparent backdrop-blur-xl rounded-2xl border border-[#A855F7]/50 p-4 shadow-[0_0_30px_rgba(168,85,247,0.3)] transform transition-all duration-1000 ${fusionComplete ? 'scale-110 shadow-[0_0_60px_rgba(168,85,247,0.6)]' : isFusing ? 'scale-50 opacity-0' : 'opacity-50 grayscale'}`}>
               <div className="flex justify-between items-start mb-auto">
                <div className="w-10 h-10 bg-[#A855F7] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">?</span>
                </div>
                <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider border border-purple-500/20 uppercase">Epic</span>
              </div>
              <div className="mt-auto">
                <div className="h-3 w-2/3 bg-white/40 rounded mb-2"></div>
                <div className="h-2 w-full bg-white/20 rounded"></div>
              </div>
              {fusionComplete && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setFusionComplete(false)}
                    className="bg-[#A855F7] text-white px-4 py-2 rounded-full font-bold text-xs"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* NFT Marketplace Section */}
      <section id="marketplace" className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10 scroll-mt-24">
        <div className="absolute top-0 left-[-5%] w-[30%] h-[100%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
          <div>
            <h2 className="text-4xl font-bold mb-4">NFT Marketplace</h2>
            <p className="text-gray-400 max-w-xl">
              Buy, sell, and trade your startup cards with other players. Build the perfect deck for the next tournament.
            </p>
          </div>
          <a href={`${API_BASE}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-colors whitespace-nowrap">
            Explore Market
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'OpenAI', img: '/images/openai.png', rarity: 'Legendary' },
            { name: 'Cursor', img: '/images/cursor.png', rarity: 'Legendary' },
            { name: 'Lovable', img: '/images/lovable.png', rarity: 'Legendary' },
            { name: 'Anthropic', img: '/images/anthropic.png', rarity: 'Legendary' },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-4 hover:border-[#A855F7]/30 transition-colors group cursor-pointer">
              <div className="aspect-[3/4] rounded-xl mb-4 relative overflow-hidden">
                <img src={card.img} alt={card.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{card.name}</div>
                  <div className="text-xs text-[#A855F7] font-bold">{card.rarity}</div>
                </div>
                <a href={`${API_BASE}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center group-hover:bg-[#A855F7] group-hover:text-white transition-colors">
                  +
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24 relative z-10">
        <div className="absolute bottom-0 right-[10%] w-[40%] h-[100%] rounded-full bg-[#A855F7]/15 blur-[150px] pointer-events-none"></div>
        <div className="bg-gradient-to-r from-[#A855F7]/20 to-transparent border border-[#A855F7]/30 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to play the market?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of players trading startup cards and winning real rewards on the Rise blockchain.
            </p>
            <a href={`${API_BASE}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#A855F7] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#9333EA] transition-colors shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              Start Trading Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#hero" className="text-2xl font-bold tracking-tighter">AttentionX</a>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
            <a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a>
          </div>
          <div className="text-sm text-gray-500">
            &copy; 2026 AttentionX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
