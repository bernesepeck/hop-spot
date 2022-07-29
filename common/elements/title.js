export {title};

/**
 * Renders a title
 * @param {String} text 
 * @param {number} size 
 * @returns 
 */
const title = (text, size) => {
  const title = document.createElement(`h${size}`, text);
  title.textContent = text;
  return title;
}