// app.js — Validación en tiempo real + modal + confeti
// Requisitos cubiertos:
//  - Validación JS: campos vacíos, formato email, mensajes de error en vivo.
//  - Envío correcto -> mostrar modal + confeti (10–15 elementos).
//  - Botones "Suscríbete" disparan animación de confeti.

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Año dinámico en footer
$("#year").textContent = new Date().getFullYear();

// Helpers de validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(id, msg){
  const el = document.getElementById(id);
  if (el){ el.textContent = msg; }
}

function validateName(value){
  if (!value || value.trim().length < 2) return "Ingresa al menos 2 caracteres.";
  return "";
}
function validateEmail(value){
  if (!value) return "El email es obligatorio.";
  if (!emailRegex.test(value)) return "Formato de email inválido.";
  return "";
}
function validateMessage(value){
  if (!value || value.trim().length < 10) return "Escribe al menos 10 caracteres.";
  return "";
}

// Validación en vivo
const form = $("#contactForm");
const nameInput = $("#name");
const emailInput = $("#email");
const messageInput = $("#message");

function validateField(input){
  let err = "";
  if (input === nameInput) err = validateName(input.value);
  if (input === emailInput) err = validateEmail(input.value);
  if (input === messageInput) err = validateMessage(input.value);

  showError("err-" + input.id, err);
  input.setAttribute("aria-invalid", err ? "true" : "false");
  return !err;
}

[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener("input", () => validateField(input));
  input.addEventListener("blur", () => validateField(input));
});

// Confeti simple creando divs y dejándolos caer con animación
function spawnConfetti(count = 12){
  const container = $("#confetti");
  const colors = ["#22d3ee", "#a78bfa", "#34d399", "#f9a8d4", "#fde68a"];
  for (let i = 0; i < count; i++){
    const piece = document.createElement("div");
    const size = Math.random()*8 + 6; // 6–14px
    piece.style.position = "absolute";
    piece.style.width = size + "px";
    piece.style.height = size*0.6 + "px";
    piece.style.left = Math.random()*100 + "vw";
    piece.style.top = "-20px";
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.opacity = "0.9";
    piece.style.transform = "rotate(" + (Math.random()*360) + "deg)";
    piece.style.borderRadius = "2px";

    const fall = 40 + Math.random()*20;  // duración caída
    const sway = Math.random()*30 + 10;  // amplitud lateral
    piece.animate(
      [
        { transform: `translateX(0) translateY(0) rotate(0deg)` },
        { transform: `translateX(${sway}px) translateY(100vh) rotate(360deg)` }
      ],
      { duration: fall*100, easing: "ease-out", iterations: 1 }
    );

    container.appendChild(piece);
    // limpiar después
    setTimeout(() => piece.remove(), fall*120);
  }
}

function openModal(){
  const m = $("#successModal");
  m.setAttribute("aria-hidden", "false");
}
function closeModal(){
  const m = $("#successModal");
  m.setAttribute("aria-hidden", "true");
}

$("#closeModal").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// Envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = [nameInput, emailInput, messageInput].every(validateField);
  if (!ok) return;

  // Simular envío (aquí iría fetch() a un backend real)
  setTimeout(() => {
    openModal();
    spawnConfetti(15);
    form.reset();
  }, 200);
});

// Botones "Suscríbete" disparan confeti
["#ctaTop", "#ctaHero"].forEach((sel) => {
  const btn = $(sel);
  if (btn){
    btn.addEventListener("click", () => spawnConfetti(14));
  }
});
