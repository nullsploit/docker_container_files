// webpack.config.js
// Import dependencies
const path = require('path');
// Takes our css/scss files and compiles them into one single css file
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
// Using index.html as a template puts an html file in our build folder
const HtmlWebPackPlugin = require('html-webpack-plugin');
// Define the config object
const config = {
  entry: './src/index.js', // Our entry file, will take all files connected to index.js and compile them together
  
  output: {
        path: path.resolve(__dirname,'build'), // Tells webpack where to put the output files
        filename: 'bundle.js', // Naming our compiled ES5 file
    },
  module: {
    rules: [
      // Tells webpack to use Babel to compile .js files
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      
      // Tells webpack to use MiniCss to compile css/scss files. If that fails, use css-loader then sass-loader
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html", // Template for the html file used in build
      filename: "./index.html" // Name of the html file webpack will put in the build folder
    }),
    new MiniCssExtractPlugin({filename: 'style.css'}) // Name of our CSS file in the build folder
  ]
};
// export the config object so when webpack runs it knows to use it.
module.exports = config;