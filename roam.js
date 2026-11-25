(function(S){'use strict';
// Taxi city: an open night city with traffic, passengers and fares.
const T=window.THREE;if(!T)return;
const {CARS,Vehicle,wrap,clamp:cl}=S,$=id=>document.getElementById(id);
const NB=11,PITCH=120,BLV=6,HWN=8,HWB=15,HALF=NB*PITCH/2;
const sc=i=>(i-NB/2)*PITCH;
const hwEW=j=>j===BLV?HWB:HWN;
const col=h=>new T.Color(h).convertSRGBToLinear();
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
function mul32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const RANKS=['سواق مبتدئ','سواق معتمد','سواق شاطر','أسطى الشارع','معلم التاكسي','سيد الأسفلت','أسطورة صلاح سالم'];
const XPN=l=>Math.round(90*l*(1+l*.25));
const VIPS=['الكابتن هشام','الست هانم','الدكتور شكري','النجمة رانيا','الأستاذ بهجت'];
const PAINTS=[[0x9da1a6,'فضي'],[0xb22222,'أحمر'],[0x244a6a,'كحلي'],[0x1f6a3a,'أخضر'],[0xe0a020,'دهبي'],[0x23242a,'أسود']];
const ACH=[{id:'r10',t:'أول 10 مشاوير',rw:100,f:d=>d.rides>=10},{id:'r50',t:'50 مشوار في المدينة',rw:250,f:d=>d.rides>=50},{id:'km100',t:'ماشي 100 كيلو في المدينة',rw:200,f:d=>(d.km||0)>=100},{id:'rich',t:'أرباح 5000 جنيه',rw:300,f:d=>d.earned>=5000},{id:'star',t:'تقييم 4.8 بعد 20 مشوار',rw:300,f:d=>d.rateN>=20&&d.rate>=4.8},{id:'lvl10',t:'وصل مستوى 10',rw:500,f:d=>d.lvl>=10},{id:'story',t:'خلّص كل الفصول',rw:500,f:d=>d.ch>=CH.length},{id:'fullup',t:'كل الترقيات ماكس',rw:400,f:d=>d.up&&d.up.e>=3&&d.up.t>=3&&d.up.k>=3}];
function dayList(ds){const rn=mul32([...ds].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7));const pool=[['rides',3+Math.floor(rn()*3),150,n=>'خلّص '+n+' مشاوير'],['earn',250+Math.floor(rn()*4)*100,200,n=>'اكسب '+n+' جنيه من المشاوير'],['clean',2+Math.floor(rn()*2),180,n=>n+' مشاوير من غير ولا خبطة'],['stars5',2,160,n=>'خد 5 نجوم في '+n+' مشوار'],['deliv',2,170,n=>'وصّل '+n+' طلبات'],['vip',1,240,n=>'وصّل راكب VIP']];const idx=[];while(idx.length<3){const q=Math.floor(rn()*pool.length);if(idx.indexOf(q)<0)idx.push(q)}return idx.map(q=>({k:pool[q][0],n:pool[q][1],rw:pool[q][2],t:pool[q][3](pool[q][1]),p:0}))}
const NAMES=['أستاذ سامي','مدام نادية','الحاج محمود','دكتورة منى','كابتن هاني','عم صلاح','سلمى','يوسف','طنط عفاف','مهندس كريم','شيماء','أبو عمر','ريم','ماجد','الأسطى بدر'];
const L_BOARD=['يلا يا اسطى، مستعجل شوية','السلام عليكم، على الوجهة اللي هتظهر','الله يسهّل طريقك، يلا بينا','اتأخرت عليهم، دوس شوية'];
const L_FAST=['هو في حد بيجري وراك؟','براحة يا اسطى، دي مش حلبة','يا نهار! خفف شوية'];
const L_HIT=['حرام عليك يا اسطى!','العربية دي مش بتاعتك!','اتحمّل مسؤولية يا كابتن'];
const L_SLOW=['ما تدوس شوية يا اسطى','هنوصل بكرة كده؟','الوقت بيجري'];
const L_ARR=['تسلم ايدك، ده حسابك','شكرًا يا كابتن، وصلنا بالسلامة','برافو عليك، خد الباقي'];
const L_LATE=['اتأخرنا كتير، مش هدفع كل الأجرة','كان ممكن نوصل أسرع'];
const KIND={fare:['مشوار','نوصّل الراكب'],rush:['مستعجل!','زبون مستعجل: الوقت ضيق والأجرة أكتر'],gentle:['راكب حساس','من غير خبطات خالص والأجرة أكتر'],tour:['جولة سياحية','مرّ على المعالم بالترتيب ثم وصّل'],delivery:['توصيل طلب','وصّل الطلب سخن وبسرعة'],rescue:['عطلان','راكب عربيته بايظة: وصّله والأجرة كويسة'],vip:['زبون VIP','راكب مهم: أجرة كبيرة والوقت ضيق'],airport:['مشوار مطار','وصّل الراكب لصالة السفر: مشوار طويل وأجرة كبيرة']};

const CH=[
{t:'أول وردية',k:'fare',n:2,rw:150,txt:'الأسطى بدر صاحب الجراج بيتصل: "أهلاً يا صلاح! العربية جاهزة. خد أول راكبين وورّيني بتسوق ازاي."',done:'الأسطى بدر: "عاش! الوردية الأولى عدّت زي الفل."'},
{t:'الزبون المستعجل',k:'rush',n:1,rw:200,txt:'بدر: "في ناس بيحجزوا مستعجل، والأجرة عليهم أكتر. وصّل واحد منهم قبل ما الوقت يخلص."',done:'بدر: "سريع زي الصاروخ. الزباين بقت تسأل عليك."'},
{t:'الراكب الحساس',k:'gentle',n:1,rw:250,car:'fiat',txt:'بدر: "الحاجة نادية بتركب معانا النهارده وبتخاف. أي خبطة وهتنزل. سوق براحة ومن غير ولا خبطة."',done:'بدر: "حاجة نادية دعيتلك! وهدية مني: فيات 128 تبقى بتاعتك."'},
{t:'جولة القاهرة',k:'tour',n:1,rw:300,car:'taxi',txt:'بدر: "سياح عايزين يشوفوا القاهرة بالليل: البرج والجامع وبعدها وصّلهم. المعالم بالترتيب يا صلاح."',done:'بدر: "السياح مبسوطين! والتاكسي الأصلي بقى ليك."'},
{t:'طلبات الليل',k:'delivery',n:3,rw:400,car:'micro',txt:'بدر: "المطاعم زحمة والدليفري واقف. وصّل 3 طلبات لسه سخنة وليك الميكروباص."',done:'بدر: "3 طلبات في الميعاد! الميكروباص هديتك."'},
{t:'أسطورة صلاح سالم',k:'any',n:8,rw:1000,car:'empow',txt:'بدر: "الناس كلها بتتكلم عنك في الشارع. خلّص 8 مشاوير نضيفة من أي نوع وتبقى أسطورة صلاح سالم."',done:'بدر: "أسطورة صلاح سالم! الاسم ده بقى ليك. وإمباو بتاعتك."'}];
const ROADS={};
function ctex(w,h,fn,rx,ry){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;t.wrapS=t.wrapT=T.RepeatWrapping;if(rx)t.repeat.set(rx,ry||1);return t}
function roadTex(boul){const k=boul?1:0;if(ROADS[k])return ROADS[k];
  const W=256,H=boul?240:128;return ROADS[k]=ctex(W,H,(c,w,h)=>{c.fillStyle='#2a2b2f';c.fillRect(0,0,w,h);for(let i=0;i<2200;i++){c.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+',.06)';c.fillRect(Math.random()*w,Math.random()*h,2,2)}
    c.fillStyle='#d8d8d0';c.fillRect(0,3,w,3);c.fillRect(0,h-6,w,3);
    if(boul){c.fillStyle='#e0b020';c.fillRect(0,h/2-4,w,2);c.fillRect(0,h/2+2,w,2);for(const f of[.26,.76]){c.fillStyle='#d8d8d0';c.fillRect(0,h*f-1,w/2,2)}for(const f of[.13,.87]){c.fillStyle='#d8d8d0';c.fillRect(0,h*f-1,w/2,2)}}
    else{c.fillStyle='#d8d8d0';c.fillRect(0,h/2-1,w/2,3)}})}
function winTex(){const rn=mul32(11);const e=document.createElement('canvas');e.width=e.height=256;const y=e.getContext('2d');y.fillStyle='#000';y.fillRect(0,0,256,256);
  const t=ctex(256,256,(x,w,h)=>{x.fillStyle='#8f8a82';x.fillRect(0,0,w,h);for(let i=0;i<1800;i++){x.fillStyle='rgba('+(rn()<.5?'0,0,0':'255,255,255')+',.05)';x.fillRect(rn()*w,rn()*h,2,2)}
    const lit=['#ffd98a','#ffe9b8','#ffc46b','#bfe0ff','#ffd98a'];for(let r=0;r<4;r++)for(let q=0;q<4;q++){const px=22+q*58,py=22+r*58;x.fillStyle='#1b222c';x.fillRect(px,py,34,36);x.fillStyle='#46525f';x.fillRect(px,py,34,4);x.fillRect(px+16,py,2,36);
      if(rn()<.45){y.fillStyle=lit[Math.floor(rn()*lit.length)];y.fillRect(px+1,py+4,32,32)}}});
  const em=new T.CanvasTexture(e);em.encoding=T.sRGBEncoding;em.wrapS=em.wrapT=T.RepeatWrapping;em.anisotropy=4;return{map:t,em}}
function glowTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,'rgba(255,190,110,.9)');g.addColorStop(.4,'rgba(255,160,70,.3)');g.addColorStop(1,'rgba(255,140,60,0)');x.fillStyle=g;x.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function zebraTex(){return ctex(64,64,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='rgba(235,235,225,.85)';for(let i=0;i<4;i++)c.fillRect(i*16+2,0,9,h)})}
class Geo{constructor(){this.p=[];this.n=[];this.u=[];this.c=[];this.i=[]}
  quad(a,b,c,d,n,uv,tint){const k=this.p.length/3;for(const v of[a,b,c,d])this.p.push(v[0],v[1],v[2]);for(let q=0;q<4;q++){this.n.push(n[0],n[1],n[2]);this.c.push(tint[0],tint[1],tint[2])}
    for(const v of uv)this.u.push(v[0],v[1]);
    const e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],cx=e1[1]*e2[2]-e1[2]*e2[1],cy=e1[2]*e2[0]-e1[0]*e2[2],cz=e1[0]*e2[1]-e1[1]*e2[0];
    if(cx*n[0]+cy*n[1]+cz*n[2]>=0)this.i.push(k,k+1,k+2,k,k+2,k+3);else this.i.push(k,k+2,k+1,k,k+3,k+2)}
  box(x0,z0,x1,z1,y0,y1,tint){const h=y1-y0,uw=(x1-x0)/12,ud=(z1-z0)/12,vh=h/14,v0=y0/14;
    this.quad([x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[0,0,-1],[[0,v0],[uw,v0],[uw,v0+vh],[0,v0+vh]],tint);
    this.quad([x1,y0,z1],[x0,y0,z1],[x0,y1,z1],[x1,y1,z1],[0,0,1],[[0,v0],[uw,v0],[uw,v0+vh],[0,v0+vh]],tint);
    this.quad([x0,y0,z1],[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[-1,0,0],[[0,v0],[ud,v0],[ud,v0+vh],[0,v0+vh]],tint);
    this.quad([x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0],[1,0,0],[[0,v0],[ud,v0],[ud,v0+vh],[0,v0+vh]],tint);
    const rt=[tint[0]*.7,tint[1]*.7,tint[2]*.7],q=[[.02,.02],[.02,.02],[.02,.02],[.02,.02]];
    this.quad([x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1],[0,1,0],q,rt)}
  mesh(mat){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(this.p,3));g.setAttribute('normal',new T.Float32BufferAttribute(this.n,3));g.setAttribute('uv',new T.Float32BufferAttribute(this.u,2));g.setAttribute('color',new T.Float32BufferAttribute(this.c,3));g.setIndex(this.i);return new T.Mesh(g,mat)}}
