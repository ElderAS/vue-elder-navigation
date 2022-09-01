<template>
  <div
    class="elder__navigation-wrapper"
    :class="{ 'elder__navigation-wrapper--calculated': breakpoint }"
    :style="{ transition: animate ? 'transform 100ms ease-out' : 'none' }"
  >
    <nav
      class="elder__navigation"
      ref="nav"
      :class="{
        'elder__navigation--expanded': internalOpen,
        'elder__navigation--responsive': isResponsive,
      }"
      :style="{ padding: this.padding }"
    >
      <node-component ref="logo" :item="{ action: this.action }" class="elder__navigation-logo" @click="toggle(false)">
        <img
          v-if="logo && logoState !== 'error'"
          ref="img"
          :src="logo.src || logo"
          :alt="logo.alt || title"
          :style="{ maxHeight: (logo.height || height) + 'px' }"
          @load="onLogoLoad"
          @error="onLogoError"
          class="elder__navigation-logo-image"
        />
        <div v-if="title && (!logo || logoState === 'error')" class="elder__navigation-logo-fallback">{{ title }}</div>
      </node-component>

      <slot name="center" />

      <div class="elder__navigation-bars" @click="toggle()">
        <fa v-bind="internalOpen ? iconList.menuClose : iconList.menu"></fa>
      </div>

      <div class="elder__navigation-actions" ref="items">
        <slot name="before" />
        <node-component v-for="(item, index) in items" :key="index" :item="item" @click="toggle(false)" />
        <slot />
      </div>
    </nav>
  </div>
</template>

<script>
import './icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import { Options } from '../index'
import NodeComponent from './node.vue'
import { throttle, iconBinding } from './utils'

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
    dropdownTrigger: {
      type: String,
      default: 'hover',
      enum: ['hover', 'click'],
    },
    items: {
      type: Array,
      default: () => [],
    },
    icons: {
      type: Object,
      default: () => ({}),
    },
    isOpen: Boolean,
  },
  watch: {
    isOpen: {
      handler(val) {
        this.internalOpen = Boolean(val)
      },
      immediate: true,
    },
  },
  provide() {
    return {
      iconList: this.iconList,
      dropdownTrigger: this.dropdownTrigger,
    }
  },
  data() {
    return {
      internalOpen: false,
      minWidth: null,
      width: null,
      observer: null,
      logoState: null,
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
    iconList() {
      return Object.entries(Options.icons).reduce((res, [key, value]) => {
        res[key] = iconBinding(this.icons[key] || value)
        return res
      }, {})
    },
  },
  methods: {
    toggle(state) {
      this.internalOpen = state === undefined ? !this.internalOpen : state
      this.$emit('update:isOpen', this.internalOpen)
    },
    init() {
      this.calculate()
      this.observe()
    },
    onLogoError() {
      this.logoState = 'error'
      this.init()
    },
    onLogoLoad() {
      this.logoState = 'loaded'
      this.init()
    },
    calculate() {
      if (!['items'].map((key) => this.$refs[key]).every(Boolean)) return
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
      if (!['items'].map((key) => this.$refs[key]).every(Boolean)) return
      if (this.breakAt) return

      this.observer = new MutationObserver((list) => {
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
@import './main';

.elder__navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &--responsive {
    flex-wrap: wrap;
    max-height: 100vh;
    overflow-y: auto;
  }

  &-wrapper {
    &:not(&--calculated) {
      position: fixed;

      flex-wrap: nowrap;

      transform: translateY(-100%);
    }
  }

  &-logo {
    font-size: 1.3rem;

    flex-shrink: 0;

    color: GetVariable('primary');

    .elder__navigation-component:before {
      content: initial;
    }

    &-image {
      max-width: 60vw;
      width: 100%;
      object-fit: contain;
      object-position: left;
    }

    &-fallback {
      line-height: 1;
    }
  }

  &-bars {
    display: none;

    .elder__navigation--responsive & {
      display: block;
    }
  }

  &-actions {
    display: flex;

    & > * + * {
      margin-left: 0.5rem;
    }

    .elder__navigation--responsive & {
      display: none;

      width: calc(100% + 10px);
      margin-top: 20px;

      animation: slideDown 150ms ease-out;

      & > * {
        margin-left: 0;
      }

      @keyframes slideDown {
        0% {
          transform: translateY(-20px);

          opacity: 0;
        }
      }
    }
    .elder__navigation--responsive.elder__navigation--expanded & {
      display: block;
    }
  }
}
</style>
