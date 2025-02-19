import { useEffect } from "react";
import { IconCheckGreen } from "@/assets/icons";
import classes from "./success-screen.module.css";

type SuccessScreenProps = {
  message: string;
  subMessage?: string;
  duration?: number;
  onDismiss: () => void;
  dismissButtonText?: string;
};

export const SuccessScreen = ({
  message,
  subMessage,
  duration = 5000,
  onDismiss,
  dismissButtonText = "Dismiss",
}: SuccessScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.iconWrapper}>
          <IconCheckGreen />
        </div>
        <div className={classes.messageContainer}>
          <h3 className={classes.message}>{message}</h3>
          {subMessage && <p className={classes.subMessage}>{subMessage}</p>}
        </div>
        <button className={classes.dismissButton} onClick={onDismiss}>
          {dismissButtonText}
        </button>
      </div>
    </div>
  );
};