const LS='ss3d_roam';
function loadD(){let d=null;try{d=JSON.parse(localStorage.getItem(LS)||'null')}catch(e){}if(!d||typeof d!=='object')d={};return Object.assign({xp:0,lvl:1,rides:0,earned:0,best:0,crashes:0,km:0,ch:0,cp:0,seen:-1,rateS:0,rateN:0,rate:0},d)}
class Roam{
 constructor(g){this.g=g;this.on=false;this.built=false;this.ag=[];this.job=null;this.d=loadD();this.dlg=false;S.paints=this.d.paint||(this.d.paint={});this.inc=[];this.keys0=null;this.tl=null;this.tlT=0;this.tlCd=0;this.tlAt=null;this.peds=null;this.initMenu();this.initHud();
  addEventListener('keydown',e=>{if(!this.on||(e.target&&e.target.tagName==='INPUT'))return;if(e.code==='KeyT')this.unstick();else if(e.code==='KeyR')this.repair();else if(e.code==='KeyJ')this.skip();else if(e.code==='KeyC')this.g.view=this.g.view?0:1})}
 save(){try{localStorage.setItem(LS,JSON.stringify(this.d))}catch(e){}}
 rank(){return RANKS[Math.min(RANKS.length-1,Math.floor((this.d.lvl-1)/2))]}
 initMenu(){const m=document.querySelector('.modes-card');if(!m||$('roamCard'))return;const c=document.createElement('div');c.className='card';c.id='roamCard';
  c.innerHTML='<h2>مدينة التاكسي</h2><p class="foot" id="rmInfo" style="margin:0 0 10px"></p><button class="btn primary" id="rmGo">ابدأ الشغل في المدينة</button>';m.parentNode.insertBefore(c,m);
  $('rmGo').onclick=()=>{this.g.audio.init();this.start()};this.menuUi()}
 menuUi(){const e=$('rmInfo');if(!e)return;const d=this.d;e.textContent='ليل القاهرة المفتوح: خد ركّاب ووصّلهم، واكسب فلوس وخبرة. '+this.rank()+' - مستوى '+d.lvl+' | مشاوير: '+d.rides+' | أرباح: '+d.earned+' جنيه'+(d.rateN?' | تقييمك: ★'+d.rate:'')+(d.ch<CH.length?' | الفصل '+(d.ch+1)+': '+CH[d.ch].t:' | خلّصت كل الفصول')+(d.day&&d.day.list?' | مهام النهاردة: '+d.day.list.filter(m=>m.p>=m.n).length+'/'+d.day.list.length:'')}
 initHud(){if($('rhud'))return;const st=document.createElement('style');st.textContent=
  '#rhud{position:fixed;inset:0;z-index:2;pointer-events:none;direction:rtl}#rhud .rtop{position:absolute;top:calc(var(--sat) + 10px);left:calc(var(--sal) + 12px);right:calc(var(--sar) + 64px);display:flex;gap:6px;flex-wrap:wrap}'+
  '#rhud .rp{padding:5px 12px;border-radius:14px;display:flex;flex-direction:column;min-width:64px}#rhud .rp b{font-size:17px;line-height:1.15}#rhud .rp.row{flex-direction:row;align-items:center;gap:8px}'+
  '#rhud .rxp{display:block;height:4px;border-radius:2px;background:var(--s2);margin-top:3px;overflow:hidden;min-width:70px}#rhud .rxp u{display:block;height:100%;background:var(--gold);width:0}'+
  '#rhud .rjob{position:absolute;top:calc(var(--sat) + 70px);left:50%;transform:translateX(-50%);max-width:92vw;padding:8px 16px;border-radius:16px;text-align:center;display:flex;align-items:center;gap:12px}'+
  '#rhud .rjob b{font-size:15px;color:var(--gold)}#rhud .rjob small{display:block}#rhud .rarr{width:34px;height:34px;flex:none}#rhud .rarr svg{width:34px;height:34px;fill:var(--gold);stroke:none;transition:transform .08s}'+
  '#rhud .rbtn{position:absolute;right:calc(var(--sar) + 12px);top:calc(var(--sat) + 10px);display:grid;grid-template-columns:40px;gap:6px;pointer-events:auto}#rhud .rbtn button{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:11px;font-weight:700;color:var(--tx)}#rhud .rbtn .on{color:var(--gold)}'+
  '#rmap{position:absolute;left:calc(var(--sal) + 12px);top:calc(var(--sat) + 140px);width:128px;height:128px;border-radius:50%;padding:0;overflow:hidden}'+
  '#rhud .rspd{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--sab) + 12px);padding:6px 18px;border-radius:16px;text-align:center}.touch #rhud .rspd{bottom:auto;top:calc(var(--sat) + 270px);left:calc(var(--sal) + 12px);transform:none;padding:4px 12px}'+
  '#rhud .rspd b{font-size:28px}#rhud .rtools{position:absolute;right:calc(var(--sar) + 12px);bottom:calc(var(--sab) + 120px);display:flex;flex-direction:column;gap:6px;pointer-events:auto}#rhud .rtools button{padding:8px 12px;border-radius:12px;font-size:12px;font-weight:700;color:var(--tx);min-width:72px}'+
  '#rrec{position:absolute;left:50%;top:32%;transform:translate(-50%,-50%);min-width:240px;max-width:90vw;padding:14px 20px;border-radius:20px;text-align:center;opacity:0;transition:opacity .25s}#rrec.sh{opacity:1}#rrec h4{font-size:20px;color:var(--gold);margin-bottom:6px}#rrec div{font-size:14px;display:flex;justify-content:space-between;gap:20px}#rrec div.t{font-weight:800;font-size:18px;margin-top:4px;border-top:1px solid var(--hair);padding-top:4px}'+
  '#rboard{position:absolute;left:50%;bottom:34%;transform:translateX(-50%);width:min(300px,86vw);pointer-events:none;text-align:center;padding:6px 12px;border-radius:12px;font-size:13px}@media(max-width:430px){#rmap{width:100px;height:100px;top:calc(var(--sat) + 128px)}.touch #rhud .rspd{top:calc(var(--sat) + 236px)}}';
  document.head.appendChild(st);
  const h=document.createElement('div');h.id='rhud';h.hidden=true;
  h.innerHTML='<div class="rtop"><div class="rp glass row"><b id="rCoins">0</b><small>جنيه</small></div><div class="rp glass"><small id="rRank"></small><b id="rLvl"></b><i class="rxp"><u id="rXp"></u></i></div><div class="rp glass"><small>عداد الحادثة</small><b id="rDmg">0%</b></div><div class="rp glass"><small>بنزين</small><b id="rFuel">100%</b></div></div>'+
  '<div class="rjob glass"><span class="rarr"><svg viewBox="0 0 24 24" id="rArr"><path d="M12 2l8 18-8-5-8 5z"/></svg></span><div><small id="rJobS"></small><b id="rJobT">دوّر على راكب...</b><small id="rJobD"></small></div></div>'+
  '<canvas id="rmap" width="128" height="128" class="glass"></canvas>'+
  '<div class="rbtn"><button class="glass" id="rbP" aria-label="إيقاف">||</button><button class="glass" id="rbM" aria-label="الصوت">&#9835;</button><button class="glass on" id="rbL" aria-label="الأنوار">&#9788;</button></div>'+
  '<div class="rtools"><button class="glass" id="rbW">راديو</button><button class="glass" id="rbH">بوري</button><button class="glass" id="rbU">إعادة للطريق</button><button class="glass" id="rbR" hidden>ورشة</button><button class="glass" id="rbA">مهام</button><button class="glass" id="rbS">تخطي المشوار</button></div>'+
  '<div class="rspd glass"><b id="rSpd">0</b> <small>كم/س</small></div><div id="rrec" class="glass"></div>';
  document.body.appendChild(h);const g=this.g;
  const dl=document.createElement('section');dl.id='rdlg';dl.className='sheet';dl.hidden=true;dl.innerHTML='<div class="card"><h3 id="rdT"></h3><p id="rdX" style="text-align:center;line-height:1.7"></p><button class="btn primary" id="rdB">تمام</button></div>';document.body.appendChild(dl);
  $('rdB').onclick=()=>{dl.hidden=true;this.dlg=false;if(this.dq&&this.dq.length){const n=this.dq.shift();this.showDlg(n[0],n[1])}};
 const sh=document.createElement('section');sh.id='rshop';sh.className='sheet';sh.hidden=true;sh.innerHTML='<div class="card"><h3>الورشة</h3><div id="rshRows"></div><button class="btn" id="rshX">قفل</button></div>';document.body.appendChild(sh);$('rshX').onclick=()=>{sh.hidden=true;this.dlg=false};
 const ms=document.createElement('section');ms.id='rmis';ms.className='sheet';ms.hidden=true;ms.innerHTML='<div class="card"><h3>مهام وإنجازات</h3><div id="rmiRows"></div><button class="btn" id="rmiX">قفل</button></div>';document.body.appendChild(ms);$('rmiX').onclick=()=>{ms.hidden=true;this.dlg=false};
  $('rbP').onclick=()=>g.pause();$('rbM').onclick=()=>g.toggleM();$('rbW').onclick=()=>{g.audio.init();const s=((this.radioS||0)+1)%3;this.radioS=s;g.audio.music(s);g.popup(s===1?'راديو: شرقي':s===2?'راديو: فيرنا FM':'الراديو اتقفل')};$('rbL').onclick=()=>{g.hl=!g.hl;$('rbL').classList.toggle('on',g.hl)};$('rbH').onclick=()=>g.audio.horn();$('rbU').onclick=()=>this.unstick();$('rbR').onclick=()=>this.repair();$('rbA').onclick=()=>this.openMis();$('rbS').onclick=()=>this.skip()}
 // ---------- city ----------
 build(){const g=this.g,w=g.world,sc3=this.scene=new T.Scene();this.low=!!g.opt.low;const rn=mul32(2024);
  sc3.background=new T.Color(0x070b16);sc3.fog=new T.FogExp2(col(0x070b16),.0034);
  this.hemi=new T.HemisphereLight(col(0x6f86c0),col(0x1a1c24),1.05);sc3.add(this.hemi);
  this.moon=new T.DirectionalLight(col(0x9fb4e8),.9);this.moon.castShadow=!this.low;{const s=this.moon.shadow;s.mapSize.set(this.low?512:1024,this.low?512:1024);Object.assign(s.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:400});s.camera.updateProjectionMatrix();s.bias=-.0005;s.normalBias=.05}sc3.add(this.moon,this.moon.target);
  const gnd=new T.Mesh(new T.PlaneGeometry(9000,9000),new T.MeshStandardMaterial({color:col(0x2b2a27),roughness:1}));gnd.rotation.x=-Math.PI/2;gnd.position.y=-.03;gnd.receiveShadow=true;sc3.add(gnd);
  const wt=new T.Mesh(new T.PlaneGeometry(5000,9000),new T.MeshStandardMaterial({color:col(0x0d2a44),roughness:.15,metalness:.4,emissive:col(0x08203a),emissiveIntensity:.6}));wt.rotation.x=-Math.PI/2;wt.position.set(sc(NB)+HWN+12+2500,-.01,0);sc3.add(wt);
  // streets
  const mkSt=(len,wd,boul,ew)=>{const t=roadTex(boul).clone();t.needsUpdate=true;t.repeat.set(len/16,1);const m=new T.Mesh(new T.PlaneGeometry(len,wd),new T.MeshStandardMaterial({map:t,roughness:.82,metalness:.05,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));m.rotation.order='YXZ';m.rotation.x=-Math.PI/2;m.rotation.y=ew?0:Math.PI/2;m.receiveShadow=true;return m};
  const LEN=NB*PITCH+2*HWN;
  for(let k=0;k<=NB;k++){const e=mkSt(LEN,2*hwEW(k),k===BLV,true);e.position.set(0,.02,sc(k));sc3.add(e);const n=mkSt(LEN,2*HWN,false,false);n.position.set(sc(k),.02,0);sc3.add(n)}
  // intersections and crosswalks
  const o=new T.Object3D(),ni=(NB+1)*(NB+1),imat=new T.MeshStandardMaterial({color:col(0x2a2b2f),roughness:.85,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),
   ip=new T.InstancedMesh(new T.PlaneGeometry(1,1),imat,ni),zt=zebraTex(),zm=new T.MeshBasicMaterial({map:zt,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,opacity:.95}),
   zx=new T.InstancedMesh(new T.PlaneGeometry(1,1),zm,ni*4);let q=0,zq=0;
  for(let i=0;i<=NB;i++)for(let j=0;j<=NB;j++){const hz=hwEW(j);o.rotation.set(-Math.PI/2,0,0);o.position.set(sc(i),.022,sc(j));o.scale.set(2*HWN,2*hz,1);o.updateMatrix();ip.setMatrixAt(q++,o.matrix);
   for(const s of[-1,1]){o.rotation.set(-Math.PI/2,0,0);o.position.set(sc(i)+s*(HWN+2.2),.03,sc(j));o.scale.set(3,2*hz-2,1);o.rotation.z=0;o.updateMatrix();zx.setMatrixAt(zq++,o.matrix);
    o.rotation.set(-Math.PI/2,0,Math.PI/2);o.position.set(sc(i),.03,sc(j)+s*(hz+2.2));o.scale.set(3,2*HWN-2,1);o.updateMatrix();zx.setMatrixAt(zq++,o.matrix)}}
  o.scale.set(1,1,1);o.rotation.set(0,0,0);ip.receiveShadow=true;sc3.add(ip,zx);
  // blocks: sidewalks, buildings
  const wtx=winTex();this.winM=new T.MeshStandardMaterial({map:wtx.map,emissiveMap:wtx.em,emissive:0xffffff,emissiveIntensity:1.25,vertexColors:true,roughness:.85});
  const geo=new Geo(),walk=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:col(0x55565b),roughness:.95}),NB*NB);let wq=0;
  this.bl={};const rects=(i,j)=>this.bl[i*100+j]||(this.bl[i*100+j]=[]);this.lms=[];this.park=[];
  const add=(i,j,x0,z0,x1,z1,h,tint)=>{geo.box(x0,z0,x1,z1,0,h,tint);rects(i,j).push({x0:x0-.2,z0:z0-.2,x1:x1+.2,z1:z1+.2})};
  const extra=new T.Group();
  for(let i=0;i<NB;i++)for(let j=0;j<NB;j++){const x0=sc(i)+HWN,x1=sc(i+1)-HWN,z0=sc(j)+hwEW(j),z1=sc(j+1)-hwEW(j+1);
   o.position.set((x0+x1)/2,.1,(z0+z1)/2);o.scale.set(x1-x0,.2,z1-z0);o.updateMatrix();walk.setMatrixAt(wq++,o.matrix);o.scale.set(1,1,1);
   const ix=i-(NB-1)/2,jz=j-(NB-1)/2,r=Math.hypot(ix,jz-.5),bx0=x0+5,bx1=x1-5,bz0=z0+5,bz1=z1-5,cx=(bx0+bx1)/2,cz=(bz0+bz1)/2;
   const special=(i===5&&j===5)?'tower':(i===3&&j===7)?'mosque':(i===7&&j===7)?'hub':(i===NB-1&&j===5)?'airport':(i===0&&j===0)?'pyramids':(i===NB-1)?'park':(i===2&&j===3||i===8&&j===3)?'plaza':null;
   if(special==='pyramids'){const sd=new T.Mesh(new T.PlaneGeometry(bx1-bx0+8,bz1-bz0+8),new T.MeshStandardMaterial({color:col(0x7d6c48),roughness:1,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));sd.rotation.x=-Math.PI/2;sd.position.set(cx,.25,cz);extra.add(sd);
    for(const q of[[cx-16,cz-8,13,21],[cx+10,cz+10,10,16],[cx+14,cz-16,6.5,10]]){const py=new T.Mesh(new T.ConeGeometry(q[2],q[3],4),new T.MeshStandardMaterial({color:col(0xb59a6a),roughness:.95,emissive:col(0x2a2114),emissiveIntensity:.4}));py.position.set(q[0],q[3]/2+.25,q[1]);py.rotation.y=Math.PI/4;extra.add(py);rects(i,j).push({x0:q[0]-q[2]*.7,z0:q[1]-q[2]*.7,x1:q[0]+q[2]*.7,z1:q[1]+q[2]*.7})}
    this.pyr={x:cx,z:cz};continue}
   if(special==='airport'){this.park.push({x0:bx0,z0:bz0,x1:bx1,z1:bz1});this.airpt={x:cx,z:cz};
    const rw2=new T.Mesh(new T.PlaneGeometry(74,14),new T.MeshStandardMaterial({color:col(0x232428),roughness:.9}));rw2.rotation.x=-Math.PI/2;rw2.position.set(cx,.22,cz+18);extra.add(rw2);
    const tm=new T.Mesh(new T.BoxGeometry(26,8,12),new T.MeshStandardMaterial({color:col(0x8a929c),roughness:.6,emissive:col(0x22303c),emissiveIntensity:.5}));tm.position.set(cx-18,4,cz-14);extra.add(tm);
    const twr=new T.Mesh(new T.CylinderGeometry(1.6,2.2,16,8),new T.MeshStandardMaterial({color:col(0x9aa4ae),roughness:.7,emissive:col(0x18242e),emissiveIntensity:.5}));twr.position.set(cx+14,8,cz-14);extra.add(twr);
    rects(i,j).push({x0:cx-31,z0:cz-20,x1:cx-5,z1:cz-8});rects(i,j).push({x0:cx+12,z0:cz-16,x1:cx+16,z1:cz-12});continue}
   if(special==='tower'){const t=new T.Mesh(new T.CylinderGeometry(4,7,150,20),new T.MeshStandardMaterial({color:col(0xb9b4a8),roughness:.7,emissive:col(0x22232a),emissiveIntensity:.4}));t.position.set(cx,75,cz);const t2=new T.Mesh(new T.CylinderGeometry(11,5,12,20),new T.MeshStandardMaterial({color:col(0xa9a398),emissive:col(0xffd890),emissiveIntensity:.8}));t2.position.set(cx,150,cz);extra.add(t,t2);
    rects(i,j).push({x0:cx-6,z0:cz-6,x1:cx+6,z1:cz+6});this.tower={x:cx,z:cz};continue}
   if(special==='mosque'){add(i,j,cx-20,cz-20,cx+20,cz+20,13,[.8,.78,.7]);const dm=new T.Mesh(new T.SphereGeometry(11,18,10,0,6.283,0,1.57),new T.MeshStandardMaterial({color:col(0x3f8f78),roughness:.5,emissive:col(0x103a30),emissiveIntensity:.6}));dm.position.set(cx,13,cz);extra.add(dm);
    for(const[sx,sz]of[[-22,-22],[22,22]]){add(i,j,cx+sx-2,cz+sz-2,cx+sx+2,cz+sz+2,36,[.85,.82,.75]);const tp=new T.Mesh(new T.ConeGeometry(2.6,7,10),new T.MeshStandardMaterial({color:col(0x3f8f78),emissive:col(0x2fd0a0),emissiveIntensity:1.2}));tp.position.set(cx+sx,39.5,cz+sz);extra.add(tp)}this.mosque={x:cx,z:cz};continue}
   if(special==='hub'){const cn=new T.Mesh(new T.BoxGeometry(46,.8,24),new T.MeshStandardMaterial({color:col(0xf2b705),emissive:col(0xf2b705),emissiveIntensity:.9}));cn.position.set(cx,6,cz);extra.add(cn);
    for(const sx of[-21,21])for(const sz of[-10,10]){const pl=new T.Mesh(new T.BoxGeometry(.6,6,.6),new T.MeshStandardMaterial({color:col(0x444444)}));pl.position.set(cx+sx,3,cz+sz);extra.add(pl)}this.hub={x:cx,z:cz};continue}
   if(special==='park'||special==='plaza'){this.park.push({x0:bx0,z0:bz0,x1:bx1,z1:bz1});continue}
   const core=r<2.4,mid=r<4.4,old=i<=3&&j<=3,lo=core?30:mid?14:7,hi=core?92:mid?42:20,tint=core?[.78,.84,.95]:old?[.95,.85,.7]:mid?[.92,.88,.82]:[.88,.88,.86];
   const nx=core?1+(rn()<.4?1:0):old?2+(rn()<.5?1:0):1+Math.floor(rn()*3),nz=core?1+(rn()<.4?1:0):old?2+(rn()<.5?1:0):1+Math.floor(rn()*3),gw=(bx1-bx0)/nx,gd=(bz1-bz0)/nz;
   for(let a=0;a<nx;a++)for(let b=0;b<nz;b++){if(rn()<.08)continue;const lx0=bx0+a*gw+1.5+rn()*2,lx1=bx0+(a+1)*gw-1.5-rn()*2,lz0=bz0+b*gd+1.5+rn()*2,lz1=bz0+(b+1)*gd-1.5-rn()*2;if(lx1-lx0<8||lz1-lz0<8)continue;
    const hh=Math.round((lo+Math.pow(rn(),1.5)*(hi-lo))/3.5)*3.5,tt=tint.map(v=>v*(.85+rn()*.2));add(i,j,lx0,lz0,lx1,lz1,hh,tt);if(hh>45&&rn()<.7){const ix0=lx0+(lx1-lx0)*.2,ix1=lx1-(lx1-lx0)*.2,iz0=lz0+(lz1-lz0)*.2,iz1=lz1-(lz1-lz0)*.2;geo.box(ix0,iz0,ix1,iz1,hh,hh+14,tt)}}}
  walk.count=wq;walk.receiveShadow=true;sc3.add(walk);const bm=geo.mesh(this.winM);bm.receiveShadow=false;sc3.add(bm);sc3.add(extra);
  // trees in parks and along the boulevard median
  const nt=this.park.length*26+NB*6+NB*4,tr=new T.InstancedMesh(new T.CylinderGeometry(.18,.28,5,6),new T.MeshStandardMaterial({color:col(0x5a4630),roughness:1}),nt),cr=new T.InstancedMesh(new T.ConeGeometry(2.4,5.5,7),new T.MeshStandardMaterial({color:col(0x1f5a2a),roughness:.95}),nt);let tq=0;
  const tree=(x,z,s)=>{o.position.set(x,2.5*s,z);o.scale.set(s,s,s);o.rotation.set(0,rn()*6,0);o.updateMatrix();tr.setMatrixAt(tq,o.matrix);o.position.y=6.8*s;o.updateMatrix();cr.setMatrixAt(tq++,o.matrix)};
  for(const p of this.park)for(let k=0;k<26;k++)tree(p.x0+rn()*(p.x1-p.x0),p.z0+rn()*(p.z1-p.z0),.8+rn()*.6);
  for(let i=0;i<NB;i++)for(let k=0;k<6&&tq<nt;k++)tree(sc(i)+10+k*18,sc(BLV),.9);
  for(let k=0;k<NB*4&&tq<nt;k++)tree(sc(0)-HWN-2.4,sc(0)+10+k*(NB*PITCH-20)/(NB*4),1.15);
  tr.count=cr.count=tq;o.scale.set(1,1,1);o.rotation.set(0,0,0);sc3.add(tr,cr);
  // boulevard median (solid)
  this.med=[];const mm=new T.Mesh(new T.BoxGeometry(LEN,.5,1.6),new T.MeshStandardMaterial({color:col(0x6c6c70),roughness:.9}));mm.position.set(0,.25,sc(BLV));sc3.add(mm);
  for(let i=0;i<NB;i++){this.med.push({x0:sc(i)+HWN+1,x1:sc(i+1)-HWN-1,z0:sc(BLV)-.85,z1:sc(BLV)+.85})}
  // street lamps and light pools
  const lp=[];for(let k=0;k<=NB;k++){const hwz=hwEW(k);for(let s=0;s<NB;s++)for(const f of[20,60,100]){const a=sc(s)+f;for(const sd of[-1,1]){lp.push([a,sc(k)+sd*(hwz-.8)]);lp.push([sc(k)+sd*(HWN-.8),a])}}}
  const pm=new T.InstancedMesh(new T.CylinderGeometry(.1,.14,8.4,6),new T.MeshStandardMaterial({color:col(0x6c7075),metalness:.6,roughness:.5}),lp.length),hm=new T.InstancedMesh(new T.BoxGeometry(.6,.14,.6),new T.MeshBasicMaterial({color:0xffd6a0}),lp.length),
   gmt=new T.MeshBasicMaterial({map:glowTex(),transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false,opacity:.75,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6}),gm=this.glowM=new T.InstancedMesh(new T.PlaneGeometry(1,1),gmt,this.low?1:lp.length);
  gmt.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying float vDist;').replace('#include <project_vertex>','#include <project_vertex>\nvDist=-mvPosition.z;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vDist;').replace('vec4 diffuseColor = vec4( diffuse, opacity );','vec4 diffuseColor = vec4( diffuse, opacity * smoothstep(6.0,16.0,vDist) );')};
  lp.forEach((p,k)=>{o.rotation.set(0,0,0);o.scale.set(1,1,1);o.position.set(p[0],4.2,p[1]);o.updateMatrix();pm.setMatrixAt(k,o.matrix);o.position.y=8.5;o.updateMatrix();hm.setMatrixAt(k,o.matrix);
   if(!this.low){o.rotation.set(-Math.PI/2,0,0);o.scale.set(22,22,1);o.position.set(p[0],.05,p[1]);o.updateMatrix();gm.setMatrixAt(k,o.matrix)}});
  o.rotation.set(0,0,0);o.scale.set(1,1,1);if(this.low)gm.count=0;sc3.add(pm,hm,gm);
  this.mkLights(sc3);this.mkPeds(sc3);
  this.bounds={x0:sc(0)-HWN-14,x1:sc(NB)+HWN-1,z0:sc(0)-HWN-14,z1:sc(NB)+HWN+14};
  {const B=this.bounds,wm=new T.MeshStandardMaterial({color:col(0x3a3d46),emissive:col(0xff7a1a),emissiveIntensity:.22,roughness:.8}),W=(cx,cz,sx,sz)=>{const m=new T.Mesh(new T.BoxGeometry(sx,1.3,sz),wm);m.position.set(cx,.65,cz);sc3.add(m)};
   const w0=B.x1-B.x0+4,d0=B.z1-B.z0+4;W((B.x0+B.x1)/2,B.z0-1,w0,1.2);W((B.x0+B.x1)/2,B.z1+1,w0,1.2);W(B.x0-1,(B.z0+B.z1)/2,1.2,d0);W(B.x1+1,(B.z0+B.z1)/2,1.2,d0)}
  {const wt2=new T.Mesh(new T.PlaneGeometry(80,NB*PITCH+300),new T.MeshStandardMaterial({color:col(0x0d2a44),roughness:.15,metalness:.4,emissive:col(0x0a2438),emissiveIntensity:.7}));wt2.rotation.x=-Math.PI/2;wt2.position.set(this.bounds.x0-52,-.01,0);sc3.add(wt2);this.nile={x:sc(0),z:sc(5)}}
  if(!this.low){const N2=650,pa=new Float32Array(N2*3);for(let q=0;q<N2;q++){pa[q*3]=rnd(-36,36);pa[q*3+1]=rnd(0,34);pa[q*3+2]=rnd(-36,36)}const gg=new T.BufferGeometry();gg.setAttribute('position',new T.BufferAttribute(pa,3));this.rainPts=new T.Points(gg,new T.PointsMaterial({color:0x9fb8dd,size:.16,transparent:true,opacity:.55,depthWrite:false,fog:false}));this.rainPts.visible=false;this.rainPts.frustumCulled=false;sc3.add(this.rainPts)}
  this.rain={on:false,t:50+Math.random()*70};this.mkCops(sc3);
  this.built=true}
 mkCops(sc3){const cs=[];for(const i of[3,8]){const c={x:sc(i)+13,z:sc(BLV)-hwEW(BLV)-2,cd:0};
   const bm2=new T.Mesh(new T.BoxGeometry(7,.55,.35),new T.MeshStandardMaterial({color:col(0xd8d8d0),emissive:col(0xc03028),emissiveIntensity:.7,roughness:.6}));bm2.position.set(c.x,.55,c.z);sc3.add(bm2);
   const bx2=new T.Mesh(new T.BoxGeometry(2.2,2.6,2.2),new T.MeshStandardMaterial({color:col(0x2a3a55),roughness:.8}));bx2.position.set(c.x+4.5,1.3,c.z-1);sc3.add(bx2);
   const bc=new T.Mesh(new T.SphereGeometry(.3,8,6),new T.MeshBasicMaterial({color:0xff4030,fog:false}));bc.position.set(c.x+4.5,3,c.z-1);sc3.add(bc);c.bc=bc;cs.push(c)}
  this.cops=cs}
 // ---------- helpers ----------
 onRoad(x,z){const i=Math.round(x/PITCH+NB/2),j=Math.round(z/PITCH+NB/2);return Math.abs(x-sc(i))<HWN||Math.abs(z-sc(j))<hwEW(j)}
 nearNode(x,z){return{i:cl(Math.round(x/PITCH+NB/2),0,NB),j:cl(Math.round(z/PITCH+NB/2),0,NB)}}
 randPoint(cx,cz,r0,r1){for(let t=0;t<60;t++){let x,z;if(Math.random()<.5){const j=1+Math.floor(Math.random()*(NB-1));z=sc(j);x=rnd(sc(0)+20,sc(NB)-20)}else{const i=1+Math.floor(Math.random()*(NB-1));x=sc(i);z=rnd(sc(0)+20,sc(NB)-20)}
   const d=Math.hypot(x-cx,z-cz);if(d>=r0&&d<=r1){const ew=Math.abs(z-sc(Math.round(z/PITCH+NB/2)))<1,sd=Math.random()<.5?-1:1;return ew?{x,z:z+sd*4,sd,ew}:{x:x+sd*4,z,sd,ew}}}
  return{x:sc(5)+4,z:sc(5),sd:1,ew:false}}
 showDlg(t,x){if(this.dlg){(this.dq=this.dq||[]).push([t,x]);return}this.dlg=true;this.g.keys={};$('rdT').textContent=t;$('rdX').textContent=x;$('rdlg').hidden=false}
 // ---------- session ----------
 start(){const g=this.g;if(!g.world)return;this.fuel=typeof this.d.fuel==='number'?cl(this.d.fuel,0,100):100;this.evT=70+Math.random()*60;this.surge=0;this.fz=0;this.pf=0;this.coarse=matchMedia('(pointer:coarse)').matches;{const w=g.world;this.pm0=w.prMax;w.prMax=Math.min(w.prMax,this.coarse?1.25:1.6);if(w.pr>w.prMax)w.setPR(w.prMax)}if(!g.own[CARS[g.sel].id]){g.popup('العربية مقفولة');return}
  try{if(!this.built)this.build()}catch(e){console.error(e);g.popup('المدينة مش متاحة على الجهاز ده');return}
  this.prevAtm=g.atm;g.atm='night';g.world.atm('night');this.scene.environment=g.world.rt.texture;
  this.low=!!g.opt.low;this.moon.castShadow=!this.low&&!this.coarse;
  this.mkCar(true);this.on=true;g.state='ROAM';g.paused=false;g.keys={};this.job=null;this.jobWait=1.5;this.rep=0;this.boardT=0;this.chat=0;this.incT=30;this.mkDay();this.spawnTraffic();
  document.body.classList.toggle('low',this.low);
  ['menu','over','pause','hud','count'].forEach(i=>{const e=$(i);if(e)e.hidden=true});$('rhud').hidden=false;g.shiftUi();$('touch').hidden=!g.coarse;$('rbL').classList.toggle('on',!!g.hl);g.audio.init();
  this.uiFull();this.dlg=false;const d=this.d;if(d.ch<CH.length&&d.seen!==d.ch){d.seen=d.ch;this.save();this.showDlg('الفصل '+(d.ch+1)+': '+CH[d.ch].t,CH[d.ch].txt)}else this.popupLater('مدينة القاهرة بالليل. دوّر على راكب (الدايرة الخضرا)',200)
  if(!this.d.tlSeen){this.d.tlSeen=1;this.save();this.popupLater('جديد: إشارات مرور شغالة على التقاطعات الكبيرة - الأحمر يعني قف، وعدّيتها عليك غرامة',3000)}}
 popupLater(t,ms){setTimeout(()=>{if(this.on)this.g.popup(t)},ms)}
 stop(){if(!this.on)return;{const w=this.g.world;if(this.pm0)w.prMax=this.pm0}this.d.fuel=this.fuel;this.save();this.on=false;this.dlg=false;$('rdlg').hidden=true;if($('rshop'))$('rshop').hidden=true;if($('rmis'))$('rmis').hidden=true;this.g.audio.music&&this.g.audio.music(0);this.radioS=0;this.dq=[];const g=this.g;$('rhud').hidden=true;if(this.pcar)this.scene.remove(this.pcar.g);this.clearJob();for(const a of this.ag)this.scene.remove(a.car.g);this.ag=[];for(const c of this.inc)this.scene.remove(c.g);this.inc=[];this.scene.environment=null;
  if(this.prevAtm){g.atm=this.prevAtm;g.world.atm(g.atm)}g.setAtm(0);document.body.classList.toggle('low',!!g.opt.low);this.menuUi()}
 mkCar(first){const g=this.g,d=CARS[g.sel],keep=this.pl&&!first?this.pl:null;if(this.pcar)this.scene.remove(this.pcar.g);
  const p=this.pl=new Vehicle(g.tuned(d));p.opt=g.opt;const tu=this.d.up||(this.d.up={e:0,t:0,k:0});if(tu.e)p.d.T*=1+.08*tu.e;if(tu.t)p.d.mu*=1+.04*tu.t;if(keep){p.reset(keep.x,keep.z,keep.h);p.dmg=0}else{const n=this.nearNode(0,sc(BLV)+9);p.reset(sc(5),sc(BLV)+6,Math.PI/2)}
  this.pcar=S.makeCar(d,true);this.scene.add(this.pcar.g);this.pc=0;this.ch=p.h;this.bump=0;this.mf=0;this.ft=16;this.fc=0;this.stuckT=0}
 restart(){const p=this.pl;p.reset(sc(5),sc(BLV)+6,Math.PI/2);this.clearJob();this.jobWait=1;this.g.resume();this.g.popup('رجعنا من الأول')}
 openShop(){const g=this.g,u=this.d.up||(this.d.up={e:0,t:0,k:0}),nm={e:'محرك أقوى',t:'كاوتش أمسك',k:'تنك أكبر'},cs=[150,300,500],rows=$('rshRows');rows.innerHTML='';for(const k of['e','t','k']){const lv=u[k]||0,row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;align-items:center;margin:8px 0;gap:8px';row.innerHTML='<span>'+nm[k]+' '+('★'.repeat(lv)+'☆'.repeat(3-lv))+'</span>'+(lv>=3?'<b>ماكس</b>':'<button class="btn primary" data-k="'+k+'">'+cs[lv]+' ج</button>');rows.appendChild(row)}rows.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k,lv2=(this.d.up[k]||0),c=cs[lv2];if(g.coins<c){g.popup('محتاج '+c+' جنيه');return}g.coins-=c;this.d.up[k]=lv2+1;this.save();g.saveCoins();g.garage();g.audio.coin();this.mkCar(false);g.popup('ركّبت '+nm[k]+'!');this.openShop()});
 const pid2=CARS[g.sel].id,pt=this.d.paint||(this.d.paint={}),cur=pt[pid2],ph=document.createElement('div');ph.style.cssText='margin-top:12px;border-top:1px solid var(--hair);padding-top:8px';ph.innerHTML='<b style="font-size:14px">دهان العربية ('+CARS[g.sel].name+')</b>';rows.appendChild(ph);
 const pr2=document.createElement('div');pr2.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px';
 for(const cc of[null].concat(PAINTS.map(q=>q[0]))){const b=document.createElement('button');b.className='btn';b.style.cssText='width:34px;height:34px;padding:0;border-radius:10px;background:'+(cc==null?'linear-gradient(135deg,#999,#333)':'#'+cc.toString(16).padStart(6,'0'))+';box-shadow:'+((cc==null&&cur==null)||cc===cur?'0 0 0 2px var(--gold)':'none');b.onclick=()=>{if((cc==null&&cur==null)||cc===cur)return;if(cc!=null){if(g.coins<250){g.popup('الدهان بـ 250 جنيه');return}g.coins-=250;g.saveCoins();g.garage();g.audio.coin()}if(cc==null)delete pt[pid2];else pt[pid2]=cc;S.paints=pt;this.save();this.paintCar();g.popup(cc==null?'رجع اللون الأصلي':'اتدهنت العربية!');this.openShop()};pr2.appendChild(b)}
 rows.appendChild(pr2);const pe=document.createElement('div');pe.style.cssText='font-size:12px;opacity:.7;margin-top:4px';pe.textContent='أي لون جديد بـ 250 جنيه، والرجوع للأصلي ببلاش';rows.appendChild(pe);
 $('rshop').hidden=false;this.dlg=true}
 unstick(){const p=this.pl;if(!p)return;const n=this.nearNode(p.x,p.z),horiz=Math.abs(p.z-sc(n.j))<Math.abs(p.x-sc(n.i)),h=horiz?(Math.cos(p.h)>-.2&&Math.sin(p.h)>0?Math.PI/2:-Math.PI/2):(Math.cos(p.h)>0?0:Math.PI);
  const dm=p.dmg;if(horiz){p.reset(p.x,sc(n.j)+(Math.sin(h)>0?4:-4),h)}else{p.reset(sc(n.i)+(Math.cos(h)>0?-4:4),p.z,h)}p.dmg=dm;this.ch=h}
 repair(){const p=this.pl;if(!p||p.dmg<8||p.speed>2.5)return;const atSh2=this.shop&&Math.hypot(p.x-this.shop.x,p.z-this.shop.z)<12,cost=Math.round(p.dmg*(atSh2?1:1.5));if(this.g.coins<cost){this.g.popup('محتاج '+cost+' جنيه للورشة');return}this.g.coins-=cost;this.g.saveCoins();this.g.garage();const dm0=this.job?this.job.dmg0:0;this.mkCar(false);if(this.job)this.job.dmg0=0;this.g.popup('اتصلحت العربية: -'+cost+' جنيه')}
 paintCar(){if(!this.pcar)return;this.scene.remove(this.pcar.g);this.pcar=S.makeCar(CARS[this.g.sel],true);this.scene.add(this.pcar.g)}
 mkDay(){const ds=new Date().toLocaleDateString('en-CA');if(this.d.day&&this.d.day.d===ds&&this.d.day.list)return;this.d.day={d:ds,list:dayList(ds)};this.save()}
 misProg(k,v){const D=this.d.day;if(!D||!D.list)return;for(const m of D.list){if(m.k!==k||m.p>=m.n)continue;m.p=Math.min(m.n,m.p+v);if(m.p>=m.n){this.g.coins+=m.rw;this.g.saveCoins();this.g.garage();this.g.audio.coin();this.g.popup('مهمة النهاردة خلصت: '+m.t+' +'+m.rw+' جنيه')}}this.save()}
 achCheck(){const a=this.d.ach||(this.d.ach={});let ch2=false;for(const c of ACH){if(!a[c.id]&&c.f(this.d)){a[c.id]=1;ch2=true;this.g.coins+=c.rw;this.g.saveCoins();this.g.garage();this.g.audio.unlock();this.g.popup('إنجاز جديد: '+c.t+' +'+c.rw+' جنيه')}}if(ch2)this.save()}
 openMis(){const rows=$('rmiRows');if(!rows)return;this.mkDay();rows.innerHTML='';const hh=t=>{const e=document.createElement('h4');e.textContent=t;e.style.cssText='margin:10px 0 4px;color:var(--gold);font-size:15px';rows.appendChild(e)};
  hh('مهام النهاردة');for(const m of this.d.day.list){const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;gap:12px;margin:5px 0;font-size:14px';r.innerHTML='<span>'+(m.p>=m.n?'✅ ':'▫️ ')+m.t+'</span><b>'+Math.min(m.p,m.n)+'/'+m.n+(m.p>=m.n?'':' · +'+m.rw+' ج')+'</b>';rows.appendChild(r)}
  hh('الإنجازات');const a=this.d.ach||{};for(const c of ACH){const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;gap:12px;margin:5px 0;font-size:14px;opacity:'+(a[c.id]?1:.55);r.innerHTML='<span>'+(a[c.id]?'🏆 ':'🔒 ')+c.t+'</span><b>'+(a[c.id]?'تم':'+'+c.rw+' ج')+'</b>';rows.appendChild(r)}
  $('rmis').hidden=false;this.dlg=true}
 mkIncident(){if(!this.scene||this.inc.length>=2)return;const p=this.pl,P=this.randPoint(p.x,p.z,150,520),g2=new T.Group(),cs=[],be=[];
  const n=1+(Math.random()<.55?1:0);
  for(let q=0;q<n;q++){const bd2=Object.assign({},CARS[pick([0,1,2,3])]);if(bd2.id!=='taxi')bd2.col=pick([0x9da1a6,0x7a1f1f,0x244a6a,0x6b6b60,0xd8d8d0]);const c=S.makeCar(bd2,false);c.g.traverse(o2=>{if(o2.isMesh)o2.castShadow=false});const off=q*3.6;c.g.position.set(P.x+(P.ew?off:0),0,P.z+(P.ew?0:off));c.g.rotation.y=(P.ew?Math.PI/2:0)+(q?rnd(2.2,3.6):rnd(-.35,.35));g2.add(c.g);cs.push({x:c.g.position.x,z:c.g.position.z})}
  for(let q=0;q<2;q++){const s=new T.Mesh(new T.SphereGeometry(.17,8,6),new T.MeshBasicMaterial({color:0xffa020,fog:false}));s.position.set(cs[0].x+(P.ew?(q?1.8:-1.8):0),1.05,cs[0].z+(P.ew?0:(q?1.8:-1.8)));g2.add(s);be.push(s)}
  this.scene.add(g2);this.inc.push({g:g2,cs,be,t:110});this.g.popup('في حادثة على طريقك: خد بالك')}
 // ---------- traffic ----------
 spawnTraffic(){const n=this.low?6:this.coarse?10:16;this.ag=[];for(let k=0;k<n;k++)this.newAgent()}
 newAgent(a){const pl=this.pl,base=CARS[[0,1,1,2,3,1,4][Math.floor(Math.random()*7)]],def=Object.assign({},base);if(base.id!=='taxi')def.col=pick([0x9da1a6,0xeeeeee,0x2a3140,0x7a1f1f,0x244a6a,0x6b6b60,0xb8b2a0,0x1a1a1c]);
  let ag=a;if(!ag){ag={def,car:S.makeCar(def,false),veh:{x:0,z:0,h:0,ax:0,ay:0,vx:0,dl:0,brk:0}};ag.car.g.traverse(o=>{if(o.isMesh)o.castShadow=false});this.scene.add(ag.car.g);this.ag.push(ag)}
  for(let t=0;t<30;t++){const ax=Math.random()<.5,dir=Math.random()<.5?1:-1,px=ax?pl.x:pl.z,off=(Math.random()<.5?-1:1)*rnd(90,380);let pos=cl(px+off,sc(0)+12,sc(NB)-12);let line=Math.round(((ax?pl.z:pl.x)/PITCH)+NB/2+Math.floor(rnd(-2.5,2.5)));line=cl(line,0,NB);
   const x=ax?pos:sc(line),z=ax?sc(line):pos;if(Math.hypot(x-pl.x,z-pl.z)<70)continue;let ok=true;for(const o of this.ag)if(o!==ag&&Math.hypot(o.veh.x-x,o.veh.z-z)<14){ok=false;break}if(!ok)continue;
   ag.ax=ax;ag.dir=dir;ag.line=line;ag.pos=pos;const idx=pos/PITCH+NB/2;ag.nk=dir>0?Math.floor(idx+1e-6)+1:Math.ceil(idx-1e-6)-1;ag.nk=cl(ag.nk,0,NB);
   ag.lane=(ax&&line===BLV)?pick([4.5,10]):4;ag.cruise=rnd(8.5,14);ag.v=ag.cruise*.8;ag.ox=ag.oz=0;ag.stall=0;ag.ghost=0;const H=this.hdg(ag);ag.veh.h=H;const r=this.right(H);ag.ox=r[0]*ag.lane;ag.oz=r[1]*ag.lane;ag.veh.x=x+ag.ox;ag.veh.z=z+ag.oz;return ag}
  ag.veh.x=-9999;ag.veh.z=-9999;ag.v=0;ag.ax=true;ag.dir=1;ag.line=0;ag.pos=0;ag.nk=1;ag.ox=ag.oz=0;ag.lane=4;ag.cruise=10;ag.stall=0;ag.ghost=0;return ag}
 hdg(a){return a.ax?(a.dir>0?Math.PI/2:-Math.PI/2):(a.dir>0?0:Math.PI)}
 right(H){return[-Math.cos(H),Math.sin(H)]}
 tlState(l){const t=(this.tlT+l.off)%32;return t<16?'ew':t<19?'ewa':t<29?'ns':'nsa'}
 tlUpd(dt){const L=this.tl;if(!L)return;this.tlT+=dt;const o=this.tlO;
  for(const k in L){const l=L[k],st=this.tlState(l);if(st===l.st)continue;l.st=st;
   for(const s of l.sigs){const c=s.ax==='ew'?(st==='ew'?'g':st==='ewa'?'a':'r'):(st==='ns'?'g':st==='nsa'?'a':'r');
    for(const cc of['r','a','g']){const p=s[cc];o.position.set(p[0],p[1],p[2]);o.rotation.set(0,0,0);const m=cc===c?1:.001;o.scale.set(m,m,m);o.updateMatrix();this.tlM[cc].setMatrixAt(s.q,o.matrix)}}
   for(const cc of['r','a','g'])this.tlM[cc].instanceMatrix.needsUpdate=true}}
 mkLights(sc3){const o=this.tlO=new T.Object3D(),L=this.tl={},M=this.tlM={};
  for(let i=0;i<=NB;i++)for(let j=0;j<=NB;j++){if(j!==BLV&&i!==3&&i!==8)continue;L[i*100+j]={i,j,off:(i*7+j*13)%32,st:'',sigs:[]}}
  const n=Object.keys(L).length*4,pm=new T.InstancedMesh(new T.CylinderGeometry(.09,.13,5.4,5),new T.MeshStandardMaterial({color:col(0x3c4046),metalness:.5,roughness:.6}),n),
   hm=new T.InstancedMesh(new T.BoxGeometry(.55,1.7,.36),new T.MeshStandardMaterial({color:col(0x181a1e),roughness:.85}),n);
  for(const c of['r','a','g'])M[c]=new T.InstancedMesh(new T.SphereGeometry(.18,8,6),new T.MeshBasicMaterial({color:{r:0xff3226,a:0xffb020,g:0x2fe06a}[c],fog:false}),n);
  let q=0;
  for(const k in L){const l=L[k],x0=sc(l.i),z0=sc(l.j),hz=hwEW(l.j);
   for(const s of[[x0-hz-1.3,z0+HWN+1.3,'ew',-1,0],[x0+hz+1.3,z0-HWN-1.3,'ew',1,0],[x0-HWN-1.3,z0-hz-1.3,'ns',0,-1],[x0+HWN+1.3,z0+hz+1.3,'ns',0,1]]){
    const px=s[0],pz=s[1],fx=s[3],fz=s[4];
    o.position.set(px,2.7,pz);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.updateMatrix();pm.setMatrixAt(q,o.matrix);
    o.position.set(px+fx*.1,5.2,pz+fz*.1);o.updateMatrix();hm.setMatrixAt(q,o.matrix);
    const sg={ax:s[2],q,r:[px+fx*.3,5.85,pz+fz*.3],a:[px+fx*.3,5.2,pz+fz*.3],g:[px+fx*.3,4.55,pz+fz*.3]};l.sigs.push(sg);
    for(const cc of['r','a','g']){const p=sg[cc];o.position.set(p[0],p[1],p[2]);o.scale.set(.001,.001,.001);o.updateMatrix();M[cc].setMatrixAt(q,o.matrix)}
    q++}}
  sc3.add(pm,hm,M.r,M.a,M.g);this.tlT=0;this.tlUpd(0)}
 tlFine(h){const p=this.pl;this.tlCd=Math.max(0,this.tlCd-h);if(!this.tl)return;
  const i=cl(Math.round(p.x/PITCH+NB/2),0,NB),j=cl(Math.round(p.z/PITCH+NB/2),0,NB),k=i*100+j,l=this.tl[k],inb=l&&Math.abs(p.x-sc(i))<HWN&&Math.abs(p.z-sc(j))<hwEW(j);
  if(inb&&this.tlAt!==k){const st=this.tlState(l),ax=Math.abs(Math.sin(p.h))>Math.abs(Math.cos(p.h))?'ew':'ns';
   if(st!==ax&&st!==ax+'a'&&p.speed>4&&this.tlCd<=0){this.tlCd=8;const fee=Math.min(this.g.coins,40);this.g.coins-=fee;this.g.saveCoins();this.g.garage();this.g.audio.thud();this.g.popup('عدّيت الإشارة الحمرا! غرامة -'+fee+' جنيه');this.d.fines=(this.d.fines||0)+1;this.save()}}
  this.tlAt=inb?k:null}
 agStep(a,h){const H=this.hdg(a),fw=[Math.sin(H),Math.cos(H)],rt=this.right(H),pl=this.pl;let vt=a.cruise;
  const chk=(ox,oz,self)=>{const dx=ox-a.veh.x,dz=oz-a.veh.z,f=dx*fw[0]+dz*fw[1],l=dx*rt[0]+dz*rt[1];if(f>0&&f<20+a.v*.8&&Math.abs(l)<2.5){vt=Math.min(vt,Math.max(0,(f-5.2)*.75))}};
  chk(pl.x,pl.z);if(a.ghost<=0)for(const o of this.ag)if(o!==a)chk(o.veh.x,o.veh.z);else{}
  const dn=a.dir>0?sc(a.nk)-a.pos:a.pos-sc(a.nk);
  if(dn<34&&this.tl){const lk=this.tl[a.ax?a.nk*100+a.line:a.line*100+a.nk];if(lk){const st=this.tlState(lk),go=a.ax?st==='ew':st==='ns';if(!go){const sd=(a.ax?HWN:hwEW(a.nk))+3.5;if(dn>sd)vt=Math.min(vt,Math.max(0,(dn-sd)*1.3))}}}
  if(dn<28)vt=Math.min(vt,7.5);
  const dv=vt-a.v;a.v+=cl(dv,-10*h,3.2*h);if(a.v<.3&&vt<.5){a.stall+=h;if(a.stall>3.5){a.ghost=3;a.stall=0}}else a.stall=0;if(a.ghost>0)a.ghost-=h;
  a.pos+=a.dir*a.v*h;
  if(a.dir>0?a.pos>=sc(a.nk):a.pos<=sc(a.nk)){const oldLine=a.line,node=a.nk,op=[a.veh.x,a.veh.z],opts=[];
   if(node+a.dir>=0&&node+a.dir<=NB)opts.push(['s',.6]);
   for(const side of[1,-1]){const rv=this.right(H),nd=a.ax?Math.sign(rv[1])*side:Math.sign(rv[0])*side;if(oldLine+nd>=0&&oldLine+nd<=NB)opts.push([side>0?'r':'l',.2])}
   let tot=0;for(const o of opts)tot+=o[1];let rr=Math.random()*tot,ch=opts[0]?opts[0][0]:'u';for(const o of opts){rr-=o[1];if(rr<=0){ch=o[0];break}}
   if(ch==='s'){a.nk=cl(node+a.dir,0,NB)}
   else if(ch==='u'||!opts.length){a.dir=-a.dir;a.nk=cl(node+a.dir,0,NB)}
   else{const side=ch==='r'?1:-1,rv=this.right(H),nd=a.ax?Math.sign(rv[1])*side:Math.sign(rv[0])*side;a.ax=!a.ax;a.line=node;a.dir=nd;a.pos=sc(oldLine);a.nk=cl(oldLine+nd,0,NB);a.cruise=rnd(8.5,14);
    a.lane=(a.ax&&a.line===BLV)?pick([4.5,10]):4;a.ox=op[0]-(a.ax?a.pos:sc(a.line));a.oz=op[1]-(a.ax?sc(a.line):a.pos);a.v=Math.min(a.v,6)}}
  const H2=this.hdg(a),r2=this.right(H2),tx=r2[0]*a.lane,tz=r2[1]*a.lane,k=Math.min(1,2.6*h);a.ox+=(tx-a.ox)*k;a.oz+=(tz-a.oz)*k;
  a.veh.x=(a.ax?a.pos:sc(a.line))+a.ox;a.veh.z=(a.ax?sc(a.line):a.pos)+a.oz;const dh=wrap(H2-a.veh.h);a.veh.h=wrap(a.veh.h+dh*Math.min(1,4*h));a.veh.vx=a.v;a.veh.dl=cl(-dh*.4,-.4,.4);a.veh.brk=(vt<a.v-1.5)?1:0;
  if(Math.hypot(a.veh.x-pl.x,a.veh.z-pl.z)>560)this.newAgent(a)}
 // ---------- simulation ----------
 update(dt){if(this.dlg)return;const n=Math.max(1,Math.min(8,Math.ceil(dt*120))),h=dt/n;for(let i=0;i<n;i++)this.sim(h);this.post(dt)}
 sim(h){const g=this.g,p=this.pl,k=g.keys;let s=(k.right?1:0)-(k.left?1:0);if(g.opt.tilt&&g.coarse)s=cl(s+(g.opt.inv?-1:1)*g.tilt/20,-1,1);s=cl(s+(g.wv||0),-1,1);
  const I={steer:s,thr:k.up?1:0,brk:k.down?1:0,hb:k.hb?1:0};p.grip=(this.onRoad(p.x,p.z)?1:.88)*(this.rain&&this.rain.on?.92:1);if(p.dmg>=100){I.thr=0}
  p.step(h,I);this.collide();for(const a of this.ag)this.agStep(a,h);this.dist=(this.dist||0)+p.speed*h;this.tlFine(h)}
 hit(f,px,pz){const p=this.pl,g=this.g;if(f>1.2&&px!==undefined&&this.pcar)S.dent(this.pcar,p,px,pz,f);p.dmg=Math.min(100,p.dmg+f*.7);this.bump=Math.max(this.bump,Math.min(1.5,f/8));if(f>2){g.audio.thud();if(f>4&&this.job&&this.job.stage==='ride'&&Date.now()-(this.lastHitSay||0)>5000){this.lastHitSay=Date.now();this.say(pick(L_HIT))}if(f>4){this.d.crashes++;if(this.job)this.job.crash=(this.job.crash|0)+1}}}
 say(t){if(!this.job||!this.job.name)return;this.g.popup(this.job.name+': '+t)}
 collide(){const p=this.pl,d=p.d,sn=Math.sin(p.h),cs=Math.cos(p.h),hl=d.len/2-1.1,R=d.wid/2+.1;
  const bi=Math.floor((p.x-sc(0)-HWN)/PITCH+.5)+0,i0=cl(Math.floor((p.x-sc(0))/PITCH),0,NB-1),j0=cl(Math.floor((p.z-sc(0))/PITCH),0,NB-1);
  const wrect=(r)=>{for(const sg of[1,-1]){const cx=p.x+sn*hl*sg,cz=p.z+cs*hl*sg,qx=cl(cx,r.x0,r.x1),qz=cl(cz,r.z0,r.z1);let dx=cx-qx,dz=cz-qz,dd=Math.hypot(dx,dz),nx,nz,ov;
    if(dd>=R)continue;if(dd<1e-4){const a=cx-r.x0,b=r.x1-cx,c=cz-r.z0,e=r.z1-cz,m=Math.min(a,b,c,e);if(m===a){nx=-1;nz=0}else if(m===b){nx=1;nz=0}else if(m===c){nx=0;nz=-1}else{nx=0;nz=1}ov=R+m}else{nx=dx/dd;nz=dz/dd;ov=R-dd}
    p.x+=nx*ov;p.z+=nz*ov;const wv=p.wv(),vin=wv[0]*nx+wv[1]*nz;if(vin<0){p.setWv((wv[0]-1.25*vin*nx)*.96,(wv[1]-1.25*vin*nz)*.96);this.hit(-vin,cx-nx*.9,cz-nz*.9)}}};
  for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const L=this.bl[i*100+j];if(L)for(const r of L)wrect(r)}
  if(Math.abs(p.z-sc(BLV))<6)for(const r of this.med)wrect(r);
  const B=this.bounds;if(p.x<B.x0||p.x>B.x1||p.z<B.z0||p.z>B.z1){const cx=cl(p.x,B.x0,B.x1),cz=cl(p.z,B.z0,B.z1),nx=p.x<B.x0?1:p.x>B.x1?-1:0,nz=p.z<B.z0?1:p.z>B.z1?-1:0;p.x=cx;p.z=cz;const wv=p.wv(),vin=wv[0]*nx+wv[1]*nz;if(vin<0){p.setWv(wv[0]-1.4*vin*nx,wv[1]-1.4*vin*nz);this.hit(-vin*.5)}}
  for(const a of this.ag){const v=a.veh,dx=p.x-v.x,dz=p.z-v.z,d2=dx*dx+dz*dz;if(d2>30)continue;
   for(const o1 of[-1.1,1.1])for(const o2 of[-1.1,1.1]){const px=p.x+sn*o1,pz=p.z+cs*o1,ax=v.x+Math.sin(v.h)*o2,az=v.z+Math.cos(v.h)*o2,ddx=px-ax,ddz=pz-az,dd=Math.hypot(ddx,ddz);
    if(dd<1.95&&dd>.001){const nx=ddx/dd,nz=ddz/dd,ov=1.95-dd;p.x+=nx*ov*.7;p.z+=nz*ov*.7;a.ox-=nx*ov*.25;a.oz-=nz*ov*.25;
     const wv=p.wv(),vr=(wv[0]-Math.sin(v.h)*a.v)*nx+(wv[1]-Math.cos(v.h)*a.v)*nz;if(vr<0){p.setWv(wv[0]-1.25*vr*nx,wv[1]-1.25*vr*nz);a.v*=1-cl(-vr*.02,0,.3);this.hit(-vr*.6,(px+ax)/2,(pz+az)/2)}}}}
  for(const c of this.inc)for(const o2 of c.cs){const dx2=p.x-o2.x,dz2=p.z-o2.z,d3=dx2*dx2+dz2*dz2;if(d3>16)continue;const dd2=Math.sqrt(d3)||.001,nx2=dx2/dd2,nz2=dz2/dd2,ov2=3.2-dd2;if(ov2>0){p.x+=nx2*ov2;p.z+=nz2*ov2;const wv2=p.wv(),vin2=wv2[0]*nx2+wv2[1]*nz2;if(vin2<0){p.setWv(wv2[0]-1.3*vin2*nx2,wv2[1]-1.3*vin2*nz2);this.hit(-vin2*.7,o2.x,o2.z)}}}}
 // ---------- jobs ----------
 mkMarker(c,r){const g=new T.Group(),m=new T.MeshBasicMaterial({color:c,transparent:true,opacity:.28,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,fog:false}),b=new T.Mesh(new T.CylinderGeometry(r*.55,r*.55,70,18,1,true),m);b.position.y=35;g.add(b);
  const rg=new T.Mesh(new T.RingGeometry(r*.8,r,40),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false,fog:false}));rg.rotation.x=-Math.PI/2;rg.position.y=.12;g.add(rg);g.userData.rg=rg;return g}
 mkPerson(c){const g=new T.Group(),mt=new T.MeshStandardMaterial({color:col(c),roughness:.8}),sk=new T.MeshStandardMaterial({color:col(0xc79a72),roughness:.8});
  const b=new T.Mesh(new T.CylinderGeometry(.3,.36,1.1,8),mt);b.position.y=.95;const hd=new T.Mesh(new T.SphereGeometry(.22,10,8),sk);hd.position.y=1.7;const ar=new T.Mesh(new T.BoxGeometry(.12,.7,.12),mt);ar.position.set(.35,1.55,0);g.add(b,hd,ar);g.userData.arm=ar;
  const lg=new T.Mesh(new T.BoxGeometry(.4,.8,.25),new T.MeshStandardMaterial({color:col(0x2a2f3a)}));lg.position.y=.4;g.add(lg);return g}
 clearJob(){const j=this.job;if(j){if(j.mk)this.scene.remove(j.mk);if(j.mk2)this.scene.remove(j.mk2);if(j.pp)this.scene.remove(j.pp);if(j.bc)this.scene.remove(j.bc.g)}this.job=null}
