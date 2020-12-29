import { onMounted, ref, computed } from "vue";

const BASE = "EUR";

export function useFiatExchangeApi() {
  const exchangeRates = ref({});

  onMounted(async () => {
    const response = await (
      await fetch(`https://api.exchangeratesapi.io/latest?base=${BASE}`)
    ).json();
    exchangeRates.value = response.rates;
    exchangeRates.value[BASE] = 1.0;
  });

  const convert = (sourceCurrency, targetCurrency, value) => {
    return (
      value *
      (exchangeRates.value[targetCurrency] /
        exchangeRates.value[sourceCurrency])
    );
  };

  return {
    currencies: computed(() => Object.keys(exchangeRates.value)),
    convert
  };
}
