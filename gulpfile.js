var pkg = require('./package.json');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var transform = require('vinyl-transform');

var dependencies = [];
for (var libName in pkg.dependencies) {
  dependencies.push(libName);
}

gulp.task('buildApp', function () {
  var browserified = transform(function(filename) {
    var b = browserify({
      entries: filename,
      debug: true
    });

    dependencies.forEach(function (lib) {
      b.exclude(lib);
    });

    return b.bundle();
  });

  return gulp.src(['./src/index.js']) 
    .pipe(browserified)
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./build/'))
    .pipe(livereload());
});

gulp.task('buildLib', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);

    dependencies.forEach(function (lib) {
      b.require(lib);
    });

    return b.bundle();
  });

  return gulp.src('./src/dependencies.js') 
    .pipe(browserified)
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