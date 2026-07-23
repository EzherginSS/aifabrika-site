/* ======================================================================
   AI-Фабрика — общая логика сайта
   Ожидает (опционально) глобальный словарь window.I18N = { en: {...} }
   для перевода элементов с атрибутом data-i.
   ====================================================================== */
(function(){
  "use strict";

  /* ---- генерация монолинейной «іскри» (signature-логотип) ---- */
  function rays(cx,cy,rin,rout,w,count){
    var s="";
    for(var i=0;i<count;i++){
      var a=(i/count)*Math.PI*2;
      var len=rout*(0.62+0.38*Math.abs(Math.sin(i*1.7)));
      var x1=cx+Math.cos(a)*rin, y1=cy+Math.sin(a)*rin;
      var x2=cx+Math.cos(a)*len, y2=cy+Math.sin(a)*len;
      var dly=(i*0.11).toFixed(2);
      s+='<line class="ray" x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+
         '" y2="'+y2.toFixed(1)+'" stroke="url(#g1)" stroke-width="'+w+
         '" stroke-linecap="round" style="animation-delay:'+dly+'s"/>';
    }
    return s;
  }
  var big=rays(210,210,84,200,2.4,24);
  var small=rays(210,210,150,205,18,14);
  var bs=document.getElementById('bigspark'); if(bs) bs.innerHTML=big;
  ['footspark','navspark'].forEach(function(id){
    var g=document.getElementById(id); if(g) g.innerHTML=small;
  });

  /* ---- scroll reveal ---- */
  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);} });
    },{threshold:.14});
    reveals.forEach(function(el){io.observe(el);});
  } else {
    reveals.forEach(function(el){el.classList.add('in');});
  }

  /* ---- burger (mobile) ---- */
  var burger=document.querySelector('.burger');
  if(burger){
    burger.addEventListener('click',function(){
      var m=document.querySelector('.menu'); if(!m)return;
      var open=m.style.display==='flex';
      m.style.display=open?'none':'flex';
      m.style.position='absolute';m.style.flexDirection='column';m.style.gap='16px';
      m.style.top='72px';m.style.right='22px';
      m.style.background='var(--panel-2)';m.style.padding='18px 24px';
      m.style.borderRadius='12px';m.style.border='1px solid var(--line)';
    });
  }

  /* ---- на мобилке шапка-CTA скрыта → добавляем «Замовити» в бургер-меню ---- */
  var menuEl=document.querySelector('.menu');
  if(menuEl && !menuEl.querySelector('.only-mobile')){
    var oa=document.createElement('a');
    oa.href='order.html'; oa.className='only-mobile';
    oa.setAttribute('data-i','m_order'); oa.textContent='Замовити';
    menuEl.appendChild(oa);
  }

  /* ---- UA/EN переключатель (переживает переход между страницами) ---- */
  var T=window.I18N||{en:{}};
  var UK={};
  document.querySelectorAll('[data-i]').forEach(function(el){UK[el.dataset.i]=el.innerHTML;});

  function setLang(l){
    document.querySelectorAll('[data-i]').forEach(function(el){
      var k=el.dataset.i;
      var v=(l==='en') ? ((T.en&&T.en[k]!=null)?T.en[k]:UK[k]) : UK[k];
      if(v!=null) el.innerHTML=v;
    });
    document.documentElement.lang=l;
    document.querySelectorAll('.lang button').forEach(function(b){
      b.classList.toggle('on', b.dataset.lang===l);
    });
    try{ localStorage.setItem('fab_lang', l); }catch(e){}
  }
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){ setLang(b.dataset.lang); });
  });
  // применить сохранённый выбор при загрузке
  var saved='uk';
  try{ saved=localStorage.getItem('fab_lang')||'uk'; }catch(e){}
  if(saved==='en') setLang('en');

  window.fabSetLang=setLang;
})();
