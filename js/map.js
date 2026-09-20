/* ================= v5.5 字林探险：学习地图 + 每日擂台 + 签到日历 + 今日半小时 ================= */
'use strict';
/* 状态: PROG.quest5 惰性初始化（重置进度时会被 PROG 整体重建清除） */
function getQ5(){
  if(!PROG.quest5) PROG.quest5={map:{start:''}, arena:{best:0, today:{date:'', score:0}}, calendar:{claimed:[]}, halfHour:{date:'', rewarded:false}, days:{}};
  var q=PROG.quest5;
  if(!q.map) q.map={start:''};
  if(!q.arena) q.arena={best:0, today:{date:'', score:0}};
  if(!q.calendar) q.calendar={claimed:[]};
  if(!q.halfHour) q.halfHour={date:'', rewarded:false};
  if(!q.days) q.days={};
  return q;
}
function dateKey(d){
  var x=d||new Date();
  return x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2)+'-'+('0'+x.getDate()).slice(-2);
}
function dayDiff(d1,d2){
  var a=new Date(d1.getFullYear(),d1.getMonth(),d1.getDate());
  var b=new Date(d2.getFullYear(),d2.getMonth(),d2.getDate());
  return Math.round((b-a)/86400000);
}
function parseKey(k){
  var p=String(k).split('-');
  return new Date(+p[0],+p[1]-1,+p[2]);
}
/* 记录昨天的学习足迹（供签到日历用） */
function q5RollDay(){
  var q=getQ5();
  var t=dateKey();
  if(q.map._lastRoll===t) return;
  if(q.map._lastRoll){
    var y=new Date(); y.setDate(y.getDate()-1);
    var yk=dateKey(y);
    var md=META?META.S.today:null;
    q.days[yk]={
      g:(md&&md.games)||0,
      l:(md&&md.learned)||0,
      r:((md&&md.listen)||0)>0?1:0
    };
    saveProg();
  }
  q.map._lastRoll=t;
}
/* 半小时达标判定 */
function halfChecks(){
  var g=(META&&META.S.today.games)||0;
  var r=(META&&META.S.quests.done.read_article)||0;
  var l=(META&&META.S.today.learned)||0;
  return {g:g>=1, r:r>=1, l:l>=3};
}

