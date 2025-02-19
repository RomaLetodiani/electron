import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logger } from "@/utils/logger";
import { IconCheckGreen } from "@/assets/icons";
import gongLogo from "@/assets/gong.png";
import slackLogo from "@/assets/slack.png";
import googleLogo from "@/assets/google.png";
import hubspotLogo from "@/assets/hubspot.png";
import microsoftLogo from "@/assets/microsoft.png";
import salesforceLogo from "@/assets/salesforce.png";
import classes from "./settings.module.css";
import { PageHeaderButton, PageHeaderTitle, PageHeaderWrapper } from "@/components/page-header/page-header";

const providerIcons = {
  Google: googleLogo,
  Microsoft: microsoftLogo,
  Slack: slackLogo,
  Gong: gongLogo,
  Hubspot: hubspotLogo,
  Salesforce: salesforceLogo,
};

const apps = ["Slack", "Hubspot", "Salesforce", "Gong"] as const;
type App = (typeof apps)[number];

export const Settings = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userItem");
    navigate("/");
  };

  return (
    <div className={classes.container}>
      <PageHeaderWrapper emptySpan="left">
        <PageHeaderTitle title="Settings" />
        <PageHeaderButton btnType="clear" onClick={() => navigate("/home")} />
      </PageHeaderWrapper>
      <div className={classes.content}>
        <span className={classes.accountsContainer}></span>
      </div>
      <span className={classes.logoutContainer}>
        {!showLogoutConfirm ? (
          <span className={classes.logoutText} onClick={() => setShowLogoutConfirm(true)}>
            Log out
          </span>
        ) : (
          <div className={classes.logoutConfirmContainer}>
            <span className={classes.logoutConfirmText}>Log out?</span>
            <span className={classes.logoutConfirmButton} onClick={handleLogout}>
              Yes
            </span>
            <span className={classes.logoutConfirmButton} onClick={() => setShowLogoutConfirm(false)}>
              No
            </span>
          </div>
        )}
      </span>
    </div>
  );
};
