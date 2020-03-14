const bind = function (oThis, ...args) {
  const fn = this;
  const resultFn = function (...args2) {
    const that = this instanceof resultFn ? this : oThis;
    return fn.call(that, ...args, ...args2);
  };
  resultFn.prototype = fn.prototype;

  return resultFn;
}

// Function.proptotype.bind不允许被改写，这里使用bind2
if (!Function.prototype.bind2) Function.prototype.bind2 = bind;

module.exports = bind;
