<template>
  <a-modal v-model:visible="transferRulrsVisible">
    <template #title> 快捷添加规则 </template>
    <div class="transfer-rules">
      <a-textarea
        v-model="rulesObj.proxyTable"
        placeholder="请将项目中的proxyTable对象粘贴到此处，格式为
  {
    '/workFlow': {
      target: target,
      changeOrigin: true
    },
  },
  ..."
        style="margin-top: 20px"
        :auto-size="{
          minRows: 10,
          maxRows: 500,
        }"
      />
    </div>
    <template #footer>
      <a-space size="small">
        <a-button @click="transferRulrsVisible = false"> 取消 </a-button>
        <a-button type="primary" @click="emit('handleAddRulesOk')">
          添加规则
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  defineOptions({
    name: 'TransferRules',
  });
  const rulesObj = ref({
    proxyTable: '',
  });
  // const props = defineProps<{
  // }>();
  const emit = defineEmits<{
    (e: 'handleAddRulesOk'): void;
  }>();
  const transferRulrsVisible = defineModel<boolean>('visible');
  async function getAllRules() {
    // 定义匹配模式规则
    const rulesRegex = /'(\/[a-zA-Z]+(\/[a-zA-Z]+)*)'/g;
    const rulesArr = `${rulesObj.value.proxyTable}`
      .match(rulesRegex)
      ?.map((item) => {
        return item.slice(1, item.length - 1);
      });
    return rulesArr;
  }

  function resetForm() {
    rulesObj.value.proxyTable = '';
  }

  defineExpose({
    getAllRules,
    resetForm,
  });
</script>

<style lang="less">
  .transfer-rules {
    height: 50vh;
    .a-textarea {
      overflow-y: scroll;
    }
  }
</style>
