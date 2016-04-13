var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less', function () {
  return gulp.src('./waterfall.less')
    .pipe(autoprefixer())
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename('./lib/waterfall.min.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('compress', function () {
    return gulp.src('./waterfall.js')
        .pipe(uglify())
        .pipe(rename('./lib/waterfall.min.js'))
        .pipe(gulp.dest('./'))
});

gulp.task('run', ['less', 'compress']);
