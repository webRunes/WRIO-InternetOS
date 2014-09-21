'use strict';

var aps = aps || {};

aps.service('servicePostLink', function() {
    this.getLinkHtml=function(postType,postName,data,title){
        if(postName=='Google+'){
            return '<div><script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script><div class="g-post" data-href="'+
            data+'"></div></div>';
        }else if(postType=='Social network post'){
            return '<div>'+data+'</div>';
        }else if(postType=='Video'){
            return data!=null?'<iframe src='+data+' width="600" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>':'';
        }else if(postType=='Photo'){
            return '<div><img src="'+data+'" class="media-object"/></div>';
        }else if(postType=='Post link'){
            //var sourceString = data.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
            return '<div><a href="'+data+'" target="_blank">'+data.replace(/-/g,'')+'</a></div>';
        }
        return '<div></div>';
    };
});
aps.service('CommSvc', function() {
    this.getComment=function(postId,twitterCommId){
        if(twitterCommId){
            return '<a class="twitter-timeline" href="https://twitter.com/search?q=http%3A%2F%2Fdev.wr.io%2Fpost%2F'+postId+
                '" data-widget-id="'+twitterCommId+'" data-show-replies="true" data-chrome="noheader nofooter noborders noscrollbar'+
                ' transparent">Tweets about "http://dev.wr.io/post/'+postId+'"</a><script>!function (d, s, id) { var js, '+
                'fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? "http" : "https"; if (!d.getElementById(id))'+
                ' { js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js,'+
                ' fjs); } }(document, "script", "twitter-wjs");</script>';
        }
        return '';
    };
});