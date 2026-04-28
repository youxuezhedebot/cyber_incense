import os from "node:os";
import path from "node:path";

export function getStateDir(): string {
  return path.join(os.homedir(), ".cyber-incense");
}

export function getStatePath(): string {
  return path.join(getStateDir(), "state.json");
}
