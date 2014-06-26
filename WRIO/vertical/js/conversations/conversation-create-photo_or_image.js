(function () {

    var tour = new Tour({
        storage: false,
        template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation col-xs-12"><div class="btn-group"><button class="btn btn-sm btn-default go-to" data-go-to-step="0" data-role="prev">Repeat</button></div><div class="btn-group pull-right"><button class="btn btn-sm btn-default" data-role="end">End conversation</button></div></div></div>'
    });

    tour.addSteps([
      {
          //0
          element: ".step0",
          placement: "bottom",
          title: "Create a photo or image post",
          content: "Все просто - если это прямая ссылка на photo/image, то выделите ее в строке браузера и скопируйте.<div class='col-xs-12'><img src='img/conversations/conversation-create-photo_or_image-1.png' /></div><div class='col-xs-12'>Либо кликните правой кнопкой на картинке, которой хотите поделиться.</div><div class='col-xs-12'><img src='img/conversations/conversation-create-photo_or_image-2.png' /></div><div class='col-xs-12'>После чего вставьте скопированную ссылку в указанное поле и нажмите кнопку 'Submit'. Вы можете использовать любой формат: jpg, png, gif и другие.</div><ul class='nav nav-pills nav-stacked'><li><a href='#'>IA, пожалуйста, вставь любую ссылку для примера</a></li><li><a href='#'>Все понятно! [назад]</a></li></ul>"
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