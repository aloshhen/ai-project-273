export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'ticker-mobile': 'ticker 20s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'morph': 'morph 12s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
        'infinite-scroll-reverse': 'infinite-scroll-reverse 35s linear infinite',
        'melt': 'melt 0.6s ease-in-out',
        'icon-subtle': 'icon-subtle 0.6s ease-in-out',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 70% 30% 50% 60%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'infinite-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'infinite-scroll-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        melt: {
          '0%': { transform: 'scale(1) rotate(0deg)', borderRadius: '16px' },
          '25%': { transform: 'scale(1.1) rotate(5deg)', borderRadius: '40% 60% 50% 50%' },
          '50%': { transform: 'scale(0.95) rotate(-5deg)', borderRadius: '60% 40% 60% 40%' },
          '75%': { transform: 'scale(1.05) rotate(3deg)', borderRadius: '40% 60% 40% 60%' },
          '100%': { transform: 'scale(1) rotate(0deg)', borderRadius: '16px' },
        },
        'icon-subtle': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(30deg) scale(1.05)' },
          '100%': { transform: 'rotate(0deg) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}