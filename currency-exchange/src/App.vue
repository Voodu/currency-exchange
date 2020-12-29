<template>
  <CurrencyExchanger />
</template>

<script>
import CurrencyExchanger from "./components/CurrencyExchanger.vue";

export default {
  name: "App",
  components: {
    CurrencyExchanger
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  padding: 2rem;

  // Vertical center children in itself
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
