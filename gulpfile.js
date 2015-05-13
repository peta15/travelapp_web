var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var path = require('path');
var uglify = require('gulp-uglify');
var gulpBowerFiles = require('gulp-bower-files');
var args = require('yargs').argv;
var gulpNgConfig = require('gulp-ng-config');

var paths = {
  less: ['./less/**/*.less']
};

gulp.task('less', function(done) {
  gulp.src(paths.less)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./css/'))
    // .pipe(minifyCss({
    //   keepSpecialComments: 0
    // }))
    // .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

gulp.task('uglify', function() {
  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
  gulpBowerFiles()
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
});

// usage: gulp config --env production
gulp.task('config', function () {
  // Get the environment from the command line
  var env = args.env || 'dev';
  gulp.src('config.json')
  .pipe(gulpNgConfig('app.config', {
    environment: env
  })).pipe(gulp.dest('./js/'))
});

gulp.task('default', ['less']);
