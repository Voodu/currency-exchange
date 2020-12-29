import { ref, watch } from "vue";
import { useCryptoExchangeApi } from "../composables/cryptoExchangeApi";
import { useFiatExchangeApi } from "../composables/fiatExchangeApi";

export function useApiCombiner() {
  const apis = [useCryptoExchangeApi(), useFiatExchangeApi()];
  //   const exchangeRates = ref({});
  const currencies = ref([]);

  for (const api of apis) {
    watchAndCombineCurrencies(api, currencies);
  }

  const convert = (sourceCurrency, targetCurrency, value) => {
    console.log(sourceCurrency, targetCurrency, value);
  };

  return {
    currencies,
    convert
  };
}

function watchAndCombineCurrencies(api, allCurrencies) {
  watch(
    () => api.currencies.value,
    currencies => {
      const newValues = [...new Set([...allCurrencies.value, ...currencies])];
      allCurrencies.value = newValues;
    }
  );
}
