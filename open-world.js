(function(S){'use strict';
class OpenWorldManager{
 constructor(){this.current='salah';this.routes={
  salah:{name:'صلاح سالم',next:'corniche',chunks:[[[25,25,25,0,0],[25,25,25,2,0]],[[30,40,30,0,40],[30,40,30,0,-40]],[[25,30,25,-3,0],[20,50,20,0,20]],[[25,40,25,4,-20],[30,30,30,-2,0]]]},
  corniche:{name:'كورنيش النيل',next:'ring',chunks:[[[40,60,40,1,0],[30,30,30,-2,0]],[[40,60,40,2,10],[30,30,30,0,-10]]]},
  ring:{name:'الطريق الدائري',next:'desert',chunks:[[[50,80,50,0,30],[40,40,40,3,0]],[[40,60,40,-3,-30]]]},
  desert:{name:'طريق الإسكندرية الصحراوي',next:'salah',chunks:[[[60,120,60,0,0],[50,60,50,1,20]],[[60,100,60,-1,-20]]]}}}
 route(id){return this.routes[id]||this.routes.salah}
 link(a,b){if(this.routes[a]&&this.routes[b])this.routes[a].next=b}
 sections(id){const out=[];for(const ch of this.route(id).chunks)for(const s of ch)out.push(s);return out}
}
S.OpenWorldManager=OpenWorldManager;})(window.SS);
