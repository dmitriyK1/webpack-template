import webpack from 'webpack';
import path from 'path';

const entry = [
  'babel-polyfill',

  './dev/js/index'
];

const output = {
  path: './dist/js',
  filename: 'bundle.js'
};

const devtool = 'eval';

const debug = true;

const cache = true;

const watchOptions = {
  aggregateTimeout: 100
};

const moduleConfig = {

  loaders: [{
    loader: 'babel-loader',

    // Skip any files outside of project's `src` directory
    include: [
      path.resolve(__dirname, 'dev'),
    ],

    // Only run `.js` and `.jsx` files through Babel
    test: /\.jsx?$/,

    // Options to configure babel with
    query: {
      plugins: ['transform-runtime'],
      presets: ['es2015', 'stage-0', 'react']
    }
  }]

};

const plugins = [
  new webpack.NoErrorsPlugin(),
];

const config = {
  entry,
  output,
  devtool,
  watchOptions,
  module: moduleConfig,
  debug,
  cache
};

export default config;
