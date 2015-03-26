

(function(){
		  
	//add css, ico, js
	 var addBootstrapLink1 = function(){
	 	var link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = 'css/bootstrap.min.css';
         document.head.appendChild(link);
		
	 	link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = 'css/webrunes.css';
         document.head.appendChild(link);
		
	 	link = document.createElement('link');
         link.rel = 'shortcut icon';
         link.href = 'ico/favicon.ico';
         document.head.appendChild(link);
		
	 };


	//init
	var init1 = function(){
		addBootstrapLink1();		
	};
	init1();
})();


(function(){
		  
	//add css, ico, js
	// var addBootstrapLink = function(){
	// 	var script = document.createElement('script');
 //        script.src = 'scripts/jquery.min.js';
 //        document.head.appendChild(script);
		
	// 	script = document.createElement('script');
 //        script.src = 'scripts/react.js';
 //        document.head.appendChild(script);
		
	// 	script = document.createElement('script');
 //        script.src = 'scripts/JSXTransformer.js';
 //        document.head.appendChild(script);
				
	// 	script = document.createElement('script');
 //        script.src = 'scripts/showdown.min.js';
 //        document.head.appendChild(script);
		
	// 	var link = document.createElement('link');
 //        link.rel = 'stylesheet';
 //        link.href = 'css/bootstrap.min.css';
 //        document.head.appendChild(link);
		
	// 	link = document.createElement('link');
 //        link.rel = 'stylesheet';
 //        link.href = 'css/webrunes.css';
 //        document.head.appendChild(link);
		
	// 	link = document.createElement('link');
 //        link.rel = 'shortcut icon';
 //        link.href = 'ico/favicon.ico';
 //        document.head.appendChild(link);
		
	// 	createContent();
	// };


var scripts = [
    'scripts/jquery.min.js',
    'scripts/react.js',
    'scripts/JSXTransformer.js',
    'scripts/showdown.min.js'
  ];

  // Sometimes Chrome was loading the scripts in the wrong order (lolwat)
  // We need to enforce order, so manually chain the loading.
 var addBootstrapLink = function loadNext() {
    if (scripts.length === 0) {
      createContent();
      return;
    }
    var nextScript = scripts.shift();
    var script = document.createElement('script');
    script.src = nextScript;
    script.onload = loadNext;
    document.body.appendChild(script);
  }

	
	var createContent = function(){
		var script = document.createElement('script');
		script.type="text/jsx;";
		script.defer=true;
        script.src = 'scripts/WRIO.js';
        document.head.appendChild(script);
		
		alert('DONE');
		
		/*React.render(
		  <CreateDom1/>,
		  document.body
		);*/
	};
	
	//init
	var init = function(){
		addBootstrapLink();		
	};
	init();
})();
