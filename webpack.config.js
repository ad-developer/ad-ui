/**
 * MIT License
 * Copyright (c) 2021 A.D. Software Labs

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*

*/
const path = require('path');
// const glob = require('glob');
// const webpack = require('webpack');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const OUT_PATH = path.resolve('./dist');
const PUBLIC_PATH = '/assets/';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_PROD = process.env.AD_ENV === 'production';
const IS_DEV = process.env.AD_ENV === 'development';

const autoprefixer = require('autoprefixer');

const CSS_LOADER_CONFIG = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: IS_DEV,
      postcssOptions: {
        plugins: () =>[autoprefixer()],
      },
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      sassOptions: {
        indentWidth: 4,
        includePaths: ['packages/*/node_modules'],
        // [glob.sync('packages/*/node_modules').map((d) => path.join(__dirname, d))],
      },
    },
  },
];

// const banner = [
//  '/*!',
//  ' Simple Javascript UI library to build modern and elegant web UI',
//  ` Copyright (c) ${new Date().getFullYear()} A.D. Software Labs`,
//  ' License: MIT',
//  '*/',
// ].join('\n');

// const createBannerPlugin = () => new webpack.BannerPlugin({
//  banner: banner,
//  raw: true,
//  entryOnly: true,
// });

const uglifyOptions = {
  output: {
    comments: false, // Removes repeated @license comments and other code comments.
  },
  sourceMap: true,
};

module.exports = [
  {
    name: 'js-components',
    entry: {
      'component': path.resolve('./packages/base/component.js'),
      'page-controller': path.resolve('./packages/page-controller/page-controller.js'),
      'tooltip': path.resolve('./packages/tooltip/tooltip.js'),
      'popup': path.resolve('./packages/popup/popup.js'),
      'form': path.resolve('./packages/form/form.js'),
      'cookie': path.resolve('./packages/cookie/cookie.js'),
    },
    output: {
      filename: '[name].' + (IS_PROD ? 'min.' : '') + 'js',
      path: OUT_PATH,
      publicPath: PUBLIC_PATH,
      library: ['ad', '[name]'],
      // libraryTarget: 'umd'
    },
    devServer: {
      disableHostCheck: true,
    },
    devtool: IS_DEV ? 'source-map' : false,
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env'],
        },
      }],
    },
    optimization: {
      minimize: IS_PROD ? true : false,
      minimizer: [new UglifyJSPlugin({uglifyOptions})],
    },
    plugins: [
      // createBannerPlugin(),
    ],
  },
  {
    name: 'css-components',
    entry: {
      'button': path.resolve('./packages/button/button.scss'),
      'tooltip': path.resolve('./packages/tooltip/tooltip.scss'),
      'popup': path.resolve('./packages/popup/popup.scss'),
      'form': path.resolve('./packages/form/form.scss'),
      'typography': path.resolve('./packages/typography/typography.scss'),
    },
    output: {
      // In development, these are emitted as js files to facilitate hot module replacement. In
      // all other cases, ExtractTextPlugin is used to generate the final css, so this is given a
      // dummy ".css-entry" extension.
      filename: '[name].' + (IS_PROD ? 'min.' : '') + 'css' + (IS_DEV ? '.js' : '-entry'),
      path: OUT_PATH,
      publicPath: PUBLIC_PATH,
    },
    devServer: {
      disableHostCheck: true,
    },
    devtool: IS_DEV ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: IS_DEV ?
            [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG) : // --- Dev mode
            [{loader: MiniCssExtractPlugin.loader}].concat(CSS_LOADER_CONFIG),
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].' + (IS_PROD ? 'min.' : '') + 'css',
      }),
      // createBannerPlugin(),
    ],
  },
];

if (IS_DEV) {
  module.exports.push({
    name: 'demo-css',
    entry: {
      'demo-styles': path.resolve('./demos/demos.scss'),
    },
    output: {
      path: OUT_PATH,
      filename: '[name].css.js',
    },
    devServer: {
      disableHostCheck: true,
    },
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.scss$/,
        use: [{loader: 'style-loader'}].concat(CSS_LOADER_CONFIG),
      }],
    },
    plugins: [
      // createBannerPlugin(),
    ],
  });
};
