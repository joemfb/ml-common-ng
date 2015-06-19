/*global module*/
// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  'use strict';

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // Required libraries
      'bower_components/angular/angular.js',

      // App under test
      'dist/ml-common-ng.js',

      // Mocks
      'bower_components/angular-mocks/angular-mocks.js',

      // Tests
      // 'ui/test/**/*.js'
      'test/helpers.js',
      'test/spec/**/*.js',

      // JSON fixtures
      'test/fixtures/**/*.json'
    ],

   reporters: ['progress', 'coverage'],

   preprocessors: {
      'src/*.js': ['coverage'],
      'test/**/*.json': ['ng-json2js']
    },

    ngJson2JsPreprocessor: {
      stripPrefix: 'test/fixtures/',
      // prependPrefix: 'served/'
    },

    coverageReporter: {
      reporters: [
        { type : 'text-summary' },
        { type : 'html', dir : 'coverage/' }
      ]
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 15472,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
