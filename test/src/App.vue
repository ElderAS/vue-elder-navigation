<template>
  <div id="app">
    <NavigationComponent :logo="{ alt: 'Test', src: '/logo.png' }" :items="items"></NavigationComponent>
    <!-- <router-view /> -->
  </div>
</template>

<script>
import { NavigationComponent, NodeComponent } from '../../'
export default {
  data() {
    return {
      items: new Array(5).fill(undefined).map((v, i) => ({
        label: 'Link ' + i,
        action: '#',
        items: new Array(3).fill(undefined).map((v, i) => ({
          label: 'Link ' + i,
          action: '#',
        })),
      })),
    }
  },
  components: {
    NavigationComponent,
    NodeComponent,
  },
}
</script>


<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.elder__navigation {
  border-bottom: 1px solid #eaeaea;
}
</style>
