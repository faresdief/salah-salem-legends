(function(S){'use strict';
const {CARS,Vehicle,Track,TRACK_PTS,TRACKS,wrap,clamp:cl}=S,$=id=>document.getElementById(id),LAPS=3,NAI=5;
function restyleMenu(g){const menu=$('menu');if(!menu||$('skyline'))return;
 const sk=document.createElement('div');sk.id='skyline';sk.setAttribute('aria-hidden','true');sk.innerHTML='<svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice"><circle cx="990" cy="40" r="36" fill="#f4eeda" opacity=".13"/><circle cx="990" cy="40" r="22" fill="#f4eeda" opacity=".92"/><g fill="#cdd8ff"><circle class="stw" cx="80" cy="30" r="1.5" opacity=".7"/><circle cx="200" cy="62" r="1.1" opacity=".45"/><circle class="stw" cx="330" cy="26" r="1.3" opacity=".6" style="animation-delay:.7s"/><circle cx="470" cy="54" r="1" opacity=".4"/><circle class="stw" cx="620" cy="22" r="1.4" opacity=".65" style="animation-delay:1.4s"/><circle cx="760" cy="58" r="1" opacity=".4"/><circle class="stw" cx="880" cy="90" r="1.2" opacity=".5" style="animation-delay:2.1s"/><circle cx="1090" cy="70" r="1.1" opacity=".45"/><circle class="stw" cx="1160" cy="30" r="1.4" opacity=".6" style="animation-delay:1s"/><circle cx="540" cy="90" r="1" opacity=".35"/></g><g fill="#060a18"><rect x="0" y="150" width="1200" height="70"/><rect x="40" y="92" width="60" height="128"/><rect x="122" y="112" width="44" height="108"/><rect x="182" y="72" width="70" height="148"/><rect x="272" y="106" width="50" height="114"/><path d="M330 180 L341 72 L359 72 L370 180 Z"/><ellipse cx="350" cy="63" rx="21" ry="12"/><rect x="347" y="32" width="6" height="26" rx="3"/><rect x="402" y="96" width="66" height="124"/><rect x="492" y="116" width="48" height="104"/><rect x="562" y="80" width="78" height="140"/><rect x="662" y="108" width="52" height="112"/><rect x="732" y="88" width="64" height="132"/><rect x="822" y="112" width="46" height="108"/><rect x="892" y="98" width="70" height="122"/><rect x="987" y="118" width="50" height="102"/><rect x="1062" y="86" width="72" height="134"/><rect x="1150" y="112" width="50" height="108"/></g><g fill="#ffd890" opacity=".55"><rect x="56" y="106" width="5" height="7"/><rect x="72" y="126" width="5" height="7"/><rect x="196" y="88" width="5" height="7"/><rect x="214" y="112" width="5" height="7"/><rect x="288" y="120" width="5" height="7"/><rect x="344" y="82" width="4" height="6"/><rect x="352" y="98" width="4" height="6"/><rect x="346" y="116" width="4" height="6"/><rect x="418" y="112" width="5" height="7"/><rect x="436" y="134" width="5" height="7"/><rect x="580" y="96" width="5" height="7"/><rect x="600" y="122" width="5" height="7"/><rect x="748" y="104" width="5" height="7"/><rect x="766" y="130" width="5" height="7"/><rect x="908" y="114" width="5" height="7"/><rect x="928" y="138" width="5" height="7"/><rect x="1080" y="102" width="5" height="7"/><rect x="1100" y="128" width="5" height="7"/></g></svg>';menu.insertBefore(sk,menu.firstChild);
 const shell=menu.querySelector('.shell'),top=shell.querySelector('.top'),tabs=$('tabs'),grid=$('tRace'),side=grid.querySelector('.side'),mis=$('misCard'),lobby=$('tLobby');
 const dr=document.createElement('div');dr.id='drawer';dr.hidden=true;
 dr.innerHTML='<div class="dback"></div><div class="dsheet glass"><header class="dtop"><b>القائمة</b><button id="dClose" aria-label="قفل">✕</button></header><div class="dbody"></div></div>';
 menu.appendChild(dr);const db=dr.querySelector('.dbody');
 if(tabs)db.appendChild(tabs);if(lobby)db.appendChild(lobby);if(side)db.appendChild(side);if(mis)db.appendChild(mis);
 dr.querySelector('.dback').onclick=()=>{dr.hidden=true};dr.querySelector('#dClose').onclick=()=>{dr.hidden=true};
 const openTo=id=>{dr.hidden=false;const e=$(id);if(e)setTimeout(()=>{try{e.scrollIntoView({block:'start'})}catch(_){/*noop*/}},60)};
 const mkI=(t,aria,fn)=>{const b=document.createElement('button');b.className='icb glass';b.innerHTML=t;b.setAttribute('aria-label',aria);b.onclick=fn;top.appendChild(b);return b};
 const svgT='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
  svgC='<svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M7 4h10v4.5a5 5 0 0 1-10 0V4zM7 6.5H4v1a3 3 0 0 0 3 3M17 6.5h3v1a3 3 0 0 1-3 3"/></svg>',
  svgB='<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
 mkI(svgT,'تحدي اليوم',()=>openTo('dCard'));mkI(svgC,'المسيرة',()=>openTo('carCard'));mkI(svgB,'كل القائمة',()=>{dr.hidden=!dr.hidden});
 const chips=document.createElement('div');chips.id='chips';
 chips.innerHTML='<button class="chip on" data-c="race">سباق</button><button class="chip" data-c="night">سباق ليلي</button><button class="chip" data-c="roam">مدينة التاكسي</button><button class="chip" data-c="real">القاهرة الحقيقية</button>';
 grid.appendChild(chips);g.chip='race';
 const goB=$('go'),LBL={race:'ابدأ السباق',night:'ابدأ السباق الليلي',roam:'ابدأ الشغل في المدينة',real:'قُد القاهرة الحقيقية'};
 chips.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{g.chip=b.dataset.c;chips.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b));goB.textContent=LBL[g.chip]||'ابدأ السباق';
  if(g.chip==='race'||g.chip==='night'){const mb=document.querySelector('#modes [data-m="'+(g.chip==='night'?'night':'race')+'"]');if(mb)mb.click()}});
 goB.onclick=()=>{g.audio.init();
  if(g.chip==='roam'&&g.roam){g.roam.start();return}
  if(g.chip==='real'&&g.real){g.real.start();return}
  g.career=0;g.start()};
}
const KM={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Space:'hb'};
const ATM=['morning','fog','rain','night'],ATN={morning:'صباح',fog:'ضباب',rain:'مطر',chase:'مطاردة: البوليس ورا منك. اهرب، لمّ البنزين الأخضر، ولو مسكوك 3 ثواني خلصت. المكافأة x1.8.',night:'ليل'},RPAL=[0xe63946,0xf4a300,0x2ec4b6,0x9b5de5,0x00a8e8,0xff6f91],PAL=[0x2f4a6b,0x8a1f1f,0x3d5a3a,0x6b6f75,0x1e1e1e,0xb8b8b8];
const STATS=[['top','السرعة القصوى'],['acc','التسارع'],['hnd','التحكم'],['mass','الثبات'],['drift','الانزلاق']];
const CAREER=['city','corniche','ring','desert'],CPTS=[10,7,5,3,2,1],CPR=['وسط البلد','الكورنيش','الدائري','طريق الصحراء'];
const NOTE={night:'سباق 3 لفات بالليل بالنور العالي. المكافأة أكتر 50%.',race:'3 لفات ضد 5 منافسين. اكسب فلوس من مركزك ومن الدرفت والتجاوزات القريبة عشان تفتح عربيات جديدة.',trial:'3 لفات لوحدك على الحلبة والهدف أسرع لفة. بتسابق شبح أسرع لفة مسجلة ليك.'};
const PRICE={verna:0,taxi:450,fiat:950,micro:1500,empow:2200,amg:4500,m4:7000,p911:10000},REWARD=[120,90,70,50,35,25];
const fmt=t=>{if(t==null||!isFinite(t))return '--:--.-';const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(1)};
class Game{
 constructor(){this.audio=new S.AudioEngine();this.lobby=new S.LobbyManager(new S.NetworkBridge());this.trk=(()=>{let k='city';try{k=localStorage.getItem('ss3d_track')||'city'}catch(e){}return TRACKS.some(t=>t.id===k)?k:'city'})();this.tk=new Track(TRACKS.find(t=>t.id===this.trk).pts,3.5);
  const DO={man:false,abs:true,tcs:true,sa:true,tilt:false,inv:false,low:false};try{this.opt=Object.assign({},DO,JSON.parse(localStorage.getItem('ss3d_opt')||'{}'))}catch(e){this.opt=Object.assign({},DO)}this.tilt=0;this.ft=16.7;this.fc=-150;
  this.keys={};this.inp={steer:0,thr:0,brk:0,hb:0};this.sel=0;this.mode='race';this.atm='morning';this.state='MENU';this.paused=false;this.t=0;this.acc=0;this.view=0;this.hl=true;this.bump=0;this.ch=0;this.txt={};this.ai=[];this.cache={};this.mf=0;
  this.coarse=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;document.body.classList.toggle('touch',this.coarse);
 this.coins=0;this.own={verna:1};try{this.coins=+localStorage.getItem('ss3d_coins')||0;this.own=Object.assign({verna:1},JSON.parse(localStorage.getItem('ss3d_own')||'{}'))}catch(e){}
 this.mapP=null;this.gh=null;this.drift=0;this.driftNext=100;this.nearT=0;this.rec=[];this.recT=0;
  this.cells=[];for(let i=0;i<10;i++){const e=document.createElement('i');$('trb').appendChild(e);this.cells.push(e)}
  this.dots=CARS.map(()=>{const e=document.createElement('i');$('dots').appendChild(e);return e});
  try{this.world=new S.World($('cv'),null,this.tk,this.trk);this.prev=new S.Preview($('pv'));this.fx={skid:new S.Skids(this.world.scene),smoke:new S.Smoke(this.world.scene)}}catch(e){console.error(e);this.world=null;$('err').hidden=false;$('err').textContent=window.THREE?'تعذّر تشغيل الرسم ثلاثي الأبعاد على هذا الجهاز أو المتصفح.':'تعذّر تحميل محرك الرسم ثلاثي الأبعاد. اتأكد من الاتصال بالإنترنت وأعد تحميل الصفحة.';$('go').disabled=true}
  this.initChase();this.bind();this.applyLow();this.initDaily();this.initTracks();this.initCareer();this.initUp();try{if(S.Roam)this.roam=new S.Roam(this)}catch(e){console.error(e)}try{if(S.RealMap)this.real=new S.RealMap(this)}catch(e){console.error(e)}try{restyleMenu(this)}catch(e){console.error(e)}this.pick(0);this.setAtm(0);this.chalFromUrl();$('modeNote').textContent=NOTE.race;this.last=performance.now();requestAnimationFrame(t=>this.loop(t))}
 bind(){const A=(s,f)=>document.querySelectorAll(s).forEach(f);
  addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;this.audio.init();const k=KM[e.code];if(k){this.keys[k]=true;e.preventDefault();return}
   switch(e.code){case'KeyH':this.audio.horn();break;case'KeyL':this.hl=!this.hl;$('bLight').classList.toggle('on',this.hl);break;case'KeyM':this.toggleM();break;case'KeyN':this.setAtm(1);break;case'KeyC':this.view^=1;break;case'KeyT':this.recover();break;
    case'KeyE':if(this.pl)this.pl.shift(1);break;case'KeyQ':if(this.pl)this.pl.shift(-1);break;case'KeyP':case'Escape':if(this.paused)this.resume();else this.pause();break;case'KeyR':if(this.state==='REAL')this.real.restart();else if(this.state!=='MENU')this.start();break;case'Enter':if(this.state==='MENU'&&document.activeElement.tagName!=='BUTTON')this.start()}});
  addEventListener('keyup',e=>{const k=KM[e.code];if(k)this.keys[k]=false});addEventListener('pointerdown',()=>this.audio.init());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.pause()});
  A('#touch [data-k]',b=>{const k=b.dataset.k,up=()=>{b.classList.remove('dn');this.keys[k]=false};
   b.addEventListener('pointerdown',e=>{e.preventDefault();this.audio.init();b.classList.add('dn');if(k==='su'&&this.pl)this.pl.shift(1);if(k==='sd'&&this.pl)this.pl.shift(-1);this.keys[k]=true});['pointerup','pointercancel','pointerleave'].forEach(n=>b.addEventListener(n,up));b.addEventListener('contextmenu',e=>e.preventDefault())});
  const OPT=[['oMan','man'],['oAbs','abs'],['oTcs','tcs'],['oSa','sa'],['oTilt','tilt'],['oInv','inv'],['oLow','low'],['oRam','ram']];
  for(const[id,k]of OPT){const e=$(id);e.checked=!!this.opt[k];e.onchange=()=>{this.opt[k]=e.checked;try{localStorage.setItem('ss3d_opt',JSON.stringify(this.opt))}catch(x){}
   if(k==='tilt'&&e.checked)this.enableTilt();if(k==='low'||k==='ram')this.applyLow();if(k==='ram'&&e.checked)this.popup('رمضان كريم');if(this.pl)this.pl.opt=this.opt;this.shiftUi()}}
 {const ta=$('saveCode'),eb=$('svExp'),ib=$('svImp'),cb=$('svCloud');
  const mk=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('ss3d_')===0&&k.indexOf('ss3d_ghost_')!==0)o[k]=localStorage.getItem(k)}return 'SS1:'+btoa(unescape(encodeURIComponent(JSON.stringify(o))))};
  const apply=c=>{c=(c||'').trim();if(c.indexOf('SS1:')!==0||c.length>200000){this.popup('الكود غير صحيح');return}
   const o=JSON.parse(decodeURIComponent(escape(atob(c.slice(4)))));let n=0;for(const k in o){if(k.indexOf('ss3d_')===0&&k.indexOf('ss3d_ghost_')!==0&&typeof o[k]==='string'&&o[k].length<100000){localStorage.setItem(k,o[k]);n++}}
   if(!n){this.popup('الكود فاضي');return}this.popup('تم الاسترجاع');setTimeout(()=>location.reload(),900)};
  if(eb)eb.onclick=()=>{try{const c=mk();ta.value=c;ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(x){}try{navigator.clipboard&&navigator.clipboard.writeText(c).catch(()=>{})}catch(x){}this.popup(ok?'تم نسخ الكود':'الكود جاهز، انسخه')}catch(x){this.popup('تعذر إنشاء الكود')}};
  if(cb)cb.onclick=async()=>{try{if(!S.lb||!S.lb.cloudSave){this.popup('السحابة مش متاحة');return}this.popup('بحفظ على السحابة...');const k=await S.lb.cloudSave(mk());ta.value='CL1:'+k;ta.select();try{navigator.clipboard&&navigator.clipboard.writeText('CL1:'+k).catch(()=>{})}catch(x){}this.popup('اتحفظ. احتفظ بكود السحابة')}catch(x){this.popup('تعذر الحفظ على السحابة، استخدم الكود العادي')}};
  const cg=$('chGo'),sh=$('chShare');
  if(cg)cg.onclick=()=>{const o=this.chalParse($('chCode').value);if(!o){this.popup('الكود غير صحيح');return}this.chalStart(o)};
  if(sh)sh.onclick=()=>{const b=this.best;if(b==null){this.popup('خلّص لفة الأول');return}const o={t:this.trk,c:CARS[this.sel].id,b:Math.round(b*100)/100},code='CH1:'+btoa(unescape(encodeURIComponent(JSON.stringify(o)))),url=location.origin+location.pathname+'?ch='+encodeURIComponent(code),txt='عملت '+o.b.toFixed(2)+' ث في طرق مصر، تقدر تهزمني؟';try{if(navigator.share){navigator.share({title:'تحدي طرق مصر',text:txt,url}).catch(()=>{});return}}catch(x){}try{navigator.clipboard.writeText(txt+' '+url).catch(()=>{})}catch(x){}this.popup('اتنسخ رابط التحدي')};
  if(ib)ib.onclick=async()=>{try{let c=(ta.value||'').trim();if(c.indexOf('CL1:')===0){if(!S.lb||!S.lb.cloudLoad){this.popup('السحابة مش متاحة');return}this.popup('بجيب من السحابة...');c=await S.lb.cloudLoad(c.slice(4));if(!c){this.popup('كود السحابة مش موجود');return}}apply(c)}catch(x){this.popup('الكود غير صحيح')}}}
  $('pr').onclick=()=>this.pick(this.sel-1);$('nx').onclick=()=>this.pick(this.sel+1);
  A('#modes .mode',b=>b.onclick=()=>{const m=b.dataset.m;this.night=m==='night';this.chase=m==='chase';this.daily=0;this.mode=(this.night||this.chase)?'race':m;$('modeNote').textContent=this.night?NOTE.night:this.chase?NOTE.chase:NOTE[this.mode];A('#modes .mode',x=>x.classList.toggle('on',x===b))});
  A('#tabs button',b=>b.onclick=()=>{A('#tabs button',x=>x.classList.toggle('on',x===b));$('tRace').hidden=b.dataset.t!=='tRace';$('tLobby').hidden=b.dataset.t!=='tLobby'});
  $('buy').onclick=()=>this.buy();$('go').onclick=()=>{this.career=0;this.start()};this.initPaint();this.initWheel();if($('share'))$('share').onclick=()=>this.share();this.misRender();$('again').onclick=()=>{this.career=0;this.start()};$('restart').onclick=()=>{if(this.state==='ROAM')this.roam.restart();else if(this.state==='REAL')this.real.restart();else this.start()};$('resume').onclick=()=>this.resume();$('toMenu').onclick=()=>this.toMenu();$('toMenu2').onclick=()=>this.toMenu();
  $('bPause').onclick=()=>this.pause();$('bMute').onclick=()=>this.toggleM();$('bLight').onclick=()=>{this.hl=!this.hl;$('bLight').classList.toggle('on',this.hl)};$('atm').onclick=()=>this.setAtm(1)}
 enableTilt(){const go=()=>{if(this.tiltOn)return;this.tiltOn=true;addEventListener('deviceorientation',e=>{const a=(screen.orientation&&screen.orientation.angle)||window.orientation||0;let t=a===0?e.gamma:a===90?e.beta:a===270||a===-90?-e.beta:-e.gamma;this.tilt=isFinite(t)?cl(t,-40,40):0})};
  try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')go()}).catch(()=>{});else go()}catch(e){}}
 shiftUi(){document.querySelectorAll('#touch .sh').forEach(b=>b.hidden=!this.opt.man)}
 toggleM(){this.audio.init();$('bMute').classList.toggle('off',this.audio.mute())}
 setAtm(d){this.atm=ATM[(ATM.indexOf(this.atm)+d)%ATM.length];document.body.classList.toggle('rain',this.atm==='rain');$('atm').textContent=ATN[this.atm];if(this.world)this.world.atm(this.atm)}
 pick(i){this.sel=(i+CARS.length)%CARS.length;const d=CARS[this.sel];$('cn').textContent=d.name;if($('paint'))$('paint').hidden=d.id!=='verna';
  $('stats').innerHTML=STATS.map(([k,n])=>'<div class="st"><span>'+n+'</span><i><b style="width:'+Math.round(d[k]*100)+'%"></b></i></div>').join('');this.dots.forEach((e,j)=>e.classList.toggle('on',j===this.sel));if(this.prev)this.prev.set(d);this.garage()}
 garage(){const d=CARS[this.sel],locked=!this.own[d.id],b=$('buy');b.hidden=!locked;
 if(locked){b.textContent='افتح بـ '+PRICE[d.id]+' جنيه';b.disabled=this.coins<PRICE[d.id];b.style.opacity=b.disabled?.55:1}
 this.set('coinB',String(this.coins));this.upUi();const h=$('hudCoins');if(h)h.textContent=this.coins}
 saveCoins(){try{localStorage.setItem('ss3d_coins',String(this.coins));localStorage.setItem('ss3d_own',JSON.stringify(this.own))}catch(e){}}
 addCoins(n,msg){this.coins+=n;this.saveCoins();this.garage();if(msg)this.popup(msg);this.audio.coin()}
 buy(){const d=CARS[this.sel],p=PRICE[d.id];if(this.own[d.id]||this.coins<p)return;
 this.coins-=p;this.own[d.id]=1;this.saveCoins();this.audio.init();this.audio.unlock();this.popup('اتفتحت: '+d.name);this.garage()}
 set(id,v){if(this.txt[id]!==v){this.txt[id]=v;$(id).textContent=v}}
 popup(t){const b=$('pops');if(b.children.length>2)b.firstChild.remove();const d=document.createElement('div');d.className='pop';d.textContent=t;b.appendChild(d);setTimeout(()=>d.remove(),1800)}
 place(v,s,d){const tk=this.tk,i=Math.floor(s/tk.ds)%tk.N,p=tk.P[i],l=tk.Lf[i];v.x=p.x+l.x*d;v.z=p.z+l.z*d;v.h=tk.H[i]}
 start(){if(!this.world)return;if(this.night&&this.atm!=='night'){this.atm='night';this.setAtm(0)}if(!this.own[CARS[this.sel].id]){this.popup('العربية مقفولة، افتحها الأول');return}
 this.audio.init();const w=this.world,tk=this.tk,d=CARS[this.sel],race=this.mode==='race';
  if(this.itm)for(const o of this.itm)w.scene.remove(o.m);this.itm=[];this.nit=0;this.oil=0;this.fuel=100;this.bust=0;this.busted=0;if($('chTxt')){$('chTxt').hidden=!this.chase;this.txt.chTxt=null}for(const a of this.ai)w.scene.remove(a.car.g);if(this.pcar)w.scene.remove(this.pcar.g);this.ai=[];
  this.pl=new Vehicle(this.daily&&this.sel===0?d:this.tuned(d));this.pl.opt=this.opt;if(this.fx)this.fx.skid.clear();this.fc=-150;this.pcar=S.makeCar(d,true);w.scene.add(this.pcar.g);const ps=race?3:0;this.place(this.pl,tk.len-12-ps*9,ps%2?3.4:-3.4);
  if(race){let sl=0;const lanes=[-3.4,3.4];for(let k=0;k<NAI+1;k++){if(k===ps)continue;if(this.chase&&this.ai.length>=3)break;const base=this.chase?CARS.find(c=>c.id==='amg'):CARS[(k+this.sel+1)%CARS.length],def=Object.assign({},base);if(base.id!=='taxi')def.col=this.chase?0xf2f2f2:RPAL[k%RPAL.length];
   const key=this.chase?'pol'+d.id:base.id;this.cache[key]=this.cache[key]||(this.chase?tk.profile(d.vt*.99,d.mu*.97,d.aa*1.4,8):tk.profile(base.vt*.98,base.mu*.95,base.aa*1.4,8));
   const a={def,car:S.makeCar(def,false),prof:this.cache[key],pol:this.chase?1:0,s:this.chase?tk.len-55-k*9:tk.len-12-k*9,d:lanes[k%2],lane:lanes[k%2]*(.4+Math.random()*.8),v:0,lap:0,skill:Math.min(.99,.86+Math.random()*.12+(this.career?(this.carD().season-1)*.015:0)),veh:{x:0,z:0,h:0,ax:0,ay:0,vx:0,dl:0,brk:0}};
   this.place(a.veh,a.s,a.d);w.scene.add(a.car.g);if(this.chase)this.siren(a);this.ai.push(a)}
  const NT=this.opt.low?3:((w.night?10:6)+(this.opt.ram&&w.night?2:0));for(let k=0;k<NT;k++){const base=CARS[(k*3+1)%4],def=Object.assign({},base);if(base.id!=='taxi')def.col=PAL[k%PAL.length];const tv=14+Math.random()*6,ln=(k%2?1:-1)*3.4+(Math.random()-.5)*1.6,s0=150+(tk.len-330)*(k+.5)/NT;
   const a={tr:1,tv,def,car:S.makeCar(def,false),prof:null,s:s0,d:ln,lane:ln,v:tv,lap:0,skill:1,veh:{x:0,z:0,h:0,ax:0,ay:0,vx:0,dl:0,brk:0}};this.place(a.veh,a.s,a.d);w.scene.add(a.car.g);this.ai.push(a)}}this.mkItems();this.pa={s:0,d:0,v:0};this.all=this.ai.concat([this.pa]);
  this.loc=tk.locate(this.pl.x,this.pl.z);this.ps=this.loc.sf*tk.ds;this.lap=0;this.lapStart=0;this.best=null;this.last3=null;this.fin=0;this.pos=1;this.maxV=0;this.raceT=0;this.cd=3;this.tot=1;this.state='COUNT';this.paused=false;this.acc=0;this.bump=0;this.ch=this.pl.h;this.keys={};
  this.maxV=0;this.drift=0;this.driftNext=100;this.nearT=0;this.rec=[];this.recT=0;this.mapP=null;this.setGhost();
 Object.assign(this.pa,{s:this.ps,d:this.loc.d,v:0});$('menu').hidden=true;$('over').hidden=true;$('pause').hidden=true;$('hud').hidden=false;w.measure();w.compile();this.shiftUi();$('touch').hidden=!this.coarse;$('bLight').classList.toggle('on',this.hl);$('count').hidden=false;this.txt={}}
  carD(){let d=null;try{d=JSON.parse(localStorage.getItem('ss3d_career')||'null')}catch(e){}if(!d||typeof d!=='object')d={};d.season=Math.max(1,d.season|0);d.round=Math.min(3,Math.max(0,d.round|0));d.unlocked=Math.min(3,Math.max(d.round,d.unlocked|0));d.pts=Array.isArray(d.pts)?d.pts.slice(0,4):[];d.titles=d.titles|0;return d}
 carSave(d){try{localStorage.setItem('ss3d_career',JSON.stringify(d))}catch(e){}}
 carUi(){const d=this.carD(),e=$('carInfo');if(!e)return;const tot=d.pts.reduce((a,b)=>a+b,0);e.innerHTML='';const h=document.createElement('div');h.className='lbrow';const a=document.createElement('span');a.textContent='الموسم '+d.season+' - الجولة '+(d.round+1)+'/4';const b=document.createElement('b');b.textContent=tot+' نقطة';h.append(a,b);e.appendChild(h);
  const n=document.createElement('p');n.className='foot';n.textContent='الجولة الجاية: '+CPR[d.round]+(d.titles?' | بطولات: '+d.titles:'');e.appendChild(n)}
 upg(){try{return JSON.parse(localStorage.getItem('ss3d_up')||'{}')}catch(e){return{}}}
 upLv(id){const u=this.upg()[id]||{};return{e:u.e|0,t:u.t|0,n:u.n|0}}
 tuned(d){const l=this.upLv(d.id);return Object.assign({},d,{T:d.T*(1+.07*l.e),mu:d.mu*(1+.035*l.t),nl:l.n})}
 upCost(d,lv){return Math.round((200+(PRICE[d.id]||0)*.12)*(lv+1)/10)*10}
 initUp(){const m=document.querySelector('.modes-card');if(!m||$('upCard'))return;const c=document.createElement('div');c.className='card';c.id='upCard';c.innerHTML='<h2>التعديلات</h2><div id="upRows"></div><p class="foot">المحرك أقوى، الكاوتش أمسك، النيترو أطول وأسرع. لكل عربية مستوياتها.</p>';m.parentNode.insertBefore(c,m);this.upUi()}
 upUi(){const r=$('upRows');if(!r)return;const d=CARS[this.sel],own=!!this.own[d.id],l=this.upLv(d.id),T=[['e','المحرك'],['t','الكاوتش'],['n','النيترو']];r.innerHTML='';
  if(!own){r.innerHTML='<p class="foot">افتح العربية الأول عشان تعدّلها.</p>';return}
  for(const [k,n] of T){const lv=l[k],row=document.createElement('div');row.className='st';const b=document.createElement('button');b.className='btn tint';const mx=lv>=3;b.textContent=mx?'أقصى':'ارفع '+this.upCost(d,lv)+' جنيه';b.disabled=mx||this.coins<this.upCost(d,lv);b.style.opacity=b.disabled?.55:1;b.onclick=()=>this.upBuy(k);
   row.innerHTML='<span>'+n+' '+'★'.repeat(lv)+'☆'.repeat(3-lv)+'</span>';row.appendChild(b);r.appendChild(row)}}
 upBuy(k){const d=CARS[this.sel],l=this.upLv(d.id);if(!this.own[d.id]||l[k]>=3)return;const p=this.upCost(d,l[k]);if(this.coins<p)return;this.coins-=p;l[k]++;const u=this.upg();u[d.id]=l;try{localStorage.setItem('ss3d_up',JSON.stringify(u))}catch(e){}this.saveCoins();this.audio.init();this.audio.coin();this.popup('تم التعديل');this.garage()}
 initChase(){const m=$('modes');if(!m||m.querySelector('[data-m=chase]'))return;this.chase=0;const b=document.createElement('button');b.className='mode';b.dataset.m='chase';b.textContent='مطاردة';m.appendChild(b);const h=$('hud');if(h){const e=document.createElement('div');e.id='chTxt';e.style.cssText='position:absolute;left:50%;transform:translateX(-50%);top:118px;padding:5px 14px;border-radius:14px;background:rgba(10,14,24,.78);color:#fff;font:700 15px system-ui;z-index:5;pointer-events:none;white-space:nowrap';e.hidden=true;h.appendChild(e)}}
 siren(a){const T=window.THREE,mk=c=>{const o=new T.Mesh(new T.BoxGeometry(.32,.12,.22),new T.MeshBasicMaterial({color:c}));o.position.set(c===0xff2020?-.2:.2,1.5,.1);a.car.g.add(o);return o};a.lb=[mk(0xff2020),mk(0x2060ff)]}
 chaseStep(h,I){if(this.state!=='RACING')return;const p=this.pl;this.fuel=Math.max(0,this.fuel-(.25+.5*I.thr)*h);if(this.fuel<=0){if(!this.dry){this.dry=1;this.popup('البنزين خلص!')}I.thr=0}else this.dry=0;
  let near=false;for(const a of this.ai){if(!a.pol)continue;if(a.lb){const ph=Math.floor(this.t*7)%2===0;a.lb[0].visible=ph;a.lb[1].visible=!ph}{const len=this.tk.len;let q=a.s-this.ps;if(q<-len/2)q+=len;if(q>len/2)q-=len;if(q>35){a.s=((this.ps-48-Math.random()*20)%len+len)%len;a.v=Math.max(10,p.speed*.9);a.d=this.loc.d}}if(Math.hypot(a.veh.x-p.x,a.veh.z-p.z)<8)near=true}
  this.bust=near?this.bust+h*34:Math.max(0,this.bust-h*14);
  if(this.bust>=100){this.bust=100;this.busted=1;this.state='FIN';this.fin=2;this.finT=this.raceT;this.finPos=this.tot;this.popup('اتقبض عليك!')}
  this.set('chTxt','بنزين '+Math.round(this.fuel)+'%  ·  القبض '+Math.round(this.bust)+'%')}
 dTrack(){return TRACKS[this.misDay()%TRACKS.length].id}
 initDaily(){const m=document.querySelector('.modes-card');if(!m||$('dCard'))return;const c=document.createElement('div');c.className='card';c.id='dCard';c.innerHTML='<h2>تحدي اليوم</h2><div id="dInfo" class="foot"></div><div id="dList" class="lblist"></div><button class="btn primary" id="dGo">ابدأ التحدي</button><p class="foot">نفس الحلبة ونفس العربية (فيرنا بدون تعديلات) للكل. أسرع لفة تتسجل في اللوحة.</p>';m.parentNode.insertBefore(c,m);
  $('dGo').onclick=()=>{this.audio.init();this.career=0;const b=document.querySelector('#modes [data-m=trial]');if(b)b.click();this.daily=1;this.pick(0);this.useTrack(this.dTrack(),true);this.start()};
  this.dailyUi();setTimeout(()=>this.dailyUi(),2500)}
 dLocal(){let l=null;try{l=JSON.parse(localStorage.getItem('ss3d_daily')||'null')}catch(e){}return l&&l.day===this.misDay()?l:null}
 dailyDone(lt){const day=this.misDay(),l=this.dLocal();if(l&&lt>=l.best)return;try{localStorage.setItem('ss3d_daily',JSON.stringify({day,best:lt}))}catch(e){}this.popup('أحسن لفة النهاردة '+fmt(lt));if(S.lb&&S.lb.dailySend)S.lb.dailySend(day,lt).then(ok=>{if(ok){this.popup('اتسجلت في لوحة اليوم');this.dailyUi()}}).catch(()=>{})}
 dailyUi(){const i=$('dInfo'),L=$('dList');if(!i)return;const day=this.misDay(),df=TRACKS.find(t=>t.id===this.dTrack()),l=this.dLocal();i.textContent='حلبة النهاردة: '+df.n+' | أحسن لفة ليك: '+(l?fmt(l.best):'--');
  if(!S.lb||!S.lb.dailyTop){L.textContent='';return}S.lb.dailyTop(day).then(r=>{L.textContent='';r.rows.forEach((x,k)=>{const row=document.createElement('div');row.className='lbrow'+(x.id.slice(-28)===r.uid?' me':'');const a=document.createElement('span');a.textContent=(k+1)+'. '+String(x.name||'').slice(0,16);const b=document.createElement('b');b.textContent=fmt(x.best);row.append(a,b);L.appendChild(row)});if(!r.rows.length)L.textContent='لسه محدش جرّب. كن الأول!'}).catch(()=>{L.textContent='اللوحة مش متاحة دلوقتي (أوفلاين).';if(!this._dr){this._dr=1;setTimeout(()=>this.dailyUi(),7000)}})}
 initCareer(){const m=document.querySelector('.modes-card');if(!m||$('carCard'))return;const c=document.createElement('div');c.className='card';c.id='carCard';c.innerHTML='<h2>المسيرة</h2><div id="carInfo"></div><button class="btn primary" id="carGo">ابدأ الجولة</button>';m.parentNode.insertBefore(c,m);
  $('carGo').onclick=()=>{this.audio.init();const d=this.carD();this.career=1;const rb=document.querySelector('#modes [data-m=race]');if(rb)rb.click();this.useTrack(CAREER[d.round],true);this.start()};this.carUi()}
 carFinish(){const d=this.carD(),p=this.finPos;const pt=CPTS[p-1]||0;d.pts[d.round]=pt;let msg='المسيرة: +'+pt+' نقطة';d.unlocked=Math.max(d.unlocked,Math.min(3,d.round+1));
  if(d.round>=3){const tot=d.pts.reduce((a,b)=>a+b,0),bonus=tot>=34?600:tot>=26?350:tot>=16?180:80;msg+=' | خلص الموسم '+d.season+': '+tot+' نقطة، مكافأة '+bonus+' جنيه'+(tot>=34?' (بطل!)':'');if(tot>=34)d.titles++;this.coins+=bonus;this.saveCoins();this.garage();if(S.lb)try{S.lb.add(bonus,CARS[this.sel].name)}catch(e){}d.season++;d.round=0;d.pts=[]}else d.round++;
  this.carSave(d);this.career=0;let e=$('oCar');if(!e){e=document.createElement('small');e.id='oCar';e.className='cen';$('oNew').parentNode.insertBefore(e,$('oNew').nextSibling)}e.textContent=msg;e.hidden=false;this.carUi();this.trkUi()}
 chalParse(c){try{c=String(c||'').trim();const m=c.match(/CH1:[A-Za-z0-9+\/=]+/);if(!m)return null;const o=JSON.parse(decodeURIComponent(escape(atob(m[0].slice(4)))));if(!TRACKS.some(t=>t.id===o.t)||!CARS.some(x=>x.id===o.c)||!(o.b>5&&o.b<1000))return null;return{t:o.t,c:o.c,b:+o.b}}catch(e){return null}}
 chalStart(o){this.chal=o;if(this.state==='MENU')this.useTrack(o.t,true);const i=CARS.findIndex(x=>x.id===o.c);let m='';if(i>=0&&this.own[CARS[i].id])this.pick(i);else m=' (العربية دي مش عندك، سابق بعربيتك)';const tn=(TRACKS.find(t=>t.id===o.t)||{}).n||'';const n=$('chNote');if(n)n.textContent='التحدي: اهزم '+o.b.toFixed(2)+' ث على '+tn+m;this.popup('تحدي: '+o.b.toFixed(2)+' ث')}
 chalFromUrl(){try{const c=new URLSearchParams(location.search).get('ch'),o=this.chalParse(c);if(o)setTimeout(()=>this.chalStart(o),400)}catch(e){}}
 chalCheck(){const c=this.chal;if(!c||this.best==null||c.t!==this.trk)return;const d=this.best-c.b;this.popup(d<=0?'كسبت التحدي! أسرع بـ '+(-d).toFixed(2)+' ث':'خسرت التحدي بـ '+d.toFixed(2)+' ث')}
 kid(id){return this.trk==='city'?id:id+'@'+this.trk}
 useTrack(id,force){if(id===this.trk||this.state!=='MENU')return;const df=TRACKS.find(t=>t.id===id);if(!df)return;if(!force&&CAREER.indexOf(id)>this.carD().unlocked){this.popup('الحلبة دي بتتفتح في المسيرة');return}this.trk=id;try{localStorage.setItem('ss3d_track',id)}catch(e){}this.tk=new Track(df.pts,3.5);this.cache={};this.mapP=null;if(this.world)this.world.setTrack(this.tk,df.th);this.trkUi()}
 trkUi(){document.querySelectorAll('#tracks .mode').forEach(b=>{b.classList.toggle('on',b.dataset.t===this.trk);const lk=CAREER.indexOf(b.dataset.t)>this.carD().unlocked,t=TRACKS.find(x=>x.id===b.dataset.t);b.textContent=(lk?'🔒 ':'')+t.n;b.style.opacity=lk?.55:1});const df=TRACKS.find(t=>t.id===this.trk),e=$('trkNote');if(e)e.textContent=df.n+' - طول اللفة '+(this.tk.len/1000).toFixed(1)+' كم'}
 initTracks(){const m=document.querySelector('.modes-card');if(!m||$('tracks'))return;const c=document.createElement('div');c.className='card';c.innerHTML='<h2>الحلبة</h2><div class="seg trk" id="tracks"></div><p class="foot" id="trkNote"></p>';m.parentNode.insertBefore(c,m);const g=c.querySelector('#tracks');for(const t of TRACKS){const b=document.createElement('button');b.className='mode';b.dataset.t=t.id;b.textContent=t.n;b.onclick=()=>this.useTrack(t.id);g.appendChild(b)}this.trkUi()}
 setGhost(){if(this.gh){this.world.scene.remove(this.gh.car.g);this.gh=null}
 if(this.mode!=='trial'||!this.world)return;let g=null;try{g=JSON.parse(localStorage.getItem('ss3d_ghost_'+this.kid(CARS[this.sel].id))||'null')}catch(e){}
 if(!g||!g.s||g.s.length<10)return;const car=S.makeCar(CARS[this.sel],false);
 car.g.traverse(o=>{if(o.isMesh||o.isSprite){o.castShadow=false;o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.32;o.material.depthWrite=false}});
 if(car.spot)car.spot.intensity=0;this.world.scene.add(car.g);
 this.gh={car,dur:g.s[g.s.length-1][0],s:g.s,i:0,veh:{x:0,z:0,h:0,vx:0,dl:0,ax:0,ay:0,brk:0}}}
 updGhost(){const g=this.gh;if(!g||this.state==='COUNT')return;const t=Math.max(0,this.raceT-this.lapStart)%g.dur,s=g.s;let i=g.i;
 while(i<s.length-2&&s[i+1][0]<t)i++;while(i>0&&s[i][0]>t)i--;g.i=i;
 const a=s[i],b=s[i+1]||a,k=b[0]>a[0]?Math.min(1,(t-a[0])/(b[0]-a[0])):0;
 g.veh.x=a[1]+(b[1]-a[1])*k;g.veh.z=a[2]+(b[2]-a[2])*k;g.veh.h=a[3]+wrap(b[3]-a[3])*k;g.veh.vx=4;
 S.updCar(g.car,g.veh,.016,this.world.night)}
 recover(){if(this.state!=='RACING'||!this.pl)return;const p=this.pl,tk=this.tk,l=tk.locate(p.x,p.z,this.loc.i);const q=tk.P[l.i];const dm=p.dmg;p.reset(q.x,q.z,tk.H[l.i]);p.dmg=dm;p.vx=6;this.loc=l}
 pause(){if(this.state==='MENU'||this.state==='OVER'||this.paused)return;this.paused=true;this.keys={};$('pause').hidden=false;this.audio.update(0,false,false)}
 resume(){if(!this.paused)return;this.paused=false;$('pause').hidden=true}
 toMenu(){if(this.roam)this.roam.stop();if(this.real)this.real.stop();this.state='MENU';setTimeout(()=>this.dailyUi&&this.dailyUi(),600);this.paused=false;this.keys={};['hud','touch','pause','over','count'].forEach(i=>$(i).hidden=true);$('menu').hidden=false;this.audio.update(0,false,false)}
 loop(ts){const dt=Math.min(Math.max(0,(ts-this.last)/1000),.05);this.last=ts;
  try{this.t+=dt;if(this.state==='MENU'){if(this.prev)this.prev.render(this.t)}else if(this.state==='ROAM'){if(!this.paused)this.roam.update(dt);this.roam.draw(dt)}else if(this.state==='REAL'){if(!this.paused)this.real.update(dt);this.real.draw(dt)}else{if(!this.paused&&this.state!=='OVER')this.update(dt);this.draw(dt)}}catch(e){console.error(e)}
  requestAnimationFrame(t=>this.loop(t))}
 update(dt){const n=Math.max(1,Math.min(8,Math.ceil(dt*120))),h=dt/n;for(let i=0;i<n;i++)this.sim(h);this.post(dt)}
 sim(h){const p=this.pl,tk=this.tk,k=this.keys,I=this.inp,len=tk.len;
  if(this.state==='COUNT'){this.cd-=h;p.thr+=((k.up?1:0)-p.thr)*h*5;p.rpm=900+p.thr*3600;p.gear=0;if(this.cd<=0){this.state='RACING';this.raceT=0;$('count').textContent='انطلق';setTimeout(()=>{if(this.state!=='MENU')$('count').hidden=true},900)}}
  else{I.steer=(k.right?1:0)-(k.left?1:0);if(this.opt.tilt&&this.coarse)I.steer=cl(I.steer+(this.opt.inv?-1:1)*this.tilt/20,-1,1);I.steer=cl(I.steer+(this.wv||0),-1,1);I.thr=k.up?1:0;I.brk=k.down?1:0;I.hb=k.hb?1:0;if(this.state==='FIN'){I.steer=0;I.thr=0;I.brk=.5;I.hb=0}
   const ad=Math.abs(this.loc.d);p.grip=ad<8.4?1:ad<9.6?.96:.88;if(this.atm==='rain')p.grip*=.92;if(this.oil>0){this.oil-=h;p.grip*=.42}if(this.nit>0){this.nit-=h;if(p.vx>0&&p.vx<p.d.vt*1.12)p.vx+=13*(1+.1*(p.d.nl|0))*h}if(this.chase)this.chaseStep(h,I);p.step(h,I);this.items(h);this.raceT+=h;
   this.loc=tk.locate(p.x,p.z,this.loc.i);this.collide();const s=this.loc.sf*tk.ds;
   if(this.ps>len*.75&&s<len*.25){this.lap++;this.onLap()}else if(this.ps<len*.25&&s>len*.75)this.lap--;this.ps=s;this.pa.s=s;this.pa.d=this.loc.d;this.pa.v=p.speed;this.maxV=Math.max(this.maxV,p.vx*3.6);
 if(this.mode==='trial'){this.recT-=h;if(this.recT<=0){this.recT=.1;this.rec.push([+(this.raceT-this.lapStart).toFixed(2),+p.x.toFixed(2),+p.z.toFixed(2),+p.h.toFixed(3)])}}
 if(p.slip>.22&&p.speed>9){this.drift+=p.slip*p.speed*h;if(this.drift>=this.driftNext){this.popup('درفت '+this.driftNext);this.audio.coin();this.driftNext*=2}}}
  if(this.state!=='COUNT')for(const a of this.ai)this.aiStep(a,h)}

 misDay(){return Math.floor(Date.now()/864e5+1/12)}
 misDefs(){const M=[{k:'finish',t:'خلّص سباقين',n:2,r:80},{k:'near',t:'5 تجاوزات قريبة',n:5,r:60},{k:'drift',t:'درفت 300 نقطة',n:300,r:70},{k:'speed',t:'وصّل 160 كم/س',n:160,r:50,max:1},{k:'over',t:'تجاوز 3 منافسين',n:3,r:60},{k:'win',t:'اكسب سباق',n:1,r:120}],d=this.misDay()%6;return[M[d],M[(d+2)%6],M[(d+4)%6]]}
 misLoad(){let m=null;try{m=JSON.parse(localStorage.getItem('ss3d_mis')||'null')}catch(e){}const d=this.misDay();if(!m||m.day!==d||!m.p)m={day:d,p:{},ok:{}};return m}
 misAdd(k,v){const df=this.misDefs().find(x=>x.k===k);if(!df)return;const m=this.misLoad();m.p[k]=df.max?Math.max(m.p[k]||0,v):(m.p[k]||0)+v;let got=0;if(m.p[k]>=df.n&&!m.ok[k]){m.ok[k]=1;got=df.r}try{localStorage.setItem('ss3d_mis',JSON.stringify(m))}catch(e){}if(got){this.coins+=got;this.saveCoins();this.garage();this.popup('مهمة تمت: '+df.t+' +'+got);this.audio.coin()}this.misRender()}
 misRender(){const m=this.misLoad(),h=this.misDefs().map(d=>{const p=Math.min(d.n,m.p[d.k]||0),ok=m.ok[d.k];return '<div class="r"><span>'+(ok?'✔ ':'')+d.t+'</span><b>'+(ok?'تمت':p+'/'+d.n+' · '+d.r+' جنيه')+'</b></div>'}).join('');for(const id of['misList','oMis']){const e=$(id);if(e)e.innerHTML=h}}
 share(){const L=this.lastShare||{},u='https://faresdief.github.io/salah-salem-legends/',t=L.race?'خلصت سباق في طرق مصر: المركز '+L.pos+'/'+L.tot+' وأعلى سرعة '+L.v+' كم/س. هتغلبني؟':'عملت أسرع لفة '+fmt(L.best)+' في طرق مصر. هتغلبني؟';if(navigator.share)navigator.share({title:'طرق مصر | Egypt Roads',text:t,url:u}).catch(()=>{});else{const x=t+' '+u;if(navigator.clipboard)navigator.clipboard.writeText(x).then(()=>this.popup('اتنسخت النتيجة'),()=>{});else this.popup(x)}}

 mkItems(){const T=window.THREE,w=this.world,tk=this.tk,N=tk.N;this.itm=[];if(this.mode!=='race'&&this.mode!=='trial')return;
  const nm=new T.MeshStandardMaterial({color:0xff8a1f,emissive:0xff6a00,emissiveIntensity:1.4}),om=new T.MeshStandardMaterial({color:0x0a0a0c,roughness:.15,metalness:.6}),ng=new T.CylinderGeometry(.7,.7,.25,16),og=new T.CylinderGeometry(1.7,1.7,.03,20);
  const fg=new T.BoxGeometry(.7,.9,.45),fm=new T.MeshStandardMaterial({color:0x22cc55,emissive:0x11aa33,emissiveIntensity:1.2});const add=(kind,fr,ln)=>{const i=Math.floor(fr*N)%N,p=tk.P[i],l=tk.Lf[i],m=new T.Mesh(kind==='n'?ng:kind==='f'?fg:og,kind==='n'?nm:kind==='f'?fm:om);m.position.set(p.x+l.x*ln,kind==='n'?.9:kind==='f'?.8:.035,p.z+l.z*ln);w.scene.add(m);this.itm.push({k:kind,m,x:m.position.x,z:m.position.z,t:0,fr,ln})};
  for(let k=0;k<6;k++)add('n',.1+k*.15,(k%2?1:-1)*(1.5+Math.random()*3));
  if(this.chase)for(let k=0;k<6;k++)add('f',.08+k*.16,(k%2?-1:1)*(1+Math.random()*2.5));
  for(let k=0;k<4;k++)add('o',.18+k*.22+Math.random()*.05,(Math.random()<.5?-1:1)*(1+Math.random()*3.5))}
 items(h){if(!this.itm||this.state==='COUNT')return;const p=this.pl;for(const o of this.itm){if(o.k==='n'||o.k==='f'){o.m.rotation.y+=h*3;if(o.t>0){o.t-=h;o.m.visible=o.t<=0;continue}}
  if(Math.hypot(p.x-o.x,p.z-o.z)<2.1){if(o.k==='f'){o.t=15;o.m.visible=false;this.fuel=Math.min(100,this.fuel+28);this.popup('بنزين +28');this.audio.coin()}else if(o.k==='n'){o.t=15;o.m.visible=false;this.nit=2.6*(1+.25*(this.pl.d.nl|0));this.popup('نيترو!');this.audio.coin()}else if(this.oil<=0&&this.state==='RACING'){this.oil=1.4;this.popup('بقعة زيت!');this.hit(2)}}}}

 initWheel(){const w=$('wheel');if(!w)return;this.wv=0;this.wr=0;this.wd=false;let a0=0,sx=0,id=-1;const ang=e=>{const b=w.getBoundingClientRect();return Math.atan2(e.clientY-(b.top+b.height/2),e.clientX-(b.left+b.width/2))};
  w.addEventListener('pointerdown',e=>{e.preventDefault();if(this.wd)return;this.audio.init();this.wd=true;this.wraw=0;id=e.pointerId;a0=ang(e);{const b=w.getBoundingClientRect();this.wr0=Math.hypot(e.clientX-(b.left+b.width/2),e.clientY-(b.top+b.height/2))}sx=e.clientX;try{w.setPointerCapture(e.pointerId)}catch(x){}});
  w.addEventListener('pointermove',e=>{if(!this.wd||e.pointerId!==id)return;let d=ang(e)-a0;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;const b=w.getBoundingClientRect(),rr=Math.hypot(e.clientX-(b.left+b.width/2),e.clientY-(b.top+b.height/2)),v1=d*Math.min(1,(this.wr0||60)/55)/1.3,v2=(e.clientX-sx)/100,v=(rr<35||Math.abs(d)>1.6)?v2:(Math.abs(v1)>Math.abs(v2)?v1:v2);this.wraw=cl(v,-1,1)});
  const up=e=>{if(e.pointerId===id||e.pointerId===undefined)this.wd=false};['pointerup','pointercancel','lostpointercapture'].forEach(n=>w.addEventListener(n,up));w.addEventListener('contextmenu',e=>e.preventDefault())}
 wheelCurve(v){const s=v<0?-1:1,u=Math.max(0,Math.abs(v)-.04)/.96;return s*(.45*Math.pow(u,1.6)+.55*u)}
 wheelStep(dt){if(!this.wheelEl)this.wheelEl=document.getElementById('wsvg');if(!this.wheelEl||this.wv===undefined)return;if(this.wd){const tg=this.wheelCurve(this.wraw||0);this.wv+=(tg-this.wv)*(1-Math.exp(-14*dt));this.wr=this.wv*1.3}else if(this.wv!==0){this.wraw=0;this.wv*=Math.exp(-9*dt);if(Math.abs(this.wv)<.01)this.wv=0;this.wr=this.wv*1.3}const t='rotate('+(this.wr*57.3).toFixed(1)+'deg)';if(t!==this.wt){this.wt=t;this.wheelEl.style.transform=t}}
 initPaint(){const V=[0x9da1a6,0x0d0d0f,0xeeeeee,0x8a1f1f],b=$('paint');if(!b)return;let i=0;try{i=+localStorage.getItem('ss3d_vcol')||0}catch(e){}CARS[0].col=V[i%V.length];b.onclick=()=>{i=(i+1)%V.length;CARS[0].col=V[i];try{localStorage.setItem('ss3d_vcol',String(i))}catch(e){}this.pick(this.sel)};if(this.sel===0)this.pick(0)}
 onLap(){if(this.lap===1){this.lapStart=this.raceT;this.rec=[];this.recT=0;this.popup('اللفة 1 من '+LAPS);return}
  const lt=this.raceT-this.lapStart;this.lapStart=this.raceT;this.last3=lt;if(this.daily&&this.mode==='trial'&&this.sel===0&&this.trk===this.dTrack())this.dailyDone(lt);
 if(this.mode==='trial'&&(this.best==null||lt<=this.best)&&this.rec.length>10&&this.rec.length<1500){try{localStorage.setItem('ss3d_ghost_'+this.kid(CARS[this.sel].id),JSON.stringify({s:this.rec}))}catch(e){}}
 if(this.best==null||lt<this.best)this.best=lt;this.rec=[];this.recT=0;if(this.lap<=LAPS)this.popup('اللفة '+(this.lap-1)+': '+fmt(lt)+(lt<=this.best?'  أسرع لفة':''));
  if(this.lap>LAPS&&this.state==='RACING'){this.state='FIN';this.fin=3;this.finT=this.raceT;this.finPos=this.pos}}
 hit(f,px,pz){const p=this.pl;if(f>1.2&&px!==undefined&&this.pcar)S.dent(this.pcar,p,px,pz,f);p.dmg=Math.min(100,p.dmg+f*.7);this.bump=Math.max(this.bump,Math.min(1.5,f/8));if(f>2)this.audio.thud()}
 collide(){const p=this.pl,tk=this.tk,loc=this.loc,ad=Math.abs(loc.d),lim=10.85;
  if(ad>lim){const sg=loc.d>0?1:-1,l=tk.Lf[loc.i],nx=-sg*l.x,nz=-sg*l.z,ov=ad-lim;p.x+=nx*ov;p.z+=nz*ov;const wv=p.wv(),vin=wv[0]*nx+wv[1]*nz;
   if(vin<0){p.setWv((wv[0]-1.2*vin*nx)*.97,(wv[1]-1.2*vin*nz)*.97);p.r+=-sg*cl(-vin,0,14)*.035*(p.vx>0?1:-1);this.hit(-vin,p.x-nx*.9,p.z-nz*.9)}}
  for(const a of this.ai){const v=a.veh,dx=p.x-v.x,dz=p.z-v.z,d2=dx*dx+dz*dz;if(d2>26)continue;let tch=0;
   for(const o1 of[-1.1,1.1])for(const o2 of[-1.1,1.1]){const px=p.x+Math.sin(p.h)*o1,pz=p.z+Math.cos(p.h)*o1,ax=v.x+Math.sin(v.h)*o2,az=v.z+Math.cos(v.h)*o2,ddx=px-ax,ddz=pz-az,dd=Math.hypot(ddx,ddz);
    if(dd<1.95&&dd>.001){tch=1;const nx=ddx/dd,nz=ddz/dd,ov=1.95-dd;p.x+=nx*ov*.7;p.z+=nz*ov*.7;const l=tk.Lf[Math.floor(a.s/tk.ds)%tk.N];a.d-=(nx*l.x+nz*l.z)*ov*.3;
     const wv=p.wv(),vr=(wv[0]-Math.sin(v.h)*a.v)*nx+(wv[1]-Math.cos(v.h)*a.v)*nz;if(vr<0){p.setWv(wv[0]-1.25*vr*nx,wv[1]-1.25*vr*nz);a.v*=1-cl(-vr*.015,0,.15);this.hit(-vr*.6,(px+ax)/2,(pz+az)/2)}}}
 if(!tch&&d2<8.5&&p.speed>18&&this.raceT-this.nearT>1.5&&this.state==='RACING'){this.nearT=this.raceT;this.addCoins(5,'تجاوز قريب +5');this.misAdd('near',1)}}}
 aiStep(a,dt){const tk=this.tk,N=tk.N,len=tk.len,ds=tk.ds,i=Math.floor(a.s/ds)%N,j=(i+1)%N,f=(a.s/ds)%1;
  let cap=a.tr?a.tv:a.prof[(i+Math.floor(a.v*.9/ds)+1)%N]*a.skill*(this.ps!==undefined?(()=>{let q=this.ps-a.s;if(q<-len/2)q+=len;if(q>len/2)q-=len;return q>25?1.05:q<-25?.95:1})():1),tgt=a.lane;
  const all=this.all;let blk=null,bd=1e9;
  if(a.pol)a.lane=tgt=cl(this.loc.d,-5.5,5.5);for(const o of all){if(o===a||(a.pol&&o===this.pa))continue;let q=o.s-a.s;if(q<-len/2)q+=len;if(q>len/2)q-=len;if(q>0&&q<16&&Math.abs(o.d-a.d)<2.6&&q<bd){bd=q;blk=o}}
  if(blk&&!a.tr){cap=Math.min(cap,blk.v*.98+(bd-7)*.4);tgt=cl(blk.d+(a.d>=blk.d?1:-1)*3.2,-5.5,5.5)}
  const od=a.d;a.d+=cl(tgt-a.d,-dt*3.4,dt*3.4);cap=Math.max(cap,0);const pv=a.v;
  if(a.v<cap)a.v=Math.min(cap,a.v+a.def.aa*(1-a.v/(a.def.vt*1.1))*dt*1.3+.004);else a.v=Math.max(cap,a.v-8*dt);
  a.s+=a.v*dt;if(a.s>=len){a.s-=len;a.lap++}
  const v=a.veh,p=tk.P[i],q=tk.P[j],l=tk.Lf[i],dh=wrap(tk.H[j]-tk.H[i]),ks=dh/ds;
  v.x=p.x+(q.x-p.x)*f+l.x*a.d;v.z=p.z+(q.z-p.z)*f+l.z*a.d;v.h=tk.H[i]+dh*f+Math.atan2((a.d-od)/dt,Math.max(a.v,3));v.vx=a.v;v.dl=Math.atan(a.def.L*ks);v.ay=a.v*a.v*ks;v.ax+=((a.v-pv)/dt-v.ax)*.1;v.brk=a.v<pv-.01?1:0}
 post(dt){const p=this.pl,tk=this.tk,len=tk.len,all=[{pl:1,pr:(this.lap-1)*len+this.ps}];for(const a of this.ai)if(!a.tr)all.push({pr:(a.lap-1)*len+a.s});all.sort((x,y)=>y.pr-x.pr);const np=all.findIndex(x=>x.pl)+1;if(this.state==='RACING'&&this.mode==='race'&&this.pos&&np<this.pos){this.popup('تجاوز! المركز '+np);this.audio.coin();this.misAdd('over',1)}this.pos=np;this.tot=all.length;
  if(this.state==='COUNT'){const c=Math.ceil(this.cd);if(c>0)this.set('count',String(c))}
  if(this.state==='FIN'){this.fin-=dt;if(this.fin<=0)this.finish()}}
 finish(){this.state='OVER';const d=this.pl.d;let rec=false,saved=null;try{const o=JSON.parse(localStorage.getItem('ss3d_best')||'{}');const kk=this.kid(d.id);saved=o[kk]!=null?o[kk]:null;if(this.best!=null&&(saved==null||this.best<saved)){o[kk]=this.best;saved=this.best;rec=true;localStorage.setItem('ss3d_best',JSON.stringify(o))}}catch(e){}
  const race=this.mode==='race';let earn=race?(REWARD[this.finPos-1]||25):(rec?100:40);earn+=Math.min(60,Math.floor(this.drift/60));if(this.night&&race)earn=Math.round(earn*1.5);if(this.chase&&race)earn=this.busted?15:Math.round(earn*1.8)+60;if(S.lb)try{S.lb.add(earn,CARS[this.sel].name)}catch(e){}
 this.coins+=earn;this.saveCoins();this.garage();this.misAdd('finish',1);if(race&&this.finPos===1)this.misAdd('win',1);this.misAdd('drift',Math.floor(this.drift));this.misAdd('speed',Math.round(this.maxV));this.lastShare={race,pos:this.finPos,tot:this.tot,best:this.best,v:Math.round(this.maxV)};this.chalCheck();this.misRender();$('oCoins').textContent='+'+earn+' جنيه';
 $('oS').textContent=race?this.finPos+'/'+this.tot:fmt(this.finT);$('oNew').hidden=!rec;$('oL').textContent=race?'المركز النهائي':'الزمن الكلي';$('oD').textContent=fmt(this.finT);$('oN').textContent=fmt(this.best);$('oC').textContent=Math.round(this.maxV)+' كم/س';$('oT').textContent=Math.round(this.pl.dmg)+'%';$('oH').textContent=fmt(saved);
  if(this.chase&&this.busted)$('oL').textContent='اتقبض عليك';if($('oCar'))$('oCar').hidden=true;if(this.career&&race)this.carFinish();$('hud').hidden=true;$('touch').hidden=true;$('over').hidden=false;this.audio.update(0,false,false)}
 draw(dt){this.wheelStep(dt);const w=this.world,p=this.pl,c=w.cam,sp=p.speed,wv=p.wv(),d=p.d;
  S.updCar(this.pcar,p,dt,w.night);for(const a of this.ai)S.updCar(a.car,a.veh,dt,w.night);
  const fxp=this.fx;if(fxp&&!this.paused&&this.state!=='COUNT'&&this.state!=='OVER'){const sn=Math.sin(p.h),cs=Math.cos(p.h),zc=d.L/2,slipOn=(p.slip>.12&&sp>6)||(p.lock&&sp>3)||(p.thr>.9&&sp<8&&d.rwd&&p.vx>.5);
   for(let i=0;i<4;i++){const lx=(i&1?1:-1)*.72,lz=i<2?-zc:zc,wx=p.x+lx*cs+lz*sn,wz=p.z-lx*sn+lz*cs,rear=i<2,on=slipOn&&(rear||p.lock||p.slip>.2);fxp.skid.add(i,wx,wz,on);if(on&&rear&&!this.opt.low&&(this.mf&1)===0)fxp.smoke.emit(wx,wz,-wv[0],-wv[1],Math.min(.5,.18+p.slip))}
   fxp.smoke.update(dt)}
  let ah=p.h;if(sp>5){ah=p.h+cl(wrap(Math.atan2(wv[0],wv[1])-p.h),-.6,.6)*.4}this.ch+=wrap(ah-this.ch)*(1-Math.exp(-7*dt));const sn=Math.sin(this.ch),cs=Math.cos(this.ch);let px,py,pz,lx,ly,lz,fov;
  if(this.view===0){const dist=5.5+sp*.011;px=p.x-sn*dist;pz=p.z-cs*dist;py=1.8+sp*.003;lx=p.x+sn*8;lz=p.z+cs*8;ly=1.1;fov=58+Math.min(34,sp*.62)}
  else{px=p.x+Math.sin(p.h)*.3;pz=p.z+Math.cos(p.h)*.3;py=1.2;lx=p.x+Math.sin(p.h)*30;lz=p.z+Math.cos(p.h)*30;ly=1.05;fov=68+Math.min(18,sp*.3)}
  this.bump*=Math.exp(-5*dt);const sh=(this.bump*.24+sp*.0009)*Math.sin(this.t*53);c.position.set(px,py+sh,pz);c.lookAt(lx,ly,lz);if(Math.abs(c.fov-fov)>.05){c.fov=fov;c.updateProjectionMatrix()}
  const lit=this.hl&&(this.atm!=='morning'),ps=this.pcar;if(ps.spot)ps.spot.intensity=lit?3.5:0;ps.hl.emissiveIntensity=lit?4:.6;
  w.shadowAt(p);const doM=(this.mf++&1)===0;if(doM){const m=w.mcam,bk=d.len/2+.3;m.position.set(p.x-Math.sin(p.h)*bk,1.25,p.z-Math.cos(p.h)*bk);m.lookAt(p.x-Math.sin(p.h)*30,1.1,p.z-Math.cos(p.h)*30)}w.render(w.mcam,doM);
  this.ft=this.ft*.95+dt*1000*.05;if(++this.fc>90){this.fc=0;if(this.ft>24&&w.pr>.7)w.setPR(Math.max(.7,w.pr-.25));else if(this.ft<13.5&&w.pr<w.prMax)w.setPR(Math.min(w.prMax,w.pr+.25))}
  this.speedLines(sp);this.drawMap();this.updGhost();
 const sk=Math.max(0,p.vx)*3.6;this.set('spd',String(Math.round(sk)));this.set('gr',p.vx<-.5?'R':(sk<1&&p.thr<.05?'N':String(p.gear+1)));
  const n=Math.round(p.rpm/d.rl*10);this.cells.forEach((e,i)=>e.classList.toggle('on',i<n));$('chs').style.width=(100-p.dmg)+'%';
  this.set('scr',this.mode==='race'?this.pos+'/'+this.tot:'--');this.set('cmb',Math.min(Math.max(this.lap,1),LAPS)+'/'+LAPS);this.set('tm',fmt(this.lap>=1?(this.state==='FIN'?this.finT-this.lapStart:this.raceT-this.lapStart):0));
  this.audio.prof=d.id;this.audio.atm=this.atm;if(!this.paused&&this.state!=='OVER')this.audio.update(p.rpm/d.rl,p.slip>.14&&sp>4,true,p.thr)}
 applyLow(){const low=!!this.opt.low,w=this.world;document.body.classList.toggle('low',low);if(!w)return;if(!w.pr0)w.pr0=w.prMax;w.prMax=low?Math.min(.75,w.pr0):w.pr0;w.setPR(low?Math.min(w.pr,w.prMax):w.prMax);if(w.sun)w.sun.castShadow=!low;if(w.setRamadan)w.setRamadan(!!this.opt.ram&&!low)}
 speedLines(sp){const c=$('lines');if(!c)return;if(this.opt.low){if(!this.lcl){this.lcl=1;c.getContext('2d').clearRect(0,0,c.width,c.height)}return}this.lcl=0;const w=innerWidth,h=innerHeight;if(c.width!==w||c.height!==h){c.width=w;c.height=h}
 const x=c.getContext('2d');x.clearRect(0,0,w,h);const k=(sp-19)/26;if(k<=0)return;
 x.strokeStyle='rgba(255,255,255,'+Math.min(.5,k*.6).toFixed(3)+')';x.lineWidth=2;const cx=w/2,cy=h/2;
 for(let i=0;i<22;i++){const a=Math.random()*6.283,r0=Math.min(w,h)*(.32+Math.random()*.12),r1=r0+25+k*90*Math.random();
 x.beginPath();x.moveTo(cx+Math.cos(a)*r0*1.7,cy+Math.sin(a)*r0);x.lineTo(cx+Math.cos(a)*r1*1.7,cy+Math.sin(a)*r1);x.stroke()}}
 drawMap(){const c=$('map');if(!c||this.state==='MENU')return;const x=c.getContext('2d'),S2=c.width;x.clearRect(0,0,S2,S2);
 if(!this.mapP){const P=this.tk.P;let mxx=1e18,mxz=1e18,Mxx=-1e18,Mxz=-1e18;for(const p of P){mxx=Math.min(mxx,p.x);Mxx=Math.max(Mxx,p.x);mxz=Math.min(mxz,p.z);Mxz=Math.max(Mxz,p.z)}
 const sc=(S2-24)/Math.max(Mxx-mxx,Mxz-mxz);this.mapP={P,sc,ox:12-mxx*sc+(S2-24-(Mxx-mxx)*sc)/2,oz:12-mxz*sc+(S2-24-(Mxz-mxz)*sc)/2}}
 const m=this.mapP,X=v=>v.x*m.sc+m.ox,Z=v=>v.z*m.sc+m.oz;
 x.strokeStyle='rgba(245,245,245,.32)';x.lineWidth=4;x.lineJoin='round';x.beginPath();
 m.P.forEach((p,i)=>i?x.lineTo(X(p),Z(p)):x.moveTo(X(p),Z(p)));x.closePath();x.stroke();
 if(this.gh){x.fillStyle='rgba(140,200,255,.85)';x.beginPath();x.arc(X(this.gh.veh),Z(this.gh.veh),3,0,7);x.fill()}
 x.fillStyle='rgba(245,245,245,.75)';for(const a of this.ai){if(a.tr)continue;x.beginPath();x.arc(X(a.veh),Z(a.veh),2.6,0,7);x.fill()}
 x.fillStyle='#FF8A1F';x.save();x.translate(X(this.pl),Z(this.pl));x.rotate(Math.PI-this.pl.h);
 x.beginPath();x.moveTo(0,-5);x.lineTo(3.4,4);x.lineTo(-3.4,4);x.closePath();x.fill();x.restore()}
}
window.addEventListener('DOMContentLoaded',()=>{S.game=new Game()});S.Game=Game;})(window.SS);
if('serviceWorker'in navigator&&location.protocol==='https:')addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});