/* ================= 学习地图 ================= */
function renderMap(){
  clearTimers();
  setNav('home');
  var q=getQ5();
  q5RollDay();
  if(!q.map.start){ q.map.start=dateKey(); saveProg(); }
  else{
    var _p=String(q.map.start).split('-');
    if(_p.length===3&&(_p[1].length<2||_p[2].length<2)){
      q.map.start=+_p[0]+'-'+('0'+_p[1]).slice(-2)+'-'+('0'+_p[2]).slice(-2); saveProg();
    }
  }
  var dayIdx=dayDiff(parseKey(q.map.start),new Date());
  var hc=halfChecks();
  var full=(hc.g&&hc.r&&hc.l);
  var done=hc.g||hc.r||hc.l;
  var NODES=30;
  var dayNames=['日','一','二','三','四','五','六'];
  var nodeHtml='';
  var doneCount=0, fullCount=0;
  var px,py;
  for(var i=0;i<NODES;i++){
    var col=i%5, row=Math.floor(i/5);
    var x=18+(col*19), y=16+(row*26);
    var st;
    if(i>dayIdx) st='locked';
    else if(i===dayIdx) st=(full?'full':(done?'done':'today'));
    else st=(q.map.full&&q.map.full[i])?'full':((q.map.done&&q.map.done[i])?'done':'open');
    if(st==='done'||st==='full') doneCount++;
    if(st==='full') fullCount++;
    var icon=st==='locked'?'🔒':st==='full'?'🌟':st==='done'?'✅':st==='today'?'📍':'🎯';
    if(i>0){
      var pcx=18+((i-1)%5)*19, pcy=16+(Math.floor((i-1)/5))*26;
      nodeHtml+='<line x1="'+pcx+'" y1="'+pcy+'" x2="'+x+'" y2="'+y+'" stroke="'+(st==='locked'&&i>dayIdx?'#E2D7B8':'#E5A93C')+'" stroke-width="3" stroke-linecap="round"/>';
    }
    nodeHtml+='<circle cx="'+x+'" cy="'+y+'" r="11" class="mnode '+st+'" data-i="'+i+'"/>'+
      '<text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="11">'+icon+'</text>';
  }
  var todayNode=Math.min(dayIdx,NODES-1);
  var taskPack=dayIdx<NODES
    ?'<div class="mnode-card">'+
       '<h3>📍 第 '+(dayIdx+1)+' 天 · 今日任务包（约30分钟）</h3>'+
       '<div class="mpack">'+
         '<div class="mp-item'+(hc.g?' ok':'')+'">'+(hc.g?'✅':'🧩')+' 字族闯关 1 局（15分钟）<small>任一字族或自检都算</small></div>'+
         '<div class="mp-item'+(hc.r?' ok':'')+'">'+(hc.r?'✅':'📖')+' 悦读 1 篇（10分钟）<small>句芽·悦读馆任意一篇</small></div>'+
         '<div class="mp-item'+(hc.l?' ok':'')+'">'+(hc.l?'✅':'🀄')+' 学 3 个字（5分钟）<small>点开 3 张字卡看字源</small></div>'+
       '</div>'+
       '<div class="rbtns">'+
         '<button class="btn" id="mpGame">🧩 去闯关</button>'+
         '<button class="btn" id="mpRead">📖 去悦读</button>'+
         '<button class="btn secondary" id="mpLearn">🀄 去字族</button>'+
       '</div>'+
       (full?'<div class="mwfb-ok">🎉 今日任务包全完成！</div>':'')+
     '</div>'
    :'<div class="mnode-card"><h3>🏁 30 天旅程完成！</h3><p class="flowtip">你走完了整个字林——坚持的力量，就是量变到质变。</p></div>';
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="mpBack">🏠 首页</button><div class="gtitle">🗺️ 字林探险 · 30天学习地图</div></div>'+
      '<div class="mapstats">'+
        '<span>已走完 <b>'+doneCount+'</b>/'+NODES+' 天</span>'+
        '<span>全星 <b>'+fullCount+'</b> 天</span>'+
        '<span>今日 <b>第 '+(Math.min(dayIdx,NODES-1)+1)+'</b> 天</span>'+
      '</div>'+
      '<div class="mapwrap"><svg viewBox="0 0 95 160" class="mapsvg">'+nodeHtml+'</svg></div>'+
      taskPack+
      '<div class="readtip">💡 每天完成一个任务包，30 天后回头看：3500 个常用字、字族思维、好词好句和写作手感，都在地图上留下了脚印。</div>'+
    '</div>';
  $('#mpBack').addEventListener('click',renderHome);
  var g=$('#mpGame'); if(g) g.addEventListener('click',function(){ AUDIO.tap(); renderGrade(); });
  var r=$('#mpRead'); if(r) r.addEventListener('click',function(){ AUDIO.tap(); renderReadHome(); });
  var l=$('#mpLearn'); if(l) l.addEventListener('click',function(){ AUDIO.tap(); renderSchool(); });
  // 标记今日完成并领奖励
  if(done&&!q.map.done[dayIdx]){
    q.map.done[dayIdx]=1; saveProg();
    META.addCoins(15); META.addXP(15);
    toast('🎯 第 '+(dayIdx+1)+' 天完成！+15铜钱');
  }
  if(full&&!q.map.full[dayIdx]){
    q.map.full[dayIdx]=1; saveProg();
    META.addCoins(25);
    if(window.ANIM) ANIM.burst();
    toast('🌟 第 '+(dayIdx+1)+' 天满星！+25铜钱');
  }
  updateHeader();
}

