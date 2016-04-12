var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('compress', function () {
    return gulp.src('./waterfall.js')
        .pipe(uglify())
        .pipe(rename('./lib/waterfall.min.js'))
        .pipe(gulp.dest('./'))
});

gulp.task('less', function () {
  return gulp.src('./*.less')
    .pipe(autoprefixer())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./lib'));
});
