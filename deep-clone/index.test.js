const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const DeepClone = require('./index');

const assert = chai.assert;

chai.use(sinonChai);

describe('DeepClone', () => {
  it('deepClone存在，且为一个函数', () => {
    assert.exists(DeepClone);
    assert.isFunction(DeepClone);
  });

  describe('复制基本类型', () => {

    it ('可以复制number', () => {
      const n1 = 1;
      const n1_c = new DeepClone().clone(n1);
      assert(n1 === n1_c)
      const n2 = NaN;
      const n2_c = new DeepClone().clone(n2);
      assert.isNaN(n2_c);
    });

    it ('可以复制string', () => {
      const n1 ='string';
      const n1_c = new DeepClone().clone(n1);
      assert(n1 === n1_c);
      const n2 = '';
      const n2_c = new DeepClone().clone(n2);
      assert(n2 === n2_c);
    });

    it ('可以复制boolean', () => {
      const n1 = true;
      const n1_c = new DeepClone().clone(n1);
      assert(n1 === n1_c);
    });

    it ('可以复制null', () => {
      const n1 = null;
      const n1_c = new DeepClone().clone(n1);
      assert(n1 === n1_c);
    });

    it ('可以复制undefined', () => {
      const n1 = undefined;
      const n1_c = new DeepClone().clone(n1);
      assert(n1 === n1_c);
    });

    it ('可以复制symbol', () => {
      const n1 = Symbol();
      const n1_c = new DeepClone().clone(n1);
      assert(n1 === n1_c);
    });
    
  });

  describe('复制object', () => {
    it('可以复制普通对象', () => {
      const obj = { name: 'vivi', age: 3 };
      const obj_c = new DeepClone().clone(obj);
      assert.notStrictEqual(obj, obj_c);
      assert.deepEqual(obj, obj_c);
    });

    it('可以复制数组', () => {
      const array = [1, 2, { name: 'vivi', age: 3 }];
      const array_c = new DeepClone().clone(array);
      assert.notStrictEqual(array, array_c);
      assert.strictEqual(array[0], array_c[0]);
      assert.strictEqual(array[1], array_c[1]);
      assert.notStrictEqual(array[2], array_c[2]);
      assert.deepEqual(array[2], array_c[2]);
    });

    it('可以复制date', () => {
      const date = new Date();
      const date_c = new DeepClone().clone(date);
      assert.notStrictEqual(date, date_c);
      assert.strictEqual(date.getTime(), date_c.getTime());
    });

    it('可以复制regexp', () => {
      const reg = /hi/gi;
      const reg_c = new DeepClone().clone(reg);
      assert.notStrictEqual(reg, reg_c);
      assert.strictEqual(reg.toString(), reg_c.toString());
    });

    it('可以复制function', () => {
      const fn = function(a, b) { return 'hi' + a + b };
      const fn_c = new DeepClone().clone(fn);
      assert.notStrictEqual(fn, fn_c);
      assert.strictEqual(fn(1, 2), fn_c(1, 2));
      const fn2 = (a, b) => { return 'hello' + a + b };
      const fn2_c = new DeepClone().clone(fn);
      assert.notStrictEqual(fn, fn_c);
      assert.strictEqual(fn(1, 2), fn_c(1, 2));
    });

    it('不复制原型上的属性', () => {
      const obj = Object.create({ baby: 'vicky'});
      obj.name = 'vivi';
      const obj_c = new DeepClone().clone(obj);
      assert.notStrictEqual(obj, obj_c);
      assert.exists(obj.baby);
      assert.isUndefined(obj_c.baby);
    });

    it('可以复制闭环', () => {
      const obj = {};
      obj.self = obj;
      const obj_c = new DeepClone().clone(obj);
      assert.notStrictEqual(obj, obj_c);
      assert.deepEqual(obj, obj_c);
    });

    it('可以复制复杂的对象', () => {
      const obj = {
        fn: function(){ return this; },
        fn2: function() { return 'a' },
        obj: [
          { obj: { 'name': 'vivi'} },
          NaN,
          undefined,
        ],
        bol: [true, false],
      };
      obj.self = obj;
      const obj_c = new DeepClone().clone(obj);
      assert.notStrictEqual(obj, obj_c);
      assert.notStrictEqual(obj.fn, obj_c.fn);
      const fn = obj.fn;
      const fn2 = obj_c.fn;
      assert.strictEqual(fn(), fn2());
      assert.notStrictEqual(obj.fn2, obj_c.fn2);
      assert.strictEqual(obj.fn2(), obj_c.fn2());
      assert.notStrictEqual(obj.obj, obj_c.obj);
      assert.deepEqual(obj.obj, obj_c.obj);
      assert.notStrictEqual(obj.bol, obj_c.bol);
      assert.deepStrictEqual(obj.bol, obj_c.bol);
      assert.notStrictEqual(obj.self, obj_c.self);
    });

    xit('不会爆栈', () => {
      const obj = { child: null };
      let child = obj;
      for (let i = 0; i < 1000; i++) {
        child.child = {
          child: null,
        };
        child = child.child;
      }
      const obj_c = new DeepClone().clone(obj);
      assert.notStrictEqual(obj, obj_c);
    });
  });
});
