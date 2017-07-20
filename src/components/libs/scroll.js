/* eslint-disable */
const scrollToItem = function scrollToItem(errors) {
  setTimeout(() => {
    const firstInvalidItem = document.getElementsByClassName('text-danger')[0];
    if (!firstInvalidItem) return null;
    firstInvalidItem.scrollIntoViewIfNeeded();    
 }, 0);
};

export default scrollToItem;
