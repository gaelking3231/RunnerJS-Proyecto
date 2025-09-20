const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors'); // Importamos el paquete CORS

const app = express();
// Usamos el puerto que nos asigne Render, o el 3000 si corremos localmente
const PORT = process.env.PORT || 3000; 

// Aplicamos el middleware de CORS
// Esto permite que tu página de GitHub Pages pueda hacerle peticiones
app.use(cors()); 

app.use(express.json());

const scoresFilePath = path.join(__dirname, 'data', 'scores.json');

// Ruta para obtener las puntuaciones
app.get('/scores', async (req, res) => {
    try {
        const data = await fs.readFile(scoresFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        // Si el archivo no existe, regresa un arreglo vacío
        if (error.code === 'ENOENT') {
            return res.json([]);
        }
        res.status(500).send('Error al leer las puntuaciones');
    }
});

// Ruta para guardar una nueva puntuación
app.post('/scores', async (req, res) => {
    try {
        const newScore = req.body;
        let scores = [];

        try {
            const data = await fs.readFile(scoresFilePath, 'utf8');
            scores = JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, lo crearemos con el primer score
            if (error.code !== 'ENOENT') throw error;
        }

        scores.push(newScore);
        
        // Ordenamos y mantenemos solo los 10 mejores
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 10);

        await fs.writeFile(scoresFilePath, JSON.stringify(topScores, null, 2));
        res.status(201).send('Puntuación guardada');

    } catch (error) {
        res.status(500).send('Error al guardar la puntuación');
    }
});

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});