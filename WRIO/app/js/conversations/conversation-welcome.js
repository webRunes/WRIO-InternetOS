(function () {

    var tour = new Tour({
        storage: false,
        //template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation"><div class="btn-group"><button class="btn btn-sm btn-default" data-role="prev">« Prev</button><button class="btn btn-sm btn-default" data-role="next">Next »</button></div><button class="btn btn-sm btn-default" data-role="end">End tour</button></div></div>'
        template: '<div class="popover tour"><div class="arrow"></div><h3 class="popover-title"></h3><img src="img/profile-ia.png" class="profile-ia"><div class="popover-content"></div><div class="popover-navigation col-xs-12"><div class="btn-group"><button class="btn btn-sm btn-default go-to" data-go-to-step="0" data-role="prev">Repeat</button></div><div class="btn-group pull-right"><button class="btn btn-sm btn-default" data-role="end">End conversation</button></div></div></div>'
    });

    tour.addSteps([
      {
          //0
          orphan: true,
          title: "Welcome!",
          content: "Привет, я - IA. По моим данным на данном устройстве нет активированной учетной записи WRIO, поэтому я буду рад познакомиться и рассказать о себе и проекте пока идет загрузка WRIO OS.<ul class='nav nav-pills nav-stacked'><li><a href='#' class='go-to' data-go-to-step='1'>Верно, я здесь впервые. Кто ты?</a></li><li><a href='#' class='go-to' data-go-to-step='2'>У меня уже есть учетная запись</a></li></ul>"
      },
      {
          //1
          orphan: true,
          title: "Верно, я здесь впервые. Кто ты?",
          content: "Я ваш личный помощник, мое имя IA - акроним Individual Assistant и анаграмма AI (Artificial Intelligence). Спроектирован на базе алгоритмов и технологий искусственного интеллекта. Ребята из webRunes только начали работать над моим ядром (чтобы это не значило, но звучит круто, правда?), и пока я сильно ограничен в своих возможностях, но все же смогу быть полезеным и буду давать различные советы.<ul class='nav nav-pills nav-stacked'><li><a href='#' class='go-to' data-go-to-step='3'>Почему в разговоре я могу выбирать лишь из готовых вариантов?</a></li><li><a href='#' class='go-to' data-go-to-step='4'>Чем ты можешь быть мне полезен?</a></li><li><a href='#' class='go-to' data-go-to-step='5'>Хорошо, расскажи мне немного о проекте</a></li></ul>"
      },
      {
          //2
          orphan: true,
          title: "У меня уже есть учетная запись",
          content: "Отлично! Тогда дождемся окончания загрузки OS, после чего мы продолжим с того на чем остановились в прошлый раз."
      },
      {
          //3
          orphan: true,
          title: "Почему в разговоре я могу выбирать лишь из готовых вариантов?",
          content: "Пока не разработан мой эвристический модуль, я посчитал лучшим вариантом построить общение через готовые сценарии. Таким образом я смогу максимально эффективно помогать в освоении проекта, где сам вопрос - зачастую половина ответа. Сценарии созданы на основе FAQ, написанного командой webRunes. Так как пользователи редко читают страницу вопросов и ответов сами, я решил, что лучше пересказать тексты своими словами и сделать их в виде беседы.<ul class='nav nav-pills nav-stacked'><li><a href='#' class='go-to' data-go-to-step='1'>Молодец. Давай вернемся к списку вопросов</a></li></ul>"
      },
      {
          //4
          orphan: true,
          title: "Чем ты можешь быть мне полезен?",
          content: "На сегодняшний день мне пока лишь разрешили рассказывать о проекте и давать советы связанные с ним. Я буду помогать с продажей статей, фотографий и других данных, привлекать новых читателей в ваш блог, если решите его завести. Со временем я расширю свои функции и буду на основе ваших интересов собирать и каталогизировать статьи, новости, книги, фильмы, музыку. Принимать, сортировать, переводить и даже отвечать, если вы сами заняты, на письма, новые сообщения в мессенжерах и соцсетях, составлять для вас программы индивидуального обучения, тренировок, маршруты поездок и отдыха исходя из указанных предпочтений. Можно долго перечислять, я буду постепенно рассказывать обо всем по мере использования вами проекта.<ul class='nav nav-pills nav-stacked'><li><a href='#' class='go-to' data-go-to-step='1'>Звучит многообещающе</a></li></ul>"
      },
      {
          //5
          orphan: true,
          title: "Хорошо, расскажи мне немного о проекте",
          content: "Проект эксперементальный и потому некоторые вещи могут показаться непонятными или даже странными, но описать его первые, хотя и не главные, задачи можно просто: поддержка авторов и монетизация их творчества. Я предлагаю начать с создания первой заметки и ее последующий публикацией в каком-либо хабе на ваш выбор, где вы сможете читать и оценивать посты других авторов, а я буду рассказывать о деталях. Я также советую посетить официальную страницу вебРунес для получения полезной информации и новостей, я напомню об этом совете при удобном случае.<ul class='nav nav-pills nav-stacked'><li><a href='#' class='go-to' data-go-to-step='1'>Ладно</a></li></ul>"
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