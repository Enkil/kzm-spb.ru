'use strict';

/************/
/* Settings */
/************/

/* Gulp plugins */
var gulp = require('gulp'),
    // Styles
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    cssshrink = require('gulp-cssshrink'),
    csscomb = require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer'),
    // HTML
    prettify = require('gulp-prettify'),
    jade = require('gulp-jade'),
    // Images
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    // SVG
    svg2png = require('gulp-svg2png'),
    svgmin = require('gulp-svgmin'),
    svgspritesheet = require('gulp-svg-spritesheet'),
    // JavaScript
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    // Common
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    newer = require('gulp-newer'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    mainBowerFiles = require('main-bower-files'),
    rename = require('gulp-rename'),
    ghPages = require('gulp-gh-pages'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence').use(gulp);

/* Path settings */
var pathTo = {
        Src: {
            Styles: 'src/scss/**/*.scss',
            Jade: 'src/jade/**/*.jade',
            Images: ['src/img/**/*.*', '!src/img/sprite/*.*'],
            PngSprite: 'src/img/sprite/**/*.png',
            GHPages: 'build/**/*',
            JS: 'src/js/**/*.*',
            JSVendor: 'vendor/**/*.js',
            BowerJSVendor: 'src/js/vendor/',
            JSCustom: ['functions/**/*.js', 'main.js'],
            CSSVendor: 'src/scss/vendor/',
            Txt: ['src/humans.txt', 'src/robots.txt'],
            Fonts: 'src/scss/fonts/**/*',
            Svg: ['src/svg/**/*.*', '!src/svg/sprite/*.*'],
            SvgSprite: 'src/svg/sprite/**/*.svg',
            SvgSpriteTpl: 'src/scss/includes/_svg-sprite-sass.tpl'
        },
        Build: {
            Styles: 'build/css',
            Html: 'build/',
            Images: 'build/img',
            PngSprite: 'build/img/sprite',
            PngSpriteCSS: 'src/scss/includes',
            JSVendor: 'build/js',
            JSCustom: 'build/js/custom',
            Txt: 'build/',
            Clean: ['build/**/*', '!build/.gitignore'],
            Fonts: 'build/css/fonts',
            Svg: 'build/svg',
            SvgSprite: 'build/svg/sprite/svg-sprite.svg',
            SvgSpriteNoSvg: 'build/svg/sprite/svg-sprite.png',
            SvgSpriteCSS: 'src/scss/includes/_svg-sprite.scss'
        }
};

/* GitHub Pages options*/
var ghpOptions = {
    remoteUrl: "git@github.com:Enkil/kzm-spb.ru.git"
    //branch: "master"
    };

/* Browser versions for automatically prefix */
var autoprefixerBrowsers = ['last 3 versions', '> 1%', 'Firefox ESR'];

/* BrowserSync local web server settings */
var config = {
    server: './build',
    baseDir: './build',
    tunnel: true,
    host: 'localhost',
    port: 9000,
    injectChanges: true,
    logPrefix: "Template Front-End"
};

/*********/
/* Tasks */
/*********/

/* SASS */
gulp.task('sass', function () {
    gulp.src(pathTo.Src.Styles)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(newer(pathTo.Build.Styles))
        .pipe(sourcemaps.init())
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerBrowsers))
            //.pipe(cssshrink())
            .pipe(csscomb())
            .pipe(gulp.dest(pathTo.Build.Styles))
            .pipe(rename({ suffix: '.min' }))
            .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathTo.Build.Styles))
        .pipe(reload({stream: true}));
});

/* Jade */
gulp.task('jade', function() {
    return gulp.src(pathTo.Src.Jade)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(newer(pathTo.Build.Html))
        .pipe(jade({
            pretty: true
        }))
        .pipe(prettify({indent_size: 2}))
        .pipe(gulp.dest(pathTo.Build.Html))
        .pipe(reload({stream: true}));
});

/* Images */
gulp.task('images', function () {
    return gulp.src(pathTo.Src.Images)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(newer(pathTo.Build.Images))
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(pathTo.Build.Images))
        .pipe(reload({stream: true}));
});

/* PNG Sprite */
gulp.task('png-sprite', function () {

    // Generate spritesheet
    var spriteData = gulp.src(pathTo.Src.PngSprite)
        .pipe(spritesmith({
            imgName: 'png-sprite.png',
            imgPath: '../img/sprite/png-sprite.png',
            padding: 1,
            cssName: '_png-sprite.scss',
            cssVarMap: function (sprite) {
                sprite.name = 'sprite__' + sprite.name;
            }
        }));

    // Pipe image stream through image optimizer and onto disk
    spriteData.img
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(imagemin())
        .pipe(gulp.dest(pathTo.Build.PngSprite))
        .pipe(reload({stream: true}));

    // Pipe CSS stream onto disk
    spriteData.css
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(gulp.dest(pathTo.Build.PngSpriteCSS))
        .pipe(reload({stream: true}));
});

/* SVG */
gulp.task('svg', function () {
    return gulp.src(pathTo.Src.Svg)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(newer(pathTo.Build.Svg))
        .pipe(svgmin())
        .pipe(gulp.dest(pathTo.Build.Svg))
        .pipe(reload({stream: true}));
});

