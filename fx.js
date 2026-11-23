(function(S){'use strict';
const T=window.THREE;if(!T)return;
// ---- skid marks: ring buffer of ground quads, partial GPU uploads
class Skids{
 constructor(scene,max){this.max=max||2400;this.p=new Float32Array(this.max*18);this.a=new T.BufferAttribute(this.p,3);this.a.setUsage(T.DynamicDrawUsage);
  const g=new T.BufferGeometry();g.setAttribute('position',this.a);g.setDrawRange(0,0);
  this.m=new T.Mesh(g,new T.MeshBasicMaterial({color:0x060606,transparent:true,opacity:.55,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:T.DoubleSide}));
  this.m.frustumCulled=false;scene.add(this.m);this.n=0;this.last=[null,null,null,null]}
 add(i,x,z,on){const l=this.last[i];if(!on){this.last[i]=null;return}
  if(l){const dx=x-l.x,dz=z-l.z,len=Math.hypot(dx,dz);if(len>.04&&len<4){const px=-dz/len*.09,pz=dx/len*.09,s=this.n%this.max,o=s*18,P=this.p,y=.025;
   P.set([l.x+px,y,l.z+pz,l.x-px,y,l.z-pz,x+px,y,z+pz,l.x-px,y,l.z-pz,x-px,y,z-pz,x+px,y,z+pz],o);this.n++;
   this.a.updateRange.offset=o;this.a.updateRange.count=18;this.a.needsUpdate=true;this.m.geometry.setDrawRange(0,Math.min(this.n,this.max)*6)}}
  this.last[i]={x,z}}
 clear(){this.n=0;this.last=[null,null,null,null];this.m.geometry.setDrawRange(0,0)}
}
// ---- tyre smoke: pooled sprites
class Smoke{
 constructor(scene){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);
  const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;this.pool=[];this.i=0;
  for(let k=0;k<48;k++){const m=new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,opacity:0,color:0xd8d8d8}),s=new T.Sprite(m);s.visible=false;s.life=9;s.max=1;scene.add(s);this.pool.push(s)}}
 emit(x,z,vx,vz,amt){const s=this.pool[this.i++%this.pool.length];s.visible=true;s.life=0;s.max=.9+Math.random()*.6;s.position.set(x+(Math.random()-.5)*.3,.15,z+(Math.random()-.5)*.3);s.vx=vx*.3+(Math.random()-.5)*.8;s.vz=vz*.3+(Math.random()-.5)*.8;s.amt=amt;s.scale.set(.8,.8,.8)}
 update(dt){for(const s of this.pool){if(!s.visible)continue;s.life+=dt;if(s.life>=s.max){s.visible=false;continue}const k=s.life/s.max;s.position.x+=s.vx*dt;s.position.z+=s.vz*dt;s.position.y+=dt*.9;const sc=.8+k*3.2;s.scale.set(sc,sc,sc);s.material.opacity=s.amt*(1-k)*(1-k)}}
}
// ---- damage: push body/glass vertices inwards around the contact point
function dent(c,veh,px,pz,f){if(!c.geo)return;const sn=Math.sin(veh.h),cs=Math.cos(veh.h),dx=px-veh.x,dz=pz-veh.z,lx=dx*cs-dz*sn,lz=dx*sn+dz*cs,ly=.65,R=.9+Math.min(f,14)*.06,amt=Math.min(.2,f*.012);
 for(const[geo,orig]of[[c.geo,c.orig],[c.ggeo,c.gorig]]){const P=geo.attributes.position,N=geo.attributes.normal;if(!N)continue;
  for(let v=0;v<P.count;v++){const x=P.getX(v),y=P.getY(v),z=P.getZ(v),d=Math.hypot(x-lx,(y-ly)*.8,z-lz);if(d>=R)continue;const k=1-d/R,h=Math.sin(v*12.9898)*43758.5453,n=(h-Math.floor(h))*.6+.7,m=amt*k*k*n;
   let nx=P.getX(v)+(-N.getX(v))*m,ny=y+(-N.getY(v))*m*.6,nz=z+(-N.getZ(v))*m;const o=v*3,ox=orig[o],oy=orig[o+1],oz=orig[o+2];
   if(Math.hypot(nx-ox,ny-oy,nz-oz)<.32)P.setXYZ(v,nx,ny,nz)}
  P.needsUpdate=true;if(geo===c.geo)geo.computeVertexNormals()}
 c.hurt=Math.min(100,(c.hurt||0)+f*.9);if(c.hurt>16&&c.crack&&!c.crack.visible)c.crack.visible=true;if(c.crack)c.crack.material.opacity=Math.min(.9,.25+c.hurt/120)}
S.Skids=Skids;S.Smoke=Smoke;S.dent=dent;})(window.SS);
