// Sprache: gespeicherte Wahl, sonst Browser-Sprache (Deutsch -> de, sonst en)
(function(){
  var l=null; try{l=localStorage.getItem('lang')}catch(e){}
  if(l!=='de'&&l!=='en'){l=(navigator.language||'de').toLowerCase().indexOf('de')===0?'de':'en'}
  document.documentElement.lang=l;
  window.setLang=function(x){document.documentElement.lang=x;try{localStorage.setItem('lang',x)}catch(e){}
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.l===x)})};
  document.addEventListener('DOMContentLoaded',function(){window.setLang(document.documentElement.lang)});
})();
