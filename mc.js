var B="https://images.squarespace-cdn.com/content/v1/66918331110d39781bf46716/";
var spk=[
 ["Keynote","Annie F. Downs","ab2ced19-1ae6-4ce6-b48f-d27a127654e7/annie-f-downs.jpg","https://www.anniefdowns.com/"],
 ["Keynote","Sheila Walsh","57658043-c3d9-4eaf-b197-814bbf1e0780/sheila-walsh.jpg","https://sheilawalsh.com/"],
 ["Comedian","JJ Barrows","a4af5029-403e-4bdb-91fb-ac64174b2db1/jj-barrows.jpg","https://jjbarrows.com/"],
 ["Friday Speaker","Debbie Del Priore","a188be47-2925-4821-b3f3-197e39b21277/Debbie.jpg","https://www.58-foundation.org/team"],
 ["Friday Speaker","Audra Smith","a22385ef-1879-412a-a827-67c0b61b6e55/Audra+Headshot.jpg","https://www.58-foundation.org/team"],
 ["Host","Stephanie Reynolds","a0a54382-66c5-4967-92df-fdbfd5d27b4c/steph.jpg","https://www.58-foundation.org/team"],
 ["Saturday Speaker","Teri Erickson","a730aa12-8e0e-4ba3-9d2c-0f99e5f05946/Teri+heaadshot.jpg","https://www.58-foundation.org/team"]
];
var ICON='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"><path d="M7 17L17 7M9 7h8v8"/></svg>';
document.getElementById('track').innerHTML=spk.map(function(s){return '<div class="spk"><div class="ph"><img src="'+B+s[2]+'?format=600w"></div><div class="nm">'+s[1]+'<a class="lnk" href="'+s[3]+'" target="_blank" rel="noopener" aria-label="Visit website">'+ICON+'</a></div><div class="role">'+s[0]+'</div></div>';}).join('');
// countdown to Aug 1 2026 (tickets live)
var T=new Date('2026-08-01T00:00:00-05:00').getTime();
function tick(){var d=T-Date.now();if(d<0)d=0;var dd=Math.floor(d/864e5),hh=Math.floor(d%864e5/36e5),mm=Math.floor(d%36e5/6e4),ss=Math.floor(d%6e4/1e3);
 document.getElementById('d').textContent=String(dd).padStart(2,'0');document.getElementById('h').textContent=String(hh).padStart(2,'0');document.getElementById('m').textContent=String(mm).padStart(2,'0');document.getElementById('s').textContent=String(ss).padStart(2,'0');}
tick();setInterval(tick,1000);
// speaker carousel arrows
(function(){
 var track=document.getElementById('track');
 var L=document.querySelector('.feat .arw.l'), R=document.querySelector('.feat .arw.r');
 var idx=0;
 function vis(){return window.innerWidth>780?4:track.children.length;}
 function maxI(){return Math.max(0, track.children.length - vis());}
 function apply(){
  if(window.innerWidth<=780){track.style.transform='';return;}
  var c=track.children[0]; if(!c)return;
  var cw=c.getBoundingClientRect().width;
  track.style.transform='translateX('+(-(idx*(cw+18)))+'px)';
 }
 function go(d){ idx=Math.min(maxI(),Math.max(0,idx+d)); apply(); }
 if(L)L.addEventListener('click',function(){go(-1);});
 if(R)R.addEventListener('click',function(){go(1);});
 window.addEventListener('resize',function(){ idx=window.innerWidth<=780?0:Math.min(idx,maxI()); apply(); });
})();