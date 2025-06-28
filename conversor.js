const axios = require('axios');
const readline = require('readline');

async function obterCotacao(moedaBase) {
  try {
    const url = `https://api.exchangerate.host/latest?base=${moedaBase}`;
    const response = await axios.get(url);
    if (response.data && response.data.rates) {
      return response.data.rates;
    } else {
      throw new Error('Erro ao obter taxas de câmbio');
    }
  } catch (error) {
    console.error('Erro na API:', error.message);
    return null;
  }
}

async function converter(valor, moedaBase, moedaDestino) {
  const taxas = await obterCotacao(moedaBase);
  if (!taxas) {
    console.log('Não foi possível obter as taxas de câmbio.');
    return;
  }
  if (!taxas[moedaDestino]) {
    console.log('Moeda destino não encontrada.');
    return;
  }
  const cotacao = taxas[moedaDestino];
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

    if(isNaN(parseFloat(valor))) {
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