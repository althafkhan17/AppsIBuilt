var KEY='streak-board-habits';
var habits=JSON.parse(localStorage.getItem(KEY)||'[]');
var list=document.getElementById('list');
var empty=document.getElementById('empty');
function save(){localStorage.setItem(KEY,JSON.stringify(habits));}
function render(){
  var today=new Date(),todayKey=dayKey(today);
  list.textContent='';
  empty.style.display=habits.length?'none':'block';
  habits.forEach(function(h,i){
    var card=document.createElement('div');card.className='habit';
    var top=document.createElement('div');top.className='top';
    var name=document.createElement('span');name.className='name';name.textContent=h.name;
    var streak=document.createElement('span');streak.className='streak';
    streak.textContent=currentStreak(h.done,today)+' day streak';
    var isDone=h.done.indexOf(todayKey)>-1;
    var check=document.createElement('button');
    check.className='check'+(isDone?' done':'');
    check.textContent=isDone?'Done today':'Mark done';
    check.addEventListener('click',function(){toggle(i,todayKey);});
    var del=document.createElement('button');del.className='del';del.textContent='×';
    del.setAttribute('aria-label','Remove '+h.name);
    del.addEventListener('click',function(){
      if(confirm('Remove "'+h.name+'"?')){habits.splice(i,1);save();render();}
    });
    top.append(name,streak,check,del);
    var week=document.createElement('div');week.className='week';
    for(var n=6;n>=0;n--){
      var d=addDays(today,-n),cell=document.createElement('div');cell.className='day';
      cell.textContent=d.toLocaleDateString(undefined,{weekday:'narrow'});
      var dot=document.createElement('div');
      dot.className='dot'+(h.done.indexOf(dayKey(d))>-1?' on':'');
      cell.appendChild(dot);week.appendChild(cell);
    }
    var meta=document.createElement('div');meta.className='meta';
    meta.textContent='Best streak: '+bestStreak(h.done)+' days · Total: '+h.done.length;
    card.append(top,week,meta);list.appendChild(card);
  });
}
function toggle(i,key){
  var h=habits[i],at=h.done.indexOf(key);
  if(at>-1)h.done.splice(at,1);else h.done.push(key);
  save();render();
}
document.getElementById('form').addEventListener('submit',function(e){
  e.preventDefault();
  var input=document.getElementById('name'),v=input.value.trim();
  if(!v)return;
  habits.push({name:v,done:[]});input.value='';save();render();
});
render();
