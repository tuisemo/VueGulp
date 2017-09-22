// 引入 gulp
const gulp = require('gulp');

// 引入组件
const jshint = require('gulp-jshint');
const htmlhint = require('gulp-htmlhint');
const changed = require('gulp-changed');
const less = require('gulp-less');
const concat = require('gulp-concat');
const jsmin = require('gulp-uglify');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const inject = require('gulp-inject'); // html中插入js/css
const sourcemaps = require('gulp-sourcemaps');
const watch = require("gulp-watch");
const cache = require("gulp-cache");
const ext_replace = require('gulp-ext-replace');
const base64 = require('gulp-base64');
const browserSync = require('browser-sync').create();
var reload = browserSync.reload;


// 检查脚本
gulp.task('jshint', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// 检查html
gulp.task('htmlhint', function() {
    gulp.src(['./src/*.html'])
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});
// 编译Less
gulp.task('less', function() {
    return gulp.src(['./src/css/less/*.less', '!./src/css/less/base.less'])
        .pipe(cache(less()))
        .pipe(gulp.dest('./src/css'));
});
// 压缩css
gulp.task('cssmin', ['less'], function() {
    gulp.src(['./src/css/*.css'])
        .pipe(cache(cssmin({
            compatibility: 'ie8', //保留ie8及以下兼容写法
            keepSpecialComments: '*'
        })))
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({ stream: true }));
});
// include公共文件
gulp.task('fileinclude', function() {
    gulp.src('./src/*.html')
        .pipe(fileinclude({
            prefix: '<!--IEhack@',
            suffix: '-->',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest('public'))
        .pipe(ext_replace('.ejs'))
        .pipe(gulp.dest('./views'))
        .pipe(reload({ stream: true }));
});
// 图片转base64
gulp.task('picbase64', function() {
    return gulp.src('./src/css/*.css')
        .pipe(base64({
            //baseDir: './src/',
            extensions: ['jpg', 'png', 'jpge'],
            //exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 1000 * 1024, // bytes 
            debug: true
        }))
        .pipe(gulp.dest('./public/css'));
});

// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src(['./src/js/*.js'])
        .pipe(jsmin())
        .pipe(gulp.dest('./public/js'))
        .pipe(reload({ stream: true }));
    gulp.src(['./src/js/lib/.js'])
        .pipe(jsmin())
        .pipe(gulp.dest('./public/js/lib'))
        .pipe(reload({ stream: true }));
});


gulp.task('browser-sync', function() {
    browserSync.init({
        // proxy:'localhost:3000',
        port: 3000,
        server: {
            baseDir: "./public"
        }
    });
});


// 默认任务
gulp.task('default', ['htmlhint', 'fileinclude', 'less', 'cssmin', 'jshint', 'scripts', 'browser-sync'], function() {

    // 监听文件变化
    gulp.watch('./src/js/*.js', ['jshint', 'scripts']);
    gulp.watch(['./src/css/*.css', './src/css/less/*.less'], ['less','cssmin']);
    gulp.watch('./src/*.html', ['htmlhint', 'fileinclude']);
    gulp.watch('./public/*/*.*').on('change', reload);
});