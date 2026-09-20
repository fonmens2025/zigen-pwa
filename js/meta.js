/* ================= 游戏化成长系统（等级/金币/连击/每日任务/连续登录/成就） ================= */
'use strict';
var META=(function(){
  /* 多学生档案：key 按当前档案后缀隔离，切换档案后整页刷新生效 */
  function profileSuffix(){ try{ var p=localStorage.getItem('zigen_current_profile')||''; return p?('_'+p):''; }catch(e){ return ''; } }
  var K='zigen_meta_v1'+profileSuffix();
  var LEVELS=[
    {n:'蒙童',  e:'🌱', xp:0},
    {n:'书童',  e:'📖', xp:100},
    {n:'秀才',  e:'🖌️', xp:300},
    {n:'举人',  e:'🎋', xp:700},
    {n:'进士',  e:'🏮', xp:1300},
    {n:'探花',  e:'🌸', xp:2100},
    {n:'榜眼',  e:'🎇', xp:3200},
    {n:'状元',  e:'🏆', xp:4500}
  ];
  var BADGES=[
    {id:'first',   n:'初出茅庐', e:'🐣', d:'第一次答对题目'},
    {id:'star4',   n:'满星新秀', e:'🌟', d:'4 个明星字族全部拿过 3 星'},
    {id:'fam10',   n:'字族猎手', e:'🏹', d:'点亮 10 个字族'},
    {id:'c100',    n:'百字斩',   e:'💯', d:'累计答对 100 题'},
    {id:'c1000',   n:'千字斩',   e:'🎖️', d:'累计答对 1000 题'},
    {id:'combo10', n:'连击达人', e:'🔥', d:'一局内连续答对 10 题'},
    {id:'grade1',  n:'闯关先锋', e:'🎓', d:'完成任一年级闯关'},
    {id:'riddle3', n:'谜语大师', e:'🏮', d:'字谜乐园拿到 3 星'},
    {id:'glyph20', n:'说文迷',   e:'📜', d:'看过 20 个字的字源'},
    {id:'week7',   n:'七日之约', e:'📅', d:'连续 7 天学习'},
    {id:'zhuang',  n:'状元及第', e:'👑', d:'升到「状元」等级'},
    {id:'coin500', n:'小富翁',   e:'💰', d:'攒到 500 枚铜钱'},
    {id:'reader5',  n:'小小读者', e:'📚', d:'读完 5 篇短文'},
    {id:'words30',  n:'积词达人', e:'🗂️', d:'收藏 30 条好词好句'},
    {id:'mimic5',   n:'仿写高手', e:'✍️', d:'完成 5 篇仿写挑战'},
    {id:'write5',   n:'落笔成芽', e:'🌱', d:'完成 5 次微写作'}
  ];
  /* 每日任务：目标与奖励的唯一出处，quest() 和 questsHtml() 共用，避免显示 NaN */
  var QUESTS=[
    {ev:'learn_char',   ic:'📖', n:'学海拾贝', d:'打开 3 个字卡学字源',        target:3, rew:20},
    {ev:'listen',       ic:'🔊', n:'字音达人', d:'点 5 次听一听按钮',          target:5, rew:15},
    {ev:'game_end',     ic:'🎮', n:'闯关小将', d:'完成 1 局游戏',              target:1, rew:25},
    {ev:'read_article', ic:'📚', n:'悦读时光', d:'读 1 篇短文并点"我读完了"',  target:1, rew:30},
    {ev:'write',        ic:'🖊️', n:'落笔生花', d:'完成 1 次微写作',            target:1, rew:25}
  ];
  function questDef(ev){ for(var i=0;i<QUESTS.length;i++) if(QUESTS[i].ev===ev) return QUESTS[i]; return null; }
  /* 根宝装扮商店（铜钱消费） */
  var MASCOTS=[
    {id:'owl',   e:'🦉', n:'猫头鹰', p:0},
    {id:'cat',   e:'🐱', n:'小猫咪', p:200},
    {id:'fox',   e:'🦊', n:'小狐狸', p:300},
    {id:'panda', e:'🐼', n:'大熊猫', p:400},
    {id:'tiger', e:'🐯', n:'小老虎', p:500},
    {id:'frog',  e:'🐸', n:'小青蛙', p:600},
    {id:'dragon',e:'🐲', n:'小神龙', p:800},
    {id:'unicorn',e:'🦄',n:'独角兽', p:1000}
  ];
  function todayStr(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
  function ymd(d){ return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
  function def(){
    return {xp:0, coins:0, streak:0, last:'', totalRight:0, totalAnswered:0, glyphSeen:0,
            quests:{date:'', done:{}, claimed:{}}, today:{date:'', learned:0, listen:0, games:0}, badges:{},
            shop:{mascot:'owl', owned:{owl:1}}};
  }
  var S=def();
  function load(){
    try{
      var raw=localStorage.getItem(K);
      if(raw){ var d=JSON.parse(raw); for(var k in S){ if(d[k]!==undefined) S[k]=d[k]; } }
    }catch(e){}
  }
  function save(){ try{ localStorage.setItem(K,JSON.stringify(S)); }catch(e){} }
  function levelOf(){
    var i=0;
    for(var j=0;j<LEVELS.length;j++) if(S.xp>=LEVELS[j].xp) i=j;
    return i;
  }
  function dayRoll(){
    var t=todayStr();
    if(S.today.date!==t){ S.today={date:t, learned:0, listen:0, games:0}; }
    if(S.quests.date!==t){ S.quests={date:t, done:{}, claimed:{}}; }
    // 连续登录
    if(S.last===t) return;
    var y=new Date(); y.setDate(y.getDate()-1);
    if(S.last===ymd(y)) S.streak+=1; else S.streak=1;
    S.last=t;
    if(S.streak===7) award('week7');
    save();
  }
  function lv(){ return LEVELS[levelOf()]; }
  function next(){ return LEVELS[levelOf()+1]||null; }
  function award(bid){
    if(S.badges[bid]) return false;
    S.badges[bid]=Date.now();
    save();
    toast('🏅 新成就：'+badgeName(bid)+'！');
    if(window.ANIM) ANIM.burst();
    if(window.AUDIO) AUDIO.quest();
    return true;
  }
  function badgeName(id){
    for(var i=0;i<BADGES.length;i++) if(BADGES[i].id===id) return BADGES[i].e+' '+BADGES[i].n;
    return id;
  }
  function addXP(n,src){
    var before=levelOf();
    S.xp+=n;
    save();
    var after=levelOf();
    if(after>before){
      if(window.AUDIO) AUDIO.levelup();
      if(window.ANIM) ANIM.levelUp(LEVELS[after].e+LEVELS[after].n);
      if(LEVELS[after].n==='状元') award('zhuang');
      return true;
    }
    return false;
  }
  function addCoins(n){
    S.coins+=n; save();
    if(S.coins>=500) award('coin500');
  }
  // 答题结算（由游戏/闯关调用）
  function onAnswer(right){
    if(!S.today.date||S.today.date!==todayStr()) dayRoll();
    S.totalAnswered++;
    if(right){
      S.totalRight++;
      COMBO.hit++;
      var mult=Math.min(COMBO.hit,5);
      addCoins(2*mult);
      addXP(4+(mult>1?2:0));
      if(window.ANIM) ANIM.floatCoin(mult*2);
      if(window.AUDIO){
        if(COMBO.hit>=3&&COMBO.hit%3===0) AUDIO.combo(COMBO.hit); else AUDIO.correct();
      }
      if(COMBO.hit===10) award('combo10');
      if(S.totalRight>=100) award('c100');
      if(S.totalRight>=1000) award('c1000');
      award('first');
      updateComboUI();
    } else {
      COMBO.hit=0;
      if(window.AUDIO) AUDIO.wrong();
      updateComboUI();
    }
    updateBar();
  }
  var COMBO={hit:0};
  function comboReset(){ COMBO.hit=0; updateComboUI(); }
  function onGameEnd(stars){
    if(!S.today.date||S.today.date!==todayStr()) dayRoll();
    S.today.games++;
    var xp=[0,15,25,40][stars]||20;
    var coin=[0,10,20,35][stars]||15;
    addXP(xp); addCoins(coin);
    if(window.AUDIO) AUDIO.star(stars-1);
    if(stars===3&&window.ANIM) ANIM.burst();
    if(stars>0) quest('game_end');
    updateBar();
  }
  function quest(ev){
    dayRoll();
    var q=S.quests;
    var def0=questDef(ev);
    if(!def0) return;
    q.done[ev]=(q.done[ev]||0)+1;
    if(q.done[ev]===def0.target&&!q.claimed[ev]){
      q.claimed[ev]=1;
      addCoins(def0.rew);
      save();
      toast('✅ 每日任务完成！+'+def0.rew+' 铜钱');
      if(window.AUDIO) AUDIO.quest();
      if(window.ANIM) ANIM.burst();
    } else save();
    var el=document.getElementById('qBox');
    if(el&&window.META) el.innerHTML=META.questsHtml();
  }
  function trackLearn(){ dayRoll(); S.today.learned++; if(S.today.learned%3===0) quest('learn_char'); save(); }
  function trackListen(){ dayRoll(); S.today.listen++; quest('listen'); save(); }
  function trackGlyph(){ S.glyphSeen++; save(); if(S.glyphSeen>=20) award('glyph20'); }
  function trackFam(id){
    dayRoll();
    var key='fam_'+id;
    if(!S[key]){ S[key]=1; save(); }
    var lit=0;
    for(var k in S){ if(k.indexOf('fam_')===0) lit++; }
    if(lit>=10) award('fam10');
    // 明星族满星检测
    var ok=true;
    try{
      var PROG2=JSON.parse(localStorage.getItem('zigen_progress_v1'+profileSuffix())||'{}');
      var ids=['wang','qing','mu','shui'];
      for(var i=0;i<ids.length;i++){
        var ss=(PROG2.stars||{})[ids[i]]||[0,0,0];
        if(!ss.every(function(x){return x===3;})){ ok=false; break; }
      }
      if(ok) award('star4');
    }catch(e){}
  }
  function trackRiddle(stars){ if(stars===3) award('riddle3'); }
  function trackGradeDone(){ award('grade1'); }
  function questsHtml(){
    var h='';
    for(var i=0;i<QUESTS.length;i++){
      var qd=QUESTS[i], done=Math.min(S.quests.done[qd.ev]||0,qd.target);
      var full=done>=qd.target;
      h+='<div class="qitem'+(full?' done':'')+'"><span class="qic">'+(full?'✅':qd.ic)+'</span>'+
         '<div class="qtx"><b>'+qd.ic+' '+qd.n+'</b><small>'+qd.d+'</small>'+
         '<div class="qpbar"><i style="width:'+(done*100/qd.target)+'%"></i></div></div>'+
         '<span class="qnum">'+done+'/'+qd.target+'</span></div>';
    }
    return h;
  }
  function updateBar(){
    var el=document.getElementById('xpbar');
    if(el){
      var l=lv(), nxt=next(), w=nxt?Math.round((S.xp-l.xp)*100/(nxt.xp-l.xp)):100;
      el.style.width=w+'%';
    }
    var bx=document.getElementById('resChips');
    if(bx) bx.innerHTML=chipsHtml();
    var lx=document.getElementById('lvName');
    if(lx) lx.textContent=lv().e+' '+lv().n;
  }
  function chipsHtml(){
    var l=lv();
    return '<span class="chip lv">'+l.e+' '+l.n+'</span>'+
           '<span class="chip">🪙 '+S.coins+'</span>'+
           '<span class="chip">🔥 '+S.streak+' 天</span>';
  }
  function updateComboUI(){
    var el=document.getElementById('comboBox');
    if(el){
      if(COMBO.hit>=3){ el.classList.remove('hidden'); el.innerHTML='🔥 连击 ×'+COMBO.hit; }
      else el.classList.add('hidden');
    }
  }
  function statsHtml(){
    var l=lv();
    return {
      lv:l, xp:S.xp, coins:S.coins, streak:S.streak,
      totalRight:S.totalRight, totalAnswered:S.totalAnswered,
      todayLearned:S.today.learned, todayGames:S.today.games, glyphSeen:S.glyphSeen,
      badges:Object.keys(S.badges).length, badgesTotal:BADGES.length
    };
  }
  function badgesHtml(){
    var got=Object.keys(S.badges);
    return BADGES.map(function(b){
      var have=!!S.badges[b.id];
      return '<div class="badgechip'+(have?' on':'')+'" title="'+b.d+'">'+
        '<span class="be">'+(have?b.e:'🔒')+'</span><span class="bn2">'+b.n+'</span>'+
        '<small>'+(have?'已获得':'未解锁')+'</small></div>';
    }).join('');
  }
  /* ---------- 装扮商店 ---------- */
  function mascotDef(id){ for(var i=0;i<MASCOTS.length;i++) if(MASCOTS[i].id===id) return MASCOTS[i]; return MASCOTS[0]; }
  function mascot(){ return mascotDef(S.shop&&S.shop.mascot); }
  function buyMascot(id){
    var m=mascotDef(id);
    if(!S.shop) S.shop={mascot:'owl',owned:{owl:1}};
    if(S.shop.owned[id]){ S.shop.mascot=id; save(); return {ok:true,equip:true}; }
    if(S.coins<m.p) return {ok:false,need:m.p-S.coins};
    S.coins-=m.p;
    S.shop.owned[id]=1; S.shop.mascot=id;
    save(); updateBar();
    return {ok:true,equip:false};
  }
  function ownsMascot(id){ return !!(S.shop&&S.shop.owned&&S.shop.owned[id]); }
  load();
  return {
    S:S, COMBO:COMBO, LEVELS:LEVELS, BADGES:BADGES, QUESTS:QUESTS, MASCOTS:MASCOTS,
    levelOf:levelOf, lv:lv, next:next, award:award,
    addXP:addXP, addCoins:addCoins,
    onAnswer:onAnswer, onGameEnd:onGameEnd, comboReset:comboReset,
    quest:quest, trackLearn:trackLearn, trackListen:trackListen,
    trackGlyph:trackGlyph, trackFam:trackFam, save:save,
    reset:function(){ S=def(); save(); },
    trackRiddle:trackRiddle, trackGradeDone:trackGradeDone,
    questsHtml:questsHtml, chipsHtml:chipsHtml, statsHtml:statsHtml,
    badgesHtml:badgesHtml, updateBar:updateBar, updateComboUI:updateComboUI,
    mascot:mascot, buyMascot:buyMascot, ownsMascot:ownsMascot,
    init:dayRoll
  };
})();
