/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pwd: {
          // Primary brand is now India-green. `navy` is kept as an alias that
          // points to green so existing utility classes recolour automatically.
          navy: '#0a6b3d',
          green: '#0a6b3d',
          greenDark: '#075330',
          greenLight: '#e7f3ec',
          gold: '#caa53d',
          saffron: '#ff9933',
          chakra: '#0a3a82',
          ink: '#0f2e1d',
        },
      },
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'gov-green': 'linear-gradient(135deg, #0a6b3d 0%, #075330 60%, #053b22 100%)',
      },
    },
  },
  plugins: [],
};
