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

  &:hover {
    background: rgba(black, 0.05);
  }

  &:active,
  &--active {
    background: rgba(black, GetVariable('navigation-active-opacity'));
  }

  // @media (hover) {
  //   &:before {
  //     position: absolute;
  //     top: 0;
  //     left: 0;

  //     width: 100%;
  //     height: 100%;

  //     content: '';
  //     transition: opacity 150ms ease-in-out;

  //     opacity: 0;
  //     border-radius: inherit;
  //     background-color: GetVariable('primary');
  //   }

  //   &:hover,
  //   &:active,
  //   &--active {
  //     &:before {
  //       opacity: GetVariable('navigation-active-opacity');
  //     }
  //   }
  // }

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
