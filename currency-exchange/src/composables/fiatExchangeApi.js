import { ExchangeApi } from "@/utils/exchangeApi";
import { onMounted, ref, computed } from "vue";

// Conversion base. All currencies will be converted into it (if not available directly from the API).
const BASE = "EUR";

/**
 * @returns {ExchangeApi} Reactive Exchange API instance for fiat currencies.
 */
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

  return new ExchangeApi(
    computed(() => Object.keys(exchangeRates.value)),
    convert
  );
}
