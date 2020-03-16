// 老语法
var slice = Array.prototype.slice;
var bind = function(oThis) {
  var fn = this;
  var args = slice.call(arguments, 1);

  if (typeof fn !== 'function') throw new Error('bind只能绑定函数');

  function result() {
    var args2 = slice.call(arguments);
    return fn.apply(result.prototype.isPrototypeOf(this) ? this : oThis, args.concat(args2));
  };

  result.prototype = fn.prototype;

  return result;
};

// 使用es6语法
const _bind = function (oThis, ...args) {
  const fn = this;
  const resultFn = function (...args2) {
    const that = this instanceof resultFn ? this : oThis;
    return fn.call(that, ...args, ...args2);
  };
  resultFn.prototype = fn.prototype;

  return resultFn;
};

// Function.proptotype.bind不允许被改写，这里使用bind2
if (!Function.prototype.bind2) Function.prototype.bind2 = bind;

module.exports = bind;
