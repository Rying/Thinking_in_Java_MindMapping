# es6知识集

## var, let, const
「var」
var声明的作用域是全局（window）的或局部（函数）的。
当var在函数外部声明时，作用域是全局的。var在函数中声明时，作用域是在函数体内。
var的问题：作用域是全局/函数，重复声明，会出现变量被窜改的问题。
```js
var greeter = 'hey hi';
var times = 4;
if (times > 3) {
  var greeter = 'say hello instead'
}
console.log(greeter); // 'say hello instead'
```
「let」
let是块作用域
let可以更新但不能在同一作用域重复声明
「const」
const与let类似，唯一不同是const声明的变量是恒定值。
变量提升：变量声明在引用之后
- var变量提升，变量值是undefined
- let变量提升，引用变量会报Reference Error
## this作用域
### 隐式上下文
有四个主要的this指向的上下文
- 全局上下文：在全局上下文，this指向全局对象，在浏览器中，global上下文是window。当在node中，全局上下文是global。
- 对象里的方法：方法中的this指向调用该方法的对象。
- 构造函数：方法中的this指向调用该方法的对象。
- DOM event handler：this指向event target。
箭头函数的this指向函数定义时所在的上下文对象。
### 显式上下文
使用call, apply, bind可以显示的决定this的指向。
call一个一个的传入参数
apply传入参数数组
```js
const book = {
  title: 'Brave New World',
  author: 'Aldous Huxley',
}

function summary() {
  console.log(`${this.title} was written by ${this.author}.`)
}

summary()
summary.call(book)
// or:
summary.apply(book)
```
call、apply都是一次使用的方法，调用时传入this。bind会返回绑定this之后的方法。
```js
const braveNewWorldSummary = summary.bind(book)

braveNewWorldSummary() // Brave New World was written by Aldous Huxley.
```
### 箭头函数
箭头函数的this指向定义时所在的上下文。
箭头函数没有自己的this绑定，其this指向它的外部的this。
在class中，箭头函数实际上是闭包，this指向class的实例。
出于相似的原因，箭头函数不能使用call、apply、bind来绑定this。
```js
class ArrowTest {
  constructor(name) {
    this.name = name
  }
  arrowFunc = () => {
    console.log("arrow:", this.name)
  }
  method() {
    console.log("method:", this.name)
  }
}
const arrowTest =  new ArrowTest("arrow")
const arrowFunc = arrowTest.arrowFunc
const normalFunc = arrowTest.method
arrowFunc()
normalFunc()
```
## Map
### Map
Map是包含key/value对的集合
添加值到map
```js
const m = new Map()
m.set('firstName', 'Luke')
m.set('lastName', 'Skywalker')
m.set('occupation', 'Jedi Knight')

```
Map的key可以是任意类型的数据。
还可以通过二维数组初始化Map。
```js
const map = new Map([
  ['firstName', 'Luke'],
  ['lastName', 'Skywalker'],
  ['occupation', 'Jedi Knight'],
])
```
Object转为Map
```js
const luke = {
  firstName: 'Luke',
  lastName: 'Skywalker',
  occupation: 'Jedi Knight',
}

const map = new Map(Object.entries(luke))
```
Map转为Object
```js
const obj = Object.fromEntries(map)
```
Map转为Array
```js
const arr = Array.from(map)
```
Map可以接受任何类型的值作为key，但是不允许重复。尽管Object可以接受number、boolean等primitive类型的值作为key，但是Objects会将key转化为string类型。**这一点很重要，因为Objects的key如果是对象，转为string之后都是[object, object]，因此所有key为object的属性值都是同一个**。
```js
// Create an object
const objAsKey = { foo: 'bar' }

// Use this object as the key of another object
const obj = {
  [objAsKey]: 'What will happen?'
}
// 输出
{[object Object]: "What will happen?"}

// ++++++++++ Map的情况 +++++++
// Create an object
const objAsKey = { foo: 'bar' }

const map = new Map()

// Set this object as the key of a Map
map.set(objAsKey, 'What will happen?')

// 输出
key: {foo: "bar"}
value: "What will happen?"

```


