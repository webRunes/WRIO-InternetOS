var gulp = require('gulp'),
	download = require("gulp-download"),
	server = 'http://wrio.s3-website-us-east-1.amazonaws.com/';

gulp.task('default', ['download']);

gulp.task('debug', ['debugServer', 'download']);

gulp.task('debugServer', function() {
	server = 'http://localhost:3000/';
});

gulp.task('download', function() {
	download([
		server + 'Plus-WRIO-App/js/client.js',
		server + 'Plus-WRIO-App/js/plus.js',
		server + 'Login-WRIO-App/widget/login.jsx',
		server + 'Titter-WRIO-App/widget/titter.jsx'
	])
		.pipe(gulp.dest("./js/ext"));
});
