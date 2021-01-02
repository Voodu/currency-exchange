<template>
  <div class="d-flex flex-wrap w-100">
    <input
      class="form-control"
      type="number"
      placeholder="Source value"
      v-model="srcValue"
      aria-label="Value to convert"
      min="1"
      step="any"
    />
    <BaseSelectSorted
      :values="currencies"
      v-model="srcCurrency"
      aria-label="Source currency"
    />
    <button
      class="btn btn-dark w-100 mt-2 mb-2"
      @click="swapCurrencies"
      aria-label="Swap source and target currencies"
    >
      SWAP
    </button>
    <BaseSelectSorted
      :values="currencies"
      v-model="dstCurrency"
      aria-label="Target currency"
    />
    <div class="form-control text-left" aria-label="Result of conversion">
      {{ roundedResult }}
    </div>
  </div>
</template>

<script>
import BaseSelectSorted from "./BaseSelectSorted";
import { ref, watch, computed } from "vue";
import { useCryptoExchangeApi } from "@/composables/cryptoExchangeApi";
import { useFiatExchangeApi } from "@/composables/fiatExchangeApi";
import { useApiCombiner } from "@/composables/apiCombiner";

/**
 * Component allowing to convert a value between two currencies.
 * @displayName Currency Exchanger
 */
export default {
  components: { BaseSelectSorted },
  setup() {
    const { currencies: apiCurrencies, convert: apiConvert } = useApiCombiner([
      useCryptoExchangeApi(),
      useFiatExchangeApi()
    ]);
    const [srcCurrency, dstCurrency] = [ref(""), ref("")];
    const [srcValue, resultValue] = [ref(1), ref(1)];

    // Currencies from APIs are async, so they must be watched to be updated properly.
    watch(apiCurrencies, (currencies) => {
      srcCurrency.value = currencies[0];
      dstCurrency.value = currencies[0];
    });

    // If any of the input changes, automatically update the result.
    watch([srcCurrency, dstCurrency, srcValue], () => {
      resultValue.value = apiConvert(
        srcCurrency.value,
        dstCurrency.value,
        srcValue.value
      );
    });

    // Prevent negative input
    watch(srcValue, (current, prev) => {
      if (current < 0) {
        srcValue.value = prev;
      }
    });

    // Round the result to 8 digits after the comma - that's the highest precision from the current APIs
    const roundedResult = computed(
      () => Math.round(resultValue.value * 1e8 + Number.EPSILON) / 1e8
    );

    const swapCurrencies = () => {
      [srcCurrency.value, dstCurrency.value] = [
        dstCurrency.value,
        srcCurrency.value
      ];
    };

    return {
      srcCurrency,
      dstCurrency,
      srcValue,
      roundedResult,
      currencies: apiCurrencies,
      swapCurrencies
    };
  }
};
</script>

<style scoped lang="scss"></style>
