// All views use hash navigation, so assets stay relative to the deployed document.
export function localDataUrl(file: string) {
  return new URL(`data/${file}`, document.baseURI).toString();
}