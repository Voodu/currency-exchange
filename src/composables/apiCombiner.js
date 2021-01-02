import { ref, watch } from "vue";

// Common currency available in all the combined APIs.
const BASE = "EUR";

/**
 * @param {Array.<ExchangeApi>} apis Array of APIs to combine.
 * @returns {ExchangeApi} Reactive Exchange API combining all the APIs.
 */
export function useApiCombiner(apis) {
  const currencies = ref([]);

  for (const api of apis) {
    watchAndCombineCurrencies(api, currencies);
  }

  const convert = (srcCurrency, dstCurrency, value) => {
    let srcApi = getApiWithCurrency(apis, srcCurrency);
    let dstApi = getApiWithCurrency(apis, dstCurrency);
    validateApis(srcApi, dstApi);

    // First convert from source to BASE, then from BASE to target currency
    const toBase = srcApi.convert(srcCurrency, BASE, value);
    const fromBase = dstApi.convert(BASE, dstCurrency, toBase);
    return fromBase;
  };

  return {
    currencies,
    convert
  };
}

/**
 * Asserts if provided APIs can be used for conversion.
 * @param {ExchangeApi} srcApi API able to convert to BASE currency
 * @param {ExchangeApi} dstApi API able to convert from BASE currency
 */
function validateApis(srcApi, dstApi) {
  if (srcApi == null || dstApi == null) {
    throw new Error(
      "Could not find API with either source or target currency."
    );
  }
  if (!isBaseInAllApis([srcApi, dstApi])) {
    throw new Error(`Common base (${BASE}) not found in one of the APIs.`);
  }
}

/**
 * Checks if APIs are able to convert between BASE and other currency.
 * @param {Array.<ExchangeApi>} Array of APIs to check
 */
function isBaseInAllApis(apis) {
  return apis.every(api => api.currencies.value.includes(BASE));
}

/**
 * @param {Array.<ExchangeApi>} apis Array of APIs to check
 * @param {string} currency Currency to be found
 * @returns {ExchangeApi} API having currency in its currencies list.
 */
function getApiWithCurrency(apis, currency) {
  for (const api of apis) {
    if (api.currencies.value.includes(currency)) {
      return api;
    }
  }
  return null;
}

/**
 * Watches api.currencies and combines its currencies with allCurrencies. Keeps all the values unique.
 * @param {ExchangeApi} api API which currencies are watched
 * @param {Array.<string>} allCurrencies Currencies list to combine
 */
function watchAndCombineCurrencies(api, allCurrencies) {
  watch(api.currencies, currencies => {
    const newValues = [...new Set([...allCurrencies.value, ...currencies])];
    allCurrencies.value = newValues;
  });
}
