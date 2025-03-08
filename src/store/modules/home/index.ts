import { getSettings, Setting, updateProxyPort } from '@/api/ipc';
import { parseInt } from 'lodash';
import { defineStore } from 'pinia';

const useHomeStore = defineStore('home', {
  state: () => {
    return {
      port: 8015,
      status: false,
    };
  },
  actions: {
    async updateListenPort(listenPort: string) {
      const updateResult = await updateProxyPort({ port: listenPort });
      this.port = parseInt(listenPort);
      return updateResult;
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
