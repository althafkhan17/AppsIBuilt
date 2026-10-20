const MODES={focus:25*60,short:5*60,long:15*60};
const QUOTES=["Ek aur session, phir chai pakki. ☕","Small steps, big commits.","Code now, chai soon.","Focus is a superpower.","Ship it, then sip it."];
let mode="focus",remaining=MODES.focus,timer=null;
const $=id=>document.getElementById(id);
const today=new Date().toDateString();
let saved=JSON.parse(localStorage.getItem("chai-stats")||"{}");
if(saved.day!==today)saved={day:today,count:0};
$("count").textContent=saved.count;
function render(){
  const m=String(Math.floor(remaining/60)).padStart(2,"0"),s=String(remaining%60).padStart(2,"0");
  $("time").textContent=`${m}:${s}`;document.title=`${m}:${s} – Chai Timer ☕`;
  $("fill").style.height=(remaining/MODES[mode]*100)+"%";
}
function beep(){try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=660;o.start();setTimeout(()=>{o.stop();c.close()},600)}catch(e){}}
function tick(){
  if(remaining>0){remaining--;render();return}
  stop();beep();
  if(mode==="focus"){saved.count++;localStorage.setItem("chai-stats",JSON.stringify(saved));$("count").textContent=saved.count}
  $("quote").textContent=mode==="focus"?"Chai time! You earned it. ☕":"Break over, back to work 💪";
}
function stop(){clearInterval(timer);timer=null;$("start").textContent="Start"}
$("start").onclick=()=>{if(timer){stop()}else{timer=setInterval(tick,1000);$("start").textContent="Pause";$("quote").textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)]}};
$("reset").onclick=()=>{stop();remaining=MODES[mode];render()};
document.querySelectorAll(".modes button").forEach(b=>b.onclick=()=>{
  document.querySelector(".modes .active").classList.remove("active");b.classList.add("active");
  mode=b.dataset.mode;stop();remaining=MODES[mode];render()});
render();
