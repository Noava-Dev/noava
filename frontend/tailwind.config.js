import flowbiteReact from 'flowbite-react/plugin/tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
    '.flowbite-react/class-list.json',
    ".flowbite-react\\class-list.json"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E6EEF7',
          200: '#C7D9EE',
          300: '#9DBFE0',
          400: '#6F9CCF',
          500: '#2C5282',
          600: '#24476F',
          700: '#1E3A5A',
          800: '#172E47',
          900: '#0F1F30',
        },

        secondary: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Text colors
        text: {
          title: {
            light: '#111827',
            dark: '#F3F4F6',
          },
          body: {
            light: '#374151',
            dark: '#D1D5DB',
          },
          muted: {
            light: '#6B7280',
            dark: '#9CA3AF',
          },
        },

        // Backgrounds
        background: {
          app: {
            light: '#FDFEFF',
            dark: '#111827',
          },
          surface: {
            light: '#E6EFFB',
            dark: '#1F2937',
          },
          subtle: {
            light: '#F5F8FC',
            dark: '#2A3441',
          },
        },

        // Borders & dividers
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [flowbiteReact],
};
