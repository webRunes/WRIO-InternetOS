var path = require('path');
var webpack = require('webpack');

var envs = {};

if (process.env.DOCKER_DEV) {
    console.log("Got docker dev mode");
    envs = {
        "process.env": {
            NODE_ENV: JSON.stringify('dockerdev'),
            DOMAIN: JSON.stringify('wrioos.local')
        }
    };
} else {
    envs = {
        "process.env": {
            NODE_ENV: JSON.stringify('production'),
            DOMAIN: JSON.stringify('wrioos.com')
        }
    }
}

console.log(envs);
var e = {
    entry: {
        main:'./src/main.js',
        start:'./src/preloader.js'
    },
    output: { path: './build/',
        filename: '[name].js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015','stage-0']
                }
            }
        ]
        ,

    },
    devServer: {
        host: "0.0.0.0",
        port: 3000,
        contentBase: "../",
        colors: true,
        inline:true,
        watchOptions: {
            poll: 1000 // <-- it's worth setting a timeout to prevent high CPU load
        },
    },
    devtool: 'source-map',

    plugins: [
        new webpack.DefinePlugin(envs)]

};

var minify = !process.env.DOCKER_DEV;
if (minify) {
    console.log("Uglifying 😱 😱 😱 " );
    e.plugins.push(new webpack.optimize.UglifyJsPlugin({
     compress:{
     warnings: false,
     }
     }));
    e.devtool = 'source-map';
}

module.exports = e;