/*!
 * $script.js JS loader & dependency manager
 * https://github.com/ded/script.js
 * (c) Dustin Diaz 2014 | License MIT
 */
(function (e, t) {
  typeof module != "undefined" && module.exports
    ? (module.exports = t())
    : typeof define == "function" && define.amd
    ? define(t)
    : (this[e] = t());
})("$script", function () {
  function p(e, t) {
    for (var n = 0, i = e.length; n < i; ++n) if (!t(e[n])) return r;
    return 1;
  }
  function d(e, t) {
    p(e, function (e) {
      return t(e), 1;
    });
  }
  function v(e, t, n) {
    function g(e) {
      return e.call ? e() : u[e];
    }
    function y() {
      if (!--h) {
        (u[o] = 1), s && s();
        for (var e in f) p(e.split("|"), g) && !d(f[e], g) && (f[e] = []);
      }
    }
    e = e[i] ? e : [e];
    var r = t && t.call,
      s = r ? t : n,
      o = r ? e.join("") : t,
      h = e.length;
    return (
      setTimeout(function () {
        d(e, function t(e, n) {
          if (e === null) return y();
          !n &&
            !/^https?:\/\//.test(e) &&
            c &&
            (e = e.indexOf(".js") === -1 ? c + e + ".js" : c + e);
          if (l[e])
            return (
              o && (a[o] = 1),
              l[e] == 2
                ? y()
                : setTimeout(function () {
                    t(e, !0);
                  }, 0)
            );
          (l[e] = 1), o && (a[o] = 1), m(e, y);
        });
      }, 0),
      v
    );
  }
  function m(n, r) {
    var i = e.createElement("script"),
      u;
    (i.onload =
      i.onerror =
      i[o] =
        function () {
          if ((i[s] && !/^c|loade/.test(i[s])) || u) return;
          (i.onload = i[o] = null), (u = 1), (l[n] = 2), r();
        }),
      (i.async = 1),
      (i.src = h ? n + (n.indexOf("?") === -1 ? "?" : "&") + h : n),
      t.insertBefore(i, t.lastChild);
  }
  var e = document,
    t = e.getElementsByTagName("head")[0],
    n = "string",
    r = !1,
    i = "push",
    s = "readyState",
    o = "onreadystatechange",
    u = {},
    a = {},
    f = {},
    l = {},
    c,
    h;
  return (
    (v.get = m),
    (v.order = function (e, t, n) {
      (function r(i) {
        (i = e.shift()), e.length ? v(i, r) : v(i, t, n);
      })();
    }),
    (v.path = function (e) {
      c = e;
    }),
    (v.urlArgs = function (e) {
      h = e;
    }),
    (v.ready = function (e, t, n) {
      e = e[i] ? e : [e];
      var r = [];
      return (
        !d(e, function (e) {
          u[e] || r[i](e);
        }) &&
        p(e, function (e) {
          return u[e];
        })
          ? t()
          : !(function (e) {
              (f[e] = f[e] || []), f[e][i](t), n && n(r);
            })(e.join("|")),
        v
      );
    }),
    (v.done = function (e) {
      v([null], e);
    }),
    v
  );
});

var domIsReady = (function (domIsReady) {
  var isBrowserIeOrNot = function () {
    return !document.attachEvent || typeof document.attachEvent === "undefined"
      ? "not-ie"
      : "ie";
  };

  domIsReady = function (callback) {
    if (callback && typeof callback === "function") {
      if (isBrowserIeOrNot() !== "ie") {
        document.addEventListener("DOMContentLoaded", function () {
          return callback();
        });
      } else {
        document.attachEvent("onreadystatechange", function () {
          if (document.readyState === "complete") {
            return callback();
          }
        });
      }
    } else {
      console.error("The callback is not a function!");
    }
  };

  return domIsReady;
})(domIsReady || {});

