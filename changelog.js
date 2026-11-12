// Changelog (changelog.json) – dieselbe Datei liest auch das Spiel (Einstellungen -> Neuigkeiten).
// changelog.html zeigt alles (#cl-list), die Startseite eine Kurzfassung (#cl-teaser) mit "Mehr lesen".
// Einträge ohne Datum gelten als "noch nicht veröffentlicht" und werden nicht gezeigt.
(function(){
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function two(de,en){return '<span data-lang="de">'+de+'</span><span data-lang="en">'+en+'</span>'}
  var MON={de:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],en:['January','February','March','April','May','June','July','August','September','October','November','December']};
  var SECS=[['neu','Neu','New'],['bal','Balance','Balance'],['fix','Gefixt','Fixed']];
  var SHOW=3, TEASER=3, TEASER_ITEMS=3;
  function date(d){var m=/^(\d{4})-(\d\d)-(\d\d)/.exec(d||'');if(!m)return '';return two(+m[3]+'. '+MON.de[m[2]-1]+' '+m[1],MON.en[m[2]-1]+' '+(+m[3])+', '+m[1])}
  function anchor(e){return 'v'+String(e.label||e.id).replace(/[^0-9a-zA-Z]+/g,'-')}
  function item(it){
    var t=esc(it[0]),s=esc(it[1]||''),te=esc(it[2]||it[0]),se=esc(it[3]||it[1]||'');
    return '<li><div class="clt">'+two(t,te)+'</div>'+(s||se?'<div class="cls">'+two(s,se)+'</div>':'')+'</li>';
  }
  function head(e,i){
    var cnt=SECS.map(function(k){var n=(e[k[0]]||[]).length;return n?n+' '+two(k[1].toLowerCase(),k[2].toLowerCase()):''}).filter(Boolean).join(' · ');
    return '<div class="clhead"><div class="clver">'+esc(e.label||e.id)+'</div>'
      +'<div><p class="cldate">'+date(e.date)+(i===0?' <span class="clnow">'+two('Aktuell','Latest')+'</span>':'')+'</p>'
      +'<h3>'+two(esc(e.title),esc(e.title_en||e.title))+'</h3><p class="clcount">'+cnt+'</p></div></div>';
  }
  function entry(e,i){
    var secs=SECS.map(function(k){
      var l=e[k[0]]||[];if(!l.length)return '';
      return '<div class="clsec '+k[0]+'"><h4><span class="cltag '+k[0]+'">'+two(k[1],k[2])+'</span></h4><ul>'+l.map(item).join('')+'</ul></div>';
    }).join('');
    return '<article id="'+anchor(e)+'" class="clv'+(i===0?' latest':'')+(i>=SHOW?' more':'')+'">'+head(e,i)+'<div class="clbody">'+secs+'</div></article>';
  }
  // Kurzfassung für die Startseite: die ersten Punkte, dann "Mehr lesen"
  function teaser(e,i){
    var all=[];SECS.forEach(function(k){(e[k[0]]||[]).forEach(function(it){all.push([k,it])})});
    var rest=all.length-TEASER_ITEMS;
    var lis=all.slice(0,TEASER_ITEMS).map(function(p){
      var it=p[1];return '<li class="'+p[0][0]+'"><div class="clt">'+two(esc(it[0]),esc(it[2]||it[0]))+'</div>'+(it[1]?'<div class="cls">'+two(esc(it[1]),esc(it[3]||it[1]))+'</div>':'')+'</li>';
    }).join('');
    return '<article class="clv clteaser'+(i===0?' latest':'')+'">'+head(e,i)
      +'<div class="clbody"><ul class="clmini">'+lis+'</ul>'
      +(rest>0?'<p class="clrest">'+two('+ '+rest+' weitere','+ '+rest+' more')+'</p>':'')
      +'<a class="btn small clread" href="changelog.html#'+anchor(e)+'">'+two('Mehr lesen','Read more')+' →</a></div></article>';
  }
  function load(){return fetch('changelog.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
    var l=(d.news||d||[]).filter(function(e){return e&&e.id&&e.title&&/^\d{4}-\d\d-\d\d/.test(e.date||'')});
    l.sort(function(a,b){return String(b.date).localeCompare(String(a.date))});return l})}
  function full(l){
    var box=document.getElementById('cl-list');
    if(!l.length){box.innerHTML='<p class="clempty">'+two('Noch keine Einträge.','No entries yet.')+'</p>';return}
    box.innerHTML=l.map(entry).join('');
    var b=document.getElementById('cl-more');
    if(l.length>SHOW){b.hidden=false;b.onclick=function(){box.classList.add('all');b.hidden=true}}
    // von der Startseite gekommen: zur Version springen und kurz hervorheben
    var id=decodeURIComponent((location.hash||'').slice(1)), t=id&&document.getElementById(id);
    if(t){
      if(t.classList.contains('more')){box.classList.add('all');b.hidden=true}
      setTimeout(function(){t.scrollIntoView({behavior:'smooth',block:'start'});t.classList.add('flash');setTimeout(function(){t.classList.remove('flash')},2200)},120);
    }
  }
  function short(l){
    var box=document.getElementById('cl-teaser');
    if(!l.length){box.closest('section').hidden=true;return}
    box.innerHTML=l.slice(0,TEASER).map(teaser).join('');
  }
  document.addEventListener('DOMContentLoaded',function(){
    var f=document.getElementById('cl-list'), s=document.getElementById('cl-teaser');
    if(!f&&!s)return;
    load().then(function(l){if(f)full(l);if(s)short(l)}).catch(function(){
      if(f)f.innerHTML='<p class="clempty">'+two('Der Changelog konnte gerade nicht geladen werden.','The changelog could not be loaded right now.')+'</p>';
      if(s)s.closest('section').hidden=true;
    });
  });
})();
