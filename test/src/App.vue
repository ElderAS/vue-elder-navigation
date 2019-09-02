<template>
  <div id="app">
    <NavigationComponent :logo="{ alt: 'Test', src: '/logo.png' }" :items="[...items, test]"></NavigationComponent>
    <!-- <router-view /> -->
  </div>
</template>

<script>
import { NavigationComponent, NodeComponent } from '../../'
export default {
  data() {
    let langs = [
      { value: 'nb', label: 'Norsk', phoneExt: 'NO', icon: 'http://localhost:8080/flags/norway.png' },
      { value: 'en', label: 'English', phoneExt: 'GB', icon: 'http://localhost:8080/flags/uk.png' },
      { value: 'sv', label: 'Svenska', phoneExt: 'SE', icon: 'http://localhost:8080/flags/sweden.png' },
      { value: 'pl', label: 'Polskie', phoneExt: 'PL', icon: 'http://localhost:8080/flags/poland.png' },
      { value: 'de', label: 'Deutsch', phoneExt: 'DE', icon: 'http://localhost:8080/flags/germany.png' },
      { value: 'fi', label: 'Suomalainen', phoneExt: 'FI', icon: '/flags/finland.png' },
    ]

    return {
      items: new Array(5).fill(undefined).map((v, i) => ({
        label: 'Link ' + i,
        action: '#',
        items: new Array(3).fill(undefined).map((v, i) => ({
          label: 'Link ' + i,
          action: '#',
        })),
      })),
      test: {
        label: `<span class="navigation__flag-label">${langs[0].label}</span><img src="${langs[0].icon}" height="20" class="navigation__flag" />`,
        items: langs
          .filter(l => l !== langs[0])
          .map(l => ({
            label: `<span class="navigation__flag-label">${l.label}</span> <img src="${l.icon}" height="20" class="navigation__flag"/>`,
            action: () => {
              this.$store.dispatch('Root/UPDATEUSER', {
                id: this.user.id,
                data: {
                  language: l.value,
                },
              })
              this.$store.commit('Root/SETLANGUAGE', l.value)
            },
          })),
      },
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
