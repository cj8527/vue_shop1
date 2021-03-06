const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
  rodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugins
  ]
}
