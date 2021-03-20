module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  // chainWebpack: config => {
  //   config.module
  //   .use('url-loader')
  //       .rule('base64img')
  //       .test('/\.(png|mp3)$/')
  //       .use('url-loader')
  //       .loader('url-loader')
  //       .tap(options => Object.assign(options, { limit: 10240 }))
  //       .end()
  chainWebpack: config => {
    config.module
    .rule('base64img')
    .test('/\.(png|mp3)$/')
      .use('url-loader')
      .loader('url-loader')
  }
    // .end()
  
    
        // test: /\.(png|mp3)$/,
        // use: [{ loader: 'url-loader'}
     
  
  
}
