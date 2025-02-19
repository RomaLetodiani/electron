import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Screenshot } from "@/components/screenshot/screenshot";
import { PageHeaderButton, PageHeaderTitle, PageHeaderWrapper } from "@/components/page-header/page-header";
import { shortcuts } from "@/utils/shortcuts";
import { homeWindow } from "@/utils/animate";
import { logger } from "@/utils/logger";
import classes from "./home.module.css";

export const Home = () => {
  const { setScreenshot } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    homeWindow();
    handleScreenshot();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const shortcut = shortcuts[event.code];
      if (shortcut) {
        navigate(shortcut);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [navigate]);

  const handleScreenshot = async () => {
    try {
      const screenshotData = await window.electron.takeScreenshot();
      setScreenshot(screenshotData);
    } catch (error) {
      logger.error("Failed to take screenshot:", error);
    }
  };

  return (
    <div className={classes.container}>
      <PageHeaderWrapper emptySpan="off">
        <PageHeaderButton btnType="clear" onClick={() => navigate("/home")} />
        <PageHeaderTitle title="Electron" />
        <PageHeaderButton btnType="settings" onClick={() => navigate("/settings")} />
      </PageHeaderWrapper>
      <div className={classes.content}>
        <Screenshot />
      </div>
    </div>
  );
};
