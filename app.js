var express = require('express');
var app = require("./wrio_app.js").init(express);
var server = require('http').createServer(app).listen(1234);

var nconf = require("./wrio_nconf.js").init();