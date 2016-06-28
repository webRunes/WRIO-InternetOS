var path = require('path');
var webpack = require('webpack');

var e = {
    entry: {
        main:'./src/main.js',
        start:'./src/preloader.js'
    },
    output: { path: './',
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
        port: 3000,
        contentBase: "../",
        colors: true,
        inline:true
    },
    devtool: 'inline-source-map',

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development'),
                DOMAIN: JSON.stringify('wrioos.com')
            }
        }),

        ]

};

var minify = true;
if (minify) {
  /*  e.plugins.push(new webpack.optimize.UglifyJsPlugin({
     compress:{
     warnings: false,
     }
     }));*/
    e.devtool = 'source-map';
}

module.exports = e;