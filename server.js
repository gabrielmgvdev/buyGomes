const express = require("express");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const path = require("path"); // Importar o módulo 'path'
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Customer = require("./models/customerModel");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public")); // Para servir arquivos estáticos, se necessário

// Rota para servir o HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "payment.html"));
});

// Rota de pagamento
app.post('/api/payment', async (req, res) => {
    try {
        const { name, email, cep, payment_method } = req.body;

        // Criar um PaymentIntent no Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Valor em centavos
            currency: 'usd',
            payment_method: payment_method,
            confirm: true,
        });

        // Se o pagamento for bem-sucedido, salvar no MongoDB
        const customer = new Customer({
            name,
            email,
            cep,
            status: 'success',
        });
        await customer.save();

        res.json({ success: true });
    } catch (error) {
        // Se o pagamento falhar, salvar o erro no MongoDB
        const { name, email, cep } = req.body;

        const customer = new Customer({
            name,
            email,
            cep,
            status: 'error',
            paymentError: error.message,
        });
        await customer.save();

        res.json({ success: false, error: error.message });
    }
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
