(function () {

    var tour = new Tour({
        storage: false,
        template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation col-xs-12"><div class="btn-group"><button class="btn btn-sm btn-default go-to" data-go-to-step="0" data-role="prev">Repeat</button><button class="btn btn-sm btn-default go-to" data-go-to-step="0">Settings</button></div><div class="btn-group pull-right"><button class="btn btn-sm btn-default" data-role="end">End conversation</button></div></div></div>'
    });

    tour.addSteps([
      {
          //0
          element: ".ia-author",
          placement: "bottom",
          title: "Author contact",
          content: "Старайтесь всегда находить и указывать контакт автора первоисточника. Это не только поможет автору получить заслуженное вознаграждение, но и ваш процент от донейта вырастает до 25% вместо 10% за контент от безымянного автора. Также, по моей статистике, люди охотнее поддерживают контент с указанным авторством.<ul class='nav nav-pills nav-stacked'><li><a href='conversation-info2.js'>Хорошо, я постараюсь! [назад]</a></li></ul>"
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