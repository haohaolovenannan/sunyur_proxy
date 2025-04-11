const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  project: {
    getList: () => ipcRenderer.invoke('project.getList'),
    addData: (data) => ipcRenderer.invoke('project.addData', data),
    deleteById: (projectId) => ipcRenderer.invoke('project.deleteById',projectId),
    updateProxyPort: (data) => ipcRenderer.invoke('project.updateProxyPort',data),
    getSettings:() => ipcRenderer.invoke('project.getSettings'),
    checkPort: (port) => ipcRenderer.invoke('project.checkPortStatus',port),
  },
  env: {
    getList: () => ipcRenderer.invoke('env.getList'),
    deleteById: (id) => ipcRenderer.invoke('env.deleteById',id),
    updateById: (id, data) => ipcRenderer.invoke('env.updateById', id, JSON.parse(data)),
    addData: (data)=> ipcRenderer.invoke('env.addData', data),
    deleteAllByProjectId: (projectId) => ipcRenderer.invoke('env.deleteAllByProjectId',projectId),
  },
  // proxy: {
  //   getList: () => ipcRenderer.invoke('proxy.getList'),
  //   save: () => ipcRenderer.invoke('proxy.save'),
  // },
  switchProxy: (id) => ipcRenderer.invoke('proxy.switch', id)
  // 除函数之外，我们也可以暴露变量
})