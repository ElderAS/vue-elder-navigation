<template>
  <div v-show="item.show !== false" class="elder__navigation-node">
    <div class="elder__navigation-node-wrapper" @mouseover="onMouseover" @mouseleave="onMouseleave">
      <action-component ref="target" v-bind="item" @click="$emit('click')">
        <slot></slot>
      </action-component>
      <div
        class="elder__navigation-node-subitems-trigger"
        v-show="hasSubitems && isResponsive"
        @click.stop="showSubitems = !showSubitems"
      >
        <fa v-bind="showSubitems ? iconList.collapse : iconList.expand"></fa>
      </div>

      <div v-show="instance && hasSubitems && showSubitems" ref="dropdown" class="elder__navigation-dropdown-wrapper">
        <div class="elder__navigation-dropdown">
          <div class="elder__navigation-dropdown-items">
            <action-component v-for="(item, index) in item.items" :key="index" v-bind="item" @click="$emit('click')" />
          </div>
          <div
            v-show="item.background"
            class="elder__navigation-background"
            :style="{ backgroundImage: 'url(' + item.background + ')' }"
          ></div>
        </div>
      </div>
    </div>

    <div v-show="hasSubitems && isResponsive && showSubitems" class="elder__navigation-node-children">
      <action-component
        v-for="(item, index) in item.items"
        :key="'children_' + index"
        v-bind="item"
        @click="$emit('click')"
      />
    </div>
  </div>
</template>

<script>
import ActionComponent from './action'
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import { createPopper } from '@popperjs/core'

export default {
  name: 'elder-node-component',
  inject: ['iconList'],
  props: {
    item: Object,
  },
  data() {
    return {
      instance: null,
      showSubitems: false,
    }
  },
  watch: {
    isResponsive(val) {
      return val ? this.destroyDropdown() : this.initDropdown()
    },
    showSubitems(val) {
      if (val && this.instance) this.instance.update()
    },
  },
  computed: {
    type() {
      if (this.hasSubitems) return 'dropdown'
      if (!this.item.action) return null
      return typeof this.item.action
    },
    isResponsive() {
      return this.$parent.isResponsive
    },
    hasSubitems() {
      return this.item.items && this.item.items.length
    },
  },
  methods: {
    onMouseover() {
      if (this.isResponsive) return
      this.showSubitems = true
    },
    onMouseleave() {
      if (this.isResponsive) return
      this.showSubitems = false
    },
    initDropdown() {
      if (this.instance || !this.$refs.dropdown || !this.$refs.target) return

      this.$nextTick(() => {
        this.instance = createPopper(this.$refs.target.$el, this.$refs.dropdown, {
          placement: 'bottom-end',
        })
      })
    },
    destroyDropdown() {
      if (!this.instance) return
      this.instance.destroy()
      this.instance = null
    },
  },
  mounted() {
    this.initDropdown()
  },
  beforeDestroy: function () {
    this.destroyDropdown()
  },
  components: {
    ActionComponent,
    Fa,
  },
}
</script>

<style lang="scss">
@import './main';

.elder__navigation {
  &-background {
    width: 200px;
    margin-left: 10px;

    border-radius: GetVariable('border-radius');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    .elder__navigation--responsive & {
      display: none;
    }
  }

  &-dropdown {
    display: flex;

    min-width: 200px;

    background-color: white;
    box-shadow: 0 5px 25px -5px rgba(black, 0.15);

    &-wrapper {
      padding-top: 8px;
      z-index: 2;
    }

    &-items {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }

  &-node {
    &-subitems-trigger {
      display: flex;
      align-items: center;
      justify-content: center;

      padding: 10px;
    }

    &-wrapper {
      display: flex;
    }

    &-children {
      font-size: 0.8em;

      padding-left: 1rem;

      .elder__navigation-component {
        font-weight: normal;
      }
    }
  }
}
</style>
