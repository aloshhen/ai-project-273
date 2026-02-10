import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safe Icon Component - renders Lucide icons dynamically
const SafeIcon = ({ name, size = 24, className, color }) => {
  import * as LucideIcons from 'lucide-react';
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const IconComponent = LucideIcons[pascalName] || LucideIcons.HelpCircle;

  return <IconComponent size={size} className={className} color={color} />;
};

// Ethereum SVG Icon Component
const EthereumIcon = ({ className }) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.925 23.96l-9.819-5.797L16 32l9.832-13.837-9.907 5.797z"
      fill="currentColor"
      fillOpacity="0.8"
    />
    <path
      d="M16 0L6.106 17.467l9.894 5.807 9.907-5.807L16 0zm0 25.03L6.114 19.18 16 32l9.886-12.82-9.886 5.85z"
      fill="currentColor"
    />
  </svg>
);

// Gold SVG Icon Component - Using user provided SVG
const GoldIcon = ({ className }) => (
  <img
    src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-svg-1770684373-9122.svg?"
    alt="Gold"
    className={className}
  />
);

// Custom Cursor Component - ALWAYS WHITE, SCALES ON BUTTONS
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const isButton = element.closest('button') ||
                        element.closest('a') ||
                        element.closest('[role="button"]') ||
                        element.closest('.cursor-pointer');
        setIsScaled(!!isButton);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={cn("custom-cursor", isScaled && "scaled")}
      style={{ left: position.x, top: position.y }}
    />
  );
};

