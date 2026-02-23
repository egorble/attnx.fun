import { Trophy, TrendUp, Shield, MagicWand } from '@phosphor-icons/react';
import { useState } from 'react';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function App() {
  const [isFusing, setIsFusing] = useState(false);
  const [fusionComplete, setFusionComplete] = useState(false);

  const handleFuse = () => {
    if (isFusing || fusionComplete) return;
    setIsFusing(true);
    setTimeout(() => {
      setIsFusing(false);
      setFusionComplete(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-[#A855F7] selection:text-white overflow-hidden relative">
      {/* Global Background for lower sections */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent_10%,#000_40%,#000_100%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#A855F7_0%,transparent_100%)] opacity-[0.03]"></div>
      </div>

      <AnimatedBackground />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto relative z-10">
        <div className="text-2xl font-bold tracking-tighter">AttentionX</div>
        
        <div className="hidden md:flex items-center gap-8 bg-white/[0.03] backdrop-blur-xl px-8 py-3.5 rounded-full border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
          <a href="#" className="text-sm font-medium text-white hover:text-[#A855F7] transition-colors relative after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full">Home</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-[#A855F7] transition-colors">Marketplace</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-[#A855F7] transition-colors">Leaderboard</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-[#A855F7] transition-colors">FAQ</a>
        </div>

        <button className="bg-[#A855F7] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#9333EA] transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          Log In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center relative z-10">
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
            <button className="bg-[#A855F7] text-white px-8 py-4 rounded-full font-bold hover:bg-[#9333EA] transition-colors shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-full font-bold border border-white/[0.15] bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.08] transition-colors">
              More Features
            </button>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="relative h-[600px] flex items-center justify-center [perspective:2000px]">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A855F7]/15 blur-[120px] rounded-full pointer-events-none"></div>
          
          {/* Cards Container */}
          <div className="relative w-full max-w-[320px] aspect-[3/4] [transform-style:preserve-3d] group">
            
            {/* Card 3 (Back left) - Lovable */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/90 to-[#050507]/40 backdrop-blur-md rounded-[32px] border border-white/[0.15] p-6 transform -rotate-12 -translate-x-20 translate-y-8 scale-90 shadow-2xl transition-all duration-500 flex flex-col group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-100 cursor-pointer">
              <div className="flex justify-between items-start mb-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <span className="bg-[#A855F7]/20 text-[#A855F7] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border border-[#A855F7]/30 uppercase">Legendary</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-bold mb-1">Lovable</h3>
                <p className="text-gray-400 text-sm mb-6">AI Software Engineer · W24</p>
                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valuation</span>
                    <span className="font-bold text-white">$6.6B</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hype Score</span>
                    <span className="font-bold text-white">96/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Weekly Change</span>
                    <span className="font-bold text-[#A855F7]">+18.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (Back right) - Cursor */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/90 to-[#050507]/40 backdrop-blur-md rounded-[32px] border border-white/[0.15] p-6 transform rotate-12 translate-x-20 translate-y-4 scale-95 shadow-2xl transition-all duration-500 flex flex-col group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-100 cursor-pointer">
              <div className="flex justify-between items-start mb-auto">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-white font-bold text-2xl">C</span>
                </div>
                <span className="bg-[#A855F7]/20 text-[#A855F7] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border border-[#A855F7]/30 uppercase">Legendary</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-bold mb-1">Cursor</h3>
                <p className="text-gray-400 text-sm mb-6">AI-first Code Editor · S23</p>
                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valuation</span>
                    <span className="font-bold text-white">$29.3B</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hype Score</span>
                    <span className="font-bold text-white">98/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Weekly Change</span>
                    <span className="font-bold text-[#A855F7]">+25.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 1 (Front center) - OpenAI */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/95 to-[#050507]/80 backdrop-blur-sm rounded-[32px] border border-[#A855F7]/50 p-6 transform z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(168,85,247,0.2)] transition-all duration-500 flex flex-col group-hover:opacity-30 hover:!opacity-100 hover:z-20 hover:-translate-y-4 hover:scale-105 cursor-pointer">
              <div className="flex justify-between items-start mb-auto">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1816a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A6.0651 6.0651 0 0 0 19.02 19.8184a5.9847 5.9847 0 0 0 3.9977-2.9001 6.051 6.051 0 0 0-.7358-7.0972Z" fill="#000"/>
                  </svg>
                </div>
                <span className="bg-[#A855F7]/20 text-[#A855F7] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border border-[#A855F7]/30 uppercase">Legendary</span>
              </div>

              <div className="mt-auto">
                <h3 className="text-3xl font-bold mb-1">OpenAI</h3>
                <p className="text-gray-400 text-sm mb-6">Leading AI Research Lab · S15</p>

                <div className="space-y-3 bg-black/40 p-5 rounded-2xl border border-white/5 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valuation</span>
                    <span className="font-bold text-white">$300B+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hype Score</span>
                    <span className="font-bold text-white">100/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Weekly Change</span>
                    <span className="font-bold text-[#A855F7]">+45.0%</span>
                  </div>
                </div>

                <button className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white py-3.5 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)] text-sm">
                  Trade Card
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24 relative z-10">
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
      <section className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10">
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
      <section className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[80%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none"></div>
        <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] rounded-[40px] p-10 md:p-16 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A855F7]/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#A855F7]/10 text-[#A855F7] px-4 py-2 rounded-full text-sm font-bold mb-6 border border-[#A855F7]/20">
                <Trophy className="w-4 h-4" weight="fill" />
                Weekly Tournament
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Win the Prize Pool</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Join the tournament, lock your 5 best NFT cards, and compete against other players. Top scorers win from the prize pool!
              </p>
              
              <div className="bg-black/40 border border-white/10 rounded-3xl p-8 inline-block">
                <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Current Prize Pool</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">0.162</span>
                  <span className="text-2xl font-bold text-[#A855F7]">ETH</span>
                </div>
                <div className="mt-4 text-sm text-gray-500">Ends in: <span className="text-white font-mono">2d 14h 32m</span></div>
              </div>
            </div>
            
            <div className="relative">
              {/* Decorative elements for tournament */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#A855F7]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="relative bg-white/[0.03] border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <span className="font-bold">Leaderboard</span>
                  <span className="text-[#A855F7] text-sm font-medium">View All</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((pos) => (
                    <div key={pos} className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${pos === 1 ? 'text-yellow-400' : pos === 2 ? 'text-gray-300' : 'text-amber-600'}`}>#{pos}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A855F7] to-purple-900"></div>
                          <span className="font-medium">degen_{pos}</span>
                        </div>
                      </div>
                      <span className="font-mono text-[#A855F7]">+{1500 - pos * 200} pts</span>
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
      <section className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10">
        <div className="absolute top-0 left-[-5%] w-[30%] h-[100%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
          <div>
            <h2 className="text-4xl font-bold mb-4">NFT Marketplace</h2>
            <p className="text-gray-400 max-w-xl">
              Buy, sell, and trade your startup cards with other players. Build the perfect deck for the next tournament.
            </p>
          </div>
          <button className="px-6 py-3 rounded-full font-bold border border-white/20 hover:bg-white/5 transition-colors whitespace-nowrap">
            Explore Market
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-4 hover:border-[#A855F7]/30 transition-colors group cursor-pointer">
              <div className="aspect-[3/4] bg-gradient-to-b from-white/5 to-transparent rounded-xl mb-4 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs font-mono border border-white/10">
                  #{1000 + i}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Startup #{i}</div>
                  <div className="font-bold">0.0{i * 2} ETH</div>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center group-hover:bg-[#A855F7] group-hover:text-white transition-colors">
                  +
                </button>
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
            <button className="bg-[#A855F7] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#9333EA] transition-colors shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              Start Trading Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold tracking-tighter">AttentionX</div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
          <div className="text-sm text-gray-500">
            © 2026 AttentionX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
