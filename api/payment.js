// api/payment.js
const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Substitua pelo valor correto em centavos
            currency: 'usd',
            payment_method: req.body.payment_method,
            confirm: true,
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Payment error:', error); // Adicione um log para ajudar no diagnóstico
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
