module.exports = {
  content: ['./src/renderer/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      translate: ['group-hover'],
      width: ['hover'],
    },
  },
  plugins: [],
}
