const grupos = [
  {titulo:"Preguntas teoricas", items:[
    {id:"1", nombre:"Unidad I - Introduccion", archivo:"preguntero_unidad_1.json"},
    {id:"2", nombre:"Unidad II - Analisis de dos variables", archivo:"preguntero_unidad_2.json"},
    {id:"3", nombre:"Unidad III - Analisis de una variable en el tiempo", archivo:"preguntero_unidad_3.json"},
    {id:"4", nombre:"Unidad IV - Analisis de una variable en el tiempo (II)", archivo:"preguntero_unidad_4.json"},
    {id:"5", nombre:"Unidad V - Numeros indices", archivo:"preguntero_unidad_5.json"},
    {id:"6", nombre:"Unidad VI - Probabilidad", archivo:"preguntero_unidad_6.json"},
    {id:"7", nombre:"Unidad VII - Funciones de probabilidad", archivo:"preguntero_unidad_7.json"},
    {id:"8", nombre:"Unidad VIII - Teoria de las muestras", archivo:"preguntero_unidad_8.json"},
    {id:"9", nombre:"Unidad IX - Teoria de la estimacion", archivo:"preguntero_unidad_9.json"},
    {id:"10", nombre:"Unidad X - Teoria de la decision", archivo:"preguntero_unidad_10.json"}
  ]},
  {titulo:"Preguntas de aplicacion teorica", items:[
    {id:"6a", nombre:"Unidad VI - Teoria aplicada", archivo:"preguntero_unidad_6_teoria_aplicada.json"},
    {id:"7a", nombre:"Unidad VII - Teoria aplicada", archivo:"preguntero_unidad_7_teoria_aplicada.json"}
  ]},
  {titulo:"Preguntas de practica", items:[
    {id:"6b", nombre:"Unidad VI - Practica", archivo:"preguntero_unidad_6_practica.json"},
    {id:"7b", nombre:"Unidad VII - Practica", archivo:"preguntero_unidad_7_practica.json"}
  ]},
  {titulo:"Formulas", items:[
    {id:"f1", nombre:"Unidad I", archivo:"formulas.json", filtro:"Unidad I - Introduccion"},
    {id:"f2", nombre:"Unidad II", archivo:"formulas.json", filtro:"Unidad II - Analisis de dos variables"},
    {id:"f3", nombre:"Unidad III", archivo:"formulas.json", filtro:"Unidad III - Analisis de una variable en el tiempo"},
    {id:"f4", nombre:"Unidad IV", archivo:"formulas.json", filtro:"Unidad IV - Analisis de una variable en el tiempo (II)"},
    {id:"f5", nombre:"Unidad V", archivo:"formulas.json", filtro:"Unidad V - Numeros indices"},
    {id:"f6", nombre:"Unidad VI", archivo:"formulas.json", filtro:"Unidad VI - Probabilidad"},
    {id:"f7", nombre:"Unidad VII", archivo:"formulas.json", filtro:"Unidad VII - Distribuciones"},
    {id:"f8", nombre:"Unidad VIII", archivo:"formulas.json", filtro:"Unidad VIII - Muestras"},
    {id:"f9", nombre:"Unidad IX", archivo:"formulas.json", filtro:"Unidad IX - Estimacion"},
    {id:"f10", nombre:"Unidad X", archivo:"formulas.json", filtro:"Unidad X - Decision"},
    {id:"fall", nombre:"Ver todos", archivo:"formulas.json", filtro:null}
  ]},
  {titulo:"Miscelaneas", items:[
    {id:"s", nombre:"Signos y simbolos", archivo:"signos.json"}
  ]}
];
let data=null, restantes=[], actual=null, respondido=false, historial=[];

function mostrarMenu(){
  const m=document.getElementById('menu');
  m.innerHTML='';
  grupos.forEach(g=>{
    const h=document.createElement('h2');
    h.textContent=g.titulo;
    h.style.cssText='width:100%;margin:15px 0 5px;font-size:16px;color:#333;border-bottom:2px solid #4CAF50;padding-bottom:4px';
    m.appendChild(h);
    const wrap=document.createElement('div');
    wrap.style.cssText='display:flex;flex-wrap:wrap;gap:10px;width:100%';
    g.items.forEach(u=>{
      const b=document.createElement('button');
      b.textContent=u.nombre;
      b.onclick=()=>cargarUnidad(u);
      wrap.appendChild(b);
    });
    m.appendChild(wrap);
  });
  document.getElementById('area').innerHTML='';
}

let filtroFormula=null;

async function cargarUnidad(u){
  const r=await fetch(u.archivo);
  data=await r.json();
  filtroFormula = (u.filtro===undefined) ? null : u.filtro;
  document.getElementById('menu').innerHTML='';
  if(data.secciones){
    renderFormulas();
  } else {
    restantes=[...data.preguntas];
    historial=[];
    siguiente();
  }
}

