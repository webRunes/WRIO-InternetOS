var gulp = require('gulp'),
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
