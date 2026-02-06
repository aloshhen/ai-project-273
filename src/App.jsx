import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safe Icon Component - renders Lucide icons dynamically
const SafeIcon = ({ name, size = 24, className, color }) => {
  const iconRef = useRef(null);
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadIcon = async () => {
      try {
        const module = await import('lucide-react');
        const iconName = name
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');

        if (isMounted && module[iconName]) {
          setIconComponent(() => module[iconName]);
        } else if (isMounted) {
          // Fallback to HelpCircle
          setIconComponent(() => module.HelpCircle || module.Circle);
        }
      } catch (error) {
        console.warn(`Icon ${name} not found`);
      }
    };

    loadIcon();
    return () => { isMounted = false; };
  }, [name]);

  if (!IconComponent) {
    return <div className={cn("animate-pulse bg-gray-800 rounded", className)} style={{ width: size, height: size }} />;
  }

  return <IconComponent size={size} className={className} color={color} />;
};

// SECTION 1: HERO - The Singularity
const MercurySphere = () => {
  const [velocity, setVelocity] = useState(0);
  const [isSplatter, setIsSplatter] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const sphereRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastTime.current;

      if (dt > 50) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const vel = distance / dt;

        setVelocity(vel);

        if (vel > 1.5 && !isSplatter) {
          setIsSplatter(true);
          setTimeout(() => setIsSplatter(false), 300);
        }

        lastMousePos.current = { x: e.clientX, y: e.clientY };
        lastTime.current = now;
      }

      // Parallax effect
      if (sphereRef.current) {
        const rect = sphereRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - centerX) / 50;
        const offsetY = (e.clientY - centerY) / 50;

        sphereRef.current.style.transform = `
          translate(${offsetX}px, ${offsetY}px)
          scale(${1 + velocity * 0.05})
        `;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isSplatter]);

  return (
    <div className="relative flex items-center justify-center py-20">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        ref={sphereRef}
        className={cn(
          "mercury-sphere w-64 h-64 md:w-96 md:h-96 animate-morph",
          isSplatter && "splatter"
        )}
        style={{
          filter: `blur(${Math.min(velocity * 2, 3)}px) contrast(${1 + velocity * 0.1})`
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-[#E5E5E5]/10 blur-3xl"
        />
      </div>
    </div>
  );
};

// SECTION 2: TICKER - The Velocity Tape
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
      className="w-full overflow-hidden border-y border-[#E5E5E5]/10 bg-black/50 backdrop-blur-sm py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={cn(
        "flex whitespace-nowrap",
        !isPaused && "animate-ticker"
      )} style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-8 chromatic-text cursor-pointer"
            data-text={`${item.label}: ${item.value} ${item.change}`}
          >
            <span className="font-mono text-sm text-[#E5E5E5]/60 tracking-wider">
              {item.label}
            </span>
            <span className="font-mono text-lg text-[#E5E5E5] font-bold">
              {item.value}
            </span>
            <span className={cn(
              "font-mono text-sm",
              item.change.startsWith('+') ? "text-green-500" : "text-red-500"
            )}>
              {item.change}
            </span>
            <span className="text-[#FF4D00]/30 mx-4">◆</span>
          </div>
        ))}
      </div>
    </div>
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
        className="font-serif text-4xl md:text-6xl font-black text-[#E5E5E5] mb-16 text-center tracking-tight"
      >
        The Alchemical <span className="text-[#FF4D00]">Triad</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-8 relative overflow-hidden group min-h-[400px] flex flex-col"
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

              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#E5E5E5] mb-4 group-hover:text-[#FF4D00] transition-colors">
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

