const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

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
    const url = `https://open.er-api.com/v6/latest/${moedaBase.toUpperCase()}`;
    const response = await axios.get(url);

    if (response.data.result !== "success") {
      return res.status(500).json({ error: 'Erro ao obter taxas de câmbio.' });
    }

    const taxas = response.data.rates;

    if (!taxas[moedaDestino.toUpperCase()]) {
      return res.status(400).json({ error: 'Moeda destino inválida.' });
    }

    const cotacao = taxas[moedaDestino.toUpperCase()];
    const valorConvertido = parseFloat(valor) * cotacao;

    return res.json({
      valorOriginal: parseFloat(valor),
      moedaBase: moedaBase.toUpperCase(),
      moedaDestino: moedaDestino.toUpperCase(),
      valorConvertido: valorConvertido.toFixed(2)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro na API externa.' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
