// import '@types/node';

class Promise {
  state = 'pending';
  callback = [];
  returnValue;
  resolutionProcedure(promise, x) {
    if (promise === x) { this.resolveWithSelf(); }
    if (x instanceof Promise) { this.resolveWithPromise(x); }
    if (x instanceof Object) {
      this.resolveWithObject(promise, x);
    } else {
      promise.resolve(x);
    }
  }
  checkAfferentState(state) {
    if (state !== 'fulfilled' && state !== 'rejected') return false;
    return true;
  }
  resolveOrReject(state, value) {
    if (this.state !== 'pending') return;
    if (!this.checkAfferentState(state)) return;
    this.state = state;
    nextTick(() => {
      const itemIndex = this.state === 'fulfilled' ? 0 : 1;
      this.callback.forEach((item) => {
        try {
          if (!item[itemIndex] && this.state === 'fulfilled') {
            // 如果onFulfilled不存在，promise2就以传入的值直接fulfilled
            item[2].resolve(value);
          } else if (!item[itemIndex] && this.state === 'rejected') {
            // 如果onRejected不存在，promise2就以传入的值直接rejected
            item[2].reject(value);
          } else {
            this.returnValue = item[itemIndex] && item[itemIndex].call(undefined, value);
            this.resolutionProcedure(item[2], this.returnValue);
          }
        } catch (error) {
          item[2].reject(error);
        }
      });
    });
  }
  resolve(value?:unknown) {
    this.resolveOrReject('fulfilled', value);
  }
  reject(reason?:unknown) {
    this.resolveOrReject('rejected', reason);
  }
  onFullFilled = null;
  onRejected = null;
  constructor(fn) {
    if (typeof fn !== 'function') throw new Error('必须传入一个函数');
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?:Function, onRejected?:Function){
    const handle = [null, null, null];
    if (typeof onFulfilled === 'function') { handle[0] = onFulfilled; }
    if (typeof onRejected === 'function') { handle[1] = onRejected; }
    const promise = new Promise(() => {});
    handle[2] = promise;
    this.callback.push(handle);
    return promise;
  }
  resolveWithSelf() {
    this.reject(new TypeError);
  }
  resolveWithPromise(x) {
    x.then((result) => {
      x.resolve(result);
    }, (reason) => {
      x.reject(reason);
    });
  }
  resolveWithFunction(promise, x) {
    x.then((y) => {
      promise.resolutionProcedure(promise, y);
    }, (r) => {
      promise.reject(r);
    });
  }
  resolveWithObject(promise, x) {
    let then;
    try {
      then = x.then;
    } catch (e) {
      promise.reject(e);
    }
    if (typeof then === 'function') {
      this.resolveWithFunction(promise, x);
    } else {
      promise.resolve(x);
    }
  }
}

function nextTick(fn:Function) {
  // @ts-ignore
  if (process && process.nextTick) return process.nextTick(fn);
  // @ts-ignore
  const targetNode = document.createElement('div');
  const config = { attribute: true, childList: false, subtree: false };
  // @ts-ignore
  const observer = new MutationObserver(fn);
  observer.observe(targetNode, config);
}

export default Promise;
