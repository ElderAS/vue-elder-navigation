<template>
  <div class="elder__navigation-wrapper" :class="{'elder__navigation-wrapper--initialized': minWidth }" ref="nav">
    <nav
      class="elder__navigation" 
      :class="{ 'elder__navigation--expanded': isOpen, 'elder__navigation--responsive': isResponsive }"
      :style="navStyle"
    >
      <node-component :item="logoItem" ref="item" class="elder__navigation-logo" @click="isOpen = false">
        <slot name="logo">
          <img v-if="logo" ref="logo" :src="logo" :style="{ maxHeight: height + 'px' }">
        </slot>
      </node-component>

      <div class="elder__navigation-bars" @click="isOpen = !isOpen">
        <fa :icon="isOpen ? ['fas','times'] : ['fas','bars']" size="2x"></fa>
      </div>

      <div class="elder__navigation-actions" ref="item">
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
import Vue from 'vue'
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import NodeComponent from './node.vue'

export default {
  props: {
    logo: String,
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
      handler() {
        this.$nextTick(() => {
          if (!this.$refs.logo) return
          this.$refs.logo.onload = () => {
            this.loaded = true
            this.calculateWidth()
          }
        })
      },
      immediate: true,
    },
    items: {
      handler() {
        this.$nextTick(() => {
          this.calculateWidth()
        })
      },
      immediate: true,
    },
  },
  data() {
    return {
      loaded: false,
      isOpen: false,
      minWidth: null,
      width: null,
    }
  },
  computed: {
    isResponsive() {
      return this.width < this.minWidth
    },
    logoItem() {
      return {
        action: this.action,
      }
    },
    navStyle() {
      return {
        padding: this.padding,
      }
    },
    hasRouterLink() {
      return '$route' in this
    },
  },
  methods: {
    calculateWidth() {
      if (!this.loaded) return
      let bounds = this.$refs.nav.getBoundingClientRect().width
      this.minWidth = Math.ceil(bounds)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.width = window.innerWidth
      window.addEventListener('resize', () => {
        this.width = window.innerWidth
      })
    })
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
