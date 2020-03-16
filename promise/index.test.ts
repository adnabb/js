
import 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import Promise from './index';

chai.use(sinonChai);

const assert = chai.assert;

/**
 * 这里的测试用例主要是根据Promise A+的描述进行的。
 * 如果前面有序号，则可直接根据序号来查看对应内容 https://promisesaplus.com/；
 * 否则，是根据自己的理解进行的测试用例。
 *   */ 
describe('Promise', () => {
  it('1 “promise” is an object or function', () => {
    assert.isFunction(Promise);
  });

  describe('promise实例', () => {
    it('只能接收一个函数，否则报错', () => {
      // @ts-ignore
      assert.throw(() => new Promise());
      assert.throw(() => new Promise(true));
      assert.throw(() => new Promise(1));
      assert.throw(() => new Promise(''));
      assert.throw(() => new Promise({}));
      assert.throw(() => new Promise([]));
      assert.isObject(new Promise(() => {}));
    });

    it('实例返回的对象有then方法', () => {
      assert.exists(new Promise(() => {}).then);
      assert.isFunction(new Promise(() => {}).then);
    });

    it('实例接收的函数会被立即执行', () => {
      const fn = sinon.fake();
      new Promise(fn);
      assert.isTrue(fn.called);
    });

    it('接收的函数接收两个内置函数（resolve & reject）作为参数', () => {
      new Promise((resolve, reject) => {
        assert.isFunction(resolve);
        assert.isFunction(reject);
      });
    });

    it('promise.then(onFulfilled)中的onFulFilled方法，会在resolve之后执行', () => {
      const onFulfilled = sinon.fake();
      const promise = new Promise((resolve) => {
        assert.isFalse(onFulfilled.called);
        resolve();
        setTimeout(() => {
          assert.isTrue(onFulfilled.called);
        });
      });
      promise.then(onFulfilled);
    });
  });

  it('promise.then(null, onRejected)中的onRejected方法，会在reject之后执行', () => {
    const onRejected = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(onRejected.called);
      reject();
      setTimeout(() => {
        assert.isTrue(onRejected.called);
      })
    });
    promise.then(null, onRejected);
  });


  xit('2 Promise States', () => {
  });

  describe('2.2 A promise’s then method accepts two arguments', () => {
    it('2.2.1 Both onFulfilled and onRejected are optional arguments', () => {
      const promise = new Promise(() => {});
      // @ts-ignore
      assert.doesNotThrow(() => promise.then());
      assert.doesNotThrow(() => promise.then(() => {}, null));
      assert.doesNotThrow(() => promise.then(null, () => {}));
      assert.doesNotThrow(() => promise.then(() => {}, () => {}));
    });

    it('2.2.1.1 If onFulfilled is not a function, it must be ignored.', () => {
      const promise = new Promise(() => {});
      // @ts-ignore
      assert.doesNotThrow(() => promise.then(1));
    });

    describe('2.2.2 If onFulfilled is a function', () => {
      it('2.2.2.1 it must be called after promise is fulfilled', () => {
        const onFulfilled = sinon.fake();
        const promise = new Promise((resolve) => {
          // 由于这里属于promise正在定义的部分，所以无法断言promise.state
          assert.isFalse(onFulfilled.called);
          resolve();
          setTimeout(() => {
            // @ts-ignore
            assert(promise.state === 'fulfilled');
            assert.isTrue(onFulfilled.called);
          });
        });

        promise.then(onFulfilled);
      });
      
      it('2.2.2.1  with promise’s value as its first argument', () => {
        const promise = new Promise((resolve) => {
          resolve('hi');
        });
        promise.then((value) => {
          console.log(value)
          assert(value === 'hi');
        });
      });

      it('2.2.2.3 it must not be called more than once.', () => {
        const onFulfilled = sinon.fake();
        const promise = new Promise((resolve) => {
          // 由于这里属于promise正在定义的部分，所以无法断言promise.state
          assert.isFalse(onFulfilled.called);
          resolve(123);
          resolve(234);
          setTimeout(() => {
            // @ts-ignore
            assert(promise.state === 'fulfilled');
            assert.isTrue(onFulfilled.calledOnceWith(123));
          });
        });

        promise.then(onFulfilled);
      });

    });

    describe('2.2.3 If onRejected is a function', () => {
      it('2.2.3.1 it must be called after promise is rejected, with promise’s reason as its first argument.', () => {
        const onRejected = sinon.fake();
        const promise = new Promise((resolve, reject) => {
          // 由于这里属于promise正在定义的部分，所以无法断言promise.state
          assert.isFalse(onRejected.called);
          reject();
          setTimeout(() => {
            // @ts-ignore
            assert(promise.state === 'rejected');
            assert.isTrue(onRejected.called);
          });
        });

        promise.then(null, onRejected);
      });
      
      it('2.2.3.1  with promise’s value as its first argument', () => {
        const promise = new Promise((resolve, reject) => {
          reject('hi');
        });
        promise.then(null, (reason:any) => {
          assert(reason === 'hi');
        });
      });

      it('2.2.3.3 it must not be called more than once.', () => {
        const onRejected = sinon.fake();
        const promise = new Promise((resolve, reject) => {
          // 由于这里属于promise正在定义的部分，所以无法断言promise.state
          assert.isFalse(onRejected.called);
          reject(123);
          reject(234);
          setTimeout(() => {
            // @ts-ignore
            assert(promise.state === 'rejected');
            assert.isTrue(onRejected.calledOnceWith(123));
          });
        });

        promise.then(null, onRejected);
      });

    });

    it('2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code', () => {
      const fn1 = sinon.fake();
      const fn2 = sinon.fake();
      const promise = new Promise((resolve, reject) => {
        resolve();
      });
      fn1();
      promise.then(() => {
        assert.isTrue(fn2.called);
        assert.isTrue(fn2.called);
      });
      fn2();
    });

    it('2.2.5 onFulfilled and onRejected must be called as functions (i.e. with no this value).', () => {
      const promise1 = new Promise((resolve, reject) => {
        resolve();
      });
      promise1.then(function() {
        assert.isUndefined(this);
      });

      const promise2 = new Promise((resolve, reject) => {
        reject();
      });
      promise2.then(null, function() {
        assert.isUndefined(this);
      });

      // TODO: 为箭头函数则失败
      // const promise3 = new Promise((resolve, reject) => {
      //   resolve();
      // });
      // promise3.then(() => {
      //   assert.isUndefined(this);
      // });

      describe('2.2.6 then may be called multiple times on the same promise.', () => {
        it('2.2.6.1 If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.', () => {
          const fn1 = sinon.fake();
          const fn2 = sinon.fake();
          const fn3 = sinon.fake();
          const fn4 = sinon.fake();
          const promise = new Promise((resolve) => {
            resolve();
            setTimeout(() => {
              assert.isTrue(fn1.calledBefore(fn2));
              assert.isTrue(fn2.calledBefore(fn3));
              assert.isTrue(fn3.calledBefore(fn4));
            });
          });
          promise.then(fn1);
          promise.then(fn2);
          promise.then(fn3);
          promise.then(fn4);
        });

        it('2.2.6.2 If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.', () => {
          const fn1 = sinon.fake();
          const fn2 = sinon.fake();
          const fn3 = sinon.fake();
          const fn4 = sinon.fake();
          const promise = new Promise((resolve) => {
            resolve();
            setTimeout(() => {
              assert.isTrue(fn1.calledBefore(fn2));
              assert.isTrue(fn2.calledBefore(fn3));
              assert.isTrue(fn3.calledBefore(fn4));
            });
          });
          promise.then(fn1);
          promise.then(fn2);
          promise.then(fn3);
          promise.then(fn4);
        });
      });
    });
  });
});