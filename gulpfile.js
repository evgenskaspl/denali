
const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
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
const babel = require('gulp-babel');
const babelify = require('babelify');
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
        .pipe(cssnano())
        .pipe(dest('./dist/css/'))
        .pipe(browsersync.stream());
}

function bundleJS() {
    const sourcePath = 'src/js/main.js';
    return browserify({
        entries: sourcePath, // Adjust the entry file based on your project structure
        debug: true, // Enable source maps for better debugging
    })
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        // .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('dist/js'))
        .pipe(browsersync.stream())
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

function copyCssLibs() {
    return src('src/scss/libs/*')
        .pipe(imagemin())
        .pipe(dest('dist/css/libs'));
}

function copyPDF() {
    return src('src/PrivacyPolicy.pdf')
        .pipe(dest('dist'));
}

function copyFavicon() {
    return src('src/favicon.ico')
        .pipe(imagemin())
        .pipe(dest('dist'));
}

function watchFiles() {
    watch('src/scss/**/*.scss', css);
    watch('src/js/*', bundleJS);
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

const tools = [html, copyFonts, copyPDF, copyFavicon, copyCssLibs, css, bundleJS, img]

exports.watch = parallel(...tools, watchFiles, browserSync);
exports.default = series(clear, parallel(...tools));
