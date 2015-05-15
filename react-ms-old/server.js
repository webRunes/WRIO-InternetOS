'use strict';

require('node-jsx').install();

var express = require('express');
var React = require('react');
var APP = require('./app');

var app = express();
var port = 9999;

app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  var markup = React.renderToString(APP());
  res.send(markup);
});

app.listen(port, function() {
  console.log("Go to port " + port);
});

