(function(){'use strict';
const C={bg:'#121212',panel:'#1E1E1E',b1:'#2E2E2E',b2:'#4A4A4A',gold:'#D4AF37',red:'#B22222',text:'#F5F5F5',mute:'#A0A0A0',asph:'#1A1A1A',cone:'#D9531E',sky:{night:'#0D1117',morning:'#2C3E50',fog:'#3A3F44'}};
const P={segLen:200,roadW:2000,rumbleLen:3,camH:1000,fov:100,draw:170,maxSpeed:12000,lanes:[-.75,-.25,.25,.75],radarLimit:140,fog:{night:5,morning:3,fog:12}};
const CARS=[
{id:'verna',name:'هيونداي فيرنا 2012',body:'#4A4A4A',cab:'#3A3F44',h:.62,bt:.5,ex:1,top:.7,acc:.9,hnd:.85,mass:.5,drift:.5},
{id:'taxi',name:'تاكسي القاهرة',body:'#E8E8E8',cab:'#1E1E1E',h:.64,bt:.5,ex:1,sign:1,top:.75,acc:.75,hnd:1,mass:.55,drift:.6},
{id:'micro',name:'ميكروباص أبيض',body:'#E8E8E8',cab:'#E8E8E8',h:.95,bt:.82,ex:1,win:1,ladder:1,stripe:'#B22222',top:.6,acc:.55,hnd:.5,mass:1,drift:.3},
{id:'fiat',name:'فيات 128 / شاهين',body:'#D9531E',cab:'#1E1E1E',h:.55,bt:.5,ex:2,tw:.24,top:1,acc:.7,hnd:.65,mass:.3,drift:1}];
const TR=[{body:'#A0A0A0',cab:'#3A3F44',h:.6,bt:.5,ex:1},{body:'#2E2E2E',cab:'#1E1E1E',h:.62,bt:.5,ex:1},{body:'#E8E8E8',cab:'#E8E8E8',h:.95,bt:.82,win:1,ex:1},{body:'#E8E8E8',cab:'#1E1E1E',h:.64,bt:.5,sign:1,ex:1}];
window.SS={C,P,CARS,TR};})();
