const express = require('express');
const figlet = require('figlet');
const app = express();

const PORT = process.env.PORT || 3000;

// Configurazione
const TEXT = "BLASTERGRIM";
// Font 3D consigliati: 'Larry 3D', 'Doom', 'Isometric1', 'Star Wars'
const FONT = 'Larry 3D'; 

// Codici per pulire il terminale
const CLEAR = '\x1b[2J\x1b[3J\x1b[H';

// Funzione matematica per generare l'arcobaleno fluido
// Usa onde sinusoidali sfasate per creare RGB dolci
function getRainbowColor(offset, i) {
    const r = Math.floor(Math.sin(0.1 * i + offset + 0) * 127 + 128);
    const g = Math.floor(Math.sin(0.1 * i + offset + 2) * 127 + 128);
    const b = Math.floor(Math.sin(0.1 * i + offset + 4) * 127 + 128);
    return `\x1b[38;2;${r};${g};${b}m`; // Codice ANSI TrueColor
}

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Generiamo la scritta 3D
    figlet.text(TEXT, { font: FONT }, (err, asciiArt) => {
        if (err) return res.end('Errore font');

        const lines = asciiArt.split('\n');
        let offset = 0; // Serve per muovere l'onda dei colori

        const timer = setInterval(() => {
            let output = CLEAR + '\n\n'; // Un po' di margine in alto

            // Applichiamo il gradiente riga per riga (o carattere per carattere)
            // Qui lo applichiamo verticalmente per un effetto "scan"
            lines.forEach((line, index) => {
                // Calcola il colore per questa riga basandosi sull'offset temporale
                const color = getRainbowColor(offset, index * 2); 
                output += color + line + '\n';
            });
            
            output += '\x1b[0m'; // Resetta colori alla fine
            
            // Aggiungi una firma o info in basso
            output += `\n       \x1b[37m(Premi CTRL+C per uscire)\x1b[0m\n`;

            res.write(output);
            
            // Aumenta l'offset per far muovere i colori al prossimo frame
            offset += 0.5; 

        }, 100); // 10 FPS (Frames Per Second)

        // Pulizia quando l'utente chiude
        req.on('close', () => {
            clearInterval(timer);
            res.end();
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server 3D attivo su porta ${PORT}`);
});
