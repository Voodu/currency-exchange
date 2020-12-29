<template>
  <input type="number" placeholder="Source value" v-model="sourceValue" />
  <BaseSortedSelect :values="currencies" v-model="srcCurrency" />
  <br />
  <BaseSortedSelect :values="currencies" v-model="dstCurrency" />
  <br />
  <p>result: {{ resultValue }}</p>
  <br />
  <button @click="convert">convert</button>
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
    const [sourceValue, resultValue] = [ref(0), ref(0)];

    const convert = () => {
      resultValue.value = apiConvert(
        srcCurrency.value,
        dstCurrency.value,
        sourceValue.value
      );
    };

    watch(
      () => apiCurrencies.value,
      (currencies) => {
        srcCurrency.value = currencies[0];
        dstCurrency.value = currencies[0];
      }
    );

    return {
      srcCurrency,
      dstCurrency,
      sourceValue,
      resultValue,
      currencies: apiCurrencies,
      convert
    };
  }
};
</script>

<style scoped lang="scss"></style>
