/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          void: 'var(--bg-void)',
          base: 'var(--bg-base)',
          depth: 'var(--bg-depth)',
        },
        glass: {
          1: 'var(--glass-1)',
          2: 'var(--glass-2)',
          3: 'var(--glass-3)',
          hover: 'var(--glass-hover)',
          border: 'var(--glass-border)',
          'border-bright': 'var(--glass-border-bright)',
          'border-green': 'var(--glass-border-green)',
        },
        green: {
          core: 'var(--green-core)',
          dim: 'var(--green-dim)',
        },
        gold: {
          core: 'var(--gold-core)',
          dim: 'var(--gold-dim)',
        },
        status: {
          good: 'var(--status-good)',
          warn: 'var(--status-warn)',
          bad: 'var(--status-bad)',
        },
        party: {
          bjp: 'var(--party-bjp)',
          inc: 'var(--party-inc)',
          jds: 'var(--party-jds)',
          ind: 'var(--party-ind)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          green: 'var(--text-green)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        glow: 'var(--glow-green)',
        card: 'var(--glow-card)',
      },
      animation: {
        'ring-rotate': 'ring-rotate 3s linear infinite',
        'orb-drift': 'orb-drift 20s ease-in-out infinite alternate',
        'ring-spin': 'ring-spin 8s linear infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'flip': 'flip 6s infinite steps(2, end)',
        'rotate': 'rotate 3s linear infinite both',
      },
      keyframes: {
        flip: {
          to: { transform: "rotate(360deg)" },
        },
        rotate: {
          to: { transform: "rotate(90deg)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
