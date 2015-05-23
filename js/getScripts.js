define(function(){
	return function () {
		var scripts = document.getElementsByTagName("script");
		var jsonData = new Object();
		var jsonArray = [];
		var has = false;
  		for(var i=0; i< scripts.length; i++){
			if(scripts[i].type=='application/ld+json'){
				has = true;
				jsonData = JSON.parse(scripts[i].innerHTML);
				jsonArray.push(jsonData);
			}
		}
		return jsonArray;
	};
});
