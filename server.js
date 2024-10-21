const express = require('express');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const path = require('path'); // Importar o módulo 'path'
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Para servir arquivos estáticos, se necessário

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

// Rota de pagamento
app.post('/api/payment', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Substitua pelo valor correto em centavos
            currency: 'usd',
            payment_method: req.body.payment_method,
            confirm: true,
            return_url: 'https://buy-gomes.vercel.app/success.html', // Coloque a URL de retorno correta
        });

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
