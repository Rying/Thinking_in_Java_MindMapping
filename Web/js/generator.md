# generator
generator方法返回一个可迭代的对象。
## generator方法（*）
```js
function* generatorFunction() {
  return 'Hello, Generator!'
}
```
```js
const generator = generatorFunction();
```
generator不是一个string，而是一个suspended状态的对象。
```js
generatorFunction {<suspended>}
  __proto__: Generator
  [[GeneratorLocation]]: VM272:1
  [[GeneratorStatus]]: "suspended"
  [[GeneratorFunction]]: ƒ* generatorFunction()
  [[GeneratorReceiver]]: Window
  [[Scopes]]: Scopes[3]
```
该对象是迭代器，该对象有next()方法，可以遍历一序列的值。next()方法返回一个包含value和done属性的对象。
## yield操作符
yield操作符可以中断generator方法并返回yield后面的值，提供一种轻量的遍历所有值的方式。
当对generator对象调用next()，会在每次遇到yield关键字的时候中断，done值为false，预示着generator还没有执行完成，直到其遇到return/或者后面再未遇到yield，done值会变成true。如果generator方法没有返回值，最后一次迭代会返回{value: undefined, done: true}。
可以通过主动调用return()方法来提前关闭gerator。
```js
function* generatorFunction() {
  yield 'Neo'
  yield 'Morpheus'
  yield 'Trinity'
}

const generator = generatorFunction()
generator.next()
generator.return('There is no spoon!')
generator.next()

// 输出
{value: "Neo", done: false}
{value: "There is no spoon!", done: true}
{value: undefined, done: true}
```
通过调用throw方法，会注入一个error到generator，如果generator方法里面有try/catch，会被catch住，否则，error不会被捕获。

## generator对象的方法和状态
方法：
- next()，返回迭代器下一个值
- return()，返回一个值，并结束迭代
- throw()，抛出一个error，并结束迭代
状态：
- suspended，中断未执行完状态
- closed，迭代完成状态，可以是调用return()，throw()，或迭代结束。

## yield代理
yield\*表达式可以代理另一个迭代器。
```js
function* delegate() {
  yield 3
  yield 4
}
function* begin() {
  yield 1
  yield 2
  yield* delegate()
}
```
yield\*后面跟着的值必须是iterable对象。
可以用扩展运算符读取generator的迭代器。

## 传值到generator方法
除了生成值，generator方法还会消费通过next()方法传入的值。
第一次调用next()方法不会传入一个值，只会启动生成器。
```js
function* generatorFunction() {
  console.log(yield)
  console.log(yield)

  return 'The end'
}

const generator = generatorFunction()
generator.next(5)  
generator.next(100)
generator.next(200)

// 输出
100
200
{value: "The end", done: true}
```
可以给generator方法传入一个初始值。

```js
function* generatorFunction(value) {
  while (true) {
    value = yield value * 10
  }
}

// Initiate a generator and seed it with an initial value
const generator = generatorFunction(1)

for (let i = 0; i < 5; i++) {
  console.log(generator.next(i).value)
}

// 输出
10
10
20
30
40
```
## generator 运用到异步
因为generator可以中断代码执行，比起回调，yield代码可读性更强。为了让异步调用看上去像同步，便于代码维护，可以用generator函数模拟async/await。
```js
asyncAlt(generator)

function asyncAlt(generatorFunction) {
  // return a function
  return function() {
    const generator = generatorFunction()

    function resolve(next) {
      if (next.done) {
        return Promise.resolve(next.value)
      }
      // if there is still value to yield, they are promises and must be resolved.
      return Promise.resolve(next.value).then(response => {
        return resolve(generator.next(response))
      })
    }
    // begin resolve promises
    return resolve(generator.next())
  }
}
```


