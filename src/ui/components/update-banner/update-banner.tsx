import { useEffect, useState } from "react";
import classes from "./update-banner.module.css";

export const UpdateBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [readyToInstall, setReadyToInstall] = useState(false);

  useEffect(() => {
    const unsubscribeAvailable = window.electron.onUpdateAvailable(() => {
      setShowBanner(true);
    });

    const unsubscribeProgress = window.electron.onUpdateDownloadProgress((progressObj) => {
      setProgress(progressObj.percent);
    });

    const unsubscribeDownloaded = window.electron.onUpdateDownloaded(() => {
      setReadyToInstall(true);
    });

    return () => {
      unsubscribeAvailable();
      unsubscribeProgress();
      unsubscribeDownloaded();
    };
  }, []);

  const handleUpdate = async () => {
    setDownloading(true);
    await window.electron.startUpdate();
  };

  const handleInstall = async () => {
    await window.electron.quitAndInstall();
  };

  if (!showBanner) return null;

  return (
    <div className={classes.banner}>
      {!downloading && !readyToInstall && (
        <>
          <span>New version available!</span>
          <button onClick={handleUpdate}>Update now</button>
        </>
      )}
      {downloading && !readyToInstall && (
        <div className={classes.progress}>
          <span>Downloading update: {Math.round(progress)}%</span>
          <div className={classes.progressBar}>
            <div className={classes.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {readyToInstall && (
        <>
          <span>Update ready to install</span>
          <button onClick={handleInstall}>Restart now</button>
        </>
      )}
    </div>
  );
};
