// RunnerJS — juego simple (AABB collision, levels)
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const playerNameInput = document.getElementById('playerName');

let W = canvas.width, H = canvas.height;
let running = true;
let frames = 0;
let score = 0;
let level = 1;
let baseSpeed = 4;
let speed = baseSpeed;
let obstacles = [];

const player = { x:80, y:H-80, w:36, h:48, vy:0, grounded:true, jumpPower: -13 };

function spawnObstacle(){
  const t = Math.random()<0.7 ? 'box':'tall';
  if(t==='box') obstacles.push({x:W+20,y:H-44,w:24,h:24,passed:false});
  else obstacles.push({x:W+20,y:H-80,w:28,h:56,passed:false});
}

function update(){
  frames++;
  if(frames % Math.max(90 - level*6, 25) === 0) spawnObstacle();
  if(frames % 700 === 0){ level++; speed += 0.6 }

  player.vy += 0.8; player.y += player.vy;
  if(player.y + player.h >= H - 20){ player.y = H - 20 - player.h; player.vy = 0; player.grounded = true }

  for(const o of obstacles) o.x -= speed;
  obstacles = obstacles.filter(o=> o.x + o.w > -100);

  for(const o of obstacles){
    if(aabb(player,o)) { running = false; showGameOver(); }
    if(!o.passed && o.x + o.w < player.x){ o.passed = true; score += 50 }
  }

  score += 0.05;
}

function aabb(a,b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y }

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#87ceeb'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#d6d6d6'; ctx.fillRect(0, H-20, W, 20);
  ctx.fillStyle='#0b5fff'; ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle='#222'; for(const o of obstacles) ctx.fillRect(o.x, o.y, o.w, o.h);
}

function loop(){ if(running){ update(); draw(); scoreEl.textContent = Math.floor(score); levelEl.textContent = level; requestAnimationFrame(loop) } }

function jump(){ if(player.grounded){ player.vy = player.jumpPower; player.grounded=false } }

window.addEventListener('keydown', e=>{ if(e.code==='Space' || e.code==='ArrowUp'){ e.preventDefault(); jump() } });
window.addEventListener('pointerdown', ()=> jump());

function showGameOver(){ finalScoreEl.textContent = 'Tu puntuación: ' + Math.floor(score); document.getElementById('gameOver').hidden = false }

document.getElementById('restart').addEventListener('click', ()=> location.reload());

document.getElementById('showLeaderboard').addEventListener('click', async ()=>{ 
  try{ const top = await fetchTopScores(10); renderTop(top) }catch(e){ renderTop(JSON.parse(localStorage.getItem('localScores')||'[]')) }
  document.getElementById('leaderboard').hidden=false 
});
document.getElementById('closeLb').addEventListener('click', ()=> document.getElementById('leaderboard').hidden=true);

function renderTop(list){ topList.innerHTML = ''; list.sort((a,b)=>b.score-a.score).slice(0,10).forEach(s=>{ const li=document.createElement('li'); li.textContent = `${s.name} — ${s.score} pts (niv ${s.level||1})`; topList.appendChild(li) }) }

document.getElementById('submitScore').addEventListener('click', async ()=>{
  const name = playerNameInput.value.trim().slice(0,20) || 'Anon';
  const payload = { name, score: Math.floor(score), level };
  try{
    await saveScore(payload);
    alert('Guardado en servidor');
    document.getElementById('gameOver').hidden=true;
  }catch(err){
    const ls = JSON.parse(localStorage.getItem('localScores')||'[]'); ls.push(payload); localStorage.setItem('localScores', JSON.stringify(ls));
    alert('Servidor inaccesible: guardado en localStorage');
  }
});

loop();
