(function () {

    var tour = new Tour({
        storage: false,
        template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation col-xs-12"><div class="btn-group"><button class="btn btn-sm btn-default go-to" data-go-to-step="0" data-role="prev">Repeat</button></div><div class="btn-group pull-right"><button class="btn btn-sm btn-default" data-role="end">End conversation</button></div></div></div>'
    });

    tour.addSteps([
      {
          //0
          element: ".ia-enable-comments",
          placement: "bottom",
          title: 'Enable comments',
          content: 'Click "Get the code" link, Twitter search query will be opened. Click three dots icon and then "Embed this search" to open "Create a search widget".<div class="col-xs-12"><img src="img/conversations/conversation-enable-coments-1.png" /></div><ul class="nav nav-pills nav-stacked"><li><a href="#" class="go-to" data-go-to-step="1">Дальше</a></li></ul>'
      },
      {
          //1
          orphan: true,
          placement: "bottom",
          title: 'Enable comments',
          content: 'Click "Create widget" button.<div class="col-xs-12"><img src="img/conversations/conversation-enable-coments-2.png" /></div><ul class="nav nav-pills nav-stacked"><li><a href="#" class="go-to" data-go-to-step="2">Дальше</a></li></ul>'
      },
      {
          //2
          element: ".ia-enable-comments-2",
          placement: "bottom",
          title: 'Enable comments',
          content: 'Copy the code and paste it into "Code" field above. Click "Submit".<div class="col-xs-12"><img src="img/conversations/conversation-enable-coments-3.png" /></div>'
      }
    ]);

    // Initialize the tour
    tour.init();

    // Start the tour
    tour.start();

    $(document).on("click", ".go-to", function (e) {
        var step = parseInt($(this).data("go-to-step"));
        tour.goTo(step);
    });

}());