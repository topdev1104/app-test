export function getApiVersion(now: number) {
  let secs = now / 1000;
  return secs - (secs % 600);
}
