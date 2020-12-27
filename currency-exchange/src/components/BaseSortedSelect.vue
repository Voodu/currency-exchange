<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option
      v-for="value in sortedValues"
      :key="value"
      :value="value"
    >
      {{ value }}
    </option>
  </select>
  <!-- Purely magical comment -->
</template>

<script>
import { computed } from "vue";

export default {
  props: { modelValue: String, values: Array },
  emits: ["update:modelValue"],
  setup(props) {
    const sortedValues = computed(() => [...props.values].sort());
    return { sortedValues };
  }
};
</script>

<style scoped lang="scss"></style>
