function loadScripts(array,callback){
    var loader = function(src,handler){
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
        script.onreadystatechange = script.onload = null;
          handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    };
    (function(){
        if(array.length!=0){
          loader(array.shift(),arguments.callee);
        }else{
          callback && callback();
        }
    })();
}


loadScripts([
   "http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/require.js"
],function(){
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
waitSeconds : 0,
baseUrl: "http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/",

  paths: {
  "jquery": "jquery.min",
  "bootstrap":"bootstrap.min",
    "react": "react",
    "JSXTransformer": "JSXTransformer",
    "showdown": "showdown.min",
    "titter":"http://wrio.s3-website-us-east-1.amazonaws.com/Titter-WRIO-App/widget/titter",
    "login":"http://wrio.s3-website-us-east-1.amazonaws.com/Login-WRIO-App/widget/login",
    "createdom": "createdom",
  "client":"http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/js/client",
  "promise":"http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/js/promise-1.0.0.min",
    "plus":"http://wrio.s3-website-us-east-1.amazonaws.com/Plus-WRIO-App/js/plus",
    "moment": "http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment.min"
  },
  jsx: {
    fileExtension: '.jsx',
    harmony: true,
    stripTypes: true
  }
});

require(['react', 'createdom'], function(React, CreateDom) {
// Mount the JSX component in the app container
React.render(
    CreateDom(),
    document.body);
});

});






