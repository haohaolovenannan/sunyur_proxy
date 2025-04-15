import {
  getSettings,
  Setting,
  updateProxyPort,
  checkPort,
  createServer,
} from '@/api/ipc';
import { Message } from '@arco-design/web-vue';
import { parseInt } from 'lodash';
import { defineStore } from 'pinia';

const useHomeStore = defineStore('home', {
  state: () => {
    return {
      port: 0, // 端口
      status: true, // 端口状态
    };
  },
  actions: {
    async updateListenPort(listenPort: string) {
      await updateProxyPort({ port: listenPort });
      this.port = parseInt(listenPort);
      return true;
    },

    // 创建http服务
    async createHttpServer(listenPort: string) {
      await createServer(parseInt(listenPort));
    },

    // 检查端口状态
    checkPortStatus(listenPort: string) {
      return new Promise((resolve, reject) => {
        checkPort(parseInt(listenPort))
          .then((res: boolean) => {
            this.status = res;
            resolve(true);
          })
          .catch((err: any) => {
            // 端口被占用
            Message.error('当前端口被占用，请前往设置更换端口');
            this.status = false;
            reject(err);
          });
      });
    },

    async getSettings() {
      const res = await getSettings();
      res.forEach((set: Setting) => {
        this.port = parseInt(set.port);
      });
    },
  },
});

export default useHomeStore;
