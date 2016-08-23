
// Load plugins
require('es6-promise');
var gulp = require('gulp'),
    sassruby = require('gulp-ruby-sass'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS  = require('gulp-minify-css'),
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
    nodemon=require('gulp-nodemon')
    sourcemaps = require('gulp-sourcemaps')
    concatCss = require('gulp-concat-css')
    stylish=require('jshint-stylish'),
    Server = require('karma').Server;
// Clean
gulp.task('clean', function() {
  return del(['build']);
});
// Styles
gulp.task('sass', function() {  
    return gulp.src(['dev/modules/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/assets/css/'))
    .pipe(concatCss(""))
    .pipe(minifyCSS())
    .pipe(rename('all-modules.min.css'))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));    
});

gulp.task('lint', function() {
  gulp.src(['dev/modules/**/*directive.js','dev/assets/js/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

// copy files
gulp.task('copyFiles', function() {

    gulp.src(['./dev/index.html'])    
    .pipe(gulp.dest('build/'))  

    gulp.src(['./dev/modules/**/*.html'])    
    .pipe(gulp.dest('build/modules/'))

    gulp.src(['./dev/templates/**'])    
    .pipe(gulp.dest('build/templates'))    

    gulp.src(['./dev/assets/libs/**'])    
    .pipe(gulp.dest('build/assets/libs/'))   

    gulp.src(['./dev/assets/css/**'])    
    .pipe(gulp.dest('build/assets/css/'))  

    gulp.src(['./dev/assets/img/**'])    
    .pipe(gulp.dest('build/assets/img/'))

    gulp.src(['./dev/assets/data/**'])    
    .pipe(gulp.dest('build/assets/data/'))

    gulp.src(['./dev/assets/js/lib/jquery-1.12.1.min.js','./dev/assets/js/lib/angular.js','./dev/assets/js/lib/ui-bootstrap.js','./dev/assets/js/lib/angular-animate.js','./dev/assets/js/lib/angular-sanitize.js','./dev/assets/js/lib/angular-ui-router.js','./dev/assets/js/lib/angular-mocks.js','./dev/assets/js/lib/angular-modal-service.js','./dev/assets/js/lib/jquery-ui.js','./dev/assets/js/lib/responsive-table.js','./dev/assets/js/app.js','./dev/modules/**/*controller.js','./dev/modules/**/*directive.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('build/assets/js/'))    

    .pipe(notify({ message: 'All files task complete' }));  
});

gulp.task('server', function(){
    nodemon({
        // the script to run the app
        script: 'server.js',
        ext: 'js'
    }).on('restart', function(){ 
        // when the app has restarted, run livereload.
        gulp.src('server.js')
    });

});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', function() {
  gulp.watch(['dev/assets/css/**','dev/modules/**/**.scss','dev/modules/**/*.js','dev/assets/js/*'], ['sass','copyFiles']);
});

gulp.task('default', function() {  
  runSequence('clean', ['sass' ,'lint','copyFiles','watch'],function() {
        console.log('Run something else');
         nodemon({
        // the script to run the app
        script: 'server.js',
        ext: 'js'
    }).on('restart', function(){ 
        // when the app has restarted, run livereload.
        gulp.src(['server.js','copyFiles','watch'])
    });
    }); 
});

gulp.task('prod', function() {
  runSequence('clean', ['sass','copyFiles'])
});