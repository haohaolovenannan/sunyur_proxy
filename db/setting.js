// eslint-disable-next-line @typescript-eslint/no-var-requires
const FileDb = require('./file-db');

const tableName = 'project_setting_table';
module.exports = {
  updateProxyPort(data) {
    return FileDb.updateProxyPort(tableName, data);
  },

  getSettings() {
    return FileDb.getSettings(tableName);
  },

  createSettings() {
    return FileDb.createSettings(tableName);
  },
};
