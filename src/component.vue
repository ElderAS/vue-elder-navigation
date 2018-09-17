<template>
  <div class="elder__navigation-wrapper">
    <nav class="elder__navigation" :class="{ 'elder__navigation--expanded': isOpen, 'elder__navigation--responsive': isResponsive }">
      <node-component :item="logoItem" ref="item" class="elder__navigation-logo">
        <slot name="logo">
          <img v-if="logo" :src="logo" :style="{ height: height + 'px' }">
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
    title: String,
    action: [Object, String, Function],
    items: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    items: {
      handler() {
        this.calculateWidth()
      },
      immediate: true,
    },
  },
  data() {
    return {
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
    hasRouterLink() {
      return '$route' in this
    },
  },
  methods: {
    calculateWidth() {
      this.$nextTick(() => {
        this.minWidth = Math.ceil(
          Array.from(this.$el.querySelectorAll('.elder__navigation-node')).reduce(
            (res, cur) => res + cur.getBoundingClientRect().width,
            0,
          ) + 100,
        )
      })
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
  flex-wrap: wrap;
  align-items: center;

  padding: 10px 0;

  &-logo {
    color: $primary;
    font-size: 1.3rem;
    margin-right: auto;
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
      margin-top: 10px;
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
