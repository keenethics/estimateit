import UrlEntry from '../models/schema';

export function getShortCode() {
  return UrlEntry
    .find()
    .sort({ shortCode: -1 })
    .limit(1)
    .select({ _id: 0, shortCode: 1 })
    .then(docs => docs.length === 1 ? docs[0].shortCode + 1 : 0);
}

export function isDuplicate(url) {
  return UrlEntry
    .find({ original: url })
    .limit(1)
    .then(doc => doc ? doc.shortCode : false);
}

export function insertNew(url) {
  return getShortCode().then((newCode) => {
    const newUrl = new UrlEntry({ original: url, shortCode: newCode });
    return newUrl.save();
  });
}
