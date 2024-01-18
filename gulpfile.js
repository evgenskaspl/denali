
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const template = require('gulp-template');
const babelify = require('babelify');
const mozjpeg = require('imagemin-mozjpeg');

const {
    src,
    dest,
    parallel,
    series,
    watch
} = gulp

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

function copyRobots() {
    return src('src/robots.txt')
        .pipe(dest('dist'));
}

function copySitemap() {
    return src('src/sitemap.xml')
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
        https: false
    });
}

function changeQualityImg() {
    return src(['src/img/opt/*.jpg'])
        .pipe(imagemin([
            mozjpeg({ quality: 8 }), // Adjust quality as needed (0 to 100)
            // imagemin.optipng({ optimizationLevel: 5 }) // Adjust optimization level as needed (0 to 7)
        ]))
        .pipe(dest('dist/img/opt'));
};

// Tasks to define the execution of the functions simultaneously or in series

const tools = [html, copyFonts, copyPDF, copyFavicon, copyCssLibs, copyRobots, copySitemap, css, bundleJS, img]

exports.img = series(changeQualityImg);
exports.watch = parallel(...tools, watchFiles, browserSync);
exports.default = series(clear, parallel(changeQualityImg, ...tools));
