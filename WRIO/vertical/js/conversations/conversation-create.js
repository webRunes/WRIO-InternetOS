(function () {

    var tour = new Tour({
        storage: false,
        template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation col-xs-12"><div class="btn-group"><button class="btn btn-sm btn-default go-to" data-go-to-step="0" data-role="prev">Repeat</button></div><div class="btn-group pull-right"><button class="btn btn-sm btn-default" data-role="end">End conversation</button></div></div></div>'
    });

    tour.addSteps([
      {
          element: ".call-ia",
          placement: "bottom",
          title: "Create",
          content: "Готовы создать пост? Пожалуйста, выберите ниже источник и я помогу.<ul class='nav nav-pills nav-stacked'><li><a href='conversation-сreate-link.js'>Link</a></li><li><a href='conversation-create-photo_or_image.js'>Photo or image</a></li><li><a href='conversation-сreate-youtube.js'>Youtube</a></li><li><a href='conversation-сreate-vimeo.js'>Vimeo</a></li><li><a href='conversation-сreate-google_plus.js'>Google+</a></li><li><a href='conversation-сreate-facebook.js'>Facebook</a></li><li><a href='conversation-сreate-twitter.js'>Twitter</a></li></ul><ul class='nav nav-pills nav-stacked'><li><a href='conversation-info.js'>Полезная информация<span class='pull-right label label-warning'>4</span></a></li><li><a href='conversation-archive.js'>Пожалуйста, открой страницу с архивами наших бесед</a></li></ul>"
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