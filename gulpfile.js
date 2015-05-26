var gulp = require('gulp'),
	download = require("gulp-download");


gulp.task('default', ['download']);

gulp.task('download', function() {
	download([
		"http://wrio.s3-website-us-east-1.amazonaws.com/Login-WRIO-App/widget/login.jsx",
		"http://wrio.s3-website-us-east-1.amazonaws.com/Titter-WRIO-App/widget/titter.jsx"
	])
    	.pipe(gulp.dest("./js/sub"));
});
