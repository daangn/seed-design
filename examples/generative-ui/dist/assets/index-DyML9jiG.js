var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  s = (e, n) => {
    let r = {};
    for (var i in e) t(r, i, { get: e[i], enumerable: !0 });
    return n || t(r, Symbol.toStringTag, { value: `Module` }), r;
  },
  c = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        (d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, {
              get: ((e) => i[e]).bind(null, d),
              enumerable: !(s = n(i, d)) || s.enumerable,
            });
    return e;
  },
  l = (n, r, a) => (
    (a = n == null ? {} : e(i(n))),
    c(r || !n || !n.__esModule ? t(a, `default`, { value: n, enumerable: !0 }) : a, n)
  );
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var u = o((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      a: for (; 0 < n; ) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (0 < i(a, t)) (e[r] = t), (e[n] = a), (n = r);
        else break a;
      }
    }
    function n(e) {
      return e.length === 0 ? null : e[0];
    }
    function r(e) {
      if (e.length === 0) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        a: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
          var s = 2 * (r + 1) - 1,
            c = e[s],
            l = s + 1,
            u = e[l];
          if (0 > i(c, n))
            l < a && 0 > i(u, c)
              ? ((e[r] = u), (e[l] = n), (r = l))
              : ((e[r] = c), (e[s] = n), (r = s));
          else if (l < a && 0 > i(u, n)) (e[r] = u), (e[l] = n), (r = l);
          else break a;
        }
      }
      return t;
    }
    function i(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return n === 0 ? e.id - t.id : n;
    }
    if (
      ((e.unstable_now = void 0),
      typeof performance == `object` && typeof performance.now == `function`)
    ) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var o = Date,
        s = o.now();
      e.unstable_now = function () {
        return o.now() - s;
      };
    }
    var c = [],
      l = [],
      u = 1,
      d = null,
      f = 3,
      p = !1,
      m = !1,
      h = !1,
      g = !1,
      _ = typeof setTimeout == `function` ? setTimeout : null,
      v = typeof clearTimeout == `function` ? clearTimeout : null,
      y = typeof setImmediate < `u` ? setImmediate : null;
    function b(e) {
      for (var i = n(l); i !== null; ) {
        if (i.callback === null) r(l);
        else if (i.startTime <= e) r(l), (i.sortIndex = i.expirationTime), t(c, i);
        else break;
        i = n(l);
      }
    }
    function x(e) {
      if (((h = !1), b(e), !m))
        if (n(c) !== null) (m = !0), S || ((S = !0), E());
        else {
          var t = n(l);
          t !== null && ie(x, t.startTime - e);
        }
    }
    var S = !1,
      C = -1,
      w = 5,
      ee = -1;
    function T() {
      return g ? !0 : !(e.unstable_now() - ee < w);
    }
    function te() {
      if (((g = !1), S)) {
        var t = e.unstable_now();
        ee = t;
        var i = !0;
        try {
          a: {
            (m = !1), h && ((h = !1), v(C), (C = -1)), (p = !0);
            var a = f;
            try {
              b: {
                for (b(t), d = n(c); d !== null && !(d.expirationTime > t && T()); ) {
                  var o = d.callback;
                  if (typeof o == `function`) {
                    (d.callback = null), (f = d.priorityLevel);
                    var s = o(d.expirationTime <= t);
                    if (((t = e.unstable_now()), typeof s == `function`)) {
                      (d.callback = s), b(t), (i = !0);
                      break b;
                    }
                    d === n(c) && r(c), b(t);
                  } else r(c);
                  d = n(c);
                }
                if (d !== null) i = !0;
                else {
                  var u = n(l);
                  u !== null && ie(x, u.startTime - t), (i = !1);
                }
              }
              break a;
            } finally {
              (d = null), (f = a), (p = !1);
            }
            i = void 0;
          }
        } finally {
          i ? E() : (S = !1);
        }
      }
    }
    var E;
    if (typeof y == `function`)
      E = function () {
        y(te);
      };
    else if (typeof MessageChannel < `u`) {
      var ne = new MessageChannel(),
        re = ne.port2;
      (ne.port1.onmessage = te),
        (E = function () {
          re.postMessage(null);
        });
    } else
      E = function () {
        _(te, 0);
      };
    function ie(t, n) {
      C = _(function () {
        t(e.unstable_now());
      }, n);
    }
    (e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
            )
          : (w = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_requestPaint = function () {
        g = !0;
      }),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, i, a) {
        var o = e.unstable_now();
        switch (
          (typeof a == `object` && a
            ? ((a = a.delay), (a = typeof a == `number` && 0 < a ? o + a : o))
            : (a = o),
          r)
        ) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 1e4;
            break;
          default:
            s = 5e3;
        }
        return (
          (s = a + s),
          (r = {
            id: u++,
            callback: i,
            priorityLevel: r,
            startTime: a,
            expirationTime: s,
            sortIndex: -1,
          }),
          a > o
            ? ((r.sortIndex = a),
              t(l, r),
              n(c) === null && r === n(l) && (h ? (v(C), (C = -1)) : (h = !0), ie(x, a - o)))
            : ((r.sortIndex = s), t(c, r), m || p || ((m = !0), S || ((S = !0), E()))),
          r
        );
      }),
      (e.unstable_shouldYield = T),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      });
  }),
  d = o((e, t) => {
    t.exports = u();
  }),
  f = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.for(`react.activity`),
      p = Symbol.iterator;
    function m(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (p && e[p]) || e[`@@iterator`]), typeof e == `function` ? e : null);
    }
    var h = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      g = Object.assign,
      _ = {};
    function v(e, t, n) {
      (this.props = e), (this.context = t), (this.refs = _), (this.updater = n || h);
    }
    (v.prototype.isReactComponent = {}),
      (v.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      });
    function y() {}
    y.prototype = v.prototype;
    function b(e, t, n) {
      (this.props = e), (this.context = t), (this.refs = _), (this.updater = n || h);
    }
    var x = (b.prototype = new y());
    (x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0);
    var S = Array.isArray;
    function C() {}
    var w = { H: null, A: null, T: null, S: null },
      ee = Object.prototype.hasOwnProperty;
    function T(e, n, r) {
      var i = r.ref;
      return { $$typeof: t, type: e, key: n, ref: i === void 0 ? null : i, props: r };
    }
    function te(e, t) {
      return T(e.type, t, e.props);
    }
    function E(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function ne(e) {
      var t = { "=": `=0`, ":": `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var re = /\/+/g;
    function ie(e, t) {
      return typeof e == `object` && e && e.key != null ? ne(`` + e.key) : t.toString(36);
    }
    function ae(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value;
        case `rejected`:
          throw e.reason;
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(C, C)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` && ((e.status = `fulfilled`), (e.value = t));
                  },
                  function (t) {
                    e.status === `pending` && ((e.status = `rejected`), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value;
            case `rejected`:
              throw e.reason;
          }
      }
      throw e;
    }
    function oe(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
                break;
              case d:
                return (c = e._init), oe(c(e._payload), r, i, a, o);
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + ie(e, 0) : a),
          S(o)
            ? ((i = ``),
              c != null && (i = c.replace(re, `$&/`) + `/`),
              oe(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (E(o) &&
                (o = te(
                  o,
                  i +
                    (o.key == null || (e && e.key === o.key)
                      ? ``
                      : (`` + o.key).replace(re, `$&/`) + `/`) +
                    c,
                )),
              r.push(o)),
          1
        );
      c = 0;
      var l = a === `` ? `.` : a + `:`;
      if (S(e))
        for (var u = 0; u < e.length; u++) (a = e[u]), (s = l + ie(a, u)), (c += oe(a, r, i, s, o));
      else if (((u = m(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done; )
          (a = a.value), (s = l + ie(a, u++)), (c += oe(a, r, i, s, o));
      else if (s === `object`) {
        if (typeof e.then == `function`) return oe(ae(e), r, i, a, o);
        throw (
          ((r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]`
                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          ))
        );
      }
      return c;
    }
    function se(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        oe(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function ce(e) {
      if (e._status === -1) {
        var t = e._result;
        (t = t()),
          t.then(
            function (t) {
              (e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = t));
            },
            function (t) {
              (e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = t));
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var D =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (typeof window == `object` && typeof window.ErrorEvent == `function`) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (typeof process == `object` && typeof process.emit == `function`) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      O = {
        map: se,
        forEach: function (e, t, n) {
          se(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            se(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            se(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!E(e))
            throw Error(`React.Children.only expected to receive a single React element child.`);
          return e;
        },
      };
    (e.Activity = f),
      (e.Children = O),
      (e.Component = v),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return w.H.useMemoCache(e);
        },
      }),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(`The argument must be a React element, but you passed ` + e + `.`);
        var r = g({}, e.props),
          i = e.key;
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !ee.call(t, a) ||
              a === `key` ||
              a === `__self` ||
              a === `__source` ||
              (a === `ref` && t.ref === void 0) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (a === 1) r.children = n;
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
          r.children = o;
        }
        return T(e.type, i, r);
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null;
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            ee.call(t, r) && r !== `key` && r !== `__self` && r !== `__source` && (i[r] = t[r]);
        var o = arguments.length - 2;
        if (o === 1) i.children = n;
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
          i.children = s;
        }
        if (e && e.defaultProps)
          for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r]);
        return T(e, a, i);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = E),
      (e.lazy = function (e) {
        return { $$typeof: d, _payload: { _status: -1, _result: e }, _init: ce };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = function (e) {
        var t = w.T,
          n = {};
        w.T = n;
        try {
          var r = e(),
            i = w.S;
          i !== null && i(n, r),
            typeof r == `object` && r && typeof r.then == `function` && r.then(C, D);
        } catch (e) {
          D(e);
        } finally {
          t !== null && n.types !== null && (t.types = n.types), (w.T = t);
        }
      }),
      (e.unstable_useCacheRefresh = function () {
        return w.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return w.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return w.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return w.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return w.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return w.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return w.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return w.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return w.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return w.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return w.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return w.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return w.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return w.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return w.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return w.H.useRef(e);
      }),
      (e.useState = function (e) {
        return w.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return w.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return w.H.useTransition();
      }),
      (e.version = `19.2.3`);
  }),
  p = o((e, t) => {
    t.exports = f();
  }),
  m = o((e) => {
    var t = p();
    function n(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function r() {}
    var i = {
        d: {
          f: r,
          r: function () {
            throw Error(n(522));
          },
          D: r,
          C: r,
          L: r,
          m: r,
          X: r,
          S: r,
          M: r,
        },
        p: 0,
        findDOMNode: null,
      },
      a = Symbol.for(`react.portal`);
    function o(e, t, n) {
      var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: a,
        key: r == null ? null : `` + r,
        children: e,
        containerInfo: t,
        implementation: n,
      };
    }
    var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function c(e, t) {
      if (e === `font`) return ``;
      if (typeof t == `string`) return t === `use-credentials` ? t : ``;
    }
    (e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
      (e.createPortal = function (e, t) {
        var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)) throw Error(n(299));
        return o(e, t, null, r);
      }),
      (e.flushSync = function (e) {
        var t = s.T,
          n = i.p;
        try {
          if (((s.T = null), (i.p = 2), e)) return e();
        } finally {
          (s.T = t), (i.p = n), i.d.f();
        }
      }),
      (e.preconnect = function (e, t) {
        typeof e == `string` &&
          (t
            ? ((t = t.crossOrigin),
              (t = typeof t == `string` ? (t === `use-credentials` ? t : ``) : void 0))
            : (t = null),
          i.d.C(e, t));
      }),
      (e.prefetchDNS = function (e) {
        typeof e == `string` && i.d.D(e);
      }),
      (e.preinit = function (e, t) {
        if (typeof e == `string` && t && typeof t.as == `string`) {
          var n = t.as,
            r = c(n, t.crossOrigin),
            a = typeof t.integrity == `string` ? t.integrity : void 0,
            o = typeof t.fetchPriority == `string` ? t.fetchPriority : void 0;
          n === `style`
            ? i.d.S(e, typeof t.precedence == `string` ? t.precedence : void 0, {
                crossOrigin: r,
                integrity: a,
                fetchPriority: o,
              })
            : n === `script` &&
              i.d.X(e, {
                crossOrigin: r,
                integrity: a,
                fetchPriority: o,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
        }
      }),
      (e.preinitModule = function (e, t) {
        if (typeof e == `string`)
          if (typeof t == `object` && t) {
            if (t.as == null || t.as === `script`) {
              var n = c(t.as, t.crossOrigin);
              i.d.M(e, {
                crossOrigin: n,
                integrity: typeof t.integrity == `string` ? t.integrity : void 0,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
            }
          } else t ?? i.d.M(e);
      }),
      (e.preload = function (e, t) {
        if (typeof e == `string` && typeof t == `object` && t && typeof t.as == `string`) {
          var n = t.as,
            r = c(n, t.crossOrigin);
          i.d.L(e, n, {
            crossOrigin: r,
            integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            nonce: typeof t.nonce == `string` ? t.nonce : void 0,
            type: typeof t.type == `string` ? t.type : void 0,
            fetchPriority: typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
            referrerPolicy: typeof t.referrerPolicy == `string` ? t.referrerPolicy : void 0,
            imageSrcSet: typeof t.imageSrcSet == `string` ? t.imageSrcSet : void 0,
            imageSizes: typeof t.imageSizes == `string` ? t.imageSizes : void 0,
            media: typeof t.media == `string` ? t.media : void 0,
          });
        }
      }),
      (e.preloadModule = function (e, t) {
        if (typeof e == `string`)
          if (t) {
            var n = c(t.as, t.crossOrigin);
            i.d.m(e, {
              as: typeof t.as == `string` && t.as !== `script` ? t.as : void 0,
              crossOrigin: n,
              integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            });
          } else i.d.m(e);
      }),
      (e.requestFormReset = function (e) {
        i.d.r(e);
      }),
      (e.unstable_batchedUpdates = function (e, t) {
        return e(t);
      }),
      (e.useFormState = function (e, t, n) {
        return s.H.useFormState(e, t, n);
      }),
      (e.useFormStatus = function () {
        return s.H.useHostTransitionStatus();
      }),
      (e.version = `19.2.3`);
  }),
  h = o((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    n(), (t.exports = m());
  }),
  g = o((e) => {
    var t = d(),
      n = p(),
      r = h();
    function i(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function a(e) {
      return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
    }
    function o(e) {
      var t = e,
        n = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
        while (e);
      }
      return t.tag === 3 ? n : null;
    }
    function s(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
          return t.dehydrated;
      }
      return null;
    }
    function c(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
          return t.dehydrated;
      }
      return null;
    }
    function l(e) {
      if (o(e) !== e) throw Error(i(188));
    }
    function u(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = o(e)), t === null)) throw Error(i(188));
        return t === e ? e : null;
      }
      for (var n = e, r = t; ; ) {
        var a = n.return;
        if (a === null) break;
        var s = a.alternate;
        if (s === null) {
          if (((r = a.return), r !== null)) {
            n = r;
            continue;
          }
          break;
        }
        if (a.child === s.child) {
          for (s = a.child; s; ) {
            if (s === n) return l(a), e;
            if (s === r) return l(a), t;
            s = s.sibling;
          }
          throw Error(i(188));
        }
        if (n.return !== r.return) (n = a), (r = s);
        else {
          for (var c = !1, u = a.child; u; ) {
            if (u === n) {
              (c = !0), (n = a), (r = s);
              break;
            }
            if (u === r) {
              (c = !0), (r = a), (n = s);
              break;
            }
            u = u.sibling;
          }
          if (!c) {
            for (u = s.child; u; ) {
              if (u === n) {
                (c = !0), (n = s), (r = a);
                break;
              }
              if (u === r) {
                (c = !0), (r = s), (n = a);
                break;
              }
              u = u.sibling;
            }
            if (!c) throw Error(i(189));
          }
        }
        if (n.alternate !== r) throw Error(i(190));
      }
      if (n.tag !== 3) throw Error(i(188));
      return n.stateNode.current === n ? e : t;
    }
    function f(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (((t = f(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    var m = Object.assign,
      g = Symbol.for(`react.element`),
      _ = Symbol.for(`react.transitional.element`),
      v = Symbol.for(`react.portal`),
      y = Symbol.for(`react.fragment`),
      b = Symbol.for(`react.strict_mode`),
      x = Symbol.for(`react.profiler`),
      S = Symbol.for(`react.consumer`),
      C = Symbol.for(`react.context`),
      w = Symbol.for(`react.forward_ref`),
      ee = Symbol.for(`react.suspense`),
      T = Symbol.for(`react.suspense_list`),
      te = Symbol.for(`react.memo`),
      E = Symbol.for(`react.lazy`),
      ne = Symbol.for(`react.activity`),
      re = Symbol.for(`react.memo_cache_sentinel`),
      ie = Symbol.iterator;
    function ae(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (ie && e[ie]) || e[`@@iterator`]), typeof e == `function` ? e : null);
    }
    var oe = Symbol.for(`react.client.reference`);
    function se(e) {
      if (e == null) return null;
      if (typeof e == `function`) return e.$$typeof === oe ? null : e.displayName || e.name || null;
      if (typeof e == `string`) return e;
      switch (e) {
        case y:
          return `Fragment`;
        case x:
          return `Profiler`;
        case b:
          return `StrictMode`;
        case ee:
          return `Suspense`;
        case T:
          return `SuspenseList`;
        case ne:
          return `Activity`;
      }
      if (typeof e == `object`)
        switch (e.$$typeof) {
          case v:
            return `Portal`;
          case C:
            return e.displayName || `Context`;
          case S:
            return (e._context.displayName || `Context`) + `.Consumer`;
          case w:
            var t = e.render;
            return (
              (e = e.displayName),
              (e ||=
                ((e = t.displayName || t.name || ``),
                e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
              e
            );
          case te:
            return (t = e.displayName || null), t === null ? se(e.type) || `Memo` : t;
          case E:
            (t = e._payload), (e = e._init);
            try {
              return se(e(t));
            } catch {}
        }
      return null;
    }
    var ce = Array.isArray,
      D = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      O = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      le = { pending: !1, data: null, method: null, action: null },
      ue = [],
      de = -1;
    function fe(e) {
      return { current: e };
    }
    function k(e) {
      0 > de || ((e.current = ue[de]), (ue[de] = null), de--);
    }
    function A(e, t) {
      de++, (ue[de] = e.current), (e.current = t);
    }
    var pe = fe(null),
      me = fe(null),
      he = fe(null),
      ge = fe(null);
    function _e(e, t) {
      switch ((A(he, t), A(me, e), A(pe, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Jd(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI))) (t = Jd(t)), (e = Yd(t, e));
          else
            switch (e) {
              case `svg`:
                e = 1;
                break;
              case `math`:
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      k(pe), A(pe, e);
    }
    function j() {
      k(pe), k(me), k(he);
    }
    function ve(e) {
      e.memoizedState !== null && A(ge, e);
      var t = pe.current,
        n = Yd(t, e.type);
      t !== n && (A(me, e), A(pe, n));
    }
    function ye(e) {
      me.current === e && (k(pe), k(me)), ge.current === e && (k(ge), (ap._currentValue = le));
    }
    var be, xe;
    function Se(e) {
      if (be === void 0)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          (be = (t && t[1]) || ``),
            (xe =
              -1 <
              e.stack.indexOf(`
    at`)
                ? ` (<anonymous>)`
                : -1 < e.stack.indexOf(`@`)
                  ? `@unknown:0:0`
                  : ``);
        }
      return (
        `
` +
        be +
        e +
        xe
      );
    }
    var Ce = !1;
    function we(e, t) {
      if (!e || Ce) return ``;
      Ce = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var r = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var n = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(n.prototype, `props`, {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == `object` && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(n, []);
                  } catch (e) {
                    var r = e;
                  }
                  Reflect.construct(e, [], n);
                } else {
                  try {
                    n.call();
                  } catch (e) {
                    r = e;
                  }
                  e.call(n.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (e) {
                  r = e;
                }
                (n = e()) && typeof n.catch == `function` && n.catch(function () {});
              }
            } catch (e) {
              if (e && r && typeof e.stack == `string`) return [e.stack, r.stack];
            }
            return [null, null];
          },
        };
        r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
        var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, `name`);
        i &&
          i.configurable &&
          Object.defineProperty(r.DetermineComponentFrameRoot, `name`, {
            value: `DetermineComponentFrameRoot`,
          });
        var a = r.DetermineComponentFrameRoot(),
          o = a[0],
          s = a[1];
        if (o && s) {
          var c = o.split(`
`),
            l = s.split(`
`);
          for (i = r = 0; r < c.length && !c[r].includes(`DetermineComponentFrameRoot`); ) r++;
          for (; i < l.length && !l[i].includes(`DetermineComponentFrameRoot`); ) i++;
          if (r === c.length || i === l.length)
            for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i]; ) i--;
          for (; 1 <= r && 0 <= i; r--, i--)
            if (c[r] !== l[i]) {
              if (r !== 1 || i !== 1)
                do
                  if ((r--, i--, 0 > i || c[r] !== l[i])) {
                    var u =
                      `
` + c[r].replace(` at new `, ` at `);
                    return (
                      e.displayName &&
                        u.includes(`<anonymous>`) &&
                        (u = u.replace(`<anonymous>`, e.displayName)),
                      u
                    );
                  }
                while (1 <= r && 0 <= i);
              break;
            }
        }
      } finally {
        (Ce = !1), (Error.prepareStackTrace = n);
      }
      return (n = e ? e.displayName || e.name : ``) ? Se(n) : ``;
    }
    function Te(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return Se(e.type);
        case 16:
          return Se(`Lazy`);
        case 13:
          return e.child !== t && t !== null ? Se(`Suspense Fallback`) : Se(`Suspense`);
        case 19:
          return Se(`SuspenseList`);
        case 0:
        case 15:
          return we(e.type, !1);
        case 11:
          return we(e.type.render, !1);
        case 1:
          return we(e.type, !0);
        case 31:
          return Se(`Activity`);
        default:
          return ``;
      }
    }
    function Ee(e) {
      try {
        var t = ``,
          n = null;
        do (t += Te(e, n)), (n = e), (e = e.return);
        while (e);
        return t;
      } catch (e) {
        return (
          `
Error generating stack: ` +
          e.message +
          `
` +
          e.stack
        );
      }
    }
    var De = Object.prototype.hasOwnProperty,
      Oe = t.unstable_scheduleCallback,
      ke = t.unstable_cancelCallback,
      Ae = t.unstable_shouldYield,
      je = t.unstable_requestPaint,
      Me = t.unstable_now,
      Ne = t.unstable_getCurrentPriorityLevel,
      Pe = t.unstable_ImmediatePriority,
      Fe = t.unstable_UserBlockingPriority,
      Ie = t.unstable_NormalPriority,
      Le = t.unstable_LowPriority,
      Re = t.unstable_IdlePriority,
      ze = t.log,
      Be = t.unstable_setDisableYieldValue,
      Ve = null,
      He = null;
    function Ue(e) {
      if ((typeof ze == `function` && Be(e), He && typeof He.setStrictMode == `function`))
        try {
          He.setStrictMode(Ve, e);
        } catch {}
    }
    var We = Math.clz32 ? Math.clz32 : qe,
      Ge = Math.log,
      Ke = Math.LN2;
    function qe(e) {
      return (e >>>= 0), e === 0 ? 32 : (31 - ((Ge(e) / Ke) | 0)) | 0;
    }
    var Je = 256,
      Ye = 262144,
      Xe = 4194304;
    function Ze(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Qe(e, t, n) {
      var r = e.pendingLanes;
      if (r === 0) return 0;
      var i = 0,
        a = e.suspendedLanes,
        o = e.pingedLanes;
      e = e.warmLanes;
      var s = r & 134217727;
      return (
        s === 0
          ? ((s = r & ~a),
            s === 0
              ? o === 0
                ? n || ((n = r & ~e), n !== 0 && (i = Ze(n)))
                : (i = Ze(o))
              : (i = Ze(s)))
          : ((r = s & ~a),
            r === 0
              ? ((o &= s), o === 0 ? n || ((n = s & ~e), n !== 0 && (i = Ze(n))) : (i = Ze(o)))
              : (i = Ze(r))),
        i === 0
          ? 0
          : t !== 0 &&
              t !== i &&
              (t & a) === 0 &&
              ((a = i & -i), (n = t & -t), a >= n || (a === 32 && n & 4194048))
            ? t
            : i
      );
    }
    function $e(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function et(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function tt() {
      var e = Xe;
      return (Xe <<= 1), !(Xe & 62914560) && (Xe = 4194304), e;
    }
    function nt(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function rt(e, t) {
      (e.pendingLanes |= t),
        t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0));
    }
    function it(e, t, n, r, i, a) {
      var o = e.pendingLanes;
      (e.pendingLanes = n),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.warmLanes = 0),
        (e.expiredLanes &= n),
        (e.entangledLanes &= n),
        (e.errorRecoveryDisabledLanes &= n),
        (e.shellSuspendCounter = 0);
      var s = e.entanglements,
        c = e.expirationTimes,
        l = e.hiddenUpdates;
      for (n = o & ~n; 0 < n; ) {
        var u = 31 - We(n),
          d = 1 << u;
        (s[u] = 0), (c[u] = -1);
        var f = l[u];
        if (f !== null)
          for (l[u] = null, u = 0; u < f.length; u++) {
            var p = f[u];
            p !== null && (p.lane &= -536870913);
          }
        n &= ~d;
      }
      r !== 0 && at(e, r, 0),
        a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
    }
    function at(e, t, n) {
      (e.pendingLanes |= t), (e.suspendedLanes &= ~t);
      var r = 31 - We(t);
      (e.entangledLanes |= t),
        (e.entanglements[r] = e.entanglements[r] | 1073741824 | (n & 261930));
    }
    function ot(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n; ) {
        var r = 31 - We(n),
          i = 1 << r;
        (i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i);
      }
    }
    function st(e, t) {
      var n = t & -t;
      return (n = n & 42 ? 1 : ct(n)), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
    }
    function ct(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function lt(e) {
      return (e &= -e), 2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2;
    }
    function ut() {
      var e = O.p;
      return e === 0 ? ((e = window.event), e === void 0 ? 32 : xp(e.type)) : e;
    }
    function dt(e, t) {
      var n = O.p;
      try {
        return (O.p = e), t();
      } finally {
        O.p = n;
      }
    }
    var ft = Math.random().toString(36).slice(2),
      pt = `__reactFiber$` + ft,
      mt = `__reactProps$` + ft,
      ht = `__reactContainer$` + ft,
      gt = `__reactEvents$` + ft,
      _t = `__reactListeners$` + ft,
      vt = `__reactHandles$` + ft,
      yt = `__reactResources$` + ft,
      bt = `__reactMarker$` + ft;
    function xt(e) {
      delete e[pt], delete e[mt], delete e[gt], delete e[_t], delete e[vt];
    }
    function St(e) {
      var t = e[pt];
      if (t) return t;
      for (var n = e.parentNode; n; ) {
        if ((t = n[ht] || n[pt])) {
          if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
            for (e = vf(e); e !== null; ) {
              if ((n = e[pt])) return n;
              e = vf(e);
            }
          return t;
        }
        (e = n), (n = e.parentNode);
      }
      return null;
    }
    function Ct(e) {
      if ((e = e[pt] || e[ht])) {
        var t = e.tag;
        if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
      }
      return null;
    }
    function wt(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(i(33));
    }
    function Tt(e) {
      var t = e[yt];
      return (t ||= e[yt] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t;
    }
    function Et(e) {
      e[bt] = !0;
    }
    var Dt = new Set(),
      Ot = {};
    function kt(e, t) {
      At(e, t), At(e + `Capture`, t);
    }
    function At(e, t) {
      for (Ot[e] = t, e = 0; e < t.length; e++) Dt.add(t[e]);
    }
    var jt = RegExp(
        `^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
      ),
      Mt = {},
      Nt = {};
    function Pt(e) {
      return De.call(Nt, e)
        ? !0
        : De.call(Mt, e)
          ? !1
          : jt.test(e)
            ? (Nt[e] = !0)
            : ((Mt[e] = !0), !1);
    }
    function Ft(e, t, n) {
      if (Pt(t))
        if (n === null) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case `undefined`:
            case `function`:
            case `symbol`:
              e.removeAttribute(t);
              return;
            case `boolean`:
              var r = t.toLowerCase().slice(0, 5);
              if (r !== `data-` && r !== `aria-`) {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, `` + n);
        }
    }
    function It(e, t, n) {
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, `` + n);
      }
    }
    function Lt(e, t, n, r) {
      if (r === null) e.removeAttribute(n);
      else {
        switch (typeof r) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(n);
            return;
        }
        e.setAttributeNS(t, n, `` + r);
      }
    }
    function Rt(e) {
      switch (typeof e) {
        case `bigint`:
        case `boolean`:
        case `number`:
        case `string`:
        case `undefined`:
          return e;
        case `object`:
          return e;
        default:
          return ``;
      }
    }
    function zt(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === `input` && (t === `checkbox` || t === `radio`);
    }
    function Bt(e, t, n) {
      var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (
        !e.hasOwnProperty(t) &&
        r !== void 0 &&
        typeof r.get == `function` &&
        typeof r.set == `function`
      ) {
        var i = r.get,
          a = r.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return i.call(this);
            },
            set: function (e) {
              (n = `` + e), a.call(this, e);
            },
          }),
          Object.defineProperty(e, t, { enumerable: r.enumerable }),
          {
            getValue: function () {
              return n;
            },
            setValue: function (e) {
              n = `` + e;
            },
            stopTracking: function () {
              (e._valueTracker = null), delete e[t];
            },
          }
        );
      }
    }
    function Vt(e) {
      if (!e._valueTracker) {
        var t = zt(e) ? `checked` : `value`;
        e._valueTracker = Bt(e, t, `` + e[t]);
      }
    }
    function Ht(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = ``;
      return (
        e && (r = zt(e) ? (e.checked ? `true` : `false`) : e.value),
        (e = r),
        e === n ? !1 : (t.setValue(e), !0)
      );
    }
    function Ut(e) {
      if (((e ||= typeof document < `u` ? document : void 0), e === void 0)) return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Wt = /[\n"\\]/g;
    function Gt(e) {
      return e.replace(Wt, function (e) {
        return `\\` + e.charCodeAt(0).toString(16) + ` `;
      });
    }
    function Kt(e, t, n, r, i, a, o, s) {
      (e.name = ``),
        o != null && typeof o != `function` && typeof o != `symbol` && typeof o != `boolean`
          ? (e.type = o)
          : e.removeAttribute(`type`),
        t == null
          ? (o !== `submit` && o !== `reset`) || e.removeAttribute(`value`)
          : o === `number`
            ? ((t === 0 && e.value === ``) || e.value != t) && (e.value = `` + Rt(t))
            : e.value !== `` + Rt(t) && (e.value = `` + Rt(t)),
        t == null
          ? n == null
            ? r != null && e.removeAttribute(`value`)
            : M(e, o, Rt(n))
          : M(e, o, Rt(t)),
        i == null && a != null && (e.defaultChecked = !!a),
        i != null && (e.checked = i && typeof i != `function` && typeof i != `symbol`),
        s != null && typeof s != `function` && typeof s != `symbol` && typeof s != `boolean`
          ? (e.name = `` + Rt(s))
          : e.removeAttribute(`name`);
    }
    function qt(e, t, n, r, i, a, o, s) {
      if (
        (a != null &&
          typeof a != `function` &&
          typeof a != `symbol` &&
          typeof a != `boolean` &&
          (e.type = a),
        t != null || n != null)
      ) {
        if (!((a !== `submit` && a !== `reset`) || t != null)) {
          Vt(e);
          return;
        }
        (n = n == null ? `` : `` + Rt(n)),
          (t = t == null ? n : `` + Rt(t)),
          s || t === e.value || (e.value = t),
          (e.defaultValue = t);
      }
      (r ??= i),
        (r = typeof r != `function` && typeof r != `symbol` && !!r),
        (e.checked = s ? e.checked : !!r),
        (e.defaultChecked = !!r),
        o != null &&
          typeof o != `function` &&
          typeof o != `symbol` &&
          typeof o != `boolean` &&
          (e.name = o),
        Vt(e);
    }
    function M(e, t, n) {
      (t === `number` && Ut(e.ownerDocument) === e) ||
        e.defaultValue === `` + n ||
        (e.defaultValue = `` + n);
    }
    function Jt(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
        for (n = 0; n < e.length; n++)
          (i = t.hasOwnProperty(`$` + e[n].value)),
            e[n].selected !== i && (e[n].selected = i),
            i && r && (e[n].defaultSelected = !0);
      } else {
        for (n = `` + Rt(n), t = null, i = 0; i < e.length; i++) {
          if (e[i].value === n) {
            (e[i].selected = !0), r && (e[i].defaultSelected = !0);
            return;
          }
          t !== null || e[i].disabled || (t = e[i]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function Yt(e, t, n) {
      if (t != null && ((t = `` + Rt(t)), t !== e.value && (e.value = t), n == null)) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = n == null ? `` : `` + Rt(n);
    }
    function Xt(e, t, n, r) {
      if (t == null) {
        if (r != null) {
          if (n != null) throw Error(i(92));
          if (ce(r)) {
            if (1 < r.length) throw Error(i(93));
            r = r[0];
          }
          n = r;
        }
        (n ??= ``), (t = n);
      }
      (n = Rt(t)),
        (e.defaultValue = n),
        (r = e.textContent),
        r === n && r !== `` && r !== null && (e.value = r),
        Vt(e);
    }
    function Zt(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var Qt = new Set(
      `animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
        ` `,
      ),
    );
    function $t(e, t, n) {
      var r = t.indexOf(`--`) === 0;
      n == null || typeof n == `boolean` || n === ``
        ? r
          ? e.setProperty(t, ``)
          : t === `float`
            ? (e.cssFloat = ``)
            : (e[t] = ``)
        : r
          ? e.setProperty(t, n)
          : typeof n != `number` || n === 0 || Qt.has(t)
            ? t === `float`
              ? (e.cssFloat = n)
              : (e[t] = (`` + n).trim())
            : (e[t] = n + `px`);
    }
    function en(e, t, n) {
      if (t != null && typeof t != `object`) throw Error(i(62));
      if (((e = e.style), n != null)) {
        for (var r in n)
          !n.hasOwnProperty(r) ||
            (t != null && t.hasOwnProperty(r)) ||
            (r.indexOf(`--`) === 0
              ? e.setProperty(r, ``)
              : r === `float`
                ? (e.cssFloat = ``)
                : (e[r] = ``));
        for (var a in t) (r = t[a]), t.hasOwnProperty(a) && n[a] !== r && $t(e, a, r);
      } else for (var o in t) t.hasOwnProperty(o) && $t(e, o, t[o]);
    }
    function tn(e) {
      if (e.indexOf(`-`) === -1) return !1;
      switch (e) {
        case `annotation-xml`:
        case `color-profile`:
        case `font-face`:
        case `font-face-src`:
        case `font-face-uri`:
        case `font-face-format`:
        case `font-face-name`:
        case `missing-glyph`:
          return !1;
        default:
          return !0;
      }
    }
    var nn = new Map([
        [`acceptCharset`, `accept-charset`],
        [`htmlFor`, `for`],
        [`httpEquiv`, `http-equiv`],
        [`crossOrigin`, `crossorigin`],
        [`accentHeight`, `accent-height`],
        [`alignmentBaseline`, `alignment-baseline`],
        [`arabicForm`, `arabic-form`],
        [`baselineShift`, `baseline-shift`],
        [`capHeight`, `cap-height`],
        [`clipPath`, `clip-path`],
        [`clipRule`, `clip-rule`],
        [`colorInterpolation`, `color-interpolation`],
        [`colorInterpolationFilters`, `color-interpolation-filters`],
        [`colorProfile`, `color-profile`],
        [`colorRendering`, `color-rendering`],
        [`dominantBaseline`, `dominant-baseline`],
        [`enableBackground`, `enable-background`],
        [`fillOpacity`, `fill-opacity`],
        [`fillRule`, `fill-rule`],
        [`floodColor`, `flood-color`],
        [`floodOpacity`, `flood-opacity`],
        [`fontFamily`, `font-family`],
        [`fontSize`, `font-size`],
        [`fontSizeAdjust`, `font-size-adjust`],
        [`fontStretch`, `font-stretch`],
        [`fontStyle`, `font-style`],
        [`fontVariant`, `font-variant`],
        [`fontWeight`, `font-weight`],
        [`glyphName`, `glyph-name`],
        [`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
        [`glyphOrientationVertical`, `glyph-orientation-vertical`],
        [`horizAdvX`, `horiz-adv-x`],
        [`horizOriginX`, `horiz-origin-x`],
        [`imageRendering`, `image-rendering`],
        [`letterSpacing`, `letter-spacing`],
        [`lightingColor`, `lighting-color`],
        [`markerEnd`, `marker-end`],
        [`markerMid`, `marker-mid`],
        [`markerStart`, `marker-start`],
        [`overlinePosition`, `overline-position`],
        [`overlineThickness`, `overline-thickness`],
        [`paintOrder`, `paint-order`],
        [`panose-1`, `panose-1`],
        [`pointerEvents`, `pointer-events`],
        [`renderingIntent`, `rendering-intent`],
        [`shapeRendering`, `shape-rendering`],
        [`stopColor`, `stop-color`],
        [`stopOpacity`, `stop-opacity`],
        [`strikethroughPosition`, `strikethrough-position`],
        [`strikethroughThickness`, `strikethrough-thickness`],
        [`strokeDasharray`, `stroke-dasharray`],
        [`strokeDashoffset`, `stroke-dashoffset`],
        [`strokeLinecap`, `stroke-linecap`],
        [`strokeLinejoin`, `stroke-linejoin`],
        [`strokeMiterlimit`, `stroke-miterlimit`],
        [`strokeOpacity`, `stroke-opacity`],
        [`strokeWidth`, `stroke-width`],
        [`textAnchor`, `text-anchor`],
        [`textDecoration`, `text-decoration`],
        [`textRendering`, `text-rendering`],
        [`transformOrigin`, `transform-origin`],
        [`underlinePosition`, `underline-position`],
        [`underlineThickness`, `underline-thickness`],
        [`unicodeBidi`, `unicode-bidi`],
        [`unicodeRange`, `unicode-range`],
        [`unitsPerEm`, `units-per-em`],
        [`vAlphabetic`, `v-alphabetic`],
        [`vHanging`, `v-hanging`],
        [`vIdeographic`, `v-ideographic`],
        [`vMathematical`, `v-mathematical`],
        [`vectorEffect`, `vector-effect`],
        [`vertAdvY`, `vert-adv-y`],
        [`vertOriginX`, `vert-origin-x`],
        [`vertOriginY`, `vert-origin-y`],
        [`wordSpacing`, `word-spacing`],
        [`writingMode`, `writing-mode`],
        [`xmlnsXlink`, `xmlns:xlink`],
        [`xHeight`, `x-height`],
      ]),
      rn =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function an(e) {
      return rn.test(`` + e)
        ? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
        : e;
    }
    function on() {}
    var sn = null;
    function cn(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var ln = null,
      un = null;
    function dn(e) {
      var t = Ct(e);
      if (t && (e = t.stateNode)) {
        var n = e[mt] || null;
        a: switch (((e = t.stateNode), t.type)) {
          case `input`:
            if (
              (Kt(
                e,
                n.value,
                n.defaultValue,
                n.defaultValue,
                n.checked,
                n.defaultChecked,
                n.type,
                n.name,
              ),
              (t = n.name),
              n.type === `radio` && t != null)
            ) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              for (
                n = n.querySelectorAll(`input[name="` + Gt(`` + t) + `"][type="radio"]`), t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var a = r[mt] || null;
                  if (!a) throw Error(i(90));
                  Kt(
                    r,
                    a.value,
                    a.defaultValue,
                    a.defaultValue,
                    a.checked,
                    a.defaultChecked,
                    a.type,
                    a.name,
                  );
                }
              }
              for (t = 0; t < n.length; t++) (r = n[t]), r.form === e.form && Ht(r);
            }
            break a;
          case `textarea`:
            Yt(e, n.value, n.defaultValue);
            break a;
          case `select`:
            (t = n.value), t != null && Jt(e, !!n.multiple, t, !1);
        }
      }
    }
    var fn = !1;
    function pn(e, t, n) {
      if (fn) return e(t, n);
      fn = !0;
      try {
        return e(t);
      } finally {
        if (
          ((fn = !1),
          (ln !== null || un !== null) &&
            (Eu(), ln && ((t = ln), (e = un), (un = ln = null), dn(t), e)))
        )
          for (t = 0; t < e.length; t++) dn(e[t]);
      }
    }
    function mn(e, t) {
      var n = e.stateNode;
      if (n === null) return null;
      var r = n[mt] || null;
      if (r === null) return null;
      n = r[t];
      a: switch (t) {
        case `onClick`:
        case `onClickCapture`:
        case `onDoubleClick`:
        case `onDoubleClickCapture`:
        case `onMouseDown`:
        case `onMouseDownCapture`:
        case `onMouseMove`:
        case `onMouseMoveCapture`:
        case `onMouseUp`:
        case `onMouseUpCapture`:
        case `onMouseEnter`:
          (r = !r.disabled) ||
            ((e = e.type),
            (r = !(e === `button` || e === `input` || e === `select` || e === `textarea`))),
            (e = !r);
          break a;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && typeof n != `function`) throw Error(i(231, t, typeof n));
      return n;
    }
    var hn = !(
        typeof window > `u` ||
        window.document === void 0 ||
        window.document.createElement === void 0
      ),
      gn = !1;
    if (hn)
      try {
        var _n = {};
        Object.defineProperty(_n, `passive`, {
          get: function () {
            gn = !0;
          },
        }),
          window.addEventListener(`test`, _n, _n),
          window.removeEventListener(`test`, _n, _n);
      } catch {
        gn = !1;
      }
    var vn = null,
      yn = null,
      bn = null;
    function xn() {
      if (bn) return bn;
      var e,
        t = yn,
        n = t.length,
        r,
        i = `value` in vn ? vn.value : vn.textContent,
        a = i.length;
      for (e = 0; e < n && t[e] === i[e]; e++);
      var o = n - e;
      for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
      return (bn = i.slice(e, 1 < r ? 1 - r : void 0));
    }
    function Sn(e) {
      var t = e.keyCode;
      return (
        `charCode` in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function Cn() {
      return !0;
    }
    function wn() {
      return !1;
    }
    function Tn(e) {
      function t(t, n, r, i, a) {
        for (var o in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = i),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (
            i.defaultPrevented == null
              ? !1 === i.returnValue
              : i.defaultPrevented
          )
            ? Cn
            : wn),
          (this.isPropagationStopped = wn),
          this
        );
      }
      return (
        m(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault
                ? e.preventDefault()
                : typeof e.returnValue != `unknown` && (e.returnValue = !1),
              (this.isDefaultPrevented = Cn));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation
                ? e.stopPropagation()
                : typeof e.cancelBubble != `unknown` && (e.cancelBubble = !0),
              (this.isPropagationStopped = Cn));
          },
          persist: function () {},
          isPersistent: Cn,
        }),
        t
      );
    }
    var En = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Dn = Tn(En),
      On = m({}, En, { view: 0, detail: 0 }),
      kn = Tn(On),
      An,
      jn,
      Mn,
      Nn = m({}, On, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Wn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return `movementX` in e
            ? e.movementX
            : (e !== Mn &&
                (Mn && e.type === `mousemove`
                  ? ((An = e.screenX - Mn.screenX), (jn = e.screenY - Mn.screenY))
                  : (jn = An = 0),
                (Mn = e)),
              An);
        },
        movementY: function (e) {
          return `movementY` in e ? e.movementY : jn;
        },
      }),
      Pn = Tn(Nn),
      Fn = Tn(m({}, Nn, { dataTransfer: 0 })),
      In = Tn(m({}, On, { relatedTarget: 0 })),
      Ln = Tn(m({}, En, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })),
      Rn = Tn(
        m({}, En, {
          clipboardData: function (e) {
            return `clipboardData` in e ? e.clipboardData : window.clipboardData;
          },
        }),
      ),
      zn = Tn(m({}, En, { data: 0 })),
      Bn = {
        Esc: `Escape`,
        Spacebar: ` `,
        Left: `ArrowLeft`,
        Up: `ArrowUp`,
        Right: `ArrowRight`,
        Down: `ArrowDown`,
        Del: `Delete`,
        Win: `OS`,
        Menu: `ContextMenu`,
        Apps: `ContextMenu`,
        Scroll: `ScrollLock`,
        MozPrintableKey: `Unidentified`,
      },
      Vn = {
        8: `Backspace`,
        9: `Tab`,
        12: `Clear`,
        13: `Enter`,
        16: `Shift`,
        17: `Control`,
        18: `Alt`,
        19: `Pause`,
        20: `CapsLock`,
        27: `Escape`,
        32: ` `,
        33: `PageUp`,
        34: `PageDown`,
        35: `End`,
        36: `Home`,
        37: `ArrowLeft`,
        38: `ArrowUp`,
        39: `ArrowRight`,
        40: `ArrowDown`,
        45: `Insert`,
        46: `Delete`,
        112: `F1`,
        113: `F2`,
        114: `F3`,
        115: `F4`,
        116: `F5`,
        117: `F6`,
        118: `F7`,
        119: `F8`,
        120: `F9`,
        121: `F10`,
        122: `F11`,
        123: `F12`,
        144: `NumLock`,
        145: `ScrollLock`,
        224: `Meta`,
      },
      Hn = { Alt: `altKey`, Control: `ctrlKey`, Meta: `metaKey`, Shift: `shiftKey` };
    function Un(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = Hn[e]) ? !!t[e] : !1;
    }
    function Wn() {
      return Un;
    }
    var Gn = Tn(
        m({}, On, {
          key: function (e) {
            if (e.key) {
              var t = Bn[e.key] || e.key;
              if (t !== `Unidentified`) return t;
            }
            return e.type === `keypress`
              ? ((e = Sn(e)), e === 13 ? `Enter` : String.fromCharCode(e))
              : e.type === `keydown` || e.type === `keyup`
                ? Vn[e.keyCode] || `Unidentified`
                : ``;
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: Wn,
          charCode: function (e) {
            return e.type === `keypress` ? Sn(e) : 0;
          },
          keyCode: function (e) {
            return e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
          which: function (e) {
            return e.type === `keypress`
              ? Sn(e)
              : e.type === `keydown` || e.type === `keyup`
                ? e.keyCode
                : 0;
          },
        }),
      ),
      Kn = Tn(
        m({}, Nn, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      qn = Tn(
        m({}, On, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: Wn,
        }),
      ),
      Jn = Tn(m({}, En, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      Yn = Tn(
        m({}, Nn, {
          deltaX: function (e) {
            return `deltaX` in e ? e.deltaX : `wheelDeltaX` in e ? -e.wheelDeltaX : 0;
          },
          deltaY: function (e) {
            return `deltaY` in e
              ? e.deltaY
              : `wheelDeltaY` in e
                ? -e.wheelDeltaY
                : `wheelDelta` in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      Xn = Tn(m({}, En, { newState: 0, oldState: 0 })),
      Zn = [9, 13, 27, 32],
      Qn = hn && `CompositionEvent` in window,
      $n = null;
    hn && `documentMode` in document && ($n = document.documentMode);
    var er = hn && `TextEvent` in window && !$n,
      tr = hn && (!Qn || ($n && 8 < $n && 11 >= $n)),
      nr = ` `,
      rr = !1;
    function ir(e, t) {
      switch (e) {
        case `keyup`:
          return Zn.indexOf(t.keyCode) !== -1;
        case `keydown`:
          return t.keyCode !== 229;
        case `keypress`:
        case `mousedown`:
        case `focusout`:
          return !0;
        default:
          return !1;
      }
    }
    function ar(e) {
      return (e = e.detail), typeof e == `object` && `data` in e ? e.data : null;
    }
    var or = !1;
    function sr(e, t) {
      switch (e) {
        case `compositionend`:
          return ar(t);
        case `keypress`:
          return t.which === 32 ? ((rr = !0), nr) : null;
        case `textInput`:
          return (e = t.data), e === nr && rr ? null : e;
        default:
          return null;
      }
    }
    function cr(e, t) {
      if (or)
        return e === `compositionend` || (!Qn && ir(e, t))
          ? ((e = xn()), (bn = yn = vn = null), (or = !1), e)
          : null;
      switch (e) {
        case `paste`:
          return null;
        case `keypress`:
          if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case `compositionend`:
          return tr && t.locale !== `ko` ? null : t.data;
        default:
          return null;
      }
    }
    var lr = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function ur(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === `input` ? !!lr[e.type] : t === `textarea`;
    }
    function dr(e, t, n, r) {
      ln ? (un ? un.push(r) : (un = [r])) : (ln = r),
        (t = Md(t, `onChange`)),
        0 < t.length &&
          ((n = new Dn(`onChange`, `change`, null, n, r)), e.push({ event: n, listeners: t }));
    }
    var fr = null,
      pr = null;
    function mr(e) {
      Td(e, 0);
    }
    function hr(e) {
      if (Ht(wt(e))) return e;
    }
    function gr(e, t) {
      if (e === `change`) return t;
    }
    var _r = !1;
    if (hn) {
      var vr;
      if (hn) {
        var yr = `oninput` in document;
        if (!yr) {
          var br = document.createElement(`div`);
          br.setAttribute(`oninput`, `return;`), (yr = typeof br.oninput == `function`);
        }
        vr = yr;
      } else vr = !1;
      _r = vr && (!document.documentMode || 9 < document.documentMode);
    }
    function xr() {
      fr && (fr.detachEvent(`onpropertychange`, Sr), (pr = fr = null));
    }
    function Sr(e) {
      if (e.propertyName === `value` && hr(pr)) {
        var t = [];
        dr(t, pr, e, cn(e)), pn(mr, t);
      }
    }
    function Cr(e, t, n) {
      e === `focusin`
        ? (xr(), (fr = t), (pr = n), fr.attachEvent(`onpropertychange`, Sr))
        : e === `focusout` && xr();
    }
    function wr(e) {
      if (e === `selectionchange` || e === `keyup` || e === `keydown`) return hr(pr);
    }
    function Tr(e, t) {
      if (e === `click`) return hr(t);
    }
    function Er(e, t) {
      if (e === `input` || e === `change`) return hr(t);
    }
    function Dr(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var Or = typeof Object.is == `function` ? Object.is : Dr;
    function kr(e, t) {
      if (Or(e, t)) return !0;
      if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var i = n[r];
        if (!De.call(t, i) || !Or(e[i], t[i])) return !1;
      }
      return !0;
    }
    function Ar(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function jr(e, t) {
      var n = Ar(e);
      e = 0;
      for (var r; n; ) {
        if (n.nodeType === 3) {
          if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e };
          e = r;
        }
        a: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break a;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = Ar(n);
      }
    }
    function Mr(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Mr(e, t.parentNode)
              : `contains` in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Nr(e) {
      e =
        e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = Ut(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var n = typeof t.contentWindow.location.href == `string`;
        } catch {
          n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = Ut(e.document);
      }
      return t;
    }
    function Pr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === `input` &&
          (e.type === `text` ||
            e.type === `search` ||
            e.type === `tel` ||
            e.type === `url` ||
            e.type === `password`)) ||
          t === `textarea` ||
          e.contentEditable === `true`)
      );
    }
    var Fr = hn && `documentMode` in document && 11 >= document.documentMode,
      Ir = null,
      Lr = null,
      Rr = null,
      zr = !1;
    function Br(e, t, n) {
      var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      zr ||
        Ir == null ||
        Ir !== Ut(r) ||
        ((r = Ir),
        `selectionStart` in r && Pr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
            (r = {
              anchorNode: r.anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            })),
        (Rr && kr(Rr, r)) ||
          ((Rr = r),
          (r = Md(Lr, `onSelect`)),
          0 < r.length &&
            ((t = new Dn(`onSelect`, `select`, null, t, n)),
            e.push({ event: t, listeners: r }),
            (t.target = Ir))));
    }
    function Vr(e, t) {
      var n = {};
      return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n[`Webkit` + e] = `webkit` + t),
        (n[`Moz` + e] = `moz` + t),
        n
      );
    }
    var Hr = {
        animationend: Vr(`Animation`, `AnimationEnd`),
        animationiteration: Vr(`Animation`, `AnimationIteration`),
        animationstart: Vr(`Animation`, `AnimationStart`),
        transitionrun: Vr(`Transition`, `TransitionRun`),
        transitionstart: Vr(`Transition`, `TransitionStart`),
        transitioncancel: Vr(`Transition`, `TransitionCancel`),
        transitionend: Vr(`Transition`, `TransitionEnd`),
      },
      Ur = {},
      Wr = {};
    hn &&
      ((Wr = document.createElement(`div`).style),
      `AnimationEvent` in window ||
        (delete Hr.animationend.animation,
        delete Hr.animationiteration.animation,
        delete Hr.animationstart.animation),
      `TransitionEvent` in window || delete Hr.transitionend.transition);
    function Gr(e) {
      if (Ur[e]) return Ur[e];
      if (!Hr[e]) return e;
      var t = Hr[e],
        n;
      for (n in t) if (t.hasOwnProperty(n) && n in Wr) return (Ur[e] = t[n]);
      return e;
    }
    var Kr = Gr(`animationend`),
      qr = Gr(`animationiteration`),
      Jr = Gr(`animationstart`),
      Yr = Gr(`transitionrun`),
      Xr = Gr(`transitionstart`),
      Zr = Gr(`transitioncancel`),
      Qr = Gr(`transitionend`),
      $r = new Map(),
      ei =
        `abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
          ` `,
        );
    ei.push(`scrollEnd`);
    function ti(e, t) {
      $r.set(e, t), kt(t, [e]);
    }
    var ni =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (typeof window == `object` && typeof window.ErrorEvent == `function`) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (typeof process == `object` && typeof process.emit == `function`) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      ri = [],
      ii = 0,
      ai = 0;
    function oi() {
      for (var e = ii, t = (ai = ii = 0); t < e; ) {
        var n = ri[t];
        ri[t++] = null;
        var r = ri[t];
        ri[t++] = null;
        var i = ri[t];
        ri[t++] = null;
        var a = ri[t];
        if (((ri[t++] = null), r !== null && i !== null)) {
          var o = r.pending;
          o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)), (r.pending = i);
        }
        a !== 0 && ui(n, i, a);
      }
    }
    function si(e, t, n, r) {
      (ri[ii++] = e),
        (ri[ii++] = t),
        (ri[ii++] = n),
        (ri[ii++] = r),
        (ai |= r),
        (e.lanes |= r),
        (e = e.alternate),
        e !== null && (e.lanes |= r);
    }
    function ci(e, t, n, r) {
      return si(e, t, n, r), di(e);
    }
    function li(e, t) {
      return si(e, null, null, t), di(e);
    }
    function ui(e, t, n) {
      e.lanes |= n;
      var r = e.alternate;
      r !== null && (r.lanes |= n);
      for (var i = !1, a = e.return; a !== null; )
        (a.childLanes |= n),
          (r = a.alternate),
          r !== null && (r.childLanes |= n),
          a.tag === 22 && ((e = a.stateNode), e === null || e._visibility & 1 || (i = !0)),
          (e = a),
          (a = a.return);
      return e.tag === 3
        ? ((a = e.stateNode),
          i &&
            t !== null &&
            ((i = 31 - We(n)),
            (e = a.hiddenUpdates),
            (r = e[i]),
            r === null ? (e[i] = [t]) : r.push(t),
            (t.lane = n | 536870912)),
          a)
        : null;
    }
    function di(e) {
      if (50 < _u) throw ((_u = 0), (vu = null), Error(i(185)));
      for (var t = e.return; t !== null; ) (e = t), (t = e.return);
      return e.tag === 3 ? e.stateNode : null;
    }
    var fi = {};
    function pi(e, t, n, r) {
      (this.tag = e),
        (this.key = n),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null);
    }
    function mi(e, t, n, r) {
      return new pi(e, t, n, r);
    }
    function hi(e) {
      return (e = e.prototype), !(!e || !e.isReactComponent);
    }
    function gi(e, t) {
      var n = e.alternate;
      return (
        n === null
          ? ((n = mi(e.tag, t, e.key, e.mode)),
            (n.elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t),
            (n.type = e.type),
            (n.flags = 0),
            (n.subtreeFlags = 0),
            (n.deletions = null)),
        (n.flags = e.flags & 65011712),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        (n.refCleanup = e.refCleanup),
        n
      );
    }
    function _i(e, t) {
      e.flags &= 65011714;
      var n = e.alternate;
      return (
        n === null
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = n.childLanes),
            (e.lanes = n.lanes),
            (e.child = n.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = n.memoizedProps),
            (e.memoizedState = n.memoizedState),
            (e.updateQueue = n.updateQueue),
            (e.type = n.type),
            (t = n.dependencies),
            (e.dependencies =
              t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function vi(e, t, n, r, a, o) {
      var s = 0;
      if (((r = e), typeof e == `function`)) hi(e) && (s = 1);
      else if (typeof e == `string`)
        s = Xf(e, n, pe.current) ? 26 : e === `html` || e === `head` || e === `body` ? 27 : 5;
      else
        a: switch (e) {
          case ne:
            return (e = mi(31, n, t, a)), (e.elementType = ne), (e.lanes = o), e;
          case y:
            return yi(n.children, a, o, t);
          case b:
            (s = 8), (a |= 24);
            break;
          case x:
            return (e = mi(12, n, t, a | 2)), (e.elementType = x), (e.lanes = o), e;
          case ee:
            return (e = mi(13, n, t, a)), (e.elementType = ee), (e.lanes = o), e;
          case T:
            return (e = mi(19, n, t, a)), (e.elementType = T), (e.lanes = o), e;
          default:
            if (typeof e == `object` && e)
              switch (e.$$typeof) {
                case C:
                  s = 10;
                  break a;
                case S:
                  s = 9;
                  break a;
                case w:
                  s = 11;
                  break a;
                case te:
                  s = 14;
                  break a;
                case E:
                  (s = 16), (r = null);
                  break a;
              }
            (s = 29), (n = Error(i(130, e === null ? `null` : typeof e, ``))), (r = null);
        }
      return (t = mi(s, n, t, a)), (t.elementType = e), (t.type = r), (t.lanes = o), t;
    }
    function yi(e, t, n, r) {
      return (e = mi(7, e, r, t)), (e.lanes = n), e;
    }
    function bi(e, t, n) {
      return (e = mi(6, e, null, t)), (e.lanes = n), e;
    }
    function xi(e) {
      var t = mi(18, null, null, 0);
      return (t.stateNode = e), t;
    }
    function Si(e, t, n) {
      return (
        (t = mi(4, e.children === null ? [] : e.children, e.key, t)),
        (t.lanes = n),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var Ci = new WeakMap();
    function wi(e, t) {
      if (typeof e == `object` && e) {
        var n = Ci.get(e);
        return n === void 0 ? ((t = { value: e, source: t, stack: Ee(t) }), Ci.set(e, t), t) : n;
      }
      return { value: e, source: t, stack: Ee(t) };
    }
    var Ti = [],
      Ei = 0,
      Di = null,
      Oi = 0,
      ki = [],
      Ai = 0,
      ji = null,
      Mi = 1,
      Ni = ``;
    function Pi(e, t) {
      (Ti[Ei++] = Oi), (Ti[Ei++] = Di), (Di = e), (Oi = t);
    }
    function Fi(e, t, n) {
      (ki[Ai++] = Mi), (ki[Ai++] = Ni), (ki[Ai++] = ji), (ji = e);
      var r = Mi;
      e = Ni;
      var i = 32 - We(r) - 1;
      (r &= ~(1 << i)), (n += 1);
      var a = 32 - We(t) + i;
      if (30 < a) {
        var o = i - (i % 5);
        (a = (r & ((1 << o) - 1)).toString(32)),
          (r >>= o),
          (i -= o),
          (Mi = (1 << (32 - We(t) + i)) | (n << i) | r),
          (Ni = a + e);
      } else (Mi = (1 << a) | (n << i) | r), (Ni = e);
    }
    function Ii(e) {
      e.return !== null && (Pi(e, 1), Fi(e, 1, 0));
    }
    function Li(e) {
      for (; e === Di; ) (Di = Ti[--Ei]), (Ti[Ei] = null), (Oi = Ti[--Ei]), (Ti[Ei] = null);
      for (; e === ji; )
        (ji = ki[--Ai]),
          (ki[Ai] = null),
          (Ni = ki[--Ai]),
          (ki[Ai] = null),
          (Mi = ki[--Ai]),
          (ki[Ai] = null);
    }
    function Ri(e, t) {
      (ki[Ai++] = Mi), (ki[Ai++] = Ni), (ki[Ai++] = ji), (Mi = t.id), (Ni = t.overflow), (ji = e);
    }
    var zi = null,
      Bi = null,
      N = !1,
      Vi = null,
      Hi = !1,
      Ui = Error(i(519));
    function Wi(e) {
      throw (
        (Xi(
          wi(
            Error(
              i(
                418,
                1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? `text` : `HTML`,
                ``,
              ),
            ),
            e,
          ),
        ),
        Ui)
      );
    }
    function Gi(e) {
      var t = e.stateNode,
        n = e.type,
        r = e.memoizedProps;
      switch (((t[pt] = e), (t[mt] = r), n)) {
        case `dialog`:
          K(`cancel`, t), K(`close`, t);
          break;
        case `iframe`:
        case `object`:
        case `embed`:
          K(`load`, t);
          break;
        case `video`:
        case `audio`:
          for (n = 0; n < Cd.length; n++) K(Cd[n], t);
          break;
        case `source`:
          K(`error`, t);
          break;
        case `img`:
        case `image`:
        case `link`:
          K(`error`, t), K(`load`, t);
          break;
        case `details`:
          K(`toggle`, t);
          break;
        case `input`:
          K(`invalid`, t),
            qt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
          break;
        case `select`:
          K(`invalid`, t);
          break;
        case `textarea`:
          K(`invalid`, t), Xt(t, r.value, r.defaultValue, r.children);
      }
      (n = r.children),
        (typeof n != `string` && typeof n != `number` && typeof n != `bigint`) ||
        t.textContent === `` + n ||
        !0 === r.suppressHydrationWarning ||
        Rd(t.textContent, n)
          ? (r.popover != null && (K(`beforetoggle`, t), K(`toggle`, t)),
            r.onScroll != null && K(`scroll`, t),
            r.onScrollEnd != null && K(`scrollend`, t),
            r.onClick != null && (t.onclick = on),
            (t = !0))
          : (t = !1),
        t || Wi(e, !0);
    }
    function Ki(e) {
      for (zi = e.return; zi; )
        switch (zi.tag) {
          case 5:
          case 31:
          case 13:
            Hi = !1;
            return;
          case 27:
          case 3:
            Hi = !0;
            return;
          default:
            zi = zi.return;
        }
    }
    function qi(e) {
      if (e !== zi) return !1;
      if (!N) return Ki(e), (N = !0), !1;
      var t = e.tag,
        n;
      if (
        ((n = t !== 3 && t !== 27) &&
          ((n = t === 5) &&
            ((n = e.type), (n = !(n !== `form` && n !== `button`) || Xd(e.type, e.memoizedProps))),
          (n = !n)),
        n && Bi && Wi(e),
        Ki(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        Bi = _f(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        Bi = _f(e);
      } else
        t === 27
          ? ((t = Bi), af(e.type) ? ((e = gf), (gf = null), (Bi = e)) : (Bi = t))
          : (Bi = zi ? hf(e.stateNode.nextSibling) : null);
      return !0;
    }
    function Ji() {
      (Bi = zi = null), (N = !1);
    }
    function Yi() {
      var e = Vi;
      return e !== null && (ru === null ? (ru = e) : ru.push.apply(ru, e), (Vi = null)), e;
    }
    function Xi(e) {
      Vi === null ? (Vi = [e]) : Vi.push(e);
    }
    var Zi = fe(null),
      Qi = null,
      $i = null;
    function ea(e, t, n) {
      A(Zi, t._currentValue), (t._currentValue = n);
    }
    function ta(e) {
      (e._currentValue = Zi.current), k(Zi);
    }
    function na(e, t, n) {
      for (; e !== null; ) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function ra(e, t, n, r) {
      var a = e.child;
      for (a !== null && (a.return = e); a !== null; ) {
        var o = a.dependencies;
        if (o !== null) {
          var s = a.child;
          o = o.firstContext;
          a: for (; o !== null; ) {
            var c = o;
            o = a;
            for (var l = 0; l < t.length; l++)
              if (c.context === t[l]) {
                (o.lanes |= n),
                  (c = o.alternate),
                  c !== null && (c.lanes |= n),
                  na(o.return, n, e),
                  r || (s = null);
                break a;
              }
            o = c.next;
          }
        } else if (a.tag === 18) {
          if (((s = a.return), s === null)) throw Error(i(341));
          (s.lanes |= n), (o = s.alternate), o !== null && (o.lanes |= n), na(s, n, e), (s = null);
        } else s = a.child;
        if (s !== null) s.return = a;
        else
          for (s = a; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            if (((a = s.sibling), a !== null)) {
              (a.return = s.return), (s = a);
              break;
            }
            s = s.return;
          }
        a = s;
      }
    }
    function ia(e, t, n, r) {
      e = null;
      for (var a = t, o = !1; a !== null; ) {
        if (!o) {
          if (a.flags & 524288) o = !0;
          else if (a.flags & 262144) break;
        }
        if (a.tag === 10) {
          var s = a.alternate;
          if (s === null) throw Error(i(387));
          if (((s = s.memoizedProps), s !== null)) {
            var c = a.type;
            Or(a.pendingProps.value, s.value) || (e === null ? (e = [c]) : e.push(c));
          }
        } else if (a === ge.current) {
          if (((s = a.alternate), s === null)) throw Error(i(387));
          s.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
            (e === null ? (e = [ap]) : e.push(ap));
        }
        a = a.return;
      }
      e !== null && ra(t, e, n, r), (t.flags |= 262144);
    }
    function aa(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!Or(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function oa(e) {
      (Qi = e), ($i = null), (e = e.dependencies), e !== null && (e.firstContext = null);
    }
    function sa(e) {
      return la(Qi, e);
    }
    function ca(e, t) {
      return Qi === null && oa(e), la(e, t);
    }
    function la(e, t) {
      var n = t._currentValue;
      if (((t = { context: t, memoizedValue: n, next: null }), $i === null)) {
        if (e === null) throw Error(i(308));
        ($i = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288);
      } else $i = $i.next = t;
      return n;
    }
    var ua =
        typeof AbortController < `u`
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, n) {
                    e.push(n);
                  },
                });
              this.abort = function () {
                (t.aborted = !0),
                  e.forEach(function (e) {
                    return e();
                  });
              };
            },
      da = t.unstable_scheduleCallback,
      fa = t.unstable_NormalPriority,
      pa = {
        $$typeof: C,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function ma() {
      return { controller: new ua(), data: new Map(), refCount: 0 };
    }
    function P(e) {
      e.refCount--,
        e.refCount === 0 &&
          da(fa, function () {
            e.controller.abort();
          });
    }
    var ha = null,
      ga = 0,
      F = 0,
      _a = null;
    function va(e, t) {
      if (ha === null) {
        var n = (ha = []);
        (ga = 0),
          (F = _d()),
          (_a = {
            status: `pending`,
            value: void 0,
            then: function (e) {
              n.push(e);
            },
          });
      }
      return ga++, t.then(ya, ya), t;
    }
    function ya() {
      if (--ga === 0 && ha !== null) {
        _a !== null && (_a.status = `fulfilled`);
        var e = ha;
        (ha = null), (F = 0), (_a = null);
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function ba(e, t) {
      var n = [],
        r = {
          status: `pending`,
          value: null,
          reason: null,
          then: function (e) {
            n.push(e);
          },
        };
      return (
        e.then(
          function () {
            (r.status = `fulfilled`), (r.value = t);
            for (var e = 0; e < n.length; e++) (0, n[e])(t);
          },
          function (e) {
            for (r.status = `rejected`, r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
          },
        ),
        r
      );
    }
    var xa = D.S;
    D.S = function (e, t) {
      (ou = Me()),
        typeof t == `object` && t && typeof t.then == `function` && va(e, t),
        xa !== null && xa(e, t);
    };
    var Sa = fe(null);
    function Ca() {
      var e = Sa.current;
      return e === null ? Wl.pooledCache : e;
    }
    function wa(e, t) {
      t === null ? A(Sa, Sa.current) : A(Sa, t.pool);
    }
    function Ta() {
      var e = Ca();
      return e === null ? null : { parent: pa._currentValue, pool: e };
    }
    var Ea = Error(i(460)),
      Da = Error(i(474)),
      Oa = Error(i(542)),
      ka = { then: function () {} };
    function Aa(e) {
      return (e = e.status), e === `fulfilled` || e === `rejected`;
    }
    function ja(e, t, n) {
      switch (
        ((n = e[n]), n === void 0 ? e.push(t) : n !== t && (t.then(on, on), (t = n)), t.status)
      ) {
        case `fulfilled`:
          return t.value;
        case `rejected`:
          throw ((e = t.reason), Fa(e), e);
        default:
          if (typeof t.status == `string`) t.then(on, on);
          else {
            if (((e = Wl), e !== null && 100 < e.shellSuspendCounter)) throw Error(i(482));
            (e = t),
              (e.status = `pending`),
              e.then(
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    (n.status = `fulfilled`), (n.value = e);
                  }
                },
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    (n.status = `rejected`), (n.reason = e);
                  }
                },
              );
          }
          switch (t.status) {
            case `fulfilled`:
              return t.value;
            case `rejected`:
              throw ((e = t.reason), Fa(e), e);
          }
          throw ((Na = t), Ea);
      }
    }
    function Ma(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (e) {
        throw typeof e == `object` && e && typeof e.then == `function` ? ((Na = e), Ea) : e;
      }
    }
    var Na = null;
    function Pa() {
      if (Na === null) throw Error(i(459));
      var e = Na;
      return (Na = null), e;
    }
    function Fa(e) {
      if (e === Ea || e === Oa) throw Error(i(483));
    }
    var Ia = null,
      La = 0;
    function Ra(e) {
      var t = La;
      return (La += 1), Ia === null && (Ia = []), ja(Ia, e, t);
    }
    function za(e, t) {
      (t = t.props.ref), (e.ref = t === void 0 ? null : t);
    }
    function Ba(e, t) {
      throw t.$$typeof === g
        ? Error(i(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            i(
              31,
              e === `[object Object]` ? `object with keys {` + Object.keys(t).join(`, `) + `}` : e,
            ),
          ));
    }
    function Va(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; r !== null; ) t(n, r), (r = r.sibling);
        return null;
      }
      function r(e) {
        for (var t = new Map(); e !== null; )
          e.key === null ? t.set(e.index, e) : t.set(e.key, e), (e = e.sibling);
        return t;
      }
      function a(e, t) {
        return (e = gi(e, t)), (e.index = 0), (e.sibling = null), e;
      }
      function o(t, n, r) {
        return (
          (t.index = r),
          e
            ? ((r = t.alternate),
              r === null
                ? ((t.flags |= 67108866), n)
                : ((r = r.index), r < n ? ((t.flags |= 67108866), n) : r))
            : ((t.flags |= 1048576), n)
        );
      }
      function s(t) {
        return e && t.alternate === null && (t.flags |= 67108866), t;
      }
      function c(e, t, n, r) {
        return t === null || t.tag !== 6
          ? ((t = bi(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function l(e, t, n, r) {
        var i = n.type;
        return i === y
          ? d(e, t, n.props.children, r, n.key)
          : t !== null &&
              (t.elementType === i ||
                (typeof i == `object` && i && i.$$typeof === E && Ma(i) === t.type))
            ? ((t = a(t, n.props)), za(t, n), (t.return = e), t)
            : ((t = vi(n.type, n.key, n.props, null, e.mode, r)), za(t, n), (t.return = e), t);
      }
      function u(e, t, n, r) {
        return t === null ||
          t.tag !== 4 ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? ((t = Si(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n.children || [])), (t.return = e), t);
      }
      function d(e, t, n, r, i) {
        return t === null || t.tag !== 7
          ? ((t = yi(n, e.mode, r, i)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function f(e, t, n) {
        if ((typeof t == `string` && t !== ``) || typeof t == `number` || typeof t == `bigint`)
          return (t = bi(`` + t, e.mode, n)), (t.return = e), t;
        if (typeof t == `object` && t) {
          switch (t.$$typeof) {
            case _:
              return (n = vi(t.type, t.key, t.props, null, e.mode, n)), za(n, t), (n.return = e), n;
            case v:
              return (t = Si(t, e.mode, n)), (t.return = e), t;
            case E:
              return (t = Ma(t)), f(e, t, n);
          }
          if (ce(t) || ae(t)) return (t = yi(t, e.mode, n, null)), (t.return = e), t;
          if (typeof t.then == `function`) return f(e, Ra(t), n);
          if (t.$$typeof === C) return f(e, ca(e, t), n);
          Ba(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var i = t === null ? null : t.key;
        if ((typeof n == `string` && n !== ``) || typeof n == `number` || typeof n == `bigint`)
          return i === null ? c(e, t, `` + n, r) : null;
        if (typeof n == `object` && n) {
          switch (n.$$typeof) {
            case _:
              return n.key === i ? l(e, t, n, r) : null;
            case v:
              return n.key === i ? u(e, t, n, r) : null;
            case E:
              return (n = Ma(n)), p(e, t, n, r);
          }
          if (ce(n) || ae(n)) return i === null ? d(e, t, n, r, null) : null;
          if (typeof n.then == `function`) return p(e, t, Ra(n), r);
          if (n.$$typeof === C) return p(e, t, ca(e, n), r);
          Ba(e, n);
        }
        return null;
      }
      function m(e, t, n, r, i) {
        if ((typeof r == `string` && r !== ``) || typeof r == `number` || typeof r == `bigint`)
          return (e = e.get(n) || null), c(t, e, `` + r, i);
        if (typeof r == `object` && r) {
          switch (r.$$typeof) {
            case _:
              return (e = e.get(r.key === null ? n : r.key) || null), l(t, e, r, i);
            case v:
              return (e = e.get(r.key === null ? n : r.key) || null), u(t, e, r, i);
            case E:
              return (r = Ma(r)), m(e, t, n, r, i);
          }
          if (ce(r) || ae(r)) return (e = e.get(n) || null), d(t, e, r, i, null);
          if (typeof r.then == `function`) return m(e, t, n, Ra(r), i);
          if (r.$$typeof === C) return m(e, t, n, ca(t, r), i);
          Ba(t, r);
        }
        return null;
      }
      function h(i, a, s, c) {
        for (
          var l = null, u = null, d = a, h = (a = 0), g = null;
          d !== null && h < s.length;
          h++
        ) {
          d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
          var _ = p(i, d, s[h], c);
          if (_ === null) {
            d === null && (d = g);
            break;
          }
          e && d && _.alternate === null && t(i, d),
            (a = o(_, a, h)),
            u === null ? (l = _) : (u.sibling = _),
            (u = _),
            (d = g);
        }
        if (h === s.length) return n(i, d), N && Pi(i, h), l;
        if (d === null) {
          for (; h < s.length; h++)
            (d = f(i, s[h], c)),
              d !== null && ((a = o(d, a, h)), u === null ? (l = d) : (u.sibling = d), (u = d));
          return N && Pi(i, h), l;
        }
        for (d = r(d); h < s.length; h++)
          (g = m(d, i, h, s[h], c)),
            g !== null &&
              (e && g.alternate !== null && d.delete(g.key === null ? h : g.key),
              (a = o(g, a, h)),
              u === null ? (l = g) : (u.sibling = g),
              (u = g));
        return (
          e &&
            d.forEach(function (e) {
              return t(i, e);
            }),
          N && Pi(i, h),
          l
        );
      }
      function g(a, s, c, l) {
        if (c == null) throw Error(i(151));
        for (
          var u = null, d = null, h = s, g = (s = 0), _ = null, v = c.next();
          h !== null && !v.done;
          g++, v = c.next()
        ) {
          h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
          var y = p(a, h, v.value, l);
          if (y === null) {
            h === null && (h = _);
            break;
          }
          e && h && y.alternate === null && t(a, h),
            (s = o(y, s, g)),
            d === null ? (u = y) : (d.sibling = y),
            (d = y),
            (h = _);
        }
        if (v.done) return n(a, h), N && Pi(a, g), u;
        if (h === null) {
          for (; !v.done; g++, v = c.next())
            (v = f(a, v.value, l)),
              v !== null && ((s = o(v, s, g)), d === null ? (u = v) : (d.sibling = v), (d = v));
          return N && Pi(a, g), u;
        }
        for (h = r(h); !v.done; g++, v = c.next())
          (v = m(h, a, g, v.value, l)),
            v !== null &&
              (e && v.alternate !== null && h.delete(v.key === null ? g : v.key),
              (s = o(v, s, g)),
              d === null ? (u = v) : (d.sibling = v),
              (d = v));
        return (
          e &&
            h.forEach(function (e) {
              return t(a, e);
            }),
          N && Pi(a, g),
          u
        );
      }
      function b(e, r, o, c) {
        if (
          (typeof o == `object` && o && o.type === y && o.key === null && (o = o.props.children),
          typeof o == `object` && o)
        ) {
          switch (o.$$typeof) {
            case _:
              a: {
                for (var l = o.key; r !== null; ) {
                  if (r.key === l) {
                    if (((l = o.type), l === y)) {
                      if (r.tag === 7) {
                        n(e, r.sibling), (c = a(r, o.props.children)), (c.return = e), (e = c);
                        break a;
                      }
                    } else if (
                      r.elementType === l ||
                      (typeof l == `object` && l && l.$$typeof === E && Ma(l) === r.type)
                    ) {
                      n(e, r.sibling), (c = a(r, o.props)), za(c, o), (c.return = e), (e = c);
                      break a;
                    }
                    n(e, r);
                    break;
                  } else t(e, r);
                  r = r.sibling;
                }
                o.type === y
                  ? ((c = yi(o.props.children, e.mode, c, o.key)), (c.return = e), (e = c))
                  : ((c = vi(o.type, o.key, o.props, null, e.mode, c)),
                    za(c, o),
                    (c.return = e),
                    (e = c));
              }
              return s(e);
            case v:
              a: {
                for (l = o.key; r !== null; ) {
                  if (r.key === l)
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === o.containerInfo &&
                      r.stateNode.implementation === o.implementation
                    ) {
                      n(e, r.sibling), (c = a(r, o.children || [])), (c.return = e), (e = c);
                      break a;
                    } else {
                      n(e, r);
                      break;
                    }
                  else t(e, r);
                  r = r.sibling;
                }
                (c = Si(o, e.mode, c)), (c.return = e), (e = c);
              }
              return s(e);
            case E:
              return (o = Ma(o)), b(e, r, o, c);
          }
          if (ce(o)) return h(e, r, o, c);
          if (ae(o)) {
            if (((l = ae(o)), typeof l != `function`)) throw Error(i(150));
            return (o = l.call(o)), g(e, r, o, c);
          }
          if (typeof o.then == `function`) return b(e, r, Ra(o), c);
          if (o.$$typeof === C) return b(e, r, ca(e, o), c);
          Ba(e, o);
        }
        return (typeof o == `string` && o !== ``) || typeof o == `number` || typeof o == `bigint`
          ? ((o = `` + o),
            r !== null && r.tag === 6
              ? (n(e, r.sibling), (c = a(r, o)), (c.return = e), (e = c))
              : (n(e, r), (c = bi(o, e.mode, c)), (c.return = e), (e = c)),
            s(e))
          : n(e, r);
      }
      return function (e, t, n, r) {
        try {
          La = 0;
          var i = b(e, t, n, r);
          return (Ia = null), i;
        } catch (t) {
          if (t === Ea || t === Oa) throw t;
          var a = mi(29, t, null, e.mode);
          return (a.lanes = r), (a.return = e), a;
        }
      };
    }
    var I = Va(!0),
      Ha = Va(!1),
      Ua = !1;
    function Wa(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function Ga(e, t) {
      (e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          });
    }
    function Ka(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function qa(e, t, n) {
      var r = e.updateQueue;
      if (r === null) return null;
      if (((r = r.shared), V & 2)) {
        var i = r.pending;
        return (
          i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
          (r.pending = t),
          (t = di(e)),
          ui(e, null, n),
          t
        );
      }
      return si(e, r, t, n), di(e);
    }
    function Ja(e, t, n) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194048))) {
        var r = t.lanes;
        (r &= e.pendingLanes), (n |= r), (t.lanes = n), ot(e, n);
      }
    }
    function Ya(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (r !== null && ((r = r.updateQueue), n === r)) {
        var i = null,
          a = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
          do {
            var o = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
            a === null ? (i = a = o) : (a = a.next = o), (n = n.next);
          } while (n !== null);
          a === null ? (i = a = t) : (a = a.next = t);
        } else i = a = t;
        (n = {
          baseState: r.baseState,
          firstBaseUpdate: i,
          lastBaseUpdate: a,
          shared: r.shared,
          callbacks: r.callbacks,
        }),
          (e.updateQueue = n);
        return;
      }
      (e = n.lastBaseUpdate),
        e === null ? (n.firstBaseUpdate = t) : (e.next = t),
        (n.lastBaseUpdate = t);
    }
    var Xa = !1;
    function Za() {
      if (Xa) {
        var e = _a;
        if (e !== null) throw e;
      }
    }
    function Qa(e, t, n, r) {
      Xa = !1;
      var i = e.updateQueue;
      Ua = !1;
      var a = i.firstBaseUpdate,
        o = i.lastBaseUpdate,
        s = i.shared.pending;
      if (s !== null) {
        i.shared.pending = null;
        var c = s,
          l = c.next;
        (c.next = null), o === null ? (a = l) : (o.next = l), (o = c);
        var u = e.alternate;
        u !== null &&
          ((u = u.updateQueue),
          (s = u.lastBaseUpdate),
          s !== o && (s === null ? (u.firstBaseUpdate = l) : (s.next = l), (u.lastBaseUpdate = c)));
      }
      if (a !== null) {
        var d = i.baseState;
        (o = 0), (u = l = c = null), (s = a);
        do {
          var f = s.lane & -536870913,
            p = f !== s.lane;
          if (p ? (U & f) === f : (r & f) === f) {
            f !== 0 && f === F && (Xa = !0),
              u !== null &&
                (u = u.next =
                  { lane: 0, tag: s.tag, payload: s.payload, callback: null, next: null });
            a: {
              var h = e,
                g = s;
              f = t;
              var _ = n;
              switch (g.tag) {
                case 1:
                  if (((h = g.payload), typeof h == `function`)) {
                    d = h.call(_, d, f);
                    break a;
                  }
                  d = h;
                  break a;
                case 3:
                  h.flags = (h.flags & -65537) | 128;
                case 0:
                  if (
                    ((h = g.payload), (f = typeof h == `function` ? h.call(_, d, f) : h), f == null)
                  )
                    break a;
                  d = m({}, d, f);
                  break a;
                case 2:
                  Ua = !0;
              }
            }
            (f = s.callback),
              f !== null &&
                ((e.flags |= 64),
                p && (e.flags |= 8192),
                (p = i.callbacks),
                p === null ? (i.callbacks = [f]) : p.push(f));
          } else
            (p = { lane: f, tag: s.tag, payload: s.payload, callback: s.callback, next: null }),
              u === null ? ((l = u = p), (c = d)) : (u = u.next = p),
              (o |= f);
          if (((s = s.next), s === null)) {
            if (((s = i.shared.pending), s === null)) break;
            (p = s),
              (s = p.next),
              (p.next = null),
              (i.lastBaseUpdate = p),
              (i.shared.pending = null);
          }
        } while (1);
        u === null && (c = d),
          (i.baseState = c),
          (i.firstBaseUpdate = l),
          (i.lastBaseUpdate = u),
          a === null && (i.shared.lanes = 0),
          (Zl |= o),
          (e.lanes = o),
          (e.memoizedState = d);
      }
    }
    function L(e, t) {
      if (typeof e != `function`) throw Error(i(191, e));
      e.call(t);
    }
    function $a(e, t) {
      var n = e.callbacks;
      if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) L(n[e], t);
    }
    var eo = fe(null),
      to = fe(0);
    function no(e, t) {
      (e = Yl), A(to, e), A(eo, t), (Yl = e | t.baseLanes);
    }
    function ro() {
      A(to, Yl), A(eo, eo.current);
    }
    function io() {
      (Yl = to.current), k(eo), k(to);
    }
    var ao = fe(null),
      R = null;
    function oo(e) {
      var t = e.alternate;
      A(fo, fo.current & 1),
        A(ao, e),
        R === null && (t === null || eo.current !== null || t.memoizedState !== null) && (R = e);
    }
    function so(e) {
      A(fo, fo.current), A(ao, e), R === null && (R = e);
    }
    function co(e) {
      e.tag === 22 ? (A(fo, fo.current), A(ao, e), R === null && (R = e)) : lo(e);
    }
    function lo() {
      A(fo, fo.current), A(ao, ao.current);
    }
    function uo(e) {
      k(ao), R === e && (R = null), k(fo);
    }
    var fo = fe(0);
    function po(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var n = t.memoizedState;
          if (n !== null && ((n = n.dehydrated), n === null || ff(n) || pf(n))) return t;
        } else if (
          t.tag === 19 &&
          (t.memoizedProps.revealOrder === `forwards` ||
            t.memoizedProps.revealOrder === `backwards` ||
            t.memoizedProps.revealOrder === `unstable_legacy-backwards` ||
            t.memoizedProps.revealOrder === `together`)
        ) {
          if (t.flags & 128) return t;
        } else if (t.child !== null) {
          (t.child.return = t), (t = t.child);
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        (t.sibling.return = t.return), (t = t.sibling);
      }
      return null;
    }
    var mo = 0,
      z = null,
      B = null,
      ho = null,
      go = !1,
      _o = !1,
      vo = !1,
      yo = 0,
      bo = 0,
      xo = null,
      So = 0;
    function Co() {
      throw Error(i(321));
    }
    function wo(e, t) {
      if (t === null) return !1;
      for (var n = 0; n < t.length && n < e.length; n++) if (!Or(e[n], t[n])) return !1;
      return !0;
    }
    function To(e, t, n, r, i, a) {
      return (
        (mo = a),
        (z = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (D.H = e === null || e.memoizedState === null ? Hs : Us),
        (vo = !1),
        (a = n(r, i)),
        (vo = !1),
        _o && (a = Do(t, n, r, i)),
        Eo(e),
        a
      );
    }
    function Eo(e) {
      D.H = Vs;
      var t = B !== null && B.next !== null;
      if (((mo = 0), (ho = B = z = null), (go = !1), (bo = 0), (xo = null), t)) throw Error(i(300));
      e === null || oc || ((e = e.dependencies), e !== null && aa(e) && (oc = !0));
    }
    function Do(e, t, n, r) {
      z = e;
      var a = 0;
      do {
        if ((_o && (xo = null), (bo = 0), (_o = !1), 25 <= a)) throw Error(i(301));
        if (((a += 1), (ho = B = null), e.updateQueue != null)) {
          var o = e.updateQueue;
          (o.lastEffect = null),
            (o.events = null),
            (o.stores = null),
            o.memoCache != null && (o.memoCache.index = 0);
        }
        (D.H = Ws), (o = t(n, r));
      } while (_o);
      return o;
    }
    function Oo() {
      var e = D.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == `function` ? Fo(t) : t),
        (e = e.useState()[0]),
        (B === null ? null : B.memoizedState) !== e && (z.flags |= 1024),
        t
      );
    }
    function ko() {
      var e = yo !== 0;
      return (yo = 0), e;
    }
    function Ao(e, t, n) {
      (t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n);
    }
    function jo(e) {
      if (go) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), (e = e.next);
        }
        go = !1;
      }
      (mo = 0), (ho = B = z = null), (_o = !1), (bo = yo = 0), (xo = null);
    }
    function Mo() {
      var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return ho === null ? (z.memoizedState = ho = e) : (ho = ho.next = e), ho;
    }
    function No() {
      if (B === null) {
        var e = z.alternate;
        e = e === null ? null : e.memoizedState;
      } else e = B.next;
      var t = ho === null ? z.memoizedState : ho.next;
      if (t !== null) (ho = t), (B = e);
      else {
        if (e === null) throw z.alternate === null ? Error(i(467)) : Error(i(310));
        (B = e),
          (e = {
            memoizedState: B.memoizedState,
            baseState: B.baseState,
            baseQueue: B.baseQueue,
            queue: B.queue,
            next: null,
          }),
          ho === null ? (z.memoizedState = ho = e) : (ho = ho.next = e);
      }
      return ho;
    }
    function Po() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Fo(e) {
      var t = bo;
      return (
        (bo += 1),
        xo === null && (xo = []),
        (e = ja(xo, e, t)),
        (t = z),
        (ho === null ? t.memoizedState : ho.next) === null &&
          ((t = t.alternate), (D.H = t === null || t.memoizedState === null ? Hs : Us)),
        e
      );
    }
    function Io(e) {
      if (typeof e == `object` && e) {
        if (typeof e.then == `function`) return Fo(e);
        if (e.$$typeof === C) return sa(e);
      }
      throw Error(i(438, String(e)));
    }
    function Lo(e) {
      var t = null,
        n = z.updateQueue;
      if ((n !== null && (t = n.memoCache), t == null)) {
        var r = z.alternate;
        r !== null &&
          ((r = r.updateQueue),
          r !== null &&
            ((r = r.memoCache),
            r != null &&
              (t = {
                data: r.data.map(function (e) {
                  return e.slice();
                }),
                index: 0,
              })));
      }
      if (
        ((t ??= { data: [], index: 0 }),
        n === null && ((n = Po()), (z.updateQueue = n)),
        (n.memoCache = t),
        (n = t.data[t.index]),
        n === void 0)
      )
        for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = re;
      return t.index++, n;
    }
    function Ro(e, t) {
      return typeof t == `function` ? t(e) : t;
    }
    function zo(e) {
      return Bo(No(), B, e);
    }
    function Bo(e, t, n) {
      var r = e.queue;
      if (r === null) throw Error(i(311));
      r.lastRenderedReducer = n;
      var a = e.baseQueue,
        o = r.pending;
      if (o !== null) {
        if (a !== null) {
          var s = a.next;
          (a.next = o.next), (o.next = s);
        }
        (t.baseQueue = a = o), (r.pending = null);
      }
      if (((o = e.baseState), a === null)) e.memoizedState = o;
      else {
        t = a.next;
        var c = (s = null),
          l = null,
          u = t,
          d = !1;
        do {
          var f = u.lane & -536870913;
          if (f === u.lane ? (mo & f) === f : (U & f) === f) {
            var p = u.revertLane;
            if (p === 0)
              l !== null &&
                (l = l.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: u.action,
                    hasEagerState: u.hasEagerState,
                    eagerState: u.eagerState,
                    next: null,
                  }),
                f === F && (d = !0);
            else if ((mo & p) === p) {
              (u = u.next), p === F && (d = !0);
              continue;
            } else
              (f = {
                lane: 0,
                revertLane: u.revertLane,
                gesture: null,
                action: u.action,
                hasEagerState: u.hasEagerState,
                eagerState: u.eagerState,
                next: null,
              }),
                l === null ? ((c = l = f), (s = o)) : (l = l.next = f),
                (z.lanes |= p),
                (Zl |= p);
            (f = u.action), vo && n(o, f), (o = u.hasEagerState ? u.eagerState : n(o, f));
          } else
            (p = {
              lane: f,
              revertLane: u.revertLane,
              gesture: u.gesture,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
              l === null ? ((c = l = p), (s = o)) : (l = l.next = p),
              (z.lanes |= f),
              (Zl |= f);
          u = u.next;
        } while (u !== null && u !== t);
        if (
          (l === null ? (s = o) : (l.next = c),
          !Or(o, e.memoizedState) && ((oc = !0), d && ((n = _a), n !== null)))
        )
          throw n;
        (e.memoizedState = o), (e.baseState = s), (e.baseQueue = l), (r.lastRenderedState = o);
      }
      return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
    }
    function Vo(e) {
      var t = No(),
        n = t.queue;
      if (n === null) throw Error(i(311));
      n.lastRenderedReducer = e;
      var r = n.dispatch,
        a = n.pending,
        o = t.memoizedState;
      if (a !== null) {
        n.pending = null;
        var s = (a = a.next);
        do (o = e(o, s.action)), (s = s.next);
        while (s !== a);
        Or(o, t.memoizedState) || (oc = !0),
          (t.memoizedState = o),
          t.baseQueue === null && (t.baseState = o),
          (n.lastRenderedState = o);
      }
      return [o, r];
    }
    function Ho(e, t, n) {
      var r = z,
        a = No(),
        o = N;
      if (o) {
        if (n === void 0) throw Error(i(407));
        n = n();
      } else n = t();
      var s = !Or((B || a).memoizedState, n);
      if (
        (s && ((a.memoizedState = n), (oc = !0)),
        (a = a.queue),
        ps(Go.bind(null, r, a, e), [e]),
        a.getSnapshot !== t || s || (ho !== null && ho.memoizedState.tag & 1))
      ) {
        if (
          ((r.flags |= 2048),
          cs(9, { destroy: void 0 }, Wo.bind(null, r, a, n, t), null),
          Wl === null)
        )
          throw Error(i(349));
        o || mo & 127 || Uo(r, t, n);
      }
      return n;
    }
    function Uo(e, t, n) {
      (e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = z.updateQueue),
        t === null
          ? ((t = Po()), (z.updateQueue = t), (t.stores = [e]))
          : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
    }
    function Wo(e, t, n, r) {
      (t.value = n), (t.getSnapshot = r), Ko(t) && qo(e);
    }
    function Go(e, t, n) {
      return n(function () {
        Ko(t) && qo(e);
      });
    }
    function Ko(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !Or(e, n);
      } catch {
        return !0;
      }
    }
    function qo(e) {
      var t = li(e, 2);
      t !== null && xu(t, e, 2);
    }
    function Jo(e) {
      var t = Mo();
      if (typeof e == `function`) {
        var n = e;
        if (((e = n()), vo)) {
          Ue(!0);
          try {
            n();
          } finally {
            Ue(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ro,
          lastRenderedState: e,
        }),
        t
      );
    }
    function Yo(e, t, n, r) {
      return (e.baseState = n), Bo(e, B, typeof r == `function` ? r : Ro);
    }
    function Xo(e, t, n, r, a) {
      if (Rs(e)) throw Error(i(485));
      if (((e = t.action), e !== null)) {
        var o = {
          payload: a,
          action: e,
          next: null,
          isTransition: !0,
          status: `pending`,
          value: null,
          reason: null,
          listeners: [],
          then: function (e) {
            o.listeners.push(e);
          },
        };
        D.T === null ? (o.isTransition = !1) : n(!0),
          r(o),
          (n = t.pending),
          n === null
            ? ((o.next = t.pending = o), Zo(t, o))
            : ((o.next = n.next), (t.pending = n.next = o));
      }
    }
    function Zo(e, t) {
      var n = t.action,
        r = t.payload,
        i = e.state;
      if (t.isTransition) {
        var a = D.T,
          o = {};
        D.T = o;
        try {
          var s = n(i, r),
            c = D.S;
          c !== null && c(o, s), Qo(e, t, s);
        } catch (n) {
          es(e, t, n);
        } finally {
          a !== null && o.types !== null && (a.types = o.types), (D.T = a);
        }
      } else
        try {
          (a = n(i, r)), Qo(e, t, a);
        } catch (n) {
          es(e, t, n);
        }
    }
    function Qo(e, t, n) {
      typeof n == `object` && n && typeof n.then == `function`
        ? n.then(
            function (n) {
              $o(e, t, n);
            },
            function (n) {
              return es(e, t, n);
            },
          )
        : $o(e, t, n);
    }
    function $o(e, t, n) {
      (t.status = `fulfilled`),
        (t.value = n),
        ts(t),
        (e.state = n),
        (t = e.pending),
        t !== null &&
          ((n = t.next), n === t ? (e.pending = null) : ((n = n.next), (t.next = n), Zo(e, n)));
    }
    function es(e, t, n) {
      var r = e.pending;
      if (((e.pending = null), r !== null)) {
        r = r.next;
        do (t.status = `rejected`), (t.reason = n), ts(t), (t = t.next);
        while (t !== r);
      }
      e.action = null;
    }
    function ts(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function ns(e, t) {
      return t;
    }
    function rs(e, t) {
      if (N) {
        var n = Wl.formState;
        if (n !== null) {
          a: {
            var r = z;
            if (N) {
              if (Bi) {
                b: {
                  for (var i = Bi, a = Hi; i.nodeType !== 8; ) {
                    if (!a) {
                      i = null;
                      break b;
                    }
                    if (((i = hf(i.nextSibling)), i === null)) {
                      i = null;
                      break b;
                    }
                  }
                  (a = i.data), (i = a === `F!` || a === `F` ? i : null);
                }
                if (i) {
                  (Bi = hf(i.nextSibling)), (r = i.data === `F!`);
                  break a;
                }
              }
              Wi(r);
            }
            r = !1;
          }
          r && (t = n[0]);
        }
      }
      return (
        (n = Mo()),
        (n.memoizedState = n.baseState = t),
        (r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: ns,
          lastRenderedState: t,
        }),
        (n.queue = r),
        (n = Fs.bind(null, z, r)),
        (r.dispatch = n),
        (r = Jo(!1)),
        (a = Ls.bind(null, z, !1, r.queue)),
        (r = Mo()),
        (i = { state: t, dispatch: null, action: e, pending: null }),
        (r.queue = i),
        (n = Xo.bind(null, z, i, a, n)),
        (i.dispatch = n),
        (r.memoizedState = e),
        [t, n, !1]
      );
    }
    function is(e) {
      return as(No(), B, e);
    }
    function as(e, t, n) {
      if (
        ((t = Bo(e, t, ns)[0]),
        (e = zo(Ro)[0]),
        typeof t == `object` && t && typeof t.then == `function`)
      )
        try {
          var r = Fo(t);
        } catch (e) {
          throw e === Ea ? Oa : e;
        }
      else r = t;
      t = No();
      var i = t.queue,
        a = i.dispatch;
      return (
        n !== t.memoizedState &&
          ((z.flags |= 2048), cs(9, { destroy: void 0 }, os.bind(null, i, n), null)),
        [r, a, e]
      );
    }
    function os(e, t) {
      e.action = t;
    }
    function ss(e) {
      var t = No(),
        n = B;
      if (n !== null) return as(t, n, e);
      No(), (t = t.memoizedState), (n = No());
      var r = n.queue.dispatch;
      return (n.memoizedState = e), [t, r, !1];
    }
    function cs(e, t, n, r) {
      return (
        (e = { tag: e, create: n, deps: r, inst: t, next: null }),
        (t = z.updateQueue),
        t === null && ((t = Po()), (z.updateQueue = t)),
        (n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
        e
      );
    }
    function ls() {
      return No().memoizedState;
    }
    function us(e, t, n, r) {
      var i = Mo();
      (z.flags |= e),
        (i.memoizedState = cs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r));
    }
    function ds(e, t, n, r) {
      var i = No();
      r = r === void 0 ? null : r;
      var a = i.memoizedState.inst;
      B !== null && r !== null && wo(r, B.memoizedState.deps)
        ? (i.memoizedState = cs(t, a, n, r))
        : ((z.flags |= e), (i.memoizedState = cs(1 | t, a, n, r)));
    }
    function fs(e, t) {
      us(8390656, 8, e, t);
    }
    function ps(e, t) {
      ds(2048, 8, e, t);
    }
    function ms(e) {
      z.flags |= 4;
      var t = z.updateQueue;
      if (t === null) (t = Po()), (z.updateQueue = t), (t.events = [e]);
      else {
        var n = t.events;
        n === null ? (t.events = [e]) : n.push(e);
      }
    }
    function hs(e) {
      var t = No().memoizedState;
      return (
        ms({ ref: t, nextImpl: e }),
        function () {
          if (V & 2) throw Error(i(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function gs(e, t) {
      return ds(4, 2, e, t);
    }
    function _s(e, t) {
      return ds(4, 4, e, t);
    }
    function vs(e, t) {
      if (typeof t == `function`) {
        e = e();
        var n = t(e);
        return function () {
          typeof n == `function` ? n() : t(null);
        };
      }
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function ys(e, t, n) {
      (n = n == null ? null : n.concat([e])), ds(4, 4, vs.bind(null, t, e), n);
    }
    function bs() {}
    function xs(e, t) {
      var n = No();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return t !== null && wo(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function Ss(e, t) {
      var n = No();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      if (t !== null && wo(t, r[1])) return r[0];
      if (((r = e()), vo)) {
        Ue(!0);
        try {
          e();
        } finally {
          Ue(!1);
        }
      }
      return (n.memoizedState = [r, t]), r;
    }
    function Cs(e, t, n) {
      return n === void 0 || (mo & 1073741824 && !(U & 261930))
        ? (e.memoizedState = t)
        : ((e.memoizedState = n), (e = bu()), (z.lanes |= e), (Zl |= e), n);
    }
    function ws(e, t, n, r) {
      return Or(n, t)
        ? n
        : eo.current === null
          ? !(mo & 42) || (mo & 1073741824 && !(U & 261930))
            ? ((oc = !0), (e.memoizedState = n))
            : ((e = bu()), (z.lanes |= e), (Zl |= e), t)
          : ((e = Cs(e, n, r)), Or(e, t) || (oc = !0), e);
    }
    function Ts(e, t, n, r, i) {
      var a = O.p;
      O.p = a !== 0 && 8 > a ? a : 8;
      var o = D.T,
        s = {};
      (D.T = s), Ls(e, !1, t, n);
      try {
        var c = i(),
          l = D.S;
        l !== null && l(s, c),
          typeof c == `object` && c && typeof c.then == `function`
            ? Is(e, t, ba(c, r), yu(e))
            : Is(e, t, r, yu(e));
      } catch (n) {
        Is(e, t, { then: function () {}, status: `rejected`, reason: n }, yu());
      } finally {
        (O.p = a), o !== null && s.types !== null && (o.types = s.types), (D.T = o);
      }
    }
    function Es() {}
    function Ds(e, t, n, r) {
      if (e.tag !== 5) throw Error(i(476));
      var a = Os(e).queue;
      Ts(
        e,
        a,
        t,
        le,
        n === null
          ? Es
          : function () {
              return ks(e), n(r);
            },
      );
    }
    function Os(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: le,
        baseState: le,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ro,
          lastRenderedState: le,
        },
        next: null,
      };
      var n = {};
      return (
        (t.next = {
          memoizedState: n,
          baseState: n,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Ro,
            lastRenderedState: n,
          },
          next: null,
        }),
        (e.memoizedState = t),
        (e = e.alternate),
        e !== null && (e.memoizedState = t),
        t
      );
    }
    function ks(e) {
      var t = Os(e);
      t.next === null && (t = e.alternate.memoizedState), Is(e, t.next.queue, {}, yu());
    }
    function As() {
      return sa(ap);
    }
    function js() {
      return No().memoizedState;
    }
    function Ms() {
      return No().memoizedState;
    }
    function Ns(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = yu();
            e = Ka(n);
            var r = qa(t, e, n);
            r !== null && (xu(r, t, n), Ja(r, t, n)), (t = { cache: ma() }), (e.payload = t);
            return;
        }
        t = t.return;
      }
    }
    function Ps(e, t, n) {
      var r = yu();
      (n = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        Rs(e) ? zs(t, n) : ((n = ci(e, t, n, r)), n !== null && (xu(n, e, r), Bs(n, t, r)));
    }
    function Fs(e, t, n) {
      Is(e, t, n, yu());
    }
    function Is(e, t, n, r) {
      var i = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (Rs(e)) zs(t, i);
      else {
        var a = e.alternate;
        if (
          e.lanes === 0 &&
          (a === null || a.lanes === 0) &&
          ((a = t.lastRenderedReducer), a !== null)
        )
          try {
            var o = t.lastRenderedState,
              s = a(o, n);
            if (((i.hasEagerState = !0), (i.eagerState = s), Or(s, o)))
              return si(e, t, i, 0), Wl === null && oi(), !1;
          } catch {}
        if (((n = ci(e, t, i, r)), n !== null)) return xu(n, e, r), Bs(n, t, r), !0;
      }
      return !1;
    }
    function Ls(e, t, n, r) {
      if (
        ((r = {
          lane: 2,
          revertLane: _d(),
          gesture: null,
          action: r,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        Rs(e))
      ) {
        if (t) throw Error(i(479));
      } else (t = ci(e, n, r, 2)), t !== null && xu(t, e, 2);
    }
    function Rs(e) {
      var t = e.alternate;
      return e === z || (t !== null && t === z);
    }
    function zs(e, t) {
      _o = go = !0;
      var n = e.pending;
      n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t);
    }
    function Bs(e, t, n) {
      if (n & 4194048) {
        var r = t.lanes;
        (r &= e.pendingLanes), (n |= r), (t.lanes = n), ot(e, n);
      }
    }
    var Vs = {
      readContext: sa,
      use: Io,
      useCallback: Co,
      useContext: Co,
      useEffect: Co,
      useImperativeHandle: Co,
      useLayoutEffect: Co,
      useInsertionEffect: Co,
      useMemo: Co,
      useReducer: Co,
      useRef: Co,
      useState: Co,
      useDebugValue: Co,
      useDeferredValue: Co,
      useTransition: Co,
      useSyncExternalStore: Co,
      useId: Co,
      useHostTransitionStatus: Co,
      useFormState: Co,
      useActionState: Co,
      useOptimistic: Co,
      useMemoCache: Co,
      useCacheRefresh: Co,
    };
    Vs.useEffectEvent = Co;
    var Hs = {
        readContext: sa,
        use: Io,
        useCallback: function (e, t) {
          return (Mo().memoizedState = [e, t === void 0 ? null : t]), e;
        },
        useContext: sa,
        useEffect: fs,
        useImperativeHandle: function (e, t, n) {
          (n = n == null ? null : n.concat([e])), us(4194308, 4, vs.bind(null, t, e), n);
        },
        useLayoutEffect: function (e, t) {
          return us(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          us(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = Mo();
          t = t === void 0 ? null : t;
          var r = e();
          if (vo) {
            Ue(!0);
            try {
              e();
            } finally {
              Ue(!1);
            }
          }
          return (n.memoizedState = [r, t]), r;
        },
        useReducer: function (e, t, n) {
          var r = Mo();
          if (n !== void 0) {
            var i = n(t);
            if (vo) {
              Ue(!0);
              try {
                n(t);
              } finally {
                Ue(!1);
              }
            }
          } else i = t;
          return (
            (r.memoizedState = r.baseState = i),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: i,
            }),
            (r.queue = e),
            (e = e.dispatch = Ps.bind(null, z, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = Mo();
          return (e = { current: e }), (t.memoizedState = e);
        },
        useState: function (e) {
          e = Jo(e);
          var t = e.queue,
            n = Fs.bind(null, z, t);
          return (t.dispatch = n), [e.memoizedState, n];
        },
        useDebugValue: bs,
        useDeferredValue: function (e, t) {
          return Cs(Mo(), e, t);
        },
        useTransition: function () {
          var e = Jo(!1);
          return (e = Ts.bind(null, z, e.queue, !0, !1)), (Mo().memoizedState = e), [!1, e];
        },
        useSyncExternalStore: function (e, t, n) {
          var r = z,
            a = Mo();
          if (N) {
            if (n === void 0) throw Error(i(407));
            n = n();
          } else {
            if (((n = t()), Wl === null)) throw Error(i(349));
            U & 127 || Uo(r, t, n);
          }
          a.memoizedState = n;
          var o = { value: n, getSnapshot: t };
          return (
            (a.queue = o),
            fs(Go.bind(null, r, o, e), [e]),
            (r.flags |= 2048),
            cs(9, { destroy: void 0 }, Wo.bind(null, r, o, n, t), null),
            n
          );
        },
        useId: function () {
          var e = Mo(),
            t = Wl.identifierPrefix;
          if (N) {
            var n = Ni,
              r = Mi;
            (n = (r & ~(1 << (32 - We(r) - 1))).toString(32) + n),
              (t = `_` + t + `R_` + n),
              (n = yo++),
              0 < n && (t += `H` + n.toString(32)),
              (t += `_`);
          } else (n = So++), (t = `_` + t + `r_` + n.toString(32) + `_`);
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: As,
        useFormState: rs,
        useActionState: rs,
        useOptimistic: function (e) {
          var t = Mo();
          t.memoizedState = t.baseState = e;
          var n = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return (t.queue = n), (t = Ls.bind(null, z, !0, n)), (n.dispatch = t), [e, t];
        },
        useMemoCache: Lo,
        useCacheRefresh: function () {
          return (Mo().memoizedState = Ns.bind(null, z));
        },
        useEffectEvent: function (e) {
          var t = Mo(),
            n = { impl: e };
          return (
            (t.memoizedState = n),
            function () {
              if (V & 2) throw Error(i(440));
              return n.impl.apply(void 0, arguments);
            }
          );
        },
      },
      Us = {
        readContext: sa,
        use: Io,
        useCallback: xs,
        useContext: sa,
        useEffect: ps,
        useImperativeHandle: ys,
        useInsertionEffect: gs,
        useLayoutEffect: _s,
        useMemo: Ss,
        useReducer: zo,
        useRef: ls,
        useState: function () {
          return zo(Ro);
        },
        useDebugValue: bs,
        useDeferredValue: function (e, t) {
          return ws(No(), B.memoizedState, e, t);
        },
        useTransition: function () {
          var e = zo(Ro)[0],
            t = No().memoizedState;
          return [typeof e == `boolean` ? e : Fo(e), t];
        },
        useSyncExternalStore: Ho,
        useId: js,
        useHostTransitionStatus: As,
        useFormState: is,
        useActionState: is,
        useOptimistic: function (e, t) {
          return Yo(No(), B, e, t);
        },
        useMemoCache: Lo,
        useCacheRefresh: Ms,
      };
    Us.useEffectEvent = hs;
    var Ws = {
      readContext: sa,
      use: Io,
      useCallback: xs,
      useContext: sa,
      useEffect: ps,
      useImperativeHandle: ys,
      useInsertionEffect: gs,
      useLayoutEffect: _s,
      useMemo: Ss,
      useReducer: Vo,
      useRef: ls,
      useState: function () {
        return Vo(Ro);
      },
      useDebugValue: bs,
      useDeferredValue: function (e, t) {
        var n = No();
        return B === null ? Cs(n, e, t) : ws(n, B.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Vo(Ro)[0],
          t = No().memoizedState;
        return [typeof e == `boolean` ? e : Fo(e), t];
      },
      useSyncExternalStore: Ho,
      useId: js,
      useHostTransitionStatus: As,
      useFormState: ss,
      useActionState: ss,
      useOptimistic: function (e, t) {
        var n = No();
        return B === null ? ((n.baseState = e), [e, n.queue.dispatch]) : Yo(n, B, e, t);
      },
      useMemoCache: Lo,
      useCacheRefresh: Ms,
    };
    Ws.useEffectEvent = hs;
    function Gs(e, t, n, r) {
      (t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : m({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n);
    }
    var Ks = {
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = yu(),
          i = Ka(r);
        (i.payload = t),
          n != null && (i.callback = n),
          (t = qa(e, i, r)),
          t !== null && (xu(t, e, r), Ja(t, e, r));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = yu(),
          i = Ka(r);
        (i.tag = 1),
          (i.payload = t),
          n != null && (i.callback = n),
          (t = qa(e, i, r)),
          t !== null && (xu(t, e, r), Ja(t, e, r));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = yu(),
          r = Ka(n);
        (r.tag = 2),
          t != null && (r.callback = t),
          (t = qa(e, r, n)),
          t !== null && (xu(t, e, n), Ja(t, e, n));
      },
    };
    function qs(e, t, n, r, i, a, o) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == `function`
          ? e.shouldComponentUpdate(r, a, o)
          : t.prototype && t.prototype.isPureReactComponent
            ? !kr(n, r) || !kr(i, a)
            : !0
      );
    }
    function Js(e, t, n, r) {
      (e = t.state),
        typeof t.componentWillReceiveProps == `function` && t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == `function` &&
          t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && Ks.enqueueReplaceState(t, t.state, null);
    }
    function Ys(e, t) {
      var n = t;
      if (`ref` in t) for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
      if ((e = e.defaultProps))
        for (var i in (n === t && (n = m({}, n)), e)) n[i] === void 0 && (n[i] = e[i]);
      return n;
    }
    function Xs(e) {
      ni(e);
    }
    function Zs(e) {
      console.error(e);
    }
    function Qs(e) {
      ni(e);
    }
    function $s(e, t) {
      try {
        var n = e.onUncaughtError;
        n(t.value, { componentStack: t.stack });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function ec(e, t, n) {
      try {
        var r = e.onCaughtError;
        r(n.value, { componentStack: n.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function tc(e, t, n) {
      return (
        (n = Ka(n)),
        (n.tag = 3),
        (n.payload = { element: null }),
        (n.callback = function () {
          $s(e, t);
        }),
        n
      );
    }
    function nc(e) {
      return (e = Ka(e)), (e.tag = 3), e;
    }
    function rc(e, t, n, r) {
      var i = n.type.getDerivedStateFromError;
      if (typeof i == `function`) {
        var a = r.value;
        (e.payload = function () {
          return i(a);
        }),
          (e.callback = function () {
            ec(t, n, r);
          });
      }
      var o = n.stateNode;
      o !== null &&
        typeof o.componentDidCatch == `function` &&
        (e.callback = function () {
          ec(t, n, r),
            typeof i != `function` && (lu === null ? (lu = new Set([this])) : lu.add(this));
          var e = r.stack;
          this.componentDidCatch(r.value, { componentStack: e === null ? `` : e });
        });
    }
    function ic(e, t, n, r, a) {
      if (((n.flags |= 32768), typeof r == `object` && r && typeof r.then == `function`)) {
        if (((t = n.alternate), t !== null && ia(t, n, a, !0), (n = ao.current), n !== null)) {
          switch (n.tag) {
            case 31:
            case 13:
              return (
                R === null ? Nu() : n.alternate === null && Xl === 0 && (Xl = 3),
                (n.flags &= -257),
                (n.flags |= 65536),
                (n.lanes = a),
                r === ka
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null ? (n.updateQueue = new Set([r])) : t.add(r),
                    Zu(e, r, a)),
                !1
              );
            case 22:
              return (
                (n.flags |= 65536),
                r === ka
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null
                      ? ((t = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([r]),
                        }),
                        (n.updateQueue = t))
                      : ((n = t.retryQueue), n === null ? (t.retryQueue = new Set([r])) : n.add(r)),
                    Zu(e, r, a)),
                !1
              );
          }
          throw Error(i(435, n.tag));
        }
        return Zu(e, r, a), Nu(), !1;
      }
      if (N)
        return (
          (t = ao.current),
          t === null
            ? (r !== Ui && ((t = Error(i(423), { cause: r })), Xi(wi(t, n))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (a &= -a),
              (e.lanes |= a),
              (r = wi(r, n)),
              (a = tc(e.stateNode, r, a)),
              Ya(e, a),
              Xl !== 4 && (Xl = 2))
            : (!(t.flags & 65536) && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = a),
              r !== Ui && ((e = Error(i(422), { cause: r })), Xi(wi(e, n)))),
          !1
        );
      var o = Error(i(520), { cause: r });
      if (((o = wi(o, n)), nu === null ? (nu = [o]) : nu.push(o), Xl !== 4 && (Xl = 2), t === null))
        return !0;
      (r = wi(r, n)), (n = t);
      do {
        switch (n.tag) {
          case 3:
            return (
              (n.flags |= 65536),
              (e = a & -a),
              (n.lanes |= e),
              (e = tc(n.stateNode, r, e)),
              Ya(n, e),
              !1
            );
          case 1:
            if (
              ((t = n.type),
              (o = n.stateNode),
              !(n.flags & 128) &&
                (typeof t.getDerivedStateFromError == `function` ||
                  (o !== null &&
                    typeof o.componentDidCatch == `function` &&
                    (lu === null || !lu.has(o)))))
            )
              return (
                (n.flags |= 65536),
                (a &= -a),
                (n.lanes |= a),
                (a = nc(a)),
                rc(a, e, n, r),
                Ya(n, a),
                !1
              );
        }
        n = n.return;
      } while (n !== null);
      return !1;
    }
    var ac = Error(i(461)),
      oc = !1;
    function sc(e, t, n, r) {
      t.child = e === null ? Ha(t, null, n, r) : I(t, e.child, n, r);
    }
    function cc(e, t, n, r, i) {
      n = n.render;
      var a = t.ref;
      if (`ref` in r) {
        var o = {};
        for (var s in r) s !== `ref` && (o[s] = r[s]);
      } else o = r;
      return (
        oa(t),
        (r = To(e, t, n, o, a, i)),
        (s = ko()),
        e !== null && !oc
          ? (Ao(e, t, i), Mc(e, t, i))
          : (N && s && Ii(t), (t.flags |= 1), sc(e, t, r, i), t.child)
      );
    }
    function lc(e, t, n, r, i) {
      if (e === null) {
        var a = n.type;
        return typeof a == `function` && !hi(a) && a.defaultProps === void 0 && n.compare === null
          ? ((t.tag = 15), (t.type = a), uc(e, t, a, r, i))
          : ((e = vi(n.type, null, r, t, t.mode, i)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((a = e.child), !Nc(e, i))) {
        var o = a.memoizedProps;
        if (((n = n.compare), (n = n === null ? kr : n), n(o, r) && e.ref === t.ref))
          return Mc(e, t, i);
      }
      return (t.flags |= 1), (e = gi(a, r)), (e.ref = t.ref), (e.return = t), (t.child = e);
    }
    function uc(e, t, n, r, i) {
      if (e !== null) {
        var a = e.memoizedProps;
        if (kr(a, r) && e.ref === t.ref)
          if (((oc = !1), (t.pendingProps = r = a), Nc(e, i))) e.flags & 131072 && (oc = !0);
          else return (t.lanes = e.lanes), Mc(e, t, i);
      }
      return vc(e, t, n, r, i);
    }
    function dc(e, t, n, r) {
      var i = r.children,
        a = e === null ? null : e.memoizedState;
      if (
        (e === null &&
          t.stateNode === null &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        r.mode === `hidden`)
      ) {
        if (t.flags & 128) {
          if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
            for (r = t.child = e.child, i = 0; r !== null; )
              (i = i | r.lanes | r.childLanes), (r = r.sibling);
            r = i & ~a;
          } else (r = 0), (t.child = null);
          return pc(e, t, a, n, r);
        }
        if (n & 536870912)
          (t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && wa(t, a === null ? null : a.cachePool),
            a === null ? ro() : no(t, a),
            co(t);
        else return (r = t.lanes = 536870912), pc(e, t, a === null ? n : a.baseLanes | n, n, r);
      } else
        a === null
          ? (e !== null && wa(t, null), ro(), lo(t))
          : (wa(t, a.cachePool), no(t, a), lo(t), (t.memoizedState = null));
      return sc(e, t, i, n), t.child;
    }
    function fc(e, t) {
      return (
        (e !== null && e.tag === 22) ||
          t.stateNode !== null ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function pc(e, t, n, r, i) {
      var a = Ca();
      return (
        (a = a === null ? null : { parent: pa._currentValue, pool: a }),
        (t.memoizedState = { baseLanes: n, cachePool: a }),
        e !== null && wa(t, null),
        ro(),
        co(t),
        e !== null && ia(e, t, r, !0),
        (t.childLanes = i),
        null
      );
    }
    function mc(e, t) {
      return (
        (t = Dc({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function hc(e, t, n) {
      return (
        I(t, e.child, null, n),
        (e = mc(t, t.pendingProps)),
        (e.flags |= 2),
        uo(t),
        (t.memoizedState = null),
        e
      );
    }
    function gc(e, t, n) {
      var r = t.pendingProps,
        a = (t.flags & 128) != 0;
      if (((t.flags &= -129), e === null)) {
        if (N) {
          if (r.mode === `hidden`) return (e = mc(t, r)), (t.lanes = 536870912), fc(null, e);
          if (
            (so(t),
            (e = Bi)
              ? ((e = df(e, Hi)),
                (e = e !== null && e.data === `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: ji === null ? null : { id: Mi, overflow: Ni },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = xi(e)),
                  (n.return = t),
                  (t.child = n),
                  (zi = t),
                  (Bi = null)))
              : (e = null),
            e === null)
          )
            throw Wi(t);
          return (t.lanes = 536870912), null;
        }
        return mc(t, r);
      }
      var o = e.memoizedState;
      if (o !== null) {
        var s = o.dehydrated;
        if ((so(t), a))
          if (t.flags & 256) (t.flags &= -257), (t = hc(e, t, n));
          else if (t.memoizedState !== null) (t.child = e.child), (t.flags |= 128), (t = null);
          else throw Error(i(558));
        else if ((oc || ia(e, t, n, !1), (a = (n & e.childLanes) !== 0), oc || a)) {
          if (((r = Wl), r !== null && ((s = st(r, n)), s !== 0 && s !== o.retryLane)))
            throw ((o.retryLane = s), li(e, s), xu(r, e, s), ac);
          Nu(), (t = hc(e, t, n));
        } else
          (e = o.treeContext),
            (Bi = hf(s.nextSibling)),
            (zi = t),
            (N = !0),
            (Vi = null),
            (Hi = !1),
            e !== null && Ri(t, e),
            (t = mc(t, r)),
            (t.flags |= 4096);
        return t;
      }
      return (
        (e = gi(e.child, { mode: r.mode, children: r.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function _c(e, t) {
      var n = t.ref;
      if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof n != `function` && typeof n != `object`) throw Error(i(284));
        (e === null || e.ref !== n) && (t.flags |= 4194816);
      }
    }
    function vc(e, t, n, r, i) {
      return (
        oa(t),
        (n = To(e, t, n, r, void 0, i)),
        (r = ko()),
        e !== null && !oc
          ? (Ao(e, t, i), Mc(e, t, i))
          : (N && r && Ii(t), (t.flags |= 1), sc(e, t, n, i), t.child)
      );
    }
    function yc(e, t, n, r, i, a) {
      return (
        oa(t),
        (t.updateQueue = null),
        (n = Do(t, r, n, i)),
        Eo(e),
        (r = ko()),
        e !== null && !oc
          ? (Ao(e, t, a), Mc(e, t, a))
          : (N && r && Ii(t), (t.flags |= 1), sc(e, t, n, a), t.child)
      );
    }
    function bc(e, t, n, r, i) {
      if ((oa(t), t.stateNode === null)) {
        var a = fi,
          o = n.contextType;
        typeof o == `object` && o && (a = sa(o)),
          (a = new n(r, a)),
          (t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null),
          (a.updater = Ks),
          (t.stateNode = a),
          (a._reactInternals = t),
          (a = t.stateNode),
          (a.props = r),
          (a.state = t.memoizedState),
          (a.refs = {}),
          Wa(t),
          (o = n.contextType),
          (a.context = typeof o == `object` && o ? sa(o) : fi),
          (a.state = t.memoizedState),
          (o = n.getDerivedStateFromProps),
          typeof o == `function` && (Gs(t, n, o, r), (a.state = t.memoizedState)),
          typeof n.getDerivedStateFromProps == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function` ||
            (typeof a.UNSAFE_componentWillMount != `function` &&
              typeof a.componentWillMount != `function`) ||
            ((o = a.state),
            typeof a.componentWillMount == `function` && a.componentWillMount(),
            typeof a.UNSAFE_componentWillMount == `function` && a.UNSAFE_componentWillMount(),
            o !== a.state && Ks.enqueueReplaceState(a, a.state, null),
            Qa(t, r, a, i),
            Za(),
            (a.state = t.memoizedState)),
          typeof a.componentDidMount == `function` && (t.flags |= 4194308),
          (r = !0);
      } else if (e === null) {
        a = t.stateNode;
        var s = t.memoizedProps,
          c = Ys(n, s);
        a.props = c;
        var l = a.context,
          u = n.contextType;
        (o = fi), typeof u == `object` && u && (o = sa(u));
        var d = n.getDerivedStateFromProps;
        (u = typeof d == `function` || typeof a.getSnapshotBeforeUpdate == `function`),
          (s = t.pendingProps !== s),
          u ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((s || l !== o) && Js(t, a, r, o)),
          (Ua = !1);
        var f = t.memoizedState;
        (a.state = f),
          Qa(t, r, a, i),
          Za(),
          (l = t.memoizedState),
          s || f !== l || Ua
            ? (typeof d == `function` && (Gs(t, n, d, r), (l = t.memoizedState)),
              (c = Ua || qs(t, n, c, r, f, l, o))
                ? (u ||
                    (typeof a.UNSAFE_componentWillMount != `function` &&
                      typeof a.componentWillMount != `function`) ||
                    (typeof a.componentWillMount == `function` && a.componentWillMount(),
                    typeof a.UNSAFE_componentWillMount == `function` &&
                      a.UNSAFE_componentWillMount()),
                  typeof a.componentDidMount == `function` && (t.flags |= 4194308))
                : (typeof a.componentDidMount == `function` && (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = l)),
              (a.props = r),
              (a.state = l),
              (a.context = o),
              (r = c))
            : (typeof a.componentDidMount == `function` && (t.flags |= 4194308), (r = !1));
      } else {
        (a = t.stateNode),
          Ga(e, t),
          (o = t.memoizedProps),
          (u = Ys(n, o)),
          (a.props = u),
          (d = t.pendingProps),
          (f = a.context),
          (l = n.contextType),
          (c = fi),
          typeof l == `object` && l && (c = sa(l)),
          (s = n.getDerivedStateFromProps),
          (l = typeof s == `function` || typeof a.getSnapshotBeforeUpdate == `function`) ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((o !== d || f !== c) && Js(t, a, r, c)),
          (Ua = !1),
          (f = t.memoizedState),
          (a.state = f),
          Qa(t, r, a, i),
          Za();
        var p = t.memoizedState;
        o !== d || f !== p || Ua || (e !== null && e.dependencies !== null && aa(e.dependencies))
          ? (typeof s == `function` && (Gs(t, n, s, r), (p = t.memoizedState)),
            (u =
              Ua ||
              qs(t, n, u, r, f, p, c) ||
              (e !== null && e.dependencies !== null && aa(e.dependencies)))
              ? (l ||
                  (typeof a.UNSAFE_componentWillUpdate != `function` &&
                    typeof a.componentWillUpdate != `function`) ||
                  (typeof a.componentWillUpdate == `function` && a.componentWillUpdate(r, p, c),
                  typeof a.UNSAFE_componentWillUpdate == `function` &&
                    a.UNSAFE_componentWillUpdate(r, p, c)),
                typeof a.componentDidUpdate == `function` && (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate == `function` && (t.flags |= 1024))
              : (typeof a.componentDidUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (a.props = r),
            (a.state = p),
            (a.context = c),
            (r = u))
          : (typeof a.componentDidUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return (
        (a = r),
        _c(e, t),
        (r = (t.flags & 128) != 0),
        a || r
          ? ((a = t.stateNode),
            (n = r && typeof n.getDerivedStateFromError != `function` ? null : a.render()),
            (t.flags |= 1),
            e !== null && r
              ? ((t.child = I(t, e.child, null, i)), (t.child = I(t, null, n, i)))
              : sc(e, t, n, i),
            (t.memoizedState = a.state),
            (e = t.child))
          : (e = Mc(e, t, i)),
        e
      );
    }
    function xc(e, t, n, r) {
      return Ji(), (t.flags |= 256), sc(e, t, n, r), t.child;
    }
    var Sc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function Cc(e) {
      return { baseLanes: e, cachePool: Ta() };
    }
    function wc(e, t, n) {
      return (e = e === null ? 0 : e.childLanes & ~n), t && (e |= eu), e;
    }
    function Tc(e, t, n) {
      var r = t.pendingProps,
        a = !1,
        o = (t.flags & 128) != 0,
        s;
      if (
        ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (fo.current & 2) != 0),
        s && ((a = !0), (t.flags &= -129)),
        (s = (t.flags & 32) != 0),
        (t.flags &= -33),
        e === null)
      ) {
        if (N) {
          if (
            (a ? oo(t) : lo(t),
            (e = Bi)
              ? ((e = df(e, Hi)),
                (e = e !== null && e.data !== `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: ji === null ? null : { id: Mi, overflow: Ni },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = xi(e)),
                  (n.return = t),
                  (t.child = n),
                  (zi = t),
                  (Bi = null)))
              : (e = null),
            e === null)
          )
            throw Wi(t);
          return pf(e) ? (t.lanes = 32) : (t.lanes = 536870912), null;
        }
        var c = r.children;
        return (
          (r = r.fallback),
          a
            ? (lo(t),
              (a = t.mode),
              (c = Dc({ mode: `hidden`, children: c }, a)),
              (r = yi(r, a, n, null)),
              (c.return = t),
              (r.return = t),
              (c.sibling = r),
              (t.child = c),
              (r = t.child),
              (r.memoizedState = Cc(n)),
              (r.childLanes = wc(e, s, n)),
              (t.memoizedState = Sc),
              fc(null, r))
            : (oo(t), Ec(t, c))
        );
      }
      var l = e.memoizedState;
      if (l !== null && ((c = l.dehydrated), c !== null)) {
        if (o)
          t.flags & 256
            ? (oo(t), (t.flags &= -257), (t = Oc(e, t, n)))
            : t.memoizedState === null
              ? (lo(t),
                (c = r.fallback),
                (a = t.mode),
                (r = Dc({ mode: `visible`, children: r.children }, a)),
                (c = yi(c, a, n, null)),
                (c.flags |= 2),
                (r.return = t),
                (c.return = t),
                (r.sibling = c),
                (t.child = r),
                I(t, e.child, null, n),
                (r = t.child),
                (r.memoizedState = Cc(n)),
                (r.childLanes = wc(e, s, n)),
                (t.memoizedState = Sc),
                (t = fc(null, r)))
              : (lo(t), (t.child = e.child), (t.flags |= 128), (t = null));
        else if ((oo(t), pf(c))) {
          if (((s = c.nextSibling && c.nextSibling.dataset), s)) var u = s.dgst;
          (s = u),
            (r = Error(i(419))),
            (r.stack = ``),
            (r.digest = s),
            Xi({ value: r, source: null, stack: null }),
            (t = Oc(e, t, n));
        } else if ((oc || ia(e, t, n, !1), (s = (n & e.childLanes) !== 0), oc || s)) {
          if (((s = Wl), s !== null && ((r = st(s, n)), r !== 0 && r !== l.retryLane)))
            throw ((l.retryLane = r), li(e, r), xu(s, e, r), ac);
          ff(c) || Nu(), (t = Oc(e, t, n));
        } else
          ff(c)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = l.treeContext),
              (Bi = hf(c.nextSibling)),
              (zi = t),
              (N = !0),
              (Vi = null),
              (Hi = !1),
              e !== null && Ri(t, e),
              (t = Ec(t, r.children)),
              (t.flags |= 4096));
        return t;
      }
      return a
        ? (lo(t),
          (c = r.fallback),
          (a = t.mode),
          (l = e.child),
          (u = l.sibling),
          (r = gi(l, { mode: `hidden`, children: r.children })),
          (r.subtreeFlags = l.subtreeFlags & 65011712),
          u === null ? ((c = yi(c, a, n, null)), (c.flags |= 2)) : (c = gi(u, c)),
          (c.return = t),
          (r.return = t),
          (r.sibling = c),
          (t.child = r),
          fc(null, r),
          (r = t.child),
          (c = e.child.memoizedState),
          c === null
            ? (c = Cc(n))
            : ((a = c.cachePool),
              a === null
                ? (a = Ta())
                : ((l = pa._currentValue), (a = a.parent === l ? a : { parent: l, pool: l })),
              (c = { baseLanes: c.baseLanes | n, cachePool: a })),
          (r.memoizedState = c),
          (r.childLanes = wc(e, s, n)),
          (t.memoizedState = Sc),
          fc(e.child, r))
        : (oo(t),
          (n = e.child),
          (e = n.sibling),
          (n = gi(n, { mode: `visible`, children: r.children })),
          (n.return = t),
          (n.sibling = null),
          e !== null &&
            ((s = t.deletions), s === null ? ((t.deletions = [e]), (t.flags |= 16)) : s.push(e)),
          (t.child = n),
          (t.memoizedState = null),
          n);
    }
    function Ec(e, t) {
      return (t = Dc({ mode: `visible`, children: t }, e.mode)), (t.return = e), (e.child = t);
    }
    function Dc(e, t) {
      return (e = mi(22, e, null, t)), (e.lanes = 0), e;
    }
    function Oc(e, t, n) {
      return (
        I(t, e.child, null, n),
        (e = Ec(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function kc(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      r !== null && (r.lanes |= t), na(e.return, t, n);
    }
    function Ac(e, t, n, r, i, a) {
      var o = e.memoizedState;
      o === null
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: i,
            treeForkCount: a,
          })
        : ((o.isBackwards = t),
          (o.rendering = null),
          (o.renderingStartTime = 0),
          (o.last = r),
          (o.tail = n),
          (o.tailMode = i),
          (o.treeForkCount = a));
    }
    function jc(e, t, n) {
      var r = t.pendingProps,
        i = r.revealOrder,
        a = r.tail;
      r = r.children;
      var o = fo.current,
        s = (o & 2) != 0;
      if (
        (s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
        A(fo, o),
        sc(e, t, r, n),
        (r = N ? Oi : 0),
        !s && e !== null && e.flags & 128)
      )
        a: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && kc(e, n, t);
          else if (e.tag === 19) kc(e, n, t);
          else if (e.child !== null) {
            (e.child.return = e), (e = e.child);
            continue;
          }
          if (e === t) break a;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break a;
            e = e.return;
          }
          (e.sibling.return = e.return), (e = e.sibling);
        }
      switch (i) {
        case `forwards`:
          for (n = t.child, i = null; n !== null; )
            (e = n.alternate), e !== null && po(e) === null && (i = n), (n = n.sibling);
          (n = i),
            n === null ? ((i = t.child), (t.child = null)) : ((i = n.sibling), (n.sibling = null)),
            Ac(t, !1, i, n, a, r);
          break;
        case `backwards`:
        case `unstable_legacy-backwards`:
          for (n = null, i = t.child, t.child = null; i !== null; ) {
            if (((e = i.alternate), e !== null && po(e) === null)) {
              t.child = i;
              break;
            }
            (e = i.sibling), (i.sibling = n), (n = i), (i = e);
          }
          Ac(t, !0, n, null, a, r);
          break;
        case `together`:
          Ac(t, !1, null, null, void 0, r);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function Mc(e, t, n) {
      if (
        (e !== null && (t.dependencies = e.dependencies), (Zl |= t.lanes), (n & t.childLanes) === 0)
      )
        if (e !== null) {
          if ((ia(e, t, n, !1), (n & t.childLanes) === 0)) return null;
        } else return null;
      if (e !== null && t.child !== e.child) throw Error(i(153));
      if (t.child !== null) {
        for (
          e = t.child, n = gi(e, e.pendingProps), t.child = n, n.return = t;
          e.sibling !== null;
        )
          (e = e.sibling), (n = n.sibling = gi(e, e.pendingProps)), (n.return = t);
        n.sibling = null;
      }
      return t.child;
    }
    function Nc(e, t) {
      return (e.lanes & t) === 0 ? ((e = e.dependencies), !!(e !== null && aa(e))) : !0;
    }
    function Pc(e, t, n) {
      switch (t.tag) {
        case 3:
          _e(t, t.stateNode.containerInfo), ea(t, pa, e.memoizedState.cache), Ji();
          break;
        case 27:
        case 5:
          ve(t);
          break;
        case 4:
          _e(t, t.stateNode.containerInfo);
          break;
        case 10:
          ea(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return (t.flags |= 128), so(t), null;
          break;
        case 13:
          var r = t.memoizedState;
          if (r !== null)
            return r.dehydrated === null
              ? (n & t.child.childLanes) === 0
                ? (oo(t), (e = Mc(e, t, n)), e === null ? null : e.sibling)
                : Tc(e, t, n)
              : (oo(t), (t.flags |= 128), null);
          oo(t);
          break;
        case 19:
          var i = (e.flags & 128) != 0;
          if (
            ((r = (n & t.childLanes) !== 0), (r ||= (ia(e, t, n, !1), (n & t.childLanes) !== 0)), i)
          ) {
            if (r) return jc(e, t, n);
            t.flags |= 128;
          }
          if (
            ((i = t.memoizedState),
            i !== null && ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
            A(fo, fo.current),
            r)
          )
            break;
          return null;
        case 22:
          return (t.lanes = 0), dc(e, t, n, t.pendingProps);
        case 24:
          ea(t, pa, e.memoizedState.cache);
      }
      return Mc(e, t, n);
    }
    function Fc(e, t, n) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps) oc = !0;
        else {
          if (!Nc(e, n) && !(t.flags & 128)) return (oc = !1), Pc(e, t, n);
          oc = !!(e.flags & 131072);
        }
      else (oc = !1), N && t.flags & 1048576 && Fi(t, Oi, t.index);
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          a: {
            var r = t.pendingProps;
            if (((e = Ma(t.elementType)), (t.type = e), typeof e == `function`))
              hi(e)
                ? ((r = Ys(e, r)), (t.tag = 1), (t = bc(null, t, e, r, n)))
                : ((t.tag = 0), (t = vc(null, t, e, r, n)));
            else {
              if (e != null) {
                var a = e.$$typeof;
                if (a === w) {
                  (t.tag = 11), (t = cc(null, t, e, r, n));
                  break a;
                } else if (a === te) {
                  (t.tag = 14), (t = lc(null, t, e, r, n));
                  break a;
                }
              }
              throw ((t = se(e) || e), Error(i(306, t, ``)));
            }
          }
          return t;
        case 0:
          return vc(e, t, t.type, t.pendingProps, n);
        case 1:
          return (r = t.type), (a = Ys(r, t.pendingProps)), bc(e, t, r, a, n);
        case 3:
          a: {
            if ((_e(t, t.stateNode.containerInfo), e === null)) throw Error(i(387));
            r = t.pendingProps;
            var o = t.memoizedState;
            (a = o.element), Ga(e, t), Qa(t, r, null, n);
            var s = t.memoizedState;
            if (
              ((r = s.cache),
              ea(t, pa, r),
              r !== o.cache && ra(t, [pa], n, !0),
              Za(),
              (r = s.element),
              o.isDehydrated)
            )
              if (
                ((o = { element: r, isDehydrated: !1, cache: s.cache }),
                (t.updateQueue.baseState = o),
                (t.memoizedState = o),
                t.flags & 256)
              ) {
                t = xc(e, t, r, n);
                break a;
              } else if (r !== a) {
                (a = wi(Error(i(424)), t)), Xi(a), (t = xc(e, t, r, n));
                break a;
              } else {
                switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                  case 9:
                    e = e.body;
                    break;
                  default:
                    e = e.nodeName === `HTML` ? e.ownerDocument.body : e;
                }
                for (
                  Bi = hf(e.firstChild),
                    zi = t,
                    N = !0,
                    Vi = null,
                    Hi = !0,
                    n = Ha(t, null, r, n),
                    t.child = n;
                  n;
                )
                  (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
              }
            else {
              if ((Ji(), r === a)) {
                t = Mc(e, t, n);
                break a;
              }
              sc(e, t, r, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            _c(e, t),
            e === null
              ? (n = If(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = n)
                : N ||
                  ((n = t.type),
                  (e = t.pendingProps),
                  (r = qd(he.current).createElement(n)),
                  (r[pt] = t),
                  (r[mt] = e),
                  Vd(r, n, e),
                  Et(r),
                  (t.stateNode = r))
              : (t.memoizedState = If(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
            null
          );
        case 27:
          return (
            ve(t),
            e === null &&
              N &&
              ((r = t.stateNode = yf(t.type, t.pendingProps, he.current)),
              (zi = t),
              (Hi = !0),
              (a = Bi),
              af(t.type) ? ((gf = a), (Bi = hf(r.firstChild))) : (Bi = a)),
            sc(e, t, t.pendingProps.children, n),
            _c(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              N &&
              ((a = r = Bi) &&
                ((r = lf(r, t.type, t.pendingProps, Hi)),
                r === null
                  ? (a = !1)
                  : ((t.stateNode = r), (zi = t), (Bi = hf(r.firstChild)), (Hi = !1), (a = !0))),
              a || Wi(t)),
            ve(t),
            (a = t.type),
            (o = t.pendingProps),
            (s = e === null ? null : e.memoizedProps),
            (r = o.children),
            Xd(a, o) ? (r = null) : s !== null && Xd(a, s) && (t.flags |= 32),
            t.memoizedState !== null && ((a = To(e, t, Oo, null, null, n)), (ap._currentValue = a)),
            _c(e, t),
            sc(e, t, r, n),
            t.child
          );
        case 6:
          return (
            e === null &&
              N &&
              ((e = n = Bi) &&
                ((n = uf(n, t.pendingProps, Hi)),
                n === null ? (e = !1) : ((t.stateNode = n), (zi = t), (Bi = null), (e = !0))),
              e || Wi(t)),
            null
          );
        case 13:
          return Tc(e, t, n);
        case 4:
          return (
            _e(t, t.stateNode.containerInfo),
            (r = t.pendingProps),
            e === null ? (t.child = I(t, null, r, n)) : sc(e, t, r, n),
            t.child
          );
        case 11:
          return cc(e, t, t.type, t.pendingProps, n);
        case 7:
          return sc(e, t, t.pendingProps, n), t.child;
        case 8:
          return sc(e, t, t.pendingProps.children, n), t.child;
        case 12:
          return sc(e, t, t.pendingProps.children, n), t.child;
        case 10:
          return (r = t.pendingProps), ea(t, t.type, r.value), sc(e, t, r.children, n), t.child;
        case 9:
          return (
            (a = t.type._context),
            (r = t.pendingProps.children),
            oa(t),
            (a = sa(a)),
            (r = r(a)),
            (t.flags |= 1),
            sc(e, t, r, n),
            t.child
          );
        case 14:
          return lc(e, t, t.type, t.pendingProps, n);
        case 15:
          return uc(e, t, t.type, t.pendingProps, n);
        case 19:
          return jc(e, t, n);
        case 31:
          return gc(e, t, n);
        case 22:
          return dc(e, t, n, t.pendingProps);
        case 24:
          return (
            oa(t),
            (r = sa(pa)),
            e === null
              ? ((a = Ca()),
                a === null &&
                  ((a = Wl),
                  (o = ma()),
                  (a.pooledCache = o),
                  o.refCount++,
                  o !== null && (a.pooledCacheLanes |= n),
                  (a = o)),
                (t.memoizedState = { parent: r, cache: a }),
                Wa(t),
                ea(t, pa, a))
              : ((e.lanes & n) !== 0 && (Ga(e, t), Qa(t, null, null, n), Za()),
                (a = e.memoizedState),
                (o = t.memoizedState),
                a.parent === r
                  ? ((r = o.cache), ea(t, pa, r), r !== a.cache && ra(t, [pa], n, !0))
                  : ((a = { parent: r, cache: r }),
                    (t.memoizedState = a),
                    t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a),
                    ea(t, pa, r))),
            sc(e, t, t.pendingProps.children, n),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(i(156, t.tag));
    }
    function Ic(e) {
      e.flags |= 4;
    }
    function Lc(e, t, n, r, i) {
      if (((t = (e.mode & 32) != 0) && (t = !1), t)) {
        if (((e.flags |= 16777216), (i & 335544128) === i))
          if (e.stateNode.complete) e.flags |= 8192;
          else if (Au()) e.flags |= 8192;
          else throw ((Na = ka), Da);
      } else e.flags &= -16777217;
    }
    function Rc(e, t) {
      if (t.type !== `stylesheet` || t.state.loading & 4) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !Zf(t)))
        if (Au()) e.flags |= 8192;
        else throw ((Na = ka), Da);
    }
    function zc(e, t) {
      t !== null && (e.flags |= 4),
        e.flags & 16384 && ((t = e.tag === 22 ? 536870912 : tt()), (e.lanes |= t), (tu |= t));
    }
    function Bc(e, t) {
      if (!N)
        switch (e.tailMode) {
          case `hidden`:
            t = e.tail;
            for (var n = null; t !== null; ) t.alternate !== null && (n = t), (t = t.sibling);
            n === null ? (e.tail = null) : (n.sibling = null);
            break;
          case `collapsed`:
            n = e.tail;
            for (var r = null; n !== null; ) n.alternate !== null && (r = n), (n = n.sibling);
            r === null
              ? t || e.tail === null
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (r.sibling = null);
        }
    }
    function Vc(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var i = e.child; i !== null; )
          (n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags & 65011712),
            (r |= i.flags & 65011712),
            (i.return = e),
            (i = i.sibling);
      else
        for (i = e.child; i !== null; )
          (n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags),
            (r |= i.flags),
            (i.return = e),
            (i = i.sibling);
      return (e.subtreeFlags |= r), (e.childLanes = n), t;
    }
    function Hc(e, t, n) {
      var r = t.pendingProps;
      switch ((Li(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return Vc(t), null;
        case 1:
          return Vc(t), null;
        case 3:
          return (
            (n = t.stateNode),
            (r = null),
            e !== null && (r = e.memoizedState.cache),
            t.memoizedState.cache !== r && (t.flags |= 2048),
            ta(pa),
            j(),
            n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
            (e === null || e.child === null) &&
              (qi(t)
                ? Ic(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                  ((t.flags |= 1024), Yi())),
            Vc(t),
            null
          );
        case 26:
          var a = t.type,
            o = t.memoizedState;
          return (
            e === null
              ? (Ic(t), o === null ? (Vc(t), Lc(t, a, null, r, n)) : (Vc(t), Rc(t, o)))
              : o
                ? o === e.memoizedState
                  ? (Vc(t), (t.flags &= -16777217))
                  : (Ic(t), Vc(t), Rc(t, o))
                : ((e = e.memoizedProps), e !== r && Ic(t), Vc(t), Lc(t, a, e, r, n)),
            null
          );
        case 27:
          if ((ye(t), (n = he.current), (a = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== r && Ic(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return Vc(t), null;
            }
            (e = pe.current), qi(t) ? Gi(t, e) : ((e = yf(a, r, n)), (t.stateNode = e), Ic(t));
          }
          return Vc(t), null;
        case 5:
          if ((ye(t), (a = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== r && Ic(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return Vc(t), null;
            }
            if (((o = pe.current), qi(t))) Gi(t, o);
            else {
              var s = qd(he.current);
              switch (o) {
                case 1:
                  o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                  break;
                case 2:
                  o = s.createElementNS(`http://www.w3.org/1998/Math/MathML`, a);
                  break;
                default:
                  switch (a) {
                    case `svg`:
                      o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                      break;
                    case `math`:
                      o = s.createElementNS(`http://www.w3.org/1998/Math/MathML`, a);
                      break;
                    case `script`:
                      (o = s.createElement(`div`)),
                        (o.innerHTML = `<script><\/script>`),
                        (o = o.removeChild(o.firstChild));
                      break;
                    case `select`:
                      (o =
                        typeof r.is == `string`
                          ? s.createElement(`select`, { is: r.is })
                          : s.createElement(`select`)),
                        r.multiple ? (o.multiple = !0) : r.size && (o.size = r.size);
                      break;
                    default:
                      o =
                        typeof r.is == `string`
                          ? s.createElement(a, { is: r.is })
                          : s.createElement(a);
                  }
              }
              (o[pt] = t), (o[mt] = r);
              a: for (s = t.child; s !== null; ) {
                if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
                else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                  (s.child.return = s), (s = s.child);
                  continue;
                }
                if (s === t) break a;
                for (; s.sibling === null; ) {
                  if (s.return === null || s.return === t) break a;
                  s = s.return;
                }
                (s.sibling.return = s.return), (s = s.sibling);
              }
              t.stateNode = o;
              a: switch ((Vd(o, a, r), a)) {
                case `button`:
                case `input`:
                case `select`:
                case `textarea`:
                  r = !!r.autoFocus;
                  break a;
                case `img`:
                  r = !0;
                  break a;
                default:
                  r = !1;
              }
              r && Ic(t);
            }
          }
          return Vc(t), Lc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== r && Ic(t);
          else {
            if (typeof r != `string` && t.stateNode === null) throw Error(i(166));
            if (((e = he.current), qi(t))) {
              if (((e = t.stateNode), (n = t.memoizedProps), (r = null), (a = zi), a !== null))
                switch (a.tag) {
                  case 27:
                  case 5:
                    r = a.memoizedProps;
                }
              (e[pt] = t),
                (e = !!(
                  e.nodeValue === n ||
                  (r !== null && !0 === r.suppressHydrationWarning) ||
                  Rd(e.nodeValue, n)
                )),
                e || Wi(t, !0);
            } else (e = qd(e).createTextNode(r)), (e[pt] = t), (t.stateNode = e);
          }
          return Vc(t), null;
        case 31:
          if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((r = qi(t)), n !== null)) {
              if (e === null) {
                if (!r) throw Error(i(318));
                if (((e = t.memoizedState), (e = e === null ? null : e.dehydrated), !e))
                  throw Error(i(557));
                e[pt] = t;
              } else Ji(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
              Vc(t), (e = !1);
            } else
              (n = Yi()),
                e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n),
                (e = !0);
            if (!e) return t.flags & 256 ? (uo(t), t) : (uo(t), null);
            if (t.flags & 128) throw Error(i(558));
          }
          return Vc(t), null;
        case 13:
          if (
            ((r = t.memoizedState),
            e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((a = qi(t)), r !== null && r.dehydrated !== null)) {
              if (e === null) {
                if (!a) throw Error(i(318));
                if (((a = t.memoizedState), (a = a === null ? null : a.dehydrated), !a))
                  throw Error(i(317));
                a[pt] = t;
              } else Ji(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
              Vc(t), (a = !1);
            } else
              (a = Yi()),
                e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a),
                (a = !0);
            if (!a) return t.flags & 256 ? (uo(t), t) : (uo(t), null);
          }
          return (
            uo(t),
            t.flags & 128
              ? ((t.lanes = n), t)
              : ((n = r !== null),
                (e = e !== null && e.memoizedState !== null),
                n &&
                  ((r = t.child),
                  (a = null),
                  r.alternate !== null &&
                    r.alternate.memoizedState !== null &&
                    r.alternate.memoizedState.cachePool !== null &&
                    (a = r.alternate.memoizedState.cachePool.pool),
                  (o = null),
                  r.memoizedState !== null &&
                    r.memoizedState.cachePool !== null &&
                    (o = r.memoizedState.cachePool.pool),
                  o !== a && (r.flags |= 2048)),
                n !== e && n && (t.child.flags |= 8192),
                zc(t, t.updateQueue),
                Vc(t),
                null)
          );
        case 4:
          return j(), e === null && Od(t.stateNode.containerInfo), Vc(t), null;
        case 10:
          return ta(t.type), Vc(t), null;
        case 19:
          if ((k(fo), (r = t.memoizedState), r === null)) return Vc(t), null;
          if (((a = (t.flags & 128) != 0), (o = r.rendering), o === null))
            if (a) Bc(r, !1);
            else {
              if (Xl !== 0 || (e !== null && e.flags & 128))
                for (e = t.child; e !== null; ) {
                  if (((o = po(e)), o !== null)) {
                    for (
                      t.flags |= 128,
                        Bc(r, !1),
                        e = o.updateQueue,
                        t.updateQueue = e,
                        zc(t, e),
                        t.subtreeFlags = 0,
                        e = n,
                        n = t.child;
                      n !== null;
                    )
                      _i(n, e), (n = n.sibling);
                    return A(fo, (fo.current & 1) | 2), N && Pi(t, r.treeForkCount), t.child;
                  }
                  e = e.sibling;
                }
              r.tail !== null &&
                Me() > su &&
                ((t.flags |= 128), (a = !0), Bc(r, !1), (t.lanes = 4194304));
            }
          else {
            if (!a)
              if (((e = po(o)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (a = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  zc(t, e),
                  Bc(r, !0),
                  r.tail === null && r.tailMode === `hidden` && !o.alternate && !N)
                )
                  return Vc(t), null;
              } else
                2 * Me() - r.renderingStartTime > su &&
                  n !== 536870912 &&
                  ((t.flags |= 128), (a = !0), Bc(r, !1), (t.lanes = 4194304));
            r.isBackwards
              ? ((o.sibling = t.child), (t.child = o))
              : ((e = r.last), e === null ? (t.child = o) : (e.sibling = o), (r.last = o));
          }
          return r.tail === null
            ? (Vc(t), null)
            : ((e = r.tail),
              (r.rendering = e),
              (r.tail = e.sibling),
              (r.renderingStartTime = Me()),
              (e.sibling = null),
              (n = fo.current),
              A(fo, a ? (n & 1) | 2 : n & 1),
              N && Pi(t, r.treeForkCount),
              e);
        case 22:
        case 23:
          return (
            uo(t),
            io(),
            (r = t.memoizedState !== null),
            e === null
              ? r && (t.flags |= 8192)
              : (e.memoizedState !== null) !== r && (t.flags |= 8192),
            r
              ? n & 536870912 &&
                !(t.flags & 128) &&
                (Vc(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : Vc(t),
            (n = t.updateQueue),
            n !== null && zc(t, n.retryQueue),
            (n = null),
            e !== null &&
              e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (n = e.memoizedState.cachePool.pool),
            (r = null),
            t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (r = t.memoizedState.cachePool.pool),
            r !== n && (t.flags |= 2048),
            e !== null && k(Sa),
            null
          );
        case 24:
          return (
            (n = null),
            e !== null && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            ta(pa),
            Vc(t),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(i(156, t.tag));
    }
    function Uc(e, t) {
      switch ((Li(t), t.tag)) {
        case 1:
          return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
        case 3:
          return (
            ta(pa),
            j(),
            (e = t.flags),
            e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return ye(t), null;
        case 31:
          if (t.memoizedState !== null) {
            if ((uo(t), t.alternate === null)) throw Error(i(340));
            Ji();
          }
          return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
        case 13:
          if ((uo(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
            if (t.alternate === null) throw Error(i(340));
            Ji();
          }
          return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
        case 19:
          return k(fo), null;
        case 4:
          return j(), null;
        case 10:
          return ta(t.type), null;
        case 22:
        case 23:
          return (
            uo(t),
            io(),
            e !== null && k(Sa),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return ta(pa), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Wc(e, t) {
      switch ((Li(t), t.tag)) {
        case 3:
          ta(pa), j();
          break;
        case 26:
        case 27:
        case 5:
          ye(t);
          break;
        case 4:
          j();
          break;
        case 31:
          t.memoizedState !== null && uo(t);
          break;
        case 13:
          uo(t);
          break;
        case 19:
          k(fo);
          break;
        case 10:
          ta(t.type);
          break;
        case 22:
        case 23:
          uo(t), io(), e !== null && k(Sa);
          break;
        case 24:
          ta(pa);
      }
    }
    function Gc(e, t) {
      try {
        var n = t.updateQueue,
          r = n === null ? null : n.lastEffect;
        if (r !== null) {
          var i = r.next;
          n = i;
          do {
            if ((n.tag & e) === e) {
              r = void 0;
              var a = n.create,
                o = n.inst;
              (r = a()), (o.destroy = r);
            }
            n = n.next;
          } while (n !== i);
        }
      } catch (e) {
        G(t, t.return, e);
      }
    }
    function Kc(e, t, n) {
      try {
        var r = t.updateQueue,
          i = r === null ? null : r.lastEffect;
        if (i !== null) {
          var a = i.next;
          r = a;
          do {
            if ((r.tag & e) === e) {
              var o = r.inst,
                s = o.destroy;
              if (s !== void 0) {
                (o.destroy = void 0), (i = t);
                var c = n,
                  l = s;
                try {
                  l();
                } catch (e) {
                  G(i, c, e);
                }
              }
            }
            r = r.next;
          } while (r !== a);
        }
      } catch (e) {
        G(t, t.return, e);
      }
    }
    function qc(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var n = e.stateNode;
        try {
          $a(t, n);
        } catch (t) {
          G(e, e.return, t);
        }
      }
    }
    function Jc(e, t, n) {
      (n.props = Ys(e.type, e.memoizedProps)), (n.state = e.memoizedState);
      try {
        n.componentWillUnmount();
      } catch (n) {
        G(e, t, n);
      }
    }
    function Yc(e, t) {
      try {
        var n = e.ref;
        if (n !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var r = e.stateNode;
              break;
            case 30:
              r = e.stateNode;
              break;
            default:
              r = e.stateNode;
          }
          typeof n == `function` ? (e.refCleanup = n(r)) : (n.current = r);
        }
      } catch (n) {
        G(e, t, n);
      }
    }
    function Xc(e, t) {
      var n = e.ref,
        r = e.refCleanup;
      if (n !== null)
        if (typeof r == `function`)
          try {
            r();
          } catch (n) {
            G(e, t, n);
          } finally {
            (e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null);
          }
        else if (typeof n == `function`)
          try {
            n(null);
          } catch (n) {
            G(e, t, n);
          }
        else n.current = null;
    }
    function Zc(e) {
      var t = e.type,
        n = e.memoizedProps,
        r = e.stateNode;
      try {
        a: switch (t) {
          case `button`:
          case `input`:
          case `select`:
          case `textarea`:
            n.autoFocus && r.focus();
            break a;
          case `img`:
            n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
        }
      } catch (t) {
        G(e, e.return, t);
      }
    }
    function Qc(e, t, n) {
      try {
        var r = e.stateNode;
        Hd(r, e.type, n, t), (r[mt] = t);
      } catch (t) {
        G(e, e.return, t);
      }
    }
    function $c(e) {
      return (
        e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && af(e.type)) || e.tag === 4
      );
    }
    function el(e) {
      a: for (;;) {
        for (; e.sibling === null; ) {
          if (e.return === null || $c(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
        ) {
          if ((e.tag === 27 && af(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
            continue a;
          (e.child.return = e), (e = e.child);
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function tl(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        (e = e.stateNode),
          t
            ? (n.nodeType === 9
                ? n.body
                : n.nodeName === `HTML`
                  ? n.ownerDocument.body
                  : n
              ).insertBefore(e, t)
            : ((t = n.nodeType === 9 ? n.body : n.nodeName === `HTML` ? n.ownerDocument.body : n),
              t.appendChild(e),
              (n = n._reactRootContainer),
              n != null || t.onclick !== null || (t.onclick = on));
      else if (
        r !== 4 &&
        (r === 27 && af(e.type) && ((n = e.stateNode), (t = null)), (e = e.child), e !== null)
      )
        for (tl(e, t, n), e = e.sibling; e !== null; ) tl(e, t, n), (e = e.sibling);
    }
    function nl(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6) (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
      else if (r !== 4 && (r === 27 && af(e.type) && (n = e.stateNode), (e = e.child), e !== null))
        for (nl(e, t, n), e = e.sibling; e !== null; ) nl(e, t, n), (e = e.sibling);
    }
    function rl(e) {
      var t = e.stateNode,
        n = e.memoizedProps;
      try {
        for (var r = e.type, i = t.attributes; i.length; ) t.removeAttributeNode(i[0]);
        Vd(t, r, n), (t[pt] = e), (t[mt] = n);
      } catch (t) {
        G(e, e.return, t);
      }
    }
    var il = !1,
      al = !1,
      ol = !1,
      sl = typeof WeakSet == `function` ? WeakSet : Set,
      cl = null;
    function ll(e, t) {
      if (((e = e.containerInfo), (Gd = mp), (e = Nr(e)), Pr(e))) {
        if (`selectionStart` in e) var n = { start: e.selectionStart, end: e.selectionEnd };
        else
          a: {
            n = ((n = e.ownerDocument) && n.defaultView) || window;
            var r = n.getSelection && n.getSelection();
            if (r && r.rangeCount !== 0) {
              n = r.anchorNode;
              var a = r.anchorOffset,
                o = r.focusNode;
              r = r.focusOffset;
              try {
                n.nodeType, o.nodeType;
              } catch {
                n = null;
                break a;
              }
              var s = 0,
                c = -1,
                l = -1,
                u = 0,
                d = 0,
                f = e,
                p = null;
              b: for (;;) {
                for (
                  var m;
                  f !== n || (a !== 0 && f.nodeType !== 3) || (c = s + a),
                    f !== o || (r !== 0 && f.nodeType !== 3) || (l = s + r),
                    f.nodeType === 3 && (s += f.nodeValue.length),
                    (m = f.firstChild) !== null;
                )
                  (p = f), (f = m);
                for (;;) {
                  if (f === e) break b;
                  if (
                    (p === n && ++u === a && (c = s),
                    p === o && ++d === r && (l = s),
                    (m = f.nextSibling) !== null)
                  )
                    break;
                  (f = p), (p = f.parentNode);
                }
                f = m;
              }
              n = c === -1 || l === -1 ? null : { start: c, end: l };
            } else n = null;
          }
        n ||= { start: 0, end: 0 };
      } else n = null;
      for (Kd = { focusedElem: e, selectionRange: n }, mp = !1, cl = t; cl !== null; )
        if (((t = cl), (e = t.child), t.subtreeFlags & 1028 && e !== null))
          (e.return = t), (cl = e);
        else
          for (; cl !== null; ) {
            switch (((t = cl), (o = t.alternate), (e = t.flags), t.tag)) {
              case 0:
                if (e & 4 && ((e = t.updateQueue), (e = e === null ? null : e.events), e !== null))
                  for (n = 0; n < e.length; n++) (a = e[n]), (a.ref.impl = a.nextImpl);
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (e & 1024 && o !== null) {
                  (e = void 0),
                    (n = t),
                    (a = o.memoizedProps),
                    (o = o.memoizedState),
                    (r = n.stateNode);
                  try {
                    var h = Ys(n.type, a);
                    (e = r.getSnapshotBeforeUpdate(h, o)),
                      (r.__reactInternalSnapshotBeforeUpdate = e);
                  } catch (e) {
                    G(n, n.return, e);
                  }
                }
                break;
              case 3:
                if (e & 1024) {
                  if (((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)) cf(e);
                  else if (n === 1)
                    switch (e.nodeName) {
                      case `HEAD`:
                      case `HTML`:
                      case `BODY`:
                        cf(e);
                        break;
                      default:
                        e.textContent = ``;
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (e & 1024) throw Error(i(163));
            }
            if (((e = t.sibling), e !== null)) {
              (e.return = t.return), (cl = e);
              break;
            }
            cl = t.return;
          }
    }
    function ul(e, t, n) {
      var r = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Tl(e, n), r & 4 && Gc(5, n);
          break;
        case 1:
          if ((Tl(e, n), r & 4))
            if (((e = n.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (e) {
                G(n, n.return, e);
              }
            else {
              var i = Ys(n.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
              } catch (e) {
                G(n, n.return, e);
              }
            }
          r & 64 && qc(n), r & 512 && Yc(n, n.return);
          break;
        case 3:
          if ((Tl(e, n), r & 64 && ((e = n.updateQueue), e !== null))) {
            if (((t = null), n.child !== null))
              switch (n.child.tag) {
                case 27:
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
            try {
              $a(e, t);
            } catch (e) {
              G(n, n.return, e);
            }
          }
          break;
        case 27:
          t === null && r & 4 && rl(n);
        case 26:
        case 5:
          Tl(e, n), t === null && r & 4 && Zc(n), r & 512 && Yc(n, n.return);
          break;
        case 12:
          Tl(e, n);
          break;
        case 31:
          Tl(e, n), r & 4 && gl(e, n);
          break;
        case 13:
          Tl(e, n),
            r & 4 && _l(e, n),
            r & 64 &&
              ((e = n.memoizedState),
              e !== null && ((e = e.dehydrated), e !== null && ((n = ed.bind(null, n)), mf(e, n))));
          break;
        case 22:
          if (((r = n.memoizedState !== null || il), !r)) {
            (t = (t !== null && t.memoizedState !== null) || al), (i = il);
            var a = al;
            (il = r),
              (al = t) && !a ? Dl(e, n, (n.subtreeFlags & 8772) != 0) : Tl(e, n),
              (il = i),
              (al = a);
          }
          break;
        case 30:
          break;
        default:
          Tl(e, n);
      }
    }
    function dl(e) {
      var t = e.alternate;
      t !== null && ((e.alternate = null), dl(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && xt(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null);
    }
    var fl = null,
      pl = !1;
    function ml(e, t, n) {
      for (n = n.child; n !== null; ) hl(e, t, n), (n = n.sibling);
    }
    function hl(e, t, n) {
      if (He && typeof He.onCommitFiberUnmount == `function`)
        try {
          He.onCommitFiberUnmount(Ve, n);
        } catch {}
      switch (n.tag) {
        case 26:
          al || Xc(n, t),
            ml(e, t, n),
            n.memoizedState
              ? n.memoizedState.count--
              : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n));
          break;
        case 27:
          al || Xc(n, t);
          var r = fl,
            i = pl;
          af(n.type) && ((fl = n.stateNode), (pl = !1)),
            ml(e, t, n),
            bf(n.stateNode),
            (fl = r),
            (pl = i);
          break;
        case 5:
          al || Xc(n, t);
        case 6:
          if (((r = fl), (i = pl), (fl = null), ml(e, t, n), (fl = r), (pl = i), fl !== null))
            if (pl)
              try {
                (fl.nodeType === 9
                  ? fl.body
                  : fl.nodeName === `HTML`
                    ? fl.ownerDocument.body
                    : fl
                ).removeChild(n.stateNode);
              } catch (e) {
                G(n, t, e);
              }
            else
              try {
                fl.removeChild(n.stateNode);
              } catch (e) {
                G(n, t, e);
              }
          break;
        case 18:
          fl !== null &&
            (pl
              ? ((e = fl),
                of(
                  e.nodeType === 9 ? e.body : e.nodeName === `HTML` ? e.ownerDocument.body : e,
                  n.stateNode,
                ),
                Bp(e))
              : of(fl, n.stateNode));
          break;
        case 4:
          (r = fl),
            (i = pl),
            (fl = n.stateNode.containerInfo),
            (pl = !0),
            ml(e, t, n),
            (fl = r),
            (pl = i);
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Kc(2, n, t), al || Kc(4, n, t), ml(e, t, n);
          break;
        case 1:
          al ||
            (Xc(n, t),
            (r = n.stateNode),
            typeof r.componentWillUnmount == `function` && Jc(n, t, r)),
            ml(e, t, n);
          break;
        case 21:
          ml(e, t, n);
          break;
        case 22:
          (al = (r = al) || n.memoizedState !== null), ml(e, t, n), (al = r);
          break;
        default:
          ml(e, t, n);
      }
    }
    function gl(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          Bp(e);
        } catch (e) {
          G(t, t.return, e);
        }
      }
    }
    function _l(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          Bp(e);
        } catch (e) {
          G(t, t.return, e);
        }
    }
    function vl(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return t === null && (t = e.stateNode = new sl()), t;
        case 22:
          return (
            (e = e.stateNode), (t = e._retryCache), t === null && (t = e._retryCache = new sl()), t
          );
        default:
          throw Error(i(435, e.tag));
      }
    }
    function yl(e, t) {
      var n = vl(e);
      t.forEach(function (t) {
        if (!n.has(t)) {
          n.add(t);
          var r = td.bind(null, e, t);
          t.then(r, r);
        }
      });
    }
    function bl(e, t) {
      var n = t.deletions;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var a = n[r],
            o = e,
            s = t,
            c = s;
          a: for (; c !== null; ) {
            switch (c.tag) {
              case 27:
                if (af(c.type)) {
                  (fl = c.stateNode), (pl = !1);
                  break a;
                }
                break;
              case 5:
                (fl = c.stateNode), (pl = !1);
                break a;
              case 3:
              case 4:
                (fl = c.stateNode.containerInfo), (pl = !0);
                break a;
            }
            c = c.return;
          }
          if (fl === null) throw Error(i(160));
          hl(o, s, a),
            (fl = null),
            (pl = !1),
            (o = a.alternate),
            o !== null && (o.return = null),
            (a.return = null);
        }
      if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) Sl(t, e), (t = t.sibling);
    }
    var xl = null;
    function Sl(e, t) {
      var n = e.alternate,
        r = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          bl(t, e), Cl(e), r & 4 && (Kc(3, e, e.return), Gc(3, e), Kc(5, e, e.return));
          break;
        case 1:
          bl(t, e),
            Cl(e),
            r & 512 && (al || n === null || Xc(n, n.return)),
            r & 64 &&
              il &&
              ((e = e.updateQueue),
              e !== null &&
                ((r = e.callbacks),
                r !== null &&
                  ((n = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = n === null ? r : n.concat(r)))));
          break;
        case 26:
          var a = xl;
          if ((bl(t, e), Cl(e), r & 512 && (al || n === null || Xc(n, n.return)), r & 4)) {
            var o = n === null ? null : n.memoizedState;
            if (((r = e.memoizedState), n === null))
              if (r === null)
                if (e.stateNode === null) {
                  a: {
                    (r = e.type), (n = e.memoizedProps), (a = a.ownerDocument || a);
                    b: switch (r) {
                      case `title`:
                        (o = a.getElementsByTagName(`title`)[0]),
                          (!o ||
                            o[bt] ||
                            o[pt] ||
                            o.namespaceURI === `http://www.w3.org/2000/svg` ||
                            o.hasAttribute(`itemprop`)) &&
                            ((o = a.createElement(r)),
                            a.head.insertBefore(o, a.querySelector(`head > title`))),
                          Vd(o, r, n),
                          (o[pt] = e),
                          Et(o),
                          (r = o);
                        break a;
                      case `link`:
                        var s = Jf(`link`, `href`, a).get(r + (n.href || ``));
                        if (s) {
                          for (var c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`href`) ===
                                (n.href == null || n.href === `` ? null : n.href) &&
                                o.getAttribute(`rel`) === (n.rel == null ? null : n.rel) &&
                                o.getAttribute(`title`) === (n.title == null ? null : n.title) &&
                                o.getAttribute(`crossorigin`) ===
                                  (n.crossOrigin == null ? null : n.crossOrigin))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        (o = a.createElement(r)), Vd(o, r, n), a.head.appendChild(o);
                        break;
                      case `meta`:
                        if ((s = Jf(`meta`, `content`, a).get(r + (n.content || ``)))) {
                          for (c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`content`) ===
                                (n.content == null ? null : `` + n.content) &&
                                o.getAttribute(`name`) === (n.name == null ? null : n.name) &&
                                o.getAttribute(`property`) ===
                                  (n.property == null ? null : n.property) &&
                                o.getAttribute(`http-equiv`) ===
                                  (n.httpEquiv == null ? null : n.httpEquiv) &&
                                o.getAttribute(`charset`) ===
                                  (n.charSet == null ? null : n.charSet))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        (o = a.createElement(r)), Vd(o, r, n), a.head.appendChild(o);
                        break;
                      default:
                        throw Error(i(468, r));
                    }
                    (o[pt] = e), Et(o), (r = o);
                  }
                  e.stateNode = r;
                } else Yf(a, e.type, e.stateNode);
              else e.stateNode = Uf(a, r, e.memoizedProps);
            else
              o === r
                ? r === null && e.stateNode !== null && Qc(e, e.memoizedProps, n.memoizedProps)
                : (o === null
                    ? n.stateNode !== null && ((n = n.stateNode), n.parentNode.removeChild(n))
                    : o.count--,
                  r === null ? Yf(a, e.type, e.stateNode) : Uf(a, r, e.memoizedProps));
          }
          break;
        case 27:
          bl(t, e),
            Cl(e),
            r & 512 && (al || n === null || Xc(n, n.return)),
            n !== null && r & 4 && Qc(e, e.memoizedProps, n.memoizedProps);
          break;
        case 5:
          if ((bl(t, e), Cl(e), r & 512 && (al || n === null || Xc(n, n.return)), e.flags & 32)) {
            a = e.stateNode;
            try {
              Zt(a, ``);
            } catch (t) {
              G(e, e.return, t);
            }
          }
          r & 4 &&
            e.stateNode != null &&
            ((a = e.memoizedProps), Qc(e, a, n === null ? a : n.memoizedProps)),
            r & 1024 && (ol = !0);
          break;
        case 6:
          if ((bl(t, e), Cl(e), r & 4)) {
            if (e.stateNode === null) throw Error(i(162));
            (r = e.memoizedProps), (n = e.stateNode);
            try {
              n.nodeValue = r;
            } catch (t) {
              G(e, e.return, t);
            }
          }
          break;
        case 3:
          if (
            ((qf = null),
            (a = xl),
            (xl = Cf(t.containerInfo)),
            bl(t, e),
            (xl = a),
            Cl(e),
            r & 4 && n !== null && n.memoizedState.isDehydrated)
          )
            try {
              Bp(t.containerInfo);
            } catch (t) {
              G(e, e.return, t);
            }
          ol && ((ol = !1), wl(e));
          break;
        case 4:
          (r = xl), (xl = Cf(e.stateNode.containerInfo)), bl(t, e), Cl(e), (xl = r);
          break;
        case 12:
          bl(t, e), Cl(e);
          break;
        case 31:
          bl(t, e),
            Cl(e),
            r & 4 && ((r = e.updateQueue), r !== null && ((e.updateQueue = null), yl(e, r)));
          break;
        case 13:
          bl(t, e),
            Cl(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) != (n !== null && n.memoizedState !== null) &&
              (au = Me()),
            r & 4 && ((r = e.updateQueue), r !== null && ((e.updateQueue = null), yl(e, r)));
          break;
        case 22:
          a = e.memoizedState !== null;
          var l = n !== null && n.memoizedState !== null,
            u = il,
            d = al;
          if (((il = u || a), (al = d || l), bl(t, e), (al = d), (il = u), Cl(e), r & 8192))
            a: for (
              t = e.stateNode,
                t._visibility = a ? t._visibility & -2 : t._visibility | 1,
                a && (n === null || l || il || al || El(e)),
                n = null,
                t = e;
              ;
            ) {
              if (t.tag === 5 || t.tag === 26) {
                if (n === null) {
                  l = n = t;
                  try {
                    if (((o = l.stateNode), a))
                      (s = o.style),
                        typeof s.setProperty == `function`
                          ? s.setProperty(`display`, `none`, `important`)
                          : (s.display = `none`);
                    else {
                      c = l.stateNode;
                      var f = l.memoizedProps.style,
                        p = f != null && f.hasOwnProperty(`display`) ? f.display : null;
                      c.style.display = p == null || typeof p == `boolean` ? `` : (`` + p).trim();
                    }
                  } catch (e) {
                    G(l, l.return, e);
                  }
                }
              } else if (t.tag === 6) {
                if (n === null) {
                  l = t;
                  try {
                    l.stateNode.nodeValue = a ? `` : l.memoizedProps;
                  } catch (e) {
                    G(l, l.return, e);
                  }
                }
              } else if (t.tag === 18) {
                if (n === null) {
                  l = t;
                  try {
                    var m = l.stateNode;
                    a ? sf(m, !0) : sf(l.stateNode, !1);
                  } catch (e) {
                    G(l, l.return, e);
                  }
                }
              } else if (
                ((t.tag !== 22 && t.tag !== 23) || t.memoizedState === null || t === e) &&
                t.child !== null
              ) {
                (t.child.return = t), (t = t.child);
                continue;
              }
              if (t === e) break a;
              for (; t.sibling === null; ) {
                if (t.return === null || t.return === e) break a;
                n === t && (n = null), (t = t.return);
              }
              n === t && (n = null), (t.sibling.return = t.return), (t = t.sibling);
            }
          r & 4 &&
            ((r = e.updateQueue),
            r !== null && ((n = r.retryQueue), n !== null && ((r.retryQueue = null), yl(e, n))));
          break;
        case 19:
          bl(t, e),
            Cl(e),
            r & 4 && ((r = e.updateQueue), r !== null && ((e.updateQueue = null), yl(e, r)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          bl(t, e), Cl(e);
      }
    }
    function Cl(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var n, r = e.return; r !== null; ) {
            if ($c(r)) {
              n = r;
              break;
            }
            r = r.return;
          }
          if (n == null) throw Error(i(160));
          switch (n.tag) {
            case 27:
              var a = n.stateNode;
              nl(e, el(e), a);
              break;
            case 5:
              var o = n.stateNode;
              n.flags & 32 && (Zt(o, ``), (n.flags &= -33)), nl(e, el(e), o);
              break;
            case 3:
            case 4:
              var s = n.stateNode.containerInfo;
              tl(e, el(e), s);
              break;
            default:
              throw Error(i(161));
          }
        } catch (t) {
          G(e, e.return, t);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function wl(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null; ) {
          var t = e;
          wl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling);
        }
    }
    function Tl(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null; ) ul(e, t.alternate, t), (t = t.sibling);
    }
    function El(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            Kc(4, t, t.return), El(t);
            break;
          case 1:
            Xc(t, t.return);
            var n = t.stateNode;
            typeof n.componentWillUnmount == `function` && Jc(t, t.return, n), El(t);
            break;
          case 27:
            bf(t.stateNode);
          case 26:
          case 5:
            Xc(t, t.return), El(t);
            break;
          case 22:
            t.memoizedState === null && El(t);
            break;
          case 30:
            El(t);
            break;
          default:
            El(t);
        }
        e = e.sibling;
      }
    }
    function Dl(e, t, n) {
      for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null; ) {
        var r = t.alternate,
          i = e,
          a = t,
          o = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            Dl(i, a, n), Gc(4, a);
            break;
          case 1:
            if ((Dl(i, a, n), (r = a), (i = r.stateNode), typeof i.componentDidMount == `function`))
              try {
                i.componentDidMount();
              } catch (e) {
                G(r, r.return, e);
              }
            if (((r = a), (i = r.updateQueue), i !== null)) {
              var s = r.stateNode;
              try {
                var c = i.shared.hiddenCallbacks;
                if (c !== null)
                  for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) L(c[i], s);
              } catch (e) {
                G(r, r.return, e);
              }
            }
            n && o & 64 && qc(a), Yc(a, a.return);
            break;
          case 27:
            rl(a);
          case 26:
          case 5:
            Dl(i, a, n), n && r === null && o & 4 && Zc(a), Yc(a, a.return);
            break;
          case 12:
            Dl(i, a, n);
            break;
          case 31:
            Dl(i, a, n), n && o & 4 && gl(i, a);
            break;
          case 13:
            Dl(i, a, n), n && o & 4 && _l(i, a);
            break;
          case 22:
            a.memoizedState === null && Dl(i, a, n), Yc(a, a.return);
            break;
          case 30:
            break;
          default:
            Dl(i, a, n);
        }
        t = t.sibling;
      }
    }
    function Ol(e, t) {
      var n = null;
      e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (n = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== n && (e != null && e.refCount++, n != null && P(n));
    }
    function kl(e, t) {
      (e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && P(e));
    }
    function Al(e, t, n, r) {
      if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) jl(e, t, n, r), (t = t.sibling);
    }
    function jl(e, t, n, r) {
      var i = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          Al(e, t, n, r), i & 2048 && Gc(9, t);
          break;
        case 1:
          Al(e, t, n, r);
          break;
        case 3:
          Al(e, t, n, r),
            i & 2048 &&
              ((e = null),
              t.alternate !== null && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== e && (t.refCount++, e != null && P(e)));
          break;
        case 12:
          if (i & 2048) {
            Al(e, t, n, r), (e = t.stateNode);
            try {
              var a = t.memoizedProps,
                o = a.id,
                s = a.onPostCommit;
              typeof s == `function` &&
                s(o, t.alternate === null ? `mount` : `update`, e.passiveEffectDuration, -0);
            } catch (e) {
              G(t, t.return, e);
            }
          } else Al(e, t, n, r);
          break;
        case 31:
          Al(e, t, n, r);
          break;
        case 13:
          Al(e, t, n, r);
          break;
        case 23:
          break;
        case 22:
          (a = t.stateNode),
            (o = t.alternate),
            t.memoizedState === null
              ? a._visibility & 2
                ? Al(e, t, n, r)
                : ((a._visibility |= 2), Ml(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1))
              : a._visibility & 2
                ? Al(e, t, n, r)
                : Nl(e, t),
            i & 2048 && Ol(o, t);
          break;
        case 24:
          Al(e, t, n, r), i & 2048 && kl(t.alternate, t);
          break;
        default:
          Al(e, t, n, r);
      }
    }
    function Ml(e, t, n, r, i) {
      for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null; ) {
        var a = e,
          o = t,
          s = n,
          c = r,
          l = o.flags;
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            Ml(a, o, s, c, i), Gc(8, o);
            break;
          case 23:
            break;
          case 22:
            var u = o.stateNode;
            o.memoizedState === null
              ? ((u._visibility |= 2), Ml(a, o, s, c, i))
              : u._visibility & 2
                ? Ml(a, o, s, c, i)
                : Nl(a, o),
              i && l & 2048 && Ol(o.alternate, o);
            break;
          case 24:
            Ml(a, o, s, c, i), i && l & 2048 && kl(o.alternate, o);
            break;
          default:
            Ml(a, o, s, c, i);
        }
        t = t.sibling;
      }
    }
    function Nl(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) {
          var n = e,
            r = t,
            i = r.flags;
          switch (r.tag) {
            case 22:
              Nl(n, r), i & 2048 && Ol(r.alternate, r);
              break;
            case 24:
              Nl(n, r), i & 2048 && kl(r.alternate, r);
              break;
            default:
              Nl(n, r);
          }
          t = t.sibling;
        }
    }
    var Pl = 8192;
    function Fl(e, t, n) {
      if (e.subtreeFlags & Pl) for (e = e.child; e !== null; ) Il(e, t, n), (e = e.sibling);
    }
    function Il(e, t, n) {
      switch (e.tag) {
        case 26:
          Fl(e, t, n),
            e.flags & Pl && e.memoizedState !== null && Qf(n, xl, e.memoizedState, e.memoizedProps);
          break;
        case 5:
          Fl(e, t, n);
          break;
        case 3:
        case 4:
          var r = xl;
          (xl = Cf(e.stateNode.containerInfo)), Fl(e, t, n), (xl = r);
          break;
        case 22:
          e.memoizedState === null &&
            ((r = e.alternate),
            r !== null && r.memoizedState !== null
              ? ((r = Pl), (Pl = 16777216), Fl(e, t, n), (Pl = r))
              : Fl(e, t, n));
          break;
        default:
          Fl(e, t, n);
      }
    }
    function Ll(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do (t = e.sibling), (e.sibling = null), (e = t);
        while (e !== null);
      }
    }
    function Rl(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (cl = r), Vl(r, e);
          }
        Ll(e);
      }
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) zl(e), (e = e.sibling);
    }
    function zl(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Rl(e), e.flags & 2048 && Kc(9, e, e.return);
          break;
        case 3:
          Rl(e);
          break;
        case 12:
          Rl(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Bl(e))
            : Rl(e);
          break;
        default:
          Rl(e);
      }
    }
    function Bl(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (cl = r), Vl(r, e);
          }
        Ll(e);
      }
      for (e = e.child; e !== null; ) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            Kc(8, t, t.return), Bl(t);
            break;
          case 22:
            (n = t.stateNode), n._visibility & 2 && ((n._visibility &= -3), Bl(t));
            break;
          default:
            Bl(t);
        }
        e = e.sibling;
      }
    }
    function Vl(e, t) {
      for (; cl !== null; ) {
        var n = cl;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            Kc(8, n, t);
            break;
          case 23:
          case 22:
            if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
              var r = n.memoizedState.cachePool.pool;
              r != null && r.refCount++;
            }
            break;
          case 24:
            P(n.memoizedState.cache);
        }
        if (((r = n.child), r !== null)) (r.return = n), (cl = r);
        else
          a: for (n = e; cl !== null; ) {
            r = cl;
            var i = r.sibling,
              a = r.return;
            if ((dl(r), r === n)) {
              cl = null;
              break a;
            }
            if (i !== null) {
              (i.return = a), (cl = i);
              break a;
            }
            cl = a;
          }
      }
    }
    var Hl = {
        getCacheForType: function (e) {
          var t = sa(pa),
            n = t.data.get(e);
          return n === void 0 && ((n = e()), t.data.set(e, n)), n;
        },
        cacheSignal: function () {
          return sa(pa).controller.signal;
        },
      },
      Ul = typeof WeakMap == `function` ? WeakMap : Map,
      V = 0,
      Wl = null,
      H = null,
      U = 0,
      W = 0,
      Gl = null,
      Kl = !1,
      ql = !1,
      Jl = !1,
      Yl = 0,
      Xl = 0,
      Zl = 0,
      Ql = 0,
      $l = 0,
      eu = 0,
      tu = 0,
      nu = null,
      ru = null,
      iu = !1,
      au = 0,
      ou = 0,
      su = 1 / 0,
      cu = null,
      lu = null,
      uu = 0,
      du = null,
      fu = null,
      pu = 0,
      mu = 0,
      hu = null,
      gu = null,
      _u = 0,
      vu = null;
    function yu() {
      return V & 2 && U !== 0 ? U & -U : D.T === null ? ut() : _d();
    }
    function bu() {
      if (eu === 0)
        if (!(U & 536870912) || N) {
          var e = Ye;
          (Ye <<= 1), !(Ye & 3932160) && (Ye = 262144), (eu = e);
        } else eu = 536870912;
      return (e = ao.current), e !== null && (e.flags |= 32), eu;
    }
    function xu(e, t, n) {
      ((e === Wl && (W === 2 || W === 9)) || e.cancelPendingCommit !== null) &&
        (Ou(e, 0), Tu(e, U, eu, !1)),
        rt(e, n),
        (!(V & 2) || e !== Wl) &&
          (e === Wl && (!(V & 2) && (Ql |= n), Xl === 4 && Tu(e, U, eu, !1)), ld(e));
    }
    function Su(e, t, n) {
      if (V & 6) throw Error(i(327));
      var r = (!n && (t & 127) == 0 && (t & e.expiredLanes) === 0) || $e(e, t),
        a = r ? Iu(e, t) : Pu(e, t, !0),
        o = r;
      do {
        if (a === 0) {
          ql && !r && Tu(e, t, 0, !1);
          break;
        } else {
          if (((n = e.current.alternate), o && !wu(n))) {
            (a = Pu(e, t, !1)), (o = !1);
            continue;
          }
          if (a === 2) {
            if (((o = t), e.errorRecoveryDisabledLanes & o)) var s = 0;
            else
              (s = e.pendingLanes & -536870913),
                (s = s === 0 ? (s & 536870912 ? 536870912 : 0) : s);
            if (s !== 0) {
              t = s;
              a: {
                var c = e;
                a = nu;
                var l = c.current.memoizedState.isDehydrated;
                if ((l && (Ou(c, s).flags |= 256), (s = Pu(c, s, !1)), s !== 2)) {
                  if (Jl && !l) {
                    (c.errorRecoveryDisabledLanes |= o), (Ql |= o), (a = 4);
                    break a;
                  }
                  (o = ru), (ru = a), o !== null && (ru === null ? (ru = o) : ru.push.apply(ru, o));
                }
                a = s;
              }
              if (((o = !1), a !== 2)) continue;
            }
          }
          if (a === 1) {
            Ou(e, 0), Tu(e, t, 0, !0);
            break;
          }
          a: {
            switch (((r = e), (o = a), o)) {
              case 0:
              case 1:
                throw Error(i(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                Tu(r, t, eu, !Kl);
                break a;
              case 2:
                ru = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(i(329));
            }
            if ((t & 62914560) === t && ((a = au + 300 - Me()), 10 < a)) {
              if ((Tu(r, t, eu, !Kl), Qe(r, 0, !0) !== 0)) break a;
              (pu = t),
                (r.timeoutHandle = $d(
                  Cu.bind(null, r, n, ru, cu, iu, t, eu, Ql, tu, Kl, o, `Throttled`, -0, 0),
                  a,
                ));
              break a;
            }
            Cu(r, n, ru, cu, iu, t, eu, Ql, tu, Kl, o, null, -0, 0);
          }
        }
        break;
      } while (1);
      ld(e);
    }
    function Cu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
      if (((e.timeoutHandle = -1), (d = t.subtreeFlags), d & 8192 || (d & 16785408) == 16785408)) {
        (d = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: on,
        }),
          Il(t, a, d);
        var m = (a & 62914560) === a ? au - Me() : (a & 4194048) === a ? ou - Me() : 0;
        if (((m = ep(d, m)), m !== null)) {
          (pu = a),
            (e.cancelPendingCommit = m(Uu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p))),
            Tu(e, a, o, !l);
          return;
        }
      }
      Uu(e, t, a, n, r, i, o, s, c);
    }
    function wu(e) {
      for (var t = e; ; ) {
        var n = t.tag;
        if (
          (n === 0 || n === 11 || n === 15) &&
          t.flags & 16384 &&
          ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
        )
          for (var r = 0; r < n.length; r++) {
            var i = n[r],
              a = i.getSnapshot;
            i = i.value;
            try {
              if (!Or(a(), i)) return !1;
            } catch {
              return !1;
            }
          }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) (n.return = t), (t = n);
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          (t.sibling.return = t.return), (t = t.sibling);
        }
      }
      return !0;
    }
    function Tu(e, t, n, r) {
      (t &= ~$l),
        (t &= ~Ql),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        r && (e.warmLanes |= t),
        (r = e.expirationTimes);
      for (var i = t; 0 < i; ) {
        var a = 31 - We(i),
          o = 1 << a;
        (r[a] = -1), (i &= ~o);
      }
      n !== 0 && at(e, n, t);
    }
    function Eu() {
      return V & 6 ? !0 : (ud(0, !1), !1);
    }
    function Du() {
      if (H !== null) {
        if (W === 0) var e = H.return;
        else (e = H), ($i = Qi = null), jo(e), (Ia = null), (La = 0), (e = H);
        for (; e !== null; ) Wc(e.alternate, e), (e = e.return);
        H = null;
      }
    }
    function Ou(e, t) {
      var n = e.timeoutHandle;
      n !== -1 && ((e.timeoutHandle = -1), ef(n)),
        (n = e.cancelPendingCommit),
        n !== null && ((e.cancelPendingCommit = null), n()),
        (pu = 0),
        Du(),
        (Wl = e),
        (H = n = gi(e.current, null)),
        (U = t),
        (W = 0),
        (Gl = null),
        (Kl = !1),
        (ql = $e(e, t)),
        (Jl = !1),
        (tu = eu = $l = Ql = Zl = Xl = 0),
        (ru = nu = null),
        (iu = !1),
        t & 8 && (t |= t & 32);
      var r = e.entangledLanes;
      if (r !== 0)
        for (e = e.entanglements, r &= t; 0 < r; ) {
          var i = 31 - We(r),
            a = 1 << i;
          (t |= e[i]), (r &= ~a);
        }
      return (Yl = t), oi(), n;
    }
    function ku(e, t) {
      (z = null),
        (D.H = Vs),
        t === Ea || t === Oa
          ? ((t = Pa()), (W = 3))
          : t === Da
            ? ((t = Pa()), (W = 4))
            : (W = t === ac ? 8 : typeof t == `object` && t && typeof t.then == `function` ? 6 : 1),
        (Gl = t),
        H === null && ((Xl = 1), $s(e, wi(t, e.current)));
    }
    function Au() {
      var e = ao.current;
      return e === null
        ? !0
        : (U & 4194048) === U
          ? R === null
          : (U & 62914560) === U || U & 536870912
            ? e === R
            : !1;
    }
    function ju() {
      var e = D.H;
      return (D.H = Vs), e === null ? Vs : e;
    }
    function Mu() {
      var e = D.A;
      return (D.A = Hl), e;
    }
    function Nu() {
      (Xl = 4),
        Kl || ((U & 4194048) !== U && ao.current !== null) || (ql = !0),
        (!(Zl & 134217727) && !(Ql & 134217727)) || Wl === null || Tu(Wl, U, eu, !1);
    }
    function Pu(e, t, n) {
      var r = V;
      V |= 2;
      var i = ju(),
        a = Mu();
      (Wl !== e || U !== t) && ((cu = null), Ou(e, t)), (t = !1);
      var o = Xl;
      a: do
        try {
          if (W !== 0 && H !== null) {
            var s = H,
              c = Gl;
            switch (W) {
              case 8:
                Du(), (o = 6);
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                ao.current === null && (t = !0);
                var l = W;
                if (((W = 0), (Gl = null), Bu(e, s, c, l), n && ql)) {
                  o = 0;
                  break a;
                }
                break;
              default:
                (l = W), (W = 0), (Gl = null), Bu(e, s, c, l);
            }
          }
          Fu(), (o = Xl);
          break;
        } catch (t) {
          ku(e, t);
        }
      while (1);
      return (
        t && e.shellSuspendCounter++,
        ($i = Qi = null),
        (V = r),
        (D.H = i),
        (D.A = a),
        H === null && ((Wl = null), (U = 0), oi()),
        o
      );
    }
    function Fu() {
      for (; H !== null; ) Ru(H);
    }
    function Iu(e, t) {
      var n = V;
      V |= 2;
      var r = ju(),
        a = Mu();
      Wl !== e || U !== t ? ((cu = null), (su = Me() + 500), Ou(e, t)) : (ql = $e(e, t));
      a: do
        try {
          if (W !== 0 && H !== null) {
            t = H;
            var o = Gl;
            b: switch (W) {
              case 1:
                (W = 0), (Gl = null), Bu(e, t, o, 1);
                break;
              case 2:
              case 9:
                if (Aa(o)) {
                  (W = 0), (Gl = null), zu(t);
                  break;
                }
                (t = function () {
                  (W !== 2 && W !== 9) || Wl !== e || (W = 7), ld(e);
                }),
                  o.then(t, t);
                break a;
              case 3:
                W = 7;
                break a;
              case 4:
                W = 5;
                break a;
              case 7:
                Aa(o) ? ((W = 0), (Gl = null), zu(t)) : ((W = 0), (Gl = null), Bu(e, t, o, 7));
                break;
              case 5:
                var s = null;
                switch (H.tag) {
                  case 26:
                    s = H.memoizedState;
                  case 5:
                  case 27:
                    var c = H;
                    if (s ? Zf(s) : c.stateNode.complete) {
                      (W = 0), (Gl = null);
                      var l = c.sibling;
                      if (l !== null) H = l;
                      else {
                        var u = c.return;
                        u === null ? (H = null) : ((H = u), Vu(u));
                      }
                      break b;
                    }
                }
                (W = 0), (Gl = null), Bu(e, t, o, 5);
                break;
              case 6:
                (W = 0), (Gl = null), Bu(e, t, o, 6);
                break;
              case 8:
                Du(), (Xl = 6);
                break a;
              default:
                throw Error(i(462));
            }
          }
          Lu();
          break;
        } catch (t) {
          ku(e, t);
        }
      while (1);
      return (
        ($i = Qi = null),
        (D.H = r),
        (D.A = a),
        (V = n),
        H === null ? ((Wl = null), (U = 0), oi(), Xl) : 0
      );
    }
    function Lu() {
      for (; H !== null && !Ae(); ) Ru(H);
    }
    function Ru(e) {
      var t = Fc(e.alternate, e, Yl);
      (e.memoizedProps = e.pendingProps), t === null ? Vu(e) : (H = t);
    }
    function zu(e) {
      var t = e,
        n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = yc(n, t, t.pendingProps, t.type, void 0, U);
          break;
        case 11:
          t = yc(n, t, t.pendingProps, t.type.render, t.ref, U);
          break;
        case 5:
          jo(t);
        default:
          Wc(n, t), (t = H = _i(t, Yl)), (t = Fc(n, t, Yl));
      }
      (e.memoizedProps = e.pendingProps), t === null ? Vu(e) : (H = t);
    }
    function Bu(e, t, n, r) {
      ($i = Qi = null), jo(t), (Ia = null), (La = 0);
      var i = t.return;
      try {
        if (ic(e, i, t, n, U)) {
          (Xl = 1), $s(e, wi(n, e.current)), (H = null);
          return;
        }
      } catch (t) {
        if (i !== null) throw ((H = i), t);
        (Xl = 1), $s(e, wi(n, e.current)), (H = null);
        return;
      }
      t.flags & 32768
        ? (N || r === 1
            ? (e = !0)
            : ql || U & 536870912
              ? (e = !1)
              : ((Kl = e = !0),
                (r === 2 || r === 9 || r === 3 || r === 6) &&
                  ((r = ao.current), r !== null && r.tag === 13 && (r.flags |= 16384))),
          Hu(t, e))
        : Vu(t);
    }
    function Vu(e) {
      var t = e;
      do {
        if (t.flags & 32768) {
          Hu(t, Kl);
          return;
        }
        e = t.return;
        var n = Hc(t.alternate, t, Yl);
        if (n !== null) {
          H = n;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          H = t;
          return;
        }
        H = t = e;
      } while (t !== null);
      Xl === 0 && (Xl = 5);
    }
    function Hu(e, t) {
      do {
        var n = Uc(e.alternate, e);
        if (n !== null) {
          (n.flags &= 32767), (H = n);
          return;
        }
        if (
          ((n = e.return),
          n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          H = e;
          return;
        }
        H = e = n;
      } while (e !== null);
      (Xl = 6), (H = null);
    }
    function Uu(e, t, n, r, a, o, s, c, l) {
      e.cancelPendingCommit = null;
      do Ju();
      while (uu !== 0);
      if (V & 6) throw Error(i(327));
      if (t !== null) {
        if (t === e.current) throw Error(i(177));
        if (
          ((o = t.lanes | t.childLanes),
          (o |= ai),
          it(e, n, o, s, c, l),
          e === Wl && ((H = Wl = null), (U = 0)),
          (fu = t),
          (du = e),
          (pu = n),
          (mu = o),
          (hu = a),
          (gu = r),
          t.subtreeFlags & 10256 || t.flags & 10256
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              nd(Ie, function () {
                return Yu(), null;
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (r = (t.flags & 13878) != 0),
          t.subtreeFlags & 13878 || r)
        ) {
          (r = D.T), (D.T = null), (a = O.p), (O.p = 2), (s = V), (V |= 4);
          try {
            ll(e, t, n);
          } finally {
            (V = s), (O.p = a), (D.T = r);
          }
        }
        (uu = 1), Wu(), Gu(), Ku();
      }
    }
    function Wu() {
      if (uu === 1) {
        uu = 0;
        var e = du,
          t = fu,
          n = (t.flags & 13878) != 0;
        if (t.subtreeFlags & 13878 || n) {
          (n = D.T), (D.T = null);
          var r = O.p;
          O.p = 2;
          var i = V;
          V |= 4;
          try {
            Sl(t, e);
            var a = Kd,
              o = Nr(e.containerInfo),
              s = a.focusedElem,
              c = a.selectionRange;
            if (o !== s && s && s.ownerDocument && Mr(s.ownerDocument.documentElement, s)) {
              if (c !== null && Pr(s)) {
                var l = c.start,
                  u = c.end;
                if ((u === void 0 && (u = l), `selectionStart` in s))
                  (s.selectionStart = l), (s.selectionEnd = Math.min(u, s.value.length));
                else {
                  var d = s.ownerDocument || document,
                    f = (d && d.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      m = s.textContent.length,
                      h = Math.min(c.start, m),
                      g = c.end === void 0 ? h : Math.min(c.end, m);
                    !p.extend && h > g && ((o = g), (g = h), (h = o));
                    var _ = jr(s, h),
                      v = jr(s, g);
                    if (
                      _ &&
                      v &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== _.node ||
                        p.anchorOffset !== _.offset ||
                        p.focusNode !== v.node ||
                        p.focusOffset !== v.offset)
                    ) {
                      var y = d.createRange();
                      y.setStart(_.node, _.offset),
                        p.removeAllRanges(),
                        h > g
                          ? (p.addRange(y), p.extend(v.node, v.offset))
                          : (y.setEnd(v.node, v.offset), p.addRange(y));
                    }
                  }
                }
              }
              for (d = [], p = s; (p = p.parentNode); )
                p.nodeType === 1 && d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (typeof s.focus == `function` && s.focus(), s = 0; s < d.length; s++) {
                var b = d[s];
                (b.element.scrollLeft = b.left), (b.element.scrollTop = b.top);
              }
            }
            (mp = !!Gd), (Kd = Gd = null);
          } finally {
            (V = i), (O.p = r), (D.T = n);
          }
        }
        (e.current = t), (uu = 2);
      }
    }
    function Gu() {
      if (uu === 2) {
        uu = 0;
        var e = du,
          t = fu,
          n = (t.flags & 8772) != 0;
        if (t.subtreeFlags & 8772 || n) {
          (n = D.T), (D.T = null);
          var r = O.p;
          O.p = 2;
          var i = V;
          V |= 4;
          try {
            ul(e, t.alternate, t);
          } finally {
            (V = i), (O.p = r), (D.T = n);
          }
        }
        uu = 3;
      }
    }
    function Ku() {
      if (uu === 4 || uu === 3) {
        (uu = 0), je();
        var e = du,
          t = fu,
          n = pu,
          r = gu;
        t.subtreeFlags & 10256 || t.flags & 10256
          ? (uu = 5)
          : ((uu = 0), (fu = du = null), qu(e, e.pendingLanes));
        var i = e.pendingLanes;
        if (
          (i === 0 && (lu = null),
          lt(n),
          (t = t.stateNode),
          He && typeof He.onCommitFiberRoot == `function`)
        )
          try {
            He.onCommitFiberRoot(Ve, t, void 0, (t.current.flags & 128) == 128);
          } catch {}
        if (r !== null) {
          (t = D.T), (i = O.p), (O.p = 2), (D.T = null);
          try {
            for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
              var s = r[o];
              a(s.value, { componentStack: s.stack });
            }
          } finally {
            (D.T = t), (O.p = i);
          }
        }
        pu & 3 && Ju(),
          ld(e),
          (i = e.pendingLanes),
          n & 261930 && i & 42 ? (e === vu ? _u++ : ((_u = 0), (vu = e))) : (_u = 0),
          ud(0, !1);
      }
    }
    function qu(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), P(t)));
    }
    function Ju() {
      return Wu(), Gu(), Ku(), Yu();
    }
    function Yu() {
      if (uu !== 5) return !1;
      var e = du,
        t = mu;
      mu = 0;
      var n = lt(pu),
        r = D.T,
        a = O.p;
      try {
        (O.p = 32 > n ? 32 : n), (D.T = null), (n = hu), (hu = null);
        var o = du,
          s = pu;
        if (((uu = 0), (fu = du = null), (pu = 0), V & 6)) throw Error(i(331));
        var c = V;
        if (
          ((V |= 4),
          zl(o.current),
          jl(o, o.current, s, n),
          (V = c),
          ud(0, !1),
          He && typeof He.onPostCommitFiberRoot == `function`)
        )
          try {
            He.onPostCommitFiberRoot(Ve, o);
          } catch {}
        return !0;
      } finally {
        (O.p = a), (D.T = r), qu(e, t);
      }
    }
    function Xu(e, t, n) {
      (t = wi(n, t)),
        (t = tc(e.stateNode, t, 2)),
        (e = qa(e, t, 2)),
        e !== null && (rt(e, 2), ld(e));
    }
    function G(e, t, n) {
      if (e.tag === 3) Xu(e, e, n);
      else
        for (; t !== null; ) {
          if (t.tag === 3) {
            Xu(t, e, n);
            break;
          } else if (t.tag === 1) {
            var r = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == `function` ||
              (typeof r.componentDidCatch == `function` && (lu === null || !lu.has(r)))
            ) {
              (e = wi(n, e)),
                (n = nc(2)),
                (r = qa(t, n, 2)),
                r !== null && (rc(n, r, t, e), rt(r, 2), ld(r));
              break;
            }
          }
          t = t.return;
        }
    }
    function Zu(e, t, n) {
      var r = e.pingCache;
      if (r === null) {
        r = e.pingCache = new Ul();
        var i = new Set();
        r.set(t, i);
      } else (i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i));
      i.has(n) || ((Jl = !0), i.add(n), (e = Qu.bind(null, e, t, n)), t.then(e, e));
    }
    function Qu(e, t, n) {
      var r = e.pingCache;
      r !== null && r.delete(t),
        (e.pingedLanes |= e.suspendedLanes & n),
        (e.warmLanes &= ~n),
        Wl === e &&
          (U & n) === n &&
          (Xl === 4 || (Xl === 3 && (U & 62914560) === U && 300 > Me() - au)
            ? !(V & 2) && Ou(e, 0)
            : ($l |= n),
          tu === U && (tu = 0)),
        ld(e);
    }
    function $u(e, t) {
      t === 0 && (t = tt()), (e = li(e, t)), e !== null && (rt(e, t), ld(e));
    }
    function ed(e) {
      var t = e.memoizedState,
        n = 0;
      t !== null && (n = t.retryLane), $u(e, n);
    }
    function td(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var r = e.stateNode,
            a = e.memoizedState;
          a !== null && (n = a.retryLane);
          break;
        case 19:
          r = e.stateNode;
          break;
        case 22:
          r = e.stateNode._retryCache;
          break;
        default:
          throw Error(i(314));
      }
      r !== null && r.delete(t), $u(e, n);
    }
    function nd(e, t) {
      return Oe(e, t);
    }
    var rd = null,
      id = null,
      ad = !1,
      od = !1,
      sd = !1,
      cd = 0;
    function ld(e) {
      e !== id && e.next === null && (id === null ? (rd = id = e) : (id = id.next = e)),
        (od = !0),
        ad || ((ad = !0), gd());
    }
    function ud(e, t) {
      if (!sd && od) {
        sd = !0;
        do
          for (var n = !1, r = rd; r !== null; ) {
            if (!t)
              if (e !== 0) {
                var i = r.pendingLanes;
                if (i === 0) var a = 0;
                else {
                  var o = r.suspendedLanes,
                    s = r.pingedLanes;
                  (a = (1 << (31 - We(42 | e) + 1)) - 1),
                    (a &= i & ~(o & ~s)),
                    (a = a & 201326741 ? (a & 201326741) | 1 : a ? a | 2 : 0);
                }
                a !== 0 && ((n = !0), hd(r, a));
              } else
                (a = U),
                  (a = Qe(
                    r,
                    r === Wl ? a : 0,
                    r.cancelPendingCommit !== null || r.timeoutHandle !== -1,
                  )),
                  !(a & 3) || $e(r, a) || ((n = !0), hd(r, a));
            r = r.next;
          }
        while (n);
        sd = !1;
      }
    }
    function dd() {
      fd();
    }
    function fd() {
      od = ad = !1;
      var e = 0;
      cd !== 0 && Qd() && (e = cd);
      for (var t = Me(), n = null, r = rd; r !== null; ) {
        var i = r.next,
          a = pd(r, t);
        a === 0
          ? ((r.next = null), n === null ? (rd = i) : (n.next = i), i === null && (id = n))
          : ((n = r), (e !== 0 || a & 3) && (od = !0)),
          (r = i);
      }
      (uu !== 0 && uu !== 5) || ud(e, !1), cd !== 0 && (cd = 0);
    }
    function pd(e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          i = e.expirationTimes,
          a = e.pendingLanes & -62914561;
        0 < a;
      ) {
        var o = 31 - We(a),
          s = 1 << o,
          c = i[o];
        c === -1
          ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = et(s, t))
          : c <= t && (e.expiredLanes |= s),
          (a &= ~s);
      }
      if (
        ((t = Wl),
        (n = U),
        (n = Qe(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
        (r = e.callbackNode),
        n === 0 || (e === t && (W === 2 || W === 9)) || e.cancelPendingCommit !== null)
      )
        return r !== null && r !== null && ke(r), (e.callbackNode = null), (e.callbackPriority = 0);
      if (!(n & 3) || $e(e, n)) {
        if (((t = n & -n), t === e.callbackPriority)) return t;
        switch ((r !== null && ke(r), lt(n))) {
          case 2:
          case 8:
            n = Fe;
            break;
          case 32:
            n = Ie;
            break;
          case 268435456:
            n = Re;
            break;
          default:
            n = Ie;
        }
        return (
          (r = md.bind(null, e)), (n = Oe(n, r)), (e.callbackPriority = t), (e.callbackNode = n), t
        );
      }
      return (
        r !== null && r !== null && ke(r), (e.callbackPriority = 2), (e.callbackNode = null), 2
      );
    }
    function md(e, t) {
      if (uu !== 0 && uu !== 5) return (e.callbackNode = null), (e.callbackPriority = 0), null;
      var n = e.callbackNode;
      if (Ju() && e.callbackNode !== n) return null;
      var r = U;
      return (
        (r = Qe(e, e === Wl ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
        r === 0
          ? null
          : (Su(e, r, t),
            pd(e, Me()),
            e.callbackNode != null && e.callbackNode === n ? md.bind(null, e) : null)
      );
    }
    function hd(e, t) {
      if (Ju()) return null;
      Su(e, t, !0);
    }
    function gd() {
      nf(function () {
        V & 6 ? Oe(Pe, dd) : fd();
      });
    }
    function _d() {
      if (cd === 0) {
        var e = F;
        e === 0 && ((e = Je), (Je <<= 1), !(Je & 261888) && (Je = 256)), (cd = e);
      }
      return cd;
    }
    function vd(e) {
      return e == null || typeof e == `symbol` || typeof e == `boolean`
        ? null
        : typeof e == `function`
          ? e
          : an(`` + e);
    }
    function yd(e, t) {
      var n = t.ownerDocument.createElement(`input`);
      return (
        (n.name = t.name),
        (n.value = t.value),
        e.id && n.setAttribute(`form`, e.id),
        t.parentNode.insertBefore(n, t),
        (e = new FormData(e)),
        n.parentNode.removeChild(n),
        e
      );
    }
    function bd(e, t, n, r, i) {
      if (t === `submit` && n && n.stateNode === i) {
        var a = vd((i[mt] || null).action),
          o = r.submitter;
        o &&
          ((t = (t = o[mt] || null) ? vd(t.formAction) : o.getAttribute(`formAction`)),
          t !== null && ((a = t), (o = null)));
        var s = new Dn(`action`, `action`, null, r, i);
        e.push({
          event: s,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (r.defaultPrevented) {
                  if (cd !== 0) {
                    var e = o ? yd(i, o) : new FormData(i);
                    Ds(n, { pending: !0, data: e, method: i.method, action: a }, null, e);
                  }
                } else
                  typeof a == `function` &&
                    (s.preventDefault(),
                    (e = o ? yd(i, o) : new FormData(i)),
                    Ds(n, { pending: !0, data: e, method: i.method, action: a }, a, e));
              },
              currentTarget: i,
            },
          ],
        });
      }
    }
    for (var xd = 0; xd < ei.length; xd++) {
      var Sd = ei[xd];
      ti(Sd.toLowerCase(), `on` + (Sd[0].toUpperCase() + Sd.slice(1)));
    }
    ti(Kr, `onAnimationEnd`),
      ti(qr, `onAnimationIteration`),
      ti(Jr, `onAnimationStart`),
      ti(`dblclick`, `onDoubleClick`),
      ti(`focusin`, `onFocus`),
      ti(`focusout`, `onBlur`),
      ti(Yr, `onTransitionRun`),
      ti(Xr, `onTransitionStart`),
      ti(Zr, `onTransitionCancel`),
      ti(Qr, `onTransitionEnd`),
      At(`onMouseEnter`, [`mouseout`, `mouseover`]),
      At(`onMouseLeave`, [`mouseout`, `mouseover`]),
      At(`onPointerEnter`, [`pointerout`, `pointerover`]),
      At(`onPointerLeave`, [`pointerout`, `pointerover`]),
      kt(
        `onChange`,
        `change click focusin focusout input keydown keyup selectionchange`.split(` `),
      ),
      kt(
        `onSelect`,
        `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
          ` `,
        ),
      ),
      kt(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
      kt(`onCompositionEnd`, `compositionend focusout keydown keypress keyup mousedown`.split(` `)),
      kt(
        `onCompositionStart`,
        `compositionstart focusout keydown keypress keyup mousedown`.split(` `),
      ),
      kt(
        `onCompositionUpdate`,
        `compositionupdate focusout keydown keypress keyup mousedown`.split(` `),
      );
    var Cd =
        `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
          ` `,
        ),
      wd = new Set(
        `beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(Cd),
      );
    function Td(e, t) {
      t = (t & 4) != 0;
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = r.event;
        r = r.listeners;
        a: {
          var a = void 0;
          if (t)
            for (var o = r.length - 1; 0 <= o; o--) {
              var s = r[o],
                c = s.instance,
                l = s.currentTarget;
              if (((s = s.listener), c !== a && i.isPropagationStopped())) break a;
              (a = s), (i.currentTarget = l);
              try {
                a(i);
              } catch (e) {
                ni(e);
              }
              (i.currentTarget = null), (a = c);
            }
          else
            for (o = 0; o < r.length; o++) {
              if (
                ((s = r[o]),
                (c = s.instance),
                (l = s.currentTarget),
                (s = s.listener),
                c !== a && i.isPropagationStopped())
              )
                break a;
              (a = s), (i.currentTarget = l);
              try {
                a(i);
              } catch (e) {
                ni(e);
              }
              (i.currentTarget = null), (a = c);
            }
        }
      }
    }
    function K(e, t) {
      var n = t[gt];
      n === void 0 && (n = t[gt] = new Set());
      var r = e + `__bubble`;
      n.has(r) || (kd(t, e, 2, !1), n.add(r));
    }
    function Ed(e, t, n) {
      var r = 0;
      t && (r |= 4), kd(n, e, r, t);
    }
    var Dd = `_reactListening` + Math.random().toString(36).slice(2);
    function Od(e) {
      if (!e[Dd]) {
        (e[Dd] = !0),
          Dt.forEach(function (t) {
            t !== `selectionchange` && (wd.has(t) || Ed(t, !1, e), Ed(t, !0, e));
          });
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[Dd] || ((t[Dd] = !0), Ed(`selectionchange`, !1, t));
      }
    }
    function kd(e, t, n, r) {
      switch (xp(t)) {
        case 2:
          var i = hp;
          break;
        case 8:
          i = gp;
          break;
        default:
          i = _p;
      }
      (n = i.bind(null, t, n, e)),
        (i = void 0),
        !gn || (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) || (i = !0),
        r
          ? i === void 0
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: i })
          : i === void 0
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: i });
    }
    function Ad(e, t, n, r, i) {
      var a = r;
      if (!(t & 1) && !(t & 2) && r !== null)
        a: for (;;) {
          if (r === null) return;
          var s = r.tag;
          if (s === 3 || s === 4) {
            var c = r.stateNode.containerInfo;
            if (c === i) break;
            if (s === 4)
              for (s = r.return; s !== null; ) {
                var l = s.tag;
                if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
                s = s.return;
              }
            for (; c !== null; ) {
              if (((s = St(c)), s === null)) return;
              if (((l = s.tag), l === 5 || l === 6 || l === 26 || l === 27)) {
                r = a = s;
                continue a;
              }
              c = c.parentNode;
            }
          }
          r = r.return;
        }
      pn(function () {
        var r = a,
          i = cn(n),
          s = [];
        a: {
          var c = $r.get(e);
          if (c !== void 0) {
            var l = Dn,
              u = e;
            switch (e) {
              case `keypress`:
                if (Sn(n) === 0) break a;
              case `keydown`:
              case `keyup`:
                l = Gn;
                break;
              case `focusin`:
                (u = `focus`), (l = In);
                break;
              case `focusout`:
                (u = `blur`), (l = In);
                break;
              case `beforeblur`:
              case `afterblur`:
                l = In;
                break;
              case `click`:
                if (n.button === 2) break a;
              case `auxclick`:
              case `dblclick`:
              case `mousedown`:
              case `mousemove`:
              case `mouseup`:
              case `mouseout`:
              case `mouseover`:
              case `contextmenu`:
                l = Pn;
                break;
              case `drag`:
              case `dragend`:
              case `dragenter`:
              case `dragexit`:
              case `dragleave`:
              case `dragover`:
              case `dragstart`:
              case `drop`:
                l = Fn;
                break;
              case `touchcancel`:
              case `touchend`:
              case `touchmove`:
              case `touchstart`:
                l = qn;
                break;
              case Kr:
              case qr:
              case Jr:
                l = Ln;
                break;
              case Qr:
                l = Jn;
                break;
              case `scroll`:
              case `scrollend`:
                l = kn;
                break;
              case `wheel`:
                l = Yn;
                break;
              case `copy`:
              case `cut`:
              case `paste`:
                l = Rn;
                break;
              case `gotpointercapture`:
              case `lostpointercapture`:
              case `pointercancel`:
              case `pointerdown`:
              case `pointermove`:
              case `pointerout`:
              case `pointerover`:
              case `pointerup`:
                l = Kn;
                break;
              case `toggle`:
              case `beforetoggle`:
                l = Xn;
            }
            var d = (t & 4) != 0,
              f = !d && (e === `scroll` || e === `scrollend`),
              p = d ? (c === null ? null : c + `Capture`) : c;
            d = [];
            for (var m = r, h; m !== null; ) {
              var g = m;
              if (
                ((h = g.stateNode),
                (g = g.tag),
                (g !== 5 && g !== 26 && g !== 27) ||
                  h === null ||
                  p === null ||
                  ((g = mn(m, p)), g != null && d.push(jd(m, g, h))),
                f)
              )
                break;
              m = m.return;
            }
            0 < d.length && ((c = new l(c, u, null, n, i)), s.push({ event: c, listeners: d }));
          }
        }
        if (!(t & 7)) {
          a: {
            if (
              ((c = e === `mouseover` || e === `pointerover`),
              (l = e === `mouseout` || e === `pointerout`),
              c && n !== sn && (u = n.relatedTarget || n.fromElement) && (St(u) || u[ht]))
            )
              break a;
            if (
              (l || c) &&
              ((c =
                i.window === i
                  ? i
                  : (c = i.ownerDocument)
                    ? c.defaultView || c.parentWindow
                    : window),
              l
                ? ((u = n.relatedTarget || n.toElement),
                  (l = r),
                  (u = u ? St(u) : null),
                  u !== null &&
                    ((f = o(u)), (d = u.tag), u !== f || (d !== 5 && d !== 27 && d !== 6)) &&
                    (u = null))
                : ((l = null), (u = r)),
              l !== u)
            ) {
              if (
                ((d = Pn),
                (g = `onMouseLeave`),
                (p = `onMouseEnter`),
                (m = `mouse`),
                (e === `pointerout` || e === `pointerover`) &&
                  ((d = Kn), (g = `onPointerLeave`), (p = `onPointerEnter`), (m = `pointer`)),
                (f = l == null ? c : wt(l)),
                (h = u == null ? c : wt(u)),
                (c = new d(g, m + `leave`, l, n, i)),
                (c.target = f),
                (c.relatedTarget = h),
                (g = null),
                St(i) === r &&
                  ((d = new d(p, m + `enter`, u, n, i)),
                  (d.target = h),
                  (d.relatedTarget = f),
                  (g = d)),
                (f = g),
                l && u)
              )
                b: {
                  for (d = Nd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
                  g = 0;
                  for (var _ = m; _; _ = d(_)) g++;
                  for (; 0 < h - g; ) (p = d(p)), h--;
                  for (; 0 < g - h; ) (m = d(m)), g--;
                  for (; h--; ) {
                    if (p === m || (m !== null && p === m.alternate)) {
                      d = p;
                      break b;
                    }
                    (p = d(p)), (m = d(m));
                  }
                  d = null;
                }
              else d = null;
              l !== null && Pd(s, c, l, d, !1), u !== null && f !== null && Pd(s, f, u, d, !0);
            }
          }
          a: {
            if (
              ((c = r ? wt(r) : window),
              (l = c.nodeName && c.nodeName.toLowerCase()),
              l === `select` || (l === `input` && c.type === `file`))
            )
              var v = gr;
            else if (ur(c))
              if (_r) v = Er;
              else {
                v = wr;
                var y = Cr;
              }
            else
              (l = c.nodeName),
                !l || l.toLowerCase() !== `input` || (c.type !== `checkbox` && c.type !== `radio`)
                  ? r && tn(r.elementType) && (v = gr)
                  : (v = Tr);
            if ((v &&= v(e, r))) {
              dr(s, v, n, i);
              break a;
            }
            y && y(e, c, r),
              e === `focusout` &&
                r &&
                c.type === `number` &&
                r.memoizedProps.value != null &&
                M(c, `number`, c.value);
          }
          switch (((y = r ? wt(r) : window), e)) {
            case `focusin`:
              (ur(y) || y.contentEditable === `true`) && ((Ir = y), (Lr = r), (Rr = null));
              break;
            case `focusout`:
              Rr = Lr = Ir = null;
              break;
            case `mousedown`:
              zr = !0;
              break;
            case `contextmenu`:
            case `mouseup`:
            case `dragend`:
              (zr = !1), Br(s, n, i);
              break;
            case `selectionchange`:
              if (Fr) break;
            case `keydown`:
            case `keyup`:
              Br(s, n, i);
          }
          var b;
          if (Qn)
            b: {
              switch (e) {
                case `compositionstart`:
                  var x = `onCompositionStart`;
                  break b;
                case `compositionend`:
                  x = `onCompositionEnd`;
                  break b;
                case `compositionupdate`:
                  x = `onCompositionUpdate`;
                  break b;
              }
              x = void 0;
            }
          else
            or
              ? ir(e, n) && (x = `onCompositionEnd`)
              : e === `keydown` && n.keyCode === 229 && (x = `onCompositionStart`);
          x &&
            (tr &&
              n.locale !== `ko` &&
              (or || x !== `onCompositionStart`
                ? x === `onCompositionEnd` && or && (b = xn())
                : ((vn = i), (yn = `value` in vn ? vn.value : vn.textContent), (or = !0))),
            (y = Md(r, x)),
            0 < y.length &&
              ((x = new zn(x, e, null, n, i)),
              s.push({ event: x, listeners: y }),
              b ? (x.data = b) : ((b = ar(n)), b !== null && (x.data = b)))),
            (b = er ? sr(e, n) : cr(e, n)) &&
              ((x = Md(r, `onBeforeInput`)),
              0 < x.length &&
                ((y = new zn(`onBeforeInput`, `beforeinput`, null, n, i)),
                s.push({ event: y, listeners: x }),
                (y.data = b))),
            bd(s, e, r, n, i);
        }
        Td(s, t);
      });
    }
    function jd(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function Md(e, t) {
      for (var n = t + `Capture`, r = []; e !== null; ) {
        var i = e,
          a = i.stateNode;
        if (
          ((i = i.tag),
          (i !== 5 && i !== 26 && i !== 27) ||
            a === null ||
            ((i = mn(e, n)),
            i != null && r.unshift(jd(e, i, a)),
            (i = mn(e, t)),
            i != null && r.push(jd(e, i, a))),
          e.tag === 3)
        )
          return r;
        e = e.return;
      }
      return [];
    }
    function Nd(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Pd(e, t, n, r, i) {
      for (var a = t._reactName, o = []; n !== null && n !== r; ) {
        var s = n,
          c = s.alternate,
          l = s.stateNode;
        if (((s = s.tag), c !== null && c === r)) break;
        (s !== 5 && s !== 26 && s !== 27) ||
          l === null ||
          ((c = l),
          i
            ? ((l = mn(n, a)), l != null && o.unshift(jd(n, l, c)))
            : i || ((l = mn(n, a)), l != null && o.push(jd(n, l, c)))),
          (n = n.return);
      }
      o.length !== 0 && e.push({ event: t, listeners: o });
    }
    var Fd = /\r\n?/g,
      Id = /\u0000|\uFFFD/g;
    function Ld(e) {
      return (typeof e == `string` ? e : `` + e)
        .replace(
          Fd,
          `
`,
        )
        .replace(Id, ``);
    }
    function Rd(e, t) {
      return (t = Ld(t)), Ld(e) === t;
    }
    function zd(e, t, n, r, a, o) {
      switch (n) {
        case `children`:
          typeof r == `string`
            ? t === `body` || (t === `textarea` && r === ``) || Zt(e, r)
            : (typeof r == `number` || typeof r == `bigint`) && t !== `body` && Zt(e, `` + r);
          break;
        case `className`:
          It(e, `class`, r);
          break;
        case `tabIndex`:
          It(e, `tabindex`, r);
          break;
        case `dir`:
        case `role`:
        case `viewBox`:
        case `width`:
        case `height`:
          It(e, n, r);
          break;
        case `style`:
          en(e, r, o);
          break;
        case `data`:
          if (t !== `object`) {
            It(e, `data`, r);
            break;
          }
        case `src`:
        case `href`:
          if (r === `` && (t !== `a` || n !== `href`)) {
            e.removeAttribute(n);
            break;
          }
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `symbol` ||
            typeof r == `boolean`
          ) {
            e.removeAttribute(n);
            break;
          }
          (r = an(`` + r)), e.setAttribute(n, r);
          break;
        case `action`:
        case `formAction`:
          if (typeof r == `function`) {
            e.setAttribute(
              n,
              `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
            );
            break;
          } else
            typeof o == `function` &&
              (n === `formAction`
                ? (t !== `input` && zd(e, t, `name`, a.name, a, null),
                  zd(e, t, `formEncType`, a.formEncType, a, null),
                  zd(e, t, `formMethod`, a.formMethod, a, null),
                  zd(e, t, `formTarget`, a.formTarget, a, null))
                : (zd(e, t, `encType`, a.encType, a, null),
                  zd(e, t, `method`, a.method, a, null),
                  zd(e, t, `target`, a.target, a, null)));
          if (r == null || typeof r == `symbol` || typeof r == `boolean`) {
            e.removeAttribute(n);
            break;
          }
          (r = an(`` + r)), e.setAttribute(n, r);
          break;
        case `onClick`:
          r != null && (e.onclick = on);
          break;
        case `onScroll`:
          r != null && K(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && K(`scrollend`, e);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `multiple`:
          e.multiple = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `muted`:
          e.muted = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `defaultValue`:
        case `defaultChecked`:
        case `innerHTML`:
        case `ref`:
          break;
        case `autoFocus`:
          break;
        case `xlinkHref`:
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `boolean` ||
            typeof r == `symbol`
          ) {
            e.removeAttribute(`xlink:href`);
            break;
          }
          (n = an(`` + r)), e.setAttributeNS(`http://www.w3.org/1999/xlink`, `xlink:href`, n);
          break;
        case `contentEditable`:
        case `spellCheck`:
        case `draggable`:
        case `value`:
        case `autoReverse`:
        case `externalResourcesRequired`:
        case `focusable`:
        case `preserveAlpha`:
          r != null && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, `` + r)
            : e.removeAttribute(n);
          break;
        case `inert`:
        case `allowFullScreen`:
        case `async`:
        case `autoPlay`:
        case `controls`:
        case `default`:
        case `defer`:
        case `disabled`:
        case `disablePictureInPicture`:
        case `disableRemotePlayback`:
        case `formNoValidate`:
        case `hidden`:
        case `loop`:
        case `noModule`:
        case `noValidate`:
        case `open`:
        case `playsInline`:
        case `readOnly`:
        case `required`:
        case `reversed`:
        case `scoped`:
        case `seamless`:
        case `itemScope`:
          r && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, ``)
            : e.removeAttribute(n);
          break;
        case `capture`:
        case `download`:
          !0 === r
            ? e.setAttribute(n, ``)
            : !1 !== r && r != null && typeof r != `function` && typeof r != `symbol`
              ? e.setAttribute(n, r)
              : e.removeAttribute(n);
          break;
        case `cols`:
        case `rows`:
        case `size`:
        case `span`:
          r != null && typeof r != `function` && typeof r != `symbol` && !isNaN(r) && 1 <= r
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case `rowSpan`:
        case `start`:
          r == null || typeof r == `function` || typeof r == `symbol` || isNaN(r)
            ? e.removeAttribute(n)
            : e.setAttribute(n, r);
          break;
        case `popover`:
          K(`beforetoggle`, e), K(`toggle`, e), Ft(e, `popover`, r);
          break;
        case `xlinkActuate`:
          Lt(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
          break;
        case `xlinkArcrole`:
          Lt(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
          break;
        case `xlinkRole`:
          Lt(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
          break;
        case `xlinkShow`:
          Lt(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
          break;
        case `xlinkTitle`:
          Lt(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
          break;
        case `xlinkType`:
          Lt(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
          break;
        case `xmlBase`:
          Lt(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
          break;
        case `xmlLang`:
          Lt(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
          break;
        case `xmlSpace`:
          Lt(e, `http://www.w3.org/XML/1998/namespace`, `xml:space`, r);
          break;
        case `is`:
          Ft(e, `is`, r);
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          (!(2 < n.length) || (n[0] !== `o` && n[0] !== `O`) || (n[1] !== `n` && n[1] !== `N`)) &&
            ((n = nn.get(n) || n), Ft(e, n, r));
      }
    }
    function Bd(e, t, n, r, a, o) {
      switch (n) {
        case `style`:
          en(e, r, o);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `children`:
          typeof r == `string`
            ? Zt(e, r)
            : (typeof r == `number` || typeof r == `bigint`) && Zt(e, `` + r);
          break;
        case `onScroll`:
          r != null && K(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && K(`scrollend`, e);
          break;
        case `onClick`:
          r != null && (e.onclick = on);
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `innerHTML`:
        case `ref`:
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          if (!Ot.hasOwnProperty(n))
            a: {
              if (
                n[0] === `o` &&
                n[1] === `n` &&
                ((a = n.endsWith(`Capture`)),
                (t = n.slice(2, a ? n.length - 7 : void 0)),
                (o = e[mt] || null),
                (o = o == null ? null : o[n]),
                typeof o == `function` && e.removeEventListener(t, o, a),
                typeof r == `function`)
              ) {
                typeof o != `function` &&
                  o !== null &&
                  (n in e ? (e[n] = null) : e.hasAttribute(n) && e.removeAttribute(n)),
                  e.addEventListener(t, r, a);
                break a;
              }
              n in e ? (e[n] = r) : !0 === r ? e.setAttribute(n, ``) : Ft(e, n, r);
            }
      }
    }
    function Vd(e, t, n) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `img`:
          K(`error`, e), K(`load`, e);
          var r = !1,
            a = !1,
            o;
          for (o in n)
            if (n.hasOwnProperty(o)) {
              var s = n[o];
              if (s != null)
                switch (o) {
                  case `src`:
                    r = !0;
                    break;
                  case `srcSet`:
                    a = !0;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    throw Error(i(137, t));
                  default:
                    zd(e, t, o, s, n, null);
                }
            }
          a && zd(e, t, `srcSet`, n.srcSet, n, null), r && zd(e, t, `src`, n.src, n, null);
          return;
        case `input`:
          K(`invalid`, e);
          var c = (o = s = a = null),
            l = null,
            u = null;
          for (r in n)
            if (n.hasOwnProperty(r)) {
              var d = n[r];
              if (d != null)
                switch (r) {
                  case `name`:
                    a = d;
                    break;
                  case `type`:
                    s = d;
                    break;
                  case `checked`:
                    l = d;
                    break;
                  case `defaultChecked`:
                    u = d;
                    break;
                  case `value`:
                    o = d;
                    break;
                  case `defaultValue`:
                    c = d;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    if (d != null) throw Error(i(137, t));
                    break;
                  default:
                    zd(e, t, r, d, n, null);
                }
            }
          qt(e, o, c, l, u, s, a, !1);
          return;
        case `select`:
          for (a in (K(`invalid`, e), (r = s = o = null), n))
            if (n.hasOwnProperty(a) && ((c = n[a]), c != null))
              switch (a) {
                case `value`:
                  o = c;
                  break;
                case `defaultValue`:
                  s = c;
                  break;
                case `multiple`:
                  r = c;
                default:
                  zd(e, t, a, c, n, null);
              }
          (t = o),
            (n = s),
            (e.multiple = !!r),
            t == null ? n != null && Jt(e, !!r, n, !0) : Jt(e, !!r, t, !1);
          return;
        case `textarea`:
          for (s in (K(`invalid`, e), (o = a = r = null), n))
            if (n.hasOwnProperty(s) && ((c = n[s]), c != null))
              switch (s) {
                case `value`:
                  r = c;
                  break;
                case `defaultValue`:
                  a = c;
                  break;
                case `children`:
                  o = c;
                  break;
                case `dangerouslySetInnerHTML`:
                  if (c != null) throw Error(i(91));
                  break;
                default:
                  zd(e, t, s, c, n, null);
              }
          Xt(e, r, a, o);
          return;
        case `option`:
          for (l in n)
            if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
              switch (l) {
                case `selected`:
                  e.selected = r && typeof r != `function` && typeof r != `symbol`;
                  break;
                default:
                  zd(e, t, l, r, n, null);
              }
          return;
        case `dialog`:
          K(`beforetoggle`, e), K(`toggle`, e), K(`cancel`, e), K(`close`, e);
          break;
        case `iframe`:
        case `object`:
          K(`load`, e);
          break;
        case `video`:
        case `audio`:
          for (r = 0; r < Cd.length; r++) K(Cd[r], e);
          break;
        case `image`:
          K(`error`, e), K(`load`, e);
          break;
        case `details`:
          K(`toggle`, e);
          break;
        case `embed`:
        case `source`:
        case `link`:
          K(`error`, e), K(`load`, e);
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (u in n)
            if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  throw Error(i(137, t));
                default:
                  zd(e, t, u, r, n, null);
              }
          return;
        default:
          if (tn(t)) {
            for (d in n)
              n.hasOwnProperty(d) && ((r = n[d]), r !== void 0 && Bd(e, t, d, r, n, void 0));
            return;
          }
      }
      for (c in n) n.hasOwnProperty(c) && ((r = n[c]), r != null && zd(e, t, c, r, n, null));
    }
    function Hd(e, t, n, r) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `input`:
          var a = null,
            o = null,
            s = null,
            c = null,
            l = null,
            u = null,
            d = null;
          for (m in n) {
            var f = n[m];
            if (n.hasOwnProperty(m) && f != null)
              switch (m) {
                case `checked`:
                  break;
                case `value`:
                  break;
                case `defaultValue`:
                  l = f;
                default:
                  r.hasOwnProperty(m) || zd(e, t, m, null, r, f);
              }
          }
          for (var p in r) {
            var m = r[p];
            if (((f = n[p]), r.hasOwnProperty(p) && (m != null || f != null)))
              switch (p) {
                case `type`:
                  o = m;
                  break;
                case `name`:
                  a = m;
                  break;
                case `checked`:
                  u = m;
                  break;
                case `defaultChecked`:
                  d = m;
                  break;
                case `value`:
                  s = m;
                  break;
                case `defaultValue`:
                  c = m;
                  break;
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (m != null) throw Error(i(137, t));
                  break;
                default:
                  m !== f && zd(e, t, p, m, r, f);
              }
          }
          Kt(e, s, c, l, u, d, o, a);
          return;
        case `select`:
          for (o in ((m = s = c = p = null), n))
            if (((l = n[o]), n.hasOwnProperty(o) && l != null))
              switch (o) {
                case `value`:
                  break;
                case `multiple`:
                  m = l;
                default:
                  r.hasOwnProperty(o) || zd(e, t, o, null, r, l);
              }
          for (a in r)
            if (((o = r[a]), (l = n[a]), r.hasOwnProperty(a) && (o != null || l != null)))
              switch (a) {
                case `value`:
                  p = o;
                  break;
                case `defaultValue`:
                  c = o;
                  break;
                case `multiple`:
                  s = o;
                default:
                  o !== l && zd(e, t, a, o, r, l);
              }
          (t = c),
            (n = s),
            (r = m),
            p == null
              ? !!r != !!n && (t == null ? Jt(e, !!n, n ? [] : ``, !1) : Jt(e, !!n, t, !0))
              : Jt(e, !!n, p, !1);
          return;
        case `textarea`:
          for (c in ((m = p = null), n))
            if (((a = n[c]), n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)))
              switch (c) {
                case `value`:
                  break;
                case `children`:
                  break;
                default:
                  zd(e, t, c, null, r, a);
              }
          for (s in r)
            if (((a = r[s]), (o = n[s]), r.hasOwnProperty(s) && (a != null || o != null)))
              switch (s) {
                case `value`:
                  p = a;
                  break;
                case `defaultValue`:
                  m = a;
                  break;
                case `children`:
                  break;
                case `dangerouslySetInnerHTML`:
                  if (a != null) throw Error(i(91));
                  break;
                default:
                  a !== o && zd(e, t, s, a, r, o);
              }
          Yt(e, p, m);
          return;
        case `option`:
          for (var h in n)
            if (((p = n[h]), n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)))
              switch (h) {
                case `selected`:
                  e.selected = !1;
                  break;
                default:
                  zd(e, t, h, null, r, p);
              }
          for (l in r)
            if (
              ((p = r[l]), (m = n[l]), r.hasOwnProperty(l) && p !== m && (p != null || m != null))
            )
              switch (l) {
                case `selected`:
                  e.selected = p && typeof p != `function` && typeof p != `symbol`;
                  break;
                default:
                  zd(e, t, l, p, r, m);
              }
          return;
        case `img`:
        case `link`:
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `embed`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `source`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (var g in n)
            (p = n[g]),
              n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && zd(e, t, g, null, r, p);
          for (u in r)
            if (
              ((p = r[u]), (m = n[u]), r.hasOwnProperty(u) && p !== m && (p != null || m != null))
            )
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (p != null) throw Error(i(137, t));
                  break;
                default:
                  zd(e, t, u, p, r, m);
              }
          return;
        default:
          if (tn(t)) {
            for (var _ in n)
              (p = n[_]),
                n.hasOwnProperty(_) &&
                  p !== void 0 &&
                  !r.hasOwnProperty(_) &&
                  Bd(e, t, _, void 0, r, p);
            for (d in r)
              (p = r[d]),
                (m = n[d]),
                !r.hasOwnProperty(d) ||
                  p === m ||
                  (p === void 0 && m === void 0) ||
                  Bd(e, t, d, p, r, m);
            return;
          }
      }
      for (var v in n)
        (p = n[v]),
          n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && zd(e, t, v, null, r, p);
      for (f in r)
        (p = r[f]),
          (m = n[f]),
          !r.hasOwnProperty(f) || p === m || (p == null && m == null) || zd(e, t, f, p, r, m);
    }
    function Ud(e) {
      switch (e) {
        case `css`:
        case `script`:
        case `font`:
        case `img`:
        case `image`:
        case `input`:
        case `link`:
          return !0;
        default:
          return !1;
      }
    }
    function Wd() {
      if (typeof performance.getEntriesByType == `function`) {
        for (
          var e = 0, t = 0, n = performance.getEntriesByType(`resource`), r = 0;
          r < n.length;
          r++
        ) {
          var i = n[r],
            a = i.transferSize,
            o = i.initiatorType,
            s = i.duration;
          if (a && s && Ud(o)) {
            for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
              var c = n[r],
                l = c.startTime;
              if (l > s) break;
              var u = c.transferSize,
                d = c.initiatorType;
              u && Ud(d) && ((c = c.responseEnd), (o += u * (c < s ? 1 : (s - l) / (c - l))));
            }
            if ((--r, (t += (8 * (a + o)) / (i.duration / 1e3)), e++, 10 < e)) break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection && ((e = navigator.connection.downlink), typeof e == `number`)
        ? e
        : 5;
    }
    var Gd = null,
      Kd = null;
    function qd(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Jd(e) {
      switch (e) {
        case `http://www.w3.org/2000/svg`:
          return 1;
        case `http://www.w3.org/1998/Math/MathML`:
          return 2;
        default:
          return 0;
      }
    }
    function Yd(e, t) {
      if (e === 0)
        switch (t) {
          case `svg`:
            return 1;
          case `math`:
            return 2;
          default:
            return 0;
        }
      return e === 1 && t === `foreignObject` ? 0 : e;
    }
    function Xd(e, t) {
      return (
        e === `textarea` ||
        e === `noscript` ||
        typeof t.children == `string` ||
        typeof t.children == `number` ||
        typeof t.children == `bigint` ||
        (typeof t.dangerouslySetInnerHTML == `object` &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var Zd = null;
    function Qd() {
      var e = window.event;
      return e && e.type === `popstate` ? (e === Zd ? !1 : ((Zd = e), !0)) : ((Zd = null), !1);
    }
    var $d = typeof setTimeout == `function` ? setTimeout : void 0,
      ef = typeof clearTimeout == `function` ? clearTimeout : void 0,
      tf = typeof Promise == `function` ? Promise : void 0,
      nf =
        typeof queueMicrotask == `function`
          ? queueMicrotask
          : tf === void 0
            ? $d
            : function (e) {
                return tf.resolve(null).then(e).catch(rf);
              };
    function rf(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function af(e) {
      return e === `head`;
    }
    function of(e, t) {
      var n = t,
        r = 0;
      do {
        var i = n.nextSibling;
        if ((e.removeChild(n), i && i.nodeType === 8))
          if (((n = i.data), n === `/$` || n === `/&`)) {
            if (r === 0) {
              e.removeChild(i), Bp(t);
              return;
            }
            r--;
          } else if (n === `$` || n === `$?` || n === `$~` || n === `$!` || n === `&`) r++;
          else if (n === `html`) bf(e.ownerDocument.documentElement);
          else if (n === `head`) {
            (n = e.ownerDocument.head), bf(n);
            for (var a = n.firstChild; a; ) {
              var o = a.nextSibling,
                s = a.nodeName;
              a[bt] ||
                s === `SCRIPT` ||
                s === `STYLE` ||
                (s === `LINK` && a.rel.toLowerCase() === `stylesheet`) ||
                n.removeChild(a),
                (a = o);
            }
          } else n === `body` && bf(e.ownerDocument.body);
        n = i;
      } while (n);
      Bp(t);
    }
    function sf(e, t) {
      var n = e;
      e = 0;
      do {
        var r = n.nextSibling;
        if (
          (n.nodeType === 1
            ? t
              ? ((n._stashedDisplay = n.style.display), (n.style.display = `none`))
              : ((n.style.display = n._stashedDisplay || ``),
                n.getAttribute(`style`) === `` && n.removeAttribute(`style`))
            : n.nodeType === 3 &&
              (t
                ? ((n._stashedText = n.nodeValue), (n.nodeValue = ``))
                : (n.nodeValue = n._stashedText || ``)),
          r && r.nodeType === 8)
        )
          if (((n = r.data), n === `/$`)) {
            if (e === 0) break;
            e--;
          } else (n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) || e++;
        n = r;
      } while (n);
    }
    function cf(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var n = t;
        switch (((t = t.nextSibling), n.nodeName)) {
          case `HTML`:
          case `HEAD`:
          case `BODY`:
            cf(n), xt(n);
            continue;
          case `SCRIPT`:
          case `STYLE`:
            continue;
          case `LINK`:
            if (n.rel.toLowerCase() === `stylesheet`) continue;
        }
        e.removeChild(n);
      }
    }
    function lf(e, t, n, r) {
      for (; e.nodeType === 1; ) {
        var i = n;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`)) break;
        } else if (!r)
          if (t === `input` && e.type === `hidden`) {
            var a = i.name == null ? null : `` + i.name;
            if (i.type === `hidden` && e.getAttribute(`name`) === a) return e;
          } else return e;
        else if (!e[bt])
          switch (t) {
            case `meta`:
              if (!e.hasAttribute(`itemprop`)) break;
              return e;
            case `link`:
              if (
                ((a = e.getAttribute(`rel`)),
                (a === `stylesheet` && e.hasAttribute(`data-precedence`)) ||
                  a !== i.rel ||
                  e.getAttribute(`href`) !== (i.href == null || i.href === `` ? null : i.href) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin) ||
                  e.getAttribute(`title`) !== (i.title == null ? null : i.title))
              )
                break;
              return e;
            case `style`:
              if (e.hasAttribute(`data-precedence`)) break;
              return e;
            case `script`:
              if (
                ((a = e.getAttribute(`src`)),
                (a !== (i.src == null ? null : i.src) ||
                  e.getAttribute(`type`) !== (i.type == null ? null : i.type) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  a &&
                  e.hasAttribute(`async`) &&
                  !e.hasAttribute(`itemprop`))
              )
                break;
              return e;
            default:
              return e;
          }
        if (((e = hf(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function uf(e, t, n) {
      if (t === ``) return null;
      for (; e.nodeType !== 3; )
        if (
          ((e.nodeType !== 1 || e.nodeName !== `INPUT` || e.type !== `hidden`) && !n) ||
          ((e = hf(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function df(e, t) {
      for (; e.nodeType !== 8; )
        if (
          ((e.nodeType !== 1 || e.nodeName !== `INPUT` || e.type !== `hidden`) && !t) ||
          ((e = hf(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function ff(e) {
      return e.data === `$?` || e.data === `$~`;
    }
    function pf(e) {
      return e.data === `$!` || (e.data === `$?` && e.ownerDocument.readyState !== `loading`);
    }
    function mf(e, t) {
      var n = e.ownerDocument;
      if (e.data === `$~`) e._reactRetry = t;
      else if (e.data !== `$?` || n.readyState !== `loading`) t();
      else {
        var r = function () {
          t(), n.removeEventListener(`DOMContentLoaded`, r);
        };
        n.addEventListener(`DOMContentLoaded`, r), (e._reactRetry = r);
      }
    }
    function hf(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (
            ((t = e.data),
            t === `$` ||
              t === `$!` ||
              t === `$?` ||
              t === `$~` ||
              t === `&` ||
              t === `F!` ||
              t === `F`)
          )
            break;
          if (t === `/$` || t === `/&`) return null;
        }
      }
      return e;
    }
    var gf = null;
    function _f(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `/$` || n === `/&`) {
            if (t === 0) return hf(e.nextSibling);
            t--;
          } else (n !== `$` && n !== `$!` && n !== `$?` && n !== `$~` && n !== `&`) || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function vf(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `$` || n === `$!` || n === `$?` || n === `$~` || n === `&`) {
            if (t === 0) return e;
            t--;
          } else (n !== `/$` && n !== `/&`) || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function yf(e, t, n) {
      switch (((t = qd(n)), e)) {
        case `html`:
          if (((e = t.documentElement), !e)) throw Error(i(452));
          return e;
        case `head`:
          if (((e = t.head), !e)) throw Error(i(453));
          return e;
        case `body`:
          if (((e = t.body), !e)) throw Error(i(454));
          return e;
        default:
          throw Error(i(451));
      }
    }
    function bf(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      xt(e);
    }
    var xf = new Map(),
      Sf = new Set();
    function Cf(e) {
      return typeof e.getRootNode == `function`
        ? e.getRootNode()
        : e.nodeType === 9
          ? e
          : e.ownerDocument;
    }
    var wf = O.d;
    O.d = { f: Tf, r: Ef, D: kf, C: Af, L: jf, m: Mf, X: Pf, S: Nf, M: Ff };
    function Tf() {
      var e = wf.f(),
        t = Eu();
      return e || t;
    }
    function Ef(e) {
      var t = Ct(e);
      t !== null && t.tag === 5 && t.type === `form` ? ks(t) : wf.r(e);
    }
    var Df = typeof document > `u` ? null : document;
    function Of(e, t, n) {
      var r = Df;
      if (r && typeof t == `string` && t) {
        var i = Gt(t);
        (i = `link[rel="` + e + `"][href="` + i + `"]`),
          typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
          Sf.has(i) ||
            (Sf.add(i),
            (e = { rel: e, crossOrigin: n, href: t }),
            r.querySelector(i) === null &&
              ((t = r.createElement(`link`)), Vd(t, `link`, e), Et(t), r.head.appendChild(t)));
      }
    }
    function kf(e) {
      wf.D(e), Of(`dns-prefetch`, e, null);
    }
    function Af(e, t) {
      wf.C(e, t), Of(`preconnect`, e, t);
    }
    function jf(e, t, n) {
      wf.L(e, t, n);
      var r = Df;
      if (r && e && t) {
        var i = `link[rel="preload"][as="` + Gt(t) + `"]`;
        t === `image` && n && n.imageSrcSet
          ? ((i += `[imagesrcset="` + Gt(n.imageSrcSet) + `"]`),
            typeof n.imageSizes == `string` && (i += `[imagesizes="` + Gt(n.imageSizes) + `"]`))
          : (i += `[href="` + Gt(e) + `"]`);
        var a = i;
        switch (t) {
          case `style`:
            a = Lf(e);
            break;
          case `script`:
            a = Vf(e);
        }
        xf.has(a) ||
          ((e = m(
            { rel: `preload`, href: t === `image` && n && n.imageSrcSet ? void 0 : e, as: t },
            n,
          )),
          xf.set(a, e),
          r.querySelector(i) !== null ||
            (t === `style` && r.querySelector(Rf(a))) ||
            (t === `script` && r.querySelector(Hf(a))) ||
            ((t = r.createElement(`link`)), Vd(t, `link`, e), Et(t), r.head.appendChild(t)));
      }
    }
    function Mf(e, t) {
      wf.m(e, t);
      var n = Df;
      if (n && e) {
        var r = t && typeof t.as == `string` ? t.as : `script`,
          i = `link[rel="modulepreload"][as="` + Gt(r) + `"][href="` + Gt(e) + `"]`,
          a = i;
        switch (r) {
          case `audioworklet`:
          case `paintworklet`:
          case `serviceworker`:
          case `sharedworker`:
          case `worker`:
          case `script`:
            a = Vf(e);
        }
        if (
          !xf.has(a) &&
          ((e = m({ rel: `modulepreload`, href: e }, t)), xf.set(a, e), n.querySelector(i) === null)
        ) {
          switch (r) {
            case `audioworklet`:
            case `paintworklet`:
            case `serviceworker`:
            case `sharedworker`:
            case `worker`:
            case `script`:
              if (n.querySelector(Hf(a))) return;
          }
          (r = n.createElement(`link`)), Vd(r, `link`, e), Et(r), n.head.appendChild(r);
        }
      }
    }
    function Nf(e, t, n) {
      wf.S(e, t, n);
      var r = Df;
      if (r && e) {
        var i = Tt(r).hoistableStyles,
          a = Lf(e);
        t ||= `default`;
        var o = i.get(a);
        if (!o) {
          var s = { loading: 0, preload: null };
          if ((o = r.querySelector(Rf(a)))) s.loading = 5;
          else {
            (e = m({ rel: `stylesheet`, href: e, "data-precedence": t }, n)),
              (n = xf.get(a)) && Gf(e, n);
            var c = (o = r.createElement(`link`));
            Et(c),
              Vd(c, `link`, e),
              (c._p = new Promise(function (e, t) {
                (c.onload = e), (c.onerror = t);
              })),
              c.addEventListener(`load`, function () {
                s.loading |= 1;
              }),
              c.addEventListener(`error`, function () {
                s.loading |= 2;
              }),
              (s.loading |= 4),
              Wf(o, t, r);
          }
          (o = { type: `stylesheet`, instance: o, count: 1, state: s }), i.set(a, o);
        }
      }
    }
    function Pf(e, t) {
      wf.X(e, t);
      var n = Df;
      if (n && e) {
        var r = Tt(n).hoistableScripts,
          i = Vf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Hf(i))),
          a ||
            ((e = m({ src: e, async: !0 }, t)),
            (t = xf.get(i)) && Kf(e, t),
            (a = n.createElement(`script`)),
            Et(a),
            Vd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function Ff(e, t) {
      wf.M(e, t);
      var n = Df;
      if (n && e) {
        var r = Tt(n).hoistableScripts,
          i = Vf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Hf(i))),
          a ||
            ((e = m({ src: e, async: !0, type: `module` }, t)),
            (t = xf.get(i)) && Kf(e, t),
            (a = n.createElement(`script`)),
            Et(a),
            Vd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function If(e, t, n, r) {
      var a = (a = he.current) ? Cf(a) : null;
      if (!a) throw Error(i(446));
      switch (e) {
        case `meta`:
        case `title`:
          return null;
        case `style`:
          return typeof n.precedence == `string` && typeof n.href == `string`
            ? ((t = Lf(n.href)),
              (n = Tt(a).hoistableStyles),
              (r = n.get(t)),
              r || ((r = { type: `style`, instance: null, count: 0, state: null }), n.set(t, r)),
              r)
            : { type: `void`, instance: null, count: 0, state: null };
        case `link`:
          if (
            n.rel === `stylesheet` &&
            typeof n.href == `string` &&
            typeof n.precedence == `string`
          ) {
            e = Lf(n.href);
            var o = Tt(a).hoistableStyles,
              s = o.get(e);
            if (
              (s ||
                ((a = a.ownerDocument || a),
                (s = {
                  type: `stylesheet`,
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                o.set(e, s),
                (o = a.querySelector(Rf(e))) && !o._p && ((s.instance = o), (s.state.loading = 5)),
                xf.has(e) ||
                  ((n = {
                    rel: `preload`,
                    as: `style`,
                    href: n.href,
                    crossOrigin: n.crossOrigin,
                    integrity: n.integrity,
                    media: n.media,
                    hrefLang: n.hrefLang,
                    referrerPolicy: n.referrerPolicy,
                  }),
                  xf.set(e, n),
                  o || Bf(a, e, n, s.state))),
              t && r === null)
            )
              throw Error(i(528, ``));
            return s;
          }
          if (t && r !== null) throw Error(i(529, ``));
          return null;
        case `script`:
          return (
            (t = n.async),
            (n = n.src),
            typeof n == `string` && t && typeof t != `function` && typeof t != `symbol`
              ? ((t = Vf(n)),
                (n = Tt(a).hoistableScripts),
                (r = n.get(t)),
                r || ((r = { type: `script`, instance: null, count: 0, state: null }), n.set(t, r)),
                r)
              : { type: `void`, instance: null, count: 0, state: null }
          );
        default:
          throw Error(i(444, e));
      }
    }
    function Lf(e) {
      return `href="` + Gt(e) + `"`;
    }
    function Rf(e) {
      return `link[rel="stylesheet"][` + e + `]`;
    }
    function zf(e) {
      return m({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function Bf(e, t, n, r) {
      e.querySelector(`link[rel="preload"][as="style"][` + t + `]`)
        ? (r.loading = 1)
        : ((t = e.createElement(`link`)),
          (r.preload = t),
          t.addEventListener(`load`, function () {
            return (r.loading |= 1);
          }),
          t.addEventListener(`error`, function () {
            return (r.loading |= 2);
          }),
          Vd(t, `link`, n),
          Et(t),
          e.head.appendChild(t));
    }
    function Vf(e) {
      return `[src="` + Gt(e) + `"]`;
    }
    function Hf(e) {
      return `script[async]` + e;
    }
    function Uf(e, t, n) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case `style`:
            var r = e.querySelector(`style[data-href~="` + Gt(n.href) + `"]`);
            if (r) return (t.instance = r), Et(r), r;
            var a = m({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null,
            });
            return (
              (r = (e.ownerDocument || e).createElement(`style`)),
              Et(r),
              Vd(r, `style`, a),
              Wf(r, n.precedence, e),
              (t.instance = r)
            );
          case `stylesheet`:
            a = Lf(n.href);
            var o = e.querySelector(Rf(a));
            if (o) return (t.state.loading |= 4), (t.instance = o), Et(o), o;
            (r = zf(n)),
              (a = xf.get(a)) && Gf(r, a),
              (o = (e.ownerDocument || e).createElement(`link`)),
              Et(o);
            var s = o;
            return (
              (s._p = new Promise(function (e, t) {
                (s.onload = e), (s.onerror = t);
              })),
              Vd(o, `link`, r),
              (t.state.loading |= 4),
              Wf(o, n.precedence, e),
              (t.instance = o)
            );
          case `script`:
            return (
              (o = Vf(n.src)),
              (a = e.querySelector(Hf(o)))
                ? ((t.instance = a), Et(a), a)
                : ((r = n),
                  (a = xf.get(o)) && ((r = m({}, n)), Kf(r, a)),
                  (e = e.ownerDocument || e),
                  (a = e.createElement(`script`)),
                  Et(a),
                  Vd(a, `link`, r),
                  e.head.appendChild(a),
                  (t.instance = a))
            );
          case `void`:
            return null;
          default:
            throw Error(i(443, t.type));
        }
      else
        t.type === `stylesheet` &&
          !(t.state.loading & 4) &&
          ((r = t.instance), (t.state.loading |= 4), Wf(r, n.precedence, e));
      return t.instance;
    }
    function Wf(e, t, n) {
      for (
        var r = n.querySelectorAll(
            `link[rel="stylesheet"][data-precedence],style[data-precedence]`,
          ),
          i = r.length ? r[r.length - 1] : null,
          a = i,
          o = 0;
        o < r.length;
        o++
      ) {
        var s = r[o];
        if (s.dataset.precedence === t) a = s;
        else if (a !== i) break;
      }
      a
        ? a.parentNode.insertBefore(e, a.nextSibling)
        : ((t = n.nodeType === 9 ? n.head : n), t.insertBefore(e, t.firstChild));
    }
    function Gf(e, t) {
      (e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.title ??= t.title);
    }
    function Kf(e, t) {
      (e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.integrity ??= t.integrity);
    }
    var qf = null;
    function Jf(e, t, n) {
      if (qf === null) {
        var r = new Map(),
          i = (qf = new Map());
        i.set(n, r);
      } else (i = qf), (r = i.get(n)), r || ((r = new Map()), i.set(n, r));
      if (r.has(e)) return r;
      for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
        var a = n[i];
        if (
          !(a[bt] || a[pt] || (e === `link` && a.getAttribute(`rel`) === `stylesheet`)) &&
          a.namespaceURI !== `http://www.w3.org/2000/svg`
        ) {
          var o = a.getAttribute(t) || ``;
          o = e + o;
          var s = r.get(o);
          s ? s.push(a) : r.set(o, [a]);
        }
      }
      return r;
    }
    function Yf(e, t, n) {
      (e = e.ownerDocument || e),
        e.head.insertBefore(n, t === `title` ? e.querySelector(`head > title`) : null);
    }
    function Xf(e, t, n) {
      if (n === 1 || t.itemProp != null) return !1;
      switch (e) {
        case `meta`:
        case `title`:
          return !0;
        case `style`:
          if (typeof t.precedence != `string` || typeof t.href != `string` || t.href === ``) break;
          return !0;
        case `link`:
          if (
            typeof t.rel != `string` ||
            typeof t.href != `string` ||
            t.href === `` ||
            t.onLoad ||
            t.onError
          )
            break;
          switch (t.rel) {
            case `stylesheet`:
              return (e = t.disabled), typeof t.precedence == `string` && e == null;
            default:
              return !0;
          }
        case `script`:
          if (
            t.async &&
            typeof t.async != `function` &&
            typeof t.async != `symbol` &&
            !t.onLoad &&
            !t.onError &&
            t.src &&
            typeof t.src == `string`
          )
            return !0;
      }
      return !1;
    }
    function Zf(e) {
      return !(e.type === `stylesheet` && !(e.state.loading & 3));
    }
    function Qf(e, t, n, r) {
      if (
        n.type === `stylesheet` &&
        (typeof r.media != `string` || !1 !== matchMedia(r.media).matches) &&
        !(n.state.loading & 4)
      ) {
        if (n.instance === null) {
          var i = Lf(r.href),
            a = t.querySelector(Rf(i));
          if (a) {
            (t = a._p),
              typeof t == `object` &&
                t &&
                typeof t.then == `function` &&
                (e.count++, (e = tp.bind(e)), t.then(e, e)),
              (n.state.loading |= 4),
              (n.instance = a),
              Et(a);
            return;
          }
          (a = t.ownerDocument || t),
            (r = zf(r)),
            (i = xf.get(i)) && Gf(r, i),
            (a = a.createElement(`link`)),
            Et(a);
          var o = a;
          (o._p = new Promise(function (e, t) {
            (o.onload = e), (o.onerror = t);
          })),
            Vd(a, `link`, r),
            (n.instance = a);
        }
        e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(n, t),
          (t = n.state.preload) &&
            !(n.state.loading & 3) &&
            (e.count++,
            (n = tp.bind(e)),
            t.addEventListener(`load`, n),
            t.addEventListener(`error`, n));
      }
    }
    var $f = 0;
    function ep(e, t) {
      return (
        e.stylesheets && e.count === 0 && rp(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (n) {
              var r = setTimeout(function () {
                if ((e.stylesheets && rp(e, e.stylesheets), e.unsuspend)) {
                  var t = e.unsuspend;
                  (e.unsuspend = null), t();
                }
              }, 6e4 + t);
              0 < e.imgBytes && $f === 0 && ($f = 62500 * Wd());
              var i = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 && (e.stylesheets && rp(e, e.stylesheets), e.unsuspend))
                  ) {
                    var t = e.unsuspend;
                    (e.unsuspend = null), t();
                  }
                },
                (e.imgBytes > $f ? 50 : 800) + t,
              );
              return (
                (e.unsuspend = n),
                function () {
                  (e.unsuspend = null), clearTimeout(r), clearTimeout(i);
                }
              );
            }
          : null
      );
    }
    function tp() {
      if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
        if (this.stylesheets) rp(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          (this.unsuspend = null), e();
        }
      }
    }
    var np = null;
    function rp(e, t) {
      (e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++, (np = new Map()), t.forEach(ip, e), (np = null), tp.call(e));
    }
    function ip(e, t) {
      if (!(t.state.loading & 4)) {
        var n = np.get(e);
        if (n) var r = n.get(null);
        else {
          (n = new Map()), np.set(e, n);
          for (
            var i = e.querySelectorAll(`link[data-precedence],style[data-precedence]`), a = 0;
            a < i.length;
            a++
          ) {
            var o = i[a];
            (o.nodeName === `LINK` || o.getAttribute(`media`) !== `not all`) &&
              (n.set(o.dataset.precedence, o), (r = o));
          }
          r && n.set(null, r);
        }
        (i = t.instance),
          (o = i.getAttribute(`data-precedence`)),
          (a = n.get(o) || r),
          a === r && n.set(null, i),
          n.set(o, i),
          this.count++,
          (r = tp.bind(this)),
          i.addEventListener(`load`, r),
          i.addEventListener(`error`, r),
          a
            ? a.parentNode.insertBefore(i, a.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(i, e.firstChild)),
          (t.state.loading |= 4);
      }
    }
    var ap = {
      $$typeof: C,
      Provider: null,
      Consumer: null,
      _currentValue: le,
      _currentValue2: le,
      _threadCount: 0,
    };
    function op(e, t, n, r, i, a, o, s, c) {
      (this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = nt(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = nt(0)),
        (this.hiddenUpdates = nt(null)),
        (this.identifierPrefix = r),
        (this.onUncaughtError = i),
        (this.onCaughtError = a),
        (this.onRecoverableError = o),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = c),
        (this.incompleteTransitions = new Map());
    }
    function sp(e, t, n, r, i, a, o, s, c, l, u, d) {
      return (
        (e = new op(e, t, n, o, c, l, u, d, s)),
        (t = 1),
        !0 === a && (t |= 24),
        (a = mi(3, null, null, t)),
        (e.current = a),
        (a.stateNode = e),
        (t = ma()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
        Wa(a),
        e
      );
    }
    function cp(e) {
      return e ? ((e = fi), e) : fi;
    }
    function lp(e, t, n, r, i, a) {
      (i = cp(i)),
        r.context === null ? (r.context = i) : (r.pendingContext = i),
        (r = Ka(t)),
        (r.payload = { element: n }),
        (a = a === void 0 ? null : a),
        a !== null && (r.callback = a),
        (n = qa(e, r, t)),
        n !== null && (xu(n, e, t), Ja(n, e, t));
    }
    function up(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
      }
    }
    function dp(e, t) {
      up(e, t), (e = e.alternate) && up(e, t);
    }
    function fp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = li(e, 67108864);
        t !== null && xu(t, e, 67108864), dp(e, 67108864);
      }
    }
    function pp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = yu();
        t = ct(t);
        var n = li(e, t);
        n !== null && xu(n, e, t), dp(e, t);
      }
    }
    var mp = !0;
    function hp(e, t, n, r) {
      var i = D.T;
      D.T = null;
      var a = O.p;
      try {
        (O.p = 2), _p(e, t, n, r);
      } finally {
        (O.p = a), (D.T = i);
      }
    }
    function gp(e, t, n, r) {
      var i = D.T;
      D.T = null;
      var a = O.p;
      try {
        (O.p = 8), _p(e, t, n, r);
      } finally {
        (O.p = a), (D.T = i);
      }
    }
    function _p(e, t, n, r) {
      if (mp) {
        var i = vp(r);
        if (i === null) Ad(e, t, r, yp, n), Ap(e, r);
        else if (Mp(i, e, t, n, r)) r.stopPropagation();
        else if ((Ap(e, r), t & 4 && -1 < kp.indexOf(e))) {
          for (; i !== null; ) {
            var a = Ct(i);
            if (a !== null)
              switch (a.tag) {
                case 3:
                  if (((a = a.stateNode), a.current.memoizedState.isDehydrated)) {
                    var o = Ze(a.pendingLanes);
                    if (o !== 0) {
                      var s = a;
                      for (s.pendingLanes |= 2, s.entangledLanes |= 2; o; ) {
                        var c = 1 << (31 - We(o));
                        (s.entanglements[1] |= c), (o &= ~c);
                      }
                      ld(a), !(V & 6) && ((su = Me() + 500), ud(0, !1));
                    }
                  }
                  break;
                case 31:
                case 13:
                  (s = li(a, 2)), s !== null && xu(s, a, 2), Eu(), dp(a, 2);
              }
            if (((a = vp(r)), a === null && Ad(e, t, r, yp, n), a === i)) break;
            i = a;
          }
          i !== null && r.stopPropagation();
        } else Ad(e, t, r, null, n);
      }
    }
    function vp(e) {
      return (e = cn(e)), bp(e);
    }
    var yp = null;
    function bp(e) {
      if (((yp = null), (e = St(e)), e !== null)) {
        var t = o(e);
        if (t === null) e = null;
        else {
          var n = t.tag;
          if (n === 13) {
            if (((e = s(t)), e !== null)) return e;
            e = null;
          } else if (n === 31) {
            if (((e = c(t)), e !== null)) return e;
            e = null;
          } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return (yp = e), null;
    }
    function xp(e) {
      switch (e) {
        case `beforetoggle`:
        case `cancel`:
        case `click`:
        case `close`:
        case `contextmenu`:
        case `copy`:
        case `cut`:
        case `auxclick`:
        case `dblclick`:
        case `dragend`:
        case `dragstart`:
        case `drop`:
        case `focusin`:
        case `focusout`:
        case `input`:
        case `invalid`:
        case `keydown`:
        case `keypress`:
        case `keyup`:
        case `mousedown`:
        case `mouseup`:
        case `paste`:
        case `pause`:
        case `play`:
        case `pointercancel`:
        case `pointerdown`:
        case `pointerup`:
        case `ratechange`:
        case `reset`:
        case `resize`:
        case `seeked`:
        case `submit`:
        case `toggle`:
        case `touchcancel`:
        case `touchend`:
        case `touchstart`:
        case `volumechange`:
        case `change`:
        case `selectionchange`:
        case `textInput`:
        case `compositionstart`:
        case `compositionend`:
        case `compositionupdate`:
        case `beforeblur`:
        case `afterblur`:
        case `beforeinput`:
        case `blur`:
        case `fullscreenchange`:
        case `focus`:
        case `hashchange`:
        case `popstate`:
        case `select`:
        case `selectstart`:
          return 2;
        case `drag`:
        case `dragenter`:
        case `dragexit`:
        case `dragleave`:
        case `dragover`:
        case `mousemove`:
        case `mouseout`:
        case `mouseover`:
        case `pointermove`:
        case `pointerout`:
        case `pointerover`:
        case `scroll`:
        case `touchmove`:
        case `wheel`:
        case `mouseenter`:
        case `mouseleave`:
        case `pointerenter`:
        case `pointerleave`:
          return 8;
        case `message`:
          switch (Ne()) {
            case Pe:
              return 2;
            case Fe:
              return 8;
            case Ie:
            case Le:
              return 32;
            case Re:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Sp = !1,
      Cp = null,
      wp = null,
      Tp = null,
      Ep = new Map(),
      Dp = new Map(),
      Op = [],
      kp =
        `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
          ` `,
        );
    function Ap(e, t) {
      switch (e) {
        case `focusin`:
        case `focusout`:
          Cp = null;
          break;
        case `dragenter`:
        case `dragleave`:
          wp = null;
          break;
        case `mouseover`:
        case `mouseout`:
          Tp = null;
          break;
        case `pointerover`:
        case `pointerout`:
          Ep.delete(t.pointerId);
          break;
        case `gotpointercapture`:
        case `lostpointercapture`:
          Dp.delete(t.pointerId);
      }
    }
    function jp(e, t, n, r, i, a) {
      return e === null || e.nativeEvent !== a
        ? ((e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: a,
            targetContainers: [i],
          }),
          t !== null && ((t = Ct(t)), t !== null && fp(t)),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          i !== null && t.indexOf(i) === -1 && t.push(i),
          e);
    }
    function Mp(e, t, n, r, i) {
      switch (t) {
        case `focusin`:
          return (Cp = jp(Cp, e, t, n, r, i)), !0;
        case `dragenter`:
          return (wp = jp(wp, e, t, n, r, i)), !0;
        case `mouseover`:
          return (Tp = jp(Tp, e, t, n, r, i)), !0;
        case `pointerover`:
          var a = i.pointerId;
          return Ep.set(a, jp(Ep.get(a) || null, e, t, n, r, i)), !0;
        case `gotpointercapture`:
          return (a = i.pointerId), Dp.set(a, jp(Dp.get(a) || null, e, t, n, r, i)), !0;
      }
      return !1;
    }
    function Np(e) {
      var t = St(e.target);
      if (t !== null) {
        var n = o(t);
        if (n !== null) {
          if (((t = n.tag), t === 13)) {
            if (((t = s(n)), t !== null)) {
              (e.blockedOn = t),
                dt(e.priority, function () {
                  pp(n);
                });
              return;
            }
          } else if (t === 31) {
            if (((t = c(n)), t !== null)) {
              (e.blockedOn = t),
                dt(e.priority, function () {
                  pp(n);
                });
              return;
            }
          } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function Pp(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var n = vp(e.nativeEvent);
        if (n === null) {
          n = e.nativeEvent;
          var r = new n.constructor(n.type, n);
          (sn = r), n.target.dispatchEvent(r), (sn = null);
        } else return (t = Ct(n)), t !== null && fp(t), (e.blockedOn = n), !1;
        t.shift();
      }
      return !0;
    }
    function Fp(e, t, n) {
      Pp(e) && n.delete(t);
    }
    function Ip() {
      (Sp = !1),
        Cp !== null && Pp(Cp) && (Cp = null),
        wp !== null && Pp(wp) && (wp = null),
        Tp !== null && Pp(Tp) && (Tp = null),
        Ep.forEach(Fp),
        Dp.forEach(Fp);
    }
    function Lp(e, n) {
      e.blockedOn === n &&
        ((e.blockedOn = null),
        Sp || ((Sp = !0), t.unstable_scheduleCallback(t.unstable_NormalPriority, Ip)));
    }
    var Rp = null;
    function zp(e) {
      Rp !== e &&
        ((Rp = e),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
          Rp === e && (Rp = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t],
              r = e[t + 1],
              i = e[t + 2];
            if (typeof r != `function`) {
              if (bp(r || n) === null) continue;
              break;
            }
            var a = Ct(n);
            a !== null &&
              (e.splice(t, 3),
              (t -= 3),
              Ds(a, { pending: !0, data: i, method: n.method, action: r }, r, i));
          }
        }));
    }
    function Bp(e) {
      function t(t) {
        return Lp(t, e);
      }
      Cp !== null && Lp(Cp, e),
        wp !== null && Lp(wp, e),
        Tp !== null && Lp(Tp, e),
        Ep.forEach(t),
        Dp.forEach(t);
      for (var n = 0; n < Op.length; n++) {
        var r = Op[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
      for (; 0 < Op.length && ((n = Op[0]), n.blockedOn === null); )
        Np(n), n.blockedOn === null && Op.shift();
      if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
        for (r = 0; r < n.length; r += 3) {
          var i = n[r],
            a = n[r + 1],
            o = i[mt] || null;
          if (typeof a == `function`) o || zp(n);
          else if (o) {
            var s = null;
            if (a && a.hasAttribute(`formAction`)) {
              if (((i = a), (o = a[mt] || null))) s = o.formAction;
              else if (bp(i) !== null) continue;
            } else s = o.action;
            typeof s == `function` ? (n[r + 1] = s) : (n.splice(r, 3), (r -= 3)), zp(n);
          }
        }
    }
    function Vp() {
      function e(e) {
        e.canIntercept &&
          e.info === `react-transition` &&
          e.intercept({
            handler: function () {
              return new Promise(function (e) {
                return (i = e);
              });
            },
            focusReset: `manual`,
            scroll: `manual`,
          });
      }
      function t() {
        i !== null && (i(), (i = null)), r || setTimeout(n, 20);
      }
      function n() {
        if (!r && !navigation.transition) {
          var e = navigation.currentEntry;
          e &&
            e.url != null &&
            navigation.navigate(e.url, {
              state: e.getState(),
              info: `react-transition`,
              history: `replace`,
            });
        }
      }
      if (typeof navigation == `object`) {
        var r = !1,
          i = null;
        return (
          navigation.addEventListener(`navigate`, e),
          navigation.addEventListener(`navigatesuccess`, t),
          navigation.addEventListener(`navigateerror`, t),
          setTimeout(n, 100),
          function () {
            (r = !0),
              navigation.removeEventListener(`navigate`, e),
              navigation.removeEventListener(`navigatesuccess`, t),
              navigation.removeEventListener(`navigateerror`, t),
              i !== null && (i(), (i = null));
          }
        );
      }
    }
    function Hp(e) {
      this._internalRoot = e;
    }
    (Up.prototype.render = Hp.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (t === null) throw Error(i(409));
        var n = t.current;
        lp(n, yu(), e, t, null, null);
      }),
      (Up.prototype.unmount = Hp.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            lp(e.current, 2, null, e, null, null), Eu(), (t[ht] = null);
          }
        });
    function Up(e) {
      this._internalRoot = e;
    }
    Up.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = ut();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < Op.length && t !== 0 && t < Op[n].priority; n++);
        Op.splice(n, 0, e), n === 0 && Np(e);
      }
    };
    var Wp = n.version;
    if (Wp !== `19.2.3`) throw Error(i(527, Wp, `19.2.3`));
    O.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == `function`
          ? Error(i(188))
          : ((e = Object.keys(e).join(`,`)), Error(i(268, e)));
      return (e = u(t)), (e = e === null ? null : f(e)), (e = e === null ? null : e.stateNode), e;
    };
    var Gp = {
      bundleType: 0,
      version: `19.2.3`,
      rendererPackageName: `react-dom`,
      currentDispatcherRef: D,
      reconcilerVersion: `19.2.3`,
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
      var Kp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Kp.isDisabled && Kp.supportsFiber)
        try {
          (Ve = Kp.inject(Gp)), (He = Kp);
        } catch {}
    }
    e.createRoot = function (e, t) {
      if (!a(e)) throw Error(i(299));
      var n = !1,
        r = ``,
        o = Xs,
        s = Zs,
        c = Qs;
      return (
        t != null &&
          (!0 === t.unstable_strictMode && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
          t.onCaughtError !== void 0 && (s = t.onCaughtError),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = sp(e, 1, !1, null, null, n, r, null, o, s, c, Vp)),
        (e[ht] = t.current),
        Od(e),
        new Hp(t)
      );
    };
  }),
  _ = o((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    n(), (t.exports = g());
  }),
  v = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`);
    function r(e, n, r) {
      var i = null;
      if ((r !== void 0 && (i = `` + r), n.key !== void 0 && (i = `` + n.key), `key` in n))
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
      else r = n;
      return (n = r.ref), { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r };
    }
    (e.Fragment = n), (e.jsx = r), (e.jsxs = r);
  }),
  y = o((e, t) => {
    t.exports = v();
  }),
  b = _(),
  x = l(p(), 1),
  S = y();
function C({ onSubmit: e, isGenerating: t }) {
  let [n, r] = (0, x.useState)(``);
  return (0, S.jsxs)(`form`, {
    onSubmit: (i) => {
      i.preventDefault(), !(!n.trim() || t) && (e(n.trim()), r(``));
    },
    style: { display: `flex`, gap: 8 },
    children: [
      (0, S.jsx)(`input`, {
        type: `text`,
        value: n,
        onChange: (e) => r(e.target.value),
        placeholder: `UI를 설명해주세요... (예: 회원가입 폼 만들어줘)`,
        disabled: t,
        style: {
          flex: 1,
          padding: `12px 16px`,
          borderRadius: 12,
          border: `1px solid #e0e0e0`,
          fontSize: 15,
          outline: `none`,
        },
      }),
      (0, S.jsx)(`button`, {
        type: `submit`,
        disabled: t || !n.trim(),
        style: {
          padding: `12px 24px`,
          borderRadius: 12,
          border: `none`,
          background: t ? `#ccc` : `#FF6F0F`,
          color: `white`,
          fontSize: 15,
          fontWeight: 600,
          cursor: t ? `not-allowed` : `pointer`,
        },
        children: t ? `생성 중...` : `생성`,
      }),
    ],
  });
}
Object.freeze({ status: `aborted` });
function w(e, t, n) {
  function r(n, r) {
    if (
      (n._zod ||
        Object.defineProperty(n, `_zod`, {
          value: { def: r, constr: o, traits: new Set() },
          enumerable: !1,
        }),
      n._zod.traits.has(e))
    )
      return;
    n._zod.traits.add(e), t(n, r);
    let i = o.prototype,
      a = Object.keys(i);
    for (let e = 0; e < a.length; e++) {
      let t = a[e];
      t in n || (n[t] = i[t].bind(n));
    }
  }
  let i = n?.Parent ?? Object;
  class a extends i {}
  Object.defineProperty(a, `name`, { value: e });
  function o(e) {
    var t;
    let i = n?.Parent ? new a() : this;
    r(i, e), (t = i._zod).deferred ?? (t.deferred = []);
    for (let e of i._zod.deferred) e();
    return i;
  }
  return (
    Object.defineProperty(o, `init`, { value: r }),
    Object.defineProperty(o, Symbol.hasInstance, {
      value: (t) => (n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e)),
    }),
    Object.defineProperty(o, `name`, { value: e }),
    o
  );
}
var ee = class extends Error {
    constructor() {
      super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
  },
  T = class extends Error {
    constructor(e) {
      super(`Encountered unidirectional transform during encode: ${e}`),
        (this.name = `ZodEncodeError`);
    }
  },
  te = {};
function E(e) {
  return e && Object.assign(te, e), te;
}
function ne(e) {
  let t = Object.values(e).filter((e) => typeof e == `number`);
  return Object.entries(e)
    .filter(([e, n]) => t.indexOf(+e) === -1)
    .map(([e, t]) => t);
}
function re(e, t) {
  return typeof t == `bigint` ? t.toString() : t;
}
function ie(e) {
  return {
    get value() {
      {
        let t = e();
        return Object.defineProperty(this, `value`, { value: t }), t;
      }
      throw Error(`cached value already set`);
    },
  };
}
function ae(e) {
  return e == null;
}
function oe(e) {
  let t = e.startsWith(`^`) ? 1 : 0,
    n = e.endsWith(`$`) ? e.length - 1 : e.length;
  return e.slice(t, n);
}
function se(e, t) {
  let n = (e.toString().split(`.`)[1] || ``).length,
    r = t.toString(),
    i = (r.split(`.`)[1] || ``).length;
  if (i === 0 && /\d?e-\d?/.test(r)) {
    let e = r.match(/\d?e-(\d?)/);
    e?.[1] && (i = Number.parseInt(e[1]));
  }
  let a = n > i ? n : i;
  return (
    (Number.parseInt(e.toFixed(a).replace(`.`, ``)) %
      Number.parseInt(t.toFixed(a).replace(`.`, ``))) /
    10 ** a
  );
}
var ce = Symbol(`evaluating`);
function D(e, t, n) {
  let r;
  Object.defineProperty(e, t, {
    get() {
      if (r !== ce) return r === void 0 && ((r = ce), (r = n())), r;
    },
    set(n) {
      Object.defineProperty(e, t, { value: n });
    },
    configurable: !0,
  });
}
function O(e, t, n) {
  Object.defineProperty(e, t, { value: n, writable: !0, enumerable: !0, configurable: !0 });
}
function le(...e) {
  let t = {};
  for (let n of e) Object.assign(t, Object.getOwnPropertyDescriptors(n));
  return Object.defineProperties({}, t);
}
function ue(e) {
  return JSON.stringify(e);
}
function de(e) {
  return e
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ``)
    .replace(/[\s_-]+/g, `-`)
    .replace(/^-+|-+$/g, ``);
}
var fe = `captureStackTrace` in Error ? Error.captureStackTrace : (...e) => {};
function k(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
var A = ie(() => {
  if (typeof navigator < `u` && navigator?.userAgent?.includes(`Cloudflare`)) return !1;
  try {
    return Function(``), !0;
  } catch {
    return !1;
  }
});
function pe(e) {
  if (k(e) === !1) return !1;
  let t = e.constructor;
  if (t === void 0 || typeof t != `function`) return !0;
  let n = t.prototype;
  return !(k(n) === !1 || Object.prototype.hasOwnProperty.call(n, `isPrototypeOf`) === !1);
}
function me(e) {
  return pe(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
var he = new Set([`string`, `number`, `symbol`]);
function ge(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
function _e(e, t, n) {
  let r = new e._zod.constr(t ?? e._zod.def);
  return (!t || n?.parent) && (r._zod.parent = e), r;
}
function j(e) {
  let t = e;
  if (!t) return {};
  if (typeof t == `string`) return { error: () => t };
  if (t?.message !== void 0) {
    if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == `string` ? { ...t, error: () => t.error } : t;
}
function ve(e) {
  return Object.keys(e).filter(
    (t) => e[t]._zod.optin === `optional` && e[t]._zod.optout === `optional`,
  );
}
var ye = {
  safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};
function be(e, t) {
  let n = e._zod.def,
    r = n.checks;
  if (r && r.length > 0)
    throw Error(`.pick() cannot be used on object schemas containing refinements`);
  return _e(
    e,
    le(e._zod.def, {
      get shape() {
        let e = {};
        for (let r in t) {
          if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
          t[r] && (e[r] = n.shape[r]);
        }
        return O(this, `shape`, e), e;
      },
      checks: [],
    }),
  );
}
function xe(e, t) {
  let n = e._zod.def,
    r = n.checks;
  if (r && r.length > 0)
    throw Error(`.omit() cannot be used on object schemas containing refinements`);
  return _e(
    e,
    le(e._zod.def, {
      get shape() {
        let r = { ...e._zod.def.shape };
        for (let e in t) {
          if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
          t[e] && delete r[e];
        }
        return O(this, `shape`, r), r;
      },
      checks: [],
    }),
  );
}
function Se(e, t) {
  if (!pe(t)) throw Error(`Invalid input to extend: expected a plain object`);
  let n = e._zod.def.checks;
  if (n && n.length > 0) {
    let n = e._zod.def.shape;
    for (let e in t)
      if (Object.getOwnPropertyDescriptor(n, e) !== void 0)
        throw Error(
          "Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.",
        );
  }
  return _e(
    e,
    le(e._zod.def, {
      get shape() {
        let n = { ...e._zod.def.shape, ...t };
        return O(this, `shape`, n), n;
      },
    }),
  );
}
function Ce(e, t) {
  if (!pe(t)) throw Error(`Invalid input to safeExtend: expected a plain object`);
  return _e(
    e,
    le(e._zod.def, {
      get shape() {
        let n = { ...e._zod.def.shape, ...t };
        return O(this, `shape`, n), n;
      },
    }),
  );
}
function we(e, t) {
  return _e(
    e,
    le(e._zod.def, {
      get shape() {
        let n = { ...e._zod.def.shape, ...t._zod.def.shape };
        return O(this, `shape`, n), n;
      },
      get catchall() {
        return t._zod.def.catchall;
      },
      checks: [],
    }),
  );
}
function Te(e, t, n) {
  let r = t._zod.def.checks;
  if (r && r.length > 0)
    throw Error(`.partial() cannot be used on object schemas containing refinements`);
  return _e(
    t,
    le(t._zod.def, {
      get shape() {
        let r = t._zod.def.shape,
          i = { ...r };
        if (n)
          for (let t in n) {
            if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
            n[t] && (i[t] = e ? new e({ type: `optional`, innerType: r[t] }) : r[t]);
          }
        else for (let t in r) i[t] = e ? new e({ type: `optional`, innerType: r[t] }) : r[t];
        return O(this, `shape`, i), i;
      },
      checks: [],
    }),
  );
}
function Ee(e, t, n) {
  return _e(
    t,
    le(t._zod.def, {
      get shape() {
        let r = t._zod.def.shape,
          i = { ...r };
        if (n)
          for (let t in n) {
            if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
            n[t] && (i[t] = new e({ type: `nonoptional`, innerType: r[t] }));
          }
        else for (let t in r) i[t] = new e({ type: `nonoptional`, innerType: r[t] });
        return O(this, `shape`, i), i;
      },
    }),
  );
}
function De(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
  return !1;
}
function Oe(e, t) {
  return t.map((t) => {
    var n;
    return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
  });
}
function ke(e) {
  return typeof e == `string` ? e : e?.message;
}
function Ae(e, t, n) {
  let r = { ...e, path: e.path ?? [] };
  return (
    e.message ||
      (r.message =
        ke(e.inst?._zod.def?.error?.(e)) ??
        ke(t?.error?.(e)) ??
        ke(n.customError?.(e)) ??
        ke(n.localeError?.(e)) ??
        `Invalid input`),
    delete r.inst,
    delete r.continue,
    t?.reportInput || delete r.input,
    r
  );
}
function je(e) {
  return Array.isArray(e) ? `array` : typeof e == `string` ? `string` : `unknown`;
}
function Me(...e) {
  let [t, n, r] = e;
  return typeof t == `string` ? { message: t, code: `custom`, input: n, inst: r } : { ...t };
}
var Ne = (e, t) => {
    (e.name = `$ZodError`),
      Object.defineProperty(e, `_zod`, { value: e._zod, enumerable: !1 }),
      Object.defineProperty(e, `issues`, { value: t, enumerable: !1 }),
      (e.message = JSON.stringify(t, re, 2)),
      Object.defineProperty(e, `toString`, { value: () => e.message, enumerable: !1 });
  },
  Pe = w(`$ZodError`, Ne),
  Fe = w(`$ZodError`, Ne, { Parent: Error });
function Ie(e, t = (e) => e.message) {
  let n = {},
    r = [];
  for (let i of e.issues)
    i.path.length > 0
      ? ((n[i.path[0]] = n[i.path[0]] || []), n[i.path[0]].push(t(i)))
      : r.push(t(i));
  return { formErrors: r, fieldErrors: n };
}
function Le(e, t = (e) => e.message) {
  let n = { _errors: [] },
    r = (e) => {
      for (let i of e.issues)
        if (i.code === `invalid_union` && i.errors.length) i.errors.map((e) => r({ issues: e }));
        else if (i.code === `invalid_key`) r({ issues: i.issues });
        else if (i.code === `invalid_element`) r({ issues: i.issues });
        else if (i.path.length === 0) n._errors.push(t(i));
        else {
          let e = n,
            r = 0;
          for (; r < i.path.length; ) {
            let n = i.path[r];
            r === i.path.length - 1
              ? ((e[n] = e[n] || { _errors: [] }), e[n]._errors.push(t(i)))
              : (e[n] = e[n] || { _errors: [] }),
              (e = e[n]),
              r++;
          }
        }
    };
  return r(e), n;
}
var Re = (e) => (t, n, r, i) => {
    let a = r ? Object.assign(r, { async: !1 }) : { async: !1 },
      o = t._zod.run({ value: n, issues: [] }, a);
    if (o instanceof Promise) throw new ee();
    if (o.issues.length) {
      let t = new (i?.Err ?? e)(o.issues.map((e) => Ae(e, a, E())));
      throw (fe(t, i?.callee), t);
    }
    return o.value;
  },
  ze = (e) => async (t, n, r, i) => {
    let a = r ? Object.assign(r, { async: !0 }) : { async: !0 },
      o = t._zod.run({ value: n, issues: [] }, a);
    if ((o instanceof Promise && (o = await o), o.issues.length)) {
      let t = new (i?.Err ?? e)(o.issues.map((e) => Ae(e, a, E())));
      throw (fe(t, i?.callee), t);
    }
    return o.value;
  },
  Be = (e) => (t, n, r) => {
    let i = r ? { ...r, async: !1 } : { async: !1 },
      a = t._zod.run({ value: n, issues: [] }, i);
    if (a instanceof Promise) throw new ee();
    return a.issues.length
      ? { success: !1, error: new (e ?? Pe)(a.issues.map((e) => Ae(e, i, E()))) }
      : { success: !0, data: a.value };
  },
  Ve = Be(Fe),
  He = (e) => async (t, n, r) => {
    let i = r ? Object.assign(r, { async: !0 }) : { async: !0 },
      a = t._zod.run({ value: n, issues: [] }, i);
    return (
      a instanceof Promise && (a = await a),
      a.issues.length
        ? { success: !1, error: new e(a.issues.map((e) => Ae(e, i, E()))) }
        : { success: !0, data: a.value }
    );
  },
  Ue = He(Fe),
  We = (e) => (t, n, r) => {
    let i = r ? Object.assign(r, { direction: `backward` }) : { direction: `backward` };
    return Re(e)(t, n, i);
  },
  Ge = (e) => (t, n, r) => Re(e)(t, n, r),
  Ke = (e) => async (t, n, r) => {
    let i = r ? Object.assign(r, { direction: `backward` }) : { direction: `backward` };
    return ze(e)(t, n, i);
  },
  qe = (e) => async (t, n, r) => ze(e)(t, n, r),
  Je = (e) => (t, n, r) => {
    let i = r ? Object.assign(r, { direction: `backward` }) : { direction: `backward` };
    return Be(e)(t, n, i);
  },
  Ye = (e) => (t, n, r) => Be(e)(t, n, r),
  Xe = (e) => async (t, n, r) => {
    let i = r ? Object.assign(r, { direction: `backward` }) : { direction: `backward` };
    return He(e)(t, n, i);
  },
  Ze = (e) => async (t, n, r) => He(e)(t, n, r),
  Qe = /^[cC][^\s-]{8,}$/,
  $e = /^[0-9a-z]+$/,
  et = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,
  tt = /^[0-9a-vA-V]{20}$/,
  nt = /^[A-Za-z0-9]{27}$/,
  rt = /^[a-zA-Z0-9_-]{21}$/,
  it =
    /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
  at = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  ot = (e) =>
    e
      ? RegExp(
          `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
        )
      : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
  st =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
  ct = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function lt() {
  return new RegExp(ct, `u`);
}
var ut =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  dt =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
  ft =
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
  pt =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  mt = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
  ht = /^[A-Za-z0-9_-]*$/,
  gt = /^\+[1-9]\d{6,14}$/,
  _t = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`,
  vt = RegExp(`^${_t}$`);
function yt(e) {
  let t = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  return typeof e.precision == `number`
    ? e.precision === -1
      ? `${t}`
      : e.precision === 0
        ? `${t}:[0-5]\\d`
        : `${t}:[0-5]\\d\\.\\d{${e.precision}}`
    : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function bt(e) {
  return RegExp(`^${yt(e)}$`);
}
function xt(e) {
  let t = yt({ precision: e.precision }),
    n = [`Z`];
  e.local && n.push(``), e.offset && n.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  let r = `${t}(?:${n.join(`|`)})`;
  return RegExp(`^${_t}T(?:${r})$`);
}
var St = (e) => {
    let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ``}}` : `[\\s\\S]*`;
    return RegExp(`^${t}$`);
  },
  Ct = /^-?\d+$/,
  wt = /^-?\d+(?:\.\d+)?$/,
  Tt = /^(?:true|false)$/i,
  Et = /^null$/i,
  Dt = /^[^A-Z]*$/,
  Ot = /^[^a-z]*$/,
  kt = w(`$ZodCheck`, (e, t) => {
    var n;
    (e._zod ??= {}), (e._zod.def = t), (n = e._zod).onattach ?? (n.onattach = []);
  }),
  At = { number: `number`, bigint: `bigint`, object: `date` },
  jt = w(`$ZodCheckLessThan`, (e, t) => {
    kt.init(e, t);
    let n = At[typeof t.value];
    e._zod.onattach.push((e) => {
      let n = e._zod.bag,
        r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? 1 / 0;
      t.value < r && (t.inclusive ? (n.maximum = t.value) : (n.exclusiveMaximum = t.value));
    }),
      (e._zod.check = (r) => {
        (t.inclusive ? r.value <= t.value : r.value < t.value) ||
          r.issues.push({
            origin: n,
            code: `too_big`,
            maximum: typeof t.value == `object` ? t.value.getTime() : t.value,
            input: r.value,
            inclusive: t.inclusive,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Mt = w(`$ZodCheckGreaterThan`, (e, t) => {
    kt.init(e, t);
    let n = At[typeof t.value];
    e._zod.onattach.push((e) => {
      let n = e._zod.bag,
        r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -1 / 0;
      t.value > r && (t.inclusive ? (n.minimum = t.value) : (n.exclusiveMinimum = t.value));
    }),
      (e._zod.check = (r) => {
        (t.inclusive ? r.value >= t.value : r.value > t.value) ||
          r.issues.push({
            origin: n,
            code: `too_small`,
            minimum: typeof t.value == `object` ? t.value.getTime() : t.value,
            input: r.value,
            inclusive: t.inclusive,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Nt = w(`$ZodCheckMultipleOf`, (e, t) => {
    kt.init(e, t),
      e._zod.onattach.push((e) => {
        var n;
        (n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
      }),
      (e._zod.check = (n) => {
        if (typeof n.value != typeof t.value)
          throw Error(`Cannot mix number and bigint in multiple_of check.`);
        (typeof n.value == `bigint`
          ? n.value % t.value === BigInt(0)
          : se(n.value, t.value) === 0) ||
          n.issues.push({
            origin: typeof n.value,
            code: `not_multiple_of`,
            divisor: t.value,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Pt = w(`$ZodCheckNumberFormat`, (e, t) => {
    kt.init(e, t), (t.format = t.format || `float64`);
    let n = t.format?.includes(`int`),
      r = n ? `int` : `number`,
      [i, a] = ye[t.format];
    e._zod.onattach.push((e) => {
      let r = e._zod.bag;
      (r.format = t.format), (r.minimum = i), (r.maximum = a), n && (r.pattern = Ct);
    }),
      (e._zod.check = (o) => {
        let s = o.value;
        if (n) {
          if (!Number.isInteger(s)) {
            o.issues.push({
              expected: r,
              format: t.format,
              code: `invalid_type`,
              continue: !1,
              input: s,
              inst: e,
            });
            return;
          }
          if (!Number.isSafeInteger(s)) {
            s > 0
              ? o.issues.push({
                  input: s,
                  code: `too_big`,
                  maximum: 2 ** 53 - 1,
                  note: `Integers must be within the safe integer range.`,
                  inst: e,
                  origin: r,
                  inclusive: !0,
                  continue: !t.abort,
                })
              : o.issues.push({
                  input: s,
                  code: `too_small`,
                  minimum: -(2 ** 53 - 1),
                  note: `Integers must be within the safe integer range.`,
                  inst: e,
                  origin: r,
                  inclusive: !0,
                  continue: !t.abort,
                });
            return;
          }
        }
        s < i &&
          o.issues.push({
            origin: `number`,
            input: s,
            code: `too_small`,
            minimum: i,
            inclusive: !0,
            inst: e,
            continue: !t.abort,
          }),
          s > a &&
            o.issues.push({
              origin: `number`,
              input: s,
              code: `too_big`,
              maximum: a,
              inclusive: !0,
              inst: e,
              continue: !t.abort,
            });
      });
  }),
  Ft = w(`$ZodCheckMaxLength`, (e, t) => {
    var n;
    kt.init(e, t),
      (n = e._zod.def).when ??
        (n.when = (e) => {
          let t = e.value;
          return !ae(t) && t.length !== void 0;
        }),
      e._zod.onattach.push((e) => {
        let n = e._zod.bag.maximum ?? 1 / 0;
        t.maximum < n && (e._zod.bag.maximum = t.maximum);
      }),
      (e._zod.check = (n) => {
        let r = n.value;
        if (r.length <= t.maximum) return;
        let i = je(r);
        n.issues.push({
          origin: i,
          code: `too_big`,
          maximum: t.maximum,
          inclusive: !0,
          input: r,
          inst: e,
          continue: !t.abort,
        });
      });
  }),
  It = w(`$ZodCheckMinLength`, (e, t) => {
    var n;
    kt.init(e, t),
      (n = e._zod.def).when ??
        (n.when = (e) => {
          let t = e.value;
          return !ae(t) && t.length !== void 0;
        }),
      e._zod.onattach.push((e) => {
        let n = e._zod.bag.minimum ?? -1 / 0;
        t.minimum > n && (e._zod.bag.minimum = t.minimum);
      }),
      (e._zod.check = (n) => {
        let r = n.value;
        if (r.length >= t.minimum) return;
        let i = je(r);
        n.issues.push({
          origin: i,
          code: `too_small`,
          minimum: t.minimum,
          inclusive: !0,
          input: r,
          inst: e,
          continue: !t.abort,
        });
      });
  }),
  Lt = w(`$ZodCheckLengthEquals`, (e, t) => {
    var n;
    kt.init(e, t),
      (n = e._zod.def).when ??
        (n.when = (e) => {
          let t = e.value;
          return !ae(t) && t.length !== void 0;
        }),
      e._zod.onattach.push((e) => {
        let n = e._zod.bag;
        (n.minimum = t.length), (n.maximum = t.length), (n.length = t.length);
      }),
      (e._zod.check = (n) => {
        let r = n.value,
          i = r.length;
        if (i === t.length) return;
        let a = je(r),
          o = i > t.length;
        n.issues.push({
          origin: a,
          ...(o
            ? { code: `too_big`, maximum: t.length }
            : { code: `too_small`, minimum: t.length }),
          inclusive: !0,
          exact: !0,
          input: n.value,
          inst: e,
          continue: !t.abort,
        });
      });
  }),
  Rt = w(`$ZodCheckStringFormat`, (e, t) => {
    var n, r;
    kt.init(e, t),
      e._zod.onattach.push((e) => {
        let n = e._zod.bag;
        (n.format = t.format), t.pattern && ((n.patterns ??= new Set()), n.patterns.add(t.pattern));
      }),
      t.pattern
        ? ((n = e._zod).check ??
          (n.check = (n) => {
            (t.pattern.lastIndex = 0),
              !t.pattern.test(n.value) &&
                n.issues.push({
                  origin: `string`,
                  code: `invalid_format`,
                  format: t.format,
                  input: n.value,
                  ...(t.pattern ? { pattern: t.pattern.toString() } : {}),
                  inst: e,
                  continue: !t.abort,
                });
          }))
        : ((r = e._zod).check ?? (r.check = () => {}));
  }),
  zt = w(`$ZodCheckRegex`, (e, t) => {
    Rt.init(e, t),
      (e._zod.check = (n) => {
        (t.pattern.lastIndex = 0),
          !t.pattern.test(n.value) &&
            n.issues.push({
              origin: `string`,
              code: `invalid_format`,
              format: `regex`,
              input: n.value,
              pattern: t.pattern.toString(),
              inst: e,
              continue: !t.abort,
            });
      });
  }),
  Bt = w(`$ZodCheckLowerCase`, (e, t) => {
    (t.pattern ??= Dt), Rt.init(e, t);
  }),
  Vt = w(`$ZodCheckUpperCase`, (e, t) => {
    (t.pattern ??= Ot), Rt.init(e, t);
  }),
  Ht = w(`$ZodCheckIncludes`, (e, t) => {
    kt.init(e, t);
    let n = ge(t.includes),
      r = new RegExp(typeof t.position == `number` ? `^.{${t.position}}${n}` : n);
    (t.pattern = r),
      e._zod.onattach.push((e) => {
        let t = e._zod.bag;
        (t.patterns ??= new Set()), t.patterns.add(r);
      }),
      (e._zod.check = (n) => {
        n.value.includes(t.includes, t.position) ||
          n.issues.push({
            origin: `string`,
            code: `invalid_format`,
            format: `includes`,
            includes: t.includes,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Ut = w(`$ZodCheckStartsWith`, (e, t) => {
    kt.init(e, t);
    let n = RegExp(`^${ge(t.prefix)}.*`);
    (t.pattern ??= n),
      e._zod.onattach.push((e) => {
        let t = e._zod.bag;
        (t.patterns ??= new Set()), t.patterns.add(n);
      }),
      (e._zod.check = (n) => {
        n.value.startsWith(t.prefix) ||
          n.issues.push({
            origin: `string`,
            code: `invalid_format`,
            format: `starts_with`,
            prefix: t.prefix,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Wt = w(`$ZodCheckEndsWith`, (e, t) => {
    kt.init(e, t);
    let n = RegExp(`.*${ge(t.suffix)}$`);
    (t.pattern ??= n),
      e._zod.onattach.push((e) => {
        let t = e._zod.bag;
        (t.patterns ??= new Set()), t.patterns.add(n);
      }),
      (e._zod.check = (n) => {
        n.value.endsWith(t.suffix) ||
          n.issues.push({
            origin: `string`,
            code: `invalid_format`,
            format: `ends_with`,
            suffix: t.suffix,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Gt = w(`$ZodCheckOverwrite`, (e, t) => {
    kt.init(e, t),
      (e._zod.check = (e) => {
        e.value = t.tx(e.value);
      });
  }),
  Kt = class {
    constructor(e = []) {
      (this.content = []), (this.indent = 0), this && (this.args = e);
    }
    indented(e) {
      (this.indent += 1), e(this), --this.indent;
    }
    write(e) {
      if (typeof e == `function`) {
        e(this, { execution: `sync` }), e(this, { execution: `async` });
        return;
      }
      let t = e
          .split(`
`)
          .filter((e) => e),
        n = Math.min(...t.map((e) => e.length - e.trimStart().length)),
        r = t.map((e) => e.slice(n)).map((e) => ` `.repeat(this.indent * 2) + e);
      for (let e of r) this.content.push(e);
    }
    compile() {
      let e = Function,
        t = this?.args,
        n = [...(this?.content ?? [``]).map((e) => `  ${e}`)];
      return new e(
        ...t,
        n.join(`
`),
      );
    }
  },
  qt = { major: 4, minor: 3, patch: 6 },
  M = w(`$ZodType`, (e, t) => {
    var n;
    (e ??= {}), (e._zod.def = t), (e._zod.bag = e._zod.bag || {}), (e._zod.version = qt);
    let r = [...(e._zod.def.checks ?? [])];
    e._zod.traits.has(`$ZodCheck`) && r.unshift(e);
    for (let t of r) for (let n of t._zod.onattach) n(e);
    if (r.length === 0)
      (n = e._zod).deferred ?? (n.deferred = []),
        e._zod.deferred?.push(() => {
          e._zod.run = e._zod.parse;
        });
    else {
      let t = (e, t, n) => {
          let r = De(e),
            i;
          for (let a of t) {
            if (a._zod.def.when) {
              if (!a._zod.def.when(e)) continue;
            } else if (r) continue;
            let t = e.issues.length,
              o = a._zod.check(e);
            if (o instanceof Promise && n?.async === !1) throw new ee();
            if (i || o instanceof Promise)
              i = (i ?? Promise.resolve()).then(async () => {
                await o, e.issues.length !== t && (r ||= De(e, t));
              });
            else {
              if (e.issues.length === t) continue;
              r ||= De(e, t);
            }
          }
          return i ? i.then(() => e) : e;
        },
        n = (n, i, a) => {
          if (De(n)) return (n.aborted = !0), n;
          let o = t(i, r, a);
          if (o instanceof Promise) {
            if (a.async === !1) throw new ee();
            return o.then((t) => e._zod.parse(t, a));
          }
          return e._zod.parse(o, a);
        };
      e._zod.run = (i, a) => {
        if (a.skipChecks) return e._zod.parse(i, a);
        if (a.direction === `backward`) {
          let t = e._zod.parse({ value: i.value, issues: [] }, { ...a, skipChecks: !0 });
          return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
        }
        let o = e._zod.parse(i, a);
        if (o instanceof Promise) {
          if (a.async === !1) throw new ee();
          return o.then((e) => t(e, r, a));
        }
        return t(o, r, a);
      };
    }
    D(e, `~standard`, () => ({
      validate: (t) => {
        try {
          let n = Ve(e, t);
          return n.success ? { value: n.data } : { issues: n.error?.issues };
        } catch {
          return Ue(e, t).then((e) =>
            e.success ? { value: e.data } : { issues: e.error?.issues },
          );
        }
      },
      vendor: `zod`,
      version: 1,
    }));
  }),
  Jt = w(`$ZodString`, (e, t) => {
    M.init(e, t),
      (e._zod.pattern = [...(e?._zod.bag?.patterns ?? [])].pop() ?? St(e._zod.bag)),
      (e._zod.parse = (n, r) => {
        if (t.coerce)
          try {
            n.value = String(n.value);
          } catch {}
        return (
          typeof n.value == `string` ||
            n.issues.push({ expected: `string`, code: `invalid_type`, input: n.value, inst: e }),
          n
        );
      });
  }),
  Yt = w(`$ZodStringFormat`, (e, t) => {
    Rt.init(e, t), Jt.init(e, t);
  }),
  Xt = w(`$ZodGUID`, (e, t) => {
    (t.pattern ??= at), Yt.init(e, t);
  }),
  Zt = w(`$ZodUUID`, (e, t) => {
    if (t.version) {
      let e = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[t.version];
      if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
      t.pattern ??= ot(e);
    } else t.pattern ??= ot();
    Yt.init(e, t);
  }),
  Qt = w(`$ZodEmail`, (e, t) => {
    (t.pattern ??= st), Yt.init(e, t);
  }),
  $t = w(`$ZodURL`, (e, t) => {
    Yt.init(e, t),
      (e._zod.check = (n) => {
        try {
          let r = n.value.trim(),
            i = new URL(r);
          t.hostname &&
            ((t.hostname.lastIndex = 0),
            t.hostname.test(i.hostname) ||
              n.issues.push({
                code: `invalid_format`,
                format: `url`,
                note: `Invalid hostname`,
                pattern: t.hostname.source,
                input: n.value,
                inst: e,
                continue: !t.abort,
              })),
            t.protocol &&
              ((t.protocol.lastIndex = 0),
              t.protocol.test(i.protocol.endsWith(`:`) ? i.protocol.slice(0, -1) : i.protocol) ||
                n.issues.push({
                  code: `invalid_format`,
                  format: `url`,
                  note: `Invalid protocol`,
                  pattern: t.protocol.source,
                  input: n.value,
                  inst: e,
                  continue: !t.abort,
                })),
            t.normalize ? (n.value = i.href) : (n.value = r);
          return;
        } catch {
          n.issues.push({
            code: `invalid_format`,
            format: `url`,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
        }
      });
  }),
  en = w(`$ZodEmoji`, (e, t) => {
    (t.pattern ??= lt()), Yt.init(e, t);
  }),
  tn = w(`$ZodNanoID`, (e, t) => {
    (t.pattern ??= rt), Yt.init(e, t);
  }),
  nn = w(`$ZodCUID`, (e, t) => {
    (t.pattern ??= Qe), Yt.init(e, t);
  }),
  rn = w(`$ZodCUID2`, (e, t) => {
    (t.pattern ??= $e), Yt.init(e, t);
  }),
  an = w(`$ZodULID`, (e, t) => {
    (t.pattern ??= et), Yt.init(e, t);
  }),
  on = w(`$ZodXID`, (e, t) => {
    (t.pattern ??= tt), Yt.init(e, t);
  }),
  sn = w(`$ZodKSUID`, (e, t) => {
    (t.pattern ??= nt), Yt.init(e, t);
  }),
  cn = w(`$ZodISODateTime`, (e, t) => {
    (t.pattern ??= xt(t)), Yt.init(e, t);
  }),
  ln = w(`$ZodISODate`, (e, t) => {
    (t.pattern ??= vt), Yt.init(e, t);
  }),
  un = w(`$ZodISOTime`, (e, t) => {
    (t.pattern ??= bt(t)), Yt.init(e, t);
  }),
  dn = w(`$ZodISODuration`, (e, t) => {
    (t.pattern ??= it), Yt.init(e, t);
  }),
  fn = w(`$ZodIPv4`, (e, t) => {
    (t.pattern ??= ut), Yt.init(e, t), (e._zod.bag.format = `ipv4`);
  }),
  pn = w(`$ZodIPv6`, (e, t) => {
    (t.pattern ??= dt),
      Yt.init(e, t),
      (e._zod.bag.format = `ipv6`),
      (e._zod.check = (n) => {
        try {
          new URL(`http://[${n.value}]`);
        } catch {
          n.issues.push({
            code: `invalid_format`,
            format: `ipv6`,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
        }
      });
  }),
  mn = w(`$ZodCIDRv4`, (e, t) => {
    (t.pattern ??= ft), Yt.init(e, t);
  }),
  hn = w(`$ZodCIDRv6`, (e, t) => {
    (t.pattern ??= pt),
      Yt.init(e, t),
      (e._zod.check = (n) => {
        let r = n.value.split(`/`);
        try {
          if (r.length !== 2) throw Error();
          let [e, t] = r;
          if (!t) throw Error();
          let n = Number(t);
          if (`${n}` !== t || n < 0 || n > 128) throw Error();
          new URL(`http://[${e}]`);
        } catch {
          n.issues.push({
            code: `invalid_format`,
            format: `cidrv6`,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
        }
      });
  });
function gn(e) {
  if (e === ``) return !0;
  if (e.length % 4 != 0) return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
var _n = w(`$ZodBase64`, (e, t) => {
  (t.pattern ??= mt),
    Yt.init(e, t),
    (e._zod.bag.contentEncoding = `base64`),
    (e._zod.check = (n) => {
      gn(n.value) ||
        n.issues.push({
          code: `invalid_format`,
          format: `base64`,
          input: n.value,
          inst: e,
          continue: !t.abort,
        });
    });
});
function vn(e) {
  if (!ht.test(e)) return !1;
  let t = e.replace(/[-_]/g, (e) => (e === `-` ? `+` : `/`));
  return gn(t.padEnd(Math.ceil(t.length / 4) * 4, `=`));
}
var yn = w(`$ZodBase64URL`, (e, t) => {
    (t.pattern ??= ht),
      Yt.init(e, t),
      (e._zod.bag.contentEncoding = `base64url`),
      (e._zod.check = (n) => {
        vn(n.value) ||
          n.issues.push({
            code: `invalid_format`,
            format: `base64url`,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  bn = w(`$ZodE164`, (e, t) => {
    (t.pattern ??= gt), Yt.init(e, t);
  });
function xn(e, t = null) {
  try {
    let n = e.split(`.`);
    if (n.length !== 3) return !1;
    let [r] = n;
    if (!r) return !1;
    let i = JSON.parse(atob(r));
    return !((`typ` in i && i?.typ !== `JWT`) || !i.alg || (t && (!(`alg` in i) || i.alg !== t)));
  } catch {
    return !1;
  }
}
var Sn = w(`$ZodJWT`, (e, t) => {
    Yt.init(e, t),
      (e._zod.check = (n) => {
        xn(n.value, t.alg) ||
          n.issues.push({
            code: `invalid_format`,
            format: `jwt`,
            input: n.value,
            inst: e,
            continue: !t.abort,
          });
      });
  }),
  Cn = w(`$ZodNumber`, (e, t) => {
    M.init(e, t),
      (e._zod.pattern = e._zod.bag.pattern ?? wt),
      (e._zod.parse = (n, r) => {
        if (t.coerce)
          try {
            n.value = Number(n.value);
          } catch {}
        let i = n.value;
        if (typeof i == `number` && !Number.isNaN(i) && Number.isFinite(i)) return n;
        let a =
          typeof i == `number`
            ? Number.isNaN(i)
              ? `NaN`
              : Number.isFinite(i)
                ? void 0
                : `Infinity`
            : void 0;
        return (
          n.issues.push({
            expected: `number`,
            code: `invalid_type`,
            input: i,
            inst: e,
            ...(a ? { received: a } : {}),
          }),
          n
        );
      });
  }),
  wn = w(`$ZodNumberFormat`, (e, t) => {
    Pt.init(e, t), Cn.init(e, t);
  }),
  Tn = w(`$ZodBoolean`, (e, t) => {
    M.init(e, t),
      (e._zod.pattern = Tt),
      (e._zod.parse = (n, r) => {
        if (t.coerce)
          try {
            n.value = !!n.value;
          } catch {}
        let i = n.value;
        return (
          typeof i == `boolean` ||
            n.issues.push({ expected: `boolean`, code: `invalid_type`, input: i, inst: e }),
          n
        );
      });
  }),
  En = w(`$ZodNull`, (e, t) => {
    M.init(e, t),
      (e._zod.pattern = Et),
      (e._zod.values = new Set([null])),
      (e._zod.parse = (t, n) => {
        let r = t.value;
        return (
          r === null ||
            t.issues.push({ expected: `null`, code: `invalid_type`, input: r, inst: e }),
          t
        );
      });
  }),
  Dn = w(`$ZodAny`, (e, t) => {
    M.init(e, t), (e._zod.parse = (e) => e);
  }),
  On = w(`$ZodUnknown`, (e, t) => {
    M.init(e, t), (e._zod.parse = (e) => e);
  }),
  kn = w(`$ZodNever`, (e, t) => {
    M.init(e, t),
      (e._zod.parse = (t, n) => (
        t.issues.push({ expected: `never`, code: `invalid_type`, input: t.value, inst: e }), t
      ));
  });
function An(e, t, n) {
  e.issues.length && t.issues.push(...Oe(n, e.issues)), (t.value[n] = e.value);
}
var jn = w(`$ZodArray`, (e, t) => {
  M.init(e, t),
    (e._zod.parse = (n, r) => {
      let i = n.value;
      if (!Array.isArray(i))
        return n.issues.push({ expected: `array`, code: `invalid_type`, input: i, inst: e }), n;
      n.value = Array(i.length);
      let a = [];
      for (let e = 0; e < i.length; e++) {
        let o = i[e],
          s = t.element._zod.run({ value: o, issues: [] }, r);
        s instanceof Promise ? a.push(s.then((t) => An(t, n, e))) : An(s, n, e);
      }
      return a.length ? Promise.all(a).then(() => n) : n;
    });
});
function Mn(e, t, n, r, i) {
  if (e.issues.length) {
    if (i && !(n in r)) return;
    t.issues.push(...Oe(n, e.issues));
  }
  e.value === void 0 ? n in r && (t.value[n] = void 0) : (t.value[n] = e.value);
}
function Nn(e) {
  let t = Object.keys(e.shape);
  for (let n of t)
    if (!e.shape?.[n]?._zod?.traits?.has(`$ZodType`))
      throw Error(`Invalid element at key "${n}": expected a Zod schema`);
  let n = ve(e.shape);
  return { ...e, keys: t, keySet: new Set(t), numKeys: t.length, optionalKeys: new Set(n) };
}
function Pn(e, t, n, r, i, a) {
  let o = [],
    s = i.keySet,
    c = i.catchall._zod,
    l = c.def.type,
    u = c.optout === `optional`;
  for (let i in t) {
    if (s.has(i)) continue;
    if (l === `never`) {
      o.push(i);
      continue;
    }
    let a = c.run({ value: t[i], issues: [] }, r);
    a instanceof Promise ? e.push(a.then((e) => Mn(e, n, i, t, u))) : Mn(a, n, i, t, u);
  }
  return (
    o.length && n.issues.push({ code: `unrecognized_keys`, keys: o, input: t, inst: a }),
    e.length ? Promise.all(e).then(() => n) : n
  );
}
var Fn = w(`$ZodObject`, (e, t) => {
    if ((M.init(e, t), !Object.getOwnPropertyDescriptor(t, `shape`)?.get)) {
      let e = t.shape;
      Object.defineProperty(t, `shape`, {
        get: () => {
          let n = { ...e };
          return Object.defineProperty(t, `shape`, { value: n }), n;
        },
      });
    }
    let n = ie(() => Nn(t));
    D(e._zod, `propValues`, () => {
      let e = t.shape,
        n = {};
      for (let t in e) {
        let r = e[t]._zod;
        if (r.values) {
          n[t] ?? (n[t] = new Set());
          for (let e of r.values) n[t].add(e);
        }
      }
      return n;
    });
    let r = k,
      i = t.catchall,
      a;
    e._zod.parse = (t, o) => {
      a ??= n.value;
      let s = t.value;
      if (!r(s))
        return t.issues.push({ expected: `object`, code: `invalid_type`, input: s, inst: e }), t;
      t.value = {};
      let c = [],
        l = a.shape;
      for (let e of a.keys) {
        let n = l[e],
          r = n._zod.optout === `optional`,
          i = n._zod.run({ value: s[e], issues: [] }, o);
        i instanceof Promise ? c.push(i.then((n) => Mn(n, t, e, s, r))) : Mn(i, t, e, s, r);
      }
      return i ? Pn(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
    };
  }),
  In = w(`$ZodObjectJIT`, (e, t) => {
    Fn.init(e, t);
    let n = e._zod.parse,
      r = ie(() => Nn(t)),
      i = (e) => {
        let t = new Kt([`shape`, `payload`, `ctx`]),
          n = r.value,
          i = (e) => {
            let t = ue(e);
            return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
          };
        t.write(`const input = payload.value;`);
        let a = Object.create(null),
          o = 0;
        for (let e of n.keys) a[e] = `key_${o++}`;
        t.write(`const newResult = {};`);
        for (let r of n.keys) {
          let n = a[r],
            o = ue(r),
            s = e[r]?._zod?.optout === `optional`;
          t.write(`const ${n} = ${i(r)};`),
            s
              ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `)
              : t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `);
        }
        t.write(`payload.value = newResult;`), t.write(`return payload;`);
        let s = t.compile();
        return (t, n) => s(e, t, n);
      },
      a,
      o = k,
      s = !te.jitless,
      c = s && A.value,
      l = t.catchall,
      u;
    e._zod.parse = (d, f) => {
      u ??= r.value;
      let p = d.value;
      return o(p)
        ? s && c && f?.async === !1 && f.jitless !== !0
          ? ((a ||= i(t.shape)), (d = a(d, f)), l ? Pn([], p, d, f, u, e) : d)
          : n(d, f)
        : (d.issues.push({ expected: `object`, code: `invalid_type`, input: p, inst: e }), d);
    };
  });
function Ln(e, t, n, r) {
  for (let n of e) if (n.issues.length === 0) return (t.value = n.value), t;
  let i = e.filter((e) => !De(e));
  return i.length === 1
    ? ((t.value = i[0].value), i[0])
    : (t.issues.push({
        code: `invalid_union`,
        input: t.value,
        inst: n,
        errors: e.map((e) => e.issues.map((e) => Ae(e, r, E()))),
      }),
      t);
}
var Rn = w(`$ZodUnion`, (e, t) => {
    M.init(e, t),
      D(e._zod, `optin`, () =>
        t.options.some((e) => e._zod.optin === `optional`) ? `optional` : void 0,
      ),
      D(e._zod, `optout`, () =>
        t.options.some((e) => e._zod.optout === `optional`) ? `optional` : void 0,
      ),
      D(e._zod, `values`, () => {
        if (t.options.every((e) => e._zod.values))
          return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
      }),
      D(e._zod, `pattern`, () => {
        if (t.options.every((e) => e._zod.pattern)) {
          let e = t.options.map((e) => e._zod.pattern);
          return RegExp(`^(${e.map((e) => oe(e.source)).join(`|`)})$`);
        }
      });
    let n = t.options.length === 1,
      r = t.options[0]._zod.run;
    e._zod.parse = (i, a) => {
      if (n) return r(i, a);
      let o = !1,
        s = [];
      for (let e of t.options) {
        let t = e._zod.run({ value: i.value, issues: [] }, a);
        if (t instanceof Promise) s.push(t), (o = !0);
        else {
          if (t.issues.length === 0) return t;
          s.push(t);
        }
      }
      return o ? Promise.all(s).then((t) => Ln(t, i, e, a)) : Ln(s, i, e, a);
    };
  }),
  zn = w(`$ZodIntersection`, (e, t) => {
    M.init(e, t),
      (e._zod.parse = (e, n) => {
        let r = e.value,
          i = t.left._zod.run({ value: r, issues: [] }, n),
          a = t.right._zod.run({ value: r, issues: [] }, n);
        return i instanceof Promise || a instanceof Promise
          ? Promise.all([i, a]).then(([t, n]) => Vn(e, t, n))
          : Vn(e, i, a);
      });
  });
function Bn(e, t) {
  if (e === t || (e instanceof Date && t instanceof Date && +e == +t))
    return { valid: !0, data: e };
  if (pe(e) && pe(t)) {
    let n = Object.keys(t),
      r = Object.keys(e).filter((e) => n.indexOf(e) !== -1),
      i = { ...e, ...t };
    for (let n of r) {
      let r = Bn(e[n], t[n]);
      if (!r.valid) return { valid: !1, mergeErrorPath: [n, ...r.mergeErrorPath] };
      i[n] = r.data;
    }
    return { valid: !0, data: i };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return { valid: !1, mergeErrorPath: [] };
    let n = [];
    for (let r = 0; r < e.length; r++) {
      let i = e[r],
        a = t[r],
        o = Bn(i, a);
      if (!o.valid) return { valid: !1, mergeErrorPath: [r, ...o.mergeErrorPath] };
      n.push(o.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Vn(e, t, n) {
  let r = new Map(),
    i;
  for (let n of t.issues)
    if (n.code === `unrecognized_keys`) {
      i ??= n;
      for (let e of n.keys) r.has(e) || r.set(e, {}), (r.get(e).l = !0);
    } else e.issues.push(n);
  for (let t of n.issues)
    if (t.code === `unrecognized_keys`)
      for (let e of t.keys) r.has(e) || r.set(e, {}), (r.get(e).r = !0);
    else e.issues.push(t);
  let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
  if ((a.length && i && e.issues.push({ ...i, keys: a }), De(e))) return e;
  let o = Bn(t.value, n.value);
  if (!o.valid)
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
  return (e.value = o.data), e;
}
var Hn = w(`$ZodRecord`, (e, t) => {
    M.init(e, t),
      (e._zod.parse = (n, r) => {
        let i = n.value;
        if (!pe(i))
          return n.issues.push({ expected: `record`, code: `invalid_type`, input: i, inst: e }), n;
        let a = [],
          o = t.keyType._zod.values;
        if (o) {
          n.value = {};
          let s = new Set();
          for (let e of o)
            if (typeof e == `string` || typeof e == `number` || typeof e == `symbol`) {
              s.add(typeof e == `number` ? e.toString() : e);
              let o = t.valueType._zod.run({ value: i[e], issues: [] }, r);
              o instanceof Promise
                ? a.push(
                    o.then((t) => {
                      t.issues.length && n.issues.push(...Oe(e, t.issues)), (n.value[e] = t.value);
                    }),
                  )
                : (o.issues.length && n.issues.push(...Oe(e, o.issues)), (n.value[e] = o.value));
            }
          let c;
          for (let e in i) s.has(e) || ((c ??= []), c.push(e));
          c &&
            c.length > 0 &&
            n.issues.push({ code: `unrecognized_keys`, input: i, inst: e, keys: c });
        } else {
          n.value = {};
          for (let o of Reflect.ownKeys(i)) {
            if (o === `__proto__`) continue;
            let s = t.keyType._zod.run({ value: o, issues: [] }, r);
            if (s instanceof Promise)
              throw Error(`Async schemas not supported in object keys currently`);
            if (typeof o == `string` && wt.test(o) && s.issues.length) {
              let e = t.keyType._zod.run({ value: Number(o), issues: [] }, r);
              if (e instanceof Promise)
                throw Error(`Async schemas not supported in object keys currently`);
              e.issues.length === 0 && (s = e);
            }
            if (s.issues.length) {
              t.mode === `loose`
                ? (n.value[o] = i[o])
                : n.issues.push({
                    code: `invalid_key`,
                    origin: `record`,
                    issues: s.issues.map((e) => Ae(e, r, E())),
                    input: o,
                    path: [o],
                    inst: e,
                  });
              continue;
            }
            let c = t.valueType._zod.run({ value: i[o], issues: [] }, r);
            c instanceof Promise
              ? a.push(
                  c.then((e) => {
                    e.issues.length && n.issues.push(...Oe(o, e.issues)),
                      (n.value[s.value] = e.value);
                  }),
                )
              : (c.issues.length && n.issues.push(...Oe(o, c.issues)),
                (n.value[s.value] = c.value));
          }
        }
        return a.length ? Promise.all(a).then(() => n) : n;
      });
  }),
  Un = w(`$ZodEnum`, (e, t) => {
    M.init(e, t);
    let n = ne(t.entries),
      r = new Set(n);
    (e._zod.values = r),
      (e._zod.pattern = RegExp(
        `^(${n
          .filter((e) => he.has(typeof e))
          .map((e) => (typeof e == `string` ? ge(e) : e.toString()))
          .join(`|`)})$`,
      )),
      (e._zod.parse = (t, i) => {
        let a = t.value;
        return (
          r.has(a) || t.issues.push({ code: `invalid_value`, values: n, input: a, inst: e }), t
        );
      });
  }),
  Wn = w(`$ZodLiteral`, (e, t) => {
    if ((M.init(e, t), t.values.length === 0))
      throw Error(`Cannot create literal schema with no valid values`);
    let n = new Set(t.values);
    (e._zod.values = n),
      (e._zod.pattern = RegExp(
        `^(${t.values.map((e) => (typeof e == `string` ? ge(e) : e ? ge(e.toString()) : String(e))).join(`|`)})$`,
      )),
      (e._zod.parse = (r, i) => {
        let a = r.value;
        return (
          n.has(a) || r.issues.push({ code: `invalid_value`, values: t.values, input: a, inst: e }),
          r
        );
      });
  }),
  Gn = w(`$ZodTransform`, (e, t) => {
    M.init(e, t),
      (e._zod.parse = (n, r) => {
        if (r.direction === `backward`) throw new T(e.constructor.name);
        let i = t.transform(n.value, n);
        if (r.async)
          return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => ((n.value = e), n));
        if (i instanceof Promise) throw new ee();
        return (n.value = i), n;
      });
  });
function Kn(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
var qn = w(`$ZodOptional`, (e, t) => {
    M.init(e, t),
      (e._zod.optin = `optional`),
      (e._zod.optout = `optional`),
      D(e._zod, `values`, () =>
        t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0,
      ),
      D(e._zod, `pattern`, () => {
        let e = t.innerType._zod.pattern;
        return e ? RegExp(`^(${oe(e.source)})?$`) : void 0;
      }),
      (e._zod.parse = (e, n) => {
        if (t.innerType._zod.optin === `optional`) {
          let r = t.innerType._zod.run(e, n);
          return r instanceof Promise ? r.then((t) => Kn(t, e.value)) : Kn(r, e.value);
        }
        return e.value === void 0 ? e : t.innerType._zod.run(e, n);
      });
  }),
  Jn = w(`$ZodExactOptional`, (e, t) => {
    qn.init(e, t),
      D(e._zod, `values`, () => t.innerType._zod.values),
      D(e._zod, `pattern`, () => t.innerType._zod.pattern),
      (e._zod.parse = (e, n) => t.innerType._zod.run(e, n));
  }),
  Yn = w(`$ZodNullable`, (e, t) => {
    M.init(e, t),
      D(e._zod, `optin`, () => t.innerType._zod.optin),
      D(e._zod, `optout`, () => t.innerType._zod.optout),
      D(e._zod, `pattern`, () => {
        let e = t.innerType._zod.pattern;
        return e ? RegExp(`^(${oe(e.source)}|null)$`) : void 0;
      }),
      D(e._zod, `values`, () =>
        t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0,
      ),
      (e._zod.parse = (e, n) => (e.value === null ? e : t.innerType._zod.run(e, n)));
  }),
  Xn = w(`$ZodDefault`, (e, t) => {
    M.init(e, t),
      (e._zod.optin = `optional`),
      D(e._zod, `values`, () => t.innerType._zod.values),
      (e._zod.parse = (e, n) => {
        if (n.direction === `backward`) return t.innerType._zod.run(e, n);
        if (e.value === void 0) return (e.value = t.defaultValue), e;
        let r = t.innerType._zod.run(e, n);
        return r instanceof Promise ? r.then((e) => Zn(e, t)) : Zn(r, t);
      });
  });
function Zn(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Qn = w(`$ZodPrefault`, (e, t) => {
    M.init(e, t),
      (e._zod.optin = `optional`),
      D(e._zod, `values`, () => t.innerType._zod.values),
      (e._zod.parse = (e, n) => (
        n.direction === `backward` || (e.value === void 0 && (e.value = t.defaultValue)),
        t.innerType._zod.run(e, n)
      ));
  }),
  $n = w(`$ZodNonOptional`, (e, t) => {
    M.init(e, t),
      D(e._zod, `values`, () => {
        let e = t.innerType._zod.values;
        return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
      }),
      (e._zod.parse = (n, r) => {
        let i = t.innerType._zod.run(n, r);
        return i instanceof Promise ? i.then((t) => er(t, e)) : er(i, e);
      });
  });
function er(e, t) {
  return (
    !e.issues.length &&
      e.value === void 0 &&
      e.issues.push({ code: `invalid_type`, expected: `nonoptional`, input: e.value, inst: t }),
    e
  );
}
var tr = w(`$ZodCatch`, (e, t) => {
    M.init(e, t),
      D(e._zod, `optin`, () => t.innerType._zod.optin),
      D(e._zod, `optout`, () => t.innerType._zod.optout),
      D(e._zod, `values`, () => t.innerType._zod.values),
      (e._zod.parse = (e, n) => {
        if (n.direction === `backward`) return t.innerType._zod.run(e, n);
        let r = t.innerType._zod.run(e, n);
        return r instanceof Promise
          ? r.then(
              (r) => (
                (e.value = r.value),
                r.issues.length &&
                  ((e.value = t.catchValue({
                    ...e,
                    error: { issues: r.issues.map((e) => Ae(e, n, E())) },
                    input: e.value,
                  })),
                  (e.issues = [])),
                e
              ),
            )
          : ((e.value = r.value),
            r.issues.length &&
              ((e.value = t.catchValue({
                ...e,
                error: { issues: r.issues.map((e) => Ae(e, n, E())) },
                input: e.value,
              })),
              (e.issues = [])),
            e);
      });
  }),
  nr = w(`$ZodPipe`, (e, t) => {
    M.init(e, t),
      D(e._zod, `values`, () => t.in._zod.values),
      D(e._zod, `optin`, () => t.in._zod.optin),
      D(e._zod, `optout`, () => t.out._zod.optout),
      D(e._zod, `propValues`, () => t.in._zod.propValues),
      (e._zod.parse = (e, n) => {
        if (n.direction === `backward`) {
          let r = t.out._zod.run(e, n);
          return r instanceof Promise ? r.then((e) => rr(e, t.in, n)) : rr(r, t.in, n);
        }
        let r = t.in._zod.run(e, n);
        return r instanceof Promise ? r.then((e) => rr(e, t.out, n)) : rr(r, t.out, n);
      });
  });
function rr(e, t, n) {
  return e.issues.length
    ? ((e.aborted = !0), e)
    : t._zod.run({ value: e.value, issues: e.issues }, n);
}
var ir = w(`$ZodReadonly`, (e, t) => {
  M.init(e, t),
    D(e._zod, `propValues`, () => t.innerType._zod.propValues),
    D(e._zod, `values`, () => t.innerType._zod.values),
    D(e._zod, `optin`, () => t.innerType?._zod?.optin),
    D(e._zod, `optout`, () => t.innerType?._zod?.optout),
    (e._zod.parse = (e, n) => {
      if (n.direction === `backward`) return t.innerType._zod.run(e, n);
      let r = t.innerType._zod.run(e, n);
      return r instanceof Promise ? r.then(ar) : ar(r);
    });
});
function ar(e) {
  return (e.value = Object.freeze(e.value)), e;
}
var or = w(`$ZodLazy`, (e, t) => {
    M.init(e, t),
      D(e._zod, `innerType`, () => t.getter()),
      D(e._zod, `pattern`, () => e._zod.innerType?._zod?.pattern),
      D(e._zod, `propValues`, () => e._zod.innerType?._zod?.propValues),
      D(e._zod, `optin`, () => e._zod.innerType?._zod?.optin ?? void 0),
      D(e._zod, `optout`, () => e._zod.innerType?._zod?.optout ?? void 0),
      (e._zod.parse = (t, n) => e._zod.innerType._zod.run(t, n));
  }),
  sr = w(`$ZodCustom`, (e, t) => {
    kt.init(e, t),
      M.init(e, t),
      (e._zod.parse = (e, t) => e),
      (e._zod.check = (n) => {
        let r = n.value,
          i = t.fn(r);
        if (i instanceof Promise) return i.then((t) => cr(t, n, r, e));
        cr(i, n, r, e);
      });
  });
function cr(e, t, n, r) {
  if (!e) {
    let e = {
      code: `custom`,
      input: n,
      inst: r,
      path: [...(r._zod.def.path ?? [])],
      continue: !r._zod.def.abort,
    };
    r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(Me(e));
  }
}
var lr,
  ur = class {
    constructor() {
      (this._map = new WeakMap()), (this._idmap = new Map());
    }
    add(e, ...t) {
      let n = t[0];
      return (
        this._map.set(e, n),
        n && typeof n == `object` && `id` in n && this._idmap.set(n.id, e),
        this
      );
    }
    clear() {
      return (this._map = new WeakMap()), (this._idmap = new Map()), this;
    }
    remove(e) {
      let t = this._map.get(e);
      return (
        t && typeof t == `object` && `id` in t && this._idmap.delete(t.id),
        this._map.delete(e),
        this
      );
    }
    get(e) {
      let t = e._zod.parent;
      if (t) {
        let n = { ...(this.get(t) ?? {}) };
        delete n.id;
        let r = { ...n, ...this._map.get(e) };
        return Object.keys(r).length ? r : void 0;
      }
      return this._map.get(e);
    }
    has(e) {
      return this._map.has(e);
    }
  };
function dr() {
  return new ur();
}
(lr = globalThis).__zod_globalRegistry ?? (lr.__zod_globalRegistry = dr());
var fr = globalThis.__zod_globalRegistry;
function pr(e, t) {
  return new e({ type: `string`, ...j(t) });
}
function mr(e, t) {
  return new e({ type: `string`, format: `email`, check: `string_format`, abort: !1, ...j(t) });
}
function hr(e, t) {
  return new e({ type: `string`, format: `guid`, check: `string_format`, abort: !1, ...j(t) });
}
function gr(e, t) {
  return new e({ type: `string`, format: `uuid`, check: `string_format`, abort: !1, ...j(t) });
}
function _r(e, t) {
  return new e({
    type: `string`,
    format: `uuid`,
    check: `string_format`,
    abort: !1,
    version: `v4`,
    ...j(t),
  });
}
function vr(e, t) {
  return new e({
    type: `string`,
    format: `uuid`,
    check: `string_format`,
    abort: !1,
    version: `v6`,
    ...j(t),
  });
}
function yr(e, t) {
  return new e({
    type: `string`,
    format: `uuid`,
    check: `string_format`,
    abort: !1,
    version: `v7`,
    ...j(t),
  });
}
function br(e, t) {
  return new e({ type: `string`, format: `url`, check: `string_format`, abort: !1, ...j(t) });
}
function xr(e, t) {
  return new e({ type: `string`, format: `emoji`, check: `string_format`, abort: !1, ...j(t) });
}
function Sr(e, t) {
  return new e({ type: `string`, format: `nanoid`, check: `string_format`, abort: !1, ...j(t) });
}
function Cr(e, t) {
  return new e({ type: `string`, format: `cuid`, check: `string_format`, abort: !1, ...j(t) });
}
function wr(e, t) {
  return new e({ type: `string`, format: `cuid2`, check: `string_format`, abort: !1, ...j(t) });
}
function Tr(e, t) {
  return new e({ type: `string`, format: `ulid`, check: `string_format`, abort: !1, ...j(t) });
}
function Er(e, t) {
  return new e({ type: `string`, format: `xid`, check: `string_format`, abort: !1, ...j(t) });
}
function Dr(e, t) {
  return new e({ type: `string`, format: `ksuid`, check: `string_format`, abort: !1, ...j(t) });
}
function Or(e, t) {
  return new e({ type: `string`, format: `ipv4`, check: `string_format`, abort: !1, ...j(t) });
}
function kr(e, t) {
  return new e({ type: `string`, format: `ipv6`, check: `string_format`, abort: !1, ...j(t) });
}
function Ar(e, t) {
  return new e({ type: `string`, format: `cidrv4`, check: `string_format`, abort: !1, ...j(t) });
}
function jr(e, t) {
  return new e({ type: `string`, format: `cidrv6`, check: `string_format`, abort: !1, ...j(t) });
}
function Mr(e, t) {
  return new e({ type: `string`, format: `base64`, check: `string_format`, abort: !1, ...j(t) });
}
function Nr(e, t) {
  return new e({ type: `string`, format: `base64url`, check: `string_format`, abort: !1, ...j(t) });
}
function Pr(e, t) {
  return new e({ type: `string`, format: `e164`, check: `string_format`, abort: !1, ...j(t) });
}
function Fr(e, t) {
  return new e({ type: `string`, format: `jwt`, check: `string_format`, abort: !1, ...j(t) });
}
function Ir(e, t) {
  return new e({
    type: `string`,
    format: `datetime`,
    check: `string_format`,
    offset: !1,
    local: !1,
    precision: null,
    ...j(t),
  });
}
function Lr(e, t) {
  return new e({ type: `string`, format: `date`, check: `string_format`, ...j(t) });
}
function Rr(e, t) {
  return new e({
    type: `string`,
    format: `time`,
    check: `string_format`,
    precision: null,
    ...j(t),
  });
}
function zr(e, t) {
  return new e({ type: `string`, format: `duration`, check: `string_format`, ...j(t) });
}
function Br(e, t) {
  return new e({ type: `number`, checks: [], ...j(t) });
}
function Vr(e, t) {
  return new e({ type: `number`, check: `number_format`, abort: !1, format: `safeint`, ...j(t) });
}
function Hr(e, t) {
  return new e({ type: `boolean`, ...j(t) });
}
function Ur(e, t) {
  return new e({ type: `null`, ...j(t) });
}
function Wr(e) {
  return new e({ type: `any` });
}
function Gr(e) {
  return new e({ type: `unknown` });
}
function Kr(e, t) {
  return new e({ type: `never`, ...j(t) });
}
function qr(e, t) {
  return new jt({ check: `less_than`, ...j(t), value: e, inclusive: !1 });
}
function Jr(e, t) {
  return new jt({ check: `less_than`, ...j(t), value: e, inclusive: !0 });
}
function Yr(e, t) {
  return new Mt({ check: `greater_than`, ...j(t), value: e, inclusive: !1 });
}
function Xr(e, t) {
  return new Mt({ check: `greater_than`, ...j(t), value: e, inclusive: !0 });
}
function Zr(e, t) {
  return new Nt({ check: `multiple_of`, ...j(t), value: e });
}
function Qr(e, t) {
  return new Ft({ check: `max_length`, ...j(t), maximum: e });
}
function $r(e, t) {
  return new It({ check: `min_length`, ...j(t), minimum: e });
}
function ei(e, t) {
  return new Lt({ check: `length_equals`, ...j(t), length: e });
}
function ti(e, t) {
  return new zt({ check: `string_format`, format: `regex`, ...j(t), pattern: e });
}
function ni(e) {
  return new Bt({ check: `string_format`, format: `lowercase`, ...j(e) });
}
function ri(e) {
  return new Vt({ check: `string_format`, format: `uppercase`, ...j(e) });
}
function ii(e, t) {
  return new Ht({ check: `string_format`, format: `includes`, ...j(t), includes: e });
}
function ai(e, t) {
  return new Ut({ check: `string_format`, format: `starts_with`, ...j(t), prefix: e });
}
function oi(e, t) {
  return new Wt({ check: `string_format`, format: `ends_with`, ...j(t), suffix: e });
}
function si(e) {
  return new Gt({ check: `overwrite`, tx: e });
}
function ci(e) {
  return si((t) => t.normalize(e));
}
function li() {
  return si((e) => e.trim());
}
function ui() {
  return si((e) => e.toLowerCase());
}
function di() {
  return si((e) => e.toUpperCase());
}
function fi() {
  return si((e) => de(e));
}
function pi(e, t, n) {
  return new e({ type: `array`, element: t, ...j(n) });
}
function mi(e, t, n) {
  return new e({ type: `custom`, check: `custom`, fn: t, ...j(n) });
}
function hi(e) {
  let t = gi(
    (n) => (
      (n.addIssue = (e) => {
        if (typeof e == `string`) n.issues.push(Me(e, n.value, t._zod.def));
        else {
          let r = e;
          r.fatal && (r.continue = !1),
            (r.code ??= `custom`),
            (r.input ??= n.value),
            (r.inst ??= t),
            (r.continue ??= !t._zod.def.abort),
            n.issues.push(Me(r));
        }
      }),
      e(n.value, n)
    ),
  );
  return t;
}
function gi(e, t) {
  let n = new kt({ check: `custom`, ...j(t) });
  return (n._zod.check = e), n;
}
function _i(e) {
  let t = e?.target ?? `draft-2020-12`;
  return (
    t === `draft-4` && (t = `draft-04`),
    t === `draft-7` && (t = `draft-07`),
    {
      processors: e.processors ?? {},
      metadataRegistry: e?.metadata ?? fr,
      target: t,
      unrepresentable: e?.unrepresentable ?? `throw`,
      override: e?.override ?? (() => {}),
      io: e?.io ?? `output`,
      counter: 0,
      seen: new Map(),
      cycles: e?.cycles ?? `ref`,
      reused: e?.reused ?? `inline`,
      external: e?.external ?? void 0,
    }
  );
}
function vi(e, t, n = { path: [], schemaPath: [] }) {
  var r;
  let i = e._zod.def,
    a = t.seen.get(e);
  if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
  let o = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, o);
  let s = e._zod.toJSONSchema?.();
  if (s) o.schema = s;
  else {
    let r = { ...n, schemaPath: [...n.schemaPath, e], path: n.path };
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
    else {
      let n = o.schema,
        a = t.processors[i.type];
      if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
      a(e, t, n, r);
    }
    let a = e._zod.parent;
    a && ((o.ref ||= a), vi(a, t, r), (t.seen.get(a).isParent = !0));
  }
  let c = t.metadataRegistry.get(e);
  return (
    c && Object.assign(o.schema, c),
    t.io === `input` && xi(e) && (delete o.schema.examples, delete o.schema.default),
    t.io === `input` &&
      o.schema._prefault &&
      ((r = o.schema).default ?? (r.default = o.schema._prefault)),
    delete o.schema._prefault,
    t.seen.get(e).schema
  );
}
function yi(e, t) {
  let n = e.seen.get(t);
  if (!n) throw Error(`Unprocessed schema. This is a bug in Zod.`);
  let r = new Map();
  for (let t of e.seen.entries()) {
    let n = e.metadataRegistry.get(t[0])?.id;
    if (n) {
      let e = r.get(n);
      if (e && e !== t[0])
        throw Error(
          `Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`,
        );
      r.set(n, t[0]);
    }
  }
  let i = (t) => {
      let r = e.target === `draft-2020-12` ? `$defs` : `definitions`;
      if (e.external) {
        let n = e.external.registry.get(t[0])?.id,
          i = e.external.uri ?? ((e) => e);
        if (n) return { ref: i(n) };
        let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
        return (t[1].defId = a), { defId: a, ref: `${i(`__shared`)}#/${r}/${a}` };
      }
      if (t[1] === n) return { ref: `#` };
      let i = `#/${r}/`,
        a = t[1].schema.id ?? `__schema${e.counter++}`;
      return { defId: a, ref: i + a };
    },
    a = (e) => {
      if (e[1].schema.$ref) return;
      let t = e[1],
        { ref: n, defId: r } = i(e);
      (t.def = { ...t.schema }), r && (t.defId = r);
      let a = t.schema;
      for (let e in a) delete a[e];
      a.$ref = n;
    };
  if (e.cycles === `throw`)
    for (let t of e.seen.entries()) {
      let e = t[1];
      if (e.cycle)
        throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let n of e.seen.entries()) {
    let r = n[1];
    if (t === n[0]) {
      a(n);
      continue;
    }
    if (e.external) {
      let r = e.external.registry.get(n[0])?.id;
      if (t !== n[0] && r) {
        a(n);
        continue;
      }
    }
    if (e.metadataRegistry.get(n[0])?.id) {
      a(n);
      continue;
    }
    if (r.cycle) {
      a(n);
      continue;
    }
    if (r.count > 1 && e.reused === `ref`) {
      a(n);
      continue;
    }
  }
}
function bi(e, t) {
  let n = e.seen.get(t);
  if (!n) throw Error(`Unprocessed schema. This is a bug in Zod.`);
  let r = (t) => {
    let n = e.seen.get(t);
    if (n.ref === null) return;
    let i = n.def ?? n.schema,
      a = { ...i },
      o = n.ref;
    if (((n.ref = null), o)) {
      r(o);
      let n = e.seen.get(o),
        s = n.schema;
      if (
        (s.$ref &&
        (e.target === `draft-07` || e.target === `draft-04` || e.target === `openapi-3.0`)
          ? ((i.allOf = i.allOf ?? []), i.allOf.push(s))
          : Object.assign(i, s),
        Object.assign(i, a),
        t._zod.parent === o)
      )
        for (let e in i) e === `$ref` || e === `allOf` || e in a || delete i[e];
      if (s.$ref && n.def)
        for (let e in i)
          e === `$ref` ||
            e === `allOf` ||
            (e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e]);
    }
    let s = t._zod.parent;
    if (s && s !== o) {
      r(s);
      let t = e.seen.get(s);
      if (t?.schema.$ref && ((i.$ref = t.schema.$ref), t.def))
        for (let e in i)
          e === `$ref` ||
            e === `allOf` ||
            (e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e]);
    }
    e.override({ zodSchema: t, jsonSchema: i, path: n.path ?? [] });
  };
  for (let t of [...e.seen.entries()].reverse()) r(t[0]);
  let i = {};
  if (
    (e.target === `draft-2020-12`
      ? (i.$schema = `https://json-schema.org/draft/2020-12/schema`)
      : e.target === `draft-07`
        ? (i.$schema = `http://json-schema.org/draft-07/schema#`)
        : e.target === `draft-04`
          ? (i.$schema = `http://json-schema.org/draft-04/schema#`)
          : e.target,
    e.external?.uri)
  ) {
    let n = e.external.registry.get(t)?.id;
    if (!n) throw Error("Schema is missing an `id` property");
    i.$id = e.external.uri(n);
  }
  Object.assign(i, n.def ?? n.schema);
  let a = e.external?.defs ?? {};
  for (let t of e.seen.entries()) {
    let e = t[1];
    e.def && e.defId && (a[e.defId] = e.def);
  }
  e.external ||
    (Object.keys(a).length > 0 &&
      (e.target === `draft-2020-12` ? (i.$defs = a) : (i.definitions = a)));
  try {
    let n = JSON.parse(JSON.stringify(i));
    return (
      Object.defineProperty(n, `~standard`, {
        value: {
          ...t[`~standard`],
          jsonSchema: {
            input: Ci(t, `input`, e.processors),
            output: Ci(t, `output`, e.processors),
          },
        },
        enumerable: !1,
        writable: !1,
      }),
      n
    );
  } catch {
    throw Error(`Error converting schema to JSON.`);
  }
}
function xi(e, t) {
  let n = t ?? { seen: new Set() };
  if (n.seen.has(e)) return !1;
  n.seen.add(e);
  let r = e._zod.def;
  if (r.type === `transform`) return !0;
  if (r.type === `array`) return xi(r.element, n);
  if (r.type === `set`) return xi(r.valueType, n);
  if (r.type === `lazy`) return xi(r.getter(), n);
  if (
    r.type === `promise` ||
    r.type === `optional` ||
    r.type === `nonoptional` ||
    r.type === `nullable` ||
    r.type === `readonly` ||
    r.type === `default` ||
    r.type === `prefault`
  )
    return xi(r.innerType, n);
  if (r.type === `intersection`) return xi(r.left, n) || xi(r.right, n);
  if (r.type === `record` || r.type === `map`) return xi(r.keyType, n) || xi(r.valueType, n);
  if (r.type === `pipe`) return xi(r.in, n) || xi(r.out, n);
  if (r.type === `object`) {
    for (let e in r.shape) if (xi(r.shape[e], n)) return !0;
    return !1;
  }
  if (r.type === `union`) {
    for (let e of r.options) if (xi(e, n)) return !0;
    return !1;
  }
  if (r.type === `tuple`) {
    for (let e of r.items) if (xi(e, n)) return !0;
    return !!(r.rest && xi(r.rest, n));
  }
  return !1;
}
var Si =
    (e, t = {}) =>
    (n) => {
      let r = _i({ ...n, processors: t });
      return vi(e, r), yi(r, e), bi(r, e);
    },
  Ci =
    (e, t, n = {}) =>
    (r) => {
      let { libraryOptions: i, target: a } = r ?? {},
        o = _i({ ...(i ?? {}), target: a, io: t, processors: n });
      return vi(e, o), yi(o, e), bi(o, e);
    },
  wi = { guid: `uuid`, url: `uri`, datetime: `date-time`, json_string: `json-string`, regex: `` },
  Ti = (e, t, n, r) => {
    let i = n;
    i.type = `string`;
    let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
    if (
      (typeof a == `number` && (i.minLength = a),
      typeof o == `number` && (i.maxLength = o),
      s &&
        ((i.format = wi[s] ?? s),
        i.format === `` && delete i.format,
        s === `time` && delete i.format),
      l && (i.contentEncoding = l),
      c && c.size > 0)
    ) {
      let e = [...c];
      e.length === 1
        ? (i.pattern = e[0].source)
        : e.length > 1 &&
          (i.allOf = [
            ...e.map((e) => ({
              ...(t.target === `draft-07` || t.target === `draft-04` || t.target === `openapi-3.0`
                ? { type: `string` }
                : {}),
              pattern: e.source,
            })),
          ]);
    }
  },
  Ei = (e, t, n, r) => {
    let i = n,
      {
        minimum: a,
        maximum: o,
        format: s,
        multipleOf: c,
        exclusiveMaximum: l,
        exclusiveMinimum: u,
      } = e._zod.bag;
    typeof s == `string` && s.includes(`int`) ? (i.type = `integer`) : (i.type = `number`),
      typeof u == `number` &&
        (t.target === `draft-04` || t.target === `openapi-3.0`
          ? ((i.minimum = u), (i.exclusiveMinimum = !0))
          : (i.exclusiveMinimum = u)),
      typeof a == `number` &&
        ((i.minimum = a),
        typeof u == `number` &&
          t.target !== `draft-04` &&
          (u >= a ? delete i.minimum : delete i.exclusiveMinimum)),
      typeof l == `number` &&
        (t.target === `draft-04` || t.target === `openapi-3.0`
          ? ((i.maximum = l), (i.exclusiveMaximum = !0))
          : (i.exclusiveMaximum = l)),
      typeof o == `number` &&
        ((i.maximum = o),
        typeof l == `number` &&
          t.target !== `draft-04` &&
          (l <= o ? delete i.maximum : delete i.exclusiveMaximum)),
      typeof c == `number` && (i.multipleOf = c);
  },
  Di = (e, t, n, r) => {
    n.type = `boolean`;
  },
  Oi = (e, t, n, r) => {
    t.target === `openapi-3.0`
      ? ((n.type = `string`), (n.nullable = !0), (n.enum = [null]))
      : (n.type = `null`);
  },
  ki = (e, t, n, r) => {
    n.not = {};
  },
  Ai = (e, t, n, r) => {
    let i = e._zod.def,
      a = ne(i.entries);
    a.every((e) => typeof e == `number`) && (n.type = `number`),
      a.every((e) => typeof e == `string`) && (n.type = `string`),
      (n.enum = a);
  },
  ji = (e, t, n, r) => {
    let i = e._zod.def,
      a = [];
    for (let e of i.values)
      if (e === void 0) {
        if (t.unrepresentable === `throw`)
          throw Error("Literal `undefined` cannot be represented in JSON Schema");
      } else if (typeof e == `bigint`) {
        if (t.unrepresentable === `throw`)
          throw Error(`BigInt literals cannot be represented in JSON Schema`);
        a.push(Number(e));
      } else a.push(e);
    if (a.length !== 0)
      if (a.length === 1) {
        let e = a[0];
        (n.type = e === null ? `null` : typeof e),
          t.target === `draft-04` || t.target === `openapi-3.0` ? (n.enum = [e]) : (n.const = e);
      } else
        a.every((e) => typeof e == `number`) && (n.type = `number`),
          a.every((e) => typeof e == `string`) && (n.type = `string`),
          a.every((e) => typeof e == `boolean`) && (n.type = `boolean`),
          a.every((e) => e === null) && (n.type = `null`),
          (n.enum = a);
  },
  Mi = (e, t, n, r) => {
    if (t.unrepresentable === `throw`)
      throw Error(`Custom types cannot be represented in JSON Schema`);
  },
  Ni = (e, t, n, r) => {
    if (t.unrepresentable === `throw`)
      throw Error(`Transforms cannot be represented in JSON Schema`);
  },
  Pi = (e, t, n, r) => {
    let i = n,
      a = e._zod.def,
      { minimum: o, maximum: s } = e._zod.bag;
    typeof o == `number` && (i.minItems = o),
      typeof s == `number` && (i.maxItems = s),
      (i.type = `array`),
      (i.items = vi(a.element, t, { ...r, path: [...r.path, `items`] }));
  },
  Fi = (e, t, n, r) => {
    let i = n,
      a = e._zod.def;
    (i.type = `object`), (i.properties = {});
    let o = a.shape;
    for (let e in o) i.properties[e] = vi(o[e], t, { ...r, path: [...r.path, `properties`, e] });
    let s = new Set(Object.keys(o)),
      c = new Set(
        [...s].filter((e) => {
          let n = a.shape[e]._zod;
          return t.io === `input` ? n.optin === void 0 : n.optout === void 0;
        }),
      );
    c.size > 0 && (i.required = Array.from(c)),
      a.catchall?._zod.def.type === `never`
        ? (i.additionalProperties = !1)
        : a.catchall
          ? a.catchall &&
            (i.additionalProperties = vi(a.catchall, t, {
              ...r,
              path: [...r.path, `additionalProperties`],
            }))
          : t.io === `output` && (i.additionalProperties = !1);
  },
  Ii = (e, t, n, r) => {
    let i = e._zod.def,
      a = i.inclusive === !1,
      o = i.options.map((e, n) => vi(e, t, { ...r, path: [...r.path, a ? `oneOf` : `anyOf`, n] }));
    a ? (n.oneOf = o) : (n.anyOf = o);
  },
  Li = (e, t, n, r) => {
    let i = e._zod.def,
      a = vi(i.left, t, { ...r, path: [...r.path, `allOf`, 0] }),
      o = vi(i.right, t, { ...r, path: [...r.path, `allOf`, 1] }),
      s = (e) => `allOf` in e && Object.keys(e).length === 1;
    n.allOf = [...(s(a) ? a.allOf : [a]), ...(s(o) ? o.allOf : [o])];
  },
  Ri = (e, t, n, r) => {
    let i = n,
      a = e._zod.def;
    i.type = `object`;
    let o = a.keyType,
      s = o._zod.bag?.patterns;
    if (a.mode === `loose` && s && s.size > 0) {
      let e = vi(a.valueType, t, { ...r, path: [...r.path, `patternProperties`, `*`] });
      i.patternProperties = {};
      for (let t of s) i.patternProperties[t.source] = e;
    } else
      (t.target === `draft-07` || t.target === `draft-2020-12`) &&
        (i.propertyNames = vi(a.keyType, t, { ...r, path: [...r.path, `propertyNames`] })),
        (i.additionalProperties = vi(a.valueType, t, {
          ...r,
          path: [...r.path, `additionalProperties`],
        }));
    let c = o._zod.values;
    if (c) {
      let e = [...c].filter((e) => typeof e == `string` || typeof e == `number`);
      e.length > 0 && (i.required = e);
    }
  },
  zi = (e, t, n, r) => {
    let i = e._zod.def,
      a = vi(i.innerType, t, r),
      o = t.seen.get(e);
    t.target === `openapi-3.0`
      ? ((o.ref = i.innerType), (n.nullable = !0))
      : (n.anyOf = [a, { type: `null` }]);
  },
  Bi = (e, t, n, r) => {
    let i = e._zod.def;
    vi(i.innerType, t, r);
    let a = t.seen.get(e);
    a.ref = i.innerType;
  },
  N = (e, t, n, r) => {
    let i = e._zod.def;
    vi(i.innerType, t, r);
    let a = t.seen.get(e);
    (a.ref = i.innerType), (n.default = JSON.parse(JSON.stringify(i.defaultValue)));
  },
  Vi = (e, t, n, r) => {
    let i = e._zod.def;
    vi(i.innerType, t, r);
    let a = t.seen.get(e);
    (a.ref = i.innerType),
      t.io === `input` && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
  },
  Hi = (e, t, n, r) => {
    let i = e._zod.def;
    vi(i.innerType, t, r);
    let a = t.seen.get(e);
    a.ref = i.innerType;
    let o;
    try {
      o = i.catchValue(void 0);
    } catch {
      throw Error(`Dynamic catch values are not supported in JSON Schema`);
    }
    n.default = o;
  },
  Ui = (e, t, n, r) => {
    let i = e._zod.def,
      a = t.io === `input` ? (i.in._zod.def.type === `transform` ? i.out : i.in) : i.out;
    vi(a, t, r);
    let o = t.seen.get(e);
    o.ref = a;
  },
  Wi = (e, t, n, r) => {
    let i = e._zod.def;
    vi(i.innerType, t, r);
    let a = t.seen.get(e);
    (a.ref = i.innerType), (n.readOnly = !0);
  },
  Gi = (e, t, n, r) => {
    let i = e._zod.def;
    vi(i.innerType, t, r);
    let a = t.seen.get(e);
    a.ref = i.innerType;
  },
  Ki = (e, t, n, r) => {
    let i = e._zod.innerType;
    vi(i, t, r);
    let a = t.seen.get(e);
    a.ref = i;
  },
  qi = w(`ZodISODateTime`, (e, t) => {
    cn.init(e, t), _a.init(e, t);
  });
function Ji(e) {
  return Ir(qi, e);
}
var Yi = w(`ZodISODate`, (e, t) => {
  ln.init(e, t), _a.init(e, t);
});
function Xi(e) {
  return Lr(Yi, e);
}
var Zi = w(`ZodISOTime`, (e, t) => {
  un.init(e, t), _a.init(e, t);
});
function Qi(e) {
  return Rr(Zi, e);
}
var $i = w(`ZodISODuration`, (e, t) => {
  dn.init(e, t), _a.init(e, t);
});
function ea(e) {
  return zr($i, e);
}
var ta = (e, t) => {
  Pe.init(e, t),
    (e.name = `ZodError`),
    Object.defineProperties(e, {
      format: { value: (t) => Le(e, t) },
      flatten: { value: (t) => Ie(e, t) },
      addIssue: {
        value: (t) => {
          e.issues.push(t), (e.message = JSON.stringify(e.issues, re, 2));
        },
      },
      addIssues: {
        value: (t) => {
          e.issues.push(...t), (e.message = JSON.stringify(e.issues, re, 2));
        },
      },
      isEmpty: {
        get() {
          return e.issues.length === 0;
        },
      },
    });
};
w(`ZodError`, ta);
var na = w(`ZodError`, ta, { Parent: Error }),
  ra = Re(na),
  ia = ze(na),
  aa = Be(na),
  oa = He(na),
  sa = We(na),
  ca = Ge(na),
  la = Ke(na),
  ua = qe(na),
  da = Je(na),
  fa = Ye(na),
  pa = Xe(na),
  ma = Ze(na),
  P = w(
    `ZodType`,
    (e, t) => (
      M.init(e, t),
      Object.assign(e[`~standard`], {
        jsonSchema: { input: Ci(e, `input`), output: Ci(e, `output`) },
      }),
      (e.toJSONSchema = Si(e, {})),
      (e.def = t),
      (e.type = t.type),
      Object.defineProperty(e, `_def`, { value: t }),
      (e.check = (...n) =>
        e.clone(
          le(t, {
            checks: [
              ...(t.checks ?? []),
              ...n.map((e) =>
                typeof e == `function`
                  ? { _zod: { check: e, def: { check: `custom` }, onattach: [] } }
                  : e,
              ),
            ],
          }),
          { parent: !0 },
        )),
      (e.with = e.check),
      (e.clone = (t, n) => _e(e, t, n)),
      (e.brand = () => e),
      (e.register = (t, n) => (t.add(e, n), e)),
      (e.parse = (t, n) => ra(e, t, n, { callee: e.parse })),
      (e.safeParse = (t, n) => aa(e, t, n)),
      (e.parseAsync = async (t, n) => ia(e, t, n, { callee: e.parseAsync })),
      (e.safeParseAsync = async (t, n) => oa(e, t, n)),
      (e.spa = e.safeParseAsync),
      (e.encode = (t, n) => sa(e, t, n)),
      (e.decode = (t, n) => ca(e, t, n)),
      (e.encodeAsync = async (t, n) => la(e, t, n)),
      (e.decodeAsync = async (t, n) => ua(e, t, n)),
      (e.safeEncode = (t, n) => da(e, t, n)),
      (e.safeDecode = (t, n) => fa(e, t, n)),
      (e.safeEncodeAsync = async (t, n) => pa(e, t, n)),
      (e.safeDecodeAsync = async (t, n) => ma(e, t, n)),
      (e.refine = (t, n) => e.check(Ao(t, n))),
      (e.superRefine = (t) => e.check(jo(t))),
      (e.overwrite = (t) => e.check(si(t))),
      (e.optional = () => fo(e)),
      (e.exactOptional = () => mo(e)),
      (e.nullable = () => B(e)),
      (e.nullish = () => fo(B(e))),
      (e.nonoptional = (t) => bo(e, t)),
      (e.array = () => Za(e)),
      (e.or = (t) => eo([e, t])),
      (e.and = (t) => no(e, t)),
      (e.transform = (t) => wo(e, lo(t))),
      (e.default = (t) => go(e, t)),
      (e.prefault = (t) => vo(e, t)),
      (e.catch = (t) => So(e, t)),
      (e.pipe = (t) => wo(e, t)),
      (e.readonly = () => Eo(e)),
      (e.describe = (t) => {
        let n = e.clone();
        return fr.add(n, { description: t }), n;
      }),
      Object.defineProperty(e, `description`, {
        get() {
          return fr.get(e)?.description;
        },
        configurable: !0,
      }),
      (e.meta = (...t) => {
        if (t.length === 0) return fr.get(e);
        let n = e.clone();
        return fr.add(n, t[0]), n;
      }),
      (e.isOptional = () => e.safeParse(void 0).success),
      (e.isNullable = () => e.safeParse(null).success),
      (e.apply = (t) => t(e)),
      e
    ),
  ),
  ha = w(`_ZodString`, (e, t) => {
    Jt.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Ti(e, t, n, r));
    let n = e._zod.bag;
    (e.format = n.format ?? null),
      (e.minLength = n.minimum ?? null),
      (e.maxLength = n.maximum ?? null),
      (e.regex = (...t) => e.check(ti(...t))),
      (e.includes = (...t) => e.check(ii(...t))),
      (e.startsWith = (...t) => e.check(ai(...t))),
      (e.endsWith = (...t) => e.check(oi(...t))),
      (e.min = (...t) => e.check($r(...t))),
      (e.max = (...t) => e.check(Qr(...t))),
      (e.length = (...t) => e.check(ei(...t))),
      (e.nonempty = (...t) => e.check($r(1, ...t))),
      (e.lowercase = (t) => e.check(ni(t))),
      (e.uppercase = (t) => e.check(ri(t))),
      (e.trim = () => e.check(li())),
      (e.normalize = (...t) => e.check(ci(...t))),
      (e.toLowerCase = () => e.check(ui())),
      (e.toUpperCase = () => e.check(di())),
      (e.slugify = () => e.check(fi()));
  }),
  ga = w(`ZodString`, (e, t) => {
    Jt.init(e, t),
      ha.init(e, t),
      (e.email = (t) => e.check(mr(va, t))),
      (e.url = (t) => e.check(br(xa, t))),
      (e.jwt = (t) => e.check(Fr(Ia, t))),
      (e.emoji = (t) => e.check(xr(Sa, t))),
      (e.guid = (t) => e.check(hr(ya, t))),
      (e.uuid = (t) => e.check(gr(ba, t))),
      (e.uuidv4 = (t) => e.check(_r(ba, t))),
      (e.uuidv6 = (t) => e.check(vr(ba, t))),
      (e.uuidv7 = (t) => e.check(yr(ba, t))),
      (e.nanoid = (t) => e.check(Sr(Ca, t))),
      (e.guid = (t) => e.check(hr(ya, t))),
      (e.cuid = (t) => e.check(Cr(wa, t))),
      (e.cuid2 = (t) => e.check(wr(Ta, t))),
      (e.ulid = (t) => e.check(Tr(Ea, t))),
      (e.base64 = (t) => e.check(Mr(Na, t))),
      (e.base64url = (t) => e.check(Nr(Pa, t))),
      (e.xid = (t) => e.check(Er(Da, t))),
      (e.ksuid = (t) => e.check(Dr(Oa, t))),
      (e.ipv4 = (t) => e.check(Or(ka, t))),
      (e.ipv6 = (t) => e.check(kr(Aa, t))),
      (e.cidrv4 = (t) => e.check(Ar(ja, t))),
      (e.cidrv6 = (t) => e.check(jr(Ma, t))),
      (e.e164 = (t) => e.check(Pr(Fa, t))),
      (e.datetime = (t) => e.check(Ji(t))),
      (e.date = (t) => e.check(Xi(t))),
      (e.time = (t) => e.check(Qi(t))),
      (e.duration = (t) => e.check(ea(t)));
  });
function F(e) {
  return pr(ga, e);
}
var _a = w(`ZodStringFormat`, (e, t) => {
    Yt.init(e, t), ha.init(e, t);
  }),
  va = w(`ZodEmail`, (e, t) => {
    Qt.init(e, t), _a.init(e, t);
  }),
  ya = w(`ZodGUID`, (e, t) => {
    Xt.init(e, t), _a.init(e, t);
  }),
  ba = w(`ZodUUID`, (e, t) => {
    Zt.init(e, t), _a.init(e, t);
  }),
  xa = w(`ZodURL`, (e, t) => {
    $t.init(e, t), _a.init(e, t);
  }),
  Sa = w(`ZodEmoji`, (e, t) => {
    en.init(e, t), _a.init(e, t);
  }),
  Ca = w(`ZodNanoID`, (e, t) => {
    tn.init(e, t), _a.init(e, t);
  }),
  wa = w(`ZodCUID`, (e, t) => {
    nn.init(e, t), _a.init(e, t);
  }),
  Ta = w(`ZodCUID2`, (e, t) => {
    rn.init(e, t), _a.init(e, t);
  }),
  Ea = w(`ZodULID`, (e, t) => {
    an.init(e, t), _a.init(e, t);
  }),
  Da = w(`ZodXID`, (e, t) => {
    on.init(e, t), _a.init(e, t);
  }),
  Oa = w(`ZodKSUID`, (e, t) => {
    sn.init(e, t), _a.init(e, t);
  }),
  ka = w(`ZodIPv4`, (e, t) => {
    fn.init(e, t), _a.init(e, t);
  }),
  Aa = w(`ZodIPv6`, (e, t) => {
    pn.init(e, t), _a.init(e, t);
  }),
  ja = w(`ZodCIDRv4`, (e, t) => {
    mn.init(e, t), _a.init(e, t);
  }),
  Ma = w(`ZodCIDRv6`, (e, t) => {
    hn.init(e, t), _a.init(e, t);
  }),
  Na = w(`ZodBase64`, (e, t) => {
    _n.init(e, t), _a.init(e, t);
  }),
  Pa = w(`ZodBase64URL`, (e, t) => {
    yn.init(e, t), _a.init(e, t);
  }),
  Fa = w(`ZodE164`, (e, t) => {
    bn.init(e, t), _a.init(e, t);
  }),
  Ia = w(`ZodJWT`, (e, t) => {
    Sn.init(e, t), _a.init(e, t);
  }),
  La = w(`ZodNumber`, (e, t) => {
    Cn.init(e, t),
      P.init(e, t),
      (e._zod.processJSONSchema = (t, n, r) => Ei(e, t, n, r)),
      (e.gt = (t, n) => e.check(Yr(t, n))),
      (e.gte = (t, n) => e.check(Xr(t, n))),
      (e.min = (t, n) => e.check(Xr(t, n))),
      (e.lt = (t, n) => e.check(qr(t, n))),
      (e.lte = (t, n) => e.check(Jr(t, n))),
      (e.max = (t, n) => e.check(Jr(t, n))),
      (e.int = (t) => e.check(Ba(t))),
      (e.safe = (t) => e.check(Ba(t))),
      (e.positive = (t) => e.check(Yr(0, t))),
      (e.nonnegative = (t) => e.check(Xr(0, t))),
      (e.negative = (t) => e.check(qr(0, t))),
      (e.nonpositive = (t) => e.check(Jr(0, t))),
      (e.multipleOf = (t, n) => e.check(Zr(t, n))),
      (e.step = (t, n) => e.check(Zr(t, n))),
      (e.finite = () => e);
    let n = e._zod.bag;
    (e.minValue = Math.max(n.minimum ?? -1 / 0, n.exclusiveMinimum ?? -1 / 0) ?? null),
      (e.maxValue = Math.min(n.maximum ?? 1 / 0, n.exclusiveMaximum ?? 1 / 0) ?? null),
      (e.isInt = (n.format ?? ``).includes(`int`) || Number.isSafeInteger(n.multipleOf ?? 0.5)),
      (e.isFinite = !0),
      (e.format = n.format ?? null);
  });
function Ra(e) {
  return Br(La, e);
}
var za = w(`ZodNumberFormat`, (e, t) => {
  wn.init(e, t), La.init(e, t);
});
function Ba(e) {
  return Vr(za, e);
}
var Va = w(`ZodBoolean`, (e, t) => {
  Tn.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Di(e, t, n, r));
});
function I(e) {
  return Hr(Va, e);
}
var Ha = w(`ZodNull`, (e, t) => {
  En.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Oi(e, t, n, r));
});
function Ua(e) {
  return Ur(Ha, e);
}
var Wa = w(`ZodAny`, (e, t) => {
  Dn.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (e, t, n) => void 0);
});
function Ga() {
  return Wr(Wa);
}
var Ka = w(`ZodUnknown`, (e, t) => {
  On.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (e, t, n) => void 0);
});
function qa() {
  return Gr(Ka);
}
var Ja = w(`ZodNever`, (e, t) => {
  kn.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (t, n, r) => ki(e, t, n, r));
});
function Ya(e) {
  return Kr(Ja, e);
}
var Xa = w(`ZodArray`, (e, t) => {
  jn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Pi(e, t, n, r)),
    (e.element = t.element),
    (e.min = (t, n) => e.check($r(t, n))),
    (e.nonempty = (t) => e.check($r(1, t))),
    (e.max = (t, n) => e.check(Qr(t, n))),
    (e.length = (t, n) => e.check(ei(t, n))),
    (e.unwrap = () => e.element);
});
function Za(e, t) {
  return pi(Xa, e, t);
}
var Qa = w(`ZodObject`, (e, t) => {
  In.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Fi(e, t, n, r)),
    D(e, `shape`, () => t.shape),
    (e.keyof = () => R(Object.keys(e._zod.def.shape))),
    (e.catchall = (t) => e.clone({ ...e._zod.def, catchall: t })),
    (e.passthrough = () => e.clone({ ...e._zod.def, catchall: qa() })),
    (e.loose = () => e.clone({ ...e._zod.def, catchall: qa() })),
    (e.strict = () => e.clone({ ...e._zod.def, catchall: Ya() })),
    (e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 })),
    (e.extend = (t) => Se(e, t)),
    (e.safeExtend = (t) => Ce(e, t)),
    (e.merge = (t) => we(e, t)),
    (e.pick = (t) => be(e, t)),
    (e.omit = (t) => xe(e, t)),
    (e.partial = (...t) => Te(uo, e, t[0])),
    (e.required = (...t) => Ee(yo, e, t[0]));
});
function L(e, t) {
  return new Qa({ type: `object`, shape: e ?? {}, ...j(t) });
}
var $a = w(`ZodUnion`, (e, t) => {
  Rn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Ii(e, t, n, r)),
    (e.options = t.options);
});
function eo(e, t) {
  return new $a({ type: `union`, options: e, ...j(t) });
}
var to = w(`ZodIntersection`, (e, t) => {
  zn.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Li(e, t, n, r));
});
function no(e, t) {
  return new to({ type: `intersection`, left: e, right: t });
}
var ro = w(`ZodRecord`, (e, t) => {
  Hn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Ri(e, t, n, r)),
    (e.keyType = t.keyType),
    (e.valueType = t.valueType);
});
function io(e, t, n) {
  return new ro({ type: `record`, keyType: e, valueType: t, ...j(n) });
}
var ao = w(`ZodEnum`, (e, t) => {
  Un.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Ai(e, t, n, r)),
    (e.enum = t.entries),
    (e.options = Object.values(t.entries));
  let n = new Set(Object.keys(t.entries));
  (e.extract = (e, r) => {
    let i = {};
    for (let r of e)
      if (n.has(r)) i[r] = t.entries[r];
      else throw Error(`Key ${r} not found in enum`);
    return new ao({ ...t, checks: [], ...j(r), entries: i });
  }),
    (e.exclude = (e, r) => {
      let i = { ...t.entries };
      for (let t of e)
        if (n.has(t)) delete i[t];
        else throw Error(`Key ${t} not found in enum`);
      return new ao({ ...t, checks: [], ...j(r), entries: i });
    });
});
function R(e, t) {
  return new ao({
    type: `enum`,
    entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
    ...j(t),
  });
}
var oo = w(`ZodLiteral`, (e, t) => {
  Wn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => ji(e, t, n, r)),
    (e.values = new Set(t.values)),
    Object.defineProperty(e, `value`, {
      get() {
        if (t.values.length > 1)
          throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
        return t.values[0];
      },
    });
});
function so(e, t) {
  return new oo({ type: `literal`, values: Array.isArray(e) ? e : [e], ...j(t) });
}
var co = w(`ZodTransform`, (e, t) => {
  Gn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Ni(e, t, n, r)),
    (e._zod.parse = (n, r) => {
      if (r.direction === `backward`) throw new T(e.constructor.name);
      n.addIssue = (r) => {
        if (typeof r == `string`) n.issues.push(Me(r, n.value, t));
        else {
          let t = r;
          t.fatal && (t.continue = !1),
            (t.code ??= `custom`),
            (t.input ??= n.value),
            (t.inst ??= e),
            n.issues.push(Me(t));
        }
      };
      let i = t.transform(n.value, n);
      return i instanceof Promise ? i.then((e) => ((n.value = e), n)) : ((n.value = i), n);
    });
});
function lo(e) {
  return new co({ type: `transform`, transform: e });
}
var uo = w(`ZodOptional`, (e, t) => {
  qn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Gi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType);
});
function fo(e) {
  return new uo({ type: `optional`, innerType: e });
}
var po = w(`ZodExactOptional`, (e, t) => {
  Jn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Gi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType);
});
function mo(e) {
  return new po({ type: `optional`, innerType: e });
}
var z = w(`ZodNullable`, (e, t) => {
  Yn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => zi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType);
});
function B(e) {
  return new z({ type: `nullable`, innerType: e });
}
var ho = w(`ZodDefault`, (e, t) => {
  Xn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => N(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType),
    (e.removeDefault = e.unwrap);
});
function go(e, t) {
  return new ho({
    type: `default`,
    innerType: e,
    get defaultValue() {
      return typeof t == `function` ? t() : me(t);
    },
  });
}
var _o = w(`ZodPrefault`, (e, t) => {
  Qn.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Vi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType);
});
function vo(e, t) {
  return new _o({
    type: `prefault`,
    innerType: e,
    get defaultValue() {
      return typeof t == `function` ? t() : me(t);
    },
  });
}
var yo = w(`ZodNonOptional`, (e, t) => {
  $n.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Bi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType);
});
function bo(e, t) {
  return new yo({ type: `nonoptional`, innerType: e, ...j(t) });
}
var xo = w(`ZodCatch`, (e, t) => {
  tr.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Hi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType),
    (e.removeCatch = e.unwrap);
});
function So(e, t) {
  return new xo({ type: `catch`, innerType: e, catchValue: typeof t == `function` ? t : () => t });
}
var Co = w(`ZodPipe`, (e, t) => {
  nr.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Ui(e, t, n, r)),
    (e.in = t.in),
    (e.out = t.out);
});
function wo(e, t) {
  return new Co({ type: `pipe`, in: e, out: t });
}
var To = w(`ZodReadonly`, (e, t) => {
  ir.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Wi(e, t, n, r)),
    (e.unwrap = () => e._zod.def.innerType);
});
function Eo(e) {
  return new To({ type: `readonly`, innerType: e });
}
var Do = w(`ZodLazy`, (e, t) => {
  or.init(e, t),
    P.init(e, t),
    (e._zod.processJSONSchema = (t, n, r) => Ki(e, t, n, r)),
    (e.unwrap = () => e._zod.def.getter());
});
function Oo(e) {
  return new Do({ type: `lazy`, getter: e });
}
var ko = w(`ZodCustom`, (e, t) => {
  sr.init(e, t), P.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Mi(e, t, n, r));
});
function Ao(e, t = {}) {
  return mi(ko, e, t);
}
function jo(e) {
  return hi(e);
}
var Mo = eo([F(), Ra(), I(), Ua(), L({ $state: F() })]);
eo([F(), L({ $state: F() })]), eo([Ra(), L({ $state: F() })]), eo([I(), L({ $state: F() })]);
function No(e) {
  return e.replace(/~1/g, `/`).replace(/~0/g, `~`);
}
function Po(e) {
  return (e.startsWith(`/`) ? e.slice(1).split(`/`) : e.split(`/`)).map(No);
}
function Fo(e, t) {
  if (!t || t === `/`) return e;
  let n = Po(t),
    r = e;
  for (let e of n) {
    if (r == null) return;
    if (Array.isArray(r)) r = r[parseInt(e, 10)];
    else if (typeof r == `object`) r = r[e];
    else return;
  }
  return r;
}
function Io(e) {
  return /^\d+$/.test(e);
}
function Lo(e, t, n) {
  let r = Po(t);
  if (r.length === 0) return;
  let i = e;
  for (let e = 0; e < r.length - 1; e++) {
    let t = r[e],
      n = r[e + 1],
      a = n !== void 0 && (Io(n) || n === `-`);
    if (Array.isArray(i)) {
      let e = parseInt(t, 10);
      (i[e] === void 0 || typeof i[e] != `object`) && (i[e] = a ? [] : {}), (i = i[e]);
    } else (!(t in i) || typeof i[t] != `object`) && (i[t] = a ? [] : {}), (i = i[t]);
  }
  let a = r[r.length - 1];
  if (Array.isArray(i))
    if (a === `-`) i.push(n);
    else {
      let e = parseInt(a, 10);
      i[e] = n;
    }
  else i[a] = n;
}
function Ro(e, t, n) {
  let r = Po(t);
  if (r.length === 0) return;
  let i = e;
  for (let e = 0; e < r.length - 1; e++) {
    let t = r[e],
      n = r[e + 1],
      a = n !== void 0 && (Io(n) || n === `-`);
    if (Array.isArray(i)) {
      let e = parseInt(t, 10);
      (i[e] === void 0 || typeof i[e] != `object`) && (i[e] = a ? [] : {}), (i = i[e]);
    } else (!(t in i) || typeof i[t] != `object`) && (i[t] = a ? [] : {}), (i = i[t]);
  }
  let a = r[r.length - 1];
  if (Array.isArray(i))
    if (a === `-`) i.push(n);
    else {
      let e = parseInt(a, 10);
      i.splice(e, 0, n);
    }
  else i[a] = n;
}
function zo(e, t) {
  let n = Po(t);
  if (n.length === 0) return;
  let r = e;
  for (let e = 0; e < n.length - 1; e++) {
    let t = n[e];
    if (Array.isArray(r)) {
      let e = parseInt(t, 10);
      if (r[e] === void 0 || typeof r[e] != `object`) return;
      r = r[e];
    } else {
      if (!(t in r) || typeof r[t] != `object`) return;
      r = r[t];
    }
  }
  let i = n[n.length - 1];
  if (Array.isArray(r)) {
    let e = parseInt(i, 10);
    e >= 0 && e < r.length && r.splice(e, 1);
  } else delete r[i];
}
function Bo(e, t) {
  if (e === t) return !0;
  if (e === null || t === null || typeof e != typeof t || typeof e != `object`) return !1;
  if (Array.isArray(e))
    return !Array.isArray(t) || e.length !== t.length ? !1 : e.every((e, n) => Bo(e, t[n]));
  let n = e,
    r = t,
    i = Object.keys(n),
    a = Object.keys(r);
  return i.length === a.length ? i.every((e) => Bo(n[e], r[e])) : !1;
}
function Vo(e) {
  let t = e.trim();
  if (!t || !t.startsWith(`{`)) return null;
  try {
    let e = JSON.parse(t);
    return e.op && e.path !== void 0 ? e : null;
  } catch {
    return null;
  }
}
function Ho(e, t) {
  switch (t.op) {
    case `add`:
      Ro(e, t.path, t.value);
      break;
    case `replace`:
      Lo(e, t.path, t.value);
      break;
    case `remove`:
      zo(e, t.path);
      break;
    case `move`: {
      if (!t.from) break;
      let n = Fo(e, t.from);
      zo(e, t.from), Ro(e, t.path, n);
      break;
    }
    case `copy`: {
      if (!t.from) break;
      let n = Fo(e, t.from);
      Ro(e, t.path, n);
      break;
    }
    case `test`:
      if (!Bo(Fo(e, t.path), t.value))
        throw Error(`Test operation failed: value at "${t.path}" does not match`);
      break;
  }
  return e;
}
function Uo(e = {}) {
  let t = { ...e },
    n = ``,
    r = [],
    i = new Set();
  return {
    push(e) {
      n += e;
      let a = [],
        o = n.split(`
`);
      n = o.pop() || ``;
      for (let e of o) {
        let n = e.trim();
        if (!n || i.has(n)) continue;
        i.add(n);
        let o = Vo(n);
        o && (Ho(t, o), r.push(o), a.push(o));
      }
      return a.length > 0 && (t = { ...t }), { result: t, newPatches: a };
    },
    getResult() {
      if (n.trim()) {
        let e = Vo(n);
        e && !i.has(n.trim()) && (i.add(n.trim()), Ho(t, e), r.push(e), (t = { ...t })), (n = ``);
      }
      return t;
    },
    getPatches() {
      return [...r];
    },
    reset(e = {}) {
      (t = { ...e }), (n = ``), (r.length = 0), i.clear();
    },
  };
}
var Wo = eo([Ra(), L({ $state: F() })]),
  Go = {
    eq: qa().optional(),
    neq: qa().optional(),
    gt: Wo.optional(),
    gte: Wo.optional(),
    lt: Wo.optional(),
    lte: Wo.optional(),
    not: so(!0).optional(),
  },
  Ko = eo([L({ $state: F(), ...Go }), L({ $item: F(), ...Go }), L({ $index: so(!0), ...Go })]),
  qo = Oo(() => eo([I(), Ko, Za(Ko), L({ $and: Za(qo) }), L({ $or: Za(qo) })]));
function Jo(e, t) {
  return typeof e == `object` && e && `$state` in e && typeof e.$state == `string`
    ? Fo(t.stateModel, e.$state)
    : e;
}
function Yo(e) {
  return `$item` in e;
}
function Xo(e) {
  return `$index` in e;
}
function Zo(e, t) {
  return Xo(e)
    ? t.repeatIndex
    : Yo(e)
      ? t.repeatItem === void 0
        ? void 0
        : e.$item === ``
          ? t.repeatItem
          : Fo(t.repeatItem, e.$item)
      : Fo(t.stateModel, e.$state);
}
function Qo(e, t) {
  let n = Zo(e, t),
    r;
  if (e.eq !== void 0) r = n === Jo(e.eq, t);
  else if (e.neq !== void 0) r = n !== Jo(e.neq, t);
  else if (e.gt !== void 0) {
    let i = Jo(e.gt, t);
    r = typeof n == `number` && typeof i == `number` ? n > i : !1;
  } else if (e.gte !== void 0) {
    let i = Jo(e.gte, t);
    r = typeof n == `number` && typeof i == `number` ? n >= i : !1;
  } else if (e.lt !== void 0) {
    let i = Jo(e.lt, t);
    r = typeof n == `number` && typeof i == `number` ? n < i : !1;
  } else if (e.lte !== void 0) {
    let i = Jo(e.lte, t);
    r = typeof n == `number` && typeof i == `number` ? n <= i : !1;
  } else r = !!n;
  return e.not === !0 ? !r : r;
}
function $o(e) {
  return typeof e == `object` && !!e && !Array.isArray(e) && `$and` in e;
}
function es(e) {
  return typeof e == `object` && !!e && !Array.isArray(e) && `$or` in e;
}
function ts(e, t) {
  return e === void 0
    ? !0
    : typeof e == `boolean`
      ? e
      : Array.isArray(e)
        ? e.every((e) => Qo(e, t))
        : $o(e)
          ? e.$and.every((e) => ts(e, t))
          : es(e)
            ? e.$or.some((e) => ts(e, t))
            : Qo(e, t);
}
function ns(e) {
  return typeof e == `object` && !!e && `$state` in e && typeof e.$state == `string`;
}
function rs(e) {
  return typeof e == `object` && !!e && `$item` in e && typeof e.$item == `string`;
}
function is(e) {
  return typeof e == `object` && !!e && `$index` in e && e.$index === !0;
}
function as(e) {
  return typeof e == `object` && !!e && `$bindState` in e && typeof e.$bindState == `string`;
}
function os(e) {
  return typeof e == `object` && !!e && `$bindItem` in e && typeof e.$bindItem == `string`;
}
function ss(e) {
  return typeof e == `object` && !!e && `$cond` in e && `$then` in e && `$else` in e;
}
function cs(e) {
  return typeof e == `object` && !!e && `$computed` in e && typeof e.$computed == `string`;
}
function ls(e) {
  return typeof e == `object` && !!e && `$template` in e && typeof e.$template == `string`;
}
var us = 100,
  ds = new Set();
function fs(e, t) {
  if (t.repeatBasePath == null) {
    console.warn(`$bindItem used outside repeat scope: "${e}"`);
    return;
  }
  return e === `` ? t.repeatBasePath : t.repeatBasePath + `/` + e;
}
function ps(e, t) {
  if (e == null) return e;
  if (ns(e)) return Fo(t.stateModel, e.$state);
  if (rs(e))
    return t.repeatItem === void 0
      ? void 0
      : e.$item === ``
        ? t.repeatItem
        : Fo(t.repeatItem, e.$item);
  if (is(e)) return t.repeatIndex;
  if (as(e)) return Fo(t.stateModel, e.$bindState);
  if (os(e)) {
    let n = fs(e.$bindItem, t);
    return n === void 0 ? void 0 : Fo(t.stateModel, n);
  }
  if (ss(e)) return ps(ts(e.$cond, t) ? e.$then : e.$else, t);
  if (cs(e)) {
    let n = t.functions?.[e.$computed];
    if (!n) {
      ds.has(e.$computed) ||
        (ds.size < us && ds.add(e.$computed),
        console.warn(`Unknown $computed function: "${e.$computed}"`));
      return;
    }
    let r = {};
    if (e.args) for (let [n, i] of Object.entries(e.args)) r[n] = ps(i, t);
    return n(r);
  }
  if (ls(e))
    return e.$template.replace(/\$\{([^}]+)\}/g, (e, n) => {
      if (n.startsWith(`/`)) {
        let e = Fo(t.stateModel, n);
        return e == null ? `` : String(e);
      }
      if (t.repeatItem !== void 0) {
        let e = Fo(t.repeatItem, n);
        if (e != null) return String(e);
      }
      let r = Fo(t.stateModel, `/` + n);
      return r == null ? `` : String(r);
    });
  if (Array.isArray(e)) return e.map((e) => ps(e, t));
  if (typeof e == `object`) {
    let n = {};
    for (let [r, i] of Object.entries(e)) n[r] = ps(i, t);
    return n;
  }
  return e;
}
function ms(e, t) {
  let n = {};
  for (let [r, i] of Object.entries(e)) n[r] = ps(i, t);
  return n;
}
function hs(e, t) {
  let n;
  for (let [r, i] of Object.entries(e))
    if (as(i)) (n ||= {}), (n[r] = i.$bindState);
    else if (os(i)) {
      let e = fs(i.$bindItem, t);
      e !== void 0 && ((n ||= {}), (n[r] = e));
    }
  return n;
}
function gs(e, t) {
  return rs(e) ? fs(e.$item, t) : is(e) ? t.repeatIndex : ps(e, t);
}
var _s = L({
    title: F(),
    message: F(),
    confirmLabel: F().optional(),
    cancelLabel: F().optional(),
    variant: R([`default`, `danger`]).optional(),
  }),
  vs = eo([L({ navigate: F() }), L({ set: io(F(), qa()) }), L({ action: F() })]),
  ys = eo([L({ set: io(F(), qa()) }), L({ action: F() })]);
L({
  action: F(),
  params: io(F(), Mo).optional(),
  confirm: _s.optional(),
  onSuccess: vs.optional(),
  onError: ys.optional(),
  preventDefault: I().optional(),
}),
  L({
    checks: Za(L({ type: F(), args: io(F(), Mo).optional(), message: F() })).optional(),
    validateOn: R([`change`, `blur`, `submit`]).optional(),
    enabled: qo.optional(),
  });
var bs = [`patch`];
function xs(e) {
  return e?.modes?.length ? e.modes : bs;
}
function Ss() {
  return [
    `PATCH MODE (RFC 6902 JSON Patch):`,
    `Output one JSON object per line. Each line is a patch operation.`,
    `- Add: {"op":"add","path":"/elements/new-key","value":{...}}`,
    `- Replace: {"op":"replace","path":"/elements/existing-key","value":{...}}`,
    `- Remove: {"op":"remove","path":"/elements/old-key"}`,
    `Only output patches for what needs to change.`,
  ].join(`
`);
}
function Cs() {
  return [
    `MERGE MODE (RFC 7396 JSON Merge Patch):`,
    `Output a single JSON object on one line with __json_edit set to true.`,
    `Include only the keys that changed. Unmentioned keys are preserved.`,
    `Set a key to null to delete it.`,
    ``,
    `Example (update a title and add an element):`,
    `{"__json_edit":true,"elements":{"main":{"props":{"title":"New Title"}},"new-el":{"type":"Card","props":{},"children":[]}}}`,
    ``,
    `Example (delete an element):`,
    `{"__json_edit":true,"elements":{"old-widget":null}}`,
  ].join(`
`);
}
function ws() {
  return [
    `DIFF MODE (unified diff):`,
    "Output a unified diff inside a ```diff code fence.",
    `The diff applies against the JSON-serialized current spec.`,
    ``,
    `Example:`,
    "```diff",
    `--- a/spec.json`,
    `+++ b/spec.json`,
    `@@ -3,1 +3,1 @@`,
    `-      "title": "Login"`,
    `+      "title": "Welcome Back"`,
    "```",
  ].join(`
`);
}
function Ts() {
  return [
    `PATCH MODE (RFC 6902 JSON Patch):`,
    "Output RFC 6902 JSON Patch lines inside a ```yaml-patch code fence.",
    `Each line is one JSON patch operation.`,
    ``,
    `Example:`,
    "```yaml-patch",
    `{"op":"replace","path":"/elements/main/props/title","value":"New Title"}`,
    `{"op":"add","path":"/elements/new-el","value":{"type":"Card","props":{},"children":[]}}`,
    "```",
  ].join(`
`);
}
function Es() {
  return [
    `MERGE MODE (RFC 7396 JSON Merge Patch):`,
    "Output only the changed parts in a ```yaml-edit code fence.",
    `Uses deep merge semantics: only keys you include are updated. Unmentioned elements and props are preserved.`,
    `Set a key to null to delete it.`,
    ``,
    `Example edit (update title, add a new element):`,
    "```yaml-edit",
    `elements:`,
    `  main:`,
    `    props:`,
    `      title: Updated Title`,
    `  new-chart:`,
    `    type: Card`,
    `    props: {}`,
    `    children: []`,
    "```",
    ``,
    `Example deletion:`,
    "```yaml-edit",
    `elements:`,
    `  old-widget: null`,
    "```",
  ].join(`
`);
}
function Ds() {
  return [
    `DIFF MODE (unified diff):`,
    "Output a unified diff inside a ```diff code fence.",
    `The diff applies against the YAML-serialized current spec.`,
    ``,
    `Example:`,
    "```diff",
    `--- a/spec.yaml`,
    `+++ b/spec.yaml`,
    `@@ -6,1 +6,1 @@`,
    `-      title: Login`,
    `+      title: Welcome Back`,
    "```",
  ].join(`
`);
}
function Os(e) {
  if (e.length === 1) return ``;
  let t = [`Choose the best edit strategy for the requested change:`];
  return (
    e.includes(`patch`) && t.push(`- PATCH: best for precise, targeted single-field updates`),
    e.includes(`merge`) &&
      t.push(
        `- MERGE: best for structural changes (add/remove elements, reparent children, update multiple props at once)`,
      ),
    e.includes(`diff`) &&
      t.push(
        `- DIFF: best for small text-level changes when you can see the exact lines to change`,
      ),
    t.join(`
`)
  );
}
function ks(e, t) {
  let n = xs(e),
    r = [];
  r.push(`EDITING EXISTING SPECS:`), r.push(``);
  let i = Os(n);
  i && (r.push(i), r.push(``));
  for (let e of n) {
    if (t === `json`)
      switch (e) {
        case `patch`:
          r.push(Ss());
          break;
        case `merge`:
          r.push(Cs());
          break;
        case `diff`:
          r.push(ws());
          break;
      }
    else
      switch (e) {
        case `patch`:
          r.push(Ts());
          break;
        case `merge`:
          r.push(Es());
          break;
        case `diff`:
          r.push(Ds());
          break;
      }
    r.push(``);
  }
  return r.join(`
`);
}
function As(e) {
  let t = e.split(`
`),
    n = String(t.length).length;
  return t
    .map((e, t) => `${String(t + 1).padStart(n)}| ${e}`)
    .join(`
`);
}
function js(e) {
  if (!e || typeof e != `object`) return !1;
  let t = e;
  return (
    typeof t.root == `string` &&
    typeof t.elements == `object` &&
    t.elements !== null &&
    Object.keys(t.elements).length > 0
  );
}
function Ms(e) {
  let { prompt: t, currentSpec: n, config: r, format: i, maxPromptLength: a, serializer: o } = e,
    s = String(t || ``);
  if ((a !== void 0 && a > 0 && (s = s.slice(0, a)), !js(n))) return s;
  let c = xs(r),
    l = c.includes(`diff`),
    u = (o ?? ((e) => JSON.stringify(e, null, 2)))(n),
    d = [];
  if (
    (l
      ? (d.push(`CURRENT UI STATE (line numbers for reference):`),
        d.push("```"),
        d.push(As(u)),
        d.push("```"))
      : (d.push(`CURRENT UI STATE (already loaded, DO NOT recreate existing elements):`),
        d.push("```"),
        d.push(u),
        d.push("```")),
    d.push(``),
    d.push(`USER REQUEST: ${s}`),
    d.push(``),
    c.length === 1)
  )
    switch (c[0]) {
      case `patch`:
        d.push(
          i === `yaml`
            ? "Output ONLY the patches in a ```yaml-patch fence."
            : `Output ONLY the JSON Patch lines needed for the change.`,
        );
        break;
      case `merge`:
        d.push(
          i === `yaml`
            ? "Output ONLY the changes in a ```yaml-edit fence. Include only keys that need to change."
            : `Output ONLY a single JSON merge line with __json_edit set to true. Include only keys that need to change.`,
        );
        break;
      case `diff`:
        d.push("Output ONLY the unified diff in a ```diff fence.");
        break;
    }
  else {
    let e = c.map((e) => {
      switch (e) {
        case `patch`:
          return i === `yaml` ? "```yaml-patch fence" : `JSON Patch lines`;
        case `merge`:
          return i === `yaml` ? "```yaml-edit fence" : `JSON merge line (__json_edit)`;
        case `diff`:
          return "```diff fence";
      }
    });
    d.push(`Choose the best edit strategy and output using one of: ${e.join(`, `)}`);
  }
  return d.join(`
`);
}
function Ns() {
  return {
    string: () => ({ kind: `string` }),
    number: () => ({ kind: `number` }),
    boolean: () => ({ kind: `boolean` }),
    array: (e) => ({ kind: `array`, inner: e }),
    object: (e) => ({ kind: `object`, inner: e }),
    record: (e) => ({ kind: `record`, inner: e }),
    any: () => ({ kind: `any` }),
    zod: () => ({ kind: `zod` }),
    ref: (e) => ({ kind: `ref`, inner: e }),
    propsOf: (e) => ({ kind: `propsOf`, inner: e }),
    map: (e) => ({ kind: `map`, inner: e }),
    optional: () => ({ optional: !0 }),
  };
}
function Ps(e, t) {
  return {
    definition: e(Ns()),
    promptTemplate: t?.promptTemplate,
    defaultRules: t?.defaultRules,
    builtInActions: t?.builtInActions,
    createCatalog(e) {
      return Fs(this, e);
    },
  };
}
function Fs(e, t) {
  let n = t.components,
    r = t.actions,
    i = n ? Object.keys(n) : [],
    a = r ? Object.keys(r) : [],
    o = Is(e.definition, t);
  return {
    schema: e,
    data: t,
    componentNames: i,
    actionNames: a,
    prompt(e = {}) {
      return Bs(this, e);
    },
    jsonSchema(e = {}) {
      return Ys(o, e.strict ?? !1);
    },
    validate(e) {
      let t = o.safeParse(e);
      return t.success ? { success: !0, data: t.data } : { success: !1, error: t.error };
    },
    zodSchema() {
      return o;
    },
    get _specType() {
      throw Error(`_specType is only for type inference`);
    },
  };
}
function Is(e, t) {
  return Ls(e.spec, t);
}
function Ls(e, t) {
  switch (e.kind) {
    case `string`:
      return F();
    case `number`:
      return Ra();
    case `boolean`:
      return I();
    case `any`:
      return Ga();
    case `array`:
      return Za(Ls(e.inner, t));
    case `object`: {
      let n = e.inner,
        r = {};
      for (let [e, i] of Object.entries(n)) {
        let n = Ls(i, t);
        i.optional && (n = n.optional()), (r[e] = n);
      }
      return L(r);
    }
    case `record`: {
      let n = Ls(e.inner, t);
      return io(F(), n);
    }
    case `ref`: {
      let n = e.inner,
        r = Rs(n, t);
      return r.length === 0 ? F() : r.length === 1 ? so(r[0]) : R(r);
    }
    case `propsOf`: {
      let n = e.inner,
        r = zs(n, t);
      return r.length === 0 ? io(F(), qa()) : r.length === 1 ? r[0] : io(F(), qa());
    }
    default:
      return qa();
  }
}
function Rs(e, t) {
  let n = e.split(`.`),
    r = { catalog: t };
  for (let e of n)
    if (r && typeof r == `object`) r = r[e];
    else return [];
  return r && typeof r == `object` ? Object.keys(r) : [];
}
function zs(e, t) {
  let n = e.split(`.`),
    r = { catalog: t };
  for (let e of n)
    if (r && typeof r == `object`) r = r[e];
    else return [];
  return r && typeof r == `object`
    ? Object.values(r)
        .map((e) => e.props)
        .filter((e) => e !== void 0)
    : [];
}
function Bs(e, t) {
  if (e.schema.promptTemplate) {
    let n = {
      catalog: e.data,
      componentNames: e.componentNames,
      actionNames: e.actionNames,
      options: t,
      formatZodType: Ks,
    };
    return e.schema.promptTemplate(n);
  }
  let {
      system: n = `You are a UI generator that outputs JSON.`,
      customRules: r = [],
      mode: i = `standalone`,
    } = t,
    a =
      i === `chat`
        ? (console.warn(`[json-render] mode "chat" is deprecated, use "inline" instead`), `inline`)
        : i === `generate`
          ? (console.warn(`[json-render] mode "generate" is deprecated, use "standalone" instead`),
            `standalone`)
          : i,
    o = [];
  o.push(n),
    o.push(``),
    a === `inline`
      ? (o.push(`OUTPUT FORMAT (text + JSONL, RFC 6902 JSON Patch):`),
        o.push(
          "You respond conversationally. When generating UI, first write a brief explanation (1-3 sentences), then output JSONL patch lines wrapped in a ```spec code fence.",
        ),
        o.push(
          "The JSONL lines use RFC 6902 JSON Patch operations to build a UI tree. Always wrap them in a ```spec fence block:",
        ),
        o.push("  ```spec"),
        o.push(`  {"op":"add","path":"/root","value":"main"}`),
        o.push(
          `  {"op":"add","path":"/elements/main","value":{"type":"Card","props":{"title":"Hello"},"children":[]}}`,
        ),
        o.push("  ```"),
        o.push(
          `If the user's message does not require a UI (e.g. a greeting or clarifying question), respond with text only — no JSONL.`,
        ))
      : (o.push(`OUTPUT FORMAT (JSONL, RFC 6902 JSON Patch):`),
        o.push(
          `Output JSONL (one JSON object per line) using RFC 6902 JSON Patch operations to build a UI tree.`,
        )),
    o.push(
      `Each line is a JSON patch operation (add, remove, replace). Start with /root, then stream /elements and /state patches interleaved so the UI fills in progressively as it streams.`,
    ),
    o.push(``),
    o.push(`Example output (each line is a separate JSON object):`),
    o.push(``);
  let s = e.data.components,
    c = e.componentNames,
    l = c[0] || `Component`,
    u = c.length > 1 ? c[1] : l,
    d = s?.[l],
    f = s?.[u],
    p = d ? Vs(d) : {},
    m = f ? Vs(f) : {},
    h = f?.props ? Ws(f.props) : null,
    g = h ? { ...m, [h]: { $item: `title` } } : m,
    _ = [
      JSON.stringify({ op: `add`, path: `/root`, value: `main` }),
      JSON.stringify({
        op: `add`,
        path: `/elements/main`,
        value: { type: l, props: p, children: [`child-1`, `list`] },
      }),
      JSON.stringify({
        op: `add`,
        path: `/elements/child-1`,
        value: { type: u, props: m, children: [] },
      }),
      JSON.stringify({
        op: `add`,
        path: `/elements/list`,
        value: {
          type: l,
          props: p,
          repeat: { statePath: `/items`, key: `id` },
          children: [`item`],
        },
      }),
      JSON.stringify({
        op: `add`,
        path: `/elements/item`,
        value: { type: u, props: g, children: [] },
      }),
      JSON.stringify({ op: `add`, path: `/state/items`, value: [] }),
      JSON.stringify({
        op: `add`,
        path: `/state/items/0`,
        value: { id: `1`, title: `First Item` },
      }),
      JSON.stringify({
        op: `add`,
        path: `/state/items/1`,
        value: { id: `2`, title: `Second Item` },
      }),
    ].join(`
`);
  o.push(`${_}

Note: state patches appear right after the elements that use them, so the UI fills in as it streams. ONLY use component types from the AVAILABLE COMPONENTS list below.`),
    o.push(``),
    o.push(`INITIAL STATE:`),
    o.push(
      `Specs include a /state field to seed the state model. Components with { $bindState } or { $bindItem } read from and write to this state, and $state expressions read from it.`,
    ),
    o.push(
      `CRITICAL: You MUST include state patches whenever your UI displays data via $state, $bindState, $bindItem, $item, or $index expressions, or uses repeat to iterate over arrays. Without state, these references resolve to nothing and repeat lists render zero items.`,
    ),
    o.push(
      `Output state patches right after the elements that reference them, so the UI fills in progressively as it streams.`,
    ),
    o.push(
      `Stream state progressively - output one patch per array item instead of one giant blob:`,
    ),
    o.push(
      `  For arrays: {"op":"add","path":"/state/posts/0","value":{"id":"1","title":"First Post",...}} then /state/posts/1, /state/posts/2, etc.`,
    ),
    o.push(`  For scalars: {"op":"add","path":"/state/newTodoText","value":""}`),
    o.push(`  Initialize the array first if needed: {"op":"add","path":"/state/posts","value":[]}`),
    o.push(
      `When content comes from the state model, use { "$state": "/some/path" } dynamic props to display it instead of hardcoding the same value in both state and props. The state model is the single source of truth.`,
    ),
    o.push(
      `Include realistic sample data in state. For blogs: 3-4 posts with titles, excerpts, authors, dates. For product lists: 3-5 items with names, prices, descriptions. Never leave arrays empty.`,
    ),
    o.push(``),
    o.push(`DYNAMIC LISTS (repeat field):`),
    o.push(
      `Any element can have a top-level "repeat" field to render its children once per item in a state array: { "repeat": { "statePath": "/arrayPath", "key": "id" } }.`,
    ),
    o.push(
      `The element itself renders once (as the container), and its children are expanded once per array item. "statePath" is the state array path. "key" is an optional field name on each item for stable React keys.`,
    ),
    o.push(
      `Example: ${JSON.stringify({ type: l, props: p, repeat: { statePath: `/todos`, key: `id` }, children: [`todo-item`] })}`,
    ),
    o.push(
      `Inside children of a repeated element, use { "$item": "field" } to read a field from the current item, and { "$index": true } to get the current array index. For two-way binding to an item field use { "$bindItem": "completed" } on the appropriate prop.`,
    ),
    o.push(
      `ALWAYS use the repeat field for lists backed by state arrays. NEVER hardcode individual elements for each array item.`,
    ),
    o.push(
      `IMPORTANT: "repeat" is a top-level field on the element (sibling of type/props/children), NOT inside props.`,
    ),
    o.push(``),
    o.push(`ARRAY STATE ACTIONS:`),
    o.push(
      `Use action "pushState" to append items to arrays. Params: { statePath: "/arrayPath", value: { ...item }, clearStatePath: "/inputPath" }.`,
    ),
    o.push(
      `Values inside pushState can contain { "$state": "/statePath" } references to read current state (e.g. the text from an input field).`,
    ),
    o.push(`Use "$id" inside a pushState value to auto-generate a unique ID.`),
    o.push(
      `Example: on: { "press": { "action": "pushState", "params": { "statePath": "/todos", "value": { "id": "$id", "title": { "$state": "/newTodoText" }, "completed": false }, "clearStatePath": "/newTodoText" } } }`,
    ),
    o.push(
      `Use action "removeState" to remove items from arrays by index. Params: { statePath: "/arrayPath", index: N }. Inside a repeated element's children, use { "$index": true } for the current item index. Action params support the same expressions as props: { "$item": "field" } resolves to the absolute state path, { "$index": true } resolves to the index number, and { "$state": "/path" } reads a value from state.`,
    ),
    o.push(
      `For lists where users can add/remove items (todos, carts, etc.), use pushState and removeState instead of hardcoding with setState.`,
    ),
    o.push(``),
    o.push(
      `IMPORTANT: State paths use RFC 6901 JSON Pointer syntax (e.g. "/todos/0/title"). Do NOT use JavaScript-style dot notation (e.g. "/todos.length" is WRONG). To generate unique IDs for new items, use "$id" instead of trying to read array length.`,
    ),
    o.push(``);
  let v = s;
  if (v) {
    o.push(`AVAILABLE COMPONENTS (${e.componentNames.length}):`), o.push(``);
    for (let [e, t] of Object.entries(v)) {
      let n = t.props ? Ks(t.props) : `{}`,
        r = t.slots && t.slots.length > 0 ? ` [accepts children]` : ``,
        i = t.events && t.events.length > 0 ? ` [events: ${t.events.join(`, `)}]` : ``,
        a = t.description ? ` - ${t.description}` : ``;
      o.push(`- ${e}: ${n}${a}${r}${i}`);
    }
    o.push(``);
  }
  let y = e.data.actions,
    b = e.schema.builtInActions ?? [],
    x = y && e.actionNames.length > 0,
    S = b.length > 0;
  if (x || S) {
    o.push(`AVAILABLE ACTIONS:`), o.push(``);
    for (let e of b) o.push(`- ${e.name}: ${e.description} [built-in]`);
    if (x)
      for (let [e, t] of Object.entries(y))
        o.push(`- ${e}${t.description ? `: ${t.description}` : ``}`);
    o.push(``);
  }
  o.push("EVENTS (the `on` field):"),
    o.push(
      "Elements can have an optional `on` field to bind events to actions. The `on` field is a top-level field on the element (sibling of type/props/children), NOT inside props.",
    ),
    o.push(
      'Each key in `on` is an event name (from the component\'s supported events), and the value is an action binding: `{ "action": "<actionName>", "params": { ... } }`.',
    ),
    o.push(``),
    o.push(`Example:`),
    o.push(
      `  ${JSON.stringify({ type: l, props: p, on: { press: { action: `setState`, params: { statePath: `/saved`, value: !0 } } }, children: [] })}`,
    ),
    o.push(``),
    o.push(
      `Action params can use dynamic references to read from state: { "$state": "/statePath" }.`,
    ),
    o.push(
      "IMPORTANT: Do NOT put action/actionParams inside props. Always use the `on` field for event bindings.",
    ),
    o.push(``),
    o.push(`VISIBILITY CONDITIONS:`),
    o.push(
      "Elements can have an optional `visible` field to conditionally show/hide based on state. IMPORTANT: `visible` is a top-level field on the element object (sibling of type/props/children), NOT inside props.",
    ),
    o.push(
      `Correct: ${JSON.stringify({ type: l, props: p, visible: { $state: `/activeTab`, eq: `home` }, children: [`...`] })}`,
    ),
    o.push('- `{ "$state": "/path" }` - visible when state at path is truthy'),
    o.push('- `{ "$state": "/path", "not": true }` - visible when state at path is falsy'),
    o.push('- `{ "$state": "/path", "eq": "value" }` - visible when state equals value'),
    o.push('- `{ "$state": "/path", "neq": "value" }` - visible when state does not equal value'),
    o.push('- `{ "$state": "/path", "gt": N }` / `gte` / `lt` / `lte` - numeric comparisons'),
    o.push(
      `- Use ONE operator per condition (eq, neq, gt, gte, lt, lte). Do not combine multiple operators.`,
    ),
    o.push('- Any condition can add `"not": true` to invert its result'),
    o.push("- `[condition, condition]` - all conditions must be true (implicit AND)"),
    o.push('- `{ "$and": [condition, condition] }` - explicit AND (use when nesting inside $or)'),
    o.push('- `{ "$or": [condition, condition] }` - at least one must be true (OR)'),
    o.push("- `true` / `false` - always visible/hidden"),
    o.push(``),
    o.push(`Use a component with on.press bound to setState to update state and drive visibility.`),
    o.push(
      `Example: A ${l} with on: { "press": { "action": "setState", "params": { "statePath": "/activeTab", "value": "home" } } } sets state, then a container with visible: { "$state": "/activeTab", "eq": "home" } shows only when that tab is active.`,
    ),
    o.push(``),
    o.push(
      `For tab patterns where the first/default tab should be visible when no tab is selected yet, use $or to handle both cases: visible: { "$or": [{ "$state": "/activeTab", "eq": "home" }, { "$state": "/activeTab", "not": true }] }. This ensures the first tab is visible both when explicitly selected AND when /activeTab is not yet set.`,
    ),
    o.push(``),
    o.push(`DYNAMIC PROPS:`),
    o.push(
      `Any prop value can be a dynamic expression that resolves based on state. Three forms are supported:`,
    ),
    o.push(``),
    o.push(
      '1. Read-only state: `{ "$state": "/statePath" }` - resolves to the value at that state path (one-way read).',
    ),
    o.push('   Example: `"color": { "$state": "/theme/primary" }` reads the color from state.'),
    o.push(``),
    o.push(
      '2. Two-way binding: `{ "$bindState": "/statePath" }` - resolves to the value at the state path AND enables write-back. Use on form input props (value, checked, pressed, etc.).',
    ),
    o.push(
      '   Example: `"value": { "$bindState": "/form/email" }` binds the input value to /form/email.',
    ),
    o.push(
      '   Inside repeat scopes: `"checked": { "$bindItem": "completed" }` binds to the current item\'s completed field.',
    ),
    o.push(``),
    o.push(
      '3. Conditional: `{ "$cond": <condition>, "$then": <value>, "$else": <value> }` - evaluates the condition (same syntax as visibility conditions) and picks the matching value.',
    ),
    o.push(
      '   Example: `"color": { "$cond": { "$state": "/activeTab", "eq": "home" }, "$then": "#007AFF", "$else": "#8E8E93" }`',
    ),
    o.push(``),
    o.push(
      `Use $bindState for form inputs (text fields, checkboxes, selects, sliders, etc.) and $state for read-only data display. Inside repeat scopes, use $bindItem for form inputs bound to the current item. Use dynamic props instead of duplicating elements with opposing visible conditions when only prop values differ.`,
    ),
    o.push(``),
    o.push(
      '4. Template: `{ "$template": "Hello, ${/name}!" }` - interpolates references in the string. Absolute paths like `${/path}` resolve against the state model. Bare names like `${field}` resolve against the current repeat item first, then fall back to the state model at `/<field>`.',
    ),
    o.push(
      '   Example: `"label": { "$template": "Items: ${/cart/count} | Total: ${/cart/total}" }` renders "Items: 3 | Total: 42.00" when /cart/count is 3 and /cart/total is 42.00. Inside a repeat, `{ "$template": "${name} - ${email}" }` reads name and email from each item.',
    ),
    o.push(``);
  let C = e.data.functions;
  if (C && Object.keys(C).length > 0) {
    o.push(
      '5. Computed: `{ "$computed": "<functionName>", "args": { "key": <expression> } }` - calls a registered function with resolved args and returns the result.',
    ),
      o.push(
        '   Example: `"value": { "$computed": "fullName", "args": { "first": { "$state": "/form/firstName" }, "last": { "$state": "/form/lastName" } } }`',
      ),
      o.push(`   Available functions:`);
    for (let e of Object.keys(C)) o.push(`   - ${e}`);
    o.push(``);
  }
  s &&
    Object.entries(s).some(([, e]) => (e.props ? Ks(e.props).includes(`checks`) : !1)) &&
    (o.push(`VALIDATION:`),
    o.push("Form components that accept a `checks` prop support client-side validation."),
    o.push(`Each check is an object: { "type": "<name>", "message": "...", "args": { ... } }`),
    o.push(``),
    o.push(`Built-in validation types:`),
    o.push(`  - required — value must be non-empty`),
    o.push(`  - email — valid email format`),
    o.push(`  - minLength — minimum string length (args: { "min": N })`),
    o.push(`  - maxLength — maximum string length (args: { "max": N })`),
    o.push(`  - pattern — match a regex (args: { "pattern": "regex" })`),
    o.push(`  - min — minimum numeric value (args: { "min": N })`),
    o.push(`  - max — maximum numeric value (args: { "max": N })`),
    o.push(`  - numeric — value must be a number`),
    o.push(`  - url — valid URL format`),
    o.push(`  - matches — must equal another field (args: { "other": { "$state": "/path" } })`),
    o.push(`  - equalTo — alias for matches (args: { "other": { "$state": "/path" } })`),
    o.push(
      `  - lessThan — value must be less than another field (args: { "other": { "$state": "/path" } })`,
    ),
    o.push(
      `  - greaterThan — value must be greater than another field (args: { "other": { "$state": "/path" } })`,
    ),
    o.push(
      `  - requiredIf — required only when another field is truthy (args: { "field": { "$state": "/path" } })`,
    ),
    o.push(``),
    o.push(`Example:`),
    o.push(
      `  "checks": [{ "type": "required", "message": "Email is required" }, { "type": "email", "message": "Invalid email" }]`,
    ),
    o.push(``),
    o.push(
      `IMPORTANT: When using checks, the component must also have a { $bindState } or { $bindItem } on its value/checked prop for two-way binding.`,
    ),
    o.push(
      `Always include validation checks on form inputs for a good user experience (e.g. required, email, minLength).`,
    ),
    o.push(``)),
    (x || S) &&
      (o.push(`STATE WATCHERS:`),
      o.push(
        "Elements can have an optional `watch` field to react to state changes and trigger actions. The `watch` field is a top-level field on the element (sibling of type/props/children), NOT inside props.",
      ),
      o.push(
        `Maps state paths (JSON Pointers) to action bindings. When the value at a watched path changes, the bound actions fire automatically.`,
      ),
      o.push(``),
      o.push(`Example (cascading select — country changes trigger city loading):`),
      o.push(
        `  ${JSON.stringify({ type: `Select`, props: { value: { $bindState: `/form/country` }, options: [`US`, `Canada`, `UK`] }, watch: { "/form/country": { action: `loadCities`, params: { country: { $state: `/form/country` } } } }, children: [] })}`,
      ),
      o.push(``),
      o.push(
        "Use `watch` for cascading dependencies where changing one field should trigger side effects (loading data, resetting dependent fields, computing derived values).",
      ),
      o.push(
        "IMPORTANT: `watch` is a top-level field on the element (sibling of type/props/children), NOT inside props. Watchers only fire when the value changes, not on initial render.",
      ),
      o.push(``));
  let w = t.editModes;
  w && w.length > 0 && o.push(ks({ modes: w }, `json`)), o.push(`RULES:`);
  let ee =
      a === `inline`
        ? [
            "When generating UI, wrap all JSONL patches in a ```spec code fence - one JSON object per line inside the fence",
            `Write a brief conversational response before any JSONL output`,
            `First set root: {"op":"add","path":"/root","value":"<root-key>"}`,
            `Then add each element: {"op":"add","path":"/elements/<key>","value":{...}}`,
            `Output /state patches right after the elements that use them, one per array item for progressive loading. REQUIRED whenever using $state, $bindState, $bindItem, $item, $index, or repeat.`,
            `ONLY use components listed above`,
            `Each element value needs: type, props, children (array of child keys)`,
            `Use unique keys for the element map entries (e.g., 'header', 'metric-1', 'chart-revenue')`,
          ]
        : [
            `Output ONLY JSONL patches - one JSON object per line, no markdown, no code fences`,
            `First set root: {"op":"add","path":"/root","value":"<root-key>"}`,
            `Then add each element: {"op":"add","path":"/elements/<key>","value":{...}}`,
            `Output /state patches right after the elements that use them, one per array item for progressive loading. REQUIRED whenever using $state, $bindState, $bindItem, $item, $index, or repeat.`,
            `ONLY use components listed above`,
            `Each element value needs: type, props, children (array of child keys)`,
            `Use unique keys for the element map entries (e.g., 'header', 'metric-1', 'chart-revenue')`,
          ],
    T = e.schema.defaultRules ?? [];
  return (
    [...ee, ...T, ...r].forEach((e, t) => {
      o.push(`${t + 1}. ${e}`);
    }),
    o.join(`
`)
  );
}
function Vs(e) {
  return e.example && Object.keys(e.example).length > 0 ? e.example : e.props ? Hs(e.props) : {};
}
function Hs(e) {
  if (!e || !e._def) return {};
  let t = e._def,
    n = Gs(e);
  if (n !== `ZodObject` && n !== `object`) return {};
  let r = typeof t.shape == `function` ? t.shape() : t.shape;
  if (!r) return {};
  let i = {};
  for (let [e, t] of Object.entries(r)) {
    let n = Gs(t);
    n === `ZodOptional` ||
      n === `optional` ||
      n === `ZodNullable` ||
      n === `nullable` ||
      (i[e] = Us(t));
  }
  return i;
}
function Us(e) {
  if (!e || !e._def) return `...`;
  let t = e._def;
  switch (Gs(e)) {
    case `ZodString`:
    case `string`:
      return `example`;
    case `ZodNumber`:
    case `number`:
      return 0;
    case `ZodBoolean`:
    case `boolean`:
      return !0;
    case `ZodLiteral`:
    case `literal`:
      return t.value;
    case `ZodEnum`:
    case `enum`:
      if (Array.isArray(t.values) && t.values.length > 0) return t.values[0];
      if (t.entries && typeof t.entries == `object`) {
        let e = Object.values(t.entries);
        return e.length > 0 ? e[0] : `example`;
      }
      return `example`;
    case `ZodOptional`:
    case `optional`:
    case `ZodNullable`:
    case `nullable`:
    case `ZodDefault`:
    case `default`: {
      let e = t.innerType ?? t.wrapped;
      return e ? Us(e) : null;
    }
    case `ZodArray`:
    case `array`:
      return [];
    case `ZodObject`:
    case `object`:
      return Hs(e);
    case `ZodUnion`:
    case `union`: {
      let e = t.options;
      return e && e.length > 0 ? Us(e[0]) : `...`;
    }
    default:
      return `...`;
  }
}
function Ws(e) {
  if (!e || !e._def) return null;
  let t = e._def,
    n = Gs(e);
  if (n !== `ZodObject` && n !== `object`) return null;
  let r = typeof t.shape == `function` ? t.shape() : t.shape;
  if (!r) return null;
  for (let [e, t] of Object.entries(r)) {
    let n = Gs(t);
    if (
      !(n === `ZodOptional` || n === `optional` || n === `ZodNullable` || n === `nullable`) &&
      (n === `ZodString` || n === `string`)
    )
      return e;
  }
  return null;
}
function Gs(e) {
  if (!e || !e._def) return ``;
  let t = e._def;
  return t.typeName ?? t.type ?? ``;
}
function Ks(e) {
  if (!e || !e._def) return `unknown`;
  let t = e._def;
  switch (Gs(e)) {
    case `ZodString`:
    case `string`:
      return `string`;
    case `ZodNumber`:
    case `number`:
      return `number`;
    case `ZodBoolean`:
    case `boolean`:
      return `boolean`;
    case `ZodLiteral`:
    case `literal`:
      return JSON.stringify(t.value);
    case `ZodEnum`:
    case `enum`: {
      let e;
      if (Array.isArray(t.values)) e = t.values;
      else if (t.entries && typeof t.entries == `object`) e = Object.values(t.entries);
      else return `enum`;
      return e.map((e) => `"${e}"`).join(` | `);
    }
    case `ZodArray`:
    case `array`: {
      let e =
        typeof t.element == `object` ? t.element : typeof t.type == `object` ? t.type : void 0;
      return e ? `Array<${Ks(e)}>` : `Array<unknown>`;
    }
    case `ZodObject`:
    case `object`: {
      let e = typeof t.shape == `function` ? t.shape() : t.shape;
      return e
        ? `{ ${Object.entries(e)
            .map(([e, t]) => {
              let n = Gs(t);
              return `${e}${n === `ZodOptional` || n === `ZodNullable` || n === `optional` || n === `nullable` ? `?` : ``}: ${Ks(t)}`;
            })
            .join(`, `)} }`
        : `object`;
    }
    case `ZodOptional`:
    case `optional`:
    case `ZodNullable`:
    case `nullable`: {
      let e = t.innerType ?? t.wrapped;
      return e ? Ks(e) : `unknown`;
    }
    case `ZodUnion`:
    case `union`: {
      let e = t.options;
      return e ? e.map((e) => Ks(e)).join(` | `) : `unknown`;
    }
    default:
      return `unknown`;
  }
}
function qs(e) {
  return typeof e.type == `string` ? e.type : typeof e.typeName == `string` ? e.typeName : ``;
}
function Js(e) {
  return e.startsWith(`Zod`) ? e.slice(3).toLowerCase() : e.toLowerCase();
}
function Ys(e, t = !1) {
  let n = e._def;
  switch (Js(qs(n))) {
    case `string`:
      return { type: `string` };
    case `number`:
      return { type: `number` };
    case `boolean`:
      return { type: `boolean` };
    case `literal`: {
      let e = n.values;
      return { const: e ? e[0] : n.value };
    }
    case `enum`: {
      let e = n.entries;
      return { enum: (e ? Object.values(e) : n.values) ?? [] };
    }
    case `array`: {
      let e = n.element ?? n.type;
      return { type: `array`, items: e ? Ys(e, t) : {} };
    }
    case `object`: {
      let e = n.shape,
        r = typeof e == `function` ? e() : e;
      if (!r)
        return t
          ? { type: `object`, properties: {}, required: [], additionalProperties: !1 }
          : { type: `object` };
      let i = {},
        a = [];
      for (let [e, n] of Object.entries(r)) {
        let r = n._def,
          o = Js(qs(r)),
          s = o === `optional` || o === `nullable`;
        t
          ? (a.push(e), s ? (i[e] = { anyOf: [Ys(n, t), { type: `null` }] }) : (i[e] = Ys(n, t)))
          : ((i[e] = Ys(n)), s || a.push(e));
      }
      return {
        type: `object`,
        properties: i,
        required: a.length > 0 ? a : void 0,
        additionalProperties: !1,
      };
    }
    case `record`: {
      let e = n.valueType;
      return t
        ? { type: `object`, properties: {}, required: [], additionalProperties: !1 }
        : { type: `object`, additionalProperties: e ? Ys(e) : !0 };
    }
    case `optional`:
    case `nullable`: {
      let e = n.innerType;
      return e ? Ys(e, t) : {};
    }
    case `union`: {
      let e = n.options;
      return e ? { anyOf: e.map((e) => Ys(e, t)) } : {};
    }
    case `any`:
    case `unknown`:
      return t ? { type: `object`, properties: {}, required: [], additionalProperties: !1 } : {};
    default:
      return {};
  }
}
function Xs(e, t) {
  return e.createCatalog(t);
}
function Zs(e) {
  let {
      prompt: t,
      currentSpec: n,
      state: r,
      maxPromptLength: i,
      editModes: a,
      format: o,
      serializer: s,
    } = e,
    c = String(t || ``);
  if ((i !== void 0 && i > 0 && (c = c.slice(0, i)), js(n))) {
    let e = Ms({
      prompt: c,
      currentSpec: n,
      config: { modes: a ?? [`patch`] },
      format: o ?? `json`,
      serializer: s,
    });
    return r && Object.keys(r).length > 0
      ? `${e}

AVAILABLE STATE:
${JSON.stringify(r, null, 2)}`
      : e;
  }
  let l = [c];
  return (
    r &&
      Object.keys(r).length > 0 &&
      l.push(`
AVAILABLE STATE:
${JSON.stringify(r, null, 2)}`),
    o === `yaml`
      ? l.push(
          "\nOutput the full spec in a ```yaml-spec fence. Stream progressively — output elements one at a time.",
        )
      : l.push(`
Remember: Output /root first, then interleave /elements and /state patches so the UI fills in progressively as it streams. Output each state patch right after the elements that use it, one per array item.`),
    l.join(`
`)
  );
}
var Qs = Ps(
    (e) => ({
      spec: e.object({
        root: e.string(),
        elements: e.record(
          e.object({
            type: e.ref(`catalog.components`),
            props: e.propsOf(`catalog.components`),
            children: e.array(e.string()),
            visible: e.any(),
          }),
        ),
      }),
      catalog: e.object({
        components: e.map({
          props: e.zod(),
          slots: e.array(e.string()),
          description: e.string(),
          example: e.any(),
        }),
        actions: e.map({ params: e.zod(), description: e.string() }),
      }),
    }),
    {
      builtInActions: [
        {
          name: `setState`,
          description: `Update a value in the state model at the given statePath. Params: { statePath: string, value: any }`,
        },
        {
          name: `pushState`,
          description: `Append an item to an array in state. Params: { statePath: string, value: any, clearStatePath?: string }. Value can contain {"$state":"/path"} refs and "$id" for auto IDs.`,
        },
        {
          name: `removeState`,
          description: `Remove an item from an array in state by index. Params: { statePath: string, index: number }`,
        },
        {
          name: `validateForm`,
          description: `Validate all registered form fields and write the result to state. Params: { statePath?: string }. Defaults to /formValidation. Result: { valid: boolean, errors: Record<string, string[]> }.`,
        },
      ],
      defaultRules: [
        `CRITICAL INTEGRITY CHECK: Before outputting ANY element that references children, you MUST have already output (or will output) each child as its own element. If an element has children: ['a', 'b'], then elements 'a' and 'b' MUST exist. A missing child element causes that entire branch of the UI to be invisible.`,
        `SELF-CHECK: After generating all elements, mentally walk the tree from root. Every key in every children array must resolve to a defined element. If you find a gap, output the missing element immediately.`,
        `CRITICAL: The "visible" field goes on the ELEMENT object, NOT inside "props". Correct: {"type":"<ComponentName>","props":{},"visible":{"$state":"/tab","eq":"home"},"children":[...]}.`,
        `CRITICAL: The "on" field goes on the ELEMENT object, NOT inside "props". Use on.press, on.change, on.submit etc. NEVER put action/actionParams inside props.`,
        `When the user asks for a UI that displays data (e.g. blog posts, products, users), ALWAYS include a state field with realistic sample data. The state field is a top-level field on the spec (sibling of root/elements).`,
        `When building repeating content backed by a state array (e.g. posts, products, items), use the "repeat" field on a container element. Example: { "type": "<ContainerComponent>", "props": {}, "repeat": { "statePath": "/posts", "key": "id" }, "children": ["post-card"] }. Replace <ContainerComponent> with an appropriate component from the AVAILABLE COMPONENTS list. Inside repeated children, use { "$item": "field" } to read a field from the current item, and { "$index": true } for the current array index. For two-way binding to an item field use { "$bindItem": "completed" }. Do NOT hardcode individual elements for each array item.`,
        `Design with visual hierarchy: use container components to group content, heading components for section titles, proper spacing, and status indicators. ONLY use components from the AVAILABLE COMPONENTS list.`,
        `For data-rich UIs, use multi-column layout components if available. For forms and single-column content, use vertical layout components. ONLY use components from the AVAILABLE COMPONENTS list.`,
        `Always include realistic, professional-looking sample data. For blogs include 3-4 posts with varied titles, authors, dates, categories. For products include names, prices, images. Never leave data empty.`,
      ],
    },
  ),
  $s = (0, x.createContext)(null);
function ec() {
  let e = (0, x.useContext)($s);
  if (!e) throw Error(`useStateStore must be used within a StateProvider`);
  return e;
}
var tc = (0, x.createContext)(null);
function nc() {
  let e = (0, x.useContext)(tc);
  if (!e) throw Error(`useVisibility must be used within a VisibilityProvider`);
  return e;
}
(0, x.createContext)(null);
var rc = (0, x.createContext)(null);
function ic() {
  let e = (0, x.useContext)(rc);
  if (!e) throw Error(`useActions must be used within an ActionProvider`);
  return e;
}
var ac = (0, x.createContext)(null);
function oc({ item: e, index: t, basePath: n, children: r }) {
  return (0, S.jsx)(ac.Provider, { value: { item: e, index: t, basePath: n }, children: r });
}
function sc() {
  return (0, x.useContext)(ac);
}
var cc = class extends x.Component {
    constructor(e) {
      super(e), (this.state = { hasError: !1 });
    }
    static getDerivedStateFromError() {
      return { hasError: !0 };
    }
    componentDidCatch(e, t) {
      console.error(
        `[json-render] Rendering error in <${this.props.elementType}>:`,
        e,
        t.componentStack,
      );
    }
    render() {
      return this.state.hasError ? null : this.props.children;
    }
  },
  lc = x.createContext({});
function uc() {
  return x.useContext(lc);
}
var dc = x.memo(function e({ element: t, spec: n, registry: r, loading: i, fallback: a }) {
  let o = sc(),
    { ctx: s } = nc(),
    { execute: c } = ic(),
    { getSnapshot: l, state: u } = ec(),
    d = uc(),
    f = (0, x.useMemo)(() => {
      let e = o
        ? { ...s, repeatItem: o.item, repeatIndex: o.index, repeatBasePath: o.basePath }
        : { ...s };
      return (e.functions = d), e;
    }, [s, o, d]),
    p = t.visible === void 0 ? !0 : ts(t.visible, f),
    m = t.on,
    h = (0, x.useCallback)(
      async (e) => {
        let t = m?.[e];
        if (!t) return;
        let n = Array.isArray(t) ? t : [t];
        for (let e of n) {
          if (!e.params) {
            await c(e);
            continue;
          }
          let t = { ...f, stateModel: l() },
            n = {};
          for (let [r, i] of Object.entries(e.params)) n[r] = gs(i, t);
          await c({ ...e, params: n });
        }
      },
      [m, c, f, l],
    ),
    g = (0, x.useCallback)(
      (e) => {
        let t = m?.[e];
        return t
          ? {
              emit: () => h(e),
              shouldPreventDefault: (Array.isArray(t) ? t : [t]).some((e) => e.preventDefault),
              bound: !0,
            }
          : { emit: () => {}, shouldPreventDefault: !1, bound: !1 };
      },
      [m, h],
    ),
    _ = t.watch,
    v = (0, x.useRef)(null),
    y = (0, x.useRef)(void 0),
    b = (0, x.useMemo)(() => {
      if (!_) return;
      let e = {};
      for (let t of Object.keys(_)) e[t] = Fo(u, t);
      let t = y.current;
      if (t) {
        let n = Object.keys(e);
        if (n.length === Object.keys(t).length && n.every((n) => e[n] === t[n])) return t;
      }
      return (y.current = e), e;
    }, [_, u]);
  if (
    ((0, x.useEffect)(() => {
      if (!_ || !b) return;
      let e = Object.keys(_);
      if (e.length === 0) return;
      let t = v.current;
      if (((v.current = b), t === null)) return;
      let n = !1;
      return (
        (async () => {
          for (let r of e) {
            if (n) break;
            if (b[r] !== t[r]) {
              let e = _[r];
              if (!e) continue;
              let t = Array.isArray(e) ? e : [e];
              for (let e of t) {
                if (n) break;
                if (!e.params) {
                  if ((await c(e), n)) break;
                  continue;
                }
                let t = { ...f, stateModel: l() },
                  r = {};
                for (let [n, i] of Object.entries(e.params)) r[n] = gs(i, t);
                if ((await c({ ...e, params: r }), n)) break;
              }
            }
          }
        })().catch(console.error),
        () => {
          n = !0;
        }
      );
    }, [_, b, c, f, l]),
    !p)
  )
    return null;
  let C = t.props,
    w = hs(C, f),
    ee = ms(C, f),
    T = ee === t.props ? t : { ...t, props: ee },
    te = r[T.type] ?? a;
  if (!te) return console.warn(`No renderer for component type: ${T.type}`), null;
  let E = T.repeat
    ? (0, S.jsx)(fc, { element: T, spec: n, registry: r, loading: i, fallback: a })
    : T.children?.map((t) => {
        let o = n.elements[t];
        return o
          ? (0, S.jsx)(e, { element: o, spec: n, registry: r, loading: i, fallback: a }, t)
          : (i ||
              console.warn(
                `[json-render] Missing element "${t}" referenced as child of "${T.type}". This element will not render.`,
              ),
            null);
      });
  return (0, S.jsx)(cc, {
    elementType: T.type,
    children: (0, S.jsx)(te, { element: T, emit: h, on: g, bindings: w, loading: i, children: E }),
  });
});
function fc({ element: e, spec: t, registry: n, loading: r, fallback: i }) {
  let { state: a } = ec(),
    o = e.repeat,
    s = o.statePath;
  return (0, S.jsx)(S.Fragment, {
    children: (Fo(a, s) ?? []).map((a, c) => {
      let l = o.key && typeof a == `object` && a ? String(a[o.key] ?? c) : String(c);
      return (0, S.jsx)(
        oc,
        {
          item: a,
          index: c,
          basePath: `${s}/${c}`,
          children: e.children?.map((a) => {
            let o = t.elements[a];
            return o
              ? (0, S.jsx)(dc, { element: o, spec: t, registry: n, loading: r, fallback: i }, a)
              : (r ||
                  console.warn(
                    `[json-render] Missing element "${a}" referenced as child of "${e.type}" (repeat). This element will not render.`,
                  ),
                null);
          }),
        },
        l,
      );
    }),
  });
}
function pc({ spec: e, registry: t, loading: n, fallback: r }) {
  if (!e || !e.root) return null;
  let i = e.elements[e.root];
  return i ? (0, S.jsx)(dc, { element: i, spec: e, registry: t, loading: n, fallback: r }) : null;
}
function mc(e, t) {
  let n = {};
  if (t.components)
    for (let [e, r] of Object.entries(t.components))
      n[e] = ({ element: e, children: t, emit: n, on: i, bindings: a, loading: o }) =>
        r({ props: e.props, children: t, emit: n, on: i, bindings: a, loading: o });
  let r = t.actions ? Object.entries(t.actions) : [];
  return {
    registry: n,
    handlers: (e, t) => {
      let n = {};
      for (let [i, a] of r)
        n[i] = async (n) => {
          let r = e(),
            i = t();
          r && (await a(n, r, i));
        };
      return n;
    },
    executeAction: async (e, t, n, i = {}) => {
      let a = r.find(([t]) => t === e);
      a ? await a[1](t, n, i) : console.warn(`Unknown action: ${e}`);
    },
  };
}
var hc = L({
    variant: R([
      `brandSolid`,
      `neutralSolid`,
      `neutralWeak`,
      `dangerSolid`,
      `dangerWeak`,
    ]).optional(),
    size: R([`xsmall`, `small`, `medium`, `large`]).optional(),
    layout: R([`withText`, `iconOnly`]).optional(),
    loading: I().optional(),
    disabled: I().optional(),
  }),
  gc = `Primary action button. Use variant='brandSolid' for CTAs, 'neutralWeak' for secondary actions, 'dangerSolid' for destructive actions. Text content goes as children.`,
  _c = L({ open: I().optional(), defaultOpen: I().optional() }),
  vc = `Alert dialog container. Must contain AlertDialogContent. Use open/defaultOpen to control visibility.`,
  yc = L({}),
  bc = `Alert dialog content wrapper. Must be inside AlertDialogRoot. Contains AlertDialogHeader and AlertDialogFooter.`,
  xc = L({}),
  Sc = `Alert dialog header section. Contains AlertDialogTitle and AlertDialogDescription.`,
  Cc = L({}),
  wc = `Alert dialog title text. Must be inside AlertDialogHeader. Text content goes as children.`,
  Tc = L({}),
  Ec = `Alert dialog description text. Must be inside AlertDialogHeader. Text content goes as children.`,
  Dc = L({}),
  Oc = `Alert dialog footer section for action buttons. Contains AlertDialogAction components.`,
  kc = L({
    variant: R([
      `brandSolid`,
      `neutralSolid`,
      `neutralWeak`,
      `dangerSolid`,
      `dangerWeak`,
    ]).optional(),
  }),
  Ac = `Alert dialog action button. Must be inside AlertDialogFooter. Use variant='neutralWeak' for cancel, 'brandSolid' or 'dangerSolid' for confirm. Text goes as children.`,
  jc = L({
    src: F().optional(),
    alt: F().optional(),
    size: R([`20`, `24`, `36`, `42`, `48`, `56`, `64`, `80`, `96`, `108`]).optional(),
  }),
  Mc = `User avatar image. Default size is '48'. Use src for image URL, alt for accessibility text.`,
  Nc = L({
    variant: R([`weak`, `solid`, `outline`, `inverted`]).optional(),
    size: R([`medium`, `large`]).optional(),
    tone: R([
      `neutral`,
      `brand`,
      `informative`,
      `positive`,
      `critical`,
      `warning`,
      `magic`,
    ]).optional(),
  }),
  Pc = `Status badge/tag component. Text content goes as children. Use tone for semantic color (e.g., 'positive' for success, 'critical' for error).`,
  Fc = L({
    title: F().optional(),
    description: F(),
    tone: R([`neutral`, `informative`, `positive`, `warning`, `critical`, `magic`]).optional(),
  }),
  Ic = `Informational callout/banner. description is required. Use tone for semantic color (e.g., 'informative' for info, 'warning' for alerts, 'critical' for errors).`,
  Lc = L({
    label: F().optional(),
    description: F().optional(),
    errorMessage: F().optional(),
    required: I().optional(),
    disabled: I().optional(),
  }),
  Rc = `Group container for multiple Checkbox components. Provides shared label, description, and error message. Children must be Checkbox components.`,
  zc = L({
    label: F().optional(),
    checked: I().optional(),
    defaultChecked: I().optional(),
    disabled: I().optional(),
    value: F().optional(),
  }),
  Bc = `Single checkbox input. Can be used standalone or inside a CheckboxGroup. Use label prop for the checkbox label text.`,
  Vc = L({
    as: R([`div`, `section`, `article`, `main`, `aside`, `nav`, `header`, `footer`]).optional(),
    display: R([`flex`, `block`, `grid`, `none`]).optional(),
    padding: F().optional(),
    paddingX: F().optional(),
    paddingY: F().optional(),
    margin: F().optional(),
    gap: F().optional(),
    width: F().optional(),
    height: F().optional(),
    bg: F().optional(),
    borderRadius: F().optional(),
  }),
  Hc = `Generic container element. Use spacing tokens like 'spacingX.sm', 'spacingY.md'. Use 'full' for 100% width/height.`,
  Uc = L({
    gap: F().optional(),
    align: R([`flex-start`, `center`, `flex-end`, `stretch`, `baseline`]).optional(),
    justify: R([
      `flex-start`,
      `center`,
      `flex-end`,
      `space-between`,
      `space-around`,
      `space-evenly`,
    ]).optional(),
    padding: F().optional(),
    paddingX: F().optional(),
    paddingY: F().optional(),
  }),
  Wc = `Vertical stack layout (flexDirection=column). Use gap with spacing tokens: 'spacingY.xs', 'spacingY.sm', 'spacingY.md', 'spacingY.lg', 'spacingY.xl'.`,
  Gc = L({
    gap: F().optional(),
    align: R([`flex-start`, `center`, `flex-end`, `stretch`, `baseline`]).optional(),
    justify: R([
      `flex-start`,
      `center`,
      `flex-end`,
      `space-between`,
      `space-around`,
      `space-evenly`,
    ]).optional(),
    padding: F().optional(),
    paddingX: F().optional(),
    paddingY: F().optional(),
  }),
  Kc = `Horizontal stack layout (flexDirection=row). Use gap with spacing tokens: 'spacingX.xs', 'spacingX.sm', 'spacingX.md', 'spacingX.lg', 'spacingX.xl'.`,
  qc = L({
    label: F().optional(),
    description: F().optional(),
    errorMessage: F().optional(),
    required: I().optional(),
    disabled: I().optional(),
    invalid: I().optional(),
    defaultValue: F().optional(),
  }),
  Jc = `Radio button group. Provides shared label and validation. Children must be RadioGroupItem components. Use defaultValue to set initial selection.`,
  Yc = L({ label: F().optional(), value: F(), disabled: I().optional() }),
  Xc = `Single radio option. Must be a child of RadioGroup. The value prop is required and must be unique within the group.`,
  Zc = L({
    label: F().optional(),
    description: F().optional(),
    errorMessage: F().optional(),
    required: I().optional(),
    disabled: I().optional(),
    invalid: I().optional(),
    columns: Ra().optional(),
    defaultValue: F().optional(),
  }),
  Qc = `Single-select card group (radio behavior). Use columns prop to set grid layout. Children must be RadioSelectBoxItem components.`,
  $c = L({ label: F(), description: F().optional(), value: F(), disabled: I().optional() }),
  el = `Single-select card option. Must be a child of RadioSelectBoxRoot. label and value are required.`,
  tl = L({
    label: F().optional(),
    description: F().optional(),
    errorMessage: F().optional(),
    required: I().optional(),
    disabled: I().optional(),
    columns: Ra().optional(),
  }),
  nl = `Multi-select card group (checkbox behavior). Use columns prop to set grid layout. Children must be CheckSelectBox components.`,
  rl = L({
    label: F(),
    description: F().optional(),
    value: F().optional(),
    checked: I().optional(),
    defaultChecked: I().optional(),
    disabled: I().optional(),
  }),
  il = `Multi-select card option. Must be a child of CheckSelectBoxGroup. label is required.`,
  al = L({
    label: F().optional(),
    checked: I().optional(),
    defaultChecked: I().optional(),
    disabled: I().optional(),
    size: R([`16`, `24`, `32`]).optional(),
  }),
  ol = `Toggle switch component. Use label prop for descriptive text. Default size is '32' (largest).`,
  sl = L({ defaultValue: F().optional(), value: F().optional() }),
  cl = `Tab container. Must contain TabsList and TabsContent children. Use defaultValue to set initial active tab.`,
  ll = L({}),
  ul = `Tab trigger list. Must be inside TabsRoot. Children must be TabsTrigger components.`,
  dl = L({ value: F(), notification: I().optional() }),
  fl = `Individual tab trigger button. Must be inside TabsList. value is required and must match a TabsContent value. Text label goes as children.`,
  pl = L({ value: F() }),
  ml = `Tab content panel. Must be inside TabsRoot. value must match a TabsTrigger value. Content goes as children.`,
  hl = L({
    as: R([
      `span`,
      `p`,
      `h1`,
      `h2`,
      `h3`,
      `h4`,
      `h5`,
      `h6`,
      `strong`,
      `legend`,
      `dt`,
      `dd`,
    ]).optional(),
    textStyle: R([
      `screenTitle`,
      `t1Regular`,
      `t1Medium`,
      `t1Bold`,
      `t2Regular`,
      `t2Medium`,
      `t2Bold`,
      `t3Regular`,
      `t3Medium`,
      `t3Bold`,
      `t4Regular`,
      `t4Medium`,
      `t4Bold`,
      `t5Regular`,
      `t5Medium`,
      `t5Bold`,
      `t6Regular`,
      `t6Medium`,
      `t6Bold`,
      `t7Regular`,
      `t7Medium`,
      `t7Bold`,
    ]).optional(),
    color: F().optional(),
    fontWeight: R([`regular`, `medium`, `bold`]).optional(),
    maxLines: Ra().optional(),
    align: R([`left`, `center`, `right`]).optional(),
  }),
  gl = `Typography component. Use textStyle for preset sizes (t1Bold=largest, t7Regular=smallest). Color accepts tokens like 'fg.neutral', 'fg.neutralSubtle', 'fg.brand'. Text content goes as children.`,
  _l = L({
    label: F().optional(),
    description: F().optional(),
    errorMessage: F().optional(),
    required: I().optional(),
    disabled: I().optional(),
    invalid: I().optional(),
    readOnly: I().optional(),
    maxGraphemeCount: Ra().optional(),
    showRequiredIndicator: I().optional(),
  }),
  vl = `Text input field wrapper with label, description, and error message. Must contain a TextFieldInput or TextFieldTextarea child.`,
  yl = L({
    placeholder: F().optional(),
    type: R([`text`, `email`, `password`, `number`, `tel`, `url`, `search`]).optional(),
  }),
  bl = `Input element for TextField. Must be a direct child of TextField.`,
  xl = L({ placeholder: F().optional(), rows: Ra().optional() }),
  Sl = Xs(Qs, {
    actions: {},
    components: {
      Box: { props: Vc, description: Hc },
      VStack: { props: Uc, description: Wc },
      HStack: { props: Gc, description: Kc },
      Text: { props: hl, description: gl },
      ActionButton: { props: hc, description: gc },
      TextField: { props: _l, description: vl },
      TextFieldInput: { props: yl, description: bl },
      TextFieldTextarea: {
        props: xl,
        description: `Textarea element for TextField. Must be a direct child of TextField.`,
      },
      CheckboxGroup: { props: Lc, description: Rc },
      Checkbox: { props: zc, description: Bc },
      Switch: { props: al, description: ol },
      RadioGroup: { props: qc, description: Jc },
      RadioGroupItem: { props: Yc, description: Xc },
      RadioSelectBoxRoot: { props: Zc, description: Qc },
      RadioSelectBoxItem: { props: $c, description: el },
      CheckSelectBoxGroup: { props: tl, description: nl },
      CheckSelectBox: { props: rl, description: il },
      TabsRoot: { props: sl, description: cl },
      TabsList: { props: ll, description: ul },
      TabsTrigger: { props: dl, description: fl },
      TabsContent: { props: pl, description: ml },
      AlertDialogRoot: { props: _c, description: vc },
      AlertDialogContent: { props: yc, description: bc },
      AlertDialogHeader: { props: xc, description: Sc },
      AlertDialogTitle: { props: Cc, description: wc },
      AlertDialogDescription: { props: Tc, description: Ec },
      AlertDialogFooter: { props: Dc, description: Oc },
      AlertDialogAction: { props: kc, description: Ac },
      Avatar: { props: jc, description: Mc },
      Badge: { props: Nc, description: Pc },
      Callout: { props: Fc, description: Ic },
    },
  }),
  Cl = s({
    blue100: () => Wl,
    blue1000: () => Xl,
    blue200: () => H,
    blue300: () => U,
    blue400: () => W,
    blue500: () => Gl,
    blue600: () => Kl,
    blue700: () => ql,
    blue800: () => Jl,
    blue900: () => Yl,
    carrot100: () => Fl,
    carrot1000: () => V,
    carrot200: () => Il,
    carrot300: () => Ll,
    carrot400: () => Rl,
    carrot500: () => zl,
    carrot600: () => Bl,
    carrot700: () => Vl,
    carrot800: () => Hl,
    carrot900: () => Ul,
    gray00: () => wl,
    gray100: () => Tl,
    gray1000: () => Pl,
    gray200: () => El,
    gray300: () => Dl,
    gray400: () => Ol,
    gray500: () => kl,
    gray600: () => Al,
    gray700: () => jl,
    gray800: () => Ml,
    gray900: () => Nl,
    green100: () => su,
    green1000: () => gu,
    green200: () => cu,
    green300: () => lu,
    green400: () => uu,
    green500: () => du,
    green600: () => fu,
    green700: () => pu,
    green800: () => mu,
    green900: () => hu,
    purple100: () => Du,
    purple1000: () => Iu,
    purple200: () => Ou,
    purple300: () => ku,
    purple400: () => Au,
    purple500: () => ju,
    purple600: () => Mu,
    purple700: () => Nu,
    purple800: () => Pu,
    purple900: () => Fu,
    red100: () => Zl,
    red1000: () => ou,
    red200: () => Ql,
    red300: () => $l,
    red400: () => eu,
    red500: () => tu,
    red600: () => nu,
    red700: () => ru,
    red800: () => iu,
    red900: () => au,
    staticBlack: () => Lu,
    staticBlackAlpha100: () => Ru,
    staticBlackAlpha1000: () => qu,
    staticBlackAlpha200: () => zu,
    staticBlackAlpha300: () => Bu,
    staticBlackAlpha400: () => Vu,
    staticBlackAlpha500: () => Hu,
    staticBlackAlpha600: () => Uu,
    staticBlackAlpha700: () => Wu,
    staticBlackAlpha800: () => Gu,
    staticBlackAlpha900: () => Ku,
    staticWhite: () => Ju,
    staticWhiteAlpha100: () => Xu,
    staticWhiteAlpha1000: () => id,
    staticWhiteAlpha200: () => G,
    staticWhiteAlpha300: () => Zu,
    staticWhiteAlpha400: () => Qu,
    staticWhiteAlpha50: () => Yu,
    staticWhiteAlpha500: () => $u,
    staticWhiteAlpha600: () => ed,
    staticWhiteAlpha700: () => td,
    staticWhiteAlpha800: () => nd,
    staticWhiteAlpha900: () => rd,
    yellow100: () => _u,
    yellow1000: () => Eu,
    yellow200: () => vu,
    yellow300: () => yu,
    yellow400: () => bu,
    yellow500: () => xu,
    yellow600: () => Su,
    yellow700: () => Cu,
    yellow800: () => wu,
    yellow900: () => Tu,
  }),
  wl = `var(--seed-color-palette-gray-00)`,
  Tl = `var(--seed-color-palette-gray-100)`,
  El = `var(--seed-color-palette-gray-200)`,
  Dl = `var(--seed-color-palette-gray-300)`,
  Ol = `var(--seed-color-palette-gray-400)`,
  kl = `var(--seed-color-palette-gray-500)`,
  Al = `var(--seed-color-palette-gray-600)`,
  jl = `var(--seed-color-palette-gray-700)`,
  Ml = `var(--seed-color-palette-gray-800)`,
  Nl = `var(--seed-color-palette-gray-900)`,
  Pl = `var(--seed-color-palette-gray-1000)`,
  Fl = `var(--seed-color-palette-carrot-100)`,
  Il = `var(--seed-color-palette-carrot-200)`,
  Ll = `var(--seed-color-palette-carrot-300)`,
  Rl = `var(--seed-color-palette-carrot-400)`,
  zl = `var(--seed-color-palette-carrot-500)`,
  Bl = `var(--seed-color-palette-carrot-600)`,
  Vl = `var(--seed-color-palette-carrot-700)`,
  Hl = `var(--seed-color-palette-carrot-800)`,
  Ul = `var(--seed-color-palette-carrot-900)`,
  V = `var(--seed-color-palette-carrot-1000)`,
  Wl = `var(--seed-color-palette-blue-100)`,
  H = `var(--seed-color-palette-blue-200)`,
  U = `var(--seed-color-palette-blue-300)`,
  W = `var(--seed-color-palette-blue-400)`,
  Gl = `var(--seed-color-palette-blue-500)`,
  Kl = `var(--seed-color-palette-blue-600)`,
  ql = `var(--seed-color-palette-blue-700)`,
  Jl = `var(--seed-color-palette-blue-800)`,
  Yl = `var(--seed-color-palette-blue-900)`,
  Xl = `var(--seed-color-palette-blue-1000)`,
  Zl = `var(--seed-color-palette-red-100)`,
  Ql = `var(--seed-color-palette-red-200)`,
  $l = `var(--seed-color-palette-red-300)`,
  eu = `var(--seed-color-palette-red-400)`,
  tu = `var(--seed-color-palette-red-500)`,
  nu = `var(--seed-color-palette-red-600)`,
  ru = `var(--seed-color-palette-red-700)`,
  iu = `var(--seed-color-palette-red-800)`,
  au = `var(--seed-color-palette-red-900)`,
  ou = `var(--seed-color-palette-red-1000)`,
  su = `var(--seed-color-palette-green-100)`,
  cu = `var(--seed-color-palette-green-200)`,
  lu = `var(--seed-color-palette-green-300)`,
  uu = `var(--seed-color-palette-green-400)`,
  du = `var(--seed-color-palette-green-500)`,
  fu = `var(--seed-color-palette-green-600)`,
  pu = `var(--seed-color-palette-green-700)`,
  mu = `var(--seed-color-palette-green-800)`,
  hu = `var(--seed-color-palette-green-900)`,
  gu = `var(--seed-color-palette-green-1000)`,
  _u = `var(--seed-color-palette-yellow-100)`,
  vu = `var(--seed-color-palette-yellow-200)`,
  yu = `var(--seed-color-palette-yellow-300)`,
  bu = `var(--seed-color-palette-yellow-400)`,
  xu = `var(--seed-color-palette-yellow-500)`,
  Su = `var(--seed-color-palette-yellow-600)`,
  Cu = `var(--seed-color-palette-yellow-700)`,
  wu = `var(--seed-color-palette-yellow-800)`,
  Tu = `var(--seed-color-palette-yellow-900)`,
  Eu = `var(--seed-color-palette-yellow-1000)`,
  Du = `var(--seed-color-palette-purple-100)`,
  Ou = `var(--seed-color-palette-purple-200)`,
  ku = `var(--seed-color-palette-purple-300)`,
  Au = `var(--seed-color-palette-purple-400)`,
  ju = `var(--seed-color-palette-purple-500)`,
  Mu = `var(--seed-color-palette-purple-600)`,
  Nu = `var(--seed-color-palette-purple-700)`,
  Pu = `var(--seed-color-palette-purple-800)`,
  Fu = `var(--seed-color-palette-purple-900)`,
  Iu = `var(--seed-color-palette-purple-1000)`,
  Lu = `var(--seed-color-palette-static-black)`,
  Ru = `var(--seed-color-palette-static-black-alpha-100)`,
  zu = `var(--seed-color-palette-static-black-alpha-200)`,
  Bu = `var(--seed-color-palette-static-black-alpha-300)`,
  Vu = `var(--seed-color-palette-static-black-alpha-400)`,
  Hu = `var(--seed-color-palette-static-black-alpha-500)`,
  Uu = `var(--seed-color-palette-static-black-alpha-600)`,
  Wu = `var(--seed-color-palette-static-black-alpha-700)`,
  Gu = `var(--seed-color-palette-static-black-alpha-800)`,
  Ku = `var(--seed-color-palette-static-black-alpha-900)`,
  qu = `var(--seed-color-palette-static-black-alpha-1000)`,
  Ju = `var(--seed-color-palette-static-white)`,
  Yu = `var(--seed-color-palette-static-white-alpha-50)`,
  Xu = `var(--seed-color-palette-static-white-alpha-100)`,
  G = `var(--seed-color-palette-static-white-alpha-200)`,
  Zu = `var(--seed-color-palette-static-white-alpha-300)`,
  Qu = `var(--seed-color-palette-static-white-alpha-400)`,
  $u = `var(--seed-color-palette-static-white-alpha-500)`,
  ed = `var(--seed-color-palette-static-white-alpha-600)`,
  td = `var(--seed-color-palette-static-white-alpha-700)`,
  nd = `var(--seed-color-palette-static-white-alpha-800)`,
  rd = `var(--seed-color-palette-static-white-alpha-900)`,
  id = `var(--seed-color-palette-static-white-alpha-1000)`,
  ad = s({
    brand: () => od,
    brandContrast: () => sd,
    critical: () => cd,
    criticalContrast: () => ld,
    disabled: () => ud,
    informative: () => dd,
    informativeContrast: () => fd,
    neutral: () => pd,
    neutralInverted: () => md,
    neutralMuted: () => hd,
    neutralSubtle: () => gd,
    placeholder: () => _d,
    positive: () => vd,
    positiveContrast: () => yd,
    warning: () => bd,
    warningContrast: () => xd,
  }),
  od = `var(--seed-color-fg-brand)`,
  sd = `var(--seed-color-fg-brand-contrast)`,
  cd = `var(--seed-color-fg-critical)`,
  ld = `var(--seed-color-fg-critical-contrast)`,
  ud = `var(--seed-color-fg-disabled)`,
  dd = `var(--seed-color-fg-informative)`,
  fd = `var(--seed-color-fg-informative-contrast)`,
  pd = `var(--seed-color-fg-neutral)`,
  md = `var(--seed-color-fg-neutral-inverted)`,
  hd = `var(--seed-color-fg-neutral-muted)`,
  gd = `var(--seed-color-fg-neutral-subtle)`,
  _d = `var(--seed-color-fg-placeholder)`,
  vd = `var(--seed-color-fg-positive)`,
  yd = `var(--seed-color-fg-positive-contrast)`,
  bd = `var(--seed-color-fg-warning)`,
  xd = `var(--seed-color-fg-warning-contrast)`,
  Sd = s({
    brandSolid: () => Cd,
    brandSolidPressed: () => wd,
    brandWeak: () => Td,
    brandWeakPressed: () => K,
    criticalSolid: () => Ed,
    criticalSolidPressed: () => Dd,
    criticalWeak: () => Od,
    criticalWeakPressed: () => kd,
    disabled: () => Ad,
    informativeSolid: () => jd,
    informativeSolidPressed: () => Md,
    informativeWeak: () => Nd,
    informativeWeakPressed: () => Pd,
    layerBasement: () => Fd,
    layerDefault: () => Id,
    layerDefaultPressed: () => Ld,
    layerFill: () => Rd,
    layerFloating: () => zd,
    layerFloatingPressed: () => Bd,
    magicWeak: () => Vd,
    neutralInverted: () => Hd,
    neutralInvertedPressed: () => Ud,
    neutralSolid: () => Wd,
    neutralSolidMuted: () => Gd,
    neutralSolidMutedPressed: () => Kd,
    neutralWeak: () => qd,
    neutralWeakAlpha: () => Jd,
    neutralWeakAlphaPressed: () => Yd,
    neutralWeakPressed: () => Xd,
    overlay: () => Zd,
    overlayMuted: () => Qd,
    positiveSolid: () => $d,
    positiveSolidPressed: () => ef,
    positiveWeak: () => tf,
    positiveWeakPressed: () => nf,
    transparent: () => rf,
    transparentPressed: () => af,
    warningSolid: () => of,
    warningSolidPressed: () => sf,
    warningWeak: () => cf,
    warningWeakPressed: () => lf,
  }),
  Cd = `var(--seed-color-bg-brand-solid)`,
  wd = `var(--seed-color-bg-brand-solid-pressed)`,
  Td = `var(--seed-color-bg-brand-weak)`,
  K = `var(--seed-color-bg-brand-weak-pressed)`,
  Ed = `var(--seed-color-bg-critical-solid)`,
  Dd = `var(--seed-color-bg-critical-solid-pressed)`,
  Od = `var(--seed-color-bg-critical-weak)`,
  kd = `var(--seed-color-bg-critical-weak-pressed)`,
  Ad = `var(--seed-color-bg-disabled)`,
  jd = `var(--seed-color-bg-informative-solid)`,
  Md = `var(--seed-color-bg-informative-solid-pressed)`,
  Nd = `var(--seed-color-bg-informative-weak)`,
  Pd = `var(--seed-color-bg-informative-weak-pressed)`,
  Fd = `var(--seed-color-bg-layer-basement)`,
  Id = `var(--seed-color-bg-layer-default)`,
  Ld = `var(--seed-color-bg-layer-default-pressed)`,
  Rd = `var(--seed-color-bg-layer-fill)`,
  zd = `var(--seed-color-bg-layer-floating)`,
  Bd = `var(--seed-color-bg-layer-floating-pressed)`,
  Vd = `var(--seed-color-bg-magic-weak)`,
  Hd = `var(--seed-color-bg-neutral-inverted)`,
  Ud = `var(--seed-color-bg-neutral-inverted-pressed)`,
  Wd = `var(--seed-color-bg-neutral-solid)`,
  Gd = `var(--seed-color-bg-neutral-solid-muted)`,
  Kd = `var(--seed-color-bg-neutral-solid-muted-pressed)`,
  qd = `var(--seed-color-bg-neutral-weak)`,
  Jd = `var(--seed-color-bg-neutral-weak-alpha)`,
  Yd = `var(--seed-color-bg-neutral-weak-alpha-pressed)`,
  Xd = `var(--seed-color-bg-neutral-weak-pressed)`,
  Zd = `var(--seed-color-bg-overlay)`,
  Qd = `var(--seed-color-bg-overlay-muted)`,
  $d = `var(--seed-color-bg-positive-solid)`,
  ef = `var(--seed-color-bg-positive-solid-pressed)`,
  tf = `var(--seed-color-bg-positive-weak)`,
  nf = `var(--seed-color-bg-positive-weak-pressed)`,
  rf = `var(--seed-color-bg-transparent)`,
  af = `var(--seed-color-bg-transparent-pressed)`,
  of = `var(--seed-color-bg-warning-solid)`,
  sf = `var(--seed-color-bg-warning-solid-pressed)`,
  cf = `var(--seed-color-bg-warning-weak)`,
  lf = `var(--seed-color-bg-warning-weak-pressed)`,
  uf = s({
    brandSolid: () => df,
    brandWeak: () => ff,
    criticalSolid: () => pf,
    criticalWeak: () => mf,
    focusRing: () => Ef,
    informativeSolid: () => hf,
    informativeWeak: () => gf,
    neutralContrast: () => _f,
    neutralMuted: () => vf,
    neutralSolid: () => yf,
    neutralSubtle: () => bf,
    neutralWeak: () => xf,
    positiveSolid: () => Sf,
    positiveWeak: () => Cf,
    warningSolid: () => wf,
    warningWeak: () => Tf,
  }),
  df = `var(--seed-color-stroke-brand-solid)`,
  ff = `var(--seed-color-stroke-brand-weak)`,
  pf = `var(--seed-color-stroke-critical-solid)`,
  mf = `var(--seed-color-stroke-critical-weak)`,
  hf = `var(--seed-color-stroke-informative-solid)`,
  gf = `var(--seed-color-stroke-informative-weak)`,
  _f = `var(--seed-color-stroke-neutral-contrast)`,
  vf = `var(--seed-color-stroke-neutral-muted)`,
  yf = `var(--seed-color-stroke-neutral-solid)`,
  bf = `var(--seed-color-stroke-neutral-subtle)`,
  xf = `var(--seed-color-stroke-neutral-weak)`,
  Sf = `var(--seed-color-stroke-positive-solid)`,
  Cf = `var(--seed-color-stroke-positive-weak)`,
  wf = `var(--seed-color-stroke-warning-solid)`,
  Tf = `var(--seed-color-stroke-warning-weak)`,
  Ef = `var(--seed-color-stroke-focus-ring)`,
  Df = s({ bg: () => Of, text: () => kf }),
  Of = `var(--seed-color-manner-temp-l1-bg)`,
  kf = `var(--seed-color-manner-temp-l1-text)`,
  Af = s({ bg: () => jf, text: () => Mf }),
  jf = `var(--seed-color-manner-temp-l10-bg)`,
  Mf = `var(--seed-color-manner-temp-l10-text)`,
  Nf = s({ bg: () => Pf, text: () => Ff }),
  Pf = `var(--seed-color-manner-temp-l2-bg)`,
  Ff = `var(--seed-color-manner-temp-l2-text)`,
  If = s({ bg: () => Lf, text: () => Rf }),
  Lf = `var(--seed-color-manner-temp-l3-bg)`,
  Rf = `var(--seed-color-manner-temp-l3-text)`,
  zf = s({ bg: () => Bf, text: () => Vf }),
  Bf = `var(--seed-color-manner-temp-l4-bg)`,
  Vf = `var(--seed-color-manner-temp-l4-text)`,
  Hf = s({ bg: () => Uf, text: () => Wf }),
  Uf = `var(--seed-color-manner-temp-l5-bg)`,
  Wf = `var(--seed-color-manner-temp-l5-text)`,
  Gf = s({ bg: () => Kf, text: () => qf }),
  Kf = `var(--seed-color-manner-temp-l6-bg)`,
  qf = `var(--seed-color-manner-temp-l6-text)`,
  Jf = s({ bg: () => Yf, text: () => Xf }),
  Yf = `var(--seed-color-manner-temp-l7-bg)`,
  Xf = `var(--seed-color-manner-temp-l7-text)`,
  Zf = s({ bg: () => Qf, text: () => $f }),
  Qf = `var(--seed-color-manner-temp-l8-bg)`,
  $f = `var(--seed-color-manner-temp-l8-text)`,
  ep = s({ bg: () => tp, text: () => np }),
  tp = `var(--seed-color-manner-temp-l9-bg)`,
  np = `var(--seed-color-manner-temp-l9-text)`,
  rp = s({
    l1: () => Df,
    l10: () => Af,
    l2: () => Nf,
    l3: () => If,
    l4: () => zf,
    l5: () => Hf,
    l6: () => Gf,
    l7: () => Jf,
    l8: () => Zf,
    l9: () => ep,
  }),
  ip = s({
    blue: () => ap,
    coolGray: () => op,
    green: () => sp,
    orange: () => cp,
    pink: () => lp,
    purple: () => up,
    red: () => dp,
    teal: () => fp,
    warmGray: () => pp,
    yellow: () => mp,
  }),
  ap = `var(--seed-color-banner-blue)`,
  op = `var(--seed-color-banner-cool-gray)`,
  sp = `var(--seed-color-banner-green)`,
  cp = `var(--seed-color-banner-orange)`,
  lp = `var(--seed-color-banner-pink)`,
  up = `var(--seed-color-banner-purple)`,
  dp = `var(--seed-color-banner-red)`,
  fp = `var(--seed-color-banner-teal)`,
  pp = `var(--seed-color-banner-warm-gray)`,
  mp = `var(--seed-color-banner-yellow)`,
  hp = s({
    banner: () => ip,
    bg: () => Sd,
    fg: () => ad,
    mannerTemp: () => rp,
    palette: () => Cl,
    stroke: () => uf,
  }),
  gp = s({ betweenChips: () => _p, globalGutter: () => vp }),
  _p = `var(--seed-dimension-spacing-x-between-chips)`,
  vp = `var(--seed-dimension-spacing-x-global-gutter)`,
  yp = s({
    betweenText: () => Cp,
    componentDefault: () => bp,
    navToTitle: () => xp,
    screenBottom: () => Sp,
  }),
  bp = `var(--seed-dimension-spacing-y-component-default)`,
  xp = `var(--seed-dimension-spacing-y-nav-to-title)`,
  Sp = `var(--seed-dimension-spacing-y-screen-bottom)`,
  Cp = `var(--seed-dimension-spacing-y-between-text)`,
  wp = s({
    spacingX: () => gp,
    spacingY: () => yp,
    x0_5: () => Tp,
    x1: () => Ep,
    x10: () => zp,
    x12: () => Bp,
    x13: () => Vp,
    x14: () => Hp,
    x16: () => Up,
    x1_5: () => Dp,
    x2: () => Op,
    x2_5: () => kp,
    x3: () => Ap,
    x3_5: () => jp,
    x4: () => Mp,
    x4_5: () => Np,
    x5: () => Pp,
    x6: () => Fp,
    x7: () => Ip,
    x8: () => Lp,
    x9: () => Rp,
  }),
  Tp = `var(--seed-dimension-x0_5)`,
  Ep = `var(--seed-dimension-x1)`,
  Dp = `var(--seed-dimension-x1_5)`,
  Op = `var(--seed-dimension-x2)`,
  kp = `var(--seed-dimension-x2_5)`,
  Ap = `var(--seed-dimension-x3)`,
  jp = `var(--seed-dimension-x3_5)`,
  Mp = `var(--seed-dimension-x4)`,
  Np = `var(--seed-dimension-x4_5)`,
  Pp = `var(--seed-dimension-x5)`,
  Fp = `var(--seed-dimension-x6)`,
  Ip = `var(--seed-dimension-x7)`,
  Lp = `var(--seed-dimension-x8)`,
  Rp = `var(--seed-dimension-x9)`,
  zp = `var(--seed-dimension-x10)`,
  Bp = `var(--seed-dimension-x12)`,
  Vp = `var(--seed-dimension-x13)`,
  Hp = `var(--seed-dimension-x14)`,
  Up = `var(--seed-dimension-x16)`,
  Wp = s({
    t1: () => Gp,
    t10: () => em,
    t10Static: () => um,
    t1Static: () => tm,
    t2: () => Kp,
    t2Static: () => nm,
    t3: () => qp,
    t3Static: () => rm,
    t4: () => Jp,
    t4Static: () => im,
    t5: () => Yp,
    t5Static: () => am,
    t6: () => Xp,
    t6Static: () => om,
    t7: () => Zp,
    t7Static: () => sm,
    t8: () => Qp,
    t8Static: () => cm,
    t9: () => $p,
    t9Static: () => lm,
  }),
  Gp = `var(--seed-font-size-t1)`,
  Kp = `var(--seed-font-size-t2)`,
  qp = `var(--seed-font-size-t3)`,
  Jp = `var(--seed-font-size-t4)`,
  Yp = `var(--seed-font-size-t5)`,
  Xp = `var(--seed-font-size-t6)`,
  Zp = `var(--seed-font-size-t7)`,
  Qp = `var(--seed-font-size-t8)`,
  $p = `var(--seed-font-size-t9)`,
  em = `var(--seed-font-size-t10)`,
  tm = `var(--seed-font-size-t1-static)`,
  nm = `var(--seed-font-size-t2-static)`,
  rm = `var(--seed-font-size-t3-static)`,
  im = `var(--seed-font-size-t4-static)`,
  am = `var(--seed-font-size-t5-static)`,
  om = `var(--seed-font-size-t6-static)`,
  sm = `var(--seed-font-size-t7-static)`,
  cm = `var(--seed-font-size-t8-static)`,
  lm = `var(--seed-font-size-t9-static)`,
  um = `var(--seed-font-size-t10-static)`,
  dm = s({ bold: () => mm, medium: () => pm, regular: () => fm }),
  fm = `var(--seed-font-weight-regular)`,
  pm = `var(--seed-font-weight-medium)`,
  mm = `var(--seed-font-weight-bold)`,
  hm = s({
    fadeLayerDefault: () => _m,
    fadeLayerFloating: () => gm,
    glowMagic: () => vm,
    glowMagicPressed: () => ym,
    highlightMagic: () => bm,
    highlightMagicPressed: () => xm,
    shimmerMagic: () => Sm,
    shimmerNeutral: () => Cm,
  }),
  gm = `var(--seed-gradient-fade-layer-floating)`,
  _m = `var(--seed-gradient-fade-layer-default)`,
  vm = `var(--seed-gradient-glow-magic)`,
  ym = `var(--seed-gradient-glow-magic-pressed)`,
  bm = `var(--seed-gradient-highlight-magic)`,
  xm = `var(--seed-gradient-highlight-magic-pressed)`,
  Sm = `var(--seed-gradient-shimmer-magic)`,
  Cm = `var(--seed-gradient-shimmer-neutral)`,
  wm = s({
    t1: () => Tm,
    t10: () => Pm,
    t10Static: () => Wm,
    t1Static: () => Fm,
    t2: () => Em,
    t2Static: () => Im,
    t3: () => Dm,
    t3Static: () => Lm,
    t4: () => Om,
    t4Static: () => Rm,
    t5: () => km,
    t5Static: () => zm,
    t6: () => Am,
    t6Static: () => Bm,
    t7: () => jm,
    t7Static: () => Vm,
    t8: () => Mm,
    t8Static: () => Hm,
    t9: () => Nm,
    t9Static: () => Um,
  }),
  Tm = `var(--seed-line-height-t1)`,
  Em = `var(--seed-line-height-t2)`,
  Dm = `var(--seed-line-height-t3)`,
  Om = `var(--seed-line-height-t4)`,
  km = `var(--seed-line-height-t5)`,
  Am = `var(--seed-line-height-t6)`,
  jm = `var(--seed-line-height-t7)`,
  Mm = `var(--seed-line-height-t8)`,
  Nm = `var(--seed-line-height-t9)`,
  Pm = `var(--seed-line-height-t10)`,
  Fm = `var(--seed-line-height-t1-static)`,
  Im = `var(--seed-line-height-t2-static)`,
  Lm = `var(--seed-line-height-t3-static)`,
  Rm = `var(--seed-line-height-t4-static)`,
  zm = `var(--seed-line-height-t5-static)`,
  Bm = `var(--seed-line-height-t6-static)`,
  Vm = `var(--seed-line-height-t7-static)`,
  Hm = `var(--seed-line-height-t8-static)`,
  Um = `var(--seed-line-height-t9-static)`,
  Wm = `var(--seed-line-height-t10-static)`,
  Gm = s({
    full: () => nh,
    r0_5: () => Km,
    r1: () => qm,
    r1_5: () => Jm,
    r2: () => Ym,
    r2_5: () => Xm,
    r3: () => Zm,
    r3_5: () => Qm,
    r4: () => $m,
    r5: () => eh,
    r6: () => th,
  }),
  Km = `var(--seed-radius-r0_5)`,
  qm = `var(--seed-radius-r1)`,
  Jm = `var(--seed-radius-r1_5)`,
  Ym = `var(--seed-radius-r2)`,
  Xm = `var(--seed-radius-r2_5)`,
  Zm = `var(--seed-radius-r3)`,
  Qm = `var(--seed-radius-r3_5)`,
  $m = `var(--seed-radius-r4)`,
  eh = `var(--seed-radius-r5)`,
  th = `var(--seed-radius-r6)`,
  nh = `var(--seed-radius-full)`,
  rh = s({ s1: () => ih, s2: () => ah, s3: () => oh }),
  ih = `var(--seed-shadow-s1)`,
  ah = `var(--seed-shadow-s2)`,
  oh = `var(--seed-shadow-s3)`;
function sh(e) {
  if (!e) return;
  let [t, n] = e.split(`.`);
  return hp[t]?.[n] ?? e;
}
function ch(e) {
  if (e == null) return;
  if (typeof e == `number`) return `${e}px`;
  if (e === `full`) return `100%`;
  let [t, n] = e.split(`.`);
  return wp[e] ?? wp[t]?.[n] ?? e;
}
function lh(e, t) {
  return e === `asPadding` ? `var(--seed-box-padding-${t})` : ch(e);
}
function uh(e) {
  if (e) return rh[e] ?? e;
}
function dh(e, t) {
  return e === `safeArea` ? `var(--seed-safe-area-${t})` : ch(e);
}
function fh(e) {
  if (e != null) return Gm[e] ?? e;
}
function ph(e, t) {
  if (!e || !t) return;
  let n = hm[e];
  if (n) return `linear-gradient(${t}, ${n})`;
}
function mh(e) {
  if (e)
    return (
      { flex: `flex`, inlineFlex: `inline-flex`, inlineBlock: `inline-block`, none: `none` }[e] ?? e
    );
}
function hh(e) {
  if (e)
    return (
      { row: `row`, column: `column`, rowReverse: `row-reverse`, columnReverse: `column-reverse` }[
        e
      ] ?? e
    );
}
function gh(e) {
  if (e)
    return (
      {
        flexStart: `flex-start`,
        flexEnd: `flex-end`,
        center: `center`,
        spaceBetween: `space-between`,
        spaceAround: `space-around`,
      }[e] ?? e
    );
}
function _h(e) {
  if (e)
    return (
      { flexStart: `flex-start`, flexEnd: `flex-end`, center: `center`, stretch: `stretch` }[e] ?? e
    );
}
function vh(e) {
  let {
      background: t,
      bg: n,
      bgGradient: r,
      backgroundGradient: i,
      bgGradientDirection: a,
      backgroundGradientDirection: o,
      color: s,
      borderColor: c,
      borderWidth: l,
      borderTopWidth: u,
      borderRightWidth: d,
      borderBottomWidth: f,
      borderLeftWidth: p,
      borderRadius: m,
      borderTopLeftRadius: h,
      borderTopRightRadius: g,
      borderBottomRightRadius: _,
      borderBottomLeftRadius: v,
      boxShadow: y,
      width: b,
      minWidth: x,
      maxWidth: S,
      height: C,
      minHeight: w,
      maxHeight: ee,
      padding: T,
      paddingX: te,
      paddingY: E,
      paddingTop: ne,
      paddingRight: re,
      paddingBottom: ie,
      paddingLeft: ae,
      p: oe,
      px: se,
      py: ce,
      pt: D,
      pr: O,
      pb: le,
      pl: ue,
      bleedX: de,
      bleedY: fe,
      bleedTop: k,
      bleedRight: A,
      bleedBottom: pe,
      bleedLeft: me,
      bottom: he,
      left: ge,
      right: _e,
      top: j,
      display: ve,
      position: ye,
      overflowX: be,
      overflowY: xe,
      zIndex: Se,
      flexGrow: Ce,
      flexShrink: we,
      flexDirection: Te,
      flexWrap: Ee,
      justifyContent: De,
      justifySelf: Oe,
      alignItems: ke,
      alignContent: Ae,
      alignSelf: je,
      gap: Me,
      gridColumn: Ne,
      gridRow: Pe,
      unstable_transform: Fe,
      _active: Ie,
      style: Le,
      ...Re
    } = e,
    ze = ph(r ?? i, a ?? o);
  return {
    style: {
      "--seed-box-background": sh(t ?? n) ?? ze,
      "--seed-box-color": sh(s),
      "--seed-box-border-color": sh(c),
      "--seed-box-border-width": l === void 0 ? void 0 : `${l}px`,
      "--seed-box-border-top-width": u === void 0 ? void 0 : `${u}px`,
      "--seed-box-border-right-width": d === void 0 ? void 0 : `${d}px`,
      "--seed-box-border-bottom-width": f === void 0 ? void 0 : `${f}px`,
      "--seed-box-border-left-width": p === void 0 ? void 0 : `${p}px`,
      "--seed-box-border-radius": fh(m),
      "--seed-box-border-top-left-radius": fh(h),
      "--seed-box-border-top-right-radius": fh(g),
      "--seed-box-border-bottom-right-radius": fh(_),
      "--seed-box-border-bottom-left-radius": fh(v),
      "--seed-box-box-shadow": uh(y),
      "--seed-box-width": ch(b),
      "--seed-box-min-width": ch(x),
      "--seed-box-max-width": ch(S),
      "--seed-box-height": ch(C),
      "--seed-box-min-height": ch(w),
      "--seed-box-max-height": ch(ee),
      "--seed-box-padding": ch(T ?? oe),
      "--seed-box-padding-x": ch(te ?? se),
      "--seed-box-padding-y": ch(E ?? ce),
      "--seed-box-padding-top": dh(ne ?? D, `top`),
      "--seed-box-padding-right": ch(re ?? O),
      "--seed-box-padding-bottom": dh(ie ?? le, `bottom`),
      "--seed-box-padding-left": ch(ae ?? ue),
      "--seed-box-bleed-top": lh(k ?? fe, `top`),
      "--seed-box-bleed-right": lh(A ?? de, `right`),
      "--seed-box-bleed-bottom": lh(pe ?? fe, `bottom`),
      "--seed-box-bleed-left": lh(me ?? de, `left`),
      "--seed-box-top": j,
      "--seed-box-left": ge,
      "--seed-box-right": _e,
      "--seed-box-bottom": he,
      "--seed-box-gap": ch(Me),
      "--seed-box-display": mh(ve),
      "--seed-box-position": ye,
      "--seed-box-overflow-x": be,
      "--seed-box-overflow-y": xe,
      "--seed-box-z-index": Se,
      "--seed-box-flex-grow": Ce === !0 ? 1 : Ce,
      "--seed-box-flex-shrink": we === !0 ? 1 : we,
      "--seed-box-flex-direction": hh(Te),
      "--seed-box-flex-wrap": Ee === !0 ? `wrap` : Ee,
      "--seed-box-justify-content": gh(De),
      "--seed-box-justify-self": Oe,
      "--seed-box-align-items": _h(ke),
      "--seed-box-align-content": _h(Ae),
      "--seed-box-align-self": _h(je),
      "--seed-box-grid-column": Ne,
      "--seed-box-grid-row": Pe,
      "--seed-box-unstable-transform": Fe,
      "--seed-box-background--active": sh(Ie?.bg ?? Ie?.background),
      ...Le,
    },
    restProps: {
      ...Re,
      ...((Ie?.bg != null || Ie?.background != null) && { "data-has-active-bg": `` }),
    },
  };
}
function yh(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
function bh(...e) {
  return (t) => {
    let n = !1,
      r = e.map((e) => {
        let r = yh(e, t);
        return !n && typeof r == `function` && (n = !0), r;
      });
    if (n)
      return () => {
        for (let t = 0; t < r.length; t++) {
          let n = r[t];
          typeof n == `function` ? n() : yh(e[t], null);
        }
      };
  };
}
function xh(...e) {
  return x.useCallback(bh(...e), e);
}
var Sh = Symbol.for(`react.lazy`),
  Ch = x.use;
function wh(e) {
  return typeof e == `object` && !!e && `then` in e;
}
function Th(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `$$typeof` in e &&
    e.$$typeof === Sh &&
    `_payload` in e &&
    wh(e._payload)
  );
}
function Eh(e) {
  let t = Oh(e),
    n = x.forwardRef((e, n) => {
      let { children: r, ...i } = e;
      Th(r) && typeof Ch == `function` && (r = Ch(r._payload));
      let a = x.Children.toArray(r),
        o = a.find(Ah);
      if (o) {
        let e = o.props.children,
          r = a.map((t) =>
            t === o
              ? x.Children.count(e) > 1
                ? x.Children.only(null)
                : x.isValidElement(e)
                  ? e.props.children
                  : null
              : t,
          );
        return (0, S.jsx)(t, {
          ...i,
          ref: n,
          children: x.isValidElement(e) ? x.cloneElement(e, void 0, r) : null,
        });
      }
      return (0, S.jsx)(t, { ...i, ref: n, children: r });
    });
  return (n.displayName = `${e}.Slot`), n;
}
var Dh = Eh(`Slot`);
function Oh(e) {
  let t = x.forwardRef((e, t) => {
    let { children: n, ...r } = e;
    if ((Th(n) && typeof Ch == `function` && (n = Ch(n._payload)), x.isValidElement(n))) {
      let e = Mh(n),
        i = jh(r, n.props);
      return n.type !== x.Fragment && (i.ref = t ? bh(t, e) : e), x.cloneElement(n, i);
    }
    return x.Children.count(n) > 1 ? x.Children.only(null) : null;
  });
  return (t.displayName = `${e}.SlotClone`), t;
}
var kh = Symbol(`radix.slottable`);
function Ah(e) {
  return (
    x.isValidElement(e) &&
    typeof e.type == `function` &&
    `__radixId` in e.type &&
    e.type.__radixId === kh
  );
}
function jh(e, t) {
  let n = { ...t };
  for (let r in t) {
    let i = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? i && a
        ? (n[r] = (...e) => {
            let t = a(...e);
            return i(...e), t;
          })
        : i && (n[r] = i)
      : r === `style`
        ? (n[r] = { ...i, ...a })
        : r === `className` && (n[r] = [i, a].filter(Boolean).join(` `));
  }
  return { ...e, ...n };
}
function Mh(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, `ref`)?.get,
    n = t && `isReactWarning` in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, `ref`)?.get),
      (n = t && `isReactWarning` in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
var Nh = globalThis?.document ? x.useLayoutEffect : () => {},
  Ph = (0, x.forwardRef)(({ svg: e, ...t }, n) =>
    (0, S.jsx)(Dh, { ref: n, "aria-hidden": !0, className: `seed-prefix-icon`, ...t, children: e }),
  ),
  Fh = (0, x.forwardRef)(({ svg: e, ...t }, n) =>
    (0, S.jsx)(Dh, { ref: n, "aria-hidden": !0, className: `seed-suffix-icon`, ...t, children: e }),
  ),
  Ih = (0, x.createContext)(null),
  Lh = ({ children: e, enabled: t }) => {
    let n = (0, x.useRef)(!1),
      r = (0, x.useContext)(Ih),
      i = (0, x.useCallback)(() => {
        n.current = !0;
      }, []),
      a = (0, x.useCallback)(() => {
        n.current = !1;
      }, []);
    Nh(() => {}, [r, t]);
    let o = (0, x.useMemo)(() => (t ? { register: i, unregister: a } : r || null), [t, r, i, a]);
    return (0, S.jsx)(Ih.Provider, { value: o, children: e });
  };
(0, x.forwardRef)(({ svg: e, size: t, color: n, ...r }, i) => {
  let a = (0, x.useContext)(Ih);
  Nh(
    () => (
      a?.register(),
      () => {
        a?.unregister();
      }
    ),
    [a],
  );
  let o = ch(t),
    s = sh(n);
  return (0, S.jsx)(Dh, {
    ref: i,
    "aria-hidden": !0,
    className: `seed-icon`,
    style: { "--seed-icon-size": o, "--seed-icon-color": s },
    ...r,
    children: e,
  });
});
function Rh(e) {
  var t,
    n,
    r = ``;
  if (typeof e == `string` || typeof e == `number`) r += e;
  else if (typeof e == `object`)
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++) e[t] && (n = Rh(e[t])) && (r && (r += ` `), (r += n));
    } else for (n in e) e[n] && (r && (r += ` `), (r += n));
  return r;
}
function zh() {
  for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
    (e = arguments[n]) && (t = Rh(e)) && (r && (r += ` `), (r += t));
  return r;
}
var q = (e) => (e ? `` : void 0),
  Bh = (e) => (e ? `true` : void 0),
  J = (e) => e,
  Vh = (e) => e,
  Hh = (e) => e,
  Uh = (e) => e,
  Wh = (e) => e,
  Gh = {
    border: 0,
    clip: `rect(0 0 0 0)`,
    height: `1px`,
    margin: `-1px`,
    overflow: `hidden`,
    padding: 0,
    position: `absolute`,
    whiteSpace: `nowrap`,
    width: `1px`,
  };
function Y(...e) {
  let t = { ...e[0] };
  for (let n = 1; n < e.length; n++) {
    let r = e[n];
    for (let e in r) {
      let n = t[e],
        i = r[e];
      typeof n == `function` &&
      typeof i == `function` &&
      e[0] === `o` &&
      e[1] === `n` &&
      e.charCodeAt(2) >= 65 &&
      e.charCodeAt(2) <= 90
        ? (t[e] = Kh(i, n))
        : e === `className` && typeof n == `string` && typeof i == `string`
          ? (t[e] = zh(n, i))
          : e === `style`
            ? (t[e] = Object.assign({}, n ?? {}, i ?? {}))
            : (t[e] = i === void 0 ? n : i);
    }
  }
  return t;
}
var Kh =
  (...e) =>
  (...t) => {
    e.forEach(function (e) {
      e?.(...t);
    });
  };
function qh(e) {
  let { loading: t, disabled: n } = e;
  return {
    loading: t,
    disabled: n,
    stateProps: J({ "data-loading": t ? `` : void 0, "data-disabled": n ? `` : void 0 }),
  };
}
var Jh = x.createContext(null),
  Yh = Jh.Provider,
  Xh = () => {
    let e = x.useContext(Jh);
    if (e === null)
      throw Error(`usePendingButtonContext should be used within UsePendingButtonProvider`);
    return e;
  },
  Zh = (e, t, n = []) => {
    let r = Object.keys(t),
      i = r.map((e) => t[e]);
    return [
      e,
      r.map((t, n) => `${e}--${t}_${i[n]}`).join(` `),
      n
        .filter((e) => Object.keys(e).every((n) => e[n] === t[n]))
        .map(
          (t) =>
            `${e}--${Object.keys(t)
              .map((e) => `${e}_${t[e]}`)
              .join(`-`)}`,
        )
        .join(` `),
    ]
      .filter(Boolean)
      .join(` `);
  };
function Qh(e, t) {
  let n = { ...e };
  for (let e in t) t[e] != null && (n[e] = t[e]);
  return n;
}
function $h(e, t) {
  let n = {},
    r = {};
  for (let i in e) t[i] == null ? (r[i] = e[i]) : (n[i] = e[i]);
  return [n, r];
}
var eg = { variant: `brandSolid`, size: `medium`, layout: `withText` },
  tg = [
    { size: `xsmall`, layout: `withText` },
    { size: `xsmall`, layout: `iconOnly` },
    { size: `small`, layout: `withText` },
    { size: `small`, layout: `iconOnly` },
    { size: `medium`, layout: `withText` },
    { size: `medium`, layout: `iconOnly` },
    { size: `large`, layout: `withText` },
    { size: `large`, layout: `iconOnly` },
  ],
  ng = {
    variant: [
      `brandSolid`,
      `neutralSolid`,
      `neutralWeak`,
      `criticalSolid`,
      `brandOutline`,
      `neutralOutline`,
      `ghost`,
    ],
    size: [`xsmall`, `small`, `medium`, `large`],
    layout: [`withText`, `iconOnly`],
  };
function rg(e) {
  return Zh(`seed-action-button`, Qh(eg, e), tg);
}
Object.assign(rg, { splitVariantProps: (e) => $h(e, ng) });
function ig(e) {
  let t = x.forwardRef((t, n) => {
    let { asChild: r, ...i } = t;
    return (0, S.jsx)(r ? Dh : e, { ...i, ref: n });
  });
  return (t.displayName = `Primitive.${e}`), t;
}
var X = {
    div: ig(`div`),
    span: ig(`span`),
    img: ig(`img`),
    button: ig(`button`),
    label: ig(`label`),
    input: ig(`input`),
    textarea: ig(`textarea`),
    a: ig(`a`),
    p: ig(`p`),
    h2: ig(`h2`),
    ul: ig(`ul`),
    li: ig(`li`),
    svg: ig(`svg`),
    circle: ig(`circle`),
  },
  ag = x.forwardRef(
    (
      {
        variant: e,
        size: t,
        loading: n = !1,
        layout: r = `withText`,
        color: i,
        fontWeight: a,
        className: o,
        children: s,
        ...c
      },
      l,
    ) => {
      let u = rg({ variant: e, layout: r, size: t }),
        d = qh({ loading: n, disabled: c.disabled }),
        { style: f, restProps: p } = vh(c);
      return (
        r === `iconOnly` &&
          !(c[`aria-label`] || c[`aria-labelledby`]) &&
          console.warn(
            `When layout is 'iconOnly', 'aria-label' or 'aria-labelledby' should be provided.`,
          ),
        (0, S.jsx)(Yh, {
          value: d,
          children: (0, S.jsx)(Lh, {
            enabled: r === `iconOnly`,
            children: (0, S.jsx)(X.button, {
              ref: l,
              className: zh(u, o),
              style: {
                ...f,
                ...(i && { "--seed-box-color": sh(i) }),
                ...(a && { "--seed-font-weight": dm[a] }),
              },
              ...d.stateProps,
              ...p,
              children: s,
            }),
          }),
        })
      );
    },
  );
ag.displayName = `ActionButton`;
function og(e) {
  let t = (0, x.createContext)(null),
    n = ({ children: e, value: n }) => (0, S.jsx)(t.Provider, { value: n, children: e });
  function r() {
    return (0, x.useContext)(t);
  }
  let i = (t, n) => {
    let { defaultProps: i } = n ?? {},
      a = (0, x.forwardRef)((n, a) => {
        let o = { ...(i ?? {}), ...r(), ...n },
          [s, c] = e.splitVariantProps(o),
          l = e(s);
        return (0, S.jsx)(t, { ref: a, ...c, className: zh(l, o.className) });
      });
    return (a.displayName = t.displayName || t.name), a;
  };
  function a() {
    return n;
  }
  return { PropsProvider: n, useProps: r, withContext: i, withPropsProvider: a };
}
function sg(e) {
  let t = (0, x.createContext)(null),
    n = (0, x.createContext)(null),
    r = ({ children: e, value: n }) => (0, S.jsx)(t.Provider, { value: n, children: e }),
    i = ({ children: e, value: t }) => (0, S.jsx)(n.Provider, { value: t, children: e });
  function a() {
    let e = (0, x.useContext)(t);
    if (e === null)
      throw Error(
        `useClassNames must be used within a ClassNamesProvider. Did you forget to wrap your component in a ClassNamesProvider?`,
      );
    return e;
  }
  function o() {
    return (0, x.useContext)(n);
  }
  return {
    ClassNamesProvider: r,
    PropsProvider: i,
    useClassNames: a,
    useProps: o,
    withRootProvider: (t, n) => {
      let { defaultProps: i } = n ?? {},
        a = (n) => {
          let a = { ...(i ?? {}), ...o(), ...n },
            [s, c] = e.splitVariantProps(a);
          return (0, S.jsx)(r, { value: e(s), children: (0, S.jsx)(t, { ...c }) });
        };
      return (a.displayName = t.displayName || t.name), a;
    },
    withProvider: (t, n, i) => {
      let { defaultProps: a } = i ?? {},
        s = (0, x.forwardRef)((i, s) => {
          let c = { ...(a ?? {}), ...o(), ...i },
            [l, u] = e.splitVariantProps(c),
            d = e(l),
            f = d[n];
          return (0, S.jsx)(r, {
            value: d,
            children: (0, S.jsx)(t, { ref: s, ...u, className: zh(f, c.className) }),
          });
        });
      return (s.displayName = t.displayName || t.name), s;
    },
    withContext: (e, t) => {
      let n = (0, x.forwardRef)((n, r) => {
        let i = a()?.[t];
        return (0, S.jsx)(e, { ref: r, ...n, className: zh(i, n.className) });
      });
      return (n.displayName = e.displayName || e.name), n;
    },
  };
}
function cg(e) {
  return function (t) {
    let n = (0, x.forwardRef)((n, r) => {
      let i = {};
      for (let t of e)
        if (typeof t == `function`) Object.assign(i, t({ strict: !0 })?.stateProps);
        else {
          let { useContext: e, strict: n = !1 } = t;
          Object.assign(i, e({ strict: n })?.stateProps);
        }
      return (0, S.jsx)(t, { ref: r, ...i, ...n });
    });
    return (n.displayName = t.displayName || t.name), n;
  };
}
typeof window < `u` && window.document && window.document.createElement;
function lg(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (r) {
    if ((e?.(r), n === !1 || !r.defaultPrevented)) return t?.(r);
  };
}
function ug(e) {
  let t = dg(e),
    n = x.forwardRef((e, n) => {
      let { children: r, ...i } = e,
        a = x.Children.toArray(r),
        o = a.find(pg);
      if (o) {
        let e = o.props.children,
          r = a.map((t) =>
            t === o
              ? x.Children.count(e) > 1
                ? x.Children.only(null)
                : x.isValidElement(e)
                  ? e.props.children
                  : null
              : t,
          );
        return (0, S.jsx)(t, {
          ...i,
          ref: n,
          children: x.isValidElement(e) ? x.cloneElement(e, void 0, r) : null,
        });
      }
      return (0, S.jsx)(t, { ...i, ref: n, children: r });
    });
  return (n.displayName = `${e}.Slot`), n;
}
function dg(e) {
  let t = x.forwardRef((e, t) => {
    let { children: n, ...r } = e;
    if (x.isValidElement(n)) {
      let e = hg(n),
        i = mg(r, n.props);
      return n.type !== x.Fragment && (i.ref = t ? bh(t, e) : e), x.cloneElement(n, i);
    }
    return x.Children.count(n) > 1 ? x.Children.only(null) : null;
  });
  return (t.displayName = `${e}.SlotClone`), t;
}
var fg = Symbol(`radix.slottable`);
function pg(e) {
  return (
    x.isValidElement(e) &&
    typeof e.type == `function` &&
    `__radixId` in e.type &&
    e.type.__radixId === fg
  );
}
function mg(e, t) {
  let n = { ...t };
  for (let r in t) {
    let i = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? i && a
        ? (n[r] = (...e) => {
            let t = a(...e);
            return i(...e), t;
          })
        : i && (n[r] = i)
      : r === `style`
        ? (n[r] = { ...i, ...a })
        : r === `className` && (n[r] = [i, a].filter(Boolean).join(` `));
  }
  return { ...e, ...n };
}
function hg(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, `ref`)?.get,
    n = t && `isReactWarning` in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, `ref`)?.get),
      (n = t && `isReactWarning` in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
var gg = l(h(), 1),
  _g = [
    `a`,
    `button`,
    `div`,
    `form`,
    `h2`,
    `h3`,
    `img`,
    `input`,
    `label`,
    `li`,
    `nav`,
    `ol`,
    `p`,
    `select`,
    `span`,
    `svg`,
    `ul`,
  ].reduce((e, t) => {
    let n = ug(`Primitive.${t}`),
      r = x.forwardRef((e, r) => {
        let { asChild: i, ...a } = e,
          o = i ? n : t;
        return (
          typeof window < `u` && (window[Symbol.for(`radix-ui`)] = !0),
          (0, S.jsx)(o, { ...a, ref: r })
        );
      });
    return (r.displayName = `Primitive.${t}`), { ...e, [t]: r };
  }, {});
function vg(e, t) {
  e && gg.flushSync(() => e.dispatchEvent(t));
}
function yg(e) {
  let t = x.useRef(e);
  return (
    x.useEffect(() => {
      t.current = e;
    }),
    x.useMemo(
      () =>
        (...e) =>
          t.current?.(...e),
      [],
    )
  );
}
function bg(e, t = globalThis?.document) {
  let n = yg(e);
  x.useEffect(() => {
    let e = (e) => {
      e.key === `Escape` && n(e);
    };
    return (
      t.addEventListener(`keydown`, e, { capture: !0 }),
      () => t.removeEventListener(`keydown`, e, { capture: !0 })
    );
  }, [n, t]);
}
var xg = `DismissableLayer`,
  Sg = `dismissableLayer.update`,
  Cg = `dismissableLayer.pointerDownOutside`,
  wg = `dismissableLayer.focusOutside`,
  Tg,
  Eg = x.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  Dg = x.forwardRef((e, t) => {
    let {
        disableOutsidePointerEvents: n = !1,
        onEscapeKeyDown: r,
        onPointerDownOutside: i,
        onFocusOutside: a,
        onInteractOutside: o,
        onDismiss: s,
        ...c
      } = e,
      l = x.useContext(Eg),
      [u, d] = x.useState(null),
      f = u?.ownerDocument ?? globalThis?.document,
      [, p] = x.useState({}),
      m = xh(t, (e) => d(e)),
      h = Array.from(l.layers),
      [g] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1),
      _ = h.indexOf(g),
      v = u ? h.indexOf(u) : -1,
      y = l.layersWithOutsidePointerEventsDisabled.size > 0,
      b = v >= _,
      C = Ag((e) => {
        let t = e.target,
          n = [...l.branches].some((e) => e.contains(t));
        !b || n || (i?.(e), o?.(e), e.defaultPrevented || s?.());
      }, f),
      w = jg((e) => {
        let t = e.target;
        [...l.branches].some((e) => e.contains(t)) || (a?.(e), o?.(e), e.defaultPrevented || s?.());
      }, f);
    return (
      bg((e) => {
        v === l.layers.size - 1 && (r?.(e), !e.defaultPrevented && s && (e.preventDefault(), s()));
      }, f),
      x.useEffect(() => {
        if (u)
          return (
            n &&
              (l.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Tg = f.body.style.pointerEvents), (f.body.style.pointerEvents = `none`)),
              l.layersWithOutsidePointerEventsDisabled.add(u)),
            l.layers.add(u),
            Mg(),
            () => {
              n &&
                l.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (f.body.style.pointerEvents = Tg);
            }
          );
      }, [u, f, n, l]),
      x.useEffect(
        () => () => {
          u && (l.layers.delete(u), l.layersWithOutsidePointerEventsDisabled.delete(u), Mg());
        },
        [u, l],
      ),
      x.useEffect(() => {
        let e = () => p({});
        return document.addEventListener(Sg, e), () => document.removeEventListener(Sg, e);
      }, []),
      (0, S.jsx)(_g.div, {
        ...c,
        ref: m,
        style: { pointerEvents: y ? (b ? `auto` : `none`) : void 0, ...e.style },
        onFocusCapture: lg(e.onFocusCapture, w.onFocusCapture),
        onBlurCapture: lg(e.onBlurCapture, w.onBlurCapture),
        onPointerDownCapture: lg(e.onPointerDownCapture, C.onPointerDownCapture),
      })
    );
  });
Dg.displayName = xg;
var Og = `DismissableLayerBranch`,
  kg = x.forwardRef((e, t) => {
    let n = x.useContext(Eg),
      r = x.useRef(null),
      i = xh(t, r);
    return (
      x.useEffect(() => {
        let e = r.current;
        if (e)
          return (
            n.branches.add(e),
            () => {
              n.branches.delete(e);
            }
          );
      }, [n.branches]),
      (0, S.jsx)(_g.div, { ...e, ref: i })
    );
  });
kg.displayName = Og;
function Ag(e, t = globalThis?.document) {
  let n = yg(e),
    r = x.useRef(!1),
    i = x.useRef(() => {});
  return (
    x.useEffect(() => {
      let e = (e) => {
          if (e.target && !r.current) {
            let r = function () {
                Ng(Cg, n, a, { discrete: !0 });
              },
              a = { originalEvent: e };
            e.pointerType === `touch`
              ? (t.removeEventListener(`click`, i.current),
                (i.current = r),
                t.addEventListener(`click`, i.current, { once: !0 }))
              : r();
          } else t.removeEventListener(`click`, i.current);
          r.current = !1;
        },
        a = window.setTimeout(() => {
          t.addEventListener(`pointerdown`, e);
        }, 0);
      return () => {
        window.clearTimeout(a),
          t.removeEventListener(`pointerdown`, e),
          t.removeEventListener(`click`, i.current);
      };
    }, [t, n]),
    { onPointerDownCapture: () => (r.current = !0) }
  );
}
function jg(e, t = globalThis?.document) {
  let n = yg(e),
    r = x.useRef(!1);
  return (
    x.useEffect(() => {
      let e = (e) => {
        e.target && !r.current && Ng(wg, n, { originalEvent: e }, { discrete: !1 });
      };
      return t.addEventListener(`focusin`, e), () => t.removeEventListener(`focusin`, e);
    }, [t, n]),
    { onFocusCapture: () => (r.current = !0), onBlurCapture: () => (r.current = !1) }
  );
}
function Mg() {
  let e = new CustomEvent(Sg);
  document.dispatchEvent(e);
}
function Ng(e, t, n, { discrete: r }) {
  let i = n.originalEvent.target,
    a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && i.addEventListener(e, t, { once: !0 }), r ? vg(i, a) : i.dispatchEvent(a);
}
var Pg = `focusScope.autoFocusOnMount`,
  Fg = `focusScope.autoFocusOnUnmount`,
  Ig = { bubbles: !1, cancelable: !0 },
  Lg = `FocusScope`,
  Rg = x.forwardRef((e, t) => {
    let { loop: n = !1, trapped: r = !1, onMountAutoFocus: i, onUnmountAutoFocus: a, ...o } = e,
      [s, c] = x.useState(null),
      l = yg(i),
      u = yg(a),
      d = x.useRef(null),
      f = xh(t, (e) => c(e)),
      p = x.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    x.useEffect(() => {
      if (r) {
        let e = function (e) {
            if (p.paused || !s) return;
            let t = e.target;
            s.contains(t) ? (d.current = t) : Gg(d.current, { select: !0 });
          },
          t = function (e) {
            if (p.paused || !s) return;
            let t = e.relatedTarget;
            t !== null && (s.contains(t) || Gg(d.current, { select: !0 }));
          },
          n = function (e) {
            if (document.activeElement === document.body)
              for (let t of e) t.removedNodes.length > 0 && Gg(s);
          };
        document.addEventListener(`focusin`, e), document.addEventListener(`focusout`, t);
        let r = new MutationObserver(n);
        return (
          s && r.observe(s, { childList: !0, subtree: !0 }),
          () => {
            document.removeEventListener(`focusin`, e),
              document.removeEventListener(`focusout`, t),
              r.disconnect();
          }
        );
      }
    }, [r, s, p.paused]),
      x.useEffect(() => {
        if (s) {
          Kg.add(p);
          let e = document.activeElement;
          if (!s.contains(e)) {
            let t = new CustomEvent(Pg, Ig);
            s.addEventListener(Pg, l),
              s.dispatchEvent(t),
              t.defaultPrevented ||
                (zg(Yg(Vg(s)), { select: !0 }), document.activeElement === e && Gg(s));
          }
          return () => {
            s.removeEventListener(Pg, l),
              setTimeout(() => {
                let t = new CustomEvent(Fg, Ig);
                s.addEventListener(Fg, u),
                  s.dispatchEvent(t),
                  t.defaultPrevented || Gg(e ?? document.body, { select: !0 }),
                  s.removeEventListener(Fg, u),
                  Kg.remove(p);
              }, 0);
          };
        }
      }, [s, l, u, p]);
    let m = x.useCallback(
      (e) => {
        if ((!n && !r) || p.paused) return;
        let t = e.key === `Tab` && !e.altKey && !e.ctrlKey && !e.metaKey,
          i = document.activeElement;
        if (t && i) {
          let t = e.currentTarget,
            [r, a] = Bg(t);
          r && a
            ? !e.shiftKey && i === a
              ? (e.preventDefault(), n && Gg(r, { select: !0 }))
              : e.shiftKey && i === r && (e.preventDefault(), n && Gg(a, { select: !0 }))
            : i === t && e.preventDefault();
        }
      },
      [n, r, p.paused],
    );
    return (0, S.jsx)(_g.div, { tabIndex: -1, ...o, ref: f, onKeyDown: m });
  });
Rg.displayName = Lg;
function zg(e, { select: t = !1 } = {}) {
  let n = document.activeElement;
  for (let r of e) if ((Gg(r, { select: t }), document.activeElement !== n)) return;
}
function Bg(e) {
  let t = Vg(e);
  return [Hg(t, e), Hg(t.reverse(), e)];
}
function Vg(e) {
  let t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (e) => {
        let t = e.tagName === `INPUT` && e.type === `hidden`;
        return e.disabled || e.hidden || t
          ? NodeFilter.FILTER_SKIP
          : e.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Hg(e, t) {
  for (let n of e) if (!Ug(n, { upTo: t })) return n;
}
function Ug(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === `hidden`) return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === `none`) return !0;
    e = e.parentElement;
  }
  return !1;
}
function Wg(e) {
  return e instanceof HTMLInputElement && `select` in e;
}
function Gg(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    let n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Wg(e) && t && e.select();
  }
}
var Kg = qg();
function qg() {
  let e = [];
  return {
    add(t) {
      let n = e[0];
      t !== n && n?.pause(), (e = Jg(e, t)), e.unshift(t);
    },
    remove(t) {
      (e = Jg(e, t)), e[0]?.resume();
    },
  };
}
function Jg(e, t) {
  let n = [...e],
    r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function Yg(e) {
  return e.filter((e) => e.tagName !== `A`);
}
var Xg = x.useInsertionEffect || Nh;
function Zg({ prop: e, defaultProp: t, onChange: n = () => {}, caller: r }) {
  let [i, a, o, s] = Qg({ defaultProp: t, onChange: n }),
    c = e !== void 0;
  return [
    c ? e : i,
    x.useCallback(
      (t, n) => {
        if (c) {
          let r = $g(t) ? t(e) : t;
          r !== e && o.current?.(r, n);
        } else (s.current = n), a(t);
      },
      [c, e, a, o, s],
    ),
  ];
}
function Qg({ defaultProp: e, onChange: t }) {
  let [n, r] = x.useState(e),
    i = x.useRef(n),
    a = x.useRef(void 0),
    o = x.useRef(t);
  return (
    Xg(() => {
      o.current = t;
    }, [t]),
    x.useEffect(() => {
      i.current !== n && (o.current?.(n, a.current), (i.current = n), (a.current = void 0));
    }, [n]),
    [n, r, o, a]
  );
}
function $g(e) {
  return typeof e == `function`;
}
function e_(e) {
  let [t, n] = x.useState(),
    r = x.useRef({}),
    i = x.useRef(e),
    a = x.useRef(`none`),
    [o, s] = n_(e ? `mounted` : `unmounted`, {
      mounted: { UNMOUNT: `unmounted`, ANIMATION_OUT: `unmountSuspended` },
      unmountSuspended: { MOUNT: `mounted`, ANIMATION_END: `unmounted` },
      unmounted: { MOUNT: `mounted` },
    });
  return (
    x.useEffect(() => {
      let e = t_(r.current);
      a.current = o === `mounted` ? e : `none`;
    }, [o]),
    Nh(() => {
      let t = r.current,
        n = i.current;
      if (n !== e) {
        let r = a.current,
          o = t_(t);
        e
          ? s(`MOUNT`)
          : o === `none` || t?.display === `none`
            ? s(`UNMOUNT`)
            : s(n && r !== o ? `ANIMATION_OUT` : `UNMOUNT`),
          (i.current = e);
      }
    }, [e, s]),
    Nh(() => {
      if (t) {
        let e,
          n = t.ownerDocument.defaultView ?? window,
          o = (a) => {
            let o = t_(r.current).includes(a.animationName);
            if (a.target === t && o && (s(`ANIMATION_END`), !i.current)) {
              let r = t.style.animationFillMode;
              (t.style.animationFillMode = `forwards`),
                (e = n.setTimeout(() => {
                  t.style.animationFillMode === `forwards` && (t.style.animationFillMode = r);
                }));
            }
          },
          c = (e) => {
            e.target === t && (a.current = t_(r.current));
          };
        return (
          t.addEventListener(`animationstart`, c),
          t.addEventListener(`animationcancel`, o),
          t.addEventListener(`animationend`, o),
          () => {
            n.clearTimeout(e),
              t.removeEventListener(`animationstart`, c),
              t.removeEventListener(`animationcancel`, o),
              t.removeEventListener(`animationend`, o);
          }
        );
      } else s(`ANIMATION_END`);
    }, [t, s]),
    {
      isPresent: [`mounted`, `unmountSuspended`].includes(o),
      ref: x.useCallback((e) => {
        e && (r.current = getComputedStyle(e)), n(e);
      }, []),
    }
  );
}
function t_(e) {
  return e?.animationName || `none`;
}
function n_(e, t) {
  return x.useReducer((e, n) => t[e][n] ?? e, e);
}
var r_ = (e) => {
  let { isPresent: t, ref: n } = e_(e.present),
    r = (0, x.useRef)(!1);
  return (
    t && (r.current = !0),
    (!t && !r.current && e.lazyMount) || (e.unmountOnExit && !t && r.current)
      ? null
      : (0, S.jsx)(X.div, { ref: n, asChild: !0, children: e.children })
  );
};
r_.displayName = `Presence`;
function i_(e) {
  let [t = !1, n] = Zg({
    prop: e.open,
    defaultProp: e.defaultOpen ?? !1,
    onChange: e.onOpenChange,
  });
  return (0, x.useMemo)(() => ({ open: t, onOpenChange: n }), [t, n]);
}
function a_(e = {}) {
  let { open: t, onOpenChange: n } = i_(e),
    r = (0, x.useId)(),
    i = `${r}-title`,
    a = `${r}-description`,
    o = (0, x.useMemo)(() => J({ "data-open": q(t), "data-hidden": q(!t) }), [t]);
  return (0, x.useMemo)(
    () => ({
      open: t,
      setOpen: n,
      closeOnInteractOutside: e.closeOnInteractOutside ?? !0,
      closeOnEscape: e.closeOnEscape ?? !0,
      lazyMount: e.lazyMount ?? !1,
      unmountOnExit: e.unmountOnExit ?? !1,
      stateProps: o,
      triggerProps: Uh({
        "aria-haspopup": `dialog`,
        "aria-expanded": t,
        ...o,
        onClick: (e) => {
          e.defaultPrevented || n(!0, { reason: `trigger`, event: e.nativeEvent });
        },
      }),
      positionerProps: J({ ...o, style: { pointerEvents: t ? void 0 : `none` } }),
      backdropProps: J({ ...o }),
      contentProps: J({
        ...o,
        role: e.role ?? `dialog`,
        "aria-modal": !0,
        "aria-labelledby": i,
        "aria-describedby": a,
      }),
      titleProps: J({ id: i, ...o }),
      descriptionProps: J({ id: a, ...o }),
      closeButtonProps: Uh({
        ...o,
        onClick: (e) => {
          e.defaultPrevented || n(!1, { reason: `closeButton`, event: e.nativeEvent });
        },
      }),
    }),
    [
      t,
      n,
      o,
      i,
      a,
      e.role,
      e.closeOnInteractOutside,
      e.closeOnEscape,
      e.lazyMount,
      e.unmountOnExit,
    ],
  );
}
var o_ = (0, x.createContext)(null),
  s_ = o_.Provider;
function c_({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(o_);
  if (!t && e) throw Error(`useDialogContext must be used within a Dialog`);
  return t;
}
var l_ = (e) => {
    let { children: t, ...n } = e;
    return (0, S.jsx)(s_, { value: a_(n), children: t });
  },
  u_ = (0, x.forwardRef)((e, t) => {
    let n = c_();
    return (0, S.jsx)(X.button, { ref: t, ...Y(n.triggerProps, e) });
  });
u_.displayName = `DialogTrigger`;
var d_ = (0, x.forwardRef)((e, t) => {
    let n = c_();
    return (0, S.jsx)(X.div, { ref: t, ...Y(n.positionerProps, e) });
  }),
  f_ = (0, x.forwardRef)((e, t) => {
    let n = c_();
    return (0, S.jsx)(r_, {
      present: n.open,
      unmountOnExit: n.unmountOnExit,
      lazyMount: n.lazyMount,
      children: (0, S.jsx)(X.div, { ref: t, ...Y(n.backdropProps, e) }),
    });
  });
f_.displayName = `DialogBackdrop`;
var p_ = (0, x.forwardRef)((e, t) => {
  let n = c_();
  return (0, S.jsx)(r_, {
    present: n.open,
    unmountOnExit: n.unmountOnExit,
    lazyMount: n.lazyMount,
    children: (0, S.jsx)(Rg, {
      asChild: !0,
      loop: !0,
      trapped: n.open,
      children: (0, S.jsx)(Dg, {
        ref: t,
        onEscapeKeyDown: (e) => {
          if (!n.closeOnEscape) {
            e.preventDefault();
            return;
          }
          n.setOpen(!1, { reason: `escapeKeyDown`, event: e });
        },
        onInteractOutside: (e) => {
          if (!n.closeOnInteractOutside) {
            e.preventDefault();
            return;
          }
          n.setOpen(!1, { reason: `interactOutside`, event: e.detail.originalEvent });
        },
        ...Y(n.contentProps, e),
      }),
    }),
  });
});
p_.displayName = `DialogContent`;
var m_ = (0, x.forwardRef)((e, t) => {
    let n = c_();
    return (0, S.jsx)(X.h2, { ref: t, ...Y(n.titleProps, e) });
  }),
  h_ = (0, x.forwardRef)((e, t) => {
    let n = c_();
    return (0, S.jsx)(X.p, { ref: t, ...Y(n.descriptionProps, e) });
  }),
  g_ = {
    __proto__: null,
    Backdrop: f_,
    CloseButton: (0, x.forwardRef)((e, t) => {
      let n = c_();
      return (0, S.jsx)(X.button, { ref: t, ...Y(n.closeButtonProps, e) });
    }),
    Content: p_,
    Description: h_,
    Positioner: d_,
    Root: l_,
    Title: m_,
    Trigger: u_,
  },
  __ = Object.defineProperty,
  v_ = (e, t) => {
    let n = {};
    for (var r in e) __(n, r, { get: e[r], enumerable: !0 });
    return t || __(n, Symbol.toStringTag, { value: `Module` }), n;
  },
  y_ = x.forwardRef((e, t) => {
    let { style: n, restProps: r } = vh(e),
      { as: i = `div`, asChild: a = !1, className: o, ...s } = r;
    return a
      ? (0, S.jsx)(Dh, { ref: t, className: zh(`seed-box`, o), style: n, ...s })
      : (0, S.jsx)(i, { ref: t, className: zh(`seed-box`, o), style: n, ...s });
  });
function b_(e) {
  let t = yg(e.onLoadingStatusChange),
    [n, r] = (0, x.useState)(`loading`),
    i = (0, x.useRef)(null);
  Nh(() => {
    i.current &&
      i.current.complete &&
      (i.current.naturalWidth === 0 || i.current.naturalHeight === 0
        ? (r(`error`), t?.(`error`))
        : (r(`loaded`), t?.(`loaded`)));
  }, [t]);
  let a = n === `loaded`,
    o = (0, x.useMemo)(() => J({ "data-loading-state": n }), [n]),
    s = (0, x.useCallback)(
      (e) => {
        e == null ? (r(`error`), t?.(`error`)) : (r(`loading`), t?.(`loading`));
      },
      [t],
    ),
    c = (0, x.useCallback)(
      ({ src: e }) => Wh({ hidden: !a, "data-visible": q(a), src: e, ...o }),
      [a, o],
    ),
    l = (0, x.useCallback)(() => {
      r(`loaded`), t?.(`loaded`);
    }, [t]),
    u = (0, x.useCallback)(() => {
      r(`error`), t?.(`error`);
    }, [t]),
    d = (0, x.useMemo)(() => J({ hidden: a, "data-visible": q(!a), ...o }), [a, o]);
  return {
    refs: { image: i },
    loadingStatus: n,
    stateProps: o,
    rootProps: o,
    setSrc: s,
    getContentProps: c,
    handleLoad: l,
    handleError: u,
    fallbackProps: d,
  };
}
var x_ = (0, x.createContext)(null),
  S_ = x_.Provider;
function C_({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(x_);
  if (!t && e) throw Error(`useImageContext must be used within an Image`);
  return t;
}
var w_ = (0, x.forwardRef)((e, t) => {
  let { onLoadingStatusChange: n, ...r } = e,
    i = b_({ onLoadingStatusChange: n });
  return (0, S.jsx)(S_, {
    value: i,
    children: (0, S.jsx)(X.div, { ref: t, ...Y(i.rootProps, r) }),
  });
});
w_.displayName = `ImageRoot`;
var T_ = (0, x.forwardRef)((e, t) => {
  let { src: n, onLoad: r, onError: i, ...a } = e,
    { refs: o, setSrc: s, getContentProps: c, handleLoad: l, handleError: u } = C_();
  Nh(() => {
    s(n);
  }, [n, s]);
  let d = c({ src: n });
  return (0, S.jsx)(X.img, {
    ref: bh(o.image, t),
    ...Y(d, a, { hidden: a.loading === `lazy` ? !1 : d.hidden }),
    onLoad: (e) => {
      l(), r?.(e);
    },
    onError: (e) => {
      u(), i?.(e);
    },
  });
});
T_.displayName = `ImageContent`;
var E_ = (0, x.forwardRef)((e, t) => {
  let { fallbackProps: n } = C_();
  return (0, S.jsx)(X.div, { ref: t, ...Y(n, e) });
});
E_.displayName = `ImageFallback`;
var D_ = { __proto__: null, Content: T_, Fallback: E_, Root: w_ },
  O_ = [
    [`root`, `seed-avatar__root`],
    [`image`, `seed-avatar__image`],
    [`fallback`, `seed-avatar__fallback`],
    [`badge`, `seed-avatar__badge`],
  ],
  k_ = { size: 48, badgeMask: `none` },
  A_ = [],
  j_ = {
    size: [`20`, `24`, `36`, `42`, `48`, `56`, `64`, `80`, `96`, `108`],
    badgeMask: [`none`, `circle`, `flower`, `shield`],
  };
function M_(e) {
  return Object.fromEntries(O_.map(([t, n]) => [t, Zh(n, Qh(k_, e), A_)]));
}
Object.assign(M_, { splitVariantProps: (e) => $h(e, j_) });
var N_ = [
    [`root`, `seed-avatar-stack__root`],
    [`item`, `seed-avatar-stack__item`],
  ],
  P_ = { size: 48 },
  F_ = [],
  I_ = { size: [`20`, `24`, `36`, `42`, `48`, `56`, `64`, `80`, `96`, `108`] };
function L_(e) {
  return Object.fromEntries(N_.map(([t, n]) => [t, Zh(n, Qh(P_, e), F_)]));
}
Object.assign(L_, { splitVariantProps: (e) => $h(e, I_) });
var { PropsProvider: R_, withProvider: z_, withContext: B_ } = sg(M_),
  V_ = z_(D_.Root, `root`),
  H_ = B_(D_.Content, `image`),
  U_ = B_(D_.Fallback, `fallback`),
  W_ = B_(X.div, `badge`),
  G_ = x.forwardRef(({ className: e, children: t, size: n, ...r }, i) => {
    let a = L_({ size: n }),
      o = x.Children.toArray(t);
    return (0, S.jsx)(R_, {
      value: (0, x.useMemo)(() => ({ size: n }), [n]),
      children: (0, S.jsx)(`div`, {
        ref: i,
        className: zh(a.root, e),
        ...r,
        children: o.map((e, t) => (0, S.jsx)(`div`, { className: a.item, children: e }, t)),
      }),
    });
  }),
  K_ = v_({
    Badge: () => W_,
    Fallback: () => U_,
    Image: () => H_,
    Root: () => V_,
    Stack: () => G_,
  }),
  q_ = [
    [`root`, `seed-badge__root`],
    [`label`, `seed-badge__label`],
  ],
  J_ = { size: `medium`, variant: `solid`, tone: `neutral` },
  Y_ = [
    { tone: `neutral`, variant: `weak` },
    { tone: `neutral`, variant: `solid` },
    { tone: `neutral`, variant: `outline` },
    { tone: `brand`, variant: `weak` },
    { tone: `brand`, variant: `solid` },
    { tone: `brand`, variant: `outline` },
    { tone: `informative`, variant: `weak` },
    { tone: `informative`, variant: `solid` },
    { tone: `informative`, variant: `outline` },
    { tone: `positive`, variant: `weak` },
    { tone: `positive`, variant: `solid` },
    { tone: `positive`, variant: `outline` },
    { tone: `warning`, variant: `weak` },
    { tone: `warning`, variant: `solid` },
    { tone: `warning`, variant: `outline` },
    { tone: `critical`, variant: `weak` },
    { tone: `critical`, variant: `solid` },
    { tone: `critical`, variant: `outline` },
  ],
  X_ = {
    size: [`medium`, `large`],
    variant: [`weak`, `solid`, `outline`],
    tone: [`neutral`, `brand`, `informative`, `positive`, `warning`, `critical`],
  };
function Z_(e) {
  return Object.fromEntries(q_.map(([t, n]) => [t, Zh(n, Qh(J_, e), Y_)]));
}
Object.assign(Z_, { splitVariantProps: (e) => $h(e, X_) });
var Q_ = (0, x.forwardRef)(({ className: e, children: t, ...n }, r) => {
  let [i, a] = Z_.splitVariantProps(n),
    { root: o, label: s } = Z_(i);
  return (0, S.jsx)(X.span, {
    className: zh(o, e),
    ...a,
    ref: r,
    children: (0, S.jsx)(X.span, { className: s, children: t }),
  });
});
Q_.displayName = `Badge`;
var $_ = x.useInsertionEffect || Nh;
function ev({ prop: e, defaultProp: t, onChange: n = () => {}, caller: r }) {
  let [i, a, o] = tv({ defaultProp: t, onChange: n }),
    s = e !== void 0,
    c = s ? e : i;
  {
    let t = x.useRef(e !== void 0);
    x.useEffect(() => {
      let e = t.current;
      e !== s &&
        console.warn(
          `${r} is changing from ${e ? `controlled` : `uncontrolled`} to ${s ? `controlled` : `uncontrolled`}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (t.current = s);
    }, [s, r]);
  }
  return [
    c,
    x.useCallback(
      (t) => {
        if (s) {
          let n = nv(t) ? t(e) : t;
          n !== e && o.current?.(n);
        } else a(t);
      },
      [s, e, a, o],
    ),
  ];
}
function tv({ defaultProp: e, onChange: t }) {
  let [n, r] = x.useState(e),
    i = x.useRef(n),
    a = x.useRef(t);
  return (
    $_(() => {
      a.current = t;
    }, [t]),
    x.useEffect(() => {
      i.current !== n && (a.current?.(n), (i.current = n));
    }, [n, i]),
    [n, r, a]
  );
}
function nv(e) {
  return typeof e == `function`;
}
function rv(e) {
  let [t = !0, n] = ev({
      prop: e.open,
      defaultProp: e.defaultOpen,
      onChange: (t) => {
        t || e.onDismiss?.();
      },
    }),
    r = x.useCallback(() => n(!1), [n]);
  return {
    open: t,
    dismiss: r,
    rootProps: J({}),
    dismissButtonProps: Uh({
      onClick: (e) => {
        e.defaultPrevented || r();
      },
    }),
  };
}
var iv = x.createContext(null),
  av = iv.Provider,
  ov = () => {
    let e = x.useContext(iv);
    if (e === null) throw Error(`useDismissibleContext should be used within DismissibleProvider`);
    return e;
  },
  sv = x.forwardRef(({ defaultOpen: e, open: t, onDismiss: n, ...r }, i) => {
    let a = rv({ defaultOpen: e, open: t, onDismiss: n });
    return a.open
      ? (0, S.jsx)(av, { value: a, children: (0, S.jsx)(X.div, { ref: i, ...r }) })
      : null;
  }),
  cv = x.forwardRef((e, t) => {
    let { dismissButtonProps: n } = ov();
    return (0, S.jsx)(X.button, { ref: t, ...Y(n, e) });
  }),
  lv = [
    [`root`, `seed-callout__root`],
    [`content`, `seed-callout__content`],
    [`title`, `seed-callout__title`],
    [`description`, `seed-callout__description`],
    [`link`, `seed-callout__link`],
    [`closeButton`, `seed-callout__closeButton`],
  ],
  uv = { tone: `neutral` },
  dv = [],
  fv = { tone: [`neutral`, `informative`, `positive`, `warning`, `critical`, `magic`] };
function pv(e) {
  return Object.fromEntries(lv.map(([t, n]) => [t, Zh(n, Qh(uv, e), dv)]));
}
Object.assign(pv, { splitVariantProps: (e) => $h(e, fv) });
var { withContext: mv, withProvider: hv } = sg(pv),
  gv = hv(sv, `root`),
  _v = mv(X.div, `content`),
  vv = mv(X.span, `title`),
  yv = mv(X.span, `description`),
  bv = mv(X.button, `link`),
  xv = mv(cv, `closeButton`),
  Sv = v_({
    CloseButton: () => xv,
    Content: () => _v,
    Description: () => yv,
    Link: () => bv,
    Root: () => gv,
    Title: () => vv,
  });
function Cv(e, t) {
  let n = {},
    r = new Set();
  for (let i in t) {
    let [a] = t[i].splitVariantProps(e);
    n[i] = a;
    for (let e in a) r.add(e);
  }
  let i = {};
  for (let t in e) r.has(t) || (i[t] = e[t]);
  return [n, i];
}
var wv = (0, x.forwardRef)(({ svg: e, ...t }, n) =>
  (0, S.jsx)(Dh, { ref: n, "aria-hidden": !0, ...t, children: e }),
);
function Tv(e) {
  let [t, n] = (0, x.useState)(null);
  return (
    (0, x.useEffect)(() => {
      n(CSS.supports(e));
    }, [e]),
    t
  );
}
function Ev(e) {
  let [t = !1, n] = ev({
      prop: e.checked,
      defaultProp: e.defaultChecked,
      onChange: e.onCheckedChange,
    }),
    [r, i] = (0, x.useState)(!1),
    [a, o] = (0, x.useState)(!1),
    [s, c] = (0, x.useState)(!1),
    [l, u] = (0, x.useState)(!1),
    d = (0, x.useRef)(null),
    f = (0, x.useRef)(t);
  return (
    (0, x.useEffect)(() => {
      let e = d.current?.form;
      if (e) {
        let t = () => n(f.current);
        return e.addEventListener(`reset`, t), () => e.removeEventListener(`reset`, t);
      }
    }, [n]),
    (0, x.useEffect)(() => {
      d.current && (d.current.indeterminate = e.indeterminate ?? !1);
    }, [e.indeterminate]),
    {
      refs: { input: d },
      isIndeterminate: e.indeterminate ?? !1,
      isChecked: t,
      setIsChecked: n,
      isHovered: r,
      setIsHovered: i,
      isActive: a,
      setIsActive: o,
      isFocused: s,
      setIsFocused: c,
      isFocusVisible: l,
      setIsFocusVisible: u,
    }
  );
}
function Dv(e) {
  let {
      refs: t,
      isIndeterminate: n,
      setIsChecked: r,
      isChecked: i,
      setIsHovered: a,
      isHovered: o,
      setIsActive: s,
      isActive: c,
      setIsFocused: l,
      isFocused: u,
      setIsFocusVisible: d,
      isFocusVisible: f,
    } = Ev(e),
    p = Tv(`selector(:focus-visible)`),
    m = J({
      "data-checked": q(i),
      "data-indeterminate": q(n),
      "data-hover": q(o),
      "data-active": q(c),
      "data-focus": q(u),
      "data-focus-visible": q(f),
      "data-disabled": q(e.disabled),
      "data-invalid": q(e.invalid),
      "data-required": q(e.required),
    }),
    h = e.checked != null;
  return {
    indeterminate: n,
    checked: i,
    setChecked: r,
    focused: u,
    setFocused: l,
    focusVisible: f,
    setFocusVisible: d,
    refs: t,
    stateProps: m,
    rootProps: Hh({
      ...m,
      onPointerMove() {
        a(!0);
      },
      onPointerDown() {
        s(!0);
      },
      onPointerUp() {
        s(!1);
      },
      onPointerLeave() {
        a(!1), s(!1);
      },
    }),
    controlProps: J({ ...m, "aria-hidden": !0 }),
    hiddenInputProps: Vh({
      type: `checkbox`,
      role: `checkbox`,
      checked: h ? i : void 0,
      defaultChecked: h ? void 0 : i,
      disabled: e.disabled,
      required: e.required,
      "aria-invalid": e.invalid,
      style: Gh,
      ...m,
      onChange(e) {
        r(e.currentTarget.checked), p && d(e.target.matches(`:focus-visible`));
      },
      onFocus(e) {
        l(!0), p && d(e.target.matches(`:focus-visible`));
      },
      onBlur() {
        l(!1), p && d(!1);
      },
      onKeyDown(e) {
        e.key === ` ` && s(!0);
      },
      onKeyUp(e) {
        e.key === ` ` && s(!1);
      },
    }),
  };
}
var Ov = (0, x.createContext)(null),
  kv = Ov.Provider;
function Av({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(Ov);
  if (!t && e) throw Error(`useCheckboxContext must be used within a Checkbox`);
  return t;
}
var jv = (0, x.forwardRef)((e, t) => {
  let {
      checked: n,
      defaultChecked: r,
      onCheckedChange: i,
      indeterminate: a,
      disabled: o,
      invalid: s,
      required: c,
      ...l
    } = e,
    u = Dv({
      checked: n,
      defaultChecked: r,
      onCheckedChange: i,
      indeterminate: a,
      disabled: o,
      invalid: s,
      required: c,
    }),
    d = Y(u.rootProps, l);
  return (0, S.jsx)(kv, { value: u, children: (0, S.jsx)(X.label, { ref: t, ...d }) });
});
jv.displayName = `CheckboxRoot`;
var Mv = (0, x.forwardRef)((e, t) => {
  let { controlProps: n } = Av(),
    r = Y(n, e);
  return (0, S.jsx)(X.div, { ref: t, ...r });
});
Mv.displayName = `CheckboxControl`;
var Nv = (0, x.forwardRef)((e, t) => {
  let { refs: n, hiddenInputProps: r } = Av(),
    i = Y(r, e);
  return (0, S.jsx)(X.input, { ref: bh(n.input, t), ...i });
});
Nv.displayName = `CheckboxHiddenInput`;
var Pv = { __proto__: null, Control: Mv, HiddenInput: Nv, Root: jv },
  Fv = [
    [`root`, `seed-checkbox__root`],
    [`label`, `seed-checkbox__label`],
  ],
  Iv = { size: `medium`, weight: `regular` },
  Lv = [],
  Rv = { weight: [`regular`, `bold`], size: [`large`, `medium`] };
function zv(e) {
  return Object.fromEntries(Fv.map(([t, n]) => [t, Zh(n, Qh(Iv, e), Lv)]));
}
Object.assign(zv, { splitVariantProps: (e) => $h(e, Rv) });
var Bv = [
    [`root`, `seed-checkmark__root`],
    [`icon`, `seed-checkmark__icon`],
  ],
  Vv = { variant: `square`, tone: `brand`, size: `medium` },
  Hv = [
    { variant: `square`, tone: `neutral` },
    { variant: `square`, tone: `brand` },
    { variant: `ghost`, tone: `neutral` },
    { variant: `ghost`, tone: `brand` },
    { size: `medium`, variant: `ghost` },
    { size: `large`, variant: `ghost` },
    { size: `medium`, variant: `square` },
    { size: `large`, variant: `square` },
  ],
  Uv = { variant: [`square`, `ghost`], tone: [`neutral`, `brand`], size: [`large`, `medium`] };
function Wv(e) {
  return Object.fromEntries(Bv.map(([t, n]) => [t, Zh(n, Qh(Vv, e), Hv)]));
}
Object.assign(Wv, { splitVariantProps: (e) => $h(e, Uv) });
var Gv = {},
  Kv = [],
  qv = {};
function Jv(e) {
  return Zh(`seed-checkbox-group`, Qh(Gv, e), Kv);
}
Object.assign(Jv, { splitVariantProps: (e) => $h(e, qv) });
var { withContext: Yv } = og(Jv),
  { ClassNamesProvider: Xv, withContext: Zv } = sg(zv),
  { withProvider: Qv, useClassNames: $v, PropsProvider: ey } = sg(Wv),
  ty = cg([Av]),
  ny = Yv(X.div),
  ry = Object.assign(
    (0, x.forwardRef)(({ className: e, ...t }, n) => {
      let [{ checkbox: r, checkmark: i }, a] = Cv(
          {
            ...t,
            weight:
              t.weight === `stronger` ? `bold` : t.weight === `default` ? `regular` : t.weight,
          },
          { checkbox: zv, checkmark: Wv },
        ),
        o = zv(r);
      return (0, S.jsx)(ey, {
        value: i,
        children: (0, S.jsx)(Xv, {
          value: o,
          children: (0, S.jsx)(Pv.Root, { ref: n, className: zh(o.root, e), ...a }),
        }),
      });
    }),
    { Primitive: Pv.Root },
  ),
  iy = Qv(Pv.Control, `root`),
  ay = (0, x.forwardRef)(({ unchecked: e, checked: t, indeterminate: n, ...r }, i) => {
    let { stateProps: a, checked: o, indeterminate: s } = Av(),
      c = Y(a, { className: $v().icon }, r);
    return (
      s &&
        !n &&
        console.warn(
          "CheckboxIndicator: the `indeterminate` prop must be provided when the checkbox is in an indeterminate state.",
        ),
      s
        ? (0, S.jsx)(wv, { ref: i, svg: n, ...c })
        : o
          ? (0, S.jsx)(wv, { ref: i, svg: t, ...c })
          : e
            ? (0, S.jsx)(wv, { ref: i, svg: e, ...c })
            : null
    );
  });
ay.displayName = `CheckboxIndicator`;
var oy = Zv(ty(X.span), `label`),
  sy = Pv.HiddenInput,
  cy = v_({
    Control: () => iy,
    Group: () => ny,
    HiddenInput: () => sy,
    Indicator: () => ay,
    Label: () => oy,
    Root: () => ry,
  }),
  ly = (e) => `fieldset:${e}:label`,
  uy = (e) => `fieldset:${e}:description`,
  dy = (e) => `fieldset:${e}:error-message`;
function fy() {
  let e = (0, x.useId)(),
    [t, n] = (0, x.useState)(!1),
    r = (0, x.useCallback)((e) => {
      n(!!e);
    }, []),
    [i, a] = (0, x.useState)(!1),
    o = (0, x.useCallback)((e) => {
      a(!!e);
    }, []),
    [s, c] = (0, x.useState)(!1),
    l = (0, x.useCallback)((e) => {
      c(!!e);
    }, []),
    u = [i ? uy(e) : !1, s ? dy(e) : !1].filter(Boolean).join(` `) || void 0;
  return {
    id: e,
    refs: { label: r, description: o, errorMessage: l },
    renderedElements: { label: t, description: i, errorMessage: s },
    rootProps: J({ role: `group`, ...(t && { "aria-labelledby": ly(e) }), "aria-describedby": u }),
    labelProps: J({ id: ly(e) }),
    descriptionProps: J({ id: uy(e) }),
    errorMessageProps: J({ id: dy(e), "aria-live": `polite` }),
  };
}
var py = (0, x.createContext)(null),
  my = py.Provider;
function hy({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(py);
  if (!t && e) throw Error(`useFieldsetContext must be used within a Fieldset`);
  return t;
}
var gy = (0, x.forwardRef)((e, t) => {
  let n = fy(),
    r = Y(n.rootProps, e);
  return (0, S.jsx)(my, { value: n, children: (0, S.jsx)(X.div, { ref: t, ...r }) });
});
gy.displayName = `FieldsetRoot`;
var _y = (0, x.forwardRef)((e, t) => {
  let { refs: n, labelProps: r } = hy(),
    i = Y(r, e);
  return (0, S.jsx)(X.div, { ref: bh(n.label, t), ...i });
});
_y.displayName = `FieldsetLabel`;
var vy = (0, x.forwardRef)((e, t) => {
  let { refs: n, descriptionProps: r } = hy(),
    i = Y(r, e);
  return (0, S.jsx)(X.span, { ref: bh(n.description, t), ...i });
});
vy.displayName = `FieldsetDescription`;
var yy = (0, x.forwardRef)((e, t) => {
  let { refs: n, errorMessageProps: r } = hy(),
    i = Y(r, e);
  return (0, S.jsx)(X.div, { ref: bh(n.errorMessage, t), ...i });
});
yy.displayName = `FieldsetErrorMessage`;
var by = { __proto__: null, Description: vy, ErrorMessage: yy, Label: _y, Root: gy };
function xy(e) {
  let [t, n] = ev({ prop: e.value, defaultProp: e.defaultValue, onChange: e.onValueChange }),
    [r, i] = (0, x.useState)(null),
    [a, o] = (0, x.useState)(null),
    [s, c] = (0, x.useState)(null),
    [l, u] = (0, x.useState)(!1);
  return {
    value: t,
    setValue: n,
    hoveredValue: r,
    setHoveredValue: i,
    activeValue: a,
    setActiveValue: o,
    focusedValue: s,
    setFocusedValue: c,
    isFocusVisible: l,
    setIsFocusVisible: u,
  };
}
function Sy(e) {
  let { disabled: t = !1, invalid: n = !1, form: r, name: i } = e,
    a = fy(),
    o = J({ "data-disabled": q(t), "data-invalid": q(n) }),
    {
      value: s,
      setValue: c,
      hoveredValue: l,
      setHoveredValue: u,
      activeValue: d,
      setActiveValue: f,
      focusedValue: p,
      setFocusedValue: m,
      isFocusVisible: h,
      setIsFocusVisible: g,
    } = xy(e),
    _ = e.value !== void 0,
    v = Tv(`selector(:focus-visible)`);
  return {
    value: s,
    setValue: c,
    refs: a.refs,
    invalid: n,
    stateProps: o,
    rootProps: J({
      ...a.rootProps,
      ...o,
      role: `radiogroup`,
      "aria-invalid": Bh(n),
      "aria-disabled": Bh(t),
    }),
    labelProps: J({ ...a.labelProps, ...o }),
    descriptionProps: J({ ...a.descriptionProps, ...o }),
    errorMessageProps: J({ ...a.errorMessageProps, ...o }),
    getItemProps(e) {
      let { value: n, disabled: o } = e,
        y = {
          disabled: !!o || t,
          checked: s === n,
          focused: p === n,
          hovered: l === n,
          active: d === n,
        },
        b = J({
          "data-focus": q(y.focused),
          "data-focus-visible": q(y.focused && h),
          "data-disabled": q(y.disabled),
          "data-checked": q(y.checked),
          "data-active": q(y.active),
          "data-hover": q(y.hovered),
        });
      return {
        ...y,
        setFocusedValue: m,
        setIsFocusVisible: g,
        stateProps: b,
        rootProps: J({
          ...b,
          onPointerMove() {
            y.disabled || u(e.value);
          },
          onPointerLeave() {
            y.disabled || (u(null), f(null));
          },
          onPointerDown(t) {
            y.disabled ||
              (y.focused && t.pointerType === `mouse` && t.preventDefault(), f(e.value));
          },
          onPointerUp() {
            y.disabled || f(null);
          },
        }),
        controlProps: J({ "aria-hidden": !0, ...b }),
        hiddenInputProps: Vh({
          type: `radio`,
          name: i || a.id,
          form: r,
          value: e.value,
          onChange(t) {
            y.disabled ||
              (t.target.checked && c(e.value), v && g(t.target.matches(`:focus-visible`)));
          },
          onBlur() {
            m(null), v && g(!1);
          },
          onFocus(t) {
            m(e.value), v && g(t.target.matches(`:focus-visible`));
          },
          onKeyDown(t) {
            t.key === ` ` && f(e.value);
          },
          onKeyUp(e) {
            e.key === ` ` && f(null);
          },
          disabled: y.disabled,
          defaultChecked: _ ? void 0 : y.checked,
          checked: _ ? y.checked : void 0,
          style: Gh,
        }),
      };
    },
  };
}
var Cy = (0, x.createContext)(null),
  wy = Cy.Provider;
function Ty({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(Cy);
  if (!t && e) throw Error(`useRadioGroupContext must be used within a RadioGroup`);
  return t;
}
var Ey = (0, x.createContext)(null),
  Dy = Ey.Provider;
function Oy({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(Ey);
  if (!t && e) throw Error(`useRadioGroupItemContext must be used within a RadioGroupItem`);
  return t;
}
var ky = (0, x.forwardRef)((e, t) => {
  let {
      value: n,
      defaultValue: r,
      onValueChange: i,
      form: a,
      name: o,
      disabled: s,
      invalid: c,
      ...l
    } = e,
    u = Sy({
      value: n,
      defaultValue: r,
      onValueChange: i,
      form: a,
      name: o,
      disabled: s,
      invalid: c,
    }),
    d = Y(u.rootProps, l);
  return (0, S.jsx)(wy, { value: u, children: (0, S.jsx)(X.div, { ref: t, ...d }) });
});
ky.displayName = `RadioGroupRoot`;
var Ay = (0, x.forwardRef)((e, t) => {
  let { refs: n, labelProps: r } = Ty(),
    i = Y(r, e);
  return (0, S.jsx)(X.div, { ref: bh(n.label, t), ...i });
});
Ay.displayName = `RadioGroupLabel`;
var jy = (0, x.forwardRef)((e, t) => {
  let { value: n, disabled: r, ...i } = e,
    { getItemProps: a } = Ty(),
    o = a({ value: n, disabled: r }),
    s = Y(o.rootProps, i);
  return (0, S.jsx)(Dy, { value: o, children: (0, S.jsx)(X.label, { ref: t, ...s }) });
});
jy.displayName = `RadioGroupItem`;
var My = (0, x.forwardRef)((e, t) => {
  let { controlProps: n } = Oy(),
    r = Y(n, e);
  return (0, S.jsx)(X.div, { ref: t, ...r });
});
My.displayName = `RadioGroupItemControl`;
var Ny = (0, x.forwardRef)((e, t) => {
  let { hiddenInputProps: n } = Oy(),
    r = Y(n, e);
  return (0, S.jsx)(X.input, { ref: t, ...r });
});
Ny.displayName = `RadioGroupItemHiddenInput`;
var Py = (0, x.forwardRef)((e, t) => {
  let { refs: n, descriptionProps: r } = Ty(),
    i = Y(r, e);
  return (0, S.jsx)(X.span, { ref: bh(n.description, t), ...i });
});
Py.displayName = `RadioGroupDescription`;
var Fy = (0, x.forwardRef)((e, t) => {
  let { refs: n, errorMessageProps: r } = Ty(),
    i = Y(r, e);
  return (0, S.jsx)(X.div, { ref: bh(n.errorMessage, t), ...i });
});
Fy.displayName = `RadioGroupErrorMessage`;
var Iy = {
  __proto__: null,
  Description: Py,
  ErrorMessage: Fy,
  Item: jy,
  ItemControl: My,
  ItemHiddenInput: Ny,
  Label: Ay,
  Root: ky,
};
function Ly(e) {
  let [t, n] = x.useState(void 0);
  return (
    Nh(() => {
      if (e) {
        n({ width: e.offsetWidth, height: e.offsetHeight });
        let t = new ResizeObserver((t) => {
          if (!Array.isArray(t) || !t.length) return;
          let r = t[0],
            i,
            a;
          if (`borderBoxSize` in r) {
            let e = r.borderBoxSize,
              t = Array.isArray(e) ? e[0] : e;
            (i = t.inlineSize), (a = t.blockSize);
          } else (i = e.offsetWidth), (a = e.offsetHeight);
          n({ width: i, height: a });
        });
        return t.observe(e, { box: `border-box` }), () => t.unobserve(e);
      } else n(void 0);
    }, [e]),
    t
  );
}
function Ry(e = {}) {
  let t,
    n = [],
    r = [`select`, `slideFocus`];
  function i(e) {
    t = e;
    let {
      options: { axis: i },
      slideRects: a,
    } = t.internalEngine();
    i !== `y` && ((n = a.map((e) => e.height)), r.forEach((e) => t.on(e, s)), s());
  }
  function a() {
    r.forEach((e) => t.off(e, s));
    let e = t.containerNode();
    (e.style.height = ``), e.getAttribute(`style`) || e.removeAttribute(`style`);
  }
  function o() {
    let { slideRegistry: e } = t.internalEngine(),
      r = e[t.selectedScrollSnap()];
    return r ? r.map((e) => n[e]).reduce((e, t) => Math.max(e, t), 0) : null;
  }
  function s() {
    o() !== null && (t.containerNode().style.height = `${o()}px`);
  }
  return { name: `autoHeight`, options: e, init: i, destroy: a };
}
Ry.globalOptions = void 0;
function zy(e) {
  return Object.prototype.toString.call(e) === `[object Object]`;
}
function By(e) {
  return zy(e) || Array.isArray(e);
}
function Vy() {
  return !!(typeof window < `u` && window.document && window.document.createElement);
}
function Hy(e, t) {
  let n = Object.keys(e),
    r = Object.keys(t);
  return n.length !== r.length ||
    JSON.stringify(Object.keys(e.breakpoints || {})) !==
      JSON.stringify(Object.keys(t.breakpoints || {}))
    ? !1
    : n.every((n) => {
        let r = e[n],
          i = t[n];
        return typeof r == `function` ? `${r}` == `${i}` : !By(r) || !By(i) ? r === i : Hy(r, i);
      });
}
function Uy(e) {
  return e
    .concat()
    .sort((e, t) => (e.name > t.name ? 1 : -1))
    .map((e) => e.options);
}
function Wy(e, t) {
  if (e.length !== t.length) return !1;
  let n = Uy(e),
    r = Uy(t);
  return n.every((e, t) => {
    let n = r[t];
    return Hy(e, n);
  });
}
function Gy(e) {
  return typeof e == `number`;
}
function Ky(e) {
  return typeof e == `string`;
}
function qy(e) {
  return typeof e == `boolean`;
}
function Jy(e) {
  return Object.prototype.toString.call(e) === `[object Object]`;
}
function Yy(e) {
  return Math.abs(e);
}
function Xy(e) {
  return Math.sign(e);
}
function Zy(e, t) {
  return Yy(e - t);
}
function Qy(e, t) {
  return e === 0 || t === 0 || Yy(e) <= Yy(t) ? 0 : Yy(Zy(Yy(e), Yy(t)) / e);
}
function $y(e) {
  return Math.round(e * 100) / 100;
}
function eb(e) {
  return ab(e).map(Number);
}
function tb(e) {
  return e[nb(e)];
}
function nb(e) {
  return Math.max(0, e.length - 1);
}
function rb(e, t) {
  return t === nb(e);
}
function ib(e, t = 0) {
  return Array.from(Array(e), (e, n) => t + n);
}
function ab(e) {
  return Object.keys(e);
}
function ob(e, t) {
  return [e, t].reduce(
    (e, t) => (
      ab(t).forEach((n) => {
        let r = e[n],
          i = t[n];
        e[n] = Jy(r) && Jy(i) ? ob(r, i) : i;
      }),
      e
    ),
    {},
  );
}
function sb(e, t) {
  return t.MouseEvent !== void 0 && e instanceof t.MouseEvent;
}
function cb(e, t) {
  let n = { start: r, center: i, end: a };
  function r() {
    return 0;
  }
  function i(e) {
    return a(e) / 2;
  }
  function a(e) {
    return t - e;
  }
  function o(r, i) {
    return Ky(e) ? n[e](r) : e(t, r, i);
  }
  return { measure: o };
}
function lb() {
  let e = [];
  function t(t, n, i, a = { passive: !0 }) {
    let o;
    if (`addEventListener` in t)
      t.addEventListener(n, i, a), (o = () => t.removeEventListener(n, i, a));
    else {
      let e = t;
      e.addListener(i), (o = () => e.removeListener(i));
    }
    return e.push(o), r;
  }
  function n() {
    e = e.filter((e) => e());
  }
  let r = { add: t, clear: n };
  return r;
}
function ub(e, t, n, r) {
  let i = lb(),
    a = 1e3 / 60,
    o = null,
    s = 0,
    c = 0;
  function l() {
    i.add(e, `visibilitychange`, () => {
      e.hidden && m();
    });
  }
  function u() {
    p(), i.clear();
  }
  function d(e) {
    if (!c) return;
    o || ((o = e), n(), n());
    let i = e - o;
    for (o = e, s += i; s >= a; ) n(), (s -= a);
    r(s / a), (c &&= t.requestAnimationFrame(d));
  }
  function f() {
    c ||= t.requestAnimationFrame(d);
  }
  function p() {
    t.cancelAnimationFrame(c), (o = null), (s = 0), (c = 0);
  }
  function m() {
    (o = null), (s = 0);
  }
  return { init: l, destroy: u, start: f, stop: p, update: n, render: r };
}
function db(e, t) {
  let n = t === `rtl`,
    r = e === `y`,
    i = r ? `y` : `x`,
    a = r ? `x` : `y`,
    o = !r && n ? -1 : 1,
    s = u(),
    c = d();
  function l(e) {
    let { height: t, width: n } = e;
    return r ? t : n;
  }
  function u() {
    return r ? `top` : n ? `right` : `left`;
  }
  function d() {
    return r ? `bottom` : n ? `left` : `right`;
  }
  function f(e) {
    return e * o;
  }
  return { scroll: i, cross: a, startEdge: s, endEdge: c, measureSize: l, direction: f };
}
function fb(e = 0, t = 0) {
  let n = Yy(e - t);
  function r(t) {
    return t < e;
  }
  function i(e) {
    return e > t;
  }
  function a(e) {
    return r(e) || i(e);
  }
  function o(n) {
    return a(n) ? (r(n) ? e : t) : n;
  }
  function s(e) {
    return n ? e - n * Math.ceil((e - t) / n) : e;
  }
  return {
    length: n,
    max: t,
    min: e,
    constrain: o,
    reachedAny: a,
    reachedMax: i,
    reachedMin: r,
    removeOffset: s,
  };
}
function pb(e, t, n) {
  let { constrain: r } = fb(0, e),
    i = e + 1,
    a = o(t);
  function o(e) {
    return n ? Yy((i + e) % i) : r(e);
  }
  function s() {
    return a;
  }
  function c(e) {
    return (a = o(e)), d;
  }
  function l(e) {
    return u().set(s() + e);
  }
  function u() {
    return pb(e, s(), n);
  }
  let d = { get: s, set: c, add: l, clone: u };
  return d;
}
function mb(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v) {
  let { cross: y, direction: b } = e,
    x = [`INPUT`, `SELECT`, `TEXTAREA`],
    S = { passive: !1 },
    C = lb(),
    w = lb(),
    ee = fb(50, 225).constrain(p.measure(20)),
    T = { mouse: 300, touch: 400 },
    te = { mouse: 500, touch: 600 },
    E = m ? 43 : 25,
    ne = !1,
    re = 0,
    ie = 0,
    ae = !1,
    oe = !1,
    se = !1,
    ce = !1;
  function D(e) {
    if (!v) return;
    function n(t) {
      (qy(v) || v(e, t)) && k(t);
    }
    let r = t;
    C.add(r, `dragstart`, (e) => e.preventDefault(), S)
      .add(r, `touchmove`, () => void 0, S)
      .add(r, `touchend`, () => void 0)
      .add(r, `touchstart`, n)
      .add(r, `mousedown`, n)
      .add(r, `touchcancel`, pe)
      .add(r, `contextmenu`, pe)
      .add(r, `click`, me, !0);
  }
  function O() {
    C.clear(), w.clear();
  }
  function le() {
    let e = ce ? n : t;
    w.add(e, `touchmove`, A, S)
      .add(e, `touchend`, pe)
      .add(e, `mousemove`, A, S)
      .add(e, `mouseup`, pe);
  }
  function ue(e) {
    let t = e.nodeName || ``;
    return x.includes(t);
  }
  function de() {
    return (m ? te : T)[ce ? `mouse` : `touch`];
  }
  function fe(e, t) {
    let n = d.add(Xy(e) * -1),
      r = u.byDistance(e, !m).distance;
    return m || Yy(e) < ee ? r : g && t ? r * 0.5 : u.byIndex(n.get(), 0).distance;
  }
  function k(e) {
    let t = sb(e, r);
    (ce = t),
      (se = m && t && !e.buttons && ne),
      (ne = Zy(i.get(), o.get()) >= 2),
      !(t && e.button !== 0) &&
        (ue(e.target) ||
          ((ae = !0),
          a.pointerDown(e),
          l.useFriction(0).useDuration(0),
          i.set(o),
          le(),
          (re = a.readPoint(e)),
          (ie = a.readPoint(e, y)),
          f.emit(`pointerDown`)));
  }
  function A(e) {
    if (!sb(e, r) && e.touches.length >= 2) return pe(e);
    let t = a.readPoint(e),
      n = a.readPoint(e, y),
      o = Zy(t, re),
      c = Zy(n, ie);
    if (!oe && !ce && (!e.cancelable || ((oe = o > c), !oe))) return pe(e);
    let u = a.pointerMove(e);
    o > h && (se = !0),
      l.useFriction(0.3).useDuration(0.75),
      s.start(),
      i.add(b(u)),
      e.preventDefault();
  }
  function pe(e) {
    let t = u.byDistance(0, !1).index !== d.get(),
      n = a.pointerUp(e) * de(),
      r = fe(b(n), t),
      i = Qy(n, r),
      o = E - 10 * i,
      s = _ + i / 50;
    (oe = !1),
      (ae = !1),
      w.clear(),
      l.useDuration(o).useFriction(s),
      c.distance(r, !m),
      (ce = !1),
      f.emit(`pointerUp`);
  }
  function me(e) {
    se &&= (e.stopPropagation(), e.preventDefault(), !1);
  }
  function he() {
    return ae;
  }
  return { init: D, destroy: O, pointerDown: he };
}
function hb(e, t) {
  let n, r;
  function i(e) {
    return e.timeStamp;
  }
  function a(n, r) {
    let i = `client${(r || e.scroll) === `x` ? `X` : `Y`}`;
    return (sb(n, t) ? n : n.touches[0])[i];
  }
  function o(e) {
    return (n = e), (r = e), a(e);
  }
  function s(e) {
    let t = a(e) - a(r),
      o = i(e) - i(n) > 170;
    return (r = e), o && (n = e), t;
  }
  function c(e) {
    if (!n || !r) return 0;
    let t = a(r) - a(n),
      o = i(e) - i(n),
      s = i(e) - i(r) > 170,
      c = t / o;
    return o && !s && Yy(c) > 0.1 ? c : 0;
  }
  return { pointerDown: o, pointerMove: s, pointerUp: c, readPoint: a };
}
function gb() {
  function e(e) {
    let { offsetTop: t, offsetLeft: n, offsetWidth: r, offsetHeight: i } = e;
    return { top: t, right: n + r, bottom: t + i, left: n, width: r, height: i };
  }
  return { measure: e };
}
function _b(e) {
  function t(t) {
    return (t / 100) * e;
  }
  return { measure: t };
}
function vb(e, t, n, r, i, a, o) {
  let s = [e].concat(r),
    c,
    l,
    u = [],
    d = !1;
  function f(e) {
    return i.measureSize(o.measure(e));
  }
  function p(i) {
    if (!a) return;
    (l = f(e)), (u = r.map(f));
    function o(n) {
      for (let a of n) {
        if (d) return;
        let n = a.target === e,
          o = r.indexOf(a.target),
          s = n ? l : u[o];
        if (Yy(f(n ? e : r[o]) - s) >= 0.5) {
          i.reInit(), t.emit(`resize`);
          break;
        }
      }
    }
    (c = new ResizeObserver((e) => {
      (qy(a) || a(i, e)) && o(e);
    })),
      n.requestAnimationFrame(() => {
        s.forEach((e) => c.observe(e));
      });
  }
  function m() {
    (d = !0), c && c.disconnect();
  }
  return { init: p, destroy: m };
}
function yb(e, t, n, r, i, a) {
  let o = 0,
    s = 0,
    c = i,
    l = a,
    u = e.get(),
    d = 0;
  function f() {
    let t = r.get() - e.get(),
      i = !c,
      a = 0;
    return (
      i
        ? ((o = 0), n.set(r), e.set(r), (a = t))
        : (n.set(e), (o += t / c), (o *= l), (u += o), e.add(o), (a = u - d)),
      (s = Xy(a)),
      (d = u),
      x
    );
  }
  function p() {
    return Yy(r.get() - t.get()) < 0.001;
  }
  function m() {
    return c;
  }
  function h() {
    return s;
  }
  function g() {
    return o;
  }
  function _() {
    return y(i);
  }
  function v() {
    return b(a);
  }
  function y(e) {
    return (c = e), x;
  }
  function b(e) {
    return (l = e), x;
  }
  let x = {
    direction: h,
    duration: m,
    velocity: g,
    seek: f,
    settled: p,
    useBaseFriction: v,
    useBaseDuration: _,
    useFriction: b,
    useDuration: y,
  };
  return x;
}
function bb(e, t, n, r, i) {
  let a = i.measure(10),
    o = i.measure(50),
    s = fb(0.1, 0.99),
    c = !1;
  function l() {
    return !(c || !e.reachedAny(n.get()) || !e.reachedAny(t.get()));
  }
  function u(i) {
    if (!l()) return;
    let c = Yy(e[e.reachedMin(t.get()) ? `min` : `max`] - t.get()),
      u = n.get() - t.get(),
      d = s.constrain(c / o);
    n.subtract(u * d),
      !i && Yy(u) < a && (n.set(e.constrain(n.get())), r.useDuration(25).useBaseFriction());
  }
  function d(e) {
    c = !e;
  }
  return { shouldConstrain: l, constrain: u, toggleActive: d };
}
function xb(e, t, n, r, i) {
  let a = fb(-t + e, 0),
    o = d(),
    s = u(),
    c = f();
  function l(e, t) {
    return Zy(e, t) <= 1;
  }
  function u() {
    let e = o[0],
      t = tb(o);
    return fb(o.lastIndexOf(e), o.indexOf(t) + 1);
  }
  function d() {
    return n
      .map((e, t) => {
        let { min: r, max: i } = a,
          o = a.constrain(e),
          s = !t,
          c = rb(n, t);
        return s ? i : c || l(r, o) ? r : l(i, o) ? i : o;
      })
      .map((e) => parseFloat(e.toFixed(3)));
  }
  function f() {
    if (t <= e + i) return [a.max];
    if (r === `keepSnaps`) return o;
    let { min: n, max: c } = s;
    return o.slice(n, c);
  }
  return { snapsContained: c, scrollContainLimit: s };
}
function Sb(e, t, n) {
  let r = t[0];
  return { limit: fb(n ? r - e : tb(t), r) };
}
function Cb(e, t, n, r) {
  let i = 0.1,
    { reachedMin: a, reachedMax: o } = fb(t.min + i, t.max + i);
  function s(e) {
    return e === 1 ? o(n.get()) : e === -1 ? a(n.get()) : !1;
  }
  function c(t) {
    if (!s(t)) return;
    let n = t * -1 * e;
    r.forEach((e) => e.add(n));
  }
  return { loop: c };
}
function wb(e) {
  let { max: t, length: n } = e;
  function r(e) {
    let r = e - t;
    return n ? r / -n : 0;
  }
  return { get: r };
}
function Tb(e, t, n, r, i) {
  let { startEdge: a, endEdge: o } = e,
    { groupSlides: s } = i,
    c = d().map(t.measure),
    l = f(),
    u = p();
  function d() {
    return s(r)
      .map((e) => tb(e)[o] - e[0][a])
      .map(Yy);
  }
  function f() {
    return r.map((e) => n[a] - e[a]).map((e) => -Yy(e));
  }
  function p() {
    return s(l)
      .map((e) => e[0])
      .map((e, t) => e + c[t]);
  }
  return { snaps: l, snapsAligned: u };
}
function Eb(e, t, n, r, i, a) {
  let { groupSlides: o } = i,
    { min: s, max: c } = r,
    l = u();
  function u() {
    let r = o(a),
      i = !e || t === `keepSnaps`;
    return n.length === 1
      ? [a]
      : i
        ? r
        : r.slice(s, c).map((e, t, n) => {
            let r = !t,
              i = rb(n, t);
            return r ? ib(tb(n[0]) + 1) : i ? ib(nb(a) - tb(n)[0] + 1, tb(n)[0]) : e;
          });
  }
  return { slideRegistry: l };
}
function Db(e, t, n, r, i) {
  let { reachedAny: a, removeOffset: o, constrain: s } = r;
  function c(e) {
    return e.concat().sort((e, t) => Yy(e) - Yy(t))[0];
  }
  function l(n) {
    let r = e ? o(n) : s(n),
      { index: i } = t
        .map((e, t) => ({ diff: u(e - r, 0), index: t }))
        .sort((e, t) => Yy(e.diff) - Yy(t.diff))[0];
    return { index: i, distance: r };
  }
  function u(t, r) {
    let i = [t, t + n, t - n];
    if (!e) return t;
    if (!r) return c(i);
    let a = i.filter((e) => Xy(e) === r);
    return a.length ? c(a) : tb(i) - n;
  }
  function d(e, n) {
    return { index: e, distance: u(t[e] - i.get(), n) };
  }
  function f(n, r) {
    let o = i.get() + n,
      { index: s, distance: c } = l(o),
      d = !e && a(o);
    return !r || d ? { index: s, distance: n } : { index: s, distance: n + u(t[s] - c, 0) };
  }
  return { byDistance: f, byIndex: d, shortcut: u };
}
function Ob(e, t, n, r, i, a, o) {
  function s(i) {
    let s = i.distance,
      c = i.index !== t.get();
    a.add(s),
      s && (r.duration() ? e.start() : (e.update(), e.render(1), e.update())),
      c && (n.set(t.get()), t.set(i.index), o.emit(`select`));
  }
  function c(e, t) {
    s(i.byDistance(e, t));
  }
  function l(e, n) {
    let r = t.clone().set(e);
    s(i.byIndex(r.get(), n));
  }
  return { distance: c, index: l };
}
function kb(e, t, n, r, i, a, o, s) {
  let c = { passive: !0, capture: !0 },
    l = 0;
  function u(u) {
    if (!s) return;
    function f(t) {
      if (new Date().getTime() - l > 10) return;
      o.emit(`slideFocusStart`), (e.scrollLeft = 0);
      let a = n.findIndex((e) => e.includes(t));
      Gy(a) && (i.useDuration(0), r.index(a, 0), o.emit(`slideFocus`));
    }
    a.add(document, `keydown`, d, !1),
      t.forEach((e, t) => {
        a.add(
          e,
          `focus`,
          (e) => {
            (qy(s) || s(u, e)) && f(t);
          },
          c,
        );
      });
  }
  function d(e) {
    e.code === `Tab` && (l = new Date().getTime());
  }
  return { init: u };
}
function Ab(e) {
  let t = e;
  function n() {
    return t;
  }
  function r(e) {
    t = o(e);
  }
  function i(e) {
    t += o(e);
  }
  function a(e) {
    t -= o(e);
  }
  function o(e) {
    return Gy(e) ? e : e.get();
  }
  return { get: n, set: r, add: i, subtract: a };
}
function jb(e, t) {
  let n = e.scroll === `x` ? o : s,
    r = t.style,
    i = null,
    a = !1;
  function o(e) {
    return `translate3d(${e}px,0px,0px)`;
  }
  function s(e) {
    return `translate3d(0px,${e}px,0px)`;
  }
  function c(t) {
    if (a) return;
    let o = $y(e.direction(t));
    o !== i && ((r.transform = n(o)), (i = o));
  }
  function l(e) {
    a = !e;
  }
  function u() {
    a || ((r.transform = ``), t.getAttribute(`style`) || t.removeAttribute(`style`));
  }
  return { clear: u, to: c, toggleActive: l };
}
function Mb(e, t, n, r, i, a, o, s, c) {
  let l = 0.5,
    u = eb(i),
    d = eb(i).reverse(),
    f = _().concat(v());
  function p(e, t) {
    return e.reduce((e, t) => e - i[t], t);
  }
  function m(e, t) {
    return e.reduce((e, n) => (p(e, t) > 0 ? e.concat([n]) : e), []);
  }
  function h(e) {
    return a.map((n, i) => ({ start: n - r[i] + l + e, end: n + t - l + e }));
  }
  function g(t, r, i) {
    let a = h(r);
    return t.map((t) => {
      let r = i ? 0 : -n,
        o = i ? n : 0,
        l = i ? `end` : `start`,
        u = a[t][l];
      return {
        index: t,
        loopPoint: u,
        slideLocation: Ab(-1),
        translate: jb(e, c[t]),
        target: () => (s.get() > u ? r : o),
      };
    });
  }
  function _() {
    let e = o[0];
    return g(m(d, e), n, !1);
  }
  function v() {
    return g(m(u, t - o[0] - 1), -n, !0);
  }
  function y() {
    return f.every(
      ({ index: e }) =>
        p(
          u.filter((t) => t !== e),
          t,
        ) <= 0.1,
    );
  }
  function b() {
    f.forEach((e) => {
      let { target: t, translate: n, slideLocation: r } = e,
        i = t();
      i !== r.get() && (n.to(i), r.set(i));
    });
  }
  function x() {
    f.forEach((e) => e.translate.clear());
  }
  return { canLoop: y, clear: x, loop: b, loopPoints: f };
}
function Nb(e, t, n) {
  let r,
    i = !1;
  function a(a) {
    if (!n) return;
    function o(e) {
      for (let n of e)
        if (n.type === `childList`) {
          a.reInit(), t.emit(`slidesChanged`);
          break;
        }
    }
    (r = new MutationObserver((e) => {
      i || ((qy(n) || n(a, e)) && o(e));
    })),
      r.observe(e, { childList: !0 });
  }
  function o() {
    r && r.disconnect(), (i = !0);
  }
  return { init: a, destroy: o };
}
function Pb(e, t, n, r) {
  let i = {},
    a = null,
    o = null,
    s,
    c = !1;
  function l() {
    (s = new IntersectionObserver(
      (e) => {
        c ||
          (e.forEach((e) => {
            let n = t.indexOf(e.target);
            i[n] = e;
          }),
          (a = null),
          (o = null),
          n.emit(`slidesInView`));
      },
      { root: e.parentElement, threshold: r },
    )),
      t.forEach((e) => s.observe(e));
  }
  function u() {
    s && s.disconnect(), (c = !0);
  }
  function d(e) {
    return ab(i).reduce((t, n) => {
      let r = parseInt(n),
        { isIntersecting: a } = i[r];
      return ((e && a) || (!e && !a)) && t.push(r), t;
    }, []);
  }
  function f(e = !0) {
    if (e && a) return a;
    if (!e && o) return o;
    let t = d(e);
    return e && (a = t), e || (o = t), t;
  }
  return { init: l, destroy: u, get: f };
}
function Fb(e, t, n, r, i, a) {
  let { measureSize: o, startEdge: s, endEdge: c } = e,
    l = n[0] && i,
    u = m(),
    d = h(),
    f = n.map(o),
    p = g();
  function m() {
    if (!l) return 0;
    let e = n[0];
    return Yy(t[s] - e[s]);
  }
  function h() {
    if (!l) return 0;
    let e = a.getComputedStyle(tb(r));
    return parseFloat(e.getPropertyValue(`margin-${c}`));
  }
  function g() {
    return n
      .map((e, t, n) => {
        let r = !t,
          i = rb(n, t);
        return r ? f[t] + u : i ? f[t] + d : n[t + 1][s] - e[s];
      })
      .map(Yy);
  }
  return { slideSizes: f, slideSizesWithGaps: p, startGap: u, endGap: d };
}
function Ib(e, t, n, r, i, a, o, s, c) {
  let { startEdge: l, endEdge: u, direction: d } = e,
    f = Gy(n);
  function p(e, t) {
    return eb(e)
      .filter((e) => e % t === 0)
      .map((n) => e.slice(n, n + t));
  }
  function m(e) {
    return e.length
      ? eb(e)
          .reduce((n, f, p) => {
            let m = tb(n) || 0,
              h = m === 0,
              g = f === nb(e),
              _ = i[l] - a[m][l],
              v = i[l] - a[f][u],
              y = !r && h ? d(o) : 0,
              b = Yy(v - (!r && g ? d(s) : 0) - (_ + y));
            return p && b > t + c && n.push(f), g && n.push(e.length), n;
          }, [])
          .map((t, n, r) => {
            let i = Math.max(r[n - 1] || 0);
            return e.slice(i, t);
          })
      : [];
  }
  function h(e) {
    return f ? p(e, n) : m(e);
  }
  return { groupSlides: h };
}
function Lb(e, t, n, r, i, a, o) {
  let {
      align: s,
      axis: c,
      direction: l,
      startIndex: u,
      loop: d,
      duration: f,
      dragFree: p,
      dragThreshold: m,
      inViewThreshold: h,
      slidesToScroll: g,
      skipSnaps: _,
      containScroll: v,
      watchResize: y,
      watchSlides: b,
      watchDrag: x,
      watchFocus: S,
    } = a,
    C = gb(),
    w = C.measure(t),
    ee = n.map(C.measure),
    T = db(c, l),
    te = T.measureSize(w),
    E = _b(te),
    ne = cb(s, te),
    re = !d && !!v,
    {
      slideSizes: ie,
      slideSizesWithGaps: ae,
      startGap: oe,
      endGap: se,
    } = Fb(T, w, ee, n, d || !!v, i),
    ce = Ib(T, te, g, d, w, ee, oe, se, 2),
    { snaps: D, snapsAligned: O } = Tb(T, ne, w, ee, ce),
    le = -tb(D) + tb(ae),
    { snapsContained: ue, scrollContainLimit: de } = xb(te, le, O, v, 2),
    fe = re ? ue : O,
    { limit: k } = Sb(le, fe, d),
    A = pb(nb(fe), u, d),
    pe = A.clone(),
    me = eb(n),
    he = ({ dragHandler: e, scrollBody: t, scrollBounds: n, options: { loop: r } }) => {
      r || n.constrain(e.pointerDown()), t.seek();
    },
    ge = (
      {
        scrollBody: e,
        translate: t,
        location: n,
        offsetLocation: r,
        previousLocation: i,
        scrollLooper: a,
        slideLooper: o,
        dragHandler: s,
        animation: c,
        eventHandler: l,
        scrollBounds: u,
        options: { loop: d },
      },
      f,
    ) => {
      let p = e.settled(),
        m = !u.shouldConstrain(),
        h = d ? p : p && m,
        g = h && !s.pointerDown();
      g && c.stop();
      let _ = n.get() * f + i.get() * (1 - f);
      r.set(_),
        d && (a.loop(e.direction()), o.loop()),
        t.to(r.get()),
        g && l.emit(`settle`),
        h || l.emit(`scroll`);
    },
    _e = ub(
      r,
      i,
      () => he(je),
      (e) => ge(je, e),
    ),
    j = 0.68,
    ve = fe[A.get()],
    ye = Ab(ve),
    be = Ab(ve),
    xe = Ab(ve),
    Se = Ab(ve),
    Ce = yb(ye, xe, be, Se, f, j),
    we = Db(d, fe, le, k, Se),
    Te = Ob(_e, A, pe, Ce, we, Se, o),
    Ee = wb(k),
    De = lb(),
    Oe = Pb(t, n, o, h),
    { slideRegistry: ke } = Eb(re, v, fe, de, ce, me),
    Ae = kb(e, n, ke, Te, Ce, De, o, S),
    je = {
      ownerDocument: r,
      ownerWindow: i,
      eventHandler: o,
      containerRect: w,
      slideRects: ee,
      animation: _e,
      axis: T,
      dragHandler: mb(T, e, r, i, Se, hb(T, i), ye, _e, Te, Ce, we, A, o, E, p, m, _, j, x),
      eventStore: De,
      percentOfView: E,
      index: A,
      indexPrevious: pe,
      limit: k,
      location: ye,
      offsetLocation: xe,
      previousLocation: be,
      options: a,
      resizeHandler: vb(t, o, i, n, T, y, C),
      scrollBody: Ce,
      scrollBounds: bb(k, xe, Se, Ce, E),
      scrollLooper: Cb(le, k, xe, [ye, xe, be, Se]),
      scrollProgress: Ee,
      scrollSnapList: fe.map(Ee.get),
      scrollSnaps: fe,
      scrollTarget: we,
      scrollTo: Te,
      slideLooper: Mb(T, te, le, ie, ae, D, fe, xe, n),
      slideFocus: Ae,
      slidesHandler: Nb(t, o, b),
      slidesInView: Oe,
      slideIndexes: me,
      slideRegistry: ke,
      slidesToScroll: ce,
      target: Se,
      translate: jb(T, t),
    };
  return je;
}
function Rb() {
  let e = {},
    t;
  function n(e) {
    t = e;
  }
  function r(t) {
    return e[t] || [];
  }
  function i(e) {
    return r(e).forEach((n) => n(t, e)), c;
  }
  function a(t, n) {
    return (e[t] = r(t).concat([n])), c;
  }
  function o(t, n) {
    return (e[t] = r(t).filter((e) => e !== n)), c;
  }
  function s() {
    e = {};
  }
  let c = { init: n, emit: i, off: o, on: a, clear: s };
  return c;
}
var zb = {
  align: `center`,
  axis: `x`,
  container: null,
  slides: null,
  containScroll: `trimSnaps`,
  direction: `ltr`,
  slidesToScroll: 1,
  inViewThreshold: 0,
  breakpoints: {},
  dragFree: !1,
  dragThreshold: 10,
  loop: !1,
  skipSnaps: !1,
  duration: 25,
  startIndex: 0,
  active: !0,
  watchDrag: !0,
  watchResize: !0,
  watchSlides: !0,
  watchFocus: !0,
};
function Bb(e) {
  function t(e, t) {
    return ob(e, t || {});
  }
  function n(n) {
    let r = n.breakpoints || {};
    return t(
      n,
      ab(r)
        .filter((t) => e.matchMedia(t).matches)
        .map((e) => r[e])
        .reduce((e, n) => t(e, n), {}),
    );
  }
  function r(t) {
    return t
      .map((e) => ab(e.breakpoints || {}))
      .reduce((e, t) => e.concat(t), [])
      .map(e.matchMedia);
  }
  return { mergeOptions: t, optionsAtMedia: n, optionsMediaQueries: r };
}
function Vb(e) {
  let t = [];
  function n(n, r) {
    return (
      (t = r.filter(({ options: t }) => e.optionsAtMedia(t).active !== !1)),
      t.forEach((t) => t.init(n, e)),
      r.reduce((e, t) => Object.assign(e, { [t.name]: t }), {})
    );
  }
  function r() {
    t = t.filter((e) => e.destroy());
  }
  return { init: n, destroy: r };
}
function Hb(e, t, n) {
  let r = e.ownerDocument,
    i = r.defaultView,
    a = Bb(i),
    o = Vb(a),
    s = lb(),
    c = Rb(),
    { mergeOptions: l, optionsAtMedia: u, optionsMediaQueries: d } = a,
    { on: f, off: p, emit: m } = c,
    h = te,
    g = !1,
    _,
    v = l(zb, Hb.globalOptions),
    y = l(v),
    b = [],
    x,
    S,
    C;
  function w() {
    let { container: t, slides: n } = y;
    S = (Ky(t) ? e.querySelector(t) : t) || e.children[0];
    let r = Ky(n) ? S.querySelectorAll(n) : n;
    C = [].slice.call(r || S.children);
  }
  function ee(t) {
    let n = Lb(e, S, C, r, i, t, c);
    return t.loop && !n.slideLooper.canLoop() ? ee(Object.assign({}, t, { loop: !1 })) : n;
  }
  function T(e, t) {
    g ||
      ((v = l(v, e)),
      (y = u(v)),
      (b = t || b),
      w(),
      (_ = ee(y)),
      d([v, ...b.map(({ options: e }) => e)]).forEach((e) => s.add(e, `change`, te)),
      y.active &&
        (_.translate.to(_.location.get()),
        _.animation.init(),
        _.slidesInView.init(),
        _.slideFocus.init(he),
        _.eventHandler.init(he),
        _.resizeHandler.init(he),
        _.slidesHandler.init(he),
        _.options.loop && _.slideLooper.loop(),
        S.offsetParent && C.length && _.dragHandler.init(he),
        (x = o.init(he, b))));
  }
  function te(e, t) {
    let n = O();
    E(), T(l({ startIndex: n }, e), t), c.emit(`reInit`);
  }
  function E() {
    _.dragHandler.destroy(),
      _.eventStore.clear(),
      _.translate.clear(),
      _.slideLooper.clear(),
      _.resizeHandler.destroy(),
      _.slidesHandler.destroy(),
      _.slidesInView.destroy(),
      _.animation.destroy(),
      o.destroy(),
      s.clear();
  }
  function ne() {
    g || ((g = !0), s.clear(), E(), c.emit(`destroy`), c.clear());
  }
  function re(e, t, n) {
    !y.active ||
      g ||
      (_.scrollBody.useBaseFriction().useDuration(t === !0 ? 0 : y.duration),
      _.scrollTo.index(e, n || 0));
  }
  function ie(e) {
    re(_.index.add(1).get(), e, -1);
  }
  function ae(e) {
    re(_.index.add(-1).get(), e, 1);
  }
  function oe() {
    return _.index.add(1).get() !== O();
  }
  function se() {
    return _.index.add(-1).get() !== O();
  }
  function ce() {
    return _.scrollSnapList;
  }
  function D() {
    return _.scrollProgress.get(_.offsetLocation.get());
  }
  function O() {
    return _.index.get();
  }
  function le() {
    return _.indexPrevious.get();
  }
  function ue() {
    return _.slidesInView.get();
  }
  function de() {
    return _.slidesInView.get(!1);
  }
  function fe() {
    return x;
  }
  function k() {
    return _;
  }
  function A() {
    return e;
  }
  function pe() {
    return S;
  }
  function me() {
    return C;
  }
  let he = {
    canScrollNext: oe,
    canScrollPrev: se,
    containerNode: pe,
    internalEngine: k,
    destroy: ne,
    off: p,
    on: f,
    emit: m,
    plugins: fe,
    previousScrollSnap: le,
    reInit: h,
    rootNode: A,
    scrollNext: ie,
    scrollPrev: ae,
    scrollProgress: D,
    scrollSnapList: ce,
    scrollTo: re,
    selectedScrollSnap: O,
    slideNodes: me,
    slidesInView: ue,
    slidesNotInView: de,
  };
  return T(t, n), setTimeout(() => c.emit(`init`), 0), he;
}
Hb.globalOptions = void 0;
function Ub(e = {}, t = []) {
  let n = (0, x.useRef)(e),
    r = (0, x.useRef)(t),
    [i, a] = (0, x.useState)(),
    [o, s] = (0, x.useState)(),
    c = (0, x.useCallback)(() => {
      i && i.reInit(n.current, r.current);
    }, [i]);
  return (
    (0, x.useEffect)(() => {
      Hy(n.current, e) || ((n.current = e), c());
    }, [e, c]),
    (0, x.useEffect)(() => {
      Wy(r.current, t) || ((r.current = t), c());
    }, [t, c]),
    (0, x.useEffect)(() => {
      if (Vy() && o) {
        Hb.globalOptions = Ub.globalOptions;
        let e = Hb(o, n.current, r.current);
        return a(e), () => e.destroy();
      } else a(void 0);
    }, [o, a]),
    [s, i]
  );
}
Ub.globalOptions = void 0;
function Wb(e) {
  let t = (0, x.useRef)(!1);
  return (
    e.present && (t.current = !0),
    {
      unmounted:
        (!e.present && !t.current && e.lazyMount) || (e.unmountOnExit && !e.present && t.current),
    }
  );
}
var Gb = (0, x.createContext)(null),
  Kb = Gb.Provider;
function qb({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(Gb);
  if (!t && e)
    throw Error(`useRenderStrategyPropsContext must be used within a RenderStrategyPropsProvider`);
  return t;
}
var Jb = (e, t) => `tabs:${e}:${t}:trigger-root`,
  Yb = (e) => `tabs:${e}:list`,
  Xb = (e, t) => `tabs:${e}:${t}:content`,
  Zb = (e, t) => e.querySelector(`[data-value="${t}"]`),
  Qb = (e) =>
    e
      ? Array.from(e.children)
          .filter((e) => !e.hasAttribute(`aria-disabled`))
          .map((e) => e.getAttribute(`data-value`))
          .filter(Boolean)
      : [],
  $b = `data-embla-prevent-drag`,
  ex = { [$b]: `` },
  tx = (e) => e.closest(`[${$b}]`) != null;
function nx(e, t) {
  if (t <= 0) throw Error(`Length must be a positive number.`);
  return (e - 1 + t) % t;
}
function rx(e, t) {
  if (t <= 0) throw Error(`Length must be a positive number.`);
  return (e + 1) % t;
}
function ix(e, t, n) {
  let r = t.getAttribute(`aria-orientation`) !== `vertical`,
    i = n?.scrollPadding;
  if (r) {
    let n = e.offsetLeft,
      r = n + e.offsetWidth,
      a = t.scrollLeft,
      o = t.clientWidth,
      s = a + o;
    n < a
      ? t.scrollTo({ left: Math.max(0, n - i), behavior: `smooth` })
      : r > s && t.scrollTo({ left: r - o + i, behavior: `smooth` });
  } else {
    let n = e.offsetTop,
      r = n + e.offsetHeight,
      a = t.scrollTop,
      o = t.clientHeight,
      s = a + o;
    n < a
      ? t.scrollTo({ top: Math.max(0, n - i), behavior: `smooth` })
      : r > s && t.scrollTo({ top: r - o + i, behavior: `smooth` });
  }
}
function ax() {
  let [e, t] = (0, x.useState)(!0);
  return (
    (0, x.useEffect)(() => {
      t(!1);
    }, []),
    e
  );
}
function ox(e) {
  let [t, n] = (0, x.useState)(`idle`),
    [r, i] = ev({
      prop: e.value,
      defaultProp: e.defaultValue ?? void 0,
      onChange: e.onValueChange,
    }),
    [a, o] = (0, x.useState)(null),
    [s, c] = (0, x.useState)(!1),
    l = Tv(`selector(:focus-visible)`),
    [u, d] = (0, x.useState)(null),
    [f, p] = (0, x.useState)(null),
    m = Ly(f),
    h = (0, x.useMemo)(() => (u ? Qb(u) : []), [u]),
    g = r ? h.indexOf(r) : -1,
    _ = g >= 0 ? nx(g, h.length) : -1,
    v = g >= 0 ? rx(g, h.length) : -1;
  (0, x.useEffect)(() => {
    f && u && ix(f, u, { scrollPadding: 16 });
  }, [f, u]);
  let y = (0, x.useCallback)(
      (e) => {
        u && Zb(u, e)?.focus();
      },
      [u],
    ),
    b = {
      selectPrev: (0, x.useCallback)(() => {
        let e = h[_];
        e && i(e);
      }, [h, _, i]),
      selectNext: (0, x.useCallback)(() => {
        let e = h[v];
        e && i(e);
      }, [h, v, i]),
      selectFirst: (0, x.useCallback)(() => {
        let e = h[0];
        e && i(e);
      }, [h, i]),
      selectLast: (0, x.useCallback)(() => {
        let e = h[h.length - 1];
        e && i(e);
      }, [h, i]),
      setFocusedValue: (0, x.useCallback)((e) => {
        o(e);
      }, []),
      clearFocusedValue: (0, x.useCallback)(() => {
        o(null);
      }, []),
      setValue: (0, x.useCallback)(
        (e) => {
          i(e);
        },
        [i],
      ),
    },
    S = {
      arrowPrev: (0, x.useCallback)(() => {
        t === `focused` && (b.selectPrev(), y(h[_] ?? ``), l && c(!0));
      }, [t, b.selectPrev, y, h, _, l]),
      arrowNext: (0, x.useCallback)(() => {
        t === `focused` && (b.selectNext(), y(h[v] ?? ``), l && c(!0));
      }, [t, b.selectNext, y, h, v, l]),
      arrowUp: (0, x.useCallback)(() => {
        t === `focused` && (b.selectPrev(), y(h[_] ?? ``), l && c(!0));
      }, [t, b.selectPrev, y, h, _, l]),
      arrowDown: (0, x.useCallback)(() => {
        t === `focused` && (b.selectNext(), y(h[v] ?? ``), l && c(!0));
      }, [t, b.selectNext, y, h, v, l]),
      home: (0, x.useCallback)(() => {
        t === `focused` && (b.selectFirst(), y(h[0] ?? ``), l && c(!0));
      }, [t, b.selectFirst, y, h, l]),
      end: (0, x.useCallback)(() => {
        t === `focused` && (b.selectLast(), y(h[h.length - 1] ?? ``), l && c(!0));
      }, [t, b.selectLast, y, h, l]),
      tabFocus: (0, x.useCallback)(
        (e) => {
          b.setFocusedValue(e), t === `idle` && n(`focused`);
        },
        [t, b.setFocusedValue],
      ),
      tabBlur: (0, x.useCallback)(() => {
        t === `focused` && (b.clearFocusedValue(), n(`idle`));
      }, [t, b.clearFocusedValue]),
      tabClick: (0, x.useCallback)(
        (e) => {
          b.setValue(e), t === `idle` && n(`focused`);
        },
        [t, b.setValue],
      ),
      setValue: (0, x.useCallback)(
        (e) => {
          b.setValue(e);
        },
        [b.setValue],
      ),
      selectNext: (0, x.useCallback)(() => {
        t === `focused` && (b.selectNext(), l && c(!0));
      }, [t, b.selectNext, l]),
      selectPrev: (0, x.useCallback)(() => {
        t === `focused` && (b.selectPrev(), l && c(!0));
      }, [t, b.selectPrev, l]),
      setContentIndex: (0, x.useCallback)(
        (e) => {
          let t = h[e];
          t && b.setValue(t);
        },
        [b.setValue, h],
      ),
      setIsFocusVisible: (0, x.useCallback)((e) => {
        c(e);
      }, []),
      setSelectedTriggerEl: (0, x.useCallback)((e) => {
        p(e);
      }, []),
    },
    C = (0, x.useMemo)(() => ({ list: d }), []),
    w = (0, x.useMemo)(
      () => ({ width: m?.width ?? f?.offsetWidth ?? 0, left: f?.offsetLeft ?? 0 }),
      [m, f],
    );
  return {
    refs: C,
    interactionState: t,
    value: r,
    isSSR: ax(),
    triggerRect: w,
    focusedValue: a,
    isFocusVisible: s,
    contentIndex: g,
    events: S,
    isFocusVisibleSupported: l,
  };
}
function sx(e) {
  let t = (0, x.useId)(),
    {
      refs: n,
      interactionState: r,
      value: i,
      isSSR: a,
      events: o,
      triggerRect: s,
      focusedValue: c,
      isFocusVisible: l,
      contentIndex: u,
      isFocusVisibleSupported: d,
    } = ox(e),
    { orientation: f = `horizontal` } = e,
    p = r === `focused`,
    m = (0, x.useMemo)(
      () => J({ "data-orientation": f, "data-focus": q(p), "data-ssr": q(a) }),
      [f, p, a],
    );
  return {
    refs: n,
    value: i,
    contentIndex: u,
    triggerRect: s,
    selectNext: o.selectNext,
    selectPrev: o.selectPrev,
    setValue: o.setValue,
    setContentIndex: o.setContentIndex,
    stateProps: m,
    rootProps: J({
      ...m,
      style: { "--indicator-left": `${s.left}px`, "--indicator-width": `${s.width}px` },
    }),
    listProps: J({
      id: Yb(t),
      role: `tablist`,
      "aria-orientation": f,
      ...m,
      onKeyDown(e) {
        if (!e.defaultPrevented && !e.nativeEvent.isComposing)
          switch (e.key) {
            case `ArrowLeft`:
              if (f !== `horizontal`) return;
              e.preventDefault(), o.arrowPrev();
              break;
            case `ArrowRight`:
              if (f !== `horizontal`) return;
              e.preventDefault(), o.arrowNext();
              break;
            case `ArrowUp`:
              if (f !== `vertical`) return;
              e.preventDefault(), o.arrowPrev();
              break;
            case `ArrowDown`:
              if (f !== `vertical`) return;
              e.preventDefault(), o.arrowNext();
              break;
            case `Home`:
              e.preventDefault(), o.home();
              break;
            case `End`:
              e.preventDefault(), o.end();
              break;
          }
      },
    }),
    getTriggerProps: (e) => {
      let { disabled: n, value: r } = e,
        s = { isDisabled: n, isSelected: i === r, isFocused: c === r },
        u = {
          "data-focus": q(s.isFocused),
          "data-focus-visible": q(s.isFocused && l),
          "data-selected": q(s.isSelected),
          "data-disabled": q(s.isDisabled),
          "data-ssr": q(a),
          "aria-disabled": Bh(s.isDisabled),
          "aria-selected": Bh(s.isSelected),
        },
        p = (e) => {
          e && r === i && o.setSelectedTriggerEl(e);
        };
      return {
        ...s,
        refs: { root: p },
        stateProps: u,
        rootProps: Uh({
          id: Jb(r, t),
          role: `tab`,
          type: `button`,
          disabled: n,
          tabIndex: s.isSelected ? 0 : -1,
          ...u,
          "data-value": r,
          "data-orientation": f,
          "data-ownedby": Yb(t),
          "aria-controls": Xb(r, t),
          onClick(e) {
            s.isDisabled || e.defaultPrevented || o.tabClick(r);
          },
          onFocus(t) {
            o.tabFocus(e.value), d && o.setIsFocusVisible(t.target.matches(`:focus-visible`));
          },
          onBlur(e) {
            e.relatedTarget?.getAttribute(`role`) !== `tab` && o.tabBlur(),
              d && o.setIsFocusVisible(!1);
          },
        }),
      };
    },
    getContentProps: (e) => {
      let { value: n } = e,
        r = Jb(n, t),
        o = i === n;
      return J({
        id: Xb(n, t),
        tabIndex: -1,
        role: `tabpanel`,
        "aria-labelledby": r,
        "aria-selected": Bh(o),
        "aria-hidden": !o,
        "data-selected": q(o),
        "data-orientation": f,
        "data-ownedby": Yb(t),
        "data-ssr": q(a),
      });
    },
    indicatorProps: J({ ...m }),
  };
}
var cx = (0, x.createContext)(null),
  lx = cx.Provider;
function ux({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(cx);
  if (!t && e) throw Error(`useTabsContext must be used within a Tabs`);
  return t;
}
var dx = [Ry()],
  fx = (e) => {
    let t = ux(),
      [n, r] = Ub(
        {
          loop: e.loop,
          dragThreshold: e.dragThreshold,
          duration: 20,
          watchDrag: (e, t) => !(t.target instanceof HTMLElement && tx(t.target)),
          watchResize: (e, t) => {
            for (let n of t) if (n.target !== e.containerNode()) return e.reInit(), !1;
            return !0;
          },
        },
        dx,
      ),
      i = yg(e.onSettle),
      a = yg(e.onSwipeStart),
      o = yg(e.onSwipeEnd);
    (0, x.useEffect)(() => {
      let e = r?.on(`select`, () => {
          let e = r.selectedScrollSnap();
          t.setContentIndex(e);
        }),
        n = r?.on(`settle`, () => {
          i?.();
        }),
        s = r?.on(`pointerDown`, () => {
          a?.();
        }),
        c = r?.on(`pointerUp`, () => {
          o?.();
        });
      return () => {
        e?.clear(), n?.clear(), s?.clear(), c?.clear();
      };
    }, [r, t.setContentIndex, i, a, o]);
    let s = yg(() => t.contentIndex);
    (0, x.useEffect)(() => {
      let e = r?.on(`reInit`, () => {
        r?.scrollTo(s(), !0);
      });
      return () => {
        e?.clear();
      };
    }, [s, r]),
      (0, x.useEffect)(() => {
        if (!r) return;
        let { dragHandler: t } = r.internalEngine();
        e.swipeable ? t.init(r) : t.destroy();
      }, [r, e.swipeable]);
    let c = (0, x.useRef)(!0);
    return (
      (0, x.useEffect)(() => {
        if (r && t.contentIndex !== r.selectedScrollSnap()) {
          let e = r.internalEngine();
          c.current
            ? (e.scrollBody.useDuration(0), (c.current = !1))
            : e.scrollBody.useDuration(4).useFriction(0.4),
            e.scrollTo.index(t.contentIndex, 0);
        }
      }, [r, t.contentIndex]),
      { refs: { root: n }, autoHeight: e.autoHeight }
    );
  },
  px = (e) => {
    let { refs: t, autoHeight: n } = fx(e),
      r = J({ "data-carousel": ``, "data-auto-height": q(n) });
    return { refs: t, stateProps: r, rootProps: J({ ...r }), cameraProps: J({ ...r }) };
  },
  mx = (0, x.createContext)(null),
  hx = mx.Provider;
function gx({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(mx);
  if (!t && e) throw Error(`useTabsCarouselContext must be used within a TabsCarousel`);
  return t;
}
var _x = (0, x.createContext)(null).Provider,
  vx = (0, x.forwardRef)((e, t) => {
    let {
        defaultValue: n,
        value: r,
        onValueChange: i,
        orientation: a,
        lazyMount: o,
        unmountOnExit: s,
        ...c
      } = e,
      l = sx({ defaultValue: n, value: r, onValueChange: i, orientation: a });
    return (0, S.jsx)(lx, {
      value: l,
      children: (0, S.jsx)(Kb, {
        value: (0, x.useMemo)(() => ({ lazyMount: o, unmountOnExit: s }), [o, s]),
        children: (0, S.jsx)(X.div, { ref: t, ...Y(l.rootProps, c) }),
      }),
    });
  });
vx.displayName = `TabsRoot`;
var yx = (0, x.forwardRef)((e, t) => {
  let n = ux();
  return (0, S.jsx)(X.div, { ref: bh(n.refs.list, t), ...Y(n.listProps, e) });
});
yx.displayName = `TabsList`;
var bx = (0, x.forwardRef)((e, t) => {
  let { value: n, disabled: r, ...i } = e,
    a = ux().getTriggerProps({ value: n, disabled: r });
  return (0, S.jsx)(_x, {
    value: a,
    children: (0, S.jsx)(X.button, { ref: bh(a.refs.root, t), ...Y(a.rootProps, i) }),
  });
});
bx.displayName = `TabsTrigger`;
var xx = (0, x.forwardRef)((e, t) => {
  let { value: n, ...r } = e,
    i = ux(),
    a = gx({ strict: !1 }),
    { unmounted: o } = Wb({ ...qb(), present: i.value === n });
  return o
    ? null
    : (0, S.jsx)(X.div, { ref: t, ...Y(i.getContentProps({ value: n }), a?.stateProps ?? {}, r) });
});
xx.displayName = `TabsContent`;
var Sx = (0, x.forwardRef)((e, t) => {
    let n = ux();
    return (0, S.jsx)(X.div, { ref: t, ...Y(n.indicatorProps, e) });
  }),
  Cx = (0, x.forwardRef)((e, t) => {
    let {
        dragThreshold: n,
        loop: r,
        swipeable: i,
        autoHeight: a,
        onSettle: o,
        onSwipeStart: s,
        onSwipeEnd: c,
        ...l
      } = e,
      u = px({
        dragThreshold: n,
        loop: r,
        swipeable: i,
        onSettle: o,
        autoHeight: a,
        onSwipeStart: s,
        onSwipeEnd: c,
      });
    return (0, S.jsx)(hx, {
      value: u,
      children: (0, S.jsx)(X.div, {
        ref: bh(u.refs.root, t),
        ...Y(u.rootProps, l),
        children: e.children,
      }),
    });
  });
Cx.displayName = `TabsCarousel`;
var wx = (0, x.forwardRef)((e, t) => {
  let n = gx();
  return (0, S.jsx)(X.div, { ref: t, ...Y(n.cameraProps, e) });
});
wx.displayName = `TabsCarouselCamera`;
var Tx = {
    __proto__: null,
    Carousel: Cx,
    CarouselCamera: wx,
    Content: xx,
    Indicator: Sx,
    List: yx,
    Root: vx,
    Trigger: bx,
    carouselPreventDrag: ex,
  },
  Ex = [
    [`positioner`, `seed-dialog__positioner`],
    [`backdrop`, `seed-dialog__backdrop`],
    [`content`, `seed-dialog__content`],
    [`header`, `seed-dialog__header`],
    [`footer`, `seed-dialog__footer`],
    [`action`, `seed-dialog__action`],
    [`title`, `seed-dialog__title`],
    [`description`, `seed-dialog__description`],
  ],
  Dx = { skipAnimation: !1 },
  Ox = [],
  kx = { skipAnimation: [!1] };
function Ax(e) {
  return Object.fromEntries(Ex.map(([t, n]) => [t, Zh(n, Qh(Dx, e), Ox)]));
}
Object.assign(Ax, { splitVariantProps: (e) => $h(e, kx) });
var { withRootProvider: jx, withContext: Mx } = sg(Ax),
  Nx = cg([c_]),
  Px = jx(g_.Root, { defaultProps: { lazyMount: !0, unmountOnExit: !0 } }),
  Fx = g_.Trigger,
  Ix = Mx(g_.Positioner, `positioner`),
  Lx = Mx(g_.Backdrop, `backdrop`),
  Rx = Mx(g_.Content, `content`),
  zx = Mx(X.div, `header`),
  Bx = Mx(Nx(X.span), `title`),
  Vx = Mx(Nx(X.div), `description`),
  Hx = Mx(X.div, `footer`),
  Ux = g_.CloseButton,
  Wx = v_({
    Action: () => Ux,
    Backdrop: () => Lx,
    Content: () => Rx,
    Description: () => Vx,
    Footer: () => Hx,
    Header: () => zx,
    Positioner: () => Ix,
    Root: () => Px,
    Title: () => Bx,
    Trigger: () => Fx,
  }),
  Gx = (e) => `field:${e}:label`,
  Kx = (e) => `field:${e}:input`,
  qx = (e) => `field:${e}:description`,
  Jx = (e) => `field:${e}:error-message`;
function Yx() {
  let [e, t] = (0, x.useState)(!1),
    [n, r] = (0, x.useState)(!1),
    [i, a] = (0, x.useState)(!1),
    [o, s] = (0, x.useState)(!1),
    [c, l] = (0, x.useState)(!1),
    u = (0, x.useCallback)((e) => {
      l(!!e);
    }, []),
    [d, f] = (0, x.useState)(!1),
    p = (0, x.useCallback)((e) => {
      f(!!e);
    }, []),
    [m, h] = (0, x.useState)(!1);
  return {
    refs: {
      label: u,
      description: p,
      errorMessage: (0, x.useCallback)((e) => {
        h(!!e);
      }, []),
    },
    isHovered: e,
    isActive: n,
    isFocused: i,
    isFocusVisible: o,
    renderedElements: { label: c, description: d, errorMessage: m },
    setIsHovered: t,
    setIsActive: r,
    setIsFocused: a,
    setIsFocusVisible: s,
  };
}
function Xx(e) {
  let t = (0, x.useId)(),
    { disabled: n = !1, invalid: r = !1, readOnly: i = !1, required: a = !1 } = e,
    o = Tv(`selector(:focus-visible)`),
    {
      refs: s,
      renderedElements: c,
      isHovered: l,
      isActive: u,
      isFocused: d,
      isFocusVisible: f,
      setIsHovered: p,
      setIsActive: m,
      setIsFocused: h,
      setIsFocusVisible: g,
    } = Yx(),
    _ =
      [c.description ? qx(t) : !1, c.errorMessage ? Jx(t) : !1].filter(Boolean).join(` `) || void 0,
    v = J({
      "data-hover": q(l),
      "data-active": q(u),
      "data-focus": q(d),
      "data-focus-visible": q(f),
      "data-readonly": q(i),
      "data-disabled": q(n),
      "data-invalid": q(r),
    });
  return {
    refs: s,
    active: u,
    focused: d,
    invalid: r,
    required: a,
    setIsFocused: h,
    setIsFocusVisible: g,
    stateProps: v,
    rootProps: J({
      ...v,
      onPointerMove() {
        p(!0);
      },
      onPointerDown() {
        m(!0);
      },
      onPointerUp() {
        m(!1);
      },
      onPointerLeave() {
        p(!1), m(!1);
      },
    }),
    labelProps: Hh({ ...v, id: Gx(t), htmlFor: Kx(t) }),
    inputProps: Vh({ disabled: n, readOnly: i, name: e.name || t, id: Kx(t) }),
    inputAriaAttributes: J({
      ...(c.label && { "aria-labelledby": Gx(t) }),
      "aria-describedby": _,
      "aria-required": Bh(a),
      "aria-invalid": Bh(r),
      "aria-readonly": Bh(i),
      "aria-disabled": Bh(n),
    }),
    inputHandlers: Vh({
      onChange: (e) => {
        o && g(e.target.matches(`:focus-visible`));
      },
      onBlur() {
        h(!1), o && g(!1);
      },
      onFocus(e) {
        h(!0), o && g(e.target.matches(`:focus-visible`));
      },
    }),
    descriptionProps: J({ ...v, id: qx(t) }),
    errorMessageProps: J({ ...v, id: Jx(t), "aria-live": `polite` }),
  };
}
var Zx = (0, x.createContext)(null),
  Qx = Zx.Provider;
function $x({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(Zx);
  if (!t && e) throw Error(`useFieldContext must be used within a Field`);
  return t;
}
var eS = (0, x.forwardRef)((e, t) => {
  let { readOnly: n, disabled: r, invalid: i, required: a, name: o, ...s } = e,
    c = Xx({ disabled: r, invalid: i, required: a, readOnly: n, name: o }),
    l = Y(c.rootProps, s);
  return (0, S.jsx)(Qx, { value: c, children: (0, S.jsx)(X.div, { ref: t, ...l }) });
});
eS.displayName = `FieldRoot`;
var tS = (0, x.forwardRef)((e, t) => {
  let { refs: n, labelProps: r } = $x(),
    i = Y(r, e);
  return (0, S.jsx)(X.label, { ref: bh(n.label, t), ...i });
});
tS.displayName = `FieldLabel`;
var nS = (0, x.forwardRef)((e, t) => {
  let { refs: n, descriptionProps: r } = $x(),
    i = Y(r, e);
  return (0, S.jsx)(X.span, { ref: bh(n.description, t), ...i });
});
nS.displayName = `FieldDescription`;
var rS = (0, x.forwardRef)((e, t) => {
  let { refs: n, errorMessageProps: r } = $x(),
    i = Y(r, e);
  return (0, S.jsx)(X.div, { ref: bh(n.errorMessage, t), ...i });
});
rS.displayName = `FieldErrorMessage`;
var iS = { __proto__: null, Description: nS, ErrorMessage: rS, Label: tS, Root: eS },
  aS = [
    [`root`, `seed-field__root`],
    [`header`, `seed-field__header`],
    [`footer`, `seed-field__footer`],
    [`description`, `seed-field__description`],
    [`errorMessage`, `seed-field__errorMessage`],
    [`characterCountArea`, `seed-field__characterCountArea`],
    [`characterCount`, `seed-field__characterCount`],
    [`maxCharacterCount`, `seed-field__maxCharacterCount`],
  ],
  oS = {},
  sS = [],
  cS = {};
function lS(e) {
  return Object.fromEntries(aS.map(([t, n]) => [t, Zh(n, Qh(oS, e), sS)]));
}
Object.assign(lS, { splitVariantProps: (e) => $h(e, cS) });
var uS = [
    [`root`, `seed-field-label__root`],
    [`indicatorText`, `seed-field-label__indicatorText`],
    [`indicatorIcon`, `seed-field-label__indicatorIcon`],
  ],
  dS = { weight: `medium` },
  fS = [],
  pS = { weight: [`medium`, `bold`] };
function mS(e) {
  return Object.fromEntries(uS.map(([t, n]) => [t, Zh(n, Qh(dS, e), fS)]));
}
Object.assign(mS, { splitVariantProps: (e) => $h(e, pS) });
var { withProvider: hS, withContext: gS, useClassNames: _S } = sg(lS),
  { withContext: vS, withProvider: yS, useClassNames: bS } = sg(mS),
  xS = cg([$x]),
  SS = hS(iS.Root, `root`),
  CS = gS(xS(X.div), `header`),
  wS = yS(iS.Label, `root`),
  TS = vS(xS(X.span), `indicatorText`),
  ES = (0, x.forwardRef)(({ className: e, ...t }, n) => {
    let { indicatorIcon: r } = bS();
    return (0, S.jsx)(wv, {
      svg: (0, S.jsx)(`svg`, {
        viewBox: `0 0 6 6`,
        fill: `none`,
        xmlns: `http://www.w3.org/2000/svg`,
        className: zh(r, e),
        children: (0, S.jsx)(`path`, {
          d: `M3.75002 1.55859L4.41318 1.09468C4.75243 0.857361 5.21982 0.939865 5.45732 1.27899C5.69499 1.61836 5.61243 2.08615 5.27295 2.32366L4.30763 2.99902L5.27372 3.67612C5.61285 3.91381 5.69517 4.38137 5.45761 4.72059C5.21999 5.0599 4.7523 5.14233 4.41299 4.90471L3.75002 4.44043V5.25C3.75002 5.66421 3.41423 6 3.00002 6C2.5858 6 2.25002 5.66421 2.25002 5.25V4.44043L1.58704 4.90471C1.24773 5.14233 0.780041 5.0599 0.542418 4.72059C0.304856 4.38137 0.387176 3.91381 0.726309 3.67612L1.6924 2.99902L0.727079 2.32366C0.387603 2.08615 0.305043 1.61836 0.542707 1.27899C0.780206 0.939865 1.2476 0.857361 1.58685 1.09468L2.25002 1.55859V0.75C2.25002 0.335786 2.5858 0 3.00002 0C3.41423 0 3.75002 0.335786 3.75002 0.75V1.55859Z`,
          fill: `currentColor`,
        }),
      }),
      ref: n,
      ...t,
    });
  }),
  DS = gS(xS(X.div), `footer`),
  OS = gS(iS.Description, `description`),
  kS = gS(iS.ErrorMessage, `errorMessage`),
  AS = (0, x.forwardRef)(({ current: e, max: t, className: n, ...r }, i) => {
    let a = _S(),
      { stateProps: o } = $x();
    return (0, S.jsxs)(X.div, {
      className: zh(a.characterCountArea, n),
      ref: i,
      ...r,
      children: [
        (0, S.jsx)(`span`, {
          ...(e === 0 ? { "data-empty": !0 } : {}),
          ...(e > t ? { "data-exceeded": !0 } : {}),
          className: a.characterCount,
          ...o,
          children: e,
        }),
        (0, S.jsxs)(`span`, { className: a.maxCharacterCount, ...o, children: [`/`, t] }),
      ],
    });
  }),
  jS = v_({
    CharacterCount: () => AS,
    Description: () => OS,
    ErrorMessage: () => kS,
    Footer: () => DS,
    Header: () => CS,
    IndicatorText: () => TS,
    Label: () => wS,
    RequiredIndicator: () => ES,
    Root: () => SS,
  }),
  { withProvider: MS, withContext: NS } = sg(lS),
  { withContext: PS, withProvider: FS, useClassNames: IS } = sg(mS),
  LS = MS(by.Root, `root`),
  RS = NS(X.div, `header`),
  zS = FS(by.Label, `root`),
  BS = PS(X.span, `indicatorText`),
  VS = (0, x.forwardRef)(({ className: e, ...t }, n) => {
    let { indicatorIcon: r } = IS();
    return (0, S.jsx)(wv, {
      svg: (0, S.jsx)(`svg`, {
        viewBox: `0 0 6 6`,
        fill: `none`,
        xmlns: `http://www.w3.org/2000/svg`,
        className: zh(r, e),
        children: (0, S.jsx)(`path`, {
          d: `M3.75002 1.55859L4.41318 1.09468C4.75243 0.857361 5.21982 0.939865 5.45732 1.27899C5.69499 1.61836 5.61243 2.08615 5.27295 2.32366L4.30763 2.99902L5.27372 3.67612C5.61285 3.91381 5.69517 4.38137 5.45761 4.72059C5.21999 5.0599 4.7523 5.14233 4.41299 4.90471L3.75002 4.44043V5.25C3.75002 5.66421 3.41423 6 3.00002 6C2.5858 6 2.25002 5.66421 2.25002 5.25V4.44043L1.58704 4.90471C1.24773 5.14233 0.780041 5.0599 0.542418 4.72059C0.304856 4.38137 0.387176 3.91381 0.726309 3.67612L1.6924 2.99902L0.727079 2.32366C0.387603 2.08615 0.305043 1.61836 0.542707 1.27899C0.780206 0.939865 1.2476 0.857361 1.58685 1.09468L2.25002 1.55859V0.75C2.25002 0.335786 2.5858 0 3.00002 0C3.41423 0 3.75002 0.335786 3.75002 0.75V1.55859Z`,
          fill: `currentColor`,
        }),
      }),
      ref: n,
      ...t,
    });
  }),
  HS = NS(X.div, `footer`),
  US = NS(by.Description, `description`),
  WS = NS(by.ErrorMessage, `errorMessage`),
  GS = v_({
    Description: () => US,
    ErrorMessage: () => WS,
    Footer: () => HS,
    Header: () => RS,
    IndicatorText: () => BS,
    Label: () => zS,
    RequiredIndicator: () => VS,
    Root: () => LS,
  }),
  KS = x.forwardRef((e, t) => {
    let { direction: n, wrap: r, align: i, justify: a, grow: o, shrink: s, ...c } = e;
    return (0, S.jsx)(y_, {
      ref: t,
      display: `flex`,
      flexDirection: n,
      flexWrap: r,
      alignItems: i,
      justifyContent: a,
      flexGrow: o,
      flexShrink: s,
      ...c,
    });
  });
x.forwardRef((e, t) => (0, S.jsx)(KS, { ref: t, display: `flex`, flexDirection: `column`, ...e }));
var qS = x.forwardRef((e, t) =>
    (0, S.jsx)(KS, { ref: t, display: `flex`, flexDirection: `column`, ...e }),
  ),
  JS = x.forwardRef((e, t) =>
    (0, S.jsx)(KS, { ref: t, display: `flex`, flexDirection: `row`, ...e }),
  );
function YS(e) {
  let [t, n] = ev({ prop: e.checked, defaultProp: e.defaultChecked, onChange: e.onCheckedChange }),
    [r, i] = (0, x.useState)(!1),
    [a, o] = (0, x.useState)(!1),
    [s, c] = (0, x.useState)(!1),
    [l, u] = (0, x.useState)(!1);
  return {
    isChecked: t,
    setIsChecked: n,
    isHovered: r,
    setIsHovered: i,
    isActive: a,
    setIsActive: o,
    isFocused: s,
    setIsFocused: c,
    isFocusVisible: l,
    setIsFocusVisible: u,
  };
}
function XS(e) {
  let {
      setIsChecked: t,
      isChecked: n,
      setIsHovered: r,
      isHovered: i,
      setIsActive: a,
      isActive: o,
      setIsFocused: s,
      isFocused: c,
      setIsFocusVisible: l,
      isFocusVisible: u,
    } = YS(e),
    d = Tv(`selector(:focus-visible)`),
    f = J({
      "data-checked": q(n),
      "data-hover": q(i),
      "data-active": q(o),
      "data-focus": q(c),
      "data-focus-visible": q(u),
      "data-disabled": q(e.disabled),
      "data-invalid": q(e.invalid),
      "data-required": q(e.required),
    }),
    p = e.checked != null;
  return {
    checked: n,
    setChecked: t,
    focused: c,
    setFocused: s,
    focusVisible: u,
    setFocusVisible: l,
    stateProps: f,
    rootProps: Hh({
      ...f,
      onPointerMove() {
        r(!0);
      },
      onPointerDown() {
        a(!0);
      },
      onPointerUp() {
        a(!1);
      },
      onPointerLeave() {
        r(!1), a(!1);
      },
    }),
    controlProps: J({ ...f, "aria-hidden": !0 }),
    thumbProps: J({ ...f, "aria-hidden": !0 }),
    hiddenInputProps: Vh({
      type: `checkbox`,
      role: `switch`,
      checked: p ? n : void 0,
      defaultChecked: p ? void 0 : n,
      disabled: e.disabled,
      required: e.required,
      "aria-invalid": e.invalid,
      style: Gh,
      ...f,
      onChange(e) {
        t(e.currentTarget.checked), d && l(e.target.matches(`:focus-visible`));
      },
      onFocus(e) {
        s(!0), d && l(e.target.matches(`:focus-visible`));
      },
      onBlur() {
        s(!1), d && l(!1);
      },
      onKeyDown(e) {
        e.key === ` ` && a(!0);
      },
      onKeyUp(e) {
        e.key === ` ` && a(!1);
      },
    }),
  };
}
var ZS = (0, x.createContext)(null),
  QS = ZS.Provider;
function $S({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(ZS);
  if (!t && e) throw Error(`useSwitchContext must be used within a Switch`);
  return t;
}
var eC = (0, x.forwardRef)((e, t) => {
  let {
      checked: n,
      defaultChecked: r,
      disabled: i,
      invalid: a,
      onCheckedChange: o,
      required: s,
      ...c
    } = e,
    l = XS({
      checked: n,
      defaultChecked: r,
      disabled: i,
      invalid: a,
      onCheckedChange: o,
      required: s,
    }),
    u = Y(l.rootProps, c);
  return (0, S.jsx)(QS, { value: l, children: (0, S.jsx)(X.label, { ref: t, ...u }) });
});
eC.displayName = `SwitchRoot`;
var tC = (0, x.forwardRef)((e, t) => {
  let { controlProps: n } = $S(),
    r = Y(n, e);
  return (0, S.jsx)(X.div, { ref: t, ...r });
});
tC.displayName = `SwitchControl`;
var nC = (0, x.forwardRef)((e, t) => {
  let { thumbProps: n } = $S(),
    r = Y(n, e);
  return (0, S.jsx)(X.div, { ref: t, ...r });
});
nC.displayName = `SwitchThumb`;
var rC = (0, x.forwardRef)((e, t) => {
  let { hiddenInputProps: n } = $S(),
    r = Y(n, e);
  return (0, S.jsx)(X.input, { ref: t, ...r });
});
rC.displayName = `SwitchHiddenInput`;
var iC = { __proto__: null, Control: tC, HiddenInput: rC, Root: eC, Thumb: nC },
  aC = (0, x.forwardRef)((e, t) => {
    let { indicator: n, children: r, ...i } = e,
      { stateProps: a } = Xh();
    return (0, S.jsxs)(S.Fragment, {
      children: [
        (0, S.jsx)(X.span, {
          ref: t,
          ...Y(a, { className: `seed-loading-indicator` }, i),
          children: n,
        }),
        (0, S.jsx)(X.span, {
          style: { opacity: 0, display: `inherit`, gap: `inherit` },
          children: r,
        }),
      ],
    });
  }),
  oC = { size: `large` },
  sC = [],
  cC = { size: [`small`, `large`] };
function lC(e) {
  return Zh(`seed-notification-badge`, Qh(oC, e), sC);
}
Object.assign(lC, { splitVariantProps: (e) => $h(e, cC) });
var uC = { size: `large`, attach: `icon` },
  dC = [
    { size: `large`, attach: `icon` },
    { size: `small`, attach: `icon` },
    { size: `large`, attach: `text` },
    { size: `small`, attach: `text` },
  ],
  fC = { attach: [`icon`, `text`], size: [`small`, `large`] };
function pC(e) {
  return Zh(`seed-notification-badge-positioner`, Qh(uC, e), dC);
}
Object.assign(pC, { splitVariantProps: (e) => $h(e, fC) });
var { withContext: mC, PropsProvider: hC } = og(lC),
  gC = mC(X.span),
  _C = x.forwardRef((e, t) => {
    let { attach: n, size: r, className: i, ...a } = e,
      o = pC({ attach: n, size: r });
    return (0, S.jsx)(hC, {
      value: (0, x.useMemo)(() => ({ size: r }), [r]),
      children: (0, S.jsx)(X.span, { ref: t, className: zh(o, i), ...a }),
    });
  });
function vC(e) {
  let { value: t, minValue: n = 0, maxValue: r = 100 } = e,
    i = typeof t != `number`,
    a = J({ "data-progress-state": t === r ? `complete` : i ? `indeterminate` : `loading` }),
    o = i ? -1 : ((t - n) / (r - n)) * 100;
  return {
    value: t,
    indeterminate: i,
    percent: o,
    stateProps: a,
    progressProps: J({
      role: `progressbar`,
      "aria-valuenow": i ? void 0 : t,
      "aria-valuemin": n,
      "aria-valuemax": r,
      "aria-valuetext": i ? `loading...` : `${o} percent`,
      ...a,
    }),
  };
}
function yC(e) {
  let t = vC(e),
    n = {
      "--radius": `calc(var(--size) / 2 - var(--thickness) / 2)`,
      cx: `calc(var(--size) / 2)`,
      cy: `calc(var(--size) / 2)`,
      r: `var(--radius)`,
      fill: `transparent`,
      strokeWidth: `var(--thickness)`,
    };
  return {
    ...t,
    rootProps: J({ ...t.progressProps, style: { width: `var(--size)`, height: `var(--size)` } }),
    trackProps: J({ ...t.stateProps, style: n }),
    rangeProps: J({
      ...t.stateProps,
      style: {
        ...n,
        "--percent": t.percent,
        "--circumference": `calc(2 * 3.14159 * var(--radius))`,
        "--offset": `calc(var(--circumference) * (100 - var(--percent)) / 100)`,
        strokeDashoffset: `calc(var(--circumference) * ((100 - var(--percent)) / 100))`,
        strokeDasharray: t.indeterminate ? void 0 : `var(--circumference)`,
        transformOrigin: `center`,
        transform: `rotate(-90deg)`,
        opacity: t.value === 0 ? 0 : void 0,
      },
    }),
  };
}
var bC = (0, x.createContext)(null),
  xC = bC.Provider;
function SC({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(bC);
  if (!t && e) throw Error(`useProgressCircleContext must be used within a ProgressCircle`);
  return t;
}
var CC = (0, x.forwardRef)((e, t) => {
  let { value: n, maxValue: r, minValue: i, ...a } = e,
    o = yC(vC({ value: n, maxValue: r, minValue: i })),
    s = Y(o.rootProps, a);
  return (0, S.jsx)(xC, { value: o, children: (0, S.jsx)(X.svg, { ref: t, ...s }) });
});
CC.displayName = `ProgressCircleRoot`;
var wC = (0, x.forwardRef)((e, t) => {
  let { trackProps: n } = SC(),
    r = Y(n, e);
  return (0, S.jsx)(X.circle, { ref: t, ...r });
});
wC.displayName = `ProgressCircleTrack`;
var TC = (0, x.forwardRef)((e, t) => {
  let { rangeProps: n } = SC(),
    r = Y(n, e);
  return (0, S.jsx)(X.circle, { ref: t, ...r });
});
TC.displayName = `ProgressCircleRange`;
var EC = { __proto__: null, Range: TC, Root: CC, Track: wC },
  DC = [
    [`root`, `seed-progress-circle__root`],
    [`track`, `seed-progress-circle__track`],
    [`range`, `seed-progress-circle__range`],
  ],
  OC = { tone: `neutral`, size: 40 },
  kC = [],
  AC = { tone: [`neutral`, `brand`, `staticWhite`, `inherit`], size: [`24`, `40`, `inherit`] };
function jC(e) {
  return Object.fromEntries(DC.map(([t, n]) => [t, Zh(n, Qh(OC, e), kC)]));
}
Object.assign(jC, { splitVariantProps: (e) => $h(e, AC) });
var { withContext: MC, withProvider: NC } = sg(jC),
  PC = NC(EC.Root, `root`),
  FC = MC(EC.Track, `track`),
  IC = MC(EC.Range, `range`),
  LC = v_({ Range: () => IC, Root: () => PC, Track: () => FC }),
  RC = [
    [`root`, `seed-radio__root`],
    [`label`, `seed-radio__label`],
  ],
  zC = { size: `medium`, weight: `regular` },
  BC = [],
  VC = { weight: [`regular`, `bold`], size: [`large`, `medium`] };
function HC(e) {
  return Object.fromEntries(RC.map(([t, n]) => [t, Zh(n, Qh(zC, e), BC)]));
}
Object.assign(HC, { splitVariantProps: (e) => $h(e, VC) });
var UC = {},
  WC = [],
  GC = {};
function KC(e) {
  return Zh(`seed-radio-group`, Qh(UC, e), WC);
}
Object.assign(KC, { splitVariantProps: (e) => $h(e, GC) });
var qC = [
    [`root`, `seed-radiomark__root`],
    [`icon`, `seed-radiomark__icon`],
  ],
  JC = { tone: `brand`, size: `medium` },
  YC = [],
  XC = { tone: [`neutral`, `brand`], size: [`large`, `medium`] };
function ZC(e) {
  return Object.fromEntries(qC.map(([t, n]) => [t, Zh(n, Qh(JC, e), YC)]));
}
Object.assign(ZC, { splitVariantProps: (e) => $h(e, XC) });
var { withContext: QC } = og(KC),
  { ClassNamesProvider: $C, withContext: ew } = sg(HC),
  { withProvider: tw, useClassNames: nw, PropsProvider: rw } = sg(ZC),
  iw = cg([Oy]),
  aw = QC(X.div),
  ow = Object.assign(
    (0, x.forwardRef)(({ className: e, ...t }, n) => {
      let [{ radio: r, radiomark: i }, a] = Cv(t, { radio: HC, radiomark: ZC }),
        o = HC(r);
      return (0, S.jsx)(rw, {
        value: i,
        children: (0, S.jsx)($C, {
          value: o,
          children: (0, S.jsx)(Iy.Item, { ref: n, className: zh(o.root, e), ...a }),
        }),
      });
    }),
    { Primitive: Iy.Item },
  ),
  sw = ew(iw(X.span), `label`),
  cw = tw(Iy.ItemControl, `root`),
  lw = (0, x.forwardRef)(({ unchecked: e, checked: t, ...n }, r) => {
    let { stateProps: i, checked: a } = Oy(),
      o = Y(i, { className: nw().icon }, n);
    return a
      ? (0, S.jsx)(wv, {
          ref: r,
          svg:
            t ??
            (0, S.jsx)(`svg`, {
              "aria-hidden": `true`,
              viewBox: `0 0 24 24`,
              children: (0, S.jsx)(`circle`, { cx: `12`, cy: `12`, r: `12`, fill: `currentColor` }),
            }),
          ...o,
        })
      : e
        ? (0, S.jsx)(wv, { ref: r, svg: e, ...o })
        : null;
  });
lw.displayName = `RadioGroupItemIndicator`;
var uw = Iy.ItemHiddenInput,
  dw = v_({
    Item: () => ow,
    ItemControl: () => cw,
    ItemHiddenInput: () => uw,
    ItemIndicator: () => lw,
    ItemLabel: () => sw,
    Root: () => aw,
  }),
  { withProvider: fw, withContext: pw } = sg(lS),
  { withContext: mw, withProvider: hw, useClassNames: gw } = sg(mS),
  _w = fw(Iy.Root, `root`),
  vw = pw(X.div, `header`),
  yw = hw(Iy.Label, `root`),
  bw = mw(X.span, `indicatorText`),
  xw = (0, x.forwardRef)(({ className: e, ...t }, n) => {
    let { indicatorIcon: r } = gw();
    return (0, S.jsx)(wv, {
      svg: (0, S.jsx)(`svg`, {
        viewBox: `0 0 6 6`,
        fill: `none`,
        xmlns: `http://www.w3.org/2000/svg`,
        className: zh(r, e),
        children: (0, S.jsx)(`path`, {
          d: `M3.75002 1.55859L4.41318 1.09468C4.75243 0.857361 5.21982 0.939865 5.45732 1.27899C5.69499 1.61836 5.61243 2.08615 5.27295 2.32366L4.30763 2.99902L5.27372 3.67612C5.61285 3.91381 5.69517 4.38137 5.45761 4.72059C5.21999 5.0599 4.7523 5.14233 4.41299 4.90471L3.75002 4.44043V5.25C3.75002 5.66421 3.41423 6 3.00002 6C2.5858 6 2.25002 5.66421 2.25002 5.25V4.44043L1.58704 4.90471C1.24773 5.14233 0.780041 5.0599 0.542418 4.72059C0.304856 4.38137 0.387176 3.91381 0.726309 3.67612L1.6924 2.99902L0.727079 2.32366C0.387603 2.08615 0.305043 1.61836 0.542707 1.27899C0.780206 0.939865 1.2476 0.857361 1.58685 1.09468L2.25002 1.55859V0.75C2.25002 0.335786 2.5858 0 3.00002 0C3.41423 0 3.75002 0.335786 3.75002 0.75V1.55859Z`,
          fill: `currentColor`,
        }),
      }),
      ref: n,
      ...t,
    });
  });
xw.displayName = `RadioGroupFieldRequiredIndicator`;
var Sw = pw(X.div, `footer`),
  Cw = pw(Iy.Description, `description`),
  ww = pw(Iy.ErrorMessage, `errorMessage`),
  Tw = v_({
    Description: () => Cw,
    ErrorMessage: () => ww,
    Footer: () => Sw,
    Header: () => vw,
    IndicatorText: () => bw,
    Label: () => yw,
    RequiredIndicator: () => xw,
    Root: () => _w,
  }),
  Ew = [
    [`root`, `seed-select-box__root`],
    [`trigger`, `seed-select-box__trigger`],
    [`content`, `seed-select-box__content`],
    [`body`, `seed-select-box__body`],
    [`label`, `seed-select-box__label`],
    [`description`, `seed-select-box__description`],
    [`footer`, `seed-select-box__footer`],
  ],
  Dw = { layout: `horizontal` },
  Ow = [],
  kw = { layout: [`horizontal`, `vertical`] };
function Aw(e) {
  return Object.fromEntries(Ew.map(([t, n]) => [t, Zh(n, Qh(Dw, e), Ow)]));
}
Object.assign(Aw, { splitVariantProps: (e) => $h(e, kw) });
var jw = [
    [`root`, `seed-selectBoxCheckmark__root`],
    [`icon`, `seed-selectBoxCheckmark__icon`],
  ],
  Mw = {},
  Nw = [],
  Pw = {};
function Fw(e) {
  return Object.fromEntries(jw.map(([t, n]) => [t, Zh(n, Qh(Mw, e), Nw)]));
}
Object.assign(Fw, { splitVariantProps: (e) => $h(e, Pw) });
var Iw = {},
  Lw = [],
  Rw = {};
function zw(e) {
  return Zh(`seed-select-box-group`, Qh(Iw, e), Lw);
}
Object.assign(zw, { splitVariantProps: (e) => $h(e, Rw) });
var Bw = (e) => `collapsible:${e}:content`;
function Vw(e) {
  let [t, n] = ev({ prop: e.open, defaultProp: e.defaultOpen ?? !1, onChange: e.onOpenChange });
  return (0, x.useMemo)(() => ({ open: t, setOpen: n }), [t, n]);
}
function Hw(e) {
  let { open: t, setOpen: n } = Vw(e),
    { disabled: r } = e,
    i = Bw((0, x.useId)()),
    a = (0, x.useRef)(null),
    [o, s] = (0, x.useState)(void 0),
    [c, l] = (0, x.useState)(t),
    u = !t && !c;
  Nh(() => {
    if (!a.current) return;
    let e = () => {
      a.current && s(a.current.scrollHeight);
    };
    e();
    let t = new ResizeObserver(e);
    return t.observe(a.current), () => t.disconnect();
  }, [t]),
    (0, x.useEffect)(() => {
      t && l(!0);
    }, [t]);
  let d = t ? `${o}px` : `0px`,
    f = (0, x.useMemo)(
      () => J({ "data-collapsible": ``, "data-open": q(t), "data-disabled": q(r) }),
      [t, r],
    );
  return (0, x.useMemo)(
    () => ({
      open: t,
      setOpen: n,
      disabled: r,
      stateProps: f,
      triggerAriaProps: J({ "aria-expanded": t, "aria-controls": i, "aria-disabled": r }),
      triggerHandlers: J({
        onClick: (e) => {
          e.defaultPrevented || r || n((e) => !e);
        },
      }),
      contentProps: J({
        ...f,
        id: i,
        hidden: u,
        style: { "--collapsible-content-height": o === void 0 ? void 0 : d },
        onTransitionEnd: (e) => {
          e.propertyName === `height` && (t || l(!1));
        },
      }),
      refs: { content: a },
    }),
    [t, n, r, f, i, u, o, d],
  );
}
var Uw = (0, x.createContext)(null),
  Ww = Uw.Provider;
function Gw({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(Uw);
  if (!t && e) throw Error(`useCollapsibleContext must be used within a CollapsibleRoot`);
  return t;
}
var Kw = (0, x.forwardRef)((e, t) => {
  let { open: n, defaultOpen: r, onOpenChange: i, disabled: a, ...o } = e,
    s = Hw({ open: n, defaultOpen: r, onOpenChange: i, disabled: a });
  return (0, S.jsx)(Ww, {
    value: s,
    children: (0, S.jsx)(X.div, { ref: t, ...Y(s.stateProps, o) }),
  });
});
Kw.displayName = `CollapsibleRoot`;
var qw = (0, x.forwardRef)((e, t) => {
  let n = Gw();
  return (0, S.jsx)(X.button, {
    ref: t,
    ...Y(n.stateProps, n.triggerAriaProps, n.triggerHandlers, e),
  });
});
qw.displayName = `CollapsibleTrigger`;
var Jw = (0, x.forwardRef)((e, t) => {
  let n = Gw();
  return (0, S.jsx)(X.div, { ref: bh(t, n.refs.content), ...Y(n.contentProps, e) });
});
Jw.displayName = `CollapsibleContent`;
var Yw = { __proto__: null, Content: Jw, Root: Kw, Trigger: qw },
  {
    PropsProvider: Xw,
    ClassNamesProvider: Zw,
    withContext: Qw,
    useProps: $w,
    useClassNames: eT,
  } = sg(Aw),
  tT = cg([Av]),
  nT = (0, x.createContext)(null),
  rT = (0, x.forwardRef)(({ columns: e = 1, className: t, style: n, ...r }, i) => {
    let [a, o] = zw.splitVariantProps(r),
      s = zw(a);
    return (0, S.jsx)(Xw, {
      value: { layout: e === 1 ? `horizontal` : `vertical` },
      children: (0, S.jsx)(X.div, {
        ref: i,
        "data-columns": e,
        className: zh(s, t),
        style: { ...n, "--seed-select-box-group--columns": e },
        ...o,
      }),
    });
  });
function iT({ children: e, footerVisibility: t }) {
  let { checked: n } = Av(),
    r = Hw({ open: { "when-selected": n, "when-not-selected": !n }[t] }),
    [i, a] = (0, x.useState)(!1),
    o = (0, x.useCallback)((e) => {
      a(!!e);
    }, []);
  return (0, S.jsx)(Ww, {
    value: r,
    children: (0, S.jsx)(nT.Provider, {
      value: { isFooterRendered: i, footerRef: o, footerVisibility: t },
      children: e,
    }),
  });
}
var aT = (0, x.forwardRef)(
    ({ footerVisibility: e = `when-selected`, className: t, children: n, ...r }, i) => {
      let [a, o] = Aw.splitVariantProps(r),
        s = Aw({ ...$w(), ...a });
      return (0, S.jsx)(Zw, {
        value: s,
        children: (0, S.jsx)(Pv.Root, {
          ref: i,
          className: zh(s.root, t),
          ...o,
          children: e === `always` ? n : (0, S.jsx)(iT, { footerVisibility: e, children: n }),
        }),
      });
    },
  ),
  oT = Qw(tT(X.div), `trigger`),
  sT = Qw(tT(X.div), `content`),
  cT = Qw(tT(X.div), `body`),
  lT = Qw(tT(X.div), `label`),
  uT = Qw(tT(X.div), `description`),
  { withProvider: dT, withContext: fT } = sg(Fw),
  pT = cg([Av]),
  mT = dT(Pv.Control, `root`),
  hT = fT(pT(wv), `icon`),
  gT = (0, x.forwardRef)((e, t) => {
    let n = Gw({ strict: !1 }),
      r = (0, x.useContext)(nT)?.isFooterRendered ? n?.triggerAriaProps : void 0;
    return (0, S.jsx)(Pv.HiddenInput, { ref: t, ...r, ...e });
  });
gT.displayName = `CheckSelectBoxHiddenInput`;
var _T = (0, x.forwardRef)(({ className: e, children: t, ...n }, r) => {
  let i = eT(),
    { stateProps: a } = Av(),
    o = Gw({ strict: !1 }),
    s = bh(r, (0, x.useContext)(nT)?.footerRef ?? null);
  return o
    ? (0, S.jsx)(Yw.Content, { ref: s, className: zh(i.footer, e), ...a, ...n, children: t })
    : (0, S.jsx)(X.div, { ref: s, className: zh(i.footer, e), ...a, ...n, children: t });
});
_T.displayName = `CheckSelectBoxFooter`;
var {
    PropsProvider: vT,
    ClassNamesProvider: yT,
    withContext: bT,
    useProps: xT,
    useClassNames: ST,
  } = sg(Aw),
  CT = cg([Oy]),
  wT = (0, x.createContext)(null),
  TT = (0, x.forwardRef)(({ columns: e = 1, className: t, style: n, ...r }, i) => {
    let [a, o] = zw.splitVariantProps(r),
      s = zw(a);
    return (0, S.jsx)(vT, {
      value: { layout: e === 1 ? `horizontal` : `vertical` },
      children: (0, S.jsx)(X.div, {
        ref: i,
        "data-columns": e,
        className: zh(s, t),
        style: { ...n, "--seed-select-box-group--columns": e },
        ...o,
      }),
    });
  });
function ET({ children: e, footerVisibility: t }) {
  let { checked: n } = Oy(),
    r = Hw({ open: { "when-selected": n, "when-not-selected": !n }[t] }),
    [i, a] = (0, x.useState)(!1),
    o = (0, x.useCallback)((e) => {
      a(!!e);
    }, []);
  return (0, S.jsx)(Ww, {
    value: r,
    children: (0, S.jsx)(wT.Provider, {
      value: { isFooterRendered: i, footerRef: o, footerVisibility: t },
      children: e,
    }),
  });
}
var DT = (0, x.forwardRef)(
    ({ footerVisibility: e = `when-selected`, className: t, children: n, ...r }, i) => {
      let [a, o] = Aw.splitVariantProps(r),
        s = Aw({ ...xT(), ...a });
      return (0, S.jsx)(yT, {
        value: s,
        children: (0, S.jsx)(Iy.Item, {
          ref: i,
          className: zh(s.root, t),
          ...o,
          children: e === `always` ? n : (0, S.jsx)(ET, { footerVisibility: e, children: n }),
        }),
      });
    },
  ),
  OT = bT(CT(X.div), `trigger`),
  kT = bT(CT(X.div), `content`),
  AT = bT(CT(X.div), `body`),
  jT = bT(CT(X.div), `label`),
  MT = bT(CT(X.div), `description`),
  NT = (0, x.forwardRef)((e, t) => {
    let n = Gw({ strict: !1 }),
      r = (0, x.useContext)(wT)?.isFooterRendered ? n?.triggerAriaProps : void 0;
    return (0, S.jsx)(Iy.ItemHiddenInput, { ref: t, ...r, ...e });
  });
NT.displayName = `RadioSelectBoxHiddenInput`;
var PT = (0, x.forwardRef)(({ className: e, children: t, ...n }, r) => {
  let i = ST(),
    { stateProps: a } = Oy(),
    o = Gw({ strict: !1 }),
    s = bh(r, (0, x.useContext)(wT)?.footerRef ?? null);
  return o
    ? (0, S.jsx)(Yw.Content, { ref: s, className: zh(i.footer, e), ...a, ...n, children: t })
    : (0, S.jsx)(X.div, { ref: s, className: zh(i.footer, e), ...a, ...n, children: t });
});
PT.displayName = `RadioSelectBoxFooter`;
var FT = v_({
    Body: () => cT,
    CheckmarkControl: () => mT,
    CheckmarkIcon: () => hT,
    Content: () => sT,
    Description: () => uT,
    Footer: () => _T,
    Group: () => rT,
    HiddenInput: () => gT,
    Label: () => lT,
    Root: () => aT,
    Trigger: () => oT,
  }),
  IT = v_({
    Body: () => AT,
    Content: () => kT,
    Description: () => MT,
    Footer: () => PT,
    Group: () => TT,
    HiddenInput: () => NT,
    Item: () => DT,
    Label: () => jT,
    Trigger: () => OT,
  }),
  LT = [
    [`root`, `seed-switch__root`],
    [`label`, `seed-switch__label`],
  ],
  RT = { size: 32 },
  zT = [],
  BT = { size: [`16`, `24`, `32`] };
function VT(e) {
  return Object.fromEntries(LT.map(([t, n]) => [t, Zh(n, Qh(RT, e), zT)]));
}
Object.assign(VT, { splitVariantProps: (e) => $h(e, BT) });
var HT = [
    [`root`, `seed-switchmark__root`],
    [`thumb`, `seed-switchmark__thumb`],
  ],
  UT = { tone: `brand`, size: 32 },
  WT = [],
  GT = { tone: [`neutral`, `brand`], size: [`16`, `24`, `32`] };
function KT(e) {
  return Object.fromEntries(HT.map(([t, n]) => [t, Zh(n, Qh(UT, e), WT)]));
}
Object.assign(KT, { splitVariantProps: (e) => $h(e, GT) });
var { withContext: qT, ClassNamesProvider: JT } = sg(VT),
  { withContext: YT, PropsProvider: XT, withProvider: ZT } = sg(KT),
  QT = cg([$S]),
  $T = x.forwardRef(({ className: e, ...t }, n) => {
    let [{ switch: r, switchmark: i }, a] = Cv(
        { ...t, size: t.size === `small` ? `16` : t.size === `medium` ? `32` : t.size },
        { switchmark: KT, switch: VT },
      ),
      o = VT(r);
    return (0, S.jsx)(XT, {
      value: i,
      children: (0, S.jsx)(JT, {
        value: o,
        children: (0, S.jsx)(iC.Root, { ref: n, className: zh(o.root, e), ...a }),
      }),
    });
  });
$T.displayName = `SwitchRoot`;
var eE = ZT(iC.Control, `root`),
  tE = YT(iC.Thumb, `thumb`),
  nE = qT(QT(X.span), `label`),
  rE = iC.HiddenInput,
  iE = v_({
    Control: () => eE,
    HiddenInput: () => rE,
    Label: () => nE,
    Root: () => $T,
    Thumb: () => tE,
  }),
  aE = [
    [`root`, `seed-tabs__root`],
    [`list`, `seed-tabs__list`],
    [`carousel`, `seed-tabs__carousel`],
    [`carouselCamera`, `seed-tabs__carouselCamera`],
    [`content`, `seed-tabs__content`],
    [`indicator`, `seed-tabs__indicator`],
    [`trigger`, `seed-tabs__trigger`],
  ],
  oE = { triggerLayout: `fill`, contentLayout: `hug`, size: `small`, stickyList: !1 },
  sE = [],
  cE = {
    triggerLayout: [`fill`, `hug`],
    contentLayout: [`fill`, `hug`],
    size: [`small`, `medium`],
    stickyList: [!0, !1],
  };
function lE(e) {
  return Object.fromEntries(aE.map(([t, n]) => [t, Zh(n, Qh(oE, e), sE)]));
}
Object.assign(lE, { splitVariantProps: (e) => $h(e, cE) });
var { withProvider: uE, withContext: dE } = sg(lE),
  fE = uE(Tx.Root, `root`),
  pE = dE(Tx.List, `list`),
  mE = dE(Tx.Trigger, `trigger`),
  hE = dE(Tx.Indicator, `indicator`),
  gE = dE(Tx.Content, `content`),
  _E = dE(Tx.Carousel, `carousel`),
  vE = dE(Tx.CarouselCamera, `carouselCamera`),
  yE = v_({
    Carousel: () => _E,
    CarouselCamera: () => vE,
    Content: () => gE,
    Indicator: () => hE,
    List: () => pE,
    Root: () => fE,
    Trigger: () => mE,
    carouselPreventDrag: () => ex,
  }),
  bE = { textStyle: `t5Regular`, maxLines: `none`, textDecorationLine: `none` },
  xE = [],
  SE = {
    textStyle:
      `screenTitle.articleBody.articleNote.t1Regular.t1Medium.t1Bold.t2Regular.t2Medium.t2Bold.t3Regular.t3Medium.t3Bold.t4Regular.t4Medium.t4Bold.t5Regular.t5Medium.t5Bold.t6Regular.t6Medium.t6Bold.t7Regular.t7Medium.t7Bold.t8Bold.t9Bold.t10Bold.t1StaticRegular.t1StaticMedium.t1StaticBold.t2StaticRegular.t2StaticMedium.t2StaticBold.t3StaticRegular.t3StaticMedium.t3StaticBold.t4StaticRegular.t4StaticMedium.t4StaticBold.t5StaticRegular.t5StaticMedium.t5StaticBold.t6StaticRegular.t6StaticMedium.t6StaticBold.t7StaticRegular.t7StaticMedium.t7StaticBold.t8StaticBold.t9StaticBold.t10StaticBold`.split(
        `.`,
      ),
    maxLines: [`none`, `single`, `multi`],
    textDecorationLine: [`none`, `line-through`, `underline`],
  };
function CE(e) {
  return Zh(`seed-text`, Qh(bE, e), xE);
}
Object.assign(CE, { splitVariantProps: (e) => $h(e, SE) });
function wE(e) {
  if (!e) return;
  let [t, n] = e.split(`.`);
  return hp[t]?.[n] ?? e;
}
function TE(e) {
  if (e) return dm[e] ?? void 0;
}
function EE(e) {
  if (e) return Wp[e] ?? e;
}
function DE(e) {
  if (e) return wm[e] ?? e;
}
function OE(e) {
  return e === void 0 ? `none` : e === 1 ? `single` : `multi`;
}
var kE = (0, x.forwardRef)(
  (
    {
      as: e,
      color: t,
      textStyle: n,
      fontSize: r,
      lineHeight: i,
      fontWeight: a,
      maxLines: o,
      textDecorationLine: s,
      align: c,
      userSelect: l,
      whiteSpace: u,
      children: d,
      className: f,
      style: p,
      ...m
    },
    h,
  ) =>
    (0, S.jsx)(e || `span`, {
      ref: h,
      className: zh(
        (0, x.useMemo)(
          () => CE({ textStyle: n, textDecorationLine: s, maxLines: OE(o) }),
          [n, s, o],
        ),
        f,
      ),
      style: {
        "--seed-max-lines": o,
        "--seed-text-color": wE(t),
        "--seed-font-size": EE(r),
        "--seed-line-height": DE(i ?? r),
        "--seed-font-weight": TE(a),
        "--seed-text-align": c,
        "--seed-user-select": l,
        "--seed-white-space": u,
        ...p,
      },
      ...m,
      children: d,
    }),
);
kE.displayName = `Text`;
function AE({ value: e, defaultValue: t, onValueChange: n }) {
  let [r, i] = ev({ prop: e, defaultProp: t ?? ``, onChange: n }),
    [a, o] = (0, x.useState)(!1),
    [s, c] = (0, x.useState)(!1),
    [l, u] = (0, x.useState)(!1),
    [d, f] = (0, x.useState)(!1);
  return {
    value: r,
    isHovered: a,
    isActive: s,
    isFocused: l,
    isFocusVisible: d,
    setValue: i,
    setIsHovered: o,
    setIsActive: c,
    setIsFocused: u,
    setIsFocusVisible: f,
  };
}
function jE(e) {
  let t = (0, x.useId)(),
    {
      value: n,
      defaultValue: r,
      onValueChange: i,
      disabled: a = !1,
      invalid: o = !1,
      readOnly: s = !1,
      required: c = !1,
    } = e,
    l = Tv(`selector(:focus-visible)`),
    {
      value: u,
      isHovered: d,
      isActive: f,
      isFocused: p,
      isFocusVisible: m,
      setValue: h,
      setIsHovered: g,
      setIsActive: _,
      setIsFocused: v,
      setIsFocusVisible: y,
    } = AE({ value: n, defaultValue: r, onValueChange: i }),
    b = n === void 0,
    S = J({
      "data-hover": q(d),
      "data-active": q(f),
      "data-focus": q(p),
      "data-focus-visible": q(m),
      "data-readonly": q(s),
      "data-disabled": q(a),
      "data-invalid": q(o),
      "data-empty": q(u === ``),
    });
  return {
    value: u,
    active: f,
    focused: p,
    invalid: o,
    required: c,
    setIsFocused: v,
    setIsFocusVisible: y,
    stateProps: S,
    rootProps: J({
      ...S,
      onPointerMove() {
        g(!0);
      },
      onPointerDown() {
        _(!0);
      },
      onPointerUp() {
        _(!1);
      },
      onPointerLeave() {
        g(!1), _(!1);
      },
    }),
    inputProps: Vh({
      ...S,
      ...(b && r && { defaultValue: r }),
      ...(!b && { value: u }),
      "aria-required": Bh(c),
      "aria-invalid": Bh(o),
      disabled: a,
      readOnly: s,
      name: e.name || t,
      onChange: (e) => {
        h(e.target.value), l && y(e.target.matches(`:focus-visible`));
      },
      onBlur() {
        v(!1), l && y(!1);
      },
      onFocus(e) {
        v(!0), l && y(e.target.matches(`:focus-visible`));
      },
    }),
  };
}
var ME = (0, x.createContext)(null),
  NE = ME.Provider;
function PE({ strict: e = !0 } = {}) {
  let t = (0, x.useContext)(ME);
  if (!t && e) throw Error(`useTextFieldContext must be used within a TextField`);
  return t;
}
var FE = (0, x.forwardRef)((e, t) => {
  let {
      value: n,
      defaultValue: r,
      onValueChange: i,
      readOnly: a,
      disabled: o,
      invalid: s,
      required: c,
      name: l,
      ...u
    } = e,
    d = jE({
      value: n,
      defaultValue: r,
      onValueChange: i,
      disabled: o,
      invalid: s,
      required: c,
      readOnly: a,
      name: l,
    }),
    f = Y(d.rootProps, u);
  return (0, S.jsx)(NE, { value: d, children: (0, S.jsx)(X.div, { ref: t, ...f }) });
});
FE.displayName = `TextFieldRoot`;
var IE = (0, x.forwardRef)((e, t) => {
  let { inputProps: n } = PE(),
    r = Y(n, e);
  return (0, S.jsx)(X.input, { ref: t, ...r });
});
IE.displayName = `TextFieldInput`;
var LE = (0, x.forwardRef)((e, t) => {
  let { inputProps: n } = PE(),
    r = Y(n, e);
  return (0, S.jsx)(X.textarea, { ref: t, ...r });
});
LE.displayName = `TextFieldTextarea`;
var RE = { __proto__: null, Input: IE, Root: FE, Textarea: LE },
  zE = [
    [`root`, `seed-text-input__root`],
    [`value`, `seed-text-input__value`],
    [`prefixText`, `seed-text-input__prefixText`],
    [`prefixIcon`, `seed-text-input__prefixIcon`],
    [`suffixText`, `seed-text-input__suffixText`],
    [`suffixIcon`, `seed-text-input__suffixIcon`],
  ],
  BE = { variant: `outline`, size: `large` },
  VE = [
    { variant: `outline`, size: `large` },
    { variant: `outline`, size: `medium` },
  ],
  HE = { variant: [`outline`, `underline`], size: [`large`, `medium`] };
function UE(e) {
  return Object.fromEntries(zE.map(([t, n]) => [t, Zh(n, Qh(BE, e), VE)]));
}
Object.assign(UE, { splitVariantProps: (e) => $h(e, HE) });
var { withProvider: WE, withContext: GE, useClassNames: KE } = sg(UE),
  qE = cg([{ useContext: $x, strict: !1 }]),
  JE = cg([PE, { useContext: $x, strict: !1 }]),
  YE = WE(qE(RE.Root), `root`),
  XE = GE(JE(wv), `prefixIcon`),
  ZE = GE(JE(X.span), `prefixText`),
  QE = GE(JE(wv), `suffixIcon`),
  $E = GE(JE(X.span), `suffixText`),
  eD = (0, x.forwardRef)(({ className: e, ...t }, n) => {
    let r = KE(),
      i = PE(),
      a = $x({ strict: !1 }),
      o = Y(
        a ? a.stateProps : {},
        a ? a.inputAriaAttributes : {},
        i.inputProps,
        a ? a.inputProps : {},
        t,
      );
    return (
      !a &&
        !t[`aria-label`] &&
        !t[`aria-labelledby`] &&
        console.warn(
          "TextFieldInput: Please provide `aria-label` or `aria-labelledby` for accessibility, or put `TextFieldInput` inside a `Field` where a `FieldLabel` is provided.",
        ),
      (0, S.jsx)(RE.Input, { ref: n, ...o, className: zh(r.value, e) })
    );
  });
eD.displayName = `TextFieldInput`;
var tD = (0, x.forwardRef)(({ className: e, autoresize: t = !0, ...n }, r) => {
  let i = KE(),
    a = PE(),
    o = $x({ strict: !1 }),
    s = Y(
      o ? o.stateProps : {},
      o ? o.inputAriaAttributes : {},
      a.inputProps,
      o ? o.inputProps : {},
      n,
    );
  !o &&
    !n[`aria-label`] &&
    !n[`aria-labelledby`] &&
    console.warn(
      "TextFieldTextarea: Please provide `aria-label` or `aria-labelledby` for accessibility, or put `TextFieldTextarea` inside a `Field` where a `FieldLabel` is provided.",
    );
  let c = (0, x.useRef)(null),
    l = (0, x.useCallback)(() => {
      if (!c.current || n.style?.height || !t) return;
      let e = c.current,
        r = e.style.alignSelf,
        i = e.style.overflow;
      `MozAppearance` in e.style || (e.style.overflow = `hidden`),
        (e.style.alignSelf = `start`),
        (e.style.height = `auto`),
        (e.style.height = `${e.scrollHeight + (e.offsetHeight - e.clientHeight)}px`),
        (e.style.overflow = i),
        (e.style.alignSelf = r);
    }, [c, n.style?.height, t]);
  return (
    Nh(() => {
      c.current && l();
    }, [l, a.value, c]),
    (0, S.jsx)(RE.Textarea, { ref: bh(c, r), ...s, className: zh(i.value, e) })
  );
});
tD.displayName = `TextFieldTextarea`;
function nD(e) {
  let t = new Map();
  return (n) => {
    if (t.has(n)) return t.get(n);
    let r = e(n);
    return t.set(n, r), r;
  };
}
function rD(e, t = ``) {
  let n = [],
    r = e.split(`,`).map((e) => (e ? parseInt(e, 36) : 0)),
    i = 0;
  for (let e = 0; e < r.length; e++)
    e % 2 ? n.push([i, i + r[e], t ? parseInt(t[e >> 1], 36) : 0]) : (i = r[e]);
  return n;
}
function iD(e, t, n = 0, r = t.length - 1) {
  for (; n <= r; ) {
    let i = (n + r) >>> 1,
      a = t[i];
    if (e < a[0]) r = i - 1;
    else if (e > a[1]) n = i + 1;
    else return i;
  }
  return -1;
}
var aD = rD(
    `,9,a,,b,1,d,,e,h,3j,w,4p,,4t,,4u,,lc,33,w3,6,13l,18,14v,,14x,1,150,1,153,,16o,5,174,a,17g,,18r,k,19s,,1cm,6,1ct,,1cv,5,1d3,1,1d6,3,1e7,,1e9,,1f4,q,1ie,a,1kb,8,1kt,,1li,3,1ln,8,1lx,2,1m1,4,1nd,2,1ow,1,1p3,8,1qi,n,1r6,,1r7,v,1s3,,1tm,,1tn,,1to,,1tq,2,1tt,7,1u1,3,1u5,,1u6,1,1u9,6,1uq,1,1vl,,1vm,1,1x8,,1xa,,1xb,1,1xd,3,1xj,1,1xn,1,1xp,,1xz,,1ya,1,1z2,,1z5,1,1z7,,20s,,20u,2,20x,1,213,1,217,2,21d,,228,1,22d,,22p,1,22r,,24c,,24e,2,24h,4,24n,1,24p,,24r,1,24t,,25e,1,262,5,269,,26a,1,27w,,27y,1,280,,281,3,287,1,28b,1,28d,,28l,2,28y,1,29u,,2bi,,2bj,,2bk,,2bl,1,2bq,2,2bu,2,2bx,,2c7,,2dc,,2dd,2,2dg,,2f0,,2f2,2,2f5,3,2fa,2,2fe,3,2fp,1,2g2,1,2gx,,2gy,1,2ik,,2im,,2in,1,2ip,,2iq,,2ir,1,2iu,2,2iy,3,2j9,1,2jm,1,2k3,,2kg,1,2ki,1,2m3,1,2m6,,2m7,1,2m9,3,2me,2,2mi,2,2ml,,2mm,,2mv,,2n6,1,2o1,,2o2,1,2q2,,2q7,,2q8,1,2qa,2,2qe,,2qg,6,2qn,,2r6,1,2sx,,2sz,,2t0,6,2tj,7,2wh,,2wj,,2wk,8,2x4,6,2zc,1,305,,307,,309,,30e,1,31t,d,327,,328,4,32e,1,32l,a,32x,z,346,,371,3,375,,376,5,37d,1,37f,1,37h,1,386,1,388,1,38e,2,38x,3,39e,,39g,,39h,1,39p,,3a5,,3cw,2n,3fk,1z,3hk,2f,3tp,2,4k2,3,4ky,2,4lu,1,4mq,1,4ok,1,4om,,4on,6,4ou,7,4p2,,4p3,1,4p5,a,4pp,,4qz,2,4r2,,4r3,,4ud,1,4vd,,4yo,2,4yr,3,4yv,1,4yx,2,4z4,1,4z6,,4z7,5,4zd,2,55j,1,55l,1,55n,,579,,57a,,57b,,57c,6,57k,,57m,,57p,7,57x,5,583,9,58f,,59s,u,5c0,3,5c4,,5dg,9,5dq,3,5du,2,5ez,8,5fk,1,5fm,,5gh,,5gi,3,5gm,1,5go,5,5ie,,5if,,5ig,1,5ii,2,5il,,5im,,5in,4,5k4,7,5kc,7,5kk,1,5km,1,5ow,2,5p0,c,5pd,,5pe,6,5pp,,5pw,,5pz,,5q0,1,5vk,1r,6bv,,6bw,,6bx,,6by,1,6co,6,6d8,,6dl,,6e8,f,6hc,w,6jm,,6k9,,6ms,5,6nd,1,6xm,1,6y0,,70o,,72n,,73d,a,73s,2,79e,,7fu,1,7g6,,7gg,,7i3,3,7i8,5,7if,b,7is,35,7m8,39,7pk,a,7pw,,7py,,7q5,,7q9,,7qg,,7qr,1,7r8,,7rb,,7rg,,7ri,,7rn,2,7rr,,7s3,4,7th,2,7tt,,7u8,,7un,,850,1,8hx,2,8ij,1,8k0,,8k5,,8vj,2,8zj,,928,v,wvj,3,wvo,9,wwu,1,wz4,1,x6q,,x6u,,x6z,,x7n,1,x7p,1,x7r,,x7w,,xa8,1,xbo,f,xc4,1,xcw,h,xdr,,xeu,7,xfr,a,xg2,,xg3,,xgg,s,xhc,2,xhf,,xir,,xis,1,xiu,3,xiy,1,xj0,1,xj2,1,xj4,,xk5,,xm1,5,xm7,1,xm9,1,xmb,1,xmd,1,xmr,,xn0,,xn1,,xoc,,xps,,xpu,2,xpz,1,xq6,1,xq9,,xrf,,xrg,1,xri,1,xrp,,xrq,,xyb,1,xyd,,xye,1,xyg,,xyh,1,xyk,,xyl,,1e68,f,1e74,f,1edb,,1ehq,1,1ek0,b,1eyl,,1f4w,,1f92,4,1gjl,2,1gjp,1,1gjw,3,1gl4,2,1glb,,1gpx,1,1h5w,3,1h7t,4,1hgr,1,1hj0,3,1hl2,a,1hmq,3,1hq8,,1hq9,,1hqa,,1hrs,e,1htc,,1htf,1,1htr,2,1htu,,1hv4,2,1hv7,3,1hvb,1,1hvd,1,1hvh,,1hvm,,1hvx,,1hxc,2,1hyf,4,1hyk,,1hyl,7,1hz9,1,1i0j,,1i0w,1,1i0y,,1i2b,2,1i2e,8,1i2n,,1i2o,,1i2q,1,1i2x,3,1i32,,1i33,,1i5o,2,1i5r,2,1i5u,1,1i5w,3,1i66,,1i69,,1ian,,1iao,2,1iar,7,1ibk,1,1ibm,1,1id7,1,1ida,,1idb,,1idc,,1idd,3,1idj,1,1idn,1,1idp,,1idz,,1iea,1,1iee,6,1ieo,4,1igo,,1igp,1,1igr,5,1igy,,1ih1,,1ih3,2,1ih6,,1ih8,1,1iha,2,1ihd,,1ihe,,1iht,1,1ik5,2,1ik8,7,1ikg,1,1iki,2,1ikl,,1ikm,,1ila,,1ink,,1inl,1,1inn,5,1int,,1inu,,1inv,1,1inx,,1iny,,1inz,1,1io1,,1io2,1,1iun,,1iuo,1,1iuq,3,1iuw,3,1iv0,1,1iv2,,1iv3,1,1ivw,1,1iy8,2,1iyb,7,1iyj,1,1iyl,,1iym,,1iyn,1,1j1n,,1j1o,,1j1p,,1j1q,1,1j1s,7,1j4t,,1j4u,,1j4v,,1j4y,3,1j52,,1j53,4,1jcc,2,1jcf,8,1jco,,1jcp,1,1jjk,,1jjl,4,1jjr,1,1jjv,3,1jjz,,1jk0,,1jk1,,1jk2,,1jk3,,1jo1,2,1jo4,3,1joa,1,1joc,3,1jog,,1jok,,1jpd,9,1jqr,5,1jqx,,1jqy,,1jqz,3,1jrb,,1jrl,5,1jrr,1,1jrt,2,1jt0,5,1jt6,c,1jtj,,1jtk,1,1k4v,,1k4w,6,1k54,5,1k5a,,1k5b,,1k7m,l,1k89,,1k8a,6,1k8h,,1k8i,1,1k8k,,1k8l,1,1kc1,5,1kca,,1kcc,1,1kcf,6,1kcm,,1kcn,,1kei,4,1keo,1,1ker,1,1ket,,1keu,,1kev,,1koj,1,1kol,1,1kow,1,1koy,,1koz,,1kqc,1,1kqe,4,1kqm,1,1kqo,2,1kre,,1ovk,f,1ow0,,1ow7,e,1xr2,b,1xre,2,1xrh,2,1zow,4,1zqo,6,206b,,206f,3,20jz,,20k1,1i,20lr,3,20o4,,20og,1,2ftp,1,2fts,3,2jgg,19,2jhs,m,2jxh,4,2jxp,5,2jxv,7,2jy3,7,2jyd,6,2jze,3,2k3m,2,2lmo,1i,2lob,1d,2lpx,,2lqc,,2lqz,4,2lr5,e,2mtc,6,2mtk,g,2mu3,6,2mub,1,2mue,4,2mxb,,2n1s,6,2nce,,2ne4,3,2nsc,3,2nzi,1,2ok0,6,2on8,6,2pz4,73,2q6l,2,2q7j,,2q98,5,2q9q,1,2qa6,,2qa9,9,2qb1,1k,2qcm,p,2qdd,e,2qe2,,2qen,,2qeq,8,2qf0,3,2qfd,c1,2qrf,4,2qrk,8t,2r0m,7d,2r9c,3j,2rg4,b,2rit,16,2rkc,3,2rm0,7,2rmi,5,2rns,7,2rou,29,2rrg,1a,2rss,9,2rt3,c8,2scg,sd,jny8,v,jnz4,2n,jo1s,3j,jo5c,6n,joc0,2rz`,
    `262122424333333393233393339333333333393393b3b3b3b3b333b33b3bb33333b3b3333333b3b33bb3333b33b3bb33333b3bbb333b333b33333b3b3b3b3333b3b33b3bb39333b33b33b3b3b333b333333b3b333333b33b3b3333b3335dc333333b3b3b33323333b3bb3b33b3b3b3333b3333b3b333bb3b33b3b3b3b3b333b333b3323e2244234444444444444444444444444444444444444444443333333333b3b3bb33333b353b3b3b3b333b3b333b333333b3bb3b3b3bb333232333333333333333b3b3333bb3b393933b3b33bb3b393b3b3b3333b33b33b3bbb33b333b3333bb3933b3b3b333b3b3b3b3b33b3b3b33b3b3b33b3b33b33b3b3b33bb39b9b3b33b3b33b9333b393b3b33b33b3b3b3333393b3b3b33b39bb3b332333b333dd3b33332333323333333333333333333333344444444a44444434444444444444423232`,
  ),
  oD = rD(
    `1sl,10,1ug,7,1vc,7,1w5,j,1wq,6,1wy,,1x2,3,1y4,1,1y7,,1yo,1,239,j,23u,6,242,1,245,4,261,,26t,j,27e,6,27m,1,27p,4,28s,1,28v,,29d,,2dx,j,2ei,f,2fs,2,2l1,11`,
  ),
  sD = 65535;
function* cD(e) {
  let t = e.codePointAt(0);
  if (t == null) return;
  let n = t <= sD ? 1 : 2,
    r = e.length,
    i = _D(t),
    a = null,
    o = 0,
    s = !1,
    c = !1,
    l = !1,
    u = !1,
    d = 0,
    f = i,
    p = t;
  for (; n < r; )
    (t = e.codePointAt(n)),
      (a = _D(t)),
      i === 10
        ? o++
        : ((o = 0), a === 14 && (i === 3 || i === 4) ? (s = !0) : a === 0 && (u = c && l && vD(t))),
      bD(i, a, o, s, u)
        ? (yield { segment: e.slice(d, n), index: d, input: e, _hd: p, _catBegin: f, _catEnd: i },
          (s = !1),
          (u = !1),
          (d = n),
          (f = a),
          (p = t))
        : t >= 2325 &&
          (!c && i === 0 && (c = vD(p)), c && a === 3 ? (l = yD(t)) : a === 0 && (l = !1)),
      (n += t <= sD ? 1 : 2),
      (i = a);
  d < r && (yield { segment: e.slice(d), index: d, input: e, _hd: p, _catBegin: f, _catEnd: i });
}
function* lD(e) {
  for (let t of cD(e)) yield t.segment;
}
var uD = new Uint8Array(6080),
  dD = 128,
  fD = 12287,
  pD = new Uint8Array(1536),
  mD = 40960,
  hD = 44031,
  gD = (() => {
    let e = 0;
    for (;;) {
      let [t, n, r] = aD[e];
      if (t > hD) break;
      if ((e++, !(n < dD || (t > fD && n < mD))))
        for (let e = t; e <= n; e++) {
          let t,
            n = 0;
          e <= fD ? ((t = uD), (n = (e - dD) >> 1)) : ((t = pD), (n = (e - mD) >> 1)),
            (t[n] = e & 1 ? (t[n] & 15) | (r << 4) : (t[n] & 240) | r);
        }
    }
    return e;
  })();
function _D(e) {
  if (e < dD) return e >= 32 ? 0 : e === 10 ? 6 : e === 13 ? 1 : 2;
  if (e <= fD) {
    let t = uD[(e - dD) >> 1];
    return e & 1 ? t >> 4 : t & 15;
  }
  if (e < mD)
    return e < 12336
      ? e >= 12330
        ? 3
        : 0
      : e < 12443
        ? e === 12336 || e === 12349
          ? 4
          : e >= 12441
            ? 3
            : 0
        : e === 12951 || e === 12953
          ? 4
          : 0;
  if (e <= hD) {
    let t = pD[(e - mD) >> 1];
    return e & 1 ? t >> 4 : t & 15;
  }
  if (e <= 55203) return (e - 44032) % 28 == 0 ? 7 : 8;
  if (e <= 55295) return e <= 55238 ? (e >= 55216 ? 13 : 0) : e >= 55243 ? 12 : 0;
  if (e < 65024) return e === 64286 ? 3 : 0;
  let t = iD(e, aD, gD);
  return t < 0 ? 0 : aD[t][2];
}
function vD(e) {
  return iD(e, oD) >= 0;
}
function yD(e) {
  return e === 2381 || e === 2509 || e === 2765 || e === 2893 || e === 3149 || e === 3405;
}
function bD(e, t, n, r, i) {
  return e === 1 && t === 6
    ? !1
    : e === 1 || e === 2 || e === 6 || t === 1 || t === 2 || t === 6
      ? !0
      : t === 3 || t === 14 || t === 11
        ? !1
        : e === 5
          ? !(t === 5 || t === 7 || t === 8 || t === 13)
          : ((e === 7 || e === 13) && (t === 13 || t === 12)) ||
              ((e === 8 || e === 12) && t === 12) ||
              e === 9 ||
              (t === 0 && i)
            ? !1
            : e === 14 && t === 4
              ? !r
              : e === 10 && t === 10
                ? n % 2 == 0
                : !0;
}
var xD = nD((e) => Array.from(lD(e)));
function SD({ maxGraphemeCount: e, value: t, defaultValue: n = ``, onValueChange: r }) {
  let [i, a] = (0, x.useState)(n),
    o = t !== void 0,
    s = o ? t : i,
    c = (0, x.useMemo)(() => xD(s), [s]);
  return {
    textFieldRootProps: {
      value: s,
      onValueChange: (0, x.useCallback)(
        (t) => {
          let n = xD(t),
            i = e === void 0 ? n : n.slice(0, e),
            s = i.join(``);
          o || a(t), r?.({ value: t, graphemes: n, slicedValue: s, slicedGraphemes: i });
        },
        [o, e, r],
      ),
    },
    counterProps: { current: c.length, max: e ?? 0 },
    graphemes: c,
  };
}
var CD = v_({
    Input: () => eD,
    PrefixIcon: () => XE,
    PrefixText: () => ZE,
    Root: () => YE,
    SuffixIcon: () => QE,
    SuffixText: () => $E,
    Textarea: () => tD,
  }),
  wD = (0, x.forwardRef)((e, t) => {
    let { style: n, ...r } = e;
    return (0, S.jsx)(X.div, { ref: t, style: { ...Gh, ...n }, ...r });
  }),
  TD = ({ props: e, children: t }) => (0, S.jsx)(y_, { ...e, children: t }),
  ED = ({ props: e, children: t }) => (0, S.jsx)(qS, { ...e, children: t }),
  DD = ({ props: e, children: t }) => (0, S.jsx)(JS, { ...e, children: t }),
  OD = ({ props: e, children: t }) => (0, S.jsx)(kE, { ...e, children: t }),
  kD = x.forwardRef((e, t) =>
    (0, S.jsxs)(LC.Root, {
      ref: t,
      ...e,
      children: [(0, S.jsx)(LC.Track, {}), (0, S.jsx)(LC.Range, {})],
    }),
  );
kD.displayName = `ProgressCircle`;
var AD = x.forwardRef(
  ({ children: e, indicator: t = (0, S.jsx)(kD, { size: `inherit`, tone: `inherit` }), ...n }, r) =>
    (0, S.jsx)(aC, { ref: r, indicator: t, ...n, children: e }),
);
AD.displayName = `LoadingIndicator`;
var jD = x.forwardRef(({ loading: e = !1, children: t, ...n }, r) =>
  (0, S.jsx)(ag, {
    ref: r,
    loading: e,
    ...n,
    children: e && !n.asChild ? (0, S.jsx)(AD, { children: t }) : t,
  }),
);
jD.displayName = `ActionButton`;
var MD = ({ props: e, children: t }) => (0, S.jsx)(jD, { ...e, children: t }),
  ND = (0, x.forwardRef)(({ size: e = 24, ...t }, n) =>
    (0, S.jsx)(`svg`, {
      viewBox: `0 0 24 24`,
      fill: `none`,
      xmlns: `http://www.w3.org/2000/svg`,
      "data-seed-icon": `true`,
      width: e,
      height: e,
      ref: n,
      ...t,
      children: (0, S.jsx)(`g`, {
        children: (0, S.jsx)(`path`, {
          fillRule: `evenodd`,
          clipRule: `evenodd`,
          d: `M8.27589 2.76052C7.89499 3.16043 7.9104 3.79341 8.31032 4.17431L16.55 12.0222L8.31037 19.8689C7.91042 20.2498 7.89496 20.8827 8.27584 21.2827C8.65671 21.6826 9.28969 21.6981 9.68963 21.3172L18.6896 12.7464C18.8878 12.5576 19 12.2959 19 12.0222C19 11.7486 18.8879 11.4868 18.6897 11.2981L9.68968 2.72608C9.28976 2.34518 8.65679 2.3606 8.27589 2.76052Z`,
          fill: `currentColor`,
        }),
      }),
    }),
  ),
  PD = (0, x.forwardRef)(({ size: e = 24, ...t }, n) =>
    (0, S.jsx)(`svg`, {
      viewBox: `0 0 24 24`,
      fill: `none`,
      xmlns: `http://www.w3.org/2000/svg`,
      "data-seed-icon": `true`,
      width: e,
      height: e,
      ref: n,
      ...t,
      children: (0, S.jsx)(`g`, {
        children: (0, S.jsx)(`path`, {
          d: `M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711Z`,
          fill: `currentColor`,
        }),
      }),
    }),
  ),
  FD = (0, x.forwardRef)(({ size: e = 24, ...t }, n) =>
    (0, S.jsx)(`svg`, {
      viewBox: `0 0 24 24`,
      fill: `none`,
      xmlns: `http://www.w3.org/2000/svg`,
      "data-seed-icon": `true`,
      width: e,
      height: e,
      ref: n,
      ...t,
      children: (0, S.jsx)(`g`, {
        children: (0, S.jsx)(`path`, {
          fillRule: `evenodd`,
          clipRule: `evenodd`,
          d: `M12 1C5.93 1 1 5.92 1 12C1 18.08 5.93 23 12 23C18.07 23 23 18.08 23 12C23 5.92 18.07 1 12 1ZM11 6.93C11 6.38 11.45 5.93 12 5.93C12.55 5.93 13 6.38 13 6.93V12.43C13 12.98 12.55 13.43 12 13.43C11.45 13.43 11 12.98 11 12.43V6.93ZM12 17.68C11.31 17.68 10.75 17.12 10.75 16.43C10.75 15.74 11.31 15.18 12 15.18C12.69 15.18 13.25 15.74 13.25 16.43C13.25 17.12 12.69 17.68 12 17.68Z`,
          fill: `currentColor`,
        }),
      }),
    }),
  ),
  ID = (0, x.forwardRef)(({ size: e = 24, ...t }, n) =>
    (0, S.jsx)(`svg`, {
      viewBox: `0 0 24 24`,
      fill: `none`,
      xmlns: `http://www.w3.org/2000/svg`,
      "data-seed-icon": `true`,
      width: e,
      height: e,
      ref: n,
      ...t,
      children: (0, S.jsx)(`g`, {
        children: (0, S.jsx)(`path`, {
          d: `M4.00005 10.2998C3.06116 10.2998 2.30005 11.0609 2.30005 11.9998C2.30005 12.9387 3.06116 13.6998 4.00005 13.6998H20C20.9389 13.6998 21.7 12.9387 21.7 11.9998C21.7 11.0609 20.9389 10.2998 20 10.2998H4.00005Z`,
          fill: `currentColor`,
        }),
      }),
    }),
  ),
  LD = (0, x.forwardRef)(({ size: e = 24, ...t }, n) =>
    (0, S.jsx)(`svg`, {
      viewBox: `0 0 24 24`,
      fill: `none`,
      xmlns: `http://www.w3.org/2000/svg`,
      "data-seed-icon": `true`,
      width: e,
      height: e,
      ref: n,
      ...t,
      children: (0, S.jsx)(`g`, {
        children: (0, S.jsx)(`path`, {
          d: `M22.5517 3.16422C21.8141 2.5834 20.7452 2.71054 20.1644 3.4482L9.56331 16.9118L3.72729 10.8235C3.07759 10.1457 2.00145 10.1229 1.32367 10.7726C0.645881 11.4223 0.623111 12.4985 1.27281 13.1763L8.462 20.6763C8.80254 21.0315 9.28032 21.2218 9.77186 21.1979C10.2634 21.174 10.7205 20.9382 11.0249 20.5516L22.8357 5.55155C23.4165 4.81389 23.2894 3.74505 22.5517 3.16422Z`,
          fill: `currentColor`,
        }),
      }),
    }),
  ),
  RD = x.forwardRef(
    (
      {
        prefix: e,
        prefixIcon: t,
        suffix: n,
        suffixIcon: r,
        label: i,
        labelWeight: a,
        indicator: o,
        description: s,
        errorMessage: c,
        hideCharacterCount: l,
        children: u,
        required: d,
        disabled: f,
        invalid: p,
        readOnly: m,
        name: h,
        showRequiredIndicator: g,
        value: _,
        onValueChange: v,
        maxGraphemeCount: y,
        fieldRef: b,
        ...x
      },
      C,
    ) => {
      let { textFieldRootProps: w, counterProps: ee } = SD({
          value: _,
          onValueChange: v,
          maxGraphemeCount: y,
        }),
        T = i || o,
        te = !!s,
        E = c && p,
        ne = !l && y !== void 0,
        re = te || E || ne;
      return (0, S.jsxs)(jS.Root, {
        required: d,
        disabled: f,
        invalid: p,
        readOnly: m,
        name: h,
        ref: b,
        children: [
          T &&
            (0, S.jsx)(jS.Header, {
              children: (0, S.jsxs)(jS.Label, {
                weight: a,
                children: [
                  i,
                  g && (0, S.jsx)(jS.RequiredIndicator, {}),
                  o && (0, S.jsx)(jS.IndicatorText, { children: o }),
                ],
              }),
            }),
          (0, S.jsxs)(CD.Root, {
            ref: C,
            ...x,
            ...w,
            children: [
              t && (0, S.jsx)(CD.PrefixIcon, { svg: t }),
              e && (0, S.jsx)(CD.PrefixText, { children: e }),
              u,
              n && (0, S.jsx)(CD.SuffixText, { children: n }),
              r && (0, S.jsx)(CD.SuffixIcon, { svg: r }),
            ],
          }),
          re &&
            (0, S.jsxs)(jS.Footer, {
              children: [
                te &&
                  (E
                    ? (0, S.jsx)(wD, {
                        asChild: !0,
                        children: (0, S.jsx)(jS.Description, { children: s }),
                      })
                    : (0, S.jsx)(jS.Description, { children: s })),
                E &&
                  (0, S.jsxs)(jS.ErrorMessage, {
                    children: [(0, S.jsx)(Ph, { svg: (0, S.jsx)(FD, {}) }), c],
                  }),
                ne && (0, S.jsx)(jS.CharacterCount, { ...ee }),
              ],
            }),
        ],
      });
    },
  );
RD.displayName = `TextField`;
var zD = CD.Input,
  BD = CD.Textarea,
  VD = ({ props: e, children: t }) => (0, S.jsx)(RD, { ...e, children: t }),
  HD = ({ props: e }) => (0, S.jsx)(zD, { ...e }),
  UD = ({ props: e }) => (0, S.jsx)(BD, { ...e }),
  WD = x.forwardRef(
    (
      {
        label: e,
        labelWeight: t,
        indicator: n,
        showRequiredIndicator: r,
        description: i,
        errorMessage: a,
        children: o,
        ...s
      },
      c,
    ) => {
      let [l, u] = Jv.splitVariantProps(s);
      return (0, S.jsxs)(GS.Root, {
        ref: c,
        ...u,
        children: [
          (e || n) &&
            (0, S.jsx)(GS.Header, {
              children: (0, S.jsxs)(GS.Label, {
                weight: t,
                children: [
                  e,
                  r && (0, S.jsx)(GS.RequiredIndicator, {}),
                  n && (0, S.jsx)(GS.IndicatorText, { children: n }),
                ],
              }),
            }),
          (0, S.jsx)(cy.Group, { ...l, children: o }),
          (i || a) &&
            (0, S.jsxs)(GS.Footer, {
              children: [
                i &&
                  (a
                    ? (0, S.jsx)(wD, {
                        asChild: !0,
                        children: (0, S.jsx)(GS.Description, { children: i }),
                      })
                    : (0, S.jsx)(GS.Description, { children: i })),
                a &&
                  (0, S.jsxs)(GS.ErrorMessage, {
                    children: [(0, S.jsx)(Ph, { svg: (0, S.jsx)(FD, {}) }), a],
                  }),
              ],
            }),
        ],
      });
    },
  );
WD.displayName = `CheckboxGroup`;
var GD = x.forwardRef(({ inputProps: e, rootRef: t, label: n, ...r }, i) =>
  (0, S.jsxs)(cy.Root, {
    ref: t,
    ...r,
    children: [
      (0, S.jsx)(cy.Control, {
        children: (0, S.jsx)(cy.Indicator, {
          unchecked: r.variant === `ghost` ? (0, S.jsx)(LD, {}) : null,
          checked: (0, S.jsx)(LD, {}),
          indeterminate: (0, S.jsx)(ID, {}),
        }),
      }),
      (0, S.jsx)(cy.Label, { children: n }),
      (0, S.jsx)(cy.HiddenInput, { ref: i, ...e }),
    ],
  }),
);
GD.displayName = `Checkbox`;
var KD = x.forwardRef((e, t) =>
  (0, S.jsx)(cy.Control, {
    ref: t,
    ...e,
    children: (0, S.jsx)(cy.Indicator, {
      unchecked: e.variant === `ghost` ? (0, S.jsx)(LD, {}) : null,
      checked: (0, S.jsx)(LD, {}),
      indeterminate: (0, S.jsx)(ID, {}),
    }),
  }),
);
KD.displayName = `Checkmark`;
var qD = ({ props: e, children: t }) => (0, S.jsx)(WD, { ...e, children: t }),
  JD = ({ props: e }) => (0, S.jsx)(GD, { ...e }),
  YD = x.forwardRef(({ inputProps: e, rootRef: t, label: n, ...r }, i) =>
    (0, S.jsxs)(iE.Root, {
      ref: t,
      ...r,
      children: [
        (0, S.jsx)(iE.Control, { children: (0, S.jsx)(iE.Thumb, {}) }),
        n && (0, S.jsx)(iE.Label, { children: n }),
        (0, S.jsx)(iE.HiddenInput, { ref: i, ...e }),
      ],
    }),
  );
YD.displayName = `Switch`;
var XD = x.forwardRef((e, t) =>
  (0, S.jsx)(iE.Control, { ref: t, ...e, children: (0, S.jsx)(iE.Thumb, {}) }),
);
XD.displayName = `Switchmark`;
var ZD = ({ props: e }) => (0, S.jsx)(YD, { ...e }),
  QD = x.forwardRef(
    (
      {
        label: e,
        labelWeight: t,
        indicator: n,
        showRequiredIndicator: r,
        description: i,
        errorMessage: a,
        children: o,
        ...s
      },
      c,
    ) => {
      let [l, u] = KC.splitVariantProps(s),
        d = a && u.invalid,
        f = i || d;
      return (0, S.jsxs)(Tw.Root, {
        ref: c,
        ...u,
        children: [
          (e || n) &&
            (0, S.jsx)(Tw.Header, {
              children: (0, S.jsxs)(Tw.Label, {
                weight: t,
                children: [
                  e,
                  r && (0, S.jsx)(Tw.RequiredIndicator, {}),
                  n && (0, S.jsx)(Tw.IndicatorText, { children: n }),
                ],
              }),
            }),
          (0, S.jsx)(dw.Root, { ...l, children: o }),
          f &&
            (0, S.jsxs)(Tw.Footer, {
              children: [
                i &&
                  (d
                    ? (0, S.jsx)(wD, {
                        asChild: !0,
                        children: (0, S.jsx)(Tw.Description, { children: i }),
                      })
                    : (0, S.jsx)(Tw.Description, { children: i })),
                d &&
                  (0, S.jsxs)(Tw.ErrorMessage, {
                    children: [(0, S.jsx)(Ph, { svg: (0, S.jsx)(FD, {}) }), a],
                  }),
              ],
            }),
        ],
      });
    },
  );
QD.displayName = `RadioGroup`;
var $D = x.forwardRef(({ label: e, inputProps: t, rootRef: n, ...r }, i) =>
  (0, S.jsxs)(dw.Item, {
    ref: n,
    ...r,
    children: [
      (0, S.jsx)(dw.ItemControl, {
        children: (0, S.jsx)(dw.ItemIndicator, {
          checked: (0, S.jsx)(`svg`, {
            "aria-hidden": `true`,
            viewBox: `0 0 24 24`,
            children: (0, S.jsx)(`circle`, { cx: `12`, cy: `12`, r: `12`, fill: `currentColor` }),
          }),
        }),
      }),
      e && (0, S.jsx)(dw.ItemLabel, { children: e }),
      (0, S.jsx)(dw.ItemHiddenInput, { ref: i, ...t }),
    ],
  }),
);
$D.displayName = `RadioGroupItem`;
var eO = x.forwardRef((e, t) =>
  (0, S.jsx)(dw.ItemControl, {
    ref: t,
    ...e,
    children: (0, S.jsx)(dw.ItemIndicator, {
      checked: (0, S.jsx)(`svg`, {
        "aria-hidden": `true`,
        viewBox: `0 0 24 24`,
        children: (0, S.jsx)(`circle`, { cx: `12`, cy: `12`, r: `12`, fill: `currentColor` }),
      }),
    }),
  }),
);
eO.displayName = `Radiomark`;
var tO = ({ props: e, children: t }) => (0, S.jsx)(QD, { ...e, children: t }),
  nO = ({ props: e }) => (0, S.jsx)($D, { ...e }),
  rO = x.forwardRef(
    (
      {
        label: e,
        labelWeight: t,
        indicator: n,
        showRequiredIndicator: r,
        description: i,
        errorMessage: a,
        columns: o = 1,
        children: s,
        ...c
      },
      l,
    ) => {
      let [u, d] = zw.splitVariantProps(c),
        f = a && d.invalid,
        p = i || f;
      return (0, S.jsxs)(Tw.Root, {
        ref: l,
        ...d,
        children: [
          (e || n) &&
            (0, S.jsx)(Tw.Header, {
              children: (0, S.jsxs)(Tw.Label, {
                weight: t,
                children: [
                  e,
                  r && (0, S.jsx)(Tw.RequiredIndicator, {}),
                  n && (0, S.jsx)(Tw.IndicatorText, { children: n }),
                ],
              }),
            }),
          (0, S.jsx)(IT.Group, { ...u, columns: o, children: s }),
          p &&
            (0, S.jsxs)(Tw.Footer, {
              children: [
                i &&
                  (f
                    ? (0, S.jsx)(wD, {
                        asChild: !0,
                        children: (0, S.jsx)(Tw.Description, { children: i }),
                      })
                    : (0, S.jsx)(Tw.Description, { children: i })),
                f &&
                  (0, S.jsxs)(Tw.ErrorMessage, {
                    children: [(0, S.jsx)(Ph, { svg: (0, S.jsx)(FD, {}) }), a],
                  }),
              ],
            }),
        ],
      });
    },
  );
rO.displayName = `RadioSelectBoxRoot`;
var iO = x.forwardRef(
  (
    {
      label: e,
      description: t,
      prefixIcon: n,
      suffix: r,
      inputProps: i,
      rootRef: a,
      footer: o,
      ...s
    },
    c,
  ) =>
    (0, S.jsxs)(IT.Item, {
      ref: a,
      ...s,
      children: [
        (0, S.jsxs)(IT.Trigger, {
          children: [
            (0, S.jsx)(IT.HiddenInput, { ref: c, ...i }),
            (0, S.jsxs)(IT.Content, {
              children: [
                n && (0, S.jsx)(Ph, { svg: n }),
                (0, S.jsxs)(IT.Body, {
                  children: [
                    (0, S.jsx)(IT.Label, { children: e }),
                    t && (0, S.jsx)(IT.Description, { children: t }),
                  ],
                }),
              ],
            }),
            r,
          ],
        }),
        o && (0, S.jsx)(IT.Footer, { children: o }),
      ],
    }),
);
iO.displayName = `RadioSelectBoxItem`;
var aO = x.forwardRef((e, t) => (0, S.jsx)(eO, { ref: t, size: `medium`, tone: `neutral`, ...e }));
aO.displayName = `RadioSelectBoxRadiomark`;
var oO = x.forwardRef(
    (
      {
        label: e,
        labelWeight: t,
        indicator: n,
        showRequiredIndicator: r,
        description: i,
        errorMessage: a,
        columns: o = 1,
        children: s,
        ...c
      },
      l,
    ) => {
      let [u, d] = zw.splitVariantProps(c);
      return (0, S.jsxs)(GS.Root, {
        ref: l,
        ...d,
        children: [
          (e || n) &&
            (0, S.jsx)(GS.Header, {
              children: (0, S.jsxs)(GS.Label, {
                weight: t,
                children: [
                  e,
                  r && (0, S.jsx)(GS.RequiredIndicator, {}),
                  n && (0, S.jsx)(GS.IndicatorText, { children: n }),
                ],
              }),
            }),
          (0, S.jsx)(FT.Group, { ...u, columns: o, children: s }),
          (i || a) &&
            (0, S.jsxs)(GS.Footer, {
              children: [
                i &&
                  (a
                    ? (0, S.jsx)(wD, {
                        asChild: !0,
                        children: (0, S.jsx)(GS.Description, { children: i }),
                      })
                    : (0, S.jsx)(GS.Description, { children: i })),
                a &&
                  (0, S.jsxs)(GS.ErrorMessage, {
                    children: [(0, S.jsx)(Ph, { svg: (0, S.jsx)(FD, {}) }), a],
                  }),
              ],
            }),
        ],
      });
    },
  ),
  sO = x.forwardRef(
    (
      {
        label: e,
        description: t,
        prefixIcon: n,
        suffix: r,
        inputProps: i,
        rootRef: a,
        footer: o,
        ...s
      },
      c,
    ) =>
      (0, S.jsxs)(FT.Root, {
        ref: a,
        ...s,
        children: [
          (0, S.jsxs)(FT.Trigger, {
            children: [
              (0, S.jsx)(FT.HiddenInput, { ref: c, ...i }),
              (0, S.jsxs)(FT.Content, {
                children: [
                  n && (0, S.jsx)(Ph, { svg: n }),
                  (0, S.jsxs)(FT.Body, {
                    children: [
                      (0, S.jsx)(FT.Label, { children: e }),
                      t && (0, S.jsx)(FT.Description, { children: t }),
                    ],
                  }),
                ],
              }),
              r,
            ],
          }),
          o && (0, S.jsx)(FT.Footer, { children: o }),
        ],
      }),
  );
sO.displayName = `CheckSelectBox`;
var cO = x.forwardRef((e, t) =>
  (0, S.jsx)(FT.CheckmarkControl, {
    ref: t,
    ...e,
    children: (0, S.jsx)(FT.CheckmarkIcon, { svg: (0, S.jsx)(LD, {}) }),
  }),
);
cO.displayName = `CheckSelectBoxCheckmark`;
var lO = ({ props: e, children: t }) => (0, S.jsx)(rO, { ...e, children: t }),
  uO = ({ props: e }) => (0, S.jsx)(iO, { ...e }),
  dO = ({ props: e, children: t }) => (0, S.jsx)(oO, { ...e, children: t }),
  fO = ({ props: e }) => (0, S.jsx)(sO, { ...e }),
  pO = (0, x.forwardRef)((e, t) => {
    let { children: n, ...r } = e;
    return (0, S.jsx)(yE.Root, { ref: t, ...r, children: n });
  });
pO.displayName = `TabsRoot`;
var mO = (0, x.forwardRef)((e, t) => {
  let { children: n, ...r } = e;
  return (0, S.jsxs)(yE.List, { ref: t, ...r, children: [n, (0, S.jsx)(yE.Indicator, {})] });
});
mO.displayName = `TabsList`;
var hO = (0, x.forwardRef)((e, t) => {
  let { children: n, notification: r, ...i } = e;
  return (0, S.jsx)(yE.Trigger, {
    ref: t,
    ...i,
    children: r
      ? (0, S.jsxs)(y_, {
          as: `span`,
          position: `relative`,
          children: [
            n,
            (0, S.jsx)(_C, { size: `small`, attach: `text`, children: (0, S.jsx)(gC, {}) }),
          ],
        })
      : n,
  });
});
hO.displayName = `TabsTrigger`;
var gO = (e) => {
  let { children: t, ...n } = e;
  return (0, S.jsx)(yE.Carousel, {
    ...n,
    children: (0, S.jsx)(yE.CarouselCamera, { children: t }),
  });
};
gO.displayName = `TabsCarousel`;
var _O = yE.Content,
  vO = ({ props: e, children: t }) => (0, S.jsx)(pO, { ...e, children: t }),
  yO = ({ props: e, children: t }) => (0, S.jsx)(mO, { ...e, children: t }),
  bO = ({ props: e, children: t }) => (0, S.jsx)(hO, { ...e, children: t }),
  xO = ({ props: e, children: t }) => (0, S.jsx)(_O, { ...e, children: t }),
  SO = ({ children: e, ...t }) =>
    (0, S.jsx)(Wx.Root, { role: `alertdialog`, closeOnInteractOutside: !1, ...t, children: e });
SO.displayName = `AlertDialogRoot`;
var CO = (0, x.forwardRef)(({ children: e, layerIndex: t, ...n }, r) =>
  (0, S.jsxs)(Wx.Positioner, {
    style: { "--layer-index": t },
    children: [(0, S.jsx)(Wx.Backdrop, {}), (0, S.jsx)(Wx.Content, { ref: r, ...n, children: e })],
  }),
);
Wx.Trigger;
var wO = Wx.Header,
  TO = Wx.Title,
  EO = Wx.Description,
  DO = Wx.Footer,
  OO = (0, x.forwardRef)((e, t) =>
    (0, S.jsx)(Wx.Action, { asChild: !0, children: (0, S.jsx)(jD, { ...e, ref: t }) }),
  ),
  kO = ({ props: e, children: t }) => (0, S.jsx)(SO, { ...e, children: t }),
  AO = ({ props: e, children: t }) => (0, S.jsx)(CO, { ...e, children: t }),
  jO = ({ props: e, children: t }) => (0, S.jsx)(wO, { ...e, children: t }),
  MO = ({ props: e, children: t }) => (0, S.jsx)(TO, { ...e, children: t }),
  NO = ({ props: e, children: t }) => (0, S.jsx)(EO, { ...e, children: t }),
  PO = ({ props: e, children: t }) => (0, S.jsx)(DO, { ...e, children: t }),
  FO = ({ props: e, children: t }) => (0, S.jsx)(OO, { ...e, children: t }),
  IO = x.forwardRef(({ src: e, alt: t, fallback: n, children: r, ...i }, a) =>
    (0, S.jsxs)(K_.Root, {
      ref: a,
      ...i,
      children: [
        (0, S.jsx)(K_.Fallback, { children: n }),
        (0, S.jsx)(K_.Image, { src: e, alt: t }),
        r,
      ],
    }),
  );
(IO.displayName = `Avatar`), K_.Badge, K_.Stack;
var LO = ({ props: e }) => (0, S.jsx)(IO, { ...e }),
  RO = ({ props: e, children: t }) => (0, S.jsx)(Q_, { ...e, children: t }),
  zO = x.forwardRef(({ prefixIcon: e, title: t, description: n, linkProps: r, ...i }, a) =>
    (0, S.jsxs)(Sv.Root, {
      ref: a,
      ...i,
      children: [
        e && (0, S.jsx)(Ph, { svg: e }),
        (0, S.jsxs)(Sv.Content, {
          children: [
            t && (0, S.jsx)(Sv.Title, { children: t }),
            (0, S.jsx)(Sv.Description, { children: n }),
            r && (0, S.jsx)(Sv.Link, { ...r }),
          ],
        }),
      ],
    }),
  );
zO.displayName = `Callout`;
var BO = x.forwardRef(({ prefixIcon: e, title: t, description: n, ...r }, i) =>
  (0, S.jsx)(Sv.Root, {
    ref: i,
    ...r,
    asChild: !0,
    children: (0, S.jsxs)(`button`, {
      type: `button`,
      children: [
        e && (0, S.jsx)(Ph, { svg: e }),
        (0, S.jsxs)(Sv.Content, {
          children: [
            t && (0, S.jsx)(Sv.Title, { children: t }),
            (0, S.jsx)(Sv.Description, { children: n }),
          ],
        }),
        (0, S.jsx)(Fh, { svg: (0, S.jsx)(ND, {}) }),
      ],
    }),
  }),
);
BO.displayName = `ActionableCallout`;
var VO = x.forwardRef(({ prefixIcon: e, title: t, description: n, linkProps: r, ...i }, a) =>
  (0, S.jsxs)(Sv.Root, {
    ref: a,
    ...i,
    children: [
      e && (0, S.jsx)(Ph, { svg: e }),
      (0, S.jsxs)(Sv.Content, {
        children: [
          t && (0, S.jsx)(Sv.Title, { children: t }),
          (0, S.jsx)(Sv.Description, { children: n }),
          r && (0, S.jsx)(Sv.Link, { ...r }),
        ],
      }),
      (0, S.jsx)(Sv.CloseButton, {
        "aria-label": `닫기`,
        children: (0, S.jsx)(Fh, { svg: (0, S.jsx)(PD, {}) }),
      }),
    ],
  }),
);
VO.displayName = `DismissibleCallout`;
var { registry: HO } = mc(Sl, {
  components: {
    Box: TD,
    VStack: ED,
    HStack: DD,
    Text: OD,
    ActionButton: MD,
    TextField: VD,
    TextFieldInput: HD,
    TextFieldTextarea: UD,
    CheckboxGroup: qD,
    Checkbox: JD,
    Switch: ZD,
    RadioGroup: tO,
    RadioGroupItem: nO,
    RadioSelectBoxRoot: lO,
    RadioSelectBoxItem: uO,
    CheckSelectBoxGroup: dO,
    CheckSelectBox: fO,
    TabsRoot: vO,
    TabsList: yO,
    TabsTrigger: bO,
    TabsContent: xO,
    AlertDialogRoot: kO,
    AlertDialogContent: AO,
    AlertDialogHeader: jO,
    AlertDialogTitle: MO,
    AlertDialogDescription: NO,
    AlertDialogFooter: PO,
    AlertDialogAction: FO,
    Avatar: LO,
    Badge: RO,
    Callout: ({ props: e }) => (0, S.jsx)(zO, { ...e }),
  },
});
function UO({ spec: e }) {
  return e
    ? (0, S.jsx)(`div`, {
        style: { padding: 16 },
        children: (0, S.jsx)(pc, { spec: e, registry: HO }),
      })
    : (0, S.jsx)(`div`, {
        style: {
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          height: `100%`,
          color: `#999`,
          fontSize: 14,
        },
        children: `프롬프트를 입력하면 여기에 프리뷰가 표시됩니다`,
      });
}
function WO({ code: e }) {
  return e
    ? (0, S.jsxs)(`div`, {
        style: { position: `relative`, height: `100%` },
        children: [
          (0, S.jsx)(`button`, {
            type: `button`,
            onClick: () => {
              navigator.clipboard.writeText(e);
            },
            style: {
              position: `absolute`,
              top: 8,
              right: 8,
              padding: `6px 12px`,
              borderRadius: 6,
              border: `1px solid #ddd`,
              background: `white`,
              fontSize: 12,
              cursor: `pointer`,
            },
            children: `복사`,
          }),
          (0, S.jsx)(`pre`, {
            style: {
              margin: 0,
              padding: 16,
              fontSize: 13,
              lineHeight: 1.6,
              overflow: `auto`,
              height: `100%`,
              background: `#f8f9fa`,
              borderRadius: 8,
            },
            children: (0, S.jsx)(`code`, { children: e }),
          }),
        ],
      })
    : (0, S.jsx)(`div`, {
        style: {
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          height: `100%`,
          color: `#999`,
          fontSize: 14,
        },
        children: `생성이 완료되면 여기에 코드가 표시됩니다`,
      });
}
function Z(e, t, n, r, i) {
  if (r === `m`) throw TypeError(`Private method is not writable`);
  if (r === `a` && !i) throw TypeError(`Private accessor was defined without a setter`);
  if (typeof t == `function` ? e !== t || !i : !t.has(e))
    throw TypeError(`Cannot write private member to an object whose class did not declare it`);
  return r === `a` ? i.call(e, n) : i ? (i.value = n) : t.set(e, n), n;
}
function Q(e, t, n, r) {
  if (n === `a` && !r) throw TypeError(`Private accessor was defined without a getter`);
  if (typeof t == `function` ? e !== t || !r : !t.has(e))
    throw TypeError(`Cannot read private member from an object whose class did not declare it`);
  return n === `m` ? r : n === `a` ? r.call(e) : r ? r.value : t.get(e);
}
var GO = function () {
  let { crypto: e } = globalThis;
  if (e?.randomUUID) return (GO = e.randomUUID.bind(e)), e.randomUUID();
  let t = new Uint8Array(1),
    n = e ? () => e.getRandomValues(t)[0] : () => (Math.random() * 255) & 255;
  return `10000000-1000-4000-8000-100000000000`.replace(/[018]/g, (e) =>
    (e ^ (n() & (15 >> (e / 4)))).toString(16),
  );
};
function KO(e) {
  return (
    typeof e == `object` &&
    !!e &&
    ((`name` in e && e.name === `AbortError`) ||
      (`message` in e && String(e.message).includes(`FetchRequestCanceledException`)))
  );
}
var qO = (e) => {
    if (e instanceof Error) return e;
    if (typeof e == `object` && e) {
      try {
        if (Object.prototype.toString.call(e) === `[object Error]`) {
          let t = Error(e.message, e.cause ? { cause: e.cause } : {});
          return (
            e.stack && (t.stack = e.stack),
            e.cause && !t.cause && (t.cause = e.cause),
            e.name && (t.name = e.name),
            t
          );
        }
      } catch {}
      try {
        return Error(JSON.stringify(e));
      } catch {}
    }
    return Error(e);
  },
  $ = class extends Error {},
  JO = class e extends $ {
    constructor(t, n, r, i) {
      super(`${e.makeMessage(t, n, r)}`),
        (this.status = t),
        (this.headers = i),
        (this.requestID = i?.get(`request-id`)),
        (this.error = n);
    }
    static makeMessage(e, t, n) {
      let r = t?.message
        ? typeof t.message == `string`
          ? t.message
          : JSON.stringify(t.message)
        : t
          ? JSON.stringify(t)
          : n;
      return e && r
        ? `${e} ${r}`
        : e
          ? `${e} status code (no body)`
          : r || `(no status code or body)`;
    }
    static generate(t, n, r, i) {
      if (!t || !i) return new XO({ message: r, cause: qO(n) });
      let a = n;
      return t === 400
        ? new QO(t, a, r, i)
        : t === 401
          ? new $O(t, a, r, i)
          : t === 403
            ? new ek(t, a, r, i)
            : t === 404
              ? new tk(t, a, r, i)
              : t === 409
                ? new nk(t, a, r, i)
                : t === 422
                  ? new rk(t, a, r, i)
                  : t === 429
                    ? new ik(t, a, r, i)
                    : t >= 500
                      ? new ak(t, a, r, i)
                      : new e(t, a, r, i);
    }
  },
  YO = class extends JO {
    constructor({ message: e } = {}) {
      super(void 0, void 0, e || `Request was aborted.`, void 0);
    }
  },
  XO = class extends JO {
    constructor({ message: e, cause: t }) {
      super(void 0, void 0, e || `Connection error.`, void 0), t && (this.cause = t);
    }
  },
  ZO = class extends XO {
    constructor({ message: e } = {}) {
      super({ message: e ?? `Request timed out.` });
    }
  },
  QO = class extends JO {},
  $O = class extends JO {},
  ek = class extends JO {},
  tk = class extends JO {},
  nk = class extends JO {},
  rk = class extends JO {},
  ik = class extends JO {},
  ak = class extends JO {},
  ok = /^[a-z][a-z0-9+.-]*:/i,
  sk = (e) => ok.test(e);
function ck(e) {
  return typeof e == `object` ? (e ?? {}) : {};
}
function lk(e) {
  if (!e) return !0;
  for (let t in e) return !1;
  return !0;
}
function uk(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
var dk = (e, t) => {
    if (typeof t != `number` || !Number.isInteger(t)) throw new $(`${e} must be an integer`);
    if (t < 0) throw new $(`${e} must be a positive integer`);
    return t;
  },
  fk = (e) => {
    try {
      return JSON.parse(e);
    } catch {
      return;
    }
  },
  pk = (e) => new Promise((t) => setTimeout(t, e)),
  mk = { off: 0, error: 200, warn: 300, info: 400, debug: 500 },
  hk = (e, t, n) => {
    if (e) {
      if (uk(mk, e)) return e;
      bk(n).warn(
        `${t} was set to ${JSON.stringify(e)}, expected one of ${JSON.stringify(Object.keys(mk))}`,
      );
    }
  };
function gk() {}
function _k(e, t, n) {
  return !t || mk[e] > mk[n] ? gk : t[e].bind(t);
}
var vk = { error: gk, warn: gk, info: gk, debug: gk },
  yk = new WeakMap();
function bk(e) {
  let t = e.logger,
    n = e.logLevel ?? `off`;
  if (!t) return vk;
  let r = yk.get(t);
  if (r && r[0] === n) return r[1];
  let i = {
    error: _k(`error`, t, n),
    warn: _k(`warn`, t, n),
    info: _k(`info`, t, n),
    debug: _k(`debug`, t, n),
  };
  return yk.set(t, [n, i]), i;
}
var xk = (e) => (
    e.options && ((e.options = { ...e.options }), delete e.options.headers),
    (e.headers &&= Object.fromEntries(
      (e.headers instanceof Headers ? [...e.headers] : Object.entries(e.headers)).map(([e, t]) => [
        e,
        e.toLowerCase() === `x-api-key` ||
        e.toLowerCase() === `authorization` ||
        e.toLowerCase() === `cookie` ||
        e.toLowerCase() === `set-cookie`
          ? `***`
          : t,
      ]),
    )),
    `retryOfRequestLogID` in e &&
      (e.retryOfRequestLogID && (e.retryOf = e.retryOfRequestLogID), delete e.retryOfRequestLogID),
    e
  ),
  Sk = `0.52.0`,
  Ck = () => typeof window < `u` && window.document !== void 0 && typeof navigator < `u`;
function wk() {
  return typeof Deno < `u` && Deno.build != null
    ? `deno`
    : typeof EdgeRuntime < `u`
      ? `edge`
      : Object.prototype.toString.call(globalThis.process === void 0 ? 0 : globalThis.process) ===
          `[object process]`
        ? `node`
        : `unknown`;
}
var Tk = () => {
  let e = wk();
  if (e === `deno`)
    return {
      "X-Stainless-Lang": `js`,
      "X-Stainless-Package-Version": Sk,
      "X-Stainless-OS": Ok(Deno.build.os),
      "X-Stainless-Arch": Dk(Deno.build.arch),
      "X-Stainless-Runtime": `deno`,
      "X-Stainless-Runtime-Version":
        typeof Deno.version == `string` ? Deno.version : (Deno.version?.deno ?? `unknown`),
    };
  if (typeof EdgeRuntime < `u`)
    return {
      "X-Stainless-Lang": `js`,
      "X-Stainless-Package-Version": Sk,
      "X-Stainless-OS": `Unknown`,
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": `edge`,
      "X-Stainless-Runtime-Version": globalThis.process.version,
    };
  if (e === `node`)
    return {
      "X-Stainless-Lang": `js`,
      "X-Stainless-Package-Version": Sk,
      "X-Stainless-OS": Ok(globalThis.process.platform),
      "X-Stainless-Arch": Dk(globalThis.process.arch),
      "X-Stainless-Runtime": `node`,
      "X-Stainless-Runtime-Version": globalThis.process.version,
    };
  let t = Ek();
  return t
    ? {
        "X-Stainless-Lang": `js`,
        "X-Stainless-Package-Version": Sk,
        "X-Stainless-OS": `Unknown`,
        "X-Stainless-Arch": `unknown`,
        "X-Stainless-Runtime": `browser:${t.browser}`,
        "X-Stainless-Runtime-Version": t.version,
      }
    : {
        "X-Stainless-Lang": `js`,
        "X-Stainless-Package-Version": Sk,
        "X-Stainless-OS": `Unknown`,
        "X-Stainless-Arch": `unknown`,
        "X-Stainless-Runtime": `unknown`,
        "X-Stainless-Runtime-Version": `unknown`,
      };
};
function Ek() {
  if (typeof navigator > `u` || !navigator) return null;
  for (let { key: e, pattern: t } of [
    { key: `edge`, pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: `ie`, pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: `ie`, pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: `chrome`, pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: `firefox`, pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: `safari`, pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ },
  ]) {
    let n = t.exec(navigator.userAgent);
    if (n) return { browser: e, version: `${n[1] || 0}.${n[2] || 0}.${n[3] || 0}` };
  }
  return null;
}
var Dk = (e) =>
    e === `x32`
      ? `x32`
      : e === `x86_64` || e === `x64`
        ? `x64`
        : e === `arm`
          ? `arm`
          : e === `aarch64` || e === `arm64`
            ? `arm64`
            : e
              ? `other:${e}`
              : `unknown`,
  Ok = (e) => (
    (e = e.toLowerCase()),
    e.includes(`ios`)
      ? `iOS`
      : e === `android`
        ? `Android`
        : e === `darwin`
          ? `MacOS`
          : e === `win32`
            ? `Windows`
            : e === `freebsd`
              ? `FreeBSD`
              : e === `openbsd`
                ? `OpenBSD`
                : e === `linux`
                  ? `Linux`
                  : e
                    ? `Other:${e}`
                    : `Unknown`
  ),
  kk,
  Ak = () => (kk ??= Tk());
function jk() {
  if (typeof fetch < `u`) return fetch;
  throw Error(
    "`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`",
  );
}
function Mk(...e) {
  let t = globalThis.ReadableStream;
  if (t === void 0)
    throw Error(
      "`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`",
    );
  return new t(...e);
}
function Nk(e) {
  let t = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
  return Mk({
    start() {},
    async pull(e) {
      let { done: n, value: r } = await t.next();
      n ? e.close() : e.enqueue(r);
    },
    async cancel() {
      await t.return?.();
    },
  });
}
function Pk(e) {
  if (e[Symbol.asyncIterator]) return e;
  let t = e.getReader();
  return {
    async next() {
      try {
        let e = await t.read();
        return e?.done && t.releaseLock(), e;
      } catch (e) {
        throw (t.releaseLock(), e);
      }
    },
    async return() {
      let e = t.cancel();
      return t.releaseLock(), await e, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
async function Fk(e) {
  if (typeof e != `object` || !e) return;
  if (e[Symbol.asyncIterator]) {
    await e[Symbol.asyncIterator]().return?.();
    return;
  }
  let t = e.getReader(),
    n = t.cancel();
  t.releaseLock(), await n;
}
var Ik = ({ headers: e, body: t }) => ({
  bodyHeaders: { "content-type": `application/json` },
  body: JSON.stringify(t),
});
function Lk(e) {
  let t = 0;
  for (let n of e) t += n.length;
  let n = new Uint8Array(t),
    r = 0;
  for (let t of e) n.set(t, r), (r += t.length);
  return n;
}
var Rk;
function zk(e) {
  let t;
  return (Rk ??= ((t = new globalThis.TextEncoder()), t.encode.bind(t)))(e);
}
var Bk;
function Vk(e) {
  let t;
  return (Bk ??= ((t = new globalThis.TextDecoder()), t.decode.bind(t)))(e);
}
var Hk,
  Uk,
  Wk = class {
    constructor() {
      Hk.set(this, void 0),
        Uk.set(this, void 0),
        Z(this, Hk, new Uint8Array(), `f`),
        Z(this, Uk, null, `f`);
    }
    decode(e) {
      if (e == null) return [];
      let t = e instanceof ArrayBuffer ? new Uint8Array(e) : typeof e == `string` ? zk(e) : e;
      Z(this, Hk, Lk([Q(this, Hk, `f`), t]), `f`);
      let n = [],
        r;
      for (; (r = Gk(Q(this, Hk, `f`), Q(this, Uk, `f`))) != null; ) {
        if (r.carriage && Q(this, Uk, `f`) == null) {
          Z(this, Uk, r.index, `f`);
          continue;
        }
        if (Q(this, Uk, `f`) != null && (r.index !== Q(this, Uk, `f`) + 1 || r.carriage)) {
          n.push(Vk(Q(this, Hk, `f`).subarray(0, Q(this, Uk, `f`) - 1))),
            Z(this, Hk, Q(this, Hk, `f`).subarray(Q(this, Uk, `f`)), `f`),
            Z(this, Uk, null, `f`);
          continue;
        }
        let e = Q(this, Uk, `f`) === null ? r.preceding : r.preceding - 1,
          t = Vk(Q(this, Hk, `f`).subarray(0, e));
        n.push(t), Z(this, Hk, Q(this, Hk, `f`).subarray(r.index), `f`), Z(this, Uk, null, `f`);
      }
      return n;
    }
    flush() {
      return Q(this, Hk, `f`).length
        ? this.decode(`
`)
        : [];
    }
  };
(Hk = new WeakMap()),
  (Uk = new WeakMap()),
  (Wk.NEWLINE_CHARS = new Set([
    `
`,
    `\r`,
  ])),
  (Wk.NEWLINE_REGEXP = /\r\n|[\n\r]/g);
function Gk(e, t) {
  for (let n = t ?? 0; n < e.length; n++) {
    if (e[n] === 10) return { preceding: n, index: n + 1, carriage: !1 };
    if (e[n] === 13) return { preceding: n, index: n + 1, carriage: !0 };
  }
  return null;
}
function Kk(e) {
  for (let t = 0; t < e.length - 1; t++) {
    if ((e[t] === 10 && e[t + 1] === 10) || (e[t] === 13 && e[t + 1] === 13)) return t + 2;
    if (e[t] === 13 && e[t + 1] === 10 && t + 3 < e.length && e[t + 2] === 13 && e[t + 3] === 10)
      return t + 4;
  }
  return -1;
}
var qk = class e {
  constructor(e, t) {
    (this.iterator = e), (this.controller = t);
  }
  static fromSSEResponse(t, n) {
    let r = !1;
    async function* i() {
      if (r)
        throw new $("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      r = !0;
      let e = !1;
      try {
        for await (let e of Jk(t, n)) {
          if (e.event === `completion`)
            try {
              yield JSON.parse(e.data);
            } catch (t) {
              throw (
                (console.error(`Could not parse message into JSON:`, e.data),
                console.error(`From chunk:`, e.raw),
                t)
              );
            }
          if (
            e.event === `message_start` ||
            e.event === `message_delta` ||
            e.event === `message_stop` ||
            e.event === `content_block_start` ||
            e.event === `content_block_delta` ||
            e.event === `content_block_stop`
          )
            try {
              yield JSON.parse(e.data);
            } catch (t) {
              throw (
                (console.error(`Could not parse message into JSON:`, e.data),
                console.error(`From chunk:`, e.raw),
                t)
              );
            }
          if (e.event !== `ping` && e.event === `error`)
            throw new JO(void 0, fk(e.data) ?? e.data, void 0, t.headers);
        }
        e = !0;
      } catch (e) {
        if (KO(e)) return;
        throw e;
      } finally {
        e || n.abort();
      }
    }
    return new e(i, n);
  }
  static fromReadableStream(t, n) {
    let r = !1;
    async function* i() {
      let e = new Wk(),
        n = Pk(t);
      for await (let t of n) for (let n of e.decode(t)) yield n;
      for (let t of e.flush()) yield t;
    }
    async function* a() {
      if (r)
        throw new $("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      r = !0;
      let e = !1;
      try {
        for await (let t of i()) e || (t && (yield JSON.parse(t)));
        e = !0;
      } catch (e) {
        if (KO(e)) return;
        throw e;
      } finally {
        e || n.abort();
      }
    }
    return new e(a, n);
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  tee() {
    let t = [],
      n = [],
      r = this.iterator(),
      i = (e) => ({
        next: () => {
          if (e.length === 0) {
            let e = r.next();
            t.push(e), n.push(e);
          }
          return e.shift();
        },
      });
    return [new e(() => i(t), this.controller), new e(() => i(n), this.controller)];
  }
  toReadableStream() {
    let e = this,
      t;
    return Mk({
      async start() {
        t = e[Symbol.asyncIterator]();
      },
      async pull(e) {
        try {
          let { value: n, done: r } = await t.next();
          if (r) return e.close();
          let i = zk(
            JSON.stringify(n) +
              `
`,
          );
          e.enqueue(i);
        } catch (t) {
          e.error(t);
        }
      },
      async cancel() {
        await t.return?.();
      },
    });
  }
};
async function* Jk(e, t) {
  if (!e.body)
    throw (
      (t.abort(),
      globalThis.navigator !== void 0 && globalThis.navigator.product === `ReactNative`
        ? new $(
            `The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`,
          )
        : new $(`Attempted to iterate over a response with no body`))
    );
  let n = new Xk(),
    r = new Wk(),
    i = Pk(e.body);
  for await (let e of Yk(i))
    for (let t of r.decode(e)) {
      let e = n.decode(t);
      e && (yield e);
    }
  for (let e of r.flush()) {
    let t = n.decode(e);
    t && (yield t);
  }
}
async function* Yk(e) {
  let t = new Uint8Array();
  for await (let n of e) {
    if (n == null) continue;
    let e = n instanceof ArrayBuffer ? new Uint8Array(n) : typeof n == `string` ? zk(n) : n,
      r = new Uint8Array(t.length + e.length);
    r.set(t), r.set(e, t.length), (t = r);
    let i;
    for (; (i = Kk(t)) !== -1; ) yield t.slice(0, i), (t = t.slice(i));
  }
  t.length > 0 && (yield t);
}
var Xk = class {
  constructor() {
    (this.event = null), (this.data = []), (this.chunks = []);
  }
  decode(e) {
    if ((e.endsWith(`\r`) && (e = e.substring(0, e.length - 1)), !e)) {
      if (!this.event && !this.data.length) return null;
      let e = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks,
      };
      return (this.event = null), (this.data = []), (this.chunks = []), e;
    }
    if ((this.chunks.push(e), e.startsWith(`:`))) return null;
    let [t, n, r] = Zk(e, `:`);
    return (
      r.startsWith(` `) && (r = r.substring(1)),
      t === `event` ? (this.event = r) : t === `data` && this.data.push(r),
      null
    );
  }
};
function Zk(e, t) {
  let n = e.indexOf(t);
  return n === -1 ? [e, ``, ``] : [e.substring(0, n), t, e.substring(n + t.length)];
}
async function Qk(e, t) {
  let { response: n, requestLogID: r, retryOfRequestLogID: i, startTime: a } = t,
    o = await (async () => {
      if (t.options.stream)
        return (
          bk(e).debug(`response`, n.status, n.url, n.headers, n.body),
          t.options.__streamClass
            ? t.options.__streamClass.fromSSEResponse(n, t.controller)
            : qk.fromSSEResponse(n, t.controller)
        );
      if (n.status === 204) return null;
      if (t.options.__binaryResponse) return n;
      let r = n.headers.get(`content-type`)?.split(`;`)[0]?.trim();
      return r?.includes(`application/json`) || r?.endsWith(`+json`)
        ? $k(await n.json(), n)
        : await n.text();
    })();
  return (
    bk(e).debug(
      `[${r}] response parsed`,
      xk({
        retryOfRequestLogID: i,
        url: n.url,
        status: n.status,
        body: o,
        durationMs: Date.now() - a,
      }),
    ),
    o
  );
}
function $k(e, t) {
  return !e || typeof e != `object` || Array.isArray(e)
    ? e
    : Object.defineProperty(e, `_request_id`, {
        value: t.headers.get(`request-id`),
        enumerable: !1,
      });
}
var eA,
  tA = class e extends Promise {
    constructor(e, t, n = Qk) {
      super((e) => {
        e(null);
      }),
        (this.responsePromise = t),
        (this.parseResponse = n),
        eA.set(this, void 0),
        Z(this, eA, e, `f`);
    }
    _thenUnwrap(t) {
      return new e(Q(this, eA, `f`), this.responsePromise, async (e, n) =>
        $k(t(await this.parseResponse(e, n), n), n.response),
      );
    }
    asResponse() {
      return this.responsePromise.then((e) => e.response);
    }
    async withResponse() {
      let [e, t] = await Promise.all([this.parse(), this.asResponse()]);
      return { data: e, response: t, request_id: t.headers.get(`request-id`) };
    }
    parse() {
      return (
        (this.parsedPromise ||= this.responsePromise.then((e) =>
          this.parseResponse(Q(this, eA, `f`), e),
        )),
        this.parsedPromise
      );
    }
    then(e, t) {
      return this.parse().then(e, t);
    }
    catch(e) {
      return this.parse().catch(e);
    }
    finally(e) {
      return this.parse().finally(e);
    }
  };
eA = new WeakMap();
var nA,
  rA = class {
    constructor(e, t, n, r) {
      nA.set(this, void 0),
        Z(this, nA, e, `f`),
        (this.options = r),
        (this.response = t),
        (this.body = n);
    }
    hasNextPage() {
      return this.getPaginatedItems().length ? this.nextPageRequestOptions() != null : !1;
    }
    async getNextPage() {
      let e = this.nextPageRequestOptions();
      if (!e)
        throw new $(
          "No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.",
        );
      return await Q(this, nA, `f`).requestAPIList(this.constructor, e);
    }
    async *iterPages() {
      let e = this;
      for (yield e; e.hasNextPage(); ) (e = await e.getNextPage()), yield e;
    }
    async *[((nA = new WeakMap()), Symbol.asyncIterator)]() {
      for await (let e of this.iterPages()) for (let t of e.getPaginatedItems()) yield t;
    }
  },
  iA = class extends tA {
    constructor(e, t, n) {
      super(e, t, async (e, t) => new n(e, t.response, await Qk(e, t), t.options));
    }
    async *[Symbol.asyncIterator]() {
      let e = await this;
      for await (let t of e) yield t;
    }
  },
  aA = class extends rA {
    constructor(e, t, n, r) {
      super(e, t, n, r),
        (this.data = n.data || []),
        (this.has_more = n.has_more || !1),
        (this.first_id = n.first_id || null),
        (this.last_id = n.last_id || null);
    }
    getPaginatedItems() {
      return this.data ?? [];
    }
    hasNextPage() {
      return this.has_more === !1 ? !1 : super.hasNextPage();
    }
    nextPageRequestOptions() {
      if (this.options.query?.before_id) {
        let e = this.first_id;
        return e ? { ...this.options, query: { ...ck(this.options.query), before_id: e } } : null;
      }
      let e = this.last_id;
      return e ? { ...this.options, query: { ...ck(this.options.query), after_id: e } } : null;
    }
  },
  oA = () => {
    if (typeof File > `u`) {
      let { process: e } = globalThis,
        t = typeof e?.versions?.node == `string` && parseInt(e.versions.node.split(`.`)) < 20;
      throw Error(
        "`File` is not defined as a global, which is required for file uploads." +
          (t
            ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`."
            : ``),
      );
    }
  };
function sA(e, t, n) {
  return oA(), new File(e, t ?? `unknown_file`, n);
}
function cA(e) {
  return (
    (
      (typeof e == `object` &&
        !!e &&
        ((`name` in e && e.name && String(e.name)) ||
          (`url` in e && e.url && String(e.url)) ||
          (`filename` in e && e.filename && String(e.filename)) ||
          (`path` in e && e.path && String(e.path)))) ||
      ``
    )
      .split(/[\\/]/)
      .pop() || void 0
  );
}
var lA = (e) => typeof e == `object` && !!e && typeof e[Symbol.asyncIterator] == `function`,
  uA = async (e, t) => ({ ...e, body: await pA(e.body, t) }),
  dA = new WeakMap();
function fA(e) {
  let t = typeof e == `function` ? e : e.fetch,
    n = dA.get(t);
  if (n) return n;
  let r = (async () => {
    try {
      let e = `Response` in t ? t.Response : (await t(`data:,`)).constructor,
        n = new FormData();
      return n.toString() !== (await new e(n).text());
    } catch {
      return !0;
    }
  })();
  return dA.set(t, r), r;
}
var pA = async (e, t) => {
    if (!(await fA(t)))
      throw TypeError(
        `The provided fetch function does not support file uploads with the current global FormData class.`,
      );
    let n = new FormData();
    return await Promise.all(Object.entries(e || {}).map(([e, t]) => hA(n, e, t))), n;
  },
  mA = (e) => e instanceof Blob && `name` in e,
  hA = async (e, t, n) => {
    if (n !== void 0) {
      if (n == null)
        throw TypeError(
          `Received null for "${t}"; to pass null in FormData, you must use the string 'null'`,
        );
      if (typeof n == `string` || typeof n == `number` || typeof n == `boolean`)
        e.append(t, String(n));
      else if (n instanceof Response) {
        let r = {},
          i = n.headers.get(`Content-Type`);
        i && (r = { type: i }), e.append(t, sA([await n.blob()], cA(n), r));
      } else if (lA(n)) e.append(t, sA([await new Response(Nk(n)).blob()], cA(n)));
      else if (mA(n)) e.append(t, sA([n], cA(n), { type: n.type }));
      else if (Array.isArray(n)) await Promise.all(n.map((n) => hA(e, t + `[]`, n)));
      else if (typeof n == `object`)
        await Promise.all(Object.entries(n).map(([n, r]) => hA(e, `${t}[${n}]`, r)));
      else
        throw TypeError(
          `Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${n} instead`,
        );
    }
  },
  gA = (e) =>
    typeof e == `object` &&
    !!e &&
    typeof e.size == `number` &&
    typeof e.type == `string` &&
    typeof e.text == `function` &&
    typeof e.slice == `function` &&
    typeof e.arrayBuffer == `function`,
  _A = (e) =>
    typeof e == `object` &&
    !!e &&
    typeof e.name == `string` &&
    typeof e.lastModified == `number` &&
    gA(e),
  vA = (e) =>
    typeof e == `object` && !!e && typeof e.url == `string` && typeof e.blob == `function`;
async function yA(e, t, n) {
  if ((oA(), (e = await e), (t ||= cA(e)), _A(e)))
    return e instanceof File && t == null && n == null
      ? e
      : sA([await e.arrayBuffer()], t ?? e.name, {
          type: e.type,
          lastModified: e.lastModified,
          ...n,
        });
  if (vA(e)) {
    let r = await e.blob();
    return (t ||= new URL(e.url).pathname.split(/[\\/]/).pop()), sA(await bA(r), t, n);
  }
  let r = await bA(e);
  if (!n?.type) {
    let e = r.find((e) => typeof e == `object` && `type` in e && e.type);
    typeof e == `string` && (n = { ...n, type: e });
  }
  return sA(r, t, n);
}
async function bA(e) {
  let t = [];
  if (typeof e == `string` || ArrayBuffer.isView(e) || e instanceof ArrayBuffer) t.push(e);
  else if (gA(e)) t.push(e instanceof Blob ? e : await e.arrayBuffer());
  else if (lA(e)) for await (let n of e) t.push(...(await bA(n)));
  else {
    let t = e?.constructor?.name;
    throw Error(`Unexpected data type: ${typeof e}${t ? `; constructor: ${t}` : ``}${xA(e)}`);
  }
  return t;
}
function xA(e) {
  return typeof e != `object` || !e
    ? ``
    : `; props: [${Object.getOwnPropertyNames(e)
        .map((e) => `"${e}"`)
        .join(`, `)}]`;
}
var SA = class {
    constructor(e) {
      this._client = e;
    }
  },
  CA = Symbol.for(`brand.privateNullableHeaders`),
  wA = Array.isArray;
function* TA(e) {
  if (!e) return;
  if (CA in e) {
    let { values: t, nulls: n } = e;
    yield* t.entries();
    for (let e of n) yield [e, null];
    return;
  }
  let t = !1,
    n;
  e instanceof Headers
    ? (n = e.entries())
    : wA(e)
      ? (n = e)
      : ((t = !0), (n = Object.entries(e ?? {})));
  for (let e of n) {
    let n = e[0];
    if (typeof n != `string`) throw TypeError(`expected header name to be a string`);
    let r = wA(e[1]) ? e[1] : [e[1]],
      i = !1;
    for (let e of r) e !== void 0 && (t && !i && ((i = !0), yield [n, null]), yield [n, e]);
  }
}
var EA = (e) => {
  let t = new Headers(),
    n = new Set();
  for (let r of e) {
    let e = new Set();
    for (let [i, a] of TA(r)) {
      let r = i.toLowerCase();
      e.has(r) || (t.delete(i), e.add(r)),
        a === null ? (t.delete(i), n.add(r)) : (t.append(i, a), n.delete(r));
    }
  }
  return { [CA]: !0, values: t, nulls: n };
};
function DA(e) {
  return e.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var OA = ((e = DA) =>
    function (t, ...n) {
      if (t.length === 1) return t[0];
      let r = !1,
        i = t.reduce(
          (t, i, a) => (
            /[?#]/.test(i) && (r = !0),
            t + i + (a === n.length ? `` : (r ? encodeURIComponent : e)(String(n[a])))
          ),
          ``,
        ),
        a = i.split(/[?#]/, 1)[0],
        o = [],
        s = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
        c;
      for (; (c = s.exec(a)) !== null; ) o.push({ start: c.index, length: c[0].length });
      if (o.length > 0) {
        let e = 0;
        throw new $(
          `Path parameters result in path with invalid segments:\n${i}\n${o.reduce((t, n) => {
            let r = ` `.repeat(n.start - e),
              i = `^`.repeat(n.length);
            return (e = n.start + n.length), t + r + i;
          }, ``)}`,
        );
      }
      return i;
    })(DA),
  kA = class extends SA {
    list(e = {}, t) {
      let { betas: n, ...r } = e ?? {};
      return this._client.getAPIList(`/v1/files`, aA, {
        query: r,
        ...t,
        headers: EA([
          { "anthropic-beta": [...(n ?? []), `files-api-2025-04-14`].toString() },
          t?.headers,
        ]),
      });
    }
    delete(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.delete(OA`/v1/files/${e}`, {
        ...n,
        headers: EA([
          { "anthropic-beta": [...(r ?? []), `files-api-2025-04-14`].toString() },
          n?.headers,
        ]),
      });
    }
    download(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.get(OA`/v1/files/${e}/content`, {
        ...n,
        headers: EA([
          {
            "anthropic-beta": [...(r ?? []), `files-api-2025-04-14`].toString(),
            Accept: `application/binary`,
          },
          n?.headers,
        ]),
        __binaryResponse: !0,
      });
    }
    retrieveMetadata(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.get(OA`/v1/files/${e}`, {
        ...n,
        headers: EA([
          { "anthropic-beta": [...(r ?? []), `files-api-2025-04-14`].toString() },
          n?.headers,
        ]),
      });
    }
    upload(e, t) {
      let { betas: n, ...r } = e;
      return this._client.post(
        `/v1/files`,
        uA(
          {
            body: r,
            ...t,
            headers: EA([
              { "anthropic-beta": [...(n ?? []), `files-api-2025-04-14`].toString() },
              t?.headers,
            ]),
          },
          this._client,
        ),
      );
    }
  },
  AA = class extends SA {
    retrieve(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.get(OA`/v1/models/${e}?beta=true`, {
        ...n,
        headers: EA([
          { ...(r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() }) },
          n?.headers,
        ]),
      });
    }
    list(e = {}, t) {
      let { betas: n, ...r } = e ?? {};
      return this._client.getAPIList(`/v1/models?beta=true`, aA, {
        query: r,
        ...t,
        headers: EA([
          { ...(n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() }) },
          t?.headers,
        ]),
      });
    }
  },
  jA = class e {
    constructor(e, t) {
      (this.iterator = e), (this.controller = t);
    }
    async *decoder() {
      let e = new Wk();
      for await (let t of this.iterator) for (let n of e.decode(t)) yield JSON.parse(n);
      for (let t of e.flush()) yield JSON.parse(t);
    }
    [Symbol.asyncIterator]() {
      return this.decoder();
    }
    static fromResponse(t, n) {
      if (!t.body)
        throw (
          (n.abort(),
          globalThis.navigator !== void 0 && globalThis.navigator.product === `ReactNative`
            ? new $(
                `The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`,
              )
            : new $(`Attempted to iterate over a response with no body`))
        );
      return new e(Pk(t.body), n);
    }
  },
  MA = class extends SA {
    create(e, t) {
      let { betas: n, ...r } = e;
      return this._client.post(`/v1/messages/batches?beta=true`, {
        body: r,
        ...t,
        headers: EA([
          { "anthropic-beta": [...(n ?? []), `message-batches-2024-09-24`].toString() },
          t?.headers,
        ]),
      });
    }
    retrieve(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.get(OA`/v1/messages/batches/${e}?beta=true`, {
        ...n,
        headers: EA([
          { "anthropic-beta": [...(r ?? []), `message-batches-2024-09-24`].toString() },
          n?.headers,
        ]),
      });
    }
    list(e = {}, t) {
      let { betas: n, ...r } = e ?? {};
      return this._client.getAPIList(`/v1/messages/batches?beta=true`, aA, {
        query: r,
        ...t,
        headers: EA([
          { "anthropic-beta": [...(n ?? []), `message-batches-2024-09-24`].toString() },
          t?.headers,
        ]),
      });
    }
    delete(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.delete(OA`/v1/messages/batches/${e}?beta=true`, {
        ...n,
        headers: EA([
          { "anthropic-beta": [...(r ?? []), `message-batches-2024-09-24`].toString() },
          n?.headers,
        ]),
      });
    }
    cancel(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.post(OA`/v1/messages/batches/${e}/cancel?beta=true`, {
        ...n,
        headers: EA([
          { "anthropic-beta": [...(r ?? []), `message-batches-2024-09-24`].toString() },
          n?.headers,
        ]),
      });
    }
    async results(e, t = {}, n) {
      let r = await this.retrieve(e);
      if (!r.results_url)
        throw new $(
          `No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`,
        );
      let { betas: i } = t ?? {};
      return this._client
        .get(r.results_url, {
          ...n,
          headers: EA([
            {
              "anthropic-beta": [...(i ?? []), `message-batches-2024-09-24`].toString(),
              Accept: `application/binary`,
            },
            n?.headers,
          ]),
          stream: !0,
          __binaryResponse: !0,
        })
        ._thenUnwrap((e, t) => jA.fromResponse(t.response, t.controller));
    }
  },
  NA = (e) => {
    let t = 0,
      n = [];
    for (; t < e.length; ) {
      let r = e[t];
      if (r === `\\`) {
        t++;
        continue;
      }
      if (r === `{`) {
        n.push({ type: `brace`, value: `{` }), t++;
        continue;
      }
      if (r === `}`) {
        n.push({ type: `brace`, value: `}` }), t++;
        continue;
      }
      if (r === `[`) {
        n.push({ type: `paren`, value: `[` }), t++;
        continue;
      }
      if (r === `]`) {
        n.push({ type: `paren`, value: `]` }), t++;
        continue;
      }
      if (r === `:`) {
        n.push({ type: `separator`, value: `:` }), t++;
        continue;
      }
      if (r === `,`) {
        n.push({ type: `delimiter`, value: `,` }), t++;
        continue;
      }
      if (r === `"`) {
        let i = ``,
          a = !1;
        for (r = e[++t]; r !== `"`; ) {
          if (t === e.length) {
            a = !0;
            break;
          }
          if (r === `\\`) {
            if ((t++, t === e.length)) {
              a = !0;
              break;
            }
            (i += r + e[t]), (r = e[++t]);
          } else (i += r), (r = e[++t]);
        }
        (r = e[++t]), a || n.push({ type: `string`, value: i });
        continue;
      }
      if (r && /\s/.test(r)) {
        t++;
        continue;
      }
      let i = /[0-9]/;
      if ((r && i.test(r)) || r === `-` || r === `.`) {
        let a = ``;
        for (r === `-` && ((a += r), (r = e[++t])); (r && i.test(r)) || r === `.`; )
          (a += r), (r = e[++t]);
        n.push({ type: `number`, value: a });
        continue;
      }
      let a = /[a-z]/i;
      if (r && a.test(r)) {
        let i = ``;
        for (; r && a.test(r) && t !== e.length; ) (i += r), (r = e[++t]);
        if (i == `true` || i == `false` || i === `null`) n.push({ type: `name`, value: i });
        else {
          t++;
          continue;
        }
        continue;
      }
      t++;
    }
    return n;
  },
  PA = (e) => {
    if (e.length === 0) return e;
    let t = e[e.length - 1];
    switch (t.type) {
      case `separator`:
        return (e = e.slice(0, e.length - 1)), PA(e);
      case `number`:
        let n = t.value[t.value.length - 1];
        if (n === `.` || n === `-`) return (e = e.slice(0, e.length - 1)), PA(e);
      case `string`:
        let r = e[e.length - 2];
        if (r?.type === `delimiter` || (r?.type === `brace` && r.value === `{`))
          return (e = e.slice(0, e.length - 1)), PA(e);
        break;
      case `delimiter`:
        return (e = e.slice(0, e.length - 1)), PA(e);
    }
    return e;
  },
  FA = (e) => {
    let t = [];
    return (
      e.map((e) => {
        e.type === `brace` && (e.value === `{` ? t.push(`}`) : t.splice(t.lastIndexOf(`}`), 1)),
          e.type === `paren` && (e.value === `[` ? t.push(`]`) : t.splice(t.lastIndexOf(`]`), 1));
      }),
      t.length > 0 &&
        t.reverse().map((t) => {
          t === `}`
            ? e.push({ type: `brace`, value: `}` })
            : t === `]` && e.push({ type: `paren`, value: `]` });
        }),
      e
    );
  },
  IA = (e) => {
    let t = ``;
    return (
      e.map((e) => {
        switch (e.type) {
          case `string`:
            t += `"` + e.value + `"`;
            break;
          default:
            t += e.value;
            break;
        }
      }),
      t
    );
  },
  LA = (e) => JSON.parse(IA(FA(PA(NA(e))))),
  RA,
  zA,
  BA,
  VA,
  HA,
  UA,
  WA,
  GA,
  KA,
  qA,
  JA,
  YA,
  XA,
  ZA,
  QA,
  $A,
  ej,
  tj,
  nj,
  rj,
  ij,
  aj,
  oj = `__json_buf`,
  sj = class e {
    constructor() {
      RA.add(this),
        (this.messages = []),
        (this.receivedMessages = []),
        zA.set(this, void 0),
        (this.controller = new AbortController()),
        BA.set(this, void 0),
        VA.set(this, () => {}),
        HA.set(this, () => {}),
        UA.set(this, void 0),
        WA.set(this, () => {}),
        GA.set(this, () => {}),
        KA.set(this, {}),
        qA.set(this, !1),
        JA.set(this, !1),
        YA.set(this, !1),
        XA.set(this, !1),
        ZA.set(this, void 0),
        QA.set(this, void 0),
        tj.set(this, (e) => {
          if ((Z(this, JA, !0, `f`), KO(e) && (e = new YO()), e instanceof YO))
            return Z(this, YA, !0, `f`), this._emit(`abort`, e);
          if (e instanceof $) return this._emit(`error`, e);
          if (e instanceof Error) {
            let t = new $(e.message);
            return (t.cause = e), this._emit(`error`, t);
          }
          return this._emit(`error`, new $(String(e)));
        }),
        Z(
          this,
          BA,
          new Promise((e, t) => {
            Z(this, VA, e, `f`), Z(this, HA, t, `f`);
          }),
          `f`,
        ),
        Z(
          this,
          UA,
          new Promise((e, t) => {
            Z(this, WA, e, `f`), Z(this, GA, t, `f`);
          }),
          `f`,
        ),
        Q(this, BA, `f`).catch(() => {}),
        Q(this, UA, `f`).catch(() => {});
    }
    get response() {
      return Q(this, ZA, `f`);
    }
    get request_id() {
      return Q(this, QA, `f`);
    }
    async withResponse() {
      let e = await Q(this, BA, `f`);
      if (!e) throw Error("Could not resolve a `Response` object");
      return { data: this, response: e, request_id: e.headers.get(`request-id`) };
    }
    static fromReadableStream(t) {
      let n = new e();
      return n._run(() => n._fromReadableStream(t)), n;
    }
    static createMessage(t, n, r) {
      let i = new e();
      for (let e of n.messages) i._addMessageParam(e);
      return (
        i._run(() =>
          i._createMessage(
            t,
            { ...n, stream: !0 },
            { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": `stream` } },
          ),
        ),
        i
      );
    }
    _run(e) {
      e().then(
        () => {
          this._emitFinal(), this._emit(`end`);
        },
        Q(this, tj, `f`),
      );
    }
    _addMessageParam(e) {
      this.messages.push(e);
    }
    _addMessage(e, t = !0) {
      this.receivedMessages.push(e), t && this._emit(`message`, e);
    }
    async _createMessage(e, t, n) {
      let r = n?.signal;
      r &&
        (r.aborted && this.controller.abort(),
        r.addEventListener(`abort`, () => this.controller.abort())),
        Q(this, RA, `m`, nj).call(this);
      let { response: i, data: a } = await e
        .create({ ...t, stream: !0 }, { ...n, signal: this.controller.signal })
        .withResponse();
      this._connected(i);
      for await (let e of a) Q(this, RA, `m`, rj).call(this, e);
      if (a.controller.signal?.aborted) throw new YO();
      Q(this, RA, `m`, ij).call(this);
    }
    _connected(e) {
      this.ended ||
        (Z(this, ZA, e, `f`),
        Z(this, QA, e?.headers.get(`request-id`), `f`),
        Q(this, VA, `f`).call(this, e),
        this._emit(`connect`));
    }
    get ended() {
      return Q(this, qA, `f`);
    }
    get errored() {
      return Q(this, JA, `f`);
    }
    get aborted() {
      return Q(this, YA, `f`);
    }
    abort() {
      this.controller.abort();
    }
    on(e, t) {
      return (Q(this, KA, `f`)[e] || (Q(this, KA, `f`)[e] = [])).push({ listener: t }), this;
    }
    off(e, t) {
      let n = Q(this, KA, `f`)[e];
      if (!n) return this;
      let r = n.findIndex((e) => e.listener === t);
      return r >= 0 && n.splice(r, 1), this;
    }
    once(e, t) {
      return (
        (Q(this, KA, `f`)[e] || (Q(this, KA, `f`)[e] = [])).push({ listener: t, once: !0 }), this
      );
    }
    emitted(e) {
      return new Promise((t, n) => {
        Z(this, XA, !0, `f`), e !== `error` && this.once(`error`, n), this.once(e, t);
      });
    }
    async done() {
      Z(this, XA, !0, `f`), await Q(this, UA, `f`);
    }
    get currentMessage() {
      return Q(this, zA, `f`);
    }
    async finalMessage() {
      return await this.done(), Q(this, RA, `m`, $A).call(this);
    }
    async finalText() {
      return await this.done(), Q(this, RA, `m`, ej).call(this);
    }
    _emit(e, ...t) {
      if (Q(this, qA, `f`)) return;
      e === `end` && (Z(this, qA, !0, `f`), Q(this, WA, `f`).call(this));
      let n = Q(this, KA, `f`)[e];
      if (
        (n &&
          ((Q(this, KA, `f`)[e] = n.filter((e) => !e.once)),
          n.forEach(({ listener: e }) => e(...t))),
        e === `abort`)
      ) {
        let e = t[0];
        !Q(this, XA, `f`) && !n?.length && Promise.reject(e),
          Q(this, HA, `f`).call(this, e),
          Q(this, GA, `f`).call(this, e),
          this._emit(`end`);
        return;
      }
      if (e === `error`) {
        let e = t[0];
        !Q(this, XA, `f`) && !n?.length && Promise.reject(e),
          Q(this, HA, `f`).call(this, e),
          Q(this, GA, `f`).call(this, e),
          this._emit(`end`);
      }
    }
    _emitFinal() {
      this.receivedMessages.at(-1) && this._emit(`finalMessage`, Q(this, RA, `m`, $A).call(this));
    }
    async _fromReadableStream(e, t) {
      let n = t?.signal;
      n &&
        (n.aborted && this.controller.abort(),
        n.addEventListener(`abort`, () => this.controller.abort())),
        Q(this, RA, `m`, nj).call(this),
        this._connected(null);
      let r = qk.fromReadableStream(e, this.controller);
      for await (let e of r) Q(this, RA, `m`, rj).call(this, e);
      if (r.controller.signal?.aborted) throw new YO();
      Q(this, RA, `m`, ij).call(this);
    }
    [((zA = new WeakMap()),
    (BA = new WeakMap()),
    (VA = new WeakMap()),
    (HA = new WeakMap()),
    (UA = new WeakMap()),
    (WA = new WeakMap()),
    (GA = new WeakMap()),
    (KA = new WeakMap()),
    (qA = new WeakMap()),
    (JA = new WeakMap()),
    (YA = new WeakMap()),
    (XA = new WeakMap()),
    (ZA = new WeakMap()),
    (QA = new WeakMap()),
    (tj = new WeakMap()),
    (RA = new WeakSet()),
    ($A = function () {
      if (this.receivedMessages.length === 0)
        throw new $(`stream ended without producing a Message with role=assistant`);
      return this.receivedMessages.at(-1);
    }),
    (ej = function () {
      if (this.receivedMessages.length === 0)
        throw new $(`stream ended without producing a Message with role=assistant`);
      let e = this.receivedMessages
        .at(-1)
        .content.filter((e) => e.type === `text`)
        .map((e) => e.text);
      if (e.length === 0)
        throw new $(`stream ended without producing a content block with type=text`);
      return e.join(` `);
    }),
    (nj = function () {
      this.ended || Z(this, zA, void 0, `f`);
    }),
    (rj = function (e) {
      if (this.ended) return;
      let t = Q(this, RA, `m`, aj).call(this, e);
      switch ((this._emit(`streamEvent`, e, t), e.type)) {
        case `content_block_delta`: {
          let n = t.content.at(-1);
          switch (e.delta.type) {
            case `text_delta`:
              n.type === `text` && this._emit(`text`, e.delta.text, n.text || ``);
              break;
            case `citations_delta`:
              n.type === `text` && this._emit(`citation`, e.delta.citation, n.citations ?? []);
              break;
            case `input_json_delta`:
              (n.type === `tool_use` || n.type === `mcp_tool_use`) &&
                n.input &&
                this._emit(`inputJson`, e.delta.partial_json, n.input);
              break;
            case `thinking_delta`:
              n.type === `thinking` && this._emit(`thinking`, e.delta.thinking, n.thinking);
              break;
            case `signature_delta`:
              n.type === `thinking` && this._emit(`signature`, n.signature);
              break;
            default:
              e.delta;
          }
          break;
        }
        case `message_stop`:
          this._addMessageParam(t), this._addMessage(t, !0);
          break;
        case `content_block_stop`:
          this._emit(`contentBlock`, t.content.at(-1));
          break;
        case `message_start`:
          Z(this, zA, t, `f`);
          break;
        case `content_block_start`:
        case `message_delta`:
          break;
      }
    }),
    (ij = function () {
      if (this.ended) throw new $(`stream has ended, this shouldn't happen`);
      let e = Q(this, zA, `f`);
      if (!e) throw new $(`request ended without sending any chunks`);
      return Z(this, zA, void 0, `f`), e;
    }),
    (aj = function (e) {
      let t = Q(this, zA, `f`);
      if (e.type === `message_start`) {
        if (t) throw new $(`Unexpected event order, got ${e.type} before receiving "message_stop"`);
        return e.message;
      }
      if (!t) throw new $(`Unexpected event order, got ${e.type} before "message_start"`);
      switch (e.type) {
        case `message_stop`:
          return t;
        case `message_delta`:
          return (
            (t.container = e.delta.container),
            (t.stop_reason = e.delta.stop_reason),
            (t.stop_sequence = e.delta.stop_sequence),
            (t.usage.output_tokens = e.usage.output_tokens),
            e.usage.input_tokens != null && (t.usage.input_tokens = e.usage.input_tokens),
            e.usage.cache_creation_input_tokens != null &&
              (t.usage.cache_creation_input_tokens = e.usage.cache_creation_input_tokens),
            e.usage.cache_read_input_tokens != null &&
              (t.usage.cache_read_input_tokens = e.usage.cache_read_input_tokens),
            e.usage.server_tool_use != null && (t.usage.server_tool_use = e.usage.server_tool_use),
            t
          );
        case `content_block_start`:
          return t.content.push(e.content_block), t;
        case `content_block_delta`: {
          let n = t.content.at(e.index);
          switch (e.delta.type) {
            case `text_delta`:
              n?.type === `text` && (n.text += e.delta.text);
              break;
            case `citations_delta`:
              n?.type === `text` && ((n.citations ??= []), n.citations.push(e.delta.citation));
              break;
            case `input_json_delta`:
              if (n?.type === `tool_use` || n?.type === `mcp_tool_use`) {
                let t = n[oj] || ``;
                (t += e.delta.partial_json),
                  Object.defineProperty(n, oj, { value: t, enumerable: !1, writable: !0 }),
                  t && (n.input = LA(t));
              }
              break;
            case `thinking_delta`:
              n?.type === `thinking` && (n.thinking += e.delta.thinking);
              break;
            case `signature_delta`:
              n?.type === `thinking` && (n.signature = e.delta.signature);
              break;
            default:
              e.delta;
          }
          return t;
        }
        case `content_block_stop`:
          return t;
      }
    }),
    Symbol.asyncIterator)]() {
      let e = [],
        t = [],
        n = !1;
      return (
        this.on(`streamEvent`, (n) => {
          let r = t.shift();
          r ? r.resolve(n) : e.push(n);
        }),
        this.on(`end`, () => {
          n = !0;
          for (let e of t) e.resolve(void 0);
          t.length = 0;
        }),
        this.on(`abort`, (e) => {
          n = !0;
          for (let n of t) n.reject(e);
          t.length = 0;
        }),
        this.on(`error`, (e) => {
          n = !0;
          for (let n of t) n.reject(e);
          t.length = 0;
        }),
        {
          next: async () =>
            e.length
              ? { value: e.shift(), done: !1 }
              : n
                ? { value: void 0, done: !0 }
                : new Promise((e, n) => t.push({ resolve: e, reject: n })).then((e) =>
                    e ? { value: e, done: !1 } : { value: void 0, done: !0 },
                  ),
          return: async () => (this.abort(), { value: void 0, done: !0 }),
        }
      );
    }
    toReadableStream() {
      return new qk(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
    }
  },
  cj = {
    "claude-opus-4-20250514": 8192,
    "claude-opus-4-0": 8192,
    "claude-4-opus-20250514": 8192,
    "anthropic.claude-opus-4-20250514-v1:0": 8192,
    "claude-opus-4@20250514": 8192,
  },
  lj = {
    "claude-1.3": `November 6th, 2024`,
    "claude-1.3-100k": `November 6th, 2024`,
    "claude-instant-1.1": `November 6th, 2024`,
    "claude-instant-1.1-100k": `November 6th, 2024`,
    "claude-instant-1.2": `November 6th, 2024`,
    "claude-3-sonnet-20240229": `July 21st, 2025`,
    "claude-2.1": `July 21st, 2025`,
    "claude-2.0": `July 21st, 2025`,
  },
  uj = class extends SA {
    constructor() {
      super(...arguments), (this.batches = new MA(this._client));
    }
    create(e, t) {
      let { betas: n, ...r } = e;
      r.model in lj &&
        console.warn(
          `The model '${r.model}' is deprecated and will reach end-of-life on ${lj[r.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`,
        );
      let i = this._client._options.timeout;
      if (!r.stream && i == null) {
        let e = cj[r.model] ?? void 0;
        i = this._client.calculateNonstreamingTimeout(r.max_tokens, e);
      }
      return this._client.post(`/v1/messages?beta=true`, {
        body: r,
        timeout: i ?? 6e5,
        ...t,
        headers: EA([
          { ...(n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() }) },
          t?.headers,
        ]),
        stream: e.stream ?? !1,
      });
    }
    stream(e, t) {
      return sj.createMessage(this, e, t);
    }
    countTokens(e, t) {
      let { betas: n, ...r } = e;
      return this._client.post(`/v1/messages/count_tokens?beta=true`, {
        body: r,
        ...t,
        headers: EA([
          { "anthropic-beta": [...(n ?? []), `token-counting-2024-11-01`].toString() },
          t?.headers,
        ]),
      });
    }
  };
uj.Batches = MA;
var dj = class extends SA {
  constructor() {
    super(...arguments),
      (this.models = new AA(this._client)),
      (this.messages = new uj(this._client)),
      (this.files = new kA(this._client));
  }
};
(dj.Models = AA), (dj.Messages = uj), (dj.Files = kA);
var fj = class extends SA {
    create(e, t) {
      let { betas: n, ...r } = e;
      return this._client.post(`/v1/complete`, {
        body: r,
        timeout: this._client._options.timeout ?? 6e5,
        ...t,
        headers: EA([
          { ...(n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() }) },
          t?.headers,
        ]),
        stream: e.stream ?? !1,
      });
    }
  },
  pj,
  mj,
  hj,
  gj,
  _j,
  vj,
  yj,
  bj,
  xj,
  Sj,
  Cj,
  wj,
  Tj,
  Ej,
  Dj,
  Oj,
  kj,
  Aj,
  jj,
  Mj,
  Nj,
  Pj,
  Fj = `__json_buf`,
  Ij = class e {
    constructor() {
      pj.add(this),
        (this.messages = []),
        (this.receivedMessages = []),
        mj.set(this, void 0),
        (this.controller = new AbortController()),
        hj.set(this, void 0),
        gj.set(this, () => {}),
        _j.set(this, () => {}),
        vj.set(this, void 0),
        yj.set(this, () => {}),
        bj.set(this, () => {}),
        xj.set(this, {}),
        Sj.set(this, !1),
        Cj.set(this, !1),
        wj.set(this, !1),
        Tj.set(this, !1),
        Ej.set(this, void 0),
        Dj.set(this, void 0),
        Aj.set(this, (e) => {
          if ((Z(this, Cj, !0, `f`), KO(e) && (e = new YO()), e instanceof YO))
            return Z(this, wj, !0, `f`), this._emit(`abort`, e);
          if (e instanceof $) return this._emit(`error`, e);
          if (e instanceof Error) {
            let t = new $(e.message);
            return (t.cause = e), this._emit(`error`, t);
          }
          return this._emit(`error`, new $(String(e)));
        }),
        Z(
          this,
          hj,
          new Promise((e, t) => {
            Z(this, gj, e, `f`), Z(this, _j, t, `f`);
          }),
          `f`,
        ),
        Z(
          this,
          vj,
          new Promise((e, t) => {
            Z(this, yj, e, `f`), Z(this, bj, t, `f`);
          }),
          `f`,
        ),
        Q(this, hj, `f`).catch(() => {}),
        Q(this, vj, `f`).catch(() => {});
    }
    get response() {
      return Q(this, Ej, `f`);
    }
    get request_id() {
      return Q(this, Dj, `f`);
    }
    async withResponse() {
      let e = await Q(this, hj, `f`);
      if (!e) throw Error("Could not resolve a `Response` object");
      return { data: this, response: e, request_id: e.headers.get(`request-id`) };
    }
    static fromReadableStream(t) {
      let n = new e();
      return n._run(() => n._fromReadableStream(t)), n;
    }
    static createMessage(t, n, r) {
      let i = new e();
      for (let e of n.messages) i._addMessageParam(e);
      return (
        i._run(() =>
          i._createMessage(
            t,
            { ...n, stream: !0 },
            { ...r, headers: { ...r?.headers, "X-Stainless-Helper-Method": `stream` } },
          ),
        ),
        i
      );
    }
    _run(e) {
      e().then(
        () => {
          this._emitFinal(), this._emit(`end`);
        },
        Q(this, Aj, `f`),
      );
    }
    _addMessageParam(e) {
      this.messages.push(e);
    }
    _addMessage(e, t = !0) {
      this.receivedMessages.push(e), t && this._emit(`message`, e);
    }
    async _createMessage(e, t, n) {
      let r = n?.signal;
      r &&
        (r.aborted && this.controller.abort(),
        r.addEventListener(`abort`, () => this.controller.abort())),
        Q(this, pj, `m`, jj).call(this);
      let { response: i, data: a } = await e
        .create({ ...t, stream: !0 }, { ...n, signal: this.controller.signal })
        .withResponse();
      this._connected(i);
      for await (let e of a) Q(this, pj, `m`, Mj).call(this, e);
      if (a.controller.signal?.aborted) throw new YO();
      Q(this, pj, `m`, Nj).call(this);
    }
    _connected(e) {
      this.ended ||
        (Z(this, Ej, e, `f`),
        Z(this, Dj, e?.headers.get(`request-id`), `f`),
        Q(this, gj, `f`).call(this, e),
        this._emit(`connect`));
    }
    get ended() {
      return Q(this, Sj, `f`);
    }
    get errored() {
      return Q(this, Cj, `f`);
    }
    get aborted() {
      return Q(this, wj, `f`);
    }
    abort() {
      this.controller.abort();
    }
    on(e, t) {
      return (Q(this, xj, `f`)[e] || (Q(this, xj, `f`)[e] = [])).push({ listener: t }), this;
    }
    off(e, t) {
      let n = Q(this, xj, `f`)[e];
      if (!n) return this;
      let r = n.findIndex((e) => e.listener === t);
      return r >= 0 && n.splice(r, 1), this;
    }
    once(e, t) {
      return (
        (Q(this, xj, `f`)[e] || (Q(this, xj, `f`)[e] = [])).push({ listener: t, once: !0 }), this
      );
    }
    emitted(e) {
      return new Promise((t, n) => {
        Z(this, Tj, !0, `f`), e !== `error` && this.once(`error`, n), this.once(e, t);
      });
    }
    async done() {
      Z(this, Tj, !0, `f`), await Q(this, vj, `f`);
    }
    get currentMessage() {
      return Q(this, mj, `f`);
    }
    async finalMessage() {
      return await this.done(), Q(this, pj, `m`, Oj).call(this);
    }
    async finalText() {
      return await this.done(), Q(this, pj, `m`, kj).call(this);
    }
    _emit(e, ...t) {
      if (Q(this, Sj, `f`)) return;
      e === `end` && (Z(this, Sj, !0, `f`), Q(this, yj, `f`).call(this));
      let n = Q(this, xj, `f`)[e];
      if (
        (n &&
          ((Q(this, xj, `f`)[e] = n.filter((e) => !e.once)),
          n.forEach(({ listener: e }) => e(...t))),
        e === `abort`)
      ) {
        let e = t[0];
        !Q(this, Tj, `f`) && !n?.length && Promise.reject(e),
          Q(this, _j, `f`).call(this, e),
          Q(this, bj, `f`).call(this, e),
          this._emit(`end`);
        return;
      }
      if (e === `error`) {
        let e = t[0];
        !Q(this, Tj, `f`) && !n?.length && Promise.reject(e),
          Q(this, _j, `f`).call(this, e),
          Q(this, bj, `f`).call(this, e),
          this._emit(`end`);
      }
    }
    _emitFinal() {
      this.receivedMessages.at(-1) && this._emit(`finalMessage`, Q(this, pj, `m`, Oj).call(this));
    }
    async _fromReadableStream(e, t) {
      let n = t?.signal;
      n &&
        (n.aborted && this.controller.abort(),
        n.addEventListener(`abort`, () => this.controller.abort())),
        Q(this, pj, `m`, jj).call(this),
        this._connected(null);
      let r = qk.fromReadableStream(e, this.controller);
      for await (let e of r) Q(this, pj, `m`, Mj).call(this, e);
      if (r.controller.signal?.aborted) throw new YO();
      Q(this, pj, `m`, Nj).call(this);
    }
    [((mj = new WeakMap()),
    (hj = new WeakMap()),
    (gj = new WeakMap()),
    (_j = new WeakMap()),
    (vj = new WeakMap()),
    (yj = new WeakMap()),
    (bj = new WeakMap()),
    (xj = new WeakMap()),
    (Sj = new WeakMap()),
    (Cj = new WeakMap()),
    (wj = new WeakMap()),
    (Tj = new WeakMap()),
    (Ej = new WeakMap()),
    (Dj = new WeakMap()),
    (Aj = new WeakMap()),
    (pj = new WeakSet()),
    (Oj = function () {
      if (this.receivedMessages.length === 0)
        throw new $(`stream ended without producing a Message with role=assistant`);
      return this.receivedMessages.at(-1);
    }),
    (kj = function () {
      if (this.receivedMessages.length === 0)
        throw new $(`stream ended without producing a Message with role=assistant`);
      let e = this.receivedMessages
        .at(-1)
        .content.filter((e) => e.type === `text`)
        .map((e) => e.text);
      if (e.length === 0)
        throw new $(`stream ended without producing a content block with type=text`);
      return e.join(` `);
    }),
    (jj = function () {
      this.ended || Z(this, mj, void 0, `f`);
    }),
    (Mj = function (e) {
      if (this.ended) return;
      let t = Q(this, pj, `m`, Pj).call(this, e);
      switch ((this._emit(`streamEvent`, e, t), e.type)) {
        case `content_block_delta`: {
          let n = t.content.at(-1);
          switch (e.delta.type) {
            case `text_delta`:
              n.type === `text` && this._emit(`text`, e.delta.text, n.text || ``);
              break;
            case `citations_delta`:
              n.type === `text` && this._emit(`citation`, e.delta.citation, n.citations ?? []);
              break;
            case `input_json_delta`:
              n.type === `tool_use` &&
                n.input &&
                this._emit(`inputJson`, e.delta.partial_json, n.input);
              break;
            case `thinking_delta`:
              n.type === `thinking` && this._emit(`thinking`, e.delta.thinking, n.thinking);
              break;
            case `signature_delta`:
              n.type === `thinking` && this._emit(`signature`, n.signature);
              break;
            default:
              e.delta;
          }
          break;
        }
        case `message_stop`:
          this._addMessageParam(t), this._addMessage(t, !0);
          break;
        case `content_block_stop`:
          this._emit(`contentBlock`, t.content.at(-1));
          break;
        case `message_start`:
          Z(this, mj, t, `f`);
          break;
        case `content_block_start`:
        case `message_delta`:
          break;
      }
    }),
    (Nj = function () {
      if (this.ended) throw new $(`stream has ended, this shouldn't happen`);
      let e = Q(this, mj, `f`);
      if (!e) throw new $(`request ended without sending any chunks`);
      return Z(this, mj, void 0, `f`), e;
    }),
    (Pj = function (e) {
      let t = Q(this, mj, `f`);
      if (e.type === `message_start`) {
        if (t) throw new $(`Unexpected event order, got ${e.type} before receiving "message_stop"`);
        return e.message;
      }
      if (!t) throw new $(`Unexpected event order, got ${e.type} before "message_start"`);
      switch (e.type) {
        case `message_stop`:
          return t;
        case `message_delta`:
          return (
            (t.stop_reason = e.delta.stop_reason),
            (t.stop_sequence = e.delta.stop_sequence),
            (t.usage.output_tokens = e.usage.output_tokens),
            e.usage.input_tokens != null && (t.usage.input_tokens = e.usage.input_tokens),
            e.usage.cache_creation_input_tokens != null &&
              (t.usage.cache_creation_input_tokens = e.usage.cache_creation_input_tokens),
            e.usage.cache_read_input_tokens != null &&
              (t.usage.cache_read_input_tokens = e.usage.cache_read_input_tokens),
            e.usage.server_tool_use != null && (t.usage.server_tool_use = e.usage.server_tool_use),
            t
          );
        case `content_block_start`:
          return t.content.push(e.content_block), t;
        case `content_block_delta`: {
          let n = t.content.at(e.index);
          switch (e.delta.type) {
            case `text_delta`:
              n?.type === `text` && (n.text += e.delta.text);
              break;
            case `citations_delta`:
              n?.type === `text` && ((n.citations ??= []), n.citations.push(e.delta.citation));
              break;
            case `input_json_delta`:
              if (n?.type === `tool_use`) {
                let t = n[Fj] || ``;
                (t += e.delta.partial_json),
                  Object.defineProperty(n, Fj, { value: t, enumerable: !1, writable: !0 }),
                  t && (n.input = LA(t));
              }
              break;
            case `thinking_delta`:
              n?.type === `thinking` && (n.thinking += e.delta.thinking);
              break;
            case `signature_delta`:
              n?.type === `thinking` && (n.signature = e.delta.signature);
              break;
            default:
              e.delta;
          }
          return t;
        }
        case `content_block_stop`:
          return t;
      }
    }),
    Symbol.asyncIterator)]() {
      let e = [],
        t = [],
        n = !1;
      return (
        this.on(`streamEvent`, (n) => {
          let r = t.shift();
          r ? r.resolve(n) : e.push(n);
        }),
        this.on(`end`, () => {
          n = !0;
          for (let e of t) e.resolve(void 0);
          t.length = 0;
        }),
        this.on(`abort`, (e) => {
          n = !0;
          for (let n of t) n.reject(e);
          t.length = 0;
        }),
        this.on(`error`, (e) => {
          n = !0;
          for (let n of t) n.reject(e);
          t.length = 0;
        }),
        {
          next: async () =>
            e.length
              ? { value: e.shift(), done: !1 }
              : n
                ? { value: void 0, done: !0 }
                : new Promise((e, n) => t.push({ resolve: e, reject: n })).then((e) =>
                    e ? { value: e, done: !1 } : { value: void 0, done: !0 },
                  ),
          return: async () => (this.abort(), { value: void 0, done: !0 }),
        }
      );
    }
    toReadableStream() {
      return new qk(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
    }
  },
  Lj = class extends SA {
    create(e, t) {
      return this._client.post(`/v1/messages/batches`, { body: e, ...t });
    }
    retrieve(e, t) {
      return this._client.get(OA`/v1/messages/batches/${e}`, t);
    }
    list(e = {}, t) {
      return this._client.getAPIList(`/v1/messages/batches`, aA, { query: e, ...t });
    }
    delete(e, t) {
      return this._client.delete(OA`/v1/messages/batches/${e}`, t);
    }
    cancel(e, t) {
      return this._client.post(OA`/v1/messages/batches/${e}/cancel`, t);
    }
    async results(e, t) {
      let n = await this.retrieve(e);
      if (!n.results_url)
        throw new $(
          `No batch \`results_url\`; Has it finished processing? ${n.processing_status} - ${n.id}`,
        );
      return this._client
        .get(n.results_url, {
          ...t,
          headers: EA([{ Accept: `application/binary` }, t?.headers]),
          stream: !0,
          __binaryResponse: !0,
        })
        ._thenUnwrap((e, t) => jA.fromResponse(t.response, t.controller));
    }
  },
  Rj = class extends SA {
    constructor() {
      super(...arguments), (this.batches = new Lj(this._client));
    }
    create(e, t) {
      e.model in zj &&
        console.warn(
          `The model '${e.model}' is deprecated and will reach end-of-life on ${zj[e.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`,
        );
      let n = this._client._options.timeout;
      if (!e.stream && n == null) {
        let t = cj[e.model] ?? void 0;
        n = this._client.calculateNonstreamingTimeout(e.max_tokens, t);
      }
      return this._client.post(`/v1/messages`, {
        body: e,
        timeout: n ?? 6e5,
        ...t,
        stream: e.stream ?? !1,
      });
    }
    stream(e, t) {
      return Ij.createMessage(this, e, t);
    }
    countTokens(e, t) {
      return this._client.post(`/v1/messages/count_tokens`, { body: e, ...t });
    }
  },
  zj = {
    "claude-1.3": `November 6th, 2024`,
    "claude-1.3-100k": `November 6th, 2024`,
    "claude-instant-1.1": `November 6th, 2024`,
    "claude-instant-1.1-100k": `November 6th, 2024`,
    "claude-instant-1.2": `November 6th, 2024`,
    "claude-3-sonnet-20240229": `July 21st, 2025`,
    "claude-2.1": `July 21st, 2025`,
    "claude-2.0": `July 21st, 2025`,
  };
Rj.Batches = Lj;
var Bj = class extends SA {
    retrieve(e, t = {}, n) {
      let { betas: r } = t ?? {};
      return this._client.get(OA`/v1/models/${e}`, {
        ...n,
        headers: EA([
          { ...(r?.toString() == null ? void 0 : { "anthropic-beta": r?.toString() }) },
          n?.headers,
        ]),
      });
    }
    list(e = {}, t) {
      let { betas: n, ...r } = e ?? {};
      return this._client.getAPIList(`/v1/models`, aA, {
        query: r,
        ...t,
        headers: EA([
          { ...(n?.toString() == null ? void 0 : { "anthropic-beta": n?.toString() }) },
          t?.headers,
        ]),
      });
    }
  },
  Vj = (e) => {
    if (globalThis.process !== void 0) return {}?.[e]?.trim() ?? void 0;
    if (globalThis.Deno !== void 0) return globalThis.Deno.env?.get?.(e)?.trim();
  },
  Hj,
  Uj,
  Wj = class {
    constructor({
      baseURL: e = Vj(`ANTHROPIC_BASE_URL`),
      apiKey: t = Vj(`ANTHROPIC_API_KEY`) ?? null,
      authToken: n = Vj(`ANTHROPIC_AUTH_TOKEN`) ?? null,
      ...r
    } = {}) {
      Uj.set(this, void 0);
      let i = { apiKey: t, authToken: n, ...r, baseURL: e || `https://api.anthropic.com` };
      if (!i.dangerouslyAllowBrowser && Ck())
        throw new $(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);
      (this.baseURL = i.baseURL),
        (this.timeout = i.timeout ?? Gj.DEFAULT_TIMEOUT),
        (this.logger = i.logger ?? console);
      let a = `warn`;
      (this.logLevel = a),
        (this.logLevel =
          hk(i.logLevel, `ClientOptions.logLevel`, this) ??
          hk(Vj(`ANTHROPIC_LOG`), `process.env['ANTHROPIC_LOG']`, this) ??
          a),
        (this.fetchOptions = i.fetchOptions),
        (this.maxRetries = i.maxRetries ?? 2),
        (this.fetch = i.fetch ?? jk()),
        Z(this, Uj, Ik, `f`),
        (this._options = i),
        (this.apiKey = t),
        (this.authToken = n);
    }
    withOptions(e) {
      return new this.constructor({
        ...this._options,
        baseURL: this.baseURL,
        maxRetries: this.maxRetries,
        timeout: this.timeout,
        logger: this.logger,
        logLevel: this.logLevel,
        fetchOptions: this.fetchOptions,
        apiKey: this.apiKey,
        authToken: this.authToken,
        ...e,
      });
    }
    defaultQuery() {
      return this._options.defaultQuery;
    }
    validateHeaders({ values: e, nulls: t }) {
      if (
        !(this.apiKey && e.get(`x-api-key`)) &&
        !t.has(`x-api-key`) &&
        !(this.authToken && e.get(`authorization`)) &&
        !t.has(`authorization`)
      )
        throw Error(
          `Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted`,
        );
    }
    authHeaders(e) {
      return EA([this.apiKeyAuth(e), this.bearerAuth(e)]);
    }
    apiKeyAuth(e) {
      if (this.apiKey != null) return EA([{ "X-Api-Key": this.apiKey }]);
    }
    bearerAuth(e) {
      if (this.authToken != null) return EA([{ Authorization: `Bearer ${this.authToken}` }]);
    }
    stringifyQuery(e) {
      return Object.entries(e)
        .filter(([e, t]) => t !== void 0)
        .map(([e, t]) => {
          if (typeof t == `string` || typeof t == `number` || typeof t == `boolean`)
            return `${encodeURIComponent(e)}=${encodeURIComponent(t)}`;
          if (t === null) return `${encodeURIComponent(e)}=`;
          throw new $(
            `Cannot stringify type ${typeof t}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`,
          );
        })
        .join(`&`);
    }
    getUserAgent() {
      return `${this.constructor.name}/JS ${Sk}`;
    }
    defaultIdempotencyKey() {
      return `stainless-node-retry-${GO()}`;
    }
    makeStatusError(e, t, n, r) {
      return JO.generate(e, t, n, r);
    }
    buildURL(e, t) {
      let n = sk(e)
          ? new URL(e)
          : new URL(
              this.baseURL + (this.baseURL.endsWith(`/`) && e.startsWith(`/`) ? e.slice(1) : e),
            ),
        r = this.defaultQuery();
      return (
        lk(r) || (t = { ...r, ...t }),
        typeof t == `object` && t && !Array.isArray(t) && (n.search = this.stringifyQuery(t)),
        n.toString()
      );
    }
    _calculateNonstreamingTimeout(e) {
      if ((3600 * e) / 128e3 > 600)
        throw new $(
          `Streaming is strongly recommended for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-python#streaming-responses for more details`,
        );
      return 600 * 1e3;
    }
    async prepareOptions(e) {}
    async prepareRequest(e, { url: t, options: n }) {}
    get(e, t) {
      return this.methodRequest(`get`, e, t);
    }
    post(e, t) {
      return this.methodRequest(`post`, e, t);
    }
    patch(e, t) {
      return this.methodRequest(`patch`, e, t);
    }
    put(e, t) {
      return this.methodRequest(`put`, e, t);
    }
    delete(e, t) {
      return this.methodRequest(`delete`, e, t);
    }
    methodRequest(e, t, n) {
      return this.request(Promise.resolve(n).then((n) => ({ method: e, path: t, ...n })));
    }
    request(e, t = null) {
      return new tA(this, this.makeRequest(e, t, void 0));
    }
    async makeRequest(e, t, n) {
      let r = await e,
        i = r.maxRetries ?? this.maxRetries;
      (t ??= i), await this.prepareOptions(r);
      let { req: a, url: o, timeout: s } = this.buildRequest(r, { retryCount: i - t });
      await this.prepareRequest(a, { url: o, options: r });
      let c = `log_` + ((Math.random() * (1 << 24)) | 0).toString(16).padStart(6, `0`),
        l = n === void 0 ? `` : `, retryOf: ${n}`,
        u = Date.now();
      if (
        (bk(this).debug(
          `[${c}] sending request`,
          xk({ retryOfRequestLogID: n, method: r.method, url: o, options: r, headers: a.headers }),
        ),
        r.signal?.aborted)
      )
        throw new YO();
      let d = new AbortController(),
        f = await this.fetchWithTimeout(o, a, s, d).catch(qO),
        p = Date.now();
      if (f instanceof Error) {
        let e = `retrying, ${t} attempts remaining`;
        if (r.signal?.aborted) throw new YO();
        let i = KO(f) || /timed? ?out/i.test(String(f) + (`cause` in f ? String(f.cause) : ``));
        if (t)
          return (
            bk(this).info(`[${c}] connection ${i ? `timed out` : `failed`} - ${e}`),
            bk(this).debug(
              `[${c}] connection ${i ? `timed out` : `failed`} (${e})`,
              xk({ retryOfRequestLogID: n, url: o, durationMs: p - u, message: f.message }),
            ),
            this.retryRequest(r, t, n ?? c)
          );
        throw (
          (bk(this).info(
            `[${c}] connection ${i ? `timed out` : `failed`} - error; no more retries left`,
          ),
          bk(this).debug(
            `[${c}] connection ${i ? `timed out` : `failed`} (error; no more retries left)`,
            xk({ retryOfRequestLogID: n, url: o, durationMs: p - u, message: f.message }),
          ),
          i ? new ZO() : new XO({ cause: f }))
        );
      }
      let m = `[${c}${l}${[...f.headers.entries()]
        .filter(([e]) => e === `request-id`)
        .map(([e, t]) => `, ` + e + `: ` + JSON.stringify(t))
        .join(
          ``,
        )}] ${a.method} ${o} ${f.ok ? `succeeded` : `failed`} with status ${f.status} in ${p - u}ms`;
      if (!f.ok) {
        let e = this.shouldRetry(f);
        if (t && e) {
          let e = `retrying, ${t} attempts remaining`;
          return (
            await Fk(f.body),
            bk(this).info(`${m} - ${e}`),
            bk(this).debug(
              `[${c}] response error (${e})`,
              xk({
                retryOfRequestLogID: n,
                url: f.url,
                status: f.status,
                headers: f.headers,
                durationMs: p - u,
              }),
            ),
            this.retryRequest(r, t, n ?? c, f.headers)
          );
        }
        let i = e ? `error; no more retries left` : `error; not retryable`;
        bk(this).info(`${m} - ${i}`);
        let a = await f.text().catch((e) => qO(e).message),
          o = fk(a),
          s = o ? void 0 : a;
        throw (
          (bk(this).debug(
            `[${c}] response error (${i})`,
            xk({
              retryOfRequestLogID: n,
              url: f.url,
              status: f.status,
              headers: f.headers,
              message: s,
              durationMs: Date.now() - u,
            }),
          ),
          this.makeStatusError(f.status, o, s, f.headers))
        );
      }
      return (
        bk(this).info(m),
        bk(this).debug(
          `[${c}] response start`,
          xk({
            retryOfRequestLogID: n,
            url: f.url,
            status: f.status,
            headers: f.headers,
            durationMs: p - u,
          }),
        ),
        {
          response: f,
          options: r,
          controller: d,
          requestLogID: c,
          retryOfRequestLogID: n,
          startTime: u,
        }
      );
    }
    getAPIList(e, t, n) {
      return this.requestAPIList(t, { method: `get`, path: e, ...n });
    }
    requestAPIList(e, t) {
      let n = this.makeRequest(t, null, void 0);
      return new iA(this, n, e);
    }
    async fetchWithTimeout(e, t, n, r) {
      let { signal: i, method: a, ...o } = t || {};
      i && i.addEventListener(`abort`, () => r.abort());
      let s = setTimeout(() => r.abort(), n),
        c =
          (globalThis.ReadableStream && o.body instanceof globalThis.ReadableStream) ||
          (typeof o.body == `object` && o.body !== null && Symbol.asyncIterator in o.body),
        l = { signal: r.signal, ...(c ? { duplex: `half` } : {}), method: `GET`, ...o };
      a && (l.method = a.toUpperCase());
      try {
        return await this.fetch.call(void 0, e, l);
      } finally {
        clearTimeout(s);
      }
    }
    shouldRetry(e) {
      let t = e.headers.get(`x-should-retry`);
      return t === `true`
        ? !0
        : t === `false`
          ? !1
          : e.status === 408 || e.status === 409 || e.status === 429 || e.status >= 500;
    }
    async retryRequest(e, t, n, r) {
      let i,
        a = r?.get(`retry-after-ms`);
      if (a) {
        let e = parseFloat(a);
        Number.isNaN(e) || (i = e);
      }
      let o = r?.get(`retry-after`);
      if (o && !i) {
        let e = parseFloat(o);
        i = Number.isNaN(e) ? Date.parse(o) - Date.now() : e * 1e3;
      }
      if (!(i && 0 <= i && i < 60 * 1e3)) {
        let n = e.maxRetries ?? this.maxRetries;
        i = this.calculateDefaultRetryTimeoutMillis(t, n);
      }
      return await pk(i), this.makeRequest(e, t - 1, n);
    }
    calculateDefaultRetryTimeoutMillis(e, t) {
      let n = t - e;
      return Math.min(0.5 * 2 ** n, 8) * (1 - Math.random() * 0.25) * 1e3;
    }
    calculateNonstreamingTimeout(e, t) {
      let n = 600 * 1e3;
      if ((36e5 * e) / 128e3 > n || (t != null && e > t))
        throw new $(
          `Streaming is strongly recommended for operations that may token longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details`,
        );
      return n;
    }
    buildRequest(e, { retryCount: t = 0 } = {}) {
      let n = { ...e },
        { method: r, path: i, query: a } = n,
        o = this.buildURL(i, a);
      `timeout` in n && dk(`timeout`, n.timeout), (n.timeout = n.timeout ?? this.timeout);
      let { bodyHeaders: s, body: c } = this.buildBody({ options: n });
      return {
        req: {
          method: r,
          headers: this.buildHeaders({ options: e, method: r, bodyHeaders: s, retryCount: t }),
          ...(n.signal && { signal: n.signal }),
          ...(globalThis.ReadableStream &&
            c instanceof globalThis.ReadableStream && { duplex: `half` }),
          ...(c && { body: c }),
          ...(this.fetchOptions ?? {}),
          ...(n.fetchOptions ?? {}),
        },
        url: o,
        timeout: n.timeout,
      };
    }
    buildHeaders({ options: e, method: t, bodyHeaders: n, retryCount: r }) {
      let i = {};
      this.idempotencyHeader &&
        t !== `get` &&
        ((e.idempotencyKey ||= this.defaultIdempotencyKey()),
        (i[this.idempotencyHeader] = e.idempotencyKey));
      let a = EA([
        i,
        {
          Accept: `application/json`,
          "User-Agent": this.getUserAgent(),
          "X-Stainless-Retry-Count": String(r),
          ...(e.timeout ? { "X-Stainless-Timeout": String(Math.trunc(e.timeout / 1e3)) } : {}),
          ...Ak(),
          ...(this._options.dangerouslyAllowBrowser
            ? { "anthropic-dangerous-direct-browser-access": `true` }
            : void 0),
          "anthropic-version": `2023-06-01`,
        },
        this.authHeaders(e),
        this._options.defaultHeaders,
        n,
        e.headers,
      ]);
      return this.validateHeaders(a), a.values;
    }
    buildBody({ options: { body: e, headers: t } }) {
      if (!e) return { bodyHeaders: void 0, body: void 0 };
      let n = EA([t]);
      return ArrayBuffer.isView(e) ||
        e instanceof ArrayBuffer ||
        e instanceof DataView ||
        (typeof e == `string` && n.values.has(`content-type`)) ||
        e instanceof Blob ||
        e instanceof FormData ||
        e instanceof URLSearchParams ||
        (globalThis.ReadableStream && e instanceof globalThis.ReadableStream)
        ? { bodyHeaders: void 0, body: e }
        : typeof e == `object` &&
            (Symbol.asyncIterator in e ||
              (Symbol.iterator in e && `next` in e && typeof e.next == `function`))
          ? { bodyHeaders: void 0, body: Nk(e) }
          : Q(this, Uj, `f`).call(this, { body: e, headers: n });
    }
  };
(Hj = Wj),
  (Uj = new WeakMap()),
  (Wj.Anthropic = Hj),
  (Wj.HUMAN_PROMPT = `

Human:`),
  (Wj.AI_PROMPT = `

Assistant:`),
  (Wj.DEFAULT_TIMEOUT = 6e5),
  (Wj.AnthropicError = $),
  (Wj.APIError = JO),
  (Wj.APIConnectionError = XO),
  (Wj.APIConnectionTimeoutError = ZO),
  (Wj.APIUserAbortError = YO),
  (Wj.NotFoundError = tk),
  (Wj.ConflictError = nk),
  (Wj.RateLimitError = ik),
  (Wj.BadRequestError = QO),
  (Wj.AuthenticationError = $O),
  (Wj.InternalServerError = ak),
  (Wj.PermissionDeniedError = ek),
  (Wj.UnprocessableEntityError = rk),
  (Wj.toFile = yA);
var Gj = class extends Wj {
  constructor() {
    super(...arguments),
      (this.completions = new fj(this)),
      (this.messages = new Rj(this)),
      (this.models = new Bj(this)),
      (this.beta = new dj(this));
  }
};
(Gj.Completions = fj), (Gj.Messages = Rj), (Gj.Models = Bj), (Gj.Beta = dj);
var { HUMAN_PROMPT: Kj, AI_PROMPT: qj } = Gj;
function Jj() {
  return Sl.prompt({
    customRules: [
      `Use VStack for vertical layouts, HStack for horizontal layouts, Box for generic containers.`,
      `Use spacing tokens for gap/padding: 'spacingX.xs' (4px), 'spacingX.sm' (8px), 'spacingX.md' (16px), 'spacingX.lg' (24px), 'spacingX.xl' (32px). Same pattern for spacingY.`,
      `Use 'full' for 100% width/height.`,
      `TextField MUST contain a TextFieldInput or TextFieldTextarea child. Never use TextField without an input child.`,
      `TabsRoot MUST contain: (1) a TabsList with TabsTrigger children, and (2) TabsContent siblings. TabsTrigger.value must match TabsContent.value.`,
      `AlertDialog compound: AlertDialogRoot > AlertDialogContent > [AlertDialogHeader > (AlertDialogTitle + AlertDialogDescription), AlertDialogFooter > AlertDialogAction].`,
      `RadioGroup MUST contain RadioGroupItem children. Each RadioGroupItem needs a unique value prop.`,
      `CheckboxGroup MUST contain Checkbox children.`,
      `RadioSelectBoxRoot MUST contain RadioSelectBoxItem children.`,
      `CheckSelectBoxGroup MUST contain CheckSelectBox children.`,
      `Text textStyle values from largest to smallest: t1Bold > t2Bold > t3Bold > t4Bold > t5Regular (default) > t6Regular > t7Regular. Use Bold variants for headings.`,
      `Text color tokens: 'fg.neutral' (primary text), 'fg.neutralSubtle' (secondary text), 'fg.brand' (brand color), 'fg.critical' (error).`,
      `Write all user-facing labels and content in Korean (당근 design system). Example: '주문하기', '이메일 입력', '확인'.`,
      `Do NOT use icon props (prefixIcon, suffixIcon) - they are not available in this catalog.`,
    ],
  });
}
function Yj(e) {
  let t = Uo(),
    n = ``,
    r = ``;
  function i(i) {
    n += i;
    let a = n.split(`
`);
    n = a.pop() ?? ``;
    for (let n of a) {
      let i = n.trim();
      if (i)
        if (i.startsWith(`{`) && i.includes(`"op"`))
          try {
            let { result: n } = t.push(i);
            n && e.onPartialSpec && e.onPartialSpec(n);
          } catch {}
        else
          (r +=
            i +
            `
`),
            e.onText?.(i);
    }
  }
  function a() {
    n.trim() &&
      i(`
`);
    let a = t.getResult();
    return e.onComplete?.(a), { spec: a, text: r };
  }
  return { processChunk: i, finish: a };
}
async function Xj(e) {
  let t = e.apiKey ?? {}.ANTHROPIC_API_KEY;
  if (!t)
    throw Error(
      `ANTHROPIC_API_KEY is required. Set it as an environment variable or pass it via options.apiKey.`,
    );
  let n = new Gj({ apiKey: t }),
    r = Jj(),
    i = Zs({ prompt: e.prompt, currentSpec: e.currentSpec }),
    a = Yj({ onPartialSpec: e.onPartialSpec, onText: e.onText }),
    o = n.messages.stream({
      model: e.model ?? `claude-sonnet-4-20250514`,
      max_tokens: 4096,
      system: r,
      messages: [{ role: `user`, content: i }],
    });
  for await (let e of o)
    e.type === `content_block_delta` &&
      e.delta.type === `text_delta` &&
      a.processChunk(e.delta.text);
  return a.finish();
}
function Zj(e, t, n) {
  if (!e || !e.root) return;
  let r = n ?? e.root;
  if (!e.elements[r]) return;
  function i(n, r, a) {
    let o = e.elements[n];
    if (o && (t(o, n, r, a), o.children)) for (let e of o.children) i(e, r + 1, o);
  }
  i(r, 0, null);
}
function Qj(e) {
  let t = new Set();
  return (
    Zj(e, (e, n) => {
      t.add(e.type);
    }),
    t
  );
}
var $j = { quotes: `double`, indent: 2 };
function eM(e, t = `double`) {
  let n = e
    .replace(/\\/g, `\\\\`)
    .replace(/\n/g, `\\n`)
    .replace(/\r/g, `\\r`)
    .replace(/\t/g, `\\t`);
  return t === `single` ? n.replace(/'/g, `\\'`) : n.replace(/"/g, `\\"`);
}
function tM(e, t = {}) {
  let n = { ...$j, ...t },
    r = n.quotes === `single` ? `'` : `"`;
  return e === null
    ? { value: `null`, needsBraces: !0 }
    : e === void 0
      ? { value: `undefined`, needsBraces: !0 }
      : typeof e == `string`
        ? { value: `${r}${eM(e, n.quotes)}${r}`, needsBraces: !1 }
        : typeof e == `number`
          ? { value: String(e), needsBraces: !0 }
          : typeof e == `boolean`
            ? e === !0
              ? { value: `true`, needsBraces: !1 }
              : { value: `false`, needsBraces: !0 }
            : Array.isArray(e)
              ? { value: `[${e.map((e) => tM(e, n).value).join(`, `)}]`, needsBraces: !0 }
              : typeof e == `object`
                ? `$state` in e && typeof e.$state == `string`
                  ? { value: `{ $state: ${r}${eM(e.$state, n.quotes)}${r} }`, needsBraces: !0 }
                  : {
                      value: `{ ${Object.entries(e)
                        .filter(([, e]) => e !== void 0)
                        .map(([e, t]) => `${e}: ${tM(t, n).value}`)
                        .join(`, `)} }`,
                      needsBraces: !0,
                    }
                : { value: String(e), needsBraces: !0 };
}
function nM(e, t = {}) {
  let n = [];
  for (let [r, i] of Object.entries(e)) {
    if (i == null) continue;
    let e = tM(i, t);
    typeof i == `boolean` && i === !0
      ? n.push(r)
      : e.needsBraces
        ? n.push(`${r}={${e.value}}`)
        : n.push(`${r}=${e.value}`);
  }
  return n.join(` `);
}
var rM = {
    ActionButton: { module: `./action-button`, exportName: `ActionButton` },
    TextField: { module: `./text-field`, exportName: `TextField` },
    TextFieldInput: { module: `./text-field`, exportName: `TextFieldInput` },
    TextFieldTextarea: { module: `./text-field`, exportName: `TextFieldTextarea` },
    Checkbox: { module: `./checkbox`, exportName: `Checkbox` },
    CheckboxGroup: { module: `./checkbox`, exportName: `CheckboxGroup` },
    Switch: { module: `./switch`, exportName: `Switch` },
    RadioGroup: { module: `./radio-group`, exportName: `RadioGroup` },
    RadioGroupItem: { module: `./radio-group`, exportName: `RadioGroupItem` },
    RadioSelectBoxRoot: { module: `./select-box`, exportName: `RadioSelectBoxRoot` },
    RadioSelectBoxItem: { module: `./select-box`, exportName: `RadioSelectBoxItem` },
    CheckSelectBoxGroup: { module: `./select-box`, exportName: `CheckSelectBoxGroup` },
    CheckSelectBox: { module: `./select-box`, exportName: `CheckSelectBox` },
    TabsRoot: { module: `./tabs`, exportName: `TabsRoot` },
    TabsList: { module: `./tabs`, exportName: `TabsList` },
    TabsTrigger: { module: `./tabs`, exportName: `TabsTrigger` },
    TabsContent: { module: `./tabs`, exportName: `TabsContent` },
    AlertDialogRoot: { module: `./alert-dialog`, exportName: `AlertDialogRoot` },
    AlertDialogContent: { module: `./alert-dialog`, exportName: `AlertDialogContent` },
    AlertDialogHeader: { module: `./alert-dialog`, exportName: `AlertDialogHeader` },
    AlertDialogTitle: { module: `./alert-dialog`, exportName: `AlertDialogTitle` },
    AlertDialogDescription: { module: `./alert-dialog`, exportName: `AlertDialogDescription` },
    AlertDialogFooter: { module: `./alert-dialog`, exportName: `AlertDialogFooter` },
    AlertDialogAction: { module: `./alert-dialog`, exportName: `AlertDialogAction` },
    Avatar: { module: `./avatar`, exportName: `Avatar` },
    Callout: { module: `./callout`, exportName: `Callout` },
  },
  iM = {
    Box: { module: `@seed-design/react`, exportName: `Box` },
    VStack: { module: `@seed-design/react`, exportName: `VStack` },
    HStack: { module: `@seed-design/react`, exportName: `HStack` },
    Text: { module: `@seed-design/react`, exportName: `Text` },
    Badge: { module: `@seed-design/react`, exportName: `Badge` },
  };
function aM(e) {
  let t = new Map();
  for (let n of e) {
    let e = rM[n],
      r = iM[n],
      i = e ?? r;
    if (!i) continue;
    let a = t.get(i.module);
    a ? a.add(i.exportName) : t.set(i.module, new Set([i.exportName]));
  }
  let n = [],
    r = [...t.entries()].sort(([e], [t]) => {
      let n = e.startsWith(`@`),
        r = t.startsWith(`@`);
      return n && !r ? -1 : !n && r ? 1 : e.localeCompare(t);
    });
  for (let [e, t] of r) n.push({ module: e, named: [...t].sort() });
  return n;
}
function oM(e) {
  return e
    .map(({ module: e, named: t }) => `import { ${t.join(`, `)} } from "${e}";`)
    .join(`
`);
}
function sM(e, t) {
  let n = `  `.repeat(t);
  return e
    .split(`
`)
    .map((e) => (e.trim() ? n + e : e))
    .join(`
`);
}
function cM(e, t, n) {
  return `"use client";

${e}

export function ${t}() {
  return (
${sM(n, 2)}
  );
}
`;
}
function lM(e, t) {
  let { type: n, props: r = {}, children: i = [] } = e,
    a = nM(r),
    o = a ? ` ${a}` : ``;
  return i.length === 0
    ? `<${n}${o} />`
    : i.length === 1 && typeof i[0] == `string`
      ? `<${n}${o}>${i[0]}</${n}>`
      : `<${n}${o}>\n${i
          .map((e) => (typeof e == `string` ? e : lM(e, t + 1)))
          .map((e) => sM(e, 1))
          .join(`
`)}\n</${n}>`;
}
function uM(e) {
  let t = e.root;
  return !t || typeof t != `object` ? null : t;
}
function dM(e, t) {
  let n = uM(e);
  return n ? cM(oM(aM(Qj(e))), t, lM(n, 0)) : cM(``, t, `<>{/* empty */}</>`);
}
function fM(e, t) {
  return dM(e, t?.componentName ?? `GeneratedComponent`);
}
function pM(e) {
  let [t, n] = (0, x.useState)({ spec: null, code: ``, text: ``, isGenerating: !1, error: null }),
    r = (0, x.useRef)(null),
    i = (0, x.useCallback)(
      async (t) => {
        n((e) => ({ ...e, isGenerating: !0, error: null, text: `` }));
        try {
          let i = await Xj({
            prompt: t,
            currentSpec: r.current ?? void 0,
            apiKey: e,
            onPartialSpec: (e) => {
              n((t) => ({ ...t, spec: e }));
            },
            onText: (e) => {
              n((t) => ({
                ...t,
                text:
                  t.text +
                  e +
                  `
`,
              }));
            },
          });
          r.current = i.spec;
          let a = fM(i.spec, { componentName: `GeneratedComponent` });
          n((e) => ({ ...e, spec: i.spec, code: a, text: i.text, isGenerating: !1 }));
        } catch (e) {
          n((t) => ({
            ...t,
            isGenerating: !1,
            error: e instanceof Error ? e.message : `Unknown error`,
          }));
        }
      },
      [e],
    ),
    a = (0, x.useCallback)(() => {
      (r.current = null), n({ spec: null, code: ``, text: ``, isGenerating: !1, error: null });
    }, []);
  return { ...t, generate: i, reset: a };
}
function mM() {
  let [e, t] = (0, x.useState)(() => ``),
    [n, r] = (0, x.useState)(`preview`),
    { spec: i, code: a, isGenerating: o, error: s, generate: c, reset: l } = pM(e);
  return e
    ? (0, S.jsxs)(`div`, {
        style: {
          display: `flex`,
          flexDirection: `column`,
          height: `100vh`,
          fontFamily: `system-ui, -apple-system, sans-serif`,
        },
        children: [
          (0, S.jsxs)(`header`, {
            style: {
              padding: `12px 24px`,
              borderBottom: `1px solid #e8e8e8`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `space-between`,
            },
            children: [
              (0, S.jsx)(`h1`, {
                style: { fontSize: 18, fontWeight: 700 },
                children: `SEED Generative UI`,
              }),
              (0, S.jsx)(`button`, {
                type: `button`,
                onClick: l,
                style: {
                  padding: `6px 16px`,
                  borderRadius: 8,
                  border: `1px solid #ddd`,
                  background: `white`,
                  fontSize: 13,
                  cursor: `pointer`,
                },
                children: `초기화`,
              }),
            ],
          }),
          (0, S.jsx)(`div`, {
            style: { display: `flex`, flex: 1, overflow: `hidden` },
            children: (0, S.jsxs)(`div`, {
              style: {
                flex: 1,
                display: `flex`,
                flexDirection: `column`,
                borderRight: `1px solid #e8e8e8`,
              },
              children: [
                (0, S.jsx)(`div`, {
                  style: { display: `flex`, borderBottom: `1px solid #e8e8e8`, padding: `0 16px` },
                  children: [`preview`, `code`].map((e) =>
                    (0, S.jsx)(
                      `button`,
                      {
                        type: `button`,
                        onClick: () => r(e),
                        style: {
                          padding: `10px 16px`,
                          border: `none`,
                          background: `none`,
                          fontSize: 14,
                          fontWeight: n === e ? 600 : 400,
                          color: n === e ? `#FF6F0F` : `#666`,
                          borderBottom: n === e ? `2px solid #FF6F0F` : `2px solid transparent`,
                          cursor: `pointer`,
                        },
                        children: e === `preview` ? `프리뷰` : `코드`,
                      },
                      e,
                    ),
                  ),
                }),
                (0, S.jsx)(`div`, {
                  style: { flex: 1, overflow: `auto` },
                  children:
                    n === `preview` ? (0, S.jsx)(UO, { spec: i }) : (0, S.jsx)(WO, { code: a }),
                }),
              ],
            }),
          }),
          (0, S.jsxs)(`div`, {
            style: { padding: `16px 24px`, borderTop: `1px solid #e8e8e8`, background: `white` },
            children: [
              s &&
                (0, S.jsx)(`div`, {
                  style: {
                    padding: `8px 12px`,
                    marginBottom: 8,
                    borderRadius: 8,
                    background: `#FFF0F0`,
                    color: `#D00`,
                    fontSize: 13,
                  },
                  children: s,
                }),
              (0, S.jsx)(C, { onSubmit: c, isGenerating: o }),
            ],
          }),
        ],
      })
    : (0, S.jsxs)(`div`, {
        style: { maxWidth: 480, margin: `80px auto`, padding: 24 },
        children: [
          (0, S.jsx)(`h2`, {
            style: { marginBottom: 16 },
            children: `SEED Design - Generative UI`,
          }),
          (0, S.jsx)(`p`, {
            style: { color: `#666`, marginBottom: 16 },
            children: `Claude API 키를 입력해주세요.`,
          }),
          (0, S.jsx)(`input`, {
            type: `password`,
            placeholder: `sk-ant-...`,
            onChange: (e) => t(e.target.value),
            style: {
              width: `100%`,
              padding: `12px 16px`,
              borderRadius: 12,
              border: `1px solid #e0e0e0`,
              fontSize: 15,
            },
          }),
        ],
      });
}
var hM = document.getElementById(`root`);
hM && (0, b.createRoot)(hM).render((0, S.jsx)(mM, {}));
