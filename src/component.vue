<template>
  <div
    class="elder__navigation-wrapper"
    :class="{'elder__navigation-wrapper--calculated': breakpoint }"
    :style="{ transition: animate ? 'transform 100ms ease-out' : 'none'}"
  >
    <nav
      class="elder__navigation"
      ref="nav"
      :class="{ 
        'elder__navigation--expanded': isOpen, 
        'elder__navigation--responsive': isResponsive
      }"
      :style="{ padding: this.padding }"
    >
      <node-component
        ref="logo"
        :item="{ action: this.action }"
        class="elder__navigation-logo"
        @click="isOpen = false"
      >
        <img
          v-if="logo"
          ref="img"
          :src="logo.src || logo"
          :alt="logo.alt || ''"
          :style="{ maxHeight: (logo.height || height) + 'px' }"
          @load="init"
          @error="init"
        />
      </node-component>

      <div class="elder__navigation-bars" @click="isOpen = !isOpen">
        <fa :icon="isOpen ? ['fas','times'] : ['fas','bars']" size="lg"></fa>
      </div>

      <div class="elder__navigation-actions" ref="items">
        <slot name="before" />
        <node-component
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          @click="isOpen = false"
        />
        <slot />
      </div>
    </nav>
  </div>
</template>

<script>
import './icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import NodeComponent from './node.vue'
import { throttle } from './utils'

export default {
  props: {
    logo: [String, Object],
    animate: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 60,
    },
    padding: {
      type: String,
      default: '20px',
    },
    title: String,
    breakAt: Number,
    action: [Object, String, Function],
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: false,
      minWidth: null,
      width: null,
      observer: null,
    }
  },
  computed: {
    isResponsive() {
      return this.width < this.breakpoint
    },
    breakpoint() {
      return this.breakAt || this.minWidth
    },
    hasRouterLink() {
      return '$route' in this
    },
  },
  methods: {
    init() {
      this.calculate()
      this.observe()
    },
    calculate() {
      if (this.breakAt) return

      this.minWidth = null
      this.$nextTick(() => {
        let actionWidth = this.$refs.items.getBoundingClientRect().width
        let logoWidth = this.$refs.logo.$el.getBoundingClientRect().width
        let computedStyle = window.getComputedStyle(this.$refs.nav)
        let padding = [computedStyle.paddingRight, computedStyle.paddingLeft]
          .map(parseFloat)
          .reduce((r, c) => (r += c), 0)
        this.minWidth = Math.ceil(actionWidth + logoWidth + padding) + 50
      })
    },
    observe() {
      if (this.breakAt) return

      this.observer = new MutationObserver(list => {
        if (!list.length) return
        this.calculate()
      })

      this.observer.observe(this.$refs.items, { childList: true })
    },
    setWidth() {
      this.width = window.innerWidth
    },
  },
  mounted() {
    if (this.$refs.img && this.$refs.img.complete) this.init()
    this.setWidth()
    window.addEventListener(
      'resize',
      throttle(() => {
        this.setWidth()
      }, 500),
    )
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect()
  },
  components: {
    NodeComponent,
    Fa,
  },
}
</script>

<style lang="scss">
@import '~node_modules/vue-elder-defaults/styles/variables';
@import '~node_modules/vue-elder-defaults/styles/utils';

.elder__navigation {
  display: flex;
  align-items: center;

  &--responsive {
    flex-wrap: wrap;
  }

  &-wrapper {
    &:not(&--calculated) {
      position: fixed;
      transform: translateY(-100%);
      flex-wrap: nowrap;
    }
  }

  &-logo {
    color: $primary;
    font-size: 1.3rem;
    margin-right: auto;
    flex-shrink: 0;
  }

  &-bars {
    display: none;

    .elder__navigation--responsive & {
      display: block;
    }
  }

  &-actions {
    display: flex;

    .elder__navigation--responsive & {
      display: none;
      width: calc(100% + 10px);
      margin-top: 20px;
      animation: slideDown 150ms ease-in;

      @keyframes slideDown {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
    }
    .elder__navigation--responsive.elder__navigation--expanded & {
      display: block;
    }
  }
}
</style>
