//----nestable 事件
$(function () {
    /*  $(".nestable-list").on("click", ".item-handle", function () {
          var $subLevel = $(this).next();
          var $iconCollapse = $(this).children('.icon-collapse');
          $subLevel.toggle();
          if ($iconCollapse.hasClass('icon-plus')) {
              $iconCollapse.removeClass('icon-plus').addClass('icon-minus');
          } else {
              $iconCollapse.removeClass('icon-minus').addClass('icon-plus');
          }
      });*/

    $(".nestable-list").on("click", ".icon-collapse", function () {
        var $subLevel = $(this).parent().next();
        $subLevel.toggle();
        if ($(this).hasClass('icon-plus')) {
            $(this).removeClass('icon-plus').addClass('icon-minus');
        } else {
            $(this).removeClass('icon-minus').addClass('icon-plus');
        }
    });

});