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
          title: "Hot actions",
          content: "Ниже идет список актуальных либо рекомендуемых мною действий.<ul class='nav nav-pills nav-stacked'><li><a href='conversation-сreate.js'>Написать свой первый пост</a></li><li><a href='conversation-first_hub_subscription.js'>Подписаться на первый хаб</a></li><li><a href='conversation-send_invitation.js'>Отослать приглашение другу</a></li></ul><ul class='nav nav-pills nav-stacked'><li><a href='conversation-info.js'>Полезная информация<span class='pull-right label label-warning'>4</span></a></li><li><a href='conversation-archive.js'>Открыть страницу архива действий</a></li></ul>"
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