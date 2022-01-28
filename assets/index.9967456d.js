var ne=Object.defineProperty,ae=Object.defineProperties;var ie=Object.getOwnPropertyDescriptors;var it=Object.getOwnPropertySymbols;var Bt=Object.prototype.hasOwnProperty,$t=Object.prototype.propertyIsEnumerable;var wt=(o,e,t)=>e in o?ne(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,A=(o,e)=>{for(var t in e||(e={}))Bt.call(e,t)&&wt(o,t,e[t]);if(it)for(var t of it(e))$t.call(e,t)&&wt(o,t,e[t]);return o},I=(o,e)=>ae(o,ie(e));var Y=(o,e)=>{var t={};for(var s in o)Bt.call(o,s)&&e.indexOf(s)<0&&(t[s]=o[s]);if(o!=null&&it)for(var s of it(o))e.indexOf(s)<0&&$t.call(o,s)&&(t[s]=o[s]);return t};var y=(o,e,t)=>(wt(o,typeof e!="symbol"?e+"":e,t),t);import{a as f,u as R,b as Ut,R as g,c as N,d as b,j as m,F as Z,e as i,S as le,f as re,g as ce,h as ue,m as he,i as jt,k as de,l as fe,n as me}from"./vendor.a5becc98.js";const pe=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerpolicy&&(a.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?a.credentials="include":n.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}};pe();function xe(){}function ve(o){return!!(o&&typeof o!="function")}function be(o){return o?ve(o)?e=>{o.current=e}:o:xe}function we(...o){const e=o.map(t=>be(t));return t=>{e.forEach(s=>s(t))}}function k(o,e){const t=f(o);return f(n=>n(t),(n,a,l)=>{const r=typeof l=="function"?l(n(t)):l;a(t,r),e({get:n,set:a,nextValue:r})})}const ye=/^[\t\n\f\r ]*([MLHVZCSQTAmlhvzcsqta])[\t\n\f\r ]*/,Gt=/^[01]/,yt=/^[+-]?(([0-9]*\.[0-9]+)|([0-9]+\.)|([0-9]+))([eE][+-]?[0-9]+)?/,w=yt,ge=/^(([\t\n\f\r ]+,?[\t\n\f\r ]*)|(,[\t\n\f\r ]*))/,Pe={M:[w,w],L:[w,w],H:[w],V:[w],Z:[],C:[w,w,w,w,w,w],S:[w,w,w,w],Q:[w,w,w,w],T:[w,w],A:[yt,yt,w,Gt,Gt,w,w]};class gt{static components(e,t,s){const n=Pe[e.toUpperCase()],a=[];for(;s<=t.length;){const l=[e];for(const r of n){const u=t.slice(s).match(r);if(u!==null){l.push(u[0]),s+=u[0].length;const c=t.slice(s).match(ge);c!==null&&(s+=c[0].length)}else{if(l.length===1)return[s,a];throw new Error("malformed path (first error at "+s+")")}}if(a.push(l),n.length===0)return[s,a];e==="m"&&(e="l"),e==="M"&&(e="L")}throw new Error("malformed path (first error at "+s+")")}static parse(e){let t=0,s=[];for(;t<e.length;){const n=e.slice(t).match(ye);if(n!==null){const a=n[1];t+=n[0].length;const l=gt.components(a,e,t);t=l[0],s=[...s,...l[1]]}else throw new Error("malformed path (first error at "+t+")")}return s}}let ke=1;function Pt(){return`${ke++}`.padStart(7," ")}function W(o,e,t=!1){let s=o.toFixed(e).replace(/^(-?[0-9]*\.([0-9]*[1-9])?)0*$/,"$1").replace(/\.$/,"");return t&&(s=s.replace(/^(-?)0\./,"$1.")),s}class P{constructor(e,t){this.x=e,this.y=t}}class L extends P{constructor(e,t,s=!0){super(e,t);y(this,"itemReference",new Ce);y(this,"movable",!0);y(this,"id",Pt());this.movable=s}}class T extends L{constructor(e,t,s=!0){super(e.x,e.y,s);y(this,"subIndex",0);this.relations=t}}class S{constructor(e,t){y(this,"relative");y(this,"values");y(this,"previousPoint",new P(0,0));y(this,"absolutePoints",[]);y(this,"absoluteControlPoints",[]);y(this,"id",Pt());this.values=e,this.relative=t}static Make(e){let t;const s=e[0].toUpperCase()!==e[0],n=e.slice(1).map(a=>parseFloat(a));switch(e[0].toUpperCase()){case H.key:t=new H(n,s);break;case _.key:t=new _(n,s);break;case J.key:t=new J(n,s);break;case tt.key:t=new tt(n,s);break;case X.key:t=new X(n,s);break;case D.key:t=new D(n,s);break;case O.key:t=new O(n,s);break;case V.key:t=new V(n,s);break;case U.key:t=new U(n,s);break;case et.key:t=new et(n,s);break}if(!t)throw"Invalid SVG item";return t}static MakeFrom(e,t,s){const n=e.targetLocation(),a=n.x.toString(),l=n.y.toString();let r=[];const u=s.toUpperCase();switch(u){case H.key:r=[H.key,a,l];break;case _.key:r=[_.key,a,l];break;case J.key:r=[J.key,a];break;case tt.key:r=[tt.key,l];break;case X.key:r=[X.key];break;case D.key:r=[D.key,"0","0","0","0",a,l];break;case O.key:r=[O.key,"0","0",a,l];break;case V.key:r=[V.key,"0","0",a,l];break;case U.key:r=[U.key,a,l];break;case et.key:r=[et.key,"1","1","0","0","0",a,l];break}const c=S.Make(r),h=e.absoluteControlPoints;return c.previousPoint=t.targetLocation(),c.absolutePoints=[n],c.resetControlPoints(t),(e instanceof D||e instanceof O)&&(c instanceof D||c instanceof O)&&(c instanceof D&&(c.values[0]=h[0].x,c.values[1]=h[0].y,c.values[2]=h[1].x,c.values[3]=h[1].y),c instanceof O&&(c.values[0]=h[1].x,c.values[1]=h[1].y)),(e instanceof V||e instanceof U)&&c instanceof V&&(c.values[0]=h[0].x,c.values[1]=h[0].y),s!==u&&c.setRelative(!0),c}refreshAbsolutePoints(e,t){this.previousPoint=t?t.targetLocation():new P(0,0),this.absolutePoints=[];let s=t?t.targetLocation():new P(0,0);this.relative||(s=new P(0,0));for(let n=0;n<this.values.length-1;n+=2)this.absolutePoints.push(new L(s.x+this.values[n],s.y+this.values[n+1]))}setRelative(e){this.relative!==e&&(this.relative=!1,e?(this.translate(-this.previousPoint.x,-this.previousPoint.y),this.relative=!0):this.translate(this.previousPoint.x,this.previousPoint.y))}refreshAbsoluteControlPoints(e,t){this.absoluteControlPoints=[]}resetControlPoints(e){}translate(e,t,s=!1){(!this.relative||s)&&this.values.forEach((n,a)=>{this.values[a]=n+(a%2==0?e:t)})}scale(e,t){this.values.forEach((s,n)=>{this.values[n]=s*(n%2==0?e:t)})}targetLocation(){const e=this.absolutePoints.length;return this.absolutePoints[e-1]}setTargetLocation(e){const t=this.targetLocation(),s=e.x-t.x,n=e.y-t.y,a=this.values.length;this.values[a-2]+=s,this.values[a-1]+=n}setControlLocation(e,t){const s=this.absolutePoints[e],n=t.x-s.x,a=t.y-s.y;this.values[2*e]+=n,this.values[2*e+1]+=a}controlLocations(){return this.absoluteControlPoints}getType(){let e=this.constructor.key;return this.relative&&(e=e.toLowerCase()),e}asStandaloneString(){return["M",this.previousPoint.x,this.previousPoint.y,this.getType(),...this.values].join(" ")}asString(e=4,t=!1,s=[]){const n=[this.values,...s.map(a=>a.values)].reduce((a,l)=>a.concat(l),[]).map(a=>W(a,e,t));return[this.getType(),...n].join(" ")}}class Ce extends S{constructor(){super([],!1)}}class H extends S{}y(H,"key","M");class _ extends S{}y(_,"key","L");class D extends S{refreshAbsoluteControlPoints(e,t){if(!t)throw"Invalid path";this.absoluteControlPoints=[new T(this.absolutePoints[0],[t.targetLocation()]),new T(this.absolutePoints[1],[this.targetLocation()])]}resetControlPoints(e){const t=e.targetLocation(),s=this.targetLocation(),n=this.relative?t:new P(0,0);this.values[0]=2*t.x/3+s.x/3-n.x,this.values[1]=2*t.y/3+s.y/3-n.y,this.values[2]=t.x/3+2*s.x/3-n.x,this.values[3]=t.y/3+2*s.y/3-n.y}}y(D,"key","C");const Ft=class extends S{refreshAbsoluteControlPoints(e,t){if(this.absoluteControlPoints=[],t instanceof D||t instanceof Ft){const s=t.targetLocation(),n=t.absoluteControlPoints[1],a=new P(2*s.x-n.x,2*s.y-n.y);this.absoluteControlPoints.push(new T(a,[s],!1))}else{const s=t?t.targetLocation():new P(0,0),n=new P(s.x,s.y);this.absoluteControlPoints.push(new T(n,[],!1))}this.absoluteControlPoints.push(new T(this.absolutePoints[0],[this.targetLocation()]))}asStandaloneString(){return["M",this.previousPoint.x,this.previousPoint.y,"C",this.absoluteControlPoints[0].x,this.absoluteControlPoints[0].y,this.absoluteControlPoints[1].x,this.absoluteControlPoints[1].y,this.absolutePoints[1].x,this.absolutePoints[1].y].join(" ")}resetControlPoints(e){const t=e.targetLocation(),s=this.targetLocation(),n=this.relative?t:new P(0,0);this.values[0]=t.x/3+2*s.x/3-n.x,this.values[1]=t.y/3+2*s.y/3-n.y}setControlLocation(e,t){const s=this.absoluteControlPoints[1],n=t.x-s.x,a=t.y-s.y;this.values[0]+=n,this.values[1]+=a}};let O=Ft;y(O,"key","S");class V extends S{refreshAbsoluteControlPoints(e,t){if(!t)throw"Invalid path";this.absoluteControlPoints=[new T(this.absolutePoints[0],[t.targetLocation(),this.targetLocation()])]}resetControlPoints(e){const t=e.targetLocation(),s=this.targetLocation(),n=this.relative?t:new P(0,0);this.values[0]=t.x/2+s.x/2-n.x,this.values[1]=t.y/2+s.y/2-n.y}}y(V,"key","Q");const It=class extends S{refreshAbsoluteControlPoints(e,t){if(t instanceof V||t instanceof It){const s=t.targetLocation(),n=t.absoluteControlPoints[0],a=new P(2*s.x-n.x,2*s.y-n.y);this.absoluteControlPoints=[new T(a,[s,this.targetLocation()],!1)]}else{const s=t?t.targetLocation():new P(0,0),n=new P(s.x,s.y);this.absoluteControlPoints=[new T(n,[],!1)]}}asStandaloneString(){return["M",this.previousPoint.x,this.previousPoint.y,"Q",this.absoluteControlPoints[0].x,this.absoluteControlPoints[0].y,this.absolutePoints[0].x,this.absolutePoints[0].y].join(" ")}};let U=It;y(U,"key","T");class X extends S{refreshAbsolutePoints(e,t){this.previousPoint=t?t.targetLocation():new P(0,0),this.absolutePoints=[new L(e.x,e.y,!1)]}}y(X,"key","Z");class J extends S{refreshAbsolutePoints(e,t){this.previousPoint=t?t.targetLocation():new P(0,0),this.relative?this.absolutePoints=[new L(this.values[0]+this.previousPoint.x,this.previousPoint.y)]:this.absolutePoints=[new L(this.values[0],this.previousPoint.y)]}setTargetLocation(e){const t=this.targetLocation(),s=e.x-t.x;this.values[0]+=s}}y(J,"key","H");class tt extends S{translate(e,t,s=!1){this.relative||(this.values[0]+=t)}scale(e,t){this.values[0]*=t}refreshAbsolutePoints(e,t){this.previousPoint=t?t.targetLocation():new P(0,0),this.relative?this.absolutePoints=[new L(this.previousPoint.x,this.values[0]+this.previousPoint.y)]:this.absolutePoints=[new L(this.previousPoint.x,this.values[0])]}setTargetLocation(e){const t=this.targetLocation(),s=e.y-t.y;this.values[0]+=s}}y(tt,"key","V");class et extends S{translate(e,t,s=!1){this.relative||(this.values[5]+=e,this.values[6]+=t)}scale(e,t){const s=this.values[0],n=this.values[1],a=Math.PI*this.values[2]/180,l=Math.cos(a),r=Math.sin(a),u=n*n*t*t*l*l+s*s*t*t*r*r,c=2*e*t*l*r*(n*n-s*s),h=s*s*e*e*l*l+n*n*e*e*r*r,d=-(s*s*n*n*e*e*t*t),p=c*c-4*u*h,v=Math.sqrt((u-h)*(u-h)+c*c);this.values[2]=c!==0?Math.atan((h-u-v)/c)*180/Math.PI:u<h?0:90,this.values[0]=-Math.sqrt(2*p*d*(u+h+v))/p,this.values[1]=-Math.sqrt(2*p*d*(u+h-v))/p,this.values[5]*=e,this.values[6]*=t,this.values[4]=e*t>=0?this.values[4]:1-this.values[4]}refreshAbsolutePoints(e,t){this.previousPoint=t?t.targetLocation():new P(0,0),this.relative?this.absolutePoints=[new L(this.values[5]+this.previousPoint.x,this.values[6]+this.previousPoint.y)]:this.absolutePoints=[new L(this.values[5],this.values[6])]}asString(e=4,t=!1,s=[]){if(t){const n=[this.values,...s.map(a=>a.values)].map(a=>a.map(l=>W(l,e,t))).map(a=>`${a[0]} ${a[1]} ${a[2]} ${a[3]}${a[4]}${a[5]} ${a[6]}`);return[this.getType(),...n].join(" ")}else return super.asString(e,t,s)}}y(et,"key","A");class Yt{constructor(e){y(this,"path");const t=e?gt.parse(e):[];this.path=t.map(s=>S.Make(s)),this.refreshAbsolutePositions()}translate(e,t){return this.path.forEach((s,n)=>{s.translate(e,t,n===0)}),this.refreshAbsolutePositions(),this}scale(e,t){return this.path.forEach(s=>{s.scale(e,t)}),this.refreshAbsolutePositions(),this}setRelative(e){return this.path.forEach(t=>{t.setRelative(e)}),this.refreshAbsolutePositions(),this}delete(e){const t=this.path.indexOf(e);return t!==-1&&(this.path.splice(t,1),this.refreshAbsolutePositions()),this}insert(e,t){const s=t?this.path.indexOf(t):-1;s!==-1?this.path.splice(s+1,0,e):this.path.push(e),this.refreshAbsolutePositions()}changeType(e,t){const s=this.path.indexOf(e);if(s>0){const n=this.path[s-1];return this.path[s]=S.MakeFrom(e,n,t),this.refreshAbsolutePositions(),this.path[s]}return null}asString(e=4,t=!1){return this.path.reduce((s,n)=>{const a=n.getType();if(t&&s.length>0){const l=s[s.length-1];if(l.type===a)return l.trailing.push(n),s}return s.push({type:a==="m"?"l":a==="M"?"L":a,item:n,trailing:[]}),s},[]).map(s=>{const n=s.item.asString(e,t,s.trailing);return t?n.replace(/^([a-z]) /i,"$1").replace(/ -/g,"-").replace(/(\.[0-9]+) (?=\.)/g,"$1"):n}).join(t?"":" ")}targetLocations(){return this.path.map(e=>e.targetLocation())}controlLocations(){let e=[];for(let t=1;t<this.path.length;++t){const s=this.path[t].controlLocations();s.forEach((n,a)=>{n.subIndex=a}),e=[...e,...s]}return e}setLocation(e,t){e instanceof T?e.itemReference.setControlLocation(e.subIndex,t):e.itemReference.setTargetLocation(t),this.refreshAbsolutePositions()}refreshAbsolutePositions(){let e=null,t=new P(0,0);for(const s of this.path)s.refreshAbsolutePoints(t,e),s.refreshAbsoluteControlPoints(t,e),s.absolutePoints.forEach(n=>n.itemReference=s),s.absoluteControlPoints.forEach(n=>n.itemReference=s),(s instanceof H||s instanceof X)&&(t=s.targetLocation()),e=s}}function Zt(...o){console.log("%cneed check","color: red",...o)}const Ae=!1;function Ne(o){let e=0,t=0,s=10,n=10;return o.length&&(e=Math.min(...o.map(a=>a.x)),t=Math.min(...o.map(a=>a.y)),s=Math.max(...o.map(a=>a.x)),n=Math.max(...o.map(a=>a.y))),{xmin:e,ymin:t,xmax:s,ymax:n}}function Se(o,e,t){const[s,n,a,l]=o;t=t||{x:s+.5*a,y:n+.5*l};const r=s+(t.x-s-e*(t.x-s)),u=n+(t.y-n-e*(t.y-n)),c=e*a,h=e*l;return[r,u,c,h]}function kt(o,e){return parseFloat((o/e).toPrecision(6))}function Wt(o,e,t,s,n,a=!1,l=!1){if(!a&&l)return;if(!o.w||!o.h){Zt("updateViewPort");return}if(s===null&&n!==null&&(s=o.w*n/o.h),n===null&&s!==null&&(n=o.h*s/o.w),!s||!n)return;const r=[parseFloat((1*e).toPrecision(6)),parseFloat((1*t).toPrecision(6)),parseFloat((1*s).toPrecision(4)),parseFloat((1*n).toPrecision(4))];return{viewBox:r,stroke:kt(r[2],o.w)}}function Re(o,e){if(!o.w||!o.h){Zt("getFitViewPort");return}const t=Ne(e);let s=t.xmin-1,n=t.ymin-1,a=t.xmax-t.xmin+2,l=t.ymax-t.ymin+2;const r=o.h/o.w;r<l/a?a=l/r:l=r*a;const u=[parseFloat((1*s).toPrecision(6)),parseFloat((1*n).toPrecision(6)),parseFloat((1*a).toPrecision(4)),parseFloat((1*l).toPrecision(4))];return{size:{w:o.w,h:o.h},port:u,stroke:kt(u[2],o.w)}}function Ee(o,e=100){let t,s,n;return function(...a){n=this,s=a,!t&&(t=setTimeout(()=>{t=null,o.apply(n,s)},e))}}var x;(function(o){const e="react-svg-expo-01";o.initialData={path:"M 0 0 L 25 103 Q 52 128 63 93 C -2 26 29 0 100 0 C 83 15 85 52 61 27",showGrid:!0,showTicks:!0,ticks:5,precision:3,snapToGrid:!1,showCPs:!1,fillPath:!0,minifyOutput:!1,openPanelPath:!0,openPanelCmds:!0,openPanelOper:!1,openPanelOpts:!0};function t(){const s=localStorage.getItem(e);if(s)try{let n=JSON.parse(s);o.initialData=A(A({},o.initialData),n)}catch{}}t(),o.save=Ee(function(n){let a={path:n(z),showGrid:n(ht),showTicks:n(dt),ticks:n(Et),precision:n(st),snapToGrid:n(Mt),showCPs:n(ut),fillPath:n(Lt),minifyOutput:n(Dt),openPanelPath:n(Kt),openPanelCmds:n(Qt),openPanelOper:n(_t),openPanelOpts:n(Jt)};localStorage.setItem(e,JSON.stringify(a))},1e3)})(x||(x={}));function Ct(o){try{return new Yt(o)}catch{}}const Ht=f(!0),z=k(x.initialData.path,({get:o})=>x.save(o)),At=f(o=>o(z),(o,e,t)=>{e(z,t);const s=Ct(t);s&&(e(B,Xt(s)),e(Nt))}),ot={activeRow:void 0,hoverRow:void 0,activeEd:void 0,hoverEd:void 0},lt=f(null,(o,e,{atom:t,states:s})=>{const n={};for(const[r,u]of Object.entries(s)){const c=r,h=ot[c];h&&h!==t&&e(h,d=>I(A({},d),{[c]:!1})),ot[c]=u&&u!==-1?t:void 0,n[c]=u}const a=o(t);Object.entries(n).some(([r,u])=>a[r]!==u)&&e(t,r=>A(A({},r),n))}),Me=f(null,(o,e)=>{ot.activeRow&&(e(ot.activeRow,t=>I(A({},t),{activeRow:!1})),ot.activeRow=void 0)});function Xt(o){const e={svg:o,edits:[],completePathAtom:f(o.asString()),allowUpdatesAtom:f(!0),doReloadAllValuesAtom:k(!0,a),doReloadSvgItemIdxAtom:k(-1,l),doUpdatePointAtom:f(null,r)};return t(),o.path.forEach((u,c)=>{const h={id:Pt(),svgItemIdx:c,svgItem:u,typeAtom:f(u.getType()),isRelAtom:k(u.relative,({get:d,set:p,nextValue:v})=>{u.setRelative(v),e.svg.refreshAbsolutePositions(),s(p,c)}),valueAtoms:u.values.map((d,p)=>k(d,(v=>({get:C,set:F,nextValue:G})=>{C(e.allowUpdatesAtom)&&(u.values[v]=G,e.svg.refreshAbsolutePositions(),s(F,c))})(p))),standaloneStringAtom:f(u.asStandaloneString()),stateAtom:f({activeRow:!1,hoverRow:!1,activeEd:-1,hoverEd:-1})};e.edits.push(h)}),e;function t(){e.svg.path.forEach(u=>{u.controlLocations().forEach((h,d)=>h.subIndex=d)})}function s(u,c=-2){t(),u(e.doReloadAllValuesAtom,!0),u(e.doReloadAllValuesAtom,!1),u(e.doReloadSvgItemIdxAtom,c),u(e.doReloadSvgItemIdxAtom,-1)}function n(u,c){c(e.allowUpdatesAtom,!1),e.svg.path.forEach((h,d)=>{const p=e.edits[d].valueAtoms;h.values.forEach((v,C)=>{u(p[C])!=v&&c(p[C],v)})}),c(e.allowUpdatesAtom,!0)}function a({get:u,set:c,nextValue:h}){h&&n(u,c)}function l({get:u,set:c,nextValue:h}){function d(v,C=!1){const F=e.edits[v],G=e.svg.path[v];C&&c(F.typeAtom,G.getType()),c(F.standaloneStringAtom,G.asStandaloneString())}function p(){const v=u(Dt),C=u(st);c(e.completePathAtom,e.svg.asString()),c(z,o.asString(C,v))}h>=0?(d(h,!0),h-1>=0&&d(h-1),h+1<e.edits.length&&d(h+1),p()):h===-2&&e.edits.forEach((v,C)=>d(C))}function r(u,c,{pt:h,newXY:d,svgItemIdx:p}){o.setLocation(h,d),s(c,p)}}const B=f(Xt(Ct(x.initialData.path)||new Yt(""))),E=f([0,0,10,10]),M=f(1),Le=f(o=>o(E),(o,e,t)=>{const s=o(j),n=Wt(s,...t,!0);n&&(e(E,n.viewBox),e(M,n.stroke))}),zt=f(null,(o,e,{deltaY:t,pt:s})=>{let n=Math.min(1e3,Math.max(-450,t));const a=o(E),l=Math.pow(1.005,n),r=Se(a,l),u=o(j),c=kt(r[2],u.w);e(E,r),e(M,c)}),Nt=f(null,(o,e)=>{const t=o(j),n=o(B).svg.targetLocations(),a=Re(t,n);a&&(e(E,a.port),e(M,a.stroke))}),rt=f(null,(o,e,t)=>{t?e(zt,{deltaY:t}):e(Nt)}),Te=f(null,(o,e)=>{const t=o(j);if(t.w&&t.h)if(o(Ht))e(Nt),e(Ht,!1);else{const n=o(E),a=Wt(t,n[0],n[1],n[2],null,!0);a&&(e(E,a.viewBox),e(M,a.stroke))}}),St=f({w:0,h:0}),j=f(o=>o(St),(o,e,t)=>{const s=o(St);(t.w!==s.w||t.h!==s.h)&&e(St,t)}),ct=f(void 0);function Rt(o,e,t,s,n){const a=t.getBoundingClientRect();let[l,r]=o;const u=l+(s-a.x)*e,c=r+(n-a.y)*e;return{x:u,y:c}}const q=f(null);f(o=>o(q));const qt=f(null,(o,e,t)=>{if(t.mdownEvent.button!==0)return;o(ct)&&(t.mmoved=!1,e(q,t))}),De=f(null,(o,e,t)=>{const s=o(ct);if(s){const n=o(E),a=o(M),l=Rt(n,a,s,t.clientX,t.clientY);e(q,{mdownEvent:t,mdownXY:l,svgItemIdx:-1,mmoved:!1})}}),Oe=f(null,(o,e,t)=>{const s=o(q);if(!s)return;const n=o(E),a=o(M),l=o(ct);if(l){t.stopPropagation(),s.mmoved=!0;const r=o(st),u=o(Mt);if(s.mdownPt){const c=Rt(n,a,l,t.clientX,t.clientY),h=u?0:t.ctrlKey?r?0:3:r;c.x=parseFloat(c.x.toFixed(h)),c.y=parseFloat(c.y.toFixed(h));const d=o(B);e(d.doUpdatePointAtom,{pt:s.mdownPt,newXY:c,svgItemIdx:s.svgItemIdx})}else{const c=s.mdownXY,h=Rt(n,a,l,t.clientX,t.clientY);e(E,d=>[d[0]+c.x-h.x,d[1]+c.y-h.y,d[2],d[3]])}}}),Fe=f(null,(o,e)=>{const t=o(q);t&&(!t.mdownPt&&!t.mmoved&&e(Me),e(q,null))}),Et=k(x.initialData.ticks,({get:o})=>x.save(o)),st=k(x.initialData.precision,({get:o})=>x.save(o)),Mt=k(x.initialData.snapToGrid,({get:o})=>x.save(o)),ut=k(x.initialData.showCPs,({get:o})=>x.save(o)),Lt=k(x.initialData.fillPath,({get:o})=>x.save(o)),Tt=k(x.initialData.minifyOutput,({get:o})=>x.save(o)),Ie=f(null,(o,e,t)=>{let s=o(z);const n=Ct(s);if(n){const a=o(st);s=n.asString(a,t),e(z,s)}e(Tt,t)}),Dt=f(o=>o(Tt),(o,e,t)=>{const s=typeof t=="function"?t(o(Tt)):t;e(Ie,s)}),ht=k(x.initialData.showGrid,({get:o})=>x.save(o)),dt=k(x.initialData.showTicks,({get:o})=>x.save(o)),Kt=k(x.initialData.openPanelPath,({get:o})=>x.save(o)),Qt=k(x.initialData.openPanelCmds,({get:o})=>x.save(o)),_t=k(x.initialData.openPanelOper,({get:o})=>x.save(o)),Jt=k(x.initialData.openPanelOpts,({get:o})=>x.save(o)),te=f(1),ee=f(1),Ve=f(0),Be=f(0),$e=f(1),Ue=40,je=f(!0),ft=f([]),K=f(0);f(null,(o,e,t)=>{let s=o(ft),n=o(K);s.length>=Ue&&(s.shift(),n--),e(ft,[...s,t]),e(K,n++)});const Ge=(o,e)=>!!o.length&&e>0,Ye=(o,e)=>!!o.length&&e<o.length-1;f(null,(o,e,t)=>{let s=o(ft),n=o(K);Ge(s,n)&&(n--,e(K,n),e(At,s[n]))});f(null,(o,e,t)=>{let s=o(ft),n=o(K);Ye(s,n)&&(n++,e(K,n),e(At,s[n]))});f(null,(o,e,t)=>{e(je,t)});function Ze(o,e=200,t=!0){if(e<=0)return o;let s=0,n,a,l;function r(){n&&(clearTimeout(n),n=void 0)}function u(){r(),o.apply(a,l)}function c(...h){const d=Date.now()-s;r(),d>e?(s=Date.now(),o.apply(this,h)):t&&(l=h,a=this,n=setTimeout(u,e))}return c}function We(){const[o]=R(B),[e,{width:t,height:s}]=Ut(),n=g.useRef(),a=N(j),l=N(ct),r=N(Te),u=N(zt),c=g.useCallback(Ze(d=>{u(d)}),[]),h=g.useCallback(d=>{if(!n.current)return;const{left:p,top:v}=n.current.getBoundingClientRect(),{clientX:C,clientY:F}=d;c({deltaY:d.deltaY,pt:{x:C-p,y:F-v}})},[n]);return g.useEffect(()=>{console.log("--------------- useContainerZoom.useEffect[parentRef]",n,t,s),l(n.current)},[n]),g.useEffect(()=>{console.log("--------------- useContainerZoom.useEffect[width, height]",n,t,s),a({w:t,h:s}),r()},[t,s]),g.useEffect(()=>{console.log("--------------- useContainerZoom.useEffect[svgEditRoot]",n,t,s),r()},[o]),{ref:e,parentRef:n,onWheel:h}}const mt=(o,e)=>o?"#009cff":e?"#ff4343":"white",oe=(o,e)=>o?"#9c00ffa0":e?"#ffad40":"white",He=(o,e)=>o?"#9c00ffa0":e?"#ffad40":"#fff5";function Xe({svgItemEdit:o}){const e=b(o.standaloneStringAtom),t=b(M),s=N(qt),n=N(lt),a=o.svgItemIdx,l=o.stateAtom,r=o.svgItem.targetLocation(),u=r.itemReference.getType().toUpperCase()==="M",c=b(l),h=c.activeRow&&c.activeEd===-1,d=c.hoverRow&&c.hoverEd===-1;return m(Z,{children:[(c.activeRow||c.hoverRow)&&i("path",{style:{stroke:mt(c.activeRow,c.hoverRow),fill:"none"},strokeWidth:t,d:e}),(h||d)&&i("circle",{style:{stroke:"#9c00ff63",fill:oe(h,d)},cx:r.x,cy:r.y,r:t*8,strokeWidth:t*16}),i("circle",{className:"cursor-pointer",style:u?{stroke:mt(c.activeRow,c.hoverRow),fill:"#fff3",strokeWidth:t*1.2}:{stroke:"transparent",fill:mt(c.activeRow,c.hoverRow),strokeWidth:t*12},cx:r.x,cy:r.y,r:u?t*5:t*3,onMouseEnter:()=>n({atom:l,states:{hoverRow:!0}}),onMouseLeave:()=>n({atom:l,states:{hoverRow:!1}}),onMouseDown:p=>{p.stopPropagation(),n({atom:l,states:{activeRow:!0}}),s({mdownEvent:p,mdownPt:r,svgItemIdx:a})},children:m("title",{children:["abs: ",W(r.x,2),",",W(r.y,2)]})})]})}function ze({svgItemEdit:o,cpIdx:e}){b(o.standaloneStringAtom);const t=b(M),s=N(qt),n=N(lt),a=o.svgItemIdx,l=o.stateAtom,u=o.svgItem.controlLocations()[e],c=b(l),h=c.activeRow&&c.activeEd===u.subIndex,d=c.hoverRow&&c.hoverEd===u.subIndex;return m(Z,{children:[u.relations.map((p,v)=>i("line",{style:{stroke:He(c.activeRow,c.hoverRow),strokeWidth:t*1.5,strokeDasharray:`${t*3} ${t*5}`},x1:u.x,y1:u.y,x2:p.x,y2:p.y,strokeWidth:t},v)),(h||d)&&i("rect",{className:"cursor-pointer",style:{stroke:"#9c00ff63",fill:oe(h,d)},x:u.x-8*t,y:u.y-8*t,width:t*16,height:t*16,strokeWidth:t*16}),i("rect",{className:"cursor-pointer",style:{stroke:"transparent",fill:mt(c.activeRow,c.hoverRow)},x:u.x-3*t,y:u.y-3*t,width:t*6,height:t*6,strokeWidth:t*12,onMouseEnter:()=>{n({atom:l,states:{hoverRow:!0,hoverEd:u.subIndex}})},onMouseLeave:()=>{n({atom:l,states:{hoverRow:!1,hoverEd:-1}})},onMouseDown:p=>{p.stopPropagation(),n({atom:l,states:{activeRow:!0}}),s({mdownEvent:p,mdownPt:u,svgItemIdx:a})},children:m("title",{children:["abs: ",W(u.x,2),",",W(u.y,2)]})})]})}function qe(o,e){const t=5*o[2]<=e;return{xGrid:t?Array(Math.ceil(o[2])+1).fill(null).map((s,n)=>Math.floor(o[0])+n):[],yGrid:t?Array(Math.ceil(o[3])+1).fill(null).map((s,n)=>Math.floor(o[1])+n):[]}}function Ke(){const o=b(E),e=b(j),t=b(M),s=b(dt),n=b(Et);if(!b(ht))return null;const l=qe(o,e.w);return m("g",{className:"svg-ticks",children:[l.xGrid.map(r=>i("line",{x1:r,x2:r,y1:o[1],y2:o[1]+o[3],className:`${r===0?"stroke-[#f005]":r%n==0?"stroke-[#8888]":"stroke-[#8884]"}`,style:{strokeWidth:t}},`x${r}`)),l.yGrid.map(r=>i("line",{y1:r,y2:r,x1:o[0],x2:o[0]+o[2],className:`${r===0?"stroke-[#f005]":r%n==0?"stroke-[#8888]":"stroke-[#8884]"}`,style:{strokeWidth:t}},`y${r}`)),s&&m(Z,{children:[l.xGrid.map(r=>i(g.Fragment,{children:r%n==0&&i("text",{className:"fill-[#744]",y:-5*t,x:r-5*t,style:{fontSize:t*10+"px",stroke:"white",strokeWidth:t*.2},children:r})},r)),l.yGrid.map(r=>i(g.Fragment,{children:r%n==0&&i("text",{className:"fill-[#744]",x:-5*t,y:r-5*t,style:{fontSize:t*10+"px",stroke:"white",strokeWidth:t*.2},children:r})},r))]})]})}function Qe(){const o=N(De),e=N(Oe),t=N(Fe),s=g.useCallback(l=>o(l),[]),n=g.useCallback(()=>t(),[]),a=g.useCallback(l=>e(l),[]);return{onMouseDown:s,onMouseUp:n,onMouseMove:a}}function _e({children:o}){const e=b(j),t=b(E),{onMouseDown:s,onMouseMove:n,onMouseUp:a}=Qe();return!e.w||!e.h?null:i("svg",{viewBox:t.join(" "),className:"bg-[#040d1c] select-none",onMouseDown:s,onMouseMove:n,onMouseUp:a,children:o})}function Je(){const o=b(B),e=b(o.completePathAtom),t=b(M),s=b(ut),n=b(Lt);return i("path",{d:e,fill:n||s&&n?"#94a3b830":"none",stroke:"white",strokeWidth:t})}function to(){const e=b(B).edits;return i("g",{className:"target-pts",children:e.map((t,s)=>i(Xe,{svgItemEdit:t},s))})}function eo(){const e=b(B).edits;return i("g",{className:"ctrl-pts",children:e.map((t,s)=>t.svgItem.controlLocations().map((a,l)=>i(ze,{svgItemEdit:t,cpIdx:l},`${s}${l}`)))})}function oo(){const{ref:o,parentRef:e,onWheel:t}=We(),s=b(ut);return i("div",{ref:we(o,e),className:"absolute w-full h-full overflow-hidden",onWheel:t,children:m(_e,{children:[i(Ke,{}),i(Je,{}),s&&m("g",{className:"pts",children:[i(eo,{}),i(to,{})]})]})})}const so=le;function pt({toggle:o,children:e}){const[t,{height:s,top:n}]=Ut(),[a,l]=g.useState(!0),r=re({overflow:"hidden",height:o?s+n:0,config:a?{duration:0}:{mass:.2,tension:492,clamp:!0},onRest:()=>a&&l(!1)});return i("div",{children:i(ce.div,{style:r,children:i("div",{ref:t,children:e})})})}const no={open:{d:["M 20,65 50,35 80,65","M 20,35 50,65 80,35"]},closed:{d:["M 20,35 50,65 80,35","M 20,65 50,35 80,65"]}};function xt(n){var a=n,{children:o,open:e=!0,onClick:t}=a,s=Y(a,["children","open","onClick"]);const l=ue();return m("div",I(A({className:"px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between select-none cursor-pointer font-ui",onClick:u=>t&&(l.start(e?"closed":"open"),t(u))},s),{children:[i("div",{className:"pr-1 pt-1",children:o}),i("div",{className:"",children:i("svg",{className:"w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-none",viewBox:"0 0 100 100",children:i(he.path,{d:"M 20,35 50,65 80,35",animate:l,variants:no,transition:{ease:"easeInOut",duration:.2}})})})]}))}function ao(){const[o,e]=R(At);return i("textarea",{className:"p-0.5 w-full bg-slate-200 text-xs font-mono",rows:5,spellCheck:!1,value:o,onChange:t=>e(t.target.value)})}function io(){const[o,e]=R(Kt);return m("div",{className:"",children:[i(xt,{open:o,onClick:()=>e(t=>!t),children:"Path"}),i(pt,{toggle:o,children:m("div",{className:"px-1.5 pt-1.5 pb-0.5 text-sm bg-slate-300 overflow-hidden",children:[m("div",{className:"flex justify-between",children:[i("div",{className:"pb-0.5 text-xs tracking-tighter self-end",children:"path"}),m("div",{className:"pb-1 flex space-x-1",children:[i("button",{className:"px-1 pt-0.5 pb-1 bg-slate-400/40 border-slate-400 border rounded shadow-sm active:scale-[.97]",children:"Open"}),i("button",{className:"px-1 pt-0.5 pb-1 bg-slate-400/40 border-slate-400 border rounded shadow-sm active:scale-[.97]",children:"Save"}),i("button",{className:"px-1 pt-0.5 pb-1 bg-slate-400/40 border-slate-400 border rounded shadow-sm active:scale-[.97]",children:"Clear"})]})]}),i("label",{children:i(ao,{})})]})})]})}function lo(o){const s=o,{title:e}=s,t=Y(s,["title"]);return m("svg",I(A({fill:"currentColor",viewBox:"0 0 24 24"},t),{children:[e&&i("title",{children:e}),i("path",{d:"M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"})]}))}const ro={M:["x","y"],m:["dx","dy"],L:["x","y"],l:["dx","dy"],V:["y"],v:["dy"],H:["x"],h:["dx"],C:["x1","y1","x2","y2","x","y"],c:["dx1","dy1","dx2","dy2","dx","dy"],S:["x2","y2","x","y"],s:["dx2","dy2","dx","dy"],Q:["x1","y1","x","y"],q:["dx1","dy1","dx","dy"],T:["x","y"],t:["dx","dy"],A:["rx","ry","x-axis-rotation","large-arc-flag","sweep-flag","x","y"],a:["rx","ry","x-axis-rotation","large-arc-flag","sweep-flag","dx","dy"]};function co(o,e){var t;return((t=ro[o])==null?void 0:t[e])||""}const uo={M:[-1,-1],m:[-1,-1],L:[-1,-1],l:[-1,-1],V:[-1],v:[-1],H:[-1],h:[-1],C:[0,0,1,1,-1,-1],c:[0,0,1,1,-1,-1],S:[0,0,-1,-1],s:[0,0,-1,-1],Q:[0,0,-1,-1],q:[0,0,-1,-1],T:[-1,-1],t:[-1,-1],A:[0,0,-1,-1,-1,-1,-1],a:[0,0,-1,-1,-1,-1,-1]};function ho(o,e){var t,s;return(s=(t=uo[o])==null?void 0:t[e])!=null?s:-1}function fo({svgItemEdit:o}){const e=b(o.typeAtom),[t,s]=R(o.isRelAtom);return i("label",{className:`flex-0 w-5 h-5 leading-3 text-xs flex items-center justify-center rounded-l-[0.2rem] text-center text-slate-900 ${t?"bg-slate-400":"bg-slate-500"} cursor-pointer select-none`,onClick:()=>s(n=>!n),children:i("div",{className:"",children:e})})}function mo({atom:o,isFirstRow:e,isActivePt:t,isHoverPt:s,editorIdx:n,debugIdx:a,stateAtom:l,tooltip:r}){const[u,c]=R(o),[h,d]=g.useState(""+u);g.useEffect(()=>d(""+u),[u]);const p=N(lt),v=g.useRef(null),C=jt(v);g.useEffect(()=>{p({atom:l,states:{hoverEd:C?n[1]:-1}})},[C]);function F(){se(),p({atom:l,states:{activeEd:-1}})}return m("label",{className:`relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex ${t?"bg-blue-300":s?"bg-slate-400/40":""}`,ref:v,children:[Ae,i("input",{className:`px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none ${t?"text-blue-900 bg-[#fff5] border-blue-300":s?"bg-slate-200 border-slate-400/40":""} border-b-2 focus:border-blue-500  cursor-default focus:cursor-text`,value:h,onChange:$=>G($.target.value),onFocus:()=>p({atom:l,states:{activeEd:n[1]}}),onBlur:F}),t&&C&&i("div",{className:`mini-tooltip ${e?"tooltip-up":"tooltip-down"} absolute min-w-[1.75rem] py-0.5 left-1/2 -translate-x-1/2 ${e?"top-[calc(100%+4px)]":"-top-[calc(100%+4px)]"} text-xs text-center text-slate-100 bg-slate-400 rounded z-10`,children:r})]});function G($){$=$.replace(/[\u066B,]/g,".").replace(/[^\-0-9.eE]/g,""),d($);const Vt=+$;$&&!isNaN(Vt)&&c(Vt)}function se(){(!h||isNaN(+h))&&d(""+u)}}function po({svgItemEdit:o}){const e=o.svgItemIdx,t=o.stateAtom,s=b(o.typeAtom),n=N(lt),a=b(t),l=a.activeRow,r=a.hoverRow,u=g.useRef(null),c=jt(u),[h,d]=g.useState(!1);return de(()=>d(c),100,[c]),g.useEffect(()=>{n({atom:t,states:{hoverRow:c}})},[h]),i(Z,{children:m("div",{ref:u,className:`px-1.5 flex items-center justify-between ${l?"bg-blue-300":r?"bg-slate-400/40":""}`,onClick:()=>{n({atom:t,states:{activeRow:!0}})},onFocus:()=>{n({atom:t,states:{activeRow:!0}})},children:[m("div",{className:"flex items-center justify-items-start font-mono space-x-0.5",children:[i(fo,{svgItemEdit:o}),o.valueAtoms.map((p,v)=>i(mo,{atom:p,isFirstRow:e===0,isActivePt:l,isHoverPt:r,editorIdx:[e,ho(s,v)],debugIdx:v,stateAtom:t,tooltip:co(s,v)},v))]}),i("button",{className:"flex-0 mt-0.5 active:scale-[.97]",tabIndex:-1,"aria-label":"sub-menu",children:i(lo,{className:"w-4 h-4"})})]})})}function xo(){const e=b(B).edits;return i("div",{className:"my-1 py-0.5 space-y-0.5",children:e.map((t,s)=>i(po,{svgItemEdit:t},s))})}function vo(){const[o,e]=R(Qt);return m("div",{className:"",children:[i(xt,{open:o,onClick:()=>e(t=>!t),children:"Path Commands"}),i(pt,{toggle:o,children:i("div",{className:"text-sm bg-slate-300 overflow-hidden",children:i(xo,{})})})]})}function vt(o,e){const[t,s]=g.useState(""+o);g.useEffect(()=>s(""+o),[o]);function n(r){r=r.replace(/[\u066B,]/g,".").replace(/[^\-0-9.eE]/g,""),s(r);const u=+r;r&&!isNaN(u)&&e(u)}function a(){(!t||isNaN(+t))&&s(""+o)}function l(r){n(r.target.value)}return{value:t,onChange:l,onBlur:a}}function nt({label:o,className:e="",atom:t}){const[s,n]=R(t),a=vt(s,l=>n(l));return m("label",{className:`relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500 ${e}`,children:[i("div",{className:"px-1 -mt-1 absolute text-[.6rem]",children:o}),i("input",A({className:"px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"},a))]})}f(null,(o,e)=>{o(te),o(ee)});function bo(){return m("div",{className:"my-1 flex space-x-1",children:[i(nt,{atom:te,label:"Scale X"}),i(nt,{atom:ee,label:"Scale Y"}),i("button",{className:"px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]",children:"Scale"})]})}function wo(){return m("div",{className:"my-1 flex space-x-1",children:[i(nt,{atom:Ve,label:"Translate X"}),i(nt,{atom:Be,label:"Translate Y"}),i("button",{className:"px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]",children:"Translate"})]})}function yo(){return m("div",{className:"my-1 flex space-x-1",children:[i(nt,{atom:$e,label:"Number of decimals",className:""}),i("button",{className:"px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]",title:"Round all path numbers",children:"Round"}),i("button",{className:"px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]",title:"Convert to relative",children:"To rel"}),i("button",{className:"px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]",title:"Convert to absolute",children:"To abs"})]})}function go(){const[o,e]=R(_t);return m("div",{className:"",children:[i(xt,{open:o,onClick:()=>e(t=>!t),children:"Path Operations"}),i(pt,{toggle:o,children:m("div",{className:"px-1.5 py-0.5 text-sm bg-slate-300 overflow-hidden",children:[i(bo,{}),i(wo,{}),i(yo,{})]})})]})}function at(...o){return o.filter(Boolean).join(" ")}function bt({label:o,tooltip:e,idx:t}){const[s,n]=R(Le),a=s.map(r=>parseFloat(r.toFixed(3))),l=vt(a[t],r=>{let u=[...a];u[t]=r,t===2&&(u[3]=null),t===3&&(u[2]=null),n(u)});return m("label",{className:"relative text-xs select-none",title:e,children:[i("div",{className:"absolute left-1.5 text-[.6rem] text-slate-900/60",children:o}),i("input",A({className:"px-1 pt-3 w-14 h-8 text-xs text-slate-900 bg-slate-200 border-slate-300 rounded border focus:outline-none shadow-sm shadow-slate-800/30"},l))]})}function Po(){return m("div",{className:"flex space-x-1.5",children:[i(bt,{label:"x",tooltip:"view box x",idx:0}),i(bt,{label:"y",tooltip:"view box y",idx:1}),i(bt,{label:"width",tooltip:"view box width",idx:2}),i(bt,{label:"height",tooltip:"view box height",idx:3})]})}function Ot({label:o,title:e,atom:t,value:s,className:n=""}){const a=N(t);return i("button",{className:at("px-1 pb-px h-8 text-xs text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/50 active:scale-[.97] select-none",n),onClick:()=>a(s),title:e,children:o})}function ko({className:o}){const e=N(rt);return fe(t=>t.altKey&&(t.key==="1"||t.key==="2"||t.key==="3"),t=>{t.preventDefault(),e(t.key==="1"?10:t.key==="3"?-10:0)}),m("div",{className:at("flex items-center",o),children:[i(Ot,{label:"-",title:"Zoom Out (Alt+1)",atom:rt,value:10,className:"rounded-l border w-8"}),i(Ot,{label:"Zoom to Fit",title:"Zoom to Fit (Alt+2)",atom:rt,value:0,className:"border-t border-b px-2"}),i(Ot,{label:"+",title:"Zoom In (Alt+3)",atom:rt,value:-10,className:"rounded-r border w-8"})]})}function Q(a){var l=a,{label:o,tooltip:e,atom:t,className:s}=l,n=Y(l,["label","tooltip","atom","className"]);const[r,u]=R(t);return m("label",I(A({className:at("w-min h-6 whitespace-nowrap flex items-center text-xs space-x-1.5 select-none",s),title:e},n),{children:[i("input",{type:"checkbox",className:"rounded text-slate-500 bg-slate-300 focus:ring-slate-500 focus:ring-offset-1",checked:r,onChange:()=>u(c=>!c)}),i("div",{className:"",children:o})]}))}function Co(t){var s=t,{className:o}=s,e=Y(s,["className"]);const[n,a]=R(st),l=vt(n,r=>a(r));return m("label",I(A({className:at("flex items-center text-xs space-x-1 select-none",o)},e),{children:[i("div",{className:"",children:"Precision"}),i("input",A({className:"w-8 h-[1.375rem] text-xs text-center text-slate-900 bg-slate-200 border-slate-300 rounded border focus:outline-none shadow-sm shadow-slate-800/30",title:"Point precision"},l))]}))}function Ao(t){var s=t,{className:o}=s,e=Y(s,["className"]);const n=b(ht),a=b(dt),[l,r]=R(Et),u=vt(l,c=>r(c));return i(Z,{children:i("div",I(A({className:at("flex justify-between",o)},e),{children:n&&m(Z,{children:[i(Q,{label:"Ticks",tooltip:"Show ticks",atom:dt}),i("div",{className:"flex items-center ",children:a&&i("input",A({className:"w-8 h-[1.375rem] text-xs text-center text-slate-900 bg-slate-200 border-slate-300 shadow-slate-800/30 rounded border focus:outline-none shadow-sm focus:ring-0",title:"Ticks interval"},u))})]})}))})}function No(){return i("div",{className:"px-1.5 pt-1 pb-3 bg-slate-400/40 rounded flex items-center space-x-2",children:m("div",{className:"flex flex-col",children:[i("div",{className:"text-xs",children:"viewbox"}),i(Po,{}),i(ko,{className:"mt-3"}),m("div",{className:"mt-2 grid grid-cols-[1fr,minmax(6rem,min-content)]",children:[i(Q,{label:"Snap to grid",tooltip:"Snap dragged points to grid",atom:Mt}),i(Co,{className:"justify-end"}),i(Q,{label:"Show grid",tooltip:"Show grid",atom:ht}),i(Ao,{className:"justify-end"}),i(Q,{label:"Show point contols",tooltip:"Show SVG point contols",atom:ut}),i(Q,{label:"Fill path",tooltip:"Fill path",className:"",atom:Lt}),i(Q,{label:"Minify output",tooltip:"Minify output path",className:"col-span-full",atom:Dt})]})]})})}function So(){const[o,e]=R(Jt);return m("div",{className:"",children:[i(xt,{open:o,onClick:()=>e(t=>!t),children:"Options"}),i(pt,{toggle:o,children:i("div",{className:"text-sm bg-slate-300 overflow-hidden",children:i(No,{})})})]})}function Ro(){return i("div",{className:"py-1 w-[300px] max-w-[300px] flex flex-col space-y-1 bg-slate-600 border border-slate-900",children:i("div",{className:"flex-1 min-w-0 min-h-0",children:m(so,{className:"overflow-auto w-full h-full",children:[i(io,{}),i(vo,{}),i(go,{}),i(So,{})]})})})}function Eo(){return i("div",{className:"flex-1 relative",children:i(oo,{})})}function Mo(){return m("div",{className:"h-screen flex overflow-hidden",children:[i(Ro,{}),i(Eo,{})]})}me.render(i(g.StrictMode,{children:i(Mo,{})}),document.getElementById("root"));
