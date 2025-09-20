const API_BASE = (location.hostname === 'localhost' || location.hostname === '') ? 'http://localhost:3000' : 'https://TU_BACKEND.onrender.com';

async function timeoutFetch(resource, options={}){
  const { timeout=4000 } = options;
  const controller = new AbortController(); options.signal = controller.signal;
  const id = setTimeout(()=> controller.abort(), timeout);
  try{ const res = await fetch(resource, options); clearTimeout(id); return res }catch(e){ clearTimeout(id); throw e }
}

async function fetchTopScores(limit=10){
  const res = await timeoutFetch(`${API_BASE}/scores?limit=${limit}`, {timeout:3000});
  if(!res.ok) throw new Error('No ok');
  return res.json();
}

async function saveScore(payload){
  const res = await timeoutFetch(`${API_BASE}/scores`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), timeout:3500 });
  if(!res.ok) throw new Error('Error al guardar');
  return res.json();
}
