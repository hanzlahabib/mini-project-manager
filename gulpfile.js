// initialize modues
const { src, watch, dest, series, parallel } = require('gulp')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const polyfiller = require('gulp-polyfiller');

// File path variables
const files = {
  scssPath: 'src/scss/**/*.scss',
  scssMainPath: 'src/scss/main.scss',
  jsPath: 'src/js/**/*.js'
}


// Sass task

function scssTask(){
  return src(files.scssMainPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
      }


// JS task

function jsTask(){
    return src(files.jsPath)
          .pipe(concat('main.js'))
          .pipe(dest('build/js')
          );
}

// BrowserSync method

function browserSyncTask(){
  browserSync.init({
    server: {
        baseDir: "./build"
    }
});
}
//Reload method

function reload(done){
  browserSync.reload();
  done();
}


// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask(){
  return src(['build/index.html'])
        .pipe(replace(/cb=\d+/g, 'cb='+cbString))
        .pipe(dest('.'))
}
// watch task

function watchTask(){
  watch([files.scssPath, files.jsPath],
    parallel(scssTask,jsTask));
}

// Default task

exports.default = series(
  parallel(scssTask, jsTask),
  cacheBustTask,
  watchTask
)
