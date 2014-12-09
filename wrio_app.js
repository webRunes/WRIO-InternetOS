var exports = module.exports = {};

exports.init = function (express) {
	var app = express();
	var bodyParser = require('body-parser');
	// Add headers
	app.use(function (request, response, next) {
		//console.log(request);
		response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
		response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		response.setHeader('Access-Control-Allow-Credentials', true);
		next();
	});
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	return app;
};
