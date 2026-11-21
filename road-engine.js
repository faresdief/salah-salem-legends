(function(S){'use strict';
const P=S.P,TR=S.TR;
const rnd=(a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(7);
const eIn=(a,b,t)=>a+(b-a)*t*t,eIO=(a,b,t)=>a+(b-a)*(-Math.cos(t*Math.PI)/2+.5);
const SIGNS=[['المطار','#1F5F4A'],['مدينة نصر','#1F4E79'],['القلعة','#1F5F4A']];
const item=(k,x)=>({k,x,hit:false,warned:false,t:0,vx:0});
class RoadEngine{
 constructor(){this.segs=[];this.len=0;this.traffic=[];this.fly=[]}
 mk(z,y){return{w:{x:0,y,z},c:{x:0,y:0,z:0},s:{x:0,y:0,w:0,k:0}}}
 lastY(){const n=this.segs.length;return n?this.segs[n-1].p2.w.y:0}
 add(curve,y){const n=this.segs.length;this.segs.push({i:n,p1:this.mk(n*P.segLen,this.lastY()),p2:this.mk((n+1)*P.segLen,y),curve,cars:[],items:[],props:[],clip:0,ok:false,fog:0,col:Math.floor(n/P.rumbleLen)%2,radar:false})}
 section(en,ho,le,curve,hill){const sy=this.lastY(),ey=sy+hill*P.segLen,tot=en+ho+le;let n;
  for(n=0;n<en;n++)this.add(eIn(0,curve,n/en),eIO(sy,ey,n/tot));
  for(n=0;n<ho;n++)this.add(curve,eIO(sy,ey,(en+n)/tot));
  for(n=0;n<le;n++)this.add(eIO(curve,0,n/le),eIO(sy,ey,(en+ho+n)/tot))}
 build(secs){this.segs=[];for(const s of secs)this.section(...s);this.section(30,10,30,0,-this.lastY()/P.segLen);
  const N=this.segs.length;this.segs[N-1].p2.w.y=0;this.len=N*P.segLen;this.decorate()}
 decorate(){const Ln=P.lanes,S_=this.segs;
  for(const sg of S_){const n=sg.i;
   if(n%10===0)sg.props.push({k:'l',x:-1.4},{k:'l',x:1.4});else if(n%3===0)sg.props.push({k:'b',x:-1.1},{k:'b',x:1.1});
   if(n%89===30){const q=SIGNS[(n/89|0)%3];sg.props.push({k:'s',x:-1.7,t:q[0],c:q[1]})}
   if(n>40&&n%37===0){const r=rnd();if(r<.3)sg.items.push(item('bump',0));else if(r<.75){const a=(rnd()*4)|0;sg.items.push(item('cone',Ln[a]));if(rnd()<.5)sg.items.push(item('cone',Ln[(a+1)%4]))}}
   if(n%7===3)sg.items.push(item('coin',Ln[(rnd()*4)|0]));
   if(n%149===60)sg.items.push(item('turbo',Ln[(rnd()*4)|0]));
   if(n%173===90)sg.items.push(item('wrench',Ln[(rnd()*4)|0]));
   if(n%160===120){sg.radar=true;sg.props.push({k:'r',x:1.5});S_[n-12].props.push({k:'w',x:1.5})}}}
 resetItems(){for(const s of this.segs)for(const i of s.items){i.hit=false;i.warned=false;i.t=0}this.fly.length=0}
 spawn(n){this.traffic.length=0;for(let i=0;i<n;i++){const l=P.lanes[i%4],b=P.maxSpeed*(i%7===0?.85:.25+rnd()*.3);
  this.traffic.push({z:(900+i*(this.len/n))%this.len,x:l,tx:l,v:b,base:b,ty:i%TR.length,blink:0,cool:0,pdz:0})}}
 dz(a,b){const L=this.len;return((a-b+L*1.5)%L)-L/2}
 free(c,ln){for(const o of this.traffic){if(o!==c&&Math.min(Math.abs(o.tx-ln),Math.abs(o.x-ln))<.3&&Math.abs(this.dz(o.z,c.z))<700)return false}return true}
 nearLane(x){return P.lanes.reduce((a,b)=>Math.abs(b-x)<Math.abs(a-x)?b:a)}
 step(dt,p){const L=this.len,T=this.traffic;
  for(const c of T){c.cool=Math.max(0,c.cool-dt);c.blink=Math.max(0,c.blink-dt);
   let f=null,fd=1e9;
   for(const o of T){if(o===c||Math.abs(o.tx-c.tx)>.3)continue;const d=this.dz(o.z,c.z);if(d>0&&d<900&&d<fd){fd=d;f=o}}
   if(f&&f.v<c.base){for(const ln of P.lanes){const q=Math.abs(ln-c.tx);if(q<.4||q>.55)continue;if(this.free(c,ln)){c.tx=ln;c.blink=1;f=null;break}}}
   c.v=f?Math.min(c.base,f.v):c.base;
   c.x+=Math.max(-dt*1.1,Math.min(dt*1.1,c.tx-c.x));c.z=(c.z+c.v*dt)%L}
  for(let i=this.fly.length-1;i>=0;i--){this.fly[i].t+=dt;if(this.fly[i].t>1.6)this.fly.splice(i,1)}}
 bucket(){for(const s of this.segs)s.cars.length=0;for(const c of this.traffic)this.segs[Math.floor(c.z/P.segLen)%this.segs.length].cars.push(c)}
 horn(p){let n=0;for(const c of this.traffic){const d=this.dz(c.z,p.z);if(d<=0||d>3500||Math.abs(c.tx-p.x)>.5)continue;
  for(const ln of P.lanes){if(ln===c.tx||Math.abs(ln-p.x)<.3)continue;if(this.free(c,ln)){c.tx=ln;c.blink=1.5;n++;break}}}return n}
 scan(p){const r={hit:null,near:0};
  for(const c of this.traffic){const d=this.dz(c.z,p.z),lx=Math.abs(c.x-p.x);
   if(!r.hit&&c.cool<=0&&d>-60&&d<260&&lx<.34)r.hit=c;
   else if(c.pdz>0&&d<=0&&c.pdz<900&&lx>=.34&&lx<.65&&p.v>P.maxSpeed*.25)r.near++;
   c.pdz=d}return r}
}
class VehiclePhysics{
 constructor(d){this.set(d)}
 set(d){this.d=d;this.reset()}
 reset(){this.z=0;this.x=0;this.v=0;this.turbo=0;this.boost=0;this.hp=100;this.drifting=false;this.turn=0;this.km=0}
 get kmh(){return this.v/P.maxSpeed*240}
 update(dt,k,seg,L){const d=this.d,M=P.maxSpeed,cap=M*(.7+.3*d.top)*(this.boost>0?1.35:1),pct=this.v/M;
  if(k.up)this.v+=M/(6-3*d.acc)*dt*(this.boost>0?2.2:1);else if(k.down)this.v-=M/1.6*dt;else this.v-=M/6*dt;
  if(Math.abs(this.x)>1.08&&this.v>M*.25)this.v-=M/2.2*dt;
  this.v=Math.max(0,Math.min(this.v,cap));
  const s=(k.right?1:0)-(k.left?1:0);this.turn=s;
  const was=this.drifting;this.drifting=!!k.drift&&s!==0&&pct>.4;
  const b=dt*2*pct;this.x+=b*(.8+.6*d.hnd)*(this.drifting?1+d.drift:1)*s-b*pct*seg.curve*.3;
  if(this.drifting)this.turbo=Math.min(1,this.turbo+dt*.5);else if(was&&this.turbo>.2){this.boost=this.turbo*2.5;this.turbo=0}
  if(this.boost>0)this.boost-=dt;
  this.x=Math.max(-2.4,Math.min(2.4,this.x));this.z=(this.z+this.v*dt)%L;this.km+=this.kmh/3600*dt}
}
S.RoadEngine=RoadEngine;S.VehiclePhysics=VehiclePhysics;})(window.SS);
