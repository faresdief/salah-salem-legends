(function(S){'use strict';
const {C,P,TR}=S;
function quad(c,x1,y1,x2,y2,x3,y3,x4,y4,col){c.fillStyle=col;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineTo(x3,y3);c.lineTo(x4,y4);c.closePath();c.fill()}
function proj(p,cx,cy,cz,dep,w,h){p.c.x=p.w.x-cx;p.c.y=p.w.y-cy;p.c.z=p.w.z-cz;const sc=dep/p.c.z;
 p.s.k=sc*w/2;p.s.x=Math.round(w/2+sc*p.c.x*w/2);p.s.y=Math.round(h/2-sc*p.c.y*h/2);p.s.w=Math.round(sc*P.roadW*w/2)}
function drawCar(c,cx,Y,w0,d,o){o=o||{};
 const al=c.globalAlpha,mic=!!d.win,tax=!!d.sign,fia=d.ex===2,ver=d.id==='verna';
 const w=w0*(mic?(d.ladder?1.12:1.05):1),h=w*d.h*(d.ladder?1.05:1),x=cx-w/2,bt=d.bt,tw=d.tw||(mic?.15:.17);
 const body=tax?C.panel:d.body,cab=tax?'#E8E8E8':d.cab;
 const R=(a,t,ww,hh,col)=>{c.fillStyle=col;c.fillRect(x+w*a,Y-h*t,w*ww,h*hh)};
 const G=(col,pts)=>{c.fillStyle=col;c.beginPath();for(let i=0;i<pts.length;i++){const q=pts[i];if(i)c.lineTo(x+w*q[0],Y-h*q[1]);else c.moveTo(x+w*q[0],Y-h*q[1])}c.closePath();c.fill()};
 R(.04,.2,tw,.2,'#0A0A0A');R(.96-tw,.2,tw,.2,'#0A0A0A');
 R(0,bt,1,bt-.18,body);
 if(fia){R(-.03,.44,.37,.24,body);R(.66,.44,.37,.24,body)}
 G(cab,mic?[[.04,bt],[.08,1],[.92,1],[.96,bt]]:fia?[[.1,bt],[.14,1],[.86,1],[.9,bt]]:[[.14,bt],[.25,1],[.75,1],[.86,bt]]);
 if(mic){R(.1,bt-.03,.37,.3,C.bg);R(.53,bt-.03,.37,.3,C.bg);R(.12,.97,.76,.11,C.bg)}
 else if(fia)G(C.bg,[[.18,bt+.03],[.2,.93],[.8,.93],[.82,bt+.03]]);
 else G(C.bg,[[.2,bt+.02],[.27,.94],[.73,.94],[.8,bt+.02]]);
 if(ver){for(let i=0;i<3;i++)R(.25,.64+i*.1,.5,.012,C.b1)}
 if(ver||tax){R(.06,bt,.88,.2,tax?'#E8E8E8':'#5A5A5A');R(.06,bt-.2,.88,.012,C.bg);R(.46,bt-.12,.08,.03,C.mute)}
 if(tax){for(let i=0;i<12;i++)R(.06+i*.0733,bt,.0733,.035,i%2?C.text:C.bg);
  c.globalAlpha=al*.25;R(.28,1.14,.44,.16,C.gold);c.globalAlpha=al;R(.36,1.07,.28,.09,C.gold);
  if(h*.065>6){c.fillStyle=C.bg;c.font='700 '+((h*.065)|0)+'px Cairo,Tahoma,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('تاكسي',cx,Y-h*1.025)}}
 if(mic){if(d.stripe){R(0,bt-.12,1,.07,d.stripe);R(0,bt,.03,bt-.18,d.stripe);R(.97,bt,.03,bt-.18,d.stripe)}
  R(.495,.5,.012,.3,C.mute);R(.44,.34,.04,.05,C.b2);R(.52,.34,.04,.05,C.b2)}
 if(d.ladder){R(.015,1.02,.02,.84,C.mute);R(.085,1.02,.02,.84,C.mute);for(let i=0;i<5;i++)R(.015,.98-i*.17,.09,.016,C.mute)}
 if(fia){R(0,.4,1,.03,'#E8E8E8');R(.08,.58,.84,.04,C.panel);R(.08,.58,.03,.1,C.panel);R(.89,.58,.03,.1,C.panel)}
 if(ver)R(.3,.44,.4,.02,C.mute);
 const lt=(col,g)=>{
  if(fia){c.fillStyle=col;for(const fx of[.13,.87]){c.beginPath();c.arc(x+w*fx,Y-h*.4,h*(.065+g),0,6.283);c.fill()}}
  else if(mic){R(.03-g,.8+g,.07+2*g,.34+2*g,col);R(.9-g,.8+g,.07+2*g,.34+2*g,col)}
  else if(ver){G(col,[[.03-g,.47+g],[.3+g,.47+g],[.27+g,.37-g],[.03-g,.37-g]]);G(col,[[.97+g,.47+g],[.7-g,.47+g],[.73-g,.37-g],[.97+g,.37-g]])}
  else{R(.04-g,.46+g,.2+2*g,.09+2*g,col);R(.76-g,.46+g,.2+2*g,.09+2*g,col)}};
 lt(o.brake?C.red:'#6E1515',0);
 if(o.brake){c.globalAlpha=al*.3;lt(C.red,.03);c.globalAlpha=al;if(!mic)R(.4,bt+.05,.2,.025,C.red)}
 R(.4,.3,.2,.06,'#E8E8E8');R(.02,.24,.96,.06,fia?C.mute:C.b1);
 const ex=fia?[.38,.62]:ver?[.68]:mic?[.7]:[.7];
 for(const f of ex){R(f-.05,.14,.1,.06,C.b2);R(f-.03,.13,.06,.035,C.bg)}
 if(o.bl)R(o.bl<0?0:.94,.46,.06,.09,C.gold);
 if(o.fl)for(const f of ex){const l=h*(.3+Math.random()*.25),fx=x+w*f,fy=Y-h*.08,fw=w*.05;
  c.fillStyle=C.cone;c.beginPath();c.moveTo(fx-fw,fy);c.lineTo(fx+fw,fy);c.lineTo(fx,fy+l);c.fill();
  c.fillStyle=C.gold;c.beginPath();c.moveTo(fx-fw*.5,fy);c.lineTo(fx+fw*.5,fy);c.lineTo(fx,fy+l*.6);c.fill()}}
class WorldRenderer{
 constructor(cv){this.cv=cv;this.c=cv.getContext('2d');this.sky=[this.gen(1),this.gen(2)];this.t=0;this.resize();addEventListener('resize',()=>this.resize())}
 gen(sd){const a=[];let t=0;for(let i=0;i<40;i++){const w=14+((i*37+sd*53)%34),m=i%9===0,h=(20+((i*53+sd*29)%(sd===1?70:48)))*(m?2:1);a.push({w,h,m});t+=w}a.tot=t;return a}
 resize(){const d=Math.min(2,window.devicePixelRatio||1);this.w=innerWidth;this.h=innerHeight;this.cv.width=this.w*d;this.cv.height=this.h*d;this.c.setTransform(d,0,0,d,0,0)}
 layer(a,off,by,al,col,hs){const c=this.c;c.globalAlpha=al;c.fillStyle=col;let x=-(((off%a.tot)+a.tot)%a.tot);
  while(x<this.w){for(const b of a){if(x+b.w>0&&x<this.w){c.fillRect(x,by-b.h*hs,b.w,b.h*hs);if(b.m)c.fillRect(x+b.w*.45,by-b.h*hs-18,b.w*.1,18)}x+=b.w}}c.globalAlpha=1}
 pos(sg,x,ww){const s=sg.p1.s;this.k=s.k;this.sx=s.x+s.k*x*P.roadW;this.sy=s.y;this.sw=s.k*ww}
 prop(pr){const c=this.c,k=this.k,sx=this.sx,sy=this.sy;
  if(pr.k==='l'){const hh=k*1500,pw=Math.max(1,k*70),dr=pr.x<0?1:-1,lx=sx+dr*k*350;c.fillStyle=C.b2;c.fillRect(sx-pw/2,sy-hh,pw,hh);c.fillRect(Math.min(sx,lx),sy-hh,k*350,pw);
   c.fillStyle=C.gold;c.fillRect(lx-k*100,sy-hh,k*200,pw*1.6);if(this.atm!=='morning'){c.globalAlpha*=.14;c.fillRect(lx-k*260,sy-hh,k*520,k*500);c.globalAlpha=1}}
  else if(pr.k==='b'){const w=k*600,h=k*280;c.fillStyle=C.b2;c.beginPath();c.moveTo(sx-w/2,sy);c.lineTo(sx-w*.35,sy-h);c.lineTo(sx+w*.35,sy-h);c.lineTo(sx+w/2,sy);c.fill()}
  else if(pr.k==='s'){const pw=Math.max(1,k*60);c.fillStyle=C.b2;c.fillRect(sx-k*600,sy-k*1100,pw,k*1100);c.fillRect(sx+k*600,sy-k*1100,pw,k*1100);c.fillStyle=pr.c;c.fillRect(sx-k*700,sy-k*1750,k*1400,k*650);
   if(k*380>7){c.fillStyle=C.text;c.font='700 '+((k*380)|0)+'px Cairo,Tahoma,sans-serif';c.textAlign='center';c.textBaseline='middle';c.direction='rtl';c.fillText(pr.t,sx,sy-k*1425)}}
  else if(pr.k==='r'){c.fillStyle=C.b2;c.fillRect(sx-k*30,sy-k*1400,Math.max(1,k*60),k*1400);c.fillStyle=C.b1;c.fillRect(sx-k*300,sy-k*1700,k*600,k*320);c.fillStyle=C.red;c.fillRect(sx-k*80,sy-k*1600,k*160,k*160)}
  else if(pr.k==='w'){c.fillStyle=C.gold;c.fillRect(sx-k*350,sy-k*1300,k*700,k*700);c.fillStyle=C.bg;if(k*300>6){c.font='700 '+((k*300)|0)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(String(P.radarLimit),sx,sy-k*950)}}}
 item(it,sg){if(it.hit&&it.k!=='cone')return;const c=this.c,t=it.t;if(it.hit&&t>1.5)return;
  if(it.k==='bump'){this.pos(sg,0,1);const w=2*P.roadW*this.k,x=this.sx-w/2,hh=Math.max(2,this.k*80);for(let i=0;i<10;i++){c.fillStyle=i%2?C.bg:C.gold;c.fillRect(x+w/10*i,this.sy-hh,w/10+1,hh)}return}
  this.pos(sg,it.x,it.k==='turbo'?700:320);const sx=this.sx,sy=this.sy,w=this.sw;if(w<2)return;
  if(it.k==='coin'){c.fillStyle=C.gold;c.beginPath();c.ellipse(sx,sy-w*.6,Math.max(.5,w/2*Math.abs(Math.cos(this.t*4+it.x*3))),w/2,0,0,6.283);c.fill()}
  else if(it.k==='turbo'){c.fillStyle=C.gold;c.fillRect(sx-w/2,sy-w*.12,w,w*.12);c.fillStyle=C.bg;c.fillRect(sx-w*.35,sy-w*.09,w*.7,w*.06)}
  else if(it.k==='wrench'){c.save();c.translate(sx,sy-w*.6);c.rotate(.8+Math.sin(this.t*3)*.3);c.fillStyle=C.mute;c.fillRect(-w*.09,-w*.5,w*.18,w);c.beginPath();c.arc(0,-w*.5,w*.2,0,6.283);c.fill();c.fillStyle=C.bg;c.beginPath();c.arc(0,-w*.5,w*.08,0,6.283);c.fill();c.restore()}
  else{c.save();c.translate(sx+it.vx*t*w*3,sy-Math.max(0,3*t-4.5*t*t)*w*2);c.rotate(t*12*it.vx);c.fillStyle=C.cone;c.beginPath();c.moveTo(-w*.5,0);c.lineTo(w*.5,0);c.lineTo(w*.15,-w*1.1);c.lineTo(-w*.15,-w*1.1);c.fill();c.fillStyle='#E8E8E8';c.fillRect(-w*.3,-w*.6,w*.6,w*.18);c.restore()}}
 draw(s){const c=this.c,w=this.w,h=this.h,R=s.road,A=this.atm=s.atm,sk=C.sky[A],hz=h/2;this.t=s.t;
  c.fillStyle=sk;c.fillRect(0,0,w,h);const hs=h/700;
  this.layer(this.sky[0],s.skyX*.3,hz,.5,C.b2,hs);this.layer(this.sky[1],s.skyX*.6,hz,1,C.panel,hs);
  c.fillStyle=C.bg;c.fillRect(0,hz,w,h-hz);
  const dep=1/Math.tan(s.fov*Math.PI/360),pz=P.camH/Math.tan(P.fov*Math.PI/360),L=R.len,N=R.segs.length;
  const cz=((s.p.z-pz)%L+L)%L,bs=R.segs[Math.floor(cz/P.segLen)%N],bp=(cz%P.segLen)/P.segLen;
  const ps=R.segs[Math.floor(s.p.z/P.segLen)%N],pp=(s.p.z%P.segLen)/P.segLen;
  const cy=P.camH+ps.p1.w.y+(ps.p2.w.y-ps.p1.w.y)*pp+s.shake,fd=P.fog[A],gr=A==='morning'?C.panel:C.bg;
  let x=0,dx=-bs.curve*bp,maxy=h;
  for(let n=0;n<P.draw;n++){const sg=R.segs[(bs.i+n)%N],lp=sg.i<bs.i?L:0,a=sg.p1,b=sg.p2;
   proj(a,s.p.x*P.roadW-x,cy,cz-lp,dep,w,h);proj(b,s.p.x*P.roadW-x-dx,cy,cz-lp,dep,w,h);
   x+=dx;dx+=sg.curve;sg.clip=maxy;sg.ok=false;sg.fog=1-1/Math.exp(Math.pow(n/P.draw,2)*fd);
   if(a.c.z<=dep||b.s.y>=a.s.y||b.s.y>=maxy)continue;
   const x1=a.s.x,y1=a.s.y,w1=a.s.w,x2=b.s.x,y2=b.s.y,w2=b.s.w,r1=w1/8,r2=w2/8,rc=sg.col?C.gold:C.panel;
   c.fillStyle=sg.col?gr:'#161616';c.fillRect(0,y2,w,y1-y2);
   quad(c,x1-w1-r1,y1,x1-w1,y1,x2-w2,y2,x2-w2-r2,y2,rc);quad(c,x1+w1+r1,y1,x1+w1,y1,x2+w2,y2,x2+w2+r2,y2,rc);
   quad(c,x1-w1,y1,x1+w1,y1,x2+w2,y2,x2-w2,y2,sg.col?C.asph:'#1C1C1C');
   if(sg.col)for(let l=1;l<4;l++){const a1=x1-w1+w1/2*l,a2=x2-w2+w2/2*l,l1=w1/32,l2=w2/32;quad(c,a1-l1,y1,a1+l1,y1,a2+l2,y2,a2-l2,y2,l===2?C.gold:C.text)}
   if(sg.fog>.01){c.globalAlpha=sg.fog;c.fillStyle=sk;c.fillRect(0,y2,w,y1-y2+1);c.globalAlpha=1}
   sg.ok=true;maxy=y1}
  for(let n=P.draw-1;n>=0;n--){const sg=R.segs[(bs.i+n)%N];if(!sg.ok)continue;c.globalAlpha=Math.max(.08,1-sg.fog);
   for(const pr of sg.props){this.pos(sg,pr.x,1);this.prop(pr)}
   for(const it of sg.items)this.item(it,sg);
   for(const cr of sg.cars){this.pos(sg,cr.x,700);if(this.sw<3||this.sy>sg.clip)continue;
    drawCar(c,this.sx,this.sy,this.sw,TR[cr.ty],{brake:cr.v<cr.base-1,bl:cr.blink>0&&s.blink?(cr.tx>cr.x?1:-1):0})}}
  c.globalAlpha=1;
  const pw=Math.min(w*.3,h*.36),px=w/2+s.p.turn*pw*.04,py=h*.93+Math.sin(s.t*30)*s.p.v/P.maxSpeed*1.5-s.shake*.1;
  if(s.lights){c.fillStyle='rgba(212, 175, 55, 0.18)';c.beginPath();c.moveTo(px-pw*.35,py-pw*.5);c.lineTo(px+pw*.35,py-pw*.5);c.lineTo(px+pw*1.3,hz+h*.05);c.lineTo(px-pw*1.3,hz+h*.05);c.fill()}
  const dr=s.p.drifting,tl=s.p.turn*(dr?.16*(.5+s.p.d.drift*.7):.03);
  if(dr)for(let i=0;i<5;i++){const g=(s.t*3+i/5)%1,sd=i%2?1:-1;c.globalAlpha=.3*(1-g);c.fillStyle=C.mute;c.beginPath();c.arc(px+sd*pw*.38,py-pw*.1-g*pw*.25,pw*(.05+g*.12),0,6.283);c.fill()}
  c.globalAlpha=1;c.save();c.translate(px+(dr?s.p.turn*pw*.12:0),py);c.rotate(tl*.5);c.transform(1,0,-tl*.6,1,0,0);
  drawCar(c,0,0,pw,s.p.d,{brake:s.brake,bl:s.blink?s.bl:0,fl:s.fl});c.restore();
  if(s.ring>0){c.strokeStyle=C.gold;c.lineWidth=3;c.globalAlpha=1-s.ring;c.beginPath();c.arc(px,py-pw*.35,pw*(.5+s.ring*1.6),0,6.283);c.stroke();c.globalAlpha=1}
  this.mirror(s,R)}
 mirror(s,R){const c=this.c,mw=Math.min(240,this.w*.4),mh=58,mx=(this.w-mw)/2,my=64;
  c.fillStyle=C.bg;c.fillRect(mx,my,mw,mh);c.save();c.beginPath();c.rect(mx,my,mw,mh);c.clip();
  c.fillStyle=C.asph;c.beginPath();c.moveTo(mx+mw*.45,my+mh*.35);c.lineTo(mx+mw*.55,my+mh*.35);c.lineTo(mx+mw,my+mh);c.lineTo(mx,my+mh);c.fill();
  for(const o of R.traffic){const d=R.dz(o.z,s.p.z);if(d<0&&d>-4500){const f=1+d/4500;drawCar(c,mx+mw/2+(o.x-s.p.x)*mw*.3*(.3+f),my+mh*(.4+.6*f),8+f*40,TR[o.ty],{})}}
  c.restore();c.strokeStyle=C.b2;c.lineWidth=2;c.strokeRect(mx,my,mw,mh)}
 static preview(c,w,h,d,t){c.clearRect(0,0,w,h);c.fillStyle=C.bg;c.fillRect(0,0,w,h);c.fillStyle=C.asph;c.fillRect(0,h*.62,w,h*.38);c.fillStyle=C.b2;c.fillRect(0,h*.62,w,2);
  const a=Math.sin(t*1.2),k=.5+d.drift*.7;
  if(Math.abs(a)>.6){c.fillStyle=C.mute;for(let i=0;i<4;i++){const g=(t*2+i/4)%1;c.globalAlpha=.3*(1-g);c.beginPath();c.arc(w/2+(i%2?1:-1)*w*.2,h*.82-g*h*.12,h*(.03+g*.05),0,6.283);c.fill()}c.globalAlpha=1}
  c.save();c.translate(w/2,h*.88);c.rotate(a*.07*k);c.transform(1,0,a*.25,1,0,0);c.scale(1-Math.abs(a)*.08,1);drawCar(c,0,0,w*.5,d,{brake:Math.sin(t*2)>.7,bl:Math.sin(t*5)>0?(a>0?1:-1):0,fl:d.id==='fiat'&&Math.sin(t*2)>.7});c.restore()}
}
S.WorldRenderer=WorldRenderer;S.drawCar=drawCar;})(window.SS);
