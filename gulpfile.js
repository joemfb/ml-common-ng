/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    karma = require('karma').server,
    path = require('path'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    ghpages = require('gulp-gh-pages'),
    cp = require('child_process'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    eventStream = require('event-stream'),
    source = require('vinyl-source-stream');

gulp.task('lint-style', function(done) {
  return gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jscs())
    .on('error', function(err) {
      console.error(err.message);
      this.emit('end');
    });
});

gulp.task('lint', ['lint-style'], function() {
  return gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return eventStream.merge(
      gulp.src([ './src/ml-common.js', './src/*.js' ]),
      browserify({ entries: [ './src/browserify/ml-query-builder.service.js', ]})
      .bundle()
      .pipe(source('ml-query-builder.js'))
      .pipe(buffer())
    )
    .pipe(concat('ml-common-ng.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-common-ng.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['lint'], function(done) {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    singleRun: true,
    autoWatch: false
  }, function() {
    done();
  });
});

gulp.task('autotest', function(done) {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    autoWatch: true
  }, function() {
    done();
  });
});

gulp.task('docs', ['clean-docs'], function(done) {
  cp.exec('./node_modules/.bin/jsdoc -c jsdoc.conf.json', function(err) {
    if (err) {
      return console.log(err);
    }

    gulp.src([
        './docs/generated/css/baseline.css',
        './docs/custom-styles.css'
      ])
      .pipe(concat('baseline.css'))
      .pipe(gulp.dest('./docs/generated/css'))
      .on('end', function() {
        done();
      });
  });
});

gulp.task('clean-docs', function(done) {
  return del(['./docs/generated/**/*']);
});

gulp.task('publish-docs', ['docs'], function() {
  return gulp.src([ './docs/generated/**/*.*' ])
  .pipe(ghpages());
});

gulp.task('default', ['lint', 'test', 'scripts']);
