<template>
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
  // const emit = defineEmits<{
  // }>();
  async function getAllRules() {
    const strArr = Object.values(rulesObj.value.proxyTable);
    const rulesArr = [];
    for (let i = 0; i < strArr.length; i += 1) {
      let currentRule = '';
      if (strArr[i] === "'") {
        i += 1;
        if (strArr[i] === '/') {
          while (strArr[i] !== "'") {
            currentRule += strArr[i];
            i += 1;
          }
          rulesArr.push(currentRule);
        }
      }
    }
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
