<template>
  <div
    class="elder__navigation-wrapper"
    :class="{'elder__navigation-wrapper--initialized': minWidth && !isFetching }"
  >
    <nav
      class="elder__navigation"
      ref="nav"
      :class="{ 'elder__navigation--expanded': isOpen, 'elder__navigation--responsive': isResponsive }"
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
          :src="logo.src || logo"
          :alt="logo.alt || ''"
          :style="{ maxHeight: height + 'px' }"
          @load="init"
          @error="init"
        />
      </node-component>

      <div class="elder__navigation-bars" @click="isOpen = !isOpen">
        <fa :icon="isOpen ? ['fas','times'] : ['fas','bars']" size="2x"></fa>
      </div>

      <div class="elder__navigation-actions" ref="items">
        <slot name="before" />
        <node-component
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          :is-responsive="isResponsive"
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

export default {
  props: {
    logo: [String, Object],
    height: {
      type: Number,
      default: 60,
    },
    padding: {
      type: String,
      default: '20px',
    },
    title: String,
    action: [Object, String, Function],
    items: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    logo: {
      handler(val) {
        if (val) this.isFetching = true
      },
      immediate: true,
    },
  },
  data() {
    return {
      isOpen: false,
      minWidth: null,
      width: null,
      observer: null,
      isFetching: false,
    }
  },
  computed: {
    isResponsive() {
      return this.width < this.minWidth
    },
    hasRouterLink() {
      return '$route' in this
    },
  },
  methods: {
    init() {
      this.isFetching = false
      this.calculateWidth()
    },
    calculateWidth() {
      if (this.isFetching) return
      let actionWidth = this.$refs.items.getBoundingClientRect().width
      let logoWidth = this.$refs.logo.$el.getBoundingClientRect().width
      let computedStyle = window.getComputedStyle(this.$refs.nav)
      let padding = [computedStyle.paddingRight, computedStyle.paddingLeft]
        .map(parseFloat)
        .reduce((r, c) => (r += c), 0)
      this.minWidth = Math.ceil(actionWidth + logoWidth + padding) + 50
    },
  },
  mounted() {
    this.width = window.innerWidth
    window.addEventListener('resize', () => (this.width = window.innerWidth))

    let that = this
    this.observer = new MutationObserver(function(list, observer) {
      if (!list.length) return
      that.calculateWidth()
    })

    this.observer.observe(this.$el, { childList: true, subtree: true })
  },
  beforeDestroy() {
    this.observer.disconnect()
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
    &:not(&--initialized) {
      position: fixed;
      opacity: 0;
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
