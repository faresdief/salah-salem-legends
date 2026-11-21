(function(S){'use strict';
class AudioEngine{
 constructor(){this.ctx=null;this.muted=false}
 init(){try{if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return}
  const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=this.ctx=new A();
  this.m=c.createGain();this.m.gain.value=this.muted?0:.5;this.m.connect(c.destination);
  this.eo=c.createOscillator();this.eo.type='sawtooth';this.ef=c.createBiquadFilter();this.ef.type='lowpass';this.eg=c.createGain();this.eg.gain.value=0;
  this.eo.connect(this.ef);this.ef.connect(this.eg);this.eg.connect(this.m);this.eo.start();
  const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const n=c.createBufferSource();n.buffer=b;n.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;this.ng=c.createGain();this.ng.gain.value=0;
  n.connect(f);f.connect(this.ng);this.ng.connect(this.m);n.start();
 }catch(e){this.ctx=null}}
 update(pct,drift,on){const c=this.ctx;if(!c)return;const t=c.currentTime;
  this.eo.frequency.setTargetAtTime(45+pct*170,t,.05);this.ef.frequency.setTargetAtTime(300+pct*1300,t,.05);
  this.eg.gain.setTargetAtTime(on?.1+pct*.1:0,t,.08);this.ng.gain.setTargetAtTime(on&&drift?.12:0,t,.05)}
 tone(f,d,type,v,w,to){const c=this.ctx;if(!c)return;try{const t=c.currentTime+(w||0),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(this.m);o.start(t);o.stop(t+d+.02)}catch(e){}}
 horn(){this.tone(415,.55,'square',.08);this.tone(523,.55,'square',.08)}
 thud(){this.tone(110,.3,'sine',.4,0,35)}
 coin(){this.tone(988,.08,'square',.06);this.tone(1319,.2,'square',.06,.08)}
 flash(){this.tone(2200,.12,'triangle',.08)}
 mute(){this.muted=!this.muted;if(this.m)this.m.gain.value=this.muted?0:.5;return this.muted}
}
S.AudioEngine=AudioEngine;})(window.SS);
