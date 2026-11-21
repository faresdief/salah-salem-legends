(function(S){'use strict';
const {P,CARS}=S,$=id=>document.getElementById(id);
const KM={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Space:'drift',ShiftLeft:'drift',ShiftRight:'drift'};
const ATM=['night','morning','fog'],ATN={night:'ليل',morning:'صباح',fog:'ضباب'},STATS=[['top','السرعة القصوى'],['acc','التسارع'],['hnd','التحكم'],['mass','الكتلة والمتانة'],['drift','الدريفت']];
class GameController{
 constructor(){this.audio=new S.AudioEngine();this.road=new S.RoadEngine();this.world=new S.OpenWorldManager();this.r=new S.WorldRenderer($('cv'));
  this.lobby=new S.LobbyManager(new S.NetworkBridge());this.road.build(this.world.sections('salah'));this.road.spawn(26);
  this.keys={};this.state='MENU';this.sel=0;this.mode='ta';this.atm='night';this.lights=true;this.t=0;this.rs={};
  this.p=new S.VehiclePhysics(CARS[0]);this.pvc=$('pv').getContext('2d');this.coarse=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
  this.s={score:0,combo:1,ct:0,maxC:1,near:0,tix:0,time:90,ring:0,shake:0,skyX:0};
  this.cells=[];for(let i=0;i<10;i++){const e=document.createElement('i');$('trb').appendChild(e);this.cells.push(e)}
  this.bind();this.pick(0);this.setAtm(0);this.last=performance.now();requestAnimationFrame(t=>this.loop(t))}
 bind(){
  addEventListener('keydown',e=>{this.audio.init();const k=KM[e.code];if(k){this.keys[k]=true;e.preventDefault();return}
   if(e.code==='KeyH')this.horn();else if(e.code==='KeyL')this.toggleL();else if(e.code==='KeyM')this.toggleM();else if(e.code==='KeyN')this.setAtm(1);
   else if(e.code==='KeyR'&&this.state!=='MENU')this.start();else if(e.code==='Enter'&&this.state==='MENU'&&e.target.tagName!=='INPUT')this.start()});
  addEventListener('keyup',e=>{const k=KM[e.code];if(k)this.keys[k]=false});
  addEventListener('pointerdown',()=>this.audio.init());
  document.querySelectorAll('#touch [data-k]').forEach(b=>{const k=b.dataset.k;
   b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='horn')this.horn();else this.keys[k]=true});
   const up=()=>{if(k!=='horn')this.keys[k]=false};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)});
  $('pr').onclick=()=>this.pick(this.sel-1);$('nx').onclick=()=>this.pick(this.sel+1);
  document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{this.mode=b.dataset.m;document.querySelectorAll('.mode').forEach(x=>x.classList.toggle('on',x===b))});
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===b));$('tRace').hidden=b.dataset.t!=='tRace';$('tLobby').hidden=b.dataset.t!=='tLobby'});
  $('go').onclick=()=>this.start();$('again').onclick=()=>this.start();
  $('bMute').onclick=()=>this.toggleM();$('bLight').onclick=()=>this.toggleL();$('bRest').onclick=()=>this.start();$('atm').onclick=()=>this.setAtm(1)}
 toggleM(){this.audio.init();$('bMute').classList.toggle('on',this.audio.mute())}
 toggleL(){this.lights=!this.lights;$('bLight').classList.toggle('on',this.lights)}
 setAtm(d){this.atm=ATM[(ATM.indexOf(this.atm)+d)%3];$('atm').textContent=ATN[this.atm]}
 pick(i){this.sel=(i+CARS.length)%CARS.length;const d=CARS[this.sel];$('cn').textContent=d.name;
  $('stats').innerHTML=STATS.map(([k,n])=>'<div class="st"><span>'+n+'</span><div><i style="width:'+(d[k]*100)+'%"></i></div></div>').join('')}
 reset(){const R=this.road;this.p.set(CARS[this.sel]);R.resetItems();R.spawn(26);this.s={score:0,combo:1,ct:0,maxC:1,near:0,tix:0,time:90,ring:0,shake:0,skyX:0}}
 start(){this.audio.init();this.reset();this.state='PLAYING';$('menu').hidden=true;$('over').hidden=true;$('hud').hidden=false;$('touch').hidden=!this.coarse;$('bLight').classList.toggle('on',this.lights)}
 popup(t){const box=$('pops');if(box.children.length>2)box.firstChild.remove();const d=document.createElement('div');d.className='pop';d.textContent=t;box.appendChild(d);setTimeout(()=>d.remove(),1400)}
 flash(){const f=$('flash');f.classList.remove('fl');void f.offsetWidth;f.classList.add('fl');this.audio.flash()}
 horn(){if(this.state!=='PLAYING')return;this.audio.init();this.audio.horn();this.s.ring=.001;this.road.horn(this.p)}
 loop(ts){const dt=Math.min((ts-this.last)/1000,.05)||0;this.last=ts;this.t+=dt;
  try{if(this.state==='PLAYING')this.update(dt);else this.idle(dt);this.draw()}catch(e){console.error(e)}
  requestAnimationFrame(t=>this.loop(t))}
 idle(dt){const p=this.p,R=this.road;p.v=3500;p.x=.25;p.turn=0;p.boost=0;p.z=(p.z+p.v*dt)%R.len;R.step(dt,p);R.bucket();
  this.s.skyX+=R.segs[Math.floor(p.z/P.segLen)%R.segs.length].curve*dt*40;this.audio.update(0,false,false)}
 update(dt){const p=this.p,R=this.road,s=this.s,k=this.keys,N=R.segs.length,M=P.maxSpeed;
  const pi=Math.floor(p.z/P.segLen);p.update(dt,k,R.segs[pi%N],R.len);R.step(dt,p);R.bucket();
  const ni=Math.floor(p.z/P.segLen),ev=R.scan(p),kmh=p.kmh;
  if(ev.hit){const c=ev.hit,m=p.d.mass,dir=p.x>=c.x?1:-1;this.audio.thud();s.shake=1;s.combo=1;s.ct=0;p.v*=.55+.4*m;p.hp-=14*(1.2-m*.7);p.x+=dir*.12;
   c.cool=.8;if(m>.8){c.x-=dir*.25;c.tx=R.nearLane(c.x)}this.popup('وسّع يا كابتن!')}
  for(let i=0;i<ev.near;i++){s.near++;s.combo=Math.min(9,s.combo+1);s.ct=3;s.maxC=Math.max(s.maxC,s.combo);s.score+=50*s.combo;this.popup(s.combo>=4?'عاش يا أسطى!':'غرزة معلمين!')}
  let i=pi%N;const end=ni%N;
  while(i!==end){i=(i+1)%N;const sg=R.segs[i];for(const it of sg.items)this.take(it);if(sg.radar&&kmh>P.radarLimit){s.tix++;s.score=Math.max(0,s.score-300);this.flash();this.popup('الرادار لقطك!')}}
  for(const it of R.segs[(ni+10)%N].items)if(it.k==='bump'&&!it.warned){it.warned=true;this.popup('حاسب المطب!')}
  s.score+=dt*kmh*.2*s.combo;if(s.ct>0){s.ct-=dt;if(s.ct<=0)s.combo=1}
  if(s.ring>0){s.ring+=dt*1.4;if(s.ring>1)s.ring=0}s.shake*=Math.pow(.02,dt);
  s.skyX+=R.segs[ni%N].curve*(p.v*dt/P.segLen)*8;
  if(this.mode==='ta'){s.time-=dt;if(s.time<=0)this.end()}if(p.hp<=0)this.end();
  this.audio.update(p.v/M,p.drifting,true);this.lobby.n.syncPlayerState({z:p.z|0,x:+p.x.toFixed(2),v:p.v|0}).catch(()=>{});this.hud()}
 take(it){if(it.hit)return;const p=this.p,s=this.s,d=Math.abs(it.x-p.x),kmh=p.kmh;
  if(it.k==='bump'){it.hit=true;s.shake=kmh>90?1.2:.4;if(kmh>90){p.v*=.7;this.audio.thud()}}
  else if(it.k==='cone'&&d<.22){it.hit=true;it.t=0;it.vx=(p.x>=it.x?-1:1)*(1+Math.random());this.road.fly.push(it);p.v*=.92;p.hp-=3;this.audio.thud()}
  else if(it.k==='coin'&&d<.3){it.hit=true;s.score+=100;if(this.mode==='ta')s.time+=2;this.audio.coin()}
  else if(it.k==='turbo'&&d<.35){it.hit=true;p.turbo=Math.min(1,p.turbo+.5);this.audio.coin()}
  else if(it.k==='wrench'&&d<.3){it.hit=true;p.hp=Math.min(100,p.hp+25);this.audio.coin();this.popup('عاش يا أسطى!')}}
 hud(){const s=this.s,p=this.p,n=Math.round(p.turbo*10);$('spd').textContent=Math.round(p.kmh);$('scr').textContent=Math.floor(s.score);$('cmb').textContent='x'+s.combo;
  $('ctb').style.width=(Math.max(0,s.ct)/3*100)+'%';this.cells.forEach((e,i)=>e.classList.toggle('on',i<n));$('chs').style.width=Math.max(0,p.hp)+'%';$('tm').textContent=this.mode==='ta'?Math.max(0,Math.ceil(s.time)):'--'}
 draw(){const p=this.p,s=this.s,rs=this.rs,k=this.keys,pl=this.state==='PLAYING';rs.blink=Math.floor(this.t*4)%2===0;
  rs.road=this.road;rs.p=p;rs.atm=this.atm;rs.fov=P.fov+(p.boost>0?16:0)+p.v/P.maxSpeed*6;rs.shake=Math.sin(this.t*60)*s.shake*80;rs.lights=this.lights;
  rs.brake=pl&&(k.down||(!k.up&&p.v>0));rs.bl=p.turn;rs.skyX=s.skyX;rs.ring=s.ring;rs.fl=p.boost>0;rs.t=this.t;this.r.draw(rs);
  if(this.state==='MENU')S.WorldRenderer.preview(this.pvc,320,170,CARS[this.sel],this.t)}
 end(){if(this.state!=='PLAYING')return;this.state='OVER';this.keys={};const s=this.s,sc=Math.floor(s.score);let hi=0;
  try{hi=+localStorage.getItem('ss_hi')||0;if(sc>hi){hi=sc;localStorage.setItem('ss_hi',String(hi))}}catch(e){hi=Math.max(hi,sc)}
  $('oS').textContent=sc;$('oD').textContent=this.p.km.toFixed(2);$('oN').textContent=s.near;$('oC').textContent='x'+s.maxC;$('oT').textContent=s.tix;$('oH').textContent=hi;
  this.lobby.n.submitLeaderboardScore(this.lobby.name(),sc).catch(()=>{});$('hud').hidden=true;$('touch').hidden=true;$('over').hidden=false;this.audio.update(0,false,false)}
}
window.addEventListener('DOMContentLoaded',()=>{S.game=new GameController()});
})(window.SS);
