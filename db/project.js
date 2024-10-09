// eslint-disable-next-line @typescript-eslint/no-var-requires
const FileDb = require('./file-db');

const tableName = 'project_table';
module.exports = {
  getList() {
    return FileDb.findData(tableName);
  },
  add(data = {}) {
    return FileDb.createData(tableName, data);
  },
  deleteById(id) {
    return FileDb.delData(tableName, id);
  },
  updateById(id, data) {
    return FileDb.updateById(tableName, id, data);
  },
};
