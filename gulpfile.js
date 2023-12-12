
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

console.log('test', process.env.NODE_ENV)
const isDev = process.env.NODE_ENV === 'development'

// gulp config
const { htmlName, paths, port } = {
    port: 3000,
    htmlName: 'index.html',
    paths: {
        baseDir: './',
        htmlTemplate: './index_template.html',
        css: isDev ? 'dist/css/main.min.css' : 'css/main.min.css',
        js: isDev ? 'dist/js/bundle.min.js' : 'js/bundle.min.js'
    }
}

function clear() {
    return src('./dist/*', {
        read: false
    })
        .pipe(clean());
}



function devHtml() {
    return src(paths.htmlTemplate)
        .pipe(template({ cssPath: paths.css, jsPath: paths.js }))
        .pipe(rename(htmlName))
        .pipe(dest(paths.baseDir))
        .pipe(browsersync.stream());
};


function html() {
    return src(paths.htmlTemplate)
        .pipe(template({ cssPath: paths.css, jsPath: paths.js }))
        .pipe(rename(htmlName))
        .pipe(dest('dist'))
};

function css() {
    const source = './src/scss/*.scss';

    return src(source)
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./dist/css/'))
        .pipe(browsersync.stream());
}

function js() {
    const source = './src/js/*.js';

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
    return src('./src/img/*')
        .pipe(imagemin())
        .pipe(dest('./dist/img'));
}

function watchFiles() {
    watch('./src/scss/*', css);
    watch('./src/js/*', js);
    watch('./src/img/*', img);
    watch(paths.htmlTemplate, devHtml);
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

exports.watch = parallel(devHtml, watchFiles, browserSync);
exports.default = series(clear, parallel(html, js, css, img));