// SECTION 4: THE FORGE - Interactive Asset Melt
const Forge = () => {
  const [hoveredAsset, setHoveredAsset] = useState(null);
  const [trails, setTrails] = useState([]);
  const containerRef = useRef(null);

  const assets = [
    { id: 'gold', name: 'AETHER_GOLD', symbol: 'AU', icon: 'circle', color: '#FFD700', apy: '8.4%' },
    { id: 'btc', name: 'BITCOIN_WRAPPED', symbol: 'WBTC', icon: 'bitcoin', color: '#F7931A', apy: '12.1%' },
    { id: 'eth', name: 'ETHEREUM_LIQUID', symbol: 'STETH', icon: 'diamond', color: '#627EEA', apy: '15.7%' },
  ];

  const handleMouseMove = (e, assetId) => {
    if (hoveredAsset === assetId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newTrail = {
        id: Date.now() + Math.random(),
        x,
        y,
        color: assets.find(a => a.id === assetId).color
      };

      setTrails(prev => [...prev.slice(-10), newTrail]);

      setTimeout(() => {
        setTrails(prev => prev.filter(t => t.id !== newTrail.id));
      }, 1000);
    }
  };

  return (
    <div className="py-20 px-4 md:px-6" ref={containerRef}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-black text-[#E5E5E5] mb-6 tracking-tight">
            The <span className="text-[#FF4D00]">Forge</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg max-w-2xl mx-auto">
            Hard assets turned into liquid opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredAsset(asset.id)}
              onMouseLeave={() => setHoveredAsset(null)}
              onMouseMove={(e) => handleMouseMove(e, asset.id)}
              className="relative group cursor-pointer"
            >
              <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#E5E5E5]/10 hover:border-[#E5E5E5]/30 transition-all overflow-hidden">
                {/* Melt trails */}
                {trails.filter(t => hoveredAsset === asset.id).map(trail => (
                  <div
                    key={trail.id}
                    className="melt-trail absolute w-1 rounded-full"
                    style={{
                      left: trail.x,
                      top: trail.y,
                      background: `linear-gradient(to bottom, ${trail.color}, transparent)`
                    }}
                  />
                ))}

                <div className="relative z-10 text-center">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${asset.color}20` }}
                    animate={hoveredAsset === asset.id ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <SafeIcon
                      name={asset.icon}
                      size={48}
                      color={asset.color}
                      className={cn(
                        "transition-all duration-300",
                        hoveredAsset === asset.id && "blur-[2px]"
                      )}
                    />
                  </motion.div>

                  <h3 className="font-serif text-2xl font-bold text-[#E5E5E5] mb-2">
                    {asset.name}
                  </h3>
                  <p className="font-mono text-sm text-[#E5E5E5]/50 mb-4">
                    {asset.symbol}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-[#FF4D00]/10 rounded-full px-4 py-2">
                    <SafeIcon name="zap" size={16} className="text-[#FF4D00]" />
                    <span className="font-mono text-[#FF4D00] font-bold">
                      {asset.apy} APY
                    </span>
                  </div>
                </div>

                {/* Liquid effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#E5E5E5]/5 to-transparent"
                  initial={{ opacity: 0, y: '100%' }}
                  animate={hoveredAsset === asset.id ? { opacity: 1, y: 0 } : { opacity: 0, y: '100%' }}
                  transition={{ duration: 0.4 }}
                />
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
      className="relative py-32 overflow-hidden cursor-pointer select-none"
    >
      {/* Particle Wave */}
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

      {/* Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x - 250,
            top: ripple.y - 250,
          }}
        />
      ))}

      {/* Content */}
      <div className={cn(
        "container mx-auto px-4 md:px-6 relative z-10 text-center",
        distortSection && "text-distort"
      )}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-[#E5E5E5] mb-6 tracking-tighter">
            The <span className="text-[#FF4D00]">Pulse</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Heartbeat of the Protocol
          </p>
          <p className="font-mono text-[#E5E5E5]/40 text-sm">
            Click anywhere to create ripples • Real-time network activity visualization
          </p>
        </motion.div>
      </div>

      {/* Stats */}
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
            <div className="font-mono text-3xl md:text-4xl font-bold text-[#E5E5E5] mb-2">
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
      bgColor: 'from-gray-800 to-gray-900'
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
      bgColor: 'from-orange-600 to-orange-700'
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
          <h2 className="font-serif text-4xl md:text-6xl font-black text-[#E5E5E5] mb-6 tracking-tight">
            Vault <span className="text-[#FF4D00]">Tiers</span>
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
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ rotateY: 10, rotateX: 5, z: 50 }}
              className={cn(
                "card-3d relative rounded-2xl p-8 overflow-hidden",
                tier.isChrome ? "card-chrome" : `bg-gradient-to-b ${tier.bgColor}`
              )}
            >
              {/* Tier Header */}
              <div className="relative z-10 mb-8">
                <h3 className={cn(
                  "font-serif text-3xl font-black mb-2",
                  tier.isChrome ? "text-gray-900" : "text-[#E5E5E5]"
                )}>
                  {tier.name}
                </h3>
                <div className={cn(
                  "font-mono text-sm",
                  tier.isChrome ? "text-gray-700" : "text-[#E5E5E5]/60"
                )}>
                  Stake: {tier.stake}
                </div>
              </div>

              {/* APY Badge */}
              <div className={cn(
                "relative z-10 inline-block px-6 py-3 rounded-full mb-8 border-2",
                tier.isChrome
                  ? "border-gray-900 bg-gray-900/10"
                  : "border-[#FF4D00] bg-[#FF4D00]/10"
              )}>
                <span className={cn(
                  "font-mono text-3xl font-bold",
                  tier.isChrome ? "text-gray-900" : "text-[#FF4D00]"
                )}>
                  {tier.apy}
                </span>
                <span className={cn(
                  "font-mono text-sm ml-1",
                  tier.isChrome ? "text-gray-700" : "text-[#FF4D00]/70"
                )}>
                  APY
                </span>
              </div>

              {/* Features */}
              <ul className="relative z-10 space-y-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className={cn(
                    "flex items-center gap-3 font-mono text-sm",
                    tier.isChrome ? "text-gray-800" : "text-[#E5E5E5]/80"
                  )}>
                    <SafeIcon
                      name="check"
                      size={16}
                      className={tier.isChrome ? "text-gray-900" : "text-[#FF4D00]"}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className={cn(
                "relative z-10 w-full mt-8 py-4 rounded-xl font-mono font-bold transition-all transform hover:scale-105",
                tier.isChrome
                  ? "bg-gray-900 text-[#E5E5E5] hover:bg-gray-800"
                  : "bg-[#E5E5E5] text-[#050505] hover:bg-white"
              )}>
                Select {tier.name}
              </button>

              {/* Reflection overlay for Chrome card */}
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
      {/* Wave animation overlay */}
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
          isFlooded ? "text-[#050505]" : "text-[#E5E5E5]"
        )}>
          JACK INTO<br />
          <span className={isFlooded ? "text-white" : "text-[#FF4D00]"}>
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
          <div className="flex items-center justify-center gap-8 mb-8">
            <a href="#" className="hover:text-[#FF4D00] transition-colors">Documentation</a>
            <a href="#" className="hover:text-[#FF4D00] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#FF4D00] transition-colors">Discord</a>
            <a href="#" className="hover:text-[#FF4D00] transition-colors">Twitter</a>
          </div>
          <p>© 2024 AETHER PROTOCOL. All rights reserved.</p>
          <p className="mt-2 text-xs">Liquid Chrome Alchemy • High-End Brutalism</p>
        </div>
      </motion.div>

      {/* Floating particles */}
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5E5E5] to-[#525252] flex items-center justify-center">
            <span className="font-serif font-black text-[#050505] text-lg">A</span>
          </div>
          <span className="font-serif text-xl font-bold text-[#E5E5E5] hidden md:block">
            AETHER
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Forge', 'Pulse', 'Vault', 'Connect'].map((item) => (
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
      <Navigation />

      {/* SECTION 1: HERO */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center px-4"
        >
          <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4">
            WEALTH IN<br />
            <span className="text-[#FF4D00]">CONSTANT</span><br />
            MOTION
          </h1>
          <p className="font-mono text-[#E5E5E5]/60 text-lg md:text-xl max-w-2xl mx-auto mt-8">
            The Singularity. A protocol manifesting liquid chrome alchemy into decentralized finance.
          </p>
        </motion.div>

        <MercurySphere />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-[#E5E5E5]/30 flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-[#FF4D00] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: TICKER */}
      <Ticker />

      {/* SECTION 3: BENTO */}
      <section id="bento">
        <BentoFeatures />
      </section>

      {/* SECTION 4: FORGE */}
      <section id="forge">
        <Forge />
      </section>

      {/* SECTION 5: PULSE */}
      <section id="pulse">
        <Pulse />
      </section>

      {/* SECTION 6: VAULT */}
      <section id="vault">
        <VaultTiers />
      </section>

      {/* SECTION 7: FOOTER */}
      <Footer />
    </div>
  );
}

export default App;