🎮 RunnerJS - Proyecto Integrador 🚀

¡Bienvenido a RunnerJS! Un juego endless runner de ciencia ficción inspirado en el clásico de Google, pero con un toque temático de Halo. Salta para esquivar obstáculos, sobrevive para subir de nivel y compite por el puntaje más alto en el leaderboard global.

Este proyecto fue desarrollado como parte del primer departamental, integrando tecnologías de frontend y backend para crear una experiencia de juego completa.
✨ ¡Juega Ahora! ✨

    Juego en Vivo: https://gaelking3231.github.io/RunnerJS-Proyecto/proyecto/game.html
    API del Leaderboard: runnerjs-proyecto.onrender.com/scores

🕹️ Captura del Juego
🎯 Descripción del Proyecto

El objetivo de este proyecto es aplicar los conocimientos de HTML5, CSS3, JavaScript y Node.js para desarrollar un juego web completo. La aplicación incluye tanto la parte visual e interactiva del juego como un servidor backend que gestiona y almacena las puntuaciones de los jugadores.
Características Principales:

    Jugabilidad Clásica: Salta con la barra espaciadora o tocando la pantalla para esquivar obstáculos.

    Dificultad Progresiva: A medida que avanzas, el juego aumenta su velocidad y la frecuencia de los obstáculos.

    Sistema de Niveles y Puntuación: Compite por superar tu propio récord y el de los demás.

    Leaderboard Global: Al finalizar una partida, puedes guardar tu puntuación con tu nombre. Las 10 mejores puntuaciones se muestran en una tabla global.

    Backend en Node.js: Un servidor hecho con Express gestiona las puntuaciones, guardándolas en un archivo JSON.

    Portafolio Integrado: El proyecto forma parte de un portafolio que muestra otras prácticas realizadas.

📁 Estructura del Repositorio

El proyecto está organizado en dos carpetas principales para separar las responsabilidades del frontend y el backend:

    /docs: Contiene todo el código del cliente (la parte visible).

        index.html: La página principal del portafolio.

        /proyecto/game.html: El juego RunnerJS.

        /practicas/: Subcarpetas con otras prácticas del curso.

    /backend: Contiene el código del servidor.

        server.js: El servidor principal construido con Express.

        /data/scores.json: El archivo donde se almacenan las puntuaciones.

        package.json: Define las dependencias del servidor.

⚙️ Cómo Ejecutar el Proyecto Localmente

Si quieres ejecutar el proyecto en tu propia máquina, sigue estos pasos:
1. Frontend (El Juego)

No requiere instalación. Simplemente abre el archivo docs/index.html en tu navegador web.
2. Backend (El Servidor de Puntuaciones)

Necesitas tener Node.js instalado.

# 1. Clona este repositorio
git clone [https://github.com/gaelking3231/RunnerJS-Proyecto.git](https://github.com/gaelking3231/RunnerJS-Proyecto.git)

# 2. Navega a la carpeta del backend
cd RunnerJS-Proyecto/backend

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor
npm start

El servidor local se ejecutará en http://localhost:3000.
🛠️ Tecnologías Utilizadas

    Frontend:

    Backend:

    Despliegue:

👤 Autor

    [Levi Gael Rodriguez Ramirez] - [Estudiante]
