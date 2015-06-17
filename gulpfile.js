/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    path = require('path'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    rm = require('gulp-rm'),
    cp = require('child_process'),
    // eventStream = require('event-stream'),
    browserify = require('gulp-browserify');

gulp.task('jshint', function() {
  return gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function() {
  // Single entry point to browserify
  return gulp.src('./src/browserify/*.js')
    .pipe(browserify({
      detectGlobals : true,
      debug : false
    }))
    .pipe(gulp.dest('browserified'));
});

gulp.task('scripts', ['browserify'], function() {
  // TODO: fix this
  // var src = gulp.src('./src/*.js');
  // var browserifiedSrc = gulp.src('./src/browserify/*.js')
  //   .pipe(browserify({
  //     insertGlobals : true,
  //     debug : false
  //   }));
  // var browserifiedSrc = gulp.src('./browserified/*.js')
  // return eventStream.merge(src, browserifiedSrc)

  return gulp.src([
      './src/*.js',
      './browserified/ml*.js'
    ])
    .pipe(concat('ml-common-ng.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-common-ng.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['scripts'], function() {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    singleRun: true,
    autoWatch: false
  }, function (exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('autotest', function() {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    autoWatch: true
  }, function (exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('docs', function() {
  cp.exec('./node_modules/.bin/jsdoc -c jsdoc.conf.json', function(err) {
    if (err) {
      return console.log(err);
    }

    gulp.src([ './docs/generated/css/baseline.css', './docs/custom-styles.css' ])
    .pipe(concat('baseline.css'))
    .pipe(gulp.dest('./docs/generated/css'));
  });
});

gulp.task('clean-docs', function() {
  return gulp.src('./docs/generated/**/*', { read: false })
  .pipe(rm({async: false}));
});

gulp.task('default', ['jshint', 'scripts', 'test']);
