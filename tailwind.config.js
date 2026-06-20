/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        brown: {
          50: '#FAF6F1',
          100: '#F5EDE3',
          200: '#E8D9C7',
          300: '#D4BEA3',
          400: '#BC9A78',
          500: '#A67B5B',
          600: '#8B5A2B',
          700: '#6B4423',
          800: '#4A2F19',
          900: '#2E1E0F',
        },
        forest: {
          50: '#F0F4F1',
          100: '#D9E3DC',
          200: '#B3C7B8',
          300: '#7FA887',
          400: '#558960',
          500: '#3D6D4A',
          600: '#2D5A3D',
          700: '#244831',
          800: '#1A3424',
          900: '#0F2016',
        },
        terracotta: {
          50: '#FBF3F1',
          100: '#F5E2DD',
          200: '#E9C4BA',
          300: '#DBA08F',
          400: '#C97A63',
          500: '#C16651',
          600: '#A34F3D',
          700: '#833E30',
          800: '#5E2D24',
          900: '#3A1C16',
        },
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FAF3E7',
          300: '#F5E9D5',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'soft-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
