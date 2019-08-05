import NavigationComponent from './src/component.vue'
import NodeComponent from './src/node.vue'

const install = Vue => {
  Vue.component('navigation-component', NavigationComponent)
}

export default {
  install,
}

export { NavigationComponent, NodeComponent, install as NavigationComponentInstaller }