/* ================= 每日擂台（90秒限时） ================= */
var ARENA=null;
function renderArena(){
  clearTimers();
  var q=getQ5();
  var t=dateKey();
  if(q.arena.today.date!==t) q.arena.today={date:t,score:0};
  app.innerHTML=
    '<div class="ghead"><button class="btn ghost small" id="arBack">🏠 首页</button><div class="gtitle">⚔️ 每日擂台</div></div>'+
    '<div class="arena-top">'+
      '<div class="at-score">得分 <b id="arScore">0</b></div>'+
      '<div class="at-time" id="arTime">90</div>'+
    '</div>'+
    '<div id="arBody"></div>';
  $('#arBack').addEventListener('click',renderHome);
  var score=0, left=90;
  var timer=setInterval(function(){
    left--;
    var el=document.getElementById('arTime');
    if(el){ el.textContent=left; if(left<=10) el.classList.add('red'); }
    if(left<=0){ clearInterval(timer); arenaEnd(score); }
  },1000);
  function arenaEnd(s){
    var q2=getQ5();
    if(s>q2.arena.best){ q2.arena.best=s; toast('🎉 新纪录！'+s+' 分'); if(window.ANIM) ANIM.burst(); }
    q2.arena.today.score=Math.max(q2.arena.today.score,s);
    saveProg();
    var coins=Math.min(Math.floor(s/5),30);
    META.addCoins(coins); META.addXP(Math.min(s*3,60));
    document.getElementById('arBody').innerHTML=
      '<div class="result">'+
        '<div class="res-title">⏱️ 时间到！</div>'+
        '<div class="res-sub">本次 <b>'+s+'</b> 分 · 历史最高 '+q2.arena.best+' 分 · 今日最佳 '+q2.arena.today.score+' 分<br>奖励 +'+coins+' 铜钱</div>'+
        '<div class="res-btns">'+
          '<button class="btn big" id="arAgain">⚔️ 再来一局</button>'+
          '<button class="btn secondary" id="arHome">🏠 回首页</button>'+
        '</div>'+
      '</div>';
    $('#arAgain').addEventListener('click',renderArena);
    $('#arHome').addEventListener('click',renderHome);
    updateHeader();
  }
  function nextQ(){
    if(left<=0) return;
    // 从 FAM 随机抽一个成员做字义题
    var f=FAM[Math.floor(Math.random()*FAM.length)];
    var m=f.members[Math.floor(Math.random()*f.members.length)];
    if(!m||!m.m) return nextQ();
    var opts=[m.ch];
    // 干扰项：同族优先
    var pool=f.members.filter(function(x){return x.ch!==m.ch;});
    while(opts.length<4){
      if(pool.length){ var p=pool.splice(Math.floor(Math.random()*pool.length),1)[0]; opts.push(p.ch); }
      else{
        var f2=FAM[Math.floor(Math.random()*FAM.length)];
        var m2=f2.members[Math.floor(Math.random()*f2.members.length)];
        if(m2&&opts.indexOf(m2.ch)<0&&m2.ch!==m.ch) opts.push(m2.ch); else break;
      }
    }
    opts.sort(function(){return Math.random()-0.5;});
    var gloss=m.m.length>12?m.m.slice(0,12)+'…':m.m;
    document.getElementById('arBody').innerHTML=
      '<div class="gcard"><p class="gq">⚡ 「'+gloss+'」是哪个字的意思？</p>'+
      '<div class="opts optrow arena-opts">'+opts.map(function(o){return '<button>'+o+'</button>';}).join('')+'</div></div>';
    var done=false;
    var bs=document.querySelectorAll('#arBody .opts button');
    for(var i=0;i<bs.length;i++){
      bs[i].addEventListener('click',function(){
        if(done) return;
        done=true;
        if(this.textContent===m.ch){
          score+=2;
          var el=document.getElementById('arScore');
          if(el){ el.textContent=score; el.parentNode.classList.remove('pop'); void el.parentNode.offsetWidth; el.parentNode.classList.add('pop'); }
          AUDIO.correct();
          this.classList.add('right');
        }else{
          AUDIO.wrong();
          this.classList.add('wrong');
          var rightBtn=null;
          for(var j=0;j<bs.length;j++) if(bs[j].textContent===m.ch) rightBtn=bs[j];
          if(rightBtn) rightBtn.classList.add('right');
        }
        later(nextQ,450);
      });
    }
  }
  nextQ();
  updateHeader();
}

