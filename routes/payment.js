// routes/payment.js

const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Rota para criar um pagamento
router.post('/', async (req, res) => {
    const { email, amount } = req.body;

    try {
        // Criar um pagamento com Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // valor em centavos
            currency: 'usd', // ou a moeda que você escolher
            receipt_email: email, // enviar o recibo para o e-mail do cliente
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret, // Retorna o client_secret para o frontend
        });
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
