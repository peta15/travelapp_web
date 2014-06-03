var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var path = require('path');

var paths = {
  less: ['./less/**/*.less']
};

gulp.task('less', function(done) {
  gulp.src(paths.less)
    .pipe(less())
    .pipe(gulp.dest('./css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
});

gulp.task('default', ['less']);
