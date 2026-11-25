(function(S){'use strict';
// All sounds are synthesized with the Web Audio API. No external audio files,
// so nothing here needs a license or a credit line.
const PROF={
verna:{b:52,s:235,m:[1,.5,2.01],t:['sawtooth','square','sawtooth'],f:1,g:1,w:[37,.004]},
taxi:{b:46,s:200,m:[1,.5,1.99],t:['square','square','sawtooth'],f:.75,g:1.05,w:[29,.012]},
micro:{b:38,s:165,m:[1,.5,1.5],t:['sawtooth','square','square'],f:.65,g:1.15,w:[23,.01]},
fiat:{b:60,s:270,m:[1,.5,2.01],t:['sawtooth','sawtooth','sawtooth'],f:1.25,g:.95,w:[47,.006]},
empow:{b:56,s:235,m:[1,.5,3],t:['sawtooth','sine','sawtooth'],f:1.1,g:.95,w:[41,.002]},
amg:{b:33,s:150,m:[1,.5,1.5],t:['sawtooth','square','sawtooth'],f:1.2,g:1.3,w:[19,.018]},
m4:{b:43,s:190,m:[1,.5,2.5],t:['sawtooth','sawtooth','square'],f:1.35,g:1.15,w:[31,.008]},
p911:{b:62,s:310,m:[1,.5,2.02],t:['sawtooth','sawtooth','square'],f:1.6,g:1.1,w:[53,.005]}};
class AudioEngine{
 constructor(){this.ctx=null;this.muted=false;this.pThr=0;this.crk=0}
 init(){try{if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return}
 const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=this.ctx=new A();
 this.m=c.createGain();this.m.gain.value=this.muted?0:.55;this.m.connect(c.destination);
 // Engine: saw + sub-square + detuned harmonic through a lowpass. Pitch and
 // filter follow RPM; a second pair of oscillators adds a growl an octave down.
 this.eo=[];const mk=(type,f,g)=>{const o=c.createOscillator();o.type=type;o.frequency.value=f;const gn=c.createGain();gn.gain.value=g;o.connect(gn);return{o,g:gn}};
 this.ef=c.createBiquadFilter();this.ef.type='lowpass';this.ef.frequency.value=400;this.ef.Q.value=1.1;
 this.eg=c.createGain();this.eg.gain.value=0;this.ef.connect(this.eg);this.eg.connect(this.m);
 const e1=mk('sawtooth',60,.5),e2=mk('square',30,.55),e3=mk('sawtooth',121,.16);
 for(const e of[e1,e2,e3]){e.g.connect(this.ef);e.o.start();this.eo.push(e)}
 // Tyre/skid noise
 const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const n=c.createBufferSource();n.buffer=b;n.loop=true;
 const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1900;f.Q.value=.8;this.ng=c.createGain();this.ng.gain.value=0;
 n.connect(f);f.connect(this.ng);this.ng.connect(this.m);n.start();
 // Intake/exhaust breath: same noise through a low band that follows RPM
 const n2=c.createBufferSource();n2.buffer=b;n2.loop=true;
 this.xf=c.createBiquadFilter();this.xf.type='bandpass';this.xf.frequency.value=300;this.xf.Q.value=1.4;
 this.xg=c.createGain();this.xg.gain.value=0;n2.connect(this.xf);this.xf.connect(this.xg);this.xg.connect(this.m);n2.start();
 }catch(e){this.ctx=null}}
 ambInit(){const c=this.ctx;if(this.A||!c)return;const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const src=(type,fr,q)=>{const n=c.createBufferSource();n.buffer=b;n.loop=true;const f=c.createBiquadFilter();f.type=type;f.frequency.value=fr;f.Q.value=q;const g=c.createGain();g.gain.value=0;n.connect(f);f.connect(g);g.connect(this.m);n.start();return g};
 this.A={rain:src('highpass',3200,.5),wind:src('lowpass',500,.6),city:src('bandpass',140,.7)};
 const o=c.createOscillator();o.type='sine';o.frequency.value=4300;const l=c.createOscillator();l.frequency.value=13;const lg=c.createGain();lg.gain.value=.5;const cg=c.createGain();cg.gain.value=0;const lm=c.createGain();lm.gain.value=.5;
 l.connect(lg);lg.connect(lm.gain);o.connect(lm);lm.connect(cg);cg.connect(this.m);o.start();l.start();this.A.cri=cg}
 amb(atm,on){const c=this.ctx;if(!c)return;this.ambInit();const t=c.currentTime,A=this.A,w=on?{rain:atm==='rain'?.07:0,wind:atm==='fog'?.05:.018,city:atm==='night'?.02:.035,cri:atm==='night'?.012:0}:{rain:0,wind:0,city:0,cri:0};
 for(const k in w)A[k].gain.setTargetAtTime(w[k],t,.6)}
 update(pct,drift,on,thr){const c=this.ctx;if(!c)return;const t=c.currentTime;this.amb(this.atm,on);pct=Math.max(0,Math.min(1,pct||0));thr=thr||0;
 const P=PROF[this.prof]||PROF.verna;if(this._pk!==this.prof){this._pk=this.prof;for(let i=0;i<3;i++)this.eo[i].o.type=P.t[i]}
 const base=P.b+pct*P.s,load=on?(.35+thr*.65):0;
 for(let i=0;i<3;i++){const o=this.eo[i].o;o.frequency.setTargetAtTime(base*P.m[i]*(1+Math.sin(t*P.w[0]+i)*P.w[1]),t,.03)}
 this.ef.frequency.setTargetAtTime((280+pct*900+thr*1400)*P.f,t,.05);
 this.eg.gain.setTargetAtTime(on?(.06+pct*.05+thr*.09)*P.g:0,t,.06);
 this.xf.frequency.setTargetAtTime(160+pct*420,t,.05);
 this.xg.gain.setTargetAtTime(on?(.015+thr*.05):0,t,.08);
 this.ng.gain.setTargetAtTime(on&&drift?.13:0,t,.05);
 // Exhaust crackle when lifting off at revs
 if(on&&this.pThr>.55&&thr<.15&&pct>.45&&this.crk<=0){this.crk=.25+Math.random()*.3}
 this.pThr=thr;
 if(this.crk>0){this.crk-=1/60;if(Math.random()<.16)this.tone(70+Math.random()*90,.05,'square',.045)}}
 tone(f,d,type,v,w,to){const c=this.ctx;if(!c)return;try{const t=c.currentTime+(w||0),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
 if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(this.m);o.start(t);o.stop(t+d+.02)}catch(e){}}
 horn(){this.tone(415,.55,'square',.08);this.tone(523,.55,'square',.08)}
 thud(){this.tone(110,.3,'sine',.4,0,35)}
 coin(){this.tone(988,.08,'square',.06);this.tone(1319,.2,'square',.06,.08)}
 flash(){this.tone(2200,.12,'triangle',.08)}
 unlock(){this.tone(660,.1,'square',.07);this.tone(880,.1,'square',.07,.1);this.tone(1320,.22,'square',.07,.2)}
 music(st){const c=this.ctx;if(!c)return;if(this.mtm){clearInterval(this.mtm);this.mtm=null}if(!st)return;let i=0;const sc=st===1?[0,3,5,7,10,12,10,7]:[0,4,7,12,7,4],base=st===1?220:262,tp=st===1?'triangle':'square';this.mtm=setInterval(()=>{if(this.muted)return;const n=sc[i%sc.length];i++;this.tone(base*Math.pow(2,n/12),.24,tp,.045);if(i%2===0)this.tone(base/4,.32,'sine',.05)},290)}
 mute(){this.muted=!this.muted;if(this.m)this.m.gain.value=this.muted?0:.55;return this.muted}
}
S.AudioEngine=AudioEngine;})(window.SS);
