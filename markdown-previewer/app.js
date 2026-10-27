function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function inline(s){
  s=esc(s);
  s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/\*([^*]+)\*/g,'<em>$1</em>');
  s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}
function render(md){
  var lines=md.split('\n'),out=[],list=null,code=false,buf=[],para=[];
  function flushPara(){if(para.length){out.push('<p>'+inline(para.join(' '))+'</p>');para=[]}}
  function closeList(){if(list){out.push('</'+list+'>');list=null}}
  lines.forEach(function(l){
    if(/^```/.test(l)){
      if(code){out.push('<pre><code>'+esc(buf.join('\n'))+'</code></pre>');buf=[];code=false}
      else{flushPara();closeList();code=true}
      return;
    }
    if(code){buf.push(l);return}
    var m;
    if((m=l.match(/^(#{1,3})\s+(.*)/))){flushPara();closeList();out.push('<h'+m[1].length+'>'+inline(m[2])+'</h'+m[1].length+'>')}
    else if((m=l.match(/^>\s?(.*)/))){flushPara();closeList();out.push('<blockquote>'+inline(m[1])+'</blockquote>')}
    else if((m=l.match(/^[-*]\s+(.*)/))){flushPara();if(list!=='ul'){closeList();out.push('<ul>');list='ul'}out.push('<li>'+inline(m[1])+'</li>')}
    else if((m=l.match(/^\d+\.\s+(.*)/))){flushPara();if(list!=='ol'){closeList();out.push('<ol>');list='ol'}out.push('<li>'+inline(m[1])+'</li>')}
    else if(/^---+$/.test(l)){flushPara();closeList();out.push('<hr>')}
    else if(l.trim()===''){flushPara();closeList()}
    else{closeList();para.push(l)}
  });
  if(code)out.push('<pre><code>'+esc(buf.join('\n'))+'</code></pre>');
  flushPara();closeList();
  return out.join('\n');
}
if(typeof document!=='undefined'){
  var src=document.getElementById('src'),outEl=document.getElementById('out'),cnt=document.getElementById('count');
  var sample='# Hello\n\nType **markdown** on the left and see it on the right.\n\n- lists\n- `inline code`\n- [links](https://github.com)\n\n> a quote\n\n```\nconsole.log("code block");\n```\n';
  src.value=localStorage.getItem('md-text')||sample;
  function update(){
    outEl.innerHTML=render(src.value);
    var w=src.value.trim()?src.value.trim().split(/\s+/).length:0;
    cnt.textContent=w+' words';
    localStorage.setItem('md-text',src.value);
  }
  src.addEventListener('input',update);update();
}
if(typeof module!=='undefined')module.exports={render:render};
