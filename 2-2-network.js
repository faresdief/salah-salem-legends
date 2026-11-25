(function(S){'use strict';
function memAdapter(){const root={},ls=[];
 const walk=(p,mk)=>{const a=p.split('/');let o=root;for(let i=0;i<a.length-1;i++){if(typeof o[a[i]]!=='object'||o[a[i]]===null){if(!mk)return null;o[a[i]]={}}o=o[a[i]]}return[o,a[a.length-1]]};
 const get=p=>{const r=walk(p,false);return r&&r[0][r[1]]!==undefined?JSON.parse(JSON.stringify(r[0][r[1]])):null};
 return{set:async(p,v)=>{const[o,k]=walk(p,true);o[k]=JSON.parse(JSON.stringify(v));ls.slice().forEach(l=>{if(p.startsWith(l.p)||l.p.startsWith(p))l.f(get(l.p))})},
  get:async p=>get(p),on:(p,f)=>{const l={p,f};ls.push(l);f(get(p));return()=>{const i=ls.indexOf(l);if(i>=0)ls.splice(i,1)}}}}
class NetworkBridge{
 constructor(){this.id='p'+Math.random().toString(36).slice(2,8);this.ad=memAdapter();this.mode='local';this.code=null;this.unsub=null;this.cb=()=>{};this.last=0}
 async initFirebase(cfg){if(!cfg||!window.firebase||this.mode==='firebase')return this.mode;
  if(!firebase.apps.length)firebase.initializeApp(cfg);const db=firebase.database();
  this.ad={set:(p,v)=>db.ref(p).set(v),get:p=>db.ref(p).once('value').then(s=>s.val()),on:(p,f)=>{const r=db.ref(p);r.on('value',s=>f(s.val()));return()=>r.off('value')}};
  this.mode='firebase';return this.mode}
 listen(code){if(this.unsub)this.unsub();this.code=code;this.unsub=this.ad.on('lobbies/'+code,l=>this.cb(l?Object.entries(l.players||{}).map(([id,v])=>Object.assign({id},v)):[]))}
 async createLobby(name,car){const code=Math.random().toString(36).slice(2,6).toUpperCase();await this.ad.set('lobbies/'+code,{players:{[this.id]:{name,ready:false,car:car||0}}});this.listen(code);return code}
 async joinLobby(code,name,car){code=String(code).trim().toUpperCase();const l=await this.ad.get('lobbies/'+code);if(!l)throw new Error('lobby not found');
  l.players=l.players||{};l.players[this.id]={name,ready:false,car:car||0};await this.ad.set('lobbies/'+code,l);this.listen(code);return code}
 async setPlayerReady(r){const l=await this.ad.get('lobbies/'+this.code);if(!l||!l.players||!l.players[this.id])return;l.players[this.id].ready=!!r;await this.ad.set('lobbies/'+this.code,l)}
 async syncPlayerState(st){const n=performance.now();if(!this.code||n-this.last<100)return;this.last=n;await this.ad.set('lobbies/'+this.code+'/players/'+this.id+'/state',st)}
 onPlayersUpdate(cb){this.cb=cb}
 submitLeaderboardScore(name,score){return this.ad.set('leaderboard/'+this.id,{name,score,t:Date.now()})}
}
class LobbyManager{
 constructor(n){this.n=n;this.ready=false;const q=this.q=id=>document.getElementById(id);
  n.onPlayersUpdate(l=>{q('ll').innerHTML='';for(const p of l){const li=document.createElement('li');li.textContent=p.name;const s=document.createElement('span');s.textContent=p.ready?'جاهز':'ينتظر';li.appendChild(s);q('ll').appendChild(li)}});
  q('lcreate').onclick=()=>this.run(async()=>{await n.initFirebase(window.SS_FIREBASE||null);q('lc').value=await n.createLobby(this.name())});
  q('ljoin').onclick=()=>this.run(async()=>{await n.initFirebase(window.SS_FIREBASE||null);await n.joinLobby(q('lc').value,this.name())});
  q('lready').onclick=()=>this.run(async()=>{this.ready=!this.ready;await n.setPlayerReady(this.ready)})}
 name(){return this.q('ln').value.trim()||'لاعب'}
 async run(f){try{await f();this.q('ls').textContent=(this.n.mode==='local'?'وضع محلي - ':'متصل - ')+'اللوبي '+this.n.code}catch(e){this.q('ls').textContent='تعذر الدخول: '+e.message}}
}
S.NetworkBridge=NetworkBridge;S.LobbyManager=LobbyManager;})(window.SS);
/* Online leaderboard (Firebase, free Spark plan). Loaded lazily; the game works fully without it. */
(function(S){'use strict';
const CFG={apiKey:"AIzaSyDYTBBXzQmJw_LA1llT9YdO_-j9x3roPvc",authDomain:"salah-salem-legends.firebaseapp.com",projectId:"salah-salem-legends",storageBucket:"salah-salem-legends.firebasestorage.app",messagingSenderId:"103035538706",appId:"1:103035538706:web:6da2157fecbf01fcd7f7cb"};
const V='10.12.2',B='https://www.gstatic.com/firebasejs/'+V+'/firebase-';
const ls=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}},lset=(k,v)=>{try{localStorage.setItem(k,String(v))}catch(e){}};
let dbp=null,lastSend=0,busy=false;
function script(u){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.async=true;s.onload=ok;s.onerror=()=>no(new Error('load'));document.head.appendChild(s);setTimeout(()=>no(new Error('timeout')),12000)})}
function conn(){if(dbp)return dbp;dbp=(async()=>{if(!navigator.onLine)throw new Error('offline');
  await script(B+'app-compat.js');await Promise.all([script(B+'auth-compat.js'),script(B+'firestore-compat.js')]);
  const app=firebase.apps.length?firebase.app():firebase.initializeApp(CFG);
  const au=app.auth();if(!au.currentUser)await au.signInAnonymously();
  return{db:app.firestore(),uid:au.currentUser.uid}})();dbp.catch(()=>{dbp=null});return dbp}
