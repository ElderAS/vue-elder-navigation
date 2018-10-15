<template>
  <button @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    to: Function,
  },
  methods: {
    onClick() {
      if (this.to) this.to()
    },
  },
}
</script>
