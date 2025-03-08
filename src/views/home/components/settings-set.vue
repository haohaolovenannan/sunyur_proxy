<template>
  <div class="settings">
    <a-form
      ref="settingsFormRef"
      :model="settingsForm"
      :style="{ width: '400px' }"
    >
      <a-form-item
        field="port"
        tooltip=""
        label="端口号"
        :rules="[
          { required: true, message: '端口号为必须参数' },
          { maxLength: 5, message: '长度最长为5' },
          { min: 0, max: 65535 },
        ]"
      >
        <a-input
          v-model="settingsForm.port"
          placeholder="请输入监听端口号，范围（0 ~ 65535）"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts" name="settings">
  import { nextTick, onMounted, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue';
  import useHomeStore from '@/store/modules/home';

  defineOptions({
    name: 'Settings',
  });
  // const props = defineProps<{
  // }>();
  // const emit = defineEmits<{
  // }>();
  const settingsFormRef = ref<FormInstance>();
  const homeStore = useHomeStore();
  const settingsForm = ref({
    port: `${homeStore.port}`,
  });

  homeStore.$subscribe((mutation, state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    settingsForm.value.port = state.port.toString();
  });

  async function checkData() {
    const res = await settingsFormRef?.value?.validate(async (error) => {
      if (!error) {
        homeStore.updateListenPort(settingsForm.value.port);
      }
    });
    return {
      res: !res,
      port: settingsForm.value.port,
    };
  }

  onMounted(async () => {
    await nextTick();
    await homeStore.getSettings();
    const status = await homeStore.updateListenPort(homeStore.port);
    alert(status);
  });

  defineExpose({
    checkData,
  });
</script>

<style lang="less">
  .settings {
  }
</style>
