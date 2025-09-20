/* =====================================================
   Práctica 4 — Juego de Memoria (12 cartas / 6 parejas)
   Extensiones:
   - Límite de tiempo configurable (input en HUD)
   - Cuenta regresiva (remaining) y tiempo transcurrido
   - Score: +100 + segundos restantes por acierto; −10 por fallo
   ===================================================== */

// --------- Referencias de UI ---------
const boardEl     = document.getElementById('board');
const timeEl      = document.getElementById('time');       // tiempo transcurrido (sube)
const remainingEl = document.getElementById('remaining');  // tiempo restante (baja)
const attemptsEl  = document.getElementById('attempts');
const messageEl   = document.getElementById('message');
const resetBtn    = document.getElementById('resetBtn');
const limitInput  = document.getElementById('limitInput');
const scoreEl     = document.getElementById('score');

// Íconos/Emojis (puedes reemplazar por imágenes)
const ICONS = ['🍕','🎮','🐱','🚀','⚽','🎧']; // 6 parejas => 12 cartas

// --------- Estado del juego ---------
let deck = [];               // [{ value, id }, ...]
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let attempts = 0;
let timerId = null;
let elapsed = 0;             // segundos transcurridos
let timeLimit = 60;          // límite en segundos (configurable)
let remaining = 60;          // cuenta regresiva
let timerStarted = false;    // el cronómetro solo arranca con el primer clic
let score = 0;               // puntaje

// --------- Utilidades ---------
function shuffle(array){
  // Fisher–Yates
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function formatTime(seconds){
  const m = String(Math.floor(seconds / 60)).padStart(2,'0');
  const s = String(seconds % 60).padStart(2,'0');
  return `${m}:${s}`;
}
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

// --------- Construcción y render ---------
function buildDeck(){
  // Duplicar ICONS y mezclar
  const base = ICONS.flatMap(v => [{ value: v }, { value: v }]);
  const withIds = base.map((c, idx) => ({ ...c, id: idx }));
  return shuffle(withIds);
}
function renderBoard(){
  boardEl.innerHTML = '';
  deck.forEach(cardData => {
    const card = document.createElement('button');
    card.className = 'card';
    card.setAttribute('data-value', cardData.value);
    card.setAttribute('aria-label', 'Carta de memoria');
    card.setAttribute('aria-pressed', 'false');
    card.type = 'button';

    const inner = document.createElement('div');
    inner.className = 'inner';

    const front = document.createElement('div');
    front.className = 'face front';
    front.textContent = '❓';

    const back = document.createElement('div');
    back.className = 'face back';
    back.textContent = cardData.value;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', onCardClick, { passive: true });
    boardEl.appendChild(card);
  });
}

// --------- Temporizador ---------
function ensureTimer(){
  if(!timerStarted){
    // tomar el límite del input solo una vez (primer clic)
    timeLimit = clamp(parseInt(limitInput.value || '60', 10), 5, 999);
    remaining = timeLimit;
    remainingEl.textContent = remaining;
    timerStarted = true;

    timerId = setInterval(() => {
      elapsed++;
      remaining--;
      timeEl.textContent = formatTime(elapsed);
      remainingEl.textContent = remaining >= 0 ? remaining : 0;
      if(remaining < 0){
        timeUp();
      }
    }, 1000);
  }
}
function stopTimer(){
  if(timerId){ clearInterval(timerId); timerId = null; }
}

// --------- Lógica de click ---------
function onCardClick(e){
  const card = e.currentTarget;
  if(lockBoard) return;
  if(card === firstCard) return;
  if(card.classList.contains('matched')) return;

  ensureTimer();

  // voltear
  card.classList.add('flipped');
  card.setAttribute('aria-pressed', 'true');

  if(!firstCard){
    firstCard = card;
    return;
  }

  // segunda carta
  secondCard = card;
  attempts++;
  attemptsEl.textContent = attempts;
  lockBoard = true;

  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if(isMatch){
    firstCard.classList.add('matched', 'locked');
    secondCard.classList.add('matched', 'locked');
    messageEl.textContent = '¡Buen par! ✅';

    // puntuación: recompensa por acierto + segundos restantes
    score += 100 + Math.max(0, remaining);
    scoreEl.textContent = score;

    matches++;
    resetTurn();
    checkWin();
  } else {
    messageEl.textContent = 'No coinciden… ❌';

    // penalización por fallo
    score = Math.max(0, score - 10);
    scoreEl.textContent = score;

    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.setAttribute('aria-pressed', 'false');
      secondCard.setAttribute('aria-pressed', 'false');
      resetTurn();
    }, 700);
  }
}
function resetTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// --------- Fin de juego ---------
function checkWin(){
  const totalPairs = ICONS.length;
  if(matches >= totalPairs){
    stopTimer();
    messageEl.textContent = `🎉 ¡Victoria! Tiempo: ${formatTime(elapsed)} — Intentos: ${attempts} — Score: ${score}`;
    lockAllCards();
  }
}
function timeUp(){
  stopTimer();
  lockBoard = true;
  lockAllCards();
  messageEl.textContent = `⏰ Tiempo agotado. Intentos: ${attempts} — Score: ${score}. Presiona Reiniciar para intentar de nuevo.`;
}
function lockAllCards(){
  document.querySelectorAll('.card').forEach(c => c.classList.add('locked'));
}

// --------- Reiniciar ---------
function resetGame(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
  matches = 0;
  attempts = 0;
  score = 0;
  attemptsEl.textContent = attempts;
  scoreEl.textContent = score;
  messageEl.textContent = '';

  timerStarted = false;
  elapsed = 0;
  timeEl.textContent = '00:00';
  stopTimer();

  const lim = clamp(parseInt(limitInput.value || '60',10), 5, 999);
  remaining = lim;
  remainingEl.textContent = remaining;

  deck = buildDeck();
  renderBoard();
}

// --------- Eventos ---------
resetBtn.addEventListener('click', resetGame);
limitInput.addEventListener('change', () => {
  // Si aún no inicia el timer, actualiza la vista previa de "Restante"
  if(!timerStarted){
    const lim = clamp(parseInt(limitInput.value || '60',10), 5, 999);
    remaining = lim;
    remainingEl.textContent = remaining;
  }
});

// --------- Inicio ---------
deck = buildDeck();
renderBoard();
remainingEl.textContent = limitInput.value; // inicializa la vista previa
