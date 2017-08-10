const path = require('path');

module.exports = {
  entry: {
    cengine: "./app/cengine/CanvasEngine.js"
  },
  output: {
    filename: 'cengine.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'CanvasEngine'
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
};