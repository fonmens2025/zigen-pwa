/* ================= v5.7 拾句四步闭环 · 句卡收藏册 · 生字口袋 · 补签卡 · 徽章墙 · 句子本 ================= */
'use strict';

/* ---------- 每日好句库（30句，出处公版/课文短引+原创，标注原创教研） ---------- */
var DAILY_SENTS=[
{s:'弯弯的月儿小小的船。',src:'叶圣陶《小小的船》',lv:'L1',set:'自然四季',type:'比喻',
 why:'把月儿说成小船，形状一下就能看见。',d1:'月亮会发光',d2:'月亮在晚上出来',
 blank:{pre:'弯弯的（',post:'）小小的船。',ans:'月儿',w1:'太阳',w2:'星星'}},
{s:'秋天的雨，是一把钥匙。',src:'陶金鸿《秋天的雨》',lv:'L2',set:'自然四季',type:'比喻',
 why:'雨一来，秋天的大门就打开了。',d1:'钥匙是金属做的',d2:'秋天经常下雨',
 blank:{pre:'秋天的雨，是一把（',post:'）。',ans:'钥匙',w1:'锁',w2:'小伞'}},
{s:'枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。',src:'陶金鸿《秋天的雨》',lv:'L2',set:'自然四季',type:'比喻+动作',
 why:'枫叶会“邮”东西，秋天像被寄来一样。',d1:'邮票贴在信封上',d2:'枫叶是红色的',
 blank:{pre:'飘哇飘哇，（',post:'）来了秋天的凉爽。',ans:'邮',w1:'带',w2:'吹'}},
{s:'荷花已经开了不少了，荷叶挨挨挤挤的，像一个个碧绿的大圆盘。',src:'叶圣陶《荷花》',lv:'L2',set:'自然四季',type:'比喻',
 why:'“挨挨挤挤”写出荷叶又多又密，全挤在一起。',d1:'荷叶是绿色的',d2:'荷花很香',
 blank:{pre:'荷叶挨挨挤挤的，像一个个碧绿的（',post:'）。',ans:'大圆盘',w1:'小月亮',w2:'绿皮球'}},
{s:'昆明湖静得像一面镜子，绿得像一块碧玉。',src:'老舍《颐和园》',lv:'L3',set:'自然四季',type:'比喻',
 why:'两个比喻连着用，湖水的静和绿都写活了。',d1:'昆明湖在北京',d2:'镜子能照人',
 blank:{pre:'静得像一面（',post:'）。',ans:'镜子',w1:'玻璃',w2:'湖水'}},
{s:'春天来了，小草从土里探出头来。',src:'原创·仿《找春天》',lv:'L1',set:'自然四季',type:'拟人',
 why:'“探出头”把小草写成好奇的孩子。',d1:'小草是绿色的',d2:'春天很暖和',
 blank:{pre:'小草从土里（',post:'）出头来。',ans:'探',w1:'伸',w2:'露'}},
{s:'太阳像个大火球，烤得大地滚烫。',src:'原创',lv:'L2',set:'自然四季',type:'比喻',
 why:'一个“烤”字把热写得有感觉。',d1:'太阳在白天',d2:'火球很圆',
 blank:{pre:'烤得大地（',post:'）。',ans:'滚烫',w1:'凉快',w2:'金灿灿'}},
{s:'窗外下着蒙蒙细雨，整个世界像被纱罩住了。',src:'原创',lv:'L3',set:'自然四季',type:'比喻',
 why:'把雨比作纱，世界变得又轻又朦胧。',d1:'纱是布做的',d2:'窗户是透明的',
 blank:{pre:'整个世界像被（',post:'）罩住了。',ans:'纱',w1:'雾',w2:'被子'}},
{s:'月亮像一只小船，在云海里慢慢划。',src:'原创',lv:'L2',set:'自然四季',type:'比喻',
 why:'月亮动起来，云变成海，夜空活了。',d1:'船在水上走',d2:'月亮晚上出来',
 blank:{pre:'在（',post:'）里慢慢划。',ans:'云海',w1:'大海',w2:'天空'}},
{s:'星星像无数只小眼睛，一闪一闪地望着大地。',src:'原创',lv:'L2',set:'自然四季',type:'比喻+拟人',
 why:'星星变成眼睛，夜空像在看着我们。',d1:'眼睛会眨',d2:'星星在晚上出来',
 blank:{pre:'像无数只小（',post:'）。',ans:'眼睛',w1:'灯',w2:'珍珠'}},
{s:'弯弯的彩虹挂在天上，像一座七彩的桥。',src:'原创',lv:'L1',set:'自然四季',type:'比喻',
 why:'彩虹变成桥，好像能走上去。',d1:'彩虹有七种颜色',d2:'桥能走人',
 blank:{pre:'像一座七彩的（',post:'）。',ans:'桥',w1:'门',w2:'花环'}},
{s:'风把树叶吹得沙沙响。',src:'原创',lv:'L1',set:'想象王国',type:'拟声',
 why:'“沙沙”把风的声音写得听得见。',d1:'风看不见',d2:'树叶会落',
 blank:{pre:'风把树叶吹得（',post:'）响。',ans:'沙沙',w1:'哗啦',w2:'咚咚'}},
{s:'雨点打在窗户上，啪啪作响，像在敲门。',src:'原创',lv:'L2',set:'想象王国',type:'拟声+拟人',
 why:'雨点变成敲门的小手，又响又亲切。',d1:'下雨要打伞',d2:'窗户是玻璃做的',
 blank:{pre:'啪啪作响，像在（',post:'）。',ans:'敲门',w1:'唱歌',w2:'拍球'}},
{s:'风娃娃鼓起腮帮子，把风筝吹得又高又远。',src:'原创',lv:'L2',set:'想象王国',type:'拟人',
 why:'风变成娃娃，“鼓腮帮子”写得可爱又形象。',d1:'风筝要线牵着',d2:'风看不见',
 blank:{pre:'风娃娃鼓起（',post:'），把风筝吹得又高又远。',ans:'腮帮子',w1:'小拳头',w2:'翅膀'}},
{s:'山路弯弯曲曲，像一条大蟒蛇盘在山上。',src:'原创',lv:'L2',set:'想象王国',type:'比喻',
 why:'弯弯曲曲的山路一下就有了形状和气势。',d1:'蟒蛇很长',d2:'山很高',
 blank:{pre:'像一条大（',post:'）盘在山上。',ans:'蟒蛇',w1:'细绳子',w2:'长梯子'}},
{s:'小猫的胡子又细又长，像一根根银针。',src:'原创',lv:'L1',set:'想象王国',type:'比喻',
 why:'胡子变成银针，又细又亮看得见。',d1:'小猫会捉老鼠',d2:'针会扎人',
 blank:{pre:'像一根根（',post:'）。',ans:'银针',w1:'细线',w2:'铁丝'}},
{s:'燕子飞来了，翅膀上驮着春天。',src:'原创',lv:'L2',set:'想象王国',type:'拟人',
 why:'燕子变成春天的快递员，“驮”字真有分量。',d1:'燕子会衔泥',d2:'春天很暖和',
 blank:{pre:'翅膀上（',post:'）着春天。',ans:'驮',w1:'画',w2:'藏'}},
{s:'一池荷花在风中轻轻点头，像在说悄悄话。',src:'原创',lv:'L2',set:'想象王国',type:'拟人',
 why:'荷花点头说话，整池花都活了起来。',d1:'荷花长在水里',d2:'风会吹动花',
 blank:{pre:'像在说（',post:'）。',ans:'悄悄话',w1:'笑话',w2:'故事'}},
{s:'他跑得比兔子还快，一眨眼就冲到了终点。',src:'原创',lv:'L2',set:'生活烟火',type:'夸张',
 why:'“比兔子还快”把快写得夸张又好笑。',d1:'兔子跑得快',d2:'眨眼只要一下',
 blank:{pre:'跑得比（',post:'）还快。',ans:'兔子',w1:'乌龟',w2:'小猫'}},
{s:'时间像流水，一去就不回头。',src:'原创',lv:'L2',set:'生活烟火',type:'比喻',
 why:'流水不回头，时间也一样，要珍惜。',d1:'水往低处流',d2:'时间看不见',
 blank:{pre:'时间像（',post:'）。',ans:'流水',w1:'小鸟',w2:'风'}},
{s:'妈妈的怀抱像冬天的火炉，暖暖的。',src:'原创',lv:'L1',set:'生活烟火',type:'比喻',
 why:'把怀抱比作火炉，暖得具体可感。',d1:'冬天很冷',d2:'火炉会发光',
 blank:{pre:'像冬天的（',post:'）。',ans:'火炉',w1:'棉被',w2:'太阳'}},
{s:'下课了，同学们有的跳绳，有的踢球，有的赛跑，操场热闹极了。',src:'原创',lv:'L2',set:'生活烟火',type:'排比',
 why:'连用三个“有的”，热闹场面一下就铺开了。',d1:'下课可以玩',d2:'操场很大',
 blank:{pre:'有的跳绳，有的踢球，有的（',post:'）。',ans:'赛跑',w1:'睡觉',w2:'写作业'}},
{s:'妹妹的脸红得像苹果，谁见了都想捏一下。',src:'原创',lv:'L1',set:'生活烟火',type:'比喻',
 why:'脸红成苹果，可爱又馋人。',d1:'苹果是甜的',d2:'妹妹很小',
 blank:{pre:'红得像（',post:'）。',ans:'苹果',w1:'桃子',w2:'番茄'}},
{s:'竹外桃花三两枝，春江水暖鸭先知。',src:'苏轼《惠崇春江晚景》',lv:'L3',set:'国学经典',type:'古诗',
 why:'鸭子最先知道水暖，春天是从“感觉”开始的。',d1:'竹子是绿色的',d2:'鸭子会游泳',
 blank:{pre:'春江水暖（',post:'）先知。',ans:'鸭',w1:'鱼',w2:'鹅'}},
{s:'小荷才露尖尖角，早有蜻蜓立上头。',src:'杨万里《小池》',lv:'L2',set:'国学经典',type:'古诗',
 why:'蜻蜓来得比人还早，小池的夏天太美了。',d1:'蜻蜓会飞',d2:'荷花夏天开',
 blank:{pre:'早有（',post:'）立上头。',ans:'蜻蜓',w1:'蝴蝶',w2:'小鸟'}},
{s:'一叶渔船两小童，收篙停棹坐船中。',src:'杨万里《舟过安仁》',lv:'L3',set:'国学经典',type:'古诗',
 why:'收桨不划留下悬念，下一句揭晓鬼主意。',d1:'船在水上',d2:'篙是撑船的',
 blank:{pre:'收（',post:'）停棹坐船中。',ans:'篙',w1:'网',w2:'伞'}},
{s:'天对地，雨对风，大陆对长空。',src:'《声律启蒙》',lv:'L1',set:'国学经典',type:'对韵',
 why:'字字相对，读起来像唱歌一样顺口。',d1:'天很高',d2:'下雨常刮风',
 blank:{pre:'大陆对（',post:'）。',ans:'长空',w1:'大海',w2:'高山'}},
{s:'两岸晓烟杨柳绿，一园春雨杏花红。',src:'《声律启蒙》',lv:'L2',set:'国学经典',type:'对韵',
 why:'绿对红、柳对杏，像一幅春天的对联画。',d1:'杨柳是绿的',d2:'春雨细细的',
 blank:{pre:'一园春雨（',post:'）红。',ans:'杏花',w1:'桃花',w2:'梅花'}},
{s:'天街小雨润如酥，草色遥看近却无。',src:'韩愈《早春》',lv:'L3',set:'国学经典',type:'古诗',
 why:'远看有绿近看无，早春小草写得那么微妙。',d1:'雨很小',d2:'草是绿的',
 blank:{pre:'草色遥看（',post:'）却无。',ans:'近',w1:'远',w2:'细'}},
{s:'白鹭实在是一首诗，一首韵在骨子里的散文诗。',src:'郭沫若《白鹭》',lv:'L3',set:'自然四季',type:'比喻',
 why:'把鸟比作诗，美到说不出的程度。',d1:'白鹭会飞',d2:'诗讲究押韵',
 blank:{pre:'一首韵在骨子里的（',post:'）。',ans:'散文诗',w1:'小歌谣',w2:'画'}}
];
var PICK_SETS=['自然四季','想象王国','生活烟火','国学经典'];
var PICK_SET_ICON={ '自然四季':'🌿','想象王国':'🪄','生活烟火':'🏮','国学经典':'📜' };

