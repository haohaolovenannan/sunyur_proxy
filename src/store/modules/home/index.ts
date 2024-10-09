import { getSettings, Setting, updateProxyPort } from '@/api/ipc';
import { parseInt } from 'lodash';
import { defineStore } from 'pinia';

const useHomeStore = defineStore('home', {
  state: () => {
    return {
      port: 8015,
    };
  },
  actions: {
    async updateListenPort(listenPort: string) {
      await updateProxyPort({ port: listenPort });
      this.port = parseInt(listenPort);
      return true;
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