#### Map 和 Object的不同
Map的优点
- Size：Map有size属性。
- Iteration：Map天然可以迭代。
- Ordered：Map是有序的。
- 灵活性：Map的key可以是任意类型，Object的key会被转为string。
- Map有一些方法便于直接操纵keys。has(), size(), get(), delete(), clear()
Object的优点
- **JSON**: Object和Array可以通过JSON.parse(), JSON.stringify()方法处理JSON
- 直接访问属性值，无需通过get方法

## Closure 闭包
闭包是由函数以及声明该函数的词法环境（该环境包含了这个闭包创建时作用域内的任何局部变量）组合而成。闭包可以从内部函数访问外部函数的作用域。
词法作用域根据源码中声明变量的位置来确定该变量在何处可用。嵌套函数可以访问声明于外部作用域的变量。
### 柯里化
```js
function add(x) {
  return function (y) {
    return x+y
  }
}
const add5 = add(5)
const add10 = add(10)
console.log(add5(2)) //7
console.log(add10(5)) //12
```
### 实现封装
将函数与其所操作的某些数据关联起来，类似于面向对象编程。
闭包可以用来模拟私有方法。
```js
var Counter = (function() {
  var privateCounter = 0
  function changeBy(val) {
    privateCounter += val
  }
  return {
    increment: function() {
      changeBy(1)
    },
    decrement: function() {
      changeBy(-1)
    },
    value: function() {
      return privateCounter
    }
  }
})()
```
### 常见的问题，循环中的闭包
```html
<p id="help">Helpful notes will appear here</p>
<p>E-mail: <input type="text" id="email" name="email" /></p>
<p>Name: <input type="text" id="name" name="name" /></p>
<p>Age: <input type="text" id="age" name="age" /></p>
```
```js
function showHelp(help) {
  document.getElementById("help").innerHTML = help;
}

function setupHelp() {
  var helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" },
  ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i]; //i和item变量都是函数作用域
    document.getElementById(item.id).onfocus = function () {
      showHelp(item.help);
    }; // onfocus回调是一个闭包，item变量提升之后，循环结束后，i的值永远是2，item的值永远是“Your age (you must be over 16)”
  }
}

setupHelp();
```
解决方法：匿名闭包/使用let块级作用域
### 性能考量
尽可能不要用闭包，影响性能和内存消耗。
比如，在创建新的对象或类时，方法应该关联对象的原型，而不是定义到对象的构造器中，原因是每次构造器被调用时，方法都会被重新赋值一次。
```js
function MyObject(name, message) {
  this.name = name
  this.message = message
  // 不要在构造函数中定义对象的方法
  // this.getName = function() {
  //   return this.name
  // } 
  // this.getMessage = function() {
  //   return this.message
  // }
}
// 应该将方法关联到原型上
MyObject.prototype.getName = function () {
  return this.name;
};
MyObject.prototype.getMessage = function () {
  return this.message;
};
```
## 尾调用
定义：函数的最后一步是调用另一个函数。
函数调用会在内存形成一个“调用记录”。如果在函数A的内部调用函数B，那么在A的调用记录上方，还会形成一个B的调用记录。直到B调用结束，将结果返回A，调用记录才会消失。所有的调用记录，就形成一个“调用栈”。
尾调用由于是函数的最后一步，所以不需要保留外层函数的调用记录，这样将大大节省内存。

### 尾递归
函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
阶乘例子
```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1)
}
```
转为尾递归
```js
function factorial(n, total) {
  if (n === 1) return total
  return factorial(n - 1, n * total)
}
```
在 ES6 中，只要使用尾递归，就不会发生栈溢出，相对节省内存。
### 递归函数的改写
把所有用到的内部变量改写成函数的参数。