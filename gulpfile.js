require('babel-register');

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var envify = require('envify/custom');
var notify = require("gulp-notify");
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var headerfooter = require('gulp-headerfooter');
var fs = require('fs');
var webpack = require('webpack');

var argv = require('yargs').argv;

var envify_params = {
    NODE_ENV:"production",
    DOMAIN:"wrioos.com"
};
var devmode = false;
console.log(argv);
if (argv.docker) {
    console.log("Got docker dev mode");
    envify_params['NODE_ENV'] = 'dockerdev';
    envify_params['DOMAIN'] = "wrioos.local";
    devmode = true;
}

if (argv.dev) {
    console.log("Got dev mode");
    envify_params['NODE_ENV'] = 'development';
    devmode = true;
}

gulp.task('test', function() {
    return gulp.src('test/**/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'dot',
            require: "babel-polyfill",
            compilers: "js:babel-core/register",
            timeout: 20000
        }))
        .once('error', function (err) {
            console.log('Tests failed');
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});


function getVersion() {
    var version = new Date().toString();
    var version = version + " WRIO-InternetOS build " + JSON.parse(fs.readFileSync('./package.json')).version;
    return "\n/* "+version+' */\n';

}
var version = getVersion();

gulp.task('babel-client', function(callback) {

    webpack(require('./webpack.config.js'),
        function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            console.log("[webpack]", stats.toString({
                // output options
            }));
            callback();
        });



});

gulp.task('default', ['lint','babel-client']);

gulp.task("devserv", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack({
        // configuration
    });

    new WebpackDevServer(compiler, {
        // server and middleware options
        headers: { "Access-Control-Allow-Origin": "*" },
    }).listen(3000, "localhost", function(err) {
            if(err) throw new gutil.PluginError("webpack-dev-server", err);
            // Server listening
            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

            // keep the server alive or continue?
            // callback();
        });
});