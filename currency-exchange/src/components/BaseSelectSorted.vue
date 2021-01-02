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

export default {
  props: {
    modelValue: {
      type: String,
      required: true
    },
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
