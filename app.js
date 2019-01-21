const fs = require('fs');
const electron = require('electron');
const {app, BrowserWindow, ipcMain, dialog} = electron;

let mainWindow;
let createWindow = () => {
    mainWindow = new BrowserWindow({
        minHeight: 600,
        minWidth: 800,
        show: false,
        frame: (process.platform !== 'darwin') ? false : true,
        titleBarStyle: 'hidden',
        webPreferences: {
            webSecurity: false
        }
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.once('ready-to-show', () => mainWindow.show());

     
    mainWindow.webContents.send('is-maximized', mainWindow.isMaximized());
    mainWindow.webContents.openDevTools();
    mainWindow.on('maximize', () => mainWindow.webContents.send('is-maximized', mainWindow.isMaximized()));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('is-maximized', mainWindow.isMaximized()));
};

app.on('ready', createWindow);

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-local', (event, type) => {
    dialog.showOpenDialog({
        title: 'Open Files',
        properties: (type === 'file') ? ['openFile', 'multiSelections'] : ['openDirectory'],
        filters: [{name: 'Video Files', extensions: ['mp4', 'webm', 'ogg', 'mkv']}]
    }, (files) => {
        if(files !== undefined){
            if(type === 'file'){
                mainWindow.webContents.send('playables', files);
            }else{
                let arr = [];
                let dir = fs.readdirSync(files[0]);
                for(let i = 0; i < dir.length; i++){
                    if(dir[i] !== files[0])
                        arr.push(files[0] + '\\' + dir[i]);
                }
                mainWindow.webContents.send('playables', arr);
            }
        }
    });
});

ipcMain.on('minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('maximize', () => {
    if(mainWindow.isMaximized()){
        mainWindow.unmaximize();
    }else{
        mainWindow.maximize();
    }
});

ipcMain.on('exit', () => {
    if(process.platform !== 'darwin') app.quit();
});