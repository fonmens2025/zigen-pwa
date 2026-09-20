/* ================= 句芽·悦读馆：听读→点藏→仿写→运用→微写作 ================= */
'use strict';
/* 不抄一页，会用一句。 */
function rdAll(){
  return (window.READ_DATA||[]).concat(window.READ_DATA2||[]).concat(window.READ_CLASSICS||[]).concat(window.READ_DATA3||[]);
}
function getRead(){
  if(!PROG.read) PROG.read={read:{},savedW:[],savedS:[],mimicDone:{},used:{},writeDone:[],flow:{}};
  var R=PROG.read;
  if(!R.read) R.read={};
  if(!R.savedW) R.savedW=[];
  if(!R.savedS) R.savedS=[];
  if(!R.mimicDone) R.mimicDone={};
  if(!R.used) R.used={};
  if(!R.writeDone) R.writeDone=[];
  if(!R.flow) R.flow={};
  return R;
}
function rdById(id){
  var d=rdAll();
  for(var i=0;i<d.length;i++) if(d[i].id===id) return d[i];
  return null;
}
function rdEscape(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* 把正文按句切分（不用后行断言，兼容老 WebView），好词好句高亮包裹 */
function rdSplitSents(body){
  var m=body.match(/[^。！？」”"]+[。！？」”"]?/g);
  return m||[body];
}
function rdBodyHtml(art){
  var body=art.text.join('');
  var sents=rdSplitSents(body);
  var out='';
  for(var i=0;i<sents.length;i++){
    var s=sents[i];
    if(!s) continue;
    var seg=rdEscape(s);
    /* 先做整句高亮（好句），再做词高亮，避免词span切断好句匹配 */
    for(var k=0;k<art.sents.length;k++){
      var st=art.sents[k].s;
      var variants=[st, st.replace(/["''"]$/,''), st.replace(/^["''"]/,'').replace(/["''"]$/,'')];
      for(var v=0;v<variants.length;v++){
        var esc=rdEscape(variants[v]);
        if(esc&&seg.indexOf(esc)>=0){
          seg=seg.split(esc).join('<span class="rds" data-rds="'+k+'">'+esc+'</span>');
          break;
        }
      }
    }
    var words=art.words.slice().sort(function(a,b){return b.w.length-a.w.length;});
    for(var j=0;j<words.length;j++){
      var w=words[j].w;
      if(seg.indexOf(w)>=0){
        seg=seg.split(w).join('<span class="rdw" data-rdw="'+rdEscape(w)+'">'+w+'</span>');
      }
    }
    out+='<span class="rdsent" data-say="'+rdEscape(s)+'">'+seg+'</span>';
  }
  return out;
}

var READ_TAB='all';
/* ---------- 悦读馆首页 ---------- */
function renderReadHome(){
  clearTimers();
  setNav('home');
  var R=getRead();
  var all=rdAll();
  var readCount=Object.keys(R.read).length;
  var savedN=R.savedW.length+R.savedS.length;
  var flow=flowState();
  var tabs=[['all','全部'],['lv1','一二年级'],['lv2','三四年级'],['lv3','五六年级'],['pic','绘本主题'],['fairy','童话寓言'],['master','名家名段']];
  var tabHtml=tabs.map(function(t){
    return '<button class="rtab'+(READ_TAB===t[0]?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>';
  }).join('');
  var items=rdAll().filter(function(a){
    if(READ_TAB==='all') return true;
    if(READ_TAB==='lv1'||READ_TAB==='lv2'||READ_TAB==='lv3') return a.lv===+READ_TAB.slice(2);
    if(READ_TAB==='pic') return a.src&&a.src.indexOf('主题启发')>=0;
    if(READ_TAB==='fairy') return a.src&&(a.src.indexOf('寓言')>=0||a.src.indexOf('童话')>=0||a.src.indexOf('神话')>=0);
    if(READ_TAB==='master') return a.src&&(a.src.indexOf('古诗')>=0||a.src.indexOf('《')===0||a.src.indexOf('鲁迅')>=0||a.src.indexOf('朱自清')>=0||a.src.indexOf('老舍')>=0||a.src.indexOf('丰子恺')>=0);
    return true;
  });
  var listHtml=items.map(function(a){
    var isRead=!!R.read[a.id];
    var best=R.mimicDone[a.id]||0;
    return '<div class="rditem'+(isRead?' read':'')+'" data-id="'+a.id+'">'+
      '<span class="rdi-check">'+(isRead?'✅':'📖')+'</span>'+
      '<div class="rdi-main"><b>'+a.title+'</b>'+
      '<small>'+(a.src?('📜 '+a.src.split('（')[0]+' · '):'')+a.words.length+' 好词 · '+a.sents.length+' 好句 · '+(isRead?('仿写 '+best+'★'):'未读')+'</small></div>'+
      '<span class="rdi-go">›</span></div>';
  }).join('');
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="rdBack">🏠 首页</button><div class="gtitle">📖 句芽 · 悦读馆</div></div>'+
      '<div class="flowcard" id="flowCard">'+
        '<div class="flowhead"><b>⏱️ 今日 10 分钟</b><span class="flowsub">听读→选句→仿一句→用一次</span></div>'+
        '<div class="flowsteps">'+flowStepsHtml(flow)+'</div>'+
        '<button class="btn big" id="btnFlow">'+(flow.step>=5?'✅ 已完成，再来一轮':'▶️ 开始今天的 10 分钟')+'</button>'+
      '</div>'+
      '<div class="readhero">'+
        '<p><b>不抄一页，会用一句。</b>点一点收藏好词好句，读完就练仿写，写一次微写作——读写循环就转起来了。</p>'+
        '<div class="readstats"><span>已读 '+readCount+'/'+all.length+' 篇</span><span>积词本 '+savedN+' 条</span><span>微写作 '+R.writeDone.length+' 次</span></div>'+
      '</div>'+
      '<div class="rbtns">'+
        '<button class="btn" id="btnWordBook">🗂️ 积词本（'+savedN+'）</button>'+
        '<button class="btn secondary" id="btnTree">🌳 成长树</button>'+
        '<button class="btn secondary" id="btnBooks">🏆 获奖书单（'+(window.READ_BOOKS||[]).length+'）</button>'+
      '</div>'+
      '<div class="rtabs">'+tabHtml+'</div>'+
      '<div class="rdlist">'+listHtml+'</div>'+
      '<div class="readtip">💡 <b>给家长：</b>写字慢，就先别抄。这里"点藏"代替摘抄，"仿写"代替硬背，每天 10 分钟，让阅读先发生。</div>'+
    '</div>';
  $('#rdBack').addEventListener('click',renderHome);
  $('#btnWordBook').addEventListener('click',renderWordBook);
  $('#btnTree').addEventListener('click',renderTree);
  $('#btnBooks').addEventListener('click',renderBooks);
  $('#btnFlow').addEventListener('click',function(){ renderFlow(); });
  $all('.rtab').forEach(function(el){
    el.addEventListener('click',function(){ AUDIO.tap(); READ_TAB=el.getAttribute('data-tab'); renderReadHome(); });
  });
  $all('.rditem').forEach(function(el){
    el.addEventListener('click',function(){ AUDIO.tap(); renderReadArticle(el.getAttribute('data-id')); });
  });
  updateHeader();
}

/* ---------- 今日10分钟流程 ---------- */
function todayStr2(){ var d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function flowState(){
  var R=getRead();
  if(R.flow.date!==todayStr2()) R.flow={date:todayStr2(),step:0};
  return R.flow;
}
function flowStepsHtml(flow){
  var steps=[['📻','听读 2 分钟'],['⭐','选 1 个好句'],['✏️','仿写 1 句'],['🖊️','用 1 次'],['🌱','长句芽']];
  var h='';
  for(var i=0;i<5;i++){
    h+='<div class="fstep'+(flow.step>i?' done':'')+(flow.step===i?' now':'')+'">'+
      '<span class="fsic">'+(flow.step>i?'✓':steps[i][0])+'</span><span>'+steps[i][1]+'</span></div>';
  }
  return h;
}
function flowUpdate(){
  var el=document.querySelector('.flowsteps');
  if(el) el.innerHTML=flowStepsHtml(flowState());
}
function renderFlow(){
  clearTimers();
  var R=getRead();
  var flow=flowState();
  var all=rdAll();
  var dayIdx=(new Date().getDate())%all.length;
  var art=all[dayIdx];
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="fBack">← 悦读馆</button><div class="gtitle">⏱️ 今日 10 分钟</div></div>'+
      '<div class="flowcard">'+
        '<div class="flowhead"><b>今日文章：《'+art.title+'》</b></div>'+
        '<div class="flowsteps">'+flowStepsHtml(flow)+'</div>'+
      '</div>'+
      '<div id="flowBody"></div>'+
    '</div>';
  $('#fBack').addEventListener('click',renderReadHome);
  function showFlowStep(){
    var body=document.getElementById('flowBody');
    if(flow.step===0){
      body.innerHTML='<h3 class="fh3">第一步：听读 2 分钟 📻</h3><p class="flowtip">不考试、不查词。点句子听朗读，遇到金色词语就点开看看。读不完也没关系——先读起来。</p>'+
        '<div class="rbtns"><button class="btn big" id="fGoRead">📖 开始读《'+art.title+'》</button></div>';
      body.querySelector('#fGoRead').addEventListener('click',function(){
        body.innerHTML='<div class="rd-body">'+rdBodyHtml(art)+'</div>'+
          '<div class="rd-actions"><button class="btn" id="fReadAll">🔊 全文朗读</button>'+
          '<button class="btn big" id="fReadOk">✅ 读完了</button></div>';
        bindArticleInteractions(body,art);
        bindReadAll(body.querySelector('#fReadAll'),body);
        body.querySelector('#fReadOk').addEventListener('click',function(){
          R.read[art.id]=Date.now(); saveProg();
          META.quest('read_article'); META.addCoins(10); META.addXP(15);
          flow.step=Math.max(flow.step,1); saveProg();
          var n=0; for(var k in R.read) if(R.read[k]) n++;
          if(n>=5) META.award('reader5');
          flowUpdate(); toast('第一步完成！去选个好句吧');
          showFlowStep();
        });
      });
    } else if(flow.step===1){
      body.innerHTML='<h3 class="fh3">第二步：选 1 个好句 ⭐</h3><p class="flowtip">回到文章里，点一句你喜欢的带下划线句子，点"收进积词本"。选完这句，今天的积累就完成了——不用抄。</p>'+
        '<div class="rbtns"><button class="btn big" id="fGoPick">🔍 去文章里选句</button></div>';
      body.querySelector('#fGoPick').addEventListener('click',function(){
        body.innerHTML='<div class="rd-body">'+rdBodyHtml(art)+'</div><p class="flowtip">点击带下划线的句子收藏它。</p>';
        bindArticleInteractions(body,art,function(){
          flow.step=Math.max(flow.step,2); saveProg(); flowUpdate();
          toast('⭐ 好句已收藏！进入仿写');
          showFlowStep();
        });
      });
    } else if(flow.step===2){
      body.innerHTML='<h3 class="fh3">第三步：仿写 1 句 ✏️</h3><p class="flowtip">照着好句的样子，换个词、换个场景，说出你自己的句子。点下面按钮开始。</p>'+
        '<div class="rbtns"><button class="btn big" id="fGoMimic">✍️ 去仿写《'+art.title+'》</button></div>';
      body.querySelector('#fGoMimic').addEventListener('click',function(){
        renderFlowMimic(art);
      });
    } else if(flow.step===3){
      body.innerHTML='<h3 class="fh3">第四步：用 1 次 🖊️</h3><p class="flowtip">把你收藏的句子，真的用一次——写两三句话就行。可以先用语音输入，再慢慢改，没人打分。</p>'+
        '<div class="rbtns"><button class="btn big" id="fGoWrite">🖊️ 开始微写作</button></div>';
      body.querySelector('#fGoWrite').addEventListener('click',function(){ renderMiniWrite(); });
    } else {
      body.innerHTML='<h3 class="fh3">🎉 今天的循环完成啦！</h3><p class="flowtip">读了一点，藏了一句，仿了一句，用了一次——这就是积累的正确打开方式。句芽长出来啦！</p>'+
        '<div class="rbtns">'+
        '<button class="btn big" id="fDone">🌱 收下句芽（+30铜钱）</button>'+
        '<button class="btn secondary" id="fAgain">再来一轮</button></div>';
      body.querySelector('#fDone').addEventListener('click',function(){
        flow.step=5; saveProg();
        META.addCoins(30); META.addXP(30);
        if(window.ANIM) ANIM.burst();
        toast('🌱 句芽已收下！明天再来');
        renderTree();
      });
      body.querySelector('#fAgain').addEventListener('click',function(){
        flow.step=0; saveProg(); showFlowStep(); flowUpdate();
      });
    }
  }
  showFlowStep();
  updateHeader();
}
function renderFlowMimic(art){
  var body=document.getElementById('flowBody');
  body.innerHTML='<h3 class="fh3">✏️ 仿写挑战 · 《'+art.title+'》</h3><div id="flowMimicArea"></div>';
  runMimicInline(art,'flowMimicArea',function(stars){
    var R=getRead();
    if(stars>0&&(!R.mimicDone[art.id]||stars>R.mimicDone[art.id])){ R.mimicDone[art.id]=stars; saveProg(); }
    var doneCount=0; for(var k in R.mimicDone) if(R.mimicDone[k]) doneCount++;
    if(doneCount>=5) META.award('mimic5');
    META.onGameEnd(stars);
    var flow=flowState();
    if(stars>0){ flow.step=Math.max(flow.step,3); saveProg(); }
    body.innerHTML='<div class="mwfb"><div class="mwfb-b">🎉 仿写完成！'+stars+' 星</div>'+
      '<div class="rbtns"><button class="btn big" id="fmNext">进入下一步 →</button></div></div>';
    body.querySelector('#fmNext').addEventListener('click',function(){ renderFlow(); });
    flowUpdate();
  });
}

/* ---------- 全文朗读：TTS 完成回调逐句推进 + 高亮跟读 + 可停止 ---------- */
function bindReadAll(btn,root){
  btn.addEventListener('click',function(){
    AUDIO.tap();
    if(TTS_READING){ stopReading(); btn.textContent='🔊 全文朗读'; return; }
    var sents=$all('.rdsent',root);
    if(!sents.length) return;
    if(!SOUND){ toast('先打开右上角的声音开关哦'); return; }
    var i=0, stopped=false;
    TTS_READING={stop:function(){
      stopped=true;
      sents.forEach(function(s){ s.classList.remove('reading'); });
      btn.textContent='🔊 全文朗读';
    }};
    btn.textContent='⏹ 停止朗读';
    (function step(){
      if(stopped) return;
      if(i>=sents.length){
        stopReading();
        btn.textContent='🔊 全文朗读';
        toast('读完了！');
        return;
      }
      var el=sents[i];
      sents.forEach(function(s){ s.classList.remove('reading'); });
      el.classList.add('reading');
      try{ el.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){}
      speakT(el.getAttribute('data-say'),function(){ i++; step(); });
    })();
  });
}

/* 文章内交互绑定（句子朗读/词卡/句卡） */
function bindArticleInteractions(root,art,onSaveSent){
  $all('.rdsent',root).forEach(function(el){
    el.addEventListener('click',function(){ AUDIO.tap(); speak(el.getAttribute('data-say')); });
  });
  $all('.rdw',root).forEach(function(el){
    el.addEventListener('click',function(ev){
      ev.stopPropagation();
      var w=el.getAttribute('data-rdw');
      for(var i=0;i<art.words.length;i++) if(art.words[i].w===w) openWordCard(art.words[i]);
      speak(w);
    });
  });
  $all('.rds',root).forEach(function(el){
    el.addEventListener('click',function(ev){
      ev.stopPropagation();
      var s=art.sents[+el.getAttribute('data-rds')];
      openSentCard(s,onSaveSent);
      speak(s.s);
    });
  });
}

/* ---------- 阅读页 ---------- */
function renderReadArticle(id){
  clearTimers();
  var art=rdById(id);
  if(!art){ renderReadHome(); return; }
  var R=getRead();
  var lvName=art.lv===1?'一二年级':(art.lv===2?'三四年级':'五六年级');
  app.innerHTML=
    '<div class="readpage">'+
      '<div class="ghead"><button class="btn ghost small" id="rdBack">← 悦读馆</button><div class="gtitle">'+art.title+'</div></div>'+
      '<div class="rd-meta"><span class="rd-lv">'+lvName+'</span>'+(art.src?'<span class="rd-src">📜 '+art.src+'</span>':'')+'<span>点句子听朗读 · 点金色词语看词卡</span></div>'+
      '<div class="rd-body" id="rdBody">'+rdBodyHtml(art)+'</div>'+
      '<div class="rd-actions">'+
        '<button class="btn" id="btnReadAll">🔊 全文朗读</button>'+
        '<button class="btn secondary" id="btnReadDone">✅ 我读完了</button>'+
        '<button class="btn secondary" id="btnMimicGo">✍️ 仿写挑战</button>'+
      '</div>'+
    '</div>';
  $('#rdBack').addEventListener('click',renderReadHome);
  bindArticleInteractions(app,art);
  bindReadAll($('#btnReadAll'),$('#rdBody'));
  $('#btnReadDone').addEventListener('click',function(){
    if(!R.read[art.id]){
      R.read[art.id]=Date.now(); saveProg();
      META.quest('read_article');
      META.addCoins(20); META.addXP(20);
      toast('🎉 读完《'+art.title+'》！+20铜钱');
      if(window.ANIM) ANIM.burst();
      var n=0; for(var k in R.read) if(R.read[k]) n++;
      if(n>=5) META.award('reader5');
    } else { toast('已经读过啦，去仿写挑战吧！'); }
    this.textContent='✅ 已读';
  });
  $('#btnMimicGo').addEventListener('click',function(){ renderMimic(id); });
  updateHeader();
}

/* ---------- 词卡弹窗 ---------- */
function openWordCard(w){
  var R=getRead();
  var saved=R.savedW.indexOf(w.w)>=0;
  var mask=document.createElement('div');
  mask.className='modal-mask';
  mask.innerHTML=
    '<div class="wcard">'+
      '<button class="modal-x" id="wcX">✕</button>'+
      '<div class="wc-word">'+rdEscape(w.w)+'</div>'+
      '<div class="wc-mean">'+rdEscape(w.mean)+'</div>'+
      '<div class="wc-ex">例句：'+rdEscape(w.ex)+'</div>'+
      '<div class="wc-ops">'+
        '<button class="btn" id="wcSay">🔊 再听一遍</button>'+
        '<button class="btn big" id="wcSave">'+(saved?'✓ 已收藏':'＋ 收进积词本')+'</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(mask);
  mask.querySelector('#wcX').addEventListener('click',function(){ mask.remove(); });
  mask.addEventListener('click',function(ev){ if(ev.target===mask) mask.remove(); });
  mask.querySelector('#wcSay').addEventListener('click',function(){ speak(w.w); });
  var saveBtn=mask.querySelector('#wcSave');
  saveBtn.addEventListener('click',function(){
    if(R.savedW.indexOf(w.w)<0){
      R.savedW.push(w.w); saveProg();
      AUDIO.quest();
      toast('＋ 《'+w.w+'》已收进积词本');
      if(R.savedW.length+R.savedS.length>=30) META.award('words30');
    }
    saveBtn.textContent='✓ 已收藏';
  });
}

/* ---------- 好句卡弹窗 ---------- */
function openSentCard(s,onSave){
  var R=getRead();
  var saved=R.savedS.indexOf(s.s)>=0;
  var usedCount=R.used[s.s]||0;
  var mask=document.createElement('div');
  mask.className='modal-mask';
  mask.innerHTML=
    '<div class="wcard">'+
      '<button class="modal-x" id="scX">✕</button>'+
      '<div class="wc-sent">'+rdEscape(s.s)+'</div>'+
      '<div class="wc-pat">句式：'+rdEscape(s.pat)+'</div>'+
      '<div class="wc-ex">'+rdEscape(s.teach)+'</div>'+
      (usedCount?'<div class="wc-used">已用过 '+usedCount+' 次 ✅</div>':(saved?'<div class="wc-sleep">💤 这句还在睡觉，去微写作里用一次吧！</div>':''))+
      '<div class="wc-ops">'+
        '<button class="btn" id="scSay">🔊 再听一遍</button>'+
        '<button class="btn big" id="scSave">'+(saved?'✓ 已收藏':'＋ 收进积词本')+'</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(mask);
  mask.querySelector('#scX').addEventListener('click',function(){ mask.remove(); });
  mask.addEventListener('click',function(ev){ if(ev.target===mask) mask.remove(); });
  mask.querySelector('#scSay').addEventListener('click',function(){ speak(s.s); });
  var saveBtn=mask.querySelector('#scSave');
  saveBtn.addEventListener('click',function(){
    if(R.savedS.indexOf(s.s)<0){
      R.savedS.push(s.s); saveProg();
      AUDIO.quest();
      toast('＋ 好句已收进积词本');
      if(R.savedW.length+R.savedS.length>=30) META.award('words30');
      if(onSave) onSave();
    }
    saveBtn.textContent='✓ 已收藏';
  });
}

/* ---------- 积词本 ---------- */
function renderWordBook(){
  clearTimers();
  var R=getRead();
  var has=R.savedW.length||R.savedS.length;
  var wList=R.savedW.map(function(w){
    var mean='', ex='';
    rdAll().forEach(function(a){ a.words.forEach(function(x){ if(x.w===w){ mean=x.mean; ex=x.ex; } }); });
    return '<div class="wb-item" data-say="'+rdEscape(w)+'"><span class="wb-chip wb-w">'+rdEscape(w)+'</span><div class="wb-tx"><b>'+rdEscape(mean)+'</b><small>'+rdEscape(ex)+'</small></div></div>';
  }).join('');
  var sList=R.savedS.map(function(s){
    var pat='', teach='';
    rdAll().forEach(function(a){ a.sents.forEach(function(x){ if(x.s===s){ pat=x.pat; teach=x.teach; } }); });
    var used=R.used[s]||0;
    return '<div class="wb-item'+(used?' wb-used':'')+'" data-say="'+rdEscape(s)+'"><span class="wb-chip wb-s">句</span>'+
      '<div class="wb-tx"><b>'+rdEscape(s)+'</b><small>句式：'+rdEscape(pat)+' · '+rdEscape(teach)+'</small>'+
      '<small class="wb-usedtag">'+(used?('✅ 已用 '+used+' 次'):'💤 还在睡觉，去用一次')+'</small></div></div>';
  }).join('');
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="wbBack">← 悦读馆</button><div class="gtitle">🗂️ 我的积词本</div></div>'+
      '<div class="readtip">💡 这些词句不是"抄来的"，是读文章时"点"来的。每天读一篇，点几个，一周就能攒一页。</div>'+
      (has?'':'<div class="emptybook">积词本还空着～<br>去读一篇短文，点一点金色词语和句子，它们就会自己跑进来。</div>')+
      '<div class="wbook">'+
        (wList?'<h3>📌 好词（'+R.savedW.length+'）</h3>'+wList:'')+
        (sList?'<h3>📌 好句（'+R.savedS.length+'）</h3>'+sList:'')+
      '</div>'+
      (has?'<div class="rbtns"><button class="btn big" id="wbWrite">🖊️ 微写作：用掉一句</button><button class="btn secondary" id="wbMimic">✍️ 玩仿写</button></div>':'')+
    '</div>';
  $('#wbBack').addEventListener('click',renderReadHome);
  $all('.wb-item').forEach(function(el){
    el.addEventListener('click',function(){ speak(el.getAttribute('data-say')); });
  });
  var bw=$('#wbWrite');
  if(bw) bw.addEventListener('click',renderMiniWrite);
  var bm=$('#wbMimic');
  if(bm) bm.addEventListener('click',function(){
    var target=null;
    rdAll().forEach(function(a){
      if(R.read[a.id]&&(R.mimicDone[a.id]||0)<3&&!target) target=a.id;
    });
    renderMimic(target||rdAll()[0].id);
  });
  updateHeader();
}

/* ---------- 微写作：用掉收藏句 ---------- */
function renderMiniWrite(){
  clearTimers();
  var R=getRead();
  var pick=null;
  R.savedS.forEach(function(s){ if(!pick&&!(R.used[s]||0)) pick=s; });
  if(!pick&&R.savedS.length) pick=R.savedS[Math.floor(Math.random()*R.savedS.length)];
  var pickW=null;
  if(!pick&&R.savedW.length) pickW=R.savedW[Math.floor(Math.random()*R.savedW.length)];
  if(!pick&&!pickW){
    app.innerHTML='<div class="readhome"><div class="ghead"><button class="btn ghost small" id="mwBack">← 积词本</button><div class="gtitle">🖊️ 微写作</div></div>'+
      '<div class="emptybook">积词本还是空的～<br>先读一篇短文，收藏一个好句，再来用它写两三句话。</div>'+
      '<div class="rbtns"><button class="btn big" id="mwGoRead">📖 去阅读</button></div></div>';
    $('#mwBack').addEventListener('click',renderWordBook);
    $('#mwGoRead').addEventListener('click',renderReadHome);
    updateHeader();
    return;
  }
  var target=pick||pickW;
  var isSent=!!pick;
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="mwBack">← 积词本</button><div class="gtitle">🖊️ 微写作</div></div>'+
      '<div class="mw-target"><span class="mw-tag">'+(isSent?'今天用这句':'今天用这个词')+'</span>'+
        '<div class="mw-sent">'+rdEscape(target)+'</div>'+
        (isSent?'<button class="btn ghost small" id="mwSay">🔊 听一遍</button>':'')+
      '</div>'+
      '<p class="flowtip">'+(isSent?'用上这句话的样子，写两三句话（可以直接用它，也可以仿着它写）':'用上这个好词，写两三句话')+'<br>小提醒：可以先用语音输入，再慢慢改。写 2~3 句就很好。</p>'+
      '<textarea id="mwInput" placeholder="在这里写……"></textarea>'+
      '<div class="rbtns"><button class="btn big" id="mwSubmit">✅ 写好了</button></div>'+
      '<div id="mwFeedback"></div>'+
    '</div>';
  $('#mwBack').addEventListener('click',renderWordBook);
  var say=$('#mwSay');
  if(say) say.addEventListener('click',function(){ speak(target); });
  $('#mwSubmit').addEventListener('click',function(){
    var txt=document.getElementById('mwInput').value.trim();
    if(txt.length<8){ toast('再写一点点，两三句就很好'); return; }
    var fb=miniFeedback(txt,target,isSent);
    if(fb.used){
      if(!R.used[target]) R.used[target]=0;
      R.used[target]++;
    }
    R.writeDone.push({t:Date.now(),txt:txt});
    saveProg();
    META.addCoins(25); META.addXP(25);
    META.quest('write');
    if(R.writeDone.length>=5) META.award('write5');
    if(window.ANIM) ANIM.burst();
    document.getElementById('mwFeedback').innerHTML=
      '<div class="mwfb">'+
        '<div class="mwfb-b">✨ 亮点：'+rdEscape(fb.praise)+'</div>'+
        '<div class="mwfb-s">💡 建议：'+rdEscape(fb.advice)+'</div>'+
        '<div class="mwfb-ok">🎉 +25铜钱 · 句芽长出来啦！</div>'+
        '<div class="rbtns"><button class="btn big" id="mwAgain">再写一次</button>'+
        '<button class="btn secondary" id="mwHome">🏠 回悦读馆</button></div>'+
      '</div>';
    document.getElementById('mwSubmit').style.display='none';
    document.getElementById('mwInput').disabled=true;
    $('#mwAgain').addEventListener('click',renderMiniWrite);
    $('#mwHome').addEventListener('click',renderReadHome);
    var flow=flowState();
    if(flow.step===3){ flow.step=4; saveProg(); flowUpdate(); }
  });
  updateHeader();
}
/* 启发式反馈：1 亮点 + 1 建议（按写作内容规则判定，不随机、不代写） */
function miniFeedback(txt,target,isSent){
  var used=txt.indexOf(target)>=0;
  var hasQ=/[？?]/.test(txt), hasG=/[！!]/.test(txt);
  var trimmed=txt.trim();
  var endsOk=/[。！？?!…]["'”’）)]?$/.test(trimmed);
  var praise,advice;
  if(used) praise=isSent?'把收藏的句子真的用起来了！':'把收藏的好词「'+target+'」用进去了！';
  else if(hasQ&&hasG) praise='两种标点都用上了，语气有变化，真棒';
  else if(txt.length>=30) praise='超过30个字了，写得越来越细';
  else praise='愿意动笔写，就是最大的进步';
  if(!endsOk) advice='结尾加上标点，句子就完整啦。';
  else if(!used) advice='下次试试把收藏的那句（或那个词）真的用进去——用一次，它才是你自己的。';
  else if(txt.indexOf('很')>=0) advice='试试把"很"字换掉——不说"很大"，说"大得像……"。';
  else if(!/[啪哗啦咚叮呼嗖沙轰喵汪叽嘻]/.test(txt)) advice='试试加一个声音，比如"啪""哗啦"，句子会更有画面。';
  else if(!/(我|他|她|心|想|觉)/.test(txt)) advice='试试写写你当时的感觉：开心？紧张？心里是什么滋味？';
  else advice='试试加一个动作，写"谁做了什么"，画面会更清楚。';
  return {used:used,praise:praise,advice:advice};
}

/* ---------- 仿写挑战 ---------- */
function renderMimic(id){
  clearTimers();
  var art=rdById(id);
  if(!art){ renderReadHome(); return; }
  app.innerHTML='<div class="ghead"><button class="btn ghost small" id="mQuit">← 阅读页</button><div class="gtitle">✏️ 仿写挑战 · 《'+art.title+'》</div></div><div id="mimicArea"></div>';
  $('#mQuit').addEventListener('click',function(){ renderReadArticle(id); });
  runMimicInline(art,'mimicArea',function(stars){
    var R=getRead();
    if(!R.mimicDone[art.id]||stars>R.mimicDone[art.id]){ R.mimicDone[art.id]=stars; saveProg(); }
    var doneCount=0; for(var k in R.mimicDone) if(R.mimicDone[k]) doneCount++;
    if(doneCount>=5) META.award('mimic5');
    META.onGameEnd(stars);
    app.innerHTML=
      '<div class="result">'+
        '<div class="res-stars">'+starsHtml(stars)+'</div>'+
        '<div class="res-title">'+(stars===3?'仿写小作家！':'再接再厉！')+'</div>'+
        '<div class="res-sub">《'+art.title+'》仿写挑战 · 答对 '+(art.mimic.length-(stars===3?0:stars===2?1:2))+'/'+art.mimic.length+' 题</div>'+
        '<div class="res-btns">'+
          '<button class="btn secondary" id="mBack">📖 回悦读馆</button>'+
          '<button class="btn ghost" id="mRetry">🔄 再练一次</button>'+
        '</div>'+
      '</div>';
    $('#mBack').addEventListener('click',renderReadHome);
    $('#mRetry').addEventListener('click',function(){ renderMimic(id); });
    updateHeader();
  });
}
function runMimicInline(art,areaId,onDone){
  var items=art.mimic.slice();
  var i=0,mistakes=0;
  var area=document.getElementById(areaId)||app;
  function showOne(){
    if(i>=items.length){
      onDone(starsFor(mistakes,items.length));
      return;
    }
    var it=items[i];
    var tag=it.t==='fill'?'✏️ 选词填空':'🧩 句式仿写';
    var optCls=it.t==='fill'?'opts optrow':'opts optrow optlong';
    area.innerHTML=
      '<div class="gmeta"><span>'+tag+' · '+(i+1)+'/'+items.length+'</span><span>出错 '+mistakes+' 次</span></div>'+
      '<div class="gcard">'+
        '<p class="gq">'+tag+'<br><span class="mimic-q">'+rdEscape(it.q)+'</span></p>'+
        '<div class="'+optCls+'">'+it.opts.map(function(o){return '<button>'+rdEscape(o)+'</button>';}).join('')+'</div>'+
        '<div class="explain" id="mEx"></div>'+
      '</div>';
    var done=false;
    $all('.opts button',area).forEach(function(b){
      b.addEventListener('click',function(){
        if(done||b.disabled) return;
        if(b.textContent===it.a){
          done=true;
          b.classList.add('right');
          var ex=$('#mEx',area);
          ex.textContent='✅ '+it.ex;
          ex.classList.add('show');
          praise(); speak(it.a);
          later(function(){ i++; showOne(); },1700);
        }else{
          mistakes++;
          miss();
          b.classList.add('wrong'); b.disabled=true;
          b.classList.add('shake');
          later(function(){ b.classList.remove('shake'); },600);
        }
      });
    });
  }
  showOne();
}

/* ---------- 成长树 ---------- */
function renderTree(){
  clearTimers();
  var R=getRead();
  var readN=Object.keys(R.read).length;
  var saveN=R.savedW.length+R.savedS.length;
  var mimicFull=0;
  for(var k in R.mimicDone) if(R.mimicDone[k]===3) mimicFull++;
  var writeN=R.writeDone.length;
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="tBack">← 悦读馆</button><div class="gtitle">🌳 我的成长树</div></div>'+
      '<div class="treewrap">'+treeSvg(Math.min(readN,24),Math.min(saveN,18),Math.min(mimicFull,10),Math.min(writeN,12))+'</div>'+
      '<div class="treestats">'+
        '<div class="ts"><b>'+readN+'</b><span>读过的文章 🌿</span></div>'+
        '<div class="ts"><b>'+saveN+'</b><span>收藏的词句 🍃</span></div>'+
        '<div class="ts"><b>'+mimicFull+'</b><span>满星仿写 🌸</span></div>'+
        '<div class="ts"><b>'+writeN+'</b><span>微写作 🍎</span></div>'+
      '</div>'+
      '<div class="readtip">💡 读一篇长叶子，藏一句发新芽，仿写满星开朵花，微写作用掉一句就结果子。树有多茂盛，你的语言就有多茂盛。</div>'+
    '</div>';
  $('#tBack').addEventListener('click',renderReadHome);
  updateHeader();
}
function treeSvg(leaves,buds,flowers,fruits){
  var h='<svg viewBox="0 0 300 220" class="treesvg">';
  h+='<rect x="140" y="140" width="20" height="70" rx="6" fill="#8B5E34"/>';
  h+='<path d="M150 150 C120 120 110 90 130 60" stroke="#8B5E34" stroke-width="6" fill="none" stroke-linecap="round"/>';
  h+='<path d="M150 140 C180 115 195 85 175 55" stroke="#8B5E34" stroke-width="5" fill="none" stroke-linecap="round"/>';
  var cx=[150,120,180,105,195,90,210,135,165,75,225,150,60,188,112,90,195,150];
  var cy=[45,55,65,80,75,95,60,30,95,88,50,20,82,40,105,110,85,15];
  for(var i=0;i<leaves;i++){
    var p=i%cx.length;
    h+='<ellipse cx="'+(cx[p]+(i%3*3-3)) +'" cy="'+(cy[p]+(i%4*4-6))+'" rx="22" ry="13" fill="#4F8A5B" opacity="0.75"/>';
  }
  for(var j=0;j<buds;j++){
    h+='<circle cx="'+(120+(j*9)%90)+'" cy="'+(60+(j*13)%80)+'" r="5" fill="#E8B95C"/>';
  }
  for(var m=0;m<flowers;m++){
    h+='<g transform="translate('+(110+(m*22)%95)+','+(50+(m*17)%75)+')"><circle r="6" fill="#E8A0B4"/><circle r="2.6" fill="#FFF3E0"/></g>';
  }
  for(var n=0;n<fruits;n++){
    h+='<circle cx="'+(100+(n*25)%110)+'" cy="'+(35+(n*19)%95)+'" r="5.5" fill="#C94A2C"/>';
  }
  h+='<ellipse cx="150" cy="205" rx="90" ry="8" fill="#D9CBA8" opacity="0.6"/></svg>';
  return h;
}

/* ---------- 获奖书单 ---------- */
function renderBooks(){
  clearTimers();
  var books=window.READ_BOOKS||[];
  var levels=[[1,'一二年级'],[2,'三四年级'],[3,'五六年级']];
  var h=levels.map(function(L){
    var items=books.filter(function(b){return b.l===L[0];});
    var lis=items.map(function(b){
      return '<div class="bookcard"><div class="bk-head"><b>'+b.n+'</b><span class="bk-award">'+b.award+'</span></div>'+
        '<div class="bk-author">✍️ '+b.a+'</div><div class="bk-why">'+b.why+'</div>'+
        '<span class="bk-tag">'+b.tag+'</span></div>';
    }).join('');
    return '<h3 class="bklv">'+(L[0]===1?'🌱':L[0]===2?'🌿':'🌳')+' '+L[1]+'</h3>'+lis;
  }).join('');
  app.innerHTML=
    '<div class="readhome">'+
      '<div class="ghead"><button class="btn ghost small" id="bkBack">← 悦读馆</button><div class="gtitle">🏆 获奖儿童文学书单</div></div>'+
      '<div class="readtip">💡 悦读馆的短文是"开胃菜"，这些书才是"正餐"。读完一篇短文，就去找对应年级的书，让阅读真正发生。书目仅作推荐，请支持正版图书。</div>'+
      h+
    '</div>';
  $('#bkBack').addEventListener('click',renderReadHome);
  updateHeader();
}
