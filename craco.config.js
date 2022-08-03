const path = require('path')
const { whenDev } = require("@craco/craco");
const { CracoAliasPlugin, configPaths } = require('react-app-rewire-alias')
require('react-scripts/config/env')

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: { alias: configPaths('./tsconfig.path.json') },
    }
  ],
  style: {
    modules: {
      localIndentName: whenDev(() => '[name:toLowercase]__[path:toLowercase]--[hash:base64:5]', '[hash:base64]'),
      localIndentSalt: process.env.REACT_APP_MODULE_SECRET_KEY,
      localsConvention: 'camelCase',
      localIndentContext: path.resolve(__dirname, 'src'),
    },
  },
}
