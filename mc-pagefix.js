/* MORE 2027 live-page de-2026 patches (About / Sponsors / Boutique) */
(function(){
  function smallestWith(snip){
    var all=document.querySelectorAll('h1,h2,h3,h4,h5,p,a,span,div,li,button');
    var best=null, bl=1e9;
    for(var i=0;i<all.length;i++){
      var t=all[i].textContent||'';
      if(t.indexOf(snip)>-1 && t.length<bl){ best=all[i]; bl=t.length; }
    }
    return best;
  }
  function setText(snip,nu){ var el=smallestWith(snip); if(el){ el.textContent=nu; return 1; } return 0; }
  function hideBlock(snip){ var el=smallestWith(snip); if(el){ (el.closest('.sqs-block,.fe-block,p,section')||el).style.display='none'; return 1; } return 0; }
  function apply(){
    var p=location.pathname.toLowerCase(), r={};
    if(/\/about(\/|$)/.test(p)){
      r.joinBtn=setText('Join Us at MORE 2026','Join Us at MORE 2027');
    }
    if(/\/sponsors(\/|$)/.test(p)){
      r.headline=setText('Supporting the Women of MORE 2026','Supporting the Women of MORE 2027');
      r.proposal=setText('View 2026 Sponsorship Proposal','View Sponsorship Proposal');
      r.ourSponsors=setText('Our 2026 Sponsors','Our Sponsors');
      r.expands=setText('In 2026, MORE expands to a two-day event','MORE is a two-day event at the Tinley Park Convention Center, featuring a Friday evening session and growing reach across the region.');
      r.hideLineup=hideBlock('strong recognition and added visibility');
    }
    if(/blooming-boutique/.test(p)){
      r.shops=setText('2026 Featured Shops','Featured Shops');
      r.partners=setText('2026 Featured Partners','Featured Partners');
    }
    try{ console.log('mc-pagefix', location.pathname, JSON.stringify(r)); }catch(e){}
  }
  function run(){ apply(); setTimeout(apply,1200); }
  if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded',run);
})();
