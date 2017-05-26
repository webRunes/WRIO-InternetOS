var path = require("path");
var webpack = require("webpack");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
var envs = {};

if (process.env.FRONTDEV) {
  console.log("Got front end dev mode");
  envs = {
    "process.env": {
      NODE_ENV: JSON.stringify("development"),
      DOMAIN: JSON.stringify("wrioos.com")
    }
  };
} else if (process.env.DOCKER_DEV) {
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
    minChunks: 'Infinity',
    chunks: ['main','titter','core']
});


console.log(envs);
var e = {
  entry: {
    main: path.resolve(__dirname,"./src/main.js"),
    start: path.resolve(__dirname,"./src/preloader.js"),
    titter: path.resolve(__dirname,'./src/iframes/Titter/js/index.js'),
    core: path.resolve(__dirname,"./src/iframes/Core/js/client.js"),
    commons: ['babel-polyfill','react','react-dom','reflux','superagent','lodash','core-js'],
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
    overlay: true,
    port: 3000,
    contentBase: "../",
    inline: true,
    watchOptions: {
      aggregateTimeout:300,
      poll: true // <-- it's worth setting a timeout to prevent high CPU load
    }
  },
  devtool: "source-map",

  plugins: [
    commonsPlugin,
    new webpack.DefinePlugin(envs),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    // new webpack.PrefetchPlugin(['react'])
  ]
};


//e.plugins.push(new BundleAnalyzerPlugin({analyzerHost: '0.0.0.0'}));

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
