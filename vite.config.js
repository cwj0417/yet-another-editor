const vue = require('@vitejs/plugin-vue')
const svg = require('./scripts/plugins/rollup-plugins-svg').default
const page = require('vite-plugin-pages')
const { join } = require('path')

module.exports = {
  root: join(__dirname, './src/renderer'),
  // base: '', // has to set to empty string so the html assets path will be relative
  plugins: [vue(), svg(), page.default({
    dirs: 'pages'
  })],
  resolve: {
    alias: {
      '@': join(__dirname, './src/renderer'),
    }
  }
}