(function (document, window, domIsReady, undefined) {
  /*------------------------------------
        Onic | Core
    --------------------------------------*/
  window.on = window.Onic = window.Onic === undefined ? {} : window.Onic;
  on.init = function OnInit(bundle) {
    return Object.create(this.bundle[bundle]);
  };
  on.bundle = on.bundle === undefined ? {} : on.bundle;
  var _app = document.getElementById("on-app"),
    _isSalonNick = _app.classList.contains("salon-nick"),
    _isEnglish = document.documentElement.lang == "en";

  function getJson(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
          var data = JSON.parse(xmlhttp.responseText);
          callback(data);
        } catch (err) {
          console.log(err.message + " in " + xmlhttp.responseText);
          return;
        }
      }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  function registerListener(event, func, options) {
    if (window.addEventListener) {
      window.addEventListener(event, func, options || !1);
    } else {
      window.attachEvent("on" + event, func);
    }
  }

  domIsReady(function () {
    registerListener("load", init);
    function init() {
      setDynamicContent();
      setNavPosition();
      sizeSections();
      closeLoader();
      registerListener("resize", onResize);
    }

    /*------------------------------------
        Onic | Info Bar
        --------------------------------------*/
    var _infoBar = document.getElementById("tag-aside-info-bar"),
      _infoBarMainMsg,
      _infoBarArrow,
      _infoBarBody,
      _infoBarBodyHeight,
      _infoBarCloseBtn;

    if (_infoBar) {
      _infoBarMainMsg = document.getElementById("info-bar-msg");
      _infoBarArrow = document.getElementById("info-bar-arrow");
      _infoBarBody = document.getElementById("info-bar-body");
      _infoBarBodyHeight = _infoBarBody.offsetHeight;
      _infoBarCloseBtn = document.getElementById("close-info-bar");

      var _infoBarOpen = false;
      _infoBarMainMsg.addEventListener("click", function () {
        if (!_infoBarOpen) {
          _infoBarOpen = true;
          setNavPosition(true);
          _infoBarArrow.className += " hide";
          _infoBar.style.height = _infoBarBodyHeight + 45 + "px";
          return;
        }
        _infoBarArrow.className = _infoBarArrow.className.replace(" hide", "");
        _infoBar.style.height = "45px";
        _infoBarOpen = false;
        setNavPosition(true);
      });

      _infoBarCloseBtn.addEventListener("click", function () {
        _infoBarArrow.className = _infoBarArrow.className.replace(" hide", "");
        _infoBar.style.height = "45px";
        _infoBarOpen = false;
        setNavPosition(true);
      });
    }

    //#region Dynamic Content
    /**
     * Set dynamic copyright year.
     */
    function setCopyrightYear() {
      var copyrightYearElem = document.getElementById("copyrightYear");
      var now = new Date();
      // Test if element exist (guard against thrown errors).
      if (copyrightYearElem) {
        copyrightYearElem.textContent = now.getFullYear();
      }
    }

    /**
     * Set dynamic text content.
     */
    function setDynamicContent() {
      setCopyrightYear();
    }
    //#endregion Dynamic Content

    /*------------------------------------
        Onic | Nav
        --------------------------------------*/
    var _headerTop = document.getElementById("tag-sec-navTop"),
      _navSection = document.getElementById("tag-sec-nav");

    var _headerTopHeight = _headerTop.offsetHeight,
      _navSectionPosition = 0;

    function setNavPosition(infoBarOpening) {
      _navSectionPosition =
        _headerTopHeight +
        (_infoBar ? (_infoBarOpen ? _infoBarBodyHeight + 45 : 45) : 0);

      if (currentScrollPosition > _navSectionPosition && !infoBarOpening)
        return;
      if (infoBarOpening) {
        _navSection.classList.add("infoBarOpening");
      }
      if (!infoBarOpening && _navSection.classList.contains("infoBarOpening")) {
        _navSection.classList.remove("infoBarOpening");
      }
      _navSection.style.transform = "translateY(" + _navSectionPosition + "px)";
    }

    var nav_button = document.getElementById("btn-nav"),
      nav_is_open = !1;

    nav_button.addEventListener("click", on_nav_button);

    function on_nav_button() {
      return nav_is_open ? close_nav() : open_nav();
    }

    var nav_element = document.getElementById("tag-nav"),
      overlay = document.getElementById("aside-modal-overlay");
    function open_nav() {
      overlay.classList.add("on-nav");
      overlay.addEventListener("click", close_nav);
      nav_button.classList.add("open");
      nav_element.classList.add("open");
      nav_is_open = !0;
    }

    function close_nav() {
      nav_button.classList.remove("open");
      nav_element.classList.remove("open");
      overlay.classList.remove("on-nav");
      overlay.removeEventListener("click", close_nav);
      nav_is_open = !1;
    }

    /*------------------------------------
        Close Loader
        --------------------------------------*/

    var aside = document.getElementById("aside-load");
    function closeLoader() {
      lazyLoad();
      setTimeout(function () {
        aside.className += " hide";
        set_store_hours();
      }, 250);
    }

    /*------------------------------------
        Make cards same height
        --------------------------------------*/
    function sizeSections() {
      var cardsSections = document.getElementsByClassName("cards");
      for (var i = 0; i < cardsSections.length; i++) {
        var section = cardsSections[i];
        sizeCards(section);
      }
      closeLoader();
    }
    function sizeCards(section) {
      var sec = section,
        cards = sec.getElementsByClassName("card"),
        cardHeights = [];

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        cardHeights.push(card.offsetHeight);
      }
      var max = Math.max.apply(null, cardHeights);
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        card.style.height = max + "px";
      }
    }

    /*------------------------------------
        Get Store Info - Set Hours
        --------------------------------------*/

    var tree_nick = "assets/data/salon_nick/",
      tree_nick_101 = "assets/data/nick_101/",
      store_file = "store-info.json",
      store_json = _isEnglish
        ? _isSalonNick
          ? tree_nick + store_file
          : "../" + tree_nick_101 + store_file
        : _isSalonNick
        ? "../" + tree_nick + "fr/" + store_file
        : "../../" + tree_nick_101 + "fr/" + store_file;

    function getState(currentHour, open, close) {
      var h = currentHour,
        _e = "early",
        _c = "closed",
        state =
          open === -1
            ? _c
            : open === -2
            ? h < 18 && h >= 9
              ? "special"
              : h < 9
              ? _e
              : _c
            : h < open
            ? _e
            : h > close
            ? _c
            : h >= open && h < close
            ? "open"
            : _c;

      return state;
    }

    function is_today(today, days) {
      var firstDay = parseInt(days[0]),
        lastDay = parseInt(days[2]),
        TExtra = days.indexOf("+") >= 0,
        Return = false;

      if (TExtra) {
        var _EDay = parseInt(days[4]);
        Return = today === _EDay ? true : false;
      }
      return today >= firstDay && today <= lastDay
        ? true
        : TExtra
        ? Return
        : false;
    }

    function set_store_hours() {
      var date = new Date(),
        hour = date.getHours(),
        day = date.getDay();

      getJson(store_json, function (store) {
        var hours = store.hours;
        for (var val in hours.normal) {
          if (!hours.normal.hasOwnProperty(val)) continue;
          var obj = hours.normal[val],
            today =
              obj.day == day
                ? true
                : typeof obj.day === "string"
                ? is_today(day, obj.day)
                : false;

          if (today) {
            var state = getState(hour, obj.open, obj.close),
              lang = _isEnglish ? "en" : "fr",
              tObj = obj[lang][state],
              text =
                tObj.indexOf("oN.") >= 0
                  ? hours.content[lang][tObj.substring(3)]
                  : tObj;

            var node_hours = document.getElementById("ifOpen"),
              clockIcon = document.getElementById("imgClock");

            // node_hours.textContent = "Merci pour votre visite, nous sommes ouverts aujourd'hui pour les fêtes d'anniversaire seulement.";
            node_hours.textContent = text;
            node_hours.style.opacity = "1";
            clockIcon.className = clockIcon.className.replace(" hide", "");

            _headerTopHeight = _headerTop.offsetHeight;
            setNavPosition();
          }
        }
      });
    }

    /*------------------------------------
        Lazy Load Images
        This will help with initial load times
        Thanks 
        Robin Osborne - https://codepen.io/rposbo/pen/ONmgVG
        for the initial code
        --------------------------------------*/
    var lazy = [],
      _pi = "assets/img/";

    function lazyLoad() {
      lazy = document.getElementsByClassName("lazyImg");
      for (var i = 0; i < lazy.length; i++) {
        if (lazy[i].getAttribute("data-src") && isInViewport(lazy[i])) {
          var _src = lazy[i].getAttribute("data-src"),
            _path = _isEnglish
              ? _isSalonNick
                ? _pi + _src
                : "../" + _pi + _src
              : _isSalonNick
              ? "../" + _pi + _src
              : "../../" + _pi + _src;

          lazy[i].src = _path;
          lazy[i].removeAttribute("data-src");
        }
      }
      cleanLazy();
    }

    function cleanLazy() {
      lazy = Array.prototype.filter.call(lazy, function (l) {
        return l.getAttribute("data-src");
      });
    }

    function isInViewport(el) {
      var rect = el.getBoundingClientRect();

      return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    /*------------------------------------
        Onic | OnScroll
        --------------------------------------*/

    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
    var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    var currentScrollPosition = supportPageOffset
        ? window.pageYOffset
        : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop,
      lastKnownScrollPosition = 0,
      ticking = !1;

    registerListener("scroll", onScroll, { passive: !0 });
    function onScroll(e) {
      // var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
      var y = supportPageOffset
        ? window.pageYOffset
        : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop;
      lastKnownScrollPosition = y;

      if (!ticking) {
        requestAnimationFrame(scrollAction);
        ticking = !0;
      }
    }

    function scrollAction() {
      lazyLoad();
      var __goingDown = lastKnownScrollPosition > currentScrollPosition;
      var __belowTopInfo = lastKnownScrollPosition > _navSectionPosition;

      var __possibleNavPosition = Math.round(
          _navSectionPosition - currentScrollPosition
        ),
        __navPositionGoingUp = 0;

      if (_navSection.classList.contains("infoBarOpening")) {
        _navSection.classList.remove("infoBarOpening");
      }

      if (__goingDown) {
        _navSection.style.transform =
          "translateY(" +
          (__belowTopInfo ? 0 : __possibleNavPosition) +
          "px" +
          ")";
      }
      if (!__goingDown && !__belowTopInfo) {
        __navPositionGoingUp =
          lastKnownScrollPosition < 2.0
            ? _navSectionPosition
            : __possibleNavPosition;
        _navSection.style.transform =
          "translateY(" + __navPositionGoingUp + "px)";
      }

      ticking = !1;
      currentScrollPosition = lastKnownScrollPosition;
    }

    /*------------------------------------
            Onic | OnResize
        --------------------------------------*/
    var _resizeTicking = !1;
    function onResize(e) {
      if (!_resizeTicking) {
        requestAnimationFrame(resizeAction);
        _resizeTicking = !0;
      }
    }
    function resizeAction() {
      if (_infoBar) {
        _infoBarBodyHeight = _infoBarBody.offsetHeight;
        if (_infoBarOpen) {
          _infoBar.style.height = _infoBarBodyHeight + 45 + "px";
        }
      }
      _headerTopHeight = _headerTop.offsetHeight;
      setNavPosition();
      _resizeTicking = !1;
    }
  });
})(document, window, window.domIsReady);
