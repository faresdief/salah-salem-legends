(function(S){'use strict';
const T=window.THREE;if(!T)return;
const col=h=>new T.Color(h).convertSRGBToLinear(),{clamp:cl}=S;
const ATM={
 morning:{bg:0xaecbe3,fd:.0011,sun:[0xfff1d6,3.2],hemi:[0xcfe3ff,0x9a8a68,.8],exp:1,night:0,env:[0x7fb2ee,1.3,0xdbe6f0,1.6,0x8a7d62,.8]},
 fog:{bg:0xb6bbbf,fd:.0055,sun:[0xdde3e8,1.1],hemi:[0xe5e9ec,0x80807a,1],exp:.95,night:0,env:[0xb4b9bd,1,0xc9cdd0,1.1,0x777770,.7]},
 rain:{bg:0x7a838c,fd:.0042,sun:[0xcdd5dc,.8],hemi:[0xd0d7dd,0x6e6e6a,.9],exp:.9,night:0,env:[0x8d969e,.9,0xb4bcc3,1,0x666660,.6]},
 night:{bg:0x04070d,fd:.0018,sun:[0x7f98c8,.45],hemi:[0x2a3550,0x14161a,.55],exp:1.15,night:1,env:[0x0b1226,.6,0x1a2238,.7,0x0b0b0c,.5]}};
const TH={
 city:{g0:'#9a8a68',g1:'60,50,35',g2:'190,170,130',bar:0xb8b5ad,ls:8,nb:260,b0:26,bw:80,h0:14,hh:70,ts:9,cc:0x2f5a2c,cg:()=>new T.ConeGeometry(2.6,2.4,7),tower:1},
 corniche:{g0:'#b7a77f',g1:'90,75,50',g2:'215,195,150',bar:0xd8d2c4,ls:8,nb:150,b0:30,bw:90,h0:12,hh:50,ts:6,cc:0x3f7a35,cg:()=>new T.ConeGeometry(4.4,1.3,8),tower:0,wz:-26},
 ring:{g0:'#8a8470',g1:'50,48,40',g2:'170,160,140',bar:0x9a9a98,ls:4,nb:200,b0:40,bw:110,h0:20,hh:90,ts:14,cc:0x3a6a33,cg:()=>new T.ConeGeometry(2.8,2.6,7),tower:0,gantry:1},
 desert:{g0:'#c8a56a',g1:'120,90,50',g2:'235,205,150',bar:0xc79a6a,ls:16,nb:24,b0:35,bw:150,h0:4,hh:6,ts:30,cc:0x2d2d30,cg:()=>new T.BoxGeometry(3.4,.22,.22),tower:0,dunes:1}};
function ctex(w,h,fn,rep,sx,sy){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=8;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;if(sx)t.repeat.set(sx,sy)}return t}
function envFor(r,k){const A=ATM[k].env,sc=new T.Scene(),mk=(c,e)=>new T.MeshBasicMaterial({color:col(c).multiplyScalar(e),side:T.BackSide});
 const room=new T.Mesh(new T.BoxGeometry(100,60,100),[mk(A[2],A[3]),mk(A[2],A[3]),mk(A[0],A[1]),mk(A[4],A[5]),mk(A[2],A[3]),mk(A[2],A[3])]);sc.add(room);
 const lamp=(x,y,z,w,h,c,e)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:col(c).multiplyScalar(e),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);sc.add(m)};
 if(k==='night'){for(let i=0;i<6;i++)lamp(i%2?45:-45,28,-40+i*16,6,4,0xffa955,7)}else lamp(30,38,-20,16,10,0xfff4dc,k==='fog'||k==='rain'?3:9);
 const p=new T.PMREMGenerator(r),rt=p.fromScene(sc,.03);p.dispose();return rt}
function ribbon(tk,i0,n,o0,o1,y0,y1,mat,vs,colors){const pos=new Float32Array((n+1)*6),uv=new Float32Array((n+1)*4),cc=colors?new Float32Array((n+1)*6):null,idx=[];
 for(let k=0;k<=n;k++){const i=(i0+k)%tk.N,p=tk.P[i],l=tk.Lf[i];pos.set([p.x+l.x*o0,y0,p.z+l.z*o0,p.x+l.x*o1,y1,p.z+l.z*o1],k*6);uv.set([0,k*tk.ds*vs,1,k*tk.ds*vs],k*4);
  if(cc){const c=(Math.floor(k/2)%2)?[.9,.9,.88]:[.75,.1,.1];cc.set([...c,...c],k*6)}if(k<n){const a=k*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));if(cc)g.setAttribute('color',new T.BufferAttribute(cc,3));g.setIndex(idx);g.computeVertexNormals();
 const m=new T.Mesh(g,mat);m.receiveShadow=true;return m}

const PL={};
function plate(band,num,lt){const k=band+num+lt;if(PL[k])return PL[k];const c=document.createElement('canvas');c.width=350;c.height=170;const x=c.getContext('2d');x.fillStyle='#f3f3ee';x.fillRect(0,0,350,170);x.fillStyle=band;x.fillRect(0,0,350,50);
 x.strokeStyle='#111';x.lineWidth=6;x.strokeRect(3,3,344,164);x.fillStyle='#111';x.textAlign='center';x.textBaseline='middle';x.font='700 30px Tahoma,Arial,sans-serif';x.fillText('EGYPT  مصر',175,27);x.font='700 72px Tahoma,Arial,sans-serif';x.fillText(num,100,112);x.fillText(lt,258,112);
 const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=8;return PL[k]=t}
let GLOW=null,CRK=null;
function glowTex(){if(GLOW)return GLOW;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return GLOW=new T.CanvasTexture(c)}
function crackTex(){if(CRK)return CRK;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.strokeStyle='rgba(235,240,245,.9)';x.lineWidth=1.4;let sd=3;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let k=0;k<3;k++){const cx=60+r()*136,cy=60+r()*136;for(let i=0;i<9;i++){let a=r()*6.283,px=cx,py=cy;x.beginPath();x.moveTo(px,py);for(let q=0;q<6;q++){a+=(r()-.5)*.8;px+=Math.cos(a)*(10+r()*22);py+=Math.sin(a)*(10+r()*22);x.lineTo(px,py)}x.stroke()}}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;return CRK=t}
const BODY={};
function bodyGeo(key,taxi){const id=key+(taxi?'T':'');if(BODY[id])return BODY[id];const sp=S.SPECS[key],b=S.carBody(sp),g=new T.BufferGeometry();
 g.setAttribute('position',new T.BufferAttribute(b.pos,3));g.setAttribute('normal',new T.BufferAttribute(b.nrm,3));g.setIndex(new T.BufferAttribute(Uint16Array.from(b.idx),1));
 if(taxi){const c=new Float32Array(b.pos.length);for(let v=0;v<b.vlab.length;v++){const w=b.vlab[v]<=3.05?.03:.9;c[v*3]=c[v*3+1]=c[v*3+2]=w}g.setAttribute('color',new T.BufferAttribute(c,3))}
 const gg=new T.BufferGeometry();gg.setAttribute('position',new T.BufferAttribute(b.glass.pos,3));gg.setIndex(new T.BufferAttribute(Uint16Array.from(b.glass.idx),1));gg.computeVertexNormals();
 const uv=new Float32Array(b.glass.pos.length/3*2);for(let v=0;v<uv.length/2;v++){uv[v*2]=b.glass.pos[v*3+2]*.55+b.glass.pos[v*3]*.4;uv[v*2+1]=b.glass.pos[v*3+1]*.7}gg.setAttribute('uv',new T.BufferAttribute(uv,2));
 return BODY[id]={g,gg,F:b.F,sp}}
