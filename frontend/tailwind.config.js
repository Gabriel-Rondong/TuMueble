/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta TuMueble: oscuro + dorado
        tm: {
          dark:    '#111318',
          surface: '#1A1D24',
          card:    '#21252F',
          border:  '#2D3240',
          gold:    '#C9963A',
          'gold-light': '#E8B84B',
          'gold-muted': '#8B6825',
          text:    '#E8EAF0',
          muted:   '#7A8099',
          accent:  '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      }
    }
  },
  plugins: []
}
