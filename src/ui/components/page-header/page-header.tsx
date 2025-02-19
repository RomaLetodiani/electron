import { PropsWithChildren } from "react";
import { IconArrow, IconCross, IconGear } from "@/assets/icons";
import classes from "./page-header.module.css";

type PageHeaderTitleProps = {
  title: string;
};

export const PageHeaderTitle = ({ title }: PageHeaderTitleProps) => (
  <span className={classes.headerTitleWrapper}>
    <span className={classes.headerIcon}>{/* TODO: Add icon */}</span>
    {title}
  </span>
);

const icons = {
  back: <IconArrow />,
  settings: <IconGear />,
  clear: <IconCross />,
};

type ButtonProps = {
  btnType: keyof typeof icons;
  onClick: () => void;
  title?: string;
};

export const PageHeaderButton = ({ btnType, onClick, title }: ButtonProps) => (
  <span className={classes.btn} onClick={onClick} title={title}>
    {icons[btnType]}
  </span>
);

export const PageHeaderEmptySpan = () => <span className={classes.empty}></span>;

type PageHeaderWrapperProps = { emptySpan?: "right" | "left" | "off" } & PropsWithChildren;

export const PageHeaderWrapper = ({ children, emptySpan = "right" }: PageHeaderWrapperProps) => (
  <div className={classes.header}>
    {emptySpan === "left" && <PageHeaderEmptySpan />}
    {children}
    {emptySpan === "right" && <PageHeaderEmptySpan />}
  </div>
);
