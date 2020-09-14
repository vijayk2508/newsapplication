if (!Array.isArray) {
  // Polyfill for `isArray` (not supported in old browser versions like < IE8) used in 'classnames' library
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
