const express = require('express');
const connect = require('connect');

const path = require('path');
const fs = require('fs');
const vhost = require('vhost');
const proxy = require('express-http-proxy');

const app = express();

const pingerService = express();

pingerService.get('/iframe', (request, response) => {
  response.sendFile(`${__dirname}/pinger/pingeriframe.html`);
});
pingerService.use(express.static(path.join(__dirname, './pinger/')));
pingerService.use(proxy('https://pinger.wrioos.com/'));

const coreService = express();

coreService.get('/create', (request, response) => {
  response.sendFile(`${__dirname}/core/core.html`);
});

coreService.get('/create_list', (request, response) => {
  response.sendFile(`${__dirname}/core/core.html`);
});

coreService.get('/edit', (request, response) => {
  response.sendFile(`${__dirname}/core/core.html`);
});

coreService.use(express.static(path.join(__dirname, './core/')));

String.prototype.replaceAll = function (search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const webgoldService = express();
webgoldService.use(proxy('https://webgold.wrioos.com/', {
  userResDecorator(proxyRes, proxyResData, userReq, userRes) {
    const data = proxyResData.toString('utf8');
    return data.replaceAll('src="//wrioos.com/', 'src="//localhost:3033/');
  },
}));

const server = require('http')
  .createServer(app)
  .listen(3033, (req, res) => {
    // app.use((req,res,next) => { console.log(req.headers.host);next()});
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    app.use(vhost('pinger_d.wrioos.com', pingerService));
    app.use(vhost('core_d.wrioos.com', coreService));
    app.use(vhost('webgold_d.wrioos.com', webgoldService));
    app.use('/', proxy('127.0.0.1:3034')); // proxy everything to devserver

    setupDevServer();
    console.log('Application Started!');
  });

function setupDevServer() {
  console.log('Compiling application....');
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');

  if (!process.env.DOCKER_DEV) {
    process.env.FRONTDEV = true;
  }

  function integrateHMR(m) {
    config.entry[m].unshift('react-hot-loader/patch');
    config.entry[m].unshift('webpack-dev-server/client?http://localhost:3034');
    config.entry[m].unshift('webpack/hot/only-dev-server');
  }
  const integrateHot = m => config.entry[m].unshift('webpack/hot/only-dev-server');

  let config = require('../../webpack.config');
  integrateHMR('start');
  integrateHMR('main');

  const compiler = webpack(config);

  const server = new WebpackDevServer(compiler, {
    publicPath: '/',
    contentBase: '..',
    overlay: true,
    stats: { colors: true },
    inline: true,
    hot: true,
    watchOptions: {},
  });

  server.listen(3034);
}

module.exports = app;
