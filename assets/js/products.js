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

  function registerListener(event, func, options) {
    if (window.addEventListener) {
      window.addEventListener(event, func, options || !1);
    } else {
      window.attachEvent("on" + event, func);
    }
  }

  domIsReady(function () {
    var cards_in_dom = [];
    registerListener("load", init);
    function init() {
      setDynamicContent();
      lazyLoad();
      sizeSections();
      set_card_nav_listeners();

      var cards = document.getElementsByClassName("card");
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        cards_in_dom.push(card.id);
        card.querySelector(".read").addEventListener("click", read_more);
      }
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
        Modal Open/Close
        --------------------------------------*/

    function modal_open() {
      var overlay = document.getElementById("aside-modal-overlay");
      // overlay.style.visibility = 'visible';
      overlay.classList.add("on-modal");

      var modal = document.getElementById("aside-modal");
      modal.querySelector(".close").addEventListener("click", modal_close);
      overlay.addEventListener("click", modal_close);
      modal.style.zIndex = "11";
      setTimeout(function () {
        modal.style.opacity = "1";
      }, 150);
    }

    function modal_close() {
      var modal = document.getElementById("aside-modal");
      modal.querySelector(".close").removeEventListener("click", modal_close);
      modal.style.opacity = "0";

      var overlay = document.getElementById("aside-modal-overlay");
      overlay.removeEventListener("click", modal_close);
      setTimeout(function () {
        modal.style.zIndex = "0";
        overlay.classList.remove("on-modal");
        // overlay.style.visibility = 'hidden';
      }, 150);
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
      // closeLoader();
    }
    function sizeCards(section) {
      // console.log(section)
      // return
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
        Show/Hide Cards + Card Details
        --------------------------------------*/
    function set_card_nav_listeners() {
      var nav_items = document.getElementsByClassName("nav-item");
      for (var i = 0; i < nav_items.length; i++) {
        var nav_item = nav_items[i];
        nav_item.addEventListener("click", cards_navigate);
      }
      set_cards_base_height();
    }

    function set_cards_base_height() {
      var cards = document.getElementById("cards"),
        cards_height = cards.offsetHeight;
      cards.style.height = cards_height + "px";
    }

    var cards_current_group = "all",
      cards_fragment,
      cards_fragment_children = [];

    function cards_navigate() {
      if (cards_in_dom.length > 0) {
        // Remove click listener for .read of cards on initial page load
        for (var i = 0; i < cards_in_dom.length; i++) {
          var card_id = cards_in_dom[i],
            card = document.getElementById(card_id);
          card.querySelector(".read").removeEventListener("click", read_more);
        }
      }

      var navigate_to = this.getAttribute("data-show");
      if (navigate_to === cards_current_group) {
        return;
      }
      document
        .getElementById("nI-" + cards_current_group)
        .classList.remove("active");
      document.getElementById("nI-" + navigate_to).classList.add("active");
      cards_current_group = navigate_to;
      cards_remove(function () {
        cards_copy(navigate_to);
      });
    }

    function cards_remove(callBack) {
      if (cards_fragment != undefined) {
        for (var i = 0; i < cards_fragment_children.length; i++) {
          var copy_id = cards_fragment_children[i],
            card_copy = document.getElementById(copy_id);
          card_copy
            .querySelector(".read")
            .removeEventListener("click", read_more);
          card_copy.classList.add("hide");
        }
        setTimeout(function () {
          var cards_section = document.getElementById("cards-section");
          cards_section.innerHTML = '<div class="clear"></div>';
          cards_fragment.textContent = "";
          cards_fragment_children = [];
          return callBack();
        }, 350);
      } else {
        return callBack();
      }
    }

    function cards_copy(navigateTo) {
      var cards = document.getElementsByClassName("card");

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i],
          card_show_value = card.getAttribute("data-show"),
          card_should_show = card_show_value.indexOf(navigateTo) >= 0;

        card.classList.add("hide");

        if (card_should_show) {
          cards_fragment =
            cards_fragment === undefined
              ? document.createDocumentFragment()
              : cards_fragment;
          var div = document.createElement("div");
          div.classList.add("card", "hide");
          div.style.height = card.offsetHeight + "px";
          div.setAttribute("id", card.id + "-copy");
          div.setAttribute("data-show", card_show_value);
          div.innerHTML = card.innerHTML;
          div.querySelector(".read").addEventListener("click", read_more);
          cards_fragment.appendChild(div);
          cards_fragment_children.push(card.id + "-copy");
        }
      }
      setTimeout(function () {
        card_set_copy();
      }, 300);
    }

    function card_set_copy() {
      var cards_section = document.getElementById("cards-section");
      cards_section.insertBefore(cards_fragment, cards_section.childNodes[0]);
      setTimeout(function () {
        lazyLoad();
        cards_section.style.zIndex = 2;
        for (var i = 0; i < cards_fragment_children.length; i++) {
          var copy_id = cards_fragment_children[i],
            cardCopy = document.getElementById(copy_id);
          cardCopy.classList.remove("hide");
        }
        var section_height = cards_section.offsetHeight;
        document.getElementById("cards").style.height = section_height + "px";
      }, 300);
    }

    var tree_nick = "assets/data/salon_nick/",
      tree_nick_101 = "assets/data/nick_101/",
      tree_products = "assets/img/products/thumbnails/";

    var read_more_HTML =
      '<div class="head"><button class="close">x</button><h2 class="title"></h2><div class="clear mb-3"></div></div><div class="content"></div>';
    function read_more() {
      var package = this.getAttribute("data-package"),
        products_file = "products.json",
        products_json = _isEnglish
          ? _isSalonNick
            ? tree_nick + products_file
            : "../" + tree_nick_101 + products_file
          : _isSalonNick
          ? "../" + tree_nick + "fr/" + products_file
          : "../../" + tree_nick_101 + "fr/" + products_file;

      var modal = document.getElementById("aside-modal");
      modal.querySelector(".aside-inner").innerHTML = "";

      ajax_get_json(products_json, function (products) {
        var product = products[package],
          fragment = document.createDocumentFragment(),
          wrap_div = document.createElement("div");
        wrap_div.innerHTML = read_more_HTML;
        fragment.appendChild(wrap_div);

        fragment.querySelector(".title").textContent = product.name;

        var img = document.createElement("img"),
          imgSrc = _isEnglish
            ? _isSalonNick
              ? tree_products + product.img
              : "../" + tree_products + product.img
            : _isSalonNick
            ? "../" + tree_products + product.img
            : "../../" + tree_products + product.img;

        img.setAttribute("src", imgSrc);
        img.classList.add("mb-3");
        fragment.querySelector(".content").appendChild(img);

        var testIfContentIsDynamic = function (contentString) {
          var trimmedString = contentString.trim();
          var startIsCurly = trimmedString.substring(0, 2) === "{{";
          var endIsCurly = trimmedString.slice(-2) === "}}";

          return startIsCurly && endIsCurly;
        };

        var getDynamicContentID = function (contentString) {
          var trimmedString = contentString.trim();
          return trimmedString.slice(2).slice(0, -2).trim();
        };

        for (var i = 0; i < product.content.length; i++) {
          var contentSection = product.content[i];

          // If content is dynamic find reference in product and render as a list.
          var contentIsDynamic = testIfContentIsDynamic(contentSection);

          if (contentIsDynamic) {
            var dynamicContentID = getDynamicContentID(contentSection);
            var dynamicContent = product[dynamicContentID];
            if (dynamicContent !== undefined) {
              var ul = document.createElement("ul");
              for (
                var dynamicContentIndex = 0;
                dynamicContentIndex < dynamicContent.length;
                dynamicContentIndex++
              ) {
                var li = document.createElement("li");
                li.textContent = dynamicContent[dynamicContentIndex];
                ul.appendChild(li);
              }
              fragment.querySelector(".content").appendChild(ul);
            }
            continue;
          }

          var p = document.createElement("p");
          p.textContent = contentSection;
          p.classList.add("mb-2");
          fragment.querySelector(".content").appendChild(p);
        }

        var modal = document.getElementById("aside-modal");
        modal.querySelector(".aside-inner").appendChild(fragment);
        modal_open();
      });
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
