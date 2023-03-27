(() => {
  "use strict";
  let e = {
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
        e.Android() || e.BlackBerry() || e.iOS() || e.Opera() || e.Windows()
      );
    },
  };
  function t(e) {
    return (
      null !== e &&
      "object" == typeof e &&
      "constructor" in e &&
      e.constructor === Object
    );
  }
  function s(e = {}, i = {}) {
    Object.keys(i).forEach((r) => {
      void 0 === e[r]
        ? (e[r] = i[r])
        : t(i[r]) && t(e[r]) && Object.keys(i[r]).length > 0 && s(e[r], i[r]);
    });
  }
  const i = {
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
  function r() {
    const e = "undefined" != typeof document ? document : {};
    return s(e, i), e;
  }
  const n = {
    document: i,
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
  function a() {
    const e = "undefined" != typeof window ? window : {};
    return s(e, n), e;
  }
  function l(e, t = 0) {
    return setTimeout(e, t);
  }
  function o() {
    return Date.now();
  }
  function d(e, t = "x") {
    const s = a();
    let i, r, n;
    const l = (function (e) {
      const t = a();
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
        ? ((r = l.transform || l.webkitTransform),
          r.split(",").length > 6 &&
            (r = r
              .split(", ")
              .map((e) => e.replace(",", "."))
              .join(", ")),
          (n = new s.WebKitCSSMatrix("none" === r ? "" : r)))
        : ((n =
            l.MozTransform ||
            l.OTransform ||
            l.MsTransform ||
            l.msTransform ||
            l.transform ||
            l
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
  function c(e) {
    return (
      "object" == typeof e &&
      null !== e &&
      e.constructor &&
      "Object" === Object.prototype.toString.call(e).slice(8, -1)
    );
  }
  function p(...e) {
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
            (c(t[i]) && c(n[i])
              ? n[i].__swiper__
                ? (t[i] = n[i])
                : p(t[i], n[i])
              : !c(t[i]) && c(n[i])
              ? ((t[i] = {}), n[i].__swiper__ ? (t[i] = n[i]) : p(t[i], n[i]))
              : (t[i] = n[i]));
        }
      }
    }
    var i;
    return t;
  }
  function u(e, t, s) {
    e.style.setProperty(t, s);
  }
  function m({ swiper: e, targetPosition: t, side: s }) {
    const i = a(),
      r = -e.translate;
    let n,
      l = null;
    const o = e.params.speed;
    (e.wrapperEl.style.scrollSnapType = "none"),
      i.cancelAnimationFrame(e.cssModeFrameID);
    const d = t > r ? "next" : "prev",
      c = (e, t) => ("next" === d && e >= t) || ("prev" === d && e <= t),
      p = () => {
        (n = new Date().getTime()), null === l && (l = n);
        const a = Math.max(Math.min((n - l) / o, 1), 0),
          d = 0.5 - Math.cos(a * Math.PI) / 2;
        let u = r + d * (t - r);
        if ((c(u, t) && (u = t), e.wrapperEl.scrollTo({ [s]: u }), c(u, t)))
          return (
            (e.wrapperEl.style.overflow = "hidden"),
            (e.wrapperEl.style.scrollSnapType = ""),
            setTimeout(() => {
              (e.wrapperEl.style.overflow = ""),
                e.wrapperEl.scrollTo({ [s]: u });
            }),
            void i.cancelAnimationFrame(e.cssModeFrameID)
          );
        e.cssModeFrameID = i.requestAnimationFrame(p);
      };
    p();
  }
  function f(e, t = "") {
    return [...e.children].filter((e) => e.matches(t));
  }
  function h(e, t = []) {
    const s = document.createElement(e);
    return s.classList.add(...(Array.isArray(t) ? t : [t])), s;
  }
  function v(e, t) {
    return a().getComputedStyle(e, null).getPropertyValue(t);
  }
  function g(e) {
    let t,
      s = e;
    if (s) {
      for (t = 0; null !== (s = s.previousSibling); )
        1 === s.nodeType && (t += 1);
      return t;
    }
  }
  function w(e, t, s) {
    const i = a();
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
  let b, S, T;
  function y() {
    return (
      b ||
        (b = (function () {
          const e = a(),
            t = r();
          return {
            smoothScroll:
              t.documentElement && "scrollBehavior" in t.documentElement.style,
            touch: !!(
              "ontouchstart" in e ||
              (e.DocumentTouch && t instanceof e.DocumentTouch)
            ),
          };
        })()),
      b
    );
  }
  function x(e = {}) {
    return (
      S ||
        (S = (function ({ userAgent: e } = {}) {
          const t = y(),
            s = a(),
            i = s.navigator.platform,
            r = e || s.navigator.userAgent,
            n = { ios: !1, android: !1 },
            l = s.screen.width,
            o = s.screen.height,
            d = r.match(/(Android);?[\s\/]+([\d.]+)?/);
          let c = r.match(/(iPad).*OS\s([\d_]+)/);
          const p = r.match(/(iPod)(.*OS\s([\d_]+))?/),
            u = !c && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
            m = "Win32" === i;
          let f = "MacIntel" === i;
          return (
            !c &&
              f &&
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
              ].indexOf(`${l}x${o}`) >= 0 &&
              ((c = r.match(/(Version)\/([\d.]+)/)),
              c || (c = [0, 1, "13_0_0"]),
              (f = !1)),
            d && !m && ((n.os = "android"), (n.android = !0)),
            (c || u || p) && ((n.os = "ios"), (n.ios = !0)),
            n
          );
        })(e)),
      S
    );
  }
  function E() {
    return (
      T ||
        (T = (function () {
          const e = a();
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
      T
    );
  }
  const C = {
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
  const M = {
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
            parseInt(v(i, "padding-left") || 0, 10) -
            parseInt(v(i, "padding-right") || 0, 10)),
          (s =
            s -
            parseInt(v(i, "padding-top") || 0, 10) -
            parseInt(v(i, "padding-bottom") || 0, 10)),
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
          rtlTranslate: l,
          wrongRTL: o,
        } = e,
        d = e.virtual && i.virtual.enabled,
        c = d ? e.virtual.slides.length : e.slides.length,
        p = f(n, `.${e.params.slideClass}, swiper-slide`),
        m = d ? e.virtual.slides.length : p.length;
      let h = [];
      const g = [],
        b = [];
      let S = i.slidesOffsetBefore;
      "function" == typeof S && (S = i.slidesOffsetBefore.call(e));
      let T = i.slidesOffsetAfter;
      "function" == typeof T && (T = i.slidesOffsetAfter.call(e));
      const y = e.snapGrid.length,
        x = e.slidesGrid.length;
      let E = i.spaceBetween,
        C = -S,
        M = 0,
        P = 0;
      if (void 0 === a) return;
      "string" == typeof E &&
        E.indexOf("%") >= 0 &&
        (E = (parseFloat(E.replace("%", "")) / 100) * a),
        (e.virtualSize = -E),
        p.forEach((e) => {
          l ? (e.style.marginLeft = "") : (e.style.marginRight = ""),
            (e.style.marginBottom = ""),
            (e.style.marginTop = "");
        }),
        i.centeredSlides &&
          i.cssMode &&
          (u(r, "--swiper-centered-offset-before", ""),
          u(r, "--swiper-centered-offset-after", ""));
      const L = i.grid && i.grid.rows > 1 && e.grid;
      let k;
      L && e.grid.initSlides(m);
      const A =
        "auto" === i.slidesPerView &&
        i.breakpoints &&
        Object.keys(i.breakpoints).filter(
          (e) => void 0 !== i.breakpoints[e].slidesPerView
        ).length > 0;
      for (let r = 0; r < m; r += 1) {
        let n;
        if (
          ((k = 0),
          p[r] && (n = p[r]),
          L && e.grid.updateSlide(r, n, m, t),
          !p[r] || "none" !== v(n, "display"))
        ) {
          if ("auto" === i.slidesPerView) {
            A && (p[r].style[t("width")] = "");
            const a = getComputedStyle(n),
              l = n.style.transform,
              o = n.style.webkitTransform;
            if (
              (l && (n.style.transform = "none"),
              o && (n.style.webkitTransform = "none"),
              i.roundLengths)
            )
              k = e.isHorizontal() ? w(n, "width", !0) : w(n, "height", !0);
            else {
              const e = s(a, "width"),
                t = s(a, "padding-left"),
                i = s(a, "padding-right"),
                r = s(a, "margin-left"),
                l = s(a, "margin-right"),
                o = a.getPropertyValue("box-sizing");
              if (o && "border-box" === o) k = e + r + l;
              else {
                const { clientWidth: s, offsetWidth: a } = n;
                k = e + t + i + r + l + (a - s);
              }
            }
            l && (n.style.transform = l),
              o && (n.style.webkitTransform = o),
              i.roundLengths && (k = Math.floor(k));
          } else
            (k = (a - (i.slidesPerView - 1) * E) / i.slidesPerView),
              i.roundLengths && (k = Math.floor(k)),
              p[r] && (p[r].style[t("width")] = `${k}px`);
          p[r] && (p[r].swiperSlideSize = k),
            b.push(k),
            i.centeredSlides
              ? ((C = C + k / 2 + M / 2 + E),
                0 === M && 0 !== r && (C = C - a / 2 - E),
                0 === r && (C = C - a / 2 - E),
                Math.abs(C) < 0.001 && (C = 0),
                i.roundLengths && (C = Math.floor(C)),
                P % i.slidesPerGroup == 0 && h.push(C),
                g.push(C))
              : (i.roundLengths && (C = Math.floor(C)),
                (P - Math.min(e.params.slidesPerGroupSkip, P)) %
                  e.params.slidesPerGroup ==
                  0 && h.push(C),
                g.push(C),
                (C = C + k + E)),
            (e.virtualSize += k + E),
            (M = k),
            (P += 1);
        }
      }
      if (
        ((e.virtualSize = Math.max(e.virtualSize, a) + T),
        l &&
          o &&
          ("slide" === i.effect || "coverflow" === i.effect) &&
          (r.style.width = `${e.virtualSize + i.spaceBetween}px`),
        i.setWrapperSize &&
          (r.style[t("width")] = `${e.virtualSize + i.spaceBetween}px`),
        L && e.grid.updateWrapperSize(k, h, t),
        !i.centeredSlides)
      ) {
        const t = [];
        for (let s = 0; s < h.length; s += 1) {
          let r = h[s];
          i.roundLengths && (r = Math.floor(r)),
            h[s] <= e.virtualSize - a && t.push(r);
        }
        (h = t),
          Math.floor(e.virtualSize - a) - Math.floor(h[h.length - 1]) > 1 &&
            h.push(e.virtualSize - a);
      }
      if (d && i.loop) {
        const t = b[0] + E;
        if (i.slidesPerGroup > 1) {
          const s = Math.ceil(
              (e.virtual.slidesBefore + e.virtual.slidesAfter) /
                i.slidesPerGroup
            ),
            r = t * i.slidesPerGroup;
          for (let e = 0; e < s; e += 1) h.push(h[h.length - 1] + r);
        }
        for (
          let s = 0;
          s < e.virtual.slidesBefore + e.virtual.slidesAfter;
          s += 1
        )
          1 === i.slidesPerGroup && h.push(h[h.length - 1] + t),
            g.push(g[g.length - 1] + t),
            (e.virtualSize += t);
      }
      if ((0 === h.length && (h = [0]), 0 !== i.spaceBetween)) {
        const s = e.isHorizontal() && l ? "marginLeft" : t("marginRight");
        p.filter(
          (e, t) => !(i.cssMode && !i.loop) || t !== p.length - 1
        ).forEach((e) => {
          e.style[s] = `${E}px`;
        });
      }
      if (i.centeredSlides && i.centeredSlidesBounds) {
        let e = 0;
        b.forEach((t) => {
          e += t + (i.spaceBetween ? i.spaceBetween : 0);
        }),
          (e -= i.spaceBetween);
        const t = e - a;
        h = h.map((e) => (e < 0 ? -S : e > t ? t + T : e));
      }
      if (i.centerInsufficientSlides) {
        let e = 0;
        if (
          (b.forEach((t) => {
            e += t + (i.spaceBetween ? i.spaceBetween : 0);
          }),
          (e -= i.spaceBetween),
          e < a)
        ) {
          const t = (a - e) / 2;
          h.forEach((e, s) => {
            h[s] = e - t;
          }),
            g.forEach((e, s) => {
              g[s] = e + t;
            });
        }
      }
      if (
        (Object.assign(e, {
          slides: p,
          snapGrid: h,
          slidesGrid: g,
          slidesSizesGrid: b,
        }),
        i.centeredSlides && i.cssMode && !i.centeredSlidesBounds)
      ) {
        u(r, "--swiper-centered-offset-before", -h[0] + "px"),
          u(
            r,
            "--swiper-centered-offset-after",
            e.size / 2 - b[b.length - 1] / 2 + "px"
          );
        const t = -e.snapGrid[0],
          s = -e.slidesGrid[0];
        (e.snapGrid = e.snapGrid.map((e) => e + t)),
          (e.slidesGrid = e.slidesGrid.map((e) => e + s));
      }
      if (
        (m !== c && e.emit("slidesLengthChange"),
        h.length !== y &&
          (e.params.watchOverflow && e.checkOverflow(),
          e.emit("snapGridLengthChange")),
        g.length !== x && e.emit("slidesGridLengthChange"),
        i.watchSlidesProgress && e.updateSlidesOffset(),
        !(d || i.cssMode || ("slide" !== i.effect && "fade" !== i.effect)))
      ) {
        const t = `${i.containerModifierClass}backface-hidden`,
          s = e.el.classList.contains(t);
        m <= i.maxBackfaceHiddenSlides
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
        const l = i[e];
        let o = l.swiperSlideOffset;
        s.cssMode && s.centeredSlides && (o -= i[0].swiperSlideOffset);
        const d =
            (a + (s.centeredSlides ? t.minTranslate() : 0) - o) /
            (l.swiperSlideSize + s.spaceBetween),
          c =
            (a - n[0] + (s.centeredSlides ? t.minTranslate() : 0) - o) /
            (l.swiperSlideSize + s.spaceBetween),
          p = -(a - o),
          u = p + t.slidesSizesGrid[e];
        ((p >= 0 && p < t.size - 1) ||
          (u > 1 && u <= t.size) ||
          (p <= 0 && u >= t.size)) &&
          (t.visibleSlides.push(l),
          t.visibleSlidesIndexes.push(e),
          i[e].classList.add(s.slideVisibleClass)),
          (l.progress = r ? -d : d),
          (l.originalProgress = r ? -c : c);
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
      let { progress: r, isBeginning: n, isEnd: a, progressLoop: l } = t;
      const o = n,
        d = a;
      if (0 === i) (r = 0), (n = !0), (a = !0);
      else {
        r = (e - t.minTranslate()) / i;
        const s = Math.abs(e - t.minTranslate()) < 1,
          l = Math.abs(e - t.maxTranslate()) < 1;
        (n = s || r <= 0), (a = l || r >= 1), s && (r = 0), l && (r = 1);
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
          o = Math.abs(e);
        (l = o >= r ? (o - r) / a : (o + a - n) / a), l > 1 && (l -= 1);
      }
      Object.assign(t, {
        progress: r,
        progressLoop: l,
        isBeginning: n,
        isEnd: a,
      }),
        (s.watchSlidesProgress || (s.centeredSlides && s.autoHeight)) &&
          t.updateSlidesProgress(e),
        n && !o && t.emit("reachBeginning toEdge"),
        a && !d && t.emit("reachEnd toEdge"),
        ((o && !n) || (d && !a)) && t.emit("fromEdge"),
        t.emit("progress", r);
    },
    updateSlidesClasses: function () {
      const e = this,
        { slides: t, params: s, slidesEl: i, activeIndex: r } = e,
        n = e.virtual && s.virtual.enabled,
        a = (e) => f(i, `.${s.slideClass}${e}, swiper-slide${e}`)[0];
      let l;
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
            (l = a(`[data-swiper-slide-index="${t}"]`));
        } else l = a(`[data-swiper-slide-index="${r}"]`);
      else l = t[r];
      if (l) {
        l.classList.add(s.slideActiveClass);
        let e = (function (e, t) {
          const s = [];
          for (; e.nextElementSibling; ) {
            const i = e.nextElementSibling;
            t ? i.matches(t) && s.push(i) : s.push(i), (e = i);
          }
          return s;
        })(l, `.${s.slideClass}, swiper-slide`)[0];
        s.loop && !e && (e = t[0]), e && e.classList.add(s.slideNextClass);
        let i = (function (e, t) {
          const s = [];
          for (; e.previousElementSibling; ) {
            const i = e.previousElementSibling;
            t ? i.matches(t) && s.push(i) : s.push(i), (e = i);
          }
          return s;
        })(l, `.${s.slideClass}, swiper-slide`)[0];
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
          snapIndex: l,
        } = t;
      let o,
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
        o = i.indexOf(s);
      else {
        const e = Math.min(r.slidesPerGroupSkip, d);
        o = e + Math.floor((d - e) / r.slidesPerGroup);
      }
      if ((o >= i.length && (o = i.length - 1), d === n))
        return (
          o !== l && ((t.snapIndex = o), t.emit("snapIndexChange")),
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
          snapIndex: o,
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
  const P = {
    getTranslate: function (e = this.isHorizontal() ? "x" : "y") {
      const { params: t, rtlTranslate: s, translate: i, wrapperEl: r } = this;
      if (t.virtualTranslate) return s ? -i : i;
      if (t.cssMode) return i;
      let n = d(r, e);
      return s && (n = -n), n || 0;
    },
    setTranslate: function (e, t) {
      const s = this,
        { rtlTranslate: i, params: r, wrapperEl: n, progress: a } = s;
      let l,
        o = 0,
        d = 0;
      s.isHorizontal() ? (o = i ? -e : e) : (d = e),
        r.roundLengths && ((o = Math.floor(o)), (d = Math.floor(d))),
        r.cssMode
          ? (n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal()
              ? -o
              : -d)
          : r.virtualTranslate ||
            (n.style.transform = `translate3d(${o}px, ${d}px, 0px)`),
        (s.previousTranslate = s.translate),
        (s.translate = s.isHorizontal() ? o : d);
      const c = s.maxTranslate() - s.minTranslate();
      (l = 0 === c ? 0 : (e - s.minTranslate()) / c),
        l !== a && s.updateProgress(e),
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
        { params: a, wrapperEl: l } = n;
      if (n.animating && a.preventInteractionOnTransition) return !1;
      const o = n.minTranslate(),
        d = n.maxTranslate();
      let c;
      if (
        ((c = i && e > o ? o : i && e < d ? d : e),
        n.updateProgress(c),
        a.cssMode)
      ) {
        const e = n.isHorizontal();
        if (0 === t) l[e ? "scrollLeft" : "scrollTop"] = -c;
        else {
          if (!n.support.smoothScroll)
            return (
              m({ swiper: n, targetPosition: -c, side: e ? "left" : "top" }), !0
            );
          l.scrollTo({ [e ? "left" : "top"]: -c, behavior: "smooth" });
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
  function L({ swiper: e, runCallbacks: t, direction: s, step: i }) {
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
  const k = {
    slideTo: function (e = 0, t = this.params.speed, s = !0, i, r) {
      "string" == typeof e && (e = parseInt(e, 10));
      const n = this;
      let a = e;
      a < 0 && (a = 0);
      const {
        params: l,
        snapGrid: o,
        slidesGrid: d,
        previousIndex: c,
        activeIndex: p,
        rtlTranslate: u,
        wrapperEl: f,
        enabled: h,
      } = n;
      if ((n.animating && l.preventInteractionOnTransition) || (!h && !i && !r))
        return !1;
      const v = Math.min(n.params.slidesPerGroupSkip, a);
      let g = v + Math.floor((a - v) / n.params.slidesPerGroup);
      g >= o.length && (g = o.length - 1);
      const w = -o[g];
      if (l.normalizeSlideIndex)
        for (let e = 0; e < d.length; e += 1) {
          const t = -Math.floor(100 * w),
            s = Math.floor(100 * d[e]),
            i = Math.floor(100 * d[e + 1]);
          void 0 !== d[e + 1]
            ? t >= s && t < i - (i - s) / 2
              ? (a = e)
              : t >= s && t < i && (a = e + 1)
            : t >= s && (a = e);
        }
      if (n.initialized && a !== p) {
        if (!n.allowSlideNext && w < n.translate && w < n.minTranslate())
          return !1;
        if (
          !n.allowSlidePrev &&
          w > n.translate &&
          w > n.maxTranslate() &&
          (p || 0) !== a
        )
          return !1;
      }
      let b;
      if (
        (a !== (c || 0) && s && n.emit("beforeSlideChangeStart"),
        n.updateProgress(w),
        (b = a > p ? "next" : a < p ? "prev" : "reset"),
        (u && -w === n.translate) || (!u && w === n.translate))
      )
        return (
          n.updateActiveIndex(a),
          l.autoHeight && n.updateAutoHeight(),
          n.updateSlidesClasses(),
          "slide" !== l.effect && n.setTranslate(w),
          "reset" !== b && (n.transitionStart(s, b), n.transitionEnd(s, b)),
          !1
        );
      if (l.cssMode) {
        const e = n.isHorizontal(),
          s = u ? w : -w;
        if (0 === t) {
          const t = n.virtual && n.params.virtual.enabled;
          t &&
            ((n.wrapperEl.style.scrollSnapType = "none"),
            (n._immediateVirtual = !0)),
            t && !n._cssModeVirtualInitialSet && n.params.initialSlide > 0
              ? ((n._cssModeVirtualInitialSet = !0),
                requestAnimationFrame(() => {
                  f[e ? "scrollLeft" : "scrollTop"] = s;
                }))
              : (f[e ? "scrollLeft" : "scrollTop"] = s),
            t &&
              requestAnimationFrame(() => {
                (n.wrapperEl.style.scrollSnapType = ""),
                  (n._immediateVirtual = !1);
              });
        } else {
          if (!n.support.smoothScroll)
            return (
              m({ swiper: n, targetPosition: s, side: e ? "left" : "top" }), !0
            );
          f.scrollTo({ [e ? "left" : "top"]: s, behavior: "smooth" });
        }
        return !0;
      }
      return (
        n.setTransition(t),
        n.setTranslate(w),
        n.updateActiveIndex(a),
        n.updateSlidesClasses(),
        n.emit("beforeTransitionStart", t, i),
        n.transitionStart(s, b),
        0 === t
          ? n.transitionEnd(s, b)
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
                  n.transitionEnd(s, b));
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
      let l = n.slidesPerGroup;
      "auto" === n.slidesPerView &&
        1 === n.slidesPerGroup &&
        n.slidesPerGroupAuto &&
        (l = Math.max(i.slidesPerViewDynamic("current", !0), 1));
      const o = i.activeIndex < n.slidesPerGroupSkip ? 1 : l,
        d = i.virtual && n.virtual.enabled;
      if (n.loop) {
        if (a && !d && n.loopPreventsSliding) return !1;
        i.loopFix({ direction: "next" }),
          (i._clientLeft = i.wrapperEl.clientLeft);
      }
      return n.rewind && i.isEnd
        ? i.slideTo(0, e, t, s)
        : i.slideTo(i.activeIndex + o, e, t, s);
    },
    slidePrev: function (e = this.params.speed, t = !0, s) {
      const i = this,
        {
          params: r,
          snapGrid: n,
          slidesGrid: a,
          rtlTranslate: l,
          enabled: o,
          animating: d,
        } = i;
      if (!o) return i;
      const c = i.virtual && r.virtual.enabled;
      if (r.loop) {
        if (d && !c && r.loopPreventsSliding) return !1;
        i.loopFix({ direction: "prev" }),
          (i._clientLeft = i.wrapperEl.clientLeft);
      }
      function p(e) {
        return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
      }
      const u = p(l ? i.translate : -i.translate),
        m = n.map((e) => p(e));
      let f = n[m.indexOf(u) - 1];
      if (void 0 === f && r.cssMode) {
        let e;
        n.forEach((t, s) => {
          u >= t && (e = s);
        }),
          void 0 !== e && (f = n[e > 0 ? e - 1 : e]);
      }
      let h = 0;
      if (
        (void 0 !== f &&
          ((h = a.indexOf(f)),
          h < 0 && (h = i.activeIndex - 1),
          "auto" === r.slidesPerView &&
            1 === r.slidesPerGroup &&
            r.slidesPerGroupAuto &&
            ((h = h - i.slidesPerViewDynamic("previous", !0) + 1),
            (h = Math.max(h, 0)))),
        r.rewind && i.isBeginning)
      ) {
        const r =
          i.params.virtual && i.params.virtual.enabled && i.virtual
            ? i.virtual.slides.length - 1
            : i.slides.length - 1;
        return i.slideTo(r, e, t, s);
      }
      return i.slideTo(h, e, t, s);
    },
    slideReset: function (e = this.params.speed, t = !0, s) {
      return this.slideTo(this.activeIndex, e, t, s);
    },
    slideToClosest: function (e = this.params.speed, t = !0, s, i = 0.5) {
      const r = this;
      let n = r.activeIndex;
      const a = Math.min(r.params.slidesPerGroupSkip, n),
        l = a + Math.floor((n - a) / r.params.slidesPerGroup),
        o = r.rtlTranslate ? r.translate : -r.translate;
      if (o >= r.snapGrid[l]) {
        const e = r.snapGrid[l];
        o - e > (r.snapGrid[l + 1] - e) * i && (n += r.params.slidesPerGroup);
      } else {
        const e = r.snapGrid[l - 1];
        o - e <= (r.snapGrid[l] - e) * i && (n -= r.params.slidesPerGroup);
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
                  f(s, `${a}[data-swiper-slide-index="${r}"]`)[0]
                )),
                l(() => {
                  e.slideTo(n);
                }))
              : e.slideTo(n)
            : n > e.slides.length - i
            ? (e.loopFix(),
              (n = e.getSlideIndex(
                f(s, `${a}[data-swiper-slide-index="${r}"]`)[0]
              )),
              l(() => {
                e.slideTo(n);
              }))
            : e.slideTo(n);
      } else e.slideTo(n);
    },
  };
  const A = {
    loopCreate: function (e) {
      const t = this,
        { params: s, slidesEl: i } = t;
      if (!s.loop || (t.virtual && t.params.virtual.enabled)) return;
      f(i, `.${s.slideClass}, swiper-slide`).forEach((e, t) => {
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
      const l = this;
      if (!l.params.loop) return;
      l.emit("beforeLoopFix");
      const {
        slides: o,
        allowSlidePrev: d,
        allowSlideNext: c,
        slidesEl: p,
        params: u,
      } = l;
      if (
        ((l.allowSlidePrev = !0),
        (l.allowSlideNext = !0),
        l.virtual && u.virtual.enabled)
      )
        return (
          t &&
            (u.centeredSlides || 0 !== l.snapIndex
              ? u.centeredSlides && l.snapIndex < u.slidesPerView
                ? l.slideTo(l.virtual.slides.length + l.snapIndex, 0, !1, !0)
                : l.snapIndex === l.snapGrid.length - 1 &&
                  l.slideTo(l.virtual.slidesBefore, 0, !1, !0)
              : l.slideTo(l.virtual.slides.length, 0, !1, !0)),
          (l.allowSlidePrev = d),
          (l.allowSlideNext = c),
          void l.emit("loopFix")
        );
      const m =
        "auto" === u.slidesPerView
          ? l.slidesPerViewDynamic()
          : Math.ceil(parseFloat(u.slidesPerView, 10));
      let f = u.loopedSlides || m;
      f % u.slidesPerGroup != 0 &&
        (f += u.slidesPerGroup - (f % u.slidesPerGroup)),
        (l.loopedSlides = f);
      const h = [],
        v = [];
      let g = l.activeIndex;
      void 0 === r
        ? (r = l.getSlideIndex(
            l.slides.filter((e) =>
              e.classList.contains("swiper-slide-active")
            )[0]
          ))
        : (g = r);
      const w = "next" === s || !s,
        b = "prev" === s || !s;
      let S = 0,
        T = 0;
      if (r < f) {
        S = Math.max(f - r, u.slidesPerGroup);
        for (let e = 0; e < f - r; e += 1) {
          const t = e - Math.floor(e / o.length) * o.length;
          h.push(o.length - t - 1);
        }
      } else if (r > l.slides.length - 2 * f) {
        T = Math.max(r - (l.slides.length - 2 * f), u.slidesPerGroup);
        for (let e = 0; e < T; e += 1) {
          const t = e - Math.floor(e / o.length) * o.length;
          v.push(t);
        }
      }
      if (
        (b &&
          h.forEach((e) => {
            p.prepend(l.slides[e]);
          }),
        w &&
          v.forEach((e) => {
            p.append(l.slides[e]);
          }),
        l.recalcSlides(),
        u.watchSlidesProgress && l.updateSlidesOffset(),
        t)
      )
        if (h.length > 0 && b)
          if (void 0 === e) {
            const e = l.slidesGrid[g],
              t = l.slidesGrid[g + S] - e;
            a
              ? l.setTranslate(l.translate - t)
              : (l.slideTo(g + S, 0, !1, !0),
                i && (l.touches[l.isHorizontal() ? "startX" : "startY"] += t));
          } else i && l.slideToLoop(e, 0, !1, !0);
        else if (v.length > 0 && w)
          if (void 0 === e) {
            const e = l.slidesGrid[g],
              t = l.slidesGrid[g - T] - e;
            a
              ? l.setTranslate(l.translate - t)
              : (l.slideTo(g - T, 0, !1, !0),
                i && (l.touches[l.isHorizontal() ? "startX" : "startY"] += t));
          } else l.slideToLoop(e, 0, !1, !0);
      if (
        ((l.allowSlidePrev = d),
        (l.allowSlideNext = c),
        l.controller && l.controller.control && !n)
      ) {
        const t = {
          slideRealIndex: e,
          slideTo: !1,
          direction: s,
          setTranslate: i,
          activeSlideIndex: r,
          byController: !0,
        };
        Array.isArray(l.controller.control)
          ? l.controller.control.forEach((e) => {
              e.params.loop && e.loopFix(t);
            })
          : l.controller.control instanceof l.constructor &&
            l.controller.control.params.loop &&
            l.controller.control.loopFix(t);
      }
      l.emit("loopFix");
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
  function I(e) {
    const t = this,
      s = r(),
      i = a(),
      n = t.touchEventsData;
    n.evCache.push(e);
    const { params: l, touches: d, enabled: c } = t;
    if (!c) return;
    if (!l.simulateTouch && "mouse" === e.pointerType) return;
    if (t.animating && l.preventInteractionOnTransition) return;
    !t.animating && l.cssMode && l.loop && t.loopFix();
    let p = e;
    p.originalEvent && (p = p.originalEvent);
    let u = p.target;
    if ("wrapper" === l.touchEventsTarget && !t.wrapperEl.contains(u)) return;
    if ("which" in p && 3 === p.which) return;
    if ("button" in p && p.button > 0) return;
    if (n.isTouched && n.isMoved) return;
    const m = !!l.noSwipingClass && "" !== l.noSwipingClass,
      f = e.composedPath ? e.composedPath() : e.path;
    m && p.target && p.target.shadowRoot && f && (u = f[0]);
    const h = l.noSwipingSelector
        ? l.noSwipingSelector
        : `.${l.noSwipingClass}`,
      v = !(!p.target || !p.target.shadowRoot);
    if (
      l.noSwiping &&
      (v
        ? (function (e, t = this) {
            return (function t(s) {
              if (!s || s === r() || s === a()) return null;
              s.assignedSlot && (s = s.assignedSlot);
              const i = s.closest(e);
              return i || s.getRootNode ? i || t(s.getRootNode().host) : null;
            })(t);
          })(h, u)
        : u.closest(h))
    )
      return void (t.allowClick = !0);
    if (l.swipeHandler && !u.closest(l.swipeHandler)) return;
    (d.currentX = p.pageX), (d.currentY = p.pageY);
    const g = d.currentX,
      w = d.currentY,
      b = l.edgeSwipeDetection || l.iOSEdgeSwipeDetection,
      S = l.edgeSwipeThreshold || l.iOSEdgeSwipeThreshold;
    if (b && (g <= S || g >= i.innerWidth - S)) {
      if ("prevent" !== b) return;
      e.preventDefault();
    }
    Object.assign(n, {
      isTouched: !0,
      isMoved: !1,
      allowTouchCallbacks: !0,
      isScrolling: void 0,
      startMoving: void 0,
    }),
      (d.startX = g),
      (d.startY = w),
      (n.touchStartTime = o()),
      (t.allowClick = !0),
      t.updateSize(),
      (t.swipeDirection = void 0),
      l.threshold > 0 && (n.allowThresholdMove = !1);
    let T = !0;
    u.matches(n.focusableElements) &&
      ((T = !1), "SELECT" === u.nodeName && (n.isTouched = !1)),
      s.activeElement &&
        s.activeElement.matches(n.focusableElements) &&
        s.activeElement !== u &&
        s.activeElement.blur();
    const y = T && t.allowTouchMove && l.touchStartPreventDefault;
    (!l.touchStartForcePreventDefault && !y) ||
      u.isContentEditable ||
      p.preventDefault(),
      t.params.freeMode &&
        t.params.freeMode.enabled &&
        t.freeMode &&
        t.animating &&
        !l.cssMode &&
        t.freeMode.onTouchStart(),
      t.emit("touchStart", p);
  }
  function O(e) {
    const t = r(),
      s = this,
      i = s.touchEventsData,
      { params: n, touches: a, rtlTranslate: l, enabled: d } = s;
    if (!d) return;
    if (!n.simulateTouch && "mouse" === e.pointerType) return;
    let c = e;
    if ((c.originalEvent && (c = c.originalEvent), !i.isTouched))
      return void (
        i.startMoving &&
        i.isScrolling &&
        s.emit("touchMoveOpposite", c)
      );
    const p = i.evCache.findIndex((e) => e.pointerId === c.pointerId);
    p >= 0 && (i.evCache[p] = c);
    const u = i.evCache.length > 1 ? i.evCache[0] : c,
      m = u.pageX,
      f = u.pageY;
    if (c.preventedByNestedSwiper) return (a.startX = m), void (a.startY = f);
    if (!s.allowTouchMove)
      return (
        c.target.matches(i.focusableElements) || (s.allowClick = !1),
        void (
          i.isTouched &&
          (Object.assign(a, {
            startX: m,
            startY: f,
            prevX: s.touches.currentX,
            prevY: s.touches.currentY,
            currentX: m,
            currentY: f,
          }),
          (i.touchStartTime = o()))
        )
      );
    if (n.touchReleaseOnEdges && !n.loop)
      if (s.isVertical()) {
        if (
          (f < a.startY && s.translate <= s.maxTranslate()) ||
          (f > a.startY && s.translate >= s.minTranslate())
        )
          return (i.isTouched = !1), void (i.isMoved = !1);
      } else if (
        (m < a.startX && s.translate <= s.maxTranslate()) ||
        (m > a.startX && s.translate >= s.minTranslate())
      )
        return;
    if (
      t.activeElement &&
      c.target === t.activeElement &&
      c.target.matches(i.focusableElements)
    )
      return (i.isMoved = !0), void (s.allowClick = !1);
    if (
      (i.allowTouchCallbacks && s.emit("touchMove", c),
      c.targetTouches && c.targetTouches.length > 1)
    )
      return;
    (a.currentX = m), (a.currentY = f);
    const h = a.currentX - a.startX,
      v = a.currentY - a.startY;
    if (s.params.threshold && Math.sqrt(h ** 2 + v ** 2) < s.params.threshold)
      return;
    if (void 0 === i.isScrolling) {
      let e;
      (s.isHorizontal() && a.currentY === a.startY) ||
      (s.isVertical() && a.currentX === a.startX)
        ? (i.isScrolling = !1)
        : h * h + v * v >= 25 &&
          ((e = (180 * Math.atan2(Math.abs(v), Math.abs(h))) / Math.PI),
          (i.isScrolling = s.isHorizontal()
            ? e > n.touchAngle
            : 90 - e > n.touchAngle));
    }
    if (
      (i.isScrolling && s.emit("touchMoveOpposite", c),
      void 0 === i.startMoving &&
        ((a.currentX === a.startX && a.currentY === a.startY) ||
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
      !n.cssMode && c.cancelable && c.preventDefault(),
      n.touchMoveStopPropagation && !n.nested && c.stopPropagation();
    let g = s.isHorizontal() ? h : v,
      w = s.isHorizontal()
        ? a.currentX - a.previousX
        : a.currentY - a.previousY;
    n.oneWayMovement &&
      ((g = Math.abs(g) * (l ? 1 : -1)), (w = Math.abs(w) * (l ? 1 : -1))),
      (a.diff = g),
      (g *= n.touchRatio),
      l && ((g = -g), (w = -w));
    const b = s.touchesDirection;
    (s.swipeDirection = g > 0 ? "prev" : "next"),
      (s.touchesDirection = w > 0 ? "prev" : "next");
    const S = s.params.loop && !n.cssMode;
    if (!i.isMoved) {
      if (
        (S && s.loopFix({ direction: s.swipeDirection }),
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
        !n.grabCursor ||
          (!0 !== s.allowSlideNext && !0 !== s.allowSlidePrev) ||
          s.setGrabCursor(!0),
        s.emit("sliderFirstMove", c);
    }
    let T;
    i.isMoved &&
      b !== s.touchesDirection &&
      S &&
      Math.abs(g) >= 1 &&
      (s.loopFix({ direction: s.swipeDirection, setTranslate: !0 }), (T = !0)),
      s.emit("sliderMove", c),
      (i.isMoved = !0),
      (i.currentTranslate = g + i.startTranslate);
    let y = !0,
      x = n.resistanceRatio;
    if (
      (n.touchReleaseOnEdges && (x = 0),
      g > 0
        ? (S &&
            !T &&
            i.currentTranslate >
              (n.centeredSlides
                ? s.minTranslate() - s.size / 2
                : s.minTranslate()) &&
            s.loopFix({
              direction: "prev",
              setTranslate: !0,
              activeSlideIndex: 0,
            }),
          i.currentTranslate > s.minTranslate() &&
            ((y = !1),
            n.resistance &&
              (i.currentTranslate =
                s.minTranslate() -
                1 +
                (-s.minTranslate() + i.startTranslate + g) ** x)))
        : g < 0 &&
          (S &&
            !T &&
            i.currentTranslate <
              (n.centeredSlides
                ? s.maxTranslate() + s.size / 2
                : s.maxTranslate()) &&
            s.loopFix({
              direction: "next",
              setTranslate: !0,
              activeSlideIndex:
                s.slides.length -
                ("auto" === n.slidesPerView
                  ? s.slidesPerViewDynamic()
                  : Math.ceil(parseFloat(n.slidesPerView, 10))),
            }),
          i.currentTranslate < s.maxTranslate() &&
            ((y = !1),
            n.resistance &&
              (i.currentTranslate =
                s.maxTranslate() +
                1 -
                (s.maxTranslate() - i.startTranslate - g) ** x))),
      y && (c.preventedByNestedSwiper = !0),
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
      n.threshold > 0)
    ) {
      if (!(Math.abs(g) > n.threshold || i.allowThresholdMove))
        return void (i.currentTranslate = i.startTranslate);
      if (!i.allowThresholdMove)
        return (
          (i.allowThresholdMove = !0),
          (a.startX = a.currentX),
          (a.startY = a.currentY),
          (i.currentTranslate = i.startTranslate),
          void (a.diff = s.isHorizontal()
            ? a.currentX - a.startX
            : a.currentY - a.startY)
        );
    }
    n.followFinger &&
      !n.cssMode &&
      (((n.freeMode && n.freeMode.enabled && s.freeMode) ||
        n.watchSlidesProgress) &&
        (s.updateActiveIndex(), s.updateSlidesClasses()),
      s.params.freeMode &&
        n.freeMode.enabled &&
        s.freeMode &&
        s.freeMode.onTouchMove(),
      s.updateProgress(i.currentTranslate),
      s.setTranslate(i.currentTranslate));
  }
  function z(e) {
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
      slidesGrid: d,
      enabled: c,
    } = t;
    if (!c) return;
    if (!r.simulateTouch && "mouse" === e.pointerType) return;
    let p = e;
    if (
      (p.originalEvent && (p = p.originalEvent),
      s.allowTouchCallbacks && t.emit("touchEnd", p),
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
    const u = o(),
      m = u - s.touchStartTime;
    if (t.allowClick) {
      const e = p.path || (p.composedPath && p.composedPath());
      t.updateClickedSlide((e && e[0]) || p.target),
        t.emit("tap click", p),
        m < 300 &&
          u - s.lastClickTime < 300 &&
          t.emit("doubleTap doubleClick", p);
    }
    if (
      ((s.lastClickTime = o()),
      l(() => {
        t.destroyed || (t.allowClick = !0);
      }),
      !s.isTouched ||
        !s.isMoved ||
        !t.swipeDirection ||
        0 === n.diff ||
        s.currentTranslate === s.startTranslate)
    )
      return (s.isTouched = !1), (s.isMoved = !1), void (s.startMoving = !1);
    let f;
    if (
      ((s.isTouched = !1),
      (s.isMoved = !1),
      (s.startMoving = !1),
      (f = r.followFinger
        ? a
          ? t.translate
          : -t.translate
        : -s.currentTranslate),
      r.cssMode)
    )
      return;
    if (t.params.freeMode && r.freeMode.enabled)
      return void t.freeMode.onTouchEnd({ currentPos: f });
    let h = 0,
      v = t.slidesSizesGrid[0];
    for (
      let e = 0;
      e < d.length;
      e += e < r.slidesPerGroupSkip ? 1 : r.slidesPerGroup
    ) {
      const t = e < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
      void 0 !== d[e + t]
        ? f >= d[e] && f < d[e + t] && ((h = e), (v = d[e + t] - d[e]))
        : f >= d[e] && ((h = e), (v = d[d.length - 1] - d[d.length - 2]));
    }
    let g = null,
      w = null;
    r.rewind &&
      (t.isBeginning
        ? (w =
            t.params.virtual && t.params.virtual.enabled && t.virtual
              ? t.virtual.slides.length - 1
              : t.slides.length - 1)
        : t.isEnd && (g = 0));
    const b = (f - d[h]) / v,
      S = h < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
    if (m > r.longSwipesMs) {
      if (!r.longSwipes) return void t.slideTo(t.activeIndex);
      "next" === t.swipeDirection &&
        (b >= r.longSwipesRatio
          ? t.slideTo(r.rewind && t.isEnd ? g : h + S)
          : t.slideTo(h)),
        "prev" === t.swipeDirection &&
          (b > 1 - r.longSwipesRatio
            ? t.slideTo(h + S)
            : null !== w && b < 0 && Math.abs(b) > r.longSwipesRatio
            ? t.slideTo(w)
            : t.slideTo(h));
    } else {
      if (!r.shortSwipes) return void t.slideTo(t.activeIndex);
      t.navigation &&
      (p.target === t.navigation.nextEl || p.target === t.navigation.prevEl)
        ? p.target === t.navigation.nextEl
          ? t.slideTo(h + S)
          : t.slideTo(h)
        : ("next" === t.swipeDirection && t.slideTo(null !== g ? g : h + S),
          "prev" === t.swipeDirection && t.slideTo(null !== w ? w : h));
    }
  }
  let _;
  function G() {
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
    const l = a && t.loop;
    !("auto" === t.slidesPerView || t.slidesPerView > 1) ||
    !e.isEnd ||
    e.isBeginning ||
    e.params.centeredSlides ||
    l
      ? e.params.loop && !a
        ? e.slideToLoop(e.realIndex, 0, !1, !0)
        : e.slideTo(e.activeIndex, 0, !1, !0)
      : e.slideTo(e.slides.length - 1, 0, !1, !0),
      e.autoplay &&
        e.autoplay.running &&
        e.autoplay.paused &&
        (clearTimeout(_),
        (_ = setTimeout(() => {
          e.autoplay &&
            e.autoplay.running &&
            e.autoplay.paused &&
            e.autoplay.resume();
        }, 500))),
      (e.allowSlidePrev = r),
      (e.allowSlideNext = i),
      e.params.watchOverflow && n !== e.snapGrid && e.checkOverflow();
  }
  function B(e) {
    const t = this;
    t.enabled &&
      (t.allowClick ||
        (t.params.preventClicks && e.preventDefault(),
        t.params.preventClicksPropagation &&
          t.animating &&
          (e.stopPropagation(), e.stopImmediatePropagation())));
  }
  function D() {
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
  const V = (e, t) => {
    if (!e || e.destroyed || !e.params) return;
    const s = t.closest(
      e.isElement ? "swiper-slide" : `.${e.params.slideClass}`
    );
    if (s) {
      const t = s.querySelector(`.${e.params.lazyPreloaderClass}`);
      t && t.remove();
    }
  };
  function F(e) {
    V(this, e.target), this.update();
  }
  let N = !1;
  function $() {}
  const j = (e, t) => {
    const s = r(),
      { params: i, el: n, wrapperEl: a, device: l } = e,
      o = !!i.nested,
      d = "on" === t ? "addEventListener" : "removeEventListener",
      c = t;
    n[d]("pointerdown", e.onTouchStart, { passive: !1 }),
      s[d]("pointermove", e.onTouchMove, { passive: !1, capture: o }),
      s[d]("pointerup", e.onTouchEnd, { passive: !0 }),
      s[d]("pointercancel", e.onTouchEnd, { passive: !0 }),
      s[d]("pointerout", e.onTouchEnd, { passive: !0 }),
      s[d]("pointerleave", e.onTouchEnd, { passive: !0 }),
      (i.preventClicks || i.preventClicksPropagation) &&
        n[d]("click", e.onClick, !0),
      i.cssMode && a[d]("scroll", e.onScroll),
      i.updateOnWindowResize
        ? e[c](
            l.ios || l.android
              ? "resize orientationchange observerUpdate"
              : "resize observerUpdate",
            G,
            !0
          )
        : e[c]("observerUpdate", G, !0),
      n[d]("load", e.onLoad, { capture: !0 });
  };
  const H = (e, t) => e.grid && t.grid && t.grid.rows > 1;
  const q = {
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
  function W(e, t) {
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
              p(t, s))
            : p(t, s))
        : p(t, s);
    };
  }
  const R = {
      eventsEmitter: C,
      update: M,
      translate: P,
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
            L({ swiper: s, runCallbacks: e, direction: t, step: "Start" }));
        },
        transitionEnd: function (e = !0, t) {
          const s = this,
            { params: i } = s;
          (s.animating = !1),
            i.cssMode ||
              (s.setTransition(0),
              L({ swiper: s, runCallbacks: e, direction: t, step: "End" }));
        },
      },
      slide: k,
      loop: A,
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
            t = r(),
            { params: s } = e;
          (e.onTouchStart = I.bind(e)),
            (e.onTouchMove = O.bind(e)),
            (e.onTouchEnd = z.bind(e)),
            s.cssMode && (e.onScroll = D.bind(e)),
            (e.onClick = B.bind(e)),
            (e.onLoad = F.bind(e)),
            N || (t.addEventListener("touchstart", $), (N = !0)),
            j(e, "on");
        },
        detachEvents: function () {
          j(this, "off");
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
          const l = (a in n ? n[a] : void 0) || e.originalParams,
            o = H(e, i),
            d = H(e, l),
            c = i.enabled;
          o && !d
            ? (r.classList.remove(
                `${i.containerModifierClass}grid`,
                `${i.containerModifierClass}grid-column`
              ),
              e.emitContainerClasses())
            : !o &&
              d &&
              (r.classList.add(`${i.containerModifierClass}grid`),
              ((l.grid.fill && "column" === l.grid.fill) ||
                (!l.grid.fill && "column" === i.grid.fill)) &&
                r.classList.add(`${i.containerModifierClass}grid-column`),
              e.emitContainerClasses()),
            ["navigation", "pagination", "scrollbar"].forEach((t) => {
              const s = i[t] && i[t].enabled,
                r = l[t] && l[t].enabled;
              s && !r && e[t].disable(), !s && r && e[t].enable();
            });
          const u = l.direction && l.direction !== i.direction,
            m = i.loop && (l.slidesPerView !== i.slidesPerView || u);
          u && s && e.changeDirection(), p(e.params, l);
          const f = e.params.enabled;
          Object.assign(e, {
            allowTouchMove: e.params.allowTouchMove,
            allowSlideNext: e.params.allowSlideNext,
            allowSlidePrev: e.params.allowSlidePrev,
          }),
            c && !f ? e.disable() : !c && f && e.enable(),
            (e.currentBreakpoint = a),
            e.emit("_beforeBreakpoint", l),
            m && s && (e.loopDestroy(), e.loopCreate(t), e.updateSlides()),
            e.emit("breakpoint", l);
        },
        getBreakpoint: function (e, t = "window", s) {
          if (!e || ("container" === t && !s)) return;
          let i = !1;
          const r = a(),
            n = "window" === t ? r.innerHeight : s.clientHeight,
            l = Object.keys(e).map((e) => {
              if ("string" == typeof e && 0 === e.indexOf("@")) {
                const t = parseFloat(e.substr(1));
                return { value: n * t, point: e };
              }
              return { value: e, point: e };
            });
          l.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
          for (let e = 0; e < l.length; e += 1) {
            const { point: n, value: a } = l[e];
            "window" === t
              ? r.matchMedia(`(min-width: ${a}px)`).matches && (i = n)
              : a <= s.clientWidth && (i = n);
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
    X = {};
  class Y {
    constructor(...e) {
      let t, s;
      1 === e.length &&
      e[0].constructor &&
      "Object" === Object.prototype.toString.call(e[0]).slice(8, -1)
        ? (s = e[0])
        : ([t, s] = e),
        s || (s = {}),
        (s = p({}, s)),
        t && !s.el && (s.el = t);
      const i = r();
      if (
        s.el &&
        "string" == typeof s.el &&
        i.querySelectorAll(s.el).length > 1
      ) {
        const e = [];
        return (
          i.querySelectorAll(s.el).forEach((t) => {
            const i = p({}, s, { el: t });
            e.push(new Y(i));
          }),
          e
        );
      }
      const n = this;
      (n.__swiper__ = !0),
        (n.support = y()),
        (n.device = x({ userAgent: s.userAgent })),
        (n.browser = E()),
        (n.eventsListeners = {}),
        (n.eventsAnyListeners = []),
        (n.modules = [...n.__modules__]),
        s.modules && Array.isArray(s.modules) && n.modules.push(...s.modules);
      const a = {};
      n.modules.forEach((e) => {
        e({
          params: s,
          swiper: n,
          extendParams: W(s, a),
          on: n.on.bind(n),
          once: n.once.bind(n),
          off: n.off.bind(n),
          emit: n.emit.bind(n),
        });
      });
      const l = p({}, q, a);
      return (
        (n.params = p({}, l, X, s)),
        (n.originalParams = p({}, n.params)),
        (n.passedParams = p({}, s)),
        n.params &&
          n.params.on &&
          Object.keys(n.params.on).forEach((e) => {
            n.on(e, n.params.on[e]);
          }),
        n.params && n.params.onAny && n.onAny(n.params.onAny),
        Object.assign(n, {
          enabled: n.params.enabled,
          el: t,
          classNames: [],
          slides: [],
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: () => "horizontal" === n.params.direction,
          isVertical: () => "vertical" === n.params.direction,
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: n.params.allowSlideNext,
          allowSlidePrev: n.params.allowSlidePrev,
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: n.params.focusableElements,
            lastClickTime: o(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            startMoving: void 0,
            evCache: [],
          },
          allowClick: !0,
          allowTouchMove: n.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        n.emit("_swiper"),
        n.params.init && n.init(),
        n
      );
    }
    getSlideIndex(e) {
      const { slidesEl: t, params: s } = this,
        i = g(f(t, `.${s.slideClass}, swiper-slide`)[0]);
      return g(e) - i;
    }
    recalcSlides() {
      const { slidesEl: e, params: t } = this;
      this.slides = f(e, `.${t.slideClass}, swiper-slide`);
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
        activeIndex: l,
      } = this;
      let o = 1;
      if (s.centeredSlides) {
        let e,
          t = i[l].swiperSlideSize;
        for (let s = l + 1; s < i.length; s += 1)
          i[s] &&
            !e &&
            ((t += i[s].swiperSlideSize), (o += 1), t > a && (e = !0));
        for (let s = l - 1; s >= 0; s -= 1)
          i[s] &&
            !e &&
            ((t += i[s].swiperSlideSize), (o += 1), t > a && (e = !0));
      } else if ("current" === e)
        for (let e = l + 1; e < i.length; e += 1) {
          (t ? r[e] + n[e] - r[l] < a : r[e] - r[l] < a) && (o += 1);
        }
      else
        for (let e = l - 1; e >= 0; e -= 1) {
          r[l] - r[e] < a && (o += 1);
        }
      return o;
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
          t.complete && V(e, t);
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
        return f(s, i())[0];
      })();
      return (
        !r &&
          t.params.createElements &&
          ((r = h("div", t.params.wrapperClass)),
          s.append(r),
          f(s, `.${t.params.slideClass}`).forEach((e) => {
            r.append(e);
          })),
        Object.assign(t, {
          el: s,
          wrapperEl: r,
          slidesEl: t.isElement ? s : r,
          mounted: !0,
          rtl: "rtl" === s.dir.toLowerCase() || "rtl" === v(s, "direction"),
          rtlTranslate:
            "horizontal" === t.params.direction &&
            ("rtl" === s.dir.toLowerCase() || "rtl" === v(s, "direction")),
          wrongRTL: "-webkit-box" === v(r, "display"),
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
              ? V(t, e)
              : e.addEventListener("load", (e) => {
                  V(t, e.target);
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
      p(X, e);
    }
    static get extendedDefaults() {
      return X;
    }
    static get defaults() {
      return q;
    }
    static installModule(e) {
      Y.prototype.__modules__ || (Y.prototype.__modules__ = []);
      const t = Y.prototype.__modules__;
      "function" == typeof e && t.indexOf(e) < 0 && t.push(e);
    }
    static use(e) {
      return Array.isArray(e)
        ? (e.forEach((e) => Y.installModule(e)), Y)
        : (Y.installModule(e), Y);
    }
  }
  Object.keys(R).forEach((e) => {
    Object.keys(R[e]).forEach((t) => {
      Y.prototype[t] = R[e][t];
    });
  }),
    Y.use([
      function ({ swiper: e, on: t, emit: s }) {
        const i = a();
        let r = null,
          n = null;
        const l = () => {
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
                    (r === s && n === i) || l();
                });
              })),
              r.observe(e.el))
            : (i.addEventListener("resize", l),
              i.addEventListener("orientationchange", o));
        }),
          t("destroy", () => {
            n && i.cancelAnimationFrame(n),
              r && r.unobserve && e.el && (r.unobserve(e.el), (r = null)),
              i.removeEventListener("resize", l),
              i.removeEventListener("orientationchange", o);
          });
      },
      function ({ swiper: e, extendParams: t, on: s, emit: i }) {
        const r = [],
          n = a(),
          l = (t, s = {}) => {
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
                for (let e = 0; e < t.length; e += 1) l(t[e]);
              }
              l(e.el, { childList: e.params.observeSlideChildren }),
                l(e.wrapperEl, { attributes: !1 });
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
  const U = Y;
  function K({ swiper: e, extendParams: t, on: s, emit: i }) {
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
    function l() {
      const { nextEl: t, prevEl: s } = e.navigation;
      if (e.params.loop) return a(s, !1), void a(t, !1);
      a(s, e.isBeginning && !e.params.rewind),
        a(t, e.isEnd && !e.params.rewind);
    }
    function o(t) {
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
                  let n = f(e.el, `.${i[r]}`)[0];
                  n ||
                    ((n = h("div", i[r])),
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
        s && s.addEventListener("click", "next" === i ? d : o),
          !e.enabled && s && s.classList.add(...t.lockClass.split(" "));
      };
      s.forEach((e) => a(e, "next")), i.forEach((e) => a(e, "prev"));
    }
    function p() {
      let { nextEl: t, prevEl: s } = e.navigation;
      (t = r(t)), (s = r(s));
      const i = (t, s) => {
        t.removeEventListener("click", "next" === s ? d : o),
          t.classList.remove(...e.params.navigation.disabledClass.split(" "));
      };
      t.forEach((e) => i(e, "next")), s.forEach((e) => i(e, "prev"));
    }
    s("init", () => {
      !1 === e.params.navigation.enabled ? u() : (c(), l());
    }),
      s("toEdge fromEdge lock unlock", () => {
        l();
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
        const l = s.target;
        if (
          e.params.navigation.hideOnClick &&
          !a.includes(l) &&
          !n.includes(l)
        ) {
          if (
            e.pagination &&
            e.params.pagination &&
            e.params.pagination.clickable &&
            (e.pagination.el === l || e.pagination.el.contains(l))
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
          l();
      },
      disable: u,
      update: l,
      init: c,
      destroy: p,
    });
  }
  function J({ swiper: e, extendParams: t, on: s, emit: i, params: n }) {
    let a, l;
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
      d,
      c,
      p,
      u,
      m,
      f,
      h = n && n.autoplay ? n.autoplay.delay : 3e3,
      v = n && n.autoplay ? n.autoplay.delay : 3e3,
      g = new Date().getTime;
    function w(t) {
      e &&
        !e.destroyed &&
        e.wrapperEl &&
        t.target === e.wrapperEl &&
        (e.wrapperEl.removeEventListener("transitionend", w), E());
    }
    const b = () => {
        if (e.destroyed || !e.autoplay.running) return;
        e.autoplay.paused ? (d = !0) : d && ((v = o), (d = !1));
        const t = e.autoplay.paused ? o : g + v - new Date().getTime();
        (e.autoplay.timeLeft = t),
          i("autoplayTimeLeft", t, t / h),
          (l = requestAnimationFrame(() => {
            b();
          }));
      },
      S = (t) => {
        if (e.destroyed || !e.autoplay.running) return;
        cancelAnimationFrame(l), b();
        let s = void 0 === t ? e.params.autoplay.delay : t;
        (h = e.params.autoplay.delay), (v = e.params.autoplay.delay);
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
          ((s = r), (h = r), (v = r)),
          (o = s);
        const n = e.params.speed,
          d = () => {
            e &&
              !e.destroyed &&
              (e.params.autoplay.reverseDirection
                ? !e.isBeginning || e.params.loop || e.params.rewind
                  ? (e.slidePrev(n, !0, !0), i("autoplay"))
                  : e.params.autoplay.stopOnLastSlide ||
                    (e.slideTo(e.slides.length - 1, n, !0, !0), i("autoplay"))
                : !e.isEnd || e.params.loop || e.params.rewind
                ? (e.slideNext(n, !0, !0), i("autoplay"))
                : e.params.autoplay.stopOnLastSlide ||
                  (e.slideTo(0, n, !0, !0), i("autoplay")),
              e.params.cssMode &&
                ((g = new Date().getTime()),
                requestAnimationFrame(() => {
                  S();
                })));
          };
        return (
          s > 0
            ? (clearTimeout(a),
              (a = setTimeout(() => {
                d();
              }, s)))
            : requestAnimationFrame(() => {
                d();
              }),
          s
        );
      },
      T = () => {
        (e.autoplay.running = !0), S(), i("autoplayStart");
      },
      y = () => {
        (e.autoplay.running = !1),
          clearTimeout(a),
          cancelAnimationFrame(l),
          i("autoplayStop");
      },
      x = (t, s) => {
        if (e.destroyed || !e.autoplay.running) return;
        clearTimeout(a), t || (f = !0);
        const r = () => {
          i("autoplayPause"),
            e.params.autoplay.waitForTransition
              ? e.wrapperEl.addEventListener("transitionend", w)
              : E();
        };
        if (((e.autoplay.paused = !0), s))
          return m && (o = e.params.autoplay.delay), (m = !1), void r();
        const n = o || e.params.autoplay.delay;
        (o = n - (new Date().getTime() - g)),
          (e.isEnd && o < 0 && !e.params.loop) || (o < 0 && (o = 0), r());
      },
      E = () => {
        (e.isEnd && o < 0 && !e.params.loop) ||
          e.destroyed ||
          !e.autoplay.running ||
          ((g = new Date().getTime()),
          f ? ((f = !1), S(o)) : S(),
          (e.autoplay.paused = !1),
          i("autoplayResume"));
      },
      C = () => {
        if (e.destroyed || !e.autoplay.running) return;
        const t = r();
        "hidden" === t.visibilityState && ((f = !0), x(!0)),
          "visible" === t.visibilityState && E();
      },
      M = (e) => {
        "mouse" === e.pointerType && ((f = !0), x(!0));
      },
      P = (t) => {
        "mouse" === t.pointerType && e.autoplay.paused && E();
      };
    s("init", () => {
      e.params.autoplay.enabled &&
        (e.params.autoplay.pauseOnMouseEnter &&
          (e.el.addEventListener("pointerenter", M),
          e.el.addEventListener("pointerleave", P)),
        r().addEventListener("visibilitychange", C),
        (g = new Date().getTime()),
        T());
    }),
      s("destroy", () => {
        e.el.removeEventListener("pointerenter", M),
          e.el.removeEventListener("pointerleave", P),
          r().removeEventListener("visibilitychange", C),
          e.autoplay.running && y();
      }),
      s("beforeTransitionStart", (t, s, i) => {
        !e.destroyed &&
          e.autoplay.running &&
          (i || !e.params.autoplay.disableOnInteraction ? x(!0, !0) : y());
      }),
      s("sliderFirstMove", () => {
        !e.destroyed &&
          e.autoplay.running &&
          (e.params.autoplay.disableOnInteraction
            ? y()
            : ((c = !0),
              (p = !1),
              (f = !1),
              (u = setTimeout(() => {
                (f = !0), (p = !0), x(!0);
              }, 200))));
      }),
      s("touchEnd", () => {
        if (!e.destroyed && e.autoplay.running && c) {
          if (
            (clearTimeout(u),
            clearTimeout(a),
            e.params.autoplay.disableOnInteraction)
          )
            return (p = !1), void (c = !1);
          p && e.params.cssMode && E(), (p = !1), (c = !1);
        }
      }),
      s("slideChange", () => {
        !e.destroyed && e.autoplay.running && (m = !0);
      }),
      Object.assign(e.autoplay, { start: T, stop: y, pause: x, resume: E });
  }
  function Q({ swiper: e, extendParams: t, on: s }) {
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
      n = !1;
    function a() {
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
    function l() {
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
      else if (c(t.swiper)) {
        const i = Object.assign({}, t.swiper);
        Object.assign(i, { watchSlidesProgress: !0, slideToClickedSlide: !1 }),
          (e.thumbs.swiper = new s(i)),
          (n = !0);
      }
      return (
        e.thumbs.swiper.el.classList.add(e.params.thumbs.thumbsContainerClass),
        e.thumbs.swiper.on("tap", a),
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
          f(
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
        l = a && !s.params.loop;
      if (e.realIndex !== s.realIndex || l) {
        const r = s.activeIndex;
        let n, o;
        if (s.params.loop) {
          const t = s.slides.filter(
            (t) =>
              t.getAttribute("data-swiper-slide-index") === `${e.realIndex}`
          )[0];
          (n = s.slides.indexOf(t)),
            (o = e.activeIndex > e.previousIndex ? "next" : "prev");
        } else (n = e.realIndex), (o = n > e.previousIndex ? "next" : "prev");
        l && (n += "next" === o ? a : -1 * a),
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
            const s = r(),
              i = () => {
                const i =
                  "string" == typeof t.swiper
                    ? s.querySelector(t.swiper)
                    : t.swiper;
                if (i && i.swiper) (t.swiper = i.swiper), l(), o(!0);
                else if (i) {
                  const s = (r) => {
                    (t.swiper = r.detail[0]),
                      i.removeEventListener("init", s),
                      l(),
                      o(!0),
                      t.swiper.update(),
                      e.update();
                  };
                  i.addEventListener("init", s);
                }
                return i;
              },
              n = () => {
                if (e.destroyed) return;
                i() || requestAnimationFrame(n);
              };
            requestAnimationFrame(n);
          } else l(), o(!0);
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
        t && !t.destroyed && n && t.destroy();
      }),
      Object.assign(e.thumbs, { init: l, update: o });
  }
  window.addEventListener("load", function (e) {
    !(function () {
      if (
        (document.querySelector(".block-slider__slider") &&
          new U(".block-slider__slider", {
            modules: [J, K, Q],
            grabCursor: !0,
            observer: !0,
            observeParents: !0,
            slidesPerView: 1,
            spaceBetween: 0,
            autoHeight: !0,
            speed: 800,
            loop: !0,
            navigation: { nextEl: ".arrow_next", prevEl: ".arrow_prev" },
            thumbs: {
              swiper: ".block03__swiper",
              slideThumbActiveClass: "block03__product_active",
            },
            breakpoints: {
              320: { slidesPerView: 1, spaceBetween: 30 },
              992: { slidesPerView: 1, spaceBetween: 20 },
            },
            on: {},
          }),
        document.querySelector(".block03__swiper") &&
          new U(".block03__swiper", {
            observer: !0,
            observeParents: !0,
            slidesPerView: 1,
            spaceBetween: 0,
            breakpoints: {
              320: { slidesPerView: 1, spaceBetween: 0, loop: !0 },
              992: { slidesPerView: 4, spaceBetween: 0 },
            },
          }),
        document.querySelector(".test-form"))
      ) {
        new U(".test-form", {
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
        r.length;
        let n = 0,
          a = [];
        const l = document.querySelectorAll(".test-form label");
        function o() {
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
        l.forEach((e) =>
          e.addEventListener("click", () =>
            l.forEach((e) => e.classList.remove("_error"))
          )
        ),
          i.addEventListener("click", o);
      }
    })();
  });
  let Z = !1;
  setTimeout(() => {
    if (Z) {
      let e = new Event("windowScroll");
      window.addEventListener("scroll", function (t) {
        document.dispatchEvent(e);
      });
    }
  }, 0);
  gsap.timeline();
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
    e.any() && document.documentElement.classList.add("touch");
})();
