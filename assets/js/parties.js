/* fallback.js v1.1.9 | http://fallback.io/ | Salvatore Garbesi <sal@dolox.com> | (c) 2015 Dolox, Inc. */
(function (l, g) {
  var b = {
    g: [],
    B: {},
    C: 0,
    head: g.getElementsByTagName("head")[0],
    a: {},
    p: 0,
    q: {},
    f: [],
    e: {},
    m: 0,
    d: {},
    c: {},
    s: 0,
    u: function () {
      for (var a in b.k) b.k[a] && b.A(b.k[a]);
    },
    k: ["Array", "Function", "Object", "String"],
    A: function (a) {
      b["is_" + a.toLowerCase()] = function (d) {
        return (
          "undefined" !== typeof d &&
          Object.prototype.toString.call(d) == "[object " + a + "]"
        );
      };
    },
    i: function (a) {
      this.is_function(a) || (a = function () {});
      return a;
    },
    n: function (a, d) {
      for (var c in a) if (a[c] === d) return c;
      return -1;
    },
    is_defined: function (a) {
      try {
        if (eval("window." + a)) return !0;
      } catch (d) {}
      return !1;
    },
    t: function (a, d) {
      this.is_object(d) &&
        (d.integrity && a.setAttribute("integrity", d.integrity),
        d.crossorigin && a.setAttribute("crossorigin", d.crossorigin));
    },
    importer: function (a, d) {
      var c,
        b,
        e,
        h,
        m,
        k,
        g,
        l = {};
      for (e in a)
        if ((h = a[e]))
          (m = this.is_string(h) ? [h] : this.is_object(h) ? h.urls : h),
            this.is_array(m) &&
              ((c = []),
              this.is_array(this.a[e]) && (c = this.a[e]),
              (l[e] = m),
              (this.a[e] = c.concat(m)),
              (this.q[e] = h));
      h = {};
      if (
        this.is_object(d) &&
        (this.is_object(d.shim) ||
          (this.is_object(d.deps)
            ? (d.shim = d.deps)
            : this.is_object(d.dependencies) && (d.shim = d.dependencies)),
        this.is_object(d.shim))
      )
        for (k in ((m = d.shim), m))
          if (
            ((c = m[k]),
            this.a[k] &&
              c &&
              (this.is_string(c) && (c = [c]), this.is_array(c)))
          ) {
            g = [];
            for (b in c) (e = c[b]), this.a[e] && e !== k && g.push(e);
            c = [];
            this.is_array(this.d[k]) && (c = this.d[k]);
            h[k] = g;
            this.d[k] = c.concat(g);
          }
      return { a: l, d: h };
    },
    css: {},
  };
  b.css.l = function (a) {
    if (!g.styleSheets) return !1;
    var d, c, f;
    for (d in g.styleSheets)
      if (((c = g.styleSheets[d]), 0 !== c))
        try {
          if (
            (c.rules && (f = b.css.r(c.rules, a))) ||
            (c.cssRules && (f = b.css.r(c.cssRules, a)))
          )
            return f;
        } catch (e) {}
    return !1;
  };
  b.css.r = function (a, d) {
    var c, b;
    for (c in a) if (((b = a[c]), b.selectorText === d)) return !0;
    return !1;
  };
  b.load = function (a, d, c) {
    var b, e;
    if (!this.is_object(a)) return !1;
    this.is_function(d) && ((c = d), (d = {}));
    this.is_object(d) || (d = {});
    a = this.importer(a, d);
    for (b in a.a) (e = a.a[b]), this.d[b] || this.b(b, e);
    this.is_function(d.callback) && this.ready([], d.callback);
    this.is_function(c) && this.ready([], c);
  };
  b.ready = function (a, b) {
    var c, f;
    if (this.is_function(a)) (b = a), (a = []);
    else {
      if (!this.is_array(a) || this.is_string(a)) a = [a];
      for (c in a) (f = a[c]), this.a[f] && !this.d[f] && this.b(f, this.a[f]);
    }
    this.g.push({ i: this.i(b), a: a });
    return this.j();
  };
  b.j = function () {
    var a,
      b,
      c,
      f,
      e,
      h = [],
      g = [];
    for (a in this.g)
      if (
        ((e = this.g[a]),
        this.is_object(e) && this.is_array(e.a) && this.is_function(e.i))
      ) {
        f = !1;
        if (0 < e.a.length) {
          b = 0;
          for (c in this.c) 0 <= this.n(e.a, c) && b++;
          b === e.a.length && (f = !0);
        } else this.p === this.s + this.m && (f = !0);
        f ? g.push(e.i) : h.push(this.g[a]);
      }
    this.g = h;
    for (a in g) g[a](this.c, this.e);
  };
  b.w = function () {
    var a, b, c, f;
    for (c in this.d)
      if ((f = this.d[c]) && !this.c[c]) {
        a = 0;
        for (b in f) this.c[f[b]] && a++;
        a === f.length && (this.b(c, this.a[c]), delete this.d[c]);
      }
  };
  b.b = function (a, b) {
    if (-1 !== this.n(this.f, a)) return !1;
    this.p++;
    this.f.push(a);
    return this.b.o(a, b);
  };
  b.b.o = function (a, d) {
    var c,
      f = "js",
      e = { loaded: !1, h: a, v: b.q[a], f: !0, url: d.shift(), urls: d };
    if (-1 < e.url.indexOf(".css")) {
      f = "css";
      if (b.css.l(a)) return (e.f = !1), b.b.c(e);
      c = g.createElement("link");
      c.crossorigin = !0;
      c.rel = "stylesheet";
      c.href = e.url;
    } else {
      if (b.is_defined(a)) return (e.f = !1), b.b.c(e);
      c = g.createElement("script");
      c.src = e.url;
    }
    b.t(c, e.v);
    c.onload = function () {
      return ("js" === f && !b.is_defined(a)) ||
        ("js" !== f &&
          !b.css.l(a) &&
          Object.hasOwnProperty.call(l, "ActiveXObject") &&
          !l.ActiveXObject)
        ? b.b.e(e)
        : b.b.c(e);
    };
    c.onreadystatechange = function () {
      if (
        !this.readyState ||
        "loaded" === this.readyState ||
        "complete" === this.readyState
      )
        return (
          (this.onreadystatechange = null),
          "js" !== f || b.is_defined(a) ? b.b.c(e) : b.b.e(e)
        );
    };
    c.onerror = function () {
      return b.b.e(e);
    };
    return b.head.appendChild(c);
  };
  b.b.e = function (a) {
    a.f = !1;
    b.e[a.h] || (b.e[a.h] = []);
    b.e[a.h].push(a.url);
    return a.urls.length ? b.b.o(a.h, a.urls) : (b.m++, b.j());
  };
  b.b.c = function (a) {
    a.loaded || ((a.loaded = !0), (b.c[a.h] = a.url), b.s++);
    b.w();
    return b.j();
  };
  b.u();
  l.fallback = l.fbk = b;
})(window, document);

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

  function ajax_get_json(url, callback) {
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

  function registerListener(event, func) {
    if (window.addEventListener) {
      window.addEventListener(event, func);
    } else {
      window.attachEvent("on" + event, func);
    }
  }

  /*------------------------------------
        DOM IS READY
    --------------------------------------*/
  domIsReady(function () {
    registerListener("load", init);
    function init() {
      setDynamicContent();
      setNavPosition();
      lazyLoad();
      closeLoader(set_store_hours);
      registerListener("resize", onResize);
    }

    var booking = undefined;

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
      (_infoBarMainMsg = document.getElementById("info-bar-msg")),
        (_infoBarArrow = document.getElementById("info-bar-arrow")),
        (_infoBarBody = document.getElementById("info-bar-body")),
        (_infoBarBodyHeight = _infoBarBody.offsetHeight),
        (_infoBarCloseBtn = document.getElementById("close-info-bar"));

      var _infoBarOpen = false;
      _infoBarMainMsg.addEventListener("click", function () {
        if (!_infoBarOpen) {
          _infoBarOpen = true;
          setNavPosition(true);
          _infoBarArrow.className += " hide";
          _infoBar.style.height = _infoBarBodyHeight + 45 + "px";
          _infoBarOpen = true;
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
      nav_is_open = false;

    nav_button.addEventListener("click", on_nav_button);

    function on_nav_button() {
      return nav_is_open ? close_nav() : open_nav();
    }

    function open_nav() {
      var nav_element = document.getElementById("tag-nav"),
        overlay = document.getElementById("aside-modal-overlay");

      overlay.classList.add("on-nav");
      overlay.addEventListener("click", close_nav);
      nav_button.classList.add("open");
      nav_element.classList.add("open");
      nav_is_open = true;
    }

    function close_nav() {
      var nav_element = document.getElementById("tag-nav"),
        overlay = document.getElementById("aside-modal-overlay");

      nav_button.classList.remove("open");
      nav_element.classList.remove("open");
      overlay.classList.remove("on-nav");
      overlay.removeEventListener("click", close_nav);
      nav_is_open = false;
    }

    /*------------------------------------
        Modal Open/Close
        --------------------------------------*/
    var loader, loaderTimeout;
    function closeLoader(callBack) {
      if (!loader) {
        loader = document.getElementById("aside-load");
      }
      // aside.style.cssText = 'background: #fff; left: 50%; position: fixed; top: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0.9); transition: all 0.6s ease-in-out; width: 100%; z-index: 0;';
      loader.className += " hide";
      if (typeof loaderTimeout === "number") {
        clearTimeout(loaderTimeout);
      }
      loaderTimeout = setTimeout(function () {
        if (callBack) {
          callBack();
        }
      }, 600);
    }
    function openLoader(callBack) {
      loader.className = loader.className.replace(" hide", "").trim();
      if (callBack && typeof callBack === "function") {
        callBack();
      }
    }

    var modal = document.getElementById("aside-modal");
    var overlay = document.getElementById("aside-modal-overlay");
    function modal_open() {
      modal.querySelector(".close").addEventListener("click", modal_close);
      overlay.addEventListener("click", modal_close);

      modal.className = modal.className.replace(" hide", "");
      overlay.className = overlay.className.replace(" hide", "");
    }

    on.modalClose = modal_close;
    function modal_close() {
      modal.querySelector(".close").removeEventListener("click", modal_close);
      overlay.removeEventListener("click", modal_close);

      setTimeout(function () {
        if (modal.className.indexOf("hide") === -1) {
          modal.className += " hide";
        }
        if (overlay.className.indexOf("hide") === -1) {
          overlay.className += " hide";
        }

        if (booking != undefined) {
          booking.resetForm();
          booking.removeListeners();
        }
      }, 150);
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

      ajax_get_json(store_json, function (store) {
        on.store = store;
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
            var node_hours = document.getElementById("ifOpen");
            node_hours.textContent = text;
            node_hours.style.opacity = "1";
            document.getElementById("imgClock").classList.toggle("hide");
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
        OnScroll
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

    registerListener("scroll", onScroll);
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
