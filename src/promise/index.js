const States = Object.freeze({
  PENDING: Symbol('pending'),
  FULFILLED: Symbol('FULFILLED'),
  REJECTED: Symbol('REJECTED'),
});

const isFunction = (val) => val && typeof val === 'function';

const asyncFn = (fn) =>  {
  if (isFunction(setImmediate)) {
    return setImmediate(fn);
  } else if (isFunction(process.nextTick)) {
    return process.nextTick(fn);
  }
  return setTimeout(fn, 0);
}

class Promise {
  constructor(executor) {
    if (!isFunction(executor)) throw new TypeError(' argument error, must be a function');

    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.state = States.PENDING;
    this.value = void 0;
    this.onResolvedCb = [];
    this.onRejectedCb = [];

    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {

    if (value instanceof Promise) {
      return value.then(this.resolve, this.reject)
    }

    asyncFn(() => {
      if (this.state !== States.PENDING) {
        return;
      }
      this.state = States.FULFILLED;
      this.value = value;
      for (const fn of this.onResolvedCb) {
        fn(value);
      }
    });
  }

  reject(reason) {

    asyncFn(() => {
      if (this.state !== States.PENDING) {
        return;
      }
      this.state = States.REJECTED;
      this.value = reason;
      for (const fn of this.onRejectedCb) {
        fn(reason);
      }
    })

  }

  then(onResolved, onRejected) {
    onResolved = isFunction(onResolved) ? onResolved : function (val) { return val };
    onRejected = isFunction(onRejected) ? onRejected : function (reason) { throw reason };

    return new Promise((resolve, reject) => {

      if (this.state === States.PENDING) {
        this.onResolvedCb.push((value) => {
          try {
            const x = onResolved(value);
            if (x instanceof Promise) {
              x.then(resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        });

        this.onRejectedCb.push((reason) => {
          try {
            const x = onRejected(reason);
            if (x instanceof Promise) {
              x.then(resolve, reject);
            }
          } catch (error) {
            reject(error)
          }
        });
        return;
      }

      if (this.state === States.FULFILLED) {
        asyncFn(() => {
          try {
            const x = onResolved(this.value);
            if (x instanceof Promise) {
              x.then(resolve, reject);
            }
          } catch (error) {
            reject(error)
          }
        });
        return;
      }

      if (this.state === States.REJECTED) {
        asyncFn(() => {
          try {
            const x = onRejected(this.value);
            console.log(this.value)
            if (x instanceof Promise) {
              x.then(resolve, reject);
            }
          } catch (error) {
            reject(error)
          }
          return;
        });
      }
    });
  }
}

export default Promise;

