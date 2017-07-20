import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

/* eslint-disable */
const scrollToItem = function scrollToItem(errors) {
  setTimeout(() => {
    const firstInvalidItem = document.getElementsByClassName('text-danger')[0];
    if (!firstInvalidItem) return null;
    scrollIntoViewIfNeeded(firstInvalidItem, true, {
      duration: 150
    })
 }, 0);
};

export default scrollToItem;
