class Promise{
  state = 'pending';
  callback = [];
  resolve(value?:unknown) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      this.callback.forEach((item) => {
        item[0] && item[0].call(undefined, value);
      });
    });
  };
  reject(reason?:unknown) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      this.callback.forEach((item) => {
        item[1] && item[1].call(undefined, reason);
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
    const handle = [null, null];
    if (typeof onFulfilled === 'function') { handle[0] = onFulfilled; }
    if (typeof onRejected === 'function') { handle[1] = onRejected; }
    this.callback.push(handle);
  }
}

export default Promise;