const LB={
 pts(){return Math.max(0,parseInt(ls('ss3d_pts','0'))||0)},
 name(){let n=ls('ss3d_name','');if(!n){n='سواق'+Math.floor(100+Math.random()*900);lset('ss3d_name',n)}return n},
 setName(n){n=String(n||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,16);if(n){lset('ss3d_name',n);lset('ss3d_dirty',1)}return this.name()},
 add(n,car){lset('ss3d_pts',this.pts()+Math.max(0,Math.min(2000,Math.round(n)||0)));if(car)lset('ss3d_car',String(car).slice(0,24));lset('ss3d_dirty',1);setTimeout(()=>this.sync().catch(()=>{}),2500)},
 async sync(){if(busy||ls('ss3d_dirty','0')!=='1'||this.pts()<=0)return false;if(Date.now()-lastSend<25000)return false;busy=true;
  try{const c=await conn();const d={name:this.name(),score:this.pts(),t:firebase.firestore.FieldValue.serverTimestamp()};const car=ls('ss3d_car','');if(car)d.car=car;
   await c.db.collection('scores').doc(c.uid).set(d);lastSend=Date.now();lset('ss3d_dirty',0);return true}finally{busy=false}},
 async top(){const c=await conn();const s=await c.db.collection('scores').orderBy('score','desc').limit(10).get();return{uid:c.uid,rows:s.docs.map(x=>Object.assign({id:x.id},x.data()))}}
};
S.lb=LB;
LB.dailySend=async function(day,best){day=day|0;best=Math.round(best*100)/100;if(!(best>=20&&best<=900))return false;const c=await conn(),ref=c.db.collection('daily').doc(day+'_'+c.uid),sn=await ref.get();if(sn.exists&&sn.data().best<=best)return false;
 await ref.set({name:this.name(),day:day,best:best,car:'verna',t:firebase.firestore.FieldValue.serverTimestamp()});return true};
LB.dailyTop=async function(day){const c=await conn(),s=await c.db.collection('daily').where('day','==',day|0).limit(50).get();const rows=s.docs.map(x=>Object.assign({id:x.id},x.data())).sort((a,b)=>a.best-b.best).slice(0,10);return{uid:c.uid,rows}};

LB.cloudSave=async function(code){if(typeof code!=='string'||code.length>60000)throw new Error('size');const c=await conn();let k=ls('ss3d_ckey','');if(!/^[a-z2-7]{16}$/.test(k)){const a=new Uint8Array(16);crypto.getRandomValues(a);k=Array.from(a,x=>'abcdefghijklmnopqrstuvwxyz234567'[x&31]).join('')}
 await c.db.collection('saves').doc(k).set({d:code,o:c.uid,t:firebase.firestore.FieldValue.serverTimestamp()});lset('ss3d_ckey',k);return k};
LB.cloudLoad=async function(k){k=String(k||'').trim().toLowerCase();if(!/^[a-z2-7]{16}$/.test(k))return null;const c=await conn(),s=await c.db.collection('saves').doc(k).get();return s.exists&&typeof s.data().d==='string'?s.data().d:null};
function ui(){const side=document.querySelector('#menu .side');if(!side||document.getElementById('lbCard'))return;
 const c=document.createElement('div');c.className='card';c.id='lbCard';
 c.innerHTML='<h2>لوحة الشرف</h2><div class="lbname"><input id="lbName" maxlength="16" aria-label="اسمك" autocomplete="off"><button class="btn tint" id="lbSave">حفظ</button></div><div id="lbList" class="lblist"></div><p class="foot" id="lbNote">نقاطك: <b id="lbPts">0</b></p><button class="btn tint" id="lbRef">تحديث</button>';
 side.appendChild(c);const $=i=>document.getElementById(i);$('lbName').value=LB.name();
 async function load(){$('lbPts').textContent=LB.pts();const l=$('lbList');l.textContent='...';
  try{try{await LB.sync()}catch(e){}const r=await LB.top();l.textContent='';
   if(!r.rows.length){l.textContent='لسه مفيش حد. كن الأول!';return}
   r.rows.forEach((x,i)=>{const row=document.createElement('div');row.className='lbrow'+(x.id===r.uid?' me':'');
    const a=document.createElement('span');a.textContent=(i+1)+'. '+String(x.name||'').slice(0,16);const b=document.createElement('b');b.textContent=x.score;row.append(a,b);l.appendChild(row)})}
  catch(e){l.textContent='اللوحة مش متاحة دلوقتي (أوفلاين). اللعبة شغالة عادي.'}}
 $('lbSave').onclick=()=>{$('lbName').value=LB.setName($('lbName').value);load()};$('lbRef').onclick=load;
 let started=false;const go=()=>{if(started)return;started=true;load()};
 if('IntersectionObserver' in window){new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){go();o.disconnect()}}).observe(c)}else go()}
window.addEventListener('DOMContentLoaded',()=>setTimeout(ui,300));
})(window.SS);
