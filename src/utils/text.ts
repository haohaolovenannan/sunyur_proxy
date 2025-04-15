export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // 首先检查是否支持 Clipboard API
    if (navigator.clipboard) {
      // 使用 Clipboard API（现代浏览器）
      navigator.clipboard
        .writeText(text)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject();
        });
    } else {
      // 如果不支持 Clipboard API，回退到 document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          resolve(true);
        } else {
          reject();
        }
      } catch (err) {
        reject();
      } finally {
        document.body.removeChild(textArea);
      }
    }
  });
}

export function copy() {}