/* ---------- 存档扩展 ---------- */
function ensurePick(){
  if(!PROG.pick) PROG.pick={};
  var P=PROG.pick;
  if(!P.done) P.done={};
  if(!P.cards) P.cards={};
  if(!P.pocket) P.pocket=[];
  if(!P.book) P.book=[];
  if(!P.pkGot) P.pkGot=[];
  if(!P.revSeen) P.revSeen={};
  if(!P.makeup) P.makeup={n:1,wk:0};
  var wk=weekNo();
  if(P.makeup.wk!==wk){ P.makeup.wk=wk; P.makeup.n=Math.min(3,P.makeup.n+1); }
  return P;
}
function weekNo(){ var d=new Date(); var s=new Date(d.getFullYear(),0,1); return Math.floor((((d-s)/86400000)+s.getDay()+6)/7); }

function pickToday(){
  var d=new Date();
  var idx=Math.floor(((d-new Date(d.getFullYear(),0,0))/86400000))%DAILY_SENTS.length;
  return DAILY_SENTS[idx];
}
function pickRarity(s){ /* 闪光15%：句哈希稳定判定 */
  var h=0; for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))%100000;
  return h%100<15?'闪光':'普通';
}

/* ---------- 每日一拾：四步闭环 ---------- */
function renderDailyPick(){
  clearTimers(); 
  var P=ensurePick();
  var S=pickToday();
  var tk=dateKey();
  var doneToday=!!P.done[tk];
  var rar=pickRarity(S.s);
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><div class="gtitle">🍀 每日一拾</div><div class="gsub">拾 → 读 → 懂 → 用，四步完成，句卡入册</div></div>'+
      (doneToday?'<div class="hub-rank">✅ 今天已经捡到宝啦！明天再来拾新句子。<br>今日句卡：<b>'+S.s+'</b></div>':'')+
      '<div class="pick-card">'+
        '<div class="pick-rar '+(rar==='闪光'?'rar-flash':'')+'">'+(rar==='闪光'?'✨ 闪光句':'句卡')+'</div>'+
        '<div class="pick-sent">'+rdEscape(S.s)+'</div>'+
        '<div class="pick-src">—— '+rdEscape(S.src)+' · '+S.lv+' · '+S.type+'</div>'+
      '</div>'+
      '<div class="pick-steps" id="pickSteps"></div>'+
      '<div class="pick-body" id="pickBody"></div>'+
    '</div>';
  updateHeader();
  var steps=['① 拾','② 读','③ 懂','④ 用'];
  var cur=doneToday?4:0;
  if(!doneToday&&!P.revSeen[tk]){ P.revSeen[tk]=1; saveProg(); }
  function drawSteps(){
    var h='<div class="ps-steps">';
    for(var i=0;i<4;i++) h+='<div class="ps-s'+(i<cur?' done':(i===cur?' cur':''))+'">'+(i<cur?'✓':'')+steps[i]+'</div>';
    h+='</div>';
    document.getElementById('pickSteps').innerHTML=h;
  }
  function drawBody(){
    var el=document.getElementById('pickBody');
    if(cur===0){
      el.innerHTML='<div class="step-tip">这句话你喜欢吗？先给它打个“喜欢”的标签（品味从表达喜好开始）</div>'+
        '<div class="step-ops"><button class="btn big" id="pkLike">❤️ 喜欢</button><button class="btn" id="pkMeh">👍 一般般</button></div>';
      $('#pkLike').addEventListener('click',function(){ AUDIO.tap(); AUDIO.quest(); goNext(); });
      $('#pkMeh').addEventListener('click',function(){ AUDIO.tap(); goNext(); });
    } else if(cur===1){
      el.innerHTML='<div class="step-tip">听范读，再自己大声跟读一遍（不认识的字会自动进生字口袋）</div>'+
        '<div class="step-ops"><button class="btn big" id="pkSay">🔊 听范读</button><button class="btn" id="pkRead">🎤 我读完啦</button></div>';
      $('#pkSay').addEventListener('click',function(){ AUDIO.tap(); speak(S.s); });
      $('#pkRead').addEventListener('click',function(){ AUDIO.tap(); AUDIO.quest(); goNext(); });
    } else if(cur===2){
      var opts=[S.why,S.d1,S.d2].sort(function(){ return Math.random()<0.5?-1:1; });
      el.innerHTML='<div class="step-tip">🤔 这句“好在哪”？选出最准的（答错不扣分，慢慢想）</div>'+
        opts.map(function(o,i){ return '<button class="btn full whybtn" data-i="'+i+'">'+rdEscape(o)+'</button>'; }).join('');
      el.querySelectorAll('.whybtn').forEach(function(b){
        b.addEventListener('click',function(){
          if(b.dataset.i==='0'){ AUDIO.tap(); AUDIO.quest(); goNext(); }
          else{
            AUDIO.tap();
            b.classList.add('wrongpick');
            toast('💡 再想想：'+S.why+' 这个答案才是这句的妙处');
          }
        });
      });
    } else if(cur===3){
      var B=S.blank;
      var opts2=[B.ans,B.w1,B.w2].sort(function(){ return Math.random()<0.5?-1:1; });
      el.innerHTML='<div class="step-tip">⚡ 30秒微任务：把句子补完整（这就是“用”）</div>'+
        '<div class="pick-blank">'+rdEscape(B.pre)+'<span class="pb-hole">？</span>'+rdEscape(B.post)+'</div>'+
        '<div class="step-ops">'+opts2.map(function(o){ return '<button class="btn optbtn">'+rdEscape(o)+'</button>'; }).join('')+'</div>';
      el.querySelectorAll('.optbtn').forEach(function(b){
        b.addEventListener('click',function(){
          if(b.textContent===B.ans){
            AUDIO.tap(); AUDIO.quest();
            finishPick(S,rar);
          } else {
            AUDIO.tap();
            b.classList.add('wrongpick');
            toast('💡 再试试：读一读整句话，看哪个词最顺口');
          }
        });
      });
    } else {
      el.innerHTML='<div class="step-tip">🎉 完成！句卡已入册，去“句卡收藏册”看看今天的新卡吧。</div>'+
        '<div class="step-ops"><button class="btn big" id="pkCards">🃏 打开收藏册</button></div>';
      $('#pkCards').addEventListener('click',function(){ AUDIO.tap(); renderPickBook(); });
    }
    drawSteps();
  }
  function goNext(){ cur++; drawBody(); }
  function finishPick(S,rar){
    var tk=dateKey();
    if(!P.done[tk]){
      P.done[tk]=1;
      if(!P.cards[S.s]){
        P.cards[S.s]={rar:rar,set:S.set,ts:Date.now()};
        if(META){ META.S.coins+=5; META.save(); }
        toast('🃏 '+(rar==='闪光'?'✨ 闪光句卡':'句卡')+'入册！+5 铜钱');
        if(window.ANIM) ANIM.burst();
      }
      saveProg();
      META.trackLearn();
    }
    cur=4; drawBody();
  }
  drawSteps(); drawBody();
}

