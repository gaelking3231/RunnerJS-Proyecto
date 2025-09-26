const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir peticiones desde tu GitHub Pages
const corsOptions = {
  origin: 'https://gaelking3231.github.io', // Tu URL de GitHub Pages
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const scoresFilePath = path.join(dataDir, 'scores.json');

// Asegurarse de que el directorio 'data' y el archivo 'scores.json' existan
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
if (!fs.existsSync(scoresFilePath)) {
    fs.writeFileSync(scoresFilePath, '[]', 'utf8');
}


// Ruta para OBTENER las puntuaciones
app.get('/scores', (req, res) => {
    fs.readFile(scoresFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo de puntuaciones:", err);
            return res.status(500).send('Error al leer las puntuaciones.');
        }
        try {
            const scores = JSON.parse(data);
            res.json(scores);
        } catch (parseErr) {
            console.error("Error al parsear el JSON de puntuaciones:", parseErr);
            res.json([]); // Devuelve un array vacío si el archivo está corrupto
        }
    });
});

// Ruta para GUARDAR una nueva puntuación
app.post('/scores', (req, res) => {
    const newScore = req.body;

    // Validación simple del nuevo score
    if (!newScore || typeof newScore.name !== 'string' || typeof newScore.score !== 'number') {
        return res.status(400).send('Datos de puntuación inválidos.');
    }

    fs.readFile(scoresFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo para guardar:", err);
            return res.status(500).send('Error al guardar la puntuación.');
        }

        let scores = [];
        try {
            // Si el archivo está vacío o corrupto, empezamos con una lista vacía
            scores = JSON.parse(data || '[]');
        } catch (parseErr) {
            console.error("El archivo de scores estaba corrupto. Creando uno nuevo.", parseErr);
        }

        // --- LÓGICA CORREGIDA ---
        // 1. Añade el nuevo score a la lista
        scores.push(newScore);

        // 2. Ordena la lista de mayor a menor puntaje
        scores.sort((a, b) => b.score - a.score);

        // 3. Se queda solo con los 10 mejores
        const top10Scores = scores.slice(0, 10);

        // 4. Guarda la nueva lista actualizada
        fs.writeFile(scoresFilePath, JSON.stringify(top10Scores, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error("Error al escribir en el archivo de puntuaciones:", writeErr);
                return res.status(500).send('Error al guardar la puntuación.');
            }
            console.log('Puntuación guardada:', newScore);
            res.status(201).json(top10Scores);
        });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});