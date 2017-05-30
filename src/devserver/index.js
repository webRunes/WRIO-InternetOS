const express = require('express');
const connect = require('connect');

const path = require('path');
const fs =require('fs');
const vhost = require('vhost');
var proxy = require('express-http-proxy');

var app = express();

var titterService = express();

titterService.get('/iframe', (request, response) => {
    response.sendFile(__dirname +
        '/titter/titteriframe.html');
});
titterService.use(express.static(path.join(__dirname, "./titter/")));
titterService.use(proxy('https://titter.wrioos.com/'));


var coreService = express();

coreService.get('/edit', (request, response) => {
    response.sendFile(__dirname +
        '/core/core.html');
});

coreService.use(express.static(path.join(__dirname, "./core/")));

var webgoldService = connect();
webgoldService.use((request,response,next) => {
    console.log("titter iframe requredt");
    next();
});
webgoldService.use(express.static(path.join(__dirname, "./webgold/")));


var server = require('http')
    .createServer(app)
    .listen(80, (req, res) => {
        app.use((req,res,next) => { console.log(req.headers.host);next()});
        app.use(vhost('titter_d.wrioos.com', titterService));
        app.use(vhost('core_d.wrioos.com',   coreService));
        app.use(vhost('webgold_d.wrioos.com',webgoldService));
        app.use('/', express.static(path.join(__dirname, "../../../")));

        setupDevServer();
        console.log("Application Started!");
    });



function setupDevServer () {
    console.log("Compiling application....");
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');

    process.env.FRONTDEV = true;
    let config = require('../../webpack.config');
    const compiler = webpack(config);


    app.use(webpackDevMiddleware(compiler,{
        publicPath: "/",
        overlay: true,
        stats: {colors: true},
        watchOptions: {
            aggregateTimeout: 300,
            poll: true // <-- it's worth setting a timeout to prevent high CPU load
        }
    }));
}


module.exports =  app;
