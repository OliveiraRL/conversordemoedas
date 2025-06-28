const axios = require('axios');
const readline = require('readline');

async function obterCotacao(moedaBase, moedaDestino) {
  try {
    const url = `https://api.frankfurter.app/latest?from=${moedaBase}&to=${moedaDestino}`;
    const response = await axios.get(url);
    const taxa = response.data.rates[moedaDestino];
    return taxa;
  } catch (error) {
    console.error('Erro na API:', error.message);
    return null;
  }
}

async function converter(valor, moedaBase, moedaDestino) {
  const cotacao = await obterCotacao(moedaBase, moedaDestino);
  if (!cotacao) {
    console.log('Não foi possível obter a cotação.');
    return;
  }

  const valorConvertido = valor * cotacao;
  console.log(`${valor} ${moedaBase} = ${valorConvertido.toFixed(2)} ${moedaDestino}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pergunta(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    const valor = await pergunta('Digite o valor que deseja converter: ');
    const moedaBase = (await pergunta('Digite a moeda base (ex: BRL): ')).toUpperCase();
    const moedaDestino = (await pergunta('Digite a moeda destino (ex: USD): ')).toUpperCase();

    if (isNaN(parseFloat(valor))) {
      console.log('Valor inválido. Digite um número.');
      rl.close();
      return;
    }

    await converter(parseFloat(valor), moedaBase, moedaDestino);
  } catch (error) {
    console.log('Erro:', error.message);
  } finally {
    rl.close();
  }
}

main();
