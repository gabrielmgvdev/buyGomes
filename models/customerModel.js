// models/customerModel.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  cep: String,
  status: String,  // 'success' ou 'error'
  paymentError: String, // Mensagem de erro (se houver)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customerSchema);
