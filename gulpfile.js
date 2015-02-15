'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var inlinesource = require('gulp-inline-source');
var uglify = require('gulp-uglify');
var testCommands = ['cd <%=file.path %>;npm install ../..;npm prune;cp -R ../../node_modules node_modules;npm install;npm run-script disc;npm test'];

gulp.task('build', ['minify-css', 'minify-js', 'inlinesource']);

gulp.task('minify-css', function() {
    return gulp.src('./source/css/*.css')
    .pipe(concat('production.css'))
    .pipe(minifyCSS(
        {
            keepBreaks: false,
            keepSpecialComments: 0
        }
    ))
    .pipe(gulp.dest('./public/'));
});
gulp.task('minify-js', function () {
    return gulp.src(['./source/js/zaiquery.js', './source/js/autocomplete.js'])
    .pipe(concat('production.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('inlinesource', function () {
    gulp.src('source/html/index.html')
        .pipe(inlinesource(
            {
                swallowErrors: true
            }
        ))
        .pipe(gulp.dest('public'));
});

gulp.task('lint', function() {
    return gulp.src('./**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('smoke_test', function () {
    return gulp.src('examples/00hello/')
    .pipe(shell(testCommands));
});


gulp.task('watch_document', ['build_document'], function () {
    return gulp.watch(['README.md', 'index.js', 'lib/*.js', 'extra/*.js'], ['build_document']);
});

gulp.task('build_document', shell.task('jsdoc -p README.md index.js lib/*.js extra/*.js -d documents'));