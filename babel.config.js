// babel.config.js
const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        // ie: '11'
        node: '12'
      }
    }
  ]
]
module.exports = { presets }