pickKind(){const d=this.d;if(d.ch<CH.length&&CH[d.ch].k!=='any')return CH[d.ch].k;const x=Math.random();if(x<.36)return'fare';if(x<.51)return'rush';if(x<.63)return'gentle';if(x<.73)return'tour';if(x<.85)return'delivery';if(x<.92)return'rescue';if(x<.96)return d.lvl>=2?'vip':'fare';return d.lvl>=3?'airport':'fare'}
 lmarks(){const o=[];for(const[l,n]of[[this.tower,'برج القاهرة'],[this.mosque,'الجامع'],[this.hub,'موقف التاكسي'],...(this.sts||[]).map(q=>[q,'بنزينة']),[this.shop,'الورشة'],[this.airpt,'المطار'],[this.pyr,'الأهرامات'],[this.nile,'كورنيش النيل']]){if(!l)continue;const q=this.nearNode(l.x,l.z);o.push({x:sc(q.i),z:sc(q.j),n})}return o}
 setMk(c,pos,r){if(this.job.mk)this.scene.remove(this.job.mk);const m=this.mkMarker(c,r||9);m.position.set(pos.x,0,pos.z);this.scene.add(m);this.job.mk=m}
 newJob(){const p=this.pl,k=this.pickKind(),pu=this.randPoint(p.x,p.z,140,420),dr=this.randPoint(pu.x,pu.z,320,880);let dist=Math.abs(pu.x-dr.x)+Math.abs(pu.z-dr.z),name=k==='delivery'?'طلب مطعم':pick(NAMES);
  if(k==='vip')name=pick(VIPS);
  if(k==='airport'&&this.airpt){const q=this.nearNode(this.airpt.x,this.airpt.z);dr.x=sc(q.i);dr.z=sc(q.j);dist=Math.abs(pu.x-dr.x)+Math.abs(pu.z-dr.z)}
  const j={kind:k,stage:'pickup',pu,dr,dist,name,crash:0,dmg0:0,fail:0,wps:[],wi:0};
  if(k==='tour'){const L=this.lmarks().sort(()=>Math.random()-.5).slice(0,2);let q=pu,s=0;for(const w of L){s+=Math.abs(q.x-w.x)+Math.abs(q.z-w.z);q=w}s+=Math.abs(q.x-dr.x)+Math.abs(q.z-dr.z);j.wps=L;dist=s;j.dist=s}
  j.tmax=k==='rush'?dist/11+12:k==='tour'?dist/8+35:k==='delivery'?dist/9.5+16:k==='rescue'?dist/9.5+18:k==='vip'?dist/11+14:k==='airport'?dist/8+35:dist/9+20;
  j.mk=this.mkMarker(k==='rescue'?0xffc040:0x30ff80,8);j.mk.position.set(pu.x,0,pu.z);this.scene.add(j.mk);
  if(k!=='delivery'){const pp=this.mkPerson(k==='vip'?0xf2b705:pick([0x3a6ea5,0xa5483a,0x4a8a4a,0x8a6ab0,0xd0a030]));const side=pu.sd;pp.position.set(pu.x+(pu.ew?0:side*3.3),0,pu.z+(pu.ew?side*3.3:0));pp.rotation.y=pu.ew?(pu.sd>0?Math.PI:0):(pu.sd>0?-Math.PI/2:Math.PI/2);j.pp=pp;this.scene.add(pp)}
  if(k==='rescue'){const bd2=Object.assign({},CARS[pick([0,2,3])]);bd2.col=pick([0x9da1a6,0x7a1f1f,0x244a6a,0x6b6b60]);const bc=S.makeCar(bd2,false);bc.g.traverse(o2=>{if(o2.isMesh)o2.castShadow=false});bc.g.position.set(pu.x+(pu.ew?0:-pu.sd*2.6),0,pu.z+(pu.ew?-pu.sd*2.6:0));bc.g.rotation.y=(pu.ew?Math.PI/2:0)+(pu.sd>0?Math.PI:0)+rnd(-.3,.3);this.scene.add(bc.g);j.bc=bc}
  this.job=j;this.g.popup(KIND[k][0]+': '+name);this.g.audio.coin()}
 skip(){if(!this.on)return;if(this.job&&this.job.stage==='ride'){this.g.popup('مينفعش تسيب الراكب في نص الطريق');return}this.clearJob();this.jobWait=.6}
 jobStep(dt){const p=this.pl,j=this.job;
  if(!j){this.jobWait-=dt;if(this.jobWait<=0)this.newJob();return}
  if(j.stage==='pickup'){const d=Math.hypot(p.x-j.pu.x,p.z-j.pu.z);if(d<9&&p.speed<3.2){this.boardT+=dt;if(this.boardT>=.9){this.boardT=0;this.board()}}else this.boardT=Math.max(0,this.boardT-dt*2)}
  else if(j.stage==='ride'){j.t+=dt;j.left=j.tmax-j.t;const wp=j.wi<j.wps.length?j.wps[j.wi]:null;
   if(wp){if(Math.hypot(p.x-wp.x,p.z-wp.z)<16){j.wi++;this.g.audio.coin();this.g.popup('معلم: '+wp.n);this.setMk(j.wi<j.wps.length?0x40a0ff:0xff9a1f,j.wi<j.wps.length?j.wps[j.wi]:j.dr,j.wi<j.wps.length?14:9)}}
   else{const d=Math.hypot(p.x-j.dr.x,p.z-j.dr.z);j.arrT=(d<10&&p.speed<3.6)?(j.arrT||0)+dt:0;if(j.arrT>.7)this.finish()}
   if(j.kind==='gentle'&&!j.fail&&(j.crash>0||p.dmg-j.dmg0>6)){j.fail=1;this.say('خلاص، اتخضيت! الأجرة هتقل');this.g.popup('الراكب اتخض: الأجرة هتقل')}
   this.chat-=dt;if(this.chat<=0&&j.kind!=='delivery'){this.chat=rnd(13,22);const sk=p.speed*3.6;if(sk>115)this.say(pick(L_FAST));else if(sk<25&&j.left<j.tmax*.5&&j.left>0)this.say(pick(L_SLOW))}}
  if(j.mk&&j.mk.userData.rg){const s=1+.06*Math.sin(this.g.t*5);j.mk.userData.rg.scale.set(s,s,1)}
  if(j.pp&&j.pp.userData.arm)j.pp.userData.arm.rotation.z=2.4+Math.sin(this.g.t*7)*.5}
 board(){const j=this.job;j.stage='ride';j.t=0;j.left=j.tmax;j.dmg0=this.pl.dmg;if(j.pp){this.scene.remove(j.pp);j.pp=null}if(j.bc){this.scene.remove(j.bc.g);j.bc=null}
  if(j.wps.length)this.setMk(0x40a0ff,j.wps[0],14);else this.setMk(0xff9a1f,j.dr,9);this.chat=rnd(8,12);this.g.audio.unlock();this.g.popup(j.kind==='delivery'?'استلمت الطلب':j.name+': '+pick(L_BOARD));
  if(j.kind==='tour')this.g.popup('الجولة: '+j.wps.map(w=>w.n).join(' ثم '))}
 finish(){const j=this.job,p=this.pl,d=this.d,g=this.g,taxi=CARS[g.sel].id==='taxi',k=j.kind,mult=(this.surge?1.5:1)*(k==='rush'?1.6:k==='gentle'?(j.fail?.55:1.5):k==='tour'?1.8:k==='delivery'?1.4:k==='rescue'?1.7:k==='vip'?2.2:k==='airport'?2:1),base=Math.round((25+j.dist*.085)*mult),tipMax=Math.round(base*.3);
  const left=j.left,late=left<0,dm=cl((p.dmg-j.dmg0)/100*1.8,0,.5),stars=k==='delivery'?(late?3:5):cl(5-(late?2:0)-(j.crash>=3?2:j.crash>0?1:0)-(dm>.25?1:0),1,5);d.rateS=(d.rateS||0)+stars;d.rateN=(d.rateN||0)+1;d.rate=Math.round(10*d.rateS/d.rateN)/10;
  const tip=late?0:Math.round(tipMax*cl(left/j.tmax,0,1)*(1+(d.rate>=4.5?.15:0))),dmgCut=Math.round((base+tip)*dm),lateCut=late?Math.round(base*cl(-left/45,0,.45)):0,bonus=taxi?Math.round((base+tip)*.15):0;
  const total=Math.max(10,base+tip-dmgCut-lateCut+bonus),xp=Math.round(total*.6+10),ok=!(k==='gentle'&&j.fail);
  if(this.surge){this.surge=0;g.popup('ساعة الذروة خلصت')}g.coins+=total;g.saveCoins();g.garage();g.audio.coin();d.rides++;d.earned+=total;d.best=Math.max(d.best,total);d.km+=j.dist/1000;this.misProg('rides',1);this.misProg('earn',total);if(!j.crash)this.misProg('clean',1);if(stars>=5)this.misProg('stars5',1);if(k==='delivery')this.misProg('deliv',1);if(k==='vip')this.misProg('vip',1);this.achCheck();
  const rows=[[KIND[k][0],base],tip?['إكرامية سرعة',tip]:null,bonus?['مكافأة التاكسي',bonus]:null,dmgCut?['خصم الأضرار',-dmgCut]:null,lateCut?['خصم التأخير',-lateCut]:null].filter(Boolean);
  if(k!=='delivery')rows.push(['تقييم الراكب','★'.repeat(stars)+'☆'.repeat(5-stars)]);this.receipt(j.name,rows,total);const lv0=d.lvl;d.xp+=xp;while(d.xp>=XPN(d.lvl)){d.xp-=XPN(d.lvl);d.lvl++}
  if(d.lvl>lv0){const rw=d.lvl*60;g.coins+=rw;g.saveCoins();g.garage();setTimeout(()=>{if(this.on){g.popup('ترقية! مستوى '+d.lvl+' | +'+rw+' جنيه');g.audio.unlock()}},1200)}
  if(k!=='delivery')this.say(pick(late?L_LATE:L_ARR));
  if(d.ch<CH.length){const c=CH[d.ch];if(ok&&(c.k==='any'||c.k===k)){d.cp++;if(d.cp>=c.n){this.chapterDone(c)}else g.popup('الفصل '+(d.ch+1)+': '+d.cp+'/'+c.n)}else if(!ok)g.popup('المهمة مخلصتش: لازم من غير خبطات')}
  this.save();this.clearJob();this.jobWait=3.8;this.uiFull();this.menuUi()}
 chapterDone(c){const d=this.d,g=this.g;g.coins+=c.rw;let m=c.done+' +'+c.rw+' جنيه';if(c.car&&!g.own[c.car]){g.own[c.car]=1;const cd=CARS.find(x=>x.id===c.car);m+=' | اتفتحت: '+(cd?cd.name:c.car)}g.saveCoins();g.garage();d.ch++;d.cp=0;
  const nx=d.ch<CH.length?CH[d.ch]:null;d.seen=nx?d.ch:d.seen;g.audio.unlock();setTimeout(()=>{if(!this.on)return;this.showDlg('خلّصت الفصل: '+c.t,m);if(nx)this.showDlg('الفصل '+(d.ch+1)+': '+nx.t,nx.txt);else this.showDlg('الحكاية خلصت','كل الفصول خلصت يا أسطورة. كمّل شغل في المدينة واكسب ورقّي رتبتك.')},2200)}
 receipt(name,rows,total){const e=$('rrec');e.innerHTML='<h4>'+name+' نزل</h4>'+rows.map(r=>'<div><span>'+r[0]+'</span><b>'+(r[1]>0?'+':'')+r[1]+'</b></div>').join('')+'<div class="t"><span>الإجمالي</span><b>'+total+' جنيه</b></div>';e.classList.add('sh');clearTimeout(this.rt);this.rt=setTimeout(()=>e.classList.remove('sh'),3600)}
 post(dt){this.jobStep(dt);const p=this.pl,g=this.g;this.fuelStep(dt);
  this.incT-=dt;if(this.incT<=0){this.incT=70+Math.random()*70;this.mkIncident()}for(let i2=this.inc.length-1;i2>=0;i2--){const c=this.inc[i2];c.t-=dt;if(c.t<=0){this.scene.remove(c.g);this.inc.splice(i2,1)}}
  if(this.cops)for(const c of this.cops){c.cd=Math.max(0,c.cd-dt);if(c.cd>0)continue;const dd=Math.hypot(p.x-c.x,p.z-c.z);if(dd<15&&p.speed<8){c.cd=25;if(this.d.fines>0){const fee=Math.min(g.coins,this.d.fines*40);g.coins-=fee;this.d.fines=0;this.save();g.saveCoins();g.garage();g.audio.thud();g.popup('كمين مرور: دفعت غراماتك -'+fee+' جنيه وعدّيت')}else g.popup('كمين مرور: سجلّك نضيف، عدّي')}}if(p.dmg>=100&&!this.tow){this.tow=1;const fee=Math.min(this.g.coins,80);this.g.coins-=fee;this.g.saveCoins();this.g.garage();this.g.popup('العربية باظت واتسحبت للمرور: -'+fee+' جنيه');if(this.job&&this.job.stage==='ride'){this.job.dmg0=0}
   setTimeout(()=>{this.tow=0;if(!this.on)return;this.mkCar(false);this.unstick()},1600)}}
 mkStations(){if(this.sts)return;const sts=[];for(const[i,j]of[[2,8],[8,2],[5,1]]){const q={x:sc(i),z:sc(j)},m=this.mkMarker(0xffa020,9);m.position.set(q.x,0,q.z);this.scene.add(m);const sg=new T.Mesh(new T.BoxGeometry(5,2.2,.4),new T.MeshBasicMaterial({color:0xffa020,fog:false}));sg.position.set(q.x+7,13,q.z+7);this.scene.add(sg);const pl=new T.Mesh(new T.BoxGeometry(.5,9,.5),new T.MeshStandardMaterial({color:0x444444}));pl.position.set(q.x,4.5,q.z);this.scene.add(pl);sts.push(q)}{const q={x:sc(7),z:sc(5)};this.shop=q;const m=this.mkMarker(0x40c0ff,9);m.position.set(q.x,0,q.z);this.scene.add(m);const sg=new T.Mesh(new T.BoxGeometry(5,2.2,.4),new T.MeshBasicMaterial({color:0x40c0ff,fog:false}));sg.position.set(q.x+7,13,q.z+7);this.scene.add(sg);const pl=new T.Mesh(new T.BoxGeometry(.5,9,.5),new T.MeshStandardMaterial({color:0x444444}));pl.position.set(q.x,4.5,q.z);this.scene.add(pl);const gb=new T.Mesh(new T.BoxGeometry(14,6,10),new T.MeshStandardMaterial({color:col(0x4a5560),roughness:.8}));gb.position.set(q.x-16,3,q.z);this.scene.add(gb)}this.sts=sts}
 fuelStep(dt){const p=this.pl,g=this.g;if(!p||this.tow)return;if(!this.sts&&this.scene)this.mkStations();const sp=p.speed,fcap=1+.25*((this.d.up||{}).k||0);this.fuel=Math.max(0,this.fuel-sp*dt/5500/fcap*100);
  if(this.fuel<=0){const k=Math.pow(.15,dt);p.vx*=k;p.vy*=k;if(!this.fo){this.fo=1;g.popup('البنزين خلص! وصّل لأقرب بنزينة (البرتقالي)')}if(sp<1){this.fz+=dt;if(this.fz>5){this.fz=0;const fee=Math.min(g.coins,30);g.coins-=fee;g.saveCoins();g.garage();this.fuel=20;this.fo=0;g.popup('جركن بنزين طوارئ: -'+fee+' جنيه (+20%)')}}}else{this.fo=0;this.fz=0}
  if(sp<5)for(const q of this.sts||[]){if(Math.hypot(p.x-q.x,p.z-q.z)<10){const need=Math.ceil(100-this.fuel),cost=Math.round(need*.6);if(need>=8&&g.coins>=cost&&cost>0){this.fuel=100;g.coins-=cost;g.saveCoins();g.garage();g.audio.coin();g.popup('تفويل كامل: -'+cost+' جنيه');if(p.dmg>=8)setTimeout(()=>{if(this.on)this.g.popup('العربية مضروبة؟ دوس "ورشة"')},1800)}else if(need>=8&&g.coins<cost&&!this.nb){this.nb=1;g.popup('محتاج '+cost+' جنيه للتفويل');setTimeout(()=>this.nb=0,6000)}break}}
  this.evT-=dt;if(this.shop&&sp<1&&!this.dlg&&Math.hypot(p.x-this.shop.x,p.z-this.shop.z)<12&&!this.shOpen){this.shOpen=1;this.openShop()}if(this.shOpen&&sp>=1)this.shOpen=0;
  if(this.evT<=0&&!this.dlg){this.evT=80+Math.random()*80;this.event()}}
 event(){const g=this.g,r=Math.random();if(r<.34){const c=40+Math.round(Math.random()*80);g.coins+=c;g.saveCoins();g.garage();g.audio.coin();g.popup('راكب قديم عرفك وساب بقشيش: +'+c+' جنيه')}else if(r<.67){this.fuel=Math.min(100,this.fuel+20);g.popup('لقيت جركن بنزين في الشارع: +20%')}else if(!this.surge){this.surge=1;g.popup('ساعة الذروة! المشوار الجاي أجرته ×1.5')}else{g.popup('الشوارع زحمة النهاردة')}}
 mkPeds(sc3){const rn=mul32(77),n=this.low?22:this.coarse?32:46,o=new T.Object3D();
  const bg=new T.BoxGeometry(.42,1.02,.26);bg.translate(0,.93,0);const hg=new T.SphereGeometry(.2,8,6);hg.translate(0,1.66,0);
  const bm=this.pedB=new T.InstancedMesh(bg,new T.MeshStandardMaterial({roughness:.9}),n),hm=this.pedH=new T.InstancedMesh(hg,new T.MeshStandardMaterial({roughness:.8}),n);
  const pal=[0x3a6ea5,0xa5483a,0x4a8a4a,0x8a6ab0,0xd0a030,0x9da1a6,0x244a6a,0x7a1f1f,0xd8d8d0],skn=[0xc79a72,0xa87850,0x8a5f3d,0xe0b088];
  this.peds=[];
  for(let q2=0;q2<n;q2++){const i=Math.floor(rn()*NB),j=Math.floor(rn()*NB),p={x0:sc(i)+HWN+1.6,z0:sc(j)+hwEW(j)+1.6,x1:sc(i+1)-HWN-1.6,z1:sc(j+1)-hwEW(j+1)-1.6,e:Math.floor(rn()*4),u:rn(),dir:rn()<.5?1:-1,sp:1+rn()*.9};
   this.peds.push(p);this.pedMat(o,p);bm.setMatrixAt(q2,o.matrix);hm.setMatrixAt(q2,o.matrix);
   bm.setColorAt(q2,col(pal[Math.floor(rn()*pal.length)]));hm.setColorAt(q2,col(skn[Math.floor(rn()*skn.length)]))}
  bm.instanceColor.needsUpdate=true;hm.instanceColor.needsUpdate=true;sc3.add(bm,hm)}
 pedUpd(dt){const ps=this.peds;if(!ps)return;const o=this.tlO,pl=this.pl;
  for(let q=0;q<ps.length;q++){const p=ps[q],cx=(p.x0+p.x1)/2,cz=(p.z0+p.z1)/2,dx=cx-pl.x,dz=cz-pl.z;
   if(dx*dx+dz*dz>120000)continue;const L=p.e<2?p.x1-p.x0:p.z1-p.z0;p.u+=p.dir*p.sp*dt/L;if(p.u>1)p.u-=1;else if(p.u<0)p.u+=1;
   this.pedMat(o,p);this.pedB.setMatrixAt(q,o.matrix);this.pedH.setMatrixAt(q,o.matrix)}
  this.pedB.instanceMatrix.needsUpdate=true;this.pedH.instanceMatrix.needsUpdate=true}
 pedMat(o,p){let x,z,h;const u=p.u;
  if(p.e===0){x=p.x0+u*(p.x1-p.x0);z=p.z0;h=Math.PI/2}else if(p.e===1){x=p.x1;z=p.z0+u*(p.z1-p.z0);h=0}
  else if(p.e===2){x=p.x1-u*(p.x1-p.x0);z=p.z1;h=-Math.PI/2}else{x=p.x0;z=p.z1-u*(p.z1-p.z0);h=Math.PI}
  o.position.set(x,.2,z);o.rotation.set(0,p.dir<0?h+Math.PI:h,0);o.scale.set(1,1,1);o.updateMatrix()}
 perfApply(){if(this.pf>=1)this.moon.castShadow=false;if(this.pf>=2&&this.glowM)this.glowM.count=0}
 // ---------- drawing ----------
 draw(dt){const g=this.g,w=g.world,p=this.pl,c=w.cam,sp=p.speed,wv=p.wv(),d=p.d;g.wheelStep(dt);S.updCar(this.pcar,p,dt,1);{const R2=[40000,22500,9000][this.pf],px=p.x,pz=p.z;for(const a of this.ag){const dx=a.veh.x-px,dz=a.veh.z-pz,vis=dx*dx+dz*dz<R2;if(a.car.g.visible!==vis)a.car.g.visible=vis;if(vis)S.updCar(a.car,a.veh,dt,1)}}
  this.tlUpd(dt);this.pedUpd(dt);
  const rn2=this.rain;if(rn2){rn2.t-=dt;if(rn2.t<=0){rn2.on=!rn2.on;rn2.t=rn2.on?60+Math.random()*70:70+Math.random()*90;if(this.rainPts)this.rainPts.visible=rn2.on;g.popup(rn2.on?'الدنيا بتمطر خفيف: براحة على الفرامل':'المطر وقف')}
   if(rn2.on&&this.rainPts){const a=this.rainPts.geometry.attributes.position.array;for(let q=0;q<a.length;q+=3){a[q+1]-=38*dt;if(a[q+1]<0)a[q+1]+=34;if(a[q]>36)a[q]-=72;else if(a[q]<-36)a[q]+=72;if(a[q+2]>36)a[q+2]-=72;else if(a[q+2]<-36)a[q+2]+=72}this.rainPts.geometry.attributes.position.needsUpdate=true;this.rainPts.position.set(p.x,0,p.z)}}
  if(this.cops)for(const c of this.cops)c.bc.material.color.setHex(Math.sin(g.t*6+c.x)>0?0xff4030:0x3050ff);for(const c of this.inc)for(let q=0;q<c.be.length;q++)c.be[q].visible=Math.sin(g.t*7+q*3)>0;const lit=!!g.hl,ps=this.pcar;if(ps.spot)ps.spot.intensity=lit?3.5:0;ps.hl.emissiveIntensity=lit?4:.6;
  let ah=p.h;if(sp>5)ah=p.h+cl(wrap(Math.atan2(wv[0],wv[1])-p.h),-.6,.6)*.4;this.ch+=wrap(ah-this.ch)*(1-Math.exp(-7*dt));const sn=Math.sin(this.ch),cs=Math.cos(this.ch);let px,py,pz,lx,ly,lz,fov;
  if(g.view===0){const dist=5.7+sp*.011;px=p.x-sn*dist;pz=p.z-cs*dist;py=2+sp*.003;lx=p.x+sn*8;lz=p.z+cs*8;ly=1.1;fov=58+Math.min(34,sp*.62)}
  else{px=p.x+Math.sin(p.h)*.3;pz=p.z+Math.cos(p.h)*.3;py=1.2;lx=p.x+Math.sin(p.h)*30;lz=p.z+Math.cos(p.h)*30;ly=1.05;fov=68+Math.min(18,sp*.3)}
  this.bump*=Math.exp(-5*dt);const shk=(this.bump*.24+sp*.0009)*Math.sin(g.t*53);c.position.set(px,py+shk,pz);c.lookAt(lx,ly,lz);if(Math.abs(c.fov-fov)>.05){c.fov=fov;c.updateProjectionMatrix()}
  this.moon.position.set(p.x+40,120,p.z+30);this.moon.target.position.set(p.x,0,p.z);this.moon.target.updateMatrixWorld();
  const r=w.r;r.shadowMap.needsUpdate=true;r.clear();r.render(this.scene,c);
  this.ft=this.ft*.95+dt*1000*.05;if(++this.fc>90){this.fc=0;if(this.ft>24&&w.pr>.7)w.setPR(Math.max(.7,w.pr-.25));else if(this.ft>26&&this.pf<2){this.pf++;this.perfApply()}else if(this.ft<13.5&&w.pr<w.prMax)w.setPR(Math.min(w.prMax,w.pr+.25))}
  this.hud();g.audio.prof=d.id;g.audio.atm='night';if(!g.paused)g.audio.update(p.rpm/d.rl,p.slip>.14&&sp>4,true,p.thr)}
 uiFull(){const d=this.d,g=this.g;$('rCoins').textContent=g.coins;$('rRank').textContent=this.rank()+(d.rateN?' ★'+d.rate:'');$('rLvl').textContent='مستوى '+d.lvl;$('rXp').style.width=Math.round(100*d.xp/XPN(d.lvl))+'%'}
 tgt(){const j=this.job;if(!j)return null;if(j.stage==='pickup')return j.pu;return j.wi<j.wps.length?j.wps[j.wi]:j.dr}
 hud(){const g=this.g,p=this.pl,j=this.job,t=this.tgt();g.set('rSpd',String(Math.round(Math.max(0,p.vx)*3.6)));const dm=Math.round(p.dmg);g.set('rDmg',dm+'%');g.set('rFuel',Math.max(0,Math.round(this.fuel))+'%');$('rFuel').style.color=this.fuel<20?'#ff5a5a':'';const rb=$('rbR');rb.hidden=!(p.dmg>=8);const atSh=this.shop&&Math.hypot(p.x-this.shop.x,p.z-this.shop.z)<12;if(!rb.hidden)rb.textContent=(atSh?'ورشة أرخص ':'ورشة ')+Math.round(p.dmg*(atSh?1:1.5))+' ج';
  if(this.lastCoins!==g.coins){this.lastCoins=g.coins;this.uiFull()}
  const J=$('rJobT'),S1=$('rJobS'),D=$('rJobD'),ar=$('rArr');
  if(!j){J.textContent='دوّر على راكب...';S1.textContent=this.d.ch<CH.length?'الفصل '+(this.d.ch+1)+': '+CH[this.d.ch].t+' ('+this.d.cp+'/'+CH[this.d.ch].n+')':'';const m0=this.d.day&&this.d.day.list?this.d.day.list.find(m=>m.p<m.n):null;D.textContent=m0?'مهمة: '+m0.t+' ('+Math.min(m0.p,m0.n)+'/'+m0.n+')':'';ar.style.opacity=.2}
  else{const d=Math.hypot(t.x-p.x,t.z-p.z);ar.style.opacity=1;const rel=wrap(Math.atan2(t.x-p.x,t.z-p.z)-p.h);ar.style.transform='rotate('+(-rel*57.3).toFixed(0)+'deg)';
   if(j.stage==='pickup'){S1.textContent=KIND[j.kind][0]+(j.kind==='delivery'?'':' | '+j.name);J.textContent='روح للدايرة الخضرا ووقف';D.textContent=Math.round(d)+' م'+(this.boardT>0?'  |  ركوب...':'')}
   else{const l=Math.ceil(j.left);S1.textContent=KIND[j.kind][0]+(j.fail?' | الراكب اتخض':'');J.textContent=l>=0?'الوقت: '+l+' ث':'متأخر '+(-l)+' ث';D.textContent=Math.round(d)+' م  |  '+(j.wi<j.wps.length?'المعلم: '+j.wps[j.wi].n:'وقف في الدايرة البرتقالي')}}
  this.drawMap(t)}
 drawMap(t){const c=$('rmap');if(!c||c.hidden)return;const x=c.getContext('2d'),S2=c.width,p=this.pl,R=240,k=S2/(2*R);x.clearRect(0,0,S2,S2);x.save();x.beginPath();x.arc(S2/2,S2/2,S2/2-1,0,7);x.clip();x.fillStyle='rgba(8,12,24,.55)';x.fillRect(0,0,S2,S2);
  x.translate(S2/2,S2/2);x.rotate(-Math.PI/2-Math.atan2(Math.cos(p.h),Math.sin(p.h)));x.translate(-p.x*k,-p.z*k);
  x.strokeStyle='rgba(235,235,230,.5)';x.lineCap='butt';for(let i=0;i<=NB;i++){x.lineWidth=2*HWN*k;if(Math.abs(sc(i)-p.x)<R+30){x.beginPath();x.moveTo(sc(i)*k,sc(0)*k);x.lineTo(sc(i)*k,sc(NB)*k);x.stroke()}x.lineWidth=2*hwEW(i)*k;if(Math.abs(sc(i)-p.z)<R+30){x.beginPath();x.moveTo(sc(0)*k,sc(i)*k);x.lineTo(sc(NB)*k,sc(i)*k);x.stroke()}}
  if(this.tl){const pa=Math.abs(Math.sin(p.h))>Math.abs(Math.cos(p.h))?'ew':'ns';
   for(const k2 in this.tl){const l=this.tl[k2],x0=sc(l.i),z0=sc(l.j);if(Math.abs(x0-p.x)<R&&Math.abs(z0-p.z)<R){const st=this.tlState(l),go=pa==='ew'?st==='ew':st==='ns',am=pa==='ew'?st==='ewa':st==='nsa';x.fillStyle=go?'#3fe070':am?'#ffb020':'#ff4030';x.fillRect(x0*k-2,z0*k-2,4,4)}}}
  x.fillStyle='rgba(255,255,255,.6)';for(const a of this.ag){if(Math.abs(a.veh.x-p.x)<R&&Math.abs(a.veh.z-p.z)<R){x.fillRect(a.veh.x*k-1.5,a.veh.z*k-1.5,3,3)}}
  if(t){const dx=t.x-p.x,dz=t.z-p.z,dd=Math.hypot(dx,dz),s=dd>R*.9?R*.9/dd:1;x.fillStyle=this.job.stage==='pickup'?'#30ff80':'#ff9a1f';x.beginPath();x.arc((p.x+dx*s)*k,(p.z+dz*s)*k,5,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=1.5;x.stroke()}
  x.restore();x.save();x.translate(S2/2,S2/2);x.fillStyle='#FF8A1F';x.beginPath();x.moveTo(0,-7);x.lineTo(5,6);x.lineTo(-5,6);x.closePath();x.fill();x.restore()}
}
S.winTex=winTex;S.glowTex=glowTex;S.Roam=Roam;})(window.SS);
