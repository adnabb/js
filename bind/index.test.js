const bind_c = require('./index');

test1('bind存在，并且为function');
test2('bind会返回一个新的函数，并且绑定this');
test3('bind可以绑定参数');
test4('bind返回的函数允许传参');
test5('bing返回的函数允许new操作');
test6('new的函数可以使用绑定的函数的prototype属性');
test7('bind绑定的对象和new的对象都是同一个原型链');

function test1(message) {
  console.assert(bind_c, 'exsit');
  console.assert(typeof bind_c === 'function', 'function');
  console.assert(bind_c === Function.prototype.bind2, 'prototype');
  console.log(message);
}

function test2(message) {
  const fn = function () { return this; };
  const obj = { name: 'vivi' };
  const newFn = fn.bind2(obj);
  console.assert(newFn() === obj, 'this');
  console.log(message);
}

function test3(message) {
  const fn = function (p1, p2) { return [this, p1, p2]; };
  const obj = { name: 'vivi' };
  const newFnResult = fn.bind2(obj, 123, 234)();
  console.assert(newFnResult[0] === obj, 'this');
  console.assert(newFnResult[1] === 123, 'p1');
  console.assert(newFnResult[2] === 234, 'p2');
  console.log(message);
}

function test4(message) {
  const fn = function (p1, p2) { return [this, p1, p2]; };
  const obj = { name: 'vivi' };
  const newFnResult = fn.bind2(obj)(123, 234);
  console.assert(newFnResult[0] === obj, 'this');
  console.assert(newFnResult[1] === 123, 'p1');
  console.assert(newFnResult[2] === 234, 'p2');
  console.log(message);
}

function test5(message) {
  const fn = function (p1, p2) { return [this, p1, p2]; };
  const obj = { name: 'vivi' };
  const newFn = fn.bind2(obj, 123, 234);
  const newFnResult = new newFn();
  console.assert(newFnResult[0] instanceof newFn, 'this');
  console.assert(newFnResult[1] === 123, 'p1');
  console.assert(newFnResult[2] === 234, 'p2');
  console.log(message);
}

function test6(message) {
  // 由于new的时候会返回函数自身，所以 这里不能有返回值
  const fn = function (p1, p2) { this.p1 = p1; this.p2 = p2; };
  fn.prototype.sayHi = function() { console.log('hi'); };
  fn.prototype.age = 18;
  const obj = { name: 'vivi' };
  const newFn = fn.bind2(obj, 123, 234);
  const newFnResult = new newFn();
  console.assert(newFnResult.sayHi, 'sayHi');
  console.assert(newFnResult.age === 18, 'age');
  console.assert(newFnResult instanceof newFn, 'this');
  console.assert(newFnResult.p1 === 123, 'p1');
  console.assert(newFnResult.p2 === 234, 'p2');
  console.log(message);
}

function test7(message) {
  // 由于new的时候会返回函数自身，所以 这里不能有返回值
  const fn = function (p1, p2) { this.p1 = p1; this.p2 = p2; };
  fn.prototype.sayHi = function() { console.log('hi'); };
  fn.prototype.age = 18;
  const obj = new fn(1, 2);
  const newFn = fn.bind2(obj, 123, 234);
  const newFnResult = new newFn();
  console.assert(newFnResult.sayHi, 'sayHi');
  console.assert(newFnResult.age === 18, 'age');
  console.assert(newFnResult instanceof newFn, 'this');
  console.assert(newFnResult.p1 === 123, 'p1');
  console.assert(newFnResult.p2 === 234, 'p2');
  console.log(message);
}