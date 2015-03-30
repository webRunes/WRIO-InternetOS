require.config({
  baseUrl: "http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/",

  paths: {
	"jquery": "jquery.min",
    "react": "react",   
    "JSXTransformer": "JSXTransformer",
    "showdown": "showdown.min",
    "wrio": "wrio.jsx?lipl=1"   
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