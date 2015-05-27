var gulp = require('gulp'),
	download = require("gulp-download");


gulp.task('default', ['download']);

gulp.task('download', function() {
	var server = 'http://wrio.s3-website-us-east-1.amazonaws.com/'
	download([
		server + 'Plus-WRIO-App/js/client.js',
		server + 'Plus-WRIO-App/js/plus.js',
		server + 'Login-WRIO-App/widget/login.jsx',
		server + 'Titter-WRIO-App/widget/titter.jsx'
	])
    	.pipe(gulp.dest("./js/ext"));
});
