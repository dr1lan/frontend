(function ($) {
  $(function () {
    /**
     * Открывает список если перешли по якорю
     */
    function LoadAnchor() {
      $item = window.location.hash;
      $item = $item.slice(1);
      if ($item) {
        target = "a[name=" + $item + "]";
        $(target)
          .next("div")
          .find(".b-link_type_open:first")
          .trigger("click", [true]);
      }
    }

    LoadAnchor();
    /**
     * если человек переходит по якорям
     */
    window.onhashchange = LoadAnchor;
    /**
     * раскрыть список у элемента, если по его якорю кликнули в боковом меню
     */

    $(".b-list_content_sidebar-and-grid").on(
      "click",
      ".b-list__item-text",
      function () {
        itemId = $(this).data("anchor");
        target = "a[name=item" + itemId + "]";
        $(target)
          .next("div")
          .find(".b-link_type_open:first")
          .trigger("click", [true]);
      }
    );

    $(".b-select2").select2({
      minimumResultsForSearch: -1,
      theme: "vshape-theme",
      width: "100%",
    });

    $(".js-show-popup-mobile-callback").on("click", function () {
      var $this = $(this);

      $this.toggleClass("b-menu__item-text_state_selected");
      if ($this.hasClass("b-menu__item-text_state_selected")) {
        app.get("popup").displayMobileCallback();
      } else {
        app.get("popup").closeAll();
      }

      return false;
    });

    //spoiler pure-content
    $(".b-section_content_spoiler-pure-content h3").click(function () {
      $(this)
        .parents(".b-section_content_spoiler-pure-content")
        .toggleClass("b-section_state_selected");
    });

    //скролл для мобильных popup modal-windows
    $(".resise-a").css({
      height: $(window).outerHeight() - 102,
    });
    $(window).on("resize", function () {
      $(".resise-a").css({
        height: $(window).outerHeight() - 102,
      });
    });

    $(".resise-b").css({
      "max-height": $(window).outerHeight() - 42,
    });
    $(window).on("resize", function () {
      $(".resise-b").css({
        "max-height": $(window).outerHeight() - 42,
      });
    });

    // Прокрутка к якорю

    $(".init_scroller").click(function () {
      $("html, body").animate(
        {
          scrollTop: $($(this).data("href")).offset().top - 80 + "px",
        },
        {
          duration: 500,
          easing: "swing",
        }
      );
    });

    // Плейсхолдеры
    $("input, textarea").placeholder();

    // Плавное выпадание главного меню
    $(".b-stripe_content_header .b-menu__item").hover(
      function () {
        $(".b-stripe_content_dropdown-menu", this)
          .stop()
          .slideDown(150)
          .addClass("showMenu");
      },
      function () {
        $(".b-stripe_content_dropdown-menu", this)
          .stop()
          .slideUp(150)
          .removeClass("showMenu");
      }
    );

    // Запускаем wow
    new WOW().init();

    // Select
    [].slice
      .call(document.querySelectorAll("select.cs-select"))
      .forEach(function (el) {
        new SelectFx(el);
      });

    // Active menu
    var pathnameUrl = window.location.pathname;
    var hrefUrl = window.location.href;

    $(".b-menu.b-menu_content_section .b-menu__item").each(function () {
      var link = $(this).find("a").attr("href");

      if (pathnameUrl == link || hrefUrl == link) {
        $(this).addClass("current");
      }
    });

    return false;
  });
})(jQuery);

$(function() {
  $('.b-wrapper-hamburger').on('click', function(){
    $('.b-nav-icon_type_hamburger').toggleClass('b-nav-icon_state_opened');
    $('.b-popup_content_main-menu-320').toggleClass('b-popup_state_show');
  });
});
$(function() {
  $('.b-link_type_parent-mobile').on('click', function(){
    $(this).toggleClass('b-link_state_selected');
    $(this).parents('.b-menu__item').toggleClass('b-menu__item_type_open');
  });
});


$(function() {
  let btn = $(".trigger-modal_link-btn");

  function showModal() {
    $(".modal-custom").appendTo(".b-page");
  }

  $(btn).on("click", function(e) {
    showModal();
  });
});