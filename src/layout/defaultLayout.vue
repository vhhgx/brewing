<template>
  <div class="default-layout">
    <div class="main">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

let loading = ref(false)
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  width: 100%;
  .main {
    width: 100%;
  }
}
</style>
