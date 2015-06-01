var gulp = require('gulp'),
    download = require('gulp-download'),
    npm = require('npm'),
    package = require('./package.json');

gulp.task('default', ['download']);

gulp.task('clear', function () {
    npm.load({}, function () {
        npm.commands.uninstall(
            Object.keys(package.dependencies)
        );
    });
});

gulp.task('download', function() {
    download([
        'http://code.jquery.com/jquery-2.1.4.js'//TODO: replace jquery with superagent
    ])
        .pipe(gulp.dest('./js/ext'));
});
