var gulp = require('gulp'),
	download = require('gulp-download'),
	npm = require('npm'),
	package = require('./package.json'),
	server = 'http://wrio.s3-website-us-east-1.amazonaws.com/';

gulp.task('default', ['download']);

gulp.task('clear', function () {
	var m = [
		'react-tools',
		'reactify',
		'watchify',
		'uglifyify',
		'browserify',
		'browserify-notify',
		'browserify-shim',
		'envify',
		'gulp-download',
		'gulp'
	];
	npm.load({}, function () {
		npm.commands.uninstall(
			Object.keys(package.dependencies).concat(m)
		);
	});
});

gulp.task('debug', ['debugServer', 'download']);

gulp.task('debugServer', function() {
	server = 'http://localhost:3000/node_modules/';
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
		})
	)
		.pipe(gulp.dest('./js/ext'));
});
