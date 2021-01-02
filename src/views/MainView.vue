<template>
  <header class="w-100 align-self-center">
    <h1 class="m-0 font-weight-bold text-center">Currency Exchanger</h1>
  </header>
  <CurrencyExchanger />
  <footer class="w-100 align-self-end">
    <small class="m-0 font-italic text-left">
      Note: Don't plan your financial future using this app. It caches exchange
      rates, so they are not as up to date as they should be. Also, some
      exchange rates are calculated using others, so they are prone to rounding
      errors.
    </small>
  </footer>
</template>

<script>
import CurrencyExchanger from "@/components/CurrencyExchanger";

export default {
  name: "Main",
  components: {
    CurrencyExchanger
  }
};
</script>

<style scoped lang="scss"></style>
