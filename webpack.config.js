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
    main: [path.resolve(__dirname,"./src/main.js")],
    start: [path.resolve(__dirname,"./src/preloader.js")],
    titter: [path.resolve(__dirname,'./src/iframes/Titter/js/index.js')],
    core: [path.resolve(__dirname,"./src/iframes/Core/js/client.js")],
    commons: ['babel-polyfill','react','react-dom','reflux','superagent','lodash','core-js'],
    admin: './src/iframes/webGold/js/admin/index.js',
    presale: ['./src/iframes/webGold/js/presale.js'],
    createwallet: './src/iframes/webGold/js/createwallet.js',
    txsigner: './src/iframes/webGold/js/txsigner.js'
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]"
  },
  resolve: {
    modules: [
      'src/',
      'node_modules'
    ],
    unsafeCache: true
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

  devtool: "source-map",

  plugins: [
    commonsPlugin,
    new webpack.DefinePlugin(envs),
    new webpack.DefinePlugin(process.env.DOCKER_DEV ? {} : {
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    // new webpack.PrefetchPlugin(['react'])
  ]
};



const ES6_BROWSER = true;

if ((process.env.FRONTDEV || process.env.DOCKER_DEV) && ES6_BROWSER) {
  // mode for debugging native ES6 code in compatible browser
  console.log("ES6 mode, not suitable for production!!!");
   let options= {
    presets: ["react"],
    plugins: ["transform-es2015-modules-commonjs","transform-flow-strip-types"]
  };
  e.module.loaders[0].options = options;
} else {
  // production grade transpiler settings
  let presets = ["react", "es2015", "stage-0"];
  e.module.loaders[0].options = {
    presets: presets,
    plugins:["transform-flow-strip-types"]
  };
}

e.plugins.push(new webpack.HotModuleReplacementPlugin());
e.plugins.push(new webpack.NamedModulesPlugin());

if (process.env.DOCKER_DEV) {
  //   e.plugins.push(new BundleAnalyzerPlugin({analyzerHost: '0.0.0.0'}));
}

var minify = !(process.env.DOCKER_DEV || process.env.FRONTDEV);
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
