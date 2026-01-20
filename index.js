const express = require('express');
const figlet = require('figlet');
const app = express();

const PORT = process.env.PORT || 3000;

// Configurazione testo
const TEXT_TO_SHOW = "BLASTERGRIM";
const FONT_NAME = 'Standard'; // Altri font: 'Ghost', 'Slant', 'Big'

// Codici ANSI per i colori e per pulire lo schermo
const CLEAR_SCREEN = '\x1b[2J\x1b[3J\x1b[H';
const RESET_COLOR = '\x1b[0m';
const COLORS = [
    '\x1b[31m', // Rosso
    '\x1b[33m', // Giallo
    '\x1b[32m', // Verde
    '\x1b[36m', // Ciano
    '\x1b[34m', // Blu
    '\x1b[35m'  // Magenta
];

app.get('/', (req, res) => {
    // Header necessario per lo streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    let frameIndex = 0;

    // Generiamo l'ASCII una volta sola per efficienza (se il testo non cambia forma)
    figlet.text(TEXT_TO_SHOW, { font: FONT_NAME }, (err, data) => {
        if (err) {
            res.send('Errore nella generazione ASCII');
            return;
        }

        // Avvia il loop di animazione
        const timer = setInterval(() => {
            // 1. Seleziona il colore corrente
            const currentColor = COLORS[frameIndex % COLORS.length];
            
            // 2. Costruisci il frame: Pulisci Schermo -> Colore -> Testo -> Reset
            const frame = `${CLEAR_SCREEN}${currentColor}${data}${RESET_COLOR}\n`;

            // 3. Invia il frame al client
            res.write(frame);

            frameIndex++;
        }, 200); // Cambia frame ogni 200ms (5 FPS)

        // IMPORTANTE: Quando l'utente chiude curl (CTRL+C), ferma il loop
        req.on('close', () => {
            clearInterval(timer);
            res.end(); // Chiude la risposta formalmente
            console.log('Connessione chiusa dall\'utente');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server attivo! Prova con: curl localhost:${PORT}`);
});
