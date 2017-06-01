/*eslint-disable */
export function isValidUrl(url) {
  const regEx = /^(http[s]?:)+\/\/([^:\/\s]+)([^#?\s]+)\?([^#]*)?(#.*)?$/;
  return regEx.test(url);
}
/*eslint-enable */
export function createFullUrl(req, url) {
  return `${req.protocol}://${req.hostname}:${process.env.BROWSER_SYNC_PORT}/${url}`;
}
