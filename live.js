// Tester-Zähler (tester.json) und Neuigkeiten (news.json) – beides einfach auf GitHub bearbeiten
(function(){
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function two(de,en){return '<span data-lang="de">'+de+'</span><span data-lang="en">'+en+'</span>'}
  function get(f){return fetch(f+'?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()})}
  var MON={de:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
  function testers(d){
    var box=document.getElementById('tcount');if(!box)return;
    var n=Math.max(0,parseInt(d.testers,10)||0),g=Math.max(1,parseInt(d.goal,10)||12),pct=Math.min(100,Math.round(n/g*100));
    var de,en;
    if(n>=g){de='Geschafft – '+n+' Tester! Danke! Du kannst trotzdem noch mitmachen.<br/>Momentan haben sich 12 Tester für 2 zusammenhängende Tage angemeldet';en='We did it – '+n+' testers! Thank you! You can still join.<br/>Currently, 12 testers have signed up for 2 consecutive days'}
    else{var r=g-n;de='<b>'+n+' von '+g+'</b> Testern gefunden – noch '+r+(r===1?' fehlt':' fehlen')+'. Hilf mit!';en='<b>'+n+' of '+g+'</b> testers found – '+r+' to go. Help out!'}
    box.innerHTML='<p>'+two(de,en)+'</p><div class="tbar"><i style="width:'+pct+'%"></i></div>';
    box.hidden=false;
  }
  function news(d){
    var box=document.getElementById('news-list');if(!box)return;
    var l=(d.news||[]).slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
    if(!l.length){box.closest('section').hidden=true;return}
    box.innerHTML=l.map(function(e,i){
      var m=/^(\d{4})-(\d\d)-(\d\d)/.exec(e.date||''),dt=m?two(+m[3]+'. '+MON.de[m[2]-1]+' '+m[1],MON.en[m[2]-1]+' '+(+m[3])+', '+m[1]):'';
      return '<article class="card news'+(i>=3?' more':'')+'"><p class="ndate">'+dt+'</p><h3>'+two(esc(e.title),esc(e.title_en||e.title))+'</h3><p>'+two(esc(e.text),esc(e.text_en||e.text))+'</p></article>';
    }).join('');
    var b=document.getElementById('news-more');
    if(b&&l.length>3){b.hidden=false;b.onclick=function(){box.classList.add('all');b.hidden=true}}
  }
  document.addEventListener('DOMContentLoaded',function(){
    get('tester.json').then(testers).catch(function(){});
    get('news.json').then(news).catch(function(){var s=document.getElementById('news');if(s)s.hidden=true});
  });
})();