/* ---------- 句卡收藏册 ---------- */
function renderPickBook(){
  clearTimers(); 
  var P=ensurePick();
  var ids=Object.keys(P.cards);
  var flash=0;
  ids.forEach(function(s){ if(P.cards[s].rar==='闪光') flash++; });
  var setRows=PICK_SETS.map(function(sn){
    var inSet=ids.filter(function(s){ return P.cards[s].set===sn; });
    var pct=Math.min(5,inSet.length);
    var done=inSet.length>=5;
    return '<div class="setrow '+(done?'setdone':'')+'">'+
      '<div class="set-ic">'+PICK_SET_ICON[sn]+'</div>'+
      '<div class="set-mid"><b>'+sn+'套装</b><div class="setbar"><span style="width:'+(pct*20)+'%"></span></div></div>'+
      '<div class="set-n">'+inSet.length+'/5 '+(done?'<b>🎖️ 集齐！</b>':'')+'</div>'+
    '</div>';
  }).join('');
  var cardHtml=ids.length?ids.slice().sort(function(a,b){ return P.cards[b].ts-P.cards[a].ts; }).slice(0,60).map(function(s){
    var c=P.cards[s];
    return '<div class="pickcard '+(c.rar==='闪光'?'rar-flash':'')+'">'+
      '<div class="pc-rar">'+(c.rar==='闪光'?'✨ 闪光':'普通')+'</div>'+
      '<div class="pc-s">'+rdEscape(s)+'</div>'+
      '<div class="pc-set">'+PICK_SET_ICON[c.set]+' '+c.set+'</div>'+
    '</div>';
  }).join(''):'<div class="readtip">还没有句卡哦，去「每日一拾」捡第一张吧！</div>';
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><div class="gtitle">🃏 句卡收藏册</div><div class="gsub">集齐套装 5 张，得套装徽章</div></div>'+
      '<div class="cardstats">'+
        '<div class="cs gold"><b>'+ids.length+'</b><span>句卡</span></div>'+
        '<div class="cs"><b>'+flash+'</b><span>闪光</span></div>'+
        '<div class="cs"><b>'+(ids.length-flash)+'</b><span>普通</span></div>'+
        '<div class="cs green"><b>'+PICK_SETS.filter(function(sn){ return ids.filter(function(s){return P.cards[s].set===sn;}).length>=5; }).length+'</b><span>集齐套装</span></div>'+
        '<div class="cs blue"><b>'+Object.keys(P.done).length+'</b><span>拾句天</span></div>'+
      '</div>'+
      setRows+
      '<div class="pickcard-grid">'+cardHtml+'</div>'+
    '</div>';
  updateHeader();
}

