<template>
  <a-modal v-model:visible="settingsVisible" unmount-on-close>
    <template #title> 设置 </template>
    <div class="settings">
      <a-form
        ref="settingsFormRef"
        :model="settingsForm"
        :style="{ width: '450px' }"
      >
        <a-form-item label="当前端口：">
          {{ settingsForm.port }}
        </a-form-item>
        <a-form-item
          field="port"
          tooltip=""
          label="端口号："
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
    <template #footer>
      <a-button @click="settingsVisible = false">取消</a-button>
      <a-button
        type="primary"
        :disabled="settingsForm.port.toString() === homeStore.port.toString()"
        @click="emit('handleSettingsOk')"
      >
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts" name="settings">
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import { FormInstance } from '@arco-design/web-vue';
  import useHomeStore from '@/store/modules/home';

  defineOptions({
    name: 'Settings',
  });
  const emit = defineEmits<{
    (e: 'handleSettingsOk'): void;
  }>();
  const settingsFormRef = ref<FormInstance>();
  const homeStore = useHomeStore();
  const settingsForm = ref({
    port: '',
  });

  const stopWatch = watch(
    () => homeStore.port,
    (newVal) => {
      if (newVal !== 0) {
        homeStore.checkPortStatus(newVal.toString());
        stopWatch();
      }
    }
  );

  const disableConfirm = computed(() => {
    return settingsForm.value.port.toString() === homeStore.port.toString();
  });

  const settingsVisible = defineModel<boolean>('visible');

  async function checkData() {
    await settingsFormRef?.value?.validate();
    await homeStore.checkPortStatus(settingsForm.value.port);
    homeStore.updateListenPort(settingsForm.value.port);
    return {
      port: settingsForm.value.port,
    };
  }

  onMounted(async () => {
    await nextTick();
    // 挂载的时候获取当前端口
    await homeStore.getSettings();
    settingsForm.value.port = `${homeStore.port}`;
  });

  defineExpose({
    checkData,
    disableConfirm,
  });
</script>

<style lang="less">
  .settings {
  }
</style>
