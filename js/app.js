(() => {
  "use strict";
  class e {
    constructor(e) {
      let t = {
        logging: !0,
        init: !0,
        attributeOpenButton: "data-popup",
        attributeCloseButton: "data-close",
        fixElementSelector: "[data-lp]",
        youtubeAttribute: "data-youtube",
        youtubePlaceAttribute: "data-youtube-place",
        setAutoplayYoutube: !0,
        classes: {
          popup: "popup",
          popupContent: "popup__content",
          popupActive: "popup_show",
          bodyActive: "popup-show",
        },
        focusCatch: !0,
        closeEsc: !0,
        bodyLock: !0,
        bodyLockDelay: 500,
        hashSettings: { location: !0, goHash: !0 },
        on: {
          beforeOpen: function () {},
          afterOpen: function () {},
          beforeClose: function () {},
          afterClose: function () {},
        },
      };
      (this.isOpen = !1),
        (this.targetOpen = { selector: !1, element: !1 }),
        (this.previousOpen = { selector: !1, element: !1 }),
        (this.lastClosed = { selector: !1, element: !1 }),
        (this._dataValue = !1),
        (this.hash = !1),
        (this._reopen = !1),
        (this._selectorOpen = !1),
        (this.lastFocusEl = !1),
        (this._focusEl = [
          "a[href]",
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
          "button:not([disabled]):not([aria-hidden])",
          "select:not([disabled]):not([aria-hidden])",
          "textarea:not([disabled]):not([aria-hidden])",
          "area[href]",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex^="-"])',
        ]),
        (this.options = {
          ...t,
          ...e,
          classes: { ...t.classes, ...e?.classes },
          hashSettings: { ...t.hashSettings, ...e?.hashSettings },
          on: { ...t.on, ...e?.on },
        }),
        this.options.init && this.initPopups();
    }
    initPopups() {
      this.popupLogging("Проснулся"), this.eventsPopup();
    }
    eventsPopup() {
      document.addEventListener(
        "click",
        function (e) {
          const t = e.target.closest(`[${this.options.attributeOpenButton}]`);
          if (t)
            return (
              e.preventDefault(),
              (this._dataValue = t.getAttribute(
                this.options.attributeOpenButton
              )
                ? t.getAttribute(this.options.attributeOpenButton)
                : "error"),
              "error" !== this._dataValue
                ? (this.isOpen || (this.lastFocusEl = t),
                  (this.targetOpen.selector = `${this._dataValue}`),
                  (this._selectorOpen = !0),
                  void this.open())
                : void this.popupLogging(
                    `Ой ой, не заполнен атрибут у ${t.classList}`
                  )
            );
          return e.target.closest(`[${this.options.attributeCloseButton}]`) ||
            (!e.target.closest(`.${this.options.classes.popupContent}`) &&
              this.isOpen)
            ? (e.preventDefault(), void this.close())
            : void 0;
        }.bind(this)
      ),
        document.addEventListener(
          "keydown",
          function (e) {
            if (
              this.options.closeEsc &&
              27 == e.which &&
              "Escape" === e.code &&
              this.isOpen
            )
              return e.preventDefault(), void this.close();
            this.options.focusCatch &&
              9 == e.which &&
              this.isOpen &&
              this._focusCatch(e);
          }.bind(this)
        ),
        document.querySelector("form[data-ajax],form[data-dev]") &&
          document.addEventListener(
            "formSent",
            function (e) {
              const t = e.detail.form.dataset.popupMessage;
              t && this.open(t);
            }.bind(this)
          ),
        this.options.hashSettings.goHash &&
          (window.addEventListener(
            "hashchange",
            function () {
              window.location.hash
                ? this._openToHash()
                : this.close(this.targetOpen.selector);
            }.bind(this)
          ),
          window.addEventListener(
            "load",
            function () {
              window.location.hash && this._openToHash();
            }.bind(this)
          ));
    }
    open(e) {
      if (
        (e &&
          "string" == typeof e &&
          "" !== e.trim() &&
          ((this.targetOpen.selector = e), (this._selectorOpen = !0)),
        this.isOpen && ((this._reopen = !0), this.close()),
        this._selectorOpen ||
          (this.targetOpen.selector = this.lastClosed.selector),
        this._reopen || (this.previousActiveElement = document.activeElement),
        (this.targetOpen.element = document.querySelector(
          this.targetOpen.selector
        )),
        this.targetOpen.element)
      ) {
        if (
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
        ) {
          const e = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
              this.options.youtubeAttribute
            )}?rel=0&showinfo=0&autoplay=1`,
            t = document.createElement("iframe");
          t.setAttribute("allowfullscreen", "");
          const s = this.options.setAutoplayYoutube ? "autoplay;" : "";
          t.setAttribute("allow", `${s}; encrypted-media`),
            t.setAttribute("src", e),
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
              this.targetOpen.element
                .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                .appendChild(t);
        }
        this.options.hashSettings.location &&
          (this._getHash(), this._setHash()),
          this.options.on.beforeOpen(this),
          this.targetOpen.element.classList.add(
            this.options.classes.popupActive
          ),
          document.body.classList.add(this.options.classes.bodyActive),
          this._reopen ? (this._reopen = !1) : i(),
          this.targetOpen.element.setAttribute("aria-hidden", "false"),
          (this.previousOpen.selector = this.targetOpen.selector),
          (this.previousOpen.element = this.targetOpen.element),
          (this._selectorOpen = !1),
          (this.isOpen = !0),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          document.dispatchEvent(
            new CustomEvent("afterPopupOpen", { detail: { popup: this } })
          ),
          this.popupLogging("Открыл попап");
      } else
        this.popupLogging(
          "Ой ой, такого попапа нет. Проверьте корректность ввода. "
        );
    }
    close(e) {
      e &&
        "string" == typeof e &&
        "" !== e.trim() &&
        (this.previousOpen.selector = e),
        this.isOpen &&
          s &&
          (this.options.on.beforeClose(this),
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
            (this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ).innerHTML = ""),
          this.previousOpen.element.classList.remove(
            this.options.classes.popupActive
          ),
          this.previousOpen.element.setAttribute("aria-hidden", "true"),
          this._reopen ||
            (document.body.classList.remove(this.options.classes.bodyActive),
            i(),
            (this.isOpen = !1)),
          this._removeHash(),
          this._selectorOpen &&
            ((this.lastClosed.selector = this.previousOpen.selector),
            (this.lastClosed.element = this.previousOpen.element)),
          this.options.on.afterClose(this),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          this.popupLogging("Закрыл попап"));
    }
    _getHash() {
      this.options.hashSettings.location &&
        (this.hash = this.targetOpen.selector.includes("#")
          ? this.targetOpen.selector
          : this.targetOpen.selector.replace(".", "#"));
    }
    _openToHash() {
      let e = document.querySelector(
        `.${window.location.hash.replace("#", "")}`
      )
        ? `.${window.location.hash.replace("#", "")}`
        : document.querySelector(`${window.location.hash}`)
        ? `${window.location.hash}`
        : null;
      document.querySelector(`[${this.options.attributeOpenButton}="${e}"]`) &&
        e &&
        this.open(e);
    }
    _setHash() {
      history.pushState("", "", this.hash);
    }
    _removeHash() {
      history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
      const t = this.targetOpen.element.querySelectorAll(this._focusEl),
        s = Array.prototype.slice.call(t),
        i = s.indexOf(document.activeElement);
      e.shiftKey && 0 === i && (s[s.length - 1].focus(), e.preventDefault()),
        e.shiftKey || i !== s.length - 1 || (s[0].focus(), e.preventDefault());
    }
    _focusTrap() {
      const e = this.previousOpen.element.querySelectorAll(this._focusEl);
      !this.isOpen && this.lastFocusEl
        ? this.lastFocusEl.focus()
        : e[0].focus();
    }
    popupLogging(e) {
      this.options.logging && a(`[Попапос]: ${e}`);
    }
  }
  let t = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        t.Android() || t.BlackBerry() || t.iOS() || t.Opera() || t.Windows()
      );
    },
  };
  let s = !0,
    i = (e = 500) => {
      document.documentElement.classList.contains("lock") ? r(e) : n(e);
    },
    r = (e = 500) => {
      let t = document.querySelector("body");
      if (s) {
        let i = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          for (let e = 0; e < i.length; e++) {
            i[e].style.paddingRight = "0px";
          }
          (t.style.paddingRight = "0px"),
            document.documentElement.classList.remove("lock");
        }, e),
          (s = !1),
          setTimeout(function () {
            s = !0;
          }, e);
      }
    },
    n = (e = 500) => {
      let t = document.querySelector("body");
      if (s) {
        let i = document.querySelectorAll("[data-lp]");
        for (let e = 0; e < i.length; e++) {
          i[e].style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        }
        (t.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px"),
          document.documentElement.classList.add("lock"),
          (s = !1),
          setTimeout(function () {
            s = !0;
          }, e);
      }
    };
  function a(e) {
    setTimeout(() => {
      window.FLS && console.log(e);
    }, 0);
  }
  let o = (e, t = !1, s = 500, i = 0) => {
    const n = document.querySelector(e);
    if (n) {
      let o = "",
        l = 0;
      t &&
        ((o = "header.header"), (l = document.querySelector(o).offsetHeight));
      let d = {
        speedAsDuration: !0,
        speed: s,
        header: o,
        offset: i,
        easing: "easeOutQuad",
      };
      if (
        (document.documentElement.classList.contains("menu-open") &&
          (r(), document.documentElement.classList.remove("menu-open")),
        "undefined" != typeof SmoothScroll)
      )
        new SmoothScroll().animateScroll(n, "", d);
      else {
        let e = n.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: l ? e - l : e, behavior: "smooth" });
      }
      a(`[gotoBlock]: Юхуу...едем к ${e}`);
    } else a(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${e}`);
  };
  const l = { inputMaskModule: null, selectModule: null };
  let d = {
    getErrors(e) {
      let t = 0,
        s = e.querySelectorAll("*[data-required]");
      return (
        s.length &&
          s.forEach((e) => {
            (null === e.offsetParent && "SELECT" !== e.tagName) ||
              e.disabled ||
              (t += this.validateInput(e));
          }),
        t
      );
    },
    validateInput(e) {
      let t = 0;
      return (
        "email" === e.dataset.required
          ? ((e.value = e.value.replace(" ", "")),
            this.emailTest(e) ? (this.addError(e), t++) : this.removeError(e))
          : "checkbox" !== e.type || e.checked
          ? e.value
            ? e.classList.remove("form-footer__input_error")
            : (e.classList.add("form-footer__input_error"), t++)
          : (this.addError(e), t++),
        t
      );
    },
    addError(e) {
      e.classList.add("_form-error"),
        e.parentElement.classList.add("_form-error");
      let t = e.parentElement.querySelector(".form__error");
      t && e.parentElement.removeChild(t),
        e.dataset.error &&
          e.parentElement.insertAdjacentHTML(
            "beforeend",
            `<div class="form__error">${e.dataset.error}</div>`
          );
    },
    removeError(e) {
      e.classList.remove("_form-error"),
        e.parentElement.classList.remove("_form-error"),
        e.parentElement.querySelector(".form__error") &&
          e.parentElement.removeChild(
            e.parentElement.querySelector(".form__error")
          );
    },
    formClean(e) {
      e.reset(),
        setTimeout(() => {
          let t = e.querySelectorAll("input,textarea");
          for (let e = 0; e < t.length; e++) {
            const s = t[e];
            s.parentElement.classList.remove("_form-focus"),
              s.classList.remove("_form-focus"),
              d.removeError(s);
          }
          let s = e.querySelectorAll(".checkbox__input");
          if (s.length > 0)
            for (let e = 0; e < s.length; e++) {
              s[e].checked = !1;
            }
          if (l.selectModule) {
            let t = e.querySelectorAll(".select");
            if (t.length)
              for (let e = 0; e < t.length; e++) {
                const s = t[e].querySelector("select");
                l.selectModule.selectBuild(s);
              }
          }
        }, 0);
    },
    emailTest: (e) =>
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(e.value),
  };
  function c(e) {
    return (
      null !== e &&
      "object" == typeof e &&
      "constructor" in e &&
      e.constructor === Object
    );
  }
  function p(e = {}, t = {}) {
    Object.keys(t).forEach((s) => {
      void 0 === e[s]
        ? (e[s] = t[s])
        : c(t[s]) && c(e[s]) && Object.keys(t[s]).length > 0 && p(e[s], t[s]);
    });
  }
  const u = {
    body: {},
    addEventListener() {},
    removeEventListener() {},
    activeElement: { blur() {}, nodeName: "" },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createEvent: () => ({ initEvent() {} }),
    createElement: () => ({
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName: () => [],
    }),
    createElementNS: () => ({}),
    importNode: () => null,
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
  };
  function m() {
    const e = "undefined" != typeof document ? document : {};
    return p(e, u), e;
  }
  const h = {
    document: u,
    navigator: { userAgent: "" },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
    history: { replaceState() {}, pushState() {}, go() {}, back() {} },
    CustomEvent: function () {
      return this;
    },
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    Image() {},
    Date() {},
    screen: {},
    setTimeout() {},
    clearTimeout() {},
    matchMedia: () => ({}),
    requestAnimationFrame: (e) =>
      "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
    cancelAnimationFrame(e) {
      "undefined" != typeof setTimeout && clearTimeout(e);
    },
  };
  function f() {
    const e = "undefined" != typeof window ? window : {};
    return p(e, h), e;
  }
  function g(e, t = 0) {
    return setTimeout(e, t);
  }
  function v() {
    return Date.now();
  }
  function w(e, t = "x") {
    const s = f();
    let i, r, n;
    const a = (function (e) {
      const t = f();
      let s;
      return (
        t.getComputedStyle && (s = t.getComputedStyle(e, null)),
        !s && e.currentStyle && (s = e.currentStyle),
        s || (s = e.style),
        s
      );
    })(e);
    return (
      s.WebKitCSSMatrix
        ? ((r = a.transform || a.webkitTransform),
          r.split(",").length > 6 &&
            (r = r
              .split(", ")
              .map((e) => e.replace(",", "."))
              .join(", ")),
          (n = new s.WebKitCSSMatrix("none" === r ? "" : r)))
        : ((n =
            a.MozTransform ||
            a.OTransform ||
            a.MsTransform ||
            a.msTransform ||
            a.transform ||
            a
              .getPropertyValue("transform")
              .replace("translate(", "matrix(1, 0, 0, 1,")),
          (i = n.toString().split(","))),
      "x" === t &&
        (r = s.WebKitCSSMatrix
          ? n.m41
          : 16 === i.length
          ? parseFloat(i[12])
          : parseFloat(i[4])),
      "y" === t &&
        (r = s.WebKitCSSMatrix
          ? n.m42
          : 16 === i.length
          ? parseFloat(i[13])
          : parseFloat(i[5])),
      r || 0
    );
  }
  function b(e) {
    return (
      "object" == typeof e &&
      null !== e &&
      e.constructor &&
      "Object" === Object.prototype.toString.call(e).slice(8, -1)
    );
  }
  function y(...e) {
    const t = Object(e[0]),
      s = ["__proto__", "constructor", "prototype"];
    for (let r = 1; r < e.length; r += 1) {
      const n = e[r];
      if (
        null != n &&
        ((i = n),
        !("undefined" != typeof window && void 0 !== window.HTMLElement
          ? i instanceof HTMLElement
          : i && (1 === i.nodeType || 11 === i.nodeType)))
      ) {
        const e = Object.keys(Object(n)).filter((e) => s.indexOf(e) < 0);
        for (let s = 0, i = e.length; s < i; s += 1) {
          const i = e[s],
            r = Object.getOwnPropertyDescriptor(n, i);
          void 0 !== r &&
            r.enumerable &&
            (b(t[i]) && b(n[i])
              ? n[i].__swiper__
                ? (t[i] = n[i])
                : y(t[i], n[i])
              : !b(t[i]) && b(n[i])
              ? ((t[i] = {}), n[i].__swiper__ ? (t[i] = n[i]) : y(t[i], n[i]))
              : (t[i] = n[i]));
        }
      }
    }
    var i;
    return t;
  }
  function S(e, t, s) {
    e.style.setProperty(t, s);
  }
  function T({ swiper: e, targetPosition: t, side: s }) {
    const i = f(),
      r = -e.translate;
    let n,
      a = null;
    const o = e.params.speed;
    (e.wrapperEl.style.scrollSnapType = "none"),
      i.cancelAnimationFrame(e.cssModeFrameID);
    const l = t > r ? "next" : "prev",
      d = (e, t) => ("next" === l && e >= t) || ("prev" === l && e <= t),
      c = () => {
        (n = new Date().getTime()), null === a && (a = n);
        const l = Math.max(Math.min((n - a) / o, 1), 0),
          p = 0.5 - Math.cos(l * Math.PI) / 2;
        let u = r + p * (t - r);
        if ((d(u, t) && (u = t), e.wrapperEl.scrollTo({ [s]: u }), d(u, t)))
          return (
            (e.wrapperEl.style.overflow = "hidden"),
            (e.wrapperEl.style.scrollSnapType = ""),
            setTimeout(() => {
              (e.wrapperEl.style.overflow = ""),
                e.wrapperEl.scrollTo({ [s]: u });
            }),
            void i.cancelAnimationFrame(e.cssModeFrameID)
          );
        e.cssModeFrameID = i.requestAnimationFrame(c);
      };
    c();
  }
  function E(e, t = "") {
    return [...e.children].filter((e) => e.matches(t));
  }
  function x(e, t = []) {
    const s = document.createElement(e);
    return s.classList.add(...(Array.isArray(t) ? t : [t])), s;
  }
  function C(e, t) {
    return f().getComputedStyle(e, null).getPropertyValue(t);
  }
  function P(e) {
    let t,
      s = e;
    if (s) {
      for (t = 0; null !== (s = s.previousSibling); )
        1 === s.nodeType && (t += 1);
      return t;
    }
  }
  function L(e, t, s) {
    const i = f();
    return s
      ? e["width" === t ? "offsetWidth" : "offsetHeight"] +
          parseFloat(
            i
              .getComputedStyle(e, null)
              .getPropertyValue("width" === t ? "margin-right" : "margin-top")
          ) +
          parseFloat(
            i
              .getComputedStyle(e, null)
              .getPropertyValue("width" === t ? "margin-left" : "margin-bottom")
          )
      : e.offsetWidth;
  }
  let _, k, M;
  function A() {
    return (
      _ ||
        (_ = (function () {
          const e = f(),
            t = m();
          return {
            smoothScroll:
              t.documentElement && "scrollBehavior" in t.documentElement.style,
            touch: !!(
              "ontouchstart" in e ||
              (e.DocumentTouch && t instanceof e.DocumentTouch)
            ),
          };
        })()),
      _
    );
  }
  function O(e = {}) {
    return (
      k ||
        (k = (function ({ userAgent: e } = {}) {
          const t = A(),
            s = f(),
            i = s.navigator.platform,
            r = e || s.navigator.userAgent,
            n = { ios: !1, android: !1 },
            a = s.screen.width,
            o = s.screen.height,
            l = r.match(/(Android);?[\s\/]+([\d.]+)?/);
          let d = r.match(/(iPad).*OS\s([\d_]+)/);
          const c = r.match(/(iPod)(.*OS\s([\d_]+))?/),
            p = !d && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
            u = "Win32" === i;
          let m = "MacIntel" === i;
          return (
            !d &&
              m &&
              t.touch &&
              [
                "1024x1366",
                "1366x1024",
                "834x1194",
                "1194x834",
                "834x1112",
                "1112x834",
                "768x1024",
                "1024x768",
                "820x1180",
                "1180x820",
                "810x1080",
                "1080x810",
              ].indexOf(`${a}x${o}`) >= 0 &&
              ((d = r.match(/(Version)\/([\d.]+)/)),
              d || (d = [0, 1, "13_0_0"]),
              (m = !1)),
            l && !u && ((n.os = "android"), (n.android = !0)),
            (d || p || c) && ((n.os = "ios"), (n.ios = !0)),
            n
          );
        })(e)),
      k
    );
  }
  function I() {
    return (
      M ||
        (M = (function () {
          const e = f();
          let t = !1;
          function s() {
            const t = e.navigator.userAgent.toLowerCase();
            return (
              t.indexOf("safari") >= 0 &&
              t.indexOf("chrome") < 0 &&
              t.indexOf("android") < 0
            );
          }
          if (s()) {
            const s = String(e.navigator.userAgent);
            if (s.includes("Version/")) {
              const [e, i] = s
                .split("Version/")[1]
                .split(" ")[0]
                .split(".")
                .map((e) => Number(e));
              t = e < 16 || (16 === e && i < 2);
            }
          }
          return {
            isSafari: t || s(),
            needPerspectiveFix: t,
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
              e.navigator.userAgent
            ),
          };
        })()),
      M
    );
  }
  const z = {
    on(e, t, s) {
      const i = this;
      if (!i.eventsListeners || i.destroyed) return i;
      if ("function" != typeof t) return i;
      const r = s ? "unshift" : "push";
      return (
        e.split(" ").forEach((e) => {
          i.eventsListeners[e] || (i.eventsListeners[e] = []),
            i.eventsListeners[e][r](t);
        }),
        i
      );
    },
    once(e, t, s) {
      const i = this;
      if (!i.eventsListeners || i.destroyed) return i;
      if ("function" != typeof t) return i;
      function r(...s) {
        i.off(e, r), r.__emitterProxy && delete r.__emitterProxy, t.apply(i, s);
      }
      return (r.__emitterProxy = t), i.on(e, r, s);
    },
    onAny(e, t) {
      const s = this;
      if (!s.eventsListeners || s.destroyed) return s;
      if ("function" != typeof e) return s;
      const i = t ? "unshift" : "push";
      return (
        s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[i](e), s
      );
    },
    offAny(e) {
      const t = this;
      if (!t.eventsListeners || t.destroyed) return t;
      if (!t.eventsAnyListeners) return t;
      const s = t.eventsAnyListeners.indexOf(e);
      return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
    },
    off(e, t) {
      const s = this;
      return !s.eventsListeners || s.destroyed
        ? s
        : s.eventsListeners
        ? (e.split(" ").forEach((e) => {
            void 0 === t
              ? (s.eventsListeners[e] = [])
              : s.eventsListeners[e] &&
                s.eventsListeners[e].forEach((i, r) => {
                  (i === t || (i.__emitterProxy && i.__emitterProxy === t)) &&
                    s.eventsListeners[e].splice(r, 1);
                });
          }),
          s)
        : s;
    },
    emit(...e) {
      const t = this;
      if (!t.eventsListeners || t.destroyed) return t;
      if (!t.eventsListeners) return t;
      let s, i, r;
      "string" == typeof e[0] || Array.isArray(e[0])
        ? ((s = e[0]), (i = e.slice(1, e.length)), (r = t))
        : ((s = e[0].events), (i = e[0].data), (r = e[0].context || t)),
        i.unshift(r);
      return (
        (Array.isArray(s) ? s : s.split(" ")).forEach((e) => {
          t.eventsAnyListeners &&
            t.eventsAnyListeners.length &&
            t.eventsAnyListeners.forEach((t) => {
              t.apply(r, [e, ...i]);
            }),
            t.eventsListeners &&
              t.eventsListeners[e] &&
              t.eventsListeners[e].forEach((e) => {
                e.apply(r, i);
              });
        }),
        t
      );
    },
  };
  const G = {
    updateSize: function () {
      const e = this;
      let t, s;
      const i = e.el;
      (t =
        void 0 !== e.params.width && null !== e.params.width
          ? e.params.width
          : i.clientWidth),
        (s =
          void 0 !== e.params.height && null !== e.params.height
            ? e.params.height
            : i.clientHeight),
        (0 === t && e.isHorizontal()) ||
          (0 === s && e.isVertical()) ||
          ((t =
            t -
            parseInt(C(i, "padding-left") || 0, 10) -
            parseInt(C(i, "padding-right") || 0, 10)),
          (s =
            s -
            parseInt(C(i, "padding-top") || 0, 10) -
            parseInt(C(i, "padding-bottom") || 0, 10)),
          Number.isNaN(t) && (t = 0),
          Number.isNaN(s) && (s = 0),
          Object.assign(e, {
            width: t,
            height: s,
            size: e.isHorizontal() ? t : s,
          }));
    },
    updateSlides: function () {
      const e = this;
      function t(t) {
        return e.isHorizontal()
          ? t
          : {
              width: "height",
              "margin-top": "margin-left",
              "margin-bottom ": "margin-right",
              "margin-left": "margin-top",
              "margin-right": "margin-bottom",
              "padding-left": "padding-top",
              "padding-right": "padding-bottom",
              marginRight: "marginBottom",
            }[t];
      }
      function s(e, s) {
        return parseFloat(e.getPropertyValue(t(s)) || 0);
      }
      const i = e.params,
        {
          wrapperEl: r,
          slidesEl: n,
          size: a,
          rtlTranslate: o,
          wrongRTL: l,
        } = e,
        d = e.virtual && i.virtual.enabled,
        c = d ? e.virtual.slides.length : e.slides.length,
        p = E(n, `.${e.params.slideClass}, swiper-slide`),
        u = d ? e.virtual.slides.length : p.length;
      let m = [];
      const h = [],
        f = [];
      let g = i.slidesOffsetBefore;
      "function" == typeof g && (g = i.slidesOffsetBefore.call(e));
      let v = i.slidesOffsetAfter;
      "function" == typeof v && (v = i.slidesOffsetAfter.call(e));
      const w = e.snapGrid.length,
        b = e.slidesGrid.length;
      let y = i.spaceBetween,
        T = -g,
        x = 0,
        P = 0;
      if (void 0 === a) return;
      "string" == typeof y &&
        y.indexOf("%") >= 0 &&
        (y = (parseFloat(y.replace("%", "")) / 100) * a),
        (e.virtualSize = -y),
        p.forEach((e) => {
          o ? (e.style.marginLeft = "") : (e.style.marginRight = ""),
            (e.style.marginBottom = ""),
            (e.style.marginTop = "");
        }),
        i.centeredSlides &&
          i.cssMode &&
          (S(r, "--swiper-centered-offset-before", ""),
          S(r, "--swiper-centered-offset-after", ""));
      const _ = i.grid && i.grid.rows > 1 && e.grid;
      let k;
      _ && e.grid.initSlides(u);
      const M =
        "auto" === i.slidesPerView &&
        i.breakpoints &&
        Object.keys(i.breakpoints).filter(
          (e) => void 0 !== i.breakpoints[e].slidesPerView
        ).length > 0;
      for (let r = 0; r < u; r += 1) {
        let n;
        if (
          ((k = 0),
          p[r] && (n = p[r]),
          _ && e.grid.updateSlide(r, n, u, t),
          !p[r] || "none" !== C(n, "display"))
        ) {
          if ("auto" === i.slidesPerView) {
            M && (p[r].style[t("width")] = "");
            const a = getComputedStyle(n),
              o = n.style.transform,
              l = n.style.webkitTransform;
            if (
              (o && (n.style.transform = "none"),
              l && (n.style.webkitTransform = "none"),
              i.roundLengths)
            )
              k = e.isHorizontal() ? L(n, "width", !0) : L(n, "height", !0);
            else {
              const e = s(a, "width"),
                t = s(a, "padding-left"),
                i = s(a, "padding-right"),
                r = s(a, "margin-left"),
                o = s(a, "margin-right"),
                l = a.getPropertyValue("box-sizing");
              if (l && "border-box" === l) k = e + r + o;
              else {
                const { clientWidth: s, offsetWidth: a } = n;
                k = e + t + i + r + o + (a - s);
              }
            }
            o && (n.style.transform = o),
              l && (n.style.webkitTransform = l),
              i.roundLengths && (k = Math.floor(k));
          } else
            (k = (a - (i.slidesPerView - 1) * y) / i.slidesPerView),
              i.roundLengths && (k = Math.floor(k)),
              p[r] && (p[r].style[t("width")] = `${k}px`);
          p[r] && (p[r].swiperSlideSize = k),
            f.push(k),
            i.centeredSlides
              ? ((T = T + k / 2 + x / 2 + y),
                0 === x && 0 !== r && (T = T - a / 2 - y),
                0 === r && (T = T - a / 2 - y),
                Math.abs(T) < 0.001 && (T = 0),
                i.roundLengths && (T = Math.floor(T)),
                P % i.slidesPerGroup == 0 && m.push(T),
                h.push(T))
              : (i.roundLengths && (T = Math.floor(T)),
                (P - Math.min(e.params.slidesPerGroupSkip, P)) %
                  e.params.slidesPerGroup ==
                  0 && m.push(T),
                h.push(T),
                (T = T + k + y)),
            (e.virtualSize += k + y),
            (x = k),
            (P += 1);
        }
      }
      if (
        ((e.virtualSize = Math.max(e.virtualSize, a) + v),
        o &&
          l &&
          ("slide" === i.effect || "coverflow" === i.effect) &&
          (r.style.width = `${e.virtualSize + i.spaceBetween}px`),
        i.setWrapperSize &&
          (r.style[t("width")] = `${e.virtualSize + i.spaceBetween}px`),
        _ && e.grid.updateWrapperSize(k, m, t),
        !i.centeredSlides)
      ) {
        const t = [];
        for (let s = 0; s < m.length; s += 1) {
          let r = m[s];
          i.roundLengths && (r = Math.floor(r)),
            m[s] <= e.virtualSize - a && t.push(r);
        }
        (m = t),
          Math.floor(e.virtualSize - a) - Math.floor(m[m.length - 1]) > 1 &&
            m.push(e.virtualSize - a);
      }
      if (d && i.loop) {
        const t = f[0] + y;
        if (i.slidesPerGroup > 1) {
          const s = Math.ceil(
              (e.virtual.slidesBefore + e.virtual.slidesAfter) /
                i.slidesPerGroup
            ),
            r = t * i.slidesPerGroup;
          for (let e = 0; e < s; e += 1) m.push(m[m.length - 1] + r);
        }
        for (
          let s = 0;
          s < e.virtual.slidesBefore + e.virtual.slidesAfter;
          s += 1
        )
          1 === i.slidesPerGroup && m.push(m[m.length - 1] + t),
            h.push(h[h.length - 1] + t),
            (e.virtualSize += t);
      }
      if ((0 === m.length && (m = [0]), 0 !== i.spaceBetween)) {
        const s = e.isHorizontal() && o ? "marginLeft" : t("marginRight");
        p.filter(
          (e, t) => !(i.cssMode && !i.loop) || t !== p.length - 1
        ).forEach((e) => {
          e.style[s] = `${y}px`;
        });
      }
      if (i.centeredSlides && i.centeredSlidesBounds) {
        let e = 0;
        f.forEach((t) => {
          e += t + (i.spaceBetween ? i.spaceBetween : 0);
        }),
          (e -= i.spaceBetween);
        const t = e - a;
        m = m.map((e) => (e < 0 ? -g : e > t ? t + v : e));
      }
      if (i.centerInsufficientSlides) {
        let e = 0;
        if (
          (f.forEach((t) => {
            e += t + (i.spaceBetween ? i.spaceBetween : 0);
          }),
          (e -= i.spaceBetween),
          e < a)
        ) {
          const t = (a - e) / 2;
          m.forEach((e, s) => {
            m[s] = e - t;
          }),
            h.forEach((e, s) => {
              h[s] = e + t;
            });
        }
      }
      if (
        (Object.assign(e, {
          slides: p,
          snapGrid: m,
          slidesGrid: h,
          slidesSizesGrid: f,
        }),
        i.centeredSlides && i.cssMode && !i.centeredSlidesBounds)
      ) {
        S(r, "--swiper-centered-offset-before", -m[0] + "px"),
          S(
            r,
            "--swiper-centered-offset-after",
            e.size / 2 - f[f.length - 1] / 2 + "px"
          );
        const t = -e.snapGrid[0],
          s = -e.slidesGrid[0];
        (e.snapGrid = e.snapGrid.map((e) => e + t)),
          (e.slidesGrid = e.slidesGrid.map((e) => e + s));
      }
      if (
        (u !== c && e.emit("slidesLengthChange"),
        m.length !== w &&
          (e.params.watchOverflow && e.checkOverflow(),
          e.emit("snapGridLengthChange")),
        h.length !== b && e.emit("slidesGridLengthChange"),
        i.watchSlidesProgress && e.updateSlidesOffset(),
        !(d || i.cssMode || ("slide" !== i.effect && "fade" !== i.effect)))
      ) {
        const t = `${i.containerModifierClass}backface-hidden`,
          s = e.el.classList.contains(t);
        u <= i.maxBackfaceHiddenSlides
          ? s || e.el.classList.add(t)
          : s && e.el.classList.remove(t);
      }
    },
    updateAutoHeight: function (e) {
      const t = this,
        s = [],
        i = t.virtual && t.params.virtual.enabled;
      let r,
        n = 0;
      "number" == typeof e
        ? t.setTransition(e)
        : !0 === e && t.setTransition(t.params.speed);
      const a = (e) =>
        i
          ? t.slides.filter(
              (t) =>
                parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e
            )[0]
          : t.slides[e];
      if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
        if (t.params.centeredSlides)
          (t.visibleSlides || []).forEach((e) => {
            s.push(e);
          });
        else
          for (r = 0; r < Math.ceil(t.params.slidesPerView); r += 1) {
            const e = t.activeIndex + r;
            if (e > t.slides.length && !i) break;
            s.push(a(e));
          }
      else s.push(a(t.activeIndex));
      for (r = 0; r < s.length; r += 1)
        if (void 0 !== s[r]) {
          const e = s[r].offsetHeight;
          n = e > n ? e : n;
        }
      (n || 0 === n) && (t.wrapperEl.style.height = `${n}px`);
    },
    updateSlidesOffset: function () {
      const e = this,
        t = e.slides,
        s = e.isElement
          ? e.isHorizontal()
            ? e.wrapperEl.offsetLeft
            : e.wrapperEl.offsetTop
          : 0;
      for (let i = 0; i < t.length; i += 1)
        t[i].swiperSlideOffset =
          (e.isHorizontal() ? t[i].offsetLeft : t[i].offsetTop) - s;
    },
    updateSlidesProgress: function (e = (this && this.translate) || 0) {
      const t = this,
        s = t.params,
        { slides: i, rtlTranslate: r, snapGrid: n } = t;
      if (0 === i.length) return;
      void 0 === i[0].swiperSlideOffset && t.updateSlidesOffset();
      let a = -e;
      r && (a = e),
        i.forEach((e) => {
          e.classList.remove(s.slideVisibleClass);
        }),
        (t.visibleSlidesIndexes = []),
        (t.visibleSlides = []);
      for (let e = 0; e < i.length; e += 1) {
        const o = i[e];
        let l = o.swiperSlideOffset;
        s.cssMode && s.centeredSlides && (l -= i[0].swiperSlideOffset);
        const d =
            (a + (s.centeredSlides ? t.minTranslate() : 0) - l) /
            (o.swiperSlideSize + s.spaceBetween),
          c =
            (a - n[0] + (s.centeredSlides ? t.minTranslate() : 0) - l) /
            (o.swiperSlideSize + s.spaceBetween),
          p = -(a - l),
          u = p + t.slidesSizesGrid[e];
        ((p >= 0 && p < t.size - 1) ||
          (u > 1 && u <= t.size) ||
          (p <= 0 && u >= t.size)) &&
          (t.visibleSlides.push(o),
          t.visibleSlidesIndexes.push(e),
          i[e].classList.add(s.slideVisibleClass)),
          (o.progress = r ? -d : d),
          (o.originalProgress = r ? -c : c);
      }
    },
    updateProgress: function (e) {
      const t = this;
      if (void 0 === e) {
        const s = t.rtlTranslate ? -1 : 1;
        e = (t && t.translate && t.translate * s) || 0;
      }
      const s = t.params,
        i = t.maxTranslate() - t.minTranslate();
      let { progress: r, isBeginning: n, isEnd: a, progressLoop: o } = t;
      const l = n,
        d = a;
      if (0 === i) (r = 0), (n = !0), (a = !0);
      else {
        r = (e - t.minTranslate()) / i;
        const s = Math.abs(e - t.minTranslate()) < 1,
          o = Math.abs(e - t.maxTranslate()) < 1;
        (n = s || r <= 0), (a = o || r >= 1), s && (r = 0), o && (r = 1);
      }
      if (s.loop) {
        const s = t.getSlideIndex(
            t.slides.filter(
              (e) => "0" === e.getAttribute("data-swiper-slide-index")
            )[0]
          ),
          i = t.getSlideIndex(
            t.slides.filter(
              (e) =>
                1 * e.getAttribute("data-swiper-slide-index") ==
                t.slides.length - 1
            )[0]
          ),
          r = t.slidesGrid[s],
          n = t.slidesGrid[i],
          a = t.slidesGrid[t.slidesGrid.length - 1],
          l = Math.abs(e);
        (o = l >= r ? (l - r) / a : (l + a - n) / a), o > 1 && (o -= 1);
      }
      Object.assign(t, {
        progress: r,
        progressLoop: o,
        isBeginning: n,
        isEnd: a,
      }),
        (s.watchSlidesProgress || (s.centeredSlides && s.autoHeight)) &&
          t.updateSlidesProgress(e),
        n && !l && t.emit("reachBeginning toEdge"),
        a && !d && t.emit("reachEnd toEdge"),
        ((l && !n) || (d && !a)) && t.emit("fromEdge"),
        t.emit("progress", r);
    },
    updateSlidesClasses: function () {
      const e = this,
        { slides: t, params: s, slidesEl: i, activeIndex: r } = e,
        n = e.virtual && s.virtual.enabled,
        a = (e) => E(i, `.${s.slideClass}${e}, swiper-slide${e}`)[0];
      let o;
      if (
        (t.forEach((e) => {
          e.classList.remove(
            s.slideActiveClass,
            s.slideNextClass,
            s.slidePrevClass
          );
        }),
        n)
      )
        if (s.loop) {
          let t = r - e.virtual.slidesBefore;
          t < 0 && (t = e.virtual.slides.length + t),
            t >= e.virtual.slides.length && (t -= e.virtual.slides.length),
            (o = a(`[data-swiper-slide-index="${t}"]`));
        } else o = a(`[data-swiper-slide-index="${r}"]`);
      else o = t[r];
      if (o) {
        o.classList.add(s.slideActiveClass);
        let e = (function (e, t) {
          const s = [];
          for (; e.nextElementSibling; ) {
            const i = e.nextElementSibling;
            t ? i.matches(t) && s.push(i) : s.push(i), (e = i);
          }
          return s;
        })(o, `.${s.slideClass}, swiper-slide`)[0];
        s.loop && !e && (e = t[0]), e && e.classList.add(s.slideNextClass);
        let i = (function (e, t) {
          const s = [];
          for (; e.previousElementSibling; ) {
            const i = e.previousElementSibling;
            t ? i.matches(t) && s.push(i) : s.push(i), (e = i);
          }
          return s;
        })(o, `.${s.slideClass}, swiper-slide`)[0];
        s.loop && 0 === !i && (i = t[t.length - 1]),
          i && i.classList.add(s.slidePrevClass);
      }
      e.emitSlidesClasses();
    },
    updateActiveIndex: function (e) {
      const t = this,
        s = t.rtlTranslate ? t.translate : -t.translate,
        {
          snapGrid: i,
          params: r,
          activeIndex: n,
          realIndex: a,
          snapIndex: o,
        } = t;
      let l,
        d = e;
      const c = (e) => {
        let s = e - t.virtual.slidesBefore;
        return (
          s < 0 && (s = t.virtual.slides.length + s),
          s >= t.virtual.slides.length && (s -= t.virtual.slides.length),
          s
        );
      };
      if (
        (void 0 === d &&
          (d = (function (e) {
            const { slidesGrid: t, params: s } = e,
              i = e.rtlTranslate ? e.translate : -e.translate;
            let r;
            for (let e = 0; e < t.length; e += 1)
              void 0 !== t[e + 1]
                ? i >= t[e] && i < t[e + 1] - (t[e + 1] - t[e]) / 2
                  ? (r = e)
                  : i >= t[e] && i < t[e + 1] && (r = e + 1)
                : i >= t[e] && (r = e);
            return (
              s.normalizeSlideIndex && (r < 0 || void 0 === r) && (r = 0), r
            );
          })(t)),
        i.indexOf(s) >= 0)
      )
        l = i.indexOf(s);
      else {
        const e = Math.min(r.slidesPerGroupSkip, d);
        l = e + Math.floor((d - e) / r.slidesPerGroup);
      }
      if ((l >= i.length && (l = i.length - 1), d === n))
        return (
          l !== o && ((t.snapIndex = l), t.emit("snapIndexChange")),
          void (
            t.params.loop &&
            t.virtual &&
            t.params.virtual.enabled &&
            (t.realIndex = c(d))
          )
        );
      let p;
      (p =
        t.virtual && r.virtual.enabled && r.loop
          ? c(d)
          : t.slides[d]
          ? parseInt(
              t.slides[d].getAttribute("data-swiper-slide-index") || d,
              10
            )
          : d),
        Object.assign(t, {
          snapIndex: l,
          realIndex: p,
          previousIndex: n,
          activeIndex: d,
        }),
        t.emit("activeIndexChange"),
        t.emit("snapIndexChange"),
        a !== p && t.emit("realIndexChange"),
        (t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange");
    },
    updateClickedSlide: function (e) {
      const t = this,
        s = t.params,
        i = e.closest(`.${s.slideClass}, swiper-slide`);
      let r,
        n = !1;
      if (i)
        for (let e = 0; e < t.slides.length; e += 1)
          if (t.slides[e] === i) {
            (n = !0), (r = e);
            break;
          }
      if (!i || !n)
        return (t.clickedSlide = void 0), void (t.clickedIndex = void 0);
      (t.clickedSlide = i),
        t.virtual && t.params.virtual.enabled
          ? (t.clickedIndex = parseInt(
              i.getAttribute("data-swiper-slide-index"),
              10
            ))
          : (t.clickedIndex = r),
        s.slideToClickedSlide &&
          void 0 !== t.clickedIndex &&
          t.clickedIndex !== t.activeIndex &&
          t.slideToClickedSlide();
    },
  };
  const B = {
    getTranslate: function (e = this.isHorizontal() ? "x" : "y") {
      const { params: t, rtlTranslate: s, translate: i, wrapperEl: r } = this;
      if (t.virtualTranslate) return s ? -i : i;
      if (t.cssMode) return i;
      let n = w(r, e);
      return s && (n = -n), n || 0;
    },
    setTranslate: function (e, t) {
      const s = this,
        { rtlTranslate: i, params: r, wrapperEl: n, progress: a } = s;
      let o,
        l = 0,
        d = 0;
      s.isHorizontal() ? (l = i ? -e : e) : (d = e),
        r.roundLengths && ((l = Math.floor(l)), (d = Math.floor(d))),
        r.cssMode
          ? (n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal()
              ? -l
              : -d)
          : r.virtualTranslate ||
            (n.style.transform = `translate3d(${l}px, ${d}px, 0px)`),
        (s.previousTranslate = s.translate),
        (s.translate = s.isHorizontal() ? l : d);
      const c = s.maxTranslate() - s.minTranslate();
      (o = 0 === c ? 0 : (e - s.minTranslate()) / c),
        o !== a && s.updateProgress(e),
        s.emit("setTranslate", s.translate, t);
    },
    minTranslate: function () {
      return -this.snapGrid[0];
    },
    maxTranslate: function () {
      return -this.snapGrid[this.snapGrid.length - 1];
    },
    translateTo: function (e = 0, t = this.params.speed, s = !0, i = !0, r) {
      const n = this,
        { params: a, wrapperEl: o } = n;
      if (n.animating && a.preventInteractionOnTransition) return !1;
      const l = n.minTranslate(),
        d = n.maxTranslate();
      let c;
      if (
        ((c = i && e > l ? l : i && e < d ? d : e),
        n.updateProgress(c),
        a.cssMode)
      ) {
        const e = n.isHorizontal();
        if (0 === t) o[e ? "scrollLeft" : "scrollTop"] = -c;
        else {
          if (!n.support.smoothScroll)
            return (
              T({ swiper: n, targetPosition: -c, side: e ? "left" : "top" }), !0
            );
          o.scrollTo({ [e ? "left" : "top"]: -c, behavior: "smooth" });
        }
        return !0;
      }
      return (
        0 === t
          ? (n.setTransition(0),
            n.setTranslate(c),
            s &&
              (n.emit("beforeTransitionStart", t, r), n.emit("transitionEnd")))
          : (n.setTransition(t),
            n.setTranslate(c),
            s &&
              (n.emit("beforeTransitionStart", t, r),
              n.emit("transitionStart")),
            n.animating ||
              ((n.animating = !0),
              n.onTranslateToWrapperTransitionEnd ||
                (n.onTranslateToWrapperTransitionEnd = function (e) {
                  n &&
                    !n.destroyed &&
                    e.target === this &&
                    (n.wrapperEl.removeEventListener(
                      "transitionend",
                      n.onTranslateToWrapperTransitionEnd
                    ),
                    (n.onTranslateToWrapperTransitionEnd = null),
                    delete n.onTranslateToWrapperTransitionEnd,
                    s && n.emit("transitionEnd"));
                }),
              n.wrapperEl.addEventListener(
                "transitionend",
                n.onTranslateToWrapperTransitionEnd
              ))),
        !0
      );
    },
  };
  function D({ swiper: e, runCallbacks: t, direction: s, step: i }) {
    const { activeIndex: r, previousIndex: n } = e;
    let a = s;
    if (
      (a || (a = r > n ? "next" : r < n ? "prev" : "reset"),
      e.emit(`transition${i}`),
      t && r !== n)
    ) {
      if ("reset" === a) return void e.emit(`slideResetTransition${i}`);
      e.emit(`slideChangeTransition${i}`),
        "next" === a
          ? e.emit(`slideNextTransition${i}`)
          : e.emit(`slidePrevTransition${i}`);
    }
  }
  const q = {
    slideTo: function (e = 0, t = this.params.speed, s = !0, i, r) {
      "string" == typeof e && (e = parseInt(e, 10));
      const n = this;
      let a = e;
      a < 0 && (a = 0);
      const {
        params: o,
        snapGrid: l,
        slidesGrid: d,
        previousIndex: c,
        activeIndex: p,
        rtlTranslate: u,
        wrapperEl: m,
        enabled: h,
      } = n;
      if ((n.animating && o.preventInteractionOnTransition) || (!h && !i && !r))
        return !1;
      const f = Math.min(n.params.slidesPerGroupSkip, a);
      let g = f + Math.floor((a - f) / n.params.slidesPerGroup);
      g >= l.length && (g = l.length - 1);
      const v = -l[g];
      if (o.normalizeSlideIndex)
        for (let e = 0; e < d.length; e += 1) {
          const t = -Math.floor(100 * v),
            s = Math.floor(100 * d[e]),
            i = Math.floor(100 * d[e + 1]);
          void 0 !== d[e + 1]
            ? t >= s && t < i - (i - s) / 2
              ? (a = e)
              : t >= s && t < i && (a = e + 1)
            : t >= s && (a = e);
        }
      if (n.initialized && a !== p) {
        if (!n.allowSlideNext && v < n.translate && v < n.minTranslate())
          return !1;
        if (
          !n.allowSlidePrev &&
          v > n.translate &&
          v > n.maxTranslate() &&
          (p || 0) !== a
        )
          return !1;
      }
      let w;
      if (
        (a !== (c || 0) && s && n.emit("beforeSlideChangeStart"),
        n.updateProgress(v),
        (w = a > p ? "next" : a < p ? "prev" : "reset"),
        (u && -v === n.translate) || (!u && v === n.translate))
      )
        return (
          n.updateActiveIndex(a),
          o.autoHeight && n.updateAutoHeight(),
          n.updateSlidesClasses(),
          "slide" !== o.effect && n.setTranslate(v),
          "reset" !== w && (n.transitionStart(s, w), n.transitionEnd(s, w)),
          !1
        );
      if (o.cssMode) {
        const e = n.isHorizontal(),
          s = u ? v : -v;
        if (0 === t) {
          const t = n.virtual && n.params.virtual.enabled;
          t &&
            ((n.wrapperEl.style.scrollSnapType = "none"),
            (n._immediateVirtual = !0)),
            t && !n._cssModeVirtualInitialSet && n.params.initialSlide > 0
              ? ((n._cssModeVirtualInitialSet = !0),
                requestAnimationFrame(() => {
                  m[e ? "scrollLeft" : "scrollTop"] = s;
                }))
              : (m[e ? "scrollLeft" : "scrollTop"] = s),
            t &&
              requestAnimationFrame(() => {
                (n.wrapperEl.style.scrollSnapType = ""),
                  (n._immediateVirtual = !1);
              });
        } else {
          if (!n.support.smoothScroll)
            return (
              T({ swiper: n, targetPosition: s, side: e ? "left" : "top" }), !0
            );
          m.scrollTo({ [e ? "left" : "top"]: s, behavior: "smooth" });
        }
        return !0;
      }
      return (
        n.setTransition(t),
        n.setTranslate(v),
        n.updateActiveIndex(a),
        n.updateSlidesClasses(),
        n.emit("beforeTransitionStart", t, i),
        n.transitionStart(s, w),
        0 === t
          ? n.transitionEnd(s, w)
          : n.animating ||
            ((n.animating = !0),
            n.onSlideToWrapperTransitionEnd ||
              (n.onSlideToWrapperTransitionEnd = function (e) {
                n &&
                  !n.destroyed &&
                  e.target === this &&
                  (n.wrapperEl.removeEventListener(
                    "transitionend",
                    n.onSlideToWrapperTransitionEnd
                  ),
                  (n.onSlideToWrapperTransitionEnd = null),
                  delete n.onSlideToWrapperTransitionEnd,
                  n.transitionEnd(s, w));
              }),
            n.wrapperEl.addEventListener(
              "transitionend",
              n.onSlideToWrapperTransitionEnd
            )),
        !0
      );
    },
    slideToLoop: function (e = 0, t = this.params.speed, s = !0, i) {
      if ("string" == typeof e) {
        e = parseInt(e, 10);
      }
      const r = this;
      let n = e;
      return (
        r.params.loop &&
          (r.virtual && r.params.virtual.enabled
            ? (n += r.virtual.slidesBefore)
            : (n = r.getSlideIndex(
                r.slides.filter(
                  (e) => 1 * e.getAttribute("data-swiper-slide-index") === n
                )[0]
              ))),
        r.slideTo(n, t, s, i)
      );
    },
    slideNext: function (e = this.params.speed, t = !0, s) {
      const i = this,
        { enabled: r, params: n, animating: a } = i;
      if (!r) return i;
      let o = n.slidesPerGroup;
      "auto" === n.slidesPerView &&
        1 === n.slidesPerGroup &&
        n.slidesPerGroupAuto &&
        (o = Math.max(i.slidesPerViewDynamic("current", !0), 1));
      const l = i.activeIndex < n.slidesPerGroupSkip ? 1 : o,
        d = i.virtual && n.virtual.enabled;
      if (n.loop) {
        if (a && !d && n.loopPreventsSliding) return !1;
        i.loopFix({ direction: "next" }),
          (i._clientLeft = i.wrapperEl.clientLeft);
      }
      return n.rewind && i.isEnd
        ? i.slideTo(0, e, t, s)
        : i.slideTo(i.activeIndex + l, e, t, s);
    },
    slidePrev: function (e = this.params.speed, t = !0, s) {
      const i = this,
        {
          params: r,
          snapGrid: n,
          slidesGrid: a,
          rtlTranslate: o,
          enabled: l,
          animating: d,
        } = i;
      if (!l) return i;
      const c = i.virtual && r.virtual.enabled;
      if (r.loop) {
        if (d && !c && r.loopPreventsSliding) return !1;
        i.loopFix({ direction: "prev" }),
          (i._clientLeft = i.wrapperEl.clientLeft);
      }
      function p(e) {
        return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
      }
      const u = p(o ? i.translate : -i.translate),
        m = n.map((e) => p(e));
      let h = n[m.indexOf(u) - 1];
      if (void 0 === h && r.cssMode) {
        let e;
        n.forEach((t, s) => {
          u >= t && (e = s);
        }),
          void 0 !== e && (h = n[e > 0 ? e - 1 : e]);
      }
      let f = 0;
      if (
        (void 0 !== h &&
          ((f = a.indexOf(h)),
          f < 0 && (f = i.activeIndex - 1),
          "auto" === r.slidesPerView &&
            1 === r.slidesPerGroup &&
            r.slidesPerGroupAuto &&
            ((f = f - i.slidesPerViewDynamic("previous", !0) + 1),
            (f = Math.max(f, 0)))),
        r.rewind && i.isBeginning)
      ) {
        const r =
          i.params.virtual && i.params.virtual.enabled && i.virtual
            ? i.virtual.slides.length - 1
            : i.slides.length - 1;
        return i.slideTo(r, e, t, s);
      }
      return i.slideTo(f, e, t, s);
    },
    slideReset: function (e = this.params.speed, t = !0, s) {
      return this.slideTo(this.activeIndex, e, t, s);
    },
    slideToClosest: function (e = this.params.speed, t = !0, s, i = 0.5) {
      const r = this;
      let n = r.activeIndex;
      const a = Math.min(r.params.slidesPerGroupSkip, n),
        o = a + Math.floor((n - a) / r.params.slidesPerGroup),
        l = r.rtlTranslate ? r.translate : -r.translate;
      if (l >= r.snapGrid[o]) {
        const e = r.snapGrid[o];
        l - e > (r.snapGrid[o + 1] - e) * i && (n += r.params.slidesPerGroup);
      } else {
        const e = r.snapGrid[o - 1];
        l - e <= (r.snapGrid[o] - e) * i && (n -= r.params.slidesPerGroup);
      }
      return (
        (n = Math.max(n, 0)),
        (n = Math.min(n, r.slidesGrid.length - 1)),
        r.slideTo(n, e, t, s)
      );
    },
    slideToClickedSlide: function () {
      const e = this,
        { params: t, slidesEl: s } = e,
        i =
          "auto" === t.slidesPerView
            ? e.slidesPerViewDynamic()
            : t.slidesPerView;
      let r,
        n = e.clickedIndex;
      const a = e.isElement ? "swiper-slide" : `.${t.slideClass}`;
      if (t.loop) {
        if (e.animating) return;
        (r = parseInt(
          e.clickedSlide.getAttribute("data-swiper-slide-index"),
          10
        )),
          t.centeredSlides
            ? n < e.loopedSlides - i / 2 ||
              n > e.slides.length - e.loopedSlides + i / 2
              ? (e.loopFix(),
                (n = e.getSlideIndex(
                  E(s, `${a}[data-swiper-slide-index="${r}"]`)[0]
                )),
                g(() => {
                  e.slideTo(n);
                }))
              : e.slideTo(n)
            : n > e.slides.length - i
            ? (e.loopFix(),
              (n = e.getSlideIndex(
                E(s, `${a}[data-swiper-slide-index="${r}"]`)[0]
              )),
              g(() => {
                e.slideTo(n);
              }))
            : e.slideTo(n);
      } else e.slideTo(n);
    },
  };
  const $ = {
    loopCreate: function (e) {
      const t = this,
        { params: s, slidesEl: i } = t;
      if (!s.loop || (t.virtual && t.params.virtual.enabled)) return;
      E(i, `.${s.slideClass}, swiper-slide`).forEach((e, t) => {
        e.setAttribute("data-swiper-slide-index", t);
      }),
        t.loopFix({
          slideRealIndex: e,
          direction: s.centeredSlides ? void 0 : "next",
        });
    },
    loopFix: function ({
      slideRealIndex: e,
      slideTo: t = !0,
      direction: s,
      setTranslate: i,
      activeSlideIndex: r,
      byController: n,
      byMousewheel: a,
    } = {}) {
      const o = this;
      if (!o.params.loop) return;
      o.emit("beforeLoopFix");
      const {
        slides: l,
        allowSlidePrev: d,
        allowSlideNext: c,
        slidesEl: p,
        params: u,
      } = o;
      if (
        ((o.allowSlidePrev = !0),
        (o.allowSlideNext = !0),
        o.virtual && u.virtual.enabled)
      )
        return (
          t &&
            (u.centeredSlides || 0 !== o.snapIndex
              ? u.centeredSlides && o.snapIndex < u.slidesPerView
                ? o.slideTo(o.virtual.slides.length + o.snapIndex, 0, !1, !0)
                : o.snapIndex === o.snapGrid.length - 1 &&
                  o.slideTo(o.virtual.slidesBefore, 0, !1, !0)
              : o.slideTo(o.virtual.slides.length, 0, !1, !0)),
          (o.allowSlidePrev = d),
          (o.allowSlideNext = c),
          void o.emit("loopFix")
        );
      const m =
        "auto" === u.slidesPerView
          ? o.slidesPerViewDynamic()
          : Math.ceil(parseFloat(u.slidesPerView, 10));
      let h = u.loopedSlides || m;
      h % u.slidesPerGroup != 0 &&
        (h += u.slidesPerGroup - (h % u.slidesPerGroup)),
        (o.loopedSlides = h);
      const f = [],
        g = [];
      let v = o.activeIndex;
      void 0 === r
        ? (r = o.getSlideIndex(
            o.slides.filter((e) =>
              e.classList.contains("swiper-slide-active")
            )[0]
          ))
        : (v = r);
      const w = "next" === s || !s,
        b = "prev" === s || !s;
      let y = 0,
        S = 0;
      if (r < h) {
        y = Math.max(h - r, u.slidesPerGroup);
        for (let e = 0; e < h - r; e += 1) {
          const t = e - Math.floor(e / l.length) * l.length;
          f.push(l.length - t - 1);
        }
      } else if (r > o.slides.length - 2 * h) {
        S = Math.max(r - (o.slides.length - 2 * h), u.slidesPerGroup);
        for (let e = 0; e < S; e += 1) {
          const t = e - Math.floor(e / l.length) * l.length;
          g.push(t);
        }
      }
      if (
        (b &&
          f.forEach((e) => {
            p.prepend(o.slides[e]);
          }),
        w &&
          g.forEach((e) => {
            p.append(o.slides[e]);
          }),
        o.recalcSlides(),
        u.watchSlidesProgress && o.updateSlidesOffset(),
        t)
      )
        if (f.length > 0 && b)
          if (void 0 === e) {
            const e = o.slidesGrid[v],
              t = o.slidesGrid[v + y] - e;
            a
              ? o.setTranslate(o.translate - t)
              : (o.slideTo(v + y, 0, !1, !0),
                i && (o.touches[o.isHorizontal() ? "startX" : "startY"] += t));
          } else i && o.slideToLoop(e, 0, !1, !0);
        else if (g.length > 0 && w)
          if (void 0 === e) {
            const e = o.slidesGrid[v],
              t = o.slidesGrid[v - S] - e;
            a
              ? o.setTranslate(o.translate - t)
              : (o.slideTo(v - S, 0, !1, !0),
                i && (o.touches[o.isHorizontal() ? "startX" : "startY"] += t));
          } else o.slideToLoop(e, 0, !1, !0);
      if (
        ((o.allowSlidePrev = d),
        (o.allowSlideNext = c),
        o.controller && o.controller.control && !n)
      ) {
        const t = {
          slideRealIndex: e,
          slideTo: !1,
          direction: s,
          setTranslate: i,
          activeSlideIndex: r,
          byController: !0,
        };
        Array.isArray(o.controller.control)
          ? o.controller.control.forEach((e) => {
              e.params.loop && e.loopFix(t);
            })
          : o.controller.control instanceof o.constructor &&
            o.controller.control.params.loop &&
            o.controller.control.loopFix(t);
      }
      o.emit("loopFix");
    },
    loopDestroy: function () {
      const e = this,
        { slides: t, params: s, slidesEl: i } = e;
      if (!s.loop || (e.virtual && e.params.virtual.enabled)) return;
      e.recalcSlides();
      const r = [];
      t.forEach((e) => {
        const t =
          void 0 === e.swiperSlideIndex
            ? 1 * e.getAttribute("data-swiper-slide-index")
            : e.swiperSlideIndex;
        r[t] = e;
      }),
        t.forEach((e) => {
          e.removeAttribute("data-swiper-slide-index");
        }),
        r.forEach((e) => {
          i.append(e);
        }),
        e.recalcSlides(),
        e.slideTo(e.realIndex, 0);
    },
  };
  function V(e) {
    const t = this,
      s = m(),
      i = f(),
      r = t.touchEventsData;
    r.evCache.push(e);
    const { params: n, touches: a, enabled: o } = t;
    if (!o) return;
    if (!n.simulateTouch && "mouse" === e.pointerType) return;
    if (t.animating && n.preventInteractionOnTransition) return;
    !t.animating && n.cssMode && n.loop && t.loopFix();
    let l = e;
    l.originalEvent && (l = l.originalEvent);
    let d = l.target;
    if ("wrapper" === n.touchEventsTarget && !t.wrapperEl.contains(d)) return;
    if ("which" in l && 3 === l.which) return;
    if ("button" in l && l.button > 0) return;
    if (r.isTouched && r.isMoved) return;
    const c = !!n.noSwipingClass && "" !== n.noSwipingClass,
      p = e.composedPath ? e.composedPath() : e.path;
    c && l.target && l.target.shadowRoot && p && (d = p[0]);
    const u = n.noSwipingSelector
        ? n.noSwipingSelector
        : `.${n.noSwipingClass}`,
      h = !(!l.target || !l.target.shadowRoot);
    if (
      n.noSwiping &&
      (h
        ? (function (e, t = this) {
            return (function t(s) {
              if (!s || s === m() || s === f()) return null;
              s.assignedSlot && (s = s.assignedSlot);
              const i = s.closest(e);
              return i || s.getRootNode ? i || t(s.getRootNode().host) : null;
            })(t);
          })(u, d)
        : d.closest(u))
    )
      return void (t.allowClick = !0);
    if (n.swipeHandler && !d.closest(n.swipeHandler)) return;
    (a.currentX = l.pageX), (a.currentY = l.pageY);
    const g = a.currentX,
      w = a.currentY,
      b = n.edgeSwipeDetection || n.iOSEdgeSwipeDetection,
      y = n.edgeSwipeThreshold || n.iOSEdgeSwipeThreshold;
    if (b && (g <= y || g >= i.innerWidth - y)) {
      if ("prevent" !== b) return;
      e.preventDefault();
    }
    Object.assign(r, {
      isTouched: !0,
      isMoved: !1,
      allowTouchCallbacks: !0,
      isScrolling: void 0,
      startMoving: void 0,
    }),
      (a.startX = g),
      (a.startY = w),
      (r.touchStartTime = v()),
      (t.allowClick = !0),
      t.updateSize(),
      (t.swipeDirection = void 0),
      n.threshold > 0 && (r.allowThresholdMove = !1);
    let S = !0;
    d.matches(r.focusableElements) &&
      ((S = !1), "SELECT" === d.nodeName && (r.isTouched = !1)),
      s.activeElement &&
        s.activeElement.matches(r.focusableElements) &&
        s.activeElement !== d &&
        s.activeElement.blur();
    const T = S && t.allowTouchMove && n.touchStartPreventDefault;
    (!n.touchStartForcePreventDefault && !T) ||
      d.isContentEditable ||
      l.preventDefault(),
      t.params.freeMode &&
        t.params.freeMode.enabled &&
        t.freeMode &&
        t.animating &&
        !n.cssMode &&
        t.freeMode.onTouchStart(),
      t.emit("touchStart", l);
  }
  function N(e) {
    const t = m(),
      s = this,
      i = s.touchEventsData,
      { params: r, touches: n, rtlTranslate: a, enabled: o } = s;
    if (!o) return;
    if (!r.simulateTouch && "mouse" === e.pointerType) return;
    let l = e;
    if ((l.originalEvent && (l = l.originalEvent), !i.isTouched))
      return void (
        i.startMoving &&
        i.isScrolling &&
        s.emit("touchMoveOpposite", l)
      );
    const d = i.evCache.findIndex((e) => e.pointerId === l.pointerId);
    d >= 0 && (i.evCache[d] = l);
    const c = i.evCache.length > 1 ? i.evCache[0] : l,
      p = c.pageX,
      u = c.pageY;
    if (l.preventedByNestedSwiper) return (n.startX = p), void (n.startY = u);
    if (!s.allowTouchMove)
      return (
        l.target.matches(i.focusableElements) || (s.allowClick = !1),
        void (
          i.isTouched &&
          (Object.assign(n, {
            startX: p,
            startY: u,
            prevX: s.touches.currentX,
            prevY: s.touches.currentY,
            currentX: p,
            currentY: u,
          }),
          (i.touchStartTime = v()))
        )
      );
    if (r.touchReleaseOnEdges && !r.loop)
      if (s.isVertical()) {
        if (
          (u < n.startY && s.translate <= s.maxTranslate()) ||
          (u > n.startY && s.translate >= s.minTranslate())
        )
          return (i.isTouched = !1), void (i.isMoved = !1);
      } else if (
        (p < n.startX && s.translate <= s.maxTranslate()) ||
        (p > n.startX && s.translate >= s.minTranslate())
      )
        return;
    if (
      t.activeElement &&
      l.target === t.activeElement &&
      l.target.matches(i.focusableElements)
    )
      return (i.isMoved = !0), void (s.allowClick = !1);
    if (
      (i.allowTouchCallbacks && s.emit("touchMove", l),
      l.targetTouches && l.targetTouches.length > 1)
    )
      return;
    (n.currentX = p), (n.currentY = u);
    const h = n.currentX - n.startX,
      f = n.currentY - n.startY;
    if (s.params.threshold && Math.sqrt(h ** 2 + f ** 2) < s.params.threshold)
      return;
    if (void 0 === i.isScrolling) {
      let e;
      (s.isHorizontal() && n.currentY === n.startY) ||
      (s.isVertical() && n.currentX === n.startX)
        ? (i.isScrolling = !1)
        : h * h + f * f >= 25 &&
          ((e = (180 * Math.atan2(Math.abs(f), Math.abs(h))) / Math.PI),
          (i.isScrolling = s.isHorizontal()
            ? e > r.touchAngle
            : 90 - e > r.touchAngle));
    }
    if (
      (i.isScrolling && s.emit("touchMoveOpposite", l),
      void 0 === i.startMoving &&
        ((n.currentX === n.startX && n.currentY === n.startY) ||
          (i.startMoving = !0)),
      i.isScrolling ||
        (s.zoom &&
          s.params.zoom &&
          s.params.zoom.enabled &&
          i.evCache.length > 1))
    )
      return void (i.isTouched = !1);
    if (!i.startMoving) return;
    (s.allowClick = !1),
      !r.cssMode && l.cancelable && l.preventDefault(),
      r.touchMoveStopPropagation && !r.nested && l.stopPropagation();
    let g = s.isHorizontal() ? h : f,
      w = s.isHorizontal()
        ? n.currentX - n.previousX
        : n.currentY - n.previousY;
    r.oneWayMovement &&
      ((g = Math.abs(g) * (a ? 1 : -1)), (w = Math.abs(w) * (a ? 1 : -1))),
      (n.diff = g),
      (g *= r.touchRatio),
      a && ((g = -g), (w = -w));
    const b = s.touchesDirection;
    (s.swipeDirection = g > 0 ? "prev" : "next"),
      (s.touchesDirection = w > 0 ? "prev" : "next");
    const y = s.params.loop && !r.cssMode;
    if (!i.isMoved) {
      if (
        (y && s.loopFix({ direction: s.swipeDirection }),
        (i.startTranslate = s.getTranslate()),
        s.setTransition(0),
        s.animating)
      ) {
        const e = new window.CustomEvent("transitionend", {
          bubbles: !0,
          cancelable: !0,
        });
        s.wrapperEl.dispatchEvent(e);
      }
      (i.allowMomentumBounce = !1),
        !r.grabCursor ||
          (!0 !== s.allowSlideNext && !0 !== s.allowSlidePrev) ||
          s.setGrabCursor(!0),
        s.emit("sliderFirstMove", l);
    }
    let S;
    i.isMoved &&
      b !== s.touchesDirection &&
      y &&
      Math.abs(g) >= 1 &&
      (s.loopFix({ direction: s.swipeDirection, setTranslate: !0 }), (S = !0)),
      s.emit("sliderMove", l),
      (i.isMoved = !0),
      (i.currentTranslate = g + i.startTranslate);
    let T = !0,
      E = r.resistanceRatio;
    if (
      (r.touchReleaseOnEdges && (E = 0),
      g > 0
        ? (y &&
            !S &&
            i.currentTranslate >
              (r.centeredSlides
                ? s.minTranslate() - s.size / 2
                : s.minTranslate()) &&
            s.loopFix({
              direction: "prev",
              setTranslate: !0,
              activeSlideIndex: 0,
            }),
          i.currentTranslate > s.minTranslate() &&
            ((T = !1),
            r.resistance &&
              (i.currentTranslate =
                s.minTranslate() -
                1 +
                (-s.minTranslate() + i.startTranslate + g) ** E)))
        : g < 0 &&
          (y &&
            !S &&
            i.currentTranslate <
              (r.centeredSlides
                ? s.maxTranslate() + s.size / 2
                : s.maxTranslate()) &&
            s.loopFix({
              direction: "next",
              setTranslate: !0,
              activeSlideIndex:
                s.slides.length -
                ("auto" === r.slidesPerView
                  ? s.slidesPerViewDynamic()
                  : Math.ceil(parseFloat(r.slidesPerView, 10))),
            }),
          i.currentTranslate < s.maxTranslate() &&
            ((T = !1),
            r.resistance &&
              (i.currentTranslate =
                s.maxTranslate() +
                1 -
                (s.maxTranslate() - i.startTranslate - g) ** E))),
      T && (l.preventedByNestedSwiper = !0),
      !s.allowSlideNext &&
        "next" === s.swipeDirection &&
        i.currentTranslate < i.startTranslate &&
        (i.currentTranslate = i.startTranslate),
      !s.allowSlidePrev &&
        "prev" === s.swipeDirection &&
        i.currentTranslate > i.startTranslate &&
        (i.currentTranslate = i.startTranslate),
      s.allowSlidePrev ||
        s.allowSlideNext ||
        (i.currentTranslate = i.startTranslate),
      r.threshold > 0)
    ) {
      if (!(Math.abs(g) > r.threshold || i.allowThresholdMove))
        return void (i.currentTranslate = i.startTranslate);
      if (!i.allowThresholdMove)
        return (
          (i.allowThresholdMove = !0),
          (n.startX = n.currentX),
          (n.startY = n.currentY),
          (i.currentTranslate = i.startTranslate),
          void (n.diff = s.isHorizontal()
            ? n.currentX - n.startX
            : n.currentY - n.startY)
        );
    }
    r.followFinger &&
      !r.cssMode &&
      (((r.freeMode && r.freeMode.enabled && s.freeMode) ||
        r.watchSlidesProgress) &&
        (s.updateActiveIndex(), s.updateSlidesClasses()),
      s.params.freeMode &&
        r.freeMode.enabled &&
        s.freeMode &&
        s.freeMode.onTouchMove(),
      s.updateProgress(i.currentTranslate),
      s.setTranslate(i.currentTranslate));
  }
  function F(e) {
    const t = this,
      s = t.touchEventsData,
      i = s.evCache.findIndex((t) => t.pointerId === e.pointerId);
    if (
      (i >= 0 && s.evCache.splice(i, 1),
      ["pointercancel", "pointerout", "pointerleave"].includes(e.type))
    ) {
      if (
        !(
          "pointercancel" === e.type &&
          (t.browser.isSafari || t.browser.isWebView)
        )
      )
        return;
    }
    const {
      params: r,
      touches: n,
      rtlTranslate: a,
      slidesGrid: o,
      enabled: l,
    } = t;
    if (!l) return;
    if (!r.simulateTouch && "mouse" === e.pointerType) return;
    let d = e;
    if (
      (d.originalEvent && (d = d.originalEvent),
      s.allowTouchCallbacks && t.emit("touchEnd", d),
      (s.allowTouchCallbacks = !1),
      !s.isTouched)
    )
      return (
        s.isMoved && r.grabCursor && t.setGrabCursor(!1),
        (s.isMoved = !1),
        void (s.startMoving = !1)
      );
    r.grabCursor &&
      s.isMoved &&
      s.isTouched &&
      (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) &&
      t.setGrabCursor(!1);
    const c = v(),
      p = c - s.touchStartTime;
    if (t.allowClick) {
      const e = d.path || (d.composedPath && d.composedPath());
      t.updateClickedSlide((e && e[0]) || d.target),
        t.emit("tap click", d),
        p < 300 &&
          c - s.lastClickTime < 300 &&
          t.emit("doubleTap doubleClick", d);
    }
    if (
      ((s.lastClickTime = v()),
      g(() => {
        t.destroyed || (t.allowClick = !0);
      }),
      !s.isTouched ||
        !s.isMoved ||
        !t.swipeDirection ||
        0 === n.diff ||
        s.currentTranslate === s.startTranslate)
    )
      return (s.isTouched = !1), (s.isMoved = !1), void (s.startMoving = !1);
    let u;
    if (
      ((s.isTouched = !1),
      (s.isMoved = !1),
      (s.startMoving = !1),
      (u = r.followFinger
        ? a
          ? t.translate
          : -t.translate
        : -s.currentTranslate),
      r.cssMode)
    )
      return;
    if (t.params.freeMode && r.freeMode.enabled)
      return void t.freeMode.onTouchEnd({ currentPos: u });
    let m = 0,
      h = t.slidesSizesGrid[0];
    for (
      let e = 0;
      e < o.length;
      e += e < r.slidesPerGroupSkip ? 1 : r.slidesPerGroup
    ) {
      const t = e < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
      void 0 !== o[e + t]
        ? u >= o[e] && u < o[e + t] && ((m = e), (h = o[e + t] - o[e]))
        : u >= o[e] && ((m = e), (h = o[o.length - 1] - o[o.length - 2]));
    }
    let f = null,
      w = null;
    r.rewind &&
      (t.isBeginning
        ? (w =
            t.params.virtual && t.params.virtual.enabled && t.virtual
              ? t.virtual.slides.length - 1
              : t.slides.length - 1)
        : t.isEnd && (f = 0));
    const b = (u - o[m]) / h,
      y = m < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
    if (p > r.longSwipesMs) {
      if (!r.longSwipes) return void t.slideTo(t.activeIndex);
      "next" === t.swipeDirection &&
        (b >= r.longSwipesRatio
          ? t.slideTo(r.rewind && t.isEnd ? f : m + y)
          : t.slideTo(m)),
        "prev" === t.swipeDirection &&
          (b > 1 - r.longSwipesRatio
            ? t.slideTo(m + y)
            : null !== w && b < 0 && Math.abs(b) > r.longSwipesRatio
            ? t.slideTo(w)
            : t.slideTo(m));
    } else {
      if (!r.shortSwipes) return void t.slideTo(t.activeIndex);
      t.navigation &&
      (d.target === t.navigation.nextEl || d.target === t.navigation.prevEl)
        ? d.target === t.navigation.nextEl
          ? t.slideTo(m + y)
          : t.slideTo(m)
        : ("next" === t.swipeDirection && t.slideTo(null !== f ? f : m + y),
          "prev" === t.swipeDirection && t.slideTo(null !== w ? w : m));
    }
  }
  let H;
  function j() {
    const e = this,
      { params: t, el: s } = e;
    if (s && 0 === s.offsetWidth) return;
    t.breakpoints && e.setBreakpoint();
    const { allowSlideNext: i, allowSlidePrev: r, snapGrid: n } = e,
      a = e.virtual && e.params.virtual.enabled;
    (e.allowSlideNext = !0),
      (e.allowSlidePrev = !0),
      e.updateSize(),
      e.updateSlides(),
      e.updateSlidesClasses();
    const o = a && t.loop;
    !("auto" === t.slidesPerView || t.slidesPerView > 1) ||
    !e.isEnd ||
    e.isBeginning ||
    e.params.centeredSlides ||
    o
      ? e.params.loop && !a
        ? e.slideToLoop(e.realIndex, 0, !1, !0)
        : e.slideTo(e.activeIndex, 0, !1, !0)
      : e.slideTo(e.slides.length - 1, 0, !1, !0),
      e.autoplay &&
        e.autoplay.running &&
        e.autoplay.paused &&
        (clearTimeout(H),
        (H = setTimeout(() => {
          e.autoplay &&
            e.autoplay.running &&
            e.autoplay.paused &&
            e.autoplay.resume();
        }, 500))),
      (e.allowSlidePrev = r),
      (e.allowSlideNext = i),
      e.params.watchOverflow && n !== e.snapGrid && e.checkOverflow();
  }
  function R(e) {
    const t = this;
    t.enabled &&
      (t.allowClick ||
        (t.params.preventClicks && e.preventDefault(),
        t.params.preventClicksPropagation &&
          t.animating &&
          (e.stopPropagation(), e.stopImmediatePropagation())));
  }
  function W() {
    const e = this,
      { wrapperEl: t, rtlTranslate: s, enabled: i } = e;
    if (!i) return;
    let r;
    (e.previousTranslate = e.translate),
      e.isHorizontal()
        ? (e.translate = -t.scrollLeft)
        : (e.translate = -t.scrollTop),
      0 === e.translate && (e.translate = 0),
      e.updateActiveIndex(),
      e.updateSlidesClasses();
    const n = e.maxTranslate() - e.minTranslate();
    (r = 0 === n ? 0 : (e.translate - e.minTranslate()) / n),
      r !== e.progress && e.updateProgress(s ? -e.translate : e.translate),
      e.emit("setTranslate", e.translate, !1);
  }
  const Y = (e, t) => {
    if (!e || e.destroyed || !e.params) return;
    const s = t.closest(
      e.isElement ? "swiper-slide" : `.${e.params.slideClass}`
    );
    if (s) {
      const t = s.querySelector(`.${e.params.lazyPreloaderClass}`);
      t && t.remove();
    }
  };
  function X(e) {
    Y(this, e.target), this.update();
  }
  let U = !1;
  function K() {}
  const Q = (e, t) => {
    const s = m(),
      { params: i, el: r, wrapperEl: n, device: a } = e,
      o = !!i.nested,
      l = "on" === t ? "addEventListener" : "removeEventListener",
      d = t;
    r[l]("pointerdown", e.onTouchStart, { passive: !1 }),
      s[l]("pointermove", e.onTouchMove, { passive: !1, capture: o }),
      s[l]("pointerup", e.onTouchEnd, { passive: !0 }),
      s[l]("pointercancel", e.onTouchEnd, { passive: !0 }),
      s[l]("pointerout", e.onTouchEnd, { passive: !0 }),
      s[l]("pointerleave", e.onTouchEnd, { passive: !0 }),
      (i.preventClicks || i.preventClicksPropagation) &&
        r[l]("click", e.onClick, !0),
      i.cssMode && n[l]("scroll", e.onScroll),
      i.updateOnWindowResize
        ? e[d](
            a.ios || a.android
              ? "resize orientationchange observerUpdate"
              : "resize observerUpdate",
            j,
            !0
          )
        : e[d]("observerUpdate", j, !0),
      r[l]("load", e.onLoad, { capture: !0 });
  };
  const J = (e, t) => e.grid && t.grid && t.grid.rows > 1;
  const Z = {
    init: !0,
    direction: "horizontal",
    oneWayMovement: !1,
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: !1,
    updateOnWindowResize: !0,
    resizeObserver: !0,
    nested: !1,
    createElements: !1,
    enabled: !0,
    focusableElements: "input, select, option, textarea, button, video, label",
    width: null,
    height: null,
    preventInteractionOnTransition: !1,
    userAgent: null,
    url: null,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsBase: "window",
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: !1,
    centeredSlides: !1,
    centeredSlidesBounds: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !0,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 5,
    touchMoveStopPropagation: !1,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: 0.85,
    watchSlidesProgress: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    loop: !1,
    loopedSlides: null,
    loopPreventsSliding: !0,
    rewind: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    maxBackfaceHiddenSlides: 10,
    containerModifierClass: "swiper-",
    slideClass: "swiper-slide",
    slideActiveClass: "swiper-slide-active",
    slideVisibleClass: "swiper-slide-visible",
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-prev",
    wrapperClass: "swiper-wrapper",
    lazyPreloaderClass: "swiper-lazy-preloader",
    runCallbacksOnInit: !0,
    _emitClasses: !1,
  };
  function ee(e, t) {
    return function (s = {}) {
      const i = Object.keys(s)[0],
        r = s[i];
      "object" == typeof r && null !== r
        ? (["navigation", "pagination", "scrollbar"].indexOf(i) >= 0 &&
            !0 === e[i] &&
            (e[i] = { auto: !0 }),
          i in e && "enabled" in r
            ? (!0 === e[i] && (e[i] = { enabled: !0 }),
              "object" != typeof e[i] ||
                "enabled" in e[i] ||
                (e[i].enabled = !0),
              e[i] || (e[i] = { enabled: !1 }),
              y(t, s))
            : y(t, s))
        : y(t, s);
    };
  }
  const te = {
      eventsEmitter: z,
      update: G,
      translate: B,
      transition: {
        setTransition: function (e, t) {
          const s = this;
          s.params.cssMode || (s.wrapperEl.style.transitionDuration = `${e}ms`),
            s.emit("setTransition", e, t);
        },
        transitionStart: function (e = !0, t) {
          const s = this,
            { params: i } = s;
          i.cssMode ||
            (i.autoHeight && s.updateAutoHeight(),
            D({ swiper: s, runCallbacks: e, direction: t, step: "Start" }));
        },
        transitionEnd: function (e = !0, t) {
          const s = this,
            { params: i } = s;
          (s.animating = !1),
            i.cssMode ||
              (s.setTransition(0),
              D({ swiper: s, runCallbacks: e, direction: t, step: "End" }));
        },
      },
      slide: q,
      loop: $,
      grabCursor: {
        setGrabCursor: function (e) {
          const t = this;
          if (
            !t.params.simulateTouch ||
            (t.params.watchOverflow && t.isLocked) ||
            t.params.cssMode
          )
            return;
          const s =
            "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
          t.isElement && (t.__preventObserver__ = !0),
            (s.style.cursor = "move"),
            (s.style.cursor = e ? "grabbing" : "grab"),
            t.isElement &&
              requestAnimationFrame(() => {
                t.__preventObserver__ = !1;
              });
        },
        unsetGrabCursor: function () {
          const e = this;
          (e.params.watchOverflow && e.isLocked) ||
            e.params.cssMode ||
            (e.isElement && (e.__preventObserver__ = !0),
            (e[
              "container" === e.params.touchEventsTarget ? "el" : "wrapperEl"
            ].style.cursor = ""),
            e.isElement &&
              requestAnimationFrame(() => {
                e.__preventObserver__ = !1;
              }));
        },
      },
      events: {
        attachEvents: function () {
          const e = this,
            t = m(),
            { params: s } = e;
          (e.onTouchStart = V.bind(e)),
            (e.onTouchMove = N.bind(e)),
            (e.onTouchEnd = F.bind(e)),
            s.cssMode && (e.onScroll = W.bind(e)),
            (e.onClick = R.bind(e)),
            (e.onLoad = X.bind(e)),
            U || (t.addEventListener("touchstart", K), (U = !0)),
            Q(e, "on");
        },
        detachEvents: function () {
          Q(this, "off");
        },
      },
      breakpoints: {
        setBreakpoint: function () {
          const e = this,
            { realIndex: t, initialized: s, params: i, el: r } = e,
            n = i.breakpoints;
          if (!n || (n && 0 === Object.keys(n).length)) return;
          const a = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
          if (!a || e.currentBreakpoint === a) return;
          const o = (a in n ? n[a] : void 0) || e.originalParams,
            l = J(e, i),
            d = J(e, o),
            c = i.enabled;
          l && !d
            ? (r.classList.remove(
                `${i.containerModifierClass}grid`,
                `${i.containerModifierClass}grid-column`
              ),
              e.emitContainerClasses())
            : !l &&
              d &&
              (r.classList.add(`${i.containerModifierClass}grid`),
              ((o.grid.fill && "column" === o.grid.fill) ||
                (!o.grid.fill && "column" === i.grid.fill)) &&
                r.classList.add(`${i.containerModifierClass}grid-column`),
              e.emitContainerClasses()),
            ["navigation", "pagination", "scrollbar"].forEach((t) => {
              const s = i[t] && i[t].enabled,
                r = o[t] && o[t].enabled;
              s && !r && e[t].disable(), !s && r && e[t].enable();
            });
          const p = o.direction && o.direction !== i.direction,
            u = i.loop && (o.slidesPerView !== i.slidesPerView || p);
          p && s && e.changeDirection(), y(e.params, o);
          const m = e.params.enabled;
          Object.assign(e, {
            allowTouchMove: e.params.allowTouchMove,
            allowSlideNext: e.params.allowSlideNext,
            allowSlidePrev: e.params.allowSlidePrev,
          }),
            c && !m ? e.disable() : !c && m && e.enable(),
            (e.currentBreakpoint = a),
            e.emit("_beforeBreakpoint", o),
            u && s && (e.loopDestroy(), e.loopCreate(t), e.updateSlides()),
            e.emit("breakpoint", o);
        },
        getBreakpoint: function (e, t = "window", s) {
          if (!e || ("container" === t && !s)) return;
          let i = !1;
          const r = f(),
            n = "window" === t ? r.innerHeight : s.clientHeight,
            a = Object.keys(e).map((e) => {
              if ("string" == typeof e && 0 === e.indexOf("@")) {
                const t = parseFloat(e.substr(1));
                return { value: n * t, point: e };
              }
              return { value: e, point: e };
            });
          a.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
          for (let e = 0; e < a.length; e += 1) {
            const { point: n, value: o } = a[e];
            "window" === t
              ? r.matchMedia(`(min-width: ${o}px)`).matches && (i = n)
              : o <= s.clientWidth && (i = n);
          }
          return i || "max";
        },
      },
      checkOverflow: {
        checkOverflow: function () {
          const e = this,
            { isLocked: t, params: s } = e,
            { slidesOffsetBefore: i } = s;
          if (i) {
            const t = e.slides.length - 1,
              s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * i;
            e.isLocked = e.size > s;
          } else e.isLocked = 1 === e.snapGrid.length;
          !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked),
            !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
            t && t !== e.isLocked && (e.isEnd = !1),
            t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
        },
      },
      classes: {
        addClasses: function () {
          const e = this,
            { classNames: t, params: s, rtl: i, el: r, device: n } = e,
            a = (function (e, t) {
              const s = [];
              return (
                e.forEach((e) => {
                  "object" == typeof e
                    ? Object.keys(e).forEach((i) => {
                        e[i] && s.push(t + i);
                      })
                    : "string" == typeof e && s.push(t + e);
                }),
                s
              );
            })(
              [
                "initialized",
                s.direction,
                { "free-mode": e.params.freeMode && s.freeMode.enabled },
                { autoheight: s.autoHeight },
                { rtl: i },
                { grid: s.grid && s.grid.rows > 1 },
                {
                  "grid-column":
                    s.grid && s.grid.rows > 1 && "column" === s.grid.fill,
                },
                { android: n.android },
                { ios: n.ios },
                { "css-mode": s.cssMode },
                { centered: s.cssMode && s.centeredSlides },
                { "watch-progress": s.watchSlidesProgress },
              ],
              s.containerModifierClass
            );
          t.push(...a), r.classList.add(...t), e.emitContainerClasses();
        },
        removeClasses: function () {
          const { el: e, classNames: t } = this;
          e.classList.remove(...t), this.emitContainerClasses();
        },
      },
    },
    se = {};
  class ie {
    constructor(...e) {
      let t, s;
      1 === e.length &&
      e[0].constructor &&
      "Object" === Object.prototype.toString.call(e[0]).slice(8, -1)
        ? (s = e[0])
        : ([t, s] = e),
        s || (s = {}),
        (s = y({}, s)),
        t && !s.el && (s.el = t);
      const i = m();
      if (
        s.el &&
        "string" == typeof s.el &&
        i.querySelectorAll(s.el).length > 1
      ) {
        const e = [];
        return (
          i.querySelectorAll(s.el).forEach((t) => {
            const i = y({}, s, { el: t });
            e.push(new ie(i));
          }),
          e
        );
      }
      const r = this;
      (r.__swiper__ = !0),
        (r.support = A()),
        (r.device = O({ userAgent: s.userAgent })),
        (r.browser = I()),
        (r.eventsListeners = {}),
        (r.eventsAnyListeners = []),
        (r.modules = [...r.__modules__]),
        s.modules && Array.isArray(s.modules) && r.modules.push(...s.modules);
      const n = {};
      r.modules.forEach((e) => {
        e({
          params: s,
          swiper: r,
          extendParams: ee(s, n),
          on: r.on.bind(r),
          once: r.once.bind(r),
          off: r.off.bind(r),
          emit: r.emit.bind(r),
        });
      });
      const a = y({}, Z, n);
      return (
        (r.params = y({}, a, se, s)),
        (r.originalParams = y({}, r.params)),
        (r.passedParams = y({}, s)),
        r.params &&
          r.params.on &&
          Object.keys(r.params.on).forEach((e) => {
            r.on(e, r.params.on[e]);
          }),
        r.params && r.params.onAny && r.onAny(r.params.onAny),
        Object.assign(r, {
          enabled: r.params.enabled,
          el: t,
          classNames: [],
          slides: [],
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: () => "horizontal" === r.params.direction,
          isVertical: () => "vertical" === r.params.direction,
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: r.params.allowSlideNext,
          allowSlidePrev: r.params.allowSlidePrev,
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: r.params.focusableElements,
            lastClickTime: v(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            startMoving: void 0,
            evCache: [],
          },
          allowClick: !0,
          allowTouchMove: r.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        r.emit("_swiper"),
        r.params.init && r.init(),
        r
      );
    }
    getSlideIndex(e) {
      const { slidesEl: t, params: s } = this,
        i = P(E(t, `.${s.slideClass}, swiper-slide`)[0]);
      return P(e) - i;
    }
    recalcSlides() {
      const { slidesEl: e, params: t } = this;
      this.slides = E(e, `.${t.slideClass}, swiper-slide`);
    }
    enable() {
      const e = this;
      e.enabled ||
        ((e.enabled = !0),
        e.params.grabCursor && e.setGrabCursor(),
        e.emit("enable"));
    }
    disable() {
      const e = this;
      e.enabled &&
        ((e.enabled = !1),
        e.params.grabCursor && e.unsetGrabCursor(),
        e.emit("disable"));
    }
    setProgress(e, t) {
      const s = this;
      e = Math.min(Math.max(e, 0), 1);
      const i = s.minTranslate(),
        r = (s.maxTranslate() - i) * e + i;
      s.translateTo(r, void 0 === t ? 0 : t),
        s.updateActiveIndex(),
        s.updateSlidesClasses();
    }
    emitContainerClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t = e.el.className
        .split(" ")
        .filter(
          (t) =>
            0 === t.indexOf("swiper") ||
            0 === t.indexOf(e.params.containerModifierClass)
        );
      e.emit("_containerClasses", t.join(" "));
    }
    getSlideClasses(e) {
      const t = this;
      return t.destroyed
        ? ""
        : e.className
            .split(" ")
            .filter(
              (e) =>
                0 === e.indexOf("swiper-slide") ||
                0 === e.indexOf(t.params.slideClass)
            )
            .join(" ");
    }
    emitSlidesClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t = [];
      e.slides.forEach((s) => {
        const i = e.getSlideClasses(s);
        t.push({ slideEl: s, classNames: i }), e.emit("_slideClass", s, i);
      }),
        e.emit("_slideClasses", t);
    }
    slidesPerViewDynamic(e = "current", t = !1) {
      const {
        params: s,
        slides: i,
        slidesGrid: r,
        slidesSizesGrid: n,
        size: a,
        activeIndex: o,
      } = this;
      let l = 1;
      if (s.centeredSlides) {
        let e,
          t = i[o].swiperSlideSize;
        for (let s = o + 1; s < i.length; s += 1)
          i[s] &&
            !e &&
            ((t += i[s].swiperSlideSize), (l += 1), t > a && (e = !0));
        for (let s = o - 1; s >= 0; s -= 1)
          i[s] &&
            !e &&
            ((t += i[s].swiperSlideSize), (l += 1), t > a && (e = !0));
      } else if ("current" === e)
        for (let e = o + 1; e < i.length; e += 1) {
          (t ? r[e] + n[e] - r[o] < a : r[e] - r[o] < a) && (l += 1);
        }
      else
        for (let e = o - 1; e >= 0; e -= 1) {
          r[o] - r[e] < a && (l += 1);
        }
      return l;
    }
    update() {
      const e = this;
      if (!e || e.destroyed) return;
      const { snapGrid: t, params: s } = e;
      function i() {
        const t = e.rtlTranslate ? -1 * e.translate : e.translate,
          s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
        e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
      }
      let r;
      s.breakpoints && e.setBreakpoint(),
        [...e.el.querySelectorAll('[loading="lazy"]')].forEach((t) => {
          t.complete && Y(e, t);
        }),
        e.updateSize(),
        e.updateSlides(),
        e.updateProgress(),
        e.updateSlidesClasses(),
        e.params.freeMode && e.params.freeMode.enabled
          ? (i(), e.params.autoHeight && e.updateAutoHeight())
          : ((r =
              ("auto" === e.params.slidesPerView ||
                e.params.slidesPerView > 1) &&
              e.isEnd &&
              !e.params.centeredSlides
                ? e.slideTo(e.slides.length - 1, 0, !1, !0)
                : e.slideTo(e.activeIndex, 0, !1, !0)),
            r || i()),
        s.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
        e.emit("update");
    }
    changeDirection(e, t = !0) {
      const s = this,
        i = s.params.direction;
      return (
        e || (e = "horizontal" === i ? "vertical" : "horizontal"),
        e === i ||
          ("horizontal" !== e && "vertical" !== e) ||
          (s.el.classList.remove(`${s.params.containerModifierClass}${i}`),
          s.el.classList.add(`${s.params.containerModifierClass}${e}`),
          s.emitContainerClasses(),
          (s.params.direction = e),
          s.slides.forEach((t) => {
            "vertical" === e ? (t.style.width = "") : (t.style.height = "");
          }),
          s.emit("changeDirection"),
          t && s.update()),
        s
      );
    }
    changeLanguageDirection(e) {
      const t = this;
      (t.rtl && "rtl" === e) ||
        (!t.rtl && "ltr" === e) ||
        ((t.rtl = "rtl" === e),
        (t.rtlTranslate = "horizontal" === t.params.direction && t.rtl),
        t.rtl
          ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`),
            (t.el.dir = "rtl"))
          : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`),
            (t.el.dir = "ltr")),
        t.update());
    }
    mount(e) {
      const t = this;
      if (t.mounted) return !0;
      let s = e || t.params.el;
      if (("string" == typeof s && (s = document.querySelector(s)), !s))
        return !1;
      (s.swiper = t), s.shadowEl && (t.isElement = !0);
      const i = () =>
        `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
      let r = (() => {
        if (s && s.shadowRoot && s.shadowRoot.querySelector) {
          return s.shadowRoot.querySelector(i());
        }
        return E(s, i())[0];
      })();
      return (
        !r &&
          t.params.createElements &&
          ((r = x("div", t.params.wrapperClass)),
          s.append(r),
          E(s, `.${t.params.slideClass}`).forEach((e) => {
            r.append(e);
          })),
        Object.assign(t, {
          el: s,
          wrapperEl: r,
          slidesEl: t.isElement ? s : r,
          mounted: !0,
          rtl: "rtl" === s.dir.toLowerCase() || "rtl" === C(s, "direction"),
          rtlTranslate:
            "horizontal" === t.params.direction &&
            ("rtl" === s.dir.toLowerCase() || "rtl" === C(s, "direction")),
          wrongRTL: "-webkit-box" === C(r, "display"),
        }),
        !0
      );
    }
    init(e) {
      const t = this;
      if (t.initialized) return t;
      return (
        !1 === t.mount(e) ||
          (t.emit("beforeInit"),
          t.params.breakpoints && t.setBreakpoint(),
          t.addClasses(),
          t.updateSize(),
          t.updateSlides(),
          t.params.watchOverflow && t.checkOverflow(),
          t.params.grabCursor && t.enabled && t.setGrabCursor(),
          t.params.loop && t.virtual && t.params.virtual.enabled
            ? t.slideTo(
                t.params.initialSlide + t.virtual.slidesBefore,
                0,
                t.params.runCallbacksOnInit,
                !1,
                !0
              )
            : t.slideTo(
                t.params.initialSlide,
                0,
                t.params.runCallbacksOnInit,
                !1,
                !0
              ),
          t.params.loop && t.loopCreate(),
          t.attachEvents(),
          [...t.el.querySelectorAll('[loading="lazy"]')].forEach((e) => {
            e.complete
              ? Y(t, e)
              : e.addEventListener("load", (e) => {
                  Y(t, e.target);
                });
          }),
          (t.initialized = !0),
          t.emit("init"),
          t.emit("afterInit")),
        t
      );
    }
    destroy(e = !0, t = !0) {
      const s = this,
        { params: i, el: r, wrapperEl: n, slides: a } = s;
      return (
        void 0 === s.params ||
          s.destroyed ||
          (s.emit("beforeDestroy"),
          (s.initialized = !1),
          s.detachEvents(),
          i.loop && s.loopDestroy(),
          t &&
            (s.removeClasses(),
            r.removeAttribute("style"),
            n.removeAttribute("style"),
            a &&
              a.length &&
              a.forEach((e) => {
                e.classList.remove(
                  i.slideVisibleClass,
                  i.slideActiveClass,
                  i.slideNextClass,
                  i.slidePrevClass
                ),
                  e.removeAttribute("style"),
                  e.removeAttribute("data-swiper-slide-index");
              })),
          s.emit("destroy"),
          Object.keys(s.eventsListeners).forEach((e) => {
            s.off(e);
          }),
          !1 !== e &&
            ((s.el.swiper = null),
            (function (e) {
              const t = e;
              Object.keys(t).forEach((e) => {
                try {
                  t[e] = null;
                } catch (e) {}
                try {
                  delete t[e];
                } catch (e) {}
              });
            })(s)),
          (s.destroyed = !0)),
        null
      );
    }
    static extendDefaults(e) {
      y(se, e);
    }
    static get extendedDefaults() {
      return se;
    }
    static get defaults() {
      return Z;
    }
    static installModule(e) {
      ie.prototype.__modules__ || (ie.prototype.__modules__ = []);
      const t = ie.prototype.__modules__;
      "function" == typeof e && t.indexOf(e) < 0 && t.push(e);
    }
    static use(e) {
      return Array.isArray(e)
        ? (e.forEach((e) => ie.installModule(e)), ie)
        : (ie.installModule(e), ie);
    }
  }
  Object.keys(te).forEach((e) => {
    Object.keys(te[e]).forEach((t) => {
      ie.prototype[t] = te[e][t];
    });
  }),
    ie.use([
      function ({ swiper: e, on: t, emit: s }) {
        const i = f();
        let r = null,
          n = null;
        const a = () => {
            e &&
              !e.destroyed &&
              e.initialized &&
              (s("beforeResize"), s("resize"));
          },
          o = () => {
            e && !e.destroyed && e.initialized && s("orientationchange");
          };
        t("init", () => {
          e.params.resizeObserver && void 0 !== i.ResizeObserver
            ? e &&
              !e.destroyed &&
              e.initialized &&
              ((r = new ResizeObserver((t) => {
                n = i.requestAnimationFrame(() => {
                  const { width: s, height: i } = e;
                  let r = s,
                    n = i;
                  t.forEach(
                    ({ contentBoxSize: t, contentRect: s, target: i }) => {
                      (i && i !== e.el) ||
                        ((r = s ? s.width : (t[0] || t).inlineSize),
                        (n = s ? s.height : (t[0] || t).blockSize));
                    }
                  ),
                    (r === s && n === i) || a();
                });
              })),
              r.observe(e.el))
            : (i.addEventListener("resize", a),
              i.addEventListener("orientationchange", o));
        }),
          t("destroy", () => {
            n && i.cancelAnimationFrame(n),
              r && r.unobserve && e.el && (r.unobserve(e.el), (r = null)),
              i.removeEventListener("resize", a),
              i.removeEventListener("orientationchange", o);
          });
      },
      function ({ swiper: e, extendParams: t, on: s, emit: i }) {
        const r = [],
          n = f(),
          a = (t, s = {}) => {
            const a = new (n.MutationObserver || n.WebkitMutationObserver)(
              (t) => {
                if (e.__preventObserver__) return;
                if (1 === t.length) return void i("observerUpdate", t[0]);
                const s = function () {
                  i("observerUpdate", t[0]);
                };
                n.requestAnimationFrame
                  ? n.requestAnimationFrame(s)
                  : n.setTimeout(s, 0);
              }
            );
            a.observe(t, {
              attributes: void 0 === s.attributes || s.attributes,
              childList: void 0 === s.childList || s.childList,
              characterData: void 0 === s.characterData || s.characterData,
            }),
              r.push(a);
          };
        t({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
          s("init", () => {
            if (e.params.observer) {
              if (e.params.observeParents) {
                const t = (function (e, t) {
                  const s = [];
                  let i = e.parentElement;
                  for (; i; )
                    t ? i.matches(t) && s.push(i) : s.push(i),
                      (i = i.parentElement);
                  return s;
                })(e.el);
                for (let e = 0; e < t.length; e += 1) a(t[e]);
              }
              a(e.el, { childList: e.params.observeSlideChildren }),
                a(e.wrapperEl, { attributes: !1 });
            }
          }),
          s("destroy", () => {
            r.forEach((e) => {
              e.disconnect();
            }),
              r.splice(0, r.length);
          });
      },
    ]);
  const re = ie;
  function ne({ swiper: e, extendParams: t, on: s, emit: i }) {
    t({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: !1,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
        navigationDisabledClass: "swiper-navigation-disabled",
      },
    }),
      (e.navigation = { nextEl: null, prevEl: null });
    const r = (e) => (Array.isArray(e) || (e = [e].filter((e) => !!e)), e);
    function n(t) {
      let s;
      return t &&
        "string" == typeof t &&
        e.isElement &&
        ((s = e.el.shadowRoot.querySelector(t)), s)
        ? s
        : (t &&
            ("string" == typeof t && (s = [...document.querySelectorAll(t)]),
            e.params.uniqueNavElements &&
              "string" == typeof t &&
              s.length > 1 &&
              1 === e.el.querySelectorAll(t).length &&
              (s = e.el.querySelector(t))),
          t && !s ? t : s);
    }
    function a(t, s) {
      const i = e.params.navigation;
      (t = r(t)).forEach((t) => {
        t &&
          (t.classList[s ? "add" : "remove"](...i.disabledClass.split(" ")),
          "BUTTON" === t.tagName && (t.disabled = s),
          e.params.watchOverflow &&
            e.enabled &&
            t.classList[e.isLocked ? "add" : "remove"](i.lockClass));
      });
    }
    function o() {
      const { nextEl: t, prevEl: s } = e.navigation;
      if (e.params.loop) return a(s, !1), void a(t, !1);
      a(s, e.isBeginning && !e.params.rewind),
        a(t, e.isEnd && !e.params.rewind);
    }
    function l(t) {
      t.preventDefault(),
        (!e.isBeginning || e.params.loop || e.params.rewind) &&
          (e.slidePrev(), i("navigationPrev"));
    }
    function d(t) {
      t.preventDefault(),
        (!e.isEnd || e.params.loop || e.params.rewind) &&
          (e.slideNext(), i("navigationNext"));
    }
    function c() {
      const t = e.params.navigation;
      if (
        ((e.params.navigation = (function (e, t, s, i) {
          return (
            e.params.createElements &&
              Object.keys(i).forEach((r) => {
                if (!s[r] && !0 === s.auto) {
                  let n = E(e.el, `.${i[r]}`)[0];
                  n ||
                    ((n = x("div", i[r])),
                    (n.className = i[r]),
                    e.el.append(n)),
                    (s[r] = n),
                    (t[r] = n);
                }
              }),
            s
          );
        })(e, e.originalParams.navigation, e.params.navigation, {
          nextEl: "swiper-button-next",
          prevEl: "swiper-button-prev",
        })),
        !t.nextEl && !t.prevEl)
      )
        return;
      let s = n(t.nextEl),
        i = n(t.prevEl);
      Object.assign(e.navigation, { nextEl: s, prevEl: i }),
        (s = r(s)),
        (i = r(i));
      const a = (s, i) => {
        s && s.addEventListener("click", "next" === i ? d : l),
          !e.enabled && s && s.classList.add(...t.lockClass.split(" "));
      };
      s.forEach((e) => a(e, "next")), i.forEach((e) => a(e, "prev"));
    }
    function p() {
      let { nextEl: t, prevEl: s } = e.navigation;
      (t = r(t)), (s = r(s));
      const i = (t, s) => {
        t.removeEventListener("click", "next" === s ? d : l),
          t.classList.remove(...e.params.navigation.disabledClass.split(" "));
      };
      t.forEach((e) => i(e, "next")), s.forEach((e) => i(e, "prev"));
    }
    s("init", () => {
      !1 === e.params.navigation.enabled ? u() : (c(), o());
    }),
      s("toEdge fromEdge lock unlock", () => {
        o();
      }),
      s("destroy", () => {
        p();
      }),
      s("enable disable", () => {
        let { nextEl: t, prevEl: s } = e.navigation;
        (t = r(t)),
          (s = r(s)),
          [...t, ...s]
            .filter((e) => !!e)
            .forEach((t) =>
              t.classList[e.enabled ? "remove" : "add"](
                e.params.navigation.lockClass
              )
            );
      }),
      s("click", (t, s) => {
        let { nextEl: n, prevEl: a } = e.navigation;
        (n = r(n)), (a = r(a));
        const o = s.target;
        if (
          e.params.navigation.hideOnClick &&
          !a.includes(o) &&
          !n.includes(o)
        ) {
          if (
            e.pagination &&
            e.params.pagination &&
            e.params.pagination.clickable &&
            (e.pagination.el === o || e.pagination.el.contains(o))
          )
            return;
          let t;
          n.length
            ? (t = n[0].classList.contains(e.params.navigation.hiddenClass))
            : a.length &&
              (t = a[0].classList.contains(e.params.navigation.hiddenClass)),
            i(!0 === t ? "navigationShow" : "navigationHide"),
            [...n, ...a]
              .filter((e) => !!e)
              .forEach((t) =>
                t.classList.toggle(e.params.navigation.hiddenClass)
              );
        }
      });
    const u = () => {
      e.el.classList.add(
        ...e.params.navigation.navigationDisabledClass.split(" ")
      ),
        p();
    };
    Object.assign(e.navigation, {
      enable: () => {
        e.el.classList.remove(
          ...e.params.navigation.navigationDisabledClass.split(" ")
        ),
          c(),
          o();
      },
      disable: u,
      update: o,
      init: c,
      destroy: p,
    });
  }
  function ae({ swiper: e, extendParams: t, on: s, emit: i, params: r }) {
    let n, a;
    (e.autoplay = { running: !1, paused: !1, timeLeft: 0 }),
      t({
        autoplay: {
          enabled: !1,
          delay: 3e3,
          waitForTransition: !0,
          disableOnInteraction: !0,
          stopOnLastSlide: !1,
          reverseDirection: !1,
          pauseOnMouseEnter: !1,
        },
      });
    let o,
      l,
      d,
      c,
      p,
      u,
      h,
      f = r && r.autoplay ? r.autoplay.delay : 3e3,
      g = r && r.autoplay ? r.autoplay.delay : 3e3,
      v = new Date().getTime;
    function w(t) {
      e &&
        !e.destroyed &&
        e.wrapperEl &&
        t.target === e.wrapperEl &&
        (e.wrapperEl.removeEventListener("transitionend", w), x());
    }
    const b = () => {
        if (e.destroyed || !e.autoplay.running) return;
        e.autoplay.paused ? (l = !0) : l && ((g = o), (l = !1));
        const t = e.autoplay.paused ? o : v + g - new Date().getTime();
        (e.autoplay.timeLeft = t),
          i("autoplayTimeLeft", t, t / f),
          (a = requestAnimationFrame(() => {
            b();
          }));
      },
      y = (t) => {
        if (e.destroyed || !e.autoplay.running) return;
        cancelAnimationFrame(a), b();
        let s = void 0 === t ? e.params.autoplay.delay : t;
        (f = e.params.autoplay.delay), (g = e.params.autoplay.delay);
        const r = (() => {
          let t;
          if (
            ((t =
              e.virtual && e.params.virtual.enabled
                ? e.slides.filter((e) =>
                    e.classList.contains("swiper-slide-active")
                  )[0]
                : e.slides[e.activeIndex]),
            !t)
          )
            return;
          return parseInt(t.getAttribute("data-swiper-autoplay"), 10);
        })();
        !Number.isNaN(r) &&
          r > 0 &&
          void 0 === t &&
          ((s = r), (f = r), (g = r)),
          (o = s);
        const l = e.params.speed,
          d = () => {
            e &&
              !e.destroyed &&
              (e.params.autoplay.reverseDirection
                ? !e.isBeginning || e.params.loop || e.params.rewind
                  ? (e.slidePrev(l, !0, !0), i("autoplay"))
                  : e.params.autoplay.stopOnLastSlide ||
                    (e.slideTo(e.slides.length - 1, l, !0, !0), i("autoplay"))
                : !e.isEnd || e.params.loop || e.params.rewind
                ? (e.slideNext(l, !0, !0), i("autoplay"))
                : e.params.autoplay.stopOnLastSlide ||
                  (e.slideTo(0, l, !0, !0), i("autoplay")),
              e.params.cssMode &&
                ((v = new Date().getTime()),
                requestAnimationFrame(() => {
                  y();
                })));
          };
        return (
          s > 0
            ? (clearTimeout(n),
              (n = setTimeout(() => {
                d();
              }, s)))
            : requestAnimationFrame(() => {
                d();
              }),
          s
        );
      },
      S = () => {
        (e.autoplay.running = !0), y(), i("autoplayStart");
      },
      T = () => {
        (e.autoplay.running = !1),
          clearTimeout(n),
          cancelAnimationFrame(a),
          i("autoplayStop");
      },
      E = (t, s) => {
        if (e.destroyed || !e.autoplay.running) return;
        clearTimeout(n), t || (h = !0);
        const r = () => {
          i("autoplayPause"),
            e.params.autoplay.waitForTransition
              ? e.wrapperEl.addEventListener("transitionend", w)
              : x();
        };
        if (((e.autoplay.paused = !0), s))
          return u && (o = e.params.autoplay.delay), (u = !1), void r();
        const a = o || e.params.autoplay.delay;
        (o = a - (new Date().getTime() - v)),
          (e.isEnd && o < 0 && !e.params.loop) || (o < 0 && (o = 0), r());
      },
      x = () => {
        (e.isEnd && o < 0 && !e.params.loop) ||
          e.destroyed ||
          !e.autoplay.running ||
          ((v = new Date().getTime()),
          h ? ((h = !1), y(o)) : y(),
          (e.autoplay.paused = !1),
          i("autoplayResume"));
      },
      C = () => {
        if (e.destroyed || !e.autoplay.running) return;
        const t = m();
        "hidden" === t.visibilityState && ((h = !0), E(!0)),
          "visible" === t.visibilityState && x();
      },
      P = (e) => {
        "mouse" === e.pointerType && ((h = !0), E(!0));
      },
      L = (t) => {
        "mouse" === t.pointerType && e.autoplay.paused && x();
      };
    s("init", () => {
      e.params.autoplay.enabled &&
        (e.params.autoplay.pauseOnMouseEnter &&
          (e.el.addEventListener("pointerenter", P),
          e.el.addEventListener("pointerleave", L)),
        m().addEventListener("visibilitychange", C),
        (v = new Date().getTime()),
        S());
    }),
      s("destroy", () => {
        e.el.removeEventListener("pointerenter", P),
          e.el.removeEventListener("pointerleave", L),
          m().removeEventListener("visibilitychange", C),
          e.autoplay.running && T();
      }),
      s("beforeTransitionStart", (t, s, i) => {
        !e.destroyed &&
          e.autoplay.running &&
          (i || !e.params.autoplay.disableOnInteraction ? E(!0, !0) : T());
      }),
      s("sliderFirstMove", () => {
        !e.destroyed &&
          e.autoplay.running &&
          (e.params.autoplay.disableOnInteraction
            ? T()
            : ((d = !0),
              (c = !1),
              (h = !1),
              (p = setTimeout(() => {
                (h = !0), (c = !0), E(!0);
              }, 200))));
      }),
      s("touchEnd", () => {
        if (!e.destroyed && e.autoplay.running && d) {
          if (
            (clearTimeout(p),
            clearTimeout(n),
            e.params.autoplay.disableOnInteraction)
          )
            return (c = !1), void (d = !1);
          c && e.params.cssMode && x(), (c = !1), (d = !1);
        }
      }),
      s("slideChange", () => {
        !e.destroyed && e.autoplay.running && (u = !0);
      }),
      Object.assign(e.autoplay, { start: S, stop: T, pause: E, resume: x });
  }
  function oe({ swiper: e, extendParams: t, on: s }) {
    t({
      thumbs: {
        swiper: null,
        multipleActiveThumbs: !0,
        autoScrollOffset: 0,
        slideThumbActiveClass: "swiper-slide-thumb-active",
        thumbsContainerClass: "swiper-thumbs",
      },
    });
    let i = !1,
      r = !1;
    function n() {
      const t = e.thumbs.swiper;
      if (!t || t.destroyed) return;
      const s = t.clickedIndex,
        i = t.clickedSlide;
      if (i && i.classList.contains(e.params.thumbs.slideThumbActiveClass))
        return;
      if (null == s) return;
      let r;
      (r = t.params.loop
        ? parseInt(t.clickedSlide.getAttribute("data-swiper-slide-index"), 10)
        : s),
        e.params.loop ? e.slideToLoop(r) : e.slideTo(r);
    }
    function a() {
      const { thumbs: t } = e.params;
      if (i) return !1;
      i = !0;
      const s = e.constructor;
      if (t.swiper instanceof s)
        (e.thumbs.swiper = t.swiper),
          Object.assign(e.thumbs.swiper.originalParams, {
            watchSlidesProgress: !0,
            slideToClickedSlide: !1,
          }),
          Object.assign(e.thumbs.swiper.params, {
            watchSlidesProgress: !0,
            slideToClickedSlide: !1,
          }),
          e.thumbs.swiper.update();
      else if (b(t.swiper)) {
        const i = Object.assign({}, t.swiper);
        Object.assign(i, { watchSlidesProgress: !0, slideToClickedSlide: !1 }),
          (e.thumbs.swiper = new s(i)),
          (r = !0);
      }
      return (
        e.thumbs.swiper.el.classList.add(e.params.thumbs.thumbsContainerClass),
        e.thumbs.swiper.on("tap", n),
        !0
      );
    }
    function o(t) {
      const s = e.thumbs.swiper;
      if (!s || s.destroyed) return;
      const i =
        "auto" === s.params.slidesPerView
          ? s.slidesPerViewDynamic()
          : s.params.slidesPerView;
      let r = 1;
      const n = e.params.thumbs.slideThumbActiveClass;
      if (
        (e.params.slidesPerView > 1 &&
          !e.params.centeredSlides &&
          (r = e.params.slidesPerView),
        e.params.thumbs.multipleActiveThumbs || (r = 1),
        (r = Math.floor(r)),
        s.slides.forEach((e) => e.classList.remove(n)),
        s.params.loop || (s.params.virtual && s.params.virtual.enabled))
      )
        for (let t = 0; t < r; t += 1)
          E(
            s.slidesEl,
            `[data-swiper-slide-index="${e.realIndex + t}"]`
          ).forEach((e) => {
            e.classList.add(n);
          });
      else
        for (let t = 0; t < r; t += 1)
          s.slides[e.realIndex + t] &&
            s.slides[e.realIndex + t].classList.add(n);
      const a = e.params.thumbs.autoScrollOffset,
        o = a && !s.params.loop;
      if (e.realIndex !== s.realIndex || o) {
        const r = s.activeIndex;
        let n, l;
        if (s.params.loop) {
          const t = s.slides.filter(
            (t) =>
              t.getAttribute("data-swiper-slide-index") === `${e.realIndex}`
          )[0];
          (n = s.slides.indexOf(t)),
            (l = e.activeIndex > e.previousIndex ? "next" : "prev");
        } else (n = e.realIndex), (l = n > e.previousIndex ? "next" : "prev");
        o && (n += "next" === l ? a : -1 * a),
          s.visibleSlidesIndexes &&
            s.visibleSlidesIndexes.indexOf(n) < 0 &&
            (s.params.centeredSlides
              ? (n =
                  n > r ? n - Math.floor(i / 2) + 1 : n + Math.floor(i / 2) - 1)
              : n > r && s.params.slidesPerGroup,
            s.slideTo(n, t ? 0 : void 0));
      }
    }
    (e.thumbs = { swiper: null }),
      s("beforeInit", () => {
        const { thumbs: t } = e.params;
        if (t && t.swiper)
          if ("string" == typeof t.swiper || t.swiper instanceof HTMLElement) {
            const s = m(),
              i = () => {
                const i =
                  "string" == typeof t.swiper
                    ? s.querySelector(t.swiper)
                    : t.swiper;
                if (i && i.swiper) (t.swiper = i.swiper), a(), o(!0);
                else if (i) {
                  const s = (r) => {
                    (t.swiper = r.detail[0]),
                      i.removeEventListener("init", s),
                      a(),
                      o(!0),
                      t.swiper.update(),
                      e.update();
                  };
                  i.addEventListener("init", s);
                }
                return i;
              },
              r = () => {
                if (e.destroyed) return;
                i() || requestAnimationFrame(r);
              };
            requestAnimationFrame(r);
          } else a(), o(!0);
      }),
      s("slideChange update resize observerUpdate", () => {
        o();
      }),
      s("setTransition", (t, s) => {
        const i = e.thumbs.swiper;
        i && !i.destroyed && i.setTransition(s);
      }),
      s("beforeDestroy", () => {
        const t = e.thumbs.swiper;
        t && !t.destroyed && r && t.destroy();
      }),
      Object.assign(e.thumbs, { init: a, update: o });
  }
  window.addEventListener("load", function (e) {
    !(function () {
      if (
        (document.querySelector(".block-slider__slider") &&
          new re(".block-slider__slider", {
            modules: [ae, ne, oe],
            grabCursor: !0,
            observer: !0,
            observeParents: !0,
            slidesPerView: 1,
            spaceBetween: 0,
            autoHeight: !0,
            speed: 500,
            loop: !0,
            navigation: { nextEl: ".arrow_next", prevEl: ".arrow_prev" },
            thumbs: {
              swiper: ".block03__swiper",
              slideThumbActiveClass: "block03__product_active",
            },
            breakpoints: {
              320: { slidesPerView: 1, spaceBetween: 30 },
              992: { slidesPerView: 1, spaceBetween: 0 },
            },
            on: {},
          }),
        document.querySelector(".block03__swiper") &&
          new re(".block03__swiper", {
            observer: !0,
            observeParents: !0,
            slidesPerView: 1,
            spaceBetween: 0,
            loop: !0,
            breakpoints: {
              320: { slidesPerView: 1, spaceBetween: 0 },
              992: { slidesPerView: 4, spaceBetween: 0 },
            },
          }),
        document.querySelector(".test-form"))
      ) {
        new re(".test-form", {
          observer: !0,
          observeParents: !0,
          slidesPerView: 1,
          spaceBetween: 0,
          autoHeight: !0,
          simulateTouch: !1,
          touchRatio: 0,
        });
        const e = "OptiMeal Kids рекомендует",
          t = document.getElementById("header-block"),
          s = document.querySelector(".test-form").swiper,
          i = document.querySelector(".test-form__button"),
          r = document.querySelectorAll(".test-form__item");
        let n = 0,
          a = [];
        const o = document.querySelectorAll(".test-form label");
        function l() {
          d(n)
            ? (c(n),
              n++,
              s.slideNext(),
              5 === n && (i.innerText = "Завершить тест"),
              6 === n && ((i.style.display = "none"), (t.innerText = e), p(a)))
            : r[n].querySelectorAll("label").forEach((e) => {
                e.classList.add("_error");
              });
        }
        function d(e) {
          return 0 != r[e].querySelectorAll("input:checked").length;
        }
        function c(e) {
          const t = r[e].querySelector("input:checked").value.split("-");
          a = a.concat(t);
        }
        function p(e) {
          const t = document.querySelector(".final").children;
          let s = Array.from(new Set(e));
          if (((s = s.map((e) => Number(e))), s.includes(0) && 1 === s.length))
            t[0].classList.remove("final__item_hide");
          else
            for (let e = 1; e <= 4; e++)
              s.includes(e) && t[e].classList.remove("final__item_hide");
        }
        o.forEach((e) =>
          e.addEventListener("click", () =>
            o.forEach((e) => e.classList.remove("_error"))
          )
        ),
          i.addEventListener("click", l);
      }
    })();
  });
  let le = !1;
  setTimeout(() => {
    if (le) {
      let e = new Event("windowScroll");
      window.addEventListener("scroll", function (t) {
        document.dispatchEvent(e);
      });
    }
  }, 0),
    document.addEventListener("DOMContentLoaded", () => {
      let e = window.innerWidth;
      gsap.registerPlugin(ScrollTrigger);
      if (
        (gsap
          .timeline()
          .fromTo(
            ".pic__cloud-left",
            { xPercent: -100, opacity: 0 },
            { xPercent: 0, duration: 1.5, opacity: 1 },
            0.4
          )
          .fromTo(
            ".pic__cloud-right",
            { xPercent: 100, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.5 },
            0.4
          )
          .from(
            ".pic__bush-left",
            { yPercent: 100, duration: 1, ease: "expo" },
            0.4
          )
          .from(
            ".pic__bush-right",
            { yPercent: 100, duration: 1, ease: "expo" },
            0.4
          )
          .fromTo(
            ".pic__tree-left",
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, ease: "elastic", duration: 3 },
            0.8
          )
          .fromTo(
            ".pic__tree-right",
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, ease: "elastic", duration: 3 },
            0.7
          )
          .from(
            ".pic__vitamins",
            { opacity: 0, xPercent: 50, duration: 3 },
            0.9
          )
          .from(".header", { yPercent: -100, opacity: 0, duration: 1 }, 1)
          .fromTo(
            ".top-block__content > *",
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 1, stagger: 0.15 },
            0.9
          ),
        window.innerWidth > 992)
      )
        gsap.fromTo(
          ".block02__item",
          { opacity: 0, yPercent: 50 },
          {
            opacity: 1,
            yPercent: 0,
            stagger: 0.5,
            duration: 2,
            scrollTrigger: {
              trigger: ".block02",
              start: "5% 50%",
              end: "-50% 70%",
              scrub: !0,
              endTrigger: ".block03",
            },
          }
        ),
          gsap.fromTo(
            ".block04__img",
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "power1",
              duration: 10,
              scrollTrigger: {
                trigger: ".block04",
                start: "center 90%",
                end: "80% 90%",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".block05__img img",
            { x: -300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: ".block05",
                start: "top 90%",
                end: "90% bottom",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".block05__content",
            { x: 300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: ".block05",
                start: "top 90%",
                end: "90% bottom",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".footer__form > *",
            { x: -300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 1,
              duration: 2,
              scrollTrigger: {
                trigger: ".footer",
                start: "top center",
                end: "70% bottom",
                scrub: !0,
              },
            }
          );
      else if (e >= 768 && e < 991) {
        document.querySelectorAll(".block02__item").forEach((e) => {
          gsap.fromTo(
            e,
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              stagger: 5,
              duration: 2,
              scrollTrigger: {
                trigger: e,
                start: "-10% 90%",
                end: "60% 90%",
                scrub: !0,
              },
            }
          );
        }),
          gsap.fromTo(
            ".block04__img",
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "power1",
              duration: 2,
              scrollTrigger: {
                trigger: ".block04",
                start: "30% 90%",
                end: "+=200px 90%",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".block05__img img",
            { x: -300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: ".block05__img img",
                start: "top 90%",
                end: "90% bottom",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".block05__content",
            { x: 300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: ".block05",
                start: "top 90%",
                end: "bottom 80%",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".footer__form > *",
            { x: -300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 1,
              duration: 2,
              scrollTrigger: {
                trigger: ".footer",
                start: "top center",
                end: "+200px center",
                scrub: !0,
              },
            }
          );
      } else if (e >= 320 && e < 767) {
        document.querySelectorAll(".block02__item").forEach((e) => {
          gsap.fromTo(
            e,
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              stagger: 5,
              duration: 2,
              scrollTrigger: {
                trigger: e,
                start: "-10% 90%",
                end: "30% 90%",
                scrub: !0,
              },
            }
          );
        }),
          gsap.fromTo(
            ".block04__img",
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "power1",
              duration: 2,
              scrollTrigger: {
                trigger: ".block04",
                start: "30% center",
                end: "+=200px center",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".block05__img img",
            { x: -300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: ".block05__img img",
                start: "top 90%",
                end: "90% bottom",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".block05__content",
            { x: 300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: ".block05",
                start: "top 90%",
                end: "bottom 80%",
                scrub: !0,
              },
            }
          ),
          gsap.fromTo(
            ".footer__form > *",
            { x: -300, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 1,
              duration: 2,
              scrollTrigger: {
                trigger: ".footer",
                start: "top center",
                end: "+150px center",
                scrub: !0,
              },
            }
          );
      }
    }),
    (window.FLS = !0),
    (function (e) {
      let t = new Image();
      (t.onload = t.onerror =
        function () {
          e(2 == t.height);
        }),
        (t.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (e) {
      let t = !0 === e ? "webp" : "no-webp";
      document.documentElement.classList.add(t);
    }),
    t.any() && document.documentElement.classList.add("touch"),
    new e({}),
    (function () {
      const e = document.querySelectorAll(
        "input[placeholder],textarea[placeholder]"
      );
      e.length &&
        e.forEach((e) => {
          e.dataset.placeholder = e.placeholder;
        }),
        document.body.addEventListener("focusin", function (e) {
          const t = e.target;
          ("INPUT" !== t.tagName && "TEXTAREA" !== t.tagName) ||
            (t.dataset.placeholder && (t.placeholder = ""),
            t.classList.add("_form-focus"),
            t.parentElement.classList.add("_form-focus"),
            d.removeError(t));
        }),
        document.body.addEventListener("focusout", function (e) {
          const t = e.target;
          ("INPUT" !== t.tagName && "TEXTAREA" !== t.tagName) ||
            (t.dataset.placeholder && (t.placeholder = t.dataset.placeholder),
            t.classList.remove("_form-focus"),
            t.parentElement.classList.remove("_form-focus"),
            t.hasAttribute("data-validate") && d.validateInput(t));
        });
    })(),
    (function (e) {
      const t = document.forms;
      if (t.length)
        for (const e of t)
          e.addEventListener("submit", function (e) {
            s(e.target, e);
          }),
            e.addEventListener("reset", function (e) {
              const t = e.target;
              d.formClean(t);
            });
      async function s(t, s) {
        if (0 === (e ? d.getErrors(t) : 0)) {
          if (t.hasAttribute("data-ajax")) {
            s.preventDefault();
            const e = t.getAttribute("action")
                ? t.getAttribute("action").trim()
                : "#",
              r = t.getAttribute("method")
                ? t.getAttribute("method").trim()
                : "GET",
              n = new FormData(t);
            t.classList.add("_sending");
            const a = await fetch(e, { method: r, body: n });
            if (a.ok) {
              await a.json();
              t.classList.remove("_sending"), i(t);
            } else alert("Ошибка"), t.classList.remove("_sending");
          } else t.hasAttribute("data-dev") && (s.preventDefault(), i(t));
        } else {
          s.preventDefault();
          const e = t.querySelector("._form-error");
          e && t.hasAttribute("data-goto-error") && o(e, !0, 1e3);
        }
      }
      function i(e) {
        document.dispatchEvent(
          new CustomEvent("formSent", { detail: { form: e } })
        ),
          d.formClean(e),
          a(`[Формы]: ${"Форма отправлена!"}`);
      }
    })(!0),
    (function () {
      function e(e) {
        if ("click" === e.type) {
          const t = e.target;
          if (t.closest("[data-goto]")) {
            const s = t.closest("[data-goto]"),
              i = s.dataset.goto ? s.dataset.goto : "",
              r = !!s.hasAttribute("data-goto-header"),
              n = s.dataset.gotoSpeed ? s.dataset.gotoSpeed : "500";
            o(i, r, n), e.preventDefault();
          }
        } else if ("watcherCallback" === e.type && e.detail) {
          const t = e.detail.entry,
            s = t.target;
          if ("navigator" === s.dataset.watch) {
            const e = s.id,
              i =
                (document.querySelector("[data-goto]._navigator-active"),
                document.querySelector(`[data-goto="${e}"]`));
            t.isIntersecting
              ? i && i.classList.add("_navigator-active")
              : i && i.classList.remove("_navigator-active");
          }
        }
      }
      document.addEventListener("click", e),
        document.addEventListener("watcherCallback", e);
    })();
})();
