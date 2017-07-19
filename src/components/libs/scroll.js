/* eslint-disable */
const scrollToItem = function scrollToItem(errors) {
  const fieldName = Object.keys(errors)[0];
  const firstInvalidItem = document.getElementsByName(fieldName)[0];

  if (!firstInvalidItem) return null;

  const diff = (firstInvalidItem.offsetTop - window.scrollY) / 8;

  if (Math.abs(diff) > 1) {
    window.scrollTo(0, (window.scrollY + diff));
    clearTimeout(window._TO);
    window._TO = setTimeout(scrollToItem(errors), 30, firstInvalidItem);
  } else {
    window.scrollTo(0, firstInvalidItem.offsetTop);
  }
};

export default scrollToItem;
