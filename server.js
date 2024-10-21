const express = require('express');
const mongoose = require('mongoose');
const Stripe = require('stripe');
require('dotenv').config();
const path = require('path');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Para servir arquivos estáticos, se necessário

// Rota para servir o HTML da página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para a página de pagamento
app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

// Rota para a página de sucesso
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// Rota de pagamento
app.post('/api/payment', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Substitua pelo valor correto em centavos
            currency: 'usd',
            payment_method: req.body.payment_method,
            confirm: true,
            // Se você estiver usando return_url, coloque aqui
            // return_url: 'http://localhost:3000/success', // URL da página de sucesso (opcional, se você estiver usando)
        });

        // Redireciona para a página de sucesso
        res.redirect('/success');
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
