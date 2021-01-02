import { ExchangeApi } from "@/utils/exchangeApi";
import { onMounted, ref, computed } from "vue";

// Conversion base. All currencies will be converted into it (if not available directly from the API).
const BASE = "BTC";

/**
 * @returns {ExchangeApi} Reactive Exchange API instance for crypto currencies.
 */
export function useCryptoExchangeApi() {
  const exchangeRates = ref({});

  onMounted(async () => await setupExchangeRates(exchangeRates));

  const convert = (srcCurrency, dstCurrency, value) => {
    return (
      value *
      (exchangeRates.value[dstCurrency] / exchangeRates.value[srcCurrency])
    );
  };

  return new ExchangeApi(
    computed(() => Object.keys(exchangeRates.value)),
    convert
  );
}

/**
 * Sets up all the exchange rates available from the API.
 * @param {Object} exchangeRates Empty Vue ref to be populated with API data
 */
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

/**
 * Calculates exchange rates from BASE directly from the API data.
 * @param {Object} symbols Base & Quote asset pairs from exchangeInfo endpoint, ex. {base: "BTC", quote: "USD"}
 * @param {Object} apiRates Conversion rates between symbols, ex. rates["BTCUSD"] = 25000
 * @returns {Object} Conversion rates from BASE directly available from the API, ex. rates["USD"] = 25000
 */
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

/**
 * Calculates unknown exchange rates from BASE using already known ones.
 * @param {Object} symbols Base & Quote asset pairs from exchangeInfo endpoint, ex. {base: "BTC", quote: "USD"}
 * @param {Object} apiRates Conversion rates between symbols, ex. rates["BTCUSD"] = 25000
 * @param {Object} knownRates Already known conversion rates, ex. rates["USD"] = 25000
 * @param {Array.<string>} knownSymbols Symbols which exchange rates are already known, ex. ["BTC", "USD"]
 * @returns {Object} Calculated conversion rates from BASE, ex. rates["ABC"] = 12345
 */
function getCalcRates(symbols, apiRates, knownRates, knownSymbols) {
  const rates = {};
  const otherSymbols = symbols.filter(s => s.src !== BASE && s.dst !== BASE);
  for (const s of otherSymbols) {
    const [hasSrc, hasDst] = [knownSymbols.has(s.src), knownSymbols.has(s.dst)];
    if (!hasSrc && !hasDst) {
      console.warn(`Cannot calculate conversion for ${s.src} - ${s.dst}`);
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

/**
 * Fetches exchangeInfo from binance API.
 * @returns {Array.<Object>} Array with quote-base asset pairs, ex. [{base: "BTC", quote: "USD"}, ...]
 */
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

/**
 * Fetches conversion rates from binance API.
 * @returns {Object} Conversion rates between symbols, ex. rates["BTCTUSD"] = 25000
 */
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
