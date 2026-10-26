import{At as e,F as t,M as n,N as r,O as i,P as a,Pt as o,R as s,Y as c,_t as l,c as u,dt as ee,et as te,gt as d,k as f,st as ne,z as re}from"./antha-engine-Co0bXfdK.js";function ie({min:e,max:t}){return e>t?{min:t,max:e}:{min:e,max:t}}function ae({min:e,max:t}){let{min:n,max:r}=ie({min:Math.floor(e),max:Math.floor(t)}),i=r-n+1,a=Math.ceil(Math.ceil(Math.log2(i))/8);if(a>65e3)throw RangeError(`Cannot create a random integer so large. ({min: ${n}, max: ${r}})`);let o=Math.floor(256**a/i)*i,s=new Uint8Array(a),c;do crypto.getRandomValues(s),c=s.reduce((e,t,n)=>e+t*256**n,0);while(c>=o);return n+c%i}var oe=`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.split(``);function se(e=16){let t=``;for(let n=0;n<e;n++){let e=ae({min:0,max:oe.length-1});t+=oe[e]}return t}function ce({value:e,wrapper:t}){return te({value:c({value:e,suffix:t}),prefix:t})}function le(e){return l.isSymbol(e)?de(e):f(r.Const(e,{default:e}))}var ue=`ExactSymbol`;function de(e){return a(`ExactSymbol`)||t(ue,(e,t)=>t===e.symbol),n(ue,({schema:e})=>`Expected symbol ${e.symbol?.description?ce({value:e.symbol.description,wrapper:`'`}):`<unnamed symbol>`}`),f(r.Unsafe({[s]:ue,symbol:e,default:e}))}function fe(...e){let t={},n=e.map(e=>{let n=f(e);return Object.assign(t,n.default),n.$_schema});return f(r.Composite(n,{default:t}))}function pe(e,t={}){re.ExactOptionalPropertyTypes=!0;let n=f(e).$_schema,i=t.alsoUndefined?r.Union([r.Undefined(),n]):n;return f(r.Optional(i))}function me(...e){let t,n=e.map((e,n)=>{let r=f(e);return n||(t=r.default),r.$_schema});return f(r.Union(n,{default:t}))}function he(e,t){let n=f(e).$_schema,i=o(ne(t),([e])=>e,(e,[,t])=>!!t);return f(r.Pick(n,i))}function p({name:e,svgTemplate:t}){return{name:e,svgTemplate:t}}var ge;(function(e){e.One=`1`,e.Two=`2`,e.Three=`3`,e.Four=`4`})(ge||={});var _e=function(e){return e.Forward=`forward`,e.Right=`right`,e.Backward=`backward`,e.Left=`left`,e}({}),ve={forward:{x:0,y:1},right:{x:1,y:0},backward:{x:0,y:-1},left:{x:-1,y:0}},ye={forward:`right`,right:`backward`,backward:`left`,left:`forward`};function be(e){return ye[e]}var m=function(e){return e.Hull=`hull`,e.Cockpit=`cockpit`,e.Gun=`gun`,e.RapidGun=`rapid-gun`,e.Shield=`shield`,e.SpreadGun=`spread-gun`,e.Thruster=`thruster`,e.Magnet=`magnet`,e.MissileLauncher=`missile-launcher`,e.NovaGun=`nova-gun`,e.Laser=`laser`,e}({}),xe={hull:2,cockpit:5,gun:2,"rapid-gun":2,shield:1,"spread-gun":2,thruster:1,magnet:1,"missile-launcher":2,"nova-gun":2,laser:2},Se={hull:`forward`,cockpit:`forward`,gun:`forward`,"rapid-gun":`forward`,shield:`forward`,"spread-gun":`forward`,thruster:`backward`,magnet:`forward`,"missile-launcher":`forward`,"nova-gun":`forward`,laser:`forward`};function h({kind:e,level:t}){return xe[e]*t}var Ce=f({facing:i(_e),kind:i(m),x:0,y:0}),we=fe(Ce,{hp:0,level:0}),Te=[[{x:0,y:-1},{x:0,y:0},{x:0,y:1},{x:0,y:2}],[{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}],[{x:-1,y:0},{x:0,y:0},{x:1,y:0},{x:0,y:1}],[{x:-1,y:0},{x:0,y:0},{x:0,y:1},{x:1,y:1}],[{x:1,y:0},{x:0,y:0},{x:0,y:1},{x:-1,y:1}],[{x:-1,y:-1},{x:0,y:-1},{x:0,y:0},{x:0,y:1}],[{x:1,y:-1},{x:0,y:-1},{x:0,y:0},{x:0,y:1}]];function Ee({kind:e,random:t}){return{cells:d.isDefined(Te[Math.floor(t.next()*Te.length)]).map(t=>({facing:Se[e],kind:e,x:t.x,y:t.y}))}}var De=f({cells:[Ce]});function g(e){return{cells:e.cells.map(e=>({...e,facing:be(e.facing),x:e.y,y:0-e.x}))}}function Oe(e){return g(g(g(e)))}function ke({piece:e,position:t}){return e.cells.map(e=>({...e,x:t.x+e.x,y:t.y+e.y}))}var _=40,Ae={[m.Hull]:15,[m.Cockpit]:1e3,[m.Gun]:_,[m.RapidGun]:_,[m.Shield]:_,[m.SpreadGun]:_,[m.Thruster]:80,[m.Magnet]:_,[m.MissileLauncher]:_,[m.NovaGun]:_,[m.Laser]:_},je=e(m),Me=f({fragments:0,kind:i(m),piece:De});function Ne({kind:e,piece:t}){return t.cells.length*Ae[e]}function Pe({kind:e,random:t}){return e===m.Hull?Ee({kind:e,random:t}):{cells:[{facing:Se[e],kind:e,x:0,y:0}]}}function Fe({random:e,saved:t}){return je.map(n=>t.find(e=>e.kind===n)||{fragments:0,kind:n,piece:Pe({kind:n,random:e})})}function Ie({isOwnKindOnly:e,kind:t,partProgress:n,random:r}){return n.reduce((n,i)=>{let a=i.fragments+(i.kind===t?t===m.Hull?1:9:+(i.kind===m.Hull&&!e)),o=Ne(i);return a<o?{...n,partProgress:[...n.partProgress,{...i,fragments:a}]}:{earnedPieces:[...n.earnedPieces,i.piece],partProgress:[...n.partProgress,{fragments:a-o,kind:i.kind,piece:Pe({kind:i.kind,random:r})}]}},{earnedPieces:[],partProgress:[]})}var v={height:15,width:11},Le={x:(v.width-1)/2,y:1},Re=[{height:6,width:5},{height:9,width:7},v].map(e=>({...e,x:(v.width-e.width)/2,y:0}));Re.length;var ze=f({cells:[we]});function Be(){return{cells:[{...Le,kind:m.Cockpit},{x:Le.x,y:Le.y+1,kind:m.Gun}].map(e=>({...e,facing:_e.Forward,hp:h({kind:e.kind,level:1}),level:1}))}}function Ve(e){let t=Math.max(1,Ue({grid:e,kind:m.Cockpit}));return d.isDefined(Re[Math.min(t,Re.length)-1])}function He({grid:e,position:t}){let n=Ve(e);return t.x>=n.x&&t.y>=n.y&&t.x<n.x+n.width&&t.y<n.y+n.height}function y({grid:e,position:t}){return e.cells.find(e=>e.x===t.x&&e.y===t.y)}function Ue({grid:e,kind:t}){return e.cells.filter(e=>e.kind===t).reduce((e,t)=>e+t.level,0)}function We(e){return e.cells.some(e=>e.kind===m.Cockpit)}function Ge({grid:e,piece:t,position:n}){return ke({piece:t,position:n}).every(t=>He({grid:e,position:t}))}function Ke({cell:e,grid:t}){return ee(ve).map(n=>y({grid:t,position:{x:e.x+n.x,y:e.y+n.y}})).filter(l.isDefined)}function qe({connectedCells:e,frontier:t,grid:n}){let r=t.flatMap(e=>Ke({cell:e,grid:n})).filter((t,n,r)=>!e.includes(t)&&r.indexOf(t)===n);return r.length?qe({connectedCells:[...e,...r],frontier:r,grid:n}):[...e]}function Je(e){let t=e.cells.filter(e=>e.kind===m.Cockpit),n=qe({connectedCells:t,frontier:t,grid:e});return e.cells.filter(e=>!n.includes(e))}function Ye({grid:e,piece:t,position:n}){let r=ke({piece:t,position:n}).map(t=>({pieceCell:t,shipCell:y({grid:e,position:t})})),i=r.every(({pieceCell:t,shipCell:n})=>He({grid:e,position:t})&&(!n||n.kind===t.kind||n.kind===m.Hull)),a=r.some(({pieceCell:t,shipCell:n})=>!!n||ee(ve).some(n=>!!y({grid:e,position:{x:t.x+n.x,y:t.y+n.y}})));if(!i||!a)return;let o=r.filter(({pieceCell:e,shipCell:t})=>t?.kind===e.kind).map(({shipCell:e})=>e),s=r.filter(({pieceCell:e,shipCell:t})=>!!t&&t.kind!==e.kind).map(({shipCell:e})=>e);return{cells:[...e.cells.filter(e=>!s.includes(e)).map(e=>{if(!o.includes(e))return e;let t=e.level+1;return{...e,hp:h({kind:e.kind,level:t}),level:t}}),...r.filter(({shipCell:e})=>!e||s.includes(e)).map(({pieceCell:e})=>({...e,hp:h({kind:e.kind,level:1}),level:1}))]}}function Xe({damage:e,grid:t,position:n}){let r=y({grid:t,position:n});if(!r)return;let i=r.hp-e;if(i>0)return{grid:{cells:t.cells.map(e=>e===r?{...e,hp:i}:e)},removedCells:[]};let a={cells:t.cells.filter(e=>e!==r)},o=Je(a);return{grid:{cells:a.cells.filter(e=>!o.includes(e))},removedCells:[r,...o]}}var Ze=f({earnedPieces:[De],galaxySeed:``,partProgress:[Me],systemsCleared:0,visitedStarIndexes:[0]}),Qe=f({run:Ze,shipGrid:ze});function $e(e=se()){return{run:{earnedPieces:[],galaxySeed:e,partProgress:[],systemsCleared:0,visitedStarIndexes:[]},shipGrid:Be()}}var b=function(e){return e.Blue=`#3d7eff`,e.Cyan=`#14d7fe`,e.Green=`#30d158`,e.Orange=`#ff9f0a`,e.Pink=`#ff2d55`,e.Purple=`#bf5af2`,e.Yellow=`#ffd60a`,e.Lime=`#8db600`,e}({}),et=f({color:i(b),id:``,name:``,progress:Qe}),tt=he(et,{color:!0,name:!0});function nt(t){let n=e(b);return n.find(e=>t.every(t=>t.color!==e))??d.isDefined(n[t.length%n.length])}function rt(e){return/^Pilot \d+$/.test(e)}function it(e){return{color:nt(e),id:se(),name:[`Pilot`,e.length+1].join(` `),progress:$e()}}function at(t){let n=e(b);return d.isDefined(n[(n.indexOf(t)+1)%n.length])}function ot({fallbackName:e,name:t}){return t.trim().slice(0,16)||e}var st=function(e){return e.Music=`music`,e.Effects=`effects`,e}({}),ct=.8,lt={music:.8,effects:.8},x;(function(e){e.SwitchPro=`switch-pro`,e.PlaystationDualShock=`playstation-dual-shock`,e.PlaystationDualShock4=`playstation-dual-shock-4`,e.PlaystationDualSense=`playstation-dual-sense`,e.SteamDeck=`steam-deck`,e.Xbox360=`xbox-360`,e.XboxWireless=`xbox-wireless`})(x||={}),x.SwitchPro,x.PlaystationDualShock,x.PlaystationDualShock4,x.PlaystationDualSense,x.SteamDeck,x.Xbox360,x.XboxWireless;var S;(function(e){e.Microsoft=`microsoft`,e.Nintendo=`nintendo`,e.Sony=`sony`,e.Valve=`valve`})(S||={});var ut={[x.SwitchPro]:`Nintendo Switch Pro gamepad for the Nintendo Switch console.`,[x.PlaystationDualSense]:`Sony PlayStation DualSense gamepad for the Sony PlayStation 5 console.`,[x.PlaystationDualShock]:`Sony PlayStation DualShock gamepad for the Sony PlayStation 1 through Sony PlayStation 3 consoles.`,[x.PlaystationDualShock4]:`Sony PlayStation DualShock 4 gamepad for the Sony PlayStation 4 console.`,[x.SteamDeck]:`Gamepad for the Valve Steam Deck handheld console.`,[x.Xbox360]:`Microsoft Xbox 360 gamepad for the Microsoft Xbox 360 console. Can be wired or wireless.`,[x.XboxWireless]:`Microsoft Xbox Wireless gamepad for Microsoft Xbox One through Xbox Series X/S consoles.`},C;(function(e){e.FaceAccept=`face-accept`,e.FaceCancel=`face-cancel`,e.FaceAlt1=`face-alt-1`,e.FaceAlt2=`face-alt-2`,e.L1=`L1`,e.L2=`L2`,e.L3=`L3`,e.R1=`R1`,e.R2=`R2`,e.R3=`R3`,e.LeftStickX=`left-stick-x`,e.LeftStickY=`left-stick-y`,e.RightStickX=`right-stick-x`,e.RightStickY=`right-stick-y`,e.DPad=`d-pad`,e.DPadDown=`d-pad-down`,e.DPadLeft=`d-pad-left`,e.DPadRight=`d-pad-right`,e.DPadUp=`d-pad-up`,e.Select=`select`,e.Logo=`logo`,e.Start=`start`,e.Capture=`capture`,e.Home=`home`,e.Mute=`mute`,e.Share=`share`,e.TouchPad=`touch-pad`})(C||={});var dt={[x.SwitchPro]:{[C.L1]:`L`,[C.R1]:`R`,[C.L2]:`ZL`,[C.R2]:`ZR`,[C.FaceAccept]:`A`,[C.FaceCancel]:`B`,[C.FaceAlt1]:`X`,[C.FaceAlt2]:`Y`,[C.Select]:`minus`,[C.Start]:`plus`},[x.PlaystationDualShock]:{[C.FaceAccept]:`X`,[C.FaceCancel]:`O`,[C.FaceAlt1]:`square`,[C.FaceAlt2]:`triangle`},[x.PlaystationDualShock4]:{[C.FaceAccept]:`X`,[C.FaceCancel]:`O`,[C.FaceAlt1]:`square`,[C.FaceAlt2]:`triangle`,[C.Select]:`share`},[x.PlaystationDualSense]:{[C.FaceAccept]:`X`,[C.FaceCancel]:`O`,[C.FaceAlt1]:`square`,[C.FaceAlt2]:`triangle`,[C.Select]:`create`,[C.Start]:`options`},[x.SteamDeck]:{[C.FaceAccept]:`A`,[C.FaceCancel]:`B`,[C.FaceAlt1]:`X`,[C.FaceAlt2]:`Y`,[C.Select]:`view`,[C.Start]:`menu`},[x.Xbox360]:{[C.L1]:`LB`,[C.R1]:`RB`,[C.L2]:`LT`,[C.R2]:`RT`,[C.FaceAccept]:`A`,[C.FaceCancel]:`B`,[C.FaceAlt1]:`X`,[C.FaceAlt2]:`Y`,[C.Select]:`back`},[x.XboxWireless]:{[C.L1]:`LB`,[C.R1]:`RB`,[C.L2]:`LT`,[C.R2]:`RT`,[C.FaceAccept]:`A`,[C.FaceCancel]:`B`,[C.FaceAlt1]:`X`,[C.FaceAlt2]:`Y`,[C.Select]:`view`,[C.Start]:`menu`}},w=p({name:`ButtonAIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 27 L29.2 34 34.8 34 32 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 42 L36.4 38 27.6 38 26 42 22 42 30 22 34 22 42 42 38 42"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M32 27 L29.2 34 34.8 34 32 27 M38 42 L36.4 38 27.6 38 26 42 22 42 30 22 34 22 42 42 38 42 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),T=p({name:`ButtonBIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 36 Q41 38.45 39.25 40.2 L39.2 40.25 Q37.45 42 35 42 L25 42 25 22 35 22 Q37.45 22 39.2 23.75 L39.25 23.8 Q41 25.55 41 28 41 30.3 39.5 32 41 33.7 41 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 28 Q37 27.2 36.45 26.65 L36.35 26.55 Q35.8 26 35 26 L29 26 29 30 35 30 Q35.8 30 36.4 29.4 L36.45 29.4 Q37 28.85 37 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 36 Q37 35.15 36.45 34.6 L36.4 34.6 Q35.8 34 35 34 L29 34 29 38 35 38 Q35.8 38 36.35 37.45 L36.45 37.35 Q37 36.8 37 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M41 36 Q41 38.45 39.25 40.2 L39.2 40.25 Q37.45 42 35 42 L25 42 25 22 35 22 Q37.45 22 39.2 23.75 L39.25 23.8 Q41 25.55 41 28 41 30.3 39.5 32 41 33.7 41 36 M37 28 Q37 27.2 36.45 26.65 L36.35 26.55 Q35.8 26 35 26 L29 26 29 30 35 30 Q35.8 30 36.4 29.4 L36.45 29.4 Q37 28.85 37 28 M37 36 Q37 35.15 36.45 34.6 L36.4 34.6 Q35.8 34 35 34 L29 34 29 38 35 38 Q35.8 38 36.35 37.45 L36.45 37.35 Q37 36.8 37 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),E=p({name:`ButtonXIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 35 32 41 39 41 40 38.75 42 37.65 42 32 35.5 26.4 42 25.25 42 23 40 23 39 29 32 23 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 35 32 41 39 41 40 38.75 42 37.65 42 32 35.5 26.4 42 25.25 42 23 40 23 39 29 32 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),D=p({name:`ButtonYIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 34 32.9 34 42 30 42 30 32.9 23 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 34 32.9 34 42 30 42 30 32.9 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),O=p({name:`StickLPressIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 18.5 10.85 22.75 9.45 L26.15 12.95 Q21.25 14.05 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 42.75 14.05 37.9 12.95 L41.25 9.45 Q45.5 10.85 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 13.5 L24.45 6.85 Q24 6.35 24 5.65 24 4.95 24.45 4.5 24.9 4 25.6 4 L38.4 4 Q39.05 4 39.55 4.5 40 4.95 40 5.65 40 6.35 39.55 6.85 L33.15 13.5 Q32.65 14 32 14 31.3 14 30.85 13.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 18.5 10.85 22.75 9.45 L26.15 12.95 Q21.25 14.05 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 42.75 14.05 37.9 12.95 L41.25 9.45 Q45.5 10.85 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 13.5 L24.45 6.85 Q24 6.35 24 5.65 24 4.95 24.45 4.5 24.9 4 25.6 4 L38.4 4 Q39.05 4 39.55 4.5 40 4.95 40 5.65 40 6.35 39.55 6.85 L33.15 13.5 Q32.65 14 32 14 31.3 14 30.85 13.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),k=p({name:`StickRPressIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 18.5 10.85 22.75 9.45 L26.15 12.95 Q21.25 14.05 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 42.75 14.05 37.9 12.95 L41.25 9.45 Q45.5 10.85 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 13.5 L24.45 6.85 Q24 6.35 24 5.65 24 4.95 24.45 4.5 24.9 4 25.6 4 L38.4 4 Q39.05 4 39.55 4.5 40 4.95 40 5.65 40 6.35 39.55 6.85 L33.15 13.5 Q32.65 14 32 14 31.3 14 30.85 13.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 18.5 10.85 22.75 9.45 L26.15 12.95 Q21.25 14.05 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 42.75 14.05 37.9 12.95 L41.25 9.45 Q45.5 10.85 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 13.5 L24.45 6.85 Q24 6.35 24 5.65 24 4.95 24.45 4.5 24.9 4 25.6 4 L38.4 4 Q39.05 4 39.55 4.5 40 4.95 40 5.65 40 6.35 39.55 6.85 L33.15 13.5 Q32.65 14 32 14 31.3 14 30.85 13.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
            </g>
        </svg>
    `}),A=p({name:`StickLHorizontalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15 M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),j=p({name:`StickLLeftIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),M=p({name:`StickLRightIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),N=p({name:`StickLVerticalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5 M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),P=p({name:`StickLUpIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),F=p({name:`StickLDownIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 M25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="M31 30 L31 20 28 20 28 33 37 33 37 30 31 30" />
            </g>
        </svg>
    `}),I=p({name:`StickRHorizontalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15 M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
            </g>
        </svg>
    `}),L=p({name:`StickRLeftIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
            </g>
        </svg>
    `}),R=p({name:`StickRRightIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
            </g>
        </svg>
    `}),z=p({name:`StickRVerticalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5 M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
            </g>
        </svg>
    `}),B=p({name:`StickRUpIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
            </g>
        </svg>
    `}),V=p({name:`StickRDownIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 30 L34 29.9 34 30 35 33 38 33 36.5 28.5 Q38 27.05 38 25 38 22.95 36.5 21.45 35.05 20 33 20 L27 20 27 33 30 33 30 30 33 30M30 27 L30 23 33 23 Q33.85 23 34.4 23.55 35 24.15 35 25 35 25.85 34.4 26.4 33.85 27 33.05 27 L30 27"
                />
            </g>
        </svg>
    `}),ft=p({name:`XboxButtonAIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 27 L29.2 34 34.8 34 32 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 42 L36.4 38 27.6 38 26 42 22 42 30 22 34 22 42 42 38 42"
                />
                <path
                    fill="#00ED70"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M32 27 L29.2 34 34.8 34 32 27 M38 42 L36.4 38 27.6 38 26 42 22 42 30 22 34 22 42 42 38 42"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#00ED70"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),pt=p({name:`XboxButtonBIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 36 Q40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L24 42 24 22 34 22 Q36.45 22 38.2 23.75 L38.25 23.8 Q40 25.55 40 28 40 30.3 38.5 32 40 33.7 40 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 28 Q36 27.2 35.45 26.65 L35.35 26.55 Q34.8 26 34 26 L28 26 28 30 34 30 Q34.8 30 35.4 29.4 L35.45 29.4 Q36 28.85 36 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 36 Q36 35.15 35.45 34.6 L35.4 34.6 Q34.8 34 34 34 L28 34 28 38 34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36"
                />
                <path
                    fill="#FF2640"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M40 36 Q40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L24 42 24 22 34 22 Q36.45 22 38.2 23.75 L38.25 23.8 Q40 25.55 40 28 40 30.3 38.5 32 40 33.7 40 36 M36 28 Q36 27.2 35.45 26.65 L35.35 26.55 Q34.8 26 34 26 L28 26 28 30 34 30 Q34.8 30 35.4 29.4 L35.45 29.4 Q36 28.85 36 28 M36 36 Q36 35.15 35.45 34.6 L35.4 34.6 Q34.8 34 34 34 L28 34 28 38 34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FF2640"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),H=p({name:`StickHorizontalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15 M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),U=p({name:`StickLeftIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),W=p({name:`StickRightIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),G=p({name:`StickVerticalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5 M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),K=p({name:`StickUpIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),q=p({name:`StickDownIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 M25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),mt=p({name:`GamecubeDpadNoneIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 15 L34 23 30 23 30 15 34 15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 30 L49 30 49 34 41 34 41 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 41 L34 49 30 49 30 41 34 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15 30 L23 30 23 34 15 34 15 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M34 15 L34 23 30 23 30 15 34 15 M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M41 30 L49 30 49 34 41 34 41 30 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11 M34 41 L34 49 30 49 30 41 34 41 M15 30 L23 30 23 34 15 34 15 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),ht=p({name:`GamecubeDpadDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 38 L52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 23 L30 23 30 15 34 15 34 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 34 L41 30 49 30 49 34 41 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 49 L34 41 30 41 30 49 34 49"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15 34 L15 30 23 30 23 34 15 34"
                />
                <path
                    fill="#FFFFFF"
                    d="M12 38 L52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 M27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 M34 23 L30 23 30 15 34 15 34 23 M41 34 L41 30 49 30 49 34 41 34 M34 49 L34 41 30 41 30 49 34 49 M15 34 L15 30 23 30 23 34 15 34"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56"
                />
            </g>
        </svg>
    `}),gt=p({name:`GamecubeDpadLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 23 L30 15 34 15 34 23 30 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 30 L49 30 49 34 41 34 41 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11 L27 11 Q26 11 26 12 L26 52"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 49 L30 41 34 41 34 49 30 49"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15 30 L15 34 23 34 23 30 15 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M30 23 L30 15 34 15 34 23 30 23 M41 30 L49 30 49 34 41 34 41 30 M8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 M26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11 L27 11 Q26 11 26 12 L26 52 M30 49 L30 41 34 41 34 49 30 49 M15 30 L15 34 23 34 23 30 15 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37"
                />
            </g>
        </svg>
    `}),_t=p({name:`GamecubeDpadRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 23 L30 23 30 15 34 15 34 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M49 30 L41 30 41 34 49 34 49 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 52 L38 12 Q38 11 37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 30 L23 34 15 34 15 30 23 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 49 L30 49 30 41 34 41 34 49"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37"
                />
                <path
                    fill="#FFFFFF"
                    d="M34 23 L30 23 30 15 34 15 34 23 M49 30 L41 30 41 34 49 34 49 30 M38 52 L38 12 Q38 11 37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 M23 30 L23 34 15 34 15 30 23 30 M34 49 L30 49 30 41 34 41 34 49 M56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37"
                />
            </g>
        </svg>
    `}),vt=p({name:`GamecubeDpadUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 15 L30 15 30 23 34 23 34 15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L12 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 30 L49 30 49 34 41 34 41 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 41 L34 49 30 49 30 41 34 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15 30 L23 30 23 34 15 34 15 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M34 15 L30 15 30 23 34 23 34 15 M12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L12 26 M41 30 L49 30 49 34 41 34 41 30 M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M34 41 L34 49 30 49 30 41 34 41 M15 30 L23 30 23 34 15 34 15 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),yt=p({name:`ButtonLIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 15 L26 15 Q20.65 15 16.8 18.85 13 22.65 13 28 L13 44 Q13 49 18 49 L46 49 Q51 49 51 44 L51 20 Q51 15 46 15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 42 L25 22 29 22 29 38 39 38 39 42 25 42"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 12 L48.15 12.2 Q50.95 12.65 52.4 14.45 54 16.45 54 20 L54 44 Q54 52 46 52 L18 52 Q10 52 10 44 L10 28 Q10 21.4 14.7 16.7 19.4 12 26 12 L46 12"
                />
                <path
                    fill="#FFFFFF"
                    d="M46 15 L26 15 Q20.65 15 16.8 18.85 13 22.65 13 28 L13 44 Q13 49 18 49 L46 49 Q51 49 51 44 L51 20 Q51 15 46 15 M25 42 L25 22 29 22 29 38 39 38 39 42 25 42 M46 12 L48.15 12.2 Q50.95 12.65 52.4 14.45 54 16.45 54 20 L54 44 Q54 52 46 52 L18 52 Q10 52 10 44 L10 28 Q10 21.4 14.7 16.7 19.4 12 26 12 L46 12"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 12 L48.15 12.2 Q50.95 12.65 52.4 14.45 54 16.45 54 20 L54 44 Q54 52 46 52 L18 52 Q10 52 10 44 L10 28 Q10 21.4 14.7 16.7 19.4 12 26 12 L46 12"
                />
            </g>
        </svg>
    `}),bt=p({name:`ButtonRIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 15 Q13 15 13 20 L13 44 Q13 49 18 49 L46 49 Q51 49 51 44 L51 28 Q51 22.65 47.2 18.85 43.35 15 38 15 L18 15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 12 L38 12 Q44.6 12 49.3 16.7 54 21.4 54 28 L54 44 Q54 52 46 52 L18 52 Q10 52 10 44 L10 20 Q10 16.45 11.6 14.45 13.05 12.65 15.85 12.2 L18 12"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 22 L34.2 22 Q35.75 22.05 37 22.8 L38.2 23.7 38.25 23.75 Q40 25.5 40 28 L40 30 Q40 32.45 38.25 34.2 L38.2 34.25 38.1 34.35 40 42 36 42 34.5 36 34 36 28 36 28 42 24 42 24 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 26 L28 32 34 32 Q34.8 32 35.35 31.45 L35.45 31.35 Q36 30.8 36 30 L36 28 Q36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M18 15 Q13 15 13 20 L13 44 Q13 49 18 49 L46 49 Q51 49 51 44 L51 28 Q51 22.65 47.2 18.85 43.35 15 38 15 L18 15 M18 12 L38 12 Q44.6 12 49.3 16.7 54 21.4 54 28 L54 44 Q54 52 46 52 L18 52 Q10 52 10 44 L10 20 Q10 16.45 11.6 14.45 13.05 12.65 15.85 12.2 L18 12 M24 22 L34.2 22 Q35.75 22.05 37 22.8 L38.2 23.7 38.25 23.75 Q40 25.5 40 28 L40 30 Q40 32.45 38.25 34.2 L38.2 34.25 38.1 34.35 40 42 36 42 34.5 36 34 36 28 36 28 42 24 42 24 22 M28 26 L28 32 34 32 Q34.8 32 35.35 31.45 L35.45 31.35 Q36 30.8 36 30 L36 28 Q36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 12 L38 12 Q44.6 12 49.3 16.7 54 21.4 54 28 L54 44 Q54 52 46 52 L18 52 Q10 52 10 44 L10 20 Q10 16.45 11.6 14.45 13.05 12.65 15.85 12.2 L18 12"
                />
            </g>
        </svg>
    `}),xt=p({name:`ButtonsNoneIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 35.3 53.6 37.65 51.25 40 48 40 44.7 40 42.35 37.65 40 35.3 40 32 40 28.75 42.35 26.4 44.7 24 48 24 51.25 24 53.6 26.4 56 28.75 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M51.5 35.55 L51.5 35.5 Q53 34.05 53 32 53 30 51.5 28.55 L51.45 28.5 Q50 27 48 27 45.95 27 44.5 28.5 L44.5 28.55 Q43 30 43 32 43 34.05 44.5 35.55 45.95 37 48 37 50 37 51.5 35.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 16 Q40 19.3 37.6 21.65 35.25 24 32 24 28.7 24 26.35 21.65 24 19.3 24 16 24 12.75 26.35 10.4 28.7 8 32 8 35.25 8 37.6 10.4 40 12.75 40 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12.5 35.55 Q13.95 37 16 37 18 37 19.5 35.55 L19.5 35.5 Q21 34.05 21 32 21 30 19.5 28.55 L19.45 28.5 Q18 27 16 27 13.95 27 12.5 28.5 L12.5 28.55 Q11 30 11 32 11 34.05 12.5 35.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 16 Q27 18.05 28.5 19.55 29.95 21 32 21 34 21 35.5 19.55 L35.5 19.5 Q37 18.05 37 16 37 14 35.5 12.55 L35.45 12.5 Q34 11 32 11 29.95 11 28.5 12.5 L28.5 12.55 Q27 14 27 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 32 Q24 35.3 21.6 37.65 19.25 40 16 40 12.7 40 10.35 37.65 8 35.3 8 32 8 28.75 10.35 26.4 12.7 24 16 24 19.25 24 21.6 26.4 24 28.75 24 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 48 Q40 51.3 37.6 53.65 35.25 56 32 56 28.7 56 26.35 53.65 24 51.3 24 48 24 44.75 26.35 42.4 28.7 40 32 40 35.25 40 37.6 42.4 40 44.75 40 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.5 44.5 L28.5 44.55 Q27 46 27 48 27 50.05 28.5 51.55 29.95 53 32 53 34 53 35.5 51.55 L35.5 51.5 Q37 50.05 37 48 37 46 35.5 44.55 L35.45 44.5 Q34 43 32 43 29.95 43 28.5 44.5"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 35.3 53.6 37.65 51.25 40 48 40 44.7 40 42.35 37.65 40 35.3 40 32 40 28.75 42.35 26.4 44.7 24 48 24 51.25 24 53.6 26.4 56 28.75 56 32 M51.5 35.55 L51.5 35.5 Q53 34.05 53 32 53 30 51.5 28.55 L51.45 28.5 Q50 27 48 27 45.95 27 44.5 28.5 L44.5 28.55 Q43 30 43 32 43 34.05 44.5 35.55 45.95 37 48 37 50 37 51.5 35.55 M40 16 Q40 19.3 37.6 21.65 35.25 24 32 24 28.7 24 26.35 21.65 24 19.3 24 16 24 12.75 26.35 10.4 28.7 8 32 8 35.25 8 37.6 10.4 40 12.75 40 16 M12.5 35.55 Q13.95 37 16 37 18 37 19.5 35.55 L19.5 35.5 Q21 34.05 21 32 21 30 19.5 28.55 L19.45 28.5 Q18 27 16 27 13.95 27 12.5 28.5 L12.5 28.55 Q11 30 11 32 11 34.05 12.5 35.55 M27 16 Q27 18.05 28.5 19.55 29.95 21 32 21 34 21 35.5 19.55 L35.5 19.5 Q37 18.05 37 16 37 14 35.5 12.55 L35.45 12.5 Q34 11 32 11 29.95 11 28.5 12.5 L28.5 12.55 Q27 14 27 16 M24 32 Q24 35.3 21.6 37.65 19.25 40 16 40 12.7 40 10.35 37.65 8 35.3 8 32 8 28.75 10.35 26.4 12.7 24 16 24 19.25 24 21.6 26.4 24 28.75 24 32 M40 48 Q40 51.3 37.6 53.65 35.25 56 32 56 28.7 56 26.35 53.65 24 51.3 24 48 24 44.75 26.35 42.4 28.7 40 32 40 35.25 40 37.6 42.4 40 44.75 40 48 M28.5 44.5 L28.5 44.55 Q27 46 27 48 27 50.05 28.5 51.55 29.95 53 32 53 34 53 35.5 51.55 L35.5 51.5 Q37 50.05 37 48 37 46 35.5 44.55 L35.45 44.5 Q34 43 32 43 29.95 43 28.5 44.5"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 35.3 53.6 37.65 51.25 40 48 40 44.7 40 42.35 37.65 40 35.3 40 32 40 28.75 42.35 26.4 44.7 24 48 24 51.25 24 53.6 26.4 56 28.75 56 32 M40 16 Q40 19.3 37.6 21.65 35.25 24 32 24 28.7 24 26.35 21.65 24 19.3 24 16 24 12.75 26.35 10.4 28.7 8 32 8 35.25 8 37.6 10.4 40 12.75 40 16 M24 32 Q24 35.3 21.6 37.65 19.25 40 16 40 12.7 40 10.35 37.65 8 35.3 8 32 8 28.75 10.35 26.4 12.7 24 16 24 19.25 24 21.6 26.4 24 28.75 24 32 M40 48 Q40 51.3 37.6 53.65 35.25 56 32 56 28.7 56 26.35 53.65 24 51.3 24 48 24 44.75 26.35 42.4 28.7 40 32 40 35.25 40 37.6 42.4 40 44.75 40 48"
                />
            </g>
        </svg>
    `}),St=p({name:`ButtonsDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M51.5 28.45 Q50 27 48 27 45.95 27 44.5 28.45 43 29.95 43 32 43 34 44.5 35.45 L44.5 35.5 Q45.95 37 48 37 50 37 51.45 35.5 L51.5 35.45 Q53 34 53 32 53 29.95 51.5 28.5 L51.5 28.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 16 Q40 19.25 37.6 21.6 35.25 24 32 24 28.7 24 26.35 21.6 24 19.25 24 16 24 12.7 26.35 10.35 28.7 8 32 8 35.25 8 37.6 10.35 40 12.7 40 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 35.25 53.6 37.6 51.25 40 48 40 44.7 40 42.35 37.6 40 35.25 40 32 40 28.7 42.35 26.35 44.7 24 48 24 51.25 24 53.6 26.35 56 28.7 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.5 19.5 Q29.95 21 32 21 34 21 35.45 19.5 L35.5 19.45 Q37 18 37 16 37 13.95 35.5 12.5 L35.5 12.45 Q34 11 32 11 29.95 11 28.5 12.45 27 13.95 27 16 27 18 28.5 19.45 L28.5 19.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12.5 28.45 Q11 29.95 11 32 11 34 12.5 35.45 L12.5 35.5 Q13.95 37 16 37 18 37 19.45 35.5 L19.5 35.45 Q21 34 21 32 21 29.95 19.5 28.5 L19.5 28.45 Q18 27 16 27 13.95 27 12.5 28.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 48 Q40 51.25 37.6 53.6 35.25 56 32 56 28.7 56 26.35 53.6 24 51.25 24 48 24 44.7 26.35 42.35 28.7 40 32 40 35.25 40 37.6 42.35 40 44.7 40 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 32 Q24 35.25 21.6 37.6 19.25 40 16 40 12.7 40 10.35 37.6 8 35.25 8 32 8 28.7 10.35 26.35 12.7 24 16 24 19.25 24 21.6 26.35 24 28.7 24 32"
                />
                <path
                    fill="#FFFFFF"
                    d="M51.5 28.45 Q50 27 48 27 45.95 27 44.5 28.45 43 29.95 43 32 43 34 44.5 35.45 L44.5 35.5 Q45.95 37 48 37 50 37 51.45 35.5 L51.5 35.45 Q53 34 53 32 53 29.95 51.5 28.5 L51.5 28.45 M40 16 Q40 19.25 37.6 21.6 35.25 24 32 24 28.7 24 26.35 21.6 24 19.25 24 16 24 12.7 26.35 10.35 28.7 8 32 8 35.25 8 37.6 10.35 40 12.7 40 16 M56 32 Q56 35.25 53.6 37.6 51.25 40 48 40 44.7 40 42.35 37.6 40 35.25 40 32 40 28.7 42.35 26.35 44.7 24 48 24 51.25 24 53.6 26.35 56 28.7 56 32 M28.5 19.5 Q29.95 21 32 21 34 21 35.45 19.5 L35.5 19.45 Q37 18 37 16 37 13.95 35.5 12.5 L35.5 12.45 Q34 11 32 11 29.95 11 28.5 12.45 27 13.95 27 16 27 18 28.5 19.45 L28.5 19.5 M12.5 28.45 Q11 29.95 11 32 11 34 12.5 35.45 L12.5 35.5 Q13.95 37 16 37 18 37 19.45 35.5 L19.5 35.45 Q21 34 21 32 21 29.95 19.5 28.5 L19.5 28.45 Q18 27 16 27 13.95 27 12.5 28.45 M40 48 Q40 51.25 37.6 53.6 35.25 56 32 56 28.7 56 26.35 53.6 24 51.25 24 48 24 44.7 26.35 42.35 28.7 40 32 40 35.25 40 37.6 42.35 40 44.7 40 48 M24 32 Q24 35.25 21.6 37.6 19.25 40 16 40 12.7 40 10.35 37.6 8 35.25 8 32 8 28.7 10.35 26.35 12.7 24 16 24 19.25 24 21.6 26.35 24 28.7 24 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 16 Q40 19.25 37.6 21.6 35.25 24 32 24 28.7 24 26.35 21.6 24 19.25 24 16 24 12.7 26.35 10.35 28.7 8 32 8 35.25 8 37.6 10.35 40 12.7 40 16 M56 32 Q56 35.25 53.6 37.6 51.25 40 48 40 44.7 40 42.35 37.6 40 35.25 40 32 40 28.7 42.35 26.35 44.7 24 48 24 51.25 24 53.6 26.35 56 28.7 56 32 M40 48 Q40 51.25 37.6 53.6 35.25 56 32 56 28.7 56 26.35 53.6 24 51.25 24 48 24 44.7 26.35 42.35 28.7 40 32 40 35.25 40 37.6 42.35 40 44.7 40 48 M24 32 Q24 35.25 21.6 37.6 19.25 40 16 40 12.7 40 10.35 37.6 8 35.25 8 32 8 28.7 10.35 26.35 12.7 24 16 24 19.25 24 21.6 26.35 24 28.7 24 32"
                />
            </g>
        </svg>
    `}),Ct=p({name:`ButtonsLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.5 28.5 Q43 29.95 43 32 43 34 44.5 35.45 L44.55 35.5 Q46 37 48 37 50.05 37 51.5 35.5 L51.55 35.5 Q53 34 53 32 53 29.95 51.55 28.5 50.05 27 48 27 46 27 44.55 28.5 L44.5 28.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 24 Q28.75 24 26.4 21.6 24 19.25 24 16 24 12.7 26.4 10.35 28.75 8 32 8 35.3 8 37.65 10.35 40 12.7 40 16 40 19.25 37.65 21.6 35.3 24 32 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 40 Q44.75 40 42.4 37.6 40 35.25 40 32 40 28.7 42.4 26.35 44.75 24 48 24 51.3 24 53.65 26.35 56 28.7 56 32 56 35.25 53.65 37.6 51.3 40 48 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.55 12.5 Q34.05 11 32 11 30 11 28.55 12.5 L28.5 12.5 Q27 13.95 27 16 27 18 28.5 19.45 L28.55 19.5 Q30 21 32 21 34.05 21 35.5 19.5 L35.55 19.5 Q37 18 37 16 37 13.95 35.55 12.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 40 Q12.75 40 10.4 37.6 8 35.25 8 32 8 28.7 10.4 26.35 12.75 24 16 24 19.3 24 21.65 26.35 24 28.7 24 32 24 35.25 21.65 37.6 19.3 40 16 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.55 51.5 Q37 50 37 48 37 45.95 35.55 44.5 34.05 43 32 43 30 43 28.55 44.5 L28.5 44.5 Q27 45.95 27 48 27 50 28.5 51.45 L28.55 51.5 Q30 53 32 53 34.05 53 35.5 51.5 L35.55 51.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 56 Q28.75 56 26.4 53.6 24 51.25 24 48 24 44.7 26.4 42.35 28.75 40 32 40 35.3 40 37.65 42.35 40 44.7 40 48 40 51.25 37.65 53.6 35.3 56 32 56"
                />
                <path
                    fill="#FFFFFF"
                    d="M44.5 28.5 Q43 29.95 43 32 43 34 44.5 35.45 L44.55 35.5 Q46 37 48 37 50.05 37 51.5 35.5 L51.55 35.5 Q53 34 53 32 53 29.95 51.55 28.5 50.05 27 48 27 46 27 44.55 28.5 L44.5 28.5 M32 24 Q28.75 24 26.4 21.6 24 19.25 24 16 24 12.7 26.4 10.35 28.75 8 32 8 35.3 8 37.65 10.35 40 12.7 40 16 40 19.25 37.65 21.6 35.3 24 32 24 M48 40 Q44.75 40 42.4 37.6 40 35.25 40 32 40 28.7 42.4 26.35 44.75 24 48 24 51.3 24 53.65 26.35 56 28.7 56 32 56 35.25 53.65 37.6 51.3 40 48 40 M35.55 12.5 Q34.05 11 32 11 30 11 28.55 12.5 L28.5 12.5 Q27 13.95 27 16 27 18 28.5 19.45 L28.55 19.5 Q30 21 32 21 34.05 21 35.5 19.5 L35.55 19.5 Q37 18 37 16 37 13.95 35.55 12.5 M16 40 Q12.75 40 10.4 37.6 8 35.25 8 32 8 28.7 10.4 26.35 12.75 24 16 24 19.3 24 21.65 26.35 24 28.7 24 32 24 35.25 21.65 37.6 19.3 40 16 40 M35.55 51.5 Q37 50 37 48 37 45.95 35.55 44.5 34.05 43 32 43 30 43 28.55 44.5 L28.5 44.5 Q27 45.95 27 48 27 50 28.5 51.45 L28.55 51.5 Q30 53 32 53 34.05 53 35.5 51.5 L35.55 51.5 M32 56 Q28.75 56 26.4 53.6 24 51.25 24 48 24 44.7 26.4 42.35 28.75 40 32 40 35.3 40 37.65 42.35 40 44.7 40 48 40 51.25 37.65 53.6 35.3 56 32 56"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 24 Q28.75 24 26.4 21.6 24 19.25 24 16 24 12.7 26.4 10.35 28.75 8 32 8 35.3 8 37.65 10.35 40 12.7 40 16 40 19.25 37.65 21.6 35.3 24 32 24 M48 40 Q44.75 40 42.4 37.6 40 35.25 40 32 40 28.7 42.4 26.35 44.75 24 48 24 51.3 24 53.65 26.35 56 28.7 56 32 56 35.25 53.65 37.6 51.3 40 48 40 M16 40 Q12.75 40 10.4 37.6 8 35.25 8 32 8 28.7 10.4 26.35 12.75 24 16 24 19.3 24 21.65 26.35 24 28.7 24 32 24 35.25 21.65 37.6 19.3 40 16 40 M32 56 Q28.75 56 26.4 53.6 24 51.25 24 48 24 44.7 26.4 42.35 28.75 40 32 40 35.3 40 37.65 42.35 40 44.7 40 48 40 51.25 37.65 53.6 35.3 56 32 56"
                />
            </g>
        </svg>
    `}),wt=p({name:`ButtonsRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 40 Q44.7 40 42.35 37.6 40 35.25 40 32 40 28.7 42.35 26.35 44.7 24 48 24 51.25 24 53.6 26.35 56 28.7 56 32 56 35.25 53.6 37.6 51.25 40 48 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 24 Q28.7 24 26.35 21.6 24 19.25 24 16 24 12.7 26.35 10.35 28.7 8 32 8 35.25 8 37.6 10.35 40 12.7 40 16 40 19.25 37.6 21.6 35.25 24 32 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.5 28.5 L19.45 28.5 Q18 27 16 27 13.95 27 12.45 28.5 11 29.95 11 32 11 34 12.45 35.5 L12.5 35.5 Q13.95 37 16 37 18 37 19.45 35.5 L19.5 35.45 Q21 34 21 32 21 29.95 19.5 28.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.45 12.5 Q27 13.95 27 16 27 18 28.45 19.5 L28.5 19.5 Q29.95 21 32 21 34 21 35.45 19.5 L35.5 19.45 Q37 18 37 16 37 13.95 35.5 12.5 L35.45 12.5 Q34 11 32 11 29.95 11 28.45 12.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 40 Q12.7 40 10.35 37.6 8 35.25 8 32 8 28.7 10.35 26.35 12.7 24 16 24 19.25 24 21.6 26.35 24 28.7 24 32 24 35.25 21.6 37.6 19.25 40 16 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 56 Q28.7 56 26.35 53.6 24 51.25 24 48 24 44.7 26.35 42.35 28.7 40 32 40 35.25 40 37.6 42.35 40 44.7 40 48 40 51.25 37.6 53.6 35.25 56 32 56"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.45 51.5 L28.5 51.5 Q29.95 53 32 53 34 53 35.45 51.5 L35.5 51.45 Q37 50 37 48 37 45.95 35.5 44.5 L35.45 44.5 Q34 43 32 43 29.95 43 28.45 44.5 27 45.95 27 48 27 50 28.45 51.5"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 40 Q44.7 40 42.35 37.6 40 35.25 40 32 40 28.7 42.35 26.35 44.7 24 48 24 51.25 24 53.6 26.35 56 28.7 56 32 56 35.25 53.6 37.6 51.25 40 48 40 M32 24 Q28.7 24 26.35 21.6 24 19.25 24 16 24 12.7 26.35 10.35 28.7 8 32 8 35.25 8 37.6 10.35 40 12.7 40 16 40 19.25 37.6 21.6 35.25 24 32 24 M19.5 28.5 L19.45 28.5 Q18 27 16 27 13.95 27 12.45 28.5 11 29.95 11 32 11 34 12.45 35.5 L12.5 35.5 Q13.95 37 16 37 18 37 19.45 35.5 L19.5 35.45 Q21 34 21 32 21 29.95 19.5 28.5 M28.45 12.5 Q27 13.95 27 16 27 18 28.45 19.5 L28.5 19.5 Q29.95 21 32 21 34 21 35.45 19.5 L35.5 19.45 Q37 18 37 16 37 13.95 35.5 12.5 L35.45 12.5 Q34 11 32 11 29.95 11 28.45 12.5 M16 40 Q12.7 40 10.35 37.6 8 35.25 8 32 8 28.7 10.35 26.35 12.7 24 16 24 19.25 24 21.6 26.35 24 28.7 24 32 24 35.25 21.6 37.6 19.25 40 16 40 M32 56 Q28.7 56 26.35 53.6 24 51.25 24 48 24 44.7 26.35 42.35 28.7 40 32 40 35.25 40 37.6 42.35 40 44.7 40 48 40 51.25 37.6 53.6 35.25 56 32 56 M28.45 51.5 L28.5 51.5 Q29.95 53 32 53 34 53 35.45 51.5 L35.5 51.45 Q37 50 37 48 37 45.95 35.5 44.5 L35.45 44.5 Q34 43 32 43 29.95 43 28.45 44.5 27 45.95 27 48 27 50 28.45 51.5"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 40 Q44.7 40 42.35 37.6 40 35.25 40 32 40 28.7 42.35 26.35 44.7 24 48 24 51.25 24 53.6 26.35 56 28.7 56 32 56 35.25 53.6 37.6 51.25 40 48 40 M32 24 Q28.7 24 26.35 21.6 24 19.25 24 16 24 12.7 26.35 10.35 28.7 8 32 8 35.25 8 37.6 10.35 40 12.7 40 16 40 19.25 37.6 21.6 35.25 24 32 24 M16 40 Q12.7 40 10.35 37.6 8 35.25 8 32 8 28.7 10.35 26.35 12.7 24 16 24 19.25 24 21.6 26.35 24 28.7 24 32 24 35.25 21.6 37.6 19.25 40 16 40 M32 56 Q28.7 56 26.35 53.6 24 51.25 24 48 24 44.7 26.35 42.35 28.7 40 32 40 35.25 40 37.6 42.35 40 44.7 40 48 40 51.25 37.6 53.6 35.25 56 32 56"
                />
            </g>
        </svg>
    `}),Tt=p({name:`ButtonsUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 35.3 53.6 37.65 51.25 40 48 40 44.7 40 42.35 37.65 40 35.3 40 32 40 28.75 42.35 26.4 44.7 24 48 24 51.25 24 53.6 26.4 56 28.75 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M51.5 35.55 L51.5 35.5 Q53 34.05 53 32 53 30 51.5 28.55 L51.45 28.5 Q50 27 48 27 45.95 27 44.5 28.5 L44.5 28.55 Q43 30 43 32 43 34.05 44.5 35.55 45.95 37 48 37 50 37 51.5 35.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 16 Q40 19.3 37.6 21.65 35.25 24 32 24 28.7 24 26.35 21.65 24 19.3 24 16 24 12.75 26.35 10.4 28.7 8 32 8 35.25 8 37.6 10.4 40 12.75 40 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12.5 35.55 Q13.95 37 16 37 18 37 19.5 35.55 L19.5 35.5 Q21 34.05 21 32 21 30 19.5 28.55 L19.45 28.5 Q18 27 16 27 13.95 27 12.5 28.5 L12.5 28.55 Q11 30 11 32 11 34.05 12.5 35.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 32 Q24 35.3 21.6 37.65 19.25 40 16 40 12.7 40 10.35 37.65 8 35.3 8 32 8 28.75 10.35 26.4 12.7 24 16 24 19.25 24 21.6 26.4 24 28.75 24 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 48 Q40 51.3 37.6 53.65 35.25 56 32 56 28.7 56 26.35 53.65 24 51.3 24 48 24 44.75 26.35 42.4 28.7 40 32 40 35.25 40 37.6 42.4 40 44.75 40 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.5 44.5 L28.5 44.55 Q27 46 27 48 27 50.05 28.5 51.55 29.95 53 32 53 34 53 35.5 51.55 L35.5 51.5 Q37 50.05 37 48 37 46 35.5 44.55 L35.45 44.5 Q34 43 32 43 29.95 43 28.5 44.5"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 35.3 53.6 37.65 51.25 40 48 40 44.7 40 42.35 37.65 40 35.3 40 32 40 28.75 42.35 26.4 44.7 24 48 24 51.25 24 53.6 26.4 56 28.75 56 32 M51.5 35.55 L51.5 35.5 Q53 34.05 53 32 53 30 51.5 28.55 L51.45 28.5 Q50 27 48 27 45.95 27 44.5 28.5 L44.5 28.55 Q43 30 43 32 43 34.05 44.5 35.55 45.95 37 48 37 50 37 51.5 35.55 M40 16 Q40 19.3 37.6 21.65 35.25 24 32 24 28.7 24 26.35 21.65 24 19.3 24 16 24 12.75 26.35 10.4 28.7 8 32 8 35.25 8 37.6 10.4 40 12.75 40 16 M12.5 35.55 Q13.95 37 16 37 18 37 19.5 35.55 L19.5 35.5 Q21 34.05 21 32 21 30 19.5 28.55 L19.45 28.5 Q18 27 16 27 13.95 27 12.5 28.5 L12.5 28.55 Q11 30 11 32 11 34.05 12.5 35.55 M24 32 Q24 35.3 21.6 37.65 19.25 40 16 40 12.7 40 10.35 37.65 8 35.3 8 32 8 28.75 10.35 26.4 12.7 24 16 24 19.25 24 21.6 26.4 24 28.75 24 32 M40 48 Q40 51.3 37.6 53.65 35.25 56 32 56 28.7 56 26.35 53.65 24 51.3 24 48 24 44.75 26.35 42.4 28.7 40 32 40 35.25 40 37.6 42.4 40 44.75 40 48 M28.5 44.5 L28.5 44.55 Q27 46 27 48 27 50.05 28.5 51.55 29.95 53 32 53 34 53 35.5 51.55 L35.5 51.5 Q37 50.05 37 48 37 46 35.5 44.55 L35.45 44.5 Q34 43 32 43 29.95 43 28.5 44.5"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 35.3 53.6 37.65 51.25 40 48 40 44.7 40 42.35 37.65 40 35.3 40 32 40 28.75 42.35 26.4 44.7 24 48 24 51.25 24 53.6 26.4 56 28.75 56 32 M40 16 Q40 19.3 37.6 21.65 35.25 24 32 24 28.7 24 26.35 21.65 24 19.3 24 16 24 12.75 26.35 10.4 28.7 8 32 8 35.25 8 37.6 10.4 40 12.75 40 16 M24 32 Q24 35.3 21.6 37.65 19.25 40 16 40 12.7 40 10.35 37.65 8 35.3 8 32 8 28.75 10.35 26.4 12.7 24 16 24 19.25 24 21.6 26.4 24 28.75 24 32 M40 48 Q40 51.3 37.6 53.65 35.25 56 32 56 28.7 56 26.35 53.65 24 51.3 24 48 24 44.75 26.35 42.4 28.7 40 32 40 35.25 40 37.6 42.4 40 44.75 40 48"
                />
            </g>
        </svg>
    `}),J=p({name:`ButtonMinusIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 29 L44 29 44 35 20 35 20 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M20 29 L44 29 44 35 20 35 20 29 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Y=p({name:`ButtonPlusIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 20 L35 20 35 29 44 29 44 35 35 35 35 44 29 44 29 35 20 35 20 29 29 29 29 20"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M29 20 L35 20 35 29 44 29 44 35 35 35 35 44 29 44 29 35 20 35 20 29 29 29 29 20"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),X=p({name:`ButtonHomeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 11 Q23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20.6 30.55 L30.6 20.6 Q31.15 20 32 20 32.85 20 33.45 20.6 L43.45 30.55 Q44 31.1 44 31.95 L44 33.05 Q44 33.9 43.45 34.5 42.85 35.05 42 35.05 L40 35.05 40 41 Q40 41.85 39.45 42.45 38.85 43 38 43 L26 43 Q25.15 43 24.6 42.45 24 41.85 24 41 L24 35.05 22 35.05 Q21.15 35.05 20.6 34.5 20 33.9 20 33.05 L20 31.95 Q20 31.1 20.6 30.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 39 L36 39 36 31 28 31 28 39"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M32 11 Q23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 M20.6 30.55 L30.6 20.6 Q31.15 20 32 20 32.85 20 33.45 20.6 L43.45 30.55 Q44 31.1 44 31.95 L44 33.05 Q44 33.9 43.45 34.5 42.85 35.05 42 35.05 L40 35.05 40 41 Q40 41.85 39.45 42.45 38.85 43 38 43 L26 43 Q25.15 43 24.6 42.45 24 41.85 24 41 L24 35.05 22 35.05 Q21.15 35.05 20.6 34.5 20 33.9 20 33.05 L20 31.95 Q20 31.1 20.6 30.55 M28 39 L36 39 36 31 28 31 28 39"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Et=p({name:`XboxButtonXIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 35 32 41 39 41 40 38.75 42 37.65 42 32 35.5 26.4 42 25.25 42 23 40 23 39 29 32 23 25"
                />
                <path
                    fill="#00C1FF"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 35 32 41 39 41 40 38.75 42 37.65 42 32 35.5 26.4 42 25.25 42 23 40 23 39 29 32 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#00C1FF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Dt=p({name:`XboxButtonYIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 34 32.9 34 42 30 42 30 32.9 23 25"
                />
                <path
                    fill="#FFCD00"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 34 32.9 34 42 30 42 30 32.9 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFCD00"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Ot=p({name:`ButtonL1Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 11 Q20.75 11.2 16 16 11.15 20.8 11 27.6 L11 32 11 32.95 11 34 11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L27.5 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 34 L8 32.95 8 32 8 27.5 Q8.2 19.5 13.85 13.85 19.5 8.2 27.5 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 24 L42 41 38 41 38 33.95 38 33.85 38 28.95 35 28.95 35 27 38 24 42 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 24 L26 24 26 37 34 37 34 41 22 41 22 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M27.5 11 Q20.75 11.2 16 16 11.15 20.8 11 27.6 L11 32 11 32.95 11 34 11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L27.5 11 M8 34 L8 32.95 8 32 8 27.5 Q8.2 19.5 13.85 13.85 19.5 8.2 27.5 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 34 M42 24 L42 41 38 41 38 33.95 38 33.85 38 28.95 35 28.95 35 27 38 24 42 24 M22 24 L26 24 26 37 34 37 34 41 22 41 22 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 34 L8 32.95 8 32 8 27.5 Q8.2 19.5 13.85 13.85 19.5 8.2 27.5 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 34"
                />
            </g>
        </svg>
    `}),kt=p({name:`ButtonR1Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 24 L43 41 39 41 39 33.95 39 33.85 39 28.95 36 28.95 36 27 39 24 43 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 34 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L36.5 8 Q44.5 8.2 50.15 13.85 55.8 19.5 56 27.5 L56 32 56 32.95 56 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.5 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 34 53 32.95 53 32 53 27.6 Q52.85 20.8 48 16 43.25 11.2 36.5 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 24 L26 24 Q28.5 24 30.25 25.75 32 27.5 32 30 32 32.45 30.25 34.2 L30.2 34.25 29.45 34.9 32.5 41 28.5 41 26 36 23 36 23 41 19 41 19 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 28 L23 28 23 32 26 32 Q26.8 32 27.35 31.45 L27.45 31.35 Q28 30.8 28 30 28 29.2 27.4 28.6 26.8 28 26 28"
                />
                <path
                    fill="#FFFFFF"
                    d="M43 24 L43 41 39 41 39 33.95 39 33.85 39 28.95 36 28.95 36 27 39 24 43 24 M56 34 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L36.5 8 Q44.5 8.2 50.15 13.85 55.8 19.5 56 27.5 L56 32 56 32.95 56 34 M36.5 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 34 53 32.95 53 32 53 27.6 Q52.85 20.8 48 16 43.25 11.2 36.5 11 M19 24 L26 24 Q28.5 24 30.25 25.75 32 27.5 32 30 32 32.45 30.25 34.2 L30.2 34.25 29.45 34.9 32.5 41 28.5 41 26 36 23 36 23 41 19 41 19 24 M26 28 L23 28 23 32 26 32 Q26.8 32 27.35 31.45 L27.45 31.35 Q28 30.8 28 30 28 29.2 27.4 28.6 26.8 28 26 28"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 34 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L36.5 8 Q44.5 8.2 50.15 13.85 55.8 19.5 56 27.5 L56 32 56 32.95 56 34"
                />
            </g>
        </svg>
    `}),At=p({name:`ButtonViewIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 24.5 L36.5 24.5 36.5 27.5 23 27.5 23 32 26 32 26 35 20 35 20 24.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 29 L44 29 44 39.5 27.5 39.5 27.5 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85 M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M20 24.5 L36.5 24.5 36.5 27.5 23 27.5 23 32 26 32 26 35 20 35 20 24.5 M27.5 29 L44 29 44 39.5 27.5 39.5 27.5 29"
                />
            </g>
        </svg>
    `}),jt=p({name:`ButtonBackIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35 25 Q35.4 25 35.7 25.3 L36 26 36 38 35.7 38.7 35 39 33 39 32.3 38.7 26.3 32.7 26 32 Q26 31.6 26.3 31.3 L32.3 25.3 Q32.6 25 33 25 L35 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M49.15 22.85 Q47.2 20.85 44.85 19.9 L44.8 19.9 Q42.6 19 40 19 L24 19 Q21.4 19 19.15 19.9 16.8 20.85 14.8 22.85 11 26.65 11 32 11 37.35 14.8 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.15 41.2 53 37.35 53 32 53 26.65 49.15 22.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16 L40 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M35 25 Q35.4 25 35.7 25.3 L36 26 36 38 35.7 38.7 35 39 33 39 32.3 38.7 26.3 32.7 26 32 Q26 31.6 26.3 31.3 L32.3 25.3 Q32.6 25 33 25 L35 25 M49.15 22.85 Q47.2 20.85 44.85 19.9 L44.8 19.9 Q42.6 19 40 19 L24 19 Q21.4 19 19.15 19.9 16.8 20.85 14.8 22.85 11 26.65 11 32 11 37.35 14.8 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.15 41.2 53 37.35 53 32 53 26.65 49.15 22.85 M40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16 L40 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16 L40 16"
                />
            </g>
        </svg>
    `}),Mt=p({name:`ButtonOptionsIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 30.5 L41 30.5 41 33.5 23 33.5 23 30.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 35 L41 35 41 38 23 38 23 35"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 26 L41 26 41 29 23 29 23 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85 M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16 M23 30.5 L41 30.5 41 33.5 23 33.5 23 30.5 M23 35 L41 35 41 38 23 38 23 35 M23 26 L41 26 41 29 23 29 23 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
            </g>
        </svg>
    `}),Nt=p({name:`ButtonStartIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 25 L31 25 Q31.4 25 31.7 25.3 L37.7 31.3 38 32 37.7 32.7 31.7 38.7 31 39 29 39 Q28.6 39 28.3 38.7 28 38.4 28 38 L28 26 Q28 25.6 28.3 25.3 28.6 25 29 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85 M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16 M29 25 L31 25 Q31.4 25 31.7 25.3 L37.7 31.3 38 32 37.7 32.7 31.7 38.7 31 39 29 39 Q28.6 39 28.3 38.7 28 38.4 28 38 L28 26 Q28 25.6 28.3 25.3 28.6 25 29 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 11.2 41.8 10.2 40.15 8 36.5 8 32 8 27.5 10.2 23.85 11.2 22.2 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
            </g>
        </svg>
    `}),Pt=p({name:`ButtonL2Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 30 11 31.05 11 32 11 36.4 Q11.15 43.2 16 48 20.75 52.8 27.5 53"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 30 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L27.5 56 Q19.5 55.8 13.85 50.15 8.2 44.5 8 36.5 L8 32 8 31.05 8 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.5 28.4 Q41.1 28 40.5 28 L38.95 28 38.85 28 38.3 28.3 Q38 28.6 38 29 L34 29 34.1 28 Q34.35 26.6 35.4 25.5 L35.5 25.4 Q36.9 24.05 38.85 24 L40.5 24 Q42.75 24 44.35 25.6 L44.4 25.65 45.4 27 Q46.65 30.35 44.45 32.55 L40 37 46 37 46 41 38.95 41 38.85 41 34 41 34 37 41 30.45 Q42.25 29.15 41.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 24 L23 24 23 37 31 37 31 41 19 41 19 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M27.5 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 30 11 31.05 11 32 11 36.4 Q11.15 43.2 16 48 20.75 52.8 27.5 53 M8 30 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L27.5 56 Q19.5 55.8 13.85 50.15 8.2 44.5 8 36.5 L8 32 8 31.05 8 30 M41.5 28.4 Q41.1 28 40.5 28 L38.95 28 38.85 28 38.3 28.3 Q38 28.6 38 29 L34 29 34.1 28 Q34.35 26.6 35.4 25.5 L35.5 25.4 Q36.9 24.05 38.85 24 L40.5 24 Q42.75 24 44.35 25.6 L44.4 25.65 45.4 27 Q46.65 30.35 44.45 32.55 L40 37 46 37 46 41 38.95 41 38.85 41 34 41 34 37 41 30.45 Q42.25 29.15 41.5 28.4 M19 24 L23 24 23 37 31 37 31 41 19 41 19 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 30 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L27.5 56 Q19.5 55.8 13.85 50.15 8.2 44.5 8 36.5 L8 32 8 31.05 8 30"
                />
            </g>
        </svg>
    `}),Ft=p({name:`ButtonR2Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.5 53 Q43.25 52.8 48 48 52.85 43.2 53 36.4 L53 32 53 31.05 53 30 53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L36.5 53"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 30 L56 31.05 56 32 56 36.5 Q55.8 44.5 50.15 50.15 44.5 55.8 36.5 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.5 28.4 Q41.1 28 40.5 28 L38.95 28 38.85 28 38.3 28.3 Q38 28.6 38 29 L34 29 34.1 28 Q34.35 26.6 35.4 25.5 L35.5 25.4 Q36.9 24.05 38.85 24 L40.5 24 Q42.75 24 44.35 25.6 L44.4 25.65 45.4 27 Q46.65 30.35 44.45 32.55 L40 37 46 37 46 41 38.95 41 38.85 41 34 41 34 37 41 30.45 Q42.25 29.15 41.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 24 L25 24 Q27.5 24 29.25 25.75 31 27.5 31 30 31 32.45 29.25 34.2 L29.2 34.25 28.45 34.9 31.5 41 27.5 41 25 36 22 36 22 41 18 41 18 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 28 L22 28 22 32 25 32 Q25.8 32 26.35 31.45 L26.45 31.35 Q27 30.8 27 30 27 29.2 26.4 28.6 25.8 28 25 28"
                />
                <path
                    fill="#FFFFFF"
                    d="M36.5 53 Q43.25 52.8 48 48 52.85 43.2 53 36.4 L53 32 53 31.05 53 30 53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L36.5 53 M56 30 L56 31.05 56 32 56 36.5 Q55.8 44.5 50.15 50.15 44.5 55.8 36.5 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 30 M41.5 28.4 Q41.1 28 40.5 28 L38.95 28 38.85 28 38.3 28.3 Q38 28.6 38 29 L34 29 34.1 28 Q34.35 26.6 35.4 25.5 L35.5 25.4 Q36.9 24.05 38.85 24 L40.5 24 Q42.75 24 44.35 25.6 L44.4 25.65 45.4 27 Q46.65 30.35 44.45 32.55 L40 37 46 37 46 41 38.95 41 38.85 41 34 41 34 37 41 30.45 Q42.25 29.15 41.5 28.4 M18 24 L25 24 Q27.5 24 29.25 25.75 31 27.5 31 30 31 32.45 29.25 34.2 L29.2 34.25 28.45 34.9 31.5 41 27.5 41 25 36 22 36 22 41 18 41 18 24 M25 28 L22 28 22 32 25 32 Q25.8 32 26.35 31.45 L26.45 31.35 Q27 30.8 27 30 27 29.2 26.4 28.6 25.8 28 25 28"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 30 L56 31.05 56 32 56 36.5 Q55.8 44.5 50.15 50.15 44.5 55.8 36.5 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 30"
                />
            </g>
        </svg>
    `}),It=p({name:`DpadNoneIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Lt=p({name:`DpadDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Rt=p({name:`DpadLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),zt=p({name:`DpadRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Bt=p({name:`DpadUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L12 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L12 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Z;(function(e){e.Flat=`flat`,e.Negative=`negative`,e.Positive=`positive`})(Z||={});var Vt=p({name:`QuestGripLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q40.3 8 46.15 13.85 52 19.7 52 28 L52 36 Q52 44.3 46.15 50.15 40.3 56 32 56 23.7 56 17.85 50.15 12 44.3 12 36 L12 28 Q12 19.7 17.85 13.85 23.7 8 32 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 16 Q15 20.95 15 28 L15 36 Q15 43.05 20 48.05 24.95 53 32 53 39.05 53 44.05 48.05 49 43.05 49 36 L49 28 Q49 20.95 44.05 16 39.05 11 32 11 24.95 11 20 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45 31 L45 34 Q44.45 35.75 43.1 37.1 41.2 39 38.5 39 35.8 39 33.9 37.1 32 35.2 32 32.5 32 29.8 33.9 27.9 35.8 26 38.5 26 40.85 26 42.6 27.45 L40.45 29.6 Q39.6 29 38.5 29 37.05 29 36.05 30.05 35 31.05 35 32.5 35 33.95 36.05 35 37.05 36 38.5 36 39.95 36 41 35 L41.7 34 39 34 39 31 45 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 36 L30 36 30 39 21 39 21 26 24 26 24 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 8 Q40.3 8 46.15 13.85 52 19.7 52 28 L52 36 Q52 44.3 46.15 50.15 40.3 56 32 56 23.7 56 17.85 50.15 12 44.3 12 36 L12 28 Q12 19.7 17.85 13.85 23.7 8 32 8 M20 16 Q15 20.95 15 28 L15 36 Q15 43.05 20 48.05 24.95 53 32 53 39.05 53 44.05 48.05 49 43.05 49 36 L49 28 Q49 20.95 44.05 16 39.05 11 32 11 24.95 11 20 16 M45 31 L45 34 Q44.45 35.75 43.1 37.1 41.2 39 38.5 39 35.8 39 33.9 37.1 32 35.2 32 32.5 32 29.8 33.9 27.9 35.8 26 38.5 26 40.85 26 42.6 27.45 L40.45 29.6 Q39.6 29 38.5 29 37.05 29 36.05 30.05 35 31.05 35 32.5 35 33.95 36.05 35 37.05 36 38.5 36 39.95 36 41 35 L41.7 34 39 34 39 31 45 31 M24 36 L30 36 30 39 21 39 21 26 24 26 24 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q40.3 8 46.15 13.85 52 19.7 52 28 L52 36 Q52 44.3 46.15 50.15 40.3 56 32 56 23.7 56 17.85 50.15 12 44.3 12 36 L12 28 Q12 19.7 17.85 13.85 23.7 8 32 8"
                />
            </g>
        </svg>
    `}),Ht=p({name:`QuestTriggerLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 26 L43 29 39 29 39 39 36 39 36 29 32 29 32 26 43 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 36 L31 36 31 39 22 39 22 26 25 26 25 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16 M43 26 L43 29 39 29 39 39 36 39 36 29 32 29 32 26 43 26 M25 36 L31 36 31 39 22 39 22 26 25 26 25 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
            </g>
        </svg>
    `}),Ut=p({name:`QuestGripRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q40.3 8 46.15 13.85 52 19.7 52 28 L52 36 Q52 44.3 46.15 50.15 40.3 56 32 56 23.7 56 17.85 50.15 12 44.3 12 36 L12 28 Q12 19.7 17.85 13.85 23.7 8 32 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M49 28 Q49 20.95 44.05 16 39.05 11 32 11 24.95 11 20 16 15 20.95 15 28 L15 36 Q15 43.05 20 48.05 24.95 53 32 53 39.05 53 44.05 48.05 49 43.05 49 36 L49 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 31 L46 34 Q45.45 35.75 44.1 37.1 42.2 39 39.5 39 36.8 39 34.9 37.1 33 35.2 33 32.5 33 29.8 34.9 27.9 36.8 26 39.5 26 41.85 26 43.6 27.45 L41.45 29.6 Q40.6 29 39.5 29 38.05 29 37.05 30.05 36 31.05 36 32.5 36 33.95 37.05 35 38.05 36 39.5 36 40.95 36 42 35 L42.7 34 40 34 40 31 46 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 36 L23 36 23 39 20 39 20 26 26 26 Q28.05 26 29.5 27.45 31 28.95 31 31 31 33.05 29.5 34.5 L31 39 28 39 27 36 27 35.9 26 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 33 L26.05 33 Q26.85 33 27.4 32.4 28 31.85 28 31 28 30.15 27.4 29.55 26.85 29 26 29 L23 29 23 33"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 8 Q40.3 8 46.15 13.85 52 19.7 52 28 L52 36 Q52 44.3 46.15 50.15 40.3 56 32 56 23.7 56 17.85 50.15 12 44.3 12 36 L12 28 Q12 19.7 17.85 13.85 23.7 8 32 8 M49 28 Q49 20.95 44.05 16 39.05 11 32 11 24.95 11 20 16 15 20.95 15 28 L15 36 Q15 43.05 20 48.05 24.95 53 32 53 39.05 53 44.05 48.05 49 43.05 49 36 L49 28 M46 31 L46 34 Q45.45 35.75 44.1 37.1 42.2 39 39.5 39 36.8 39 34.9 37.1 33 35.2 33 32.5 33 29.8 34.9 27.9 36.8 26 39.5 26 41.85 26 43.6 27.45 L41.45 29.6 Q40.6 29 39.5 29 38.05 29 37.05 30.05 36 31.05 36 32.5 36 33.95 37.05 35 38.05 36 39.5 36 40.95 36 42 35 L42.7 34 40 34 40 31 46 31 M26 36 L23 36 23 39 20 39 20 26 26 26 Q28.05 26 29.5 27.45 31 28.95 31 31 31 33.05 29.5 34.5 L31 39 28 39 27 36 27 35.9 26 36 M23 33 L26.05 33 Q26.85 33 27.4 32.4 28 31.85 28 31 28 30.15 27.4 29.55 26.85 29 26 29 L23 29 23 33"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q40.3 8 46.15 13.85 52 19.7 52 28 L52 36 Q52 44.3 46.15 50.15 40.3 56 32 56 23.7 56 17.85 50.15 12 44.3 12 36 L12 28 Q12 19.7 17.85 13.85 23.7 8 32 8"
                />
            </g>
        </svg>
    `}),Wt=p({name:`QuestTriggerRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 26 L44 29 40 29 40 39 37 39 37 29 33 29 33 26 44 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 36 L23 36 23 39 20 39 20 26 26 26 Q28.05 26 29.5 27.45 31 28.95 31 31 31 33.05 29.5 34.5 L31 39 28 39 27 36 27 35.9 26 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 33 L26.05 33 Q26.85 33 27.4 32.4 28 31.85 28 31 28 30.15 27.4 29.55 26.85 29 26 29 L23 29 23 33"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16 M44 26 L44 29 40 29 40 39 37 39 37 29 33 29 33 26 44 26 M26 36 L23 36 23 39 20 39 20 26 26 26 Q28.05 26 29.5 27.45 31 28.95 31 31 31 33.05 29.5 34.5 L31 39 28 39 27 36 27 35.9 26 36 M23 33 L26.05 33 Q26.85 33 27.4 32.4 28 31.85 28 31 28 30.15 27.4 29.55 26.85 29 26 29 L23 29 23 33"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
            </g>
        </svg>
    `}),Gt=p({name:`QuestButtonMetaIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37.2 23.5 Q38.7 23.5 40.05 24.35 41.3 25.1 42.35 26.7 43.4 28.3 44 30.35 44.5 32.25 44.5 34.4 44.5 36.8 43.6 38.4 43.05 39.3 42.2 39.85 L42.25 39.85 Q41.2 40.5 39.9 40.5 L38.2 40.25 36.45 39.15 36.45 39.1 35.15 37.55 33.95 35.7 32.05 32.55 31.5 33.45 29.9 36.3 29.9 36.25 28.8 37.85 26.75 39.85 26.8 39.85 Q25.75 40.5 24.45 40.5 21.7 40.5 20.45 38.3 19.5 36.8 19.5 34.45 19.5 32.4 20.1 30.45 L20.1 30.5 Q20.6 28.45 21.65 26.85 22.65 25.3 23.95 24.45 25.35 23.5 26.9 23.5 L28.85 23.85 28.8 23.85 Q29.8 24.15 30.7 24.95 L32.35 26.55 33.85 24.95 Q35.5 23.5 37.2 23.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.65 27.15 Q34.95 27.7 34.1 28.95 L34.1 29 35.2 30.75 35.85 31.75 38.6 36.1 39.3 36.75 39.35 36.75 39.9 36.9 Q40.6 36.9 40.9 36.3 L41.2 34.5 Q41.2 32.8 40.85 31.25 L40.8 31.2 Q40.4 29.5 39.65 28.35 L38.45 27.05 38.45 27 Q37.75 26.55 37.1 26.55 36.35 26.55 35.7 27.15 L35.65 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26.9 27.1 Q25.7 27.15 24.7 28.75 23.95 29.8 23.55 31.4 23.1 32.9 23.1 34.55 L23.25 35.65 23.5 36.35 23.95 36.75 23.95 36.8 24.45 36.9 25.25 36.7 26.55 35.25 26.55 35.3 28 33.1 29.35 30.95 30.2 29.65 29.2 28.4 28.2 27.55 Q27.55 27.1 26.9 27.1"
                />
                <path
                    fill="#FFFFFF"
                    d="M37.2 23.5 Q38.7 23.5 40.05 24.35 41.3 25.1 42.35 26.7 43.4 28.3 44 30.35 44.5 32.25 44.5 34.4 44.5 36.8 43.6 38.4 43.05 39.3 42.2 39.85 L42.25 39.85 Q41.2 40.5 39.9 40.5 L38.2 40.25 36.45 39.15 36.45 39.1 35.15 37.55 33.95 35.7 32.05 32.55 31.5 33.45 29.9 36.3 29.9 36.25 28.8 37.85 26.75 39.85 26.8 39.85 Q25.75 40.5 24.45 40.5 21.7 40.5 20.45 38.3 19.5 36.8 19.5 34.45 19.5 32.4 20.1 30.45 L20.1 30.5 Q20.6 28.45 21.65 26.85 22.65 25.3 23.95 24.45 25.35 23.5 26.9 23.5 L28.85 23.85 28.8 23.85 Q29.8 24.15 30.7 24.95 L32.35 26.55 33.85 24.95 Q35.5 23.5 37.2 23.5 M35.65 27.15 Q34.95 27.7 34.1 28.95 L34.1 29 35.2 30.75 35.85 31.75 38.6 36.1 39.3 36.75 39.35 36.75 39.9 36.9 Q40.6 36.9 40.9 36.3 L41.2 34.5 Q41.2 32.8 40.85 31.25 L40.8 31.2 Q40.4 29.5 39.65 28.35 L38.45 27.05 38.45 27 Q37.75 26.55 37.1 26.55 36.35 26.55 35.7 27.15 L35.65 27.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M26.9 27.1 Q25.7 27.15 24.7 28.75 23.95 29.8 23.55 31.4 23.1 32.9 23.1 34.55 L23.25 35.65 23.5 36.35 23.95 36.75 23.95 36.8 24.45 36.9 25.25 36.7 26.55 35.25 26.55 35.3 28 33.1 29.35 30.95 30.2 29.65 29.2 28.4 28.2 27.55 Q27.55 27.1 26.9 27.1"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Kt=p({name:`QuestButtonOculusIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.65 34.15 L39.45 33.2 39.75 32 39.45 30.8 38.65 29.85 Q38.15 29.45 37.5 29.4 L36.9 29.35 36.25 29.35 27.75 29.35 27.1 29.35 26.5 29.4 Q25.85 29.45 25.35 29.85 24.8 30.2 24.5 30.8 24.25 31.35 24.25 32 L24.5 33.2 25.35 34.15 26.5 34.6 27.1 34.65 27.75 34.65 36.25 34.65 36.9 34.65 37.5 34.6 Q38.15 34.5 38.65 34.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42.1 25.8 Q43.45 26.9 44.2 28.55 45 30.2 45 32 45 33.8 44.2 35.45 43.45 37.05 42.1 38.2 40.7 39.3 38.95 39.75 L37 40 35.55 40 28.45 40 27 40 25.05 39.75 Q23.25 39.3 21.9 38.2 20.5 37.05 19.8 35.45 19 33.8 19 32 19 30.2 19.8 28.55 20.5 26.9 21.9 25.8 23.25 24.7 25 24.25 L26.95 24 28.45 24 35.5 24 37 24 38.95 24.25 Q40.75 24.7 42.1 25.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M38.65 34.15 L39.45 33.2 39.75 32 39.45 30.8 38.65 29.85 Q38.15 29.45 37.5 29.4 L36.9 29.35 36.25 29.35 27.75 29.35 27.1 29.35 26.5 29.4 Q25.85 29.45 25.35 29.85 24.8 30.2 24.5 30.8 24.25 31.35 24.25 32 L24.5 33.2 25.35 34.15 26.5 34.6 27.1 34.65 27.75 34.65 36.25 34.65 36.9 34.65 37.5 34.6 Q38.15 34.5 38.65 34.15 M42.1 25.8 Q43.45 26.9 44.2 28.55 45 30.2 45 32 45 33.8 44.2 35.45 43.45 37.05 42.1 38.2 40.7 39.3 38.95 39.75 L37 40 35.55 40 28.45 40 27 40 25.05 39.75 Q23.25 39.3 21.9 38.2 20.5 37.05 19.8 35.45 19 33.8 19 32 19 30.2 19.8 28.55 20.5 26.9 21.9 25.8 23.25 24.7 25 24.25 L26.95 24 28.45 24 35.5 24 37 24 38.95 24.25 Q40.75 24.7 42.1 25.8 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),qt=p({name:`QuestButtonMenuIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 30 L43 30 43 34 21 34 21 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 37 L43 37 43 41 21 41 21 37"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 23 L43 23 43 27 21 27 21 23"
                />
                <path
                    fill="#FFFFFF"
                    d="M21 30 L43 30 43 34 21 34 21 30 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M21 37 L43 37 43 41 21 41 21 37 M21 23 L43 23 43 27 21 27 21 23"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Jt=p({name:`GamecubeButtonXIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.8 24 L32 28.2 36.2 24 39 26.8 34.3 31.5 39 36.2 36.2 39 32 34.8 27.8 39 25 36.2 29.7 31.5 25 26.8 27.8 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.05 19.5 L32 19.5 Q24.9 19.45 17.8 21.35 14.15 22.35 12.25 25.6 11.1 27.6 11 29.7 L11 35.65 11.35 37.65 11.3 37.6 Q12.25 41.25 15.55 43.25 18.75 45.15 22.4 44.2 L22.35 44.2 Q27.15 42.9 32 42.95 L32.05 42.95 Q36.85 42.9 41.65 44.2 L41.6 44.2 Q45.25 45.15 48.5 43.25 L48.45 43.25 Q51.75 41.25 52.7 37.6 L52.7 37.65 53 35.65 53 29.7 Q52.9 27.6 51.75 25.6 49.85 22.35 46.25 21.35 39.1 19.45 32.05 19.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.85 47.1 Q36.45 45.9 32 45.95 27.55 45.9 23.15 47.1 18.3 48.35 14 45.8 9.65 43.2 8.4 38.35 L8 35.9 8 29.55 Q8.15 26.75 9.65 24.1 12.15 19.75 17 18.45 24.5 16.45 32 16.5 39.5 16.45 47 18.45 51.85 19.75 54.35 24.1 55.85 26.75 56 29.55 L56 35.9 55.6 38.35 Q54.35 43.2 50 45.8 45.7 48.35 40.85 47.1"
                />
                <path
                    fill="#FFFFFF"
                    d="M27.8 24 L32 28.2 36.2 24 39 26.8 34.3 31.5 39 36.2 36.2 39 32 34.8 27.8 39 25 36.2 29.7 31.5 25 26.8 27.8 24 M32.05 19.5 L32 19.5 Q24.9 19.45 17.8 21.35 14.15 22.35 12.25 25.6 11.1 27.6 11 29.7 L11 35.65 11.35 37.65 11.3 37.6 Q12.25 41.25 15.55 43.25 18.75 45.15 22.4 44.2 L22.35 44.2 Q27.15 42.9 32 42.95 L32.05 42.95 Q36.85 42.9 41.65 44.2 L41.6 44.2 Q45.25 45.15 48.5 43.25 L48.45 43.25 Q51.75 41.25 52.7 37.6 L52.7 37.65 53 35.65 53 29.7 Q52.9 27.6 51.75 25.6 49.85 22.35 46.25 21.35 39.1 19.45 32.05 19.5 M40.85 47.1 Q36.45 45.9 32 45.95 27.55 45.9 23.15 47.1 18.3 48.35 14 45.8 9.65 43.2 8.4 38.35 L8 35.9 8 29.55 Q8.15 26.75 9.65 24.1 12.15 19.75 17 18.45 24.5 16.45 32 16.5 39.5 16.45 47 18.45 51.85 19.75 54.35 24.1 55.85 26.75 56 29.55 L56 35.9 55.6 38.35 Q54.35 43.2 50 45.8 45.7 48.35 40.85 47.1"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.85 47.1 Q36.45 45.9 32 45.95 27.55 45.9 23.15 47.1 18.3 48.35 14 45.8 9.65 43.2 8.4 38.35 L8 35.9 8 29.55 Q8.15 26.75 9.65 24.1 12.15 19.75 17 18.45 24.5 16.45 32 16.5 39.5 16.45 47 18.45 51.85 19.75 54.35 24.1 55.85 26.75 56 29.55 L56 35.9 55.6 38.35 Q54.35 43.2 50 45.8 45.7 48.35 40.85 47.1"
                />
            </g>
        </svg>
    `}),Yt=p({name:`GamecubeButtonYIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 39 L30 31.8 25 26.8 27.8 24 32 28.2 36.2 24 39 26.8 34 31.8 34 39 30 39"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.05 19.5 L32 19.5 Q24.9 19.45 17.8 21.35 14.15 22.35 12.25 25.6 11.1 27.6 11 29.7 L11 35.65 11.35 37.65 11.3 37.6 Q12.25 41.25 15.55 43.25 18.75 45.15 22.4 44.2 L22.35 44.2 Q27.15 42.9 32 42.95 L32.05 42.95 Q36.85 42.9 41.65 44.2 L41.6 44.2 Q45.25 45.15 48.5 43.25 L48.45 43.25 Q51.75 41.25 52.7 37.6 L52.7 37.65 53 35.65 53 29.7 Q52.9 27.6 51.75 25.6 49.85 22.35 46.25 21.35 39.1 19.45 32.05 19.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.85 47.1 Q36.45 45.9 32 45.95 27.55 45.9 23.15 47.1 18.3 48.35 14 45.8 9.65 43.2 8.4 38.35 L8 35.9 8 29.55 Q8.15 26.75 9.65 24.1 12.15 19.75 17 18.45 24.5 16.45 32 16.5 39.5 16.45 47 18.45 51.85 19.75 54.35 24.1 55.85 26.75 56 29.55 L56 35.9 55.6 38.35 Q54.35 43.2 50 45.8 45.7 48.35 40.85 47.1"
                />
                <path
                    fill="#FFFFFF"
                    d="M30 39 L30 31.8 25 26.8 27.8 24 32 28.2 36.2 24 39 26.8 34 31.8 34 39 30 39 M32.05 19.5 L32 19.5 Q24.9 19.45 17.8 21.35 14.15 22.35 12.25 25.6 11.1 27.6 11 29.7 L11 35.65 11.35 37.65 11.3 37.6 Q12.25 41.25 15.55 43.25 18.75 45.15 22.4 44.2 L22.35 44.2 Q27.15 42.9 32 42.95 L32.05 42.95 Q36.85 42.9 41.65 44.2 L41.6 44.2 Q45.25 45.15 48.5 43.25 L48.45 43.25 Q51.75 41.25 52.7 37.6 L52.7 37.65 53 35.65 53 29.7 Q52.9 27.6 51.75 25.6 49.85 22.35 46.25 21.35 39.1 19.45 32.05 19.5 M40.85 47.1 Q36.45 45.9 32 45.95 27.55 45.9 23.15 47.1 18.3 48.35 14 45.8 9.65 43.2 8.4 38.35 L8 35.9 8 29.55 Q8.15 26.75 9.65 24.1 12.15 19.75 17 18.45 24.5 16.45 32 16.5 39.5 16.45 47 18.45 51.85 19.75 54.35 24.1 55.85 26.75 56 29.55 L56 35.9 55.6 38.35 Q54.35 43.2 50 45.8 45.7 48.35 40.85 47.1"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.85 47.1 Q36.45 45.9 32 45.95 27.55 45.9 23.15 47.1 18.3 48.35 14 45.8 9.65 43.2 8.4 38.35 L8 35.9 8 29.55 Q8.15 26.75 9.65 24.1 12.15 19.75 17 18.45 24.5 16.45 32 16.5 39.5 16.45 47 18.45 51.85 19.75 54.35 24.1 55.85 26.75 56 29.55 L56 35.9 55.6 38.35 Q54.35 43.2 50 45.8 45.7 48.35 40.85 47.1"
                />
            </g>
        </svg>
    `}),Xt=p({name:`GamecubeTriggerLIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.6 13 L31.35 13 Q23.1 13.2 17.2 19.15 11.3 25 11 33.1 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 32.95 Q52.65 24.95 46.85 19.15 40.9 13.2 32.6 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.35 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 25 L31 25 31 38 39 38 39 42 27 42 27 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.6 13 L31.35 13 Q23.1 13.2 17.2 19.15 11.3 25 11 33.1 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 32.95 Q52.65 24.95 46.85 19.15 40.9 13.2 32.6 13 M31.35 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 M27 25 L31 25 31 38 39 38 39 42 27 42 27 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.35 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10"
                />
            </g>
        </svg>
    `}),Zt=p({name:`GamecubeButtonZIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 24 L38 26.4 32 36 38 36 38 40 26 40 26 37.6 32 28 26 28 26 24 38 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 19 L16 19 Q11 19 11 24 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16 L48 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M38 24 L38 26.4 32 36 38 36 38 40 26 40 26 37.6 32 28 26 28 26 24 38 24 M48 19 L16 19 Q11 19 11 24 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19 M48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16 L48 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16 L48 16"
                />
            </g>
        </svg>
    `}),Qt=p({name:`GamecubeTriggerRIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 29 L30 29 30 33 33 33 Q33.8 33 34.35 32.45 L34.45 32.35 Q35 31.8 35 31 35 30.2 34.4 29.6 33.8 29 33 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 25 L33 25 Q34.9 25 36.35 26 L37.25 26.75 Q39 28.5 39 31 39 32.65 38.2 34 L37.25 35.2 37.2 35.25 36.45 35.9 39.5 42 35.5 42 33 37 30 37 30 42 26 42 26 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.35 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.6 13 L31.35 13 Q23.1 13.2 17.2 19.15 11.3 25 11 33.1 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 32.95 Q52.65 24.95 46.85 19.15 40.9 13.2 32.6 13"
                />
                <path
                    fill="#FFFFFF"
                    d="M33 29 L30 29 30 33 33 33 Q33.8 33 34.35 32.45 L34.45 32.35 Q35 31.8 35 31 35 30.2 34.4 29.6 33.8 29 33 29 M26 25 L33 25 Q34.9 25 36.35 26 L37.25 26.75 Q39 28.5 39 31 39 32.65 38.2 34 L37.25 35.2 37.2 35.25 36.45 35.9 39.5 42 35.5 42 33 37 30 37 30 42 26 42 26 25 M31.35 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 M32.6 13 L31.35 13 Q23.1 13.2 17.2 19.15 11.3 25 11 33.1 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 32.95 Q52.65 24.95 46.85 19.15 40.9 13.2 32.6 13"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.35 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10"
                />
            </g>
        </svg>
    `}),$t=p({name:`GamecubeStickCHorizontalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFCD00"
                    d="M32 8 Q42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15 M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
            </g>
        </svg>
    `}),en=p({name:`GamecubeStickCLeftIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFCD00"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 10.65 40.8 9 36.4 10.05 37 11.35 37 13.25 37 14.5 35.75 L14.95 35.3 Q16 36.55 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 15.9 18.55 Q15.6 17.3 14.6 16.3 13.95 15.65 13.15 15.35 L15 13.65 Q22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M3.5 27.15 Q3 26.7 3 26 3 25.35 3.5 24.85 L10.15 18.45 Q10.45 18.15 10.9 18.05 L11.35 18 Q12.05 18 12.5 18.45 13 18.95 13 19.6 L13 32.4 Q13 33.1 12.5 33.55 L11.35 34 Q10.65 34 10.15 33.55 L3.5 27.15"
                />
            </g>
        </svg>
    `}),tn=p({name:`GamecubeStickCRightIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFCD00"
                    d="M39.75 54.25 Q36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 L50.85 15.35 Q50 15.65 49.4 16.3 48.4 17.3 48.1 18.55 L46.55 17.1 Q40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 49.05 35.3 49.5 35.75 Q50.75 37 52.65 37 53.95 37 55 36.4 53.35 40.8 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M60.5 27.15 L53.85 33.55 52.65 34 Q51.95 34 51.5 33.55 51 33.1 51 32.4 L51 19.6 Q51 18.95 51.5 18.45 51.95 18 52.65 18 L53.1 18.05 Q53.5 18.15 53.85 18.45 L60.5 24.85 Q61 25.35 61 26 61 26.7 60.5 27.15"
                />
            </g>
        </svg>
    `}),nn=p({name:`GamecubeStickCVerticalIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFCD00"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    fill="#FFFFFF"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5 M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
            </g>
        </svg>
    `}),rn=p({name:`GamecubeStickCUpIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFCD00"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 17.8 11.4 21 10.1 L21 10.35 Q21 12.25 22.25 13.5 L22.75 14 Q19.85 15.15 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 44.1 15.15 41.3 14 L41.7 13.6 Q43 12.35 43 10.35 L43 10.1 Q46.2 11.4 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q24.7 15.2 31.2 15 L32.8 15 Q39.45 15.25 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
                <path
                    fill="#FFFFFF"
                    d="M30.85 2.5 Q31.3 2 32 2 32.65 2 33.15 2.5 L39.55 9.15 Q40 9.65 40 10.35 40 11.05 39.55 11.5 39.05 12 38.4 12 L25.6 12 Q24.9 12 24.45 11.5 24 11.05 24 10.35 24 9.65 24.45 9.15 L30.85 2.5"
                />
            </g>
        </svg>
    `}),an=p({name:`GamecubeStickCDownIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFCD00"
                    d="M43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 22.05 8 32 8 42 8 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 M12 27.4 Q12.1 33.45 17.4 37.65 L21.25 40.15 Q21 40.8 21 41.65 21 43.5 22.25 44.85 L22.3 44.95 28.7 51.6 Q30 53 32 53 33.85 53.05 35.3 51.65 L35.3 51.6 41.7 44.95 41.8 44.85 Q43 43.5 43 41.65 L42.8 40.15 46.55 37.7 46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 40.55 12.3 32 12.3 23.45 12.3 17.4 17.1 L17.45 17.1 Q12.15 21.4 12 27.4"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.35 36.75 32.8 37 L31.2 37 Q24.55 36.75 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q25 15 32 15 39.15 15 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M32.5 20 Q30 20 28.25 21.75 26.5 23.5 26.5 26 26.5 28.5 28.25 30.25 30 32 32.5 32 35 32 36.75 30.25 L34.65 28.15 Q33.75 29 32.5 29 31.25 29 30.4 28.15 29.5 27.25 29.5 26 29.5 24.75 30.4 23.9 31.25 23 32.5 23 33.75 23 34.65 23.9 L36.75 21.75 Q35 20 32.5 20"
                />
                <path
                    fill="#FFFFFF"
                    d="M30.85 49.5 L24.45 42.85 Q24 42.35 24 41.65 L24.05 41.3 24.45 40.5 Q24.9 40 25.6 40 L38.4 40 Q39.05 40 39.55 40.5 L40 41.3 40 41.65 Q40 42.35 39.55 42.85 L33.15 49.5 Q32.65 50 32 50 31.3 50 30.85 49.5"
                />
            </g>
        </svg>
    `}),on=p({name:`GamecubeButtonStartIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 30 Q28.3 30 25.65 32.6 L25.6 32.65 Q23 35.3 23 39 23 42.7 25.65 45.35 28.3 48 32 48 35.7 48 38.35 45.35 41 42.7 41 39 41 35.3 38.35 32.65 35.7 30 32 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 16.9 L31 19.1 33 19.1 33 16.9 32.75 16.35 32.75 16.4 Q32.45 16.1 32 16.1 31.55 16.1 31.2 16.4 L31.25 16.3 Q31 16.55 31 16.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.1 18.1 L39.45 18 39.7 17.8 39.75 17.8 40 17.1 39.7 16.35 Q39.45 16.1 39.05 16.1 L38 16.1 38 18.1 39.1 18.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 16.1 Q17.6 16.1 17.3 16.4 17 16.7 17 17.1 17 17.5 17.3 17.8 17.6 18.1 17.95 18.1 L18.05 18.1 Q19.2 18.1 20.1 19 21 19.9 21 21.1 21 22.3 20.1 23.2 19.2 24.1 18 24.1 L16 24.1 15.3 23.8 Q15 23.5 15 23.1 15 22.7 15.3 22.4 15.6 22.1 16 22.1 L18 22.1 Q18.4 22.1 18.7 21.8 L19 21.1 18.7 20.4 Q18.4 20.1 18.05 20.1 L17.95 20.1 Q16.8 20.1 15.9 19.2 15 18.3 15 17.1 15 15.9 15.9 15 16.8 14.1 18 14.1 L20 14.1 Q20.4 14.1 20.7 14.4 L21 15.1 20.7 15.8 20 16.1 18 16.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 16.1 Q22.6 16.1 22.3 15.8 22 15.5 22 15.1 22 14.7 22.3 14.4 22.6 14.1 23 14.1 L27 14.1 Q27.4 14.1 27.7 14.4 L28 15.1 27.7 15.8 Q27.4 16.1 27 16.1 L26 16.1 26 23.1 25.7 23.8 25 24.1 24.3 23.8 Q24 23.5 24 23.1 L24 16.1 23 16.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 16.9 Q29 15.75 29.85 14.9 L29.9 14.85 Q30.75 14.1 32 14.1 33.15 14.1 34.05 14.85 L34.1 14.9 Q35 15.75 35 16.9 L35 23.1 34.7 23.8 Q34.4 24.1 34 24.1 L33.3 23.8 Q33 23.5 33 23.1 L33 21.1 31 21.1 31 23.1 30.7 23.8 Q30.4 24.1 30 24.1 L29.3 23.8 Q29 23.5 29 23.1 L29 16.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.1 19.2 L41.1 19.25 40.45 19.75 41.9 22.65 41.95 23.45 41.45 24 40.7 24.05 Q40.3 23.9 40.1 23.55 L38.4 20.1 38 20.1 38 23.1 37.7 23.8 37 24.1 36.3 23.8 Q36 23.5 36 23.1 L36 15.1 Q36 14.7 36.3 14.4 36.6 14.1 37 14.1 L39.05 14.1 Q40.25 14.1 41.1 14.95 42 15.85 42 17.1 42 18.35 41.1 19.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 14.1 Q48.4 14.1 48.7 14.4 L49 15.1 48.7 15.8 Q48.4 16.1 48 16.1 L47 16.1 47 23.1 46.7 23.8 46 24.1 45.3 23.8 Q45 23.5 45 23.1 L45 16.1 44 16.1 Q43.6 16.1 43.3 15.8 43 15.5 43 15.1 43 14.7 43.3 14.4 43.6 14.1 44 14.1 L48 14.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 39 Q44 43.95 40.45 47.45 36.95 51 32 51 27.05 51 23.5 47.45 20 43.95 20 39 20 34.05 23.5 30.5 27.05 27 32 27 36.95 27 40.45 30.5 44 34.05 44 39"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 30 Q28.3 30 25.65 32.6 L25.6 32.65 Q23 35.3 23 39 23 42.7 25.65 45.35 28.3 48 32 48 35.7 48 38.35 45.35 41 42.7 41 39 41 35.3 38.35 32.65 35.7 30 32 30 M31 16.9 L31 19.1 33 19.1 33 16.9 32.75 16.35 32.75 16.4 Q32.45 16.1 32 16.1 31.55 16.1 31.2 16.4 L31.25 16.3 Q31 16.55 31 16.9 M39.1 18.1 L39.45 18 39.7 17.8 39.75 17.8 40 17.1 39.7 16.35 Q39.45 16.1 39.05 16.1 L38 16.1 38 18.1 39.1 18.1 M18 16.1 Q17.6 16.1 17.3 16.4 17 16.7 17 17.1 17 17.5 17.3 17.8 17.6 18.1 17.95 18.1 L18.05 18.1 Q19.2 18.1 20.1 19 21 19.9 21 21.1 21 22.3 20.1 23.2 19.2 24.1 18 24.1 L16 24.1 15.3 23.8 Q15 23.5 15 23.1 15 22.7 15.3 22.4 15.6 22.1 16 22.1 L18 22.1 Q18.4 22.1 18.7 21.8 L19 21.1 18.7 20.4 Q18.4 20.1 18.05 20.1 L17.95 20.1 Q16.8 20.1 15.9 19.2 15 18.3 15 17.1 15 15.9 15.9 15 16.8 14.1 18 14.1 L20 14.1 Q20.4 14.1 20.7 14.4 L21 15.1 20.7 15.8 20 16.1 18 16.1 M23 16.1 Q22.6 16.1 22.3 15.8 22 15.5 22 15.1 22 14.7 22.3 14.4 22.6 14.1 23 14.1 L27 14.1 Q27.4 14.1 27.7 14.4 L28 15.1 27.7 15.8 Q27.4 16.1 27 16.1 L26 16.1 26 23.1 25.7 23.8 25 24.1 24.3 23.8 Q24 23.5 24 23.1 L24 16.1 23 16.1 M29 16.9 Q29 15.75 29.85 14.9 L29.9 14.85 Q30.75 14.1 32 14.1 33.15 14.1 34.05 14.85 L34.1 14.9 Q35 15.75 35 16.9 L35 23.1 34.7 23.8 Q34.4 24.1 34 24.1 L33.3 23.8 Q33 23.5 33 23.1 L33 21.1 31 21.1 31 23.1 30.7 23.8 Q30.4 24.1 30 24.1 L29.3 23.8 Q29 23.5 29 23.1 L29 16.9 M41.1 19.2 L41.1 19.25 40.45 19.75 41.9 22.65 41.95 23.45 41.45 24 40.7 24.05 Q40.3 23.9 40.1 23.55 L38.4 20.1 38 20.1 38 23.1 37.7 23.8 37 24.1 36.3 23.8 Q36 23.5 36 23.1 L36 15.1 Q36 14.7 36.3 14.4 36.6 14.1 37 14.1 L39.05 14.1 Q40.25 14.1 41.1 14.95 42 15.85 42 17.1 42 18.35 41.1 19.2 M48 14.1 Q48.4 14.1 48.7 14.4 L49 15.1 48.7 15.8 Q48.4 16.1 48 16.1 L47 16.1 47 23.1 46.7 23.8 46 24.1 45.3 23.8 Q45 23.5 45 23.1 L45 16.1 44 16.1 Q43.6 16.1 43.3 15.8 43 15.5 43 15.1 43 14.7 43.3 14.4 43.6 14.1 44 14.1 L48 14.1 M44 39 Q44 43.95 40.45 47.45 36.95 51 32 51 27.05 51 23.5 47.45 20 43.95 20 39 20 34.05 23.5 30.5 27.05 27 32 27 36.95 27 40.45 30.5 44 34.05 44 39"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 16.1 Q17.6 16.1 17.3 16.4 17 16.7 17 17.1 17 17.5 17.3 17.8 17.6 18.1 17.95 18.1 L18.05 18.1 Q19.2 18.1 20.1 19 21 19.9 21 21.1 21 22.3 20.1 23.2 19.2 24.1 18 24.1 L16 24.1 15.3 23.8 Q15 23.5 15 23.1 15 22.7 15.3 22.4 15.6 22.1 16 22.1 L18 22.1 Q18.4 22.1 18.7 21.8 L19 21.1 18.7 20.4 Q18.4 20.1 18.05 20.1 L17.95 20.1 Q16.8 20.1 15.9 19.2 15 18.3 15 17.1 15 15.9 15.9 15 16.8 14.1 18 14.1 L20 14.1 Q20.4 14.1 20.7 14.4 L21 15.1 20.7 15.8 20 16.1 18 16.1 M23 16.1 Q22.6 16.1 22.3 15.8 22 15.5 22 15.1 22 14.7 22.3 14.4 22.6 14.1 23 14.1 L27 14.1 Q27.4 14.1 27.7 14.4 L28 15.1 27.7 15.8 Q27.4 16.1 27 16.1 L26 16.1 26 23.1 25.7 23.8 25 24.1 24.3 23.8 Q24 23.5 24 23.1 L24 16.1 23 16.1 M29 16.9 Q29 15.75 29.85 14.9 L29.9 14.85 Q30.75 14.1 32 14.1 33.15 14.1 34.05 14.85 L34.1 14.9 Q35 15.75 35 16.9 L35 23.1 34.7 23.8 Q34.4 24.1 34 24.1 L33.3 23.8 Q33 23.5 33 23.1 L33 21.1 31 21.1 31 23.1 30.7 23.8 Q30.4 24.1 30 24.1 L29.3 23.8 Q29 23.5 29 23.1 L29 16.9 M41.1 19.2 L41.1 19.25 40.45 19.75 41.9 22.65 41.95 23.45 41.45 24 40.7 24.05 Q40.3 23.9 40.1 23.55 L38.4 20.1 38 20.1 38 23.1 37.7 23.8 37 24.1 36.3 23.8 Q36 23.5 36 23.1 L36 15.1 Q36 14.7 36.3 14.4 36.6 14.1 37 14.1 L39.05 14.1 Q40.25 14.1 41.1 14.95 42 15.85 42 17.1 42 18.35 41.1 19.2 M48 14.1 Q48.4 14.1 48.7 14.4 L49 15.1 48.7 15.8 Q48.4 16.1 48 16.1 L47 16.1 47 23.1 46.7 23.8 46 24.1 45.3 23.8 Q45 23.5 45 23.1 L45 16.1 44 16.1 Q43.6 16.1 43.3 15.8 43 15.5 43 15.1 43 14.7 43.3 14.4 43.6 14.1 44 14.1 L48 14.1"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 39 Q44 43.95 40.45 47.45 36.95 51 32 51 27.05 51 23.5 47.45 20 43.95 20 39 20 34.05 23.5 30.5 27.05 27 32 27 36.95 27 40.45 30.5 44 34.05 44 39"
                />
            </g>
        </svg>
    `}),sn=p({name:`NintendoSwitch2ButtonZlIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.3 10 Q56 10.15 56 18 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 L48.3 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.4 13 Q23.1 13.2 17.15 19.15 11.35 24.95 11 32.95 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 18 Q53 13.15 48.3 13 L31.4 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 41 L44 41 44 44 35 44 35 31 38 31 38 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 30 L19 27 32 27 32 31 23 41 32 41 32 44 19 44 19 40 28 30 19 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M48.3 10 Q56 10.15 56 18 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 L48.3 10 M31.4 13 Q23.1 13.2 17.15 19.15 11.35 24.95 11 32.95 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 18 Q53 13.15 48.3 13 L31.4 13 M38 41 L44 41 44 44 35 44 35 31 38 31 38 41 M19 30 L19 27 32 27 32 31 23 41 32 41 32 44 19 44 19 40 28 30 19 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.3 10 Q56 10.15 56 18 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 L48.3 10"
                />
            </g>
        </svg>
    `}),cn=p({name:`NintendoSwitch2ButtonZrIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 41 L37 41 37 44 34 44 34 31 40 31 Q42.05 31 43.5 32.45 45 33.95 45 36 45 38.05 43.5 39.5 L45 44 42 44 41 41 41 40.9 40 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 38 L40.05 38 Q40.85 38 41.4 37.4 42 36.85 42 36 42 35.15 41.4 34.55 40.85 34 40 34 L37 34 37 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.75 13 Q11 13.1 11 18 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 33.1 Q52.7 25 46.8 19.15 40.9 13.2 32.65 13 L15.75 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.7 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 18 Q8 10.15 15.7 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 30 L18 27 31 27 31 31 22 41 31 41 31 44 18 44 18 40 27 30 18 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 41 L37 41 37 44 34 44 34 31 40 31 Q42.05 31 43.5 32.45 45 33.95 45 36 45 38.05 43.5 39.5 L45 44 42 44 41 41 41 40.9 40 41 M37 38 L40.05 38 Q40.85 38 41.4 37.4 42 36.85 42 36 42 35.15 41.4 34.55 40.85 34 40 34 L37 34 37 38 M15.75 13 Q11 13.1 11 18 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 33.1 Q52.7 25 46.8 19.15 40.9 13.2 32.65 13 L15.75 13 M15.7 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 18 Q8 10.15 15.7 10 M18 30 L18 27 31 27 31 31 22 41 31 41 31 44 18 44 18 40 27 30 18 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.7 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 18 Q8 10.15 15.7 10"
                />
            </g>
        </svg>
    `}),ln=p({name:`SwitchButtonZlIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 10 Q52 10 52 18 L52 46 Q52 54 44 54 L20 54 Q12 54 12 46 L12 33.95 Q12 24.05 19.05 17 26.05 10 36 10 L44 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 13 L36 13 Q27.3 13 21.2 19.15 15 25.3 15 33.95 L15 46 Q15 51 20 51 L44 51 Q49 51 49 46 L49 18 Q49 13 44 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 44 L45 44 45 47 36 47 36 34 39 34 39 44"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 33 L20 30 33 30 33 34 24 44 33 44 33 47 20 47 20 43 29 33 20 33"
                />
                <path
                    fill="#FFFFFF"
                    d="M44 10 Q52 10 52 18 L52 46 Q52 54 44 54 L20 54 Q12 54 12 46 L12 33.95 Q12 24.05 19.05 17 26.05 10 36 10 L44 10 M44 13 L36 13 Q27.3 13 21.2 19.15 15 25.3 15 33.95 L15 46 Q15 51 20 51 L44 51 Q49 51 49 46 L49 18 Q49 13 44 13 M39 44 L45 44 45 47 36 47 36 34 39 34 39 44 M20 33 L20 30 33 30 33 34 24 44 33 44 33 47 20 47 20 43 29 33 20 33"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 10 Q52 10 52 18 L52 46 Q52 54 44 54 L20 54 Q12 54 12 46 L12 33.95 Q12 24.05 19.05 17 26.05 10 36 10 L44 10"
                />
            </g>
        </svg>
    `}),un=p({name:`SwitchButtonZrIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 44 L38 44 38 47 35 47 35 34 41 34 Q43.05 34 44.5 35.45 46 36.95 46 39 46 41.05 44.5 42.5 L46 47 43 47 42 44 42 43.9 41 44"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 41 L41.05 41 Q41.85 41 42.4 40.4 43 39.85 43 39 43 38.15 42.4 37.55 41.85 37 41 37 L38 37 38 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 13 Q15 13 15 18 L15 46 Q15 51 20 51 L44 51 Q49 51 49 46 L49 33.95 Q49 25.3 42.8 19.15 36.7 13 28 13 L20 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 10 L28 10 Q37.95 10 44.95 17 52 24.05 52 33.95 L52 46 Q52 54 44 54 L20 54 Q12 54 12 46 L12 18 Q12 10 20 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 33 L19 30 32 30 32 34 23 44 32 44 32 47 19 47 19 43 28 33 19 33"
                />
                <path
                    fill="#FFFFFF"
                    d="M41 44 L38 44 38 47 35 47 35 34 41 34 Q43.05 34 44.5 35.45 46 36.95 46 39 46 41.05 44.5 42.5 L46 47 43 47 42 44 42 43.9 41 44 M38 41 L41.05 41 Q41.85 41 42.4 40.4 43 39.85 43 39 43 38.15 42.4 37.55 41.85 37 41 37 L38 37 38 41 M20 13 Q15 13 15 18 L15 46 Q15 51 20 51 L44 51 Q49 51 49 46 L49 33.95 Q49 25.3 42.8 19.15 36.7 13 28 13 L20 13 M20 10 L28 10 Q37.95 10 44.95 17 52 24.05 52 33.95 L52 46 Q52 54 44 54 L20 54 Q12 54 12 46 L12 18 Q12 10 20 10 M19 33 L19 30 32 30 32 34 23 44 32 44 32 47 19 47 19 43 28 33 19 33"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 10 L28 10 Q37.95 10 44.95 17 52 24.05 52 33.95 L52 46 Q52 54 44 54 L20 54 Q12 54 12 46 L12 18 Q12 10 20 10"
                />
            </g>
        </svg>
    `}),dn=p({name:`WiiButtonBIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15 16 L15 48 Q15 53 20 53 L44 53 Q49 53 49 48 L49 16 Q49 11 44 11 L20 11 Q15 11 15 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 8 L44 8 Q52 8 52 16 L52 48 Q52 56 44 56 L20 56 Q12 56 12 48 L12 16 Q12 8 20 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 22 Q36.45 22 38.2 23.7 L38.25 23.75 Q40 25.5 40 28 40 30.3 38.45 32 40 33.65 40 36 40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L25 42 24 41 24 23 25 22 34 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 38 L34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36 36 35.15 35.45 34.6 L35.4 34.6 Q34.85 34.05 34.15 34 L28 34 28 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 26 L28 30 34.15 30 Q34.8 29.95 35.35 29.45 L35.45 29.35 Q36 28.8 36 28 36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M15 16 L15 48 Q15 53 20 53 L44 53 Q49 53 49 48 L49 16 Q49 11 44 11 L20 11 Q15 11 15 16 M20 8 L44 8 Q52 8 52 16 L52 48 Q52 56 44 56 L20 56 Q12 56 12 48 L12 16 Q12 8 20 8 M34 22 Q36.45 22 38.2 23.7 L38.25 23.75 Q40 25.5 40 28 40 30.3 38.45 32 40 33.65 40 36 40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L25 42 24 41 24 23 25 22 34 22 M28 38 L34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36 36 35.15 35.45 34.6 L35.4 34.6 Q34.85 34.05 34.15 34 L28 34 28 38 M28 26 L28 30 34.15 30 Q34.8 29.95 35.35 29.45 L35.45 29.35 Q36 28.8 36 28 36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 8 L44 8 Q52 8 52 16 L52 48 Q52 56 44 56 L20 56 Q12 56 12 48 L12 16 Q12 8 20 8"
                />
            </g>
        </svg>
    `}),fn=p({name:`WiiButtonLIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 36 L37 36 37 39 28 39 28 26 31 26 31 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16 M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 M31 36 L37 36 37 39 28 39 28 26 31 26 31 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
            </g>
        </svg>
    `}),pn=p({name:`WiiButtonZlIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47.1 20.15 Q40.85 14.95 32 15 23.15 14.95 16.95 20.15 11.05 25.1 11 32 11.05 38.9 16.95 43.8 23.15 49.05 32 49 40.85 49.05 47.1 43.8 52.95 38.9 53 32 52.95 25.1 47.1 20.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 40.25 49 46.1 41.95 52 32 52 22.05 52 15 46.1 8 40.25 8 32 8 23.75 15 17.85 22.05 12 32 12 41.95 12 49 17.85 56 23.75 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 37 L45 37 45 40 36 40 36 27 39 27 39 37"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 26 L20 23 33 23 33 27 24 37 33 37 33 40 20 40 20 36 29 26 20 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M47.1 20.15 Q40.85 14.95 32 15 23.15 14.95 16.95 20.15 11.05 25.1 11 32 11.05 38.9 16.95 43.8 23.15 49.05 32 49 40.85 49.05 47.1 43.8 52.95 38.9 53 32 52.95 25.1 47.1 20.15 M56 32 Q56 40.25 49 46.1 41.95 52 32 52 22.05 52 15 46.1 8 40.25 8 32 8 23.75 15 17.85 22.05 12 32 12 41.95 12 49 17.85 56 23.75 56 32 M39 37 L45 37 45 40 36 40 36 27 39 27 39 37 M20 26 L20 23 33 23 33 27 24 37 33 37 33 40 20 40 20 36 29 26 20 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 40.25 49 46.1 41.95 52 32 52 22.05 52 15 46.1 8 40.25 8 32 8 23.75 15 17.85 22.05 12 32 12 41.95 12 49 17.85 56 23.75 56 32"
                />
            </g>
        </svg>
    `}),mn=p({name:`WiiButtonRIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 33 L33.05 33 Q33.85 33 34.4 32.4 35 31.85 35 31 35 30.15 34.4 29.55 33.85 29 33 29 L30 29 30 33"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 36 L30 36 30 39 27 39 27 26 33 26 Q35.05 26 36.5 27.45 38 28.95 38 31 38 33.05 36.5 34.5 L38 39 35 39 34 36 34 35.9 33 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L24 19 Q18.65 19 14.85 22.85 11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16 M30 33 L33.05 33 Q33.85 33 34.4 32.4 35 31.85 35 31 35 30.15 34.4 29.55 33.85 29 33 29 L30 29 30 33 M33 36 L30 36 30 39 27 39 27 26 33 26 Q35.05 26 36.5 27.45 38 28.95 38 31 38 33.05 36.5 34.5 L38 39 35 39 34 36 34 35.9 33 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 17.4 16 24 16"
                />
            </g>
        </svg>
    `}),hn=p({name:`WiiButtonZrIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 37 L38 37 38 40 35 40 35 27 41 27 Q43.05 27 44.5 28.45 46 29.95 46 32 46 34.05 44.5 35.5 L46 40 43 40 42 37 42 36.9 41 37"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 34 L41.05 34 Q41.85 34 42.4 33.4 43 32.85 43 32 43 31.15 42.4 30.55 41.85 30 41 30 L38 30 38 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 40.25 49 46.1 41.95 52 32 52 22.05 52 15 46.1 8 40.25 8 32 8 23.75 15 17.85 22.05 12 32 12 41.95 12 49 17.85 56 23.75 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 26 L19 23 32 23 32 27 23 37 32 37 32 40 19 40 19 36 28 26 19 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47.1 20.15 Q40.85 14.95 32 15 23.15 14.95 16.95 20.15 11.05 25.1 11 32 11.05 38.9 16.95 43.8 23.15 49.05 32 49 40.85 49.05 47.1 43.8 52.95 38.9 53 32 52.95 25.1 47.1 20.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M41 37 L38 37 38 40 35 40 35 27 41 27 Q43.05 27 44.5 28.45 46 29.95 46 32 46 34.05 44.5 35.5 L46 40 43 40 42 37 42 36.9 41 37 M38 34 L41.05 34 Q41.85 34 42.4 33.4 43 32.85 43 32 43 31.15 42.4 30.55 41.85 30 41 30 L38 30 38 34 M56 32 Q56 40.25 49 46.1 41.95 52 32 52 22.05 52 15 46.1 8 40.25 8 32 8 23.75 15 17.85 22.05 12 32 12 41.95 12 49 17.85 56 23.75 56 32 M19 26 L19 23 32 23 32 27 23 37 32 37 32 40 19 40 19 36 28 26 19 26 M47.1 20.15 Q40.85 14.95 32 15 23.15 14.95 16.95 20.15 11.05 25.1 11 32 11.05 38.9 16.95 43.8 23.15 49.05 32 49 40.85 49.05 47.1 43.8 52.95 38.9 53 32 52.95 25.1 47.1 20.15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 40.25 49 46.1 41.95 52 32 52 22.05 52 15 46.1 8 40.25 8 32 8 23.75 15 17.85 22.05 12 32 12 41.95 12 49 17.85 56 23.75 56 32"
                />
            </g>
        </svg>
    `}),gn=p({name:`WiiuButtonLIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.3 10 Q56 10.15 56 18 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 L48.3 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 18 Q53 13 48 13 L32 13 Q23.3 13 17.15 19.15 11.35 24.95 11 32.95 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 24 L30 24 30 37 38 37 38 41 26 41 26 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M48.3 10 Q56 10.15 56 18 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 L48.3 10 M53 18 Q53 13 48 13 L32 13 Q23.3 13 17.15 19.15 11.35 24.95 11 32.95 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 18 M26 24 L30 24 30 37 38 37 38 41 26 41 26 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.3 10 Q56 10.15 56 18 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 32.95 Q8.35 23.7 15.05 17 21.85 10.2 31.35 10 L48.3 10"
                />
            </g>
        </svg>
    `}),_n=p({name:`WiiuButtonZlIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56.05 12.15 L56.05 44.95 Q56.05 46.45 55.1 47.65 54.15 48.8 52.7 49.05 L12.7 55.95 10.45 55.65 Q9.35 55.15 8.7 54.1 8.05 53.05 8.05 51.9 L8.05 28 Q7.35 15.45 20.05 13.45 L51.4 8.05 Q52.55 7.85 53.65 8.35 54.75 8.85 55.4 9.85 56.05 10.9 56.05 12.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 24 L31 26.4 25 36 31 36 31 40 19 40 19 37.6 25 28 19 28 19 24 31 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 24 L38 24 38 36 46 36 46 40 34 40 34 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M52.4 11.1 L51.95 11 51.9 11 20.55 16.4 Q10.5 17.95 11.05 27.85 L11.05 28 11.05 51.9 11.25 52.55 11.7 52.95 12.2 53 52.2 46.1 Q52.5 46.05 52.75 45.8 L53.05 44.95 53.05 12.15 52.9 11.5 52.4 11.1"
                />
                <path
                    fill="#FFFFFF"
                    d="M56.05 12.15 L56.05 44.95 Q56.05 46.45 55.1 47.65 54.15 48.8 52.7 49.05 L12.7 55.95 10.45 55.65 Q9.35 55.15 8.7 54.1 8.05 53.05 8.05 51.9 L8.05 28 Q7.35 15.45 20.05 13.45 L51.4 8.05 Q52.55 7.85 53.65 8.35 54.75 8.85 55.4 9.85 56.05 10.9 56.05 12.15 M31 24 L31 26.4 25 36 31 36 31 40 19 40 19 37.6 25 28 19 28 19 24 31 24 M34 24 L38 24 38 36 46 36 46 40 34 40 34 24 M52.4 11.1 L51.95 11 51.9 11 20.55 16.4 Q10.5 17.95 11.05 27.85 L11.05 28 11.05 51.9 11.25 52.55 11.7 52.95 12.2 53 52.2 46.1 Q52.5 46.05 52.75 45.8 L53.05 44.95 53.05 12.15 52.9 11.5 52.4 11.1"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56.05 12.15 L56.05 44.95 Q56.05 46.45 55.1 47.65 54.15 48.8 52.7 49.05 L12.7 55.95 10.45 55.65 Q9.35 55.15 8.7 54.1 8.05 53.05 8.05 51.9 L8.05 28 Q7.35 15.45 20.05 13.45 L51.4 8.05 Q52.55 7.85 53.65 8.35 54.75 8.85 55.4 9.85 56.05 10.9 56.05 12.15"
                />
            </g>
        </svg>
    `}),vn=p({name:`WiiuButtonRIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.7 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 18 Q8 10.15 15.7 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 28 L29 28 29 32 32 32 Q32.8 32 33.35 31.45 L33.45 31.35 Q34 30.8 34 30 34 29.2 33.4 28.6 32.8 28 32 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 24 L32 24 Q34.5 24 36.25 25.75 38 27.5 38 30 38 32.45 36.25 34.2 L36.2 34.25 35.45 34.9 38.5 41 34.5 41 32 36 29 36 29 41 25 41 25 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 18 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 32.95 Q52.65 24.95 46.85 19.15 40.7 13 32 13 L16 13 Q11 13 11 18"
                />
                <path
                    fill="#FFFFFF"
                    d="M15.7 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 18 Q8 10.15 15.7 10 M32 28 L29 28 29 32 32 32 Q32.8 32 33.35 31.45 L33.45 31.35 Q34 30.8 34 30 34 29.2 33.4 28.6 32.8 28 32 28 M25 24 L32 24 Q34.5 24 36.25 25.75 38 27.5 38 30 38 32.45 36.25 34.2 L36.2 34.25 35.45 34.9 38.5 41 34.5 41 32 36 29 36 29 41 25 41 25 24 M11 18 L11 46 Q11 51 16 51 L48 51 Q53 51 53 46 L53 32.95 Q52.65 24.95 46.85 19.15 40.7 13 32 13 L16 13 Q11 13 11 18"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.7 10 L32.65 10 Q42.15 10.2 48.95 17 55.65 23.7 56 32.95 L56 46 Q56 54 48 54 L16 54 Q8 54 8 46 L8 18 Q8 10.15 15.7 10"
                />
            </g>
        </svg>
    `}),yn=p({name:`WiiuButtonZrIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11.65 11.1 L11.15 11.5 Q11 11.8 11 12.15 L11 44.95 Q11 45.4 11.3 45.8 L11.85 46.1 51.85 53 52.35 52.95 52.8 52.55 53 51.9 53 28 53 27.85 Q53.55 17.95 43.5 16.4 L12.15 11 12.1 11 11.65 11.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.05 28 L37.05 28 37.05 32 40.05 32 Q40.85 32 41.4 31.45 L41.5 31.35 Q42.05 30.8 42.05 30 42.05 29.15 41.5 28.6 L41.45 28.6 Q40.85 28 40.05 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.05 24 L40.25 24 Q41.8 24.05 43.05 24.8 L44.25 25.7 44.3 25.75 Q46.05 27.5 46.05 30 46.05 32.45 44.3 34.2 L44.25 34.25 44.15 34.35 47.05 40 42.05 40 40.05 36 37.05 36 37.05 40 33.05 40 33.05 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.05 24 L30.05 26.4 24.05 36 30.05 36 30.05 40 18.05 40 18.05 37.6 24.05 28 18.05 28 18.05 24 30.05 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 12.15 Q8 10.9 8.65 9.85 9.3 8.85 10.4 8.35 11.5 7.85 12.65 8.05 L44 13.45 Q56.7 15.45 56 28 L56 51.9 Q56 53.05 55.35 54.1 54.7 55.15 53.6 55.65 L51.35 55.95 11.35 49.05 Q9.9 48.8 8.95 47.65 8 46.45 8 44.95 L8 12.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M11.65 11.1 L11.15 11.5 Q11 11.8 11 12.15 L11 44.95 Q11 45.4 11.3 45.8 L11.85 46.1 51.85 53 52.35 52.95 52.8 52.55 53 51.9 53 28 53 27.85 Q53.55 17.95 43.5 16.4 L12.15 11 12.1 11 11.65 11.1 M40.05 28 L37.05 28 37.05 32 40.05 32 Q40.85 32 41.4 31.45 L41.5 31.35 Q42.05 30.8 42.05 30 42.05 29.15 41.5 28.6 L41.45 28.6 Q40.85 28 40.05 28 M33.05 24 L40.25 24 Q41.8 24.05 43.05 24.8 L44.25 25.7 44.3 25.75 Q46.05 27.5 46.05 30 46.05 32.45 44.3 34.2 L44.25 34.25 44.15 34.35 47.05 40 42.05 40 40.05 36 37.05 36 37.05 40 33.05 40 33.05 24 M30.05 24 L30.05 26.4 24.05 36 30.05 36 30.05 40 18.05 40 18.05 37.6 24.05 28 18.05 28 18.05 24 30.05 24 M8 12.15 Q8 10.9 8.65 9.85 9.3 8.85 10.4 8.35 11.5 7.85 12.65 8.05 L44 13.45 Q56.7 15.45 56 28 L56 51.9 Q56 53.05 55.35 54.1 54.7 55.15 53.6 55.65 L51.35 55.95 11.35 49.05 Q9.9 48.8 8.95 47.65 8 46.45 8 44.95 L8 12.15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 12.15 Q8 10.9 8.65 9.85 9.3 8.85 10.4 8.35 11.5 7.85 12.65 8.05 L44 13.45 Q56.7 15.45 56 28 L56 51.9 Q56 53.05 55.35 54.1 54.7 55.15 53.6 55.65 L51.35 55.95 11.35 49.05 Q9.9 48.8 8.95 47.65 8 46.45 8 44.95 L8 12.15"
                />
            </g>
        </svg>
    `}),bn=p({name:`PlaystationButtonCrossIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 32 Q11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22.8 20 L32 29.2 41.2 20 44 22.8 34.8 32 44 41.2 41.2 44 32 34.8 22.8 44 20 41.2 29.2 32 20 22.8 22.8 20"
                />
                <path
                    fill="#A480FF"
                    d="M11 32 Q11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M22.8 20 L32 29.2 41.2 20 44 22.8 34.8 32 44 41.2 41.2 44 32 34.8 22.8 44 20 41.2 29.2 32 20 22.8 22.8 20"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#A480FF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),xn=p({name:`PlaystationButtonCircleIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37.7 26.35 Q35.35 24 32 24 28.7 24 26.4 26.35 L26.35 26.35 Q24 28.7 24 32 24 35.3 26.35 37.65 L26.4 37.7 Q28.7 40 32 40 35.35 40 37.7 37.7 40 35.35 40 32 40 28.65 37.7 26.35"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 11 Q23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 32 Q44 37 40.5 40.5 37 44 32 44 27.05 44 23.55 40.5 20 37 20 32 20 27 23.55 23.5 27.05 20 32 20 37 20 40.5 23.5 44 27 44 32"
                />
                <path
                    fill="#FF5C5C"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M37.7 26.35 Q35.35 24 32 24 28.7 24 26.4 26.35 L26.35 26.35 Q24 28.7 24 32 24 35.3 26.35 37.65 L26.4 37.7 Q28.7 40 32 40 35.35 40 37.7 37.7 40 35.35 40 32 40 28.65 37.7 26.35 M32 11 Q23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 M44 32 Q44 37 40.5 40.5 37 44 32 44 27.05 44 23.55 40.5 20 37 20 32 20 27 23.55 23.5 27.05 20 32 20 37 20 40.5 23.5 44 27 44 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FF5C5C"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Sn=p({name:`PlaystationButtonSquareIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 40 L40 40 40 24 24 24 24 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 20 L44 20 44 44 20 44 20 20"
                />
                <path
                    fill="#FF5CFF"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 M24 40 L40 40 40 24 24 24 24 40 M20 20 L44 20 44 44 20 44 20 20"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FF5CFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),Cn=p({name:`PlaystationButtonTriangleIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.15 17.15 Q11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 21.45 8.6 30.35 8.05 L32 8 33.7 8.05 Q42.6 8.6 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 25.95 L25 38 39.05 38 32 25.95"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 42 L18 42 32 18 46 42"
                />
                <path
                    fill="#1BEE98"
                    d="M17.15 17.15 Q11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 21.45 8.6 30.35 8.05 L32 8 33.7 8.05 Q42.6 8.6 48.95 15 56 22.05 56 32 M32 25.95 L25 38 39.05 38 32 25.95 M46 42 L18 42 32 18 46 42"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#1BEE98"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 21.45 8.6 30.35 8.05 L32 8 33.7 8.05 Q42.6 8.6 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),wn=p({name:`PlaystationTriggerL1AlternativeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 23 L42 40 38 40 38 32.95 38 32.85 38 27.95 35 27.95 35 26 38 23 42 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 20 L56 40 Q56 44.95 49 48.5 41.95 52 32 52 22.05 52 15.05 48.5 8 44.95 8 40 L8 20 Q8 12 16 12 L48 12 Q56 12 56 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 15 Q11 15 11 20 L11 40 Q11.35 43.25 16.4 45.85 22.85 49 32 49 41.15 49 47.7 45.85 L47.65 45.85 Q52.7 43.25 53 40 L53 20 Q53 15 48 15 L16 15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 23 L26 23 26 36 34 36 34 40 22 40 22 23"
                />
                <path
                    fill="#FFFFFF"
                    d="M42 23 L42 40 38 40 38 32.95 38 32.85 38 27.95 35 27.95 35 26 38 23 42 23 M56 20 L56 40 Q56 44.95 49 48.5 41.95 52 32 52 22.05 52 15.05 48.5 8 44.95 8 40 L8 20 Q8 12 16 12 L48 12 Q56 12 56 20 M16 15 Q11 15 11 20 L11 40 Q11.35 43.25 16.4 45.85 22.85 49 32 49 41.15 49 47.7 45.85 L47.65 45.85 Q52.7 43.25 53 40 L53 20 Q53 15 48 15 L16 15 M22 23 L26 23 26 36 34 36 34 40 22 40 22 23"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 20 L56 40 Q56 44.95 49 48.5 41.95 52 32 52 22.05 52 15.05 48.5 8 44.95 8 40 L8 20 Q8 12 16 12 L48 12 Q56 12 56 20"
                />
            </g>
        </svg>
    `}),Tn=p({name:`PlaystationTriggerL2AlternativeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 49 L48 49 Q53 49 53 44 L53 24 Q52.7 20.75 47.65 18.2 L47.7 18.2 Q41.15 15 32 15 22.85 15 16.4 18.2 11.35 20.75 11 24 L11 44 Q11 49 16 49"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.5 28.4 Q40.1 28 39.5 28 L37.95 28 37.85 28 Q37.55 28.05 37.3 28.3 37 28.6 37 29 L33 29 33.1 28 Q33.35 26.6 34.4 25.5 L34.5 25.4 Q35.9 24.05 37.85 24 L39.5 24 Q41.75 24 43.35 25.6 L43.4 25.65 44.4 27 Q45.65 30.35 43.45 32.55 L39 37 45 37 45 41 37.95 41 37.85 41 33 41 33 37 40 30.45 Q41.25 29.15 40.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 52 48 52 L16 52 Q8 52 8 44 L8 24 Q8 19.05 15.05 15.5 22.05 12 32 12 41.95 12 49 15.5 56 19.05 56 24 L56 44"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 24 L23 24 23 37 31 37 31 41 19 41 19 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 49 L48 49 Q53 49 53 44 L53 24 Q52.7 20.75 47.65 18.2 L47.7 18.2 Q41.15 15 32 15 22.85 15 16.4 18.2 11.35 20.75 11 24 L11 44 Q11 49 16 49 M40.5 28.4 Q40.1 28 39.5 28 L37.95 28 37.85 28 Q37.55 28.05 37.3 28.3 37 28.6 37 29 L33 29 33.1 28 Q33.35 26.6 34.4 25.5 L34.5 25.4 Q35.9 24.05 37.85 24 L39.5 24 Q41.75 24 43.35 25.6 L43.4 25.65 44.4 27 Q45.65 30.35 43.45 32.55 L39 37 45 37 45 41 37.95 41 37.85 41 33 41 33 37 40 30.45 Q41.25 29.15 40.5 28.4 M56 44 Q56 52 48 52 L16 52 Q8 52 8 44 L8 24 Q8 19.05 15.05 15.5 22.05 12 32 12 41.95 12 49 15.5 56 19.05 56 24 L56 44 M19 24 L23 24 23 37 31 37 31 41 19 41 19 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 52 48 52 L16 52 Q8 52 8 44 L8 24 Q8 19.05 15.05 15.5 22.05 12 32 12 41.95 12 49 15.5 56 19.05 56 24 L56 44"
                />
            </g>
        </svg>
    `}),En=p({name:`PlaystationTriggerR1AlternativeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 20 L56 40 Q56 44.95 49 48.5 41.95 52 32 52 22.05 52 15.05 48.5 8 44.95 8 40 L8 20 Q8 12 16 12 L48 12 Q56 12 56 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 23 L28 23 Q30.5 23 32.25 24.75 34 26.5 34 29 34 31.45 32.25 33.2 L32.2 33.25 31.45 33.9 34.5 40 30.5 40 28 35 25 35 25 40 21 40 21 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 20 L11 40 Q11.35 43.25 16.4 45.85 22.85 49 32 49 41.15 49 47.7 45.85 L47.65 45.85 Q52.7 43.25 53 40 L53 20 Q53 15 48 15 L16 15 Q11 15 11 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 23 L43 40 39 40 39 32.95 39 32.85 39 27.95 36 27.95 36 26 39 23 43 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 27 L25 27 25 31 28 31 Q28.8 31 29.35 30.45 L29.45 30.35 Q30 29.8 30 29 30 28.2 29.4 27.6 28.8 27 28 27"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 20 L56 40 Q56 44.95 49 48.5 41.95 52 32 52 22.05 52 15.05 48.5 8 44.95 8 40 L8 20 Q8 12 16 12 L48 12 Q56 12 56 20 M21 23 L28 23 Q30.5 23 32.25 24.75 34 26.5 34 29 34 31.45 32.25 33.2 L32.2 33.25 31.45 33.9 34.5 40 30.5 40 28 35 25 35 25 40 21 40 21 23 M11 20 L11 40 Q11.35 43.25 16.4 45.85 22.85 49 32 49 41.15 49 47.7 45.85 L47.65 45.85 Q52.7 43.25 53 40 L53 20 Q53 15 48 15 L16 15 Q11 15 11 20 M43 23 L43 40 39 40 39 32.95 39 32.85 39 27.95 36 27.95 36 26 39 23 43 23 M28 27 L25 27 25 31 28 31 Q28.8 31 29.35 30.45 L29.45 30.35 Q30 29.8 30 29 30 28.2 29.4 27.6 28.8 27 28 27"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 20 L56 40 Q56 44.95 49 48.5 41.95 52 32 52 22.05 52 15.05 48.5 8 44.95 8 40 L8 20 Q8 12 16 12 L48 12 Q56 12 56 20"
                />
            </g>
        </svg>
    `}),Dn=p({name:`PlaystationTriggerR2AlternativeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 49 L48 49 Q53 49 53 44 L53 24 Q52.7 20.75 47.65 18.2 L47.7 18.2 Q41.15 15 32 15 22.85 15 16.4 18.2 11.35 20.75 11 24 L11 44 Q11 49 16 49"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.5 28.4 Q41.1 28 40.5 28 L38.95 28 38.85 28 38.3 28.3 Q38 28.6 38 29 L34 29 34.1 28 Q34.35 26.6 35.4 25.5 L35.5 25.4 Q36.9 24.05 38.85 24 L40.5 24 Q42.75 24 44.35 25.6 L44.4 25.65 45.4 27 Q46.65 30.35 44.45 32.55 L40 37 46 37 46 41 38.95 41 38.85 41 34 41 34 37 41 30.45 Q42.25 29.15 41.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 28 L22 28 22 32 25 32 Q25.8 32 26.35 31.45 L26.45 31.35 Q27 30.8 27 30 27 29.2 26.4 28.6 25.8 28 25 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 24 L25 24 Q27.5 24 29.25 25.75 31 27.5 31 30 31 32.45 29.25 34.2 L29.2 34.25 28.45 34.9 31.5 41 27.5 41 25 36 22 36 22 41 18 41 18 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 52 48 52 L16 52 Q8 52 8 44 L8 24 Q8 19.05 15.05 15.5 22.05 12 32 12 41.95 12 49 15.5 56 19.05 56 24 L56 44"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 49 L48 49 Q53 49 53 44 L53 24 Q52.7 20.75 47.65 18.2 L47.7 18.2 Q41.15 15 32 15 22.85 15 16.4 18.2 11.35 20.75 11 24 L11 44 Q11 49 16 49 M41.5 28.4 Q41.1 28 40.5 28 L38.95 28 38.85 28 38.3 28.3 Q38 28.6 38 29 L34 29 34.1 28 Q34.35 26.6 35.4 25.5 L35.5 25.4 Q36.9 24.05 38.85 24 L40.5 24 Q42.75 24 44.35 25.6 L44.4 25.65 45.4 27 Q46.65 30.35 44.45 32.55 L40 37 46 37 46 41 38.95 41 38.85 41 34 41 34 37 41 30.45 Q42.25 29.15 41.5 28.4 M25 28 L22 28 22 32 25 32 Q25.8 32 26.35 31.45 L26.45 31.35 Q27 30.8 27 30 27 29.2 26.4 28.6 25.8 28 25 28 M18 24 L25 24 Q27.5 24 29.25 25.75 31 27.5 31 30 31 32.45 29.25 34.2 L29.2 34.25 28.45 34.9 31.5 41 27.5 41 25 36 22 36 22 41 18 41 18 24 M56 44 Q56 52 48 52 L16 52 Q8 52 8 44 L8 24 Q8 19.05 15.05 15.5 22.05 12 32 12 41.95 12 49 15.5 56 19.05 56 24 L56 44"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 52 48 52 L16 52 Q8 52 8 44 L8 24 Q8 19.05 15.05 15.5 22.05 12 32 12 41.95 12 49 15.5 56 19.05 56 24 L56 44"
                />
            </g>
        </svg>
    `}),On=p({name:`PlaystationDpadNoneIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11 M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40 M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
            </g>
        </svg>
    `}),kn=p({name:`PlaystationDpadDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11 M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40 M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
            </g>
        </svg>
    `}),An=p({name:`PlaystationDpadLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11 M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
            </g>
        </svg>
    `}),jn=p({name:`PlaystationDpadRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 11 L27 18.75 32.05 23.8 37 18.8 37 11 27 11 M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40 M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
            </g>
        </svg>
    `}),Mn=p({name:`PlaystationDpadUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M45.3 27 L40.3 32.05 45.25 37 53 37 53 27 45.3 27 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M27 45.3 L27 53 37 53 37 45.25 32.05 40.3 27 45.3 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40 M11 37 L18.8 37 23.8 32.05 18.75 27 11 27 11 37"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 10 L40 19.15 Q40 20 39.45 20.6 L33.45 26.6 Q32.85 27.15 32 27.15 31.15 27.15 30.6 26.6 L24.6 20.6 Q24 20 24 19.15 L24 10 Q24 9.15 24.6 8.6 25.15 8 26 8 L38 8 Q38.85 8 39.45 8.6 40 9.15 40 10 M56 26 L56 38 Q56 38.85 55.45 39.45 54.85 40 54 40 L44.85 40 Q44 40 43.45 39.45 L37.45 33.45 Q36.85 32.85 36.85 32 36.85 31.15 37.45 30.6 L43.45 24.6 Q44 24 44.85 24 L54 24 Q54.85 24 55.45 24.6 56 25.15 56 26 M33.45 37.45 L39.45 43.45 Q40 44 40 44.85 L40 54 Q40 54.85 39.45 55.45 38.85 56 38 56 L26 56 Q25.15 56 24.6 55.45 24 54.85 24 54 L24 44.85 Q24 44 24.6 43.45 L30.6 37.45 Q31.15 36.85 32 36.85 32.85 36.85 33.45 37.45 M19.15 40 L10 40 Q9.15 40 8.6 39.45 8 38.85 8 38 L8 26 Q8 25.15 8.6 24.6 9.15 24 10 24 L19.15 24 Q20 24 20.6 24.6 L26.6 30.6 Q27.15 31.15 27.15 32 27.15 32.85 26.6 33.45 L20.6 39.45 Q20 40 19.15 40"
                />
            </g>
        </svg>
    `}),Nn=p({name:`Playstation3ButtonSelectIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.6 23.25 L44.55 23.3 Q43.65 24 42.5 24 41.25 24 40.4 23.3 L40.35 23.2 Q39.5 22.35 39.5 21.25 L39.5 16.8 Q39.5 15.65 40.35 14.8 L40.4 14.75 Q41.25 14 42.5 14 43.65 14 44.55 14.75 L44.6 14.8 Q45.5 15.65 45.5 16.8 L45.2 17.5 Q44.9 17.8 44.5 17.8 L43.8 17.5 Q43.5 17.2 43.5 16.8 L43.25 16.25 43.25 16.3 Q42.95 16 42.5 16 42.05 16 41.7 16.3 L41.75 16.2 Q41.5 16.45 41.5 16.8 L41.5 21.25 41.7 21.75 42.5 22 43.25 21.75 43.25 21.8 43.5 21.25 Q43.5 20.85 43.8 20.55 44.1 20.25 44.5 20.25 44.9 20.25 45.2 20.55 L45.5 21.25 Q45.5 22.35 44.6 23.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47.5 16 L46.8 15.7 Q46.5 15.4 46.5 15 46.5 14.6 46.8 14.3 47.1 14 47.5 14 L51.5 14 Q51.9 14 52.2 14.3 L52.5 15 52.2 15.7 51.5 16 50.5 16 50.5 23 50.2 23.7 Q49.9 24 49.5 24 L48.8 23.7 Q48.5 23.4 48.5 23 L48.5 16 47.5 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.5 33 L48.5 47 Q48.5 48.25 47.65 49.15 46.75 50 45.5 50 L19.5 50 Q18.25 50 17.4 49.15 16.5 48.25 16.5 47 L16.5 33 Q16.5 31.75 17.4 30.9 18.25 30 19.5 30 L45.5 30 Q46.75 30 47.65 30.9 48.5 31.75 48.5 33"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M14.5 16 Q14.1 16 13.8 16.3 13.5 16.6 13.5 17 13.5 17.4 13.8 17.7 L14.45 18 14.55 18 Q15.7 18 16.6 18.9 17.5 19.8 17.5 21 17.5 22.2 16.6 23.1 15.7 24 14.5 24 L12.5 24 Q12.1 24 11.8 23.7 11.5 23.4 11.5 23 11.5 22.6 11.8 22.3 12.1 22 12.5 22 L14.5 22 15.2 21.7 15.5 21 15.2 20.3 Q14.9 20 14.55 20 L14.45 20 Q13.3 20 12.4 19.1 11.5 18.2 11.5 17 11.5 15.8 12.4 14.9 13.3 14 14.5 14 L16.5 14 Q16.9 14 17.2 14.3 L17.5 15 17.2 15.7 Q16.9 16 16.5 16 L14.5 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37.5 14 Q37.9 14 38.2 14.3 L38.5 15 38.2 15.7 Q37.9 16 37.5 16 L34.5 16 34.5 18 37.5 18 Q37.9 18 38.2 18.3 L38.5 19 38.2 19.7 Q37.9 20 37.5 20 L34.5 20 34.5 22 37.5 22 Q37.9 22 38.2 22.3 L38.5 23 38.2 23.7 Q37.9 24 37.5 24 L33.5 24 Q33.1 24 32.8 23.7 32.5 23.4 32.5 23 L32.5 15 Q32.5 14.6 32.8 14.3 33.1 14 33.5 14 L37.5 14"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23.5 14 Q23.9 14 24.2 14.3 L24.5 15 24.2 15.7 Q23.9 16 23.5 16 L20.5 16 20.5 18 23.5 18 Q23.9 18 24.2 18.3 L24.5 19 24.2 19.7 Q23.9 20 23.5 20 L20.5 20 20.5 22 23.5 22 Q23.9 22 24.2 22.3 L24.5 23 24.2 23.7 Q23.9 24 23.5 24 L19.5 24 18.8 23.7 Q18.5 23.4 18.5 23 L18.5 15 Q18.5 14.6 18.8 14.3 19.1 14 19.5 14 L23.5 14"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25.5 15 Q25.5 14.6 25.8 14.3 26.1 14 26.5 14 26.9 14 27.2 14.3 L27.5 15 27.5 22 30.5 22 Q30.9 22 31.2 22.3 L31.5 23 31.2 23.7 30.5 24 26.5 24 25.8 23.7 Q25.5 23.4 25.5 23 L25.5 15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.5 47 L45.5 47 45.5 33 19.5 33 19.5 47"
                />
                <path
                    fill="#FFFFFF"
                    d="M44.6 23.25 L44.55 23.3 Q43.65 24 42.5 24 41.25 24 40.4 23.3 L40.35 23.2 Q39.5 22.35 39.5 21.25 L39.5 16.8 Q39.5 15.65 40.35 14.8 L40.4 14.75 Q41.25 14 42.5 14 43.65 14 44.55 14.75 L44.6 14.8 Q45.5 15.65 45.5 16.8 L45.2 17.5 Q44.9 17.8 44.5 17.8 L43.8 17.5 Q43.5 17.2 43.5 16.8 L43.25 16.25 43.25 16.3 Q42.95 16 42.5 16 42.05 16 41.7 16.3 L41.75 16.2 Q41.5 16.45 41.5 16.8 L41.5 21.25 41.7 21.75 42.5 22 43.25 21.75 43.25 21.8 43.5 21.25 Q43.5 20.85 43.8 20.55 44.1 20.25 44.5 20.25 44.9 20.25 45.2 20.55 L45.5 21.25 Q45.5 22.35 44.6 23.25 M47.5 16 L46.8 15.7 Q46.5 15.4 46.5 15 46.5 14.6 46.8 14.3 47.1 14 47.5 14 L51.5 14 Q51.9 14 52.2 14.3 L52.5 15 52.2 15.7 51.5 16 50.5 16 50.5 23 50.2 23.7 Q49.9 24 49.5 24 L48.8 23.7 Q48.5 23.4 48.5 23 L48.5 16 47.5 16 M48.5 33 L48.5 47 Q48.5 48.25 47.65 49.15 46.75 50 45.5 50 L19.5 50 Q18.25 50 17.4 49.15 16.5 48.25 16.5 47 L16.5 33 Q16.5 31.75 17.4 30.9 18.25 30 19.5 30 L45.5 30 Q46.75 30 47.65 30.9 48.5 31.75 48.5 33 M14.5 16 Q14.1 16 13.8 16.3 13.5 16.6 13.5 17 13.5 17.4 13.8 17.7 L14.45 18 14.55 18 Q15.7 18 16.6 18.9 17.5 19.8 17.5 21 17.5 22.2 16.6 23.1 15.7 24 14.5 24 L12.5 24 Q12.1 24 11.8 23.7 11.5 23.4 11.5 23 11.5 22.6 11.8 22.3 12.1 22 12.5 22 L14.5 22 15.2 21.7 15.5 21 15.2 20.3 Q14.9 20 14.55 20 L14.45 20 Q13.3 20 12.4 19.1 11.5 18.2 11.5 17 11.5 15.8 12.4 14.9 13.3 14 14.5 14 L16.5 14 Q16.9 14 17.2 14.3 L17.5 15 17.2 15.7 Q16.9 16 16.5 16 L14.5 16 M37.5 14 Q37.9 14 38.2 14.3 L38.5 15 38.2 15.7 Q37.9 16 37.5 16 L34.5 16 34.5 18 37.5 18 Q37.9 18 38.2 18.3 L38.5 19 38.2 19.7 Q37.9 20 37.5 20 L34.5 20 34.5 22 37.5 22 Q37.9 22 38.2 22.3 L38.5 23 38.2 23.7 Q37.9 24 37.5 24 L33.5 24 Q33.1 24 32.8 23.7 32.5 23.4 32.5 23 L32.5 15 Q32.5 14.6 32.8 14.3 33.1 14 33.5 14 L37.5 14 M23.5 14 Q23.9 14 24.2 14.3 L24.5 15 24.2 15.7 Q23.9 16 23.5 16 L20.5 16 20.5 18 23.5 18 Q23.9 18 24.2 18.3 L24.5 19 24.2 19.7 Q23.9 20 23.5 20 L20.5 20 20.5 22 23.5 22 Q23.9 22 24.2 22.3 L24.5 23 24.2 23.7 Q23.9 24 23.5 24 L19.5 24 18.8 23.7 Q18.5 23.4 18.5 23 L18.5 15 Q18.5 14.6 18.8 14.3 19.1 14 19.5 14 L23.5 14 M25.5 15 Q25.5 14.6 25.8 14.3 26.1 14 26.5 14 26.9 14 27.2 14.3 L27.5 15 27.5 22 30.5 22 Q30.9 22 31.2 22.3 L31.5 23 31.2 23.7 30.5 24 26.5 24 25.8 23.7 Q25.5 23.4 25.5 23 L25.5 15 M19.5 47 L45.5 47 45.5 33 19.5 33 19.5 47"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.6 23.25 L44.55 23.3 Q43.65 24 42.5 24 41.25 24 40.4 23.3 L40.35 23.2 Q39.5 22.35 39.5 21.25 L39.5 16.8 Q39.5 15.65 40.35 14.8 L40.4 14.75 Q41.25 14 42.5 14 43.65 14 44.55 14.75 L44.6 14.8 Q45.5 15.65 45.5 16.8 L45.2 17.5 Q44.9 17.8 44.5 17.8 L43.8 17.5 Q43.5 17.2 43.5 16.8 L43.25 16.25 43.25 16.3 Q42.95 16 42.5 16 42.05 16 41.7 16.3 L41.75 16.2 Q41.5 16.45 41.5 16.8 L41.5 21.25 41.7 21.75 42.5 22 43.25 21.75 43.25 21.8 43.5 21.25 Q43.5 20.85 43.8 20.55 44.1 20.25 44.5 20.25 44.9 20.25 45.2 20.55 L45.5 21.25 Q45.5 22.35 44.6 23.25 M47.5 16 L46.8 15.7 Q46.5 15.4 46.5 15 46.5 14.6 46.8 14.3 47.1 14 47.5 14 L51.5 14 Q51.9 14 52.2 14.3 L52.5 15 52.2 15.7 51.5 16 50.5 16 50.5 23 50.2 23.7 Q49.9 24 49.5 24 L48.8 23.7 Q48.5 23.4 48.5 23 L48.5 16 47.5 16 M14.5 16 Q14.1 16 13.8 16.3 13.5 16.6 13.5 17 13.5 17.4 13.8 17.7 L14.45 18 14.55 18 Q15.7 18 16.6 18.9 17.5 19.8 17.5 21 17.5 22.2 16.6 23.1 15.7 24 14.5 24 L12.5 24 Q12.1 24 11.8 23.7 11.5 23.4 11.5 23 11.5 22.6 11.8 22.3 12.1 22 12.5 22 L14.5 22 15.2 21.7 15.5 21 15.2 20.3 Q14.9 20 14.55 20 L14.45 20 Q13.3 20 12.4 19.1 11.5 18.2 11.5 17 11.5 15.8 12.4 14.9 13.3 14 14.5 14 L16.5 14 Q16.9 14 17.2 14.3 L17.5 15 17.2 15.7 Q16.9 16 16.5 16 L14.5 16 M37.5 14 Q37.9 14 38.2 14.3 L38.5 15 38.2 15.7 Q37.9 16 37.5 16 L34.5 16 34.5 18 37.5 18 Q37.9 18 38.2 18.3 L38.5 19 38.2 19.7 Q37.9 20 37.5 20 L34.5 20 34.5 22 37.5 22 Q37.9 22 38.2 22.3 L38.5 23 38.2 23.7 Q37.9 24 37.5 24 L33.5 24 Q33.1 24 32.8 23.7 32.5 23.4 32.5 23 L32.5 15 Q32.5 14.6 32.8 14.3 33.1 14 33.5 14 L37.5 14 M23.5 14 Q23.9 14 24.2 14.3 L24.5 15 24.2 15.7 Q23.9 16 23.5 16 L20.5 16 20.5 18 23.5 18 Q23.9 18 24.2 18.3 L24.5 19 24.2 19.7 Q23.9 20 23.5 20 L20.5 20 20.5 22 23.5 22 Q23.9 22 24.2 22.3 L24.5 23 24.2 23.7 Q23.9 24 23.5 24 L19.5 24 18.8 23.7 Q18.5 23.4 18.5 23 L18.5 15 Q18.5 14.6 18.8 14.3 19.1 14 19.5 14 L23.5 14 M25.5 15 Q25.5 14.6 25.8 14.3 26.1 14 26.5 14 26.9 14 27.2 14.3 L27.5 15 27.5 22 30.5 22 Q30.9 22 31.2 22.3 L31.5 23 31.2 23.7 30.5 24 26.5 24 25.8 23.7 Q25.5 23.4 25.5 23 L25.5 15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.5 33 L48.5 47 Q48.5 48.25 47.65 49.15 46.75 50 45.5 50 L19.5 50 Q18.25 50 17.4 49.15 16.5 48.25 16.5 47 L16.5 33 Q16.5 31.75 17.4 30.9 18.25 30 19.5 30 L45.5 30 Q46.75 30 47.65 30.9 48.5 31.75 48.5 33"
                />
            </g>
        </svg>
    `}),Pn=p({name:`Playstation4ButtonShareIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 19 L27.7 19.7 Q27.4 20 27 20 L26.3 19.7 26 19 26 16 24 16 24 19 23.7 19.7 23 20 Q22.6 20 22.3 19.7 22 19.4 22 19 L22 11 Q22 10.6 22.3 10.3 22.6 10 23 10 23.4 10 23.7 10.3 L24 11 24 14 26 14 26 11 Q26 10.6 26.3 10.3 26.6 10 27 10 27.4 10 27.7 10.3 L28 11 28 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 12 Q17.6 12 17.3 12.3 17 12.6 17 13 17 13.4 17.3 13.7 17.6 14 17.95 14 L18.05 14 Q19.2 14 20.1 14.9 21 15.8 21 17 21 18.2 20.1 19.1 19.2 20 18 20 L16 20 15.3 19.7 Q15 19.4 15 19 15 18.6 15.3 18.3 15.6 18 16 18 L18 18 Q18.4 18 18.7 17.7 L19 17 18.7 16.3 Q18.4 16 18.05 16 L17.95 16 Q16.8 16 15.9 15.1 15 14.2 15 13 15 11.8 15.9 10.9 16.8 10 18 10 L20 10 Q20.4 10 20.7 10.3 L21 11 20.7 11.7 20 12 18 12"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.1 14 L39.45 13.9 39.7 13.7 39.75 13.7 40 13 39.7 12.25 Q39.45 12 39.05 12 L38 12 38 14 39.1 14"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 12.8 Q29 11.65 29.85 10.8 L29.9 10.75 Q30.75 10 32 10 33.15 10 34.05 10.75 L34.1 10.8 Q35 11.65 35 12.8 L35 19 34.7 19.7 Q34.4 20 34 20 L33.3 19.7 Q33 19.4 33 19 L33 17 31 17 31 19 30.7 19.7 Q30.4 20 30 20 L29.3 19.7 Q29 19.4 29 19 L29 12.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 12.8 L31 15 33 15 33 12.8 32.75 12.25 32.75 12.3 Q32.45 12 32 12 31.55 12 31.2 12.3 L31.25 12.2 Q31 12.45 31 12.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.1 15.1 L41.1 15.15 40.45 15.65 41.9 18.55 41.95 19.35 41.45 19.9 40.7 19.95 Q40.3 19.8 40.1 19.45 L38.4 16 38 16 38 19 37.7 19.7 37 20 36.3 19.7 Q36 19.4 36 19 L36 11 Q36 10.6 36.3 10.3 36.6 10 37 10 L39.05 10 Q40.25 10 41.1 10.85 42 11.75 42 13 42 14.25 41.1 15.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 11 Q43 10.6 43.3 10.3 43.6 10 44 10 L48 10 Q48.4 10 48.7 10.3 L49 11 48.7 11.7 Q48.4 12 48 12 L45 12 45 14 48 14 Q48.4 14 48.7 14.3 L49 15 48.7 15.7 Q48.4 16 48 16 L45 16 45 18 48 18 Q48.4 18 48.7 18.3 L49 19 48.7 19.7 Q48.4 20 48 20 L44 20 Q43.6 20 43.3 19.7 43 19.4 43 19 L43 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 26 Q35.3 26 37.65 28.35 40 30.7 40 34 L40 46 Q40 49.3 37.65 51.65 35.3 54 32 54 28.7 54 26.35 51.65 24 49.3 24 46 L24 34 Q24 30.7 26.35 28.35 28.7 26 32 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.5 30.5 Q27 31.95 27 34 L27 46 Q27 48.05 28.5 49.55 29.95 51 32 51 34.05 51 35.55 49.55 37 48.05 37 46 L37 34 Q37 31.95 35.55 30.5 34.05 29 32 29 29.95 29 28.5 30.5"
                />
                <path
                    fill="#FFFFFF"
                    d="M28 19 L27.7 19.7 Q27.4 20 27 20 L26.3 19.7 26 19 26 16 24 16 24 19 23.7 19.7 23 20 Q22.6 20 22.3 19.7 22 19.4 22 19 L22 11 Q22 10.6 22.3 10.3 22.6 10 23 10 23.4 10 23.7 10.3 L24 11 24 14 26 14 26 11 Q26 10.6 26.3 10.3 26.6 10 27 10 27.4 10 27.7 10.3 L28 11 28 19 M18 12 Q17.6 12 17.3 12.3 17 12.6 17 13 17 13.4 17.3 13.7 17.6 14 17.95 14 L18.05 14 Q19.2 14 20.1 14.9 21 15.8 21 17 21 18.2 20.1 19.1 19.2 20 18 20 L16 20 15.3 19.7 Q15 19.4 15 19 15 18.6 15.3 18.3 15.6 18 16 18 L18 18 Q18.4 18 18.7 17.7 L19 17 18.7 16.3 Q18.4 16 18.05 16 L17.95 16 Q16.8 16 15.9 15.1 15 14.2 15 13 15 11.8 15.9 10.9 16.8 10 18 10 L20 10 Q20.4 10 20.7 10.3 L21 11 20.7 11.7 20 12 18 12 M39.1 14 L39.45 13.9 39.7 13.7 39.75 13.7 40 13 39.7 12.25 Q39.45 12 39.05 12 L38 12 38 14 39.1 14 M29 12.8 Q29 11.65 29.85 10.8 L29.9 10.75 Q30.75 10 32 10 33.15 10 34.05 10.75 L34.1 10.8 Q35 11.65 35 12.8 L35 19 34.7 19.7 Q34.4 20 34 20 L33.3 19.7 Q33 19.4 33 19 L33 17 31 17 31 19 30.7 19.7 Q30.4 20 30 20 L29.3 19.7 Q29 19.4 29 19 L29 12.8 M31 12.8 L31 15 33 15 33 12.8 32.75 12.25 32.75 12.3 Q32.45 12 32 12 31.55 12 31.2 12.3 L31.25 12.2 Q31 12.45 31 12.8 M41.1 15.1 L41.1 15.15 40.45 15.65 41.9 18.55 41.95 19.35 41.45 19.9 40.7 19.95 Q40.3 19.8 40.1 19.45 L38.4 16 38 16 38 19 37.7 19.7 37 20 36.3 19.7 Q36 19.4 36 19 L36 11 Q36 10.6 36.3 10.3 36.6 10 37 10 L39.05 10 Q40.25 10 41.1 10.85 42 11.75 42 13 42 14.25 41.1 15.1 M43 11 Q43 10.6 43.3 10.3 43.6 10 44 10 L48 10 Q48.4 10 48.7 10.3 L49 11 48.7 11.7 Q48.4 12 48 12 L45 12 45 14 48 14 Q48.4 14 48.7 14.3 L49 15 48.7 15.7 Q48.4 16 48 16 L45 16 45 18 48 18 Q48.4 18 48.7 18.3 L49 19 48.7 19.7 Q48.4 20 48 20 L44 20 Q43.6 20 43.3 19.7 43 19.4 43 19 L43 11 M32 26 Q35.3 26 37.65 28.35 40 30.7 40 34 L40 46 Q40 49.3 37.65 51.65 35.3 54 32 54 28.7 54 26.35 51.65 24 49.3 24 46 L24 34 Q24 30.7 26.35 28.35 28.7 26 32 26 M28.5 30.5 Q27 31.95 27 34 L27 46 Q27 48.05 28.5 49.55 29.95 51 32 51 34.05 51 35.55 49.55 37 48.05 37 46 L37 34 Q37 31.95 35.55 30.5 34.05 29 32 29 29.95 29 28.5 30.5"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 19 L27.7 19.7 Q27.4 20 27 20 L26.3 19.7 26 19 26 16 24 16 24 19 23.7 19.7 23 20 Q22.6 20 22.3 19.7 22 19.4 22 19 L22 11 Q22 10.6 22.3 10.3 22.6 10 23 10 23.4 10 23.7 10.3 L24 11 24 14 26 14 26 11 Q26 10.6 26.3 10.3 26.6 10 27 10 27.4 10 27.7 10.3 L28 11 28 19 M18 12 Q17.6 12 17.3 12.3 17 12.6 17 13 17 13.4 17.3 13.7 17.6 14 17.95 14 L18.05 14 Q19.2 14 20.1 14.9 21 15.8 21 17 21 18.2 20.1 19.1 19.2 20 18 20 L16 20 15.3 19.7 Q15 19.4 15 19 15 18.6 15.3 18.3 15.6 18 16 18 L18 18 Q18.4 18 18.7 17.7 L19 17 18.7 16.3 Q18.4 16 18.05 16 L17.95 16 Q16.8 16 15.9 15.1 15 14.2 15 13 15 11.8 15.9 10.9 16.8 10 18 10 L20 10 Q20.4 10 20.7 10.3 L21 11 20.7 11.7 20 12 18 12 M29 12.8 Q29 11.65 29.85 10.8 L29.9 10.75 Q30.75 10 32 10 33.15 10 34.05 10.75 L34.1 10.8 Q35 11.65 35 12.8 L35 19 34.7 19.7 Q34.4 20 34 20 L33.3 19.7 Q33 19.4 33 19 L33 17 31 17 31 19 30.7 19.7 Q30.4 20 30 20 L29.3 19.7 Q29 19.4 29 19 L29 12.8 M41.1 15.1 L41.1 15.15 40.45 15.65 41.9 18.55 41.95 19.35 41.45 19.9 40.7 19.95 Q40.3 19.8 40.1 19.45 L38.4 16 38 16 38 19 37.7 19.7 37 20 36.3 19.7 Q36 19.4 36 19 L36 11 Q36 10.6 36.3 10.3 36.6 10 37 10 L39.05 10 Q40.25 10 41.1 10.85 42 11.75 42 13 42 14.25 41.1 15.1 M43 11 Q43 10.6 43.3 10.3 43.6 10 44 10 L48 10 Q48.4 10 48.7 10.3 L49 11 48.7 11.7 Q48.4 12 48 12 L45 12 45 14 48 14 Q48.4 14 48.7 14.3 L49 15 48.7 15.7 Q48.4 16 48 16 L45 16 45 18 48 18 Q48.4 18 48.7 18.3 L49 19 48.7 19.7 Q48.4 20 48 20 L44 20 Q43.6 20 43.3 19.7 43 19.4 43 19 L43 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 26 Q35.3 26 37.65 28.35 40 30.7 40 34 L40 46 Q40 49.3 37.65 51.65 35.3 54 32 54 28.7 54 26.35 51.65 24 49.3 24 46 L24 34 Q24 30.7 26.35 28.35 28.7 26 32 26"
                />
            </g>
        </svg>
    `}),Fn=p({name:`Playstation5ButtonCreateIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.15 26.25 Q31.45 25.35 34.45 27.05 37.35 28.85 38.25 32.25 L41.7 45.3 Q42.55 48.65 40.85 51.65 39.2 54.75 35.8 55.65 32.55 56.6 29.6 54.8 26.6 53.1 25.7 49.7 L22.3 36.6 Q21.4 33.25 23.15 30.2 24.85 27.2 28.15 26.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25.75 31.7 Q24.6 33.65 25.2 35.85 L28.6 48.95 Q29.15 51.1 31.1 52.2 L31.2 52.25 Q32.95 53.35 34.95 52.8 L35.05 52.75 Q37.15 52.2 38.2 50.25 L38.25 50.2 Q39.35 48.25 38.8 46.1 L35.35 33.05 Q34.75 30.8 32.9 29.6 31 28.6 28.95 29.15 L29 29.15 Q26.85 29.75 25.75 31.7"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.1 14.55 Q38.3 14.2 38.7 14.05 L39.45 14.1 39.95 14.7 39.9 15.45 36.9 21.45 36.35 21.95 35.55 21.9 35.05 21.35 Q34.9 20.95 35.1 20.55 L38.1 14.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18.1 15.45 Q17.9 15.05 18.05 14.7 L18.55 14.1 19.35 14.05 19.9 14.55 22.9 20.55 22.95 21.35 22.45 21.9 21.7 21.95 Q21.3 21.8 21.1 21.45 L18.1 15.45"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 12 Q28 11.6 28.3 11.3 28.6 11 29 11 L29.7 11.3 30 12 30 20 29.7 20.7 29 21 Q28.6 21 28.3 20.7 28 20.4 28 20 L28 12"
                />
                <path
                    fill="#FFFFFF"
                    d="M28.15 26.25 Q31.45 25.35 34.45 27.05 37.35 28.85 38.25 32.25 L41.7 45.3 Q42.55 48.65 40.85 51.65 39.2 54.75 35.8 55.65 32.55 56.6 29.6 54.8 26.6 53.1 25.7 49.7 L22.3 36.6 Q21.4 33.25 23.15 30.2 24.85 27.2 28.15 26.25 M25.75 31.7 Q24.6 33.65 25.2 35.85 L28.6 48.95 Q29.15 51.1 31.1 52.2 L31.2 52.25 Q32.95 53.35 34.95 52.8 L35.05 52.75 Q37.15 52.2 38.2 50.25 L38.25 50.2 Q39.35 48.25 38.8 46.1 L35.35 33.05 Q34.75 30.8 32.9 29.6 31 28.6 28.95 29.15 L29 29.15 Q26.85 29.75 25.75 31.7 M38.1 14.55 Q38.3 14.2 38.7 14.05 L39.45 14.1 39.95 14.7 39.9 15.45 36.9 21.45 36.35 21.95 35.55 21.9 35.05 21.35 Q34.9 20.95 35.1 20.55 L38.1 14.55 M18.1 15.45 Q17.9 15.05 18.05 14.7 L18.55 14.1 19.35 14.05 19.9 14.55 22.9 20.55 22.95 21.35 22.45 21.9 21.7 21.95 Q21.3 21.8 21.1 21.45 L18.1 15.45 M28 12 Q28 11.6 28.3 11.3 28.6 11 29 11 L29.7 11.3 30 12 30 20 29.7 20.7 29 21 Q28.6 21 28.3 20.7 28 20.4 28 20 L28 12"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.15 26.25 Q31.45 25.35 34.45 27.05 37.35 28.85 38.25 32.25 L41.7 45.3 Q42.55 48.65 40.85 51.65 39.2 54.75 35.8 55.65 32.55 56.6 29.6 54.8 26.6 53.1 25.7 49.7 L22.3 36.6 Q21.4 33.25 23.15 30.2 24.85 27.2 28.15 26.25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.1 14.55 Q38.3 14.2 38.7 14.05 L39.45 14.1 39.95 14.7 39.9 15.45 36.9 21.45 36.35 21.95 35.55 21.9 35.05 21.35 Q34.9 20.95 35.1 20.55 L38.1 14.55 M18.1 15.45 Q17.9 15.05 18.05 14.7 L18.55 14.1 19.35 14.05 19.9 14.55 22.9 20.55 22.95 21.35 22.45 21.9 21.7 21.95 Q21.3 21.8 21.1 21.45 L18.1 15.45 M28 12 Q28 11.6 28.3 11.3 28.6 11 29 11 L29.7 11.3 30 12 30 20 29.7 20.7 29 21 Q28.6 21 28.3 20.7 28 20.4 28 20 L28 12"
                />
            </g>
        </svg>
    `}),In=p({name:`Playstation3ButtonStartIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.1 19.2 L41.1 19.25 40.45 19.75 41.9 22.65 41.95 23.45 41.45 24 40.7 24.05 Q40.3 23.9 40.1 23.55 L38.4 20.1 38 20.1 38 23.1 37.7 23.8 37 24.1 36.3 23.8 Q36 23.5 36 23.1 L36 15.1 Q36 14.7 36.3 14.4 36.6 14.1 37 14.1 L39.05 14.1 Q40.25 14.1 41.1 14.95 42 15.85 42 17.1 42 18.35 41.1 19.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 14.1 Q48.4 14.1 48.7 14.4 L49 15.1 48.7 15.8 Q48.4 16.1 48 16.1 L47 16.1 47 23.1 46.7 23.8 46 24.1 45.3 23.8 Q45 23.5 45 23.1 L45 16.1 44 16.1 Q43.6 16.1 43.3 15.8 43 15.5 43 15.1 43 14.7 43.3 14.4 43.6 14.1 44 14.1 L48 14.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.25 30.1 L44.75 35.9 Q46.15 36.25 47.05 37.35 48 38.45 48 39.95 48 41.4 47.05 42.5 46.15 43.65 44.75 44 L21.25 49.85 18.75 49.7 Q17.45 49.2 16.75 48.2 16 47.05 16 45.8 L16 34.15 Q16 32.8 16.75 31.75 17.45 30.65 18.75 30.2 L21.25 30.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 16.9 L31 19.1 33 19.1 33 16.9 32.75 16.35 32.75 16.4 Q32.45 16.1 32 16.1 31.55 16.1 31.2 16.4 L31.25 16.3 Q31 16.55 31 16.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.1 18.1 L39.45 18 39.7 17.8 39.75 17.8 40 17.1 39.7 16.35 Q39.45 16.1 39.05 16.1 L38 16.1 38 18.1 39.1 18.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 16.1 Q17.6 16.1 17.3 16.4 17 16.7 17 17.1 17 17.5 17.3 17.8 17.6 18.1 17.95 18.1 L18.05 18.1 Q19.2 18.1 20.1 19 21 19.9 21 21.1 21 22.3 20.1 23.2 19.2 24.1 18 24.1 L16 24.1 15.3 23.8 Q15 23.5 15 23.1 15 22.7 15.3 22.4 15.6 22.1 16 22.1 L18 22.1 Q18.4 22.1 18.7 21.8 L19 21.1 18.7 20.4 Q18.4 20.1 18.05 20.1 L17.95 20.1 Q16.8 20.1 15.9 19.2 15 18.3 15 17.1 15 15.9 15.9 15 16.8 14.1 18 14.1 L20 14.1 Q20.4 14.1 20.7 14.4 L21 15.1 20.7 15.8 20 16.1 18 16.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 16.1 Q22.6 16.1 22.3 15.8 22 15.5 22 15.1 22 14.7 22.3 14.4 22.6 14.1 23 14.1 L27 14.1 Q27.4 14.1 27.7 14.4 L28 15.1 27.7 15.8 Q27.4 16.1 27 16.1 L26 16.1 26 23.1 25.7 23.8 25 24.1 24.3 23.8 Q24 23.5 24 23.1 L24 16.1 23 16.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 16.9 Q29 15.75 29.85 14.9 L29.9 14.85 Q30.75 14.1 32 14.1 33.15 14.1 34.05 14.85 L34.1 14.9 Q35 15.75 35 16.9 L35 23.1 34.7 23.8 Q34.4 24.1 34 24.1 L33.3 23.8 Q33 23.5 33 23.1 L33 21.1 31 21.1 31 23.1 30.7 23.8 Q30.4 24.1 30 24.1 L29.3 23.8 Q29 23.5 29 23.1 L29 16.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19.8 33 L19.75 33.05 Q19.45 33.1 19.3 33.35 L19.2 33.5 19 34.15 19 45.8 19.3 46.55 19.85 46.9 19.8 46.9 20.55 46.95 44.05 41.1 44.7 40.65 44.8 40.55 45 39.95 44.8 39.3 44.75 39.25 44.05 38.8 44.05 38.85 20.55 33.05 20.5 33 19.8 33"
                />
                <path
                    fill="#FFFFFF"
                    d="M41.1 19.2 L41.1 19.25 40.45 19.75 41.9 22.65 41.95 23.45 41.45 24 40.7 24.05 Q40.3 23.9 40.1 23.55 L38.4 20.1 38 20.1 38 23.1 37.7 23.8 37 24.1 36.3 23.8 Q36 23.5 36 23.1 L36 15.1 Q36 14.7 36.3 14.4 36.6 14.1 37 14.1 L39.05 14.1 Q40.25 14.1 41.1 14.95 42 15.85 42 17.1 42 18.35 41.1 19.2 M48 14.1 Q48.4 14.1 48.7 14.4 L49 15.1 48.7 15.8 Q48.4 16.1 48 16.1 L47 16.1 47 23.1 46.7 23.8 46 24.1 45.3 23.8 Q45 23.5 45 23.1 L45 16.1 44 16.1 Q43.6 16.1 43.3 15.8 43 15.5 43 15.1 43 14.7 43.3 14.4 43.6 14.1 44 14.1 L48 14.1 M21.25 30.1 L44.75 35.9 Q46.15 36.25 47.05 37.35 48 38.45 48 39.95 48 41.4 47.05 42.5 46.15 43.65 44.75 44 L21.25 49.85 18.75 49.7 Q17.45 49.2 16.75 48.2 16 47.05 16 45.8 L16 34.15 Q16 32.8 16.75 31.75 17.45 30.65 18.75 30.2 L21.25 30.1 M31 16.9 L31 19.1 33 19.1 33 16.9 32.75 16.35 32.75 16.4 Q32.45 16.1 32 16.1 31.55 16.1 31.2 16.4 L31.25 16.3 Q31 16.55 31 16.9 M39.1 18.1 L39.45 18 39.7 17.8 39.75 17.8 40 17.1 39.7 16.35 Q39.45 16.1 39.05 16.1 L38 16.1 38 18.1 39.1 18.1 M18 16.1 Q17.6 16.1 17.3 16.4 17 16.7 17 17.1 17 17.5 17.3 17.8 17.6 18.1 17.95 18.1 L18.05 18.1 Q19.2 18.1 20.1 19 21 19.9 21 21.1 21 22.3 20.1 23.2 19.2 24.1 18 24.1 L16 24.1 15.3 23.8 Q15 23.5 15 23.1 15 22.7 15.3 22.4 15.6 22.1 16 22.1 L18 22.1 Q18.4 22.1 18.7 21.8 L19 21.1 18.7 20.4 Q18.4 20.1 18.05 20.1 L17.95 20.1 Q16.8 20.1 15.9 19.2 15 18.3 15 17.1 15 15.9 15.9 15 16.8 14.1 18 14.1 L20 14.1 Q20.4 14.1 20.7 14.4 L21 15.1 20.7 15.8 20 16.1 18 16.1 M23 16.1 Q22.6 16.1 22.3 15.8 22 15.5 22 15.1 22 14.7 22.3 14.4 22.6 14.1 23 14.1 L27 14.1 Q27.4 14.1 27.7 14.4 L28 15.1 27.7 15.8 Q27.4 16.1 27 16.1 L26 16.1 26 23.1 25.7 23.8 25 24.1 24.3 23.8 Q24 23.5 24 23.1 L24 16.1 23 16.1 M29 16.9 Q29 15.75 29.85 14.9 L29.9 14.85 Q30.75 14.1 32 14.1 33.15 14.1 34.05 14.85 L34.1 14.9 Q35 15.75 35 16.9 L35 23.1 34.7 23.8 Q34.4 24.1 34 24.1 L33.3 23.8 Q33 23.5 33 23.1 L33 21.1 31 21.1 31 23.1 30.7 23.8 Q30.4 24.1 30 24.1 L29.3 23.8 Q29 23.5 29 23.1 L29 16.9 M19.8 33 L19.75 33.05 Q19.45 33.1 19.3 33.35 L19.2 33.5 19 34.15 19 45.8 19.3 46.55 19.85 46.9 19.8 46.9 20.55 46.95 44.05 41.1 44.7 40.65 44.8 40.55 45 39.95 44.8 39.3 44.75 39.25 44.05 38.8 44.05 38.85 20.55 33.05 20.5 33 19.8 33"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.1 19.2 L41.1 19.25 40.45 19.75 41.9 22.65 41.95 23.45 41.45 24 40.7 24.05 Q40.3 23.9 40.1 23.55 L38.4 20.1 38 20.1 38 23.1 37.7 23.8 37 24.1 36.3 23.8 Q36 23.5 36 23.1 L36 15.1 Q36 14.7 36.3 14.4 36.6 14.1 37 14.1 L39.05 14.1 Q40.25 14.1 41.1 14.95 42 15.85 42 17.1 42 18.35 41.1 19.2 M48 14.1 Q48.4 14.1 48.7 14.4 L49 15.1 48.7 15.8 Q48.4 16.1 48 16.1 L47 16.1 47 23.1 46.7 23.8 46 24.1 45.3 23.8 Q45 23.5 45 23.1 L45 16.1 44 16.1 Q43.6 16.1 43.3 15.8 43 15.5 43 15.1 43 14.7 43.3 14.4 43.6 14.1 44 14.1 L48 14.1 M18 16.1 Q17.6 16.1 17.3 16.4 17 16.7 17 17.1 17 17.5 17.3 17.8 17.6 18.1 17.95 18.1 L18.05 18.1 Q19.2 18.1 20.1 19 21 19.9 21 21.1 21 22.3 20.1 23.2 19.2 24.1 18 24.1 L16 24.1 15.3 23.8 Q15 23.5 15 23.1 15 22.7 15.3 22.4 15.6 22.1 16 22.1 L18 22.1 Q18.4 22.1 18.7 21.8 L19 21.1 18.7 20.4 Q18.4 20.1 18.05 20.1 L17.95 20.1 Q16.8 20.1 15.9 19.2 15 18.3 15 17.1 15 15.9 15.9 15 16.8 14.1 18 14.1 L20 14.1 Q20.4 14.1 20.7 14.4 L21 15.1 20.7 15.8 20 16.1 18 16.1 M23 16.1 Q22.6 16.1 22.3 15.8 22 15.5 22 15.1 22 14.7 22.3 14.4 22.6 14.1 23 14.1 L27 14.1 Q27.4 14.1 27.7 14.4 L28 15.1 27.7 15.8 Q27.4 16.1 27 16.1 L26 16.1 26 23.1 25.7 23.8 25 24.1 24.3 23.8 Q24 23.5 24 23.1 L24 16.1 23 16.1 M29 16.9 Q29 15.75 29.85 14.9 L29.9 14.85 Q30.75 14.1 32 14.1 33.15 14.1 34.05 14.85 L34.1 14.9 Q35 15.75 35 16.9 L35 23.1 34.7 23.8 Q34.4 24.1 34 24.1 L33.3 23.8 Q33 23.5 33 23.1 L33 21.1 31 21.1 31 23.1 30.7 23.8 Q30.4 24.1 30 24.1 L29.3 23.8 Q29 23.5 29 23.1 L29 16.9"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.25 30.1 L44.75 35.9 Q46.15 36.25 47.05 37.35 48 38.45 48 39.95 48 41.4 47.05 42.5 46.15 43.65 44.75 44 L21.25 49.85 18.75 49.7 Q17.45 49.2 16.75 48.2 16 47.05 16 45.8 L16 34.15 Q16 32.8 16.75 31.75 17.45 30.65 18.75 30.2 L21.25 30.1"
                />
            </g>
        </svg>
    `}),Ln=p({name:`Playstation4ButtonOptionsIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 29 Q29.95 29 28.5 30.5 27 31.95 27 34 L27 46 27.1 47 27.1 47.05 Q27.4 48.45 28.5 49.55 29.95 51 32 51 34.05 51 35.55 49.55 36.6 48.45 36.9 47.05 L36.9 47 37 46 37 34 Q37 31.95 35.55 30.5 34.05 29 32 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M10.85 10.8 L10.9 10.75 Q11.75 10 13 10 14.15 10 15.05 10.75 L15.1 10.8 Q16 11.65 16 12.8 L16 17.25 Q16 18.35 15.1 19.25 L15.05 19.3 Q14.15 20 13 20 11.75 20 10.9 19.3 L10.85 19.2 Q10 18.35 10 17.25 L10 12.8 Q10 11.65 10.85 10.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 12.8 L12 17.25 12.2 17.75 13 18 13.75 17.75 13.75 17.8 14 17.25 14 12.8 13.75 12.25 13.75 12.3 Q13.45 12 13 12 12.55 12 12.2 12.3 L12.25 12.2 12 12.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20.1 14 L20.45 13.9 20.7 13.7 20.75 13.7 21 13 20.7 12.25 Q20.45 12 20.05 12 L19 12 19 14 20.1 14"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 19 L18.7 19.7 Q18.4 20 18 20 L17.3 19.7 Q17 19.4 17 19 L17 11 Q17 10.6 17.3 10.3 17.6 10 18 10 L20.05 10 Q21.25 10 22.1 10.85 23 11.75 23 13 23 14.25 22.1 15.1 L22.1 15.15 21.45 15.65 21.35 15.7 20.1 16 19 16 19 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 12 L24.3 11.7 Q24 11.4 24 11 24 10.6 24.3 10.3 24.6 10 25 10 L29 10 29.7 10.3 30 11 29.7 11.7 29 12 28 12 28 19 27.7 19.7 Q27.4 20 27 20 L26.3 19.7 26 19 26 12 25 12"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 12.8 L36 17.25 36.2 17.75 37 18 37.75 17.75 37.75 17.8 38 17.25 38 12.8 37.75 12.25 37.75 12.3 Q37.45 12 37 12 36.55 12 36.2 12.3 L36.25 12.2 36 12.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34.85 10.8 L34.9 10.75 Q35.75 10 37 10 38.15 10 39.05 10.75 L39.1 10.8 Q40 11.65 40 12.8 L40 17.25 Q40 18.35 39.1 19.25 L39.05 19.3 Q38.15 20 37 20 35.75 20 34.9 19.3 L34.85 19.2 Q34 18.35 34 17.25 L34 12.8 Q34 11.65 34.85 10.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 19 L32.7 19.7 32 20 Q31.6 20 31.3 19.7 31 19.4 31 19 L31 11 Q31 10.6 31.3 10.3 31.6 10 32 10 32.4 10 32.7 10.3 L33 11 33 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 19 L46.8 19.65 46.25 20 45.6 19.9 45.1 19.45 43 15.25 43 19 42.7 19.7 42 20 41.3 19.7 Q41 19.4 41 19 L41 11 Q41 10.65 41.25 10.4 L41.8 10.05 42.45 10.1 42.9 10.55 45 14.75 45 11 Q45 10.6 45.3 10.3 45.6 10 46 10 46.4 10 46.7 10.3 L47 11 47 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M51 12 Q50.6 12 50.3 12.3 50 12.6 50 13 50 13.4 50.3 13.7 L50.95 14 51.05 14 Q52.2 14 53.1 14.9 54 15.8 54 17 54 18.2 53.1 19.1 52.2 20 51 20 L49 20 Q48.6 20 48.3 19.7 48 19.4 48 19 48 18.6 48.3 18.3 48.6 18 49 18 L51 18 Q51.4 18 51.7 17.7 L52 17 51.7 16.3 Q51.4 16 51.05 16 L50.95 16 Q49.8 16 48.9 15.1 48 14.2 48 13 48 11.8 48.9 10.9 49.8 10 51 10 L53 10 Q53.4 10 53.7 10.3 L54 11 53.7 11.7 53 12 51 12"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 26 Q35.3 26 37.65 28.35 40 30.7 40 34 L40 46 39.85 47.6 Q39.4 49.9 37.65 51.65 35.3 54 32 54 28.7 54 26.35 51.65 24.6 49.9 24.15 47.6 L24 46 24 34 Q24 30.7 26.35 28.35 28.7 26 32 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 29 Q29.95 29 28.5 30.5 27 31.95 27 34 L27 46 27.1 47 27.1 47.05 Q27.4 48.45 28.5 49.55 29.95 51 32 51 34.05 51 35.55 49.55 36.6 48.45 36.9 47.05 L36.9 47 37 46 37 34 Q37 31.95 35.55 30.5 34.05 29 32 29 M10.85 10.8 L10.9 10.75 Q11.75 10 13 10 14.15 10 15.05 10.75 L15.1 10.8 Q16 11.65 16 12.8 L16 17.25 Q16 18.35 15.1 19.25 L15.05 19.3 Q14.15 20 13 20 11.75 20 10.9 19.3 L10.85 19.2 Q10 18.35 10 17.25 L10 12.8 Q10 11.65 10.85 10.8 M12 12.8 L12 17.25 12.2 17.75 13 18 13.75 17.75 13.75 17.8 14 17.25 14 12.8 13.75 12.25 13.75 12.3 Q13.45 12 13 12 12.55 12 12.2 12.3 L12.25 12.2 12 12.8 M20.1 14 L20.45 13.9 20.7 13.7 20.75 13.7 21 13 20.7 12.25 Q20.45 12 20.05 12 L19 12 19 14 20.1 14 M19 19 L18.7 19.7 Q18.4 20 18 20 L17.3 19.7 Q17 19.4 17 19 L17 11 Q17 10.6 17.3 10.3 17.6 10 18 10 L20.05 10 Q21.25 10 22.1 10.85 23 11.75 23 13 23 14.25 22.1 15.1 L22.1 15.15 21.45 15.65 21.35 15.7 20.1 16 19 16 19 19 M25 12 L24.3 11.7 Q24 11.4 24 11 24 10.6 24.3 10.3 24.6 10 25 10 L29 10 29.7 10.3 30 11 29.7 11.7 29 12 28 12 28 19 27.7 19.7 Q27.4 20 27 20 L26.3 19.7 26 19 26 12 25 12 M36 12.8 L36 17.25 36.2 17.75 37 18 37.75 17.75 37.75 17.8 38 17.25 38 12.8 37.75 12.25 37.75 12.3 Q37.45 12 37 12 36.55 12 36.2 12.3 L36.25 12.2 36 12.8 M34.85 10.8 L34.9 10.75 Q35.75 10 37 10 38.15 10 39.05 10.75 L39.1 10.8 Q40 11.65 40 12.8 L40 17.25 Q40 18.35 39.1 19.25 L39.05 19.3 Q38.15 20 37 20 35.75 20 34.9 19.3 L34.85 19.2 Q34 18.35 34 17.25 L34 12.8 Q34 11.65 34.85 10.8 M33 19 L32.7 19.7 32 20 Q31.6 20 31.3 19.7 31 19.4 31 19 L31 11 Q31 10.6 31.3 10.3 31.6 10 32 10 32.4 10 32.7 10.3 L33 11 33 19 M47 19 L46.8 19.65 46.25 20 45.6 19.9 45.1 19.45 43 15.25 43 19 42.7 19.7 42 20 41.3 19.7 Q41 19.4 41 19 L41 11 Q41 10.65 41.25 10.4 L41.8 10.05 42.45 10.1 42.9 10.55 45 14.75 45 11 Q45 10.6 45.3 10.3 45.6 10 46 10 46.4 10 46.7 10.3 L47 11 47 19 M51 12 Q50.6 12 50.3 12.3 50 12.6 50 13 50 13.4 50.3 13.7 L50.95 14 51.05 14 Q52.2 14 53.1 14.9 54 15.8 54 17 54 18.2 53.1 19.1 52.2 20 51 20 L49 20 Q48.6 20 48.3 19.7 48 19.4 48 19 48 18.6 48.3 18.3 48.6 18 49 18 L51 18 Q51.4 18 51.7 17.7 L52 17 51.7 16.3 Q51.4 16 51.05 16 L50.95 16 Q49.8 16 48.9 15.1 48 14.2 48 13 48 11.8 48.9 10.9 49.8 10 51 10 L53 10 Q53.4 10 53.7 10.3 L54 11 53.7 11.7 53 12 51 12 M32 26 Q35.3 26 37.65 28.35 40 30.7 40 34 L40 46 39.85 47.6 Q39.4 49.9 37.65 51.65 35.3 54 32 54 28.7 54 26.35 51.65 24.6 49.9 24.15 47.6 L24 46 24 34 Q24 30.7 26.35 28.35 28.7 26 32 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M10.85 10.8 L10.9 10.75 Q11.75 10 13 10 14.15 10 15.05 10.75 L15.1 10.8 Q16 11.65 16 12.8 L16 17.25 Q16 18.35 15.1 19.25 L15.05 19.3 Q14.15 20 13 20 11.75 20 10.9 19.3 L10.85 19.2 Q10 18.35 10 17.25 L10 12.8 Q10 11.65 10.85 10.8 M19 19 L18.7 19.7 Q18.4 20 18 20 L17.3 19.7 Q17 19.4 17 19 L17 11 Q17 10.6 17.3 10.3 17.6 10 18 10 L20.05 10 Q21.25 10 22.1 10.85 23 11.75 23 13 23 14.25 22.1 15.1 L22.1 15.15 21.45 15.65 21.35 15.7 20.1 16 19 16 19 19 M25 12 L24.3 11.7 Q24 11.4 24 11 24 10.6 24.3 10.3 24.6 10 25 10 L29 10 29.7 10.3 30 11 29.7 11.7 29 12 28 12 28 19 27.7 19.7 Q27.4 20 27 20 L26.3 19.7 26 19 26 12 25 12 M34.85 10.8 L34.9 10.75 Q35.75 10 37 10 38.15 10 39.05 10.75 L39.1 10.8 Q40 11.65 40 12.8 L40 17.25 Q40 18.35 39.1 19.25 L39.05 19.3 Q38.15 20 37 20 35.75 20 34.9 19.3 L34.85 19.2 Q34 18.35 34 17.25 L34 12.8 Q34 11.65 34.85 10.8 M33 19 L32.7 19.7 32 20 Q31.6 20 31.3 19.7 31 19.4 31 19 L31 11 Q31 10.6 31.3 10.3 31.6 10 32 10 32.4 10 32.7 10.3 L33 11 33 19 M47 19 L46.8 19.65 46.25 20 45.6 19.9 45.1 19.45 43 15.25 43 19 42.7 19.7 42 20 41.3 19.7 Q41 19.4 41 19 L41 11 Q41 10.65 41.25 10.4 L41.8 10.05 42.45 10.1 42.9 10.55 45 14.75 45 11 Q45 10.6 45.3 10.3 45.6 10 46 10 46.4 10 46.7 10.3 L47 11 47 19 M51 12 Q50.6 12 50.3 12.3 50 12.6 50 13 50 13.4 50.3 13.7 L50.95 14 51.05 14 Q52.2 14 53.1 14.9 54 15.8 54 17 54 18.2 53.1 19.1 52.2 20 51 20 L49 20 Q48.6 20 48.3 19.7 48 19.4 48 19 48 18.6 48.3 18.3 48.6 18 49 18 L51 18 Q51.4 18 51.7 17.7 L52 17 51.7 16.3 Q51.4 16 51.05 16 L50.95 16 Q49.8 16 48.9 15.1 48 14.2 48 13 48 11.8 48.9 10.9 49.8 10 51 10 L53 10 Q53.4 10 53.7 10.3 L54 11 53.7 11.7 53 12 51 12"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 26 Q35.3 26 37.65 28.35 40 30.7 40 34 L40 46 39.85 47.6 Q39.4 49.9 37.65 51.65 35.3 54 32 54 28.7 54 26.35 51.65 24.6 49.9 24.15 47.6 L24 46 24 34 Q24 30.7 26.35 28.35 28.7 26 32 26"
                />
            </g>
        </svg>
    `}),Rn=p({name:`Playstation5ButtonOptionsIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.85 26.25 Q39.15 27.2 40.85 30.2 42.6 33.25 41.7 36.6 L38.3 49.7 Q37.4 53.1 34.4 54.8 31.45 56.6 28.2 55.65 24.8 54.75 23.15 51.65 21.45 48.65 22.3 45.3 L25.75 32.25 Q26.65 28.85 29.55 27.05 32.55 25.35 35.85 26.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 10 L40 10 40 12 28 12 28 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 14 L40 14 40 16 28 16 28 14"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 18 L40 18 40 20 28 20 28 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.05 29.15 Q33 28.6 31.15 29.6 29.25 30.8 28.65 33.05 L25.2 46.1 Q24.65 48.25 25.75 50.2 L25.8 50.25 Q26.85 52.2 29 52.75 L29.05 52.8 Q31.05 53.35 32.85 52.25 L32.95 52.2 Q34.85 51.1 35.4 48.95 L38.8 35.85 Q39.4 33.65 38.25 31.7 37.15 29.75 35.05 29.15"
                />
                <path
                    fill="#FFFFFF"
                    d="M35.85 26.25 Q39.15 27.2 40.85 30.2 42.6 33.25 41.7 36.6 L38.3 49.7 Q37.4 53.1 34.4 54.8 31.45 56.6 28.2 55.65 24.8 54.75 23.15 51.65 21.45 48.65 22.3 45.3 L25.75 32.25 Q26.65 28.85 29.55 27.05 32.55 25.35 35.85 26.25 M28 10 L40 10 40 12 28 12 28 10 M28 14 L40 14 40 16 28 16 28 14 M28 18 L40 18 40 20 28 20 28 18 M35.05 29.15 Q33 28.6 31.15 29.6 29.25 30.8 28.65 33.05 L25.2 46.1 Q24.65 48.25 25.75 50.2 L25.8 50.25 Q26.85 52.2 29 52.75 L29.05 52.8 Q31.05 53.35 32.85 52.25 L32.95 52.2 Q34.85 51.1 35.4 48.95 L38.8 35.85 Q39.4 33.65 38.25 31.7 37.15 29.75 35.05 29.15"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.85 26.25 Q39.15 27.2 40.85 30.2 42.6 33.25 41.7 36.6 L38.3 49.7 Q37.4 53.1 34.4 54.8 31.45 56.6 28.2 55.65 24.8 54.75 23.15 51.65 21.45 48.65 22.3 45.3 L25.75 32.25 Q26.65 28.85 29.55 27.05 32.55 25.35 35.85 26.25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 10 L40 10 40 12 28 12 28 10 M28 14 L40 14 40 16 28 16 28 14 M28 18 L40 18 40 20 28 20 28 18"
                />
            </g>
        </svg>
    `}),zn=p({name:`Playstation5ButtonMuteIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 12 L45 12 Q47.9 12 49.95 14.05 52 16.1 52 19 52 21.9 49.95 23.95 47.9 26 45 26 L19 26 Q16.1 26 14.05 23.95 12 21.9 12 19 12 16.1 14.05 14.05 16.1 12 19 12"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47.85 21.85 Q49 20.65 49 19 49 17.35 47.85 16.2 46.65 15 45 15 L19 15 Q17.35 15 16.2 16.2 15 17.35 15 19 15 20.65 16.2 21.85 17.35 23 19 23 L45 23 Q46.65 23 47.85 21.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 34.95 Q29 34.15 29.55 33.55 L29.9 33.3 Q30.35 33 30.95 33 L33.05 33 Q33.65 33 34.15 33.3 L34.45 33.55 Q35 34.15 35 34.95 L35 40.25 29 36 29 34.95"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24.4 38.85 Q24.05 38.6 24 38.2 23.9 37.75 24.15 37.45 24.4 37.1 24.8 37.05 L25.55 37.2 39.55 47.2 39.95 47.85 39.75 48.6 39.15 49 38.4 48.85 24.4 38.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 45.05 L27.25 45.7 28 46 29.25 46 33 48.7 33 50 34.85 50 36.65 51.3 36.7 51.35 37 51.55 37 52 27 52 27 50 31 50 31 48 26.95 48 26.4 47.95 Q25.95 47.8 25.55 47.45 L25.45 47.35 Q25 46.8 25 46.05 L25 43 27 44.4 27 45.05"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 40 L39 40 39 43.1 37 41.7 37 40"
                />
                <path
                    fill="#FFFFFF"
                    d="M19 12 L45 12 Q47.9 12 49.95 14.05 52 16.1 52 19 52 21.9 49.95 23.95 47.9 26 45 26 L19 26 Q16.1 26 14.05 23.95 12 21.9 12 19 12 16.1 14.05 14.05 16.1 12 19 12 M47.85 21.85 Q49 20.65 49 19 49 17.35 47.85 16.2 46.65 15 45 15 L19 15 Q17.35 15 16.2 16.2 15 17.35 15 19 15 20.65 16.2 21.85 17.35 23 19 23 L45 23 Q46.65 23 47.85 21.85 M29 34.95 Q29 34.15 29.55 33.55 L29.9 33.3 Q30.35 33 30.95 33 L33.05 33 Q33.65 33 34.15 33.3 L34.45 33.55 Q35 34.15 35 34.95 L35 40.25 29 36 29 34.95 M24.4 38.85 Q24.05 38.6 24 38.2 23.9 37.75 24.15 37.45 24.4 37.1 24.8 37.05 L25.55 37.2 39.55 47.2 39.95 47.85 39.75 48.6 39.15 49 38.4 48.85 24.4 38.85 M27 45.05 L27.25 45.7 28 46 29.25 46 33 48.7 33 50 34.85 50 36.65 51.3 36.7 51.35 37 51.55 37 52 27 52 27 50 31 50 31 48 26.95 48 26.4 47.95 Q25.95 47.8 25.55 47.45 L25.45 47.35 Q25 46.8 25 46.05 L25 43 27 44.4 27 45.05 M37 40 L39 40 39 43.1 37 41.7 37 40"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 12 L45 12 Q47.9 12 49.95 14.05 52 16.1 52 19 52 21.9 49.95 23.95 47.9 26 45 26 L19 26 Q16.1 26 14.05 23.95 12 21.9 12 19 12 16.1 14.05 14.05 16.1 12 19 12"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 34.95 Q29 34.15 29.55 33.55 L29.9 33.3 Q30.35 33 30.95 33 L33.05 33 Q33.65 33 34.15 33.3 L34.45 33.55 Q35 34.15 35 34.95 L35 40.25 29 36 29 34.95 M24.4 38.85 Q24.05 38.6 24 38.2 23.9 37.75 24.15 37.45 24.4 37.1 24.8 37.05 L25.55 37.2 39.55 47.2 39.95 47.85 39.75 48.6 39.15 49 38.4 48.85 24.4 38.85 M27 45.05 L27.25 45.7 28 46 29.25 46 33 48.7 33 50 34.85 50 36.65 51.3 36.7 51.35 37 51.55 37 52 27 52 27 50 31 50 31 48 26.95 48 26.4 47.95 Q25.95 47.8 25.55 47.45 L25.45 47.35 Q25 46.8 25 46.05 L25 43 27 44.4 27 45.05"
                />
            </g>
        </svg>
    `}),Bn=p({name:`Playstation4TouchpadGridIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 24 Q42 24.85 41.4 25.4 40.85 26 40 26 39.15 26 38.55 25.4 38 24.85 38 24 38 23.15 38.55 22.55 39.15 22 40 22 40.85 22 41.4 22.55 42 23.15 42 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 24 Q34 24.85 33.4 25.4 32.85 26 32 26 31.15 26 30.55 25.4 30 24.85 30 24 30 23.15 30.55 22.55 31.15 22 32 22 32.85 22 33.4 22.55 34 23.15 34 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 32 Q34 32.85 33.4 33.4 32.85 34 32 34 31.15 34 30.55 33.4 30 32.85 30 32 30 31.15 30.55 30.55 31.15 30 32 30 32.85 30 33.4 30.55 34 31.15 34 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 32 Q42 32.85 41.4 33.4 40.85 34 40 34 39.15 34 38.55 33.4 38 32.85 38 32 38 31.15 38.55 30.55 39.15 30 40 30 40.85 30 41.4 30.55 42 31.15 42 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M50 24 Q50 24.85 49.4 25.4 48.85 26 48 26 47.15 26 46.55 25.4 46 24.85 46 24 46 23.15 46.55 22.55 47.15 22 48 22 48.85 22 49.4 22.55 50 23.15 50 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M50 32 Q50 32.85 49.4 33.4 48.85 34 48 34 47.15 34 46.55 33.4 46 32.85 46 32 46 31.15 46.55 30.55 47.15 30 48 30 48.85 30 49.4 30.55 50 31.15 50 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19 L16 19 Q11 19 11 24 L11 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 16 L48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M50 40 Q50 40.85 49.4 41.4 48.85 42 48 42 47.15 42 46.55 41.4 46 40.85 46 40 46 39.15 46.55 38.55 47.15 38 48 38 48.85 38 49.4 38.55 50 39.15 50 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 40 Q34 40.85 33.4 41.4 32.85 42 32 42 31.15 42 30.55 41.4 30 40.85 30 40 30 39.15 30.55 38.55 31.15 38 32 38 32.85 38 33.4 38.55 34 39.15 34 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 40 Q42 40.85 41.4 41.4 40.85 42 40 42 39.15 42 38.55 41.4 38 40.85 38 40 38 39.15 38.55 38.55 39.15 38 40 38 40.85 38 41.4 38.55 42 39.15 42 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 24 Q18 24.85 17.4 25.4 16.85 26 16 26 15.15 26 14.55 25.4 14 24.85 14 24 14 23.15 14.55 22.55 15.15 22 16 22 16.85 22 17.4 22.55 18 23.15 18 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 32 Q18 32.85 17.4 33.4 16.85 34 16 34 15.15 34 14.55 33.4 14 32.85 14 32 14 31.15 14.55 30.55 15.15 30 16 30 16.85 30 17.4 30.55 18 31.15 18 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 24 Q26 24.85 25.4 25.4 24.85 26 24 26 23.15 26 22.55 25.4 22 24.85 22 24 22 23.15 22.55 22.55 23.15 22 24 22 24.85 22 25.4 22.55 26 23.15 26 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 32 Q26 32.85 25.4 33.4 24.85 34 24 34 23.15 34 22.55 33.4 22 32.85 22 32 22 31.15 22.55 30.55 23.15 30 24 30 24.85 30 25.4 30.55 26 31.15 26 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 40 Q26 40.85 25.4 41.4 24.85 42 24 42 23.15 42 22.55 41.4 22 40.85 22 40 22 39.15 22.55 38.55 23.15 38 24 38 24.85 38 25.4 38.55 26 39.15 26 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 40 Q18 40.85 17.4 41.4 16.85 42 16 42 15.15 42 14.55 41.4 14 40.85 14 40 14 39.15 14.55 38.55 15.15 38 16 38 16.85 38 17.4 38.55 18 39.15 18 40"
                />
                <path
                    fill="#FFFFFF"
                    d="M42 24 Q42 24.85 41.4 25.4 40.85 26 40 26 39.15 26 38.55 25.4 38 24.85 38 24 38 23.15 38.55 22.55 39.15 22 40 22 40.85 22 41.4 22.55 42 23.15 42 24 M34 24 Q34 24.85 33.4 25.4 32.85 26 32 26 31.15 26 30.55 25.4 30 24.85 30 24 30 23.15 30.55 22.55 31.15 22 32 22 32.85 22 33.4 22.55 34 23.15 34 24 M34 32 Q34 32.85 33.4 33.4 32.85 34 32 34 31.15 34 30.55 33.4 30 32.85 30 32 30 31.15 30.55 30.55 31.15 30 32 30 32.85 30 33.4 30.55 34 31.15 34 32 M42 32 Q42 32.85 41.4 33.4 40.85 34 40 34 39.15 34 38.55 33.4 38 32.85 38 32 38 31.15 38.55 30.55 39.15 30 40 30 40.85 30 41.4 30.55 42 31.15 42 32 M50 24 Q50 24.85 49.4 25.4 48.85 26 48 26 47.15 26 46.55 25.4 46 24.85 46 24 46 23.15 46.55 22.55 47.15 22 48 22 48.85 22 49.4 22.55 50 23.15 50 24 M50 32 Q50 32.85 49.4 33.4 48.85 34 48 34 47.15 34 46.55 33.4 46 32.85 46 32 46 31.15 46.55 30.55 47.15 30 48 30 48.85 30 49.4 30.55 50 31.15 50 32 M11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19 L16 19 Q11 19 11 24 L11 40 M16 16 L48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16 M50 40 Q50 40.85 49.4 41.4 48.85 42 48 42 47.15 42 46.55 41.4 46 40.85 46 40 46 39.15 46.55 38.55 47.15 38 48 38 48.85 38 49.4 38.55 50 39.15 50 40 M34 40 Q34 40.85 33.4 41.4 32.85 42 32 42 31.15 42 30.55 41.4 30 40.85 30 40 30 39.15 30.55 38.55 31.15 38 32 38 32.85 38 33.4 38.55 34 39.15 34 40 M42 40 Q42 40.85 41.4 41.4 40.85 42 40 42 39.15 42 38.55 41.4 38 40.85 38 40 38 39.15 38.55 38.55 39.15 38 40 38 40.85 38 41.4 38.55 42 39.15 42 40 M18 24 Q18 24.85 17.4 25.4 16.85 26 16 26 15.15 26 14.55 25.4 14 24.85 14 24 14 23.15 14.55 22.55 15.15 22 16 22 16.85 22 17.4 22.55 18 23.15 18 24 M18 32 Q18 32.85 17.4 33.4 16.85 34 16 34 15.15 34 14.55 33.4 14 32.85 14 32 14 31.15 14.55 30.55 15.15 30 16 30 16.85 30 17.4 30.55 18 31.15 18 32 M26 24 Q26 24.85 25.4 25.4 24.85 26 24 26 23.15 26 22.55 25.4 22 24.85 22 24 22 23.15 22.55 22.55 23.15 22 24 22 24.85 22 25.4 22.55 26 23.15 26 24 M26 32 Q26 32.85 25.4 33.4 24.85 34 24 34 23.15 34 22.55 33.4 22 32.85 22 32 22 31.15 22.55 30.55 23.15 30 24 30 24.85 30 25.4 30.55 26 31.15 26 32 M26 40 Q26 40.85 25.4 41.4 24.85 42 24 42 23.15 42 22.55 41.4 22 40.85 22 40 22 39.15 22.55 38.55 23.15 38 24 38 24.85 38 25.4 38.55 26 39.15 26 40 M18 40 Q18 40.85 17.4 41.4 16.85 42 16 42 15.15 42 14.55 41.4 14 40.85 14 40 14 39.15 14.55 38.55 15.15 38 16 38 16.85 38 17.4 38.55 18 39.15 18 40"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 16 L48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16"
                />
            </g>
        </svg>
    `}),Vn=p({name:`ControllerButtonL2Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.95 56 Q13.7 56 10.9 52.55 8 48.85 8 42.75 L9.1 32.75 9.5 27.9 Q9.65 24.2 9.2 19.3 L8 11.05 Q8 9.8 8.5 8.95 9.1 8 9.95 8 L48 8 Q55.6 7.9 56 16 L56 48 Q55.25 56.45 48 56 L17.95 56"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.05 11 L11.05 11 12.2 18.9 12.2 19.05 Q12.65 24.05 12.5 27.9 L12.5 28.05 12.1 33.1 11 42.85 Q11 47.7 13.25 50.7 L13.25 50.65 Q15.1 52.95 17.95 53 L48 53 48.2 53 Q50.3 53.15 51.5 52.1 52.75 50.65 53 47.75 L53 16.15 Q52.75 11.05 48.05 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.5 27.4 Q41.1 27 40.5 27 L38.95 27 38.85 27 38.3 27.3 Q38 27.6 38 28 L34 28 34.1 27 Q34.35 25.6 35.4 24.5 L35.5 24.4 Q36.9 23.05 38.85 23 L40.5 23 Q42.75 23 44.35 24.6 L44.4 24.65 45.4 26 Q46.65 29.35 44.45 31.55 L40 36 46 36 46 40 38.95 40 38.85 40 34 40 34 36 41 29.45 Q42.25 28.15 41.5 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 23 L23 23 23 36 31 36 31 40 19 40 19 23"
                />
                <path
                    fill="#FFFFFF"
                    d="M17.95 56 Q13.7 56 10.9 52.55 8 48.85 8 42.75 L9.1 32.75 9.5 27.9 Q9.65 24.2 9.2 19.3 L8 11.05 Q8 9.8 8.5 8.95 9.1 8 9.95 8 L48 8 Q55.6 7.9 56 16 L56 48 Q55.25 56.45 48 56 L17.95 56 M48.05 11 L11.05 11 12.2 18.9 12.2 19.05 Q12.65 24.05 12.5 27.9 L12.5 28.05 12.1 33.1 11 42.85 Q11 47.7 13.25 50.7 L13.25 50.65 Q15.1 52.95 17.95 53 L48 53 48.2 53 Q50.3 53.15 51.5 52.1 52.75 50.65 53 47.75 L53 16.15 Q52.75 11.05 48.05 11 M41.5 27.4 Q41.1 27 40.5 27 L38.95 27 38.85 27 38.3 27.3 Q38 27.6 38 28 L34 28 34.1 27 Q34.35 25.6 35.4 24.5 L35.5 24.4 Q36.9 23.05 38.85 23 L40.5 23 Q42.75 23 44.35 24.6 L44.4 24.65 45.4 26 Q46.65 29.35 44.45 31.55 L40 36 46 36 46 40 38.95 40 38.85 40 34 40 34 36 41 29.45 Q42.25 28.15 41.5 27.4 M19 23 L23 23 23 36 31 36 31 40 19 40 19 23"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.95 56 Q13.7 56 10.9 52.55 8 48.85 8 42.75 L9.1 32.75 9.5 27.9 Q9.65 24.2 9.2 19.3 L8 11.05 Q8 9.8 8.5 8.95 9.1 8 9.95 8 L48 8 Q55.6 7.9 56 16 L56 48 Q55.25 56.45 48 56 L17.95 56"
                />
            </g>
        </svg>
    `}),Hn=p({name:`SteamStickLPressIcon`,svgTemplate:u`
        <svg viewBox="-2 -2 68 68" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 42.75 14.05 37.9 12.95 L41.25 9.45 Q45.5 10.85 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 18.5 10.85 22.75 9.45 L26.15 12.95 Q21.25 14.05 17.4 17.1 L17.45 17.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 13.5 L24.45 6.85 Q24 6.35 24 5.65 24 4.95 24.45 4.5 24.9 4 25.6 4 L38.4 4 Q39.05 4 39.55 4.5 40 4.95 40 5.65 40 6.35 39.55 6.85 L33.15 13.5 Q32.65 14 32 14 31.3 14 30.85 13.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="12"
                    stroke-linejoin="round"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M17.45 17.1 Q12.15 21.4 12 27.4 12.1 33.45 17.4 37.65 23.45 42.5 32 42.5 40.55 42.5 46.55 37.7 L46.6 37.65 Q51.9 33.4 52 27.4 51.85 21.4 46.55 17.1 42.75 14.05 37.9 12.95 L41.25 9.45 Q45.5 10.85 48.95 13.65 56 19.4 56 27.4 L56 27.95 56 28.1 56 28.5 56 29 56 29.55 56 30.1 56 30.65 Q56 38.7 48.95 44.3 46.2 46.55 43 47.9 L43 50 Q43 52.5 39.75 54.25 36.55 56 32 56 27.5 56 24.25 54.25 21 52.5 21 50 L21 47.9 Q17.8 46.55 15 44.3 8 38.7 8 30.65 L8 30.1 8 29.55 8 29 8 28.5 8 28.1 8 27.95 8 27.4 Q8 19.4 15 13.65 18.5 10.85 22.75 9.45 L26.15 12.95 Q21.25 14.05 17.4 17.1 L17.45 17.1 M30.85 13.5 L24.45 6.85 Q24 6.35 24 5.65 24 4.95 24.45 4.5 24.9 4 25.6 4 L38.4 4 Q39.05 4 39.55 4.5 40 4.95 40 5.65 40 6.35 39.55 6.85 L33.15 13.5 Q32.65 14 32 14 31.3 14 30.85 13.5"
                />
                <path
                    fill="#000000"
                    d="M44.15 19 Q47.7 22 48 25.95 L48 26.05 Q47.7 30 44.2 32.9 L44 33.05 Q39.05 37 32 37 24.85 37 19.8 32.95 L19.7 32.9 Q16.3 30 16 26.1 L16 26.05 Q16.25 22 19.85 19 L19.95 18.9 Q23.65 16.05 28.4 15.3 L28.7 15.6 Q30 17 32 17 33.85 17.05 35.3 15.65 L35.3 15.6 35.6 15.3 Q40.5 16.05 44.2 19 L44.15 19"
                />
                <path fill="#FFFFFF" d="" />
            </g>
        </svg>
    `}),Un=p({name:`ControllerButtonR2Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12.5 52.1 Q13.7 53.15 15.85 53 L16 53 46.05 53 Q48.85 52.95 50.75 50.7 53 47.7 53 42.85 L51.95 33.1 51.5 28.05 51.5 27.9 Q51.35 24.05 51.85 19.05 L51.85 18.9 53 11 15.95 11 Q11.25 11.05 11 16.15 L11 47.75 Q11.25 50.65 12.5 52.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.5 27.4 Q40.1 27 39.5 27 L37.95 27 37.85 27 Q37.55 27.05 37.3 27.3 37 27.6 37 28 L33 28 33.1 27 Q33.35 25.6 34.4 24.5 L34.5 24.4 Q35.9 23.05 37.85 23 L39.5 23 Q41.75 23 43.35 24.6 L43.4 24.65 44.4 26 Q45.65 29.35 43.45 31.55 L39 36 45 36 45 40 37.95 40 37.85 40 33 40 33 36 40 29.45 Q41.25 28.15 40.5 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 23 L24 23 Q26.5 23 28.25 24.75 30 26.5 30 29 30 31.45 28.25 33.2 L28.2 33.25 27.45 33.9 30.5 40 26.5 40 24 35 21 35 21 40 17 40 17 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 27 L21 27 21 31 24 31 Q24.8 31 25.35 30.45 L25.45 30.35 Q26 29.8 26 29 26 28.2 25.4 27.6 24.8 27 24 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.05 56 L16 56 Q8.75 56.45 8 48 L8 16 Q8.4 7.9 16 8 L54.05 8 Q54.9 8 55.5 8.95 56 9.8 56 11.05 L54.8 19.3 Q54.35 24.2 54.5 27.9 L54.9 32.75 56 42.75 Q56 48.85 53.1 52.55 50.3 56 46.05 56"
                />
                <path
                    fill="#FFFFFF"
                    d="M12.5 52.1 Q13.7 53.15 15.85 53 L16 53 46.05 53 Q48.85 52.95 50.75 50.7 53 47.7 53 42.85 L51.95 33.1 51.5 28.05 51.5 27.9 Q51.35 24.05 51.85 19.05 L51.85 18.9 53 11 15.95 11 Q11.25 11.05 11 16.15 L11 47.75 Q11.25 50.65 12.5 52.1 M40.5 27.4 Q40.1 27 39.5 27 L37.95 27 37.85 27 Q37.55 27.05 37.3 27.3 37 27.6 37 28 L33 28 33.1 27 Q33.35 25.6 34.4 24.5 L34.5 24.4 Q35.9 23.05 37.85 23 L39.5 23 Q41.75 23 43.35 24.6 L43.4 24.65 44.4 26 Q45.65 29.35 43.45 31.55 L39 36 45 36 45 40 37.95 40 37.85 40 33 40 33 36 40 29.45 Q41.25 28.15 40.5 27.4 M17 23 L24 23 Q26.5 23 28.25 24.75 30 26.5 30 29 30 31.45 28.25 33.2 L28.2 33.25 27.45 33.9 30.5 40 26.5 40 24 35 21 35 21 40 17 40 17 23 M24 27 L21 27 21 31 24 31 Q24.8 31 25.35 30.45 L25.45 30.35 Q26 29.8 26 29 26 28.2 25.4 27.6 24.8 27 24 27 M46.05 56 L16 56 Q8.75 56.45 8 48 L8 16 Q8.4 7.9 16 8 L54.05 8 Q54.9 8 55.5 8.95 56 9.8 56 11.05 L54.8 19.3 Q54.35 24.2 54.5 27.9 L54.9 32.75 56 42.75 Q56 48.85 53.1 52.55 50.3 56 46.05 56"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.05 56 L16 56 Q8.75 56.45 8 48 L8 16 Q8.4 7.9 16 8 L54.05 8 Q54.9 8 55.5 8.95 56 9.8 56 11.05 L54.8 19.3 Q54.35 24.2 54.5 27.9 L54.9 32.75 56 42.75 Q56 48.85 53.1 52.55 50.3 56 46.05 56"
                />
            </g>
        </svg>
    `}),Wn=p({name:`SteamDpadNoneIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <path
                style="vector-effect: none"
                fill="#000000"
                stroke="#000000"
                stroke-width="6.5"
                stroke-linejoin="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                fill="#FFFFFF"
                fill-rule="evenodd"
                d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15  M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                style="vector-effect: none"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32"
            />
            <g transform="translate(32 32) scale(0.7) translate(-32 -32)">
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Gn=p({name:`SteamDpadDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <path
                style="vector-effect: none"
                fill="#000000"
                stroke="#000000"
                stroke-width="6.5"
                stroke-linejoin="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                fill="#FFFFFF"
                fill-rule="evenodd"
                d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15  M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                style="vector-effect: none"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32"
            />
            <g transform="translate(32 32) scale(0.7) translate(-32 -32)">
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Kn=p({name:`SteamDpadLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <path
                style="vector-effect: none"
                fill="#000000"
                stroke="#000000"
                stroke-width="6.5"
                stroke-linejoin="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                fill="#FFFFFF"
                fill-rule="evenodd"
                d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15  M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                style="vector-effect: none"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32"
            />
            <g transform="translate(32 32) scale(0.7) translate(-32 -32)">
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L38 26 38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),qn=p({name:`SteamDpadRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <path
                style="vector-effect: none"
                fill="#000000"
                stroke="#000000"
                stroke-width="6.5"
                stroke-linejoin="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                fill="#FFFFFF"
                fill-rule="evenodd"
                d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15  M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                style="vector-effect: none"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32"
            />
            <g transform="translate(32 32) scale(0.7) translate(-32 -32)">
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 12 Q38 11 37 11"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M37 11 L27 11 Q26 11 26 12 L26 26 12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 12 Q38 11 37 11"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Jn=p({name:`SteamDpadUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <path
                style="vector-effect: none"
                fill="#000000"
                stroke="#000000"
                stroke-width="6.5"
                stroke-linejoin="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                fill="#FFFFFF"
                fill-rule="evenodd"
                d="M46.85 17.15 Q40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15  M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32 "
            />
            <path
                style="vector-effect: none"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 20.45 9.55 27.7 8.35 L32 8 36.35 8.35 Q43.55 9.55 48.95 15 56 22.05 56 32"
            />
            <g transform="translate(32 32) scale(0.7) translate(-32 -32)">
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L12 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8 M12 26 Q11 26 11 27 L11 37 Q11 38 12 38 L26 38 26 52 Q26 53 27 53 L37 53 Q38 53 38 52 L38 38 52 38 Q53 38 53 37 L53 27 Q53 26 52 26 L12 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 8 L37 8 Q41 8 41 12 L41 23 52 23 Q56 23 56 27 L56 37 Q56 41 52 41 L41 41 41 52 Q41 56 37 56 L27 56 Q23 56 23 52 L23 41 12 41 Q8 41 8 37 L8 27 Q8 23 12 23 L23 23 23 12 Q23 8 27 8"
                />
            </g>
        </svg>
    `}),Yn=p({name:`SteamdeckButtonGuideIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.6 17.6 L46.4 17.6 Q52.34 17.6 56.54 21.8 60.8 26.06 60.8 32 60.8 37.94 56.54 42.14 52.34 46.4 46.4 46.4 L17.6 46.4 Q11.66 46.4 7.4 42.14 3.2 37.94 3.2 32 3.2 26.06 7.4 21.8 11.66 17.6 17.6 17.6"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M9.92 24.38 Q6.8 27.56 6.8 32 6.8 36.44 9.98 39.62 13.16 42.8 17.6 42.8 L46.4 42.8 Q50.84 42.8 54.02 39.62 57.2 36.44 57.2 32 57.2 27.56 54.02 24.38 50.84 21.2 46.4 21.2 L17.6 21.2 Q13.16 21.2 9.98 24.32 L9.92 24.38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47.87 35.8 L45.66 31.17 45.66 36 44.01 36 44.01 28 45.66 28 48.42 33.79 51.04 28 52.7 28 52.7 36 51.04 36 51.04 31.1 48.84 35.8 47.87 35.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.17 28.62 L16.41 29.93 15.51 29.45 14.47 29.31 13.58 29.52 Q13.23 29.72 13.23 30.14 13.23 30.62 13.78 30.9 L15.3 31.45 Q16.41 31.79 16.82 32.21 17.37 32.76 17.37 33.59 17.37 34.83 16.48 35.52 L14.2 36.14 Q12.54 36.14 11.3 35.45 L11.85 34 Q12.96 34.62 14.13 34.62 L15.23 34.35 15.58 33.73 Q15.58 33.31 15.1 33.03 L13.72 32.55 Q12.54 32.21 12.06 31.72 11.44 31.17 11.44 30.21 11.44 29.1 12.27 28.48 13.09 27.86 14.41 27.86 L16.06 28.14 17.17 28.62"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.62 34.48 L36.07 36 34.28 36 37.38 28 39.11 28 42.28 36 40.42 36 39.8 34.48 36.62 34.48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.28 31.24 L32.28 32.69 28.96 32.69 28.96 34.55 32.76 34.55 32.76 36 27.24 36 27.24 28 32.76 28 32.76 29.45 28.96 29.45 28.96 31.24 32.28 31.24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.21 29.93 L37.11 33.1 39.38 33.1 38.21 29.93"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.17 36 L21.17 29.45 18.68 29.45 18.68 28 25.38 28 25.38 29.45 22.89 29.45 22.89 36 21.17 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M17.6 17.6 L46.4 17.6 Q52.34 17.6 56.54 21.8 60.8 26.06 60.8 32 60.8 37.94 56.54 42.14 52.34 46.4 46.4 46.4 L17.6 46.4 Q11.66 46.4 7.4 42.14 3.2 37.94 3.2 32 3.2 26.06 7.4 21.8 11.66 17.6 17.6 17.6 M9.92 24.38 Q6.8 27.56 6.8 32 6.8 36.44 9.98 39.62 13.16 42.8 17.6 42.8 L46.4 42.8 Q50.84 42.8 54.02 39.62 57.2 36.44 57.2 32 57.2 27.56 54.02 24.38 50.84 21.2 46.4 21.2 L17.6 21.2 Q13.16 21.2 9.98 24.32 L9.92 24.38 M47.87 35.8 L45.66 31.17 45.66 36 44.01 36 44.01 28 45.66 28 48.42 33.79 51.04 28 52.7 28 52.7 36 51.04 36 51.04 31.1 48.84 35.8 47.87 35.8 M17.17 28.62 L16.41 29.93 15.51 29.45 14.47 29.31 13.58 29.52 Q13.23 29.72 13.23 30.14 13.23 30.62 13.78 30.9 L15.3 31.45 Q16.41 31.79 16.82 32.21 17.37 32.76 17.37 33.59 17.37 34.83 16.48 35.52 L14.2 36.14 Q12.54 36.14 11.3 35.45 L11.85 34 Q12.96 34.62 14.13 34.62 L15.23 34.35 15.58 33.73 Q15.58 33.31 15.1 33.03 L13.72 32.55 Q12.54 32.21 12.06 31.72 11.44 31.17 11.44 30.21 11.44 29.1 12.27 28.48 13.09 27.86 14.41 27.86 L16.06 28.14 17.17 28.62 M36.62 34.48 L36.07 36 34.28 36 37.38 28 39.11 28 42.28 36 40.42 36 39.8 34.48 36.62 34.48 M32.28 31.24 L32.28 32.69 28.96 32.69 28.96 34.55 32.76 34.55 32.76 36 27.24 36 27.24 28 32.76 28 32.76 29.45 28.96 29.45 28.96 31.24 32.28 31.24 M38.21 29.93 L37.11 33.1 39.38 33.1 38.21 29.93 M21.17 36 L21.17 29.45 18.68 29.45 18.68 28 25.38 28 25.38 29.45 22.89 29.45 22.89 36 21.17 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.6 17.6 L46.4 17.6 Q52.34 17.6 56.54 21.8 60.8 26.06 60.8 32 60.8 37.94 56.54 42.14 52.34 46.4 46.4 46.4 L17.6 46.4 Q11.66 46.4 7.4 42.14 3.2 37.94 3.2 32 3.2 26.06 7.4 21.8 11.66 17.6 17.6 17.6"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.5"
                    stroke-linejoin="round"
                    d="M47.87 35.8 L45.66 31.17 45.66 36 44.01 36 44.01 28 45.66 28 48.42 33.79 51.04 28 52.7 28 52.7 36 51.04 36 51.04 31.1 48.84 35.8 47.87 35.8 M17.17 28.62 L16.41 29.93 15.51 29.45 14.47 29.31 13.58 29.52 Q13.23 29.72 13.23 30.14 13.23 30.62 13.78 30.9 L15.3 31.45 Q16.41 31.79 16.82 32.21 17.37 32.76 17.37 33.59 17.37 34.83 16.48 35.52 L14.2 36.14 Q12.54 36.14 11.3 35.45 L11.85 34 Q12.96 34.62 14.13 34.62 L15.23 34.35 15.58 33.73 Q15.58 33.31 15.1 33.03 L13.72 32.55 Q12.54 32.21 12.06 31.72 11.44 31.17 11.44 30.21 11.44 29.1 12.27 28.48 13.09 27.86 14.41 27.86 L16.06 28.14 17.17 28.62 M36.62 34.48 L36.07 36 34.28 36 37.38 28 39.11 28 42.28 36 40.42 36 39.8 34.48 36.62 34.48 M32.28 31.24 L32.28 32.69 28.96 32.69 28.96 34.55 32.76 34.55 32.76 36 27.24 36 27.24 28 32.76 28 32.76 29.45 28.96 29.45 28.96 31.24 32.28 31.24 M38.21 29.93 L37.11 33.1 39.38 33.1 38.21 29.93 M21.17 36 L21.17 29.45 18.68 29.45 18.68 28 25.38 28 25.38 29.45 22.89 29.45 22.89 36 21.17 36"
                />
            </g>
        </svg>
    `}),Xn=p({name:`IndexLtIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 48.95 49 52.5 41.95 56 32 56 22.05 56 15.05 52.5 8 48.95 8 44 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 44"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 25 L43 28 39 28 39 38 36 38 36 28 32 28 32 25 43 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 44 Q11.35 47.25 16.4 49.85 22.85 53 32 53 41.15 53 47.7 49.85 L47.65 49.85 Q52.7 47.25 53 44 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 35 L31 35 31 38 22 38 22 25 25 25 25 35"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 44 Q56 48.95 49 52.5 41.95 56 32 56 22.05 56 15.05 52.5 8 48.95 8 44 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 44 M43 25 L43 28 39 28 39 38 36 38 36 28 32 28 32 25 43 25 M11 16 L11 44 Q11.35 47.25 16.4 49.85 22.85 53 32 53 41.15 53 47.7 49.85 L47.65 49.85 Q52.7 47.25 53 44 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M25 35 L31 35 31 38 22 38 22 25 25 25 25 35"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 48.95 49 52.5 41.95 56 32 56 22.05 56 15.05 52.5 8 48.95 8 44 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 44"
                />
            </g>
        </svg>
    `}),Zn=p({name:`IndexRtIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 48.95 49 52.5 41.95 56 32 56 22.05 56 15.05 52.5 8 48.95 8 44 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 44"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 25 L44 28 40 28 40 38 37 38 37 28 33 28 33 25 44 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 44 Q11.35 47.25 16.4 49.85 22.85 53 32 53 41.15 53 47.7 49.85 L47.65 49.85 Q52.7 47.25 53 44 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 44"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 35 L23 35 23 38 20 38 20 25 26 25 Q28.05 25 29.5 26.45 31 27.95 31 30 31 32.05 29.5 33.5 L31 38 28 38 27 35 27 34.9 26 35"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 32 L26.05 32 Q26.85 32 27.4 31.4 28 30.85 28 30 28 29.15 27.4 28.55 26.85 28 26 28 L23 28 23 32"
                />
                <path
                    fill="#FFFFFF"
                    d="M56 44 Q56 48.95 49 52.5 41.95 56 32 56 22.05 56 15.05 52.5 8 48.95 8 44 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 44 M44 25 L44 28 40 28 40 38 37 38 37 28 33 28 33 25 44 25 M11 44 Q11.35 47.25 16.4 49.85 22.85 53 32 53 41.15 53 47.7 49.85 L47.65 49.85 Q52.7 47.25 53 44 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 44 M26 35 L23 35 23 38 20 38 20 25 26 25 Q28.05 25 29.5 26.45 31 27.95 31 30 31 32.05 29.5 33.5 L31 38 28 38 27 35 27 34.9 26 35 M23 32 L26.05 32 Q26.85 32 27.4 31.4 28 30.85 28 30 28 29.15 27.4 28.55 26.85 28 26 28 L23 28 23 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 44 Q56 48.95 49 52.5 41.95 56 32 56 22.05 56 15.05 52.5 8 48.95 8 44 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 44"
                />
            </g>
        </svg>
    `}),Qn=p({name:`XboxLbIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 39 L33 39 33 26 40 26 Q41.6 26 42.8 27.2 44 28.4 44 30 44 31.45 43.1 32.5 44 33.6 44 35 44 36.65 42.8 37.8 41.6 39 40 39"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 32 Q8 25.4 12.7 20.7 17.4 16 24 16 L48 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 31 Q40.45 31 40.7 30.7 L41 30 40.7 29.3 Q40.45 29 40 29 L36 29 36 31 40 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 19 L24 19 Q18.65 19 14.8 22.85 11 26.65 11 32 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 36 Q40.45 36 40.7 35.7 L41 35 40.7 34.3 Q40.45 34 40 34 L36 34 36 36 40 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 36 L30 36 30 39 21 39 21 26 24 26 24 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 39 L33 39 33 26 40 26 Q41.6 26 42.8 27.2 44 28.4 44 30 44 31.45 43.1 32.5 44 33.6 44 35 44 36.65 42.8 37.8 41.6 39 40 39 M48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 32 Q8 25.4 12.7 20.7 17.4 16 24 16 L48 16 M40 31 Q40.45 31 40.7 30.7 L41 30 40.7 29.3 Q40.45 29 40 29 L36 29 36 31 40 31 M48 19 L24 19 Q18.65 19 14.8 22.85 11 26.65 11 32 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19 M40 36 Q40.45 36 40.7 35.7 L41 35 40.7 34.3 Q40.45 34 40 34 L36 34 36 36 40 36 M24 36 L30 36 30 39 21 39 21 26 24 26 24 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 16 Q56 16 56 24 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 32 Q8 25.4 12.7 20.7 17.4 16 24 16 L48 16"
                />
            </g>
        </svg>
    `}),$n=p({name:`XboxLtIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.7 54 Q8 53.85 8 46 L8 18 Q8 10 16 10 L48 10 Q56 10 56 18 L56 31.05 Q55.65 40.3 48.95 47 42.15 53.8 32.65 54 L15.7 54"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 46 Q11 51 16 51 L32 51 Q40.7 51 46.85 44.85 52.65 39.05 53 31.05 L53 18 Q53 13 48 13 L16 13 Q11 13 11 18 L11 46"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 36 L37 23 32 23 32 19 46 19 46 23 41 23 41 36 37 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 19 L22 19 22 32 30 32 30 36 18 36 18 19"
                />
                <path
                    fill="#FFFFFF"
                    d="M15.7 54 Q8 53.85 8 46 L8 18 Q8 10 16 10 L48 10 Q56 10 56 18 L56 31.05 Q55.65 40.3 48.95 47 42.15 53.8 32.65 54 L15.7 54 M11 46 Q11 51 16 51 L32 51 Q40.7 51 46.85 44.85 52.65 39.05 53 31.05 L53 18 Q53 13 48 13 L16 13 Q11 13 11 18 L11 46 M37 36 L37 23 32 23 32 19 46 19 46 23 41 23 41 36 37 36 M18 19 L22 19 22 32 30 32 30 36 18 36 18 19"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M15.7 54 Q8 53.85 8 46 L8 18 Q8 10 16 10 L48 10 Q56 10 56 18 L56 31.05 Q55.65 40.3 48.95 47 42.15 53.8 32.65 54 L15.7 54"
                />
            </g>
        </svg>
    `}),er=p({name:`XboxRbIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 39 L33 39 33 26 40 26 Q41.6 26 42.8 27.2 44 28.4 44 30 44 31.45 43.1 32.5 44 33.6 44 35 44 36.65 42.8 37.8 41.6 39 40 39"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 31 Q40.45 31 40.7 30.7 L41 30 40.7 29.3 Q40.45 29 40 29 L36 29 36 31 40 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 36 Q40.45 36 40.7 35.7 L41 35 40.7 34.3 Q40.45 34 40 34 L36 34 36 36 40 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 19 Q11 19 11 24 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L16 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 33 L25.05 33 Q25.85 33 26.4 32.4 27 31.85 27 31 27 30.15 26.4 29.55 25.85 29 25 29 L22 29 22 33"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 36 L22 36 22 39 19 39 19 26 25 26 Q27.05 26 28.5 27.45 30 28.95 30 31 30 33.05 28.5 34.5 L30 39 27 39 26 36 26 35.9 25 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 39 L33 39 33 26 40 26 Q41.6 26 42.8 27.2 44 28.4 44 30 44 31.45 43.1 32.5 44 33.6 44 35 44 36.65 42.8 37.8 41.6 39 40 39 M40 31 Q40.45 31 40.7 30.7 L41 30 40.7 29.3 Q40.45 29 40 29 L36 29 36 31 40 31 M16 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16 M40 36 Q40.45 36 40.7 35.7 L41 35 40.7 34.3 Q40.45 34 40 34 L36 34 36 36 40 36 M16 19 Q11 19 11 24 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 32 Q53 26.65 49.2 22.85 45.35 19 40 19 L16 19 M22 33 L25.05 33 Q25.85 33 26.4 32.4 27 31.85 27 31 27 30.15 26.4 29.55 25.85 29 25 29 L22 29 22 33 M25 36 L22 36 22 39 19 39 19 26 25 26 Q27.05 26 28.5 27.45 30 28.95 30 31 30 33.05 28.5 34.5 L30 39 27 39 26 36 26 35.9 25 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 16 L40 16 Q46.6 16 51.3 20.7 56 25.4 56 32 L56 40 Q56 48 48 48 L16 48 Q8 48 8 40 L8 24 Q8 16 16 16"
                />
            </g>
        </svg>
    `}),tr=p({name:`XboxRtIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 36 L38 23 33 23 33 19 47 19 47 23 42 23 42 36 38 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.3 54 L31.35 54 Q21.85 53.8 15.05 47 8.35 40.3 8 31.05 L8 18 Q8 10 16 10 L48 10 Q56 10 56 18 L56 46 Q56 53.85 48.3 54"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 19 L25 19 Q27.5 19 29.25 20.75 31 22.5 31 25 31 27.45 29.25 29.2 L29.2 29.25 28.45 29.9 31.5 36 27.5 36 25 31 22 31 22 36 18 36 18 19"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 23 L22 23 22 27 25 27 Q25.8 27 26.35 26.45 L26.45 26.35 Q27 25.8 27 25 27 24.2 26.4 23.6 25.8 23 25 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 46 L53 18 Q53 13 48 13 L16 13 Q11 13 11 18 L11 31.05 Q11.35 39.05 17.15 44.85 23.3 51 32 51 L48 51 Q53 51 53 46"
                />
                <path
                    fill="#FFFFFF"
                    d="M38 36 L38 23 33 23 33 19 47 19 47 23 42 23 42 36 38 36 M48.3 54 L31.35 54 Q21.85 53.8 15.05 47 8.35 40.3 8 31.05 L8 18 Q8 10 16 10 L48 10 Q56 10 56 18 L56 46 Q56 53.85 48.3 54 M18 19 L25 19 Q27.5 19 29.25 20.75 31 22.5 31 25 31 27.45 29.25 29.2 L29.2 29.25 28.45 29.9 31.5 36 27.5 36 25 31 22 31 22 36 18 36 18 19 M25 23 L22 23 22 27 25 27 Q25.8 27 26.35 26.45 L26.45 26.35 Q27 25.8 27 25 27 24.2 26.4 23.6 25.8 23 25 23 M53 46 L53 18 Q53 13 48 13 L16 13 Q11 13 11 18 L11 31.05 Q11.35 39.05 17.15 44.85 23.3 51 32 51 L48 51 Q53 51 53 46"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.3 54 L31.35 54 Q21.85 53.8 15.05 47 8.35 40.3 8 31.05 L8 18 Q8 10 16 10 L48 10 Q56 10 56 18 L56 46 Q56 53.85 48.3 54"
                />
            </g>
        </svg>
    `}),nr=p({name:`XboxButtonViewIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.15 17.15 Q11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 35 L20 22 21 21 36 21 37 22 37 27 34 27 34 23.95 23 23.95 23 33 26 33 26 36 21 36 20 35"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 43 L28 30 29 29 44 29 45 30 45 43 44 44 29 44 28 43"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 32 L31 32 31 41 42 41 42 32"
                />
                <path
                    fill="#FFFFFF"
                    d="M17.15 17.15 Q11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M20 35 L20 22 21 21 36 21 37 22 37 27 34 27 34 23.95 23 23.95 23 33 26 33 26 36 21 36 20 35 M28 43 L28 30 29 29 44 29 45 30 45 43 44 44 29 44 28 43 M42 32 L31 32 31 41 42 41 42 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),rr=p({name:`XboxGuideIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.5 42.3 Q46.75 41.05 45.95 38.55 45.15 36.1 42.85 32.15 40.5 28.2 38.05 25.15 L37.05 23.85 38.1 22.8 Q40.15 21 41.7 20 L43.1 19.35 44.3 19 45.3 19.8 46.7 21.5 Q48.9 24.55 49.7 28.5 L50 31.85 49.8 35.25 Q49.35 37.6 48.45 39.5 L47.55 41.25 46.55 42.7 46.35 42.85 46.5 42.35 46.5 42.3"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.45 18.4 L27.85 17.3 25.35 16.6 23.7 16.5 22.95 16.4 24.35 15.7 Q26.3 14.75 28.55 14.25 L32.05 14 35.5 14.25 Q36.95 14.55 38.5 15.15 40 15.7 40.95 16.35 L41.3 16.55 40.5 16.5 Q37.8 16.35 33.55 18.4 L31.95 19.1 30.45 18.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.2 49.95 Q25.95 49.5 22.2 47.1 L20.25 45.55 Q19.75 45 19.75 44.15 19.75 42.55 21.45 39.8 23.15 37.1 26.2 33.85 27.9 32 29.9 30.25 L32.1 28.55 35.7 31.65 40.25 36.5 Q42.7 39.45 43.75 41.75 44.75 44.05 44.2 45.15 43.8 45.95 41.6 47.25 39.45 48.6 37.5 49.2 L33.9 49.9 30.2 49.95"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 32 Q11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 41.9 Q15.75 39.95 15.05 37.9 14.35 35.85 14.1 33.15 L14 31.4 14.35 28.75 Q14.7 26.4 15.95 24 17.15 21.5 18.75 19.85 19.4 19.15 19.7 19.05 L20.85 19.25 Q22.65 19.9 25.8 22.7 L27.1 23.85 26.4 24.75 Q23.9 27.75 21.65 31.5 19.35 35.35 18.35 37.95 17.85 39.4 17.65 40.7 17.4 42 17.7 42.6 L17.7 42.9 17 41.9"
                />
                <path
                    fill="#FFFFFF"
                    d="M46.5 42.3 Q46.75 41.05 45.95 38.55 45.15 36.1 42.85 32.15 40.5 28.2 38.05 25.15 L37.05 23.85 38.1 22.8 Q40.15 21 41.7 20 L43.1 19.35 44.3 19 45.3 19.8 46.7 21.5 Q48.9 24.55 49.7 28.5 L50 31.85 49.8 35.25 Q49.35 37.6 48.45 39.5 L47.55 41.25 46.55 42.7 46.35 42.85 46.5 42.35 46.5 42.3 M30.45 18.4 L27.85 17.3 25.35 16.6 23.7 16.5 22.95 16.4 24.35 15.7 Q26.3 14.75 28.55 14.25 L32.05 14 35.5 14.25 Q36.95 14.55 38.5 15.15 40 15.7 40.95 16.35 L41.3 16.55 40.5 16.5 Q37.8 16.35 33.55 18.4 L31.95 19.1 30.45 18.4 M30.2 49.95 Q25.95 49.5 22.2 47.1 L20.25 45.55 Q19.75 45 19.75 44.15 19.75 42.55 21.45 39.8 23.15 37.1 26.2 33.85 27.9 32 29.9 30.25 L32.1 28.55 35.7 31.65 40.25 36.5 Q42.7 39.45 43.75 41.75 44.75 44.05 44.2 45.15 43.8 45.95 41.6 47.25 39.45 48.6 37.5 49.2 L33.9 49.9 30.2 49.95 M11 32 Q11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 11 23.3 11 32 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M17 41.9 Q15.75 39.95 15.05 37.9 14.35 35.85 14.1 33.15 L14 31.4 14.35 28.75 Q14.7 26.4 15.95 24 17.15 21.5 18.75 19.85 19.4 19.15 19.7 19.05 L20.85 19.25 Q22.65 19.9 25.8 22.7 L27.1 23.85 26.4 24.75 Q23.9 27.75 21.65 31.5 19.35 35.35 18.35 37.95 17.85 39.4 17.65 40.7 17.4 42 17.7 42.6 L17.7 42.9 17 41.9"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),ir=p({name:`XboxButtonMenuIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17.15 17.15 Q11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 30 L43 30 43 34 21 34 21 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 38 L43 38 43 42 21 42 21 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 22 L43 22 43 26 21 26 21 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M17.15 17.15 Q11 23.3 11 32 11 40.75 17.15 46.85 23.3 53 32 53 40.75 53 46.85 46.85 53 40.75 53 32 53 23.3 46.85 17.15 40.75 11 32 11 23.3 11 17.15 17.15 M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32 M21 30 L43 30 43 34 21 34 21 30 M21 38 L43 38 43 42 21 42 21 38 M21 22 L43 22 43 26 21 26 21 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 32 Q56 42 48.95 48.95 42 56 32 56 22.05 56 15 48.95 8 42 8 32 8 22.05 15 15 22.05 8 32 8 42 8 48.95 15 56 22.05 56 32"
                />
            </g>
        </svg>
    `}),ar=p({name:`XboxButtonShareIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 31 L43 31 43 39 42 40 22 40 21 39 21 31 24 31 24 37 40 37 40 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 30 L27 30 27 29 32 24 37 29 37 30 34 30 34 34 30 34 30 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 31 L43 31 43 39 42 40 22 40 21 39 21 31 24 31 24 37 40 37 40 31 M14.85 22.85 Q11 26.65 11 32 11 37.35 14.85 41.2 18.65 45 24 45 L40 45 Q45.35 45 49.2 41.2 53 37.35 53 32 53 26.65 49.2 22.85 47.2 20.85 44.85 19.9 42.6 19 40 19 L24 19 Q21.4 19 19.2 19.9 L19.15 19.9 Q16.8 20.85 14.85 22.85 M30 30 L27 30 27 29 32 24 37 29 37 30 34 30 34 34 30 34 30 30 M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 16 L40 16 Q43.2 16 45.95 17.1 48.85 18.25 51.3 20.7 56 25.4 56 32 56 38.6 51.3 43.3 46.6 48 40 48 L24 48 Q17.4 48 12.7 43.3 8 38.6 8 32 8 25.4 12.7 20.7 15.15 18.25 18.05 17.1 20.8 16 24 16"
                />
            </g>
        </svg>
    `}),Q;(function(e){e.MetaQuest=`meta-quest`,e.NintendoGamecube=`nintendo-gamecube`,e.NintendoSwitch=`nintendo-switch`,e.NintendoSwitch2=`nintendo-switch-2`,e.NintendoWii=`nintendo-wii`,e.NintendoWiiU=`nintendo-wii-u`,e.PlayStation=`playstation`,e.SteamController=`steam-controller`,e.SteamDeck=`steam-deck`,e.SteamFrame=`steam-frame`,e.ValveIndex=`valve-index`,e.Xbox=`xbox`})(Q||={});var or={[Q.MetaQuest]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[Vt],[C.L2]:[Ht],[C.L3]:[O],[C.R1]:[Ut],[C.R2]:[Wt],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.Logo]:[Gt,Kt],[C.Start]:[qt]},[Q.NintendoGamecube]:{[C.FaceAccept]:[ft],[C.FaceCancel]:[pt],[C.FaceAlt1]:[Jt],[C.FaceAlt2]:[Yt],[C.L2]:[Xt],[C.R1]:[Zt],[C.R2]:[Qt],[C.LeftStickX]:[H,U,W],[C.LeftStickY]:[G,K,q],[C.RightStickX]:[$t,en,tn],[C.RightStickY]:[nn,rn,an],[C.DPad]:[mt],[C.DPadDown]:[ht],[C.DPadLeft]:[gt],[C.DPadRight]:[_t],[C.DPadUp]:[vt],[C.Start]:[on]},[Q.NintendoSwitch]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[yt],[C.L2]:[ln],[C.L3]:[O],[C.R1]:[bt],[C.R2]:[un],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[xt],[C.DPadDown]:[St],[C.DPadLeft]:[Ct],[C.DPadRight]:[wt],[C.DPadUp]:[Tt],[C.Select]:[J],[C.Start]:[Y],[C.Home]:[X]},[Q.NintendoSwitch2]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[yt],[C.L2]:[sn],[C.L3]:[O],[C.R1]:[bt],[C.R2]:[cn],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[xt],[C.DPadDown]:[St],[C.DPadLeft]:[Ct],[C.DPadRight]:[wt],[C.DPadUp]:[Tt],[C.Select]:[J],[C.Start]:[Y],[C.Home]:[X]},[Q.NintendoWii]:{[C.FaceAccept]:[w],[C.FaceCancel]:[dn],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[fn],[C.L2]:[pn],[C.R1]:[mn],[C.R2]:[hn],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[mt],[C.DPadDown]:[ht],[C.DPadLeft]:[gt],[C.DPadRight]:[_t],[C.DPadUp]:[vt],[C.Select]:[J],[C.Start]:[Y],[C.Home]:[X]},[Q.NintendoWiiU]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[gn],[C.L2]:[_n],[C.R1]:[vn],[C.R2]:[yn],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[mt],[C.DPadDown]:[ht],[C.DPadLeft]:[gt],[C.DPadRight]:[_t],[C.DPadUp]:[vt],[C.Select]:[J],[C.Start]:[Y],[C.Home]:[X]},[Q.PlayStation]:{[C.FaceAccept]:[bn],[C.FaceCancel]:[xn],[C.FaceAlt1]:[Sn],[C.FaceAlt2]:[Cn],[C.L1]:[wn],[C.L2]:[Tn],[C.L3]:[O],[C.R1]:[En],[C.R2]:[Dn],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[On],[C.DPadDown]:[kn],[C.DPadLeft]:[An],[C.DPadRight]:[jn],[C.DPadUp]:[Mn],[C.Select]:[Nn,Pn,Fn],[C.Start]:[In,Ln,Rn],[C.Mute]:[zn],[C.TouchPad]:[Bn]},[Q.SteamController]:{[C.FaceAccept]:[ft],[C.FaceCancel]:[pt],[C.FaceAlt1]:[Et],[C.FaceAlt2]:[Dt],[C.L1]:[Ot],[C.L2]:[Vn],[C.L3]:[Hn],[C.R1]:[kt],[C.R2]:[Un],[C.LeftStickX]:[H,U,W],[C.LeftStickY]:[G,K,q],[C.DPad]:[Wn],[C.DPadDown]:[Gn],[C.DPadLeft]:[Kn],[C.DPadRight]:[qn],[C.DPadUp]:[Jn],[C.Select]:[At,jt],[C.Start]:[Mt,Nt]},[Q.SteamDeck]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[Ot],[C.L2]:[Pt],[C.L3]:[O],[C.R1]:[kt],[C.R2]:[Ft],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[It],[C.DPadDown]:[Lt],[C.DPadLeft]:[Rt],[C.DPadRight]:[zt],[C.DPadUp]:[Bt],[C.Select]:[At],[C.Logo]:[Yn],[C.Start]:[Mt]},[Q.SteamFrame]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.FaceAlt1]:[E],[C.FaceAlt2]:[D],[C.L1]:[Ot],[C.L2]:[Pt],[C.L3]:[O],[C.R1]:[kt],[C.R2]:[Ft],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[It],[C.DPadDown]:[Lt],[C.DPadLeft]:[Rt],[C.DPadRight]:[zt],[C.DPadUp]:[Bt],[C.Select]:[At],[C.Start]:[Mt]},[Q.ValveIndex]:{[C.FaceAccept]:[w],[C.FaceCancel]:[T],[C.L2]:[Xn],[C.L3]:[O],[C.R2]:[Zn],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V]},[Q.Xbox]:{[C.FaceAccept]:[ft],[C.FaceCancel]:[pt],[C.FaceAlt1]:[Et],[C.FaceAlt2]:[Dt],[C.L1]:[Qn],[C.L2]:[$n],[C.L3]:[O],[C.R1]:[er],[C.R2]:[tr],[C.R3]:[k],[C.LeftStickX]:[A,j,M],[C.LeftStickY]:[N,P,F],[C.RightStickX]:[I,L,R],[C.RightStickY]:[z,B,V],[C.DPad]:[It],[C.DPadDown]:[Lt],[C.DPadLeft]:[Rt],[C.DPadRight]:[zt],[C.DPadUp]:[Bt],[C.Select]:[nr,jt],[C.Logo]:[rr],[C.Start]:[ir,Nt],[C.Share]:[ar]}},sr={[Q.MetaQuest]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.NintendoGamecube]:{[C.LeftStickX]:{[Z.Flat]:H,[Z.Negative]:U,[Z.Positive]:W},[C.LeftStickY]:{[Z.Flat]:G,[Z.Negative]:K,[Z.Positive]:q},[C.RightStickX]:{[Z.Flat]:$t,[Z.Negative]:en,[Z.Positive]:tn},[C.RightStickY]:{[Z.Flat]:nn,[Z.Negative]:rn,[Z.Positive]:an}},[Q.NintendoSwitch]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.NintendoSwitch2]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.NintendoWii]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.NintendoWiiU]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.PlayStation]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.SteamController]:{[C.LeftStickX]:{[Z.Flat]:H,[Z.Negative]:U,[Z.Positive]:W},[C.LeftStickY]:{[Z.Flat]:G,[Z.Negative]:K,[Z.Positive]:q}},[Q.SteamDeck]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.SteamFrame]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.ValveIndex]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}},[Q.Xbox]:{[C.LeftStickX]:{[Z.Flat]:A,[Z.Negative]:j,[Z.Positive]:M},[C.LeftStickY]:{[Z.Flat]:N,[Z.Negative]:P,[Z.Positive]:F},[C.RightStickX]:{[Z.Flat]:I,[Z.Negative]:L,[Z.Positive]:R},[C.RightStickY]:{[Z.Flat]:z,[Z.Negative]:B,[Z.Positive]:V}}},cr={[S.Microsoft]:x.XboxWireless,[S.Nintendo]:x.SwitchPro,[S.Sony]:x.PlaystationDualSense,[S.Valve]:x.SteamDeck},lr={[x.SwitchPro]:{iconSet:Q.NintendoSwitch},[x.PlaystationDualShock]:{iconSet:Q.PlayStation,inputIcons:{[C.Select]:[Nn],[C.Start]:[In]}},[x.PlaystationDualShock4]:{iconSet:Q.PlayStation,inputIcons:{[C.Select]:[Pn],[C.Start]:[Ln]}},[x.PlaystationDualSense]:{iconSet:Q.PlayStation,inputIcons:{[C.Select]:[Fn],[C.Start]:[Rn]}},[x.SteamDeck]:{iconSet:Q.SteamDeck},[x.Xbox360]:{iconSet:Q.Xbox,inputIcons:{[C.Select]:[jt],[C.Start]:[Nt]}},[x.XboxWireless]:{iconSet:Q.Xbox,inputIcons:{[C.Select]:[nr],[C.Start]:[ir]}}};function ur({gamepadModel:e,gamepadBrand:t}){return l.isEnumValue(e,x)?e:l.isEnumValue(t,S)?cr[t]:x.XboxWireless}function dr({gamepadModel:e,gamepadBrand:t,input:n}){let r=ur({gamepadModel:e,gamepadBrand:t});return lr[r].inputIcons?.[n]||or[lr[r].iconSet][n]||[]}function fr({gamepadModel:e,gamepadBrand:t,input:n,direction:r}){return sr[lr[ur({gamepadModel:e,gamepadBrand:t})].iconSet][n]?.[r]}var pr=p({name:`KeyboardAIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 27 L29.2 34 34.8 34 32 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 42 L36.4 38 27.6 38 26 42 22 42 30 22 34 22 42 42 38 42"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M32 27 L29.2 34 34.8 34 32 27 M38 42 L36.4 38 27.6 38 26 42 22 42 30 22 34 22 42 42 38 42"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),mr=p({name:`KeyboardBIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 22 Q36.45 22 38.2 23.7 L38.25 23.75 Q40 25.5 40 28 40 30.3 38.45 32 40 33.65 40 36 40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L25 42 24 41 24 23 25 22 34 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 26 L28 30 34.15 30 Q34.8 29.95 35.35 29.45 L35.45 29.35 Q36 28.8 36 28 36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 38 L34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36 36 35.15 35.45 34.6 L35.4 34.6 Q34.85 34.05 34.15 34 L28 34 28 38"
                />
                <path
                    fill="#FFFFFF"
                    d="M34 22 Q36.45 22 38.2 23.7 L38.25 23.75 Q40 25.5 40 28 40 30.3 38.45 32 40 33.65 40 36 40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L25 42 24 41 24 23 25 22 34 22 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M28 26 L28 30 34.15 30 Q34.8 29.95 35.35 29.45 L35.45 29.35 Q36 28.8 36 28 36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M28 38 L34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36 36 35.15 35.45 34.6 L35.4 34.6 Q34.85 34.05 34.15 34 L28 34 28 38"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),hr=p({name:`KeyboardCIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 30 Q24 26.7 26.35 24.35 28.7 22 32 22 35.3 22 37.65 24.35 38.95 25.65 39.55 27.2 L35.8 28.7 34.85 27.2 Q33.65 26 32 26 30.35 26 29.2 27.2 28 28.35 28 30 L28 34.1 Q28.05 35.7 29.2 36.85 30.35 38 32 38 33.65 38 34.85 36.85 L35.8 35.35 39.55 36.8 Q38.95 38.35 37.65 39.65 L36 40.95 Q34.2 42 32 42 29.8 42 28 40.95 L26.35 39.65 Q24.05 37.35 24 34.2 L24 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M24 30 Q24 26.7 26.35 24.35 28.7 22 32 22 35.3 22 37.65 24.35 38.95 25.65 39.55 27.2 L35.8 28.7 34.85 27.2 Q33.65 26 32 26 30.35 26 29.2 27.2 28 28.35 28 30 L28 34.1 Q28.05 35.7 29.2 36.85 30.35 38 32 38 33.65 38 34.85 36.85 L35.8 35.35 39.55 36.8 Q38.95 38.35 37.65 39.65 L36 40.95 Q34.2 42 32 42 29.8 42 28 40.95 L26.35 39.65 Q24.05 37.35 24 34.2 L24 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),gr=p({name:`KeyboardDIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 22 L30.25 22 Q34.25 22.1 37.1 24.95 L38.05 26 Q40 28.55 40 32 40 35.4 38.05 38 L37.1 39.1 Q34.25 41.9 30.25 42 L24 42 24 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 26 L28 38 30.15 38 Q32.5 37.95 34.25 36.25 36 34.45 36 32 36 29.55 34.25 27.8 32.5 26.05 30.15 26 L28 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M24 22 L30.25 22 Q34.25 22.1 37.1 24.95 L38.05 26 Q40 28.55 40 32 40 35.4 38.05 38 L37.1 39.1 Q34.25 41.9 30.25 42 L24 42 24 22 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M28 26 L28 38 30.15 38 Q32.5 37.95 34.25 36.25 36 34.45 36 32 36 29.55 34.25 27.8 32.5 26.05 30.15 26 L28 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),_r=p({name:`KeyboardEIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 22 L40 22 40 26 28 26 28 30 40 30 40 34 28 34 28 38 40 38 40 42 24 42 24 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M24 22 L40 22 40 26 28 26 28 30 40 30 40 34 28 34 28 38 40 38 40 42 24 42 24 22 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),vr=p({name:`KeyboardFIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 22 L40 22 40 26 28 26 28 30 40 30 40 34 28 34 28 42 24 42 24 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M24 22 L40 22 40 26 28 26 28 30 40 30 40 34 28 34 28 42 24 42 24 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),yr=p({name:`KeyboardGIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.25 24.8 L39.7 25.3 36.85 28.15 36.4 27.65 Q34.75 26 32.5 26 30.25 26 28.65 27.65 27 29.25 27 31.5 L27 32.65 27.2 34 Q27.55 35.3 28.65 36.4 30.25 38 32.5 38 34.75 38 36.4 36.4 L37.45 35 31 35 31 31 41 31 42 32 42 32.85 41.8 34.85 41.75 35 Q41.1 37.3 39.25 39.25 36.45 42 32.5 42 28.55 42 25.8 39.25 23.85 37.3 23.3 34.95 L23 32.85 23 31.5 Q23 27.55 25.8 24.8 28.55 22 32.5 22 36.45 22 39.25 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M39.25 24.8 L39.7 25.3 36.85 28.15 36.4 27.65 Q34.75 26 32.5 26 30.25 26 28.65 27.65 27 29.25 27 31.5 L27 32.65 27.2 34 Q27.55 35.3 28.65 36.4 30.25 38 32.5 38 34.75 38 36.4 36.4 L37.45 35 31 35 31 31 41 31 42 32 42 32.85 41.8 34.85 41.75 35 Q41.1 37.3 39.25 39.25 36.45 42 32.5 42 28.55 42 25.8 39.25 23.85 37.3 23.3 34.95 L23 32.85 23 31.5 Q23 27.55 25.8 24.8 28.55 22 32.5 22 36.45 22 39.25 24.8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),br=p({name:`KeyboardHIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 22 L28 22 28 30 36 30 36 22 40 22 40 42 36 42 36 34 28 34 28 42 24 42 24 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M24 22 L28 22 28 30 36 30 36 22 40 22 40 42 36 42 36 34 28 34 28 42 24 42 24 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),xr=p({name:`KeyboardIIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 22 L34 22 34 42 30 42 30 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M30 22 L34 22 34 42 30 42 30 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Sr=p({name:`KeyboardJIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 34.2 Q36.95 37.35 34.65 39.65 L33 40.95 Q31.3 41.95 29.25 42 L27 42 27 38 29 38 Q30.65 38 31.85 36.85 32.95 35.7 33 34.1 L33 22 37 22 37 34.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M37 34.2 Q36.95 37.35 34.65 39.65 L33 40.95 Q31.3 41.95 29.25 42 L27 42 27 38 29 38 Q30.65 38 31.85 36.85 32.95 35.7 33 34.1 L33 22 37 22 37 34.2 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Cr=p({name:`KeyboardKIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 34 L28 42 24 42 24 22 28 22 28 30 31 30 37 22 40 22 40 25 34.75 32 40 39 40 42 37 42 31 34 28 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M28 34 L28 42 24 42 24 22 28 22 28 30 31 30 37 22 40 22 40 25 34.75 32 40 39 40 42 37 42 31 34 28 34 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),wr=p({name:`KeyboardLIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 42 L24 22 28 22 28 38 40 38 40 42 24 42"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M24 42 L24 22 28 22 28 38 40 38 40 42 24 42 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Tr=p({name:`KeyboardMIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 42 L22 22 26 22 32 34 38 22 42 22 42 42 38 42 38 32 33 42 31 42 26 32 26 42 22 42"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M22 42 L22 22 26 22 32 34 38 22 42 22 42 42 38 42 38 32 33 42 31 42 26 32 26 42 22 42 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Er=p({name:`KeyboardNIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 42 L24 42 24 22 28 22 36 34 36 22 40 22 40 42 36 42 28 30 28 42"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M28 42 L24 42 24 22 28 22 36 34 36 22 40 22 40 42 36 42 28 30 28 42 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Dr=p({name:`KeyboardOIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34.55 27.4 Q33.45 26.1 32 26 30.5 26.1 29.4 27.45 28 29.35 28 32 28 34.65 29.4 36.6 30.5 37.9 32 38 33.45 37.9 34.55 36.6 36 34.65 36 32 36 29.35 34.55 27.45 L34.55 27.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 32 Q40 36.15 37.65 39.1 35.3 42 32 42 28.65 42 26.3 39.1 24 36.15 24 32 24 27.85 26.3 24.9 28.65 22 32 22 35.3 22 37.65 24.9 40 27.85 40 32"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M34.55 27.4 Q33.45 26.1 32 26 30.5 26.1 29.4 27.45 28 29.35 28 32 28 34.65 29.4 36.6 30.5 37.9 32 38 33.45 37.9 34.55 36.6 36 34.65 36 32 36 29.35 34.55 27.45 L34.55 27.4 M40 32 Q40 36.15 37.65 39.1 35.3 42 32 42 28.65 42 26.3 39.1 24 36.15 24 32 24 27.85 26.3 24.9 28.65 22 32 22 35.3 22 37.65 24.9 40 27.85 40 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Or=p({name:`KeyboardPIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 22 L34.2 22 Q35.75 22.05 37 22.8 L38.2 23.7 38.25 23.75 Q40 25.5 40 28 L40 30 39.6 32.3 38.25 34.2 38.2 34.25 38.1 34.35 38.1 34.4 37 35.2 Q35.75 35.95 34.2 36 L34 36 28 36 28 42 24 42 24 23 25 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 26 L28 32 34.05 32 34.9 31.8 35.35 31.45 35.45 31.35 36 30.4 36 28 Q36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M25 22 L34.2 22 Q35.75 22.05 37 22.8 L38.2 23.7 38.25 23.75 Q40 25.5 40 28 L40 30 39.6 32.3 38.25 34.2 38.2 34.25 38.1 34.35 38.1 34.4 37 35.2 Q35.75 35.95 34.2 36 L34 36 28 36 28 42 24 42 24 23 25 22 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M28 26 L28 32 34.05 32 34.9 31.8 35.35 31.45 35.45 31.35 36 30.4 36 28 Q36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),kr=p({name:`KeyboardQIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 30 L28 34.1 Q28.05 35.7 29.2 36.85 30.35 38 32 38 L32.9 37.9 32 37 32 34 35 34 35.9 34.9 36 34.1 36 30 Q36 28.35 34.85 27.2 33.65 26 32 26 30.35 26 29.2 27.2 28 28.35 28 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 30 Q24 26.7 26.35 24.35 28.7 22 32 22 35.3 22 37.65 24.35 40 26.7 40 30 L40 34.2 Q39.95 36.25 39 38 L40 39 40 42 37 42 36 41 Q34.2 42 32 42 29.8 42 28 40.95 L26.35 39.65 Q24.05 37.35 24 34.2 L24 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M28 30 L28 34.1 Q28.05 35.7 29.2 36.85 30.35 38 32 38 L32.9 37.9 32 37 32 34 35 34 35.9 34.9 36 34.1 36 30 Q36 28.35 34.85 27.2 33.65 26 32 26 30.35 26 29.2 27.2 28 28.35 28 30 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M24 30 Q24 26.7 26.35 24.35 28.7 22 32 22 35.3 22 37.65 24.35 40 26.7 40 30 L40 34.2 Q39.95 36.25 39 38 L40 39 40 42 37 42 36 41 Q34.2 42 32 42 29.8 42 28 40.95 L26.35 39.65 Q24.05 37.35 24 34.2 L24 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ar=p({name:`KeyboardRIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 22 L34.2 22 Q35.75 22.05 37 22.8 L38.2 23.7 38.25 23.75 Q40 25.5 40 28 L40 30 Q40 32.45 38.25 34.2 L38.2 34.25 38.1 34.35 40 42 36 42 34.5 36 34 36 28 36 28 42 24 42 24 23 25 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 26 L28 32 34 32 Q34.8 32 35.35 31.45 L35.45 31.35 Q36 30.8 36 30 L36 28 Q36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M25 22 L34.2 22 Q35.75 22.05 37 22.8 L38.2 23.7 38.25 23.75 Q40 25.5 40 28 L40 30 Q40 32.45 38.25 34.2 L38.2 34.25 38.1 34.35 40 42 36 42 34.5 36 34 36 28 36 28 42 24 42 24 23 25 22 M28 26 L28 32 34 32 Q34.8 32 35.35 31.45 L35.45 31.35 Q36 30.8 36 30 L36 28 Q36 27.15 35.45 26.6 L35.4 26.6 Q34.8 26 34 26 L28 26 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),jr=p({name:`KeyboardSIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 30 Q36.5 30 38.25 31.75 40 33.5 40 36 40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L29.85 42 Q27.5 41.95 25.8 40.25 L25.75 40.2 Q24.75 39.2 24.35 38 L24.2 37.55 28 36 Q28 36.8 28.55 37.35 L28.65 37.45 Q29.2 38 29.95 38 L34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36 36 35.2 35.4 34.6 34.8 34 34 34 L30 34 Q27.5 34 25.75 32.25 24 30.5 24 28 24 25.55 25.75 23.8 L25.8 23.75 Q27.55 22 30 22 L34.15 22 Q36.5 22.05 38.2 23.75 L38.25 23.8 Q39.25 24.8 39.7 26 L39.85 26.5 36 28 Q36 27.2 35.45 26.65 L35.35 26.55 Q34.8 26 34.05 26 L30 26 Q29.2 26 28.65 26.55 L28.55 26.65 Q28 27.2 28 28 28 28.8 28.6 29.4 29.2 30 30 30 L34 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M34 30 Q36.5 30 38.25 31.75 40 33.5 40 36 40 38.45 38.25 40.2 L38.2 40.25 Q36.45 42 34 42 L29.85 42 Q27.5 41.95 25.8 40.25 L25.75 40.2 Q24.75 39.2 24.35 38 L24.2 37.55 28 36 Q28 36.8 28.55 37.35 L28.65 37.45 Q29.2 38 29.95 38 L34 38 Q34.8 38 35.35 37.45 L35.45 37.35 Q36 36.8 36 36 36 35.2 35.4 34.6 34.8 34 34 34 L30 34 Q27.5 34 25.75 32.25 24 30.5 24 28 24 25.55 25.75 23.8 L25.8 23.75 Q27.55 22 30 22 L34.15 22 Q36.5 22.05 38.2 23.75 L38.25 23.8 Q39.25 24.8 39.7 26 L39.85 26.5 36 28 Q36 27.2 35.45 26.65 L35.35 26.55 Q34.8 26 34.05 26 L30 26 Q29.2 26 28.65 26.55 L28.55 26.65 Q28 27.2 28 28 28 28.8 28.6 29.4 29.2 30 30 30 L34 30 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Mr=p({name:`KeyboardTIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 22 L40 26 34 26 34 42 30 42 30 26 24 26 24 22 40 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M40 22 L40 26 34 26 34 42 30 42 30 26 24 26 24 22 40 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Nr=p({name:`KeyboardUIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 22 L40 34.2 Q39.95 37.35 37.65 39.65 L36 40.95 Q34.2 42 32 42 29.8 42 28 40.95 L26.35 39.65 Q24.05 37.35 24 34.2 L24 22 28 22 28 34.1 Q28.05 35.7 29.2 36.85 30.35 38 32 38 33.65 38 34.85 36.85 35.95 35.7 36 34.1 L36 22 40 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M40 22 L40 34.2 Q39.95 37.35 37.65 39.65 L36 40.95 Q34.2 42 32 42 29.8 42 28 40.95 L26.35 39.65 Q24.05 37.35 24 34.2 L24 22 28 22 28 34.1 Q28.05 35.7 29.2 36.85 30.35 38 32 38 33.65 38 34.85 36.85 35.95 35.7 36 34.1 L36 22 40 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Pr=p({name:`KeyboardVIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 22 L42 22 34 42 30 42 22 22 26 22 32 37 38 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56"
                />
                <path
                    fill="#FFFFFF"
                    d="M38 22 L42 22 34 42 30 42 22 22 26 22 32 37 38 22 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56"
                />
            </g>
        </svg>
    `}),Fr=p({name:`KeyboardWIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 22 L33 22 36 31 39 22 43 22 43 24 37 42 35 42 32 33 29 42 27 42 21 24 21 22 25 22 28 31 31 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M31 22 L33 22 36 31 39 22 43 22 43 24 37 42 35 42 32 33 29 42 27 42 21 24 21 22 25 22 28 31 31 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ir=p({name:`KeyboardXIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 35 32 41 39 41 40 38.75 42 37.65 42 32 35.5 26.4 42 25.25 42 23 40 23 39 29 32 23 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 35 32 41 39 41 40 38.75 42 37.65 42 32 35.5 26.4 42 25.25 42 23 40 23 39 29 32 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Lr=p({name:`KeyboardYIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 34 32.9 34 42 30 42 30 32.9 23 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M23 25 L23 24 25.25 22 26.4 22 32 28.55 37.65 22 38.75 22 41 24 41 25 34 32.9 34 42 30 42 30 32.9 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Rr=p({name:`KeyboardZIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24 22 L40 22 40 26 30 38 40 38 40 42 24 42 24 38 34 26 24 26 24 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M24 22 L40 22 40 26 30 38 40 38 40 42 24 42 24 38 34 26 24 26 24 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),zr=p({name:`Keyboard0Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.95 25.55 Q39 27.65 39 30.5 L39 33.5 Q39 36.35 36.95 38.4 L36.9 38.45 Q34.85 40.5 32 40.5 29.15 40.5 27.05 38.45 25 36.4 25 33.5 L25 30.5 Q25 27.65 27 25.55 L27.05 25.5 Q29.15 23.5 32 23.5 34.9 23.5 36.95 25.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 27.5 Q30.8 27.5 29.9 28.35 L29.85 28.4 Q29 29.3 29 30.5 L29 33.5 Q29 34.7 29.9 35.6 30.75 36.5 32 36.5 33.2 36.5 34.05 35.6 L34.1 35.55 Q35 34.7 35 33.5 L35 30.5 Q35 29.25 34.1 28.4 33.2 27.5 32 27.5"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M36.95 25.55 Q39 27.65 39 30.5 L39 33.5 Q39 36.35 36.95 38.4 L36.9 38.45 Q34.85 40.5 32 40.5 29.15 40.5 27.05 38.45 25 36.4 25 33.5 L25 30.5 Q25 27.65 27 25.55 L27.05 25.5 Q29.15 23.5 32 23.5 34.9 23.5 36.95 25.55 M32 27.5 Q30.8 27.5 29.9 28.35 L29.85 28.4 Q29 29.3 29 30.5 L29 33.5 Q29 34.7 29.9 35.6 30.75 36.5 32 36.5 33.2 36.5 34.05 35.6 L34.1 35.55 Q35 34.7 35 33.5 L35 30.5 Q35 29.25 34.1 28.4 33.2 27.5 32 27.5 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Br=p({name:`Keyboard1Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35 24 L35 41 31 41 31 33.95 31 33.85 31 28.95 28 28.95 28 27 31 24 35 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M35 24 L35 41 31 41 31 33.95 31 33.85 31 28.95 28 28.95 28 27 31 24 35 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Vr=p({name:`Keyboard2Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.5 28.4 Q33.1 28 32.5 28 L30.95 28 30.85 28 Q30.55 28.05 30.3 28.3 30 28.6 30 29 L26 29 26.1 28 Q26.35 26.6 27.4 25.5 L27.5 25.4 Q28.9 24.05 30.85 24 L32.5 24 Q34.75 24 36.35 25.6 L36.4 25.65 37.4 27 Q38.65 30.35 36.45 32.55 L32 37 38 37 38 41 30.95 41 30.85 41 26 41 26 37 33 30.45 Q34.25 29.15 33.5 28.4"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M33.5 28.4 Q33.1 28 32.5 28 L30.95 28 30.85 28 Q30.55 28.05 30.3 28.3 30 28.6 30 29 L26 29 26.1 28 Q26.35 26.6 27.4 25.5 L27.5 25.4 Q28.9 24.05 30.85 24 L32.5 24 Q34.75 24 36.35 25.6 L36.4 25.65 37.4 27 Q38.65 30.35 36.45 32.55 L32 37 38 37 38 41 30.95 41 30.85 41 26 41 26 37 33 30.45 Q34.25 29.15 33.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Hr=p({name:`Keyboard3Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 35.75 Q38.05 37.95 36.05 39.6 L36.1 39.5 Q34.4 41 32 41 29.6 41 27.9 39.55 26.05 38.05 26 36 L30.1 36 30.45 36.45 30.45 36.5 Q31.1 37 32 37 32.9 37 33.5 36.5 L33.55 36.45 34 35.75 33.6 35 Q33.2 34.65 32.7 34.55 L32.15 34.5 30 34.5 30 30.5 32.15 30.5 Q33 30.5 33.6 30 L34 29.25 Q33.95 28.85 33.55 28.55 L33.5 28.5 Q32.9 28 32 28 31.1 28 30.45 28.5 L30.45 28.55 30.1 29 26 29 Q26.05 26.95 27.9 25.45 29.6 24 32 24 34.4 24 36.1 25.5 L36.05 25.4 Q38.05 27.05 38 29.25 38.05 31.1 36.75 32.5 38.05 33.9 38 35.75"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M38 35.75 Q38.05 37.95 36.05 39.6 L36.1 39.5 Q34.4 41 32 41 29.6 41 27.9 39.55 26.05 38.05 26 36 L30.1 36 30.45 36.45 30.45 36.5 Q31.1 37 32 37 32.9 37 33.5 36.5 L33.55 36.45 34 35.75 33.6 35 Q33.2 34.65 32.7 34.55 L32.15 34.5 30 34.5 30 30.5 32.15 30.5 Q33 30.5 33.6 30 L34 29.25 Q33.95 28.85 33.55 28.55 L33.5 28.5 Q32.9 28 32 28 31.1 28 30.45 28.5 L30.45 28.55 30.1 29 26 29 Q26.05 26.95 27.9 25.45 29.6 24 32 24 34.4 24 36.1 25.5 L36.05 25.4 Q38.05 27.05 38 29.25 38.05 31.1 36.75 32.5 38.05 33.9 38 35.75"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ur=p({name:`Keyboard4Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 24 L38 41 34 41 34 34 27.95 34 Q27.15 34 26.55 33.4 26 32.85 26 32.05 L26 24 30 24 30 30 34 30 34 24 38 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M38 24 L38 41 34 41 34 34 27.95 34 Q27.15 34 26.55 33.4 26 32.85 26 32.05 L26 24 30 24 30 30 34 30 34 24 38 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Wr=p({name:`Keyboard5Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34.5 36.6 L34.6 36.5 Q35 36.1 35 35.5 35 34.9 34.55 34.45 34.1 34 33.5 34 L26 34 26 24 39 24 39 28 30 28 30 30 33.5 30 Q35.8 30 37.4 31.6 39 33.2 39 35.5 L39 36 Q38.8 37.95 37.4 39.35 L37.35 39.4 Q35.75 41 33.5 41 L30.85 41 Q28.9 40.95 27.5 39.6 L27.4 39.5 Q26.35 38.4 26.1 37 L26 36 30 36 Q30 36.4 30.3 36.7 30.6 37 30.95 37 L33.5 37 Q34.1 37 34.5 36.6"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M34.5 36.6 L34.6 36.5 Q35 36.1 35 35.5 35 34.9 34.55 34.45 34.1 34 33.5 34 L26 34 26 24 39 24 39 28 30 28 30 30 33.5 30 Q35.8 30 37.4 31.6 39 33.2 39 35.5 L39 36 Q38.8 37.95 37.4 39.35 L37.35 39.4 Q35.75 41 33.5 41 L30.85 41 Q28.9 40.95 27.5 39.6 L27.4 39.5 Q26.35 38.4 26.1 37 L26 36 30 36 Q30 36.4 30.3 36.7 30.6 37 30.95 37 L33.5 37 Q34.1 37 34.5 36.6 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Gr=p({name:`Keyboard6Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 33 L32 33 31.35 33.1 30.6 33.55 30.55 33.6 30.25 34 Q30 34.45 30 35 30 35.8 30.6 36.4 31.2 37 32 37 L33 37 Q33.8 37 34.35 36.45 L34.45 36.35 Q35 35.8 35 35 35 34.2 34.4 33.6 33.8 33 33 33"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37.25 30.75 Q39 32.5 39 35 39 37.45 37.25 39.2 L37.2 39.25 Q35.45 41 33 41 L32 41 Q29.5 41 27.75 39.25 26 37.5 26 35 L26.1 34 26.15 33.65 30 24 35 24 33 29 Q35.5 29 37.25 30.75"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M33 33 L32 33 31.35 33.1 30.6 33.55 30.55 33.6 30.25 34 Q30 34.45 30 35 30 35.8 30.6 36.4 31.2 37 32 37 L33 37 Q33.8 37 34.35 36.45 L34.45 36.35 Q35 35.8 35 35 35 34.2 34.4 33.6 33.8 33 33 33 M37.25 30.75 Q39 32.5 39 35 39 37.45 37.25 39.2 L37.2 39.25 Q35.45 41 33 41 L32 41 Q29.5 41 27.75 39.25 26 37.5 26 35 L26.1 34 26.15 33.65 30 24 35 24 33 29 Q35.5 29 37.25 30.75 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Kr=p({name:`Keyboard7Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 41 L28 41 33 28 25 28 25 24 38 24 38 28 33 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M33 41 L28 41 33 28 25 28 25 24 38 24 38 28 33 41 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),qr=p({name:`Keyboard8Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.5 36.6 L33.6 36.5 Q34 36.1 34 35.5 34 34.9 33.55 34.45 33.1 34 32.55 34 L30.5 34 Q29.9 34 29.45 34.45 29 34.9 29 35.5 29 36.1 29.4 36.5 L29.5 36.6 Q29.9 37 30.5 37 L32.5 37 Q33.1 37 33.5 36.6"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 30 L33 30 33.7 29.7 34 29 33.7 28.3 Q33.4 28 33.05 28 L29.95 28 Q29.6 28 29.3 28.3 29 28.6 29 29 29 29.4 29.3 29.7 L30 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32.5 41 L30.5 41 Q28.25 41 26.65 39.4 L26.6 39.35 Q25.2 37.95 25 36 L25 35.5 Q25 33.6 26.1 32.2 25 30.85 25 29 25 26.95 26.4 25.5 L26.5 25.4 Q27.45 24.5 28.65 24.2 L29.95 24 33.05 24 Q35.05 24 36.5 25.4 L36.6 25.5 Q38 26.95 38 29 38 30.85 36.9 32.2 38 33.6 38 35.5 L38 36 Q37.8 37.95 36.4 39.35 L36.35 39.4 Q34.75 41 32.5 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M33.5 36.6 L33.6 36.5 Q34 36.1 34 35.5 34 34.9 33.55 34.45 33.1 34 32.55 34 L30.5 34 Q29.9 34 29.45 34.45 29 34.9 29 35.5 29 36.1 29.4 36.5 L29.5 36.6 Q29.9 37 30.5 37 L32.5 37 Q33.1 37 33.5 36.6 M30 30 L33 30 33.7 29.7 34 29 33.7 28.3 Q33.4 28 33.05 28 L29.95 28 Q29.6 28 29.3 28.3 29 28.6 29 29 29 29.4 29.3 29.7 L30 30 M32.5 41 L30.5 41 Q28.25 41 26.65 39.4 L26.6 39.35 Q25.2 37.95 25 36 L25 35.5 Q25 33.6 26.1 32.2 25 30.85 25 29 25 26.95 26.4 25.5 L26.5 25.4 Q27.45 24.5 28.65 24.2 L29.95 24 33.05 24 Q35.05 24 36.5 25.4 L36.6 25.5 Q38 26.95 38 29 38 30.85 36.9 32.2 38 33.6 38 35.5 L38 36 Q37.8 37.95 36.4 39.35 L36.35 39.4 Q34.75 41 32.5 41 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Jr=p({name:`Keyboard9Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 32 L32 32 32.65 31.9 33.4 31.45 33.45 31.4 33.75 31 34 30 Q34 29.2 33.4 28.6 32.8 28 32 28 L31 28 Q30.2 28 29.65 28.55 L29.55 28.65 Q29 29.2 29 30 29 30.8 29.6 31.4 30.2 32 31 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26.75 34.25 Q25 32.5 25 30 25 27.55 26.75 25.8 L26.8 25.75 Q28.55 24 31 24 L32 24 Q34.5 24 36.25 25.75 38 27.5 38 30 L37.9 31 37.85 31.35 34 41 29 41 31 36 Q28.5 36 26.75 34.25"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M31 32 L32 32 32.65 31.9 33.4 31.45 33.45 31.4 33.75 31 34 30 Q34 29.2 33.4 28.6 32.8 28 32 28 L31 28 Q30.2 28 29.65 28.55 L29.55 28.65 Q29 29.2 29 30 29 30.8 29.6 31.4 30.2 32 31 32 M26.75 34.25 Q25 32.5 25 30 25 27.55 26.75 25.8 L26.8 25.75 Q28.55 24 31 24 L32 24 Q34.5 24 36.25 25.75 38 27.5 38 30 L37.9 31 37.85 31.35 34 41 29 41 31 36 Q28.5 36 26.75 34.25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Yr=p({name:`KeyboardArrowUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 22 L40 30 40 32 36 32 36 42 28 42 28 32 24 32 24 30 32 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 M56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 M32 22 L40 30 40 32 36 32 36 42 28 42 28 32 24 32 24 30 32 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16"
                />
            </g>
        </svg>
    `}),Xr=p({name:`KeyboardArrowDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 42 L24 34 24 32 28 32 28 22 36 22 36 32 40 32 40 34 32 42"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 M8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 M32 42 L24 34 24 32 28 32 28 22 36 22 36 32 40 32 40 34 32 42"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48"
                />
            </g>
        </svg>
    `}),Zr=p({name:`KeyboardArrowLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 32 L30 24 32 24 32 28 42 28 42 36 32 36 32 40 30 40 22 32"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M22 32 L30 24 32 24 32 28 42 28 42 36 32 36 32 40 30 40 22 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Qr=p({name:`KeyboardArrowRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 32 L34 40 32 40 32 36 22 36 22 28 32 28 32 24 34 24 42 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
                <path
                    fill="#FFFFFF"
                    d="M42 32 L34 40 32 40 32 36 22 36 22 28 32 28 32 24 34 24 42 32 M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
            </g>
        </svg>
    `}),$r=p({name:`KeyboardSpaceIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 41 L38 41 38 37 42 37 42 44 41 45 23 45 22 44 22 37 26 37 26 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M26 41 L38 41 38 37 42 37 42 44 41 45 23 45 22 44 22 37 26 37 26 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),ei=p({name:`KeyboardReturnIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 11 L38.95 11 36 11 Q31 11 31 16 L31 31 16 31 Q11 31 11 36 L11 38.95 11 40 11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L40 11"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 40 8 38.95 8 36 Q8 28 16 28 L28 28 28 16 Q28 8 36 8 L38.95 8 40 8 48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29 41 L35 35 37 35 37 39 43 39 43 29 47 29 47 40.1 Q46.95 41.3 46.1 42.1 45.3 42.95 44.1 43 L37 43 37 47 35 47 29 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 11 L38.95 11 36 11 Q31 11 31 16 L31 31 16 31 Q11 31 11 36 L11 38.95 11 40 11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L40 11 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 40 8 38.95 8 36 Q8 28 16 28 L28 28 28 16 Q28 8 36 8 L38.95 8 40 8 48 8 M29 41 L35 35 37 35 37 39 43 39 43 29 47 29 47 40.1 Q46.95 41.3 46.1 42.1 45.3 42.95 44.1 43 L37 43 37 47 35 47 29 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 40 8 38.95 8 36 Q8 28 16 28 L28 28 28 16 Q28 8 36 8 L38.95 8 40 8 48 8"
                />
            </g>
        </svg>
    `}),ti=p({name:`KeyboardNumpadEnterIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 36 L27.8 36.65 27.25 37 26.6 36.9 Q26.25 36.75 26.1 36.45 L24 32.25 24 36 23.7 36.7 23 37 Q22.6 37 22.3 36.7 22 36.4 22 36 L22 28 Q22 27.65 22.25 27.4 L22.8 27.05 23.45 27.1 23.9 27.55 26 31.75 26 28 Q26 27.6 26.3 27.3 26.6 27 27 27 27.4 27 27.7 27.3 L28 28 28 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 29 L29.3 28.7 Q29 28.4 29 28 29 27.6 29.3 27.3 29.6 27 30 27 L34 27 Q34.4 27 34.7 27.3 L35 28 34.7 28.7 Q34.4 29 34 29 L33 29 33 36 32.7 36.7 32 37 Q31.6 37 31.3 36.7 31 36.4 31 36 L31 29 30 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 31 Q20.4 31 20.7 31.3 L21 32 20.7 32.7 20 33 17 33 17 35 20 35 Q20.4 35 20.7 35.3 L21 36 20.7 36.7 20 37 16 37 15.3 36.7 Q15 36.4 15 36 L15 28 Q15 27.6 15.3 27.3 15.6 27 16 27 L20 27 Q20.4 27 20.7 27.3 L21 28 20.7 28.7 20 29 17 29 17 31 20 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 28 Q36 27.6 36.3 27.3 36.6 27 37 27 L41 27 Q41.4 27 41.7 27.3 L42 28 41.7 28.7 41 29 38 29 38 31 41 31 Q41.4 31 41.7 31.3 L42 32 41.7 32.7 41 33 38 33 38 35 41 35 Q41.4 35 41.7 35.3 L42 36 41.7 36.7 41 37 37 37 36.3 36.7 Q36 36.4 36 36 L36 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.1 32.1 L48.1 32.15 47.45 32.65 48.9 35.55 Q49.1 35.95 48.95 36.35 L48.45 36.9 47.7 36.95 Q47.3 36.8 47.1 36.45 L45.4 33 45 33 45 36 44.7 36.7 44 37 Q43.6 37 43.3 36.7 43 36.4 43 36 L43 28 Q43 27.6 43.3 27.3 43.6 27 44 27 L46.05 27 Q47.25 27 48.1 27.85 49 28.75 49 30 49 31.25 48.1 32.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.1 31 L46.45 30.9 46.7 30.7 46.75 30.7 47 30 46.7 29.25 Q46.45 29 46.05 29 L45 29 45 31 46.1 31"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 M28 36 L27.8 36.65 27.25 37 26.6 36.9 Q26.25 36.75 26.1 36.45 L24 32.25 24 36 23.7 36.7 23 37 Q22.6 37 22.3 36.7 22 36.4 22 36 L22 28 Q22 27.65 22.25 27.4 L22.8 27.05 23.45 27.1 23.9 27.55 26 31.75 26 28 Q26 27.6 26.3 27.3 26.6 27 27 27 27.4 27 27.7 27.3 L28 28 28 36 M30 29 L29.3 28.7 Q29 28.4 29 28 29 27.6 29.3 27.3 29.6 27 30 27 L34 27 Q34.4 27 34.7 27.3 L35 28 34.7 28.7 Q34.4 29 34 29 L33 29 33 36 32.7 36.7 32 37 Q31.6 37 31.3 36.7 31 36.4 31 36 L31 29 30 29 M20 31 Q20.4 31 20.7 31.3 L21 32 20.7 32.7 20 33 17 33 17 35 20 35 Q20.4 35 20.7 35.3 L21 36 20.7 36.7 20 37 16 37 15.3 36.7 Q15 36.4 15 36 L15 28 Q15 27.6 15.3 27.3 15.6 27 16 27 L20 27 Q20.4 27 20.7 27.3 L21 28 20.7 28.7 20 29 17 29 17 31 20 31 M36 28 Q36 27.6 36.3 27.3 36.6 27 37 27 L41 27 Q41.4 27 41.7 27.3 L42 28 41.7 28.7 41 29 38 29 38 31 41 31 Q41.4 31 41.7 31.3 L42 32 41.7 32.7 41 33 38 33 38 35 41 35 Q41.4 35 41.7 35.3 L42 36 41.7 36.7 41 37 37 37 36.3 36.7 Q36 36.4 36 36 L36 28 M48.1 32.1 L48.1 32.15 47.45 32.65 48.9 35.55 Q49.1 35.95 48.95 36.35 L48.45 36.9 47.7 36.95 Q47.3 36.8 47.1 36.45 L45.4 33 45 33 45 36 44.7 36.7 44 37 Q43.6 37 43.3 36.7 43 36.4 43 36 L43 28 Q43 27.6 43.3 27.3 43.6 27 44 27 L46.05 27 Q47.25 27 48.1 27.85 49 28.75 49 30 49 31.25 48.1 32.1 M46.1 31 L46.45 30.9 46.7 30.7 46.75 30.7 47 30 46.7 29.25 Q46.45 29 46.05 29 L45 29 45 31 46.1 31"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
            </g>
        </svg>
    `}),ni=p({name:`KeyboardEscapeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 28 Q31.6 28 31.3 28.3 31 28.6 31 29 31 29.4 31.3 29.7 L31.95 30 32.05 30 Q33.6 30 34.8 31.2 36 32.4 36 34 36 35.6 34.8 36.8 33.6 38 32 38 L28 38 28 35 32 35 32.7 34.7 33 34 32.7 33.3 Q32.4 33 32.05 33 L31.95 33 Q30.4 33 29.2 31.8 28 30.6 28 29 28 27.4 29.2 26.2 30.4 25 32 25 L36 25 36 28 32 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 25 L26 25 26 28 21 28 21 30 26 30 26 33 21 33 21 35 26 35 26 38 18 38 18 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.8 37 L44.7 37.1 Q43.55 38 42 38 40.4 38 39.3 37.1 L39.2 37.05 39.15 36.95 Q38 35.8 38 34.3 L38 28.75 Q38 27.15 39.2 26.05 L39.25 26.05 Q40.4 25 42 25 43.55 25 44.75 26.05 46 27.15 46 28.75 L46 30.25 43 30.25 43 28.75 42.8 28.3 Q42.45 28 42 28 41.55 28 41.25 28.25 L41.2 28.3 41 28.75 41 34.3 41.2 34.8 42 35 42.75 34.8 43 34.3 43 32.8 46 32.8 46 34.3 Q46.05 35.8 44.8 37"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M32 28 Q31.6 28 31.3 28.3 31 28.6 31 29 31 29.4 31.3 29.7 L31.95 30 32.05 30 Q33.6 30 34.8 31.2 36 32.4 36 34 36 35.6 34.8 36.8 33.6 38 32 38 L28 38 28 35 32 35 32.7 34.7 33 34 32.7 33.3 Q32.4 33 32.05 33 L31.95 33 Q30.4 33 29.2 31.8 28 30.6 28 29 28 27.4 29.2 26.2 30.4 25 32 25 L36 25 36 28 32 28 M18 25 L26 25 26 28 21 28 21 30 26 30 26 33 21 33 21 35 26 35 26 38 18 38 18 25 M44.8 37 L44.7 37.1 Q43.55 38 42 38 40.4 38 39.3 37.1 L39.2 37.05 39.15 36.95 Q38 35.8 38 34.3 L38 28.75 Q38 27.15 39.2 26.05 L39.25 26.05 Q40.4 25 42 25 43.55 25 44.75 26.05 46 27.15 46 28.75 L46 30.25 43 30.25 43 28.75 42.8 28.3 Q42.45 28 42 28 41.55 28 41.25 28.25 L41.2 28.3 41 28.75 41 34.3 41.2 34.8 42 35 42.75 34.8 43 34.3 43 32.8 46 32.8 46 34.3 Q46.05 35.8 44.8 37"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),ri=p({name:`KeyboardTabAlternativeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 25 L45 25 45 39 42 39 42 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 32 L33 38 31 38 31 34 19 34 19 30 31 30 31 26 33 26 39 32"
                />
                <path
                    fill="#FFFFFF"
                    d="M42 25 L45 25 45 39 42 39 42 25 M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 M39 32 L33 38 31 38 31 34 19 34 19 30 31 30 31 26 33 26 39 32"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
            </g>
        </svg>
    `}),ii=p({name:`KeyboardBackspaceAlternativeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 52.9 53 54.8 51.1 56 48 56 L16 56 Q12.9 56 11 54.8 8 52.9 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 22 L46 42 45.7 42.7 45 43 27.55 43 27.15 42.9 26.8 42.7 17.95 32.7 Q17.65 32.4 17.7 32 17.65 31.6 17.95 31.35 L26.8 21.35 27.15 21.1 27.55 21 45 21 Q45.4 21 45.7 21.3 L46 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 39 L42 25 28.9 25 28.9 25.05 22.7 32 28.9 39 42 39"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.7 35.3 L38.3 36.7 35 33.4 31.7 36.7 30.3 35.3 33.6 32 30.3 28.7 31.7 27.3 35 30.6 38.3 27.3 39.7 28.7 36.4 32 39.7 35.3"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 52.9 53 54.8 51.1 56 48 56 L16 56 Q12.9 56 11 54.8 8 52.9 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M46 22 L46 42 45.7 42.7 45 43 27.55 43 27.15 42.9 26.8 42.7 17.95 32.7 Q17.65 32.4 17.7 32 17.65 31.6 17.95 31.35 L26.8 21.35 27.15 21.1 27.55 21 45 21 Q45.4 21 45.7 21.3 L46 22 M42 39 L42 25 28.9 25 28.9 25.05 22.7 32 28.9 39 42 39 M39.7 35.3 L38.3 36.7 35 33.4 31.7 36.7 30.3 35.3 33.6 32 30.3 28.7 31.7 27.3 35 30.6 38.3 27.3 39.7 28.7 36.4 32 39.7 35.3"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 52.9 53 54.8 51.1 56 48 56 L16 56 Q12.9 56 11 54.8 8 52.9 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),ai=p({name:`KeyboardShiftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 16 L48 16 Q56 16 56 24 L56 40 Q56 44.9 53 46.8 51.1 48 48 48 L16 48 Q12.9 48 11 46.8 8 44.9 8 40 L8 24 Q8 16 16 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 24 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19 L16 19 Q11 19 11 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 24 L40 32 40 34 36 34 36 40 28 40 28 34 24 34 24 32 32 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 16 L48 16 Q56 16 56 24 L56 40 Q56 44.9 53 46.8 51.1 48 48 48 L16 48 Q12.9 48 11 46.8 8 44.9 8 40 L8 24 Q8 16 16 16 M11 24 L11 40 Q11 45 16 45 L48 45 Q53 45 53 40 L53 24 Q53 19 48 19 L16 19 Q11 19 11 24 M32 24 L40 32 40 34 36 34 36 40 28 40 28 34 24 34 24 32 32 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 16 L48 16 Q56 16 56 24 L56 40 Q56 44.9 53 46.8 51.1 48 48 48 L16 48 Q12.9 48 11 46.8 8 44.9 8 40 L8 24 Q8 16 16 16"
                />
            </g>
        </svg>
    `}),oi=p({name:`KeyboardCtrlIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 28 Q40 27.6 40.3 27.3 40.6 27 41 27 41.4 27 41.7 27.3 L42 28 42 35 45 35 Q45.4 35 45.7 35.3 L46 36 45.7 36.7 45 37 41 37 40.3 36.7 Q40 36.4 40 36 L40 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.1 31 L36.45 30.9 36.7 30.7 36.75 30.7 37 30 36.7 29.25 Q36.45 29 36.05 29 L35 29 35 31 36.1 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.1 32.1 L38.1 32.15 37.45 32.65 38.9 35.55 38.95 36.35 38.45 36.9 37.7 36.95 Q37.3 36.8 37.1 36.45 L35.4 33 35 33 35 36 34.7 36.7 Q34.4 37 34 37 L33.3 36.7 Q33 36.4 33 36 L33 28 Q33 27.6 33.3 27.3 33.6 27 34 27 L36.05 27 Q37.25 27 38.1 27.85 39 28.75 39 30 39 31.25 38.1 32.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 22 L56 42 Q56 46.9 53 48.8 51.1 50 48 50 L16 50 Q12.9 50 11 48.8 8 46.9 8 42 L8 22 Q8 14 16 14 L48 14 Q56 14 56 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 29 L26.3 28.7 26 28 Q26 27.6 26.3 27.3 26.6 27 27 27 L31 27 Q31.4 27 31.7 27.3 L32 28 31.7 28.7 31 29 30 29 30 36 29.7 36.7 29 37 Q28.6 37 28.3 36.7 28 36.4 28 36 L28 29 27 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24.1 36.25 L24.05 36.3 Q23.15 37 22 37 20.75 37 19.9 36.3 L19.85 36.2 Q19 35.35 19 34.25 L19 29.8 Q19 28.65 19.85 27.8 L19.9 27.75 Q20.75 27 22 27 23.15 27 24.05 27.75 L24.1 27.8 Q25 28.65 25 29.8 L24.7 30.5 24 30.8 Q23.6 30.8 23.3 30.5 23 30.2 23 29.8 L22.75 29.25 22.75 29.3 Q22.45 29 22 29 21.55 29 21.2 29.3 L21.25 29.2 21 29.8 21 34.25 21.2 34.75 22 35 22.75 34.75 22.75 34.8 23 34.25 Q23 33.85 23.3 33.55 23.6 33.25 24 33.25 24.4 33.25 24.7 33.55 L25 34.25 Q25 35.35 24.1 36.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 22 L11 42 Q11 45 12.6 46.3 13.9 47 16 47 L48 47 Q50.1 47 51.4 46.3 53 45 53 42 L53 22 Q53 17 48 17 L16 17 Q11 17 11 22"
                />
                <path
                    fill="#FFFFFF"
                    d="M40 28 Q40 27.6 40.3 27.3 40.6 27 41 27 41.4 27 41.7 27.3 L42 28 42 35 45 35 Q45.4 35 45.7 35.3 L46 36 45.7 36.7 45 37 41 37 40.3 36.7 Q40 36.4 40 36 L40 28 M36.1 31 L36.45 30.9 36.7 30.7 36.75 30.7 37 30 36.7 29.25 Q36.45 29 36.05 29 L35 29 35 31 36.1 31 M38.1 32.1 L38.1 32.15 37.45 32.65 38.9 35.55 38.95 36.35 38.45 36.9 37.7 36.95 Q37.3 36.8 37.1 36.45 L35.4 33 35 33 35 36 34.7 36.7 Q34.4 37 34 37 L33.3 36.7 Q33 36.4 33 36 L33 28 Q33 27.6 33.3 27.3 33.6 27 34 27 L36.05 27 Q37.25 27 38.1 27.85 39 28.75 39 30 39 31.25 38.1 32.1 M56 22 L56 42 Q56 46.9 53 48.8 51.1 50 48 50 L16 50 Q12.9 50 11 48.8 8 46.9 8 42 L8 22 Q8 14 16 14 L48 14 Q56 14 56 22 M27 29 L26.3 28.7 26 28 Q26 27.6 26.3 27.3 26.6 27 27 27 L31 27 Q31.4 27 31.7 27.3 L32 28 31.7 28.7 31 29 30 29 30 36 29.7 36.7 29 37 Q28.6 37 28.3 36.7 28 36.4 28 36 L28 29 27 29 M24.1 36.25 L24.05 36.3 Q23.15 37 22 37 20.75 37 19.9 36.3 L19.85 36.2 Q19 35.35 19 34.25 L19 29.8 Q19 28.65 19.85 27.8 L19.9 27.75 Q20.75 27 22 27 23.15 27 24.05 27.75 L24.1 27.8 Q25 28.65 25 29.8 L24.7 30.5 24 30.8 Q23.6 30.8 23.3 30.5 23 30.2 23 29.8 L22.75 29.25 22.75 29.3 Q22.45 29 22 29 21.55 29 21.2 29.3 L21.25 29.2 21 29.8 21 34.25 21.2 34.75 22 35 22.75 34.75 22.75 34.8 23 34.25 Q23 33.85 23.3 33.55 23.6 33.25 24 33.25 24.4 33.25 24.7 33.55 L25 34.25 Q25 35.35 24.1 36.25 M11 22 L11 42 Q11 45 12.6 46.3 13.9 47 16 47 L48 47 Q50.1 47 51.4 46.3 53 45 53 42 L53 22 Q53 17 48 17 L16 17 Q11 17 11 22"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M56 22 L56 42 Q56 46.9 53 48.8 51.1 50 48 50 L16 50 Q12.9 50 11 48.8 8 46.9 8 42 L8 22 Q8 14 16 14 L48 14 Q56 14 56 22"
                />
            </g>
        </svg>
    `}),si=p({name:`KeyboardOptionIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 22 L44 26 36 26 36 22 44 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29.25 22 L37.25 38 44 38 44 42 34.8 42 26.75 26 20 26 20 22 29.25 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M44 22 L44 26 36 26 36 22 44 22 M29.25 22 L37.25 38 44 38 44 42 34.8 42 26.75 26 20 26 20 22 29.25 22 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),ci=p({name:`KeyboardCommandIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42.45 24.4 Q43 23.8 43 23 43 22.2 42.5 21.6 L42.4 21.55 Q41.8 21 41 21 40.2 21 39.65 21.6 39 22.2 39 23 L39 25 41 25 Q41.8 25 42.45 24.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35 25 L35 23 Q35 20.5 36.8 18.75 38.5 17 41 17 43.45 17 45.25 18.7 L45.3 18.75 45.3 18.8 Q47 20.55 47 23 47 25.5 45.3 27.25 43.5 29 41 29 L39 29 39 35 41 35 Q43.5 35 45.3 36.8 47 38.5 47 41 47 43.45 45.3 45.25 L45.3 45.3 45.25 45.3 Q43.45 47 41 47 38.5 47 36.8 45.3 35 43.5 35 41 L35 39 29 39 29 41 Q29 43.5 27.25 45.3 25.5 47 23 47 20.55 47 18.8 45.3 L18.75 45.3 18.7 45.25 Q17 43.45 17 41 17 38.5 18.75 36.8 20.5 35 23 35 L25 35 25 29 23 29 Q20.5 29 18.75 27.25 17 25.5 17 23 17 20.55 18.7 18.8 L18.8 18.7 Q20.55 17 23 17 25.5 17 27.25 18.75 29 20.5 29 23 L29 25 35 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.6 39.65 Q21 40.2 21 41 21 41.8 21.55 42.4 L21.6 42.5 Q22.2 43 23 43 23.8 43 24.4 42.45 25 41.8 25 41 L25 39 23 39 Q22.2 39 21.6 39.65"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35 29 L29 29 29 35 35 35 35 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 25 L25 25 25 23 Q25 22.2 24.4 21.6 23.8 21 23 21 22.2 21 21.6 21.55 L21.55 21.6 Q21 22.2 21 23 21 23.8 21.6 24.4 22.2 25 23 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 39 L39 39 39 41 Q39 41.8 39.65 42.45 40.2 43 41 43 41.8 43 42.4 42.5 L42.5 42.4 Q43 41.8 43 41 43 40.2 42.45 39.65 41.8 39 41 39"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 M42.45 24.4 Q43 23.8 43 23 43 22.2 42.5 21.6 L42.4 21.55 Q41.8 21 41 21 40.2 21 39.65 21.6 39 22.2 39 23 L39 25 41 25 Q41.8 25 42.45 24.4 M35 25 L35 23 Q35 20.5 36.8 18.75 38.5 17 41 17 43.45 17 45.25 18.7 L45.3 18.75 45.3 18.8 Q47 20.55 47 23 47 25.5 45.3 27.25 43.5 29 41 29 L39 29 39 35 41 35 Q43.5 35 45.3 36.8 47 38.5 47 41 47 43.45 45.3 45.25 L45.3 45.3 45.25 45.3 Q43.45 47 41 47 38.5 47 36.8 45.3 35 43.5 35 41 L35 39 29 39 29 41 Q29 43.5 27.25 45.3 25.5 47 23 47 20.55 47 18.8 45.3 L18.75 45.3 18.7 45.25 Q17 43.45 17 41 17 38.5 18.75 36.8 20.5 35 23 35 L25 35 25 29 23 29 Q20.5 29 18.75 27.25 17 25.5 17 23 17 20.55 18.7 18.8 L18.8 18.7 Q20.55 17 23 17 25.5 17 27.25 18.75 29 20.5 29 23 L29 25 35 25 M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M21.6 39.65 Q21 40.2 21 41 21 41.8 21.55 42.4 L21.6 42.5 Q22.2 43 23 43 23.8 43 24.4 42.45 25 41.8 25 41 L25 39 23 39 Q22.2 39 21.6 39.65 M35 29 L29 29 29 35 35 35 35 29 M23 25 L25 25 25 23 Q25 22.2 24.4 21.6 23.8 21 23 21 22.2 21 21.6 21.55 L21.55 21.6 Q21 22.2 21 23 21 23.8 21.6 24.4 22.2 25 23 25 M41 39 L39 39 39 41 Q39 41.8 39.65 42.45 40.2 43 41 43 41.8 43 42.4 42.5 L42.5 42.4 Q43 41.8 43 41 43 40.2 42.45 39.65 41.8 39 41 39"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),li=p({name:`KeyboardWinIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35 31 Q34.15 31 33.6 30.45 33 29.85 33 29 L33 23 Q33 22.15 33.6 21.6 34.15 21 35 21 L41 21 Q41.85 21 42.45 21.6 43 22.15 43 23 L43 29 Q43 29.85 42.45 30.45 41.85 31 41 31 L35 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 41 L33 35 Q33 34.15 33.6 33.6 34.15 33 35 33 L41 33 Q41.85 33 42.45 33.6 43 34.15 43 35 L43 41 Q43 41.85 42.45 42.45 41.85 43 41 43 L35 43 Q34.15 43 33.6 42.45 33 41.85 33 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 23 L31 29 Q31 29.85 30.45 30.45 29.85 31 29 31 L23 31 Q22.15 31 21.6 30.45 21 29.85 21 29 L21 23 Q21 22.15 21.6 21.6 22.15 21 23 21 L29 21 Q29.85 21 30.45 21.6 31 22.15 31 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 35 L31 41 Q31 41.85 30.45 42.45 29.85 43 29 43 L23 43 Q22.15 43 21.6 42.45 21 41.85 21 41 L21 35 Q21 34.15 21.6 33.6 22.15 33 23 33 L29 33 Q29.85 33 30.45 33.6 31 34.15 31 35"
                />
                <path
                    fill="#FFFFFF"
                    d="M35 31 Q34.15 31 33.6 30.45 33 29.85 33 29 L33 23 Q33 22.15 33.6 21.6 34.15 21 35 21 L41 21 Q41.85 21 42.45 21.6 43 22.15 43 23 L43 29 Q43 29.85 42.45 30.45 41.85 31 41 31 L35 31 M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 M33 41 L33 35 Q33 34.15 33.6 33.6 34.15 33 35 33 L41 33 Q41.85 33 42.45 33.6 43 34.15 43 35 L43 41 Q43 41.85 42.45 42.45 41.85 43 41 43 L35 43 Q34.15 43 33.6 42.45 33 41.85 33 41 M31 23 L31 29 Q31 29.85 30.45 30.45 29.85 31 29 31 L23 31 Q22.15 31 21.6 30.45 21 29.85 21 29 L21 23 Q21 22.15 21.6 21.6 22.15 21 23 21 L29 21 Q29.85 21 30.45 21.6 31 22.15 31 23 M31 35 L31 41 Q31 41.85 30.45 42.45 29.85 43 29 43 L23 43 Q22.15 43 21.6 42.45 21 41.85 21 41 L21 35 Q21 34.15 21.6 33.6 22.15 33 23 33 L29 33 Q29.85 33 30.45 33.6 31 34.15 31 35"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),ui=p({name:`KeyboardCapslockIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 14 L48 14 Q56 14 56 22 L56 41 Q56 49 48 49 L16 49 Q8 49 8 41 L8 22 Q8 14 16 14"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 22 L11 41 Q11 46 16 46 L48 46 Q53 46 53 41 L53 22 Q53 17 48 17 L16 17 Q11 17 11 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 20 L40 28 40 30 36 30 36 36 28 36 28 30 24 30 24 28 32 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 42 L28 42 28 38 36 38 36 42"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 14 L48 14 Q56 14 56 22 L56 41 Q56 49 48 49 L16 49 Q8 49 8 41 L8 22 Q8 14 16 14 M11 22 L11 41 Q11 46 16 46 L48 46 Q53 46 53 41 L53 22 Q53 17 48 17 L16 17 Q11 17 11 22 M32 20 L40 28 40 30 36 30 36 36 28 36 28 30 24 30 24 28 32 20 M36 42 L28 42 28 38 36 38 36 42"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 14 L48 14 Q56 14 56 22 L56 41 Q56 49 48 49 L16 49 Q8 49 8 41 L8 22 Q8 14 16 14"
                />
            </g>
        </svg>
    `}),di=p({name:`KeyboardTildeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q9.55 56 8.3 50.8 8 49.55 8 48 L8 16 Q8 14.45 8.3 13.2 9.55 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 28 Q31 28 33.5 30.65 34.7 32 36.5 32 38.3 32 39.55 30.65 40.1 30.05 40.95 30 41.75 29.95 42.35 30.55 42.95 31.1 43 31.95 43.05 32.75 42.5 33.35 40 36 36.5 36 33 36 30.55 33.35 29.3 32 27.5 32 25.7 32 24.5 33.35 23.9 33.95 23.1 34 22.25 34.05 21.65 33.5 21.05 32.9 21 32.1 20.95 31.25 21.55 30.65 24 28 27.5 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q9.55 56 8.3 50.8 8 49.55 8 48 L8 16 Q8 14.45 8.3 13.2 9.55 8 16 8 M27.5 28 Q31 28 33.5 30.65 34.7 32 36.5 32 38.3 32 39.55 30.65 40.1 30.05 40.95 30 41.75 29.95 42.35 30.55 42.95 31.1 43 31.95 43.05 32.75 42.5 33.35 40 36 36.5 36 33 36 30.55 33.35 29.3 32 27.5 32 25.7 32 24.5 33.35 23.9 33.95 23.1 34 22.25 34.05 21.65 33.5 21.05 32.9 21 32.1 20.95 31.25 21.55 30.65 24 28 27.5 28 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q9.55 56 8.3 50.8 8 49.55 8 48 L8 16 Q8 14.45 8.3 13.2 9.55 8 16 8"
                />
            </g>
        </svg>
    `}),fi=p({name:`KeyboardMinusIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 30 L40 34 24 34 24 30 40 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M40 30 L40 34 24 34 24 30 40 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),pi=p({name:`KeyboardUnderscoreIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 41 L42 41 42 45 22 45 22 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M22 41 L42 41 42 45 22 45 22 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),mi=p({name:`KeyboardPlusIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 52.9 53 54.8 51.1 56 48 56 L16 56 Q12.9 56 11 54.8 8 52.9 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 30 L40 34 34 34 34 40 30 40 30 34 24 34 24 30 30 30 30 24 34 24 34 30 40 30"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 52.9 53 54.8 51.1 56 48 56 L16 56 Q12.9 56 11 54.8 8 52.9 8 48 L8 16 Q8 8 16 8 M40 30 L40 34 34 34 34 40 30 40 30 34 24 34 24 30 30 30 30 24 34 24 34 30 40 30"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 52.9 53 54.8 51.1 56 48 56 L16 56 Q12.9 56 11 54.8 8 52.9 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),hi=p({name:`KeyboardEqualsIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 34 L40 38 24 38 24 34 40 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 26 L40 30 24 30 24 26 40 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M40 34 L40 38 24 38 24 34 40 34 M40 26 L40 30 24 30 24 26 40 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),gi=p({name:`KeyboardBracketOpenIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 26 L32 38 36 38 36 42 29 42 28 41 28 23 29 22 36 22 36 26 32 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 26 L32 38 36 38 36 42 29 42 28 41 28 23 29 22 36 22 36 26 32 26 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),_i=p({name:`KeyboardBracketCloseIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M32 26 L28 26 28 22 35 22 36 23 36 41 35 42 28 42 28 38 32 38 32 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M32 26 L28 26 28 22 35 22 36 23 36 41 35 42 28 42 28 38 32 38 32 26 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),vi=p({name:`KeyboardSlashBackIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 26 L25 23 26 22 29 22 39 38 39 41 38 42 35 42 25 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M25 26 L25 23 26 22 29 22 39 38 39 41 38 42 35 42 25 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),yi=p({name:`KeyboardSemicolonIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 22 L33 22 Q35 22 35 24 L35 26 Q35 28 33 28 L31 28 Q29 28 29 26 L29 24 Q29 22 31 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 36 L33 36 Q35 36 35 38 L35 40 35 40.25 35 43 Q35 44.2 34.1 45.1 33.2 46 32 46 30.8 46 29.9 45.1 L31.3 43.7 Q31.6 44 32 44 L32.7 43.7 33 43 33 42 31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M31 22 L33 22 Q35 22 35 24 L35 26 Q35 28 33 28 L31 28 Q29 28 29 26 L29 24 Q29 22 31 22 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M31 36 L33 36 Q35 36 35 38 L35 40 35 40.25 35 43 Q35 44.2 34.1 45.1 33.2 46 32 46 30.8 46 29.9 45.1 L31.3 43.7 Q31.6 44 32 44 L32.7 43.7 33 43 33 42 31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),bi=p({name:`KeyboardColonIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 22 L33 22 Q35 22 35 24 L35 26 Q35 28 33 28 L31 28 Q29 28 29 26 L29 24 Q29 22 31 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 36 L33 36 Q35 36 35 38 L35 40 Q35 42 33 42 L31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M31 22 L33 22 Q35 22 35 24 L35 26 Q35 28 33 28 L31 28 Q29 28 29 26 L29 24 Q29 22 31 22 M31 36 L33 36 Q35 36 35 38 L35 40 Q35 42 33 42 L31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),xi=p({name:`KeyboardApostropheIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 20 L33 20 Q35 20 35 22 L35 28 Q35 30 33 30 L31 30 Q29 30 29 28 L29 22 Q29 20 31 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M31 20 L33 20 Q35 20 35 22 L35 28 Q35 30 33 30 L31 30 Q29 30 29 28 L29 22 Q29 20 31 20 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Si=p({name:`KeyboardQuoteIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 20 L38 20 Q40 20 40 22 L40 28 Q40 30 38 30 L36 30 Q34 30 34 28 L34 22 Q34 20 36 20"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 20 L28 20 Q30 20 30 22 L30 28 Q30 30 28 30 L26 30 Q24 30 24 28 L24 22 Q24 20 26 20"
                />
                <path
                    fill="#FFFFFF"
                    d="M36 20 L38 20 Q40 20 40 22 L40 28 Q40 30 38 30 L36 30 Q34 30 34 28 L34 22 Q34 20 36 20 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M26 20 L28 20 Q30 20 30 22 L30 28 Q30 30 28 30 L26 30 Q24 30 24 28 L24 22 Q24 20 26 20"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ci=p({name:`KeyboardCommaIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q9.55 56 8.3 50.8 8 49.55 8 48 L8 16 Q8 14.45 8.3 13.2 9.55 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 36 L33 36 Q35 36 35 38 L35 40 35 40.25 35 43 Q35 44.2 34.1 45.1 33.2 46 32 46 30.8 46 29.9 45.1 L31.3 43.7 Q31.6 44 32 44 L32.7 43.7 33 43 33 42 31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q9.55 56 8.3 50.8 8 49.55 8 48 L8 16 Q8 14.45 8.3 13.2 9.55 8 16 8 M31 36 L33 36 Q35 36 35 38 L35 40 35 40.25 35 43 Q35 44.2 34.1 45.1 33.2 46 32 46 30.8 46 29.9 45.1 L31.3 43.7 Q31.6 44 32 44 L32.7 43.7 33 43 33 42 31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q9.55 56 8.3 50.8 8 49.55 8 48 L8 16 Q8 14.45 8.3 13.2 9.55 8 16 8"
                />
            </g>
        </svg>
    `}),wi=p({name:`KeyboardBracketLessIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 38 L34 41 25 32 34 23 37 26 31 32 37 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M37 38 L34 41 25 32 34 23 37 26 31 32 37 38 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),Ti=p({name:`KeyboardPeriodIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31 36 L33 36 Q35 36 35 38 L35 40 Q35 42 33 42 L31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M31 36 L33 36 Q35 36 35 38 L35 40 Q35 42 33 42 L31 42 Q29 42 29 40 L29 38 Q29 36 31 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ei=p({name:`KeyboardBracketGreaterIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 38 L33 32 27 26 30 23 39 32 30 41 27 38"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M27 38 L33 32 27 26 30 23 39 32 30 41 27 38"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),Di=p({name:`KeyboardSlashForwardIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 26 L29 42 26 42 25 41 25 38 35 22 38 22 39 23 39 26"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 M39 26 L29 42 26 42 25 41 25 38 35 22 38 22 39 23 39 26"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),Oi=p({name:`KeyboardQuestionIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29.95 30 L33.95 30 Q34.75 30 35.35 29.4 35.95 28.8 35.95 28 35.95 27.2 35.4 26.65 L35.3 26.55 Q34.75 26 33.95 26 L29.9 26 Q29.15 26 28.6 26.55 L28.5 26.65 Q27.95 27.2 27.95 28 L24.1 26.5 24.25 26 Q24.7 24.8 25.7 23.8 L25.75 23.75 Q27.45 22.05 29.8 22 L33.95 22 Q36.4 22 38.15 23.75 L38.2 23.8 Q39.95 25.55 39.95 28 39.95 30.5 38.2 32.25 36.45 34 33.95 34 L33.95 36 29.95 36 29.95 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.95 40 Q33.95 40.85 33.35 41.4 32.8 42 31.95 42 31.1 42 30.5 41.4 29.95 40.85 29.95 40 29.95 39.15 30.5 38.55 31.1 38 31.95 38 32.8 38 33.35 38.55 33.95 39.15 33.95 40"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 M29.95 30 L33.95 30 Q34.75 30 35.35 29.4 35.95 28.8 35.95 28 35.95 27.2 35.4 26.65 L35.3 26.55 Q34.75 26 33.95 26 L29.9 26 Q29.15 26 28.6 26.55 L28.5 26.65 Q27.95 27.2 27.95 28 L24.1 26.5 24.25 26 Q24.7 24.8 25.7 23.8 L25.75 23.75 Q27.45 22.05 29.8 22 L33.95 22 Q36.4 22 38.15 23.75 L38.2 23.8 Q39.95 25.55 39.95 28 39.95 30.5 38.2 32.25 36.45 34 33.95 34 L33.95 36 29.95 36 29.95 30 M33.95 40 Q33.95 40.85 33.35 41.4 32.8 42 31.95 42 31.1 42 30.5 41.4 29.95 40.85 29.95 40 29.95 39.15 30.5 38.55 31.1 38 31.95 38 32.8 38 33.35 38.55 33.95 39.15 33.95 40"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),ki=p({name:`KeyboardAsteriskIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30 24 L34 24 34 28.55 37.9 26.3 39.9 29.75 35.95 32.05 39.9 34.3 37.9 37.75 34 35.5 34 40 30 40 30 35.5 26.05 37.75 24.05 34.3 28 32.05 24.05 29.75 26.05 26.3 30 28.6 30 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 M53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 M30 24 L34 24 34 28.55 37.9 26.3 39.9 29.75 35.95 32.05 39.9 34.3 37.9 37.75 34 35.5 34 40 30 40 30 35.5 26.05 37.75 24.05 34.3 28 32.05 24.05 29.75 26.05 26.3 30 28.6 30 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56"
                />
            </g>
        </svg>
    `}),Ai=p({name:`KeyboardNumpadPlusIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 8 L41 8 Q49 8 49 16 L49 48 Q49 52.9 46 54.8 44.1 56 41 56 L23 56 Q19.9 56 18 54.8 15 52.9 15 48 L15 16 Q15 8 23 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 30 L40 34 34 34 34 40 30 40 30 34 24 34 24 30 30 30 30 24 34 24 34 30 40 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 16 L18 48 Q18 53 23 53 L41 53 Q46 53 46 48 L46 16 Q46 11 41 11 L23 11 Q18 11 18 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M23 8 L41 8 Q49 8 49 16 L49 48 Q49 52.9 46 54.8 44.1 56 41 56 L23 56 Q19.9 56 18 54.8 15 52.9 15 48 L15 16 Q15 8 23 8 M40 30 L40 34 34 34 34 40 30 40 30 34 24 34 24 30 30 30 30 24 34 24 34 30 40 30 M18 16 L18 48 Q18 53 23 53 L41 53 Q46 53 46 48 L46 16 Q46 11 41 11 L23 11 Q18 11 18 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 8 L41 8 Q49 8 49 16 L49 48 Q49 52.9 46 54.8 44.1 56 41 56 L23 56 Q19.9 56 18 54.8 15 52.9 15 48 L15 16 Q15 8 23 8"
                />
            </g>
        </svg>
    `}),ji=p({name:`KeyboardDeleteIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 28.05 L21 34.95 22.2 34.3 22.3 34.2 Q23 33.55 23 32.5 L23 30.5 Q23 29.45 22.3 28.8 L22.25 28.75 22.2 28.75 21 28.05"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36 25 L36 28 31 28 31 30 36 30 36 33 31 33 31 35 36 35 36 38 28 38 28 25 36 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 25 L20.5 25 Q22.8 25 24.35 26.6 L24.4 26.7 Q26 28.2 26 30.5 L26 32.5 Q26 34.8 24.4 36.35 L24.35 36.4 Q22.8 38 20.5 38 L18 38 18 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 25 L41 25 41 35 46 35 46 38 38 38 38 25"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M21 28.05 L21 34.95 22.2 34.3 22.3 34.2 Q23 33.55 23 32.5 L23 30.5 Q23 29.45 22.3 28.8 L22.25 28.75 22.2 28.75 21 28.05 M36 25 L36 28 31 28 31 30 36 30 36 33 31 33 31 35 36 35 36 38 28 38 28 25 36 25 M18 25 L20.5 25 Q22.8 25 24.35 26.6 L24.4 26.7 Q26 28.2 26 30.5 L26 32.5 Q26 34.8 24.4 36.35 L24.35 36.4 Q22.8 38 20.5 38 L18 38 18 25 M38 25 L41 25 41 35 46 35 46 38 38 38 38 25"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Mi=p({name:`KeyboardInsertIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35 38 L32 38 28 31 28 38 25 38 25 25 28 25 32 32 32 25 35 25 35 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 38 L20 38 20 25 23 25 23 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 28 Q40.6 28 40.3 28.3 40 28.6 40 29 40 29.4 40.3 29.7 L40.95 30 41.05 30 Q42.6 30 43.8 31.2 45 32.4 45 34 45 35.6 43.8 36.8 42.6 38 41 38 L37 38 37 35 41 35 41.7 34.7 42 34 41.7 33.3 Q41.4 33 41.05 33 L40.95 33 Q39.4 33 38.2 31.8 37 30.6 37 29 37 27.4 38.2 26.2 39.4 25 41 25 L45 25 45 28 41 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M35 38 L32 38 28 31 28 38 25 38 25 25 28 25 32 32 32 25 35 25 35 38 M23 38 L20 38 20 25 23 25 23 38 M41 28 Q40.6 28 40.3 28.3 40 28.6 40 29 40 29.4 40.3 29.7 L40.95 30 41.05 30 Q42.6 30 43.8 31.2 45 32.4 45 34 45 35.6 43.8 36.8 42.6 38 41 38 L37 38 37 35 41 35 41.7 34.7 42 34 41.7 33.3 Q41.4 33 41.05 33 L40.95 33 Q39.4 33 38.2 31.8 37 30.6 37 29 37 27.4 38.2 26.2 39.4 25 41 25 L45 25 45 28 41 28 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ni=p({name:`KeyboardHomeIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 28 Q40 27.6 40.3 27.3 40.45 27.1 40.7 27.05 L41 27 45 27 Q45.4 27 45.7 27.3 L46 28 45.7 28.7 45 29 42 29 42 31 45 31 Q45.4 31 45.7 31.3 L46 32 45.7 32.7 45 33 42 33 42 35 45 35 Q45.4 35 45.7 35.3 L46 36 45.7 36.7 45 37 41 37 40.3 36.7 Q40 36.4 40 36 L40 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 36 L38.7 36.7 38 37 Q37.6 37 37.3 36.7 37 36.4 37 36 L37 30.4 35.7 31.7 35 32 Q34.6 32 34.3 31.7 L33 30.4 33 36 32.7 36.7 32 37 Q31.6 37 31.3 36.7 31 36.4 31 36 L31 28 Q31 27.6 31.3 27.3 31.45 27.1 31.7 27.05 L32 27 32.3 27.05 Q32.55 27.1 32.7 27.3 L35 29.6 37.3 27.3 Q37.45 27.1 37.7 27.05 L38 27 38.3 27.05 Q38.55 27.1 38.7 27.3 L39 28 39 36"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26 29.8 L26 34.25 26.2 34.75 27 35 27.75 34.75 27.75 34.8 28 34.25 28 29.8 27.75 29.25 27.75 29.3 Q27.45 29 27 29 26.55 29 26.2 29.3 L26.25 29.2 Q26 29.45 26 29.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24.85 27.8 L24.9 27.75 Q25.55 27.2 26.4 27.05 L27 27 27.6 27.05 Q28.4 27.2 29.05 27.75 L29.1 27.8 Q30 28.65 30 29.8 L30 34.25 Q30 35.35 29.1 36.25 L29.05 36.3 Q28.15 37 27 37 25.75 37 24.9 36.3 L24.85 36.2 Q24 35.35 24 34.25 L24 29.8 Q24 28.65 24.85 27.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 36 L22.7 36.7 22 37 Q21.6 37 21.3 36.7 21 36.4 21 36 L21 33 19 33 19 36 18.7 36.7 Q18.4 37 18 37 L17.3 36.7 Q17 36.4 17 36 L17 28 Q17 27.6 17.3 27.3 17.45 27.1 17.7 27.05 L18 27 18.3 27.05 Q18.55 27.1 18.7 27.3 L19 28 19 31 21 31 21 28 Q21 27.6 21.3 27.3 21.45 27.1 21.7 27.05 L22 27 22.3 27.05 Q22.55 27.1 22.7 27.3 L23 28 23 36"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M40 28 Q40 27.6 40.3 27.3 40.45 27.1 40.7 27.05 L41 27 45 27 Q45.4 27 45.7 27.3 L46 28 45.7 28.7 45 29 42 29 42 31 45 31 Q45.4 31 45.7 31.3 L46 32 45.7 32.7 45 33 42 33 42 35 45 35 Q45.4 35 45.7 35.3 L46 36 45.7 36.7 45 37 41 37 40.3 36.7 Q40 36.4 40 36 L40 28 M39 36 L38.7 36.7 38 37 Q37.6 37 37.3 36.7 37 36.4 37 36 L37 30.4 35.7 31.7 35 32 Q34.6 32 34.3 31.7 L33 30.4 33 36 32.7 36.7 32 37 Q31.6 37 31.3 36.7 31 36.4 31 36 L31 28 Q31 27.6 31.3 27.3 31.45 27.1 31.7 27.05 L32 27 32.3 27.05 Q32.55 27.1 32.7 27.3 L35 29.6 37.3 27.3 Q37.45 27.1 37.7 27.05 L38 27 38.3 27.05 Q38.55 27.1 38.7 27.3 L39 28 39 36 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M26 29.8 L26 34.25 26.2 34.75 27 35 27.75 34.75 27.75 34.8 28 34.25 28 29.8 27.75 29.25 27.75 29.3 Q27.45 29 27 29 26.55 29 26.2 29.3 L26.25 29.2 Q26 29.45 26 29.8 M24.85 27.8 L24.9 27.75 Q25.55 27.2 26.4 27.05 L27 27 27.6 27.05 Q28.4 27.2 29.05 27.75 L29.1 27.8 Q30 28.65 30 29.8 L30 34.25 Q30 35.35 29.1 36.25 L29.05 36.3 Q28.15 37 27 37 25.75 37 24.9 36.3 L24.85 36.2 Q24 35.35 24 34.25 L24 29.8 Q24 28.65 24.85 27.8 M23 36 L22.7 36.7 22 37 Q21.6 37 21.3 36.7 21 36.4 21 36 L21 33 19 33 19 36 18.7 36.7 Q18.4 37 18 37 L17.3 36.7 Q17 36.4 17 36 L17 28 Q17 27.6 17.3 27.3 17.45 27.1 17.7 27.05 L18 27 18.3 27.05 Q18.55 27.1 18.7 27.3 L19 28 19 31 21 31 21 28 Q21 27.6 21.3 27.3 21.45 27.1 21.7 27.05 L22 27 22.3 27.05 Q22.55 27.1 22.7 27.3 L23 28 23 36"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Pi=p({name:`KeyboardEndIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 38 L34 38 30 31 30 38 27 38 27 25 30 25 34 32 34 25 37 25 37 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 25 L25 25 25 28 20 28 20 30 25 30 25 33 20 33 20 35 25 35 25 38 17 38 17 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 28.05 L42 34.95 Q42.7 34.8 43.2 34.3 L43.3 34.2 Q44 33.55 44 32.5 L44 30.5 Q44 29.45 43.3 28.8 L43.25 28.75 43.2 28.75 42 28.05"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 25 L41.5 25 Q43.8 25 45.35 26.6 L45.4 26.7 Q47 28.2 47 30.5 L47 32.5 Q47 34.8 45.4 36.35 L45.35 36.4 Q43.8 38 41.5 38 L39 38 39 25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M37 38 L34 38 30 31 30 38 27 38 27 25 30 25 34 32 34 25 37 25 37 38 M17 25 L25 25 25 28 20 28 20 30 25 30 25 33 20 33 20 35 25 35 25 38 17 38 17 25 M42 28.05 L42 34.95 Q42.7 34.8 43.2 34.3 L43.3 34.2 Q44 33.55 44 32.5 L44 30.5 Q44 29.45 43.3 28.8 L43.25 28.75 43.2 28.75 42 28.05 M39 25 L41.5 25 Q43.8 25 45.35 26.6 L45.4 26.7 Q47 28.2 47 30.5 L47 32.5 Q47 34.8 45.4 36.35 L45.35 36.4 Q43.8 38 41.5 38 L39 38 39 25 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Fi=p({name:`KeyboardPageUpIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 26 Q44.4 26 44.7 26.3 L45 27 44.7 27.7 44 28 41 28 41 30 44 30 Q44.4 30 44.7 30.3 L45 31 44.7 31.7 44 32 40 32 Q39.6 32 39.3 31.7 39 31.4 39 31 L39 23 Q39 22.6 39.3 22.3 39.6 22 40 22 L44 22 Q44.4 22 44.7 22.3 L45 23 44.7 23.7 44 24 41 24 41 26 44 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 27 Q37.4 27 37.7 27.3 L38 28 38 29.25 Q38 30.35 37.1 31.25 L37.05 31.3 Q36.15 32 35 32 33.75 32 32.9 31.3 L32.85 31.2 Q32 30.35 32 29.25 L32 24.8 Q32 23.65 32.85 22.8 L32.9 22.75 Q33.75 22 35 22 36.15 22 37.05 22.75 L37.1 22.8 Q38 23.65 38 24.8 L37.7 25.5 37 25.8 36.3 25.5 Q36 25.2 36 24.8 L35.75 24.25 35.75 24.3 Q35.45 24 35 24 34.55 24 34.2 24.3 L34.25 24.2 Q34 24.45 34 24.8 L34 29.25 34.2 29.75 35 30 35.75 29.75 35.75 29.8 36 29.25 36 29 Q35.6 29 35.3 28.7 L35 28 Q35 27.6 35.3 27.3 35.6 27 36 27 L37 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 40.2 L20.2 40.75 21 41 21.75 40.75 21.75 40.8 22 40.2 22 34 Q22 33.6 22.3 33.3 22.6 33 23 33 23.4 33 23.7 33.3 L24 34 24 40.2 Q24 41.35 23.1 42.25 L23.05 42.3 Q22.15 43 21 43 19.75 43 18.9 42.3 L18.85 42.2 Q18 41.35 18 40.2 L18 34 Q18 33.6 18.3 33.3 18.6 33 19 33 19.4 33 19.7 33.3 L20 34 20 40.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.1 39 L27 39 27 42 26.7 42.7 26 43 Q25.6 43 25.3 42.7 25 42.4 25 42 L25 34 Q25 33.6 25.3 33.3 25.6 33 26 33 L28.05 33 Q29.25 33 30.1 33.85 31 34.75 31 36 31 37.25 30.1 38.1 L30.1 38.15 29.45 38.65 29.35 38.7 28.1 39"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28.1 37 L28.45 36.9 28.7 36.7 28.75 36.7 29 36 28.7 35.25 28.05 35 27 35 27 37 28.1 37"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 24.8 Q25 23.65 25.85 22.8 L25.9 22.75 Q26.75 22 28 22 29.15 22 30.05 22.75 L30.1 22.8 Q31 23.65 31 24.8 L31 31 30.7 31.7 Q30.4 32 30 32 L29.3 31.7 Q29 31.4 29 31 L29 29 27 29 27 31 26.7 31.7 26 32 Q25.6 32 25.3 31.7 25 31.4 25 31 L25 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 24.8 L27 27 29 27 29 24.8 28.75 24.25 28.75 24.3 Q28.45 24 28 24 27.55 24 27.2 24.3 L27.25 24.2 27 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.1 28 L20 28 20 31 19.7 31.7 19 32 Q18.6 32 18.3 31.7 18 31.4 18 31 L18 23 Q18 22.6 18.3 22.3 18.6 22 19 22 L21.05 22 Q22.25 22 23.1 22.85 24 23.75 24 25 24 26.25 23.1 27.1 L23.1 27.15 22.45 27.65 22.35 27.7 21.1 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.1 26 L21.45 25.9 21.7 25.7 21.75 25.7 22 25 21.7 24.25 21.05 24 20 24 20 26 21.1 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M44 26 Q44.4 26 44.7 26.3 L45 27 44.7 27.7 44 28 41 28 41 30 44 30 Q44.4 30 44.7 30.3 L45 31 44.7 31.7 44 32 40 32 Q39.6 32 39.3 31.7 39 31.4 39 31 L39 23 Q39 22.6 39.3 22.3 39.6 22 40 22 L44 22 Q44.4 22 44.7 22.3 L45 23 44.7 23.7 44 24 41 24 41 26 44 26 M37 27 Q37.4 27 37.7 27.3 L38 28 38 29.25 Q38 30.35 37.1 31.25 L37.05 31.3 Q36.15 32 35 32 33.75 32 32.9 31.3 L32.85 31.2 Q32 30.35 32 29.25 L32 24.8 Q32 23.65 32.85 22.8 L32.9 22.75 Q33.75 22 35 22 36.15 22 37.05 22.75 L37.1 22.8 Q38 23.65 38 24.8 L37.7 25.5 37 25.8 36.3 25.5 Q36 25.2 36 24.8 L35.75 24.25 35.75 24.3 Q35.45 24 35 24 34.55 24 34.2 24.3 L34.25 24.2 Q34 24.45 34 24.8 L34 29.25 34.2 29.75 35 30 35.75 29.75 35.75 29.8 36 29.25 36 29 Q35.6 29 35.3 28.7 L35 28 Q35 27.6 35.3 27.3 35.6 27 36 27 L37 27 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M20 40.2 L20.2 40.75 21 41 21.75 40.75 21.75 40.8 22 40.2 22 34 Q22 33.6 22.3 33.3 22.6 33 23 33 23.4 33 23.7 33.3 L24 34 24 40.2 Q24 41.35 23.1 42.25 L23.05 42.3 Q22.15 43 21 43 19.75 43 18.9 42.3 L18.85 42.2 Q18 41.35 18 40.2 L18 34 Q18 33.6 18.3 33.3 18.6 33 19 33 19.4 33 19.7 33.3 L20 34 20 40.2 M28.1 39 L27 39 27 42 26.7 42.7 26 43 Q25.6 43 25.3 42.7 25 42.4 25 42 L25 34 Q25 33.6 25.3 33.3 25.6 33 26 33 L28.05 33 Q29.25 33 30.1 33.85 31 34.75 31 36 31 37.25 30.1 38.1 L30.1 38.15 29.45 38.65 29.35 38.7 28.1 39 M28.1 37 L28.45 36.9 28.7 36.7 28.75 36.7 29 36 28.7 35.25 28.05 35 27 35 27 37 28.1 37 M25 24.8 Q25 23.65 25.85 22.8 L25.9 22.75 Q26.75 22 28 22 29.15 22 30.05 22.75 L30.1 22.8 Q31 23.65 31 24.8 L31 31 30.7 31.7 Q30.4 32 30 32 L29.3 31.7 Q29 31.4 29 31 L29 29 27 29 27 31 26.7 31.7 26 32 Q25.6 32 25.3 31.7 25 31.4 25 31 L25 24.8 M27 24.8 L27 27 29 27 29 24.8 28.75 24.25 28.75 24.3 Q28.45 24 28 24 27.55 24 27.2 24.3 L27.25 24.2 27 24.8 M21.1 28 L20 28 20 31 19.7 31.7 19 32 Q18.6 32 18.3 31.7 18 31.4 18 31 L18 23 Q18 22.6 18.3 22.3 18.6 22 19 22 L21.05 22 Q22.25 22 23.1 22.85 24 23.75 24 25 24 26.25 23.1 27.1 L23.1 27.15 22.45 27.65 22.35 27.7 21.1 28 M21.1 26 L21.45 25.9 21.7 25.7 21.75 25.7 22 25 21.7 24.25 21.05 24 20 24 20 26 21.1 26 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ii=p({name:`KeyboardPageDownIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44 22 Q44.4 22 44.7 22.3 L45 23 44.7 23.7 44 24 41 24 41 26 44 26 Q44.4 26 44.7 26.3 L45 27 44.7 27.7 44 28 41 28 41 30 44 30 Q44.4 30 44.7 30.3 L45 31 44.7 31.7 44 32 40 32 Q39.6 32 39.3 31.7 39 31.4 39 31 L39 23 Q39 22.6 39.3 22.3 39.6 22 40 22 L44 22"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26.95 35.8 L26.95 40.25 27.15 40.75 27.95 41 28.7 40.75 28.7 40.8 28.95 40.25 28.95 35.8 28.7 35.25 28.7 35.3 27.95 35 Q27.5 35 27.15 35.3 L27.2 35.2 Q26.95 35.45 26.95 35.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25.8 33.8 L25.85 33.75 Q26.7 33 27.95 33 29.1 33 30 33.75 L30.05 33.8 Q30.95 34.65 30.95 35.8 L30.95 40.25 Q30.95 41.35 30.05 42.25 L30 42.3 Q29.1 43 27.95 43 26.7 43 25.85 42.3 L25.8 42.2 Q24.95 41.35 24.95 40.25 L24.95 35.8 Q24.95 34.65 25.8 33.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.95 34.15 Q31.9 33.7 32.15 33.4 32.4 33.05 32.85 33 33.25 32.95 33.6 33.2 L33.95 33.9 34.65 39.2 35.15 38.45 35.65 38.05 36.3 38.05 36.8 38.45 37.3 39.2 37.95 33.9 Q38 33.45 38.35 33.2 38.65 32.95 39.1 33 39.5 33.05 39.75 33.4 L39.95 34.15 38.95 42.15 38.7 42.7 38.2 43 37.6 42.95 37.15 42.55 35.95 40.8 34.8 42.55 34.35 42.95 33.75 43 33.2 42.7 32.95 42.15 31.95 34.15"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.05 35 L20 35 20 41 21.05 41 21.75 40.75 21.75 40.8 22 40.25 22 35.8 21.75 35.25 21.75 35.3 Q21.45 35 21.05 35"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23.05 33.75 L23.1 33.8 Q24 34.65 24 35.8 L24 40.25 Q24 41.35 23.1 42.25 L23.05 42.3 Q22.15 43 21.05 43 L19 43 Q18.6 43 18.3 42.7 18 42.4 18 42 L18 34 Q18 33.6 18.3 33.3 18.6 33 19 33 L21.05 33 Q22.15 33 23.05 33.75"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.95 27 L37.65 27.3 37.95 28 37.95 29.25 Q37.95 30.35 37.05 31.25 L37 31.3 Q36.1 32 34.95 32 33.7 32 32.85 31.3 L32.8 31.2 Q31.95 30.35 31.95 29.25 L31.95 24.8 Q31.95 23.65 32.8 22.8 L32.85 22.75 Q33.7 22 34.95 22 36.1 22 37 22.75 L37.05 22.8 Q37.95 23.65 37.95 24.8 L37.65 25.5 36.95 25.8 Q36.55 25.8 36.25 25.5 35.95 25.2 35.95 24.8 L35.7 24.25 35.7 24.3 34.95 24 Q34.5 24 34.15 24.3 L34.2 24.2 Q33.95 24.45 33.95 24.8 L33.95 29.25 34.15 29.75 34.95 30 35.7 29.75 35.7 29.8 35.95 29.25 35.95 29 35.25 28.7 Q34.95 28.4 34.95 28 34.95 27.6 35.25 27.3 35.55 27 35.95 27 L36.95 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27 24.8 L27 27 29 27 29 24.8 28.75 24.25 28.75 24.3 Q28.45 24 28 24 27.55 24 27.2 24.3 L27.25 24.2 27 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 24.8 Q25 23.65 25.85 22.8 L25.9 22.75 Q26.75 22 28 22 29.15 22 30.05 22.75 L30.1 22.8 Q31 23.65 31 24.8 L31 31 30.7 31.7 Q30.4 32 30 32 L29.3 31.7 Q29 31.4 29 31 L29 29 27 29 27 31 26.7 31.7 26 32 Q25.6 32 25.3 31.7 25 31.4 25 31 L25 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.1 28 L20 28 20 31 19.7 31.7 19 32 Q18.6 32 18.3 31.7 18 31.4 18 31 L18 23 Q18 22.6 18.3 22.3 18.6 22 19 22 L21.05 22 Q22.25 22 23.1 22.85 24 23.75 24 25 24 26.25 23.1 27.1 L23.1 27.15 22.45 27.65 22.35 27.7 21.1 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.1 26 L21.45 25.9 21.7 25.7 21.75 25.7 22 25 21.7 24.25 21.05 24 20 24 20 26 21.1 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.95 42 L46.75 42.65 46.2 43 45.55 42.9 45.05 42.45 42.95 38.25 42.95 42 42.65 42.7 41.95 43 Q41.55 43 41.25 42.7 40.95 42.4 40.95 42 L40.95 34 Q40.95 33.65 41.2 33.4 41.4 33.1 41.75 33.05 L42.4 33.1 42.85 33.55 44.95 37.75 44.95 34 Q44.95 33.6 45.25 33.3 45.55 33 45.95 33 46.35 33 46.65 33.3 L46.95 34 46.95 42"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M44 22 Q44.4 22 44.7 22.3 L45 23 44.7 23.7 44 24 41 24 41 26 44 26 Q44.4 26 44.7 26.3 L45 27 44.7 27.7 44 28 41 28 41 30 44 30 Q44.4 30 44.7 30.3 L45 31 44.7 31.7 44 32 40 32 Q39.6 32 39.3 31.7 39 31.4 39 31 L39 23 Q39 22.6 39.3 22.3 39.6 22 40 22 L44 22 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M26.95 35.8 L26.95 40.25 27.15 40.75 27.95 41 28.7 40.75 28.7 40.8 28.95 40.25 28.95 35.8 28.7 35.25 28.7 35.3 27.95 35 Q27.5 35 27.15 35.3 L27.2 35.2 Q26.95 35.45 26.95 35.8 M25.8 33.8 L25.85 33.75 Q26.7 33 27.95 33 29.1 33 30 33.75 L30.05 33.8 Q30.95 34.65 30.95 35.8 L30.95 40.25 Q30.95 41.35 30.05 42.25 L30 42.3 Q29.1 43 27.95 43 26.7 43 25.85 42.3 L25.8 42.2 Q24.95 41.35 24.95 40.25 L24.95 35.8 Q24.95 34.65 25.8 33.8 M31.95 34.15 Q31.9 33.7 32.15 33.4 32.4 33.05 32.85 33 33.25 32.95 33.6 33.2 L33.95 33.9 34.65 39.2 35.15 38.45 35.65 38.05 36.3 38.05 36.8 38.45 37.3 39.2 37.95 33.9 Q38 33.45 38.35 33.2 38.65 32.95 39.1 33 39.5 33.05 39.75 33.4 L39.95 34.15 38.95 42.15 38.7 42.7 38.2 43 37.6 42.95 37.15 42.55 35.95 40.8 34.8 42.55 34.35 42.95 33.75 43 33.2 42.7 32.95 42.15 31.95 34.15 M21.05 35 L20 35 20 41 21.05 41 21.75 40.75 21.75 40.8 22 40.25 22 35.8 21.75 35.25 21.75 35.3 Q21.45 35 21.05 35 M23.05 33.75 L23.1 33.8 Q24 34.65 24 35.8 L24 40.25 Q24 41.35 23.1 42.25 L23.05 42.3 Q22.15 43 21.05 43 L19 43 Q18.6 43 18.3 42.7 18 42.4 18 42 L18 34 Q18 33.6 18.3 33.3 18.6 33 19 33 L21.05 33 Q22.15 33 23.05 33.75 M36.95 27 L37.65 27.3 37.95 28 37.95 29.25 Q37.95 30.35 37.05 31.25 L37 31.3 Q36.1 32 34.95 32 33.7 32 32.85 31.3 L32.8 31.2 Q31.95 30.35 31.95 29.25 L31.95 24.8 Q31.95 23.65 32.8 22.8 L32.85 22.75 Q33.7 22 34.95 22 36.1 22 37 22.75 L37.05 22.8 Q37.95 23.65 37.95 24.8 L37.65 25.5 36.95 25.8 Q36.55 25.8 36.25 25.5 35.95 25.2 35.95 24.8 L35.7 24.25 35.7 24.3 34.95 24 Q34.5 24 34.15 24.3 L34.2 24.2 Q33.95 24.45 33.95 24.8 L33.95 29.25 34.15 29.75 34.95 30 35.7 29.75 35.7 29.8 35.95 29.25 35.95 29 35.25 28.7 Q34.95 28.4 34.95 28 34.95 27.6 35.25 27.3 35.55 27 35.95 27 L36.95 27 M27 24.8 L27 27 29 27 29 24.8 28.75 24.25 28.75 24.3 Q28.45 24 28 24 27.55 24 27.2 24.3 L27.25 24.2 27 24.8 M25 24.8 Q25 23.65 25.85 22.8 L25.9 22.75 Q26.75 22 28 22 29.15 22 30.05 22.75 L30.1 22.8 Q31 23.65 31 24.8 L31 31 30.7 31.7 Q30.4 32 30 32 L29.3 31.7 Q29 31.4 29 31 L29 29 27 29 27 31 26.7 31.7 26 32 Q25.6 32 25.3 31.7 25 31.4 25 31 L25 24.8 M21.1 28 L20 28 20 31 19.7 31.7 19 32 Q18.6 32 18.3 31.7 18 31.4 18 31 L18 23 Q18 22.6 18.3 22.3 18.6 22 19 22 L21.05 22 Q22.25 22 23.1 22.85 24 23.75 24 25 24 26.25 23.1 27.1 L23.1 27.15 22.45 27.65 22.35 27.7 21.1 28 M21.1 26 L21.45 25.9 21.7 25.7 21.75 25.7 22 25 21.7 24.25 21.05 24 20 24 20 26 21.1 26 M46.95 42 L46.75 42.65 46.2 43 45.55 42.9 45.05 42.45 42.95 38.25 42.95 42 42.65 42.7 41.95 43 Q41.55 43 41.25 42.7 40.95 42.4 40.95 42 L40.95 34 Q40.95 33.65 41.2 33.4 41.4 33.1 41.75 33.05 L42.4 33.1 42.85 33.55 44.95 37.75 44.95 34 Q44.95 33.6 45.25 33.3 45.55 33 45.95 33 46.35 33 46.65 33.3 L46.95 34 46.95 42"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Li=p({name:`KeyboardPrintscreenIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M36.1 37 L36.45 36.9 36.7 36.7 36.75 36.7 37 36 36.7 35.25 Q36.45 35 36.05 35 L35 35 35 37 36.1 37"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.1 42.25 L31.05 42.3 Q30.15 43 29 43 27.75 43 26.9 42.3 L26.85 42.2 Q26 41.35 26 40.25 L26 35.8 Q26 34.65 26.85 33.8 L26.9 33.75 Q27.75 33 29 33 30.15 33 31.05 33.75 L31.1 33.8 Q32 34.65 32 35.8 L31.7 36.5 31 36.8 Q30.6 36.8 30.3 36.5 30 36.2 30 35.8 L29.75 35.25 29.75 35.3 Q29.45 35 29 35 28.55 35 28.2 35.3 L28.25 35.2 Q28 35.45 28 35.8 L28 40.25 28.2 40.75 29 41 29.75 40.75 29.75 40.8 30 40.25 Q30 39.85 30.3 39.55 30.6 39.25 31 39.25 31.4 39.25 31.7 39.55 L32 40.25 Q32 41.35 31.1 42.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.1 38.1 L38.1 38.15 37.45 38.65 38.9 41.55 38.95 42.35 38.45 42.9 37.7 42.95 Q37.3 42.8 37.1 42.45 L35.4 39 35 39 35 42 34.7 42.7 Q34.4 43 34 43 L33.3 42.7 Q33 42.4 33 42 L33 34 Q33 33.6 33.3 33.3 33.6 33 34 33 L36.05 33 Q37.25 33 38.1 33.85 39 34.75 39 36 39 37.25 38.1 38.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 35 Q21.6 35 21.3 35.3 21 35.6 21 36 21 36.4 21.3 36.7 21.6 37 21.95 37 L22.05 37 Q23.2 37 24.1 37.9 25 38.8 25 40 25 41.2 24.1 42.1 23.2 43 22 43 L20 43 19.3 42.7 Q19 42.4 19 42 19 41.6 19.3 41.3 19.6 41 20 41 L22 41 22.7 40.7 23 40 22.7 39.3 22.05 39 21.95 39 Q20.8 39 19.9 38.1 19 37.2 19 36 19 34.8 19.9 33.9 20.8 33 22 33 L24 33 Q24.4 33 24.7 33.3 L25 34 24.7 34.7 24 35 22 35"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 31 L36.7 31.7 36 32 Q35.6 32 35.3 31.7 L35 31 35 24 34 24 33.3 23.7 Q33 23.4 33 23 33 22.6 33.3 22.3 33.6 22 34 22 L38 22 38.7 22.3 39 23 38.7 23.7 38 24 37 24 37 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 31 L20.7 31.7 20 32 19.3 31.7 Q19 31.4 19 31 L19 23 Q19 22.6 19.3 22.3 19.6 22 20 22 L22.05 22 Q23.25 22 24.1 22.85 25 23.75 25 25 25 26.25 24.1 27.1 L24.1 27.15 23.45 27.65 23.35 27.7 22.1 28 21 28 21 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22.1 26 L22.45 25.9 22.7 25.7 22.75 25.7 23 25 22.7 24.25 22.05 24 21 24 21 26 22.1 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.1 27.1 L31.1 27.15 30.45 27.65 31.9 30.55 31.95 31.35 31.45 31.9 30.7 31.95 Q30.3 31.8 30.1 31.45 L28.4 28 28 28 28 31 27.7 31.7 Q27.4 32 27 32 L26.3 31.7 26 31 26 23 Q26 22.6 26.3 22.3 26.6 22 27 22 L29.05 22 Q30.25 22 31.1 22.85 32 23.75 32 25 32 26.25 31.1 27.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29.1 26 L29.45 25.9 29.7 25.7 29.75 25.7 30 25 29.7 24.25 Q29.45 24 29.05 24 L28 24 28 26 29.1 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46 42 L45.8 42.65 45.25 43 44.6 42.9 Q44.25 42.75 44.1 42.45 L42 38.25 42 42 41.7 42.7 41 43 40.3 42.7 Q40 42.4 40 42 L40 34 Q40 33.65 40.25 33.4 40.45 33.1 40.8 33.05 L41.45 33.1 41.9 33.55 44 37.75 44 34 Q44 33.6 44.3 33.3 44.6 33 45 33 45.4 33 45.7 33.3 L46 34 46 42"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M36.1 37 L36.45 36.9 36.7 36.7 36.75 36.7 37 36 36.7 35.25 Q36.45 35 36.05 35 L35 35 35 37 36.1 37 M31.1 42.25 L31.05 42.3 Q30.15 43 29 43 27.75 43 26.9 42.3 L26.85 42.2 Q26 41.35 26 40.25 L26 35.8 Q26 34.65 26.85 33.8 L26.9 33.75 Q27.75 33 29 33 30.15 33 31.05 33.75 L31.1 33.8 Q32 34.65 32 35.8 L31.7 36.5 31 36.8 Q30.6 36.8 30.3 36.5 30 36.2 30 35.8 L29.75 35.25 29.75 35.3 Q29.45 35 29 35 28.55 35 28.2 35.3 L28.25 35.2 Q28 35.45 28 35.8 L28 40.25 28.2 40.75 29 41 29.75 40.75 29.75 40.8 30 40.25 Q30 39.85 30.3 39.55 30.6 39.25 31 39.25 31.4 39.25 31.7 39.55 L32 40.25 Q32 41.35 31.1 42.25 M38.1 38.1 L38.1 38.15 37.45 38.65 38.9 41.55 38.95 42.35 38.45 42.9 37.7 42.95 Q37.3 42.8 37.1 42.45 L35.4 39 35 39 35 42 34.7 42.7 Q34.4 43 34 43 L33.3 42.7 Q33 42.4 33 42 L33 34 Q33 33.6 33.3 33.3 33.6 33 34 33 L36.05 33 Q37.25 33 38.1 33.85 39 34.75 39 36 39 37.25 38.1 38.1 M22 35 Q21.6 35 21.3 35.3 21 35.6 21 36 21 36.4 21.3 36.7 21.6 37 21.95 37 L22.05 37 Q23.2 37 24.1 37.9 25 38.8 25 40 25 41.2 24.1 42.1 23.2 43 22 43 L20 43 19.3 42.7 Q19 42.4 19 42 19 41.6 19.3 41.3 19.6 41 20 41 L22 41 22.7 40.7 23 40 22.7 39.3 22.05 39 21.95 39 Q20.8 39 19.9 38.1 19 37.2 19 36 19 34.8 19.9 33.9 20.8 33 22 33 L24 33 Q24.4 33 24.7 33.3 L25 34 24.7 34.7 24 35 22 35 M37 31 L36.7 31.7 36 32 Q35.6 32 35.3 31.7 L35 31 35 24 34 24 33.3 23.7 Q33 23.4 33 23 33 22.6 33.3 22.3 33.6 22 34 22 L38 22 38.7 22.3 39 23 38.7 23.7 38 24 37 24 37 31 M21 31 L20.7 31.7 20 32 19.3 31.7 Q19 31.4 19 31 L19 23 Q19 22.6 19.3 22.3 19.6 22 20 22 L22.05 22 Q23.25 22 24.1 22.85 25 23.75 25 25 25 26.25 24.1 27.1 L24.1 27.15 23.45 27.65 23.35 27.7 22.1 28 21 28 21 31 M22.1 26 L22.45 25.9 22.7 25.7 22.75 25.7 23 25 22.7 24.25 22.05 24 21 24 21 26 22.1 26 M31.1 27.1 L31.1 27.15 30.45 27.65 31.9 30.55 31.95 31.35 31.45 31.9 30.7 31.95 Q30.3 31.8 30.1 31.45 L28.4 28 28 28 28 31 27.7 31.7 Q27.4 32 27 32 L26.3 31.7 26 31 26 23 Q26 22.6 26.3 22.3 26.6 22 27 22 L29.05 22 Q30.25 22 31.1 22.85 32 23.75 32 25 32 26.25 31.1 27.1 M29.1 26 L29.45 25.9 29.7 25.7 29.75 25.7 30 25 29.7 24.25 Q29.45 24 29.05 24 L28 24 28 26 29.1 26 M46 42 L45.8 42.65 45.25 43 44.6 42.9 Q44.25 42.75 44.1 42.45 L42 38.25 42 42 41.7 42.7 41 43 40.3 42.7 Q40 42.4 40 42 L40 34 Q40 33.65 40.25 33.4 40.45 33.1 40.8 33.05 L41.45 33.1 41.9 33.55 44 37.75 44 34 Q44 33.6 44.3 33.3 44.6 33 45 33 45.4 33 45.7 33.3 L46 34 46 42 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ri=p({name:`KeyboardScrollLockIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 23 Q42 22.6 42.3 22.3 42.6 22 43 22 43.4 22 43.7 22.3 L44 23 44 30 45 30 Q45.4 30 45.7 30.3 L46 31 45.7 31.7 45 32 43 32 Q42.6 32 42.3 31.7 42 31.4 42 31 L42 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 23 Q47 22.6 47.3 22.3 47.6 22 48 22 48.4 22 48.7 22.3 L49 23 49 30 50 30 50.7 30.3 51 31 50.7 31.7 50 32 48 32 47.3 31.7 47 31 47 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 35.8 L23 40.25 23.2 40.75 24 41 24.75 40.75 24.75 40.8 25 40.25 25 35.8 24.75 35.25 24.75 35.3 Q24.45 35 24 35 23.55 35 23.2 35.3 L23.25 35.2 Q23 35.45 23 35.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.85 33.8 L21.9 33.75 Q22.75 33 24 33 25.15 33 26.05 33.75 L26.1 33.8 Q27 34.65 27 35.8 L27 40.25 Q27 41.35 26.1 42.25 L26.05 42.3 Q25.15 43 24 43 22.75 43 21.9 42.3 L21.85 42.2 Q21 41.35 21 40.25 L21 35.8 Q21 34.65 21.85 33.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.1 42.25 L33.05 42.3 Q32.15 43 31 43 29.75 43 28.9 42.3 L28.85 42.2 Q28 41.35 28 40.25 L28 35.8 Q28 34.65 28.85 33.8 L28.9 33.75 Q29.75 33 31 33 32.15 33 33.05 33.75 L33.1 33.8 Q34 34.65 34 35.8 L33.7 36.5 33 36.8 32.3 36.5 Q32 36.2 32 35.8 L31.75 35.25 31.75 35.3 Q31.45 35 31 35 30.55 35 30.2 35.3 L30.25 35.2 30 35.8 30 40.25 30.2 40.75 31 41 31.75 40.75 31.75 40.8 32 40.25 Q32 39.85 32.3 39.55 32.6 39.25 33 39.25 33.4 39.25 33.7 39.55 L34 40.25 Q34 41.35 33.1 42.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M14 34 Q14 33.6 14.3 33.3 14.6 33 15 33 15.4 33 15.7 33.3 L16 34 16 41 19 41 Q19.4 41 19.7 41.3 L20 42 19.7 42.7 19 43 15 43 Q14.6 43 14.3 42.7 L14 42 14 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 24 Q16.6 24 16.3 24.3 16 24.6 16 25 16 25.4 16.3 25.7 L16.95 26 17.05 26 Q18.2 26 19.1 26.9 20 27.8 20 29 20 30.2 19.1 31.1 18.2 32 17 32 L15 32 Q14.6 32 14.3 31.7 L14 31 Q14 30.6 14.3 30.3 14.6 30 15 30 L17 30 17.7 29.7 18 29 17.7 28.3 Q17.4 28 17.05 28 L16.95 28 Q15.8 28 14.9 27.1 14 26.2 14 25 14 23.8 14.9 22.9 15.8 22 17 22 L19 22 Q19.4 22 19.7 22.3 L20 23 19.7 23.7 19 24 17 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 24.8 L37 29.25 37.2 29.75 38 30 38.75 29.75 38.75 29.8 39 29.25 39 24.8 38.75 24.25 38.75 24.3 Q38.45 24 38 24 37.55 24 37.2 24.3 L37.25 24.2 Q37 24.45 37 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.1 26 L31.45 25.9 31.7 25.7 31.75 25.7 32 25 31.7 24.25 31.05 24 30 24 30 26 31.1 26"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33.1 27.1 L33.1 27.15 32.45 27.65 33.9 30.55 33.95 31.35 33.45 31.9 32.7 31.95 Q32.3 31.8 32.1 31.45 L30.4 28 30 28 30 31 29.7 31.7 29 32 Q28.6 32 28.3 31.7 28 31.4 28 31 L28 23 Q28 22.6 28.3 22.3 28.6 22 29 22 L31.05 22 Q32.25 22 33.1 22.85 34 23.75 34 25 34 26.25 33.1 27.1"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26.1 31.25 L26.05 31.3 Q25.15 32 24 32 22.75 32 21.9 31.3 L21.85 31.2 Q21 30.35 21 29.25 L21 24.8 Q21 23.65 21.85 22.8 L21.9 22.75 Q22.75 22 24 22 25.15 22 26.05 22.75 L26.1 22.8 Q27 23.65 27 24.8 L26.7 25.5 26 25.8 Q25.6 25.8 25.3 25.5 25 25.2 25 24.8 L24.75 24.25 24.75 24.3 Q24.45 24 24 24 23.55 24 23.2 24.3 L23.25 24.2 Q23 24.45 23 24.8 L23 29.25 23.2 29.75 24 30 24.75 29.75 24.75 29.8 25 29.25 Q25 28.85 25.3 28.55 25.6 28.25 26 28.25 26.4 28.25 26.7 28.55 L27 29.25 Q27 30.35 26.1 31.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.9 41.55 Q41.1 41.95 40.95 42.35 L40.45 42.9 39.7 42.95 Q39.3 42.8 39.1 42.45 L37.4 39 37 39 37 42 36.7 42.7 36 43 Q35.6 43 35.3 42.7 L35 42 35 34 Q35 33.6 35.3 33.3 35.6 33 36 33 36.4 33 36.7 33.3 L37 34 37 37 37.4 37 39.1 33.55 Q39.3 33.2 39.7 33.05 L40.45 33.1 40.95 33.7 40.9 34.45 39.15 38 40.9 41.55"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.85 22.8 L35.9 22.75 Q36.75 22 38 22 39.15 22 40.05 22.75 L40.1 22.8 Q41 23.65 41 24.8 L41 29.25 Q41 30.35 40.1 31.25 L40.05 31.3 Q39.15 32 38 32 36.75 32 35.9 31.3 L35.85 31.2 Q35 30.35 35 29.25 L35 24.8 Q35 23.65 35.85 22.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M42 23 Q42 22.6 42.3 22.3 42.6 22 43 22 43.4 22 43.7 22.3 L44 23 44 30 45 30 Q45.4 30 45.7 30.3 L46 31 45.7 31.7 45 32 43 32 Q42.6 32 42.3 31.7 42 31.4 42 31 L42 23 M47 23 Q47 22.6 47.3 22.3 47.6 22 48 22 48.4 22 48.7 22.3 L49 23 49 30 50 30 50.7 30.3 51 31 50.7 31.7 50 32 48 32 47.3 31.7 47 31 47 23 M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M23 35.8 L23 40.25 23.2 40.75 24 41 24.75 40.75 24.75 40.8 25 40.25 25 35.8 24.75 35.25 24.75 35.3 Q24.45 35 24 35 23.55 35 23.2 35.3 L23.25 35.2 Q23 35.45 23 35.8 M21.85 33.8 L21.9 33.75 Q22.75 33 24 33 25.15 33 26.05 33.75 L26.1 33.8 Q27 34.65 27 35.8 L27 40.25 Q27 41.35 26.1 42.25 L26.05 42.3 Q25.15 43 24 43 22.75 43 21.9 42.3 L21.85 42.2 Q21 41.35 21 40.25 L21 35.8 Q21 34.65 21.85 33.8 M33.1 42.25 L33.05 42.3 Q32.15 43 31 43 29.75 43 28.9 42.3 L28.85 42.2 Q28 41.35 28 40.25 L28 35.8 Q28 34.65 28.85 33.8 L28.9 33.75 Q29.75 33 31 33 32.15 33 33.05 33.75 L33.1 33.8 Q34 34.65 34 35.8 L33.7 36.5 33 36.8 32.3 36.5 Q32 36.2 32 35.8 L31.75 35.25 31.75 35.3 Q31.45 35 31 35 30.55 35 30.2 35.3 L30.25 35.2 30 35.8 30 40.25 30.2 40.75 31 41 31.75 40.75 31.75 40.8 32 40.25 Q32 39.85 32.3 39.55 32.6 39.25 33 39.25 33.4 39.25 33.7 39.55 L34 40.25 Q34 41.35 33.1 42.25 M14 34 Q14 33.6 14.3 33.3 14.6 33 15 33 15.4 33 15.7 33.3 L16 34 16 41 19 41 Q19.4 41 19.7 41.3 L20 42 19.7 42.7 19 43 15 43 Q14.6 43 14.3 42.7 L14 42 14 34 M17 24 Q16.6 24 16.3 24.3 16 24.6 16 25 16 25.4 16.3 25.7 L16.95 26 17.05 26 Q18.2 26 19.1 26.9 20 27.8 20 29 20 30.2 19.1 31.1 18.2 32 17 32 L15 32 Q14.6 32 14.3 31.7 L14 31 Q14 30.6 14.3 30.3 14.6 30 15 30 L17 30 17.7 29.7 18 29 17.7 28.3 Q17.4 28 17.05 28 L16.95 28 Q15.8 28 14.9 27.1 14 26.2 14 25 14 23.8 14.9 22.9 15.8 22 17 22 L19 22 Q19.4 22 19.7 22.3 L20 23 19.7 23.7 19 24 17 24 M37 24.8 L37 29.25 37.2 29.75 38 30 38.75 29.75 38.75 29.8 39 29.25 39 24.8 38.75 24.25 38.75 24.3 Q38.45 24 38 24 37.55 24 37.2 24.3 L37.25 24.2 Q37 24.45 37 24.8 M31.1 26 L31.45 25.9 31.7 25.7 31.75 25.7 32 25 31.7 24.25 31.05 24 30 24 30 26 31.1 26 M33.1 27.1 L33.1 27.15 32.45 27.65 33.9 30.55 33.95 31.35 33.45 31.9 32.7 31.95 Q32.3 31.8 32.1 31.45 L30.4 28 30 28 30 31 29.7 31.7 29 32 Q28.6 32 28.3 31.7 28 31.4 28 31 L28 23 Q28 22.6 28.3 22.3 28.6 22 29 22 L31.05 22 Q32.25 22 33.1 22.85 34 23.75 34 25 34 26.25 33.1 27.1 M26.1 31.25 L26.05 31.3 Q25.15 32 24 32 22.75 32 21.9 31.3 L21.85 31.2 Q21 30.35 21 29.25 L21 24.8 Q21 23.65 21.85 22.8 L21.9 22.75 Q22.75 22 24 22 25.15 22 26.05 22.75 L26.1 22.8 Q27 23.65 27 24.8 L26.7 25.5 26 25.8 Q25.6 25.8 25.3 25.5 25 25.2 25 24.8 L24.75 24.25 24.75 24.3 Q24.45 24 24 24 23.55 24 23.2 24.3 L23.25 24.2 Q23 24.45 23 24.8 L23 29.25 23.2 29.75 24 30 24.75 29.75 24.75 29.8 25 29.25 Q25 28.85 25.3 28.55 25.6 28.25 26 28.25 26.4 28.25 26.7 28.55 L27 29.25 Q27 30.35 26.1 31.25 M40.9 41.55 Q41.1 41.95 40.95 42.35 L40.45 42.9 39.7 42.95 Q39.3 42.8 39.1 42.45 L37.4 39 37 39 37 42 36.7 42.7 36 43 Q35.6 43 35.3 42.7 L35 42 35 34 Q35 33.6 35.3 33.3 35.6 33 36 33 36.4 33 36.7 33.3 L37 34 37 37 37.4 37 39.1 33.55 Q39.3 33.2 39.7 33.05 L40.45 33.1 40.95 33.7 40.9 34.45 39.15 38 40.9 41.55 M35.85 22.8 L35.9 22.75 Q36.75 22 38 22 39.15 22 40.05 22.75 L40.1 22.8 Q41 23.65 41 24.8 L41 29.25 Q41 30.35 40.1 31.25 L40.05 31.3 Q39.15 32 38 32 36.75 32 35.9 31.3 L35.85 31.2 Q35 30.35 35 29.25 L35 24.8 Q35 23.65 35.85 22.8 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),zi=p({name:`KeyboardPauseIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22.05 29.8 Q22.05 28.65 22.9 27.8 L22.95 27.75 Q23.8 27 25.05 27 26.2 27 27.1 27.75 L27.15 27.8 Q28.05 28.65 28.05 29.8 L28.05 36 27.75 36.7 27.05 37 Q26.65 37 26.35 36.7 26.05 36.4 26.05 36 L26.05 34 24.05 34 24.05 36 23.75 36.7 23.05 37 Q22.65 37 22.35 36.7 22.05 36.4 22.05 36 L22.05 29.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M24.05 29.8 L24.05 32 26.05 32 26.05 29.8 25.8 29.25 25.8 29.3 Q25.5 29 25.05 29 24.6 29 24.25 29.3 L24.3 29.2 Q24.05 29.45 24.05 29.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M31.05 34.2 L31.25 34.75 32.05 35 32.8 34.75 32.8 34.8 33.05 34.2 33.05 28 Q33.05 27.6 33.35 27.3 33.65 27 34.05 27 34.45 27 34.75 27.3 L35.05 28 35.05 34.2 Q35.05 35.35 34.15 36.25 L34.1 36.3 Q33.2 37 32.05 37 30.8 37 29.95 36.3 L29.9 36.2 Q29.05 35.35 29.05 34.2 L29.05 28 Q29.05 27.6 29.35 27.3 29.65 27 30.05 27 L30.75 27.3 31.05 28 31.05 34.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18.1 31 L18.45 30.9 18.7 30.7 18.75 30.7 19 30 18.7 29.25 18.05 29 17 29 17 31 18.1 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18.1 33 L17 33 17 36 16.7 36.7 16 37 15.3 36.7 Q15 36.4 15 36 L15 28 Q15 27.6 15.3 27.3 15.6 27 16 27 L18.05 27 Q19.25 27 20.1 27.85 21 28.75 21 30 21 31.25 20.1 32.1 L20.1 32.15 19.45 32.65 19.35 32.7 18.1 33"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39.05 29 Q38.65 29 38.35 29.3 38.05 29.6 38.05 30 38.05 30.4 38.35 30.7 38.65 31 39 31 L39.1 31 Q40.25 31 41.15 31.9 42.05 32.8 42.05 34 42.05 35.2 41.15 36.1 40.25 37 39.05 37 L37.05 37 Q36.65 37 36.35 36.7 L36.05 36 Q36.05 35.6 36.35 35.3 36.65 35 37.05 35 L39.05 35 39.75 34.7 40.05 34 39.75 33.3 Q39.45 33 39.1 33 L39 33 Q37.85 33 36.95 32.1 36.05 31.2 36.05 30 36.05 28.8 36.95 27.9 37.85 27 39.05 27 L41.05 27 Q41.45 27 41.75 27.3 L42.05 28 41.75 28.7 41.05 29 39.05 29"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48.05 27 Q48.45 27 48.75 27.3 L49.05 28 48.75 28.7 48.05 29 45.05 29 45.05 31 48.05 31 Q48.45 31 48.75 31.3 L49.05 32 48.75 32.7 48.05 33 45.05 33 45.05 35 48.05 35 Q48.45 35 48.75 35.3 L49.05 36 48.75 36.7 48.05 37 44.05 37 Q43.65 37 43.35 36.7 43.05 36.4 43.05 36 L43.05 28 Q43.05 27.6 43.35 27.3 43.65 27 44.05 27 L48.05 27"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M22.05 29.8 Q22.05 28.65 22.9 27.8 L22.95 27.75 Q23.8 27 25.05 27 26.2 27 27.1 27.75 L27.15 27.8 Q28.05 28.65 28.05 29.8 L28.05 36 27.75 36.7 27.05 37 Q26.65 37 26.35 36.7 26.05 36.4 26.05 36 L26.05 34 24.05 34 24.05 36 23.75 36.7 23.05 37 Q22.65 37 22.35 36.7 22.05 36.4 22.05 36 L22.05 29.8 M24.05 29.8 L24.05 32 26.05 32 26.05 29.8 25.8 29.25 25.8 29.3 Q25.5 29 25.05 29 24.6 29 24.25 29.3 L24.3 29.2 Q24.05 29.45 24.05 29.8 M31.05 34.2 L31.25 34.75 32.05 35 32.8 34.75 32.8 34.8 33.05 34.2 33.05 28 Q33.05 27.6 33.35 27.3 33.65 27 34.05 27 34.45 27 34.75 27.3 L35.05 28 35.05 34.2 Q35.05 35.35 34.15 36.25 L34.1 36.3 Q33.2 37 32.05 37 30.8 37 29.95 36.3 L29.9 36.2 Q29.05 35.35 29.05 34.2 L29.05 28 Q29.05 27.6 29.35 27.3 29.65 27 30.05 27 L30.75 27.3 31.05 28 31.05 34.2 M18.1 31 L18.45 30.9 18.7 30.7 18.75 30.7 19 30 18.7 29.25 18.05 29 17 29 17 31 18.1 31 M18.1 33 L17 33 17 36 16.7 36.7 16 37 15.3 36.7 Q15 36.4 15 36 L15 28 Q15 27.6 15.3 27.3 15.6 27 16 27 L18.05 27 Q19.25 27 20.1 27.85 21 28.75 21 30 21 31.25 20.1 32.1 L20.1 32.15 19.45 32.65 19.35 32.7 18.1 33 M39.05 29 Q38.65 29 38.35 29.3 38.05 29.6 38.05 30 38.05 30.4 38.35 30.7 38.65 31 39 31 L39.1 31 Q40.25 31 41.15 31.9 42.05 32.8 42.05 34 42.05 35.2 41.15 36.1 40.25 37 39.05 37 L37.05 37 Q36.65 37 36.35 36.7 L36.05 36 Q36.05 35.6 36.35 35.3 36.65 35 37.05 35 L39.05 35 39.75 34.7 40.05 34 39.75 33.3 Q39.45 33 39.1 33 L39 33 Q37.85 33 36.95 32.1 36.05 31.2 36.05 30 36.05 28.8 36.95 27.9 37.85 27 39.05 27 L41.05 27 Q41.45 27 41.75 27.3 L42.05 28 41.75 28.7 41.05 29 39.05 29 M48.05 27 Q48.45 27 48.75 27.3 L49.05 28 48.75 28.7 48.05 29 45.05 29 45.05 31 48.05 31 Q48.45 31 48.75 31.3 L49.05 32 48.75 32.7 48.05 33 45.05 33 45.05 35 48.05 35 Q48.45 35 48.75 35.3 L49.05 36 48.75 36.7 48.05 37 44.05 37 Q43.65 37 43.35 36.7 43.05 36.4 43.05 36 L43.05 28 Q43.05 27.6 43.35 27.3 43.65 27 44.05 27 L48.05 27 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),Bi=p({name:`KeyboardNumlockIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 29.2 L28.2 29.75 29 30 29.75 29.75 29.75 29.8 30 29.2 30 23 Q30 22.6 30.3 22.3 30.6 22 31 22 31.4 22 31.7 22.3 L32 23 32 29.2 Q32 30.35 31.1 31.25 L31.05 31.3 Q30.15 32 29 32 27.75 32 26.9 31.3 L26.85 31.2 Q26 30.35 26 29.2 L26 23 Q26 22.6 26.3 22.3 26.6 22 27 22 27.4 22 27.7 22.3 L28 23 28 29.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 31 L40.7 31.7 40 32 Q39.6 32 39.3 31.7 39 31.4 39 31 L39 25.4 37.7 26.7 37 27 36.3 26.7 35 25.4 35 31 34.7 31.7 Q34.4 32 34 32 L33.3 31.7 Q33 31.4 33 31 L33 23 Q33 22.6 33.3 22.3 33.6 22 34 22 34.4 22 34.7 22.3 L37 24.6 39.3 22.3 Q39.6 22 40 22 40.4 22 40.7 22.3 L41 23 41 31"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 34 Q19 33.6 19.3 33.3 19.6 33 20 33 20.4 33 20.7 33.3 L21 34 21 41 24 41 Q24.4 41 24.7 41.3 L25 42 24.7 42.7 24 43 20 43 19.3 42.7 Q19 42.4 19 42 L19 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M28 35.8 L28 40.25 28.2 40.75 29 41 29.75 40.75 29.75 40.8 30 40.25 30 35.8 29.75 35.25 29.75 35.3 Q29.45 35 29 35 28.55 35 28.2 35.3 L28.25 35.2 Q28 35.45 28 35.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M19 24.8 Q19 23.65 19.85 22.8 L19.9 22.75 Q20.75 22 22 22 23.15 22 24.05 22.75 L24.1 22.8 Q25 23.65 25 24.8 L25 31 24.7 31.7 24 32 Q23.6 32 23.3 31.7 23 31.4 23 31 L23 24.8 22.75 24.25 22.75 24.3 Q22.45 24 22 24 21.55 24 21.2 24.3 L21.25 24.2 21 24.8 21 31 20.7 31.7 20 32 19.3 31.7 Q19 31.4 19 31 L19 24.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M26.85 33.8 L26.9 33.75 Q27.75 33 29 33 30.15 33 31.05 33.75 L31.1 33.8 Q32 34.65 32 35.8 L32 40.25 Q32 41.35 31.1 42.25 L31.05 42.3 Q30.15 43 29 43 27.75 43 26.9 42.3 L26.85 42.2 Q26 41.35 26 40.25 L26 35.8 Q26 34.65 26.85 33.8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38.1 42.25 L38.05 42.3 Q37.15 43 36 43 34.75 43 33.9 42.3 L33.85 42.2 Q33 41.35 33 40.25 L33 35.8 Q33 34.65 33.85 33.8 L33.9 33.75 Q34.75 33 36 33 37.15 33 38.05 33.75 L38.1 33.8 Q39 34.65 39 35.8 L38.7 36.5 38 36.8 Q37.6 36.8 37.3 36.5 37 36.2 37 35.8 L36.75 35.25 36.75 35.3 Q36.45 35 36 35 35.55 35 35.2 35.3 L35.25 35.2 Q35 35.45 35 35.8 L35 40.25 35.2 40.75 36 41 36.75 40.75 36.75 40.8 37 40.25 Q37 39.85 37.3 39.55 37.6 39.25 38 39.25 L38.7 39.55 39 40.25 Q39 41.35 38.1 42.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 34 Q40 33.6 40.3 33.3 40.6 33 41 33 41.4 33 41.7 33.3 L42 34 42 37 42.4 37 44.1 33.55 Q44.3 33.2 44.7 33.05 L45.45 33.1 45.95 33.7 45.9 34.45 44.15 38 45.9 41.55 45.95 42.35 45.45 42.9 44.7 42.95 Q44.3 42.8 44.1 42.45 L42.4 39 42 39 42 42 41.7 42.7 41 43 40.3 42.7 Q40 42.4 40 42 L40 34"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    fill="#FFFFFF"
                    d="M28 29.2 L28.2 29.75 29 30 29.75 29.75 29.75 29.8 30 29.2 30 23 Q30 22.6 30.3 22.3 30.6 22 31 22 31.4 22 31.7 22.3 L32 23 32 29.2 Q32 30.35 31.1 31.25 L31.05 31.3 Q30.15 32 29 32 27.75 32 26.9 31.3 L26.85 31.2 Q26 30.35 26 29.2 L26 23 Q26 22.6 26.3 22.3 26.6 22 27 22 27.4 22 27.7 22.3 L28 23 28 29.2 M41 31 L40.7 31.7 40 32 Q39.6 32 39.3 31.7 39 31.4 39 31 L39 25.4 37.7 26.7 37 27 36.3 26.7 35 25.4 35 31 34.7 31.7 Q34.4 32 34 32 L33.3 31.7 Q33 31.4 33 31 L33 23 Q33 22.6 33.3 22.3 33.6 22 34 22 34.4 22 34.7 22.3 L37 24.6 39.3 22.3 Q39.6 22 40 22 40.4 22 40.7 22.3 L41 23 41 31 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M19 34 Q19 33.6 19.3 33.3 19.6 33 20 33 20.4 33 20.7 33.3 L21 34 21 41 24 41 Q24.4 41 24.7 41.3 L25 42 24.7 42.7 24 43 20 43 19.3 42.7 Q19 42.4 19 42 L19 34 M28 35.8 L28 40.25 28.2 40.75 29 41 29.75 40.75 29.75 40.8 30 40.25 30 35.8 29.75 35.25 29.75 35.3 Q29.45 35 29 35 28.55 35 28.2 35.3 L28.25 35.2 Q28 35.45 28 35.8 M19 24.8 Q19 23.65 19.85 22.8 L19.9 22.75 Q20.75 22 22 22 23.15 22 24.05 22.75 L24.1 22.8 Q25 23.65 25 24.8 L25 31 24.7 31.7 24 32 Q23.6 32 23.3 31.7 23 31.4 23 31 L23 24.8 22.75 24.25 22.75 24.3 Q22.45 24 22 24 21.55 24 21.2 24.3 L21.25 24.2 21 24.8 21 31 20.7 31.7 20 32 19.3 31.7 Q19 31.4 19 31 L19 24.8 M26.85 33.8 L26.9 33.75 Q27.75 33 29 33 30.15 33 31.05 33.75 L31.1 33.8 Q32 34.65 32 35.8 L32 40.25 Q32 41.35 31.1 42.25 L31.05 42.3 Q30.15 43 29 43 27.75 43 26.9 42.3 L26.85 42.2 Q26 41.35 26 40.25 L26 35.8 Q26 34.65 26.85 33.8 M38.1 42.25 L38.05 42.3 Q37.15 43 36 43 34.75 43 33.9 42.3 L33.85 42.2 Q33 41.35 33 40.25 L33 35.8 Q33 34.65 33.85 33.8 L33.9 33.75 Q34.75 33 36 33 37.15 33 38.05 33.75 L38.1 33.8 Q39 34.65 39 35.8 L38.7 36.5 38 36.8 Q37.6 36.8 37.3 36.5 37 36.2 37 35.8 L36.75 35.25 36.75 35.3 Q36.45 35 36 35 35.55 35 35.2 35.3 L35.25 35.2 Q35 35.45 35 35.8 L35 40.25 35.2 40.75 36 41 36.75 40.75 36.75 40.8 37 40.25 Q37 39.85 37.3 39.55 37.6 39.25 38 39.25 L38.7 39.55 39 40.25 Q39 41.35 38.1 42.25 M40 34 Q40 33.6 40.3 33.3 40.6 33 41 33 41.4 33 41.7 33.3 L42 34 42 37 42.4 37 44.1 33.55 Q44.3 33.2 44.7 33.05 L45.45 33.1 45.95 33.7 45.9 34.45 44.15 38 45.9 41.55 45.95 42.35 45.45 42.9 44.7 42.95 Q44.3 42.8 44.1 42.45 L42.4 39 42 39 42 42 41.7 42.7 41 43 40.3 42.7 Q40 42.4 40 42 L40 34 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Vi=p({name:`KeyboardF1Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 24 L43 41 39 41 39 33.95 39 33.85 39 28.95 36 28.95 36 27 39 24 43 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25 41 L21 41 21 33.95 21 33.85 21 24 28.05 24 28.15 24 32 24 32 28 25 28 25 31 28.05 31 28.15 31 32 31 32 35 25 35 25 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M43 24 L43 41 39 41 39 33.95 39 33.85 39 28.95 36 28.95 36 27 39 24 43 24 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M25 41 L21 41 21 33.95 21 33.85 21 24 28.05 24 28.15 24 32 24 32 28 25 28 25 31 28.05 31 28.15 31 32 31 32 35 25 35 25 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Hi=p({name:`KeyboardF2Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.5 28.4 Q40.1 28 39.5 28 L37.95 28 37.85 28 Q37.55 28.05 37.3 28.3 37 28.6 37 29 L33 29 33.1 28 Q33.35 26.6 34.4 25.5 L34.5 25.4 Q35.9 24.05 37.85 24 L39.5 24 Q41.75 24 43.35 25.6 L43.4 25.65 44.4 27 Q45.65 30.35 43.45 32.55 L39 37 45 37 45 41 37.95 41 37.85 41 33 41 33 37 40 30.45 Q41.25 29.15 40.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 41 L19 41 19 33.95 19 33.85 19 24 24.05 24 24.15 24 30 24 30 28 23 28 23 31 30 31 30 35 23 35 23 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M40.5 28.4 Q40.1 28 39.5 28 L37.95 28 37.85 28 Q37.55 28.05 37.3 28.3 37 28.6 37 29 L33 29 33.1 28 Q33.35 26.6 34.4 25.5 L34.5 25.4 Q35.9 24.05 37.85 24 L39.5 24 Q41.75 24 43.35 25.6 L43.4 25.65 44.4 27 Q45.65 30.35 43.45 32.55 L39 37 45 37 45 41 37.95 41 37.85 41 33 41 33 37 40 30.45 Q41.25 29.15 40.5 28.4 M23 41 L19 41 19 33.95 19 33.85 19 24 24.05 24 24.15 24 30 24 30 28 23 28 23 31 30 31 30 35 23 35 23 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ui=p({name:`KeyboardF3Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45 35.75 Q45.05 37.95 43.05 39.6 L43.1 39.5 Q41.4 41 39 41 36.6 41 34.9 39.55 33.05 38.05 33 36 L37.1 36 37.45 36.45 37.45 36.5 Q38.1 37 39 37 39.9 37 40.5 36.5 L40.55 36.45 41 35.75 40.6 35 Q40.2 34.65 39.7 34.55 L39.15 34.5 37 34.5 37 30.5 39.15 30.5 Q40 30.5 40.6 30 L41 29.25 40.55 28.55 40.5 28.5 Q39.9 28 39 28 38.1 28 37.45 28.5 L37.45 28.55 37.1 29 33 29 Q33.05 26.95 34.9 25.45 36.6 24 39 24 41.4 24 43.1 25.5 L43.05 25.4 Q45.05 27.05 45 29.25 45.05 31.1 43.75 32.5 45.05 33.9 45 35.75"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M45 35.75 Q45.05 37.95 43.05 39.6 L43.1 39.5 Q41.4 41 39 41 36.6 41 34.9 39.55 33.05 38.05 33 36 L37.1 36 37.45 36.45 37.45 36.5 Q38.1 37 39 37 39.9 37 40.5 36.5 L40.55 36.45 41 35.75 40.6 35 Q40.2 34.65 39.7 34.55 L39.15 34.5 37 34.5 37 30.5 39.15 30.5 Q40 30.5 40.6 30 L41 29.25 40.55 28.55 40.5 28.5 Q39.9 28 39 28 38.1 28 37.45 28.5 L37.45 28.55 37.1 29 33 29 Q33.05 26.95 34.9 25.45 36.6 24 39 24 41.4 24 43.1 25.5 L43.05 25.4 Q45.05 27.05 45 29.25 45.05 31.1 43.75 32.5 45.05 33.9 45 35.75 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Wi=p({name:`KeyboardF4Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M45 24 L45 41 41 41 41 34 34.95 34 Q34.15 34 33.55 33.4 33 32.85 33 32.05 L33 24 37 24 37 30 41 30 41 24 45 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M45 24 L45 41 41 41 41 34 34.95 34 Q34.15 34 33.55 33.4 33 32.85 33 32.05 L33 24 37 24 37 30 41 30 41 24 45 24 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Gi=p({name:`KeyboardF5Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.5 36.6 L41.6 36.5 Q42 36.1 42 35.5 42 34.9 41.55 34.45 41.1 34 40.5 34 L33 34 33 24 46 24 46 28 37 28 37 30 40.5 30 Q42.8 30 44.4 31.6 46 33.2 46 35.5 L46 36 Q45.8 37.95 44.4 39.35 L44.35 39.4 Q42.75 41 40.5 41 L37.85 41 Q35.9 40.95 34.5 39.6 L34.4 39.5 Q33.35 38.4 33.1 37 L33 36 37 36 Q37 36.4 37.3 36.7 L37.95 37 40.5 37 Q41.1 37 41.5 36.6"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 41 L18 41 18 33.95 18 33.85 18 24 25.05 24 25.15 24 29 24 29 28 22 28 22 31 25.05 31 25.15 31 29 31 29 35 22 35 22 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M41.5 36.6 L41.6 36.5 Q42 36.1 42 35.5 42 34.9 41.55 34.45 41.1 34 40.5 34 L33 34 33 24 46 24 46 28 37 28 37 30 40.5 30 Q42.8 30 44.4 31.6 46 33.2 46 35.5 L46 36 Q45.8 37.95 44.4 39.35 L44.35 39.4 Q42.75 41 40.5 41 L37.85 41 Q35.9 40.95 34.5 39.6 L34.4 39.5 Q33.35 38.4 33.1 37 L33 36 37 36 Q37 36.4 37.3 36.7 L37.95 37 40.5 37 Q41.1 37 41.5 36.6 M22 41 L18 41 18 33.95 18 33.85 18 24 25.05 24 25.15 24 29 24 29 28 22 28 22 31 25.05 31 25.15 31 29 31 29 35 22 35 22 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ki=p({name:`KeyboardF6Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40 33 L39 33 38.35 33.1 Q37.95 33.25 37.6 33.55 L37.55 33.6 37.25 34 Q37 34.45 37 35 37 35.8 37.6 36.4 38.2 37 39 37 L40 37 Q40.8 37 41.35 36.45 L41.45 36.35 Q42 35.8 42 35 42 34.2 41.4 33.6 40.8 33 40 33"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.25 30.75 Q46 32.5 46 35 46 37.45 44.25 39.2 L44.2 39.25 Q42.45 41 40 41 L39 41 Q36.5 41 34.75 39.25 33 37.5 33 35 L33.1 34 33.15 33.65 37 24 42 24 40 29 Q42.5 29 44.25 30.75"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M40 33 L39 33 38.35 33.1 Q37.95 33.25 37.6 33.55 L37.55 33.6 37.25 34 Q37 34.45 37 35 37 35.8 37.6 36.4 38.2 37 39 37 L40 37 Q40.8 37 41.35 36.45 L41.45 36.35 Q42 35.8 42 35 42 34.2 41.4 33.6 40.8 33 40 33 M44.25 30.75 Q46 32.5 46 35 46 37.45 44.25 39.2 L44.2 39.25 Q42.45 41 40 41 L39 41 Q36.5 41 34.75 39.25 33 37.5 33 35 L33.1 34 33.15 33.65 37 24 42 24 40 29 Q42.5 29 44.25 30.75 M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),qi=p({name:`KeyboardF7Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41 41 L36 41 41 28 33 28 33 24 46 24 46 28 41 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 41 L18 41 18 33.95 18 33.85 18 24 25.05 24 25.15 24 29 24 29 28 22 28 22 31 25.05 31 25.15 31 29 31 29 35 22 35 22 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M41 41 L36 41 41 28 33 28 33 24 46 24 46 28 41 41 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M22 41 L18 41 18 33.95 18 33.85 18 24 25.05 24 25.15 24 29 24 29 28 22 28 22 31 25.05 31 25.15 31 29 31 29 35 22 35 22 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Ji=p({name:`KeyboardF8Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M41.5 36.6 L41.6 36.5 Q42 36.1 42 35.5 42 34.9 41.55 34.45 41.1 34 40.55 34 L38.5 34 Q37.9 34 37.45 34.45 37 34.9 37 35.5 37 36.1 37.4 36.5 L37.5 36.6 Q37.9 37 38.5 37 L40.5 37 Q41.1 37 41.5 36.6"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M40.5 41 L38.5 41 Q36.25 41 34.65 39.4 L34.6 39.35 Q33.2 37.95 33 36 L33 35.5 Q33 33.6 34.1 32.2 33 30.85 33 29 33 26.95 34.4 25.5 L34.5 25.4 Q35.45 24.5 36.65 24.2 L37.95 24 41.05 24 Q43.05 24 44.5 25.4 L44.6 25.5 Q46 26.95 46 29 46 30.85 44.9 32.2 46 33.6 46 35.5 L46 36 Q45.8 37.95 44.4 39.35 L44.35 39.4 Q42.75 41 40.5 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 30 L41 30 41.7 29.7 42 29 41.7 28.3 Q41.4 28 41.05 28 L37.95 28 Q37.6 28 37.3 28.3 37 28.6 37 29 37 29.4 37.3 29.7 37.6 30 38 30"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M22 41 L18 41 18 33.95 18 33.85 18 24 25.05 24 25.15 24 29 24 29 28 22 28 22 31 25.05 31 25.15 31 29 31 29 35 22 35 22 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M41.5 36.6 L41.6 36.5 Q42 36.1 42 35.5 42 34.9 41.55 34.45 41.1 34 40.55 34 L38.5 34 Q37.9 34 37.45 34.45 37 34.9 37 35.5 37 36.1 37.4 36.5 L37.5 36.6 Q37.9 37 38.5 37 L40.5 37 Q41.1 37 41.5 36.6 M40.5 41 L38.5 41 Q36.25 41 34.65 39.4 L34.6 39.35 Q33.2 37.95 33 36 L33 35.5 Q33 33.6 34.1 32.2 33 30.85 33 29 33 26.95 34.4 25.5 L34.5 25.4 Q35.45 24.5 36.65 24.2 L37.95 24 41.05 24 Q43.05 24 44.5 25.4 L44.6 25.5 Q46 26.95 46 29 46 30.85 44.9 32.2 46 33.6 46 35.5 L46 36 Q45.8 37.95 44.4 39.35 L44.35 39.4 Q42.75 41 40.5 41 M38 30 L41 30 41.7 29.7 42 29 41.7 28.3 Q41.4 28 41.05 28 L37.95 28 Q37.6 28 37.3 28.3 37 28.6 37 29 37 29.4 37.3 29.7 37.6 30 38 30 M22 41 L18 41 18 33.95 18 33.85 18 24 25.05 24 25.15 24 29 24 29 28 22 28 22 31 25.05 31 25.15 31 29 31 29 35 22 35 22 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Yi=p({name:`KeyboardF9Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34.75 34.25 Q33 32.5 33 30 33 27.55 34.75 25.8 L34.8 25.75 Q36.55 24 39 24 L40 24 Q42.5 24 44.25 25.75 46 27.5 46 30 L45.9 31 45.85 31.35 42 41 37 41 39 36 Q36.5 36 34.75 34.25"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M39 32 L40 32 40.65 31.9 41.4 31.45 41.45 31.4 41.75 31 42 30 Q42 29.2 41.4 28.6 40.8 28 40 28 L39 28 Q38.2 28 37.65 28.55 L37.55 28.65 Q37 29.2 37 30 37 30.8 37.6 31.4 38.2 32 39 32"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M34.75 34.25 Q33 32.5 33 30 33 27.55 34.75 25.8 L34.8 25.75 Q36.55 24 39 24 L40 24 Q42.5 24 44.25 25.75 46 27.5 46 30 L45.9 31 45.85 31.35 42 41 37 41 39 36 Q36.5 36 34.75 34.25 M39 32 L40 32 40.65 31.9 41.4 31.45 41.45 31.4 41.75 31 42 30 Q42 29.2 41.4 28.6 40.8 28 40 28 L39 28 Q38.2 28 37.65 28.55 L37.55 28.65 Q37 29.2 37 30 37 30.8 37.6 31.4 38.2 32 39 32 M23 41 L19 41 19 33.95 19 33.85 19 24 26.05 24 26.15 24 30 24 30 28 23 28 23 31 26.05 31 26.15 31 30 31 30 35 23 35 23 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Xi=p({name:`KeyboardF10Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47.95 26.05 Q50 28.15 50 31 L50 34 Q50 36.85 47.95 38.9 L47.9 38.95 Q45.85 41 43 41 40.15 41 38.05 38.95 36 36.9 36 34 L36 31 Q36 28.15 38 26.05 L38.05 26 Q40.15 24 43 24 45.9 24 47.95 26.05"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M43 28 Q41.8 28 40.9 28.85 L40.85 28.9 Q40 29.8 40 31 L40 34 Q40 35.2 40.9 36.1 41.75 37 43 37 44.2 37 45.05 36.1 L45.1 36.05 Q46 35.2 46 34 L46 31 Q46 29.75 45.1 28.9 44.2 28 43 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 41 L14 41 14 33.95 14 33.85 14 24 21.05 24 21.15 24 25 24 25 28 18 28 18 31 21.05 31 21.15 31 25 31 25 35 18 35 18 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 24 L34 41 30 41 30 33.95 30 33.85 30 28.95 27 28.95 27 27 30 24 34 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M47.95 26.05 Q50 28.15 50 31 L50 34 Q50 36.85 47.95 38.9 L47.9 38.95 Q45.85 41 43 41 40.15 41 38.05 38.95 36 36.9 36 34 L36 31 Q36 28.15 38 26.05 L38.05 26 Q40.15 24 43 24 45.9 24 47.95 26.05 M43 28 Q41.8 28 40.9 28.85 L40.85 28.9 Q40 29.8 40 31 L40 34 Q40 35.2 40.9 36.1 41.75 37 43 37 44.2 37 45.05 36.1 L45.1 36.05 Q46 35.2 46 34 L46 31 Q46 29.75 45.1 28.9 44.2 28 43 28 M18 41 L14 41 14 33.95 14 33.85 14 24 21.05 24 21.15 24 25 24 25 28 18 28 18 31 21.05 31 21.15 31 25 31 25 35 18 35 18 41 M34 24 L34 41 30 41 30 33.95 30 33.85 30 28.95 27 28.95 27 27 30 24 34 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Zi=p({name:`KeyboardF11Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 24 L47 41 43 41 43 33.95 43 33.85 43 28.95 40 28.95 40 27 43 24 47 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M38 24 L38 41 34 41 34 33.95 34 33.85 34 28.95 31 28.95 31 27 34 24 38 24"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21 41 L17 41 17 33.95 17 33.85 17 24 24.05 24 24.15 24 28 24 28 28 21 28 21 31 24.05 31 24.15 31 28 31 28 35 21 35 21 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M47 24 L47 41 43 41 43 33.95 43 33.85 43 28.95 40 28.95 40 27 43 24 47 24 M38 24 L38 41 34 41 34 33.95 34 33.85 34 28.95 31 28.95 31 27 34 24 38 24 M21 41 L17 41 17 33.95 17 33.85 17 24 24.05 24 24.15 24 28 24 28 28 21 28 21 31 24.05 31 24.15 31 28 31 28 35 21 35 21 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),Qi=p({name:`KeyboardF12Icon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M44.5 28.4 Q44.1 28 43.5 28 L41.95 28 41.85 28 Q41.55 28.05 41.3 28.3 41 28.6 41 29 L37 29 37.1 28 Q37.35 26.6 38.4 25.5 L38.5 25.4 Q39.9 24.05 41.85 24 L43.5 24 Q45.75 24 47.35 25.6 L47.4 25.65 48.4 27 Q49.65 30.35 47.45 32.55 L43 37 49 37 49 41 41.95 41 41.85 41 37 41 37 37 44 30.45 Q45.25 29.15 44.5 28.4"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q55.35 8 55.95 14.8 L56 16 56 48 55.95 49.25 Q55.35 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M18 41 L14 41 14 33.95 14 33.85 14 24 21.05 24 21.15 24 25 24 25 28 18 28 18 31 21.05 31 21.15 31 25 31 25 35 18 35 18 41"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M34 24 L34 41 30 41 30 33.95 30 33.85 30 28.95 27 28.95 27 27 30 24 34 24"
                />
                <path
                    fill="#FFFFFF"
                    d="M44.5 28.4 Q44.1 28 43.5 28 L41.95 28 41.85 28 Q41.55 28.05 41.3 28.3 41 28.6 41 29 L37 29 37.1 28 Q37.35 26.6 38.4 25.5 L38.5 25.4 Q39.9 24.05 41.85 24 L43.5 24 Q45.75 24 47.35 25.6 L47.4 25.65 48.4 27 Q49.65 30.35 47.45 32.55 L43 37 49 37 49 41 41.95 41 41.85 41 37 41 37 37 44 30.45 Q45.25 29.15 44.5 28.4 M16 8 L48 8 Q55.35 8 55.95 14.8 L56 16 56 48 55.95 49.25 Q55.35 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 M11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 Q53 11 48 11 L16 11 Q11 11 11 16 M18 41 L14 41 14 33.95 14 33.85 14 24 21.05 24 21.15 24 25 24 25 28 18 28 18 31 21.05 31 21.15 31 25 31 25 35 18 35 18 41 M34 24 L34 41 30 41 30 33.95 30 33.85 30 28.95 27 28.95 27 27 30 24 34 24"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M16 8 L48 8 Q55.35 8 55.95 14.8 L56 16 56 48 55.95 49.25 Q55.35 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8"
                />
            </g>
        </svg>
    `}),$i=p({name:`MouseLeftIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29.9 19.9 Q29 20.75 29 22 L29 30 Q29 31.25 29.9 32.15 30.75 33 32 33 33.25 33 34.15 32.15 35 31.25 35 30 L35 22 Q35 20.75 34.15 19.9 33.25 19 32 19 30.75 19 29.9 19.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 13 L34 13 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13 42 13"
                />
                <path
                    fill="#FFFFFF"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10 M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38 M29.9 19.9 Q29 20.75 29 22 L29 30 Q29 31.25 29.9 32.15 30.75 33 32 33 33.25 33 34.15 32.15 35 31.25 35 30 L35 22 Q35 20.75 34.15 19.9 33.25 19 32 19 30.75 19 29.9 19.9 M42 13 L34 13 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13 42 13"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
            </g>
        </svg>
    `}),ea=p({name:`MouseScrollIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 13 22 13 Q17 13 17 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 13 L34 13 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13 42 13"
                />
                <path
                    fill="#FFFFFF"
                    d="M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38 M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10 M17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 13 22 13 Q17 13 17 18 M42 13 L34 13 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13 42 13"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
            </g>
        </svg>
    `}),ta=p({name:`MouseRightIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 13 22 13 Q17 13 17 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29.9 19.9 Q29 20.75 29 22 L29 30 Q29 31.25 29.9 32.15 30.75 33 32 33 33.25 33 34.15 32.15 35 31.25 35 30 L35 22 Q35 20.75 34.15 19.9 33.25 19 32 19 30.75 19 29.9 19.9"
                />
                <path
                    fill="#FFFFFF"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10 M17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 13 22 13 Q17 13 17 18 M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38 M29.9 19.9 Q29 20.75 29 22 L29 30 Q29 31.25 29.9 32.15 30.75 33 32 33 33.25 33 34.15 32.15 35 31.25 35 30 L35 22 Q35 20.75 34.15 19.9 33.25 19 32 19 30.75 19 29.9 19.9"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
            </g>
        </svg>
    `}),na=p({name:`MouseSideBackIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 13 L40 13 40 16.35 Q41.25 16.75 42.25 17.75 44 19.5 44 22 L44 28 53 28 53 18 Q53 13 48 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 10 L48.5 10 Q56 10.25 56 18 L56 38 Q56 44.6 51.3 49.3 46.6 54 40 54 L36 54 Q29.4 54 24.7 49.3 20 44.6 20 38 L20 18 Q20 10.25 27.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 18 L23 28 32 28 32 22 Q32 19.5 33.75 17.75 34.75 16.75 36 16.35 L36 13 28 13 Q23 13 23 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.9 19.9 Q35 20.75 35 22 L35 30 Q35 31.25 35.9 32.15 36.75 33 38 33 39.25 33 40.15 32.15 41 31.25 41 30 L41 22 Q41 20.75 40.15 19.9 39.25 19 38 19 36.75 19 35.9 19.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 38 L53 31 43.95 31 Q43.65 32.85 42.25 34.25 40.5 36 38 36 35.5 36 33.75 34.25 32.35 32.85 32.1 31 L23 31 23 38 Q23 43.35 26.85 47.2 30.65 51 36 51 L40 51 Q45.35 51 49.2 47.2 53 43.35 53 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 10 L15 10 Q17 10 17 12 L17 23 Q17 25 15 25 L11 25 Q9 25 9 23 L9 12 Q9 10 11 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 23 L15 23 15 12 11 12 11 23"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 28 L15 28 Q17 28 17 30 L17 41 Q17 43 15 43 L11 43 Q9 43 9 41 L9 30 Q9 28 11 28"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 13 L40 13 40 16.35 Q41.25 16.75 42.25 17.75 44 19.5 44 22 L44 28 53 28 53 18 Q53 13 48 13 M27.5 10 L48.5 10 Q56 10.25 56 18 L56 38 Q56 44.6 51.3 49.3 46.6 54 40 54 L36 54 Q29.4 54 24.7 49.3 20 44.6 20 38 L20 18 Q20 10.25 27.5 10 M23 18 L23 28 32 28 32 22 Q32 19.5 33.75 17.75 34.75 16.75 36 16.35 L36 13 28 13 Q23 13 23 18 M35.9 19.9 Q35 20.75 35 22 L35 30 Q35 31.25 35.9 32.15 36.75 33 38 33 39.25 33 40.15 32.15 41 31.25 41 30 L41 22 Q41 20.75 40.15 19.9 39.25 19 38 19 36.75 19 35.9 19.9 M53 38 L53 31 43.95 31 Q43.65 32.85 42.25 34.25 40.5 36 38 36 35.5 36 33.75 34.25 32.35 32.85 32.1 31 L23 31 23 38 Q23 43.35 26.85 47.2 30.65 51 36 51 L40 51 Q45.35 51 49.2 47.2 53 43.35 53 38 M11 10 L15 10 Q17 10 17 12 L17 23 Q17 25 15 25 L11 25 Q9 25 9 23 L9 12 Q9 10 11 10 M11 23 L15 23 15 12 11 12 11 23 M11 28 L15 28 Q17 28 17 30 L17 41 Q17 43 15 43 L11 43 Q9 43 9 41 L9 30 Q9 28 11 28"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 10 L48.5 10 Q56 10.25 56 18 L56 38 Q56 44.6 51.3 49.3 46.6 54 40 54 L36 54 Q29.4 54 24.7 49.3 20 44.6 20 38 L20 18 Q20 10.25 27.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 10 L15 10 Q17 10 17 12 L17 23 Q17 25 15 25 L11 25 Q9 25 9 23 L9 12 Q9 10 11 10 M11 28 L15 28 Q17 28 17 30 L17 41 Q17 43 15 43 L11 43 Q9 43 9 41 L9 30 Q9 28 11 28"
                />
            </g>
        </svg>
    `}),ra=p({name:`MouseSideForwardIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 13 L40 13 40 16.35 Q41.25 16.75 42.25 17.75 44 19.5 44 22 L44 28 53 28 53 18 Q53 13 48 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 10 L48.5 10 Q56 10.25 56 18 L56 38 Q56 44.6 51.3 49.3 46.6 54 40 54 L36 54 Q29.4 54 24.7 49.3 20 44.6 20 38 L20 18 Q20 10.25 27.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 18 L23 28 32 28 32 22 Q32 19.5 33.75 17.75 34.75 16.75 36 16.35 L36 13 28 13 Q23 13 23 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M35.9 19.9 Q35 20.75 35 22 L35 30 Q35 31.25 35.9 32.15 36.75 33 38 33 39.25 33 40.15 32.15 41 31.25 41 30 L41 22 Q41 20.75 40.15 19.9 39.25 19 38 19 36.75 19 35.9 19.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 38 L53 31 43.95 31 Q43.65 32.85 42.25 34.25 40.5 36 38 36 35.5 36 33.75 34.25 32.35 32.85 32.1 31 L23 31 23 38 Q23 43.35 26.85 47.2 30.65 51 36 51 L40 51 Q45.35 51 49.2 47.2 53 43.35 53 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 10 L15 10 Q17 10 17 12 L17 23 Q17 25 15 25 L11 25 Q9 25 9 23 L9 12 Q9 10 11 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 28 L15 28 Q17 28 17 30 L17 41 Q17 43 15 43 L11 43 Q9 43 9 41 L9 30 Q9 28 11 28"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 41 L15 41 15 30 11 30 11 41"
                />
                <path
                    fill="#FFFFFF"
                    d="M48 13 L40 13 40 16.35 Q41.25 16.75 42.25 17.75 44 19.5 44 22 L44 28 53 28 53 18 Q53 13 48 13 M27.5 10 L48.5 10 Q56 10.25 56 18 L56 38 Q56 44.6 51.3 49.3 46.6 54 40 54 L36 54 Q29.4 54 24.7 49.3 20 44.6 20 38 L20 18 Q20 10.25 27.5 10 M23 18 L23 28 32 28 32 22 Q32 19.5 33.75 17.75 34.75 16.75 36 16.35 L36 13 28 13 Q23 13 23 18 M35.9 19.9 Q35 20.75 35 22 L35 30 Q35 31.25 35.9 32.15 36.75 33 38 33 39.25 33 40.15 32.15 41 31.25 41 30 L41 22 Q41 20.75 40.15 19.9 39.25 19 38 19 36.75 19 35.9 19.9 M53 38 L53 31 43.95 31 Q43.65 32.85 42.25 34.25 40.5 36 38 36 35.5 36 33.75 34.25 32.35 32.85 32.1 31 L23 31 23 38 Q23 43.35 26.85 47.2 30.65 51 36 51 L40 51 Q45.35 51 49.2 47.2 53 43.35 53 38 M11 10 L15 10 Q17 10 17 12 L17 23 Q17 25 15 25 L11 25 Q9 25 9 23 L9 12 Q9 10 11 10 M11 28 L15 28 Q17 28 17 30 L17 41 Q17 43 15 43 L11 43 Q9 43 9 41 L9 30 Q9 28 11 28 M11 41 L15 41 15 30 11 30 11 41"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M27.5 10 L48.5 10 Q56 10.25 56 18 L56 38 Q56 44.6 51.3 49.3 46.6 54 40 54 L36 54 Q29.4 54 24.7 49.3 20 44.6 20 38 L20 18 Q20 10.25 27.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="0.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M11 10 L15 10 Q17 10 17 12 L17 23 Q17 25 15 25 L11 25 Q9 25 9 23 L9 12 Q9 10 11 10 M11 28 L15 28 Q17 28 17 30 L17 41 Q17 43 15 43 L11 43 Q9 43 9 41 L9 30 Q9 28 11 28"
                />
            </g>
        </svg>
    `});p({name:`KeyboardAnyIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M37 38 L34 38 30 31 30 38 27 38 27 25 30 25 34 32 34 25 37 25 37 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M20 28.75 L20 31 22 31 22 28.75 21.8 28.3 Q21.45 28 21 28 20.55 28 20.25 28.25 L20.2 28.3 20 28.75"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 28.75 Q17 27.15 18.2 26.05 L18.25 26.05 Q19.4 25 21 25 22.55 25 23.75 26.05 25 27.15 25 28.75 L25 38 22 38 22 34 20 34 20 38 17 38 17 28.75"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M46.25 24.2 L48.75 25.85 45 31.45 45 38 42 38 42 31.45 38.25 25.85 40.75 24.2 43.5 28.3 46.25 24.2"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M37 38 L34 38 30 31 30 38 27 38 27 25 30 25 34 32 34 25 37 25 37 38 M20 28.75 L20 31 22 31 22 28.75 21.8 28.3 Q21.45 28 21 28 20.55 28 20.25 28.25 L20.2 28.3 20 28.75 M17 28.75 Q17 27.15 18.2 26.05 L18.25 26.05 Q19.4 25 21 25 22.55 25 23.75 26.05 25 27.15 25 28.75 L25 38 22 38 22 34 20 34 20 38 17 38 17 28.75 M46.25 24.2 L48.75 25.85 45 31.45 45 38 42 38 42 31.45 38.25 25.85 40.75 24.2 43.5 28.3 46.25 24.2 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),p({name:`KeyboardFunctionIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M33 40 L33 27 36 27 42 34.75 42 27 45 27 45 40 42 40 36 32.35 36 40 33 40"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M23 40 L19 40 19 32.95 19 32.85 19 23 26.05 23 26.15 23 30 23 30 27 23 27 23 30 26.05 30 26.15 30 30 30 30 34 23 34 23 40"
                />
                <path
                    fill="#FFFFFF"
                    d="M53 16 Q53 11 48 11 L16 11 Q11 11 11 16 L11 48 Q11 53 16 53 L48 53 Q53 53 53 48 L53 16 M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8 M33 40 L33 27 36 27 42 34.75 42 27 45 27 45 40 42 40 36 32.35 36 40 33 40 M23 40 L19 40 19 32.95 19 32.85 19 23 26.05 23 26.15 23 30 23 30 27 23 27 23 30 26.05 30 26.15 30 30 30 30 34 23 34 23 40"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M48 8 Q56 8 56 16 L56 48 Q56 56 48 56 L16 56 Q8 56 8 48 L8 16 Q8 8 16 8 L48 8"
                />
            </g>
        </svg>
    `}),p({name:`MouseIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 13 22 13 Q17 13 17 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M29.9 19.9 Q29 20.75 29 22 L29 30 Q29 31.25 29.9 32.15 30.75 33 32 33 33.25 33 34.15 32.15 35 31.25 35 30 L35 22 Q35 20.75 34.15 19.9 33.25 19 32 19 30.75 19 29.9 19.9"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="4.6"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M42 13 L34 13 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13 42 13"
                />
                <path
                    fill="#FFFFFF"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10 M17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 13 22 13 Q17 13 17 18 M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.5 36 32 36 29.5 36 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.65 51 30 51 L34 51 Q39.35 51 43.2 47.2 47 43.35 47 38 M29.9 19.9 Q29 20.75 29 22 L29 30 Q29 31.25 29.9 32.15 30.75 33 32 33 33.25 33 34.15 32.15 35 31.25 35 30 L35 22 Q35 20.75 34.15 19.9 33.25 19 32 19 30.75 19 29.9 19.9 M42 13 L34 13 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13 42 13"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M21.5 10 L42.5 10 Q50 10.25 50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.25 21.5 10"
                />
            </g>
        </svg>
    `}),p({name:`MouseScrollVerticalIcon`,svgTemplate:u`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 68 68" width="48" height="48">
            <g>
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.4 21.2 10.05 L21 11.35 Q21 12.25 21.3 13.05 17 13.35 17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 16 34 16 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13.4 42.75 13.05 L43 11.35 42.85 10.05 Q50 10.4 50 18"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M25.55 13 Q24.9 13 24.45 12.5 24 12.05 24 11.35 24 10.65 24.45 10.15 L30.85 3.5 Q31.3 3 32 3 32.65 3 33.15 3.5 L39.55 10.15 Q40 10.65 40 11.35 40 12.05 39.55 12.5 39.05 13 38.45 13 L25.55 13"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.55 35.95 32.15 36 L31.85 36 Q29.45 35.95 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.3 50.65 29.1 51 30.3 52 32 52 33.6 52.05 34.95 51 39.7 50.65 43.2 47.2 47 43.35 47 38"
                />
                <path
                    style="vector-effect: none"
                    fill="#000000"
                    stroke="#000000"
                    stroke-width="6.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M30.85 48.5 L24.45 41.85 Q24 41.35 24 40.65 24 39.95 24.45 39.5 24.9 39 25.6 39 L38.4 39 Q39.05 39 39.55 39.5 40 39.95 40 40.65 40 41.35 39.55 41.85 L33.15 48.5 Q32.65 49 32 49 31.3 49 30.85 48.5"
                />
                <path fill="#000000" d="M17 12 L47 12 L47 28 L17 28 Z" />
                <path
                    fill="#FFFFFF"
                    d="M50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.4 21.2 10.05 L21 11.35 Q21 12.25 21.3 13.05 17 13.35 17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 16 34 16 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13.4 42.75 13.05 L43 11.35 42.85 10.05 Q50 10.4 50 18 M25.55 13 Q24.9 13 24.45 12.5 24 12.05 24 11.35 24 10.65 24.45 10.15 L30.85 3.5 Q31.3 3 32 3 32.65 3 33.15 3.5 L39.55 10.15 Q40 10.65 40 11.35 40 12.05 39.55 12.5 39.05 13 38.45 13 L25.55 13 M47 38 L47 31 37.95 31 Q37.65 32.85 36.25 34.25 34.55 35.95 32.15 36 L31.85 36 Q29.45 35.95 27.75 34.25 26.35 32.85 26.1 31 L17 31 17 38 Q17 43.35 20.85 47.2 24.3 50.65 29.1 51 30.3 52 32 52 33.6 52.05 34.95 51 39.7 50.65 43.2 47.2 47 43.35 47 38 M30.85 48.5 L24.45 41.85 Q24 41.35 24 40.65 24 39.95 24.45 39.5 24.9 39 25.6 39 L38.4 39 Q39.05 39 39.55 39.5 40 39.95 40 40.65 40 41.35 39.55 41.85 L33.15 48.5 Q32.65 49 32 49 31.3 49 30.85 48.5"
                />
                <path
                    style="vector-effect: none"
                    fill="none"
                    stroke="#FFFFFF"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    d="M50 18 L50 38 Q50 44.6 45.3 49.3 40.6 54 34 54 L30 54 Q23.4 54 18.7 49.3 14 44.6 14 38 L14 18 Q14 10.4 21.2 10.05 L21 11.35 Q21 12.25 21.3 13.05 17 13.35 17 18 L17 28 26 28 26 22 Q26 19.5 27.75 17.75 28.75 16.75 30 16.35 L30 16 34 16 34 16.35 Q35.25 16.75 36.25 17.75 38 19.5 38 22 L38 28 47 28 47 18 Q47 13.4 42.75 13.05 L43 11.35 42.85 10.05 Q50 10.4 50 18 M25.55 13 Q24.9 13 24.45 12.5 24 12.05 24 11.35 24 10.65 24.45 10.15 L30.85 3.5 Q31.3 3 32 3 32.65 3 33.15 3.5 L39.55 10.15 Q40 10.65 40 11.35 40 12.05 39.55 12.5 39.05 13 38.45 13 L25.55 13"
                />
            </g>
        </svg>
    `});var ia={"button-KeyA":[pr],"button-KeyB":[mr],"button-KeyC":[hr],"button-KeyD":[gr],"button-KeyE":[_r],"button-KeyF":[vr],"button-KeyG":[yr],"button-KeyH":[br],"button-KeyI":[xr],"button-KeyJ":[Sr],"button-KeyK":[Cr],"button-KeyL":[wr],"button-KeyM":[Tr],"button-KeyN":[Er],"button-KeyO":[Dr],"button-KeyP":[Or],"button-KeyQ":[kr],"button-KeyR":[Ar],"button-KeyS":[jr],"button-KeyT":[Mr],"button-KeyU":[Nr],"button-KeyV":[Pr],"button-KeyW":[Fr],"button-KeyX":[Ir],"button-KeyY":[Lr],"button-KeyZ":[Rr],"button-Digit0":[zr],"button-Digit1":[Br],"button-Digit2":[Vr],"button-Digit3":[Hr],"button-Digit4":[Ur],"button-Digit5":[Wr],"button-Digit6":[Gr],"button-Digit7":[Kr],"button-Digit8":[qr],"button-Digit9":[Jr],"button-ArrowUp":[Yr],"button-ArrowDown":[Xr],"button-ArrowLeft":[Zr],"button-ArrowRight":[Qr],"button-Space":[$r],"button-Enter":[ei],"button-NumpadEnter":[ti],"button-Escape":[ni],"button-Tab":[ri],"button-Backspace":[ii],"button-ShiftLeft":[ai],"button-ShiftRight":[ai],"button-ControlLeft":[oi],"button-ControlRight":[oi],"button-AltLeft":[si],"button-AltRight":[si],"button-MetaLeft":[ci,li],"button-MetaRight":[ci,li],"button-CapsLock":[ui],"button-Backquote":[di],"button-Minus":[fi,pi],"button-Equal":[mi,hi],"button-BracketLeft":[gi],"button-BracketRight":[_i],"button-Backslash":[vi],"button-Semicolon":[yi,bi],"button-Quote":[xi,Si],"button-Comma":[Ci,wi],"button-Period":[Ti,Ei],"button-Slash":[Di,Oi],"button-NumpadMultiply":[ki],"button-NumpadAdd":[Ai],"button-Delete":[ji],"button-Insert":[Mi],"button-Home":[Ni],"button-End":[Pi],"button-PageUp":[Fi],"button-PageDown":[Ii],"button-PrintScreen":[Li],"button-ScrollLock":[Ri],"button-Pause":[zi],"button-NumLock":[Bi],"button-F1":[Vi],"button-F2":[Hi],"button-F3":[Ui],"button-F4":[Wi],"button-F5":[Gi],"button-F6":[Ki],"button-F7":[qi],"button-F8":[Ji],"button-F9":[Yi],"button-F10":[Xi],"button-F11":[Zi],"button-F12":[Qi]},aa={"button-0":[$i],"button-1":[ea],"button-2":[ta],"button-3":[na],"button-4":[ra]},$;(function(e){e.Keyboard=`keyboard`,e.Mouse=`mouse`,e.Gamepad=`gamepad`})($||={});var oa=f({deviceName:``,deviceType:i($),gamepadBrand:pe(``,{alsoUndefined:!0})}),sa={0:$.Gamepad,1:$.Gamepad,2:$.Gamepad,3:$.Gamepad,"any-gamepad":$.Gamepad,keyboard:$.Keyboard,mouse:$.Mouse},ca=[C.LeftStickX,C.LeftStickY,C.RightStickX,C.RightStickY],la={[$.Gamepad]({assignment:e,device:t}){let n={gamepadBrand:t?.gamepadBrand,gamepadModel:t?.deviceName};if(l.isIn(e.inputName,ca))return fr({...n,direction:e.direction,input:e.inputName});if(l.isEnumValue(e.inputName,C))return dr({...n,input:e.inputName})[0]},[$.Keyboard]({assignment:e}){return ia[e.inputName]?.[0]},[$.Mouse]({assignment:e}){return aa[e.inputName]?.[0]}};function ua(e){let t=ee(e||{}).flatMap(e=>e.rawInputs).toSorted((e,t)=>e.duration.milliseconds-t.duration.milliseconds)[0];return t?{deviceName:t.mapped.deviceName,deviceType:t.deviceType,gamepadBrand:t.mapped.gamepadBrand}:void 0}function da({bindingAssignments:e,bindingName:t,device:n}){let r=e?.[t]||[],i=n?.deviceType??(r.some(e=>sa[e.deviceKey]===$.Keyboard)?$.Keyboard:$.Gamepad);return r.filter(e=>sa[e.deviceKey]===i).map(e=>la[i]({assignment:e,device:n})).find(l.isTruthy)}export{se as $,ze as A,Oe as B,Le as C,We as D,Ve as E,Ne as F,h as G,_e as H,Me as I,p as J,xe as K,ke as L,Ue as M,Ie as N,Ge as O,Fe as P,le as Q,De as R,Ze as S,Xe as T,Se as U,m as V,ve as W,pe as X,me as Y,fe as Z,rt as _,Z as a,tt as b,S as c,st as d,ie as et,lt as f,at as g,it as h,$ as i,v as j,Ye as k,x as l,b as m,da as n,C as o,ct as p,ge as q,oa as r,dt as s,ua as t,ut as u,et as v,Be as w,$e as x,ot as y,g as z};