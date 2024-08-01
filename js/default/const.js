//param
var header_H = function () {
  return document.querySelector(".header_fill").offsetHeight;
};
var navObj = {
  _active: false,
  _transform: false
}
//選單
Object.defineProperty(navObj, "active", {
  get: function () { return this._active },
  set: function (val) {
    var _this = this;
    if (this._transform || this._active === val) {
      return false;
    }
    this._transform = true;
    this._active = val;
    if (val) {
      $(DOM(".nav_frame, .nav_ctn, .nav_btn")).addClass("active");
      $(DOM("html, body")).addClass("nav_active");
    }
    else {
      $(DOM(".nav_frame, .nav_ctn, .nav_btn")).removeClass("active");
      $(DOM("html, body")).removeClass("nav_active");
    }
    setTimeout(function () {
      _this._transform = false;
    }, 500);
  }
})
//fn
function moveTo(e, close) {
  $(DOM("html,body")).stop().animate({
    scrollTop: $(e).offset().top - header_H()
  }, 500);
  if (close) {
    navObj.active = false;
  }
}
//浮動按鈕在指定範圍隱藏
//=>targetArray(Array): [{selector: selector, rate: Function}]
//=>getBottom(Function): float的bottom與window的間距
function float_hideOn(targetArray, getBottom) {
  $(DOM(".float_frame")).addClass("hideOn");
  $(function () {
    $(DOM(".hideOn")).addClass("ready");
  })
  function main() {
    var window_H = window.innerHeight;
    var hideScope = -window.pageYOffset;
    targetArray.forEach(function (item) {
      if (!document.querySelector(item.selector)) {
        return false;
      }
      var targetRate = item.rate ? item.rate() : 1
      hideScope += document.querySelector(item.selector).offsetHeight * targetRate;
    })
    hideScope += header_H();
    var float_H = DOM(".float_frame")[0].offsetHeight + getBottom();
    if (window_H - hideScope > float_H) {
      $(DOM(".float_frame")).addClass("active");
    }
    else {
      $(DOM(".float_frame")).removeClass("active");
    }
  }
  window.addEventListener("scroll", main, false);
  window.addEventListener("resize", main, false);
  $(function () {
    main();
  })
}
//ul
Array.prototype.slice.call(DOM("ul.cus._num")).forEach(function (ul) {
  var _gh = ul.className.indexOf("_gh") > -1;
  Array.prototype.slice.call(ul.children).forEach(function (li, index) {
    var _str = index + 1;
    if (!_gh) {
      _str = _str + ".";
    }
    li.setAttribute("str", _str);
  })
});