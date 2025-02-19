import axios from "axios";
import { exec } from "child_process";
import { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain, screen, shell } from "electron";
import path from "node:path";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { isDev } from "./util.js";
import pkg from "electron-updater";
const { autoUpdater } = pkg;

let mainWindow: BrowserWindow | null = null;
let updateAvailable = false;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("electron", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("electron");
}

app.on("ready", () => {
  // Handle dock for macOS only
  if (process.platform === "darwin") {
    app.dock.hide();
  }

  mainWindow = new BrowserWindow({
    webPreferences: { preload: getPreloadPath() },

    width: 160,
    height: 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    skipTaskbar: true,
    fullscreenable: false,
    type: "toolbar",
  });

  mainWindow.setAlwaysOnTop(true, "floating");

  // setVisibleOnAllWorkspaces is only available on macOS
  if (process.platform === "darwin") {
    mainWindow.setVisibleOnAllWorkspaces(true);
  }

  mainWindow.setFullScreenable(false);

  // Show dock icon for macOS only
  if (process.platform === "darwin") {
    app.dock.show();
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  mainWindow.setPosition(100, screenHeight - 60);

  // Register Alt+Space shortcut
  globalShortcut.register("Alt+Space", () => {
    mainWindow?.webContents.send("toggle-expand");
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
  });

  autoUpdater.on("update-available", (info) => {
    updateAvailable = true;
    if (mainWindow) {
      mainWindow.webContents.send("update-available", info);
    }
  });

  autoUpdater.on("update-not-available", () => {
    console.log("Update not available");
  });

  autoUpdater.on("error", (err) => {
    console.error("Error in auto-updater:", err);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send("download-progress", progressObj);
    }
  });

  autoUpdater.on("update-downloaded", () => {
    if (mainWindow) {
      mainWindow.webContents.send("update-downloaded");
    }
  });

  if (!isDev()) {
    autoUpdater.checkForUpdates();
    // Check for updates every hour
    setInterval(
      () => {
        autoUpdater.checkForUpdates();
      },
      60 * 60 * 1000,
    );
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

ipcMain.handle("take-screenshot", async () => {
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    const screenshot = await desktopCapturer.getSources({ types: ["screen"], thumbnailSize: { width, height } });

    return screenshot[0].thumbnail.toDataURL();
  } catch (error) {
    console.error("Screenshot error:", error);
    throw error;
  }
});

ipcMain.handle("get-active-window", async () => {
  return new Promise((resolve, reject) => {
    let command = "";

    switch (process.platform) {
      case "win32":
        command = `powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class GetForegroundWindow {[DllImport(\\"user32.dll\\")] public static extern IntPtr GetForegroundWindow(); [DllImport(\\"user32.dll\\")] public static extern int GetWindowThreadProcessId(IntPtr hWnd, out int processId);}'; $hwnd = [GetForegroundWindow]::GetForegroundWindow(); $processId = 0; [GetForegroundWindow]::GetWindowThreadProcessId($hwnd, [ref]$processId); Get-Process -Id $processId | Select-Object -Property ProcessName,MainWindowTitle | ConvertTo-Json"`;
        break;

      case "darwin":
        command =
          "osascript -e 'tell application \"System Events\" to get name of first application process whose frontmost is true'";
        break;

      case "linux":
        command = "xdotool getactivewindow getwindowname";
        break;

      default:
        reject(new Error("Unsupported platform"));
        return;
    }

    exec(command, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error("Error getting active window:", error);
        resolve("");
        return;
      }

      let windowTitle = "";

      switch (process.platform) {
        case "win32":
          try {
            const processInfo = JSON.parse(stdout.trim());
            windowTitle = processInfo.MainWindowTitle || "";
          } catch (e) {
            console.error("Error parsing window info:", e);
            windowTitle = "";
          }
          break;

        case "darwin":
        case "linux":
          windowTitle = stdout.trim();
          break;
      }

      resolve(windowTitle);
    });
  });
});

ipcMain.handle("get-bounds", () => {
  if (mainWindow) {
    return mainWindow.getBounds();
  }
  return null;
});

ipcMain.handle("resize-window", (event, { width, height }) => {
  if (mainWindow) {
    const bounds = mainWindow.getBounds();
    // Calculate new y position to grow upward
    const newY = bounds.y - (height - bounds.height);
    mainWindow.setBounds({ x: bounds.x, y: newY, width, height });

    // Register Escape shortcut when window is expanded
    if (height > 60) {
      globalShortcut.register("Escape", () => {
        mainWindow?.webContents.send("collapse");
      });
      // Focus the window when expanded
      mainWindow.focus();
    } else {
      // Unregister Escape shortcut when window is collapsed
      globalShortcut.unregister("Escape");
    }
  }
});

ipcMain.handle("start-update", async () => {
  if (updateAvailable) {
    await autoUpdater.downloadUpdate();
  }
});

ipcMain.handle("quit-and-install", () => {
  autoUpdater.quitAndInstall();
});
