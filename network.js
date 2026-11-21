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
