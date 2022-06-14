/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
*/
(function (e, t) { typeof module != "undefined" && module.exports ? module.exports = t() : typeof define == "function" && define.amd ? define(t) : this[e] = t() })("$script", function () { function p(e, t) { for (var n = 0, i = e.length; n < i; ++n)if (!t(e[n])) return r; return 1 } function d(e, t) { p(e, function (e) { return t(e), 1 }) } function v(e, t, n) { function g(e) { return e.call ? e() : u[e] } function y() { if (!--h) { u[o] = 1, s && s(); for (var e in f) p(e.split("|"), g) && !d(f[e], g) && (f[e] = []) } } e = e[i] ? e : [e]; var r = t && t.call, s = r ? t : n, o = r ? e.join("") : t, h = e.length; return setTimeout(function () { d(e, function t(e, n) { if (e === null) return y(); !n && !/^https?:\/\//.test(e) && c && (e = e.indexOf(".js") === -1 ? c + e + ".js" : c + e); if (l[e]) return o && (a[o] = 1), l[e] == 2 ? y() : setTimeout(function () { t(e, !0) }, 0); l[e] = 1, o && (a[o] = 1), m(e, y) }) }, 0), v } function m(n, r) { var i = e.createElement("script"), u; i.onload = i.onerror = i[o] = function () { if (i[s] && !/^c|loade/.test(i[s]) || u) return; i.onload = i[o] = null, u = 1, l[n] = 2, r() }, i.async = 1, i.src = h ? n + (n.indexOf("?") === -1 ? "?" : "&") + h : n, t.insertBefore(i, t.lastChild) } var e = document, t = e.getElementsByTagName("head")[0], n = "string", r = !1, i = "push", s = "readyState", o = "onreadystatechange", u = {}, a = {}, f = {}, l = {}, c, h; return v.get = m, v.order = function (e, t, n) { (function r(i) { i = e.shift(), e.length ? v(i, r) : v(i, t, n) })() }, v.path = function (e) { c = e }, v.urlArgs = function (e) { h = e }, v.ready = function (e, t, n) { e = e[i] ? e : [e]; var r = []; return !d(e, function (e) { u[e] || r[i](e) }) && p(e, function (e) { return u[e] }) ? t() : !function (e) { f[e] = f[e] || [], f[e][i](t), n && n(r) }(e.join("|")), v }, v.done = function (e) { v([null], e) }, v })

var domIsReady = (function (domIsReady) {
    var isBrowserIeOrNot = function () {
        return (!document.attachEvent || typeof document.attachEvent === "undefined" ? 'not-ie' : 'ie');
    };

    domIsReady = function (callback) {
        if (callback && typeof callback === 'function') {
            if (isBrowserIeOrNot() !== 'ie') {
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
            console.error('The callback is not a function!');
        }
    };

    return domIsReady;
})(domIsReady || {});

(function (document, window, domIsReady, undefined) {
    window.on = window.Onic = window.Onic === undefined ? {} : window.Onic;
    on.init = function OnInit(bundle) {
        return Object.create(this.bundle[bundle]);
    };
    on.bundle = on.bundle === undefined ? {} : on.bundle;
    var _app = document.getElementById('on-app'),
        _isSalonNick = _app.classList.contains('salon-nick'),
        _isEnglish = document.documentElement.lang == 'en';

    function ajax_get_json(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                try {
                    var data = JSON.parse(xmlhttp.responseText);
                    callback(data);
                } catch (err) {
                    console.warn(err.message + " in " + xmlhttp.responseText);
                    return;
                }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function objSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function registerListener(event, func) {
        if (window.addEventListener) {
            window.addEventListener(event, func);
        } else {
            window.attachEvent('on' + event, func);
        }
    }

    domIsReady(function () {
        registerListener('load', init);
        var galleryCardInDOMById = {};
        function init() {
            setDynamicContent();
            nav_button.addEventListener('click', on_nav_button);
            lazyLoad();
            closeLoader(function closeLoader_callback() {
                set_store_hours();
                set_card_nav_listeners();
            });
            registerListener('resize', onResize);

            // var cards = document.getElementsByClassName('card');
            // for (var i = 0; i < cards.length; i++) {
            //     var card = cards[i];
            //     galleryCardInDOMById[cardsCurrentGroup] = galleryCardInDOMById[cardsCurrentGroup] || [];
            //     // galleryCardInDOMById[cardsCurrentGroup][i + 1] = card.id;
            //     galleryCardInDOMById[cardsCurrentGroup].push(card.id);
            //     // gallery_cards_in_dom.push(card.id);
            // }
            cards_set_listeners();
        }

        /*------------------------------------
        Onic | Info Bar
        --------------------------------------*/
        var _infoBar = document.getElementById('tag-aside-info-bar'),
            _infoBarMainMsg, _infoBarArrow, _infoBarBody, _infoBarBodyHeight, _infoBarCloseBtn;

        if (_infoBar) {
            _infoBarMainMsg = document.getElementById('info-bar-msg'),
                _infoBarArrow = document.getElementById('info-bar-arrow'),
                _infoBarBody = document.getElementById('info-bar-body'),
                _infoBarBodyHeight = _infoBarBody.offsetHeight,
                _infoBarCloseBtn = document.getElementById('close-info-bar');

            var _infoBarOpen = false;
            _infoBarMainMsg.addEventListener('click', function () {
                if (!_infoBarOpen) {
                    _infoBarOpen = true;
                    setNavPosition(true);
                    _infoBarArrow.className += ' hide';
                    _infoBar.style.height = _infoBarBodyHeight + 45 + 'px';
                    _infoBarOpen = true;
                    return;
                }
                _infoBarArrow.className = _infoBarArrow.className.replace(" hide", "");
                _infoBar.style.height = '45px';
                _infoBarOpen = false;
                setNavPosition(true);
            })

            _infoBarCloseBtn.addEventListener('click', function () {
                _infoBarArrow.className = _infoBarArrow.className.replace(" hide", "");
                _infoBar.style.height = '45px';
                _infoBarOpen = false;
                setNavPosition(true);
            })
        }

        //#region Dynamic Content
        /**
         * Set dynamic copyright year.
         */
        function setCopyrightYear() {
            var copyrightYearElem = document.getElementById('copyrightYear');
            var now = new Date();
            // Test if element exist (guard against thrown errors).
            if (copyrightYearElem) {
                copyrightYearElem.textContent = (now.getFullYear());
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
        var _headerTop = document.getElementById('tag-sec-navTop'),
            _navSection = document.getElementById('tag-sec-nav');

        var _headerTopHeight = _headerTop.offsetHeight,
            _navSectionPosition = 0;

        function setNavPosition(infoBarOpening) {
            _navSectionPosition = _headerTopHeight + (_infoBar ? _infoBarOpen ? _infoBarBodyHeight + 45 : 45 : 0);

            if (currentScrollPosition > _navSectionPosition && !infoBarOpening) return;
            if (infoBarOpening) { _navSection.classList.add('infoBarOpening'); }
            if (!infoBarOpening && _navSection.classList.contains('infoBarOpening')) { _navSection.classList.remove('infoBarOpening'); }
            _navSection.style.transform = 'translateY(' + _navSectionPosition + 'px)';
        }

        var nav_button = document.getElementById('btn-nav'),
            nav_is_open = false;

        function on_nav_button() {
            return nav_is_open ? close_nav() : open_nav();
        }

        var nav_element = document.getElementById('tag-nav');
        var navOverlay = document.getElementById('nav-modal-overlay');
        navOverlay.addEventListener('click', close_nav);
        function open_nav() {

            // navOverlay.classList.add('on-nav');
            nav_element.classList.add('open');
            navOverlay.classList.add('nav-overlay-open');
            nav_button.classList.add('open');
            nav_is_open = true;
        }

        function close_nav() {
            nav_element.classList.remove('open');
            navOverlay.classList.remove('nav-overlay-open');
            nav_button.classList.remove('open');
            nav_is_open = false;
        }


        /*------------------------------------
        Close Loader
        --------------------------------------*/
        var close_button;
        function closeLoader(callBack) {
            var aside = document.getElementById('aside-load');
            aside.style.cssText = 'background: #fff; left: 50%; position: fixed; top: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0.9); transition: all 0.6s ease-in-out; width: 100%; z-index: 0;';

            if (close_button != undefined) {
                close_button.style.opacity = 0;
                close_button.removeEventListener('click', closeLoader);
                return;
            };
            if (callBack != undefined) return callBack();
        }

        /*------------------------------------
        Modal
        --------------------------------------*/
        var modal = document.getElementById('aside-modal');
        modal.querySelector('.close').addEventListener('click', modal_close);
        var overlay = document.getElementById('aside-modal-overlay')
        overlay.addEventListener('click', modal_close);
        function modal_open() {
            modal.classList.add('aside-modal-open');
            overlay.classList.add('aside-modal-overlay-open');
        }

        function modal_close() {
            // var modal = document.getElementById('aside-modal');
            // modal.querySelector('.close').removeEventListener('click', modal_close);

            // var overlay = document.getElementById('aside-modal-overlay')
            // overlay.removeEventListener('click', modal_close);
            modal.classList.remove('aside-modal-open');
            overlay.classList.remove('aside-modal-overlay-open');
        }

        /*------------------------------------
        Get Store Info - Set Hours
        --------------------------------------*/

        var tree_nick = 'assets/data/salon_nick/',
            tree_nick_101 = 'assets/data/nick_101/',
            store_file = 'store-info.json',
            store_json = _isEnglish ? _isSalonNick ? tree_nick + store_file : '../' + tree_nick_101 + store_file : _isSalonNick ? '../' + tree_nick + 'fr/' + store_file : '../../' + tree_nick_101 + 'fr/' + store_file;

        function getState(currentHour, open, close) {
            var h = currentHour,
                _e = 'early',
                _c = 'closed',
                state = open === -1 ? _c : open === -2 ? h < 18 && h >= 9 ? 'special' : h < 9 ? _e : _c : h < open ? _e : h > close ? _c : h >= open && h < close ? "open" : _c;

            return state;
        }

        function is_today(today, days) {
            var firstDay = parseInt(days[0]),
                lastDay = parseInt(days[2]),
                TExtra = days.indexOf('+') >= 0,
                Return = false;

            if (TExtra) {
                var _EDay = parseInt(days[4]);
                Return = today === _EDay ? true : false;
            }
            return today >= firstDay && today <= lastDay ? true : TExtra ? Return : false;
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
                        today = obj.day == day ? true : typeof obj.day === 'string' ? is_today(day, obj.day) : false;

                    if (today) {
                        var state = getState(hour, obj.open, obj.close),
                            lang = _isEnglish ? 'en' : 'fr',
                            tObj = obj[lang][state],
                            text = tObj.indexOf('oN.') >= 0 ? hours.content[lang][tObj.substring(3)] : tObj;
                        var node_hours = document.getElementById('ifOpen');
                        node_hours.textContent = text;
                        node_hours.style.opacity = '1';
                        document.getElementById('imgClock').classList.toggle('hide');
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
            _pi = 'assets/img/',
            _fireStore = 'https://firebasestorage.googleapis.com/v0/b/salon-nick.appspot.com/o/public%2Fgallery%2Fthumbnails%2F';

        function lazyLoad() {
            lazy = document.getElementsByClassName('lazyImg');
            for (var i = 0; i < lazy.length; i++) {
                if (lazy[i].getAttribute('data-src') && isInViewport(lazy[i])) {
                    var _src = lazy[i].getAttribute('data-src'),
                        _isFromServer = _src.indexOf('服务器|') > -1,
                        _path = _isFromServer ? _fireStore + _src.substring(4) : _isEnglish ? _isSalonNick ? _pi + _src : '../' + _pi + _src : _isSalonNick ? '../' + _pi + _src : '../../' + _pi + _src;

                    lazy[i].src = _path;
                    lazy[i].removeAttribute('data-src');
                }
            }
            cleanLazy();
        }

        function cleanLazy() {
            lazy = Array.prototype.filter.call(lazy, function (l) { return l.getAttribute('data-src'); });
        }

        function isInViewport(el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        /*------------------------------------
        OnScroll
        --------------------------------------*/
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        var currentScrollPosition = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop,
            lastKnownScrollPosition = 0,
            ticking = !1;

        registerListener('scroll', onScroll, { passive: !0 });
        function onScroll(e) {
            // var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
            var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
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

            var __possibleNavPosition = Math.round(_navSectionPosition - currentScrollPosition),
                __navPositionGoingUp = 0;

            if (_navSection.classList.contains('infoBarOpening')) {
                _navSection.classList.remove('infoBarOpening');
            }

            if (__goingDown) {
                _navSection.style.transform = 'translateY(' + (__belowTopInfo ? 0 : __possibleNavPosition) + 'px' + ')';
            }
            if (!__goingDown && !__belowTopInfo) {
                __navPositionGoingUp = (lastKnownScrollPosition < 2.00 ? _navSectionPosition : __possibleNavPosition);
                _navSection.style.transform = 'translateY(' + __navPositionGoingUp + 'px)';
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
                    _infoBar.style.height = _infoBarBodyHeight + 45 + 'px';
                }
            }
            _headerTopHeight = _headerTop.offsetHeight;
            setNavPosition();
            _resizeTicking = !1;
        }

        /*------------------------------------
        Show/Hide Gallery Cards + Show card image on click
        --------------------------------------*/
        function set_card_nav_listeners() {
            var nav_items = document.getElementsByClassName('nav-item');
            for (var i = 0; i < nav_items.length; i++) {
                var nav_item = nav_items[i];
                nav_item.addEventListener('click', cards_navigate);
            }
        }

        var cardsCurrentGroup = 'pretty-princess',
            cards_fragment,
            cards_fragment_children = [];

        function cards_navigate() {
            var _toSection = this.getAttribute('data-show');
            if (_toSection === cardsCurrentGroup) { return }
            document.getElementById('nI-' + cardsCurrentGroup).classList.remove('active');
            document.getElementById('nI-' + _toSection).classList.add('active');
            cards_remove_listeners(function () {
                cardsCurrentGroup = _toSection;
                cards_remove(function () {
                    gallery_cards_get(_toSection, function () {
                        cards_set_listeners();
                        card_show();
                    });
                });
            });
        }

        function cards_set_listeners(callback) {
            var _cards = document.getElementsByClassName('card');
            for (var i = 0; i < _cards.length; i++) {
                var card = _cards[i];
                galleryCardInDOMById[cardsCurrentGroup] = galleryCardInDOMById[cardsCurrentGroup] || [];
                galleryCardInDOMById[cardsCurrentGroup].push(card.id);

                if (boundImgListeners.has(card.id)) {
                    document.getElementById(card.id).addEventListener('click', boundImgListeners.get(card.id));
                    continue;
                }
                boundImgListeners.set(card.id, gallery_card_getShow_img.bind(null, cardsCurrentGroup, (i + 1)));
                document.getElementById(card.id).addEventListener('click', boundImgListeners.get(card.id));
            }
            return typeof callback === 'function' ? callback() : null;
        }
        function cards_remove_listeners(callBack) {
            var _cards = document.getElementsByClassName('card');
            for (var i = 0; i < _cards.length; i++) {
                var card = _cards[i];
                document.getElementById(card.id).removeEventListener('click', boundImgListeners.get(card.id));
            }
            return typeof callBack === 'function' ? callBack() : null;
        }

        var cardsRemoveTimeout;
        function cards_remove(callback) {
            var _cards = document.getElementsByClassName('card');
            for (var i = 0; i < _cards.length; i++) {
                var card = _cards[i];
                document.getElementById(card.id).classList.add('hide');
            }
            if (typeof cardsRemoveTimeout === 'number') {
                window.clearTimeout(cardsRemoveTimeout);
            }
            cardsRemoveTimeout = setTimeout(function () {
                document.getElementById('cards-section').innerHTML = '<div class="clear"></div>';
                return typeof callback === 'function' ? callback() : null;
            }, 350)
        }

        var galleryThumbTokensLoaded = false,
            galleryThumbTokens;
        function gallery_cards_get(gallerySection, callback) {
            var _jsonfile_fire = 'https://firebasestorage.googleapis.com/v0/b/salon-nick.appspot.com/o/public%2Fdata%2Fgallery-thumb-loc.json?alt=media&token=29825339-5100-4dd9-8846-54caaedd3c17';
            var _jsonfile = 'https://api.myjson.com/bins/1aineg';
            var _root = _isEnglish ? '../' : '../../',
                _path = _root + 'assets/data/nick_101/gallery-thumb-loc.json';
            if (!galleryThumbTokensLoaded) {
                ajax_get_json(_path, function (json) {
                    galleryThumbTokens = json;
                    gallery_cards_make(gallerySection, callback);
                })
            } else {
                gallery_cards_make(gallerySection, callback);
            }
        }

        var boundImgListeners = new Map;
        function gallery_cards_make(gallerySection, callback) {
            cards_fragment = cards_fragment || document.createDocumentFragment();
            var gallery_group_tokens = galleryThumbTokens[gallerySection];

            for (var key in gallery_group_tokens) {
                if (!gallery_group_tokens.hasOwnProperty(key)) continue;
                var token = gallery_group_tokens[key];

                var div = document.createElement('div'),
                    img = document.createElement('img');

                div.classList.add('card', 'hide');
                div.setAttribute('id', gallerySection + '-' + key + '-copy');
                div.setAttribute('data-show', gallerySection);
                div.innerHTML = '<div class="content"></div>';

                var _imgSrc = 'https://firebasestorage.googleapis.com/v0/b/salon-nick.appspot.com/o/public%2Fgallery%2Fthumbnails%2F' + gallerySection + '%2F' + key + '.jpg?alt=media&token=' + token;
                img.src = _imgSrc;

                div.querySelector('.content').appendChild(img);

                cards_fragment.appendChild(div);
                cards_fragment_children.push(gallerySection + '-' + key + '-copy');
            }
            var cards_section = document.getElementById('cards-section');
            cards_section.insertBefore(cards_fragment, cards_section.childNodes[0]);
            return typeof callback === 'function' ? callback() : null;
        }

        var cardsShowTimeout;
        function card_show() {
            if (typeof cardsShowTimeout === 'number') {
                window.clearTimeout(cardsShowTimeout);
            }
            cardsShowTimeout = setTimeout(function () {
                var _cards = document.getElementsByClassName('card');
                for (var i = 0; i < _cards.length; i++) {
                    _cards[i].classList.remove('hide');
                }
            }, 300)
        }

        var galleryLocationsLoaded = false,
            galleryImgLocations,
            _size = {},
            currentImgCat = '',
            currentImgKey;

        function gallery_card_getShow_img(navigateTo, key) {
            var _root = _isEnglish ? '../' : '../../',
                _path = _root + 'assets/data/nick_101/gallery-comp-loc.json';
            currentImgCat = navigateTo;
            currentImgKey = parseInt(key);

            // Show galley modal, remove hide class.
            var galleryModal = document.getElementById('aside-modal');
            galleryModal.className = galleryModal.className.replace(' hide', '');

            // Show galley modal loader, remove hide class.
            var modalLoader = document.getElementById('modal-loader-parent');
            modalLoader.className = modalLoader.className.replace(' hide', '');

            if (!galleryLocationsLoaded) {
                galleryLocationsLoaded = true;
                ajax_get_json(_path, function (res) {
                    galleryImgLocations = res;
                    show_img(navigateTo, key);
                })

                document.getElementById('next-img').addEventListener('click', function () {
                    _size[currentImgCat] = _size[currentImgCat] || objSize(galleryImgLocations[currentImgCat]);
                    if (currentImgKey === _size[currentImgCat]) {
                        gallery_card_getShow_img(currentImgCat, 1);
                        return;
                    }
                    gallery_card_getShow_img(currentImgCat, (currentImgKey + 1));
                })
                document.getElementById('back-img').addEventListener('click', function () {
                    _size[currentImgCat] = _size[currentImgCat] || objSize(galleryImgLocations[currentImgCat]);
                    if (currentImgKey === 1) {
                        gallery_card_getShow_img(currentImgCat, _size[currentImgCat]);
                        return;
                    }
                    gallery_card_getShow_img(currentImgCat, (currentImgKey - 1));
                })
            } else {
                show_img(navigateTo, key);
            }
        }

        function show_img(navigateTo, key) {
            var token = galleryImgLocations[navigateTo][key];
            var imageSource = 'https://firebasestorage.googleapis.com/v0/b/salon-nick.appspot.com/o/public%2Fgallery%2Fcomputer%2F' + navigateTo + '%2F' + key + '.jpg?alt=media&token=' + token;
            var galleryModal = document.getElementById('aside-modal'),
                galleryModalImageElement = galleryModal.querySelector('img');

            galleryModalImageElement.onload = function () {
                // Hide galley modal loader, remove hide class.
                var modalLoader = document.getElementById('modal-loader-parent');
                modalLoader.className += ' hide';
            }
            modal_open();
            galleryModalImageElement.src = imageSource;
        }
    })
}(document, window, window.domIsReady));