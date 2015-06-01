var gulp = require('gulp'),
    download = require('gulp-download'),
    npm = require('npm'),
    package = require('./package.json'),
    server = 'http://wrio.s3-website-us-east-1.amazonaws.com/';

gulp.task('default', ['download']);

gulp.task('clear', function () {
    npm.load({}, function () {
        npm.commands.uninstall(
            Object.keys(package.dependencies)
        );
    });
});

gulp.task('debug', ['debugServer', 'download']);

gulp.task('debugServer', function() {
    server = 'http://localhost:3000/';
});

gulp.task('download', function() {
    download(
        [
            'Plus-WRIO-App/js/client.js',
            'Plus-WRIO-App/js/plus.js',
            'Login-WRIO-App/widget/login.jsx',
            'Titter-WRIO-App/widget/titter.jsx'
        ].map(function (path) {
            return server + path;
        }).concat([
            'http://code.jquery.com/jquery-2.1.4.js'
        ])
    )
        .pipe(gulp.dest('./js/ext'));
});
