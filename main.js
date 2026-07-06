const { app, BrowserWindow, Menu, MenuItem, dialog } = require('electron');
const path = require('path');

let mainWindow;
let splash;

function createWindow() {
    splash = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        transparent: true,
        alwaysOnTop: true
    });

    splash.loadFile('splash.html');

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');

    
    setTimeout(() => {
        splash.close();
        mainWindow.show();
    }, 3000);

    // Context Menu
    const contextMenu = new Menu();
    contextMenu.append(new MenuItem({ label: 'Reload', click: () => mainWindow.reload() }));
    contextMenu.append(new MenuItem({ label: 'Toggle DevTools', click: () => mainWindow.webContents.toggleDevTools() }));

    mainWindow.webContents.on('context-menu', () => {
        contextMenu.popup();
    });

    // Top Menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Export App',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            title: 'Export App',
                            message: 'App export logic can go here!',
                            buttons: ['OK']
                        });
                    }
                },
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'togglefullscreen' }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
