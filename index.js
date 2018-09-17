import NavigationComponent from './src/component.vue'

const install = Vue => {
  Vue.component('navigation-component', NavigationComponent)
}

export default {
  install,
}

export { NavigationComponent, install as NavigationComponentInstaller }
