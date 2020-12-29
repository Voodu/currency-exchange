import { ref, watch } from "vue";
import { useCryptoExchangeApi } from "../composables/cryptoExchangeApi";
import { useFiatExchangeApi } from "../composables/fiatExchangeApi";

const BASE = "EUR";

export function useApiCombiner() {
  const apis = [useCryptoExchangeApi(), useFiatExchangeApi()];
  const currencies = ref([]);

  for (const api of apis) {
    watchAndCombineCurrencies(api, currencies);
  }

  const convert = (srcCurrency, dstCurrency, value) => {
    let srcApi = getApiWithCurrency(apis, srcCurrency);
    let dstApi = getApiWithCurrency(apis, dstCurrency);
    validateApis(srcApi, dstApi);

    const toCommon = srcApi.convert(srcCurrency, BASE, value);
    const fromCommon = dstApi.convert(BASE, dstCurrency, toCommon);
    return fromCommon;
  };

  return {
    currencies,
    convert
  };
}

function validateApis(srcApi, dstApi) {
  if (srcApi == null || dstApi == null) {
    throw new Error(
      "Could not find API with either source or target currency."
    );
  }
  if (!isBaseInBothApis(srcApi, dstApi)) {
    throw new Error(`Common base (${BASE}) not found in one of the APIs.`);
  }
}

function isBaseInBothApis(srcApi, dstApi) {
  return (
    srcApi.currencies.value.includes(BASE) &&
    dstApi.currencies.value.includes(BASE)
  );
}

function getApiWithCurrency(apis, srcCurrency) {
  for (const api of apis) {
    if (api.currencies.value.includes(srcCurrency)) {
      return api;
    }
  }
  return null;
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
