<template>
  <select
    class="form-control"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="value in sortedValues" :key="value" :value="value">
      {{ value }}
    </option>
  </select>
</template>

<script>
import { computed } from "vue";

/**
 * `<select>` wrapper to display Bootstrap-style sorted list with bindable model.
 * @displayName Select Sorted
 */

export default {
  props: {
    /**
     * Externally bindable model
     */
    modelValue: {
      type: String,
      required: true
    },
    /**
     * Values to be displayed in the list. Must be array with strings.
     */
    values: {
      type: Array,
      required: true,
      validator: (arr) => arr.every((x) => typeof x == "string")
    }
  },
  emits: ["update:modelValue"],
  setup(props) {
    const sortedValues = computed(() => [...props.values].sort());
    return { sortedValues };
  }
};
</script>

<style scoped lang="scss"></style>
