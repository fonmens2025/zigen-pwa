/* ================= 音效合成器（WebAudio 离线合成，无需音频文件） ================= */
'use strict';
var AUDIO=(function(){
  var ctx=null;
  function ac(){
    if(!ctx){
      try{
        var AC=window.AudioContext||window.webkitAudioContext;
        if(AC) ctx=new AC();
      }catch(e){}
    }
    if(ctx&&ctx.state==='suspended'){ try{ ctx.resume(); }catch(e){} }
    return ctx;
  }
  function tone(freq,dur,type,vol,when,slide){
    if(window.SOUND===false) return;
    var c=ac(); if(!c) return;
    var t0=c.currentTime+(when||0);
    var o=c.createOscillator(), g=c.createGain();
    o.type=type||'sine';
    o.frequency.setValueAtTime(freq,t0);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(slide,30),t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol||0.2,t0+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0+dur+0.05);
  }
  return {
    ready:function(){ return !!ac(); },
    unlock:function(){ ac(); },
    tap:function(){ tone(520,0.07,'triangle',0.12); },
    correct:function(){ tone(659,0.12,'sine',0.22); tone(880,0.18,'sine',0.22,0.09); },
    wrong:function(){ tone(233,0.2,'triangle',0.18,0,180); tone(196,0.25,'sine',0.12,0.1,150); },
    combo:function(n){
      var base=523+Math.min(n,8)*60;
      for(var i=0;i<3;i++) tone(base+i*120,0.09,'triangle',0.16,i*0.06);
    },
    star:function(n){
      var notes=[523,659,784,1047];
      for(var i=0;i<=n;i++) tone(notes[Math.min(i,3)],0.16,'sine',0.2,i*0.09);
    },
    coin:function(){ tone(1047,0.07,'sine',0.15); tone(1319,0.12,'sine',0.15,0.07); },
    levelup:function(){
      var notes=[523,659,784,1047,1319];
      for(var i=0;i<5;i++) tone(notes[i],0.22,'triangle',0.2,i*0.11);
      tone(1568,0.5,'sine',0.16,0.55);
    },
    quest:function(){ tone(784,0.09,'sine',0.16); tone(1047,0.09,'sine',0.16,0.09); tone(1319,0.2,'sine',0.18,0.18); }
  };
})();
