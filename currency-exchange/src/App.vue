<template>
  <MainView />
</template>

<script>
import MainView from "@/views/MainView";

export default {
  name: "App",
  components: {
    MainView
  }
};
</script>

<style lang="scss">
#app {
  height: 100vh;
  max-width: 800px;
  padding: 2rem;
  margin: auto;

  // Vertical center children in itself
  align-items: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
