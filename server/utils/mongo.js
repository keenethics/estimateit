import UrlEntry from '../models/schema';

export function insertNew(url, data) {
  const newUrl = new UrlEntry({
    original: url,
    Header: data.header,
    Main: data.main,
  });
  return newUrl.save();
}
