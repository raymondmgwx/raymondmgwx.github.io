(function(e){function t(t){for(var n,a,c=t[0],s=t[1],i=t[2],l=0,f=[];l<c.length;l++)a=c[l],u[a]&&f.push(u[a][0]),u[a]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);d&&d(t);while(f.length)f.shift()();return o.push.apply(o,i||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,a=1;a<r.length;a++){var c=r[a];0!==u[c]&&(n=!1)}n&&(o.splice(t--,1),e=s(s.s=r[0]))}return e}var n={},a={app:0},u={app:0},o=[];function c(e){return s.p+"js/"+({"cg~gauss":"cg~gauss",cg:"cg",gauss:"gauss"}[e]||e)+"."+{"cg~gauss":"60750aae",cg:"fea6c0f3",gauss:"ada93c79"}[e]+".js"}function s(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.e=function(e){var t=[],r={"cg~gauss":1};a[e]?t.push(a[e]):0!==a[e]&&r[e]&&t.push(a[e]=new Promise(function(t,r){for(var n="css/"+({"cg~gauss":"cg~gauss",cg:"cg",gauss:"gauss"}[e]||e)+"."+{"cg~gauss":"91b0d553",cg:"31d6cfe0",gauss:"31d6cfe0"}[e]+".css",u=s.p+n,o=document.getElementsByTagName("link"),c=0;c<o.length;c++){var i=o[c],l=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(l===n||l===u))return t()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){i=f[c],l=i.getAttribute("data-href");if(l===n||l===u)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var n=t&&t.target&&t.target.src||u,o=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=n,delete a[e],d.parentNode.removeChild(d),r(o)},d.href=u;var p=document.getElementsByTagName("head")[0];p.appendChild(d)}).then(function(){a[e]=0}));var n=u[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise(function(t,r){n=u[e]=[t,r]});t.push(n[2]=o);var i,l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=c(e),i=function(t){l.onerror=l.onload=null,clearTimeout(f);var r=u[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,o=new Error("Loading chunk "+e+" failed.\n("+n+": "+a+")");o.type=n,o.request=a,r[1](o)}u[e]=void 0}};var f=setTimeout(function(){i({type:"timeout",target:l})},12e4);l.onerror=l.onload=i,document.head.appendChild(l)}return Promise.all(t)},s.m=e,s.c=n,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/NCAPP/",s.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var f=0;f<i.length;f++)t(i[f]);var d=l;o.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},cd49:function(e,t,r){"use strict";r.r(t);r("cadf"),r("551c"),r("f751"),r("097d");var n=r("2b0e"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("router-view")],1)},u=[],o=r("d225"),c=r("308d"),s=r("6bb5"),i=r("4e2b"),l=r("9ab4"),f=r("60a3"),d=function(e){function t(){return Object(o["a"])(this,t),Object(c["a"])(this,Object(s["a"])(t).apply(this,arguments))}return Object(i["a"])(t,e),t}(f["b"]);d=l["a"]([f["a"]],d);var p=d,g=p,h=r("0c7c"),v=Object(h["a"])(g,a,u,!1,null,null,null),b=v.exports,m=r("8c4f");n["default"].use(m["a"]);var y=new m["a"]({routes:[{path:"/",component:b,redirect:"/gauss",children:[{path:"/gauss",component:function(){return Promise.all([r.e("cg~gauss"),r.e("gauss")]).then(r.bind(null,"5c3c"))}},{path:"/cg",component:function(){return Promise.all([r.e("cg~gauss"),r.e("cg")]).then(r.bind(null,"5745"))}}]},{path:"*",redirect:"/404"}]}),w=r("9f7b"),j=r.n(w);r("f9e3"),r("2dd8");n["default"].use(j.a),n["default"].config.productionTip=!1,new n["default"]({router:y,render:function(e){return e(b)}}).$mount("#app")}});
//# sourceMappingURL=app.025a3c2e.js.map