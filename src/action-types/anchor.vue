<template>
  <a :href="to">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    to: Object,
  },
}
</script>
