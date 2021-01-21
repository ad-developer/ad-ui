/**
 @license
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

const HEADLESS_LAUNCHERS = {
  'ChromeHeadlessNoSandbox': {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox'],
  },
  'FirefoxHeadless': {
    base: 'Firefox',
    flags: ['-headless'],
  },
};
const SAUCE_LAUNCHERS = {
  'sl-ie': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10',
  },
};

const webpackConfig = require('./webpack.config.js');
// webpackConfig.entry = {};

const USING_TRAVISCI = Boolean(process.env.TRAVIS);
const USE_SAUCE = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);

const PROGRESS = USE_SAUCE ? 'dots' : 'progress';

const customLaunchers = Object.assign({}, USE_SAUCE ? SAUCE_LAUNCHERS : {}, HEADLESS_LAUNCHERS);
const browsers = USE_SAUCE ? Object.keys(customLaunchers) : ['Chrome'];

module.exports = (config) => {
  config.set({
    basePath: '',
    files: [
      'test/unit/index.js',
    ],
    frameworks: ['mocha'],
    reporters: [PROGRESS],
    preprocessors: {
      'test/unit/index.js': ['webpack', 'sourcemap'],
    },
    client: {
      mocha: {
        reporter: 'html',
        ui: 'qunit',
      },
    },

    // Test runner config.
    logLevel: config.LOG_INFO,
    port: 9876,
    colors: true,
    browsers: browsers,
    browserDisconnectTimeout: 40000,
    browserNoActivityTimeout: 120000,
    captureTimeout: 240000,
    concurrency: USE_SAUCE ? 10 : Infinity,
    customLaunchers: customLaunchers,

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },

  });

  // See https://github.com/karma-runner/karma-sauce-launcher/issues/73
  if (USING_TRAVISCI) {
    const sauceLabsConfig = {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      testName: 'UI Javascript framework unit tests - CI',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false,
    };

    config.set({
      sauceLabs: sauceLabsConfig,
      // Attempt to de-flake Sauce Labs tests on TravisCI.
      transports: ['polling'],
      browserDisconnectTolerance: 3,
    });
  }
};
