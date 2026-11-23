(function(S){'use strict';
const {CARS,Vehicle,Track,TRACK_PTS,wrap,clamp:cl}=S,$=id=>document.getElementById(id),LAPS=3,NAI=5;
const KM={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Space:'hb'};
const ATM=['morning','fog','night'],ATN={morning:'صباح',fog:'ضباب',night:'ليل'},PAL=[0x2f4a6b,0x8a1f1f,0x3d5a3a,0x6b6f75,0x1e1e1e,0xb8b8b8];
const STATS=[['top','السرعة القصوى'],['acc','التسارع'],['hnd','التحكم'],['mass','الثبات'],['drift','الانزلاق']];
const NOTE={race:'3 لفات ضد 5 منافسين، وبتبدأ من وسط الشبكة. أول واحد يخلص اللفات التلاتة يكسب.',trial:'3 لفات لوحدك على الحلبة، والهدف أسرع لفة.'};
const fmt=t=>{if(t==null||!isFinite(t))return '--:--.-';const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(1)};
class Game{
 constructor(){this.audio=new S.AudioEngine();this.lobby=new S.LobbyManager(new S.NetworkBridge());this.tk=new Track(TRACK_PTS,3.5);
  const DO={man:false,abs:true,tcs:true,sa:true,tilt:false,inv:false};try{this.opt=Object.assign({},DO,JSON.parse(localStorage.getItem('ss3d_opt')||'{}'))}catch(e){this.opt=Object.assign({},DO)}this.tilt=0;this.ft=16.7;this.fc=-150;
  this.keys={};this.inp={steer:0,thr:0,brk:0,hb:0};this.sel=0;this.mode='race';this.atm='morning';this.state='MENU';this.paused=false;this.t=0;this.acc=0;this.view=0;this.hl=true;this.bump=0;this.ch=0;this.txt={};this.ai=[];this.cache={};this.mf=0;
  this.coarse=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;document.body.classList.toggle('touch',this.coarse);
  this.cells=[];for(let i=0;i<10;i++){const e=document.createElement('i');$('trb').appendChild(e);this.cells.push(e)}
  this.dots=CARS.map(()=>{const e=document.createElement('i');$('dots').appendChild(e);return e});
  try{this.world=new S.World($('cv'),null,this.tk);this.prev=new S.Preview($('pv'));this.fx={skid:new S.Skids(this.world.scene),smoke:new S.Smoke(this.world.scene)}}catch(e){console.error(e);this.world=null;$('err').hidden=false;$('err').textContent=window.THREE?'تعذّر تشغيل الرسم ثلاثي الأبعاد على هذا الجهاز أو المتصفح.':'تعذّر تحميل محرك الرسم ثلاثي الأبعاد. اتأكد من الاتصال بالإنترنت وأعد تحميل الصفحة.';$('go').disabled=true}
  this.bind();this.pick(0);this.setAtm(0);$('modeNote').textContent=NOTE.race;this.last=performance.now();requestAnimationFrame(t=>this.loop(t))}
 bind(){const A=(s,f)=>document.querySelectorAll(s).forEach(f);
  addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;this.audio.init();const k=KM[e.code];if(k){this.keys[k]=true;e.preventDefault();return}
   switch(e.code){case'KeyH':this.audio.horn();break;case'KeyL':this.hl=!this.hl;$('bLight').classList.toggle('on',this.hl);break;case'KeyM':this.toggleM();break;case'KeyN':this.setAtm(1);break;case'KeyC':this.view^=1;break;case'KeyT':this.recover();break;
    case'KeyE':if(this.pl)this.pl.shift(1);break;case'KeyQ':if(this.pl)this.pl.shift(-1);break;case'KeyP':case'Escape':if(this.paused)this.resume();else this.pause();break;case'KeyR':if(this.state!=='MENU')this.start();break;case'Enter':if(this.state==='MENU'&&document.activeElement.tagName!=='BUTTON')this.start()}});
  addEventListener('keyup',e=>{const k=KM[e.code];if(k)this.keys[k]=false});addEventListener('pointerdown',()=>this.audio.init());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.pause()});
  A('#touch [data-k]',b=>{const k=b.dataset.k,up=()=>{b.classList.remove('dn');this.keys[k]=false};
   b.addEventListener('pointerdown',e=>{e.preventDefault();this.audio.init();b.classList.add('dn');if(k==='su'&&this.pl)this.pl.shift(1);if(k==='sd'&&this.pl)this.pl.shift(-1);this.keys[k]=true});['pointerup','pointercancel','pointerleave'].forEach(n=>b.addEventListener(n,up));b.addEventListener('contextmenu',e=>e.preventDefault())});
  const OPT=[['oMan','man'],['oAbs','abs'],['oTcs','tcs'],['oSa','sa'],['oTilt','tilt'],['oInv','inv']];
  for(const[id,k]of OPT){const e=$(id);e.checked=!!this.opt[k];e.onchange=()=>{this.opt[k]=e.checked;try{localStorage.setItem('ss3d_opt',JSON.stringify(this.opt))}catch(x){}
   if(k==='tilt'&&e.checked)this.enableTilt();if(this.pl)this.pl.opt=this.opt;this.shiftUi()}}
  $('pr').onclick=()=>this.pick(this.sel-1);$('nx').onclick=()=>this.pick(this.sel+1);
  A('#modes .mode',b=>b.onclick=()=>{this.mode=b.dataset.m;$('modeNote').textContent=NOTE[this.mode];A('#modes .mode',x=>x.classList.toggle('on',x===b))});
  A('#tabs button',b=>b.onclick=()=>{A('#tabs button',x=>x.classList.toggle('on',x===b));$('tRace').hidden=b.dataset.t!=='tRace';$('tLobby').hidden=b.dataset.t!=='tLobby'});
  $('go').onclick=()=>this.start();$('again').onclick=()=>this.start();$('restart').onclick=()=>this.start();$('resume').onclick=()=>this.resume();$('toMenu').onclick=()=>this.toMenu();$('toMenu2').onclick=()=>this.toMenu();
  $('bPause').onclick=()=>this.pause();$('bMute').onclick=()=>this.toggleM();$('bLight').onclick=()=>{this.hl=!this.hl;$('bLight').classList.toggle('on',this.hl)};$('atm').onclick=()=>this.setAtm(1)}
 enableTilt(){const go=()=>{if(this.tiltOn)return;this.tiltOn=true;addEventListener('deviceorientation',e=>{const a=(screen.orientation&&screen.orientation.angle)||window.orientation||0;let t=a===0?e.gamma:a===90?e.beta:a===270||a===-90?-e.beta:-e.gamma;this.tilt=isFinite(t)?cl(t,-40,40):0})};
  try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')go()}).catch(()=>{});else go()}catch(e){}}
 shiftUi(){document.querySelectorAll('#touch .sh').forEach(b=>b.hidden=!this.opt.man)}
 toggleM(){this.audio.init();$('bMute').classList.toggle('off',this.audio.mute())}
 setAtm(d){this.atm=ATM[(ATM.indexOf(this.atm)+d)%3];$('atm').textContent=ATN[this.atm];if(this.world)this.world.atm(this.atm)}
 pick(i){this.sel=(i+CARS.length)%CARS.length;const d=CARS[this.sel];$('cn').textContent=d.name;
  $('stats').innerHTML=STATS.map(([k,n])=>'<div class="st"><span>'+n+'</span><i><b style="width:'+Math.round(d[k]*100)+'%"></b></i></div>').join('');this.dots.forEach((e,j)=>e.classList.toggle('on',j===this.sel));if(this.prev)this.prev.set(d)}
 set(id,v){if(this.txt[id]!==v){this.txt[id]=v;$(id).textContent=v}}
 popup(t){const b=$('pops');if(b.children.length>2)b.firstChild.remove();const d=document.createElement('div');d.className='pop';d.textContent=t;b.appendChild(d);setTimeout(()=>d.remove(),1800)}
 place(v,s,d){const tk=this.tk,i=Math.floor(s/tk.ds)%tk.N,p=tk.P[i],l=tk.Lf[i];v.x=p.x+l.x*d;v.z=p.z+l.z*d;v.h=tk.H[i]}
 start(){if(!this.world)return;this.audio.init();const w=this.world,tk=this.tk,d=CARS[this.sel],race=this.mode==='race';
  for(const a of this.ai)w.scene.remove(a.car.g);if(this.pcar)w.scene.remove(this.pcar.g);this.ai=[];
  this.pl=new Vehicle(d);this.pl.opt=this.opt;if(this.fx)this.fx.skid.clear();this.fc=-150;this.pcar=S.makeCar(d,true);w.scene.add(this.pcar.g);const ps=race?3:0;this.place(this.pl,tk.len-12-ps*9,ps%2?3.4:-3.4);
  if(race){let sl=0;const lanes=[-3.4,3.4];for(let k=0;k<NAI+1;k++){if(k===ps)continue;const base=CARS[(k+this.sel+1)%4],def=Object.assign({},base);if(base.id==='verna'||base.id==='fiat')def.col=PAL[(k*2+1)%PAL.length];
   const key=base.id;this.cache[key]=this.cache[key]||tk.profile(base.vt*.98,base.mu*.8,base.aa,7);
   const a={def,car:S.makeCar(def,false),prof:this.cache[key],s:tk.len-12-k*9,d:lanes[k%2],lane:lanes[k%2]*(.4+Math.random()*.8),v:0,lap:0,skill:.8+Math.random()*.1,veh:{x:0,z:0,h:0,ax:0,ay:0,vx:0,dl:0,brk:0}};
   this.place(a.veh,a.s,a.d);w.scene.add(a.car.g);this.ai.push(a)}}this.pa={s:0,d:0,v:0};this.all=this.ai.concat([this.pa]);
  this.loc=tk.locate(this.pl.x,this.pl.z);this.ps=this.loc.sf*tk.ds;this.lap=0;this.lapStart=0;this.best=null;this.last3=null;this.fin=0;this.pos=1;this.maxV=0;this.raceT=0;this.cd=3;this.tot=1;this.state='COUNT';this.paused=false;this.acc=0;this.bump=0;this.ch=this.pl.h;this.keys={};
  this.maxV=0;Object.assign(this.pa,{s:this.ps,d:this.loc.d,v:0});$('menu').hidden=true;$('over').hidden=true;$('pause').hidden=true;$('hud').hidden=false;w.measure();w.compile();this.shiftUi();$('touch').hidden=!this.coarse;$('bLight').classList.toggle('on',this.hl);$('count').hidden=false;this.txt={}}
 recover(){if(this.state!=='RACING'||!this.pl)return;const p=this.pl,tk=this.tk,l=tk.locate(p.x,p.z,this.loc.i);const q=tk.P[l.i];const dm=p.dmg;p.reset(q.x,q.z,tk.H[l.i]);p.dmg=dm;p.vx=6;this.loc=l}
 pause(){if(this.state==='MENU'||this.state==='OVER'||this.paused)return;this.paused=true;this.keys={};$('pause').hidden=false;this.audio.update(0,false,false)}
 resume(){if(!this.paused)return;this.paused=false;$('pause').hidden=true}
 toMenu(){this.state='MENU';this.paused=false;this.keys={};['hud','touch','pause','over','count'].forEach(i=>$(i).hidden=true);$('menu').hidden=false;this.audio.update(0,false,false)}
 loop(ts){const dt=Math.min(Math.max(0,(ts-this.last)/1000),.05);this.last=ts;
  try{this.t+=dt;if(this.state==='MENU'){if(this.prev)this.prev.render(this.t)}else{if(!this.paused&&this.state!=='OVER')this.update(dt);this.draw(dt)}}catch(e){console.error(e)}
  requestAnimationFrame(t=>this.loop(t))}
 update(dt){const n=Math.max(1,Math.min(8,Math.ceil(dt*120))),h=dt/n;for(let i=0;i<n;i++)this.sim(h);this.post(dt)}
 sim(h){const p=this.pl,tk=this.tk,k=this.keys,I=this.inp,len=tk.len;
  if(this.state==='COUNT'){this.cd-=h;p.thr+=((k.up?1:0)-p.thr)*h*5;p.rpm=900+p.thr*3600;p.gear=0;if(this.cd<=0){this.state='RACING';this.raceT=0;$('count').textContent='انطلق';setTimeout(()=>{if(this.state!=='MENU')$('count').hidden=true},900)}}
  else{I.steer=(k.right?1:0)-(k.left?1:0);if(this.opt.tilt&&this.coarse)I.steer=cl(I.steer+(this.opt.inv?-1:1)*this.tilt/20,-1,1);I.thr=k.up?1:0;I.brk=k.down?1:0;I.hb=k.hb?1:0;if(this.state==='FIN'){I.steer=0;I.thr=0;I.brk=.5;I.hb=0}
   const ad=Math.abs(this.loc.d);p.grip=ad<7.5?1:ad<8.4?.96:.72;p.step(h,I);this.raceT+=h;
   this.loc=tk.locate(p.x,p.z,this.loc.i);this.collide();const s=this.loc.sf*tk.ds;
   if(this.ps>len*.75&&s<len*.25){this.lap++;this.onLap()}else if(this.ps<len*.25&&s>len*.75)this.lap--;this.ps=s;this.pa.s=s;this.pa.d=this.loc.d;this.pa.v=p.speed;this.maxV=Math.max(this.maxV,p.vx*3.6)}
  if(this.state!=='COUNT')for(const a of this.ai)this.aiStep(a,h)}
 onLap(){if(this.lap===1){this.lapStart=this.raceT;this.popup('اللفة 1 من '+LAPS);return}
  const lt=this.raceT-this.lapStart;this.lapStart=this.raceT;this.last3=lt;if(this.best==null||lt<this.best)this.best=lt;if(this.lap<=LAPS)this.popup('اللفة '+(this.lap-1)+': '+fmt(lt)+(lt<=this.best?'  أسرع لفة':''));
  if(this.lap>LAPS&&this.state==='RACING'){this.state='FIN';this.fin=3;this.finT=this.raceT;this.finPos=this.pos}}
 hit(f,px,pz){const p=this.pl;if(f>1.2&&px!==undefined&&this.pcar)S.dent(this.pcar,p,px,pz,f);p.dmg=Math.min(100,p.dmg+f*.7);this.bump=Math.max(this.bump,Math.min(1.5,f/8));if(f>2)this.audio.thud()}
 collide(){const p=this.pl,tk=this.tk,loc=this.loc,ad=Math.abs(loc.d),lim=10.85;
  if(ad>lim){const sg=loc.d>0?1:-1,l=tk.Lf[loc.i],nx=-sg*l.x,nz=-sg*l.z,ov=ad-lim;p.x+=nx*ov;p.z+=nz*ov;const wv=p.wv(),vin=wv[0]*nx+wv[1]*nz;
   if(vin<0){p.setWv((wv[0]-1.2*vin*nx)*.97,(wv[1]-1.2*vin*nz)*.97);p.r+=-sg*cl(-vin,0,14)*.035*(p.vx>0?1:-1);this.hit(-vin,p.x-nx*.9,p.z-nz*.9)}}
  for(const a of this.ai){const v=a.veh,dx=p.x-v.x,dz=p.z-v.z;if(dx*dx+dz*dz>26)continue;
   for(const o1 of[-1.1,1.1])for(const o2 of[-1.1,1.1]){const px=p.x+Math.sin(p.h)*o1,pz=p.z+Math.cos(p.h)*o1,ax=v.x+Math.sin(v.h)*o2,az=v.z+Math.cos(v.h)*o2,ddx=px-ax,ddz=pz-az,dd=Math.hypot(ddx,ddz);
    if(dd<1.95&&dd>.001){const nx=ddx/dd,nz=ddz/dd,ov=1.95-dd;p.x+=nx*ov*.7;p.z+=nz*ov*.7;const l=tk.Lf[Math.floor(a.s/tk.ds)%tk.N];a.d-=(nx*l.x+nz*l.z)*ov*.3;
     const wv=p.wv(),vr=(wv[0]-Math.sin(v.h)*a.v)*nx+(wv[1]-Math.cos(v.h)*a.v)*nz;if(vr<0){p.setWv(wv[0]-1.25*vr*nx,wv[1]-1.25*vr*nz);a.v*=1-cl(-vr*.015,0,.15);this.hit(-vr*.6,(px+ax)/2,(pz+az)/2)}}}}}
 aiStep(a,dt){const tk=this.tk,N=tk.N,len=tk.len,ds=tk.ds,i=Math.floor(a.s/ds)%N,j=(i+1)%N,f=(a.s/ds)%1;
  let cap=a.prof[(i+Math.floor(a.v*.9/ds)+1)%N]*a.skill,tgt=a.lane;
  const all=this.all;let blk=null,bd=1e9;
  for(const o of all){if(o===a)continue;let q=o.s-a.s;if(q<-len/2)q+=len;if(q>len/2)q-=len;if(q>0&&q<16&&Math.abs(o.d-a.d)<2.6&&q<bd){bd=q;blk=o}}
  if(blk){cap=Math.min(cap,blk.v*.98+(bd-7)*.4);tgt=cl(blk.d+(a.d>=blk.d?1:-1)*3.2,-5.5,5.5)}
  const od=a.d;a.d+=cl(tgt-a.d,-dt*2.2,dt*2.2);cap=Math.max(cap,0);const pv=a.v;
  if(a.v<cap)a.v=Math.min(cap,a.v+a.def.aa*(1-a.v/(a.def.vt*1.1))*dt*1.3+.004);else a.v=Math.max(cap,a.v-8*dt);
  a.s+=a.v*dt;if(a.s>=len){a.s-=len;a.lap++}
  const v=a.veh,p=tk.P[i],q=tk.P[j],l=tk.Lf[i],dh=wrap(tk.H[j]-tk.H[i]),ks=dh/ds;
  v.x=p.x+(q.x-p.x)*f+l.x*a.d;v.z=p.z+(q.z-p.z)*f+l.z*a.d;v.h=tk.H[i]+dh*f+Math.atan2((a.d-od)/dt,Math.max(a.v,3));v.vx=a.v;v.dl=Math.atan(a.def.L*ks);v.ay=a.v*a.v*ks;v.ax+=((a.v-pv)/dt-v.ax)*.1;v.brk=a.v<pv-.01?1:0}
 post(dt){const p=this.pl,tk=this.tk,len=tk.len,all=[{pl:1,pr:(this.lap-1)*len+this.ps}];for(const a of this.ai)all.push({pr:(a.lap-1)*len+a.s});all.sort((x,y)=>y.pr-x.pr);this.pos=all.findIndex(x=>x.pl)+1;this.tot=all.length;
  if(this.state==='COUNT'){const c=Math.ceil(this.cd);if(c>0)this.set('count',String(c))}
  if(this.state==='FIN'){this.fin-=dt;if(this.fin<=0)this.finish()}}
 finish(){this.state='OVER';const d=this.pl.d;let rec=false,saved=null;try{const o=JSON.parse(localStorage.getItem('ss3d_best')||'{}');saved=o[d.id]!=null?o[d.id]:null;if(this.best!=null&&(saved==null||this.best<saved)){o[d.id]=this.best;saved=this.best;rec=true;localStorage.setItem('ss3d_best',JSON.stringify(o))}}catch(e){}
  const race=this.mode==='race';$('oS').textContent=race?this.finPos+'/'+this.tot:fmt(this.finT);$('oNew').hidden=!rec;$('oL').textContent=race?'المركز النهائي':'الزمن الكلي';$('oD').textContent=fmt(this.finT);$('oN').textContent=fmt(this.best);$('oC').textContent=Math.round(this.maxV)+' كم/س';$('oT').textContent=Math.round(this.pl.dmg)+'%';$('oH').textContent=fmt(saved);
  $('hud').hidden=true;$('touch').hidden=true;$('over').hidden=false;this.audio.update(0,false,false)}
 draw(dt){const w=this.world,p=this.pl,c=w.cam,sp=p.speed,wv=p.wv(),d=p.d;
  S.updCar(this.pcar,p,dt,w.night);for(const a of this.ai)S.updCar(a.car,a.veh,dt,w.night);
  const fxp=this.fx;if(fxp&&!this.paused&&this.state!=='COUNT'&&this.state!=='OVER'){const sn=Math.sin(p.h),cs=Math.cos(p.h),zc=d.L/2,slipOn=(p.slip>.12&&sp>6)||(p.lock&&sp>3)||(p.thr>.9&&sp<8&&d.rwd&&p.vx>.5);
   for(let i=0;i<4;i++){const lx=(i&1?1:-1)*.72,lz=i<2?-zc:zc,wx=p.x+lx*cs+lz*sn,wz=p.z-lx*sn+lz*cs,rear=i<2,on=slipOn&&(rear||p.lock||p.slip>.2);fxp.skid.add(i,wx,wz,on);if(on&&rear&&(this.mf&1)===0)fxp.smoke.emit(wx,wz,-wv[0],-wv[1],Math.min(.5,.18+p.slip))}
   fxp.smoke.update(dt)}
  let ah=p.h;if(sp>5){ah=p.h+cl(wrap(Math.atan2(wv[0],wv[1])-p.h),-.6,.6)*.4}this.ch+=wrap(ah-this.ch)*(1-Math.exp(-7*dt));const sn=Math.sin(this.ch),cs=Math.cos(this.ch);let px,py,pz,lx,ly,lz,fov;
  if(this.view===0){const dist=6.2+sp*.012;px=p.x-sn*dist;pz=p.z-cs*dist;py=2+sp*.003;lx=p.x+sn*8;lz=p.z+cs*8;ly=1.15;fov=56+Math.min(30,sp*.5)}
  else{px=p.x+Math.sin(p.h)*.3;pz=p.z+Math.cos(p.h)*.3;py=1.2;lx=p.x+Math.sin(p.h)*30;lz=p.z+Math.cos(p.h)*30;ly=1.05;fov=68+Math.min(18,sp*.3)}
  this.bump*=Math.exp(-5*dt);const sh=(this.bump*.22+sp*.0006)*Math.sin(this.t*53);c.position.set(px,py+sh,pz);c.lookAt(lx,ly,lz);if(Math.abs(c.fov-fov)>.05){c.fov=fov;c.updateProjectionMatrix()}
  const lit=this.hl&&(this.atm!=='morning'),ps=this.pcar;if(ps.spot)ps.spot.intensity=lit?3.5:0;ps.hl.emissiveIntensity=lit?4:.6;
  w.shadowAt(p);const doM=(this.mf++&1)===0;if(doM){const m=w.mcam,bk=d.len/2+.3;m.position.set(p.x-Math.sin(p.h)*bk,1.25,p.z-Math.cos(p.h)*bk);m.lookAt(p.x-Math.sin(p.h)*30,1.1,p.z-Math.cos(p.h)*30)}w.render(w.mcam,doM);
  this.ft=this.ft*.95+dt*1000*.05;if(++this.fc>90){this.fc=0;if(this.ft>24&&w.pr>.7)w.setPR(Math.max(.7,w.pr-.25));else if(this.ft<13.5&&w.pr<w.prMax)w.setPR(Math.min(w.prMax,w.pr+.25))}
  const sk=Math.max(0,p.vx)*3.6;this.set('spd',String(Math.round(sk)));this.set('gr',p.vx<-.5?'R':(sk<1&&p.thr<.05?'N':String(p.gear+1)));
  const n=Math.round(p.rpm/d.rl*10);this.cells.forEach((e,i)=>e.classList.toggle('on',i<n));$('chs').style.width=(100-p.dmg)+'%';
  this.set('scr',this.mode==='race'?this.pos+'/'+this.tot:'--');this.set('cmb',Math.min(Math.max(this.lap,1),LAPS)+'/'+LAPS);this.set('tm',fmt(this.lap>=1?(this.state==='FIN'?this.finT-this.lapStart:this.raceT-this.lapStart):0));
  if(!this.paused&&this.state!=='OVER')this.audio.update(p.rpm/d.rl,p.slip>.14&&sp>4,true)}
}
window.addEventListener('DOMContentLoaded',()=>{S.game=new Game()});S.Game=Game;})(window.SS);
