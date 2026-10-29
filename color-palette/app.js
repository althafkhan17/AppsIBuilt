function hslToHex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l);
const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('');}
function textOn(hex){const c=[1,3,5].map(i=>parseInt(hex.substr(i,2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));
return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])>0.4?'#111':'#fff';}
function make(mode){const b=Math.random()*360,r=(a,z)=>a+Math.random()*(z-a);
const offs={analogous:[-40,-20,0,20,40],complementary:[0,0,180,180,0],triadic:[0,120,240,0,120]}[mode];
return Array.from({length:5},(_,i)=>mode==='random'?hslToHex(Math.random()*360,r(40,85),r(30,75)):hslToHex(b+offs[i]+r(-6,6),r(45,85),r(30,75)));}
if(typeof document!=='undefined'){
const pal=document.getElementById('palette'),msg=document.getElementById('msg'),sv=document.getElementById('saved');
let cols=make('analogous'),locked=[false,false,false,false,false];
let saved=JSON.parse(localStorage.getItem('huehunt')||'[]');
function render(){pal.textContent='';cols.forEach((c,i)=>{const d=document.createElement('div');d.className='sw'+(locked[i]?' locked':'');
d.style.background=c;d.style.color=textOn(c);const t=document.createElement('span');t.textContent=c.toUpperCase();d.appendChild(t);
d.onclick=()=>{locked[i]=!locked[i];render();};d.oncontextmenu=e=>{e.preventDefault();copy(c);};d.ondblclick=()=>copy(c);pal.appendChild(d);});
sv.textContent='';saved.forEach((p,i)=>{const m=document.createElement('div');m.className='mini';m.title='Click to load, double click to remove';
p.forEach(c=>{const s=document.createElement('span');s.style.background=c;m.appendChild(s);});
m.onclick=()=>{cols=p.slice();locked=locked.map(()=>false);render();};
m.ondblclick=()=>{saved.splice(i,1);store();render();};sv.appendChild(m);});}
function store(){localStorage.setItem('huehunt',JSON.stringify(saved));}
function copy(c){if(navigator.clipboard)navigator.clipboard.writeText(c);msg.textContent='Copied '+c.toUpperCase()+' (double click a colour to copy)';}
function gen(){const n=make(document.getElementById('mode').value);cols=cols.map((c,i)=>locked[i]?c:n[i]);render();}
document.getElementById('gen').onclick=gen;
document.getElementById('save').onclick=()=>{saved.unshift(cols.slice());saved=saved.slice(0,8);store();render();};
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target.tagName!=='SELECT'){e.preventDefault();gen();}});
render();}
