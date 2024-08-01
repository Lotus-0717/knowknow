//fn
function maxW() {
  return 1920;
}
function DOM(e) {
  return document.querySelectorAll(e);
}
function random(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//qs
var qs = {};
var search = location.search.replace("?", "");
if (search) {
  search.split("&").forEach(function (s) {
    var query = s.split("=");
    if (query.length === 2) {
      var key = query[0];
      var value = query[1];
      qs[key] = value;
    }
  })
}
//依比例縮放
var IBILI = {
  isInit: false,
  list: [],
  push: function (selector, rules, options) {
    options = options || {};
    var item = {
      selector: selector,
      rules: rules, //[{ from, to, W, H, padding, fix }]
    }
    if (options.callback) { item.callback = options.callback }
    //
    this.list.push(item);
    if (options.watch) {
      this.watch.push(selector);
    }
    //
    if (this.isInit) {
      return false;
    }
    this.isInit = true;
    this.init();
  },
  main: function () {
    this.list.forEach(function (obj) {
      $(DOM(obj.selector)).addClass("IBILI");
      //包含scroll(for css media)
      var wW = window.innerWidth;
      //不包含scroll
      var bW = document.body.clientWidth;
      bW = bW > maxW() ? maxW() : bW;

      var scalcRate = 1;
      var targetIndex = -1;
      obj.rules.forEach(function (rule, index) {
        if (wW <= rule.from && wW >= rule.to) {
          targetIndex = index;
        }
      })
      if (targetIndex > -1) {
        Array.prototype.slice.call(DOM(obj.selector)).forEach(function (dom) {
          var _W = obj.rules[targetIndex].W || obj.rules[targetIndex].from;
          var _padding = obj.rules[targetIndex].padding || 0;
          //fix
          var fix = obj.rules[targetIndex].fix || 0;
          if (fix) {
            scalcRate = fix;
          }
          else {
            scalcRate = (bW - _padding * 2) / (_W - _padding * 2);
          }
          //active
          $(dom).addClass("active");
          //DOM > div
          $(dom.children[0]).css({
            "-ms-transform": "scale(" + scalcRate + ")",
            transform: "scale(" + scalcRate + ")",
            width: _W + "px",
            "margin-left": -_W / 2 + "px"
          });
          //DOM
          var _H = obj.rules[targetIndex].H || dom.children[0].clientHeight;
          dom.style.height = Math.floor(_H * scalcRate) + "px";
        });
      } else {
        Array.prototype.slice.call(DOM(obj.selector)).forEach(function (dom) {
          //active
          $(dom).removeClass("active");
          //DOM
          $(dom).removeAttr("style");
          //DOM > div
          $(dom.children[0]).removeAttr("style");
        });
      }
      //callback
      if (obj.callback) {
        obj.callback();
      }
    })
  },
  resize: function () {
    var _this = this;
    _this.main();
    setTimeout(function () { _this.main() }, 100);
  },
  init: function () {
    var _this = this;
    $(function () { _this.resize() });
    window.addEventListener("resize", function () { _this.resize() }, false);
    new img_onload(".space_frame", function () { _this.resize() });
  },
  watch: {
    isInit: false,
    list: [],
    push: function (selector) {
      var _this = this;
      Array.prototype.slice.call(DOM(selector)).forEach(function (dom) {
        _this.list.push({
          dom: dom.children[0],
          H: dom.children[0].clientHeight
        })
      });
      if (this.isInit) {
        return false;
      }
      this.isInit = true;
      this.init();
    },
    init: function () {
      var _this = this;
      setInterval(function () {
        _this.list.forEach(function (item) {
          if (item.H !== item.dom.clientHeight) {
            item.H = item.dom.clientHeight;
            IBILI.resize();
          }
        })
      }, 10)
    }
  }
};
function set_attr(e, attr, val) {
  Array.prototype.slice.call(DOM(e)).forEach(function (dom) {
    dom.setAttribute(attr, val);
    if (dom.tagName.toLowerCase() === "a" && attr === "href") {
      dom.target = "_blank";
      dom.rel = "noreferrer noopener";
    }
  });
}
var Sto = function (options) {
  var _this = this;
  options = options || {};
  var once = options.once || false;

  this.activeFn = [];
  this.deactiveFn = [];
  this.main = function () {
    var wH = window.innerHeight;
    var wT = window.pageYOffset;
    var wB = wT + wH;
    Array.prototype.slice.call(DOM("[sto]")).forEach(function (dom) {
      var dH = dom.clientHeight;
      var dT = Math.floor($(dom).offset().top);
      var dB = dT + dH;
      //畫面裡
      if ((dT < wB && dT > wT) || (dB < wB && dB > wT)) {
        var targetRange = Number((dom.attributes["sto-rate"] || {}).value) || 20;
        var topRate = Math.floor((dT - wT) / wH * 100);
        var bottomRate = Math.floor((dB - wT) / wH * 100);
        if (topRate > 50) {
          topRate = 100 - topRate;
        }
        if (bottomRate > 50) {
          bottomRate = 100 - bottomRate;
        }
        if (topRate >= targetRange || bottomRate >= targetRange) {
          $(dom).addClass("active");
          $(dom.querySelectorAll("[sto-sub]")).addClass("active");
          //
          _this.activeFn.forEach(function (fn) {
            if (typeof fn === "function") {
              fn(dom);
            }
          })
        }
      }
      //dom比畫面大
      else if (dT <= wT && dB >= wB) {
        $(dom).addClass("active");
        $(dom.querySelectorAll("[sto-sub]")).addClass("active");
        //
        _this.activeFn.forEach(function (fn) {
          if (typeof fn === "function") {
            fn(dom);
          }
        })
      }
      //畫面外
      else {
        if (once) {
          return false;
        }
        if (!$(dom).hasClass("active")) {
          return false;
        }
        _this.deactiveFn.forEach(function (fn) {
          if (typeof fn === "function") {
            fn(dom);
          }
        })
        //
        $(dom).removeClass("active");
        $(dom.querySelectorAll("[sto-sub]")).removeClass("active");
      }
    });
  }
  this.init = function () {
    this.main();
    window.addEventListener("scroll", function () { _this.main() }, false);
    window.addEventListener("resize", function () { _this.main() }, false);
    //
    Array.prototype.slice.call(DOM("img")).forEach(function (img) {
      img.addEventListener("load", function () {
        _this.main();
      })
      if (img.complete) {
        _this.main();
      }
    });
  }
}
//滾動視差
var Spx = function (options) {
  //位移spx下一層, transform會影響scrollTop
  var _this = this;
  options = options || {};

  this.el = options.el || "body";
  this.speed = options.speed || 0.4;//位移量比例
  this.main = function () {
    //
    $(document.querySelector(_this.el)).addClass("spx_frame");
    //
    var wT = window.pageYOffset;
    var wH = window.innerHeight;
    Array.prototype.slice.call(DOM("[spx]")).forEach(function (dom) {
      var dom_offsetTop = Math.floor($(dom).offset().top);
      var dom_clientHeight = dom.clientHeight;
      var spx_speed = dom.getAttribute("spx") * 1 || _this.speed;//位移量比例
      var spx_offsetTop = (dom_offsetTop + dom_clientHeight / 2) - wH / 2;//初始值 => dom的中心點在畫面中心
      var spx_transform = (spx_offsetTop - wT) * spx_speed;//位移量
      if (dom_offsetTop + dom_clientHeight + spx_transform > document.querySelector(_this.el).offsetHeight) {
        return false;
      }
      $(dom).children().css({
        "-webkit-transform": "translateY(" + spx_transform + "px)",
        transform: "translateY(" + spx_transform + "px)",
      })
    });
  }
  this.init = function () {
    var _this = this;
    this.main();
    window.addEventListener("scroll", function () { _this.main() }, false);
    window.addEventListener("resize", function () { _this.main() }, false);
  }
}
//a標籤加_blank
function BLANK() {
  Array.prototype.slice.call(DOM("a")).forEach(function (dom) {
    var _href = dom.getAttribute("href");
    if (new RegExp(/(\/\w+)+/gm).test(_href)) {
      dom.target = "_blank";
      dom.rel = "noreferrer noopener";
    }
  });
}
BLANK();
var Collapse = function (options) {
  var _this = this;
  options = options || {};
  var container = options.container; //目標容器
  //容器內
  var button = options.button; //觸發按鈕
  var active = options.active; //切換active狀態
  var collapse = options.collapse; //收合目標
  var bind = options.bind || false; //與相同容器連動
  var clickable = options.clickable === undefined ? true : options.clickable; //啟用/禁用click
  this.bind = bind;
  this.button = [];
  this.open = function (selector, open) {
    var _button;

    if (typeof selector === "number") {
      _button = this.button[selector]; //index
    }
    else if (typeof selector === "string") {
      _button = DOM(selector)[0]; //selector 
    }
    else if (selector instanceof Element) {
      _button = selector; //dom
    }
    if (_button.active === open) {
      return false;
    }
    if (open === undefined) {
      open = !_button.active;
    }
    if (open) {
      $(_button.container.querySelectorAll(active)).addClass("active");
      $(_button.container.querySelectorAll(collapse)).slideDown();
    }
    else {
      $(_button.container.querySelectorAll(active)).removeClass("active");
      $(_button.container.querySelectorAll(collapse)).slideUp();
    }
    _button.active = open;
  }
  this.init = function () {
    Array.prototype.slice.call(DOM(container)).forEach(function (_container, index) {
      var _button = _container.querySelector(button);
      _button.index = index;
      _button.container = _container;
      _button.active = false;
      _button.clickable = clickable;
      _button.addEventListener("click", function () {
        if (!_button.clickable) {
          return false;
        }
        if (_this.bind) {
          Array.prototype.slice.call(DOM(container + " " + button)).forEach(function (btn) {
            if (btn === _button) {
              return false;
            }
            _this.open(btn, false);
          })
        }
        _this.open(_button, !_button.active);
      }, false);
      _this.button.push(_button);
    });
  }
}
//指定區域img onload
var img_onload = function (target, callback) {
  var _this = this;
  var targetImg = DOM(target)[0].querySelectorAll("img");

  this.isInit = false;
  this.imgLoad = {
    count: 0,
    length: targetImg.length
  };
  this.callback = function () {
    if (this.imgLoad.count === this.imgLoad.length) {
      if (this.isInit) {
        return false;
      }
      this.isInit = true;
      callback();
    }
  };

  Array.prototype.slice.call(targetImg).forEach(function (img) {
    if (img.complete) {
      _this.imgLoad.count += 1;
      _this.callback();
    }
    else {
      img.addEventListener("load", function () {
        _this.imgLoad.count += 1;
        _this.callback();
      })
    }
  });
}