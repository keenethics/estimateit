/*eslint-disable */
export function isValidUrl(url) {
  const regEx = /^(http[s]?:)+\/\/([^:\/\s]+)([^#?\s]+)\?([^#]*)?(#.*)?$/;
  return regEx.test(url);
}
/*eslint-enable */
export function createFullUrl(req, url) {
  return `${req.protocol}://${req.hostname}:${getPort()}/${url}`;
}

function getPort() {
  return process.env.API_PORT || 3000;
}
