<template>
  <component
    :is="type"
    :to="item.action"
    :target="item.target"
    ref="anchor"
    @click.native="onClick"
    class="elder__navigation-component"
    :exact="item.exact"
    :active-class="activeClass"
    :class="[item.class, isActive ? activeClass : '']"
  >
    <slot>
      <fa v-if="icon && alignment === 'left'" v-bind="icon" class="elder__navigation-component-icon-left"></fa>
      <div v-html="item.label"></div>
      <fa v-if="icon && alignment === 'right'" v-bind="icon" class="elder__navigation-component-icon-right"></fa>
    </slot>
  </component>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import AnchorComponent from './action-types/anchor'
import ButtonComponent from './action-types/button'
import { iconBinding } from './utils'

export default {
  props: {
    item: Object,
  },
  computed: {
    type() {
      switch (typeof this.item.action) {
        case 'string':
          return 'anchor-component'
        case 'object':
          return 'router-link'
        default:
          return 'button-component'
      }
    },
    activeClass() {
      return this.item.activeClass || 'elder__navigation-component--active'
    },
    alignment() {
      return this.item.alignment || 'right'
    },
    isActive() {
      if ('active' in this.item) return this.item.active
      if (this.type !== 'a') return false
      return location.href.replace(location.origin, '').includes(this.item.action)
    },
    icon() {
      return iconBinding(this.item.icon)
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
  components: {
    Fa,
    AnchorComponent,
    ButtonComponent,
  },
}
</script>

<style lang="scss">
@import './variables';

.elder__navigation-component {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  font: inherit;
  font-weight: bold;
  border: none;
  background-color: transparent;
  text-decoration: none;
  white-space: nowrap;
  border-radius: $border-radius;
  color: $text-color;
  transition: background-color 150ms ease-in-out;

  &:hover,
  &:active {
    background-color: $elder-navigation-active-color;
  }

  &-icon-left {
    margin-right: 15px;
  }

  &-icon-right {
    margin-left: 15px;
  }

  &--active {
    background-color: $elder-navigation-active-color;
  }

  .elder__navigation--responsive & {
    justify-content: flex-start;
    width: 100%;
  }

  .elder__navigation-logo & {
    padding: 0;
    background-color: transparent !important;
  }
}
</style>
