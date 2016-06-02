import path from 'path';
import webpack from 'webpack';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UnminifiedWebpackPlugin from 'unminified-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin';

const PATHS = {
  dev: path.join(__dirname, 'dev'),
  build: path.join(__dirname, 'build')
};

const entry = {

  build: [
    'babel-polyfill',
    PATHS.dev
  ]

};

const output = {
  //path to where webpack will build your stuff
  path: PATHS.build,
  filename: '[name].js'
};

// Faster development specific options, such as cheap-module-eval-source-map
// and eval, produce lower quality sourcemaps.
const devtool = 'eval-source-map';

const devServer = {
  contentBase: PATHS.build,

  historyApiFallback: true,
  hot: true,
  inline: true,
  progress: true,

  // Display only errors to reduce the amount of output.
  stats: 'errors-only',
};

// debug let’s our loaders know that they don’t need to make release-ready code
const debug = true;

const cache = true;

const watchOptions = {
  aggregateTimeout: 100,
  // poll: true
};

const resolve = {
  // can now require('file') instead of require('file.coffee')
  extensions: ['', '.js', '.json', '.jsx', '.coffee', '.styl']
};

// ================================================================================
// LOADERS CONFIG START
// ================================================================================

const jsLoader = {
  // Only run `.js` and `.jsx` files through Babel
  test: /\.jsx?$/,

  loader: 'babel-loader',

  // Skip any files outside of project's `dev` directory
  include: [
    path.resolve(__dirname, PATHS.dev),
  ],

  // Options to configure babel with
  query: {
    plugins: ['transform-runtime'],
    presets: ['es2015', 'stage-0', 'react']
  }
};

const coffeeLoader = {
  test: /\.coffee$/,
  loader: 'coffee-loader'
};

// inline base64 URLs for <=8k images, direct URLs for the rest
const imagesLoader = {
  test: /\.(png|jpg)$/,
  loader: 'url-loader?limit=8192'
};

const cssLoader = {
  test: /\.css$/,
  // loader: 'style-loader!css-loader!postcss-loader',
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
};

const stylusLoader = {
  test: /\.styl$/,
  // loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
};

const jadeLoader = {
  test: /\.jade$/,
  loader: 'jade-loader'
};

const postcss = () => [autoprefixer];

var module = {

  loaders: [
    jsLoader,
    imagesLoader,
    cssLoader,
    stylusLoader,
    coffeeLoader,
    jadeLoader
  ]

};

// ================================================================================
// LOADERS CONFIG END
// ================================================================================

const plugins = [
  new CleanWebpackPlugin(['dist', 'build'], {
    root: __dirname,
    verbose: true,
    dry: false
  }),

  new webpack.NoErrorsPlugin(),

  new ngAnnotatePlugin({
    add: true
  }),

  new NpmInstallPlugin({
    save: true,
    peerDependencies: true
  }),

  new ExtractTextPlugin('[name].css', { allChunks: false }),

  // turn off for dev server
  // new webpack.optimize.DedupePlugin(),

  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false
    }
  }),

  new UnminifiedWebpackPlugin(),

  new webpack.optimize.OccurenceOrderPlugin(),

  new HtmlWebpackPlugin({
    template: PATHS.dev + '/index.html'
  })
];

const config = {
  entry,
  output,
  devtool,
  watchOptions,
  module,
  debug,
  cache,
  devServer,
  postcss,
  plugins
};

export default config;
