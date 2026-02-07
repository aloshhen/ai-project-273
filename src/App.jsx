import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as LucideIcons from 'lucide-react';

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safe Icon Component - renders Lucide icons dynamically
const SafeIcon = ({ name, size = 24, className, color }) => {
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const IconComponent = LucideIcons[pascalName] || LucideIcons.HelpCircle;

  return <IconComponent size={size} className={className} color={color} />;
};

// Custom Cursor Component - WHITE DOT ALWAYS
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorClass, setCursorClass] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const isButton = element.closest('button') || element.closest('a') || element.closest('[role="button"]');
        const isOrangeElement = element.closest('[data-cursor="orange"]') ||
                               element.classList.contains('text-[#FF4D00]') ||
                               element.classList.contains('bg-[#FF4D00]');
        const isChromeElement = element.closest('[data-cursor="chrome"]') ||
                                 element.classList.contains('card-chrome');
        const isDarkElement = element.closest('[data-cursor="dark"]') ||
                             element.classList.contains('bg-[#E5E5E5]') ||
                             element.classList.contains('text-[#050505]');

        if (isButton) {
          setCursorClass('hover-orange');
        } else if (isOrangeElement) {
          setCursorClass('hover-orange');
        } else if (isChromeElement) {
          setCursorClass('hover-chrome');
        } else if (isDarkElement) {
          setCursorClass('hover-dark');
        } else {
          setCursorClass('');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={cn("custom-cursor", cursorClass)}
      style={{ left: position.x, top: position.y }}
    />
  );
};

