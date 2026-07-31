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
      try{var t=document.querySelector('#more-countdown,.timer'); if(t&&!t.getAttribute('data-mca')){t.setAttribute('role','timer');t.setAttribute('aria-label','Countdown to when tickets go live, August 20');t.setAttribute('aria-hidden','true');t.setAttribute('data-mca','1');}}catch(e){}
      // 2.4.4 unique names for repeated "Visit website" links
      try{[].forEach.call(document.querySelectorAll('a[aria-label="Visit website"]'),function(a){var h=a.getAttribute('href')||'';var d=h.replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];if(d)a.setAttribute('aria-label','Visit '+d);});}catch(e){}
    }
    // 1.3.1 contact page: two H1s -> demote the newsletter "Subscribe" H1 to level 2 for AT
    if(/contact-us/.test(p)){ try{[].forEach.call(document.querySelectorAll('h1'),function(h){ if(/^\s*subscribe\s*$/i.test(h.textContent)){h.setAttribute('role','heading');h.setAttribute('aria-level','2');} });}catch(e){} }
  }
  function apply(){
    var p=location.pathname.toLowerCase(), r={};
    // ticketspice repoint + standalone 2026→2027 swap REMOVED 2026-07-31: native content is correct,
    // and the repoint would break real TicketSpice links at the Aug 20 launch.
    // remove orphan "script>" text nodes left by a malformed page header injection (boutique)
    try{ var bd=document.body; if(bd){ for(var n=bd.firstChild;n;){ var nx=n.nextSibling; if(n.nodeType===3){ var v=(n.nodeValue||'').replace(/\s+/g,''); if(v==='script>'||v==='</script>'||v==='script></script>'||v==='script>script>'){ bd.removeChild(n); r.strayScript=1; } } n=nx; } } }catch(e){}
    // (mission-purpose "General 2" title patch removed 2026-07-08 — fixed natively in Page Settings SEO title)
    // mc-mcpg-fix CSS REMOVED 2026-07-31: #mc/#mcpg injectors are retired, selectors matched nothing.
    a11y(p);
    // 1.4.3 header legibility: the site header is transparent and full-bleed banner imagery sits
    // behind it, so nav text crossed cream AND dark foliage. Cream scrim keeps the nav on a stable
    // light backdrop (bronze #7a5c10 on this scrim stays above 5:1 even over the darkest leaves).
    // Gradient is the guarantee; backdrop-filter is progressive enhancement only.
    // footerAug matcher REMOVED 2026-07-31: the native footer newsletter text now says August 20.
    injectCSS('mc-hdr-legible',
      '#header{background:linear-gradient(180deg,rgba(250,246,234,.96) 0%,rgba(250,246,234,.94) 72%,rgba(250,246,234,.80) 100%)!important;-webkit-backdrop-filter:blur(10px) saturate(1.05);backdrop-filter:blur(10px) saturate(1.05)}'+
      '@media (prefers-reduced-transparency: reduce){#header{background:#FAF6EA!important;-webkit-backdrop-filter:none;backdrop-filter:none}}');
    // mc-moment-legible + mc-home CSS REMOVED 2026-07-31: they styled the #mc injected homepage,
    // which is now fully native (injector retired).
    // HERO CTA overlay REMOVED 2026-07-31: the native hero button was unhidden, relabeled
    // 'View Ticket Details' -> /tickets, and repositioned in the editor; the When/Where line now
    // lives natively in the hero lead text block. Nothing on Teri's pages is code-painted anymore.
    // Tier-price painters + /tickets setText batch REMOVED 2026-07-31: the native tickets page is the
    // single source of truth ("exact pricing announced August 20"); the group-rates passage was removed
    // natively. Confirmed 2027 prices for launch day live in LAUNCH.md + the TicketSpice build sheet:
    // Sat $69 (VIP upgrade $99), Full Weekend $99 (VIP $129), VIP Experience $129.
    // site-wide footer legal links (Privacy / Terms / Accessibility)
    try{ if(!document.getElementById('mc-legal-links')){ var foot=document.querySelector('#footer-sections')||document.querySelector('footer')||document.querySelector('.sqs-footer'); if(foot){ var bar=document.createElement('div'); bar.id='mc-legal-links'; bar.style.cssText='text-align:center;padding:16px 16px 30px;font-family:Inter,sans-serif;font-size:13px;letter-spacing:.05em'; bar.innerHTML='<a href="/privacy-policy" style="color:#156B6F;margin:0 9px;text-decoration:underline">Privacy Policy</a><a href="/terms-of-use" style="color:#156B6F;margin:0 9px;text-decoration:underline">Terms of Use</a><a href="/accessibility-statement" style="color:#156B6F;margin:0 9px;text-decoration:underline">Accessibility</a>'; foot.appendChild(bar); } } }catch(e){}
    // footer: stop the "scaled text" headings (MORE Conference / A Ministry of 58 Foundation) from overlapping on mobile
    injectCSS('mc-footer-fix','@media(max-width:899px){#footer-sections .sqsrte-scaled-text-container{height:auto!important;min-height:0!important}#footer-sections .sqsrte-scaled-text{font-size:clamp(1.6rem,8vw,2.8rem)!important;line-height:1.16!important;transform:none!important;display:inline-block!important;white-space:normal!important}#footer-sections h1,#footer-sections h2,#footer-sections h3,#footer-sections h4{line-height:1.16!important;margin-top:0!important}}');
    // footer newsletter signup: anchor id, readable text, and wire homepage "Notify Me" buttons to it
    try{ var _nl=document.querySelector('#footer-sections .sqs-block-newsletter'); if(_nl){ var _ns=_nl.closest('.page-section')||_nl.closest('section')||_nl; if(!_ns.id)_ns.id='mc-signup'; } }catch(e){}
    injectCSS('mc-signup-css','#footer-sections .newsletter-form-header-title{color:#9B1762!important;-webkit-text-fill-color:#9B1762!important}#footer-sections .sqs-block-newsletter p,#footer-sections .sqs-block-newsletter .form-submission-text,#footer-sections .sqs-block-newsletter .form-submission-html,#footer-sections .newsletter-form-field-element,#footer-sections .newsletter-form-field-element::placeholder{color:#33302b!important;-webkit-text-fill-color:#33302b!important}#mc-signup{scroll-margin-top:90px}');
    try{[].forEach.call(document.querySelectorAll('a[href="#contact"],a[href$="/#contact"]'),function(a){a.setAttribute('href','#mc-signup');});}catch(e){}
    // legal pages (privacy/terms/accessibility): force readable dark text + a proper full-width centered column
    if(/privacy-policy|\/terms|\/accessibility/.test(p)){
      injectCSS('mc-legal','#sections .fluid-engine .fe-block{grid-column:1/-1!important}.markdown-block .sqs-block-content{max-width:820px;margin:0 auto;text-align:left}.markdown-block,.markdown-block p,.markdown-block li,.markdown-block strong,.markdown-block em,.markdown-block td{color:#242424!important;-webkit-text-fill-color:#242424!important}.markdown-block h1,.markdown-block h2,.markdown-block h3,.markdown-block h4{color:#156B6F!important;-webkit-text-fill-color:#156B6F!important}.markdown-block a{color:#9B1762!important;-webkit-text-fill-color:#9B1762!important;text-decoration:underline}#mcpg,#sections .fluid-engine{overflow:visible}');
    }
    if(/contact-us/.test(p)){
      injectCSS('mc-contact-polish',
        "#sections h1,#sections h2,#sections h3{font-family:'Anton',sans-serif!important;letter-spacing:.01em!important}"+
        "#sections .sqs-block-form .form-button,#sections .sqs-block-form button[type=submit],#sections .newsletter-form-button,#sections .newsletter-form button{background:#9B1762!important;border-color:#9B1762!important;color:#fff!important;border-radius:7px!important;letter-spacing:.1em!important;text-transform:uppercase!important;font-family:'Inter',sans-serif!important}"
      );
      r.contact=1;
    }
    // NOTE: legacy de-2026 setText branches for our-story/sponsors/boutique removed 2026-07-08 —
    // those pages are fully rebuilt by their #mcpg injectors, so the old native strings no longer exist.
    // QAVA link wrap REMOVED 2026-07-31: dead since the sponsors list section went native (alt no longer
    // "QAVA"). Sponsor logos are unlinked by design in the simple list; enabling per-item buttons is a
    // visible redesign — Devin's call. QAVA url if wanted: https://qava.tv/welcome
    try{ if(window.localStorage && localStorage.getItem('mcdebug')) console.log('mc-pagefix', location.pathname, JSON.stringify(r)); }catch(e){}
  }
  // Interior injected pages (#mcpg/#mcsp) start at top:0 while the native Squarespace header is an
  // absolute/fixed overlay, so page titles render underneath it. Pad the first section to clear it.
  function fixHeaderClearance(){
    try{
      var wrap=document.querySelector('#mcpg,#mcsp'); if(!wrap) return;
      var hd=document.querySelector('#header'); if(!hd) return;
      var hpos=getComputedStyle(hd).position;
      if(hpos!=='absolute'&&hpos!=='fixed') return; // static header already reserves its own space
      var hh=hd.getBoundingClientRect().height; if(!(hh>0)) return;
      var sec=wrap.firstElementChild; if(!sec) return;
      if(!sec.getAttribute('data-mc-basepad')){
        sec.setAttribute('data-mc-basepad', parseFloat(getComputedStyle(sec).paddingTop)||0);
      }
      var base=parseFloat(sec.getAttribute('data-mc-basepad'))||0;
      var need=Math.round(hh+18);
      sec.style.paddingTop=Math.max(base,need)+'px';
    }catch(e){}
  }
  function run(){ apply(); [400,1200,2500,4500,7000].forEach(function(d){setTimeout(apply,d);});
    fixHeaderClearance(); [300,900,1800,3500].forEach(function(d){setTimeout(fixHeaderClearance,d);});
    window.addEventListener('resize',fixHeaderClearance); window.addEventListener('load',fixHeaderClearance);
    if(window.MutationObserver){ var mo=new MutationObserver(function(){apply();fixHeaderClearance();}); try{ mo.observe(document.body,{childList:true,subtree:true}); setTimeout(function(){mo.disconnect();},9000); }catch(e){} } }
  if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded',run);
})();
