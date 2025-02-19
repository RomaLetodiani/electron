type OAuthProvider = "gmail" | "outlook" | "slack" | "hubspot" | "salesforce";

type AuthCompletedPayload = {
  userId: string;
  sub: string;
};

type EventPayloadMapping = {
  "take-screenshot": Promise<string>;
  "get-active-window": Promise<string>;
  "get-bounds": Promise<{ width: number; height: number }>;
  "resize-window": Promise<{ width: number; height: number }>;
  "quit-and-install": Promise<void>;
  "start-update": () => Promise<void>;
  on: VoidFunction;
};

interface Window {
  electron: {
    takeScreenshot: () => EventPayloadMapping["take-screenshot"];
    getActiveWindow: () => EventPayloadMapping["get-active-window"];
    getBounds: () => EventPayloadMapping["get-bounds"];
    resizeWindow: (width: number, height: number) => EventPayloadMapping["resize-window"];
    startUpdate: () => EventPayloadMapping["start-update"];
    quitAndInstall: () => EventPayloadMapping["quit-and-install"];
    on: (channel: string, func: (...args: unknown[]) => void) => EventPayloadMapping["on"];
  };
}
