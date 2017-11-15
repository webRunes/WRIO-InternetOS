const express = require("express");
const connect = require("connect");

const path = require("path");
const fs = require("fs");
const vhost = require("vhost");
var proxy = require("express-http-proxy");

var app = express();

var titterService = express();

titterService.get("/iframe", (request, response) => {
  response.sendFile(__dirname + "/titter/titteriframe.html");
});
titterService.use(express.static(path.join(__dirname, "./titter/")));
titterService.use(proxy("https://titter.wrioos.com/"));

var coreService = express();

coreService.get("/create", (request, response) => {
  response.sendFile(__dirname + "/core/core.html");
});

coreService.get("/edit", (request, response) => {
  response.sendFile(__dirname + "/core/core.html");
});

coreService.use(express.static(path.join(__dirname, "./core/")));

var webgoldService = connect();
webgoldService.use((request, response, next) => {
  console.log("titter iframe requredt");
  next();
});
webgoldService.use(express.static(path.join(__dirname, "./webgold/")));

var server = require("http")
  .createServer(app)
  .listen(3033, (req, res) => {
    //app.use((req,res,next) => { console.log(req.headers.host);next()});
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    app.use(vhost("titter_d.wrioos.com", titterService));
    app.use(vhost("core_d.wrioos.com", coreService));
    app.use(vhost("webgold_d.wrioos.com", webgoldService));
    app.use("/", proxy("127.0.0.1:3034")); // proxy everything to devserver

    setupDevServer();
    console.log("Application Started!");
  });

function setupDevServer() {
  console.log("Compiling application....");
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  if (!process.env.DOCKER_DEV) {
    process.env.FRONTDEV = true;
  }

  function integrateHMR(m) {
    config.entry[m].unshift("react-hot-loader/patch");
    config.entry[m].unshift("webpack-dev-server/client?http://localhost:3034");
    config.entry[m].unshift("webpack/hot/only-dev-server");
  }
  const integrateHot = m =>
    config.entry[m].unshift("webpack/hot/only-dev-server");

  let config = require("../../webpack.config");
  integrateHMR("start");
  integrateHMR("main");

  const compiler = webpack(config);

  const server = new WebpackDevServer(compiler, {
    publicPath: "/",
    contentBase: "..",
    overlay: true,
    stats: { colors: true },
    inline: true,
    hot: true,
    watchOptions: {}
  });

  server.listen(3034);
}

module.exports = app;