/* ================= 签到日历 ================= */
var CAL={y:0,m:0};
function renderCalendar(){
  clearTimers();
  var q=getQ5();
  q5RollDay();
  var now=new Date();
  if(!CAL.y){ CAL.y=now.getFullYear(); CAL.m=now.getMonth(); }
  var first=new Date(CAL.y,CAL.m,1);
  var wd=(first.getDay()+6)%7; // 周一开头
  var dim=new Date(CAL.y,CAL.m+1,0).getDate();
  var cells='';
  for(var i=0;i<wd;i++) cells+='<div class="cal-cell empty"></div>';
  var today=dateKey(now);
  for(var d=1;d<=dim;d++){
    var k=CAL.y+'-'+(CAL.m+1)+'-'+d;
    var act=q.days[k];
    var isToday=k===today;
    var isPast=k<today;
    cells+='<div class="cal-cell'+(isToday?' today':'')+(act?' active':'')+(isPast&&!act?' past':'')+'">'+
      '<span>'+d+'</span>'+(act?'<i class="cdot"></i>':'')+'</div>';
  }
  var streak=META?META.S.streak:0;
  var ladder=[{n:3,c:10},{n:7,c:30,b:'week7'},{n:15,c:60},{n:30,c:120}];
  var ladderHtml=ladder.map(function(L){
    var got=q.calendar.claimed.indexOf(L.n)>=0;
    var can=streak>=L.n&&!got;
    return '<div class="lad-item'+(got?' got':'')+(can?' can':'')+'">'+
      '<b>连续 '+L.n+' 天</b><span>+'+L.c+' 铜钱'+(L.b?' +徽章':'')+'</span>'+
      (can?'<button class="btn small" data-lad="'+L.n+'">领取</button>':(got?'<span class="lad-got">已领</span>':''))+
    '</div>';
  }).join('');
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="calBack">← 我的</button><div class="gtitle">📅 签到日历</div></div>'+
      '<div class="cal-head">'+
        '<button class="btn ghost small" id="calPrev">‹</button>'+
        '<b>'+CAL.y+' 年 '+(CAL.m+1)+' 月</b>'+
        '<button class="btn ghost small" id="calNext">›</button>'+
      '</div>'+
      '<div class="cal-week">' + ['一','二','三','四','五','六','日'].map(function(w){return '<span>'+w+'</span>';}).join('') + '</div>'+
      '<div class="cal-grid">'+cells+'</div>'+
      '<div class="streak-banner">🔥 已连续学习 <b>'+streak+'</b> 天'+(streak>=7?' · 七天连击达成！':'')+'</div>'+
      '<h3 class="bklv">🎁 连续签到奖励</h3>'+
      '<div class="ladder">'+ladderHtml+'</div>'+
      '<div class="readtip">💡 每天学一点（闯关/悦读/看字卡都算足迹）。坚持 30 天，你会看到自己的变化。</div>'+
    '</div>';
  $('#calBack').addEventListener('click',renderMe);
  $('#calPrev').addEventListener('click',function(){ CAL.m--; if(CAL.m<0){CAL.m=11;CAL.y--;} renderCalendar(); });
  $('#calNext').addEventListener('click',function(){ CAL.m++; if(CAL.m>11){CAL.m=0;CAL.y++;} renderCalendar(); });
  $all('[data-lad]').forEach(function(b){
    b.addEventListener('click',function(){
      var n=+b.getAttribute('data-lad');
      var L=ladder.filter(function(x){return x.n===n;})[0];
      if(streak>=n&&q.calendar.claimed.indexOf(n)<0){
        q.calendar.claimed.push(n); saveProg();
        META.addCoins(L.c);
        if(L.b) META.award(L.b);
        toast('🎁 +'+L.c+' 铜钱！');
        renderCalendar();
      }
    });
  });
  updateHeader();
}

/* ================= 今日半小时仪表盘 ================= */
function halfHourHtml(){
  var q=getQ5();
  q5RollDay();
  var hc=halfChecks();
  var all=hc.g&&hc.r&&hc.l;
  var bars=[
    {ok:hc.g,n:'🧩 字族闯关 1 局',pct:hc.g?100:(META&&META.S.today.games?Math.min(META.S.today.games*100,100):0)},
    {ok:hc.r,n:'📖 悦读 1 篇',pct:hc.r?100:0},
    {ok:hc.l,n:'🀄 学字 3 个',pct:hc.l?100:(META&&META.S.today.learned?Math.min(META.S.today.learned*33,100):0)}
  ];
  var h='<div class="hhcard"><div class="flowhead"><b>⏱️ 今日半小时</b><span class="flowsub">每天 30 分钟 · 贵在坚持</span></div>';
  bars.forEach(function(b){
    h+='<div class="hhbar'+(b.ok?' ok':'')+'"><span>'+b.n+'</span><div class="qpbar"><i style="width:'+b.pct+'%"></i></div>'+(b.ok?'<b>✓</b>':'')+'</div>';
  });
  if(all&&!q.halfHour.rewarded){
    q.halfHour.rewarded=true; q.halfHour.date=dateKey(); saveProg();
    META.addCoins(50); META.addXP(50);
    if(window.ANIM) ANIM.burst();
    toast('🏅 今日半小时完成！+50铜钱');
  }
  h+=(all?'<div class="hh-done">🎉 半小时达标！量变正在发生</div>':'')+'</div>';
  return h;
}