function makeCar(d,lit){const pc=S.paints&&S.paints[d.id],painted=pc!=null;if(painted)d=Object.assign({},d,{col:pc});const key=d.shape,taxi=d.id==='taxi',B=bodyGeo(key,taxi),sp=B.sp,F=B.F,g=new T.Group(),bd=new T.Group(),w=d.wid,wr=d.Rw,wheels=[],zf=sp.zf,zr=sp.zr,van=key==='van',fia=key==='boxy';g.add(bd);
 const mat=(c,m,r)=>new T.MeshStandardMaterial({color:col(c),metalness:m,roughness:r});
 const paint=new T.MeshPhysicalMaterial({color:taxi&&!painted?0xffffff:col(d.col),vertexColors:taxi,metalness:.22,roughness:.3,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.3}),pp=taxi?mat(0x15171a,.3,.4):paint;
 const glassM=new T.MeshStandardMaterial({color:col(0x10161e),metalness:.85,roughness:.05,envMapIntensity:1.9}),dark=mat(0x101113,.2,.75),tire=new T.MeshStandardMaterial({color:col(0x0c0c0d),roughness:.92,side:T.DoubleSide}),rim=mat(0xb9bdc2,.9,.3),chr=mat(0xc8ccd0,1,.2),red=mat(0xb22222,.2,.5),blk=mat(0x111214,.2,.8),white=mat(0xeeeeee,0,.5);
 const geo=lit?B.g.clone():B.g,ggeo=lit?B.gg.clone():B.gg,body=new T.Mesh(geo,paint);body.castShadow=true;bd.add(body);bd.add(new T.Mesh(ggeo,glassM));
 let crack=null;if(lit){crack=new T.Mesh(ggeo,new T.MeshBasicMaterial({map:crackTex(),transparent:true,opacity:.3,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));crack.visible=false;bd.add(crack)}
 const Bx=(a,b,c)=>new T.BoxGeometry(a,b,c),add=(geom,m,x,y,z)=>{const o=new T.Mesh(geom,m);o.position.set(x,y,z);o.castShadow=true;bd.add(o);return o};
 const hl=new T.MeshStandardMaterial({color:col(0xfff2c8),emissive:col(0xfff2c8),emissiveIntensity:.6}),tl=new T.MeshStandardMaterial({color:col(0x8a0d0d),emissive:col(0xff1010),emissiveIntensity:.5}),zrf=zr-.012,zff=zf+.012;
 for(const sd of[-1,1]){
  if(van){add(Bx(.11,.52,.04),chr,sd*.66,1.05,zrf);add(Bx(.09,.5,.03),tl,sd*.66,1.05,zrf-.008);add(Bx(.32,.2,.04),chr,sd*.56,.72,zff);add(Bx(.28,.16,.03),hl,sd*.56,.72,zff+.012)}
  else if(fia){add(Bx(.36,.09,.04),chr,sd*.42,.68,zrf);add(Bx(.34,.06,.03),tl,sd*.42,.68,zrf-.008);add(Bx(.09,.22,.04),chr,sd*.33,.6,zrf);add(Bx(.07,.2,.03),tl,sd*.33,.6,zrf-.008);const hb=add(new T.CylinderGeometry(.085,.085,.04,18),chr,sd*.52,.56,zff);hb.rotation.x=Math.PI/2;const hl2=add(new T.CylinderGeometry(.07,.07,.03,18),hl,sd*.52,.56,zff+.012);hl2.rotation.x=Math.PI/2}
  else{if(d.id!=='verna'){add(Bx(.38,.15,.04),chr,sd*.4,.7,zrf);add(Bx(.36,.13,.03),tl,sd*.4,.7,zrf-.008)}if(d.id==='verna'||d.id==='taxi'){add(Bx(.44,.19,.05),chr,sd*.5,.66,zff-.005);add(Bx(.4,.16,.03),hl,sd*.5,.66,zff+.016);add(Bx(.17,.11,.02),mat(0x8e949a,.9,.15),sd*.43,.66,zff+.034);add(Bx(.15,.035,.02),mat(0xf0a020,0,.4),sd*.58,.585,zff+.034);const fg=add(new T.CylinderGeometry(.062,.062,.03,16),chr,sd*.6,.37,zff+.005);fg.rotation.x=Math.PI/2;const fl=add(new T.CylinderGeometry(.05,.05,.03,16),hl,sd*.6,.37,zff+.02);fl.rotation.x=Math.PI/2}
   else{add(Bx(.32,.12,.04),chr,sd*.46,.56,zff);add(Bx(.3,.1,.03),hl,sd*.46,.56,zff+.012);add(Bx(.26,.025,.02),new T.MeshStandardMaterial({color:col(0xdff2ff),emissive:col(0xdff2ff),emissiveIntensity:1.6}),sd*.46,.48,zff+.02)}}
  const zm=van?1.9:fia?.75:.86,my=van?1.55:fia?.95:1,ms=van?1.35:1;add(Bx(.1*ms,.1*ms,.18*ms),pp,sd*(F.wb(zm)+.09),my,zm);add(Bx(.02,.07*ms,.14*ms),dark,sd*(F.wb(zm)+.09),my,zm-.07*ms)}
 if(d.id==='fiat'){const amb=new T.MeshStandardMaterial({color:col(0xf0a020),emissive:col(0xc07010),emissiveIntensity:.5}),lens=new T.MeshStandardMaterial({color:col(0xfff2c8),emissive:col(0xfff2c8),emissiveIntensity:.8});
  for(const sd of[-1,1]){add(Bx(.34,.2,.04),chr,sd*.5,.6,zff+.03);add(Bx(.3,.16,.03),blk,sd*.5,.6,zff+.05);add(Bx(.26,.12,.03),lens,sd*.5,.6,zff+.066);add(Bx(.1,.05,.03),amb,sd*.66,.46,zff+.04);add(Bx(.14,.05,.03),amb,sd*.4,.4,zff+.04)}
  add(Bx(.2,.1,.03),blk,0,.6,zff+.04);add(Bx(.22,.016,.03),chr,0,.66,zff+.055);const fb=add(new T.CylinderGeometry(.04,.04,.02,14),chr,0,.6,zff+.06);fb.rotation.x=Math.PI/2}
 if(d.id==='micro'){const amb=new T.MeshStandardMaterial({color:col(0xf0a020),emissive:col(0xc07010),emissiveIntensity:.5});
  add(Bx(.86,.1,.07),blk,0,.38,zff+.04);add(Bx(.66,.14,.03),chr,0,.78,zff+.03);for(const gy of[.7,.75,.8])add(Bx(.62,.016,.02),blk,0,gy,zff+.05);const bg=add(new T.CylinderGeometry(.045,.045,.02,16),chr,0,.74,zff+.06);bg.rotation.x=Math.PI/2;
  for(const sd of[-1,1]){add(Bx(.1,.06,.03),amb,sd*.62,.58,zff+.03);const fl=add(new T.CylinderGeometry(.045,.045,.03,14),new T.MeshStandardMaterial({color:col(0xfff2c8),emissive:col(0xfff2c8),emissiveIntensity:.8}),sd*.34,.38,zff+.07);fl.rotation.x=Math.PI/2;
   }}
 if(d.id==='amg'){const led=new T.MeshStandardMaterial({color:col(0xeaf6ff),emissive:col(0xeaf6ff),emissiveIntensity:1.6}),rd=new T.MeshStandardMaterial({color:col(0xc01818),emissive:col(0xff1010),emissiveIntensity:1.1});
  add(Bx(.62,.2,.035),blk,0,.58,zff+.026);for(let i=-4;i<=4;i++)add(Bx(.016,.18,.03),chr,i*.06,.58,zff+.05);const st=add(new T.CylinderGeometry(.06,.06,.02,22),chr,0,.7,zff+.045);st.rotation.x=Math.PI/2;
  for(const sd of[-1,1]){add(Bx(.38,.09,.035),blk,sd*.52,.67,zff+.026);add(Bx(.3,.02,.03),led,sd*.52,.69,zff+.046);add(Bx(.22,.02,.03),led,sd*.5,.645,zff+.046);add(Bx(.4,.1,.03),blk,sd*.5,.36,zff+.03);
   add(Bx(.42,.07,.03),rd,sd*.4,.74,zrf-.012);add(Bx(.1,.1,.03),rd,sd*.6,.7,zrf-.012);
   for(const q of[.18,.34]){const ex=add(new T.CylinderGeometry(.045,.045,.12,16),chr,sd*q,.28,zr+.02);ex.rotation.x=Math.PI/2}}
  add(Bx(w*.6,.07,.07),blk,0,.3,zr)}
 if(d.id==='m4'){const led=new T.MeshStandardMaterial({color:col(0xeaf6ff),emissive:col(0xeaf6ff),emissiveIntensity:1.6});
  for(const sd of[-1,1]){add(Bx(.4,.1,.035),blk,sd*.5,.66,zff+.026);add(Bx(.3,.022,.03),led,sd*.52,.68,zff+.046);add(Bx(.3,.022,.03),led,sd*.5,.63,zff+.046);
   add(Bx(.17,.2,.04),blk,sd*.11,.56,zff+.03);add(Bx(.19,.22,.03),chr,sd*.11,.56,zff+.018);add(Bx(.4,.026,.03),new T.MeshStandardMaterial({color:col(0xc01818),emissive:col(0xff1010),emissiveIntensity:1.1}),sd*.4,.76,zrf-.012);add(Bx(.03,.14,.03),new T.MeshStandardMaterial({color:col(0xc01818),emissive:col(0xff1010),emissiveIntensity:1.1}),sd*.58,.7,zrf-.012);
   for(const q of[.14,.3]){const ex=add(new T.CylinderGeometry(.04,.04,.12,16),chr,sd*(q+.12),.3,zr+.02);ex.rotation.x=Math.PI/2}}
  add(Bx(w*.7,.08,.07),blk,0,.3,zr)}
 if(d.id==='p911'){const rl=(r,m,x,y,z)=>{const o=add(new T.CylinderGeometry(r,r,.04,22),m,x,y,z);o.rotation.x=Math.PI/2;return o},led=new T.MeshStandardMaterial({color:col(0xeaf6ff),emissive:col(0xeaf6ff),emissiveIntensity:1.6});
  for(const sd of[-1,1]){rl(.13,blk,sd*.5,.68,zff+.03);rl(.1,chr,sd*.5,.68,zff+.05);rl(.075,led,sd*.5,.68,zff+.065);add(Bx(.16,.03,.03),led,sd*.3,.38,zff+.03)}
  add(Bx(w*.86,.035,.03),new T.MeshStandardMaterial({color:col(0xc01818),emissive:col(0xff1010),emissiveIntensity:1.1}),0,.8,zrf-.012);add(Bx(w*.9,.04,.1),pp,0,.86,zrf+.02);
  for(const sx of[-.32,.32]){const ex=add(new T.CylinderGeometry(.05,.05,.12,16),chr,sx,.3,zr+.02);ex.rotation.x=Math.PI/2}}
 if(d.id==='empow'){const amb=new T.MeshStandardMaterial({color:col(0xf0a020),emissive:col(0xc07010),emissiveIntensity:.5,roughness:.4});const blu=new T.MeshStandardMaterial({color:col(0x2a7bd8),emissive:col(0x1a5fb0),emissiveIntensity:.5,metalness:.3,roughness:.4});
  add(Bx(.5,.22,.035),blk,0,.6,zff+.02);add(Bx(.52,.02,.03),chr,0,.72,zff+.02);add(Bx(.1,.1,.03),chr,0,.62,zff+.04);
  for(const sd of[-1,1]){add(Bx(.2,.07,.03),amb,sd*.5,.36,zff+.02);add(Bx(.16,.025,.03),new T.MeshStandardMaterial({color:col(0xdff2ff),emissive:col(0xdff2ff),emissiveIntensity:1.6}),sd*.5,.5,zff+.03)}
  for(const sd of[-1,1]){add(Bx(.36,.13,.035),blk,sd*.46,.57,zff+.024);add(Bx(.3,.022,.03),new T.MeshStandardMaterial({color:col(0xeaf6ff),emissive:col(0xeaf6ff),emissiveIntensity:1.8}),sd*.46,.6,zff+.045);add(Bx(.2,.014,.03),new T.MeshStandardMaterial({color:col(0xeaf6ff),emissive:col(0xeaf6ff),emissiveIntensity:1.2}),sd*.5,.55,zff+.045);add(Bx(.035,.15,.03),amb,sd*.66,.4,zff+.03)}
  add(Bx(w*.72,.09,.07),blk,0,.3,zr+.0);add(Bx(w*.6,.028,.03),new T.MeshStandardMaterial({color:col(0xc01818),emissive:col(0xff1010),emissiveIntensity:1}),0,.745,zrf-.012);
  add(Bx(w*.6,.03,.03),new T.MeshStandardMaterial({color:col(0xff2020),emissive:col(0xff1010),emissiveIntensity:.9}),0,.745,zrf-.014);
  for(const sx of[-.42,-.3,.3,.42]){const ex=add(new T.CylinderGeometry(.045,.045,.12,14),chr,sx,.27,zr+.02);ex.rotation.x=Math.PI/2;const ei=add(new T.CylinderGeometry(.032,.032,.125,14),dark,sx,.27,zr+.022);ei.rotation.x=Math.PI/2}}
 if(van){add(Bx(.7,.2,.03),dark,0,.62,zff);add(Bx(.72,.02,.02),chr,0,.68,zff+.012);add(Bx(w*.98,.26,.14),pp,0,.52,zr-.08);add(Bx(w*.98,.26,.14),pp,0,.52,zf+.08);add(Bx(.5,.06,.02),dark,0,.4,zf+.16)}
 else if(fia){add(Bx(.62,.14,.03),dark,0,.55,zff);for(const gy of[.52,.58,.64])add(Bx(.6,.015,.02),chr,0,gy,zff+.008);add(Bx(w*1.0,.11,.12),chr,0,.44,zr-.07);add(Bx(w*1.0,.11,.12),chr,0,.44,zf+.07)}
 else{if(d.id==='verna'||d.id==='taxi'){add(Bx(.6,.17,.04),chr,0,.62,zff-.004);add(Bx(.54,.13,.03),dark,0,.62,zff+.014);const hb=add(new T.CylinderGeometry(.04,.04,.02,16),chr,0,.62,zff+.034);hb.rotation.x=Math.PI/2}else add(Bx(.5,.09,.03),dark,0,.6,zff);for(const gy of[.565,.6,.635])add(Bx(.48,.014,.02),chr,0,gy,zff+.008);add(Bx(.52,.015,.03),chr,0,.71,zff);add(Bx(w*.98,.1,.05),pp,0,.46,zrf-.02);add(Bx(w*.98,.11,.06),pp,0,.45,zff+.02);add(Bx(.3,.05,.02),dark,0,.4,zff+.04);add(Bx(.1,.03,.02),dark,-.5,.4,zff+.045);add(Bx(.1,.03,.02),dark,.5,.4,zff+.045)}
 const band=(taxi||van)?'#f08a24':'#4aa3d6',pn={verna:['٤٦٨','ب ص ع'],taxi:['٧٢٣','ا ج ر'],micro:['٣١٩','ط ل ن'],fiat:['٥٦٢','د ف ق'],empow:['٨٤١','م ب ص'],amg:['٩٩٩','ع م ج'],m4:['٣٣٣','س ب ر'],p911:['٩١١','ر ش ه']}[d.id];
 if(d.id==='verna'){add(Bx(.66,.05,.03),chr,0,.76,zrf-.012);add(Bx(.5,.04,.03),chr,0,.5,zrf-.012)}
 for(const sd of[-1,1]){const m=new T.Mesh(new T.PlaneGeometry(.38,.19),new T.MeshStandardMaterial({map:plate(band,pn[0],pn[1]),roughness:.4}));m.position.set(0,sd>0?(van?.8:(d.id==='verna'||d.id==='taxi'||d.id==='fiat')?.4:.52):(van?.8:fia?.64:.62),sd>0?zf+.04:zr-.04);if(sd<0)m.rotation.y=Math.PI;bd.add(m)}

 if(d.id==='verna'){
  const tex=(txt,wd,ht,fs,fg,bg)=>{const c=document.createElement('canvas');c.width=wd;c.height=ht;const x=c.getContext('2d');if(bg){x.fillStyle=bg;x.fillRect(0,0,wd,ht)}x.fillStyle=fg;x.font='700 '+fs+'px Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,wd/2,ht/2+2);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t},
   lab=(txt,wd,ht,pw,ph,x,y,z,back)=>{const m=new T.Mesh(new T.PlaneGeometry(pw,ph),new T.MeshStandardMaterial({map:tex(txt,wd,ht,ht*.72,'#d9dcdf'),transparent:true,metalness:.9,roughness:.25}));m.position.set(x,y,z);if(back)m.rotation.y=Math.PI;bd.add(m)},
   amber=new T.MeshStandardMaterial({color:col(0xd9731a),emissive:col(0xff7a00),emissiveIntensity:.5}),lens=new T.MeshStandardMaterial({color:col(0xe9f1f7),metalness:.3,roughness:.08,emissive:col(0x9fb4c4),emissiveIntensity:.25}),fog=new T.MeshStandardMaterial({color:col(0xfff3c4),emissive:col(0xfff3c4),emissiveIntensity:1.1});
  // rear: Hyundai text (left), Verna (right), GLX (lower right), H badge (center)
  const zb=zr-.05;lab('HYUNDAI',256,48,.3,.056,.34,.8,zb,1);lab('Verna',192,48,.2,.05,-.4,.8,zb,1);lab('GLX',128,48,.12,.045,-.46,.5,zb,1);
  const hb=add(new T.CylinderGeometry(.06,.06,.012,20),chr,0,.8,zb+.02);hb.rotation.x=Math.PI/2;hb.scale.set(1.35,1,1);
  // tall corner taillights: red, amber lower lens, white reverse
  for(const sd of[-1,1]){add(Bx(.3,.22,.05),tl,sd*.58,.72,zrf-.01);add(Bx(.29,.06,.055),amber,sd*.58,.64,zrf-.02);add(Bx(.09,.05,.055),white,sd*.5,.7,zrf-.025)}
  // front: grille frame with H badge, swept lens headlights, oval fog lamps
  const gb=add(new T.CylinderGeometry(.055,.055,.014,20),chr,0,.62,zff+.02);gb.rotation.x=Math.PI/2;gb.scale.set(1.4,1,1);add(Bx(.56,.012,.02),chr,0,.665,zff+.012);
  for(const sd of[-1,1]){const l=add(Bx(.42,.15,.03),lens,sd*.5,.67,zff+.006);l.rotation.y=-sd*.32;l.rotation.z=sd*.1;
   const f=add(new T.SphereGeometry(.07,14,10),fog,sd*.5,.4,zff+.02);f.scale.set(1.5,.85,.4);add(Bx(.2,.04,.02),dark,sd*.5,.34,zff+.035)}
  // side trim strips along the doors
  for(const sd of[-1,1])add(Bx(.012,.045,2.3),dark,sd*(F.wb(0)+.004),.5,-.1)}
 const seams=van?[1,-.15]:fia?[.7,-.12,-1.3]:[.72,-.1,-1.18],hand=van?[1.3,.4]:fia?[.1,-.95]:[.1,-.92];
 for(const sd of[-1,1]){for(const z of seams){const yb=F.yBe(z);add(Bx(.006,yb-.32,.008),dark,sd*(F.wb(z)+.003),(yb+.32)/2,z)}for(const z of hand){const yb=F.yBe(z);add(Bx(.012,.03,.12),d.id==='verna'?pp:chr,sd*(F.wb(z)+.006),yb-.12,z)}}
 for(const x of(fia?[-.4,.4]:[van?.5:.45]))add(new T.CylinderGeometry(.045,.045,.22,12),chr,x,.3,zr-.04).rotation.x=Math.PI/2;
 if(taxi){const c=document.createElement('canvas');c.width=256;c.height=80;const x=c.getContext('2d');x.fillStyle='#ffd24a';x.fillRect(0,0,256,80);x.fillStyle='#111';x.font='700 54px Tahoma,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('تاكسي',128,42);
  const tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;add(Bx(.54,.17,.2),new T.MeshStandardMaterial({map:tx,emissiveMap:tx,emissive:0xffffff,emissiveIntensity:1.1}),0,F.yT(-.3)+.08,-.3)}
  {const cc=document.createElement('canvas');cc.width=cc.height=32;const cx=cc.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,32,32);cx.fillStyle='#111';cx.fillRect(0,0,16,16);cx.fillRect(16,16,16,16);const ck=new T.CanvasTexture(cc);ck.wrapS=ck.wrapT=T.RepeatWrapping;ck.repeat.set(19,1);ck.encoding=T.sRGBEncoding;const cm=new T.MeshStandardMaterial({map:ck,roughness:.5});
   for(const sd of[-1,1])add(Bx(.01,.12,2.3),cm,sd*(F.wb(-.1)+.008),.78,-.1);
   const rc=new T.CanvasTexture(cc);rc.wrapS=rc.wrapT=T.RepeatWrapping;rc.repeat.set(8,1);const rm=new T.MeshStandardMaterial({map:rc,roughness:.5});add(Bx(w*.6,.1,.012),rm,0,F.yT(zr+.1)-.12,zr-.01);
   const dc=document.createElement('canvas');dc.width=128;dc.height=48;const dx=dc.getContext('2d');dx.fillStyle='#f6c516';dx.fillRect(0,0,128,48);dx.fillStyle='#111';dx.font='700 34px Tahoma,Arial,sans-serif';dx.textAlign='center';dx.textBaseline='middle';dx.fillText('تاكسي',64,26);const dt=new T.CanvasTexture(dc);dt.encoding=T.sRGBEncoding;const dm=new T.MeshStandardMaterial({map:dt,roughness:.5});
   for(const sd of[-1,1]){const m=add(new T.PlaneGeometry(.5,.19),dm,sd*(F.wb(.3)+.012),.55,.3);m.rotation.y=sd*Math.PI/2}}
 if(d.id==='verna'||taxi)add(Bx(w*.78,.03,.08),dark,0,F.yT(zr+.3)+.02,zr+.3);
 if(!van&&!fia)add(new T.CylinderGeometry(.008,.014,.3,6),dark,.32,F.yT(zr+.55)+.15,zr+.55).rotation.x=-.2;
 if(van){for(const sd of[-1,1])add(Bx(.008,.1,4.35),red,sd*(F.wb(0)+.004),1.12,-.15);add(Bx(1.5,.1,.01),red,0,1.12,zr-.006);add(Bx(.5,.05,.5),paint,0,2,.3)}
 if(fia){for(const sd of[-1,1]){for(const zc of[-sp.wheelZ,sp.wheelZ])add(Bx(.07,.12,.95),paint,sd*(F.wb(zc)+.03),.68,zc);add(Bx(.16,.004,.8),white,sd*.14,.93,-1.6);add(Bx(.04,.1,.24),dark,sd*.55,.97,-1.95)}add(Bx(w*.78,.035,.26),dark,0,.995,-1.95)}
 for(const[sx,zc,front]of[[-1,sp.wheelZ,1],[1,sp.wheelZ,1],[-1,-sp.wheelZ,0],[1,-sp.wheelZ,0]]){const tw=fia&&!front?.25:.19,piv=new T.Group();piv.position.set(sx*(F.wb(zc)-tw/2-.02),wr,zc);g.add(piv);const spn=new T.Group();piv.add(spn);
  const disc=new T.Mesh(new T.CylinderGeometry(wr*.5,wr*.5,tw*.7,20),mat(0x5a5e63,.8,.45));disc.rotation.z=Math.PI/2;spn.add(disc);
  const cal=new T.Mesh(Bx(tw*.5,wr*.28,wr*.34),mat(0x8a1f1f,.3,.5));cal.position.set(sx*tw*.28,wr*.32,0);piv.add(cal);
  const lip=new T.Mesh(new T.TorusGeometry(wr*.6,tw*.16,10,24),rim);lip.rotation.y=Math.PI/2;lip.position.x=sx*tw*.18;spn.add(lip);
  const tg=new T.LatheGeometry([[.62,-.5],[.86,-.5],[.97,-.42],[1,-.2],[1,.2],[.97,.42],[.86,.5],[.62,.5]].map(q=>new T.Vector2(q[0]*wr,q[1]*tw)),28),t=new T.Mesh(tg,tire);t.rotation.z=Math.PI/2;t.castShadow=true;spn.add(t);
  const hub=new T.Mesh(new T.CylinderGeometry(wr*.16,wr*.16,tw*1.0,12),rim);hub.rotation.z=Math.PI/2;spn.add(hub);
  if(d.id==='empow'){const dk=new T.Mesh(new T.CylinderGeometry(wr*.56,wr*.56,tw*.3,24),mat(0x15171a,.3,.6));dk.rotation.z=Math.PI/2;dk.position.x=sx*tw*.05;spn.add(dk);for(let k=0;k<5;k++){const pv=new T.Group();pv.rotation.x=k*6.2832/5;const sp1=new T.Mesh(Bx(tw*.6,wr*.5,wr*.17),rim);sp1.position.set(sx*tw*.2,wr*.34,0);pv.add(sp1);const sp2=new T.Mesh(Bx(tw*.6,wr*.3,wr*.1),rim);sp2.position.set(sx*tw*.2,wr*.5,wr*.09);pv.add(sp2);spn.add(pv)}}else
  {const vv=d.id==='verna',n=vv?10:5;for(let k=0;k<n;k++){const b=new T.Mesh(Bx(tw*.7,wr*(vv?.075:.13),wr*.98),rim);b.position.x=sx*tw*.18;b.rotation.x=k*6.2832/n;spn.add(b)}}
  const ln=new T.Mesh(new T.CylinderGeometry(wr+.04,wr+.04,w*.8,20,1,true,0,Math.PI),new T.MeshStandardMaterial({color:col(0x0a0a0b),roughness:1,side:T.BackSide}));ln.rotation.z=Math.PI/2;ln.position.set(0,wr,zc);g.add(ln);wheels.push({piv,sp:spn,front})}
 let spot=null;if(lit){spot=new T.SpotLight(0xfff0d0,0,110,.55,.55,1.2);spot.position.set(0,.9,zf-.2);const tg=new T.Object3D();tg.position.set(0,.4,zf+40);g.add(spot,tg);spot.target=tg}
 const glows=[];for(const sd of[-1,1]){const s=new T.Sprite(new T.SpriteMaterial({map:glowTex(),color:0xff2a1a,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));s.position.set(sd*(van?.66:.4),van?1.05:.7,zr-.12);s.scale.set(.9,.9,.9);bd.add(s);glows.push(s)}
 return{g,bd,wheels,tl,hl,spot,def:d,geo,ggeo,orig:geo.attributes.position.array.slice(),gorig:ggeo.attributes.position.array.slice(),crack,glows}}
function updCar(c,v,dt,night){c.g.position.set(v.x,0,v.z);c.g.rotation.y=v.h;c.bd.rotation.x=cl(-v.ax*.0035,-.05,.05);c.bd.rotation.z=cl(v.ay*.004,-.06,.06);
 for(const w of c.wheels){w.sp.rotation.x+=v.vx/c.def.Rw*dt;if(w.front)w.piv.rotation.y=v.dl}
 const b=v.brk>.15;c.tl.emissiveIntensity=b?3.2:.5;for(const s of c.glows)s.material.opacity=b?.9:(night?.22:0)}
class World{
 constructor(cv,mir,tk,thId){this.tk=tk;this.thId=thId||'city';this.cv=cv;this.lo=matchMedia('(pointer:coarse)').matches;const r=this.r=new T.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
  r.setPixelRatio(Math.min(window.devicePixelRatio||1,this.lo?1.5:2));r.outputEncoding=T.sRGBEncoding;r.toneMapping=T.ACESFilmicToneMapping;r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  this.scene=new T.Scene();this.cam=new T.PerspectiveCamera(58,1,.3,1800);this.mcam=new T.PerspectiveCamera(48,4,.3,900);
  this.hemi=new T.HemisphereLight(0xffffff,0x888888,1);this.sun=new T.DirectionalLight(0xffffff,3);this.sun.castShadow=true;const sc=this.sun.shadow;sc.mapSize.set(this.lo?1024:2048,this.lo?1024:2048);
  Object.assign(sc.camera,{left:-60,right:60,top:60,bottom:-60,near:1,far:420});sc.camera.updateProjectionMatrix();sc.bias=-.0004;sc.normalBias=.06;this.scene.add(this.hemi,this.sun,this.sun.target);
  r.autoClear=false;r.shadowMap.autoUpdate=false;this.pr=Math.min(window.devicePixelRatio||1,this.lo?1.5:2);this.prMax=this.pr;this.build();
  this.mrt=new T.WebGLRenderTarget(240,64,{minFilter:T.LinearFilter,magFilter:T.LinearFilter});const mt=this.mrt.texture;mt.wrapS=T.RepeatWrapping;mt.repeat.x=-1;mt.offset.x=1;this.hud=new T.Scene();this.hcam=new T.OrthographicCamera(0,1,1,0,-1,1);
  this.mq=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:mt,depthTest:false,depthWrite:false}));this.mq.visible=false;this.hud.add(this.mq);this.mrect=null;
  this.resize();addEventListener('resize',()=>this.resize());this.atm('morning')}
 resize(){const w=innerWidth,h=innerHeight;this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.hcam.right=w;this.hcam.top=h;this.hcam.updateProjectionMatrix();this.measure()}
 measure(){const e=document.querySelector('.mirror');const b=e&&e.getBoundingClientRect();if(b&&b.width>8){this.mrect=b;const w=Math.round(b.width-4),h=Math.round(b.height-4);if(this.mrt.width!==w||this.mrt.height!==h)this.mrt.setSize(w,h);this.mcam.aspect=w/h;this.mcam.updateProjectionMatrix()}else this.mrect=null}
 setRamadan(on){if(this.ramL)this.ramL.visible=!!on}
 setPR(p){this.pr=p;this.r.setPixelRatio(p);this.r.setSize(innerWidth,innerHeight,false)}
 compile(){this.r.compile(this.scene,this.cam)}
 atm(k){const A=ATM[k],sc=this.scene;this.k=k;sc.background=new T.Color(A.bg);sc.fog=new T.FogExp2(col(A.bg),A.fd);this.hemi.color=col(A.hemi[0]);this.hemi.groundColor=col(A.hemi[1]);this.hemi.intensity=A.hemi[2];
  this.sun.color=col(A.sun[0]);this.sun.intensity=A.sun[1];this.r.toneMappingExposure=A.exp;this.roadM.roughness=k==='fog'?.28:k==='rain'?.18:.85;this.roadM.metalness=k==='fog'?.15:k==='rain'?.25:0;
  if(this.rt)this.rt.dispose();this.rt=envFor(this.r,k);sc.environment=this.rt.texture;this.night=A.night;
  this.winM.emissiveIntensity=A.night?1.2:0;this.lampM.emissiveIntensity=A.night?5:.3}
 build(){const th=this.th=TH[this.thId]||TH.city,tk=this.tk,sc=this.scene,N=tk.N,before=new Set(sc.children);let cx=0,cz=0;for(const p of tk.P){cx+=p.x;cz+=p.z}cx/=N;cz/=N;
  const sand=ctex(256,256,(c,w,h)=>{c.fillStyle=th.g0;c.fillRect(0,0,w,h);for(let i=0;i<2600;i++){c.fillStyle=`rgba(${Math.random()<.5?th.g1:th.g2},.22)`;c.fillRect(Math.random()*w,Math.random()*h,2,2)}},1,380,380);
  const gnd=new T.Mesh(new T.PlaneGeometry(6000,6000),new T.MeshStandardMaterial({map:sand,roughness:1}));gnd.rotation.x=-Math.PI/2;gnd.position.set(cx,-.03,cz);gnd.receiveShadow=true;sc.add(gnd);if(th.wz!=null){const wt=new T.Mesh(new T.PlaneGeometry(7000,3000),new T.MeshStandardMaterial({color:col(0x2c6e8a),roughness:.18,metalness:.35}));wt.rotation.x=-Math.PI/2;wt.position.set(cx,-.01,th.wz-1500);sc.add(wt)}
  const road=ctex(256,512,(c,w,h)=>{c.fillStyle='#2f3033';c.fillRect(0,0,w,h);for(let i=0;i<5000;i++){c.fillStyle=`rgba(${Math.random()<.5?'0,0,0':'255,255,255'},.07)`;c.fillRect(Math.random()*w,Math.random()*h,2,2)}
   for(const u of[.375,.625,.125,.875]){c.fillStyle='rgba(0,0,0,.16)';c.fillRect(w*u-9,0,18,h)}c.fillStyle='#e9e9e4';c.fillRect(w*.02,0,w*.014,h);c.fillRect(w*.966,0,w*.014,h);
   for(const u of[.25,.5,.75]){c.fillRect(w*u-2.5,0,5,h*.25)}},1);road.wrapS=T.ClampToEdgeWrapping;road.wrapT=T.RepeatWrapping;
  const rm=this.roadM=new T.MeshStandardMaterial({map:road,roughness:.85,side:T.DoubleSide});sc.add(ribbon(tk,0,N,7.5,-7.5,.01,.01,rm,1/12));
  const cm=new T.MeshStandardMaterial({vertexColors:true,roughness:.6,side:T.DoubleSide}),sm=new T.MeshStandardMaterial({color:col(0x3b3c3e),roughness:.95,side:T.DoubleSide});
  for(const[a,b]of[[7.5,8.4],[-8.4,-7.5]])sc.add(ribbon(tk,0,N,a,b,.02,.02,cm,1,1));for(const[a,b]of[[8.4,11.3],[-11.3,-8.4]])sc.add(ribbon(tk,0,N,a,b,.005,.005,sm,1));
  const o=new T.Object3D(),bar=new T.InstancedMesh(new T.BoxGeometry(.55,.95,tk.ds*1.04),new T.MeshStandardMaterial({color:col(th.bar),roughness:.85}),N*2);let n=0;
  for(let i=0;i<N;i++)for(const sd of[-1,1]){const p=tk.P[i],l=tk.Lf[i];o.position.set(p.x+l.x*sd*11.2,.475,p.z+l.z*sd*11.2);o.rotation.set(0,tk.H[i],0);o.updateMatrix();bar.setMatrixAt(n++,o.matrix)}bar.receiveShadow=true;sc.add(bar);
  this.lampM=new T.MeshStandardMaterial({color:col(0xffd9a0),emissive:col(0xffb060),emissiveIntensity:.3});const pm=new T.MeshStandardMaterial({color:col(0x6c7075),metalness:.7,roughness:.5});
  const lc=Math.ceil(N/th.ls)*2,poles=new T.InstancedMesh(new T.CylinderGeometry(.1,.14,9,8),pm,lc),heads=new T.InstancedMesh(new T.BoxGeometry(.5,.12,1.4),this.lampM,lc);n=0;
  for(let i=0;i<N;i+=th.ls)for(const sd of[-1,1]){const p=tk.P[i],l=tk.Lf[i];o.rotation.set(0,tk.H[i],0);o.position.set(p.x+l.x*sd*12.4,4.5,p.z+l.z*sd*12.4);o.updateMatrix();poles.setMatrixAt(n,o.matrix);o.position.set(p.x+l.x*sd*11.6,9,p.z+l.z*sd*11.6);o.updateMatrix();heads.setMatrixAt(n++,o.matrix)}sc.add(poles,heads);
 {const st=Math.max(1,Math.floor(th.ls/2)),cnt=Math.ceil(N/st)*2,lg=new T.InstancedMesh(new T.CylinderGeometry(.3,.2,.8,6),new T.MeshBasicMaterial({color:0xffffff}),cnt),pal=[0xffb020,0x2fd36a,0xff5a3c,0xffd34d],cc=new T.Color();let q=0;
  for(let i=0;i<N;i+=st)for(const sd of[-1,1]){const p=tk.P[i],l=tk.Lf[i];o.rotation.set(0,tk.H[i],0);o.position.set(p.x+l.x*sd*9.6,6.6,p.z+l.z*sd*9.6);o.updateMatrix();lg.setMatrixAt(q,o.matrix);lg.setColorAt(q,cc.setHex(pal[q%4]).convertSRGBToLinear());q++}
  lg.count=q;lg.instanceMatrix.needsUpdate=true;if(lg.instanceColor)lg.instanceColor.needsUpdate=true;lg.visible=false;lg.frustumCulled=false;sc.add(lg);this.ramL=lg}

  let ec;const win=ctex(256,512,(c,w,h)=>{const e=ec=document.createElement('canvas');e.width=w;e.height=h;const x=e.getContext('2d');c.fillStyle='#d8d0c0';c.fillRect(0,0,w,h);x.fillStyle='#000';x.fillRect(0,0,w,h);
   for(let j=0;j<18;j++)for(let i=0;i<8;i++){const px=8+i*30,py=10+j*28;c.fillStyle='#34404c';c.fillRect(px,py,20,17);if(Math.random()<.4){x.fillStyle='#ffd98a';x.fillRect(px,py,20,17)}}},1);
  const em=new T.CanvasTexture(ec);em.encoding=T.sRGBEncoding;this.winM=new T.MeshStandardMaterial({map:win,emissiveMap:em,emissive:0xffffff,emissiveIntensity:0,roughness:.85});
  const sub=[];for(let i=0;i<N;i+=3)sub.push(tk.P[i]);const bl=[];let seed=7;const rn=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let a=0;a<2600&&bl.length<th.nb;a++){const i=Math.floor(rn()*N),sd=rn()<.5?-1:1,off=(th.b0+rn()*th.bw)*sd,p=tk.P[i],l=tk.Lf[i],x=p.x+l.x*off,z=p.z+l.z*off;let ok=true;for(const q of sub){if((q.x-x)**2+(q.z-z)**2<576){ok=false;break}}
   if(ok&&(th.wz==null||z>th.wz+40))bl.push({x,z,w:14+rn()*16,d:14+rn()*16,h:th.h0+Math.pow(rn(),2)*th.hh,r:tk.H[i],c:.78+rn()*.22})}
  const bs=new T.InstancedMesh(new T.BoxGeometry(1,1,1),this.winM,bl.length);bl.forEach((b,k)=>{o.position.set(b.x,b.h/2,b.z);o.rotation.set(0,b.r,0);o.scale.set(b.w,b.h,b.d);o.updateMatrix();bs.setMatrixAt(k,o.matrix);bs.setColorAt(k,new T.Color(b.c,b.c*.97,b.c*.9))});o.scale.set(1,1,1);bs.receiveShadow=true;sc.add(bs);
  const pc=Math.ceil(N/th.ts)*2,tr=new T.InstancedMesh(new T.CylinderGeometry(.16,.24,7,6),mat0(0x6b5a40),pc),cr=new T.InstancedMesh(th.cg(),mat0(th.cc),pc);n=0;
  for(let i=4;i<N;i+=th.ts)for(const sd of[-1,1]){const p=tk.P[i],l=tk.Lf[i],off=sd*(15+rn()*2);o.rotation.set(0,rn()*6,0);o.position.set(p.x+l.x*off,3.5,p.z+l.z*off);o.updateMatrix();tr.setMatrixAt(n,o.matrix);o.position.y=7.6;o.updateMatrix();cr.setMatrixAt(n++,o.matrix)}sc.add(tr,cr);
  const tw=new T.Mesh(new T.CylinderGeometry(2.4,5.5,160,24),mat0(0xb9b4a8));tw.position.set(cx,80,cz);const tp=new T.Mesh(new T.CylinderGeometry(11,6,12,24),mat0(0xa9a398));tp.position.set(cx,150,cz);if(th.tower)sc.add(tw,tp);
  const t0=Math.floor(N*.12),tn=Math.floor(N*.075),tm=new T.MeshStandardMaterial({color:col(0x8c8a84),roughness:.9,side:T.DoubleSide}),lm=new T.MeshStandardMaterial({color:col(0xffffff),emissive:col(0xdfe8ff),emissiveIntensity:2.2,side:T.DoubleSide});
  for(const sd of[-1,1]){const w=ribbon(tk,t0,tn,sd*11.9,sd*11.9,0,6.6,tm,1/6);w.castShadow=true;sc.add(w)}const rf=ribbon(tk,t0,tn,12,-12,6.6,6.6,tm,1/6);rf.castShadow=true;sc.add(rf);sc.add(ribbon(tk,t0,tn,.6,-.6,6.5,6.5,lm,1/6));
  for(const k of[t0,t0+tn]){const p=tk.P[k%N],l=tk.Lf[k%N];const b=new T.Mesh(new T.BoxGeometry(26,1.6,.8),tm);b.position.set(p.x,6.9,p.z);b.rotation.y=tk.H[k%N];sc.add(b)}

  if(th.dunes){const dn=new T.InstancedMesh(new T.ConeGeometry(.5,1,10),new T.MeshStandardMaterial({color:col(0xd6b574),roughness:1}),70);let m=0;
   for(let a=0;a<600&&m<70;a++){const i=Math.floor(rn()*N),sd=rn()<.5?-1:1,off=(60+rn()*230)*sd,p=tk.P[i],l=tk.Lf[i],x=p.x+l.x*off,z=p.z+l.z*off,sx=25+rn()*50;let ok=true;for(const q of sub){if((q.x-x)**2+(q.z-z)**2<(sx*.5+16)**2){ok=false;break}}
    if(!ok)continue;const sy=5+rn()*14;o.position.set(x,sy/2-.3,z);o.rotation.set(0,rn()*6,0);o.scale.set(sx,sy,25+rn()*50);o.updateMatrix();dn.setMatrixAt(m++,o.matrix)}
   dn.count=m;o.scale.set(1,1,1);dn.receiveShadow=true;sc.add(dn)}
  if(th.gantry){const gs=[];for(let i=20;i<N;i+=Math.round(N/14))gs.push(i);const gm=new T.MeshStandardMaterial({color:col(0x1f6a46),roughness:.7}),pm2=new T.MeshStandardMaterial({color:col(0x70757a),metalness:.6,roughness:.5});
   const gb=new T.InstancedMesh(new T.BoxGeometry(26,1.9,.35),gm,gs.length),gp=new T.InstancedMesh(new T.BoxGeometry(.5,8,.5),pm2,gs.length*2);let q=0;
   gs.forEach((i,k)=>{const p=tk.P[i],l=tk.Lf[i];o.rotation.set(0,tk.H[i],0);o.position.set(p.x,7.6,p.z);o.updateMatrix();gb.setMatrixAt(k,o.matrix);for(const sd of[-1,1]){o.position.set(p.x+l.x*sd*12.6,4,p.z+l.z*sd*12.6);o.updateMatrix();gp.setMatrixAt(q++,o.matrix)}});sc.add(gb,gp)}
  this.tobj=sc.children.filter(c=>!before.has(c));
  function mat0(c){return new T.MeshStandardMaterial({color:col(c),roughness:.9})}}
 setTrack(tk,id){if(this.tobj)for(const c of this.tobj){this.scene.remove(c);c.traverse(o=>{if(o.geometry)o.geometry.dispose()})}this.tk=tk;this.thId=id;this.build();this.atm(this.k||'morning')}
 shadowAt(p){const d=this.k==='night'?[40,120,30]:(this.k==='fog'||this.k==='rain')?[60,160,50]:[120,170,60];this.sun.target.position.set(p.x,0,p.z);this.sun.position.set(p.x+d[0],d[1],p.z+d[2]);this.sun.target.updateMatrixWorld()}
 render(mc,doM){const r=this.r;r.shadowMap.needsUpdate=true;
  if(doM&&this.mrect){r.setRenderTarget(this.mrt);r.clear();r.render(this.scene,mc);r.setRenderTarget(null)}
  r.clear();r.render(this.scene,this.cam);
  if(this.mrect){const b=this.mrect;this.mq.visible=true;this.mq.scale.set(b.width-4,b.height-4,1);this.mq.position.set(b.left+b.width/2,innerHeight-(b.top+b.height/2),0);r.clearDepth();r.render(this.hud,this.hcam)}}
}
class Preview{
 constructor(cv){this.r=new T.WebGLRenderer({canvas:cv,antialias:true});this.r.setPixelRatio(Math.min(window.devicePixelRatio||1,2));this.r.outputEncoding=T.sRGBEncoding;this.r.toneMapping=T.ACESFilmicToneMapping;this.r.shadowMap.enabled=true;
  const s=this.s=new T.Scene();s.background=new T.Color(0x0a1024);this.r.toneMappingExposure=.9;this.rt=envFor(this.r,'morning');s.environment=this.rt.texture;const k=new T.DirectionalLight(0xe8eeff,2.4);k.position.set(4,7,5);k.castShadow=true;s.add(k,new T.HemisphereLight(0xbfd0ff,0x101425,.55));
  const fl=new T.Mesh(new T.CircleGeometry(6,48),new T.MeshStandardMaterial({color:col(0x1a2340),roughness:.7,metalness:.2}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;s.add(fl);
  this.cam=new T.PerspectiveCamera(34,16/9,.1,60);this.holder=new T.Group();s.add(this.holder);this.car=null}
 set(d){if(this.car)this.holder.remove(this.car.g);this.car=makeCar(d);this.car.g.traverse(o=>{if(o.isMesh)o.castShadow=true});this.holder.add(this.car.g)}
 render(t){const cv=this.r.domElement,w=cv.clientWidth,h=cv.clientHeight;if(w<2)return;if(cv.width!==Math.round(w*this.r.getPixelRatio())){this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix()}
  this.holder.rotation.y=t*.5;this.cam.position.set(0,2.1,8.6);this.cam.lookAt(0,.9,0);if(this.car){for(const x of this.car.wheels)x.sp.rotation.x=t*3}this.r.render(this.s,this.cam)}
}
S.World=World;S.Preview=Preview;S.makeCar=makeCar;S.updCar=updCar;})(window.SS);
