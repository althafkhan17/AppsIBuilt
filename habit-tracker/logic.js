function dayKey(d){
  var m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return d.getFullYear()+'-'+m+'-'+day;
}
function addDays(d,n){var c=new Date(d.getFullYear(),d.getMonth(),d.getDate());c.setDate(c.getDate()+n);return c;}
// current streak: consecutive days ending today, or yesterday if today isn't ticked yet
function currentStreak(done,today){
  var set=new Set(done),d=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  if(!set.has(dayKey(d)))d=addDays(d,-1);
  var n=0;
  while(set.has(dayKey(d))){n++;d=addDays(d,-1);}
  return n;
}
function bestStreak(done){
  var keys=Array.from(new Set(done)).sort(),best=0,run=0,prev=null;
  keys.forEach(function(k){
    var p=k.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);
    run=(prev&&dayKey(addDays(prev,1))===k)?run+1:1;
    if(run>best)best=run;
    prev=d;
  });
  return best;
}
if(typeof module!=='undefined')module.exports={dayKey:dayKey,addDays:addDays,currentStreak:currentStreak,bestStreak:bestStreak};
