const argv = require('yargs').argv;
const gulp = require('gulp');
const sequence = require('gulp-sequence');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const typescript = require('gulp-typescript');
const mocha = require('gulp-mocha');
const rm = require('gulp-rimraf');

// determine build environment (development | production).
let env = argv.env || 'development';

gulp.task('clean', () => {
  return gulp.src('build/').pipe(rm());
});

let tsProject = typescript.createProject('./tsconfig.json');
gulp.task('compile', () => {
  return gulp.src(['src/**/*.ts'])
    .pipe(gulpIf(env === 'development', sourcemaps.init()))
    .pipe(tsProject())
    .pipe(gulpIf(env === 'development', sourcemaps.write('.', {
      sourceRoot: (file) => {
        return file.cwd + '/src'
      }
    })))
    .pipe(gulp.dest('build'));
});

gulp.task('tests', () => {
  return gulp.src('build/tests/**/*.js', {read: false})
    .pipe(mocha({}));
});

gulp.task('release', (callback) => {
  env = 'production';
  runSequence(
    'clean',
    'compile',
    'tests',
    callback
  );
});

gulp.task('default', sequence('compile', 'tests'));
