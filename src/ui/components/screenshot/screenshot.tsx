import { logger } from "@/utils/logger";
import classes from "./screenshot.module.css";
import { useState } from "react";

export const Screenshot = ({ staticScreenshot = undefined }: { staticScreenshot?: string }) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleScreenshot = async () => {
    try {
      if (staticScreenshot) {
        return;
      }

      const screenshotData = await window.electron.takeScreenshot();
      setScreenshot(screenshotData);
    } catch (error) {
      logger.error("Error taking screenshot", error);
    }
  };

  let image = screenshot;

  if (staticScreenshot) {
    image = staticScreenshot;
  }

  // explicitly set image to null if staticScreenshot is null
  if (staticScreenshot === null) {
    image = null;
  }

  if (!image) return null;

  return <img src={image} alt="" className={classes.image} onMouseEnter={handleScreenshot} />;
};
