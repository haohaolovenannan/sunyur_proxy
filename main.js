const { app,BaseWindow, BrowserWindow, BrowserView,WebContentsView, ipcMain } = require('electron')
const path = require('path')
const { createProxy } = require('./proxy-server')
const projectData = require('./db/project')
const envTable = require('./db/env')
const settingData = require('./db/setting')
const http = require('http');
const net = require('net')

app.requestSingleInstanceLock()
// const userData = app.getPath('userData')
// console.log('userData', `---${userData}----`)
let proxyRules = []
let HeaderList = []
let currentEnv = ''
let listenPort = 8015
const createWindow = () => {
  // 打包使用
  // const win = new BrowserWindow({
  //   width: 1000,
  //   height: 800,
  //   // frame: false,
  //   autoHideMenuBar: true,
    
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'),
  //     nodeIntegration: true
  //   }
  // })
  // win.loadFile('./dist/index.html')

  // 本地开发调试使用
  const win = new BaseWindow({ width: 1000, height: 1000 })
  const view1 = new WebContentsView({
    width: 1000,
    height: 800,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })
  win.contentView.addChildView(view1)
  const isMac = process.platform === 'darwin';  
  const toolbarHeight = isMac ? 22 : 29;  
  view1.webContents.loadURL('http://127.0.0.1:5173/#/')
  view1.setBounds({ x: 0, y: toolbarHeight, width: 1000, height: 800 - toolbarHeight })
}
let proxyServer = ''

// 检查端口状态函数
function usePortCheckStatus(port){
  return new Promise((resolve,reject) => {
    let server = net.createServer().listen(port);
    server.on('listening',function(){
      console.log('success',port);
        server.close();
        resolve(true);
    });
    server.on('error',function(err){
        if(err.code == 'EADDRINUSE'){
          reject(false);
        }
    }); 
  })
}

// TODO: 检测端口是否被占用，如果被占用则给出相应操作
async function createHttpServer() {
  if (proxyServer) {
    proxyServer.close(); // 关闭当前服务器
  }
  try {
    await usePortCheckStatus(listenPort)
    proxyServer = http.createServer(function (req, res) {
      // 设置跨域响应头
      res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的方法
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
      const rule = proxyRules.find(item => {
        return new RegExp(item.rule).test(req.url)
      })
      console.log('###', req.url, rule)
  
      if (rule) {
        rule.proxy.web(req, res, {
          target: rule.target,
          changeOrigin: true,
          autoRewrite: true,
        })
      } else {
        res.end();
      }
    }).listen(listenPort);
    return true
  }catch (err){
    return false
  }
  
  // if(portStatus){
  //     proxyServer = http.createServer(function (req, res) {
  //       // 设置跨域响应头
  //       res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源
  //       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的方法
  //       res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
  //       const rule = proxyRules.find(item => {
  //         return new RegExp(item.rule).test(req.url)
  //       })
  //       console.log('###', req.url, rule)
    
  //       if (rule) {
  //         rule.proxy.web(req, res, {
  //           target: rule.target,
  //           changeOrigin: true,
  //           autoRewrite: true,
  //         })
  //       } else {
  //         res.end();
  //       }
  //     }).listen(listenPort);
  //   return true
  // }else {
  //   return false
  // }
  
} 

async function setProxyTable() {
  const envList = await envTable.getList()
  const itemSetting = envList.find(item => item.id === currentEnv)?.setting
  if (itemSetting) {
    HeaderList = itemSetting.hearderList
    proxyRules = itemSetting.proxyRules.map(item => {
      const proxy = createProxy()
      proxy.on('proxyReq', function (proxyReq, req, res, options) {
        console.log('proxyReq', item.target)
        HeaderList.forEach(row => {
          proxyReq.setHeader(row.name, row.value);
        })
      });
      proxy.on('error', (error) => {
        console.log('error', error)
      })
      return {
        ...item,
        proxy
      }
    })

  } else {
    proxyRules = []
    HeaderList = []
  }
}

async function setSettings(){
  let setting = await settingData.getSettings()
  if(!setting.length){
    await settingData.createSettings()
    setting = await settingData.getSettings()
  }
  listenPort = parseInt(setting[0].port)
  return createHttpServer()
}
app.on('ready', () => {
  // createHttpServer()
  createWindow()
  ipcMain.handle('project.getList', () => {
    return projectData.getList()
  })
  ipcMain.handle('project.getSettings', () => {
    return settingData.getSettings()
  })
  ipcMain.handle('project.addData', (_, data) => {
    return projectData.add(data)
  })
  ipcMain.handle('project.deleteById', (_, projectId) => {
    console.log('icpmain',projectId);
    
    return projectData.deleteById(projectId)
  })
  ipcMain.handle('env.getList', () => {
    return envTable.getList()
  })
  ipcMain.handle('env.deleteById', (_,id) => {
    return envTable.deleteById(id)
  })
  ipcMain.handle('env.deleteAllByProjectId', (_,projectId) => {
    return envTable.deleteAllByProjectId(projectId)
  })
  ipcMain.handle('env.addData', (_, data) => {
    return envTable.add(data)
  })
  ipcMain.handle('env.updateById',async (_, id, data) => {
    await envTable.updateById(id, data)
    await setProxyTable();
    return true
  })
  // 在组件挂载时调用此接口，获取端口设置，并调用createHttpServer函数检测端口状态，
  ipcMain.handle('project.updateProxyPort',async (_,data) => {

    await settingData.updateProxyPort(data)
    // 更新过后重新获取setting并重启http服务
    return await setSettings()
  })  

  ipcMain.handle('proxy.switch', async (_, envId) => {
    currentEnv = envId
    console.log('switch to proxy', envId)
    await setProxyTable();
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
