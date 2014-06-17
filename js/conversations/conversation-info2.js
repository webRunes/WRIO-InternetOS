(function () {

    var tour = new Tour({
        storage: false,
        template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation col-xs-12"><div class="btn-group"><button class="btn btn-sm btn-default go-to" data-go-to-step="0" data-role="prev">Repeat</button><button class="btn btn-sm btn-default go-to" data-go-to-step="0">Settings</button></div><div class="btn-group pull-right"><button class="btn btn-sm btn-default" data-role="end">End conversation</button></div></div></div>'
    });

    tour.addSteps([
      {
          //0
          element: ".call-ia",
          placement: "bottom",
          title: 'Чем я могу помочь?',
          content: '(Не должно быть отдельным js, варианты вопросов динамически подставлять в общий conversation-info.js) Пожалуйста, выберите интересующую вас тему.<ul class="nav nav-pills nav-stacked"><li><a href="conversation-language.js">IA, расскажи мне о language</a></li><li><a href="conversation-webrunes.js">Расскажи о поле "author"</a></li></ul><ul class="nav nav-pills nav-stacked"><li><a href="conversation-archive.js">Hot actions<span class="pull-right label label-warning">11</span></a></li><li><a href="conversation-archive.js">Пожалуйста, открой страницу с архивами наших бесед</a></li></ul>'
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