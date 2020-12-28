import { onMounted, ref, computed } from "vue";

export function useCryptoExchangeApi() {
  const exchangeRates = ref({});

  onMounted(async () => {
    const tickerResponse = await (
      await fetch("https://api.binance.com/api/v3/ticker/price")
    ).json();
    const ticker = tickerResponse.reduce(
      (acc, curr) => ((acc[curr.symbol] = parseFloat(curr.price)), acc),
      {}
    );

    const exchangeResponse = await (
      await fetch("https://api.binance.com/api/v3/exchangeInfo")
    ).json();
    const symbols = exchangeResponse.symbols.map(x => ({
      base: x.baseAsset,
      quote: x.quoteAsset
    }));

    exchangeRates.value["BTC"] = 1.0;
    let original = new Set(["BTC"]);
    let btcSymbols = symbols.filter(s => s.base === "BTC" || s.quote === "BTC");
    for (const s of btcSymbols) {
      if (s.base == "BTC") {
        exchangeRates.value[s.quote] = ticker[s.base + s.quote];
        original.add(s.quote);
      } else {
        exchangeRates.value[s.base] = 1.0 / ticker[s.base + s.quote];
        original.add(s.base);
      }
    }

    let calculated = new Set();
    let nonBtcSymbols = symbols.filter(
      s => s.base !== "BTC" && s.quote !== "BTC"
    );
    for (const s of nonBtcSymbols) {
      if (!original.has(s.base)) {
        exchangeRates.value[s.base] =
          exchangeRates.value[s.quote] / ticker[s.base + s.quote];
        calculated.add(s.base);
      } else if (!original.has(s.quote)) {
        exchangeRates.value[s.quote] =
          exchangeRates.value[s.base] / ticker[s.base + s.quote];
        calculated.add(s.quote);
      }
      // Catch error if both values are unsupported (there won't be any rate)
    }
  });

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
