
// Load plugins
require('es6-promise');
var gulp = require('gulp'),
    sassruby = require('gulp-ruby-sass'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    runSequence = require('run-sequence')
    nodemon=require('gulp-nodemon');


// Clean
gulp.task('clean', function() {
  return del(['build']);
});


// Styles
gulp.task('sass', function() {
  return sassruby('dev/assets/scss/**', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/assets/css'))  

    .pipe(minifycss())

    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(livereload());
});



// copy files
gulp.task('copyFiles', function() {

  gulp.src(['./dev/index.html'])    
    .pipe(gulp.dest('build/'))
    

    
     gulp.src(['./dev/modules/**'])    
    .pipe(gulp.dest('build/modules'))

    gulp.src(['./dev/templates/**'])    
    .pipe(gulp.dest('build/templates'))
    

    gulp.src(['./dev/assets/libs/**'])    
    .pipe(gulp.dest('build/assets/libs/'))
   

    gulp.src(['./dev/assets/css/**'])    
    .pipe(gulp.dest('build/assets/css/')) 

    gulp.src(['./dev/assets/js/**'])    
    .pipe(gulp.dest('build/assets/js/'))

        gulp.src(['./dev/assets/img/**'])    
    .pipe(gulp.dest('build/assets/img/'))

    .pipe(notify({ message: 'All files task complete' }));  

});



// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch(['dev/assets/scss/**','dev/index.html','dev/modules/**/**','dev/assets/js/*'], ['sass','copyFiles']);

  nodemon({
    // the script to run the app
    script: 'server.js',
    ext: 'js'
  }).on('restart', function(){ 
    // when the app has restarted, run livereload.
    gulp.src('server.js')
      

  })

});




gulp.task('default', function(callback) {
  runSequence('clean',
              ['sass','copyFiles','watch'])
});




