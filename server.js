const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON e form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public' (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para converter moedas (API)
app.post('/converter', async (req, res) => {
  const { valor, moedaBase, moedaDestino } = req.body;

  if (!valor || !moedaBase || !moedaDestino) {
    return res.status(400).json({ error: 'Campos obrigatórios não informados.' });
  }

  try {
    // Monta URL correta para API Frankfurter
    const url = `https://api.frankfurter.app/latest?from=${moedaBase.toUpperCase()}&to=${moedaDestino.toUpperCase()}&amount=${valor}`;
    const response = await axios.get(url);

    if (!response.data || !response.data.rates || !response.data.rates[moedaDestino.toUpperCase()]) {
      return res.status(500).json({ error: 'Erro ao obter taxas de câmbio.' });
    }

    const valorConvertido = response.data.rates[moedaDestino.toUpperCase()];

    return res.json({
      valorOriginal: parseFloat(valor),
      moedaBase: moedaBase.toUpperCase(),
      moedaDestino: moedaDestino.toUpperCase(),
      valorConvertido: valorConvertido.toFixed(2)
    });
  } catch (error) {
    console.error('Erro na API externa:', error.message);
    return res.status(500).json({ error: 'Erro na API externa.' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
