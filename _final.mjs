import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES=['/','/tickets','/faqs','/speakers','/our-story','/mission-purpose','/volunteer','/sponsors','/blooming-boutique','/contact-us'];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--disable-gpu']});
let bad=0,n=0; const issues=[];
for(const [w,vp] of [[1440,'desktop'],[390,'mobile']]){
  for(const path of PAGES){
    const p=await b.newPage();
    await p.setViewport({width:w,height:900,isMobile:w<500,hasTouch:w<500});
    const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,40)));
    await p.goto('https://www.moreconference.org'+path+'?cb='+Date.now(),{waitUntil:'networkidle2',timeout:50000});
    await new Promise(r=>setTimeout(r,2400));
    const d=await p.evaluate(()=>{
      const t=document.body.innerText||'';
      return {aug1:(t.match(/August 1\b/g)||[]).length, p406:(t.match(/406-0144/g)||[]).length,
        stale:(t.match(/April 2[45], 2026/g)||[]).length,
        ov:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth,
        broken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length,
        cta:[...document.querySelectorAll('.mc-herocta-box')].filter(c=>c.getBoundingClientRect().height>0).length};
    });
    n++; const pr=[];
    if(d.aug1)pr.push('Aug1'); if(d.p406)pr.push('406'); if(d.stale)pr.push('stale');
    if(d.ov>1)pr.push('overflow'); if(d.broken)pr.push('brokenImg'); if(errs.length)pr.push('js');
    if(path==='/'&&d.cta!==1)pr.push('cta='+d.cta);
    if(path!=='/'&&d.cta>0)pr.push('ctaLeak');
    if(pr.length){bad++; issues.push(vp+' '+path+': '+pr.join(','));}
    await p.close();
  }
}
console.log('FINAL REGRESSION: '+(n-bad)+'/'+n+' clean');
issues.forEach(i=>console.log('  ! '+i));
await b.close();
