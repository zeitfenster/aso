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
  defaultSlots?: { id?: string; label?: string }[];
  chains?: {
    id?: string;
    label?: string;
    when?: string;
    steps?: {
      id?: string;
      pluginId?: string;
      note?: string;
      place?: string;
    }[];
  }[];
  lastOpened?: string[];
};

type InstallScanPayload = {
  scannedAt?: string;
  platform?: string;
  vst2?: string[];
  vst3?: string[];
  au?: string[];
  apps?: string[];
};

type WindowAppearance = {
  ok?: boolean;
  resolution?: string;
  scale?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  maximized?: boolean;
  resolutions?: { id: string; label?: string; width?: number; height?: number }[];
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
      getInstallScan: () => Promise<{
        ok?: boolean;
        scan?: InstallScanPayload | null;
      }>;
      scanInstall: () => Promise<{
        ok?: boolean;
        scan?: InstallScanPayload | null;
      }>;
      onMenuCommand: (
        callback: (payload: { action: string }) => void,
      ) => () => void;
    };
  }
}
