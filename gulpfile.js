var pkg = require('./package.json');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var dependencies = [];
for (var libName in pkg.dependencies) {
  dependencies.push(libName);
}

gulp.task('buildApp', function () {
  var b = browserify({
    debug: true,
    entries: ['./src/index.js']
  });

  dependencies.forEach(function (lib) {
    b.exclude(lib);
  });

  return b.bundle()
    .pipe(source('index.js'))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./build/'))
    .pipe(livereload());
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
  return gulp.src([
      './src/**/*.html', './src/**/*.css'
    ])
    .pipe(gulp.dest('./build/'))
    .pipe(livereload());
});

gulp.task('build', ['buildApp', 'buildLib', 'moveStatic']);

gulp.task('watch', function() {
  livereload.listen(pkg.liveReloadOptions);
  gulp.watch(['./src/**/*.js'], ['buildApp']);
  gulp.watch(['./src/**/*.html'], ['moveStatic']);
});

gulp.task('default', ['buildApp', 'watch']);