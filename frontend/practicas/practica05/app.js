/* ===================================================================
   Práctica 5 • App de Clima con Geolocalización + OpenWeatherMap
   - NO usa librerías externas para fetch (solo fetch nativo).
   - Geolocalización: navigator.geolocation.getCurrentPosition()
   - API DOC: https://openweathermap.org/current
   - IMPORTANTE: Coloca tu propia API KEY abajo.
   =================================================================== */

// 🔑 Reemplaza con tu clave (gratuita) de OpenWeatherMap
const API_KEY = "268bf730aef665663b613a149a770a5d";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Elementos de la UI
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const fxRain = document.getElementById("fxRain");
const fxSnow = document.getElementById("fxSnow");

const locationName = document.getElementById("locationName");
const dateStr = document.getElementById("dateStr");
const temp = document.getElementById("temp");
const feels = document.getElementById("feels");
const desc = document.getElementById("desc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");

const cityForm = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");

// Utilidad: mostrar/ocultar loader
function setLoading(isLoading){
  loader.hidden = !isLoading;
  loader.setAttribute("aria-busy", String(isLoading));
}

// Utilidad: formato de fecha local
function formatDate(d){
  return d.toLocaleString("es-MX", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Utilidad: determina clase de fondo (body) e icono/emojis
function applyThemeByWeather(main){
  // Limpia clases previas y efectos
  document.body.classList.remove("sunny","clouds","rain","snow");
  fxRain.innerHTML = "";
  fxSnow.innerHTML = "";

  const m = main.toLowerCase();
  if (m.includes("rain") || m.includes("drizzle") || m.includes("thunderstorm")){
    document.body.classList.add("rain");
    icon.textContent = "🌧️";
    spawnRain();
  } else if (m.includes("snow")){
    document.body.classList.add("snow");
    icon.textContent = "❄️";
    spawnSnow();
  } else if (m.includes("cloud")){
    document.body.classList.add("clouds");
    icon.textContent = "☁️";
  } else if (m.includes("clear")){
    document.body.classList.add("sunny");
    icon.textContent = "☀️";
  } else {
    document.body.classList.add("clouds");
    icon.textContent = "🌤️";
  }
}

// Efecto lluvia: crea N gotas en posiciones aleatorias
function spawnRain(n = 80){
  const w = window.innerWidth;
  for (let i=0; i<n; i++){
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.style.left = Math.random()*w + "px";
    drop.style.animationDelay = (Math.random()*1.2)+"s";
    drop.style.opacity = (0.5 + Math.random()*0.5).toFixed(2);
    fxRain.appendChild(drop);
  }
}

// Efecto nieve: crea N copos
function spawnSnow(n = 60){
  const w = window.innerWidth;
  for (let i=0; i<n; i++){
    const flake = document.createElement("div");
    flake.className = "snow-flake";
    flake.style.left = Math.random()*w + "px";
    flake.style.animationDelay = (Math.random()*6)+"s";
    flake.style.opacity = (0.7 + Math.random()*0.3).toFixed(2);
    fxSnow.appendChild(flake);
  }
}

// Renderiza la respuesta en la tarjeta
function renderWeather(data){
  const name = data.name;
  const main = data.weather?.[0]?.main || "";
  const description = data.weather?.[0]?.description || "-";
  const t = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const hum = Math.round(data.main.humidity);
  const windKm = (data.wind.speed * 3.6).toFixed(1); // m/s -> km/h

  locationName.textContent = name || "Tu ubicación";
  dateStr.textContent = formatDate(new Date());
  temp.textContent = `${t}°C`;
  feels.textContent = `${feelsLike}°C`;
  desc.textContent = description.charAt(0).toUpperCase() + description.slice(1);
  humidity.textContent = `${hum}%`;
  wind.textContent = `${windKm} km/h`;

  applyThemeByWeather(main);
  weatherCard.hidden = false;
}

// Fetch: por coordenadas
async function fetchByCoords(lat, lon){
  const url = `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Error API: ${res.status}`);
  return res.json();
}

// Fetch: por ciudad
async function fetchByCity(city){
  const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=es`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Ciudad no encontrada o error API (${res.status})`);
  return res.json();
}

// Manejo de errores centralizado
function showError(msg){
  alert(msg);
}

// Geolocalización inicial
async function init(){
  // Si no hay conexión
  if(!navigator.onLine){
    showError("Estás sin conexión. Conéctate a Internet para consultar el clima.");
    return;
  }

  setLoading(true);

  // Intenta geolocalización
  if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      try{
        const { latitude, longitude } = pos.coords;
        const data = await fetchByCoords(latitude, longitude);
        renderWeather(data);
      }catch(err){
        showError("No se pudo cargar el clima por ubicación. Intenta buscar por ciudad.\n" + err.message);
      }finally{
        setLoading(false);
      }
    }, (err)=>{
      // Permiso denegado u otro error: habilita búsqueda manual
      setLoading(false);
      if(err.code === err.PERMISSION_DENIED){
        showError("Permiso de ubicación denegado. Usa la búsqueda por ciudad.");
      }else{
        showError("No se pudo obtener tu ubicación. Usa la búsqueda por ciudad.");
      }
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
  }else{
    setLoading(false);
    showError("Tu navegador no soporta geolocalización. Usa la búsqueda por ciudad.");
  }
}

// Búsqueda por ciudad
cityForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const city = cityInput.value.trim();
  if(!city) return;
  if(!navigator.onLine){
    showError("Sin conexión a Internet.");
    return;
  }
  setLoading(true);
  weatherCard.hidden = true;
  try{
    const data = await fetchByCity(city);
    renderWeather(data);
  }catch(err){
    showError(err.message);
  }finally{
    setLoading(false);
  }
});

// Inicia la app
init();
