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
  function injectCSS(id,css){ if(document.getElementById(id))return; var s=document.createElement('style'); s.id=id; s.textContent=css; document.head.appendChild(s); }
  function apply(){
    var p=location.pathname.toLowerCase(), r={};
    [].forEach.call(document.querySelectorAll('a[href*="ticketspice.com"]'),function(a){a.setAttribute('href','/tickets');});
    if(/contact-us/.test(p)){
      injectCSS('mc-contact-polish',
        "#sections h1,#sections h2,#sections h3{font-family:'Anton',sans-serif!important;letter-spacing:.01em!important}"+
        "#sections .sqs-block-form .form-button,#sections .sqs-block-form button[type=submit],#sections .newsletter-form-button,#sections .newsletter-form button{background:#9B1762!important;border-color:#9B1762!important;color:#fff!important;border-radius:7px!important;letter-spacing:.1em!important;text-transform:uppercase!important;font-family:'Inter',sans-serif!important}"
      );
      r.contact=1;
    }
    if(/\/about(\/|$)/.test(p)){
      r.joinBtn=setText('Join Us at MORE 2026','Join Us at MORE 2027');
    }
    if(/\/sponsors(\/|$)/.test(p)){
      r.headline=setText('Supporting the Women of MORE 2026','Supporting the Women of MORE 2027');
      r.proposal=setText('View 2026 Sponsorship Proposal','View Sponsorship Proposal');
      r.ourSponsors=setText('Our 2026 Sponsors','Our Sponsors');
      r.expands=setText('In 2026, MORE expands to a two-day event','MORE is a two-day event at the Tinley Park Convention Center, featuring a Friday evening session and growing reach across the region.');
      r.lineup=setText('MORE 2026 features','MORE offers a lineup that brings strong recognition and added visibility to the event. MORE 2027 features keynote speakers Annie F. Downs and Sheila Walsh, comedian JJ Barrows, host Stephanie Reynolds, and more.');
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
