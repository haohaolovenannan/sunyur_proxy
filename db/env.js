// eslint-disable-next-line @typescript-eslint/no-var-requires
const FileDb = require('./file-db');

const tableName = 'project_env_table';
module.exports = {
  getList() {
    return FileDb.findData(tableName);
  },
  add(data = {}) {
    return FileDb.createData(tableName, data);
  },
  // 单独删除环境
  deleteById(id) {
    return FileDb.delDataById(tableName, id, 'env');
  },
  // 删除当前项目下的所有环境
  deleteAllByProjectId(projectId) {
    return FileDb.delDataById(tableName, projectId, 'project');
  },
  updateById(id, data) {
    return FileDb.updateById(tableName, id, data);
  },
};
