/*jshint node: true */

'use strict';

var browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    clone = require('gulp-clone'),
    concat = require('gulp-concat'),
    cp = require('child_process'),
    eventStream = require('event-stream'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    path = require('path'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace-task'),
    rm = require('gulp-rm'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify');

gulp.task('jshint', function() {
  return gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

function myBrowserify(src, config) {
  return eventStream.merge(src.pipe(clone()),
    browserify(config).bundle()
    .pipe(source('ml-query-builder.js'))
    .pipe(buffer())
  );
}

gulp.task('scripts', function() {
  var src = gulp.src('./src/*.js');

  var shim = myBrowserify(src, {
    entries: 'src/browserify/query-builder-shim.js',
    bare: true,
    builtins: []
  })
  .pipe(concat('ml-common-ng-shim.js'))
  .pipe(replace({
    patterns: [{
      match: /MLQueryBuilderShim/,
      replacement: 'MLQueryBuilder'
    }]
  }));

  var full = myBrowserify(src, { entries: [
    'src/browserify/ml-query-builder.service.js',
    'src/browserify/query-builder-extensions.js'
  ]})
  .pipe(concat('ml-common-ng.js'));

  eventStream.merge(shim, full)
  .pipe(gulp.dest('dist'))
  .pipe(rename(function(path) { path.extname = '.min.js'; }))
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
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
