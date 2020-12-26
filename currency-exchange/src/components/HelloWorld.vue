<template>
  <input type="number" placeholder="Source value" v-model="sourceValue" />
  <input type="text" placeholder="Source currency" v-model="sourceCurrency" />
  <input type="text" placeholder="Target currency" v-model="targetCurrency" />
  <br />
  <p>sourceValue is: {{ sourceValue }}</p>
  <p>sourceCurrency is: {{ sourceCurrency }}</p>
  <p>targetCurrency is: {{ targetCurrency }}</p>
  <br />
  <p>result: {{ resultValue }}</p>
  <br />
  <button @click="convert">convert</button>
  <p>Currencies: {{ currencies }}</p>
</template>

<script>
import { ref } from "vue";
import { useFiatExchangeApi } from "../composables/fiatExchangeApi";

export default {
  setup() {
    const sourceCurrency = ref("");
    const targetCurrency = ref("");
    const sourceValue = ref(0);
    const resultValue = ref(0);

    const { fiatCurrencies, fiatConvert } = useFiatExchangeApi();

    const convert = async () => {
      resultValue.value = await fiatConvert(
        sourceCurrency.value,
        targetCurrency.value,
        sourceValue.value
      );
    };

    return {
      sourceCurrency,
      targetCurrency,
      sourceValue,
      resultValue,
      currencies: fiatCurrencies,
      convert
    };
  }
};
</script>

<style scoped lang="scss"></style>
