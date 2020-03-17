class Promise{
  state = 'pending';
  callback = [];
  returnValue;
  resolutionProcedure(promise, x) {
    if (promise === x) {
      this.reject(new TypeError);
    }

    if (x instanceof Promise) {
      x.then((result) => {
        x.resolve(result);
      }, (reason) => {
        x.reject(reason);
      });
    }

    if (x instanceof Object) {
      let then;
      try {
        then = x.then;
      } catch (e) {
        promise.reject(e);
      }
      if (typeof then === 'function') {
        x.then((y) => {
          promise.resolutionProcedure(promise, y);
        }, (r) => {
          promise.reject(r);
        });
      } else {
        promise.resolve(x);
      }

    } else {
      promise.resolve(x);
    }
  };
  resolve(value?:unknown) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      this.callback.forEach((item) => {
        try {
          this.returnValue = item[0] && item[0].call(undefined, value);
          this.resolutionProcedure(item[2], this.returnValue);
        } catch (error) {
          item[2].reject(error);
        }
      });
    });
  };
  reject(reason?:unknown) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      this.callback.forEach((item) => {
        try {
          if (!item[1]) {
            item[2].reject(reason);
          } else {
            this.returnValue = item[1] && item[1].call(undefined, reason);
            this.resolutionProcedure(item[2], this.returnValue);
          }
        } catch (error) {
          item[2].reject(error);
        }
      });
    });
  };
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
}

export default Promise;
