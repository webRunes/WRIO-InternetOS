
export default class TwitterTimelineWidget {
    constructor(commentId,container) {
        window.onTimelineLoad = this.onTimelineLoad.bind(this);

        container.style.height = '240px';

        var commentTitle = '<ul class="breadcrumb twitter"><li class="active">Comments</li><li class="pull-right"></li></ul>';
        var twitterTemplate = '<a class="twitter-timeline" href="https://twitter.com/search?q=' + window.location.href + '" data-widget-id="' + commentId + '" width="' + window.innerWidth + '" data-chrome="nofooter">Tweets about ' + window.location.href + '</a>';
        container.innerHTML = commentTitle + twitterTemplate;

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
        this.$twitter.contentDocument.getElementsByTagName('style')[0].innerHTML +=
            `
            img.autosized-media {
              width:auto;
              height:auto;
            }
            .timeline-Widget {
              max-width:10000px !important;
            }
            .timeline-Widget .stream {
              overflow-y: hidden !important;
            }
            .timeline-Tweet-text{
              font-size: 14px !important;
              line-height: initial !important;
            }
            .timeline-InformationCircle-widgetParent {
               display: none !important;
            }
            `;
        this.interval = setInterval(this.autoSizeTimeline.bind(this), 1000);
    }

    calcHeight(id) {
        var element = this.$twitter.contentDocument.getElementsByClassName("timeline-LoadMore")[0];
        return Number(window.getComputedStyle(element).height.replace('px', ''));
    }

    autoSizeTimeline() {
        if (this.$twitter.contentDocument) {
            const getHeight = ($el) => !!$el ? Number(window.getComputedStyle($el).height.replace('px', '')) : 0;
            const getElm = (name) => this.$twitter.contentDocument.getElementsByClassName(name)[0];

            const $hfeed = getElm("timeline-TweetList");
            const $noMorePane = getElm("timeline-LoadMore");
            const $header = getElm("timeline-Header");
            const twitterht = getHeight($hfeed) + getHeight($noMorePane) ;

            this.$twitter.style.height = twitterht + 20 + 'px';
        }
    }
    cleanup () {
        clearInterval(this.interval);
    }

}
