/**
 * shared.ts
 *
 * Shared utility functions used by generate-tts.ts and rebuild-timeline.ts.
 */

/**
 * Split narration text into segments of ≤25 characters for TTS generation.
 * Splits on sentence-ending punctuation first (。！？；), then on
 * comma/pause punctuation (，、) if a sentence is still too long.
 */
export function splitNarrationText(text: string): string[] {
  const sentences = text.split(/(?<=[。！？；])/);
  const result: string[] = [];
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if (trimmed.length <= 25) {
      result.push(trimmed);
    } else {
      const clauses = trimmed.split(/(?<=[，、])/);
      let buffer = "";
      for (const clause of clauses) {
        if (buffer.length + clause.length <= 25) {
          buffer += clause;
        } else {
          if (buffer) result.push(buffer.trim());
          buffer = clause;
        }
      }
      if (buffer.trim()) result.push(buffer.trim());
    }
  }
  return result;
}

/**
 * Derive a scene key from a filename.
 * Examples:
 *   Scene01Hook.tsx -> hook
 *   Scene02Introduction.tsx -> introduction
 *   HookScene.tsx -> hook
 */
export function deriveSceneKey(basename: string): string {
  let key = basename.replace(/^Scene\d*/, "");
  key = key.replace(/Scene$/, "");
  if (key.length > 0) {
    key = key[0].toLowerCase() + key.slice(1);
  }
  return key || basename.toLowerCase();
}
