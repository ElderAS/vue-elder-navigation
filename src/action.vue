<template>
  <component
    :is="type"
    v-bind="{
      to: action,
      ...routerLinkClasses,
      ...$attrs,
    }"
    :class="classes"
    ref="anchor"
    @click.native="onClick"
  >
    <slot>
      <Icon v-if="icon && alignment === 'left'" v-bind="iconComp" class="elder__navigation-component-icon-left" />
      <span v-html="label"></span>
      <Icon v-if="icon && alignment === 'right'" v-bind="iconComp" class="elder__navigation-component-icon-right" />
    </slot>
  </component>
</template>

<script>
import Icon from '@kvass/vue2-icon/src/Legacy'
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
    exact: {
      type: Boolean,
      default: false,
    },
    exactActiveClass: {
      type: String,
      default: 'elder__navigation-component--exact-active',
    },
  },
  computed: {
    routerLinkClasses() {
      if (this.exact) return { exactActiveClass: this.exactActiveClass }
      return { activeClass: this.activeClass }
    },
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
    Icon,
  },
}
</script>

<style lang="scss">
@import './main';

.elder__navigation-component {
  font: inherit;
  font-weight: bold;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 20px;

  white-space: nowrap;
  text-decoration: none;

  color: GetVariable('text-color');
  border: none;
  border-radius: GetVariable('border-radius');
  background: transparent;
  transition: background 150ms ease-out;

  @media (hover) {
    &:hover {
      background: rgba(black, 0.05);
    }
  }

  &:active,
  &--exact-active,
  &--active {
    background: rgba(black, GetVariable('navigation-active-opacity'));
  }

  &-icon-left {
    margin-right: 15px;
  }

  &-icon-right {
    margin-left: 15px;
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
