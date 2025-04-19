// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // for App Router pages/components
    './components/**/*.{js,ts,jsx,tsx}', // for shared components
  ],
  theme: {
    extend: {
      colors: {
        'theme': {
          50: '#f3f2ff',
          100: '#eae8ff',
          200: '#d7d3ff',
          300: '#bab0ff',
          400: '#9883ff',
          500: '#7751ff',
          600: '#672ef9',
          700: '#581ce5',
          800: '#4a17c0',
          900: '#3e159d',
          950: '#2a0c7e',
        },
      },
    },
  },
  plugins: [],
}
export default config;
