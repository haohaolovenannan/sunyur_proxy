<template>
  <div class="home-page">
    <a-menu
      theme="dark"
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="xl"
    >
      <a-sub-menu key="0">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>中海</template>
        <a-menu-item key="0_0">dev</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="1">
        <template #icon><icon-bug></icon-bug></template>
        <template #title>四季金源</template>
        <a-menu-item key="1_0">Menu 1</a-menu-item>
        <a-menu-item key="1_1">Menu 2</a-menu-item>
        <a-menu-item key="1_2">Menu 3</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup lang="ts" name="index">
  // const props = defineProps<{
  // }>();
  // const emit = defineEmits<{
  // }>();
</script>

<style lang="less" scoped>
  .home-page {
    display: flex;
    height: 100vh;
  }
</style>