/* ---------- 生字口袋 ---------- */
function pocketAdd(w){
  var P=ensurePick();
  if(P.pocket.indexOf(w)<0){
    P.pocket.push(w); saveProg();
    AUDIO.quest();
    toast('🎒 「'+w+'」进了生字口袋，明天变字卡游戏');
  }
}
var PKGAME=null;
function renderPocket(){
  clearTimers(); 
  var P=ensurePick();
  var pool=P.pocket.filter(function(w){ return !P.pkGot||P.pkGot.indexOf(w)<0; });
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><div class="gtitle">🎒 生字口袋</div><div class="gsub">阅读时点“不认识”收进来，2 分钟字卡游戏消化掉</div></div>'+
      '<div class="hub-rank">口袋里有 <b>'+(pool.length)+'</b> 个待认字 · 已认 <b>'+(P.pkGot?P.pkGot.length:0)+'</b> 个</div>'+
      (pool.length?'<div class="pocket-grid">'+pool.slice(0,24).map(function(w){ return '<div class="pocket-ch">'+rdEscape(w)+'</div>'; }).join('')+'</div>':'')+
      (pool.length?
        '<button class="btn big full" id="pkGo">▶ 开始 2 分钟字卡游戏</button>'
        :'<div class="readtip">🎉 口袋空了！去悦读馆读一篇短文，点一点不认识的字吧。</div>')+
    '</div>';
  updateHeader();
  var go=$('#pkGo');
  if(go) go.addEventListener('click',function(){ AUDIO.tap(); pocketGame(pool); });
}
function pocketGame(pool){
  if(PKGAME){ clearTimeout(PKGAME.tm); }
  PKGAME={tm:null};
  var idxMap={}, allWords=[];
  rdAll().forEach(function(a){ (a.words||[]).forEach(function(w){
    if(!idxMap[w.w]){ idxMap[w.w]=w; allWords.push(w); }
  }); });
  function randOpts(ans,kind){
    var opts=[ans], tries=0;
    while(opts.length<4&&tries<300){
      tries++;
      var w=allWords[Math.floor(Math.random()*allWords.length)];
      var v=kind==='m'?w.mean:(w.w.length===1?w.w:null);
      if(v&&v!==ans&&opts.indexOf(v)<0) opts.push(v);
    }
    while(opts.length<4) opts.push('★ 其它 ★');
    return opts.sort(function(){ return Math.random()<0.5?-1:1; });
  }
  var items=[];
  pool.forEach(function(w){
    var info=idxMap[w];
    if(!info) return;
    if(info.mean) items.push({kind:'m', w:w, q:'“'+w+'”的意思是？', ans:info.mean, opts:randOpts(info.mean,'m')});
    if(info.ex&&info.ex.indexOf(w)>=0) items.push({kind:'b', w:w, q:'选词补句：'+rdEscape(info.ex.replace(w,'（　）')), ans:w, opts:randOpts(w,'b')});
  });
  if(items.length<1){ toast('口袋里的字还缺词卡数据，先去读几篇短文吧'); return; }
  var q=items.slice().sort(function(){ return Math.random()<0.5?-1:1; }).slice(0,10);
  var qi=0, right=0, hit={}, left=120;
  var HTML='<div class="readhome"><div class="ghead"><div class="gtitle">🎒 字卡小游戏</div><div class="gsub">2 分钟 · 认对 3 次就出袋</div></div>'+
    '<div class="hub-rank">⏱️ <span id="pkTimer">02:00</span> · 答对 <b id="pkRight">0</b>/'+q.length+'</div>'+
    '<div class="pk-q" id="pkQ"></div><div class="step-ops" id="pkOps"></div></div>';
  app.innerHTML=HTML; updateHeader();
  var tm=setInterval(function(){
    left--;
    var el=document.getElementById('pkTimer');
    if(el) el.textContent=('0'+Math.floor(left/60)).slice(-2)+':'+('0'+(left%60)).slice(-2);
    if(left<=0) endGame();
  },1000);
  PKGAME.tm=tm;
  function endGame(){
    clearInterval(tm);
    var got=Object.keys(hit);
    var P=ensurePick();
    if(!P.pkGot) P.pkGot=[];
    got.forEach(function(w){ if(P.pkGot.indexOf(w)<0) P.pkGot.push(w); });
    saveProg();
    app.innerHTML='<div class="readhome"><div class="ghead"><div class="gtitle">🎒 字卡小游戏</div></div>'+
      '<div class="hub-rank">本轮认会 <b>'+got.length+'</b> 个字：'+got.map(function(w){return '「'+w+'」';}).join(' ')+'</div>'+
      '<div class="readtip">'+(got.length?'它们出袋啦！每天来玩一次，口袋越来越轻。':'再多练几次，字会认识你的。')+'</div>'+
      '<button class="btn big full" id="pkBack">回生字口袋</button></div>';
    $('#pkBack').addEventListener('click',function(){ AUDIO.tap(); renderPocket(); });
    updateHeader();
  }
  function nextQ(){
    if(qi>=q.length) endGame();
    else{
      var it=q[qi];
      var opts=it.opts;
      var h='<div class="pk-qs">'+it.q+'</div>';
      document.getElementById('pkQ').innerHTML=h;
      var ops=document.getElementById('pkOps');
      ops.innerHTML=opts.map(function(o){ return '<button class="btn optbtn">'+rdEscape(o)+'</button>'; }).join('');
      ops.querySelectorAll('.optbtn').forEach(function(b){
        b.addEventListener('click',function(){
          if(b.textContent===it.ans){
            AUDIO.tap(); AUDIO.quest(); right++;
            hit[it.w]=(hit[it.w]||0)+1;
            if(hit[it.w]<3) { /* 再出一题同字 */ var more=items.filter(function(x){return x.w===it.w&&x.kind!==it.kind;});
              if(more.length&&Math.random()<0.6) q.splice(qi+1,0,more[0]); }
            document.getElementById('pkRight').textContent=right;
          } else {
            AUDIO.tap(); try{ if(navigator.vibrate) navigator.vibrate(60); }catch(e){}
            b.classList.add('wrongpick');
          }
          qi++; nextQ();
        });
      });
    }
  }
  nextQ();
}

