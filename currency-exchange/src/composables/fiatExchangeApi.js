import { onMounted, ref, computed } from "vue";

export function useFiatExchangeApi() {
  const apiResponse = `{
        "rates": {
          "CAD": 1.5686,
          "HKD": 9.4378,
          "ISK": 156.6,
          "PHP": 58.833,
          "DKK": 7.4401,
          "HUF": 360.93,
          "CZK": 26.275,
          "AUD": 1.62,
          "RON": 4.8603,
          "SEK": 10.1313,
          "IDR": 17351.52,
          "INR": 90.1338,
          "BRL": 6.3144,
          "RUB": 91.7285,
          "HRK": 7.5375,
          "JPY": 126.04,
          "THB": 36.653,
          "CHF": 1.081,
          "SGD": 1.6286,
          "PLN": 4.5111,
          "BGN": 1.9558,
          "TRY": 9.3519,
          "CNY": 7.9784,
          "NOK": 10.6518,
          "NZD": 1.7306,
          "ZAR": 18.0849,
          "USD": 1.2173,
          "MXN": 24.8514,
          "ILS": 3.9564,
          "GBP": 0.9161,
          "KRW": 1350.52,
          "MYR": 4.9313
        },
        "base": "EUR",
        "date": "2020-12-21"
      }`;

  const exchangeRates = ref({});

  onMounted(() => {
    const response = JSON.parse(apiResponse);
    exchangeRates.value = response.rates;
    exchangeRates.value[response.base] = 1.0;
  });

  const fiatConvert = (sourceCurrency, targetCurrency, value) => {
    return (
      value *
      (exchangeRates.value[targetCurrency] /
        exchangeRates.value[sourceCurrency])
    );
  };

  return {
    fiatCurrencies: computed(() => Object.keys(exchangeRates.value)),
    fiatConvert
  };
}
