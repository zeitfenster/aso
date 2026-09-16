export {};

type WindowAppearance = {
  ok?: boolean;
  resolution?: string;
  scale?: number;
  width?: number;
  height?: number;
  resolutions?: { id: string; label?: string }[];
  scales?: { id: number; label?: string }[];
};

declare global {
  interface Window {
    asoApi?: {
      platform: string;
      getAppVersion: () => Promise<string>;
      getWindowAppearance: () => Promise<WindowAppearance>;
      setWindowAppearance: (payload: {
        resolution?: string;
        scale?: number;
      }) => Promise<WindowAppearance>;
      onMenuCommand: (
        callback: (payload: { action: string }) => void,
      ) => () => void;
    };
  }
}
