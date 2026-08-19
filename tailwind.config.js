/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alibi: {
          bg: '#F5F8FC',
          surface: '#FFFFFF',
          muted: '#F0F4F8',
          primary: '#2748B9',
          'primary-dark': '#1E3A8A',
          'primary-soft': '#E8EDFA',
          danger: '#BD3C2B',
          'danger-soft': '#FDE8E5',
          success: '#22C55E',
          'success-soft': '#DCFCE7',
          warning: '#F59E0B',
          'warning-soft': '#FEF3C7',
          accent: '#6F58E3',
          'accent-soft': '#EDE9FC',
          text: '#151112',
          'text-secondary': '#5D4B50',
          'text-muted': '#9CA3AF',
          border: '#E5E7EB',
        }
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.1)',
        'hero': '0 20px 60px rgba(0,0,0,0.12)',
        'btn': '0 4px 14px rgba(39,72,185,0.3)',
        'input-focus': '0 0 0 3px rgba(39,72,185,0.1)',
      },
      animation: {
        'float': 'float 4.5s ease-in-out infinite',
        'float-slow': 'float-slow 5.5s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        }
      }
    },
  },
  plugins: [],
}
