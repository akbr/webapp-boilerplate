var pkg = require('./package.json');
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var dependencies = Object.keys(pkg.dependencies);

var path = './src/**/*.';
var staticExtensions = ['html', 'css', 'png'];
var staticSrcs = staticExtensions.map(ext => path + ext);

gulp.task('buildApp', function () {
  var b = browserify({
    debug: true,
    entries: ['./src/index.js']
  });

  dependencies.forEach(lib => b.exclude(lib));

  return b.bundle()
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload());
});

gulp.task('buildLib', function () {
  var b = browserify({
    entries: ['./src/dependencies.js']
  });

  dependencies.forEach(function (lib) {
    b.require(lib);
  });

  return b.bundle()
    .pipe(source('dependencies.js'))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./build/'));
});

gulp.task('moveStatic', function () {
  return gulp
    .src(staticSrcs)
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload());
});

gulp.task('build', ['buildApp', 'buildLib', 'moveStatic']);

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js'], ['buildApp']);
  gulp.watch(staticSrcs, ['moveStatic']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('default', ['connect', 'buildApp', 'watch']);