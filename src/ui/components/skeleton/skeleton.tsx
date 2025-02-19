import { CSSProperties } from "react";
import classes from "./skeleton.module.css";

type SkeletonTextLoadingProps = {
  text: string;
  style?: CSSProperties;
};

export const SkeletonTextLoading = ({ text, style }: SkeletonTextLoadingProps) => (
  <div>
    <div style={style}>
      {Array.from(text).map(
        (
          char: string,
          index: number, // Using Array.from instead of split to preserve spaces
        ) => (
          <span
            key={index}
            className={classes.letter}
            style={{
              animationDelay: `${index * 0.04}s`,
            }}
          >
            {char}
          </span>
        ),
      )}
    </div>
  </div>
);
