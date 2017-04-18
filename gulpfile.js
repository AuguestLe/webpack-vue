var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');//文件合并
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');// js压缩
var minifyCss = require('gulp-minify-css'); // css压缩
var imagemin = require('gulp-imagemin');// 图片压缩
var rename = require('gulp-rename');        // 重命名
var cache = require('gulp-cache');
var del = require('del');
var wiredep = require('wiredep').stream; 
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var jshint = require('gulp-jshint');
var inject =require('gulp-inject');
var ngHtml2js = require('gulp-ng-html2js');
var htmlmin = require('gulp-htmlmin');
var bowerFiles = require('main-bower-files');
var minifyHtml = require('gulp-minify-html');
var paths = {
 js: ['app/**/*.js'],
 css: ['./app/css/**/*.css'],
 templates: './app/js/templates.js',
 buildjs: ['./dist/**/*.js'],
 buildcss: ['./dist/**/*.css']
};
var pathss = {
    scripts:['app/**/*.js'],
    styles: 'app/css/**/*.css',
    views: 'app/view/**/*.html'
}
var deployEnvironment = $.util.env.type || 'development';
gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('vendor',function(){
    gulp.src([
       "bower_components/bootstrap/dist/css/bootstrap.min.css",
       "bower_components/bootstrap/dist/css/bootstrap-theme.css",
       "bower_components/normalize-css/normalize.css",
       "bower_components/jquery/dist/jquery.js",
       "bower_components/bootstrap/dist/js/bootstrap.min.js",
       "bower_components/angular-cache/dist/angular-cache.min.js",
       "bower_components/angular/angular.js",
       "bower_components/angular-cookies/angular-cookies.js",
       "bower_components/underscore/underscore.js",
       "bower_components/angular-ui-router/release/angular-ui-router.js",
       "bower_components/angular-sanitize/angular-sanitize.js",
       "bower_components/angular-resource/angular-resource.js",
       "bower_components/angular-animate/angular-animate.js",
       "bower_components/angular-cache/dist/angular-cache.js",
       "bower_components/angular-messages/angular-messages.js",
       "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
       "bower_components/angular-file-upload/dist/angular-file-upload.min.js"
    ])
    .pipe(gulp.dest("dist/lib"));
})
// 压缩css
gulp.task('minifyCss', function(){
    return gulp.src('app/css/*.css')
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});
//压缩js
gulp.task('minifyJs', function(){
    return gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/js'));
});
// 压缩图片
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('./dist/images'))
});
gulp.task('buildHhtml', function () {
    return gulp.src(['app/view/**/*.html'])
        .pipe(htmlmin())
        .pipe(ngHtml2js({
            moduleName: 'template-app'
        }))
        .pipe(concat('template.tpl.js'))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('buildAppJs', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('minhtml',function(){
    return gulp.src('index.html')
        .pipe(gulp.dest('dist'));
})
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})

gulp.task('clean:build', function(callback){
  del(['build/**/*', '!build/images', '!build/images/**/*'], callback)
});
gulp.task('build', function (callback) {
  'clean:build',runSequence(
    ['sass', 'vendor','minifyCss', 'minifyJs','devIndex','buildHhtml' ,'buildAppJs','images','minhtml'],
    callback
  )
  //gulp.run('sass', 'minifyCss', 'minifyJs', 'images');
})

gulp.task('template', function () {
    return gulp.src('app/view/**/*.html')
    .pipe(templateCache({module: 'myApp'}))
    .pipe(gulp.dest('app/js'))
});

gulp.task('jshint', function() {
    gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('bower', function () {    
  gulp.src('./index.html')  
    .pipe(wiredep({  
      optional: 'configuration',  
      goes: 'here'  
    }))  
    .pipe(gulp.dest('./'));  
});



// 引入文件不压缩
gulp.task('index',function() {  
    gulp.src('./index.html')  
    .pipe(inject(gulp.src(paths.js, {  read: false }), { relative: true }))
    .pipe(inject(gulp.src(paths.css, {  read: false }), { relative: true }))
    .pipe(gulp.dest('./'));  
});  
// 构建测试文件和部署环境
gulp.task('dev', ['clean', 'jshint', 'template'], function () {
    return gulp.src('./index.html')
    .pipe(inject(gulp.src(paths.buildjs, {read: false}), {relative: true}))
    .pipe(inject(gulp.src(paths.buildcss, {read: false}), {relative: true}))
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
    .pipe(gulp.dest('./'));
});

gulp.task('watch',['browserSync'],function(){
    gulp.watch(paths.scripts, ['build']);
    gulp.watch(paths.views, ['build']);
    gulp.watch(paths.styles, ['build']);
    // other watchers
})
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    })
})
gulp.task('default', function (callback) {
  runSequence(['clean', 'build','browserSync','watch'],
    callback
  )
})
gulp.task('scripts' ,['clean'],function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(pathss.scripts)
        .pipe(ngAnnotate())
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('views', ['clean'],function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(pathss.views)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/views'));
});
gulp.task('styles',['clean'], function() {
    return gulp.src(pathss.styles)
        // .pipe(sourcemaps.init())
        // .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(minifyCss())
        .pipe(concat('app.min.css'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});
gulp.task('build', ['clean', 'vendor','images','scripts', 'views', 'styles']);