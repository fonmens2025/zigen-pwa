/* ================= v5.6 字灵图鉴：集卡系统（学字得卡 + 铜钱开卡包） ================= */
'use strict';
function getCards(){
  if(!PROG.cards) PROG.cards={owned:{}, packs:0, opened:0};
  if(!PROG.cards.owned) PROG.cards.owned={};
  return PROG.cards;
}
/* 稀有度：明星族=金 / 起步字表=绿 / 字表一=蓝 / 字表二=白 */
function cardRarity(ch){
  for(var i=0;i<4;i++){
    var f=FAM[i];
    for(var j=0;j<f.members.length;j++) if(f.members[j].ch===ch) return 'gold';
  }
  var m=null;
  for(var k=0;k<FAM.length&&!m;k++){
    for(var j=0;j<FAM[k].members.length;j++) if(FAM[k].members[j].ch===ch){ m=FAM[k].members[j]; break; }
  }
  if(!m) return 'white';
  var t=(m.tier||'b');
  if(t==='b') return 'green';
  if(t==='c1') return 'blue';
  return 'white';
}
var RAR={gold:['传说','⭐','#E5A93C','#FFF3D6'],green:['稀有','✦','#4F8A5B','#EAF5EC'],blue:['精良','◆','#3E7CB1','#E9F2FA'],white:['普通','·','#9A9487','#F7F5F0']};
function cardGain(ch){
  var C=getCards();
  if(C.owned[ch]) return false;
  C.owned[ch]=Date.now(); saveProg();
  toast('🃏 获得字灵卡：'+ch);
  if(Object.keys(C.owned).length>=50) META.award('cards50');
  return true;
}
function cardOpen(){
  var C=getCards();
  C.packs=(C.packs||0)-1; C.opened=(C.opened||0)+1;
  // 从已学/已见字中抽 3 张未拥有的卡；不足则从全库抽
  var seen=[];
  for(var k in PROG.stars) { var f=FAMMAP[k]; if(f) for(var j=0;j<f.members.length;j++) seen.push(f.members[j].ch); }
  var learnR=[];
  var R=getRead?getRead():null;
  if(R&&R.read) for(var k2 in R.read){ var a=rdById(k2); if(a) for(var j2=0;j2<a.words.length;j2++) learnR.push(a.words[j2].w); }
  var pool=[];
  seen.forEach(function(ch){ if(!C.owned[ch]) pool.push(ch); });
  if(pool.length<3){
    FAM.forEach(function(f){ f.members.forEach(function(m){ if(!C.owned[m.ch]&&pool.indexOf(m.ch)<0) pool.push(m.ch); }); });
  }
  if(pool.length<3){
    for(var ch2 in {}){}
  }
  var got=[];
  for(var i=0;i<3&&pool.length;i++){
    var idx=Math.floor(Math.random()*pool.length);
    got.push(pool.splice(idx,1)[0]);
  }
  got.forEach(function(ch){ C.owned[ch]=Date.now(); });
  saveProg();
  if(Object.keys(C.owned).length>=50) META.award('cards50');
  return got;
}
function renderCards(){
  clearTimers();
  setNav('game');
  var C=getCards();
  var ownedN=Object.keys(C.owned).length;
  var counts={gold:0,green:0,blue:0,white:0};
  var grid='';
  var keys=Object.keys(C.owned);
  if(!keys.length){
    grid='<div class="emptybook">图鉴还是空的～<br>点开学过的字卡、闯关赢铜钱开卡包，字灵就会飞进来。</div>';
  }else{
    keys.slice().sort(function(a,b){return (C.owned[b]||0)-(C.owned[a]||0);}).slice(0,60).forEach(function(ch){
      var r=cardRarity(ch);
      counts[r]++;
      grid+='<div class="wcard-item '+r+'"><div class="wci-ch">'+ch+'</div><div class="wci-rar">'+RAR[r][1]+' '+RAR[r][0]+'</div></div>';
    });
  }
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="cdBack">← 游戏中心</button><div class="gtitle">🃏 字灵图鉴</div></div>'+
      '<div class="cardstats">'+
        '<div class="cs"><b>'+ownedN+'</b><span>已集字灵</span></div>'+
        '<div class="cs gold"><b>'+counts.gold+'</b><span>⭐传说</span></div>'+
        '<div class="cs green"><b>'+counts.green+'</b><span>✦稀有</span></div>'+
        '<div class="cs blue"><b>'+counts.blue+'</b><span>◆精良</span></div>'+
        '<div class="cs"><b>'+C.packs+'</b><span>待开卡包</span></div>'+
      '</div>'+
      '<div class="rbtns">'+
        '<button class="btn big" id="cdOpen">🎁 开卡包'+(C.packs>0?'（'+C.packs+'）':'')+'</button>'+
        '<button class="btn secondary" id="cdBuy">🪙 买卡包（50铜钱）</button>'+
      '</div>'+
      '<div class="wcard-grid">'+grid+'</div>'+
      '<div class="readtip">💡 怎么集卡？① 点开学过的字卡自动收字灵；② 闯关攒铜钱买卡包；③ 字林地图开宝箱送卡包。集满 50 张有成就！</div>'+
    '</div>';
  $('#cdBack').addEventListener('click',renderGameHub);
  $('#cdOpen').addEventListener('click',function(){
    if(C.packs>0){
      var got=cardOpen();
      renderCards();
      openPackAnim(got);
    } else toast('没有卡包了，去地图开宝箱或买一个吧');
  });
  $('#cdBuy').addEventListener('click',function(){
    if(META.S.coins>=50){
      META.S.coins-=50; META.save();
      C.packs=(C.packs||0)+1; saveProg();
      AUDIO.coin();
      toast('🪙 -50 铜钱，卡包+1');
      renderCards();
    } else toast('铜钱不够，去闯关赢一些吧（还差 '+(50-META.S.coins)+'）');
  });
  updateHeader();
}
/* 开卡包翻牌动画 */
function openPackAnim(got){
  var mask=document.createElement('div');
  mask.className='modal-mask';
  mask.innerHTML='<div class="packbox">'+
    '<div class="pack-title">🎁 卡包开启！</div>'+
    '<div class="pack-cards">'+got.map(function(ch,i){
      var r=cardRarity(ch);
      return '<div class="packcard '+r+'" style="animation-delay:'+(i*0.35)+'s"><div class="pc-ch">'+ch+'</div><div class="pc-rar">'+RAR[r][1]+' '+RAR[r][0]+'</div></div>';
    }).join('')+'</div>'+
    '<button class="btn big" id="packOk">收下！</button></div>';
  document.body.appendChild(mask);
  mask.querySelector('#packOk').addEventListener('click',function(){ mask.remove(); if(window.ANIM) ANIM.burst(); });
  AUDIO.star(2);
}
