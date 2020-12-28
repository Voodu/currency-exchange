import { onMounted, ref, computed } from "vue";

const BASE = "BTC";

export function useCryptoExchangeApi() {
  const exchangeRates = ref({});

  onMounted(async () => await setupExchangeRates(exchangeRates));

  const cryptoConvert = (sourceCurrency, targetCurrency, value) => {
    return (
      value *
      (exchangeRates.value[targetCurrency] /
        exchangeRates.value[sourceCurrency])
    );
  };

  return {
    cryptoCurrencies: computed(() => Object.keys(exchangeRates.value)),
    cryptoConvert
  };
}

async function setupExchangeRates(exchangeRates) {
  const apiRates = await getApiRates();
  const exchangeInfo = await getExchangeInfo();

  exchangeRates.value[BASE] = 1.0;
  exchangeRates.value = {
    ...exchangeRates.value,
    ...getBaseRates(exchangeInfo, apiRates)
  };
  const knownSymbols = new Set(Object.keys(exchangeRates.value));
  exchangeRates.value = {
    ...exchangeRates.value,
    ...getCalcRates(exchangeInfo, apiRates, exchangeRates.value, knownSymbols)
  };
}

function getBaseRates(symbols, apiRates) {
  const rates = {};
  const baseSymbols = symbols.filter(s => s.src === BASE || s.dst === BASE);
  for (const s of baseSymbols) {
    if (s.src == BASE) {
      rates[s.dst] = apiRates[s.src + s.dst];
    } else {
      rates[s.src] = 1.0 / apiRates[s.src + s.dst];
    }
  }

  return rates;
}

function getCalcRates(symbols, apiRates, knownRates, knownSymbols) {
  const rates = {};
  const otherSymbols = symbols.filter(s => s.src !== BASE && s.dst !== BASE);
  for (const s of otherSymbols) {
    const [hasSrc, hasDst] = [knownSymbols.has(s.src), knownSymbols.has(s.dst)];
    if (!hasSrc && !hasDst) {
      console.error(`Cannot calculate conversion for ${s.src} - ${s.dst}`);
      continue; // It's impossible to calculate two unknown symbols
    }
    if (!hasSrc) {
      rates[s.src] = knownRates[s.dst] / apiRates[s.src + s.dst];
    } else if (!hasDst) {
      rates[s.dst] = knownRates[s.src] / apiRates[s.src + s.dst];
    } // else: both were already discovered indirectly from BASE
  }

  return rates;
}

async function getExchangeInfo() {
  const exchangeResponse = await (
    await fetch("https://api.binance.com/api/v3/exchangeInfo")
  ).json();
  const symbols = exchangeResponse.symbols
    // filter excludes double-defined currencies, ex. BTCPAX and PAXBTC
    .filter(x => x.status != "BREAK")
    .map(x => ({
      src: x.baseAsset,
      dst: x.quoteAsset
    }));

  return symbols;
}

async function getApiRates() {
  const tickerResponse = await (
    await fetch("https://api.binance.com/api/v3/ticker/price")
  ).json();
  const ticker = tickerResponse.reduce(
    (acc, curr) => ((acc[curr.symbol] = parseFloat(curr.price)), acc),
    {}
  );

  return ticker;
}
