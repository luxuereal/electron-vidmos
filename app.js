const electron = require('electron');
const {app, BrowserWindow} = electron;

let mainWindow;
let createWindow = () => {
    mainWindow = new BrowserWindow({
        show: false,
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.once('ready-to-show', () => mainWindow.show());
};


app.on('ready', createWindow);

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});