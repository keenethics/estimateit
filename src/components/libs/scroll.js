import scrollIntoView from 'scroll-into-view';

/* eslint-disable */
const scrollToItem = function scrollToItem(errors) {
  setTimeout(() => {
    const firstInvalidItem = document.getElementsByClassName('text-danger')[0];
    if (!firstInvalidItem) return null;
    scrollIntoView(firstInvalidItem);
 }, 0);
};

export default scrollToItem;
