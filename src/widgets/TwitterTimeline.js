/**
 * Created by michbil on 25.05.17.
 */


export default class TwitterWidget {
    constructor(commentId) {
        window.onTimelineLoad = this.onTimelineLoad.bind(this);

        document.getElementById('titteriframe').style.height = '240px';

        var commentTitle = '<ul class="breadcrumb twitter"><li class="active">Comments</li><li class="pull-right"></li></ul>';
        var twitterTemplate = '<a class="twitter-timeline" href="https://twitter.com/search?q=' + window.location.href + '" data-widget-id="' + commentId + '" width="' + window.innerWidth + '" data-chrome="nofooter">Tweets about ' + window.location.href + '</a>';
        document.getElementById('twitter_frame_container').innerHTML = commentTitle + twitterTemplate;

        var js,
            fjs = document.getElementsByTagName('script')[0],
            p = /^http:/.test(document.location) ? 'http' : 'https';

        js = document.createElement('script');
        js.id = 'twitter-wjs';
        js.src = p + '://platform.twitter.com/widgets.js';
        js.setAttribute('onload', 'twttr.events.bind("rendered",window.onTimelineLoad);');
        fjs.parentNode.insertBefore(js, fjs);

    }

    onTimelineLoad() {
        this.$twitter = document.getElementsByClassName('twitter-timeline-rendered')[0];
        this.$twitter.contentDocument.getElementsByTagName('style')[0].innerHTML += 'img.autosized-media {width:auto;height:auto;}\n.timeline-Widget {max-width:10000px !important;}\n.timeline-Widget .stream {overflow-y: hidden !important;}';
        window.interval = setInterval(this.autoSizeTimeline.bind(this), 1000);
    }

    calcHeight(id) {
        var element = this.$twitter.contentDocument.getElementsByClassName("timeline-LoadMore")[0];
        return Number(window.getComputedStyle(element).height.replace('px', ''));
    }

    autoSizeTimeline() {
        if (this.$twitter.contentDocument) {
            var $hfeed = this.$twitter.contentDocument.getElementsByClassName("timeline-TweetList")[0];
            var $noMorePane = this.$twitter.contentDocument.getElementsByClassName("timeline-LoadMore")[0];
            var twitterht = 0;
            var add_ht = 0;
            if ($hfeed) {
                twitterht = Number(window.getComputedStyle($hfeed).height.replace('px', ''));
            }
            if ($noMorePane) {
                add_ht = Number(window.getComputedStyle($noMorePane).height.replace('px', ''));
            }

            if (add_ht > 0) {
                twitterht += add_ht;
            }

            this.$twitter.style.height = twitterht + 90 + 'px';
        }
    }


}