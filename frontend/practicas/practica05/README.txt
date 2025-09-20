# Práctica 5: App de Clima Local (HTML + CSS + JS)

## Cómo probar
1. Crea una cuenta gratuita en OpenWeatherMap y obtén tu **API Key**.
2. Abre `app.js` y reemplaza:
   ```js
   const API_KEY = "TU_API_KEY_AQUI";
   ```
3. Abre `index.html` en tu navegador (recomendado: con Live Server o un servidor local).
4. Acepta el permiso de ubicación. Si lo rechazas, usa la **búsqueda por ciudad**.
5. Revisa los cambios de **fondo dinámico** (soleado, lluvia con gotas animadas, nublado, nieve con copos).

## Requisitos cubiertos
- `navigator.geolocation` para obtener ubicación.
- `fetch()` nativo (sin axios) hacia la API de OpenWeatherMap.
- Muestra: **temperatura**, **sensación**, **humedad**, **viento**, **descripción**.
- **Spinner/loading** al cargar.
- **Manejo de errores**: sin conexión, permiso denegado, ciudad no encontrada.
- **Fondo dinámico** por clima + partículas de **lluvia** y **nieve** con CSS.
- **Iconos** con Font Awesome (o emojis de fallback).

## Archivos
- `index.html` — estructura semántica y UI.
- `styles.css` — estilos y animaciones.
- `app.js` — lógica de geolocalización + API + render.
