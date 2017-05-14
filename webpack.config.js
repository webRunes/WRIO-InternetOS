var path = require("path");
var webpack = require("webpack");

var envs = {};

if (process.env.DOCKER_DEV) {
  console.log("Got docker dev mode");
  var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
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

console.log(envs);
var e = {
  entry: {
    main: ['babel-polyfill',"./src/main.js"],
    start: "./src/preloader.js"
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
      }
    ]
  },
  devServer: {
    disableHostCheck: true,
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
    new webpack.DefinePlugin(envs),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};

const ES6_BROWSER = true;

if (process.env.DOCKER_DEV && ES6_BROWSER) {
  // mode for debugging native ES6 code in compatible browser
  console.log("ES6 mode, not suitable for production!!!")
   let options= {
    presets: ["react"],
    plugins: ["transform-es2015-modules-commonjs"]
  };
  e.module.loaders[0].options = options;
} else {
  // production grade transpiler settings
  let presets = ["react", "es2015", "stage-0"];
  e.module.loaders[0].options = {
    presets: presets
  };
}

if (process.env.DOCKER_DEV) {
  //   e.plugins.push(new BundleAnalyzerPlugin({analyzerHost: '0.0.0.0'}));
}

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
