// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Para servir arquivos estáticos

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/payment', (req, res) => {
    res.sendFile(__dirname + '/payment.html');
});

// Importando a rota de pagamento
const paymentRoute = require('https://buy-gomes.vercel.app/api/payment');
app.use('/api/payment', paymentRoute);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