// ENHANCED Tier Selection Modal Component with Chrome Alchemy Design
const TierSelectionModal = ({ isOpen, onClose, tier }) => {
  const [amount, setAmount] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !tier) return null;

  const minStake = tier.name === 'Iron' ? 1000 : tier.name === 'Chrome' ? 10000 : 100000;
  const maxStake = minStake * 100;

  const handleStake = async () => {
    if (!agreed || !amount || parseFloat(amount) < minStake) return;

    setIsLoading(true);
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setAmount('');
    setAgreed(false);
    onClose();
  };

  const getTierColor = () => {
    if (tier.name === 'Flare') return 'from-orange-500 via-orange-600 to-orange-700';
    if (tier.name === 'Chrome') return 'from-gray-300 via-gray-400 to-gray-500';
    return 'from-gray-700 via-gray-800 to-gray-900';
  };

  const getTierAccentColor = () => {
    if (tier.name === 'Flare') return '#FF4D00';
    if (tier.name === 'Chrome') return '#E5E5E5';
    return '#525252';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chrome border glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00] via-transparent to-[#E5E5E5] opacity-20 blur-xl" />

            <div className={cn(
              "relative glass-card rounded-2xl p-8 border-2 overflow-hidden",
              tier.name === 'Chrome' ? "border-[#E5E5E5]/30" : "border-[#FF4D00]/30"
            )}>
              {/* Animated background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-10",
                getTierColor()
              )} />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FF4D00]/20 border border-white/10 transition-all z-20 group"
              >
                <SafeIcon name="x" size={20} className="text-[#E5E5E5] group-hover:text-[#FF4D00] transition-colors" />
              </button>

              {!isSuccess ? (
                <div className="relative z-10">
                  {/* Tier Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border-2",
                      tier.name === 'Chrome' ? "border-[#E5E5E5] bg-gradient-to-br from-gray-200 to-gray-400" :
                      tier.name === 'Flare' ? "border-[#FF4D00] bg-gradient-to-br from-orange-500 to-orange-700" :
                      "border-[#525252] bg-gradient-to-br from-gray-700 to-gray-900"
                    )}>
                      <SafeIcon
                        name={tier.name === 'Flare' ? "flame" : tier.name === 'Chrome' ? "hexagon" : "shield"}
                        size={24}
                        className={tier.name === 'Chrome' ? "text-gray-900" : "text-white"}
                      />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-[#E5E5E5]/40 tracking-widest uppercase">
                        Membership Tier
                      </div>
                      <h3 className={cn(
                        "font-serif text-3xl font-black tracking-tight",
                        tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-white"
                      )}>
                        {tier.name}
                      </h3>
                    </div>
                  </div>

                  {/* APY Display */}
                  <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className={cn(
                      "text-4xl font-black font-mono",
                      tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-[#FF4D00]"
                    )}>
                      {tier.apy}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-[#E5E5E5]/60">Annual Percentage Yield</div>
                      <div className="font-mono text-xs text-[#E5E5E5]/40">Auto-compounding every block</div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="mb-8">
                    <div className="font-mono text-xs text-[#E5E5E5]/40 mb-3 tracking-widest uppercase">
                      Tier Privileges
                    </div>
                    <div className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            tier.name === 'Chrome' ? "bg-[#E5E5E5]/20" : "bg-[#FF4D00]/20"
                          )}>
                            <SafeIcon
                              name="check"
                              size={14}
                              className={tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-[#FF4D00]"}
                            />
                          </div>
                          <span className="font-mono text-sm text-[#E5E5E5]/80">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stake Input */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <label className="font-mono text-xs text-[#E5E5E5]/60 tracking-wider uppercase">
                        Stake Amount
                      </label>
                      <span className="font-mono text-xs text-[#E5E5E5]/40">
                        Min: {minStake.toLocaleString()} AETH
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={minStake.toString()}
                        min={minStake}
                        className={cn(
                          "w-full px-4 py-4 bg-white/5 border-2 rounded-xl text-white font-mono text-lg placeholder-[#E5E5E5]/30 focus:outline-none transition-all",
                          tier.name === 'Chrome'
                            ? "border-[#E5E5E5]/20 focus:border-[#E5E5E5]/50"
                            : "border-[#FF4D00]/20 focus:border-[#FF4D00]/50"
                        )}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#E5E5E5]/40">
                        AETH
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-mono text-xs text-[#E5E5E5]/30">Balance: 0.00 AETH</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAmount(minStake.toString())}
                          className="font-mono text-xs text-[#FF4D00] hover:text-[#ff6a2b] transition-colors px-2 py-1 rounded bg-white/5"
                        >
                          MIN
                        </button>
                        <button
                          onClick={() => setAmount(maxStake.toString())}
                          className="font-mono text-xs text-[#FF4D00] hover:text-[#ff6a2b] transition-colors px-2 py-1 rounded bg-white/5"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 mb-6 p-3 rounded-lg bg-white/5 border border-white/5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#E5E5E5]/30 bg-transparent text-[#FF4D00] focus:ring-[#FF4D00] focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="terms" className="font-mono text-xs text-[#E5E5E5]/60 leading-relaxed cursor-pointer">
                      I understand that staking requires a 30-day lockup period and early withdrawal carries a 5% penalty fee. Smart contract risks apply.
                    </label>
                  </div>

                  {/* Stake Button */}
                  <button
                    onClick={handleStake}
                    disabled={!agreed || !amount || parseFloat(amount) < minStake || isLoading}
                    className={cn(
                      "w-full py-4 rounded-xl font-mono font-bold text-lg transition-all transform relative overflow-hidden group",
                      agreed && amount && parseFloat(amount) >= minStake && !isLoading
                        ? tier.name === 'Chrome'
                          ? "bg-[#E5E5E5] text-[#050505] hover:bg-white hover:scale-[1.02]"
                          : "bg-[#FF4D00] text-[#050505] hover:bg-[#ff6a2b] hover:scale-[1.02]"
                        : "bg-white/10 text-[#E5E5E5]/40 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className={cn(
                          "w-5 h-5 border-2 border-t-transparent rounded-full animate-spin",
                          tier.name === 'Chrome' ? "border-gray-900" : "border-[#050505]"
                        )} />
                        <span>Processing Transaction...</span>
                      </div>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <SafeIcon name="lock" size={18} />
                        CONFIRM STAKE
                      </span>
                    )}

                    {/* Button shine effect */}
                    {!isLoading && agreed && amount && parseFloat(amount) >= minStake && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                  </button>

                  {/* Gas Info */}
                  <p className="text-center font-mono text-[10px] text-[#E5E5E5]/30 mt-4">
                    Gas fees will be deducted from your wallet • Network: Aether Mainnet
                  </p>
                </div>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4",
                      tier.name === 'Chrome' ? "border-[#E5E5E5] bg-[#E5E5E5]/10" : "border-[#FF4D00] bg-[#FF4D00]/10"
                    )}
                  >
                    <SafeIcon
                      name="check"
                      size={48}
                      className={tier.name === 'Chrome' ? "text-[#E5E5E5]" : "text-[#FF4D00]"}
                    />
                  </motion.div>

                  <h3 className="font-serif text-3xl font-bold text-white mb-2">
                    Stake Confirmed
                  </h3>
                  <p className="font-mono text-sm text-[#E5E5E5]/60 mb-6 max-w-xs mx-auto">
                    You have successfully joined the {tier.name} tier. Your assets are now generating yield.
                  </p>

                  <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                    <div className="font-mono text-xs text-[#E5E5E5]/40 mb-1">TRANSACTION HASH</div>
                    <div className="font-mono text-xs text-[#FF4D00] truncate">
                      0x7f8a9b2c...3d4e5f6a
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-mono font-bold transition-all"
                  >
                    CLOSE
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Transmute Modal Component
const TransmuteModal = ({ isOpen, onClose, asset }) => {
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  if (!isOpen || !asset) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-8 max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FF4D00]/20 transition-colors"
          >
            <SafeIcon name="x" size={18} className="text-[#E5E5E5]" />
          </button>

          <div className="mb-6">
            <div className="font-mono text-xs text-[#E5E5E5]/40 mb-2 tracking-widest uppercase">
              Transmute Configuration
            </div>
            <h3 className="font-serif text-3xl font-bold text-white tracking-tight">
              {asset.symbol} <span className="text-[#FF4D00]">→</span> AETH
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-mono text-xs text-[#E5E5E5]/60 mb-2 block tracking-wider uppercase">
                Amount to Transmute
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-white/5 border border-[#E5E5E5]/20 rounded-lg text-white font-mono placeholder-[#E5E5E5]/30 focus:outline-none focus:border-[#FF4D00]/50 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#E5E5E5]/40">
                  {asset.symbol}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-mono text-xs text-[#E5E5E5]/30">Balance: 0.00</span>
                <button className="font-mono text-xs text-[#FF4D00] hover:text-[#ff6a2b] transition-colors">MAX</button>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-[#E5E5E5]/60 mb-2 block tracking-wider uppercase">
                Max Slippage: {slippage}%
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="font-mono text-xs text-[#E5E5E5]/30">0.1%</span>
                <span className="font-mono text-xs text-[#E5E5E5]/30">5%</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#E5E5E5]/50 uppercase">Exchange Rate</span>
                <span className="font-mono text-xs text-[#E5E5E5]">1 {asset.symbol} = 1,000 AETH</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#E5E5E5]/50 uppercase">Network Fee</span>
                <span className="font-mono text-xs text-[#E5E5E5]">~$2.45</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-[#E5E5E5]/50 uppercase">Route</span>
                <span className="font-mono text-xs text-[#FF4D00]">Quantum Bonding Curve</span>
              </div>
            </div>

            <button className="w-full py-4 bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] rounded-lg font-mono font-bold transition-all transform hover:scale-[1.02]">
              EXECUTE TRANSMUTATION
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// App Coming Soon Modal
const AppComingSoonModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-8 max-w-md w-full relative text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FF4D00]/20 transition-colors"
          >
            <SafeIcon name="x" size={18} className="text-[#E5E5E5]" />
          </button>

          {!submitted ? (
            <>
              <h3 className="font-serif text-3xl font-bold text-white mb-4 tracking-tight">
                App in Development
              </h3>

              <p className="font-mono text-sm text-[#E5E5E5]/60 mb-8 leading-relaxed">
                The AETHER Protocol app is currently under construction. Join the waitlist to be among the first to access the future of decentralized finance.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-[#E5E5E5]/20 rounded-lg text-white font-mono placeholder-[#E5E5E5]/30 focus:outline-none focus:border-[#FF4D00]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] rounded-lg font-mono font-bold transition-all transform hover:scale-[1.02]"
                >
                  JOIN WHITELIST
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <SafeIcon name="check" size={32} className="text-green-500" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="font-mono text-sm text-[#E5E5E5]/60">We'll notify you when the protocol launches.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// SECTION 1: HERO - The Singularity
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
            className="flex items-center gap-3 px-6"
          >
            <div className="ticker-item flex items-center gap-2 border border-transparent hover:border-[#FF4D00]/40 rounded-lg px-4 py-2 transition-all duration-300">
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
        className="font-serif text-5xl md:text-8xl font-black text-white mb-16 text-center tracking-tighter"
      >
        The Alchemical <span className="text-white">Triad</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-8 relative overflow-hidden group min-h-[290px] flex flex-col"
            data-cursor="orange"
          >
            <div className="blueprint-overlay absolute inset-0 pointer-events-none rounded-2xl" />

            <div className="relative z-10 flex-1">
              <div className="mb-6">
                <span className="font-mono text-xs text-[#E5E5E5]/40 tracking-widest block">
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

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SECTION 4: THE ALCHEMICAL VAULT
const AlchemicalVault = ({ onTransmuteClick }) => {
  const assets = [
    {
      symbol: 'ETH',
      name: 'ETHEREUM',
      fullName: 'Ethereum 2.0',
      price: '$3,247.82',
      change: '+12.4%',
      icon: 'diamond',
      isEthereum: true
    },
    {
      symbol: 'BTC',
      name: 'BITCOIN',
      fullName: 'Bitcoin',
      price: '$67,432.18',
      change: '+8.2%',
      icon: 'bitcoin'
    },
    {
      symbol: 'AU',
      name: 'GOLD',
      fullName: 'Digital Gold',
      price: '$2,145.30',
      change: '+3.1%',
      icon: 'coins',
      isGold: true
    },
    {
      symbol: 'USD',
      name: 'DOLLAR',
      fullName: 'USDC Stable',
      price: '$1.00',
      change: '+0.01%',
      icon: 'dollar-sign'
    },
    {
      symbol: 'SOL',
      name: 'SOLANA',
      fullName: 'Solana',
      price: '$178.45',
      change: '+24.7%',
      icon: 'zap',
      isSolana: true
    },
    {
      symbol: 'AVAX',
      name: 'AVALANCHE',
      fullName: 'Avalanche',
      price: '$42.18',
      change: '+15.3%',
      icon: 'triangle'
    },
  ];

  const duplicatedAssets = [...assets, ...assets, ...assets, ...assets, ...assets, ...assets, ...assets, ...assets];

  return (
    <div className="py-20 overflow-visible">
      <div className="container mx-auto px-4 md:px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            The Alchemical <span className="text-white">Vault</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg mt-6 max-w-2xl mx-auto">
            Assets in perpetual motion
          </p>
        </motion.div>
      </div>

      <div className="relative h-[450px] overflow-visible hidden lg:block py-4">
        <div className="vault-scroll-container absolute flex gap-8 items-center h-full px-4 overflow-visible">
          {duplicatedAssets.map((asset, index) => (
            <VaultCardNoGlow key={`${asset.symbol}-${index}`} asset={asset} onTransmuteClick={onTransmuteClick} />
          ))}
        </div>
      </div>

      <div className="lg:hidden overflow-x-auto pb-4 overflow-visible">
        <div className="flex gap-4 px-4 overflow-visible" style={{ width: 'max-content' }}>
          {assets.map((asset, index) => (
            <VaultCardNoGlow key={`mobile-${asset.symbol}-${index}`} asset={asset} onTransmuteClick={onTransmuteClick} />
          ))}
        </div>
      </div>

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
              className="card-gradient-border p-6 rounded-xl hover:border-[#FF4D00]/30 transition-all duration-500 group overflow-visible"
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

// Vault Card Component
const VaultCardNoGlow = ({ asset, onTransmuteClick }) => {
  return (
    <motion.div
      className="relative w-72 h-[400px] flex-shrink-0 group vault-card-no-glow overflow-visible"
      transition={{ duration: 0.3 }}
      style={{ transform: 'none' }}
    >
      <div className="glass-card absolute inset-0 rounded-2xl overflow-hidden transition-all duration-500" style={{ transform: 'none' }}>
        {/* Top gradient accent line */}
        <div className="vault-top-line absolute top-0 left-4 right-4 h-1 bg-[#E5E5E5]/20 opacity-60 transition-all duration-500 rounded-full" />

        {/* Metallic sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

        <div className="relative h-full flex flex-col p-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] text-[#E5E5E5]/40 mb-1 tracking-widest">
                ASSET_CLASS
              </div>
              <div className="font-serif text-3xl font-black text-white tracking-tight vault-title transition-colors duration-500">
                {asset.symbol}
              </div>
              <div className="font-mono text-[11px] text-[#E5E5E5]/50 mt-1 uppercase tracking-wide">
                {asset.fullName}
              </div>
            </div>

            {/* Icon container */}
            <div className="vault-icon-box w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 shadow-lg transition-all duration-500 bg-[#E5E5E5]/5 overflow-hidden">
              {asset.isEthereum ? (
                <EthereumIcon className="w-8 h-8 text-[#E5E5E5]/60 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:text-[#FF4D00]" />
              ) : asset.isGold ? (
                <GoldIcon className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:brightness-110" />
              ) : asset.isSolana ? (
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/edit-photo-1770465203-5802.svg?"
                  alt="Solana"
                  className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                />
              ) : (
                <SafeIcon
                  name={asset.icon}
                  size={24}
                  className="vault-icon text-[#E5E5E5]/60 transition-colors duration-500"
                />
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="font-mono text-[10px] text-[#E5E5E5]/40 mb-2 tracking-widest">
              CURRENT_PRICE
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-white tracking-tight">
                {asset.price}
              </span>
              <span className={cn(
                "font-mono text-sm font-bold px-2 py-0.5 rounded bg-opacity-20",
                asset.change.startsWith('+') ? 'text-green-400 bg-green-500' : 'text-red-400 bg-red-500'
              )}>
                {asset.change}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="font-mono text-[10px] text-[#E5E5E5]/40 mb-3 tracking-widest">
              VOLATILITY_INDEX
            </div>
            <div className="flex gap-[3px] h-16 items-end">
              {[...Array(24)].map((_, i) => {
                const height = 25 + Math.random() * 75;
                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all duration-500 bg-[#E5E5E5]/20 opacity-40 vault-bars"
                    style={{ height: `${height}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onTransmuteClick(asset)}
            className="mt-6 w-full py-3.5 rounded-lg bg-white/5 hover:bg-[#FF4D00]/20 border border-white/10 hover:border-[#FF4D00]/50 transition-all duration-300 font-mono text-xs tracking-widest text-[#E5E5E5]/60 hover:text-white uppercase relative z-20"
          >
            Transmute_{asset.symbol}
          </button>
        </div>

        {/* Fixed semicircle */}
        <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none z-0">
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#FF4D00] to-[#ff6a2b] rounded-tl-full" />
        </div>
      </div>
    </motion.div>
  );
};

// SECTION 5: THE FORGE
const Forge = () => {
  const assets = [
    {
      id: 'eth',
      subtitle: 'LIQUID ETHER',
      title: 'Staked Ethereum',
      description: 'Staked ETH that flows like water through DeFi. Convert any asset to any other in milliseconds with zero slippage through quantum bonding curves.',
      blueprint: 'STETH_V2 // LIQUID_STAKING // YIELD_AGGREGATOR',
      isEthereum: true
    },
    {
      id: 'btc',
      subtitle: 'WRAPPED BITCOIN',
      title: 'Bitcoin Unleashed',
      description: 'Bitcoin freed from its blockchain constraints. AI-powered threat detection monitors every transaction with self-healing smart contracts.',
      blueprint: 'WBTC_V3 // CROSS_CHAIN // BRIDGE_PROTOCOL',
      icon: 'bitcoin',
    },
    {
      id: 'gold',
      subtitle: 'TOKENIZED GOLD',
      title: 'Digital Gold',
      description: 'Physical gold tokenized and liquified for instant transfers. Dynamic yield optimization across 47 protocols, compounding every block.',
      blueprint: 'PAXG_V1 // GOLD_BACKED // ASSET_TOKENIZATION',
      isGold: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-20">
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
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-8 relative overflow-hidden group min-h-[400px] flex flex-col"
            data-cursor="orange"
          >
            <div className="blueprint-overlay absolute inset-0 pointer-events-none rounded-2xl" />

            <div className="relative z-10 flex-1">
              <div className="mb-6">
                <span className="font-mono text-xs text-[#E5E5E5]/40 tracking-widest block">
                  {asset.subtitle}
                </span>
              </div>

              <div className="flex items-start justify-between mb-6">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white group-hover:text-[#FF4D00] transition-colors">
                  {asset.title}
                </h3>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 bg-[#E5E5E5]/5 ml-4 flex-shrink-0 overflow-hidden">
                  {asset.isEthereum ? (
                    <EthereumIcon className="w-8 h-8 text-[#E5E5E5]/60 group-hover:text-[#FF4D00] transition-colors duration-500" />
                  ) : asset.isGold ? (
                    <GoldIcon className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:brightness-110" />
                  ) : (
                    <SafeIcon
                      name={asset.icon}
                      size={24}
                      className="text-[#E5E5E5]/60 group-hover:text-[#FF4D00] transition-colors"
                    />
                  )}
                </div>
              </div>

              <p className="font-mono text-sm text-[#E5E5E5]/70 leading-relaxed mb-6">
                {asset.description}
              </p>

              <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="font-mono text-xs text-[#FF4D00]/60 border border-[#FF4D00]/30 rounded p-3 bg-[#FF4D00]/5">
                  {asset.blueprint}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SECTION 6: THE PULSE - Heartbeat of the Protocol
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

// SECTION 7: THE VAULT TIERS - Membership Evolution
const VaultTiers = ({ onSelectTier }) => {
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
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ rotateY: 10, rotateX: 5, z: 50 }}
              className={cn(
                "card-3d relative rounded-2xl p-8 overflow-hidden",
                tier.isChrome ? "card-chrome" : tier.isFlare ? "bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700" : `bg-gradient-to-b ${tier.bgColor}`
              )}
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

              <button
                onClick={() => onSelectTier(tier)}
                className={cn(
                  "relative z-10 w-full mt-8 py-4 rounded-xl font-mono font-bold transition-all transform hover:scale-105",
                  tier.isChrome
                    ? "bg-gray-900 text-[#E5E5E5] hover:bg-gray-800"
                    : tier.isFlare
                      ? "bg-white text-orange-600 hover:bg-gray-100"
                      : "bg-[#E5E5E5] text-[#050505] hover:bg-white"
                )}
              >
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

// SECTION 8: FAQ
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: "What is AETHER PROTOCOL?",
      answer: "AETHER PROTOCOL is a next-generation decentralized finance platform that combines liquid chrome alchemy with high-end brutalist design principles. We enable instant asset transmutation, neural-level security, and infinite yield optimization across multiple chains."
    },
    {
      question: "How does Instant Transmutation work?",
      answer: "Our quantum bonding curve technology allows for atomic swaps between any assets with zero slippage. The protocol maintains deep liquidity pools that enable millisecond-level conversions, backed by AI-powered market making algorithms."
    },
    {
      question: "What are the Vault Tiers and how do I join?",
      answer: "Vault Tiers (Iron, Chrome, Flare) represent membership levels based on your AETH stake. Each tier unlocks enhanced yield rates, reduced fees, and exclusive governance rights. Simply stake the required AETH amount to automatically upgrade your tier."
    },
    {
      question: "Is my capital safe with Neural Security?",
      answer: "Absolutely. Our Neural Security system uses predictive AI to monitor all transactions in real-time, detecting and preventing exploits before they occur. Smart contracts are self-healing and automatically patch vulnerabilities without manual intervention."
    },
    {
      question: "How are yields generated in the protocol?",
      answer: "Yields come from multiple sources: liquidity provision fees, staking rewards, protocol revenue sharing, and cross-chain arbitrage. Our Yield Router V4 automatically allocates capital across 47 protocols to maximize returns while managing risk."
    },
    {
      question: "When will the protocol launch?",
      answer: "The AETHER PROTOCOL mainnet is scheduled for Q2 2024. Early adopters who join our waitlist will receive exclusive Iron tier benefits and airdrop allocations. Follow our social channels for exact launch dates."
    }
  ];

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 px-4 md:px-6 bg-[#050505]">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            Protocol <span className="text-white">FAQ</span>
          </h2>
          <p className="font-mono text-[#E5E5E5]/60 text-lg">
            Common inquiries about the system
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "faq-item",
                openIndex === index && "open"
              )}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors group"
              >
                <span className="font-serif text-lg md:text-xl font-bold text-white pr-8 group-hover:text-[#FF4D00] transition-colors">
                  {item.question}
                </span>
                <div className="faq-icon flex-shrink-0 w-8 h-8 rounded-full border border-[#E5E5E5]/20 flex items-center justify-center group-hover:border-[#FF4D00] transition-colors">
                  <SafeIcon name="plus" size={16} className="text-[#E5E5E5] group-hover:text-[#FF4D00] transition-colors" />
                </div>
              </button>
              <div className="faq-answer px-6 pb-6">
                <p className="font-mono text-sm text-[#E5E5E5]/70 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="font-mono text-sm text-[#E5E5E5]/50 mb-4">
            Still have questions?
          </p>
          <button className="bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] px-8 py-4 rounded-xl font-mono font-bold transition-all transform hover:scale-105">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// SECTION 9: FOOTER - The Core Integration
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

      {/* Subtle floating dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute w-2 h-2 rounded-full",
            isFlooded ? "floating-dot-dark-subtle" : "floating-dot-subtle"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </footer>
  );
};

// Navigation - Hide on scroll down, show on scroll up
const Navigation = ({ onLaunchAppClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled past threshold for background
      setScrolled(currentScrollY > 100);

      // Determine scroll direction for hide/show
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        // Scrolling down - hide header
        setHidden(true);
      } else {
        // Scrolling up - show header
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
      scrolled ? "bg-[#050505]/90 backdrop-blur-md border-[#E5E5E5]/10" : "bg-transparent",
      hidden ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-white tracking-tight">
          AETHER
        </span>

        <div className="hidden md:flex items-center gap-8">
          {['Triad', 'Vault', 'Forge', 'Pulse', 'FAQ'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="font-mono text-sm text-[#E5E5E5]/60 hover:text-[#FF4D00] transition-colors tracking-wider"
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={onLaunchAppClick}
          className="bg-[#FF4D00] hover:bg-[#ff6a2b] text-[#050505] px-6 py-2 rounded-full font-mono font-bold text-sm transition-all"
        >
          Launch App
        </button>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  const [transmuteModalOpen, setTransmuteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const handleTransmuteClick = (asset) => {
    setSelectedAsset(asset);
    setTransmuteModalOpen(true);
  };

  const handleCloseTransmuteModal = () => {
    setTransmuteModalOpen(false);
    setSelectedAsset(null);
  };

  const handleLaunchAppClick = () => {
    setAppModalOpen(true);
  };

  const handleCloseAppModal = () => {
    setAppModalOpen(false);
  };

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setTierModalOpen(true);
  };

  const handleCloseTierModal = () => {
    setTierModalOpen(false);
    setSelectedTier(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] overflow-x-hidden">
      <CustomCursor />
      <div className="grainy-noise" />

      <Navigation onLaunchAppClick={handleLaunchAppClick} />

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
          <p className="font-mono text-[#E5E5E5]/80 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mt-8 drop-shadow-lg px-4">
            The Singularity. A protocol manifesting liquid chrome alchemy into decentralized finance.
          </p>
        </motion.div>
      </section>

      <Ticker />

      <section id="triad">
        <BentoFeatures />
      </section>

      <section id="vault">
        <AlchemicalVault onTransmuteClick={handleTransmuteClick} />
      </section>

      <section id="forge">
        <Forge />
      </section>

      <section id="pulse">
        <Pulse />
      </section>

      <section id="tiers">
        <VaultTiers onSelectTier={handleSelectTier} />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <Footer />

      {/* Modals */}
      <TransmuteModal
        isOpen={transmuteModalOpen}
        onClose={handleCloseTransmuteModal}
        asset={selectedAsset}
      />
      <AppComingSoonModal
        isOpen={appModalOpen}
        onClose={handleCloseAppModal}
      />
      <TierSelectionModal
        isOpen={tierModalOpen}
        onClose={handleCloseTierModal}
        tier={selectedTier}
      />
    </div>
  );
}

export default App;