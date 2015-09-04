var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var envify = require('envify/custom');
var shell = require('gulp-shell')

var npm = require('npm'),
package = require('./package.json');

var argv = require('yargs').argv;

var envify_params = {
    NODE_ENV:"production",
};
console.log(argv);
if (argv.docker) {
    console.log("Got docker param");
    envify_params['DOMAIN'] = "wrioos.local"
}

gulp.task('babel-client', function() {
    browserify({
        entries: './WRIO-InternetOS/main.jsx',
        debug: true
    })
        .transform(babelify.configure({
            blacklist: ["strict"]
        }))
        .transform(envify(envify_params))
        .bundle()
        .on('error', function(err) {
            console.log('Babel client:', err.toString());
        })
        .pipe(source('start.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('update-modules', function() {
    shell('npm install plus passport-signin titter');
});

gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['src/**']
    })
        .on('error', function(error) {
            console.log('Nodemon:', event.message);
        });
});

gulp.task('default', ['babel-client']);

gulp.task('watch', ['default'], function() {
   // gulp.watch(['src/index.js', 'src/server/**/*.*'], ['babel-server']);
    gulp.watch('WRIO-InternetOS/**/*.*', ['babel-client']);
  //  gulp.watch('src/client/views/**/*.*', ['views']);
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
