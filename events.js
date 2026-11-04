// Event-Kalender: liest events.json (dieselbe Datei wie das Spiel) und zeigt laufende und kommende Events
(function(){
  var MON={de:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
  var BON={flames:['Flammen','flames'],treats:['Leckerlies','treats'],offline:['Offline-Geld','offline money'],all:['alles','everything']};
  var CUR={'Lebkuchen':'gingerbread'};
  var ICO={xmas:'🎄',hearts:'💖',spring:'🌸',summer:'☀️',halloween:'🎃',neutral:'✨',bonus:'🔥'};
  var MAX=6;
  var NAME={'Weihnachts-Event':'Christmas event','Silvester-Bonus':'New Year\'s bonus','Bonus-Wochenende':'Bonus weekend','Tester-Event':'Tester event'};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function t(s){var m=/^(\d{4})-(\d\d)-(\d\d)(?:[ T](\d\d):(\d\d))?/.exec(s||'');return m?new Date(+m[1],m[2]-1,+m[3],+(m[4]||0),+(m[5]||0)):null}
  function two(de,en){return '<span data-lang="de">'+de+'</span><span data-lang="en">'+en+'</span>'}
  function day(d,l){return d.getDate()+'. '+MON[l][d.getMonth()]}
  function range(a,b,l){
    var s=day(a,l),e=day(b,l);
    if(l==='en'){s=MON.en[a.getMonth()]+' '+a.getDate();e=MON.en[b.getMonth()]+' '+b.getDate()}
    return a.toDateString()===b.toDateString()?s:s+' – '+e;
  }
  function left(ms){var d=Math.floor(ms/864e5),h=Math.floor(ms/36e5);
    if(d>=1)return [ 'noch '+d+(d===1?' Tag':' Tage'), d+(d===1?' day':' days')+' left'];
    return ['noch '+Math.max(1,h)+' Std.', Math.max(1,h)+' h left'];}
  function soon(ms){var d=Math.ceil(ms/864e5);
    return d<=1?['startet morgen','starts tomorrow']:['in '+d+' Tagen','in '+d+' days'];}
  function desc(e){
    if(e.type==='bonus'){var b=BON[e.bonus]||BON.all,m=(e.mult||2)+'×';
      return [m+' '+b[0], m+' '+b[1]];}
    var c=e.currency||'Lebkuchen',ce=e.currency_en||CUR[c]||c;
    var de='Sammle '+c+' für Belohnungen',en='Collect '+ce+' for rewards';
    if(e.advent&&e.advent.length){de+=' · mit Adventskalender';en+=' · with advent calendar'}
    else if(e.missions&&e.missions.length){de+=' · mit Missionen';en+=' · with missions'}
    return [de,en];
  }
  function render(box,list){
    var now=new Date(),rows=[];
    list.forEach(function(e){var a=t(e.start),b=t(e.end);if(!a||!b||b<now)return;rows.push({e:e,a:a,b:b,on:a<=now})});
    rows.sort(function(x,y){return x.a-y.a});
    rows=rows.slice(0,MAX);
    if(!rows.length){box.innerHTML='<p class="ev-empty">'+two('Gerade sind keine Events geplant – schau bald wieder vorbei!','No events planned right now – check back soon!')+'</p>';return}
    box.innerHTML=rows.map(function(r){
      var e=r.e,th=e.type==='season'?(e.theme||'xmas'):'bonus',d=desc(e);
      var tag=r.on?left(r.b-now):soon(r.a-now);
      var n0=e.name||e.title||'Event',nm=esc(n0),ne=esc(e.name_en||NAME[n0]||n0);
      return '<div class="ev th-'+esc(th)+(r.on?' on':'')+'">'+
        '<div class="ev-date"><b>'+r.a.getDate()+'</b>'+two(MON.de[r.a.getMonth()],MON.en[r.a.getMonth()])+'</div>'+
        '<div class="ev-body"><div class="ev-top"><h3>'+(ICO[th]||'✨')+' '+two(nm,ne)+'</h3>'+
        '<span class="ev-tag">'+(r.on?two('Läuft jetzt · ','Live now · '):'')+two(tag[0],tag[1])+'</span></div>'+
        '<p>'+two(esc(d[0]),esc(d[1]))+'</p>'+
        '<p class="ev-when">'+two(range(r.a,r.b,'de'),range(r.a,r.b,'en'))+'</p></div></div>';
    }).join('');
  }
  document.addEventListener('DOMContentLoaded',function(){
    var box=document.getElementById('ev-list');if(!box)return;
    fetch('events.json?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()})
      .then(function(d){render(box,(d&&d.events)||(Array.isArray(d)?d:[]))})
      .catch(function(){render(box,[])});
  });
})();
