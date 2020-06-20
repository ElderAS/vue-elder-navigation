<template>
  <component
    :is="type"
    v-bind="{
      to: action,
      activeClass,
      ...$attrs,
    }"
    :class="classes"
    ref="anchor"
    @click.native="onClick"
  >
    <slot>
      <fa v-if="icon && alignment === 'left'" v-bind="iconComp" class="elder__navigation-component-icon-left"></fa>
      <div v-html="label"></div>
      <fa v-if="icon && alignment === 'right'" v-bind="iconComp" class="elder__navigation-component-icon-right"></fa>
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
    label: String,
    action: [String, Object, Function],
    alignment: {
      type: String,
      default: 'right',
    },
    icon: [String, Array, Object],
    activeClass: {
      type: String,
      default: 'elder__navigation-component--active',
    },
  },
  computed: {
    type() {
      switch (typeof this.action) {
        case 'string':
          return AnchorComponent
        case 'object':
          return 'router-link'
        default:
          return ButtonComponent
      }
    },
    classes() {
      return [
        'elder__navigation-component',
        this.$attrs.class,
        {
          [this.activeClass]: this.isActive,
        },
      ]
    },
    isActive() {
      if (typeof this.action === 'object') return false
      if (this.active) return true
      if (typeof this.action === 'string') return location.href.replace(location.origin, '').includes(this.action)
    },
    iconComp() {
      return iconBinding(this.icon)
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
  components: {
    Fa,
  },
}
</script>

<style lang="scss">
@import './main';

:root {
  @include GenerateVariables();
}

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
  border-radius: var(--vue-elder-border-radius);
  color: var(--vue-elder-text-color);
  transition: background-color 150ms ease-in-out;

  &:hover,
  &:active {
    background-color: var(--vue-elder-navigation-active-color);
  }

  &-icon-left {
    margin-right: 15px;
  }

  &-icon-right {
    margin-left: 15px;
  }

  &--active {
    background-color: var(--vue-elder-navigation-active-color);
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
