const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printReceipt: (receiptData) => ipcRenderer.send('print-receipt', receiptData),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
