const fs = require('fs')
const path = require('path')
const CracoAlias = require('craco-alias')
const lessToJS = require('less-vars-to-js')
const CracoLessPlugin = require('craco-less')
const antdModifyVars = lessToJS(fs.readFileSync('./src/styles/default.less', 'utf8'))

module.exports = {
  webpack: {
    alias: { '@': path.resolve(__dirname, 'src/') },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: antdModifyVars,
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        baseUrl: './src',
        aliases: { '@': path.resolve(__dirname, '/') },
      },
    },
  ],
}
