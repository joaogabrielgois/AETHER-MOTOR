/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050608',
        graphite: '#0d0f13',
        steel: '#c9ced6',
        silver: '#8b929c',
        electric: '#3ea6ff',
      },
      fontFamily: {
        display: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        monument: '-0.04em',
      },
    },
  },
  plugins: [],
};
