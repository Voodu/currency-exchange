<template>
  <input type="number" placeholder="Source value" v-model="sourceValue" />
  <BaseSortedSelect :values="currencies" v-model="sourceCurrency" />
  <br />
  <BaseSortedSelect :values="currencies" v-model="targetCurrency" />
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
    const { allCurrencies, allConvert } = useApiCombiner();
    const [sourceCurrency, targetCurrency] = [ref(""), ref("")];
    const [sourceValue, resultValue] = [ref(0), ref(0)];

    const convert = () => {
      resultValue.value = allConvert(
        sourceCurrency.value,
        targetCurrency.value,
        sourceValue.value
      );
    };

    watch(
      () => allCurrencies.value,
      (currencies) => {
        sourceCurrency.value = currencies[0];
        targetCurrency.value = currencies[0];
      }
    );

    return {
      sourceCurrency,
      targetCurrency,
      sourceValue,
      resultValue,
      currencies: allCurrencies,
      convert
    };
  }
};
</script>

<style scoped lang="scss"></style>
