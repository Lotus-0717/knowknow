//IBILI
// IBILI.push(selector, [
//   { from, to }
// ])
// IBILI.push(selector, [
//   { from, to, W, H, padding, fix }
// ], {
//   watch: false,
//   callback: function () { }
// })
//Parallax
// var scene = new Parallax(DOM("#scene")[0], {
//   relativeInput: true,
//   clipRelativeInput: true,
//   hoverOnly: true
// });
//Swiper
// var swiper = new Swiper("#swiper", {
//   speed: 1000,
//   loop: true,
//   slidesPerView: 1,
//   autoplay: {
//     delay: 5000,
//     disableOnInteraction: false,
//   },
//   pagination: {
//     el: "#swiper_pagination",
//     clickable: true
//   },
//   on: {
//     init: function () {
//
//     },
//     slideChange: function () {
//       var _i = this.realIndex + 1;
//     }
//   },
// })
//浮動按鈕在指定範圍隱藏
// float_hideOn([{ selector: selector }], function () {
//   return window.innerHeight * {float_frame的bottom百分比};
// });
var ntc = new Collapse({
  container: ".ntc_frame",
  button: ".ntc_btn",
  active: ".plus_btn",
  collapse: ".ntc_ctn",
});
ntc.init();
ntc.button.forEach(function (button) {
  button.addEventListener(
    "click",
    function () {
      moveTo(button.container);
    },
    false
  );
});
//init
// new Sto().init();
$(function () {
  // new Spx().init();
  let navOpen = false;
  $(".toggle-btn").on("click", function () {
    $(this).toggleClass("-active");
    $("nav").toggleClass("-active");
    if (navOpen) {
      $("html, body").css("overflow", "auto");
    } else {
      $("html, body").css("overflow", "hidden");
    }
    navOpen = !navOpen;
  });

  $("nav")
    .find("li")
    .on("click", function () {
      $("html, body").css("overflow", "auto");
      $(".toggle-btn").removeClass("-active");
      $("nav").removeClass("-active");
      navOpen = !navOpen;
    });
});
// new img_onload(".kv_frame", function () {
//   $(DOM("[kv]")).addClass("active");
// })
