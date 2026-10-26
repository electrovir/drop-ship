const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/debug-parts-scene-C0cJh2vv.js","assets/antha-engine-Co0bXfdK.js","assets/rolldown-runtime-XKyaHtl9.js","assets/input-device-CXEkPP-B.js","assets/game-scene.mod-Dc65o_io.js","assets/game-world-0B-oHi_Q.js","assets/Geometry-B6hwpXP0.js","assets/defaultFilter.vert-H50_ffja.js","assets/canvasUtils-BJbbCRsd.js","assets/CanvasRenderer-7_IIUfyp.js","assets/RenderTargetSystem-D2SBZc4C.js","assets/getTextureBatchBindGroup-BVNh7Q7T.js","assets/load-game-D9E8Qalm.js","assets/deploy-env-D3pDy5SS.js","assets/asset-loader-CVcXKiep.js","assets/save-data-CBlzj7_J.js","assets/save-data-BFldMswY.js"])))=>i.map(i=>d[i]);
import{$ as e,B as t,D as n,Lt as r,O as i,Ot as a,T as o,W as s,Y as c,a as l,c as u,ct as d,d as f,dt as p,f as ee,g as m,h,ht as g,k as _,lt as v,nt as y,p as b,r as x,s as S,t as C,x as w}from"./antha-engine-Co0bXfdK.js";import{a as T,d as E,f as D,i as O,l as te,m as k,n as A,o as j,p as M,r as N,t as P}from"./deploy-env-D3pDy5SS.js";import{t as F}from"./asset-loader-CVcXKiep.js";import{t as I}from"./game-world-0B-oHi_Q.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var L=class extends r()(`local-storage-client-all-values-event`){},R=class{shapes;options;listenTarget=new v;keyEvents;get AllValuesType(){throw Error(`Cannot use AllValuesType as a runtime value. It is a type only.`)}get ValueType(){throw Error(`Cannot use ValueType as a runtime value. It is a type only.`)}constructor(e,t={}){this.shapes=e,this.options=t,this.storeName=t.storeName||`local-storage-client`,this.keyEvents=s(e,e=>class extends r()(`local-storage-client-${String(e)}-event`){}),this.get=s(this.shapes,e=>(t={})=>this.getAllValues(t)[e]),this.listen=s(this.shapes,e=>t=>this.listenTarget.listen(this.keyEvents[e],async e=>{await t(e.detail)})),this.set=s(this.shapes,e=>t=>{o(t,this.shapes[e],{allowExtraKeys:!0},`LocalStorageClient: Invalid value for key '${String(e)}'.`);let n=this.getAllValues();return n[e]=t,globalThis.localStorage.setItem(this.storeName,JSON.stringify(n)),this.listenTarget.dispatch(new L({detail:n})),this.listenTarget.dispatch(new this.keyEvents[e]({detail:t})),t}),this.delete=s(this.shapes,e=>()=>{let t=this.getAllValues();delete t[e],globalThis.localStorage.setItem(this.storeName,JSON.stringify(t)),this.listenTarget.dispatch(new L({detail:t})),this.listenTarget.dispatch(new this.keyEvents[e]({detail:void 0}))})}storeName;getAllValues({throwErrorOnFailure:t=!1}={}){return M(()=>{let r=JSON.parse(globalThis.localStorage.getItem(this.storeName)||`{}`);return e(r,(e,r)=>{let i=this.shapes[e];if(i){if(t)o(r,i,{allowExtraKeys:!0});else if(!n(r,i,{allowExtraKeys:!0}))return;return{key:e,value:r}}})},{handleError:e=>{if(t)throw a(e,`LocalStorageClient: store '${this.storeName}' is corrupt and cannot be loaded.`);return{}}})}listenToAllValues(e){return this.listenTarget.listen(L,async t=>{await e(t.detail)})}listen;get;set;delete;clear(){globalThis.localStorage.removeItem(this.storeName)}destroy(){this.listenTarget.destroy()}};function z(e){return[t(e.prefix),`theme-vir-style`].join(`-`)}function B(e,t,n){let r=d(p(e.colors).flatMap(e=>[V({layerKey:`background`,themeColor:e,themeOverride:t}),V({layerKey:`foreground`,themeColor:e,themeOverride:t})]));return h(r,z(e),n)}function V({layerKey:e,themeOverride:t,themeColor:n}){let r=String(n[e].name);return[r,t?.overrides[r]||n[e].default]}var H;(function(e){e.Light=`light`,e.Dark=`dark`,e.Auto=`auto`})(H||={});var U=class extends r()(`vira-theme-applied`){},W=({useDarkTheme:e})=>{B(T,e?j:void 0)},G=`(prefers-color-scheme: dark)`,K={selectedTheme:_({theme:i(H)})},q=class extends v{applyThemeCallback=W;localStorageClient;storage;selectedTheme;appliedTheme;removeThemePreferenceListener=k(globalThis.matchMedia(G),`change`,e=>{g.instanceOf(e,MediaQueryListEvent),this.selectedTheme===H.Auto&&this.applySelection(H.Auto)});constructor(e={}){if(super(),e.applyTheme&&(this.applyThemeCallback=e.applyTheme),e.storage)this.storage=e.storage;else{let t=new R(K,{storeName:e.storeName||`vira-theme`});this.localStorageClient=t,this.storage={init:t.get.selectedTheme()?.theme,save(e){t.set.selectedTheme({theme:e})}}}this.selectedTheme=this.storage.init||H.Auto,this.applySelection(this.selectedTheme)}getCurrentTheme(){return this.selectedTheme}getAppliedTheme(){return this.appliedTheme||H.Light}setSelectedTheme(e){this.selectedTheme=e,this.applySelection(e),this.storage.save(e)}destroy(){this.removeThemePreferenceListener(),this.localStorageClient?.destroy(),super.destroy()}applySelection(e){let t=e===H.Dark||e===H.Auto&&globalThis.matchMedia(G).matches,n=t?H.Dark:H.Light;this.applyThemeCallback({useDarkTheme:t}),n!==this.appliedTheme&&(this.appliedTheme=n,this.dispatch(new U({detail:n})))}},J=1e3;function Y({hostElement:e,loadingScreenElement:t,options:n,screenSize:r}){let i=e.style.zoom?void 0:N({screenSize:r,virtualHeight:n.virtualHeight,virtualWidth:n.virtualWidth})?.scale;i==null?t.style.removeProperty(`zoom`):t.style.zoom=String(i)}var X=f()({tagName:`antha-asset-loading-screen`,state(){return{resizeObserver:void 0}},cssVars:{"antha-asset-loading-screen-fade-ms":c({value:J,suffix:`ms`})},hostClasses:{"antha-asset-loading-screen-completed"({inputs:e}){return e.completed}},init({host:e,inputs:t,updateState:n}){let{resizeObserver:r}=te(t.hostElement,({contentRect:n})=>{Y({hostElement:t.hostElement,loadingScreenElement:e,options:t.options,screenSize:n})});n({resizeObserver:r})},cleanup({state:e}){e.resizeObserver?.disconnect()},styles({cssVars:e,hostClasses:t}){return b`
            :host {
                position: fixed;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: black;
                color: white;
                z-index: 9999;
                gap: 24px;
                opacity: 1;
                transition: opacity ${e[`antha-asset-loading-screen-fade-ms`].value} ease-in;
            }

            .loading-text {
                font-size: 24px;
                position: relative;
            }

            .dots {
                font-family: monospace;
                position: absolute;
                left: 100%;
                bottom: 0;
            }

            .progress-track {
                width: 300px;
                height: 1em;
                overflow: hidden;
                border: 4px solid white;
            }

            .current-resource-name {
                font-size: 14px;
                opacity: 0.7;
            }

            .progress-fill {
                height: 100%;
                background-color: white;
                transition: width ${200}ms ease-in;
            }

            ${t[`antha-asset-loading-screen-completed`].selector} {
                opacity: 0;
            }
        `},render({host:e,inputs:t,cssVars:n}){m({forCssVar:n[`antha-asset-loading-screen-fade-ms`],onElement:e,toValue:c({value:t.loadingScreenFadeMs,suffix:`ms`})});let r=t.dotCount%4,i=`.`.repeat(r)+`\xA0`.repeat(3-r);return u`
            <span class="loading-text">
                Loading
                <span class="dots">${i}</span>
            </span>
            <div>
                <span class="current-resource-name">
                    ${t.currentResourceName||u`
                        &nbsp;
                    `}
                </span>
                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style=${b`
                            width: ${t.progressPercent}%;
                        `}
                    ></div>
                </div>
            </div>
        `}}),Z=`antha-asset`;function ne(e={}){let t=e.loadingScreenFadeMs??1e3;return l({modName:Z,async cleanup({state:e}){await e.assetLoader?.destroy()},execute({hostElement:n,state:r,engine:i}){if(r.assetLoader||=new F({logger:i.log}),r.assetLoader.advanceLoadState({currentTick:i.currentTick,engineTime:i.engineTime}),e.hideLoadingScreen)return;let a=r.assetLoader.loadState;if(a&&(a.completedAt==null||i.engineTime<=a.completedAt+t)){let r=a.total>0?a.current/a.total*100:0;return u`
                    <${X.assign({hostElement:n,options:e,progressPercent:r,dotCount:Math.floor(i.engineTime/500)%4,completed:a.completedAt!=null,currentResourceName:a.currentResourceName,loadingScreenFadeMs:t})}></${X}>
                `}}})}function re(){return function(e){return l({modName:`antha-bootstrap`,execute({engine:t,state:n}){let r=n.assetLoader;if(!r||n.hasStartedBootstrap)return x;n.hasStartedBootstrap=!0;let i=r.createLoadSession();return i.reportProgress({current:0,currentResourceName:e.assetName||`Game code`,total:0}),Promise.resolve().then(()=>e.loadModule()).then(async a=>{let o=await e.bootstrap({assetLoader:r,engine:t,loadSession:i,module:a,state:n});t.currentMods.push(...o.mods),i.complete()}).catch(e=>{i.complete(),t.log.error(a(e,`Failed to bootstrap game.`))}),x}})}}var Q=f()({tagName:`vir-debug-parts`,styles:b`
        :host {
            align-items: center;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
        }

        .canvas-parent {
            display: flex;

            & canvas {
                max-height: 100%;
                max-width: 100%;
            }
        }
    `,state(){return{destroyScene:void 0,isDestroyed:!1}},cleanup({state:e,updateState:t}){e.destroyScene?.(),t({isDestroyed:!0})},render({state:e,updateState:t}){return u`
            <div
                class="canvas-parent"
                ${E(async n=>{let{createDebugPartsScene:r}=await y(async()=>{let{createDebugPartsScene:e}=await import(`./debug-parts-scene-C0cJh2vv.js`);return{createDebugPartsScene:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11])),i=await r(n);e.isDestroyed?i():t({destroyScene:i})})}
            ></div>
        `}}),$=f()({tagName:`vir-game`,events:{loadingScreenRendered:ee()},styles:b`
        :host {
            background: black;
            display: block;
            height: 100%;
            overflow: hidden;
            position: relative;
            width: 100%;
        }

        ${S} {
            display: block;
            height: 100%;
            padding: 0;
            position: relative;
            width: 100%;
        }

        .debug-buttons {
            bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            left: 8px;
            position: absolute;
            z-index: 10;
        }

        ${Q} {
            inset: 0;
            position: absolute;
            z-index: 9;
        }
    `,state(){return{engine:new C({mods:[ne({loadingScreenFadeMs:500,virtualHeight:I.height,virtualWidth:I.width}),re()({assetName:`Game code`,async loadModule(){return await y(()=>import(`./load-game-D9E8Qalm.js`),__vite__mapDeps([12,2,1,3,13,14,4,5,6,7,8,9,10,11,15]))},bootstrap({assetLoader:e,engine:t,loadSession:n,module:r,state:i}){return r.bootstrapGame({assetLoader:e,engine:t,loadSession:n,state:i})}})]}),cleanup:void 0,isDebugViewOpen:!1}},init({dispatch:e,events:t,state:n,updateState:r}){let i=n.engine.observable.listen(!1,()=>{i(),e(new t.loadingScreenRendered({detail:void 0}))});r({cleanup:i})},cleanup({state:e}){e.cleanup?.()},render({state:e,updateState:t}){return u`
            <${S.assign({engine:e.engine})}></${S}>
            ${A===P.Dev&&e.isDebugViewOpen?u`
                      <${Q}></${Q}>
                  `:w}
            ${A===P.Dev?u`
                      <div class="debug-buttons">
                          <button
                              ${D(`click`,()=>{t({isDebugViewOpen:!e.isDebugViewOpen})})}
                          >
                              Debug
                          </button>
                          <button
                              ${D(`click`,async()=>{let{createDefaultGameSaveState:t,persistSaveState:n}=await y(async()=>{let{createDefaultGameSaveState:e,persistSaveState:t}=await import(`./save-data-BFldMswY.js`);return{createDefaultGameSaveState:e,persistSaveState:t}},__vite__mapDeps([16,15,1,2,3,14])),r=t();e.engine.state.saveState=r,await n({engine:e.engine,saveState:r}),globalThis.location.reload()})}
                          >
                              Reset all state
                          </button>
                      </div>
                  `:w}
        `}});f()({tagName:`vir-app`,styles:b`
        :host {
            color: ${T.colors[`theme-default`].foreground.value};
            display: block;
            font-family: sans-serif;
            height: 100%;
            width: 100%;
            ${O}
        }
    `,state(){let e=new q;return e.setSelectedTheme(H.Dark),{hasRenderedGameLoadingScreen:!1,themeClient:e}},cleanup({state:e}){e.themeClient.destroy()},render({state:e,updateState:t}){return u`
            <${$}
                ${D($.events.loadingScreenRendered,()=>{t({hasRenderedGameLoadingScreen:!0})})}
            ></${$}>
            ${e.hasRenderedGameLoadingScreen?w:u`
                      <slot></slot>
                  `}
        `}});