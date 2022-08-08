export { button };

/**
 * Renders a button
 * @param {string} text
 * @param {Function} callFunction
 * @returns
 */
const button = (text, callFunction) => {
  const button = document.createElement('BUTTON');
  button.setAttribute('class', 'button');
  button.addEventListener('click', callFunction);
  button.textContent = text;
  return button;
};
