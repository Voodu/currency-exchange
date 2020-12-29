<template>
  <input type="number" placeholder="Source value" v-model="srcValue" />
  <BaseSortedSelect :values="currencies" v-model="srcCurrency" />
  <br />
  <BaseSortedSelect :values="currencies" v-model="dstCurrency" />
  <br />
  <p>result: {{ resultValue }}</p>
  <button @click="swapCurrencies">Swap</button>
</template>

<script>
import BaseSortedSelect from "./BaseSortedSelect";
import { ref, watch } from "vue";
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
      resultValue,
      currencies: apiCurrencies,
      swapCurrencies
    };
  }
};
</script>

<style scoped lang="scss"></style>
