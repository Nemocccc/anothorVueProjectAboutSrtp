<template>
  <div id="app">
    <MainRouter />
  </div>
</template>

<script lang="ts">
import MainRouter from './components/MainRouter.vue'

export default {
  name: 'app',
  data() {
    return {
    }
  },
  components: {
    MainRouter
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
}
html, body, h3 {
  margin: 0;
  padding: 0px;
  border: 0;
  background-color: #070c3f;
  width: 100%;
}

</style>

