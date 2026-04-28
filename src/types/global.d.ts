import type { CyberIncenseAPI } from "./incense";

declare global {
  interface Window {
    cyberIncense: CyberIncenseAPI;
    webkitAudioContext?: typeof AudioContext;
  }
}

export {};
