require.config({
	    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                //Override function for determining if XHR should be used.
                //url: the URL being requested
                //protocol: protocol of page text.js is running on
                //hostname: hostname of page text.js is running on
                //port: port of page text.js is running on
                //Use protocol, hostname, and port to compare against the url
                //being requested.
                //Return true or false. true means "use xhr", false means
                //"fetch the .js version of this resource".
				return true;
            }
        }
    },
baseUrl: "http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/",

  paths: {
	"jquery": "jquery.min",
	"bootstrap":"bootstrap.min",
    "react": "react",   
    "JSXTransformer": "JSXTransformer",
    "showdown": "showdown.min",
    "wrio": "WRIO",
	"client":"http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/js/client",
	"promise":"http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/js/promise-1.0.0.min",
    "plus":"http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/js/plus",
  },   
  jsx: {
    fileExtension: '.jsx',
    harmony: true,  
    stripTypes: true
  }
});

require(['react', 'jsx!wrio'], function(React, CreateDom) { 
// Mount the JSX component in the app container 
React.render(
		CreateDom(),            
		document.body);
});
