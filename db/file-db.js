// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app } = require('electron');

app.requestSingleInstanceLock();

const userData = app.getPath('userData');
function generateUUID(length = 8) {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let count = 0;
  while (count < length) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
    count += 1;
  }
  return result;
}

// const fileName = 'project_table.json';
const directoryPath = `${userData}/DB/`;

console.log(directoryPath);

fs.mkdirSync(directoryPath, { recursive: true }); // 创建目录（如果不存在）

const findData = async (fileName) => {
  fileName = `${directoryPath + fileName}.json`;
  return new Promise((resolve) => {
    // 检查文件是否存在
    if (!fs.existsSync(fileName)) {
      // 文件不存在，创建文件
      fs.writeFileSync(fileName, '');
    }

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        // 如果文件不存在，创建一个新文件
        fs.writeFile(fileName, '[]', (error) => {
          if (error) throw err;
          resolve([]);
        });
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve([]);
        }
      }
    });
  });
};

const updateData = async (fileName, data = []) => {
  fileName = `${directoryPath + fileName}.json`;
  return new Promise((resolve) => {
    fs.writeFile(`${fileName}`, JSON.stringify(data), (err) => {
      resolve(!!err);
    });
  });
};

const createData = async (fileName, data = {}) => {
  return new Promise((resolve) => {
    findData(fileName).then((list) => {
      const newData = [...list, { ...data, id: generateUUID() }];
      updateData(fileName, newData).then(resolve);
    });
  });
};

// 环境删除
const delDataById = async (fileName, id, deleteType) => {
  switch (deleteType) {
    case 'env':
      return new Promise((resolve) => {
        findData(fileName).then((list) => {
          const index = list.findIndex((i) => i.id === id);
          list.splice(index, 1);
          updateData(fileName, list).then(resolve);
        });
      });
    case 'project':
      return new Promise((resolve) => {
        findData(fileName).then((list) => {
          list = list.filter((i) => i.projectId !== id);
          updateData(fileName, list).then(resolve);
        });
      });
    default:
      break;
  }
};

// 项目删除
const delData = async (fileName, id) => {
  return new Promise((resolve) => {
    findData(fileName).then((list) => {
      const index = list.findIndex((i) => i.id === id);
      list.splice(index, 1);
      updateData(fileName, list).then(resolve);
    });
  });
};

const updateById = async (fileName, id, data) => {
  return new Promise((resolve) => {
    findData(fileName).then((list) => {
      const index = list.findIndex((i) => i.id === id);
      list.splice(index, 1, {
        ...list[index],
        ...data,
      });
      updateData(fileName, list).then(resolve);
    });
  });
};

module.exports = {
  findData,
  createData,
  delDataById, // 环境删除
  delData, // 项目删除
  updateById,
};