// SECTION 1: HERO - The Singularity - SPHERE CENTERED WITH TEXT ON TOP
const MercurySphere = () => {
  const sphereRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = sphereRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetRef.current = {
        x: (e.clientX - centerX) / 30,
        y: (e.clientY - centerY) / 30
      };
    };

    const animate = () => {
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.08;

      if (sphereRef.current) {
        sphereRef.current.style.transform = `
          translate(${mouseRef.current.x}px, ${mouseRef.current.y}px)
        `;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        ref={sphereRef}
        className="mercury-sphere w-80 h-80 md:w-[28rem] md:h-[28rem] lg:w-[36rem] lg:h-[36rem] animate-morph"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-96 h-96 md:w-[32rem] md:h-[32rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-[#E5E5E5]/10 blur-3xl"
        />
      </div>
    </div>
  );
};

// SECTION 2: TICKER - The Velocity Tape - ENSURE IT MOVES
const Ticker = () => {
  const [isPaused, setIsPaused] = useState(false);

  const tickerItems = [
    { label: "AETHER_STABLE", value: "1.0002", change: "+0.02%" },
    { label: "TOTAL_VALUE_LOCKED", value: "$2.4B", change: "+12.5%" },
    { label: "PROTOCOL_REVENUE", value: "$847K", change: "+8.3%" },
    { label: "STAKING_APY", value: "14.7%", change: "+2.1%" },
    { label: "LIQUIDITY_DEPTH", value: "$890M", change: "+5.7%" },
    { label: "GOVERNANCE_POWER", value: "89.2%", change: "+1.2%" },
    { label: "INSTANT_SWAPS_24H", value: "142.8K", change: "+23.1%" },
    { label: "TRANSMUTATION_FEE", value: "0.03%", change: "-0.01%" },
  ];

  return (
    <div
      className="w-full overflow-hidden border-y border-[#FF4D00]/20 bg-[#0a0a0a] py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-cursor="orange"
    >
      <div
        className="flex whitespace-nowrap animate-ticker"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 group"
          >
            <div className="flex items-center gap-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-lg px-4 py-2 group-hover:bg-[#FF4D00]/20 group-hover:border-[#FF4D00]/40 transition-all">
              <span className="font-mono text-xs text-[#E5E5E5]/50 tracking-wider uppercase">
                {item.label}
              </span>
              <span className="font-mono text-base text-[#E5E5E5] font-bold">
                {item.value}
              </span>
              <span className={cn(
                "font-mono text-xs px-2 py-0.5 rounded",
                item.change.startsWith('+') ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {item.change}
              </span>
            </div>
            <span className="text-[#FF4D00]/40 text-lg">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// NEW SECTION: THE ALCHEMICAL VAULT - Infinite horizontal scroll gallery
const AlchemicalVault = () => {
  const assets = [
    {
      symbol: 'ETH',
      name: 'ETHEREUM',
      fullName: 'Ethereum 2.0',
      color: 'from-purple-500 to-blue-600',
      price: '$3,247.82',
      change: '+12.4%',
      icon: 'diamond'
    },
    {
      symbol: 'BTC',
      name: 'BITCOIN',
      fullName: 'Bitcoin',
      color: 'from-orange-400 to-amber-600',
      price: '$67,432.18',
      change: '+8.2%',
      icon: 'circle'
    },
    {
      symbol: 'AU',
      name: 'GOLD',
      fullName: 'Digital Gold',
      color: 'from-yellow-300 to-yellow-600',
      price: '$2,145.30',
      change: '+3.1%',
      icon: 'hexagon'
    },
    {
      symbol: 'USD',
      name: 'DOLLAR',
      fullName: 'USDC Stable',
      color: 'from-green-400 to-emerald-600',
      price: '$1.00',
      change: '+0.01%',
      icon: 'triangle'
    },
    {
      symbol: 'SOL',
      name: 'SOLANA',
      fullName: 'Solana',
      color: 'from-purple-400 to-pink-600',
      price: '$178.45',
      change: '+24.7%',
      icon: 'zap'
    },
    {
      symbol: 'AVAX',
      name: 'AVALANCHE',
      fullName: 'Avalanche',
      color: 'from-red-400 to-red-600',
      price: '$42.18',
      change: '+15.3%',
      icon: 'activity'
    },
  ];

  // Duplicate assets 4 times for seamless infinite scroll
  const duplicatedAssets = [...assets, ...assets, ...assets, ...assets];

  return (
    <div className="py-20 overflow-hidden">
      {/* Section Header - Same style as other headings, white color */}
      <div className="container mx-auto px-4 md:px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white tracking-tighter">
            The Alchemical <span className="text-white">Vault</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg mt-6 max-w-2xl mx-auto">
            Assets in perpetual motion
          </p>
        </motion.div>
      </div>

      {/* Infinite Horizontal Scroll */}
      <div className="relative h-[420px] overflow-hidden">
        <div className="infinite-scroll-container absolute flex gap-6 items-center h-full px-4">
          {duplicatedAssets.map((asset, index) => (
            <VaultCard key={`${asset.symbol}-${index}`} asset={asset} />
          ))}
        </div>
      </div>

      {/* Technical Specs */}
      <div className="container mx-auto px-4 md:px-6 mt-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { label: 'TOTAL_LOCKED', value: '$2.4B', subtext: 'Across all assets' },
            { label: 'YIELD_RATE', value: '12.8%', subtext: 'APY average' },
            { label: 'LIQUIDITY', value: 'INSTANT', subtext: 'Zero slippage' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-gradient-border p-6 rounded-xl hover:border-[#FF4D00]/30 transition-all duration-500 group"
            >
              <div className="font-mono text-[10px] text-gray-500 mb-2 tracking-widest">
                {stat.label}
              </div>
              <div className="font-serif text-4xl font-bold text-white mb-1 group-hover:text-[#FF4D00] transition-colors">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-gray-600">
                {stat.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Vault Card Component for infinite scroll
const VaultCard = ({ asset }) => {
  return (
    <motion.div
      className="relative w-80 h-[400px] flex-shrink-0 group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 glass-card rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-[#FF4D00]">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10",
          asset.color
        )} />

        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[10px] text-gray-600 mb-1">
                ASSET
              </div>
              <div className="font-serif text-4xl font-bold text-white">
                {asset.symbol}
              </div>
              <div className="font-mono text-[10px] text-gray-500 mt-1">
                {asset.fullName}
              </div>
            </div>

            <div className={cn(
              "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center",
              asset.color
            )}>
              <SafeIcon name={asset.icon} size={24} className="text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="font-mono text-2xl font-bold text-white">
                {asset.price}
              </div>
              <div className={cn(
                "font-mono text-sm font-medium",
                asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              )}>
                {asset.change}
              </div>
            </div>

            <div className="flex gap-[2px] h-12 items-end">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t bg-gradient-to-t",
                    asset.color
                  )}
                  style={{
                    height: `${30 + Math.random() * 70}%`,
                    opacity: 0.6,
                  }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                />
              ))}
            </div>
          </div>

          <button className="mt-6 w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all font-mono text-xs tracking-widest text-gray-300 hover:text-white">
            TRADE_{asset.symbol}
          </button>
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className={cn(
            "absolute top-0 right-0 w-full h-full bg-gradient-to-bl opacity-20",
            asset.color
          )} />
        </div>
      </div>
    </motion.div>
  );
};

// SECTION 3: BENTO - The Alchemical Triad
const BentoFeatures = () => {
  const features = [
    {
      icon: "refresh-cw",
      title: "Instant Transmutation",
      subtitle: "Exchange",
      description: "Convert any asset to any other in milliseconds. Zero slippage, infinite liquidity through quantum bonding curves.",
      blueprint: "LIQUIDITY_POOL_V3 // ATOMIC_SWAPS // MEV_PROTECTION"
    },
    {
      icon: "shield",
      title: "Neural Security",
      subtitle: "Protection",
      description: "AI-powered threat detection monitors every transaction. Self-healing smart contracts with automatic exploit patching.",
      blueprint: "NEURAL_NET_V9 // PREDICTIVE_ANALYSIS // AUTO_PATCH"
    },
    {
      icon: "trending-up",
      title: "Infinite Yield",
      subtitle: "Staking",
      description: "Dynamic yield optimization across 47 protocols. Your assets work 24/7, compounding every block.",
      blueprint: "YIELD_ROUTER_V4 // AUTO_COMPOUND // RISK_ENGINE"
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-serif text-5xl md:text-8xl font-black text-white mb-16 text-center tracking-tighter"
      >
        The Alchemical <span className="text-white">Triad</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-8 relative overflow-hidden group min-h-[400px] flex flex-col"
            data-cursor="orange"
          >
            <div className="blueprint-overlay absolute inset-0 pointer-events-none" />

            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl bg-[#FF4D00]/10 flex items-center justify-center group-hover:bg-[#FF4D00]/20 transition-colors">
                  <SafeIcon name={feature.icon} size={32} className="text-[#FF4D00]" />
                </div>
                <span className="font-mono text-xs text-[#E5E5E5]/40 tracking-widest">
                  {feature.subtitle.toUpperCase()}
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#FF4D00] transition-colors">
                {feature.title}
              </h3>

              <p className="font-mono text-sm text-[#E5E5E5]/70 leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="font-mono text-xs text-[#FF4D00]/60 border border-[#FF4D00]/30 rounded p-3 bg-[#FF4D00]/5">
                  {feature.blueprint}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SECTION 4: THE FORGE - Interactive Asset Melt with glassmorphism like Bento
const Forge = () => {
  const [hoveredAsset, setHoveredAsset] = useState(null);
  const [meltProgress, setMeltProgress] = useState({ gold: 0, btc: 0, eth: 0 });

  const assets = [
    {
      id: 'gold',
      name: 'AETHER_GOLD',
      symbol: 'AU',
      icon: 'circle',
      color: '#FFD700',
      apy: '8.4%',
      desc: 'Physical gold tokenized and liquified for instant transfers'
    },
    {
      id: 'btc',
      name: 'BITCOIN_WRAPPED',
      symbol: 'WBTC',
      icon: 'bitcoin',
      color: '#F7931A',
      apy: '12.1%',
      desc: 'Bitcoin unleashed from its blockchain constraints'
    },
    {
      id: 'eth',
      name: 'ETHEREUM_LIQUID',
      symbol: 'STETH',
      icon: 'diamond',
      color: '#627EEA',
      apy: '15.7%',
      desc: 'Staked ETH that flows like water through DeFi'
    },
  ];

  const handleMouseMove = (e, assetId) => {
    if (hoveredAsset === assetId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const progress = Math.min((y / rect.height) * 100, 100);
      setMeltProgress(prev => ({ ...prev, [assetId]: progress }));
    }
  };

  return (
    <div className="py-20 px-4 md:px-6 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            The <span className="text-white">Forge</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg max-w-2xl mx-auto">
            Hard assets turned into liquid opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredAsset(asset.id)}
              onMouseLeave={() => {
                setHoveredAsset(null);
                setMeltProgress(prev => ({ ...prev, [asset.id]: 0 }));
              }}
              onMouseMove={(e) => handleMouseMove(e, asset.id)}
              className="relative group"
              data-cursor="orange"
            >
              {/* Glassmorphism card like Bento with blueprint overlay */}
              <div className="glass-card rounded-2xl overflow-hidden relative min-h-[400px] flex flex-col">
                <div className="blueprint-overlay absolute inset-0 pointer-events-none" />

                {/* Melt effect */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out opacity-60 z-0"
                  style={{
                    height: `${meltProgress[asset.id]}%`,
                    background: `linear-gradient(to top, ${asset.color}40, ${asset.color}20, transparent)`,
                    filter: 'blur(20px)'
                  }}
                />

                <div className="relative z-10 p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${asset.color}15`,
                        border: `1px solid ${asset.color}30`
                      }}
                      animate={hoveredAsset === asset.id ? {
                        scale: [1, 1.05, 1],
                        rotate: [0, 360]
                      } : {}}
                      transition={{ duration: 2, repeat: hoveredAsset === asset.id ? Infinity : 0, ease: "linear" }}
                    >
                      <SafeIcon
                        name={asset.icon}
                        size={40}
                        color={asset.color}
                        className={cn(
                          "transition-all duration-300",
                          hoveredAsset === asset.id && "drop-shadow-lg"
                        )}
                      />
                    </motion.div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-[#E5E5E5]/40 tracking-widest uppercase">Symbol</div>
                      <div className="font-mono text-lg text-white font-bold">{asset.symbol}</div>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-[#FF4D00] transition-colors">
                    {asset.name}
                  </h3>

                  <p className="font-mono text-sm text-[#E5E5E5]/50 mb-6 leading-relaxed flex-1">
                    {asset.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]/10">
                    <div className="flex items-center gap-2">
                      <SafeIcon name="zap" size={16} className="text-[#FF4D00]" />
                      <span className="font-mono text-xs text-[#E5E5E5]/50 uppercase">Yield</span>
                    </div>
                    <span className="font-mono text-xl font-bold" style={{ color: asset.color }}>
                      {asset.apy}
                    </span>
                  </div>
                </div>

                {/* Bottom glow line like Bento */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// SECTION 5: THE PULSE - Heartbeat of the Protocol
const Pulse = () => {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [distortSection, setDistortSection] = useState(false);

  const handleClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setDistortSection(true);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);

    setTimeout(() => setDistortSection(false), 300);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative py-32 overflow-hidden select-none"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="particle-wave"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
          >
            <motion.div
              className="absolute w-1 bg-[#FF4D00]/30 rounded-full"
              style={{
                left: `${(i / 50) * 100}%`,
                height: '200px',
                top: '50%',
                transformOrigin: 'center',
              }}
              animate={{
                scaleY: [0.3, 1, 0.3],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05,
              }}
            />
          </motion.div>
        ))}
      </div>

      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      <div className={cn(
        "container mx-auto px-4 md:px-6 relative z-10 text-center",
        distortSection && "text-distort"
      )}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            The <span className="text-white">Pulse</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Heartbeat of the Protocol
          </p>
          <p className="font-mono text-[#E5E5E5]/40 text-sm">
            Click anywhere to create ripples • Real-time network activity visualization
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        {[
          { label: 'BLOCKS_MINED', value: '14,892,401' },
          { label: 'GAS_OPTIMIZED', value: '99.97%' },
          { label: 'UPTIME', value: '99.999%' },
          { label: 'NODES_ACTIVE', value: '4,721' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="font-mono text-3xl md:text-4xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="font-mono text-xs text-[#E5E5E5]/40 tracking-widest">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SECTION 6: THE VAULT TIERS - Membership Evolution
const VaultTiers = () => {
  const tiers = [
    {
      name: 'Iron',
      stake: '1,000 AETH',
      apy: '12%',
      features: ['Basic Yield', 'Standard Swaps', 'Community Access'],
      color: '#525252',
      bgColor: 'from-gray-800 to-gray-900',
      isIron: true
    },
    {
      name: 'Chrome',
      stake: '10,000 AETH',
      apy: '18%',
      features: ['Enhanced Yield', 'Zero Fees', 'Priority Support', 'Governance Vote'],
      color: '#E5E5E5',
      bgColor: 'from-gray-300 to-gray-400',
      isChrome: true
    },
    {
      name: 'Flare',
      stake: '100,000 AETH',
      apy: '27%',
      features: ['Maximum Yield', 'Negative Fees', 'Dedicated Manager', 'Protocol Revenue Share', 'Early Access'],
      color: '#FF4D00',
      bgColor: 'from-orange-500 to-orange-700',
      isFlare: true
    }
  ];

  return (
    <div className="py-20 px-4 md:px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            Vault <span className="text-white">Tiers</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg">
            Membership Evolution
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ perspective: '1000px' }}>
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, rotateY: -30 }}
              whileInView={{ opacity: 0.9, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ rotateY: 10, rotateX: 5, z: 50 }}
              className={cn(
                "card-3d relative rounded-2xl p-8 overflow-hidden",
                tier.isChrome ? "card-chrome" : tier.isFlare ? "bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700" : `bg-gradient-to-b ${tier.bgColor}`
              )}
              style={{ opacity: 0.9 }}
              data-cursor={tier.isChrome ? "chrome" : tier.isFlare ? "orange" : "dark"}
            >
              <div className="relative z-10 mb-8">
                <h3 className={cn(
                  "font-serif text-3xl font-black mb-2",
                  tier.isChrome ? "text-gray-900" : "text-white"
                )}>
                  {tier.name}
                </h3>
                <div className={cn(
                  "font-mono text-sm",
                  tier.isChrome ? "text-gray-700" : tier.isFlare ? "text-white/80" : "text-[#E5E5E5]/60"
                )}>
                  Stake: {tier.stake}
                </div>
              </div>

              <div className={cn(
                "relative z-10 inline-block px-6 py-3 rounded-full mb-8 border-2",
                tier.isChrome
                  ? "border-gray-900 bg-gray-900/10"
                  : tier.isFlare
                    ? "border-white bg-white/20"
                    : "border-[#FF4D00] bg-[#FF4D00]/10"
              )}>
                <span className={cn(
                  "font-mono text-3xl font-bold",
                  tier.isChrome ? "text-gray-900" : tier.isFlare ? "text-white" : "text-white"
                )}>
                  {tier.apy}
                </span>
                <span className={cn(
                  "font-mono text-sm ml-1",
                  tier.isChrome ? "text-gray-700" : tier.isFlare ? "text-white/80" : "text-[#FF4D00]/70"
                )}>
                  APY
                </span>
              </div>

              <ul className="relative z-10 space-y-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className={cn(
                    "flex items-center gap-3 font-mono text-sm",
                    tier.isChrome ? "text-gray-800" : tier.isFlare ? "text-white/90" : "text-[#E5E5E5]/80"
                  )}>
                    <SafeIcon
                      name="check"
                      size={16}
                      className={tier.isChrome ? "text-gray-900" : tier.isFlare ? "text-white" : "text-[#FF4D00]"}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={cn(
                "relative z-10 w-full mt-8 py-4 rounded-xl font-mono font-bold transition-all transform hover:scale-105",
                tier.isChrome
                  ? "bg-gray-900 text-[#E5E5E5] hover:bg-gray-800"
                  : tier.isFlare
                    ? "bg-white text-orange-600 hover:bg-gray-100"
                    : "bg-[#E5E5E5] text-[#050505] hover:bg-white"
              )}>
                Select {tier.name}
              </button>

              {tier.isChrome && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CONTACT FORM COMPONENT
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="py-20 px-4 md:px-6 bg-[#050505]">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            Initialize <span className="text-white">Contact</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg">
            Establish connection with the protocol
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 md:p-12"
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-[#FF4D00]/20 flex items-center justify-center mx-auto mb-6">
                <SafeIcon name="check" size={40} className="text-[#FF4D00]" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-white mb-4">Transmission Complete</h3>
              <p className="font-mono text-[#E5E5E5]/60">Your message has been received by the protocol.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs text-[#E5E5E5]/50 uppercase tracking-wider mb-2">Identity</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full bg-[#0a0a0a] border border-[#E5E5E5]/10 rounded-xl px-4 py-3 font-mono text-[#E5E5E5] placeholder-[#E5E5E5]/30 focus:border-[#FF4D00] focus:outline-none transition-colors"
                    placeholder="Enter your designation"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#E5E5E5]/50 uppercase tracking-wider mb-2">Channel</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full bg-[#0a0a0a] border border-[#E5E5E5]/10 rounded-xl px-4 py-3 font-mono text-[#E5E5E5] placeholder-[#E5E5E5]/30 focus:border-[#FF4D00] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs text-[#E5E5E5]/50 uppercase tracking-wider mb-2">Transmission</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-[#E5E5E5]/10 rounded-xl px-4 py-3 font-mono text-[#E5E5E5] placeholder-[#E5E5E5]/30 focus:border-[#FF4D00] focus:outline-none transition-colors resize-none"
                  placeholder="Enter your message to the protocol..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF4D00] hover:bg-[#ff6a2b] disabled:bg-[#FF4D00]/50 text-[#050505] font-mono font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <SafeIcon name="send" size={20} />
                    Transmit Message
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// SECTION 7: FOOTER - The Core Integration
const Footer = () => {
  const footerRef = useRef(null);
  const [isFlooded, setIsFlooded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setIsFlooded(true);
        }
      },
      { threshold: 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden transition-all duration-1000",
        isFlooded ? "bg-[#FF4D00]" : "bg-[#050505]"
      )}
    >
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-all duration-1000 ease-out",
        isFlooded ? "opacity-100" : "opacity-0"
      )}>
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#FF4D00"
            fillOpacity="1"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,192C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <h2 className={cn(
          "font-serif text-6xl md:text-9xl font-black mb-8 tracking-tighter transition-colors duration-500",
          isFlooded ? "text-[#050505]" : "text-white"
        )}>
          JACK INTO<br />
          <span className={isFlooded ? "text-white" : "text-white"}>
            AETHER
          </span>
        </h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-12 py-6 rounded-full font-mono text-xl font-bold transition-all duration-300",
            isFlooded
              ? "bg-[#050505] text-[#FF4D00] hover:bg-[#1a1a1a]"
              : "bg-[#FF4D00] text-[#050505] hover:bg-[#ff6a2b]"
          )}
        >
          Initialize Connection
        </motion.button>

        <div className={cn(
          "mt-16 font-mono text-sm transition-colors duration-500",
          isFlooded ? "text-[#050505]/60" : "text-[#E5E5E5]/40"
        )}>
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <a href="#" className="hover:text-[#FF4D00] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[#FF4D00] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#FF4D00] transition-colors">Discord</a>
            <a href="#" className="hover:text-[#FF4D00] transition-colors">Twitter</a>
          </div>
          <p>© 2024 AETHER PROTOCOL. All rights reserved.</p>
          <p className="mt-2 text-xs">Liquid Chrome Alchemy • High-End Brutalism</p>
        </div>
      </motion.div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute w-2 h-2 rounded-full",
            isFlooded ? "bg-[#050505]/20" : "bg-[#FF4D00]/20"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </footer>
  );
};

// Navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
      scrolled ? "bg-[#050505]/90 backdrop-blur-md border-[#E5E5E5]/10" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-white tracking-tight">
          AETHER
        </span>

        <div className="hidden md:flex items-center gap-8">
          {['Vault', 'Forge', 'Pulse', 'Connect'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="font-mono text-sm text-[#E5E5E5]/60 hover:text-[#FF4D00] transition-colors tracking-wider"
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <button className="bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] px-6 py-2 rounded-full font-mono font-bold text-sm transition-all">
          Launch App
        </button>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] overflow-x-hidden">
      <CustomCursor />
      <div className="grainy-noise" />

      <Navigation />

      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <MercurySphere />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
            WEALTH IN <span className="text-white">CONSTANT</span><br />
            MOTION
          </h1>
          <p className="font-mono text-[#E5E5E5]/80 text-lg md:text-xl max-w-2xl mx-auto mt-8 drop-shadow-lg">
            The Singularity. A protocol manifesting liquid chrome alchemy into decentralized finance.
          </p>
        </motion.div>
      </section>

      <Ticker />

      <section id="vault">
        <AlchemicalVault />
      </section>

      <section id="bento">
        <BentoFeatures />
      </section>

      <section id="forge">
        <Forge />
      </section>

      <section id="pulse">
        <Pulse />
      </section>

      <section id="tiers">
        <VaultTiers />
      </section>

      <section id="connect">
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
}

export default App;