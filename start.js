require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ],
})
require('@babel/polyfill')
require('./index.js')

console.log('env: ', process.env.NODE_ENV)