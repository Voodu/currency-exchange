<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option
      v-for="currency in sortedCurrencies"
      :key="currency"
      :value="currency"
    >
      {{ currency }}
    </option>
  </select>
  <!-- Purely magical comment -->
</template>

<script>
import { computed } from "vue";

export default {
  props: { modelValue: String, currencies: Array },
  emits: ["update:modelValue"],
  setup(props) {
    const sortedCurrencies = computed(() => [...props.currencies].sort());
    return { sortedCurrencies };
  }
};
</script>

<style scoped lang="scss"></style>
