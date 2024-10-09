const httpProxy = require('http-proxy');

const createProxy = (HeaderList = [])=>{
  var proxy = httpProxy.createProxyServer({})
  
  proxy.on('error', function(e) {
    console.log('error', e);
  });
  return proxy
}

//导出方式一：
module.exports = {
  createProxy,
};