const gulp = require('gulp');
const sequence = require('gulp-sequence');
const typescript = require('gulp-typescript');
const mocha = require('gulp-mocha');

gulp.task('compile', () => {
  let tsProject = typescript.createProject('./tsconfig.json');
  return gulp.src(['src/**/*.ts'])
    .pipe(tsProject()).pipe(gulp.dest('build'));
});

gulp.task('tests', () => {
  return gulp.src('build/tests/**/*.js', {read: false})
    .pipe(mocha({}));
});

gulp.task('default', sequence('compile', 'tests'));
