const express = require('express');
const app = express();

const port = 3000;

const fs = require('fs').promises;
const path = require('path');

app.use(express.static("public"));
app.use('/data', express.static('data'));

// FUNZIONE PER CERCARE PAZIENTE
async function getPazienteId(id) {
  const filePazienti = path.join(__dirname, 'data', 'pazienti.json');
  const data = await fs.readFile(filePazienti);
  const pazienti = JSON.parse(data);

  return pazienti.find(p => p.id === Number(id)) || null;
}

// ROTTE HTML
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/about', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'about.html'));
});

// LISTA PAZIENTI
app.get('/paziente/elenco', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'pazienti.json'));
    res.status(200).json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ errore: "Errore durante la lettura dei pazienti" });
  }
});


// PAZIENTE PER ID
app.get('/paziente/:id', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'pazienti.json'));
    const pazienti = JSON.parse(data);
    const paziente = pazienti.find(p => p.id == req.params.id);

    if (paziente) {
      res.status(200).json(paziente);
    } else {
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
  } catch (err) {
    res.status(500).json({ errore: "Errore durante la ricerca del paziente" });
  }
});


// POST — AGGIUNTA PAZIENTE
app.post('/paziente', async (req, res) => {
  const filePazienti = path.join(__dirname, 'data', 'pazienti.json');
  const data = await fs.readFile(filePazienti);
  const pazienti = JSON.parse(data);

  const newPaziente = {
    id: pazienti.length + 1,
    nome: req.query.nome,
    cognome: req.query.cognome,
    stato: "connesso",
    ultimaBattuta: Number(req.query.ultimaBattuta)
  };

  pazienti.push(newPaziente);
  await fs.writeFile(filePazienti, JSON.stringify(pazienti, null, 2));

  res.status(201).json(newPaziente);
});

// 404 GENERALE
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// SERVER
app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});
