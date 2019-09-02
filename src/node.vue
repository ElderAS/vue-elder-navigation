<template>
  <div class="elder__navigation-node">
    <div class="elder__navigation-node-wrapper">
      <action-component :item="item" v-tippy="dropdown" @click="$emit('click')">
        <slot></slot>
      </action-component>
      <fa
        v-show="type === 'dropdown' && isResponsive"
        class="elder__navigation-node-subitems-trigger"
        @click.stop="showSubitems = !showSubitems"
        :icon="showSubitems ? ['fas','angle-up'] : ['fas','angle-down']"
      ></fa>
    </div>

    <div v-show="type === 'dropdown' && isResponsive && showSubitems" class="elder__navigation-node-children">
        <action-component
          v-for="(item, index) in item.items"
          :key="'children_' + index"
          :item="item"
          @click="$emit('click')"
        />
    </div>

    <div v-if="type === 'dropdown'" class="elder__navigation-dropdown-wrapper">
      <div ref="dropdown" class="elder__navigation-dropdown">
        <div class="elder__navigation-dropdown-items">
          <action-component
            v-for="(item, index) in item.items"
            :key="index"
            :item="item"
            @click="$emit('click')"
          />
        </div>
        <div
          v-if="item.background"
          class="elder__navigation-background"
          :style="{ backgroundImage: 'url(' + item.background + ')'}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionComponent from './action'
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome'
import Tippy from './tippy'
export default {
  name: 'elder-node-component',
  props: {
    item: Object,
  },
  data() {
    return {
      id: 'test',
      dropdown: null,
      showSubitems: false,
    }
  },
  watch: {
    isResponsive() {
      this.setDropdown()
    },
    item: {
      handler() {
        this.setDropdown()
      },
      immediate: true,
    },
  },
  computed: {
    type() {
      if (this.item.items && this.item.items.length) return 'dropdown'
      if (!this.item.action) return null
      return typeof this.item.action
    },
    isResponsive() {
      return this.$parent.isResponsive
    },
  },
  methods: {
    setDropdown() {
      if (!this.item.items || !this.item.items.length) return null
      this.$nextTick(() => {
        this.dropdown = Object.assign(
          {
            disabled: this.isResponsive,
            html: this.$refs.dropdown,
            theme: 'elder-navigation-light',
            interactive: true,
            arrow: true,
            arrowType: 'round',
            duration: 150,
            distance: 15,
          },
          this.item.dropdownOptions,
        )
      })
    },
  },
  components: {
    ActionComponent,
    Fa,
  },
  directives: {
    Tippy: Tippy(),
  },
}
</script>

<style lang="scss">
@import '~node_modules/vue-elder-defaults/styles/variables';

.elder__navigation {
  &-background {
    width: 200px;
    margin-left: 10px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: $border-radius;

    .elder__navigation--responsive & {
      display: none;
    }
  }
  &-dropdown-wrapper {
    display: none;

    .elder__navigation--responsive & {
      display: block;
    }
  }
  &-dropdown {
    display: flex;
    min-width: 150px;

    &-items {
      flex-grow: 1;
    }
  }

  &-node {
    &-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-subitems-trigger {
      padding: 5px;
    }

    &-children {
      font-size: 0.75em;
      padding-left: 2rem;

      .elder__navigation-component {
        font-weight: normal;
      }
    }
  }
}

.tippy-tooltip {
  &.elder-navigation-light-theme {
    background-color: white;
    padding: 10px;
    box-shadow: 0 -5px 25px -5px rgba(0, 0, 0, 0.2);
    font: inherit;

    .tippy-backdrop {
      background-color: white;
    }
    .tippy-content {
      font: inherit;
    }
    .tippy-roundarrow {
      fill: white;
    }
  }
}
</style>

