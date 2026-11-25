(function(S){'use strict';
const G=9.81,RHO=1.2,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),wrap=a=>{while(a>Math.PI)a-=6.283185;while(a<-Math.PI)a+=6.283185;return a};
const CARS=[
{id:'verna',murr:1.12,name:'هيونداي فيرنا GLS',col:0x9da1a6,shape:'sedan',len:4.26,wid:1.68,m:1180,L:2.44,wf:0.59,h:.55,cda:0.66,mu:1.05,T:144,pk:4500,rl:6500,gr:[3.54,2.05,1.39,1.03,.82],fd:4.19,Rw:0.295,rwd:0,bf:12,br:13,bk:10.2,vt:53,aa:3.1,top:.7,acc:.9,hnd:.85,mass:.5,drift:.5},
{id:'taxi',murr:1.1,name:'تاكسي القاهرة',col:0x15171a,cab:0xe8e8e8,shape:'sedan',len:4.26,wid:1.68,m:1120,L:2.44,wf:.57,h:.56,cda:.7,mu:.97,T:125,pk:4000,rl:6000,gr:[3.6,2,1.4,1,.8],fd:4.3,Rw:0.29,rwd:1,bf:12,br:13,bk:9.8,vt:48,aa:2.8,top:.75,acc:.75,hnd:1,mass:.55,drift:.6},
{id:'micro',murr:1.12,name:'ميكروباص أبيض',col:0xeeeeee,shape:'van',len:4.695,wid:1.695,m:1850,L:2.57,wf:.52,h:.85,cda:1.25,mu:.9,T:210,pk:2800,rl:4600,gr:[4.3,2.4,1.5,1,.8],fd:4.1,Rw:0.33,rwd:1,bf:11,br:12,bk:9.2,vt:42,aa:2.4,top:.6,acc:.55,hnd:.5,mass:1,drift:.3},
{id:'fiat',murr:1.1,name:'فيات 128 / شاهين',col:0xd9531e,shape:'boxy',len:4.264,wid:1.65,m:900,L:2.49,wf:.52,h:.5,cda:.62,mu:1.1,T:62,pk:5200,rl:7000,gr:[3.5,2.2,1.5,1.1,.9],fd:4.1,Rw:0.29,rwd:1,bf:13,br:11.5,bk:10.6,vt:61,aa:3.8,top:1,acc:.7,hnd:.65,mass:.3,drift:1},
{id:'empow',murr:1.1,name:'GAC إمباو',col:0x6b7a4a,shape:'fast',len:4.68,wid:1.83,m:1380,L:2.68,wf:.58,h:.54,cda:.66,mu:1.12,T:250,pk:4200,rl:6400,gr:[3.6,2.1,1.45,1.05,.8],fd:4.33,Rw:0.32,rwd:0,bf:12,br:13,bk:10.6,vt:58,aa:3.6,top:.78,acc:.8,hnd:.82,mass:.65,drift:.45},
{id:'amg',murr:1.15,name:'مرسيدس AMG C63',col:0x20242a,shape:'amg',len:4.78,wid:1.84,m:1700,L:2.84,wf:.54,h:.53,cda:.88,mu:1.2,T:250,pk:4600,rl:7000,gr:[3.6,2.2,1.5,1.1,.85],fd:3.75,Rw:0.325,rwd:1,bf:12,br:13,bk:11,vt:70,aa:4.4,top:.9,acc:.9,hnd:.8,mass:.85,drift:.6},
{id:'m4',murr:1.15,name:'BMW M4 كوبيه',col:0x2a4a9a,shape:'coupe',len:4.8,wid:1.89,m:1600,L:2.85,wf:.53,h:.5,cda:.88,mu:1.27,T:275,pk:5000,rl:7400,gr:[3.5,2.2,1.55,1.15,.9],fd:3.78,Rw:0.335,rwd:1,bf:13,br:14,bk:11.6,vt:74,aa:4.8,top:.94,acc:.95,hnd:.88,mass:.8,drift:.7},
{id:'p911',murr:1.2,name:'بورشه 911 كاريرا',col:0xd9b300,shape:'sport',len:4.52,wid:1.9,m:1450,L:2.45,wf:.4,h:.46,cda:.88,mu:1.32,T:280,pk:5200,rl:7500,gr:[3.4,2.1,1.5,1.15,.92],fd:3.7,Rw:0.335,rwd:1,bf:13,br:14,bk:12,vt:74,aa:5.2,top:1,acc:1,hnd:.95,mass:.7,drift:.8}];
class Vehicle{
 constructor(d){this.d=d;this.opt={man:false,abs:true,tcs:true,sa:true};this.sreq=0;this.reset(0,0,0)}
 shift(dir){this.sreq=dir}
 reset(x,z,h){Object.assign(this,{x,z,h,vx:0,vy:0,r:0,si:0,dl:0,thr:0,brk:0,gear:0,rpm:900,ax:0,ay:0,sh:0,slip:0,dmg:0,grip:1,wr:0})}
 wv(){const s=Math.sin(this.h),c=Math.cos(this.h);return[this.vx*s+this.vy*c,this.vx*c-this.vy*s]}
 setWv(a,b){const s=Math.sin(this.h),c=Math.cos(this.h);this.vx=a*s+b*c;this.vy=a*c-b*s}
 get speed(){return Math.hypot(this.vx,this.vy)}
 step(dt,i){const d=this.d,m=d.m,L=d.L,b=d.wf*L,a=L-b,sp=Math.abs(this.vx),Iz=m*a*b*1.1;
  const O=this.opt,sa=O.sa?-cl(this.vy/Math.max(sp,6)*1.3,-.3,.3):0,stIn=cl(i.steer+sa,-1,1),sr=(Math.abs(stIn)<Math.abs(this.si)?40:30)*dt;this.si+=cl(stIn-this.si,-sr,sr);
  const kk=1.25+.9*cl((sp-12)/16,0,1)+4.5*cl((sp-34)/10,0,1)**2;this.dl=-this.si*Math.min(.95,kk*L*d.mu*this.grip*G/Math.max(sp*sp,5));
  this.thr+=cl(i.thr-this.thr,-10*dt,9*dt);this.brk+=cl(i.brk-this.brk,-12*dt,10*dt);
  const rv=i.brk>.1&&this.vx<1&&i.thr<.05;
  let g=this.gear,wr=sp/d.Rw,rpm=wr*d.gr[g]*d.fd*9.5493;
  if(this.sh>0)this.sh-=dt;else if(O.man){if(this.sreq>0&&g<d.gr.length-1){this.gear++;this.sh=.15}else if(this.sreq<0&&g>0){this.gear--;this.sh=.15}this.sreq=0}else if(rpm>d.rl*.94&&g<d.gr.length-1){this.gear++;this.sh=.28}else if(g>0&&wr*d.gr[g-1]*d.fd*9.5493<d.rl*.72){this.gear--;this.sh=.2}
  g=this.gear;rpm=Math.max(wr*d.gr[g]*d.fd*9.5493,900+this.thr*(sp<3?2600:0));this.rpm+=(rpm-this.rpm)*Math.min(1,dt*12);rpm=this.rpm;
  const x=(rpm-d.pk)/(rpm<d.pk?d.pk-900:d.rl-d.pk);let T=d.T*Math.max(.3,1-.55*x*x)*(1-.35*this.dmg/100);if(rpm>=d.rl)T=0;
  let Fd=this.sh>0?0:T*this.thr*d.gr[g]*d.fd*.85/d.Rw*2.3;
  if(!rv&&this.thr<.05&&this.sh<=0&&sp>2)Fd=-d.T*.16*d.gr[g]*d.fd*.85/d.Rw*Math.min(1,rpm/d.rl)*1.22;
  if(rv){Fd=this.vx>-6?-d.T*.5*d.gr[0]*d.fd*.85/d.Rw*i.brk:0}
  const dir=this.vx>=0?1:-1;let Fb=rv?0:this.brk*d.bk*m;Fb=Math.min(Fb,m*sp/dt);
  const Fhb=i.hb?Math.min(.5*m*G,m*sp/dt):0,Fbf=Fb*.62*dir,Fbr=(Fb*.38+Fhb)*dir;
  const wt=m*this.ax*d.h/L,Nf=Math.max(.15*m*G*d.wf,m*G*d.wf-wt),Nr=Math.max(.15*m*G*(1-d.wf),m*G*(1-d.wf)+wt);
  const vxs=Math.max(sp,2.5),af=Math.atan2(this.vy+a*this.r,vxs)-this.dl,ar=Math.atan2(this.vy-b*this.r,vxs);
  const muf=d.mu*this.grip*1.2*(1+.3*cl((sp-12)/30,0,1));let tf=muf*Nf,tr=muf*(d.murr||1)*Nr;const lock=!O.abs&&this.brk>.8&&sp>3;this.lock=lock;if(lock){tf*=.85;tr*=.55}
  if(O.tcs&&Fd>0){const cap=.88*(d.rwd?tr:tf);if(Fd>cap)Fd=cap}
  let Fyf=-tf*Math.sin(1.5*Math.atan(d.bf*af)),Fyr=-tr*Math.sin(1.5*Math.atan(d.br*ar));
  let Fxf=(d.rwd?0:Fd)-Fbf,Fxr=(d.rwd?Fd:0)-Fbr,q=Math.hypot(Fxf,Fyf);if(q>tf){Fxf*=tf/q;Fyf*=tf/q}q=Math.hypot(Fxr,Fyr);if(q>tr){Fxr*=tr/q;Fyr*=tr/q}
  this.slip=Math.max(Math.abs(af),Math.abs(ar));
  const cd=Math.cos(this.dl),sd=Math.sin(this.dl),drag=.5*RHO*d.cda*this.vx*Math.abs(this.vx)+.015*m*G*cl(this.vx*2,-1,1);
  const Fx=Fxf*cd-Fyf*sd+Fxr-drag,Fy=Fyf*cd+Fxf*sd+Fyr,Mz=a*(Fyf*cd+Fxf*sd)-b*Fyr,ax=Fx/m,ay=Fy/m;
  const dvx=(ax+this.vy*this.r)*dt,dvy=(ay-this.vx*this.r)*dt;this.vx+=dvx;this.vy+=dvy;this.r+=Mz/Iz*dt;
  if(sp<5)this.r-=this.r*dt*(5-sp)*.8;if(sp<2.5)this.vy*=1-dt*8;
  this.ax+=(ax-this.ax)*Math.min(1,dt*8);this.ay+=(ay-this.ay)*Math.min(1,dt*8);
  const s=Math.sin(this.h),c=Math.cos(this.h);this.x+=(this.vx*s+this.vy*c)*dt;this.z+=(this.vx*c-this.vy*s)*dt;this.h=wrap(this.h+this.r*dt);this.wr+=this.vx/d.Rw*dt}
}
const cr=(a,b,c,d,t)=>[0,1].map(k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t));
class Track{
 constructor(pts,ds){const n=pts.length,f=[];for(let k=0;k<n;k++)for(let j=0;j<60;j++)f.push(cr(pts[(k+n-1)%n],pts[k],pts[(k+1)%n],pts[(k+2)%n],j/60));
  const ac=[0];for(let i=1;i<=f.length;i++){const a=f[i-1],b=f[i%f.length];ac.push(ac[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
  const tot=ac[f.length],N=Math.round(tot/ds);this.N=N;this.ds=tot/N;this.len=tot;this.P=[];let j=0;
  for(let i=0;i<N;i++){const s=i*this.ds;while(ac[j+1]<s)j++;const t=(s-ac[j])/(ac[j+1]-ac[j]),a=f[j],b=f[(j+1)%f.length];this.P.push({x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t})}
  this.T=[];this.Lf=[];this.H=[];for(let i=0;i<N;i++){const a=this.P[(i+N-1)%N],b=this.P[(i+1)%N],dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz);this.T.push({x:dx/l,z:dz/l});this.Lf.push({x:dz/l,z:-dx/l});this.H.push(Math.atan2(dx,dz))}
  this.kap=this.H.map((h,i)=>Math.abs(wrap(this.H[(i+1)%N]-this.H[(i+N-1)%N]))/(2*this.ds))}
 locate(x,z,hint){const N=this.N,lo=hint==null?0:hint-25,hi=hint==null?N-1:hint+25;let bi=0,bd=1e18;
  for(let k=lo;k<=hi;k++){const i=((k%N)+N)%N,p=this.P[i],dx=x-p.x,dz=z-p.z,q=dx*dx+dz*dz;if(q<bd){bd=q;bi=i}}
  const p=this.P[bi],t=this.T[bi],l=this.Lf[bi],dx=x-p.x,dz=z-p.z;return{i:bi,d:dx*l.x+dz*l.z,sf:(((bi+(dx*t.x+dz*t.z)/this.ds)%N)+N)%N}}
 profile(vtop,mu,aAcc,aBrk){const N=this.N,v=new Float32Array(N);for(let i=0;i<N;i++)v[i]=Math.min(vtop,Math.sqrt(mu*G/Math.max(this.kap[i],1e-4)));
  for(let p=0;p<3;p++){for(let i=2*N-1;i>=0;i--){const a=i%N,b=(i+1)%N;v[a]=Math.min(v[a],Math.sqrt(v[b]*v[b]+2*aBrk*this.ds))}
   for(let i=0;i<2*N;i++){const a=i%N,b=(i+1)%N;v[b]=Math.min(v[b],Math.sqrt(v[a]*v[a]+2*aAcc*this.ds))}}return v}
}
const TRACK_PTS=[[0,0],[0,320],[50,620],[180,860],[440,960],[720,900],[920,720],[960,450],[830,250],[910,40],[800,-180],[560,-260],[300,-160],[110,-70]];
const TRACKS=[{id:'city',n:'وسط البلد',th:'city',pts:TRACK_PTS},{id:'corniche',n:'الكورنيش',th:'corniche',pts:[[0,0],[250,-6],[520,6],[800,-4],[1060,30],[1200,130],[1180,250],[1020,300],[860,250],[700,300],[540,340],[400,290],[260,330],[110,300],[-60,230],[-130,110]]},{id:'ring',n:'الدائري',th:'ring',pts:[[0,0],[340,0],[680,8],[1020,0],[1275,51],[1394,187],[1343,340],[1173,408],[952,357],[765,425],[544,510],[306,459],[119,366],[-68,280],[-170,136],[-119,34]]},{id:'desert',n:'طريق الصحراء',th:'desert',pts:[[0,0],[0,300],[10,650],[40,950],[110,1150],[250,1210],[340,1110],[310,950],[290,700],[330,420],[420,250],[390,80],[250,-60],[90,-90]]}];
S.TRACKS=TRACKS;S.CARS=CARS;S.Vehicle=Vehicle;S.Track=Track;S.TRACK_PTS=TRACK_PTS;S.wrap=wrap;S.clamp=cl;})(window.SS=window.SS||{});
