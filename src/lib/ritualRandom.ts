export function hashSeed(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function seededRandom(seed: number): number {
  let value = seed >>> 0;
  value += 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

export function randomRange(seed: number, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}

export function stableId(prefix: string, seed: number, now: number): string {
  return `${prefix}-${seed.toString(16)}-${Math.round(now).toString(36)}`;
}
