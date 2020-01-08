import NavigationComponent from './src/component.vue'
import NodeComponent from './src/node.vue'

const install = Vue => {
  Vue.component('navigation-component', NavigationComponent)
}

const Options = {
  icons: {
    menu: { icon: ['fas', 'bars'], size: 'lg' },
    menuClose: { icon: ['fas', 'times'], size: 'lg' },
    collapse: { icon: ['fas', 'angle-up'] },
    expand: { icon: ['fas', 'angle-down'] },
  },
}

const setup = options => {
  for (let key in options) {
    if (!(key in Options)) return
    Options[key] = options[key]
  }
}

export default {
  install,
}

export { NavigationComponent, NodeComponent, install as NavigationComponentInstaller, setup, Options }
