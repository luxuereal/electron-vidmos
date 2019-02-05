const fs = require('fs');
const path = require('path');
const electron = require('electron');
const {app, BrowserWindow, ipcMain, dialog, globalShortcut} = electron;

let mainWindow;
let isDialogOpened = false;

let createWindow = () => {
    mainWindow = new BrowserWindow({
        minHeight: 600,
        minWidth: 800,
        show: false,
        icon: path.resolve(__dirname, './app.icon.png'),
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
    mainWindow.on('maximize', () => mainWindow.webContents.send('is-maximized', mainWindow.isMaximized()));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('is-maximized', mainWindow.isMaximized()));
    mainWindow.on('focus', () => {
        globalShortcut.register('CommandOrControl+O', () => openFiles(null, 'file'));
        globalShortcut.register('CommandOrControl+Shift+O', () => openFiles(null, 'dir'));
        globalShortcut.register('Alt+Left', () => mainWindow.webContents.send('prevVideo'));
        globalShortcut.register('Alt+Right', () => mainWindow.webContents.send('nextVideo'));
        globalShortcut.register('F11', () => mainWindow.webContents.send('toggleFullScreen'));
        globalShortcut.register('Space', () => mainWindow.webContents.send('playPauseVideo'));
        globalShortcut.register('CommandOrControl+S', () => mainWindow.webContents.send('stopVideo'));
        globalShortcut.register('CommandOrControl+Up', () => mainWindow.webContents.send('volumeUp'));
        globalShortcut.register('CommandOrControl+M', () => mainWindow.webContents.send('toggleMute'));
        globalShortcut.register('CommandOrControl+Down', () => mainWindow.webContents.send('volumeDn'));
        globalShortcut.register('CommandOrControl+Left', () => mainWindow.webContents.send('seekBack'));
        globalShortcut.register('CommandOrControl+Right', () => mainWindow.webContents.send('seekNext'));
        globalShortcut.register('CommandOrControl+Shift+I', () => mainWindow.webContents.toggleDevTools());
    });
    processHandler();
    mainWindow.on('blur', () => globalShortcut.unregisterAll());  
};

let processHandler = () => {
    let ext;
    let arr = [];
    for (let i = 0; i < process.argv.length; i++) {
        ext = process.argv[i].split('.').pop();
        if(ext === 'mp4' || ext === 'webm' || ext === 'ogg' || ext === 'mkv'){
            arr.push(process.argv[i]);
        }
    }  
    mainWindow.webContents.send('playables', arr);
    console.log(arr);
};

let openFiles = (event, type) => {
    if(!isDialogOpened){
        isDialogOpened = true;
        dialog.showOpenDialog({
            title: (type === 'file') ? 'Open File(s)' : 'Open Directory',
            properties: (type === 'file') ? ['openFile', 'multiSelections'] : ['openDirectory'],
            filters: [{ name: 'Video Files', extensions: ['mp4', 'webm', 'ogg', 'mkv'] }]
        }, (files) => {
            if (files !== undefined) {
                if (type === 'file') {
                    mainWindow.webContents.send('playables', files);
                } else {
                    let fileExt;
                    let arr = [];
                    let dir = fs.readdirSync(files[0]);
                    for (let i = 0; i < dir.length; i++) {
                        fileExt = dir[i].split('.').pop();
                        if (dir[i] !== files[0] && (fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'ogg' || fileExt === 'mkv'))
                            arr.push(files[0] + '\\' + dir[i]);
                    }
                    mainWindow.webContents.send('playables', arr);
                }
            }
            isDialogOpened = false;
       });
    }
};

app.on('ready', createWindow);

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

ipcMain.on('open-local', (event, type) => openFiles(event, type));

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

ipcMain.on('enter-full-screen', (event, bool) => mainWindow.setFullScreen(bool));

ipcMain.on('exit', () => {
    if(process.platform !== 'darwin') app.quit();
});