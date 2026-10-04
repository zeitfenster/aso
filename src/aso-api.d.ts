export {};

type UserLibraryPayload = {
  version?: number;
  plugins?: Record<
    string,
    {
      notes?: string;
      reachForWhen?: string;
      presets?: string[];
      shortlisted?: boolean;
    }
  >;
  defaults?: Record<string, string>;
  lastOpened?: string[];
};

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
      getLibrary: () => Promise<{ ok?: boolean; library?: UserLibraryPayload }>;
      setLibrary: (
        payload: UserLibraryPayload,
      ) => Promise<{ ok?: boolean; library?: UserLibraryPayload }>;
      onMenuCommand: (
        callback: (payload: { action: string }) => void,
      ) => () => void;
    };
  }
}