/* ---------- 徽章墙 ---------- */
function badgeInfo(){
  var P=ensurePick();
  var C=getCards?getCards():{owned:{}};
  var q=getQ5?getQ5():{arena:{best:0}};
  var rar=arenaRank(q.arena.best)[1];
  var B=[
    {on:false, ic:'🔥', n:'小火苗', d:'连续学习 7 天'},
    {on:false, ic:'🥉', n:'青铜火苗', d:'连续学习 21 天'},
    {on:false, ic:'🥈', n:'白银火苗', d:'连续学习 50 天'},
    {on:false, ic:'🥇', n:'黄金火苗', d:'连续学习 100 天'},
    {on:false, ic:'🃏', n:'拾句新人', d:'句卡 10 张'},
    {on:false, ic:'🃏', n:'句卡达人', d:'句卡 30 张'},
    {on:false, ic:'🎖️', n:'套装收藏家', d:'集齐 2 套套装'},
    {on:false, ic:'🦉', n:'字灵学徒', d:'图鉴 50 张'},
    {on:false, ic:'🦉', n:'字灵大师', d:'图鉴 150 张'},
    {on:false, ic:'⚔️', n:'擂台青铜', d:'擂台段位青铜以上'},
    {on:false, ic:'⚔️', n:'擂台黄金', d:'擂台段位黄金以上'},
    {on:false, ic:'🎒', n:'口袋清空员', d:'累计认会 30 个口袋字'}
  ];
  var s=(META&&META.S)?META.S:{streak:0};
  if(s.streak>=7) B[0].on=true;
  if(s.streak>=21) B[1].on=true;
  if(s.streak>=50) B[2].on=true;
  if(s.streak>=100) B[3].on=true;
  var nc=Object.keys(P.cards).length;
  if(nc>=10) B[4].on=true;
  if(nc>=30) B[5].on=true;
  var fullSets=PICK_SETS.filter(function(sn){ return Object.keys(P.cards).filter(function(s){return P.cards[s].set===sn;}).length>=5; }).length;
  if(fullSets>=2) B[6].on=true;
  var ng=Object.keys(C.owned).length;
  if(ng>=50) B[7].on=true;
  if(ng>=150) B[8].on=true;
  if(rar!=='青铜') B[9].on=true;
  if(['黄金','钻石','字灵大师'].indexOf(rar)>=0) B[10].on=true;
  if((P.pkGot?P.pkGot.length:0)>=30) B[11].on=true;
  return B;
}
function renderBadges(){
  clearTimers(); 
  var B=badgeInfo();
  var got=B.filter(function(b){ return b.on; }).length;
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><div class="gtitle">🏅 徽章墙</div><div class="gsub">只和昨天的自己比，没有排行榜</div></div>'+
      '<div class="hub-rank">已点亮 <b>'+got+'</b>/'+B.length+' 枚徽章</div>'+
      '<div class="badge-grid">'+B.map(function(b){
        return '<div class="badge '+(b.on?'bon':'boff')+'"><div class="b-ic">'+b.ic+'</div><div class="b-n">'+b.n+'</div><div class="b-d">'+b.d+'</div></div>';
      }).join('')+'</div>'+
    '</div>';
  updateHeader();
}

