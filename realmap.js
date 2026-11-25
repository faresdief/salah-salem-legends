(function(S){'use strict';
// Real Cairo (proof): real OSM roads - Zamalek, 6th October Bridge, Downtown.
// Data: realmap-data.json, (c) OpenStreetMap contributors, ODbL 1.0. Static file, no runtime API.
const T=window.THREE;if(!T)return;
const {CARS,Vehicle,wrap,clamp:cl}=S,$=id=>document.getElementById(id);
const col=h=>new T.Color(h).convertSRGBToLinear();
const W2=[8,7,6,4.5,3.5],TINT=[[.06,.06,.075],[.065,.065,.08],[.07,.07,.085],[.075,.075,.09],[.08,.08,.095]],LH=8;
class RealMap{
 constructor(g){this.g=g;this.on=false;this.built=false;this.cy=0;this.initMenu();
  addEventListener('keydown',e=>{if(!this.on)return;if(e.code==='KeyC')this.g.view=this.g.view?0:1})}
 initMenu(){const m=document.querySelector('.modes-card');if(!m||$('realCard'))return;const c=document.createElement('div');c.className='card';c.id='realCard';
  c.innerHTML='<h2>القاهرة الحقيقية (تجريبي)</h2><p class="foot">قُد على طرقات القاهرة الحقيقية: من الزمالك على كوبري 6 أكتوبر لوسط البلد، وطريق الهرم لحد الأهرامات. بيانات الخريطة © OpenStreetMap contributors (ODbL)</p><button class="btn primary" id="realGo">قُد على كوبري أكتوبر</button>';m.parentNode.insertBefore(c,m);
  $('realGo').onclick=()=>{this.g.audio.init();this.start()}}
 async start(){const g=this.g;if(!g.world)return;
  if(!this.data){try{const r=await fetch('realmap-data.json');this.data=await r.json()}catch(e){console.error(e);g.popup('بيانات الخريطة مش موجودة');return}}
  if(!g.own[CARS[g.sel].id]){g.popup('العربية مقفولة');return}
  try{if(!this.built)this.build()}catch(e){console.error(e);g.popup('الخريطة مش متاحة على الجهاز ده');return}
  {const w=g.world;this.pm0=w.prMax;w.prMax=Math.min(w.prMax,matchMedia('(pointer:coarse)').matches?1.25:1.6);if(w.pr>w.prMax)w.setPR(w.prMax)}
  this.prevAtm=g.atm;g.atm='night';g.world.atm('night');this.scene.environment=g.world.rt.texture;
  this.low=!!g.opt.low;this.moon.castShadow=!this.low&&!matchMedia('(pointer:coarse)').matches;
  this.mkCar();this.on=true;g.state='REAL';g.paused=false;g.keys={};
  document.body.classList.toggle('low',this.low);
  ['menu','over','pause','hud','count'].forEach(i=>{const e=$(i);if(e)e.hidden=true});$('realHud').hidden=false;g.shiftUi();$('touch').hidden=!matchMedia('(pointer:coarse)').matches;g.audio.init();
  g.popup('طرقات القاهرة الحقيقية من OpenStreetMap. روح شرق على كوبري 6 أكتوبر')}
 stop(){if(!this.on)return;{const w=this.g.world;if(this.pm0)w.prMax=this.pm0}this.on=false;const g=this.g;$('realHud').hidden=true;if(this.pcar)this.scene.remove(this.pcar.g);this.scene.environment=null;
  if(this.prevAtm){g.atm=this.prevAtm;g.world.atm(g.atm)}g.setAtm(0);document.body.classList.toggle('low',!!g.opt.low)}
 restart(){const p=this.pl,sp2=this.spawn;p.reset(sp2.x,sp2.z,sp2.h);this.cy=sp2.y;this.g.resume();this.g.popup('رجعنا لأول الكوبري')}
 mkCar(){const g=this.g,d=CARS[g.sel];if(this.pcar)this.scene.remove(this.pcar.g);
  const p=this.pl=new Vehicle(g.tuned(d));p.opt=g.opt;const sp2=this.spawn;p.reset(sp2.x,sp2.z,sp2.h);this.cy=sp2.y;
  this.pcar=S.makeCar(d,true);this.scene.add(this.pcar.g);this.ch=p.h;this.bump=0}
 build(){const g=this.g,w=g.world,sc3=this.scene=new T.Scene();
  sc3.background=new T.Color(0x070b16);sc3.fog=new T.FogExp2(col(0x070b16),.0006);
  this.hemi=new T.HemisphereLight(col(0x7f94c8),col(0x1e2028),.7);sc3.add(this.hemi);
  this.moon=new T.DirectionalLight(col(0xa8bce8),.75);this.moon.castShadow=true;{const s=this.moon.shadow;s.mapSize.set(1024,1024);Object.assign(s.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:400});s.camera.updateProjectionMatrix();s.bias=-.0005;s.normalBias=.05}sc3.add(this.moon,this.moon.target);
  const gnd=new T.Mesh(new T.PlaneGeometry(24000,24000),new T.MeshStandardMaterial({color:col(0x24231f),roughness:1}));gnd.rotation.x=-Math.PI/2;gnd.position.set(-2800,-.03,2600);gnd.receiveShadow=true;sc3.add(gnd);
  // decode ways to meter polylines with deck heights
  const ways=[];let bx0=1e9,bx1=-1e9,bz0=1e9,bz1=-1e9;
  for(const w2 of this.data.w){const f=w2[4],n=f.length/2,pts=[];const H=w2[1]?Math.max(1,w2[2])*LH:0;
   let L=0;const seg=[];for(let i=0;i<n;i++){const x=f[2*i]/10,z=f[2*i+1]/10;pts.push([x,z]);if(i)L+=Math.hypot(x-pts[i-1][0],z-pts[i-1][1]);seg.push(L)}
   for(let i=0;i<n;i++){const t=L?seg[i]/L:0,r=t<.5?Math.min(1,t/.12):Math.min(1,(1-t)/.12),s=r*r*(3-2*r);pts[i][2]=w2[1]?Math.max(.06,H*s):.06}
   ways.push({c:w2[0],b:w2[1],p:pts});for(const q of pts){if(q[0]<bx0)bx0=q[0];if(q[0]>bx1)bx1=q[0];if(q[1]<bz0)bz0=q[1];if(q[1]>bz1)bz1=q[1]}}
  this.ways=ways;this.bounds={x0:bx0-40,x1:bx1+40,z0:bz0-40,z1:bz1+40};
  // merged road ribbons (one mesh) + center dashes (one mesh) + parapets/piers (one mesh + instanced)
  const rp=[],rn=[],rc=[],ri=[],dp=[],dn=[],du=[],dc=[],di=[];
  const quad=(P,N,C,I2,a,b,c2,d2,n2,t2)=>{const k=P.length/3;P.push(a[0],a[1],a[2],b[0],b[1],b[2],c2[0],c2[1],c2[2],d2[0],d2[1],d2[2]);for(let q2=0;q2<4;q2++){N.push(n2[0],n2[1],n2[2]);C.push(t2[0],t2[1],t2[2])}I2.push(k,k+2,k+1,k,k+3,k+2)};
  for(const w2 of ways){const p=w2.p,hw=W2[w2.c],t2=TINT[w2.c];
   for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);if(L<.01)continue;const nx=-dz/L,nz=dx/L,y0=a[2]||.06,y1=b[2]||.06;
    quad(rp,rn,rc,ri,[a[0]+nx*hw,y0,a[1]+nz*hw],[a[0]-nx*hw,y0,a[1]-nz*hw],[b[0]-nx*hw,y1,b[1]-nz*hw],[b[0]+nx*hw,y1,b[1]+nz*hw],[0,1,0],t2);
    if(w2.c<=2){const lw=.14;dp.push(a[0]+nx*lw,(y0+.02),a[1]+nz*lw,a[0]-nx*lw,(y0+.02),a[1]-nz*lw,b[0]-nx*lw,(y1+.02),b[1]-nz*lw,b[0]+nx*lw,(y1+.02),b[1]+nz*lw);for(let q2=0;q2<4;q2++){dn.push(0,1,0);dc.push(.5,.48,.4)}const k=dp.length/3-4;du.push(0,0,1,0,1,1,0,1);di.push(k,k+2,k+1,k,k+3,k+2)}
    if(w2.b){const ph=1.1;for(const s of[-1,1])quad(rp,rn,rc,ri,[a[0]+nx*hw*s,y0,a[1]+nz*hw*s],[a[0]+nx*(hw+.5)*s,y0,a[1]+nz*(hw+.5)*s],[b[0]+nx*(hw+.5)*s,y1,b[1]+nz*(hw+.5)*s],[b[0]+nx*hw*s,y1,b[1]+nz*hw*s],[0,1,0],[.16,.15,.14]),
     quad(rp,rn,rc,ri,[a[0]+nx*hw*s,y0+ph,a[1]+nz*hw*s],[b[0]+nx*hw*s,y1+ph,b[1]+nz*hw*s],[b[0]+nx*hw*s,y1,b[1]+nz*hw*s],[a[0]+nx*hw*s,y0,a[1]+nz*hw*s],[-nx*s,0,-nz*s],[.18,.17,.16])}}}
  const mk=(P,N,C,I2,uv,U2,mat)=>{const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(P,3));gg.setAttribute('normal',new T.Float32BufferAttribute(N,3));gg.setAttribute('color',new T.Float32BufferAttribute(C,3));if(uv)gg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));gg.setIndex(I2);return new T.Mesh(gg,mat)};
  const rm=mk(rp,rn,rc,ri,null,null,new T.MeshStandardMaterial({vertexColors:true,roughness:.85,metalness:.05,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));rm.receiveShadow=true;sc3.add(rm);
  if(dp.length)sc3.add(mk(dp,dn,dc,di,du,null,new T.MeshBasicMaterial({vertexColors:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})));
  // piers under bridge decks
  const prs=[];for(const w2 of ways){if(!w2.b)continue;const p=w2.p;let acc=0;
   for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let d2=35-acc;
    while(d2<L){const t=d2/L,y=a[2]+(b[2]-a[2])*t;if(y>3)prs.push([a[0]+(b[0]-a[0])*t,y,a[1]+(b[1]-a[1])*t]);d2+=35}acc=(acc+L)%35}}
  const pi=new T.InstancedMesh(new T.BoxGeometry(3,1,3),new T.MeshStandardMaterial({color:col(0x55534e),roughness:.95}),prs.length),o=new T.Object3D();
  prs.forEach((q2,i)=>{o.position.set(q2[0],q2[1]/2,q2[2]);o.scale.set(1,q2[1],1);o.updateMatrix();pi.setMatrixAt(i,o.matrix)});sc3.add(pi);
  // spatial hash for onRoad + deck height
  const CS=25,hash=new Map(),key=(x,z)=>Math.floor(x/CS)+','+Math.floor(z/CS);
  ways.forEach((w2,wi2)=>{const p=w2.p;for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1];
   for(let cx=Math.floor(Math.min(a[0],b[0])/CS);cx<=Math.floor(Math.max(a[0],b[0])/CS);cx++)for(let cz=Math.floor(Math.min(a[1],b[1])/CS);cz<=Math.floor(Math.max(a[1],b[1])/CS);cz++){const k=cx+','+cz;if(!hash.has(k))hash.set(k,[]);hash.get(k).push([wi2,i])}}});
  this.hash=hash;
  this.query=(x,z)=>{let best=null;for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const L2=this.hash.get(Math.floor(x/CS+dx)+','+Math.floor(z/CS+dz));if(!L2)continue;
   for(const q2 of L2){const w2=ways[q2[0]],p=w2.p,a=p[q2[1]],b=p[q2[1]+1],abx=b[0]-a[0],abz=b[1]-a[1],ll=abx*abx+abz*abz;if(ll<.001)continue;let t=((x-a[0])*abx+(z-a[1])*abz)/ll;t=cl(t,0,1);
    const px=a[0]+abx*t,pz=a[1]+abz*t,d=Math.hypot(x-px,z-pz),hw=W2[w2.c],y=(a[2]||.06)+((b[2]||.06)-(a[2]||.06))*t;
    if(!best||d<best.d)best={d,y,hw,b:w2.b}}}return best};
  // v45: night-city look - buildings with lit windows, street lamps, sky, skyline, signals, pyramids
  const rnd=(s2=>()=>{s2|=0;s2=s2+0x6D2B79F5|0;let t=Math.imul(s2^s2>>>15,1|s2);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(77);
  const PYX=-9230,PYZ=8932;
  {const bpos=[],occ=new Set();
   for(const w2 of ways){const p=w2.p,hw=W2[w2.c];
    for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<14)continue;const dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L,nx=-dz,nz=dx;
     for(let d=10;d<L;d+=42){const t=d/L,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;
      for(const sd of[-1,1]){if(rnd()<.66)continue;
       const dep=10+rnd()*13,w3=10+rnd()*15,off=hw+6+dep/2+rnd()*5,bx=x+nx*off*sd,bz=z+nz*off*sd;
       const core=Math.hypot(bx+300,bz-1600)<2300,pyr=Math.hypot(bx-PYX,bz-PYZ)<1300;
       if(!core&&!pyr)continue;if(pyr&&rnd()<.55)continue;
       const key=Math.floor(bx/26)+','+Math.floor(bz/26);if(occ.has(key))continue;
       const u=this.query(bx,bz);if(u&&u.d<8)continue;
       occ.add(key);const h=pyr?6+rnd()*10:10+rnd()*(rnd()<.12?55:26);
       bpos.push([bx,h,bz,w3,dep,Math.atan2(dx,dz),.42+rnd()*.32])}}}}
   if(bpos.length){const wtx=S.winTex(),bm=new T.MeshStandardMaterial({map:wtx.map,emissiveMap:wtx.em,emissive:0xffffff,emissiveIntensity:1.1,vertexColors:true,roughness:.85});
    const bs=new T.InstancedMesh(new T.BoxGeometry(1,1,1),bm,bpos.length),o2=new T.Object3D(),cc=new T.Color();
    bpos.forEach((b2,k)=>{o2.position.set(b2[0],b2[1]/2,b2[2]);o2.rotation.set(0,b2[5],0);o2.scale.set(b2[3],b2[1],b2[4]);o2.updateMatrix();bs.setMatrixAt(k,o2.matrix);cc.setRGB(b2[6],b2[6]*.97,b2[6]*.9);bs.setColorAt(k,cc)});
    o2.rotation.set(0,0,0);o2.scale.set(1,1,1);bs.receiveShadow=true;sc3.add(bs);this.nBld=bpos.length}}
  {const lp=[];
   for(const w2 of ways){if(w2.c>2)continue;const p=w2.p,hw=W2[w2.c];let side=1;
    for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<20)continue;const dx=(b[0]-a[0])/L,dz=(b[1]-a[1])/L,nx=-dz,nz=dx;
     for(let d=27;d<L;d+=340){side=-side;if(rnd()<.75)continue;const t=d/L,y=(a[2]||.06)+((b[2]||.06)-(a[2]||.06))*t;
      lp.push([a[0]+(b[0]-a[0])*t+nx*(hw+1.2)*side,y,a[1]+(b[1]-a[1])*t+nz*(hw+1.2)*side,side,nx,nz])}}}
   if(lp.length){const o2=new T.Object3D();
    const pm2=new T.InstancedMesh(new T.CylinderGeometry(.09,.13,7.5,4),new T.MeshStandardMaterial({color:col(0x4a4e55),metalness:.5,roughness:.6}),lp.length);
    const hm2=new T.InstancedMesh(new T.BoxGeometry(.5,.12,1.3),new T.MeshBasicMaterial({color:0xffd6a0}),lp.length);
    const gm2=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:S.glowTex(),transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.65,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}),lp.length);
    lp.forEach((q2,k)=>{o2.rotation.set(0,0,0);o2.scale.set(1,1,1);o2.position.set(q2[0],q2[1]+3.75,q2[2]);o2.updateMatrix();pm2.setMatrixAt(k,o2.matrix);
     o2.position.set(q2[0]-q2[4]*1.2*q2[3],q2[1]+7.4,q2[2]-q2[5]*1.2*q2[3]);o2.updateMatrix();hm2.setMatrixAt(k,o2.matrix);
     o2.position.set(q2[0]-q2[4]*1.8*q2[3],q2[1]+.12,q2[2]-q2[5]*1.8*q2[3]);o2.rotation.set(-Math.PI/2,0,0);o2.scale.set(15,15,1);o2.updateMatrix();gm2.setMatrixAt(k,o2.matrix)});
    o2.rotation.set(0,0,0);o2.scale.set(1,1,1);sc3.add(pm2,hm2,gm2);this.nLamp=lp.length}}
  {const N2=750,pa=new Float32Array(N2*3);for(let q=0;q<N2;q++){const th=rnd()*6.283,ph=rnd()*.45+.05,r=8000;pa[q*3]=-2800+r*Math.cos(th)*Math.cos(ph);pa[q*3+1]=r*Math.sin(ph);pa[q*3+2]=2600+r*Math.sin(th)*Math.cos(ph)}
   const gg2=new T.BufferGeometry();gg2.setAttribute('position',new T.BufferAttribute(pa,3));
   const st=new T.Points(gg2,new T.PointsMaterial({color:0xafc4ee,size:2.4,sizeAttenuation:false,transparent:true,opacity:.8,fog:false,depthWrite:false}));st.frustumCulled=false;sc3.add(st);
   const spr=new T.Sprite(new T.SpriteMaterial({map:S.glowTex(),color:0xbfd4ff,fog:false,depthWrite:false}));spr.scale.set(1600,1600,1);spr.position.set(5200,3800,-4200);sc3.add(spr)}
  {const N3=120,o2=new T.Object3D(),cc=new T.Color(),sm=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({vertexColors:true,roughness:.95}),N3);
   for(let k=0;k<N3;k++){const th=k/N3*6.283+rnd()*.2,r=1400+rnd()*800,h=45+rnd()*130,w3=25+rnd()*45;
    o2.position.set(Math.cos(th)*r,h/2,1600+Math.sin(th)*r);o2.rotation.set(0,rnd()*3,0);o2.scale.set(w3,h,w3);o2.updateMatrix();sm.setMatrixAt(k,o2.matrix);
    cc.setRGB(.05+rnd()*.04,.06+rnd()*.04,.09+rnd()*.05);sm.setColorAt(k,cc)}
   o2.rotation.set(0,0,0);o2.scale.set(1,1,1);sc3.add(sm)}
  if(this.data.tl&&this.data.tl.length){const tl=this.data.tl.filter(q2=>{const u=this.query(q2[0]+6,q2[1]+6);return u&&u.d<30&&u.y<2});
   if(tl.length){const o2=new T.Object3D(),cc=new T.Color();
    const pm3=new T.InstancedMesh(new T.CylinderGeometry(.08,.11,4.6,5),new T.MeshStandardMaterial({color:col(0x3c4046),metalness:.5,roughness:.6}),tl.length);
    const lm3=this.tlL=new T.InstancedMesh(new T.SphereGeometry(.22,8,6),new T.MeshBasicMaterial({color:0xffffff,fog:false}),tl.length);
    tl.forEach((q2,k)=>{o2.position.set(q2[0]+6,2.3,q2[1]+6);o2.updateMatrix();pm3.setMatrixAt(k,o2.matrix);
     o2.position.set(q2[0]+6,4.8,q2[1]+6);o2.updateMatrix();lm3.setMatrixAt(k,o2.matrix);lm3.setColorAt(k,cc.set(k%2?0xff3226:0x2fe06a))});
    this.tlN=tl.length;this.sig=tl;sc3.add(pm3,lm3)}}
  {const m2=new T.MeshStandardMaterial({color:col(0xcaa877),roughness:.9,emissive:col(0x4a3a20),emissiveIntensity:1.1});
   const pg=new T.Mesh(new T.PlaneGeometry(1100,1100),new T.MeshBasicMaterial({map:S.glowTex(),color:0xffc98a,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.4,fog:false}));pg.rotation.x=-Math.PI/2;pg.position.set(PYX+160,.4,PYZ+10);sc3.add(pg);
   for(const q2 of[[0,0,115,139],[215,-60,105,136],[430,90,52,65]]){const py=new T.Mesh(new T.ConeGeometry(q2[2],q2[3],4),m2);py.position.set(PYX+q2[0],q2[3]/2,PYZ+q2[1]);py.rotation.y=Math.PI/4;sc3.add(py)}}

  // the Nile: wide dark ribbons along water polylines
  const wp=[],wn=[],wc=[],wi=[];
  for(const pl of this.data.n){for(let i=0;i<pl.length/2-1;i++){const a=[pl[2*i]/10,pl[2*i+1]/10],b=[pl[2*i+2]/10,pl[2*i+3]/10],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz);if(L<.01)continue;const nx=-dz/L,nz=dx/L,hw=170;
   quad(wp,wn,wc,wi,[a[0]+nx*hw,.02,a[1]+nz*hw],[a[0]-nx*hw,.02,a[1]-nz*hw],[b[0]-nx*hw,.02,b[1]-nz*hw],[b[0]+nx*hw,.02,b[1]+nz*hw],[0,1,0],[.05,.14,.24])}}
  if(wp.length){const wm=mk(wp,wn,wc,wi,null,null,new T.MeshStandardMaterial({vertexColors:true,roughness:.08,metalness:.6,emissive:col(0x12395c),emissiveIntensity:1.35}));sc3.add(wm)}
  // Cairo Tower at its real coordinates
  const tw=this.data.lm.find(l=>l[0]==='برج القاهرة');
  if(tw){const tg=new T.Group(),m1=new T.MeshStandardMaterial({color:col(0xb9b4a8),roughness:.7,emissive:col(0x2a2b33),emissiveIntensity:.5});
   const t1=new T.Mesh(new T.CylinderGeometry(6,9,90,14),m1);t1.position.y=45;const t2=new T.Mesh(new T.CylinderGeometry(13,7,14,14),new T.MeshStandardMaterial({color:col(0xa9a398),emissive:col(0xffd890),emissiveIntensity:.9}));t2.position.y=95;
   const t3=new T.Mesh(new T.CylinderGeometry(1.2,2.5,16,8),m1);t3.position.y=110;const bc=new T.Mesh(new T.SphereGeometry(1.6,8,6),new T.MeshBasicMaterial({color:0xff3040,fog:false}));bc.position.y=119;tg.add(t1,t2,t3,bc);this.towerBc=bc;tg.position.set(tw[1],0,tw[2]);sc3.add(tg)}
  // spawn at the west end of the longest bridge way (6th October Bridge)
  let bw=null;for(const w2 of ways){if(!w2.b)continue;const cx=w2.p.reduce((a2,q2)=>a2+q2[0],0)/w2.p.length,cz=w2.p.reduce((a2,q2)=>a2+q2[1],0)/w2.p.length;if(Math.hypot(cx+300,cz-1600)>3400)continue;if(!bw||w2.p.length>bw.p.length)bw=w2}
  const si=Math.min(6,bw.p.length-2),sp0=bw.p[si],sp1=bw.p[si+1];const sq=this.query(sp0[0],sp0[1]);this.spawn={x:sp0[0],z:sp0[1],y:(sq?sq.y:sp0[2]||.06)+.02,h:Math.atan2(sp1[0]-sp0[0],sp1[1]-sp0[1])};
  this.trafficBuild();
  // minimal HUD
  if(!$('realHud')){const h=document.createElement('div');h.id='realHud';h.hidden=true;h.style.cssText='position:fixed;inset:0;z-index:2;pointer-events:none;direction:rtl';
   h.innerHTML='<div style="position:absolute;top:calc(var(--sat) + 10px);left:50%;transform:translateX(-50%);padding:6px 16px;border-radius:14px" class="glass"><small>القاهرة الحقيقية (تجريبي) - © OpenStreetMap contributors</small></div>'+
   '<div class="glass" style="position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--sab) + 12px);padding:6px 18px;border-radius:16px;text-align:center"><b id="realSpd" style="font-size:28px">0</b> <small>كم/س</small></div>';
   document.body.appendChild(h)}
  this.built=true}
 // ---------- v46: ambient traffic on the real roads ----------
 posAt(e,s){const c=e.cum,p=e.w.p;let lo=0,hi=c.length-1;while(lo<hi-1){const m=(lo+hi)>>1;if(c[m]<=s)lo=m;else hi=m}const t=cl((s-c[lo])/((c[lo+1]-c[lo])||1e-6),0,1),a=p[lo],b=p[lo+1];return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,((a[2]||.06)+((b[2]||.06)-(a[2]||.06))*t)]}
 trafficBuild(){const tw=[];for(const w2 of this.ways){if(w2.c>4)continue;let L=0;const cum=[0];for(let k=1;k<w2.p.length;k++){L+=Math.hypot(w2.p[k][0]-w2.p[k-1][0],w2.p[k][1]-w2.p[k-1][1]);cum.push(L)}if(L>150)tw.push({w:w2,L,cum})}
  this.tways=tw;if(!tw.length)return;const N=this.low?8:14;this.ag=[];const rnd2=(a,b)=>a+Math.random()*(b-a),pk=a2=>a2[Math.floor(Math.random()*a2.length)];this.trnd=rnd2;this.tpk=pk;
  const bg=new T.BoxGeometry(1.78,.62,4.15);bg.translate(0,.64,0);
  const cg=new T.BoxGeometry(1.56,.55,2.05);cg.translate(0,1.18,-.2);
  const tg2=new T.BoxGeometry(1.5,.15,.1);tg2.translate(0,.74,-2.06);
  const hg2=new T.BoxGeometry(1.5,.13,.1);hg2.translate(0,.66,2.06);
  const bm=this.agB=new T.InstancedMesh(bg,new T.MeshStandardMaterial({roughness:.5,metalness:.4}),N),
   cm=new T.InstancedMesh(cg,new T.MeshStandardMaterial({color:col(0x10131a),roughness:.35,metalness:.2}),N),
   tm=new T.InstancedMesh(tg2,new T.MeshBasicMaterial({color:0xff2a20,fog:false}),N),
   hm=new T.InstancedMesh(hg2,new T.MeshBasicMaterial({color:0xfff0c8,fog:false}),N);
  this.agM=[bm,cm,tm,hm];this.agO=new T.Object3D();this.scene.add(bm,cm,tm,hm);
  const cc=new T.Color();for(let k=0;k<N;k++){const a={v:0,cruise:rnd2(8,13),lane:2.4,x:0,z:0,y:.06,h:0,s:0,dir:1,e:tw[0]};this.ag.push(a);this.agPlace(a,k,60);bm.setColorAt(k,cc.setHex(pk([0x9da1a6,0xeeeeee,0x2a3140,0x7a1f1f,0x244a6a,0x6b6b60,0xb8b2a0,0xd8d8d0,0x1a1a1c])))}
  if(bm.instanceColor)bm.instanceColor.needsUpdate=true}
 agPlace(a,k,minD){const tw=this.tways,rnd2=this.trnd,pl=this.pl;
  for(let t=0;t<30;t++){const e=tw[Math.floor(Math.random()*tw.length)],s=rnd2(15,e.L-15),pos=this.posAt(e,s);
   if(pl&&Math.hypot(pos[0]-pl.x,pos[1]-pl.z)<minD)continue;let ok=true;for(const o of this.ag)if(o!==a&&o.e===e&&Math.abs(o.s-s)<18){ok=false;break}if(!ok)continue;
   a.e=e;a.s=s;a.dir=Math.random()<.5?1:-1;a.v=a.cruise*.7;return}
  a.e=tw[0];a.s=15;a.dir=1}
 agCont(a){const e=a.e,rnd2=this.trnd;let best=null,bd=15;for(const e2 of this.tways){if(e2===e)continue;
   for(const end of[[0,1],[e2.L,-1]]){const p=this.posAt(e2,end[0]==0?0:e2.L),d=Math.hypot(p[0]-a.x,p[1]-a.z);if(d<bd){const hd=Math.atan2(Math.sin(a.h)*end[1],Math.cos(a.h)*end[1]);if(Math.abs(wrap(hd-a.h))<1.4){best=[e2,end[1]];bd=d}}}}
  if(best){a.e=best[0];a.dir=best[1];a.s=best[1]>0?4:best[0].L-4}else a.dir=-a.dir}
 trafficUpd(dt){const pl=this.pl,o=this.agO,sig=this.sig,tp=this.tlP;
  for(let k=0;k<this.ag.length;k++){const a=this.ag[k],e=a.e;
   const pos=this.posAt(e,a.s),nx2=this.posAt(e,cl(a.s+a.dir*4,0,e.L));let dx=nx2[0]-pos[0],dz=nx2[1]-pos[1];const dl=Math.hypot(dx,dz)||1;dx/=dl;dz/=dl;const rx=-dz,rz=dx;
   let vt=a.cruise;
   if(sig)for(let j=0;j<sig.length;j++){const q2=sig[j],sx=q2[0]+6-a.x,sz=q2[1]+6-a.z,f=sx*dx+sz*dz;if(f>0&&f<42){const l=sx*rx+sz*rz;if(Math.abs(l)<11&&((j%2===0)===tp))vt=Math.min(vt,Math.max(0,(f-7)*.8))}}
   const chk=(ox,oz)=>{const ddx=ox-a.x,ddz=oz-a.z,f=ddx*dx+ddz*dz,l=ddx*rx+ddz*rz;if(f>0&&f<15+a.v&&Math.abs(l)<2.5)vt=Math.min(vt,Math.max(0,(f-5.2)*.7))};
   chk(pl.x,pl.z);for(const o2 of this.ag)if(o2!==a)chk(o2.x,o2.z);
   a.v+=cl(vt-a.v,-9*dt,3*dt);a.s+=a.dir*a.v*dt;
   if(a.s>e.L-5||a.s<5){a.s=cl(a.s,4,e.L-4);const p2=this.posAt(e,a.s);a.x=p2[0];a.z=p2[1];a.h=Math.atan2(dx,dz);this.agCont(a)}
   const pp=this.posAt(e,a.s);a.x=pp[0]+rx*a.lane;a.z=pp[1]+rz*a.lane;a.y=pp[2];
   const th=Math.atan2(dx,dz);a.h+=wrap(th-a.h)*Math.min(1,5*dt);
   if(Math.hypot(a.x-pl.x,a.z-pl.z)>540){this.agPlace(a,k,170);
    const e3=a.e,p3=this.posAt(e3,a.s),n3=this.posAt(e3,cl(a.s+a.dir*4,0,e3.L));let hx=n3[0]-p3[0],hz=n3[1]-p3[1];const hl=Math.hypot(hx,hz)||1;hx/=hl;hz/=hl;
    a.x=p3[0]-hz*a.lane;a.z=p3[1]+hx*a.lane;a.y=p3[2];a.h=Math.atan2(hx,hz)}
   o.position.set(a.x,a.y+.03,a.z);o.rotation.set(0,a.h,0);o.scale.set(1,1,1);o.updateMatrix();
   for(const m of this.agM)m.setMatrixAt(k,o.matrix)}
  for(const m of this.agM)m.instanceMatrix.needsUpdate=true;
  const p=pl,sn=Math.sin(p.h),cs=Math.cos(p.h);
  for(const a of this.ag){for(const o1 of[-1.2,1.2]){const px=p.x+sn*o1,pz=p.z+cs*o1,dx2=px-a.x,dz2=pz-a.z,d=Math.hypot(dx2,dz2);if(d<2.6&&d>.01){const nx=dx2/d,nz=dz2/d,ov=2.6-d;p.x+=nx*ov*.65;p.z+=nz*ov*.65;a.v*=.85;const wv=p.wv(),vin=wv[0]*nx+wv[1]*nz;if(vin<0)p.setWv(wv[0]-1.2*vin*nx,wv[1]-1.2*vin*nz)}}}}
 onRoad(x,z){const q=this.query(x,z);return q&&q.d<q.hw+2.5}
 update(dt){const n=Math.max(1,Math.min(8,Math.ceil(dt*120))),h=dt/n;for(let i=0;i<n;i++)this.sim(h);
  if(this.towerBc)this.towerBc.visible=Math.sin(this.g.t*2.4)>0;
  if(this.tlL){this.tlT=(this.tlT||0)+dt;if(this.tlT>5){this.tlT=0;this.tlP=!this.tlP;const cc=new T.Color();for(let k=0;k<this.tlN;k++)this.tlL.setColorAt(k,cc.set((k%2===0)===this.tlP?0xff3226:0x2fe06a));this.tlL.instanceColor.needsUpdate=true}}
  const p=this.pl,q=this.query(p.x,p.z);let ty=0;if(q){if(q.b&&q.d<q.hw+1.5)ty=q.y;else if(q.y>1&&q.d<q.hw+6)ty=q.y}
  this.cy+=(ty-this.cy)*Math.min(1,5*dt);if(this.agM)this.trafficUpd(dt)}
 sim(h){const g=this.g,p=this.pl,k=g.keys;let s=(k.right?1:0)-(k.left?1:0);if(g.opt.tilt&&matchMedia('(pointer:coarse)').matches)s=cl(s+(g.opt.inv?-1:1)*g.tilt/20,-1,1);s=cl(s+(g.wv||0),-1,1);
  const I={steer:s,thr:k.up?1:0,brk:k.down?1:0,hb:k.hb?1:0};p.grip=this.onRoad(p.x,p.z)?1:.85;if(p.dmg>=100)I.thr=0;
  p.step(h,I);const B=this.bounds;if(p.x<B.x0)p.x=B.x0;if(p.x>B.x1)p.x=B.x1;if(p.z<B.z0)p.z=B.z0;if(p.z>B.z1)p.z=B.z1}
 draw(dt){const g=this.g,w=g.world,p=this.pl,c=w.cam,sp=p.speed,wv=p.wv();g.wheelStep(dt);S.updCar(this.pcar,p,dt,1);this.pcar.g.position.y=this.cy;
  const lit=!!g.hl,ps=this.pcar;if(ps.spot)ps.spot.intensity=lit?3.5:0;ps.hl.emissiveIntensity=lit?4:.6;
  let ah=p.h;if(sp>5)ah=p.h+cl(wrap(Math.atan2(wv[0],wv[1])-p.h),-.6,.6)*.4;this.ch+=wrap(ah-this.ch)*(1-Math.exp(-7*dt));const sn=Math.sin(this.ch),cs=Math.cos(this.ch);let px,py,pz,lx,ly,lz,fov;
  if(g.view===0){const dist=5.7+sp*.011;px=p.x-sn*dist;pz=p.z-cs*dist;py=this.cy+2+sp*.003;lx=p.x+sn*8;lz=p.z+cs*8;ly=this.cy+1.1;fov=58+Math.min(34,sp*.62)}
  else{px=p.x+Math.sin(p.h)*.3;pz=p.z+Math.cos(p.h)*.3;py=this.cy+1.2;lx=p.x+Math.sin(p.h)*30;lz=p.z+Math.cos(p.h)*30;ly=this.cy+1.05;fov=68+Math.min(18,sp*.3)}
  this.bump*=Math.exp(-5*dt);const shk=(this.bump*.24+sp*.0009)*Math.sin(g.t*53);c.position.set(px,py+shk,pz);c.lookAt(lx,ly,lz);if(Math.abs(c.fov-fov)>.05){c.fov=fov;c.updateProjectionMatrix()}
  this.moon.position.set(p.x+40,120,p.z+30);this.moon.target.position.set(p.x,0,p.z);this.moon.target.updateMatrixWorld();
  const r=w.r;r.shadowMap.needsUpdate=true;r.clear();r.render(this.scene,c);
  $('realSpd').textContent=Math.round(sp*3.6);g.audio.prof=p.d.id;g.audio.atm='night';if(!g.paused)g.audio.update(p.rpm/p.d.rl,p.slip>.14&&sp>4,true,p.thr)}}
S.RealMap=RealMap;})(window.SS);