function renderFormulas(){
  const area=document.getElementById('area');
  let html='<div class="card"><button class="back" onclick="mostrarMenu()" style="margin-bottom:10px">← Inicio</button><h2>'+data.titulo+'</h2>';
  const secciones = filtroFormula ? data.secciones.filter(s=>s.unidad===filtroFormula) : data.secciones;
  secciones.forEach(s=>{
    html+='<h3 style="color:#4CAF50;margin-top:20px">'+s.unidad+'</h3>';
    s.formulas.forEach(f=>{
      html+='<div style="margin:12px 0;padding:10px;border:1px solid #eee;border-radius:6px">';
      html+='<div style="font-weight:bold">'+f.nombre+'</div>';
      let rendered=f.formula;
      try{rendered=katex.renderToString(f.formula,{throwOnError:false,displayMode:true});}catch(e){rendered=f.formula;}
      html+='<div class="formula">'+rendered+'</div>';
      html+='<div style="font-size:14px;color:#555">'+f.uso+'</div>';
      html+='</div>';
    });
  });
  html+='<button class="back" onclick="mostrarMenu()">Volver al inicio</button>';
  html+='</div>';
  area.innerHTML=html;
}

function verTodas(){
  const area=document.getElementById('area');
  let html='<div class="card"><button class="back" onclick="mostrarMenu()" style="margin-bottom:10px">← Inicio</button><h2>'+data.titulo+'</h2>';
  data.preguntas.forEach((p,i)=>{
    html+='<div style="margin:20px 0;padding:12px;border:1px solid #eee;border-radius:6px">';
    html+='<div class="q">'+(i+1)+'. '+p.pregunta+'</div>';
    html+='<div class="opts">';
    for(const k in p.opciones){
      const cls = k===p.correcta ? 'correct' : '';
      html+='<button class="'+cls+'" disabled style="cursor:default">'+k.toUpperCase()+') '+p.opciones[k]+'</button>';
    }
    html+='</div>';
    html+='<div class="exp"><strong>Respuesta correcta: '+p.correcta.toUpperCase()+'.</strong> '+p.explicacion+'</div>';
    html+='</div>';
  });
  html+='<button class="back" onclick="mostrarMenu()">Volver al inicio</button>';
  html+='</div>';
  area.innerHTML=html;
}

function siguiente(){
  if(restantes.length===0){
    document.getElementById('area').innerHTML='<div class="card"><p>¡Has completado todas las preguntas de esta unidad!</p><button class="back" onclick="mostrarMenu()">Volver al inicio</button></div>';
    return;
  }
  const idx=Math.floor(Math.random()*restantes.length);
  actual=restantes.splice(idx,1)[0];
  historial.push(actual);
  respondido=false;
  renderPregunta();
}

function anterior(){
  if(historial.length<=1){
    mostrarMenu();
    return;
  }
  if(actual) restantes.push(actual);
  historial.pop();
  actual=historial[historial.length-1];
  const i=restantes.indexOf(actual);
  if(i!==-1) restantes.splice(i,1);
  respondido=false;
  renderPregunta();
}

function renderPregunta(){
  const area=document.getElementById('area');
  let html='<div class="card"><button class="back" onclick="mostrarMenu()" style="margin-bottom:10px">← Inicio</button><div class="q">'+actual.pregunta+'</div><div class="opts">';
  for(const k in actual.opciones){
    html+='<button data-key="'+k+'" onclick="responder(\''+k+'\')">'+k.toUpperCase()+') '+actual.opciones[k]+'</button>';
  }
  html+='</div><div id="exp"></div>';
  html+='<div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap">';
  html+='<button class="back" onclick="anterior()">← Anterior</button>';
  html+='<button class="next" id="btnSig" onclick="siguiente()" disabled style="opacity:.5;cursor:not-allowed">Siguiente →</button>';
  html+='<button class="back" onclick="mostrarMenu()" style="background:#6c757d">Volver al inicio</button>';
  html+='<button class="next" onclick="verTodas()" style="background:#28a745">Ver todas las preguntas</button>';
  html+='</div></div>';
  area.innerHTML=html;
}

function responder(k){
  if(respondido) return;
  respondido=true;
  const btns=document.querySelectorAll('.opts button');
  btns.forEach(b=>{
    const key=b.getAttribute('data-key');
    if(key===actual.correcta) b.classList.add('correct');
    if(key===k && key!==actual.correcta) b.classList.add('wrong');
    b.disabled=true;
  });
  const exp=document.getElementById('exp');
  const ok = k===actual.correcta;
  exp.innerHTML='<div class="exp"><strong>'+(ok?'¡Correcto!':'Incorrecto.')+'</strong> '+actual.explicacion+'</div>';
  const btn=document.getElementById('btnSig');
  if(btn){btn.disabled=false;btn.style.opacity='1';btn.style.cursor='pointer';}
}

mostrarMenu();