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
  function a11y(p){
    // WCAG 2.3.3 reduced motion + 1.4.3 gold display-text contrast (gold gradient -> AA-passing bronze)
    injectCSS('mc-a11y',
      '@media (prefers-reduced-motion: reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}html{scroll-behavior:auto!important}.preSlide,.slideIn,.preFade{opacity:1!important;transform:none!important}}'+
      '.goldtext{background:none!important;-webkit-text-fill-color:#7a5c10!important;color:#7a5c10!important}');
    // 1.4.3 recolor failing solid-gold text (nav links, footer, form labels) to a bronze that clears 4.5:1 on cream
    try{[].forEach.call(document.querySelectorAll('a,span,p,h1,h2,h3,h4,h5,li,label,strong,em,small,b'),function(el){
      var has=false,cn=el.childNodes,i;for(i=0;i<cn.length;i++){if(cn[i].nodeType===3&&cn[i].textContent.trim()){has=true;break;}}
      if(!has)return; var c=getComputedStyle(el).color;
      if(/rgba?\(\s*201,\s*(163|154),\s*(38|46)/.test(c)){ el.style.setProperty('color','#7a5c10','important'); el.style.setProperty('-webkit-text-fill-color','#7a5c10','important'); }
    });}catch(e){}
    // 3.2.5 new-tab links: announce + rel=noopener; drop pointless target on tel/mailto
    try{[].forEach.call(document.querySelectorAll('a[target="_blank"]'),function(a){
      var h=a.getAttribute('href')||''; if(/^(tel:|mailto:)/i.test(h)){a.removeAttribute('target');return;}
      var rel=a.getAttribute('rel')||''; if(rel.indexOf('noopener')<0)a.setAttribute('rel',(rel+' noopener').trim());
      if(!a.getAttribute('data-mcnt')){var nm=(a.getAttribute('aria-label')||a.textContent||'').trim(); if(nm&&nm.indexOf('new tab')<0)a.setAttribute('aria-label',nm+' (opens in a new tab)'); a.setAttribute('data-mcnt','1');}
    });}catch(e){}
    // 1.3.1 demote empty headings (no text and no image) so AT does not announce a blank heading
    try{[].forEach.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'),function(h){ if(!h.textContent.trim()&&!h.querySelector('img')&&h.getAttribute('role')!=='presentation')h.setAttribute('role','presentation'); });}catch(e){}
    if(p===''||p==='/'){
      // 1.3.1/2.4.6 homepage H1 ("SparkleIN 2027") + stray preceding H2
      try{[].forEach.call(document.querySelectorAll('h1'),function(h){ if(/sparkle/i.test(h.textContent)&&!h.getAttribute('aria-label'))h.setAttribute('aria-label',"Sparkle, MORE Women's Conference 2027"); });}catch(e){}
      try{[].forEach.call(document.querySelectorAll('h2'),function(h){ if(/^\s*in\s+2027\s*$/i.test(h.textContent)){h.setAttribute('role','presentation');h.setAttribute('aria-hidden','true');} });}catch(e){}
      // 2.2.2 countdown: name it + keep AT from being interrupted each second (dates also stated in page text)
      try{var t=document.querySelector('#more-countdown,.timer'); if(t&&!t.getAttribute('data-mca')){t.setAttribute('role','timer');t.setAttribute('aria-label','Countdown to when tickets go live, August 1');t.setAttribute('aria-hidden','true');t.setAttribute('data-mca','1');}}catch(e){}
      // 2.4.4 unique names for repeated "Visit website" links
      try{[].forEach.call(document.querySelectorAll('a[aria-label="Visit website"]'),function(a){var h=a.getAttribute('href')||'';var d=h.replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];if(d)a.setAttribute('aria-label','Visit '+d);});}catch(e){}
    }
    // 1.3.1 contact page: two H1s -> demote the newsletter "Subscribe" H1 to level 2 for AT
    if(/contact-us/.test(p)){ try{[].forEach.call(document.querySelectorAll('h1'),function(h){ if(/^\s*subscribe\s*$/i.test(h.textContent)){h.setAttribute('role','heading');h.setAttribute('aria-level','2');} });}catch(e){} }
  }
  function apply(){
    var p=location.pathname.toLowerCase(), r={};
    [].forEach.call(document.querySelectorAll('a[href*="ticketspice.com"]'),function(a){a.setAttribute('href','/tickets');});
    [].forEach.call(document.querySelectorAll('span,h1,h2,h3,p,div'),function(el){ if(el.children.length===0 && /^\s*2026\s*$/.test(el.textContent)){ el.textContent=el.textContent.replace('2026','2027'); } });
    // remove orphan "script>" text nodes left by a malformed page header injection (boutique)
    try{ var bd=document.body; if(bd){ for(var n=bd.firstChild;n;){ var nx=n.nextSibling; if(n.nodeType===3){ var v=(n.nodeValue||'').replace(/\s+/g,''); if(v==='script>'||v==='</script>'||v==='script></script>'||v==='script>script>'){ bd.removeChild(n); r.strayScript=1; } } n=nx; } } }catch(e){}
    // fix the duplicated/placeholder browser-tab title on Mission & Purpose
    if(/mission-purpose/.test(p) && /General\s+2/i.test(document.title)){ document.title='Mission & Purpose — MORE Conference'; r.title=1; }
    injectCSS('mc-mcpg-fix','#mc,#mcpg{overflow-x:hidden}#mcpg .pg-title,#mcpg .pg-h,#mcpg .pg-eyebrow{overflow-wrap:anywhere}body.tweak-transparent-header #mcpg .pg-hero{padding-top:130px!important}@media(max-width:780px){#mcpg .pg-wrap{width:100%}#mcpg .pg-eyebrow{white-space:normal!important}#mcpg .pg-flor{max-width:42%}}');
    a11y(p);
    if(/contact-us/.test(p)){
      injectCSS('mc-contact-polish',
        "#sections h1,#sections h2,#sections h3{font-family:'Anton',sans-serif!important;letter-spacing:.01em!important}"+
        "#sections .sqs-block-form .form-button,#sections .sqs-block-form button[type=submit],#sections .newsletter-form-button,#sections .newsletter-form button{background:#9B1762!important;border-color:#9B1762!important;color:#fff!important;border-radius:7px!important;letter-spacing:.1em!important;text-transform:uppercase!important;font-family:'Inter',sans-serif!important}"
      );
      r.contact=1;
    }
    if(/our-story/.test(p)){
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
  function run(){ apply(); [400,1200,2500,4500,7000].forEach(function(d){setTimeout(apply,d);});
    if(window.MutationObserver){ var mo=new MutationObserver(function(){apply();}); try{ mo.observe(document.body,{childList:true,subtree:true}); setTimeout(function(){mo.disconnect();},9000); }catch(e){} } }
  if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded',run);
})();
