# Promise特性
* 构造函数：new Promise(resolve, reject)
* 三种状态：pending、fulfilled、rejected
* 方法：then、catch、finally；返回都是promise。
  
  ```js
  class MyPromise {
    construct(callback) {
      this.status = "pending"
      this.value = undefined
      this.reason = undefined
      this.onResolvedCallbacks = []
      this.onRejectedCallbacks = []

      const resolve = value => {
        this.value = value
        this.status = "fulfilled"
        this.onResolvedCallbacks.forEach((resolveCallback) => resolveCallback())
      }
      const reject = reason => {
        this.status = "rejected"
        this.reason = reason
        this.onRejectedCallbacks.forEach((rejectedCallback) => rejectedCallback())
      }

      callback(resolve, reject)
    }
    then(onResolved, onRejected) {
      return new MyPromise((resolve, reject) => {
        const resolveCallback = () => {
          try {
            resolve(onResolved(this.value))
          } catch(e) {
            reject(e)
          }
        }
        const rejectCallback = () => {
          try {
            resolve(onRejected(this.reason))
          } catch(e) {
            reject(e)
          }
        }
        if (this.status === 'fulfilled') {
          resolveCallback()
        }
        if (this.status === 'rejected') {
          rejectCallback()
        }
        if (this.status === 'pending') {
          this.onResolvedCallbacks.push(resolveCallback)
          this.onRejectedCallbacks.push(rejectCallback)
        }
      })
    }
    catch(onRejected) {
      return this.then(null, onRejected)
    }
    finally(onSettled) {
      return this.then(onSettled, onSettled)
    }
  }
  ```

  # Promise.all
  Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
  ```js
  static isPromise(value) {
    return value instanceof MyPromise || (typeof value === "object" && value !== null && typeof value.then === "function")
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      const values = []
      for(let i = 0; i < promises.length; i++) {
        if (!isPromise(promises[i])) {
          reject(new TypeError("Expected a Promise"));
        }
        promises[i].then(value => {
          values.push(value)
          if (i === promises.length - 1) {
            resolve(values)
          }
        }, reason => {
          reject(reason)
        })
      }
    })
  }
  ```
  # Promise.race
静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。这个返回的 promise 会随着第一个 promise 的敲定而敲定。

```js
static race(promises) {
  return new MyPromise((resolve, reject) => {
    for(let i = 0; i < promises.length; i++) {
      if (!isPromise(promises[i])) {
        reject(new TypeError("Expected a promise"));
      }
      promises[i].then(value => {
        resolve(value)
      }, reason => {
        reject(reason)
      })
    }
  })
}
```