import { onMounted, ref, watch } from "vue";
import { useCryptoExchangeApi } from "../composables/cryptoExchangeApi";
import { useFiatExchangeApi } from "../composables/fiatExchangeApi";

export function useApiCombiner() {
  const { cryptoCurrencies } = useCryptoExchangeApi();
  const { fiatCurrencies } = useFiatExchangeApi();
  //   const exchangeRates = ref({});
  const allCurrencies = ref([]);
  onMounted(async () => {});

  watch(
    () => fiatCurrencies.value,
    currencies => {
      const newValues = [...new Set([...allCurrencies.value, ...currencies])];
      allCurrencies.value = newValues;
    }
  );

  watch(
    () => cryptoCurrencies.value,
    currencies => {
      const newValues = [...new Set([...allCurrencies.value, ...currencies])];
      allCurrencies.value = newValues;
    }
  );

  const allConvert = (sourceCurrency, targetCurrency, value) => {
    console.log(sourceCurrency, targetCurrency, value);
  };

  return {
    allCurrencies,
    allConvert
  };
}
