module.exports = function () {
	var scripts = document.getElementsByTagName("script");
	var jsonArray = [];
	for(var i=0; i< scripts.length; i++){
		if(scripts[i].type === 'application/ld+json'){
			jsonArray.push(JSON.parse(scripts[i].innerHTML));
		}
	}
	return jsonArray;
};
