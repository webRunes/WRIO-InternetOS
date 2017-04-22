var path = require("path");
var webpack = require("webpack");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
var envs = {};

if (process.env.DOCKER_DEV) {
  console.log("Got docker dev mode");

  envs = {
    "process.env": {
      NODE_ENV: JSON.stringify("dockerdev"),
      DOMAIN: JSON.stringify("wrioos.local")
    }
  };
} else {
  envs = {
    "process.env": {
      NODE_ENV: JSON.stringify("production"),
      DOMAIN: JSON.stringify("wrioos.com")
    }
  };
}

let commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
    name:'commons',  // Just name it
    filename: 'common.js', // Name of the output file
    chunks: ['main','titter','core']
});


console.log(envs);
var e = {
  entry: {
    main: "./src/main.js",
    start: "./src/preloader.js",
    titter: './src/iframes/Titter/js/index.js',
    core: "./src/iframes/Core/js/client.js",
    commons: ['react','react-dom','reflux','superagent','lodash','core-js'],
 //   webgold: './src/iframes/webGold/js/client.js'
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["react", "es2015", "stage-0"]
        }
      }
    ]
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    contentBase: "../",
    inline: true,
    watchOptions: {
      poll: 1000 // <-- it's worth setting a timeout to prevent high CPU load
    }
  },
  devtool: "source-map",

  plugins: [
    commonsPlugin,
    new webpack.DefinePlugin(envs),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};


e.plugins.push(new BundleAnalyzerPlugin({analyzerHost: '0.0.0.0'}));

var minify = !process.env.DOCKER_DEV;
if (minify) {
  console.log("Uglifying 😱 😱 😱 ");
  e.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  );
  e.devtool = "source-map";
}

module.exports = e;
