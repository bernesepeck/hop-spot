/**
 * Takes a function and a delay. Returns new that calls the given function after the delay.
 * @param {*} func The function to be executed after the given delay.
 * @param {*} delay The time in milliseconds to delac execution.
 * @returns
 */
function debounce(func, delay = 300) {
  let timeout;
  return () => {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export { debounce };
