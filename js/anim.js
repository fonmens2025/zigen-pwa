/* ================= 动画特效（粒子庆祝/飘分/升级全屏） ================= */
'use strict';
var ANIM=(function(){
  function burst(x,y){
    var box=document.createElement('div');
    box.className='burst';
    if(x!==undefined){ box.style.left=x+'px'; box.style.top=y+'px'; box.classList.add('at'); }
    var chars=['★','✦','✨','🎉','⭐','💫'];
    for(var i=0;i<16;i++){
      var s=document.createElement('span');
      s.className='burstp';
      s.textContent=chars[Math.floor(Math.random()*chars.length)];
      s.style.setProperty('--dx',(Math.random()*220-110)+'px');
      s.style.setProperty('--dy',(Math.random()*-160-20)+'px');
      s.style.animationDelay=(Math.random()*0.15)+'s';
      s.style.fontSize=(12+Math.random()*16)+'px';
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(function(){ if(box.parentNode) box.parentNode.removeChild(box); },1300);
  }
  function floatCoin(n){
    var el=document.createElement('div');
    el.className='floatcoin';
    el.textContent='+'+n+' 🪙';
    var x=Math.random()*60+20;
    el.style.left=x+'%';
    document.body.appendChild(el);
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },1400);
  }
  function levelUp(name){
    var ov=document.createElement('div');
    ov.className='lvup-mask';
    ov.innerHTML='<div class="lvup-card">'+
      '<div class="lvup-t">🎉 升级啦！</div>'+
      '<div class="lvup-name">'+name+'</div>'+
      '<div class="lvup-sub">继续加油，下个等级更厉害！</div>'+
      '<button class="btn big" id="lvupOk">太棒了！</button></div>';
    document.body.appendChild(ov);
    ov.querySelector('#lvupOk').addEventListener('click',function(){ ov.remove(); });
    // 大粒子
    for(var i=0;i<3;i++) setTimeout(function(){ burst(); }, 200+i*300);
  }
  return {burst:burst, floatCoin:floatCoin, levelUp:levelUp};
})();
