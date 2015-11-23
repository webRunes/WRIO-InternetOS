var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var envify = require('envify/custom');
var npm =  require("npm");
var notify = require("gulp-notify");
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');

var npm = require('npm'),
package = require('./package.json');

var argv = require('yargs').argv;

var envify_params = {
    NODE_ENV:"production",
    DOMAIN:"wrioos.com"
};
console.log(argv);
if (argv.docker) {
    envify_params['DOMAIN'] = "wrioos.local"
}

if (argv.dev) {
    console.log("Got dev mode");
    envify_params['NODE_ENV'] = 'development';
}

gulp.task('babel-client', ['update-modules'], function() {


    var preloader = browserify({
        entries: './WRIO-InternetOS/preloader.js',
        debug: true
    })
      .transform(babelify)
      .transform(envify(envify_params))
      .bundle()
      .on('error', function(err) {
          console.log('Babel client:', err.toString());
      })
      .pipe(source('start.js'))
      .pipe(buffer());

        if (!argv.docker) {
            preloader = preloader.pipe(gulp.dest('./raw/'))
                .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
                .pipe(uglify())
                .pipe(sourcemaps.write('./')); // writes .map file
        } else {
            console.log("Skip uglification...");
        }
        preloader
            .pipe(gulp.dest('.'))
            .pipe(notify("start.js built!!"));



    var main = browserify({
            entries: './WRIO-InternetOS/main.js',
            debug: true
        })
        .transform(babelify)
        .transform(envify(envify_params))
        .bundle()
        .on('error', function(err) {
            console.log('Babel client:', err.toString());
        })
        .pipe(source('main.js'))
        .pipe(buffer());

    if (!argv.docker) {
        main = main.pipe(gulp.dest('./raw/'))
            .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
            .pipe(uglify())
            .pipe(sourcemaps.write('./')); // writes .map file
    } else {
        console.log("Skip uglification...");
    }
    main
        .pipe(gulp.dest('.'))
        .pipe(notify("main.js built!!"));

    return merge(preloader, main);

});

/*
"optionalDependencies": {
    "passport-signin": "git+https://git@github.com/webRunes/Login-WRIO-App.git",
    "plus": "git+https://git@github.com/webRunes/Plus-WRIO-App.git",
    "titter-wrio-app": "git+https://git@github.com/webRunes/Titter-WRIO-App.git"
}
*/

gulp.task('update-modules', function(callback) {
    if (argv.dev) {
        npm.load(['./package.json'],function (er, npm) {
            npm.commands.install([
                'file:../Titter-WRIO-App/',
                'file:../Plus-WRIO-App/'
            ],function(err,cb){
                callback();
            });
        });
    } else {
        callback();
    }
});

gulp.task('default', ['update-modules','babel-client']);

gulp.task('watch', ['default'], function() {
    gulp.watch(['WRIO-InternetOS/**/*.*','widgets/**/*.*'], ['babel-client']);
});

gulp.task('watchDev', ['default'], function() {
    var mod = ['update-modules','babel-client'];
    gulp.watch(['../Plus-WRIO-App/js/**/*.*'], mod);
    gulp.watch(['../Titter-WRIO-App/src/**/*.*'], mod);
    gulp.watch(['WRIO-InternetOS/**/*.*','widgets/**/*.*'], mod);
});

gulp.task('clear', function () {
    npm.load({}, function () {
        npm.commands.uninstall(
            Object.keys(package.dependencies).concat([
            	'react',
            	'react-tools'
            ])
        );
    });
});

