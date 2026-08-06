/**
 * Scroll-reveal bootstrap, injected inline into <head>.
 *
 * Why this is not a React effect
 * -----------------------------
 * `.reveal` sections used to be hidden by plain CSS (`opacity: 0`) and only
 * un-hidden by ClientEffects' IntersectionObserver, which runs after React
 * hydrates. That had two failure modes, both of which showed up as "the page
 * glitches":
 *
 *   1. With JavaScript off — or blocked, or still downloading — everything
 *      below the hero stayed permanently invisible. A full-page screenshot
 *      with JS disabled showed the hero, the trust strip, and then nothing.
 *   2. Even with JS on, the gap between first paint and hydration is the whole
 *      React bundle. On a slow connection the page paints a hero over an empty
 *      void, then the rest of the site pops in at once.
 *
 * Running the same observer from an inline <head> script fixes both. The
 * hidden state is now applied by `html.js-reveal`, a class this script adds
 * itself, so a browser that never executes it simply renders the page fully
 * visible — the correct no-JS fallback. And binding happens at DOMContentLoaded
 * (HTML parsed) rather than after hydration, which is seconds earlier on a
 * slow connection.
 *
 * `window.__reveal.bind()` is exposed so ClientEffects can re-run it after a
 * client-side navigation, where new `.reveal` nodes appear without a reload.
 *
 * Kept as a hand-written string rather than a module because it has to run
 * before first paint, and anything imported through the bundler cannot.
 */
export const REVEAL_BOOTSTRAP = `(function(){
var d=document,r=d.documentElement;
if(!('IntersectionObserver' in window)||!d.querySelectorAll){return}
r.className+=' js-reveal';
var io=null;
function activate(el){el.classList.add('active')}
/* Content that is ALREADY on screen must not animate. Adding 'reveal-instant'
   suppresses the transition, so it is simply painted rather than faded up
   from nothing. Two reasons: fading in what the user is already looking at
   reads as a flash, and a section caught mid-fade is genuinely low-contrast —
   an accessibility checker sampling during those 800ms measures the blended
   colour and reports the text as unreadable, because for that moment it is. */
function activateNow(el){el.classList.add('reveal-instant');el.classList.add('active')}
function bind(){
  if(io){io.disconnect()}
  io=new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){if(es[i].isIntersecting){activate(es[i].target);io.unobserve(es[i].target)}}
  },{threshold:0.1,rootMargin:'0px 0px -10% 0px'});
  var els=d.querySelectorAll('.reveal'),vh=window.innerHeight||0;
  for(var i=0;i<els.length;i++){
    var el=els[i],b=el.getBoundingClientRect();
    if(b.top<vh*0.9&&b.bottom>0){activateNow(el)}
    else{el.classList.remove('active');el.classList.remove('reveal-instant');io.observe(el)}
  }
}
window.__reveal={bind:bind};
if(d.readyState==='loading'){d.addEventListener('DOMContentLoaded',bind)}else{bind()}
/* Belt and braces: if anything above throws or a section is somehow never
   observed, nothing stays invisible for more than a moment. */
setTimeout(function(){
  var els=d.querySelectorAll('.reveal');
  for(var i=0;i<els.length;i++){
    var b=els[i].getBoundingClientRect();
    if(b.top<(window.innerHeight||0)&&b.bottom>0){activateNow(els[i])}
  }
},2500);
})();`;
