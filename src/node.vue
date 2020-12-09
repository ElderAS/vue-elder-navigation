<template>
  <div v-show="item.show !== false" class="elder__navigation-node">
    <DropdownComponent :trigger="dropdownTrigger" class="elder__navigation-dropdown">
      <template #default>
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
      </template>
      <template v-if="!isResponsive" #dropdown>
        <div class="elder__navigation-dropdown-items">
          <action-component v-for="(item, index) in item.items" :key="index" v-bind="item" @click="$emit('click')" />
        </div>
        <div
          v-show="item.background"
          class="elder__navigation-background"
          :style="{ backgroundImage: 'url(' + item.background + ')' }"
        ></div>
      </template>
    </DropdownComponent>

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
import { DropdownComponent } from 'vue-elder-dropdown'

export default {
  name: 'elder-node-component',
  inject: ['iconList', 'dropdownTrigger'],
  props: {
    item: Object,
  },
  data() {
    return {
      showSubitems: false,
    }
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
  components: {
    ActionComponent,
    Fa,
    DropdownComponent,
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
