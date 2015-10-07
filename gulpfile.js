/* jshint node: true */

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var Server = require('karma').Server;
var path = require('path');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var ghpages = require('gulp-gh-pages');
var cp = require('child_process');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var eventStream = require('event-stream');
var source = require('vinyl-source-stream');
var coveralls = require('gulp-coveralls');

// Command line option:
//  --fatal=[warning|error|off]
var fatalLevel = require('yargs').argv.fatal || 'error';

var ERROR_LEVELS = ['error', 'warning'];

function handleError(level, error) {
  gutil.log(error.message);
  if ( ERROR_LEVELS.indexOf(level) <= ERROR_LEVELS.indexOf(fatalLevel) ) {
    process.exit(1);
  }
}

gulp.task('lint', function() {
  return gulp.src([ './gulpfile.js', './src/**/*.js' ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', function(err) {
      handleError('warning', err);
      this.emit('end');
    });
});

gulp.task('scripts', function() {
  return eventStream.merge(
      gulp.src([ './src/ml-common.js', './src/*.js' ]),

      browserify({ entries: [ './src/browserify/ml-query-builder.service.js' ] })
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

function karmaResult(cb, result) {
  var err = null;
  if (result === 1) {
    err = new Error('test failed');
  }
  cb(err);
}

gulp.task('test', ['lint'], function(done) {
  new Server({
    configFile: path.join(__dirname, './karma.conf.js'),
    singleRun: true,
    autoWatch: false
  }, karmaResult.bind(null, done))
  .start();
});

gulp.task('autotest', function(done) {
  new Server({
    configFile: path.join(__dirname, './karma.conf.js'),
    autoWatch: true
  }, karmaResult.bind(null, done))
  .start();
});

gulp.task('docs', ['clean-docs'], function(done) {
  cp.exec('./node_modules/.bin/jsdoc -c jsdoc.conf.json', function(err) {
    if (err) {
      return console.log(err);
    }

    gulp.src([ './docs/generated/css/baseline.css', './docs/custom-styles.css' ])
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

gulp.task('coveralls', function() {
  return gulp.src('coverage/**/lcov.info')
  .pipe(coveralls());
});

gulp.task('default', ['lint', 'test', 'scripts']);
