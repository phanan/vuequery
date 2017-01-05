module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "vuequery.js",
    library: "VueQuery",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
