require.config({
  baseUrl: ".",

  paths: {
	"jquery": "jquery.min",
    "react": "react",  
    "JSXTransformer": "JSXTransformer",
    "showdown": "showdown.min",
    "wrio": "WRIO"   
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