/* ---------- 句子本（用出去的句子） ---------- */
function bookAdd(txt,kind){
  var P=ensurePick();
  P.book.unshift({t:txt,k:kind,ts:Date.now()});
  if(P.book.length>200) P.book.length=200;
  saveProg();
}
function renderSentBook(){
  clearTimers(); 
  var P=ensurePick();
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><div class="gtitle">📓 我的句子本</div><div class="gsub">每句仿写、每段微写作，都是“用出去”的证据</div></div>'+
      '<div class="hub-rank">已写出 <b>'+P.book.length+'</b> 句自己的话 · 家长周报会展示它们</div>'+
      (P.book.length?P.book.slice(0,60).map(function(b){
        var d=new Date(b.ts);
        return '<div class="sentbook-item"><div class="sb-t">'+rdEscape(b.t)+'</div>'+
          '<div class="sb-meta">'+(b.k==='仿写'?'✏️ 仿写':'📝 微写作')+' · '+(d.getMonth()+1)+'月'+d.getDate()+'日'+
          ' <button class="btn mini sbsay" data-t="'+rdEscape(b.t)+'">🔊</button></div></div>';
      }).join(''):'<div class="readtip">还没有自己的句子。去悦读馆选一句好句，仿写你的第一句吧！</div>')+
    '</div>';
  updateHeader();
  document.querySelectorAll('.sbsay').forEach(function(b){
    b.addEventListener('click',function(){ speak(b.dataset.t); });
  });
}

/* ---------- 补签卡 ---------- */
function makeupCount(){
  var P=ensurePick();
  return P.makeup.n;
}
function useMakeup(dayKey){
  var P=ensurePick();
  if(P.makeup.n<1){ toast('没有补签卡了，每周自动发 1 张'); return false; }
  P.makeup.n--; saveProg();
  if(META&&META.S){
    var ds=META.S.days||[];
    if(ds.indexOf(dayKey)<0) ds.push(dayKey);
    META.S.days=ds;
    META.recalcStreak?META.recalcStreak():0;
    META.save();
  }
  toast('🔥 补签成功！火苗保住了');
  return true;
}
