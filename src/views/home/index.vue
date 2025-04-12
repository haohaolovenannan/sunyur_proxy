<template>
  <div class="home-page">
    <div class="left-aside">
      <a-menu
        v-model:selected-keys="selectedKeys"
        theme="dark"
        auto-open
        :style="{ width: '180px', height: '100%' }"
        class="project-menu"
        accordion
        @menu-item-click="menuItemClick"
      >
        <a-sub-menu v-for="item in projectList" :key="item.id">
          <template #icon><icon-apps /></template>
          <template #title>{{ item.name }}</template>
          <template v-for="env in envList" :key="env.id">
            <a-menu-item
              v-if="env.projectId === item.id"
              :key="env.id"
              style="position: relative"
              class="env"
            >
              {{ env.name }}
              <a-button
                type="primary"
                status="danger"
                class="env-delete"
                style="position: absolute; right: 0; height: 100%"
                @click="deleteEnv(env)"
              >
                <template #icon
                  ><icon-delete style="margin: auto"></icon-delete
                ></template>
              </a-button>
            </a-menu-item>
          </template>
          <div style="text-align: center">
            <!-- <template #icon><icon-plus></icon-plus></template> -->
            <a-button long type="text" @click="addEnvClick(item)">
              <template #icon><icon-plus></icon-plus></template>
              添加环境
            </a-button>
            <a-button
              status="danger"
              long
              type="text"
              @click="deleteProject(item)"
            >
              <template #icon><icon-delete></icon-delete></template>
              删除项目
            </a-button>
          </div>
        </a-sub-menu>
        <div class="add-project-btn" style="text-align: center">
          <a-button size="large" long type="text" @click="addProjectClick">
            <template #icon><icon-plus></icon-plus></template>
            添加项目
          </a-button>
          <a-button
            size="large"
            long
            type="text"
            @click="settingsVisible = true"
          >
            <template #icon><icon-settings /></template>
            设置
          </a-button>
        </div>
      </a-menu>
    </div>

    <div class="right-panel">
      <div class="home-page-bar">
        <span class="logo">Sunyur Proxy</span>
        <span>当前端口：{{ homeStore.port }}</span>
        <span
          >端口状态：
          <a-tag v-if="homeStore.status" color="green">
            正常
            <template #icon>
              <icon-check-circle-fill />
            </template>
          </a-tag>
          <a-tag v-else color="red">
            异常
            <template #icon>
              <icon-close-circle-fill />
            </template>
          </a-tag>
        </span>
      </div>
      <div class="proxy-setting">
        <a-form
          v-if="itemProxy"
          ref="formRef"
          auto-label-width
          :model="itemProxyValue"
        >
          <a-space direction="vertical" fill>
            <a-card class="general-card" title="当前环境" style="">
              <h4
                >{{ projectObj?.name }}-{{
                  itemEnv?.name
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用代理工具时，请在项目中的配置文件中将target设置为：<a-link
                  >http://127.0.0.1:{{ homeStore.port }}/</a-link
                ></h4
              >
            </a-card>

            <a-card class="general-card" title="域名配置">
              <template #extra>
                <a-button type="primary" @click="addDomain">添加域名</a-button>
              </template>
              <a-space direction="vertical">
                <div
                  v-for="(item, index) in itemProxyValue.domainList"
                  :key="index"
                  class="proxy-rule-item"
                >
                  <a-space>
                    <a-input
                      v-model="itemProxyValue.domainList[index]"
                      style="width: 420px"
                      placeholder="请输入域名，例如：http://test.com/"
                    >
                    </a-input>
                    <a-button
                      status="danger"
                      @click="() => itemProxyValue.domainList.splice(index, 1)"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                    </a-button>
                  </a-space>
                </div>
              </a-space>
            </a-card>
            <a-card class="general-card" title="代理规则">
              <template #extra>
                <a-space>
                  <a-button type="primary" @click="addProxyRule"
                    >添加规则</a-button
                  >
                  <a-button type="primary" @click="transferRulrsVisible = true"
                    >快捷添加</a-button
                  >
                </a-space>
              </template>
              <div
                v-for="(item, index) in itemProxyValue.proxyRules"
                :key="index"
                class="proxy-rule-item"
              >
                <a-space fill>
                  <a-form-item label="规则">
                    <a-input
                      v-model="item.rule"
                      v-insertRule
                      placeholder="代理规则，例如：/test"
                    ></a-input>
                  </a-form-item>
                  <a-form-item label="地址">
                    <a-select
                      v-model="item.target"
                      :style="{ width: '320px' }"
                      placeholder="选择或输入"
                      allow-create
                    >
                      <a-option
                        v-for="option in itemProxyValue.domainList"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </a-option>
                    </a-select>
                    <a-button
                      style="margin-left: 10px"
                      status="danger"
                      @click="() => itemProxyValue.proxyRules.splice(index, 1)"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                    </a-button>
                  </a-form-item>
                </a-space>
              </div>
            </a-card>

            <a-card class="general-card" title="自定义HEAED">
              <template #extra>
                <a-button type="primary" @click="addHeader">添加参数</a-button>
              </template>
              <a-table
                :row-selection="rowSelection"
                :columns="TableColumns"
                :data="itemProxyValue.hearderList"
              >
                <template #Key="{ rowIndex }">
                  <a-input
                    v-model="itemProxyValue.hearderList[rowIndex].name"
                  ></a-input>
                </template>
                <template #Value="{ rowIndex }">
                  <a-input
                    v-model="itemProxyValue.hearderList[rowIndex].value"
                  ></a-input>
                </template>
                <template #desc="{ rowIndex }">
                  <a-input
                    v-model="itemProxyValue.hearderList[rowIndex].desc"
                  ></a-input>
                </template>
                <template #actions="{ rowIndex }">
                  <a-button
                    @click="
                      () => itemProxyValue.hearderList.splice(rowIndex, 1)
                    "
                  >
                    删除
                  </a-button>
                </template>
              </a-table>
            </a-card>
            <a-card>
              <a-space fill direction="vertical" align="center">
                <a-button type="primary" @click="save">保存</a-button>
              </a-space>
            </a-card>
          </a-space>
        </a-form>
        <a-empty v-else> 请先选择要代理的环境 </a-empty>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="addProjectVisible">
    <template #title> 添加项目 </template>
    <div>
      <a-input ref="inputEnvName" v-model="addProjectName"></a-input>
    </div>
    <template #footer>
      <a-space size="small">
        <a-button>取消</a-button>
        <a-button type="primary" @click="handleAddProjectOk">确认</a-button>
      </a-space>
    </template>
  </a-modal>
  <a-modal v-model:visible="addEnvVisible">
    <template #title> 添加环境 </template>
    <div>
      <a-input ref="inputEnvName" v-model="addEnvName"></a-input>
    </div>
    <template #footer>
      <a-space size="small">
        <a-button @click="addEnvVisible = false">取消</a-button>
        <a-button type="primary" @click="handleAddEnvtOk">确认</a-button>
      </a-space>
    </template>
  </a-modal>
  <a-modal v-model:visible="deleteEnvVisible">
    <template #title> 删除环境 </template>
    <div>此删除操作不可逆，确定删除此环境吗？</div>
    <template #footer>
      <a-space size="small">
        <a-button @click="deleteEnvVisible = false">取消</a-button>
        <a-button type="primary" @click="handleDeleteEnvOk(deleteEnvData)"
          >确认删除</a-button
        >
      </a-space>
    </template>
  </a-modal>

  <!-- 优化添加规则，使用正则匹配 -->
  <a-modal v-model:visible="transferRulrsVisible">
    <template #title> 快捷添加规则 </template>
    <transferRules ref="transferRulesRef"></transferRules>
    <template #footer>
      <a-space size="small">
        <a-button @click="transferRulrsVisible = false"> 取消 </a-button>
        <a-button type="primary" @click="handleAddRulesOk()">
          添加规则
        </a-button>
      </a-space>
    </template>
  </a-modal>

  <!-- 代理设置 -->
  <settingsSet
    ref="settingsSetRef"
    v-model:visible="settingsVisible"
    @handle-settings-ok="handleSettingsOk"
  ></settingsSet>
</template>

<script setup lang="ts" name="index">
  import {
    getProjectList,
    getEnvList,
    deleteProjectById,
    deleteEnvById,
    deleteEnvByProjectId,
    IProxy,
    updateEnvById,
    IEnv,
    addProject,
    addEnv,
  } from '@/api/ipc';
  import {
    FormInstance,
    Message,
    TableColumnData,
    TableRowSelection,
    Modal,
  } from '@arco-design/web-vue';
  import { watch, computed, onMounted, reactive, ref, nextTick } from 'vue';
  import useHomeStore from '@/store/modules/home';
  import transferRules from './components/transfer-rules.vue';
  import settingsSet from './components/settings-set.vue';
  import ColumnsConstant from './constant';

  const homeStore = useHomeStore();

  const addProjectVisible = ref(false);
  const addEnvVisible = ref(false);
  const deleteEnvVisible = ref(false);
  const transferRulrsVisible = ref(false);
  const settingsVisible = ref(false);

  const TableColumns: TableColumnData[] = ColumnsConstant.TableColumnData;

  const transferRulesRef = ref();
  const settingsSetRef = ref();

  const selectedKeys = ref([]);
  const addProjectName = ref('');
  const deleteEnvData = ref();
  const addEnvName = ref('');
  const inputEnvName = ref();
  const projectList = ref<
    Array<{
      name: string;
      id: string;
    }>
  >([]);
  const envList = ref<
    Array<{
      id: string;
      projectId: string;
      name: string;
      setting: IProxy;
    }>
  >([]);

  const itemProxyValue = ref<IProxy>({
    domainList: [],
    proxyRules: [],
    hearderList: [],
  });
  function addProxyRule() {
    itemProxyValue.value.proxyRules.push({
      rule: '',
      target: '',
    });
  }

  async function handleAddRulesOk() {
    const rulesArr = await transferRulesRef?.value?.getAllRules();
    if (rulesArr.length) {
      rulesArr.forEach((ruleParm: string) => {
        itemProxyValue.value.proxyRules.push({
          rule: ruleParm,
          target: itemProxyValue.value.domainList.length
            ? itemProxyValue.value.domainList[0]
            : '',
        });
      });
      transferRulrsVisible.value = false;
      transferRulesRef?.value?.resetForm();
    } else {
      Message.warning('请按照提示内容输入正确的代理规则');
      transferRulesRef?.value?.resetForm();
    }
  }

  function addDomain() {
    itemProxyValue.value.domainList.push('');
  }

  function addHeader() {
    itemProxyValue.value.hearderList.push({
      name: '',
      value: '',
      desc: '',
    });
  }

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });
  const itemProxyKey = ref('');
  function menuItemClick(key: string) {
    itemProxyKey.value = key;
    window.API.switchProxy(key);
  }
  const itemEnv = computed<IEnv | undefined>(() => {
    return envList.value.find((item) => item.id === itemProxyKey.value);
  });
  const projectObj = computed(() => {
    const envObj = envList.value.find(
      (env) => env.id === selectedKeys.value[0]
    );
    return projectList.value.find(
      (project) => project.id === envObj?.projectId
    );
  });
  const itemProxy = computed<undefined | IProxy>(() => {
    return itemEnv.value?.setting;
  });

  async function init() {
    projectList.value = await getProjectList();
    envList.value = await getEnvList();
  }

  watch(itemProxy, (val) => {
    try {
      itemProxyValue.value = JSON.parse(JSON.stringify(val));
    } catch (error) {
      itemProxyValue.value = {
        domainList: [],
        proxyRules: [],
        hearderList: [],
      };
    }
  });
  const formRef = ref<FormInstance>();
  function save() {
    formRef.value?.validate(async (error) => {
      if (!error) {
        await updateEnvById(itemEnv.value!.id, {
          ...itemEnv.value!,
          setting: itemProxyValue.value!,
        });
        envList.value = await getEnvList();
        Message.success('保存成功');
      }
    });
  }
  const itemProjectData = ref<any>();
  const envName = ref('');

  async function addEnvClick(itemProject: any) {
    itemProjectData.value = itemProject;
    envName.value = '';
    addEnvVisible.value = true;
    await nextTick();
    inputEnvName.value.focus();
  }
  // 删除环境按钮
  async function deleteEnv(row: any) {
    deleteEnvVisible.value = true;
    deleteEnvData.value = row;
  }
  // 删除项目
  async function deleteProject(row: any) {
    // row为project
    Modal.warning({
      title: '温馨提示',
      content: `此操作不可逆，确认删除此项目吗？`,
      okText: '确认删除',
      hideCancel: false,
      cancelText: '取消',
      async onOk() {
        const { id: projectId } = row;
        await deleteEnvByProjectId(projectId);
        await deleteProjectById(projectId);
        Message.success('删除项目成功');
        projectList.value = await getProjectList();
      },
    });
  }
  async function addProjectClick() {
    addProjectName.value = '';
    addProjectVisible.value = true;
    await nextTick();
    inputEnvName.value.focus();
  }
  async function handleAddProjectOk() {
    //
    if (!addProjectName.value) {
      //
      Message.error('项目名称不能为空');
    } else if (
      projectList.value.some((item) => item.name === addProjectName.value)
    ) {
      Message.error(`${addProjectName.value}已存在`);
    } else {
      await addProject(addProjectName.value);
      addProjectVisible.value = false;
      init();
    }
  }
  async function handleAddEnvtOk() {
    if (!addEnvName.value) {
      Message.error('环境名不能为空');
    } else if (
      // projectList.value.some((item) => item.name === itemProjectData.value?.id)
      envList.value.some((item) => {
        return (
          item.projectId === itemProjectData.value?.id &&
          item.name === addEnvName.value
        );
      })
    ) {
      Message.error(`“${addEnvName.value}”名称重复`);
    } else {
      await addEnv(itemProjectData.value!.id, addEnvName.value);
      addEnvVisible.value = false;
      addEnvName.value = '';
      init();
    }
  }
  async function handleDeleteEnvOk(row: any) {
    await deleteEnvById(row.id);
    Message.success('删除环境成功');
    deleteEnvVisible.value = false;
    envList.value = await getEnvList();
  }

  async function handleSettingsOk() {
    const res = await settingsSetRef.value.checkData();
    if (res.port) {
      Message.success(`修改端口号成功，请在项目中将target设置为${res.port}`);
      settingsVisible.value = false;
    }
  }

  onMounted(async () => {
    init();
    homeStore.getSettings();
  });
</script>

<style lang="less">
  .home-page {
    ::-webkit-scrollbar {
      width: 2px; /* 垂直滚动条 */
      height: 2px; /* 水平滚动条 */
    }
    display: flex;
    height: 100vh;
    background-color: var(--color-fill-2);
    .project-menu {
      .env {
        .env-delete {
          visibility: hidden;
        }
        &:hover .env-delete {
          visibility: visible;
        }
      }
      /* 滚动条的轨道（背景） */
      // padding-bottom: 40%;
      margin-bottom: 20px;
      .arco-menu-inner {
        display: flex;
        flex-direction: column;
      }
    }
    .add-project-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: end;
    }

    .home-page-bar {
      height: 55px;
      display: flex;
      align-items: center;
      background-color: #fff;
      padding: 0 20px;
      justify-content: space-between;
      .logo {
        font-size: 22px;
        font-weight: 600;
      }
    }
    .right-panel {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .proxy-setting {
      flex: 1;
      padding-top: 0;
      padding: 20px;
      overflow-y: auto;
    }
  }
</style>