/* SVG sprite */
gulp.task('svg-sprite', function () {
    gulp.src(pathTo.Src.SvgSprite)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(newer(pathTo.Build.SvgSprite))
        .pipe(svgspritesheet({
            cssPathNoSvg: '../svg/sprite/svg-sprite.png',
            cssPathSvg: '../svg/sprite/svg-sprite.svg',
            padding: 1,
            pixelBase: 16,
            positioning: 'packed',
            templateSrc: pathTo.Src.SvgSpriteTpl,
            templateDest: pathTo.Build.SvgSpriteCSS,
            units: 'rem'
        }))
        .pipe(svgmin())
        .pipe(gulp.dest(pathTo.Build.SvgSprite))
        .pipe(svg2png())
        .pipe(gulp.dest(pathTo.Build.SvgSpriteNoSvg));
});

/* JavaScript */
gulp.task('js', function () {
    var customJS = gulpFilter(pathTo.Src.JSCustom, {restore: true}),
        vendorJS = gulpFilter(pathTo.Src.JSVendor, {restore: true});

    return gulp.src(pathTo.Src.JS)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        // Get custom JS
        .pipe(customJS)
            //.pipe(newer(pathTo.Build.JSCustom))
            .pipe(sourcemaps.init())
                .pipe(jshint())
                .pipe(jshint.reporter(stylish))
                .pipe(gulp.dest(pathTo.Build.JSCustom))
                .pipe(concat('custom-bundle.js'))
                .pipe(gulp.dest(pathTo.Build.JSCustom))
                .pipe(rename({ suffix: '.min' }))
                .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pathTo.Build.JSCustom))
        .pipe(customJS.restore)
        // Get custom JS
        .pipe(vendorJS)
            .pipe(newer(pathTo.Build.JSVendor))
            .pipe(gulp.dest(pathTo.Build.JSVendor))

});

/* Copy pure plain-text files */
gulp.task('txt', function() {
    gulp.src(pathTo.Src.Txt)
        .pipe(gulp.dest(pathTo.Build.Txt))
});

/* Get Bower files */
gulp.task('bower', function () {
    var jsFilter = gulpFilter(['**/*.js'], {restore: true}),
        cssFilter = gulpFilter(['**/*.{css,scss,sass}'], {restore: true});

    return gulp.src(mainBowerFiles({
        includeDev: true
    }))
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        // Get vendor JavaScript
        .pipe(jsFilter)
            .pipe(sourcemaps.init())
                .pipe(gulp.dest(pathTo.Src.BowerJSVendor))
                .pipe(concat('vendor-bundle.js'))
                .pipe(gulp.dest(pathTo.Src.BowerJSVendor))
                .pipe(rename({ suffix: '.min' }))
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(pathTo.Src.BowerJSVendor))
        .pipe(jsFilter.restore)
        // Get vendor CSS
        .pipe(cssFilter)
            .pipe(gulp.dest(pathTo.Src.CSSVendor))
        .pipe(reload({stream: true}));
});

/* Fonts */
gulp.task('fonts', function() {
    return gulp.src(pathTo.Src.Fonts)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(newer(pathTo.Build.Fonts))
        .pipe(gulp.dest(pathTo.Build.Fonts))
        .pipe(reload({stream: true}));
});

/* GitHub Pages */
gulp.task('gh-pages', function() {
    return gulp.src(pathTo.Src.GHPages)
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(ghPages(ghpOptions));
});

/* BrowserSync local web server*/
gulp.task('webserver', function () {
    browserSync(config);
});

/* Clean build directory */
gulp.task('clean', function () {
    del(pathTo.Build.Clean);
});

/**
 * Watchers
 * */
gulp.task('sass:watch', function () {
    gulp.watch(pathTo.Src.Styles, ['sass']);
});
gulp.task('jade:watch', function () {
    gulp.watch(pathTo.Src.Jade, ['jade']);
});
gulp.task('images:watch', function () {
    gulp.watch(pathTo.Src.Images, ['images']);
});
gulp.task('png-sprite:watch', function () {
    gulp.watch(pathTo.Src.PngSprite, ['png-sprite']);
});
gulp.task('bower:watch', function () {
    gulp.watch('bower.json', ['bower']);
});
gulp.task('txt:watch', function () {
    gulp.watch(pathTo.Src.Txt, ['txt']);
});
gulp.task('js:watch', function () {
    gulp.watch(pathTo.Src.JS, ['js']);
});
gulp.task('fonts:watch', function () {
    gulp.watch(pathTo.Src.Fonts, ['fonts']);
});

/* Main watcher */
gulp.task('watch', ['webserver'],function() {
    gulp.watch(pathTo.Src.Styles, ['sass']);
    gulp.watch(pathTo.Src.Jade, ['jade']);
    gulp.watch(pathTo.Src.Images, ['images']);
    gulp.watch(pathTo.Src.PngSprite, ['png-sprite']);
    gulp.watch('bower.json', ['bower']);
    gulp.watch(pathTo.Src.Txt, ['txt']);
    gulp.watch(pathTo.Src.JS, ['js']);
    gulp.watch(pathTo.Src.Fonts, ['fonts']);
});

/* Build */
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'jade',
        'bower',
        'js',
        'png-sprite',
        'images',
        'svg',
        'svg-sprite',
        'fonts',
        'sass',
        'txt',
        'gh-pages',
        callback)
});

/* Default */
gulp.task('default', ['watch'], function() {
});