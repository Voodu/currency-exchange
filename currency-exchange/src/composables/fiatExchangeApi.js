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

  const convert = (srcCurrency, dstCurrency, value) => {
    return (
      value *
      (exchangeRates.value[dstCurrency] / exchangeRates.value[srcCurrency])
    );
  };

  return {
    currencies: computed(() => Object.keys(exchangeRates.value)),
    convert
  };
}
