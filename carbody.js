(function(S){'use strict';
const lerp=(a,b,t)=>a+(b-a)*t;
function pchip(p){const n=p.length,h=[],d=[],m=[];for(let i=0;i<n-1;i++){h[i]=p[i+1][0]-p[i][0];d[i]=(p[i+1][1]-p[i][1])/h[i]}m[0]=d[0];m[n-1]=d[n-2];
 for(let i=1;i<n-1;i++)m[i]=d[i-1]*d[i]<=0?0:3*(h[i-1]+h[i])/((2*h[i]+h[i-1])/d[i-1]+(h[i]+2*h[i-1])/d[i]);
 return x=>{if(x<=p[0][0])return p[0][1];if(x>=p[n-1][0])return p[n-1][1];let i=0;while(x>p[i+1][0])i++;const t=(x-p[i][0])/h[i],t2=t*t,t3=t2*t;return(2*t3-3*t2+1)*p[i][1]+(t3-2*t2+t)*h[i]*m[i]+(-2*t3+3*t2)*p[i+1][1]+(t3-t2)*h[i]*m[i+1]}}
function chaikin(P){const n=P.length-1,o=[P[0]];for(let i=0;i<n;i++){const a=P[i],b=P[i+1],q=t=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),t:lerp(a.t,b.t,t)});if(i>0)o.push(q(.25));if(i<n-1)o.push(q(.75))}o.push(P[n]);return o}
function carBody(sp){const F={};for(const k of['yB','yBe','yT','wb','wc','dre'])F[k]=pchip(sp[k]);
 const yBf=z=>{let y=F.yB(z);for(const zc of[-sp.wheelZ,sp.wheelZ]){const d=Math.abs(z-zc);if(d<sp.arch)y=Math.max(y,sp.wr+Math.sqrt(sp.arch*sp.arch-d*d))}return y};
 const N=sp.N||120,zs=[];for(let i=0;i<=N;i++)zs.push(sp.zr+(sp.zf-sp.zr)*(.5-.5*Math.cos(Math.PI*i/N)));
 let M=0,lab=null;const pos=[];
 for(const z of zs){const yB=yBf(z),yT=F.yT(z),wb=F.wb(z),wc=F.wc(z),yRE=yT-F.dre(z),yBe=Math.min(F.yBe(z),yRE-.03);
  let P=[[0,yB],[wb*.7,yB],[wb,yB+.07],[wb,yBe],[wc,yRE],[wc*.55,yT-.012],[0,yT]].map((p,i)=>({x:p[0],y:p[1],t:i}));for(let k=0;k<(sp.iter||2);k++)P=chaikin(P);
  const n=P.length,ring=P.slice();for(let i=n-2;i>=1;i--)ring.push({x:-P[i].x,y:P[i].y,t:P[i].t});
  if(!lab){lab=ring.map(r=>r.t);M=ring.length}for(const r of ring)pos.push(r.x,r.y,z)}
 const idx=[],ref=[],vc=pos.length/3;
 for(let k=0;k<N;k++)for(let j=0;j<M;j++){const a=k*M+j,b=k*M+(j+1)%M,c=(k+1)*M+j,d=(k+1)*M+(j+1)%M;idx.push(a,c,b,b,c,d)}
 const cap=(k,sg)=>{let cy=0;for(let j=0;j<M;j++)cy+=pos[(k*M+j)*3+1];cy/=M;const base=pos.length/3,z=pos[k*M*3+2];pos.push(0,cy,z);
  for(let j=0;j<M;j++){const o=(k*M+j)*3;pos.push(pos[o],pos[o+1],pos[o+2])}
  for(let j=0;j<M;j++)idx.push(base,base+1+j,base+1+(j+1)%M)};
 const sideTris=idx.length;cap(0,-1);cap(N,1);
 // orient every triangle outward
 const nz=(i0,i1,i2)=>{const ax=pos[i1*3]-pos[i0*3],ay=pos[i1*3+1]-pos[i0*3+1],az=pos[i1*3+2]-pos[i0*3+2],bx=pos[i2*3]-pos[i0*3],by=pos[i2*3+1]-pos[i0*3+1],bz=pos[i2*3+2]-pos[i0*3+2];return[ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx]};
 for(let t=0;t<idx.length;t+=3){const n=nz(idx[t],idx[t+1],idx[t+2]);let o;
  if(t<sideTris){const g=[0,1,2].map(q=>idx[t+q]);const cx=(pos[g[0]*3]+pos[g[1]*3]+pos[g[2]*3])/3,cyv=(pos[g[0]*3+1]+pos[g[1]*3+1]+pos[g[2]*3+1])/3,k=Math.floor(g[0]/M);let yc=0;for(let j=0;j<M;j++)yc+=pos[(k*M+j)*3+1];yc/=M;o=[cx,cyv-yc,0]}
  else o=[0,0,t<sideTris+M*3?-1:1];
  if(n[0]*o[0]+n[1]*o[1]+n[2]*o[2]<0){const s=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=s}}
 // smooth normals (shared ring vertices) ; caps stay flat because their vertices are separate
 const nrm=new Float32Array(pos.length);for(let t=0;t<idx.length;t+=3){const n=nz(idx[t],idx[t+1],idx[t+2]);for(let q=0;q<3;q++){const v=idx[t+q]*3;nrm[v]+=n[0];nrm[v+1]+=n[1];nrm[v+2]+=n[2]}}
 for(let v=0;v<nrm.length;v+=3){const l=Math.hypot(nrm[v],nrm[v+1],nrm[v+2])||1;nrm[v]/=l;nrm[v+1]/=l;nrm[v+2]/=l}
 const vlab=new Float32Array(pos.length/3);for(let v=0;v<vc;v++)vlab[v]=lab[v%M];for(const base of[vc,vc+M+1]){vlab[base]=3;for(let j=0;j<M;j++)vlab[base+1+j]=lab[j]}
 // glass: subset of side faces, pushed 5 mm outwards
 const gp=[],gi=[],gmap=new Map(),gv=v=>{if(!gmap.has(v)){gmap.set(v,gp.length/3);gp.push(pos[v*3]+nrm[v*3]*.005,pos[v*3+1]+nrm[v*3+1]*.005,pos[v*3+2]+nrm[v*3+2]*.005)}return gmap.get(v)};
 for(const g of sp.glass||[]){for(let k=0;k<N;k++){if(zs[k]<g.z[0]||zs[k+1]>g.z[1]||zs[k]>g.z[1]||zs[k+1]<g.z[0])continue;
   for(let j=0;j<M-1;j++){if(lab[j]<g.lab[0]||lab[j+1]>g.lab[1]&&lab[j+1]>lab[j]||lab[j]>g.lab[1]||lab[j+1]<g.lab[0])continue;
    const t0=(k*M+j)*6;let ok=true;for(let q=0;q<6&&ok;q++){const v=idx[t0+q]*3,z=pos[v+2],y=pos[v+1];if(g.zmax&&z>g.zmax(y)||g.zmin&&z<g.zmin(y))ok=false}if(ok)gi.push(gv(idx[t0]),gv(idx[t0+1]),gv(idx[t0+2]),gv(idx[t0+3]),gv(idx[t0+4]),gv(idx[t0+5]))}}}
 // rear-face glass for vans (polygon cut from the end cap)
 if(sp.rearGlass){const r=sp.rearGlass,k=0,sel=[];for(let j=0;j<M;j++){const o=(k*M+j)*3;if(pos[o+1]>=r.y0)sel.push(j)}
  if(sel.length>2){let cx=0,cy=0;for(const j of sel){cx+=pos[(k*M+j)*3];cy+=pos[(k*M+j)*3+1]}cx/=sel.length;cy/=sel.length;const z=zs[0]-.005,c0=gp.length/3;gp.push(cx,cy,z);
   for(const j of sel){const o=(k*M+j)*3;gp.push(cx+(pos[o]-cx)*(1-r.inset),cy+(pos[o+1]-cy)*(1-r.inset),z)}
   for(let q=0;q<sel.length-1;q++){const A=c0,Bv=c0+1+q,Cv=c0+2+q,cz=(gp[Bv*3]-gp[A*3])*(gp[Cv*3+1]-gp[A*3+1])-(gp[Bv*3+1]-gp[A*3+1])*(gp[Cv*3]-gp[A*3]);if(cz>0)gi.push(A,Cv,Bv);else gi.push(A,Bv,Cv)}}}
 return{pos:new Float32Array(pos),nrm,idx:new Uint32Array(idx),vlab,M,N,zs,glass:{pos:new Float32Array(gp),idx:new Uint32Array(gi)},F}}
S.carBody=carBody;})(window.SS=window.SS||{});
