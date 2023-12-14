
const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const template = require('gulp-template');

// gulp config
const { htmlName, paths, port } = {
    port: 3000,
    htmlName: 'index.html',
    paths: {
        baseDir: './dist',
        htmlTemplate: './src/index_template.html',
        css: 'css/main.min.css',
        js: 'js/bundle.min.js'
    }
}

function clear() {
    return src('./dist/*', {
        read: false
    })
        .pipe(clean());
}

function html() {
    return src(paths.htmlTemplate)
        .pipe(template({ cssPath: paths.css, jsPath: paths.js }))
        .pipe(rename(htmlName))
        .pipe(dest('dist'))
        .pipe(browsersync.stream());
};

function css() {
    const source = 'src/scss/*.scss';

    return src(source)
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        // .pipe(cssnano())
        .pipe(dest('./dist/css/'))
        .pipe(browsersync.stream());
}

function js() {
    const source = 'src/js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./dist/js/'))
        .pipe(browsersync.stream());
}

function img() {
    return src('src/img/*')
        .pipe(imagemin())
        .pipe(dest('./dist/img'));
}

function copyFonts() {
    return src('src/fonts/*')
        .pipe(imagemin())
        .pipe(dest('dist/fonts'));
}

function copyFavicon() {
    return src('src/favicon.ico')
        .pipe(imagemin())
        .pipe(dest('dist'));
}

function watchFiles() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/*', js);
    watch('src/img/*', img);
    watch(paths.htmlTemplate, html);
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: paths.baseDir,
        },
        port,
    });
}

// Tasks to define the execution of the functions simultaneously or in series

const tools = [html, copyFonts, copyFavicon, js, css, img]

exports.watch = parallel(...tools, watchFiles, browserSync);
exports.default = series(clear, parallel(...tools));
