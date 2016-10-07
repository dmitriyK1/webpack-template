import webpack                 from 'webpack';
import validate, { Joi }       from 'webpack-validator';
import stylelint               from 'stylelint';
import precss                  from 'precss';
import path                    from 'path';
import merge                   from 'webpack-merge';
import lost                    from 'lost';
import autoprefixer            from 'autoprefixer';
import UnminifiedWebpackPlugin from 'unminified-webpack-plugin';
import NpmInstallPlugin        from 'npm-install-webpack-plugin';
import HtmlWebpackPlugin       from 'html-webpack-plugin';
import ExtractTextPlugin       from 'extract-text-webpack-plugin';
import CleanWebpackPlugin      from 'clean-webpack-plugin';

// ================================================================================
// BUILD OPTIONS
// ================================================================================
const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const PATHS = {
  dev   : path.join(__dirname, 'dev'),
  build : path.join(__dirname, 'build')
};

const entry = {
  build: [
    PATHS.dev
  ]
};

const devServer = {
  historyApiFallback : true,
  hot                : true,
  inline             : true,
  stats              : 'errors-only',
  host               : process.env.HOST || '0.0.0.0',
  port               : process.env.PORT
};

const watchOptions = {
  aggregateTimeout : 100,
  // poll             : true
};

const resolve = {
  extensions: ['', '.js', '.json', '.jsx', '.es6']
};

const configSchemaExtension = Joi.object({
  jscs: Joi.any()
});

// ================================================================================
// PLUGINS CONFIG
// ================================================================================
const commonPlugins = [
  new NpmInstallPlugin({
    save             : true,
    peerDependencies : true
  }),
  new HtmlWebpackPlugin({
    template   : 'node_modules/html-webpack-template/index.ejs',
    title      : 'get-cat',
    appMountId : 'root',
    inject     : false
  }),
];


let devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
].concat(commonPlugins);


let prodPlugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new CleanWebpackPlugin(['dist', 'build'], {
    root    : __dirname,
    verbose : true
  }),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false
    }
  }),
  new UnminifiedWebpackPlugin(),
  new ExtractTextPlugin('[name].css', { allChunks: false }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
  }),
  // new webpack.optimize.DedupePlugin(),
].concat(commonPlugins);


// --------------------------------------------------------------------------------
// common config
// --------------------------------------------------------------------------------
let common = {
  entry,
  resolve,
  // postcss: () => [precss, autoprefixer, lost, stylelint],
  postcss: () => [precss, autoprefixer, lost],
  module: {
    preLoaders: [
      {
        test    : /\.(es6|jsx?)$/,
        // loaders : ['eslint', 'jscs'],
        loaders : ['eslint'],
        include : PATHS.dev
      },
      {
        test    : /\.css$/,
        loaders : ['postcss'],
        include : PATHS.dev
      }
    ],
    loaders: [
      {
        test   : /\.(es6|jsx?)$/,
      //  loader : 'babel?cacheDirectory',
        loader : 'babel',
        include : PATHS.dev
      },
      // inline base64 URLs for <=8k files, direct URLs for the rest
      {
          test   : /\.(png|jpg|ttf|eot)$/,
          loader : 'url?limit=8192',
          include : PATHS.dev
      }
    ]
  }
};
// --------------------------------------------------------------------------------
// development config
// --------------------------------------------------------------------------------
if (TARGET === 'start' || !TARGET) {
  var config = merge(common, {
    debug   : false,
    cache   : false,
    devtool : 'eval-source-map',
    output  : {
      path                   : PATHS.build,
      filename               : '[name].js',
      hotUpdateChunkFilename : '[id].hot-update.js',
      hotUpdateMainFilename  : 'hot-update.json'
    },
    devServer,
    watchOptions,

    eslint: {
      fix           : false,
      cache         : false,
      emitWarning   : false,
      emitError     : false,
      failOnWarning : false,
      failOnError   : false
    },

    plugins: devPlugins,

    module: {
      loaders: [
        {
          test   : /\.css$/,
          loader : 'style!css?importLoaders=1!postcss?sourceMap=inline',
        }
      ]
    }

  });

}
// --------------------------------------------------------------------------------
// production config
// --------------------------------------------------------------------------------
if (TARGET === 'build' || TARGET === 'stats') {
  config = merge(common, {

    output: {
      path     : PATHS.build,
      filename : '[name].js',
    },

    bail: true,

    plugins: prodPlugins,

    module: {
      loaders: [
        {
          test   : /\.css$/,
          loader : ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss'),
        }
      ]
    },

    eslint: {
      fix           : true,
      cache         : false,
      emitWarning   : true,
      emitError     : true,
      failOnWarning : true,
      failOnError   : true
    },

    jscs: {
      fix: true
    }

  });

  config.entry.build.unshift('babel-polyfill');
}
// --------------------------------------------------------------------------------

export default validate(config, { schemaExtension: configSchemaExtension });
