const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const checklistFile = 'checklist.json';

// Palette di colori personalizzata
const colors = ['#B1AFFF', '#BBE9FF', '#FFFED3', '#FFE9D0'];

// Middleware per gestire i dati POST
app.use(express.urlencoded({ extended: true }));

// Imposta la cartella pubblica per i file statici
app.use(express.static('public'));

// Imposta EJS come motore di visualizzazione
app.set('view engine', 'ejs');

// Funzione per leggere la checklist e includere colori dalla palette
function getChecklist() {
    if (fs.existsSync(checklistFile)) {
        const items = JSON.parse(fs.readFileSync(checklistFile, 'utf-8'));
        return items.map((item, index) => ({
            text: item,
            color: colors[index % colors.length] // Assegna un colore dalla palette
        }));
    } else {
        return [];
    }
}

// Rotta principale per visualizzare la checklist
app.get('/', (req, res) => {
    const checklist = getChecklist();
    res.render('index', { checklist });
});

// Rotta per aggiungere un elemento alla checklist
app.post('/add', (req, res) => {
    const item = req.body.item;
    let checklist = getChecklist();
    checklist.push(item);
    fs.writeFileSync(checklistFile, JSON.stringify(checklist.map(i => i.text || i))); // Salvare solo il testo
    res.redirect('/');
});

// Rotta per rimuovere un elemento dalla checklist
app.post('/remove', (req, res) => {
    const index = req.body.index;
    let checklist = getChecklist();
    checklist.splice(index, 1);
    fs.writeFileSync(checklistFile, JSON.stringify(checklist.map(i => i.text || i))); // Salvare solo il testo
    res.redirect('/');
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

