<template>
  <div class="d-flex flex-wrap">
    <input
      class="form-control"
      type="number"
      placeholder="Source value"
      v-model="srcValue"
    />
    <BaseSortedSelect
      class="form-control"
      :values="currencies"
      v-model="srcCurrency"
    />
    <button
      class="btn btn-outline-primary w-100 mt-2 mb-2"
      @click="swapCurrencies"
    >
      SWAP
    </button>
    <BaseSortedSelect
      class="form-control"
      :values="currencies"
      v-model="dstCurrency"
    />
    <input class="form-control" disabled :value="roundedResult" />
  </div>
</template>

<script>
import BaseSortedSelect from "./BaseSortedSelect";
import { ref, watch, computed } from "vue";
import { useApiCombiner } from "../composables/apiCombiner";

export default {
  components: { BaseSortedSelect },
  setup() {
    const { currencies: apiCurrencies, convert: apiConvert } = useApiCombiner();
    const [srcCurrency, dstCurrency] = [ref(""), ref("")];
    const [srcValue, resultValue] = [ref(0), ref(0)];

    watch(apiCurrencies, (currencies) => {
      srcCurrency.value = currencies[0];
      dstCurrency.value = currencies[0];
    });

    watch([srcCurrency, dstCurrency, srcValue], () => {
      resultValue.value = apiConvert(
        srcCurrency.value,
        dstCurrency.value,
        srcValue.value
      );
    });

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

<style scoped lang="scss">
</style>
