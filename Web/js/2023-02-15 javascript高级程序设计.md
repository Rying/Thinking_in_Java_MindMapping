
- [javascript组成部分](#javascript组成部分)
- [在html中使用javascript](#在html中使用javascript)
  - [使用元素](#使用元素)
    - [标签的位置](#标签的位置)
  - [考虑禁用javascript的场景](#考虑禁用javascript的场景)
- [基本概念](#基本概念)
  - [语法](#语法)
    - [严格模式](#严格模式)
    - [语句](#语句)
  - [数据类型](#数据类型)
    - [typeof](#typeof)
      - [undefined](#undefined)
      - [null](#null)
      - [boolean](#boolean)
      - [number](#number)
      - [String](#string)
    - [操作符](#操作符)
      - [一元操作符](#一元操作符)
  - [流控制语句](#流控制语句)
    - [if语句](#if语句)
    - [switch语句](#switch语句)
  - [函数](#函数)
    - [传参](#传参)
    - [没有重载](#没有重载)
- [变量、作用域和内存问题](#变量作用域和内存问题)

# 历史
最初是解决表单验证

## javascript组成部分
- 核心（ECMAScript）:对实现该标准规定的各个方面内容的语言的描述。平台无关
- 文档对象模型（DOM）：无需重新加载网页，即可实现修改其外观和内容。
- 浏览器对象模型（BOM）：控制浏览器显示的页面以外的部分，随着html5，BOM实现的细节有望朝着兼容性越来越高的方向发展

# 在html中使用javascript
## 使用<script>元素
<script>定义了6个属性。
* async: 表示应该立即下载脚本，下载期间不影响页面dom解析，脚本下载完成会立即执行，加载期间，如果domContentLoad之前，会阻塞后续dom解析。可能会在domContentLoad事件之后，不保证脚本加载顺序。一定会在页面的load事件之前执行。
* defer: 表示脚本可以延迟到文档完全被解析和显示之后再执行。会立即下载，下载期间不影响dom解析。下载完成后会等待dom解析和显示之后，在domContentLoad事件之前**按顺序**执行。
* src: 表示包含要执行代码的外部文件。
>> 需要注意的是，带有src属性的<script>元素不应该在其<script>和</script>标签之间再包含额外的js代码。如果包含了嵌入的代码，则只会下载并执行外部脚本文件，嵌入的代码会被忽略。
### 标签的位置
为了避免js加载延迟导致白屏，现代web应用程序一般都把全部js引用放在<body>元素中页面的内容后面。
## 考虑禁用javascript的场景
在"<noscript>"元素中的内容只有在下列情况下才会显示出来：
* 浏览器不支持脚本
* 浏览器支持脚本，但脚本被禁用

# 基本概念
## 语法
### 严格模式
ES5引入了严格模式（strict），在严格模式下，es3中不确定的行为将得到处理，不安全的操作也会抛错.
```
"use strict" //编译指示，告诉js引擎切换到严格模式
```
### 语句
语句结尾的分号不是必须的，但不推荐。
## 数据类型
ES的变量是松散类型的。
使用“var”操作符定义的变量将成为定义该变量的作用域中的**局部变量**
```
function test() {
  var message = "hi"; //局部变量
}
test();
alert(message); //错误！
```
省略var操作符可以定义全局变量，不推荐！
ES中有
* 五种简单数据类型（也称为基本数据类型）：undefined、null、boolean、string、number
* 一种复杂数据类型：object

### typeof
用来检测给定变量的数据类型，返回的是以下字符串之一：
“undefined” —— 如果这个值未定义
“string” —— 如果这个值是字符串
“number” —— 如果这个值是数字
“boolean” —— 如果这个值是布尔值
“object” —— 如果这个值是对象或null
“function” —— 如果这个值是函数

#### undefined
包含undefined值的变量与尚未定义的变量还是不一样的。
```
var message; //这个变量声明之后默认取得了undefined值

alert(message); //undefined
alert(age); //产生错误，age未声明
```
但是，对于未初始化的变量执行typeof操作符会返回"undefined"，而对未声明的变量执行typeof操作符同样返回"undefined"。
```
var message; //这个变量声明之后默认取得了undefined值

alert(typeof message); //"undefined"
alert(typeof age); //"undefined"
```
#### null
null值表示空**对象**指针，这也是为啥typeof操作符检测null值会返回“object”的原因。
```
var car = null;
alert(typeof car); // "object"
```
undefined值派生自null值，因此，相等性测试返回true。
```
alert(undefined == null); //true
```
没必要显示地设置undefined值，但如果在意保存对象的变量还未真正保存对象，则应让该变量保存null值。
#### boolean
只有两个字面量值：true和false

|  数据类型  |  转换为true的值  |  转换为false的值  |
|  ------  |  ------  |  ------  |
|  Boolean  |  true  |  false  |
|  String  |  任何非空字符串  |  ""(空字符串)  |
|  Number  |  任何非0数字（包括无穷大）  |  0和NaN  |
|  Object  |  任何对象  |  null  |
|  Undefined  |  n/a(not applicable)  |  undefined  |
#### number
使用IEEE754格式来表示整数和浮点数。
最基本的是十进制数
```
+0 === -0 //true
```
八进制数，在严格模式下无效，会导致js引擎抛出错误。
八进制字面量第一位必须是0，然后是八进制数序列（0-7）。
十六进制字面量的前两位必须是0x，后跟任何十六进制数字（0-9以及A-F）

数值转换
有三个函数可以将非数值转换为数值：Number()、parseInt()、parseFloat。
Number()可以用于任何数据类型，parseInt和parseFloat用于把字符串转为数值。
Number的转换规则如下：
* 如果是Boolean值，true和false值分别转换为1和0.
* 如果是数字值，只是简单的传入和返回。
* 如果是null，返回0。
* 如果是undefined，返回NaN。
* 如果是字符串，则满足以下规则：
  * 如果字符串是纯数字，则转为数字
  * 如果字符串包含有效的十六进制，则转为十六进制
  * 如果字符串是空的，则为0.
  * 如果字符串包含除上述以外格式的字符，则为NaN。
```
Number("hello") // NaN                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
Number("") //0
Number("0011") //11
Number(true) //1
```
> 一元+操作符的转换规则同Number
parseInt(): 忽略字符串前面的空格，如果第一个非空格字符(包括小数点.)是数字字符，则继续往后解析，直到遇到非数字字符;也能解析其他整数格式，并转换成十进制数。
```
parseInt("12Name") //12
Number("12Name") //NaN

parseInt("   ") // NaN
Number("   ") // 0
```
parseInt(字符串，2｜8｜10｜16) //第二个参数是x进制，基数
parseFloat与parseInt的区别：
1. 会解析第一个"."，遇到第二个"."会终止。
2. 不指定基数，只能转成10进制数。
3. 如果字符串包含的是整数，则返回整数。

#### String
toString(): null和undefined不能使用此方法
String()
加操作符

### 操作符
#### 一元操作符
『递增递减操作符』
```
var number1 = 3
var number2 = 20

number2 + ++number1 // 24; number1: 4
--number1 + number2 //23; number1:3
number2 + number1-- // 23; number1:2
number2 + (number1++) //22; number1: 3

var s1 = '2'
var s2="x"
var b=false;
var f=1.1;
var o = {
  valueOf: function() {
    return -1;
  }
}

s1++; //值变为3
s2++; // 值变为NaN
b++; //值变成数值1
f--; //值变成0.10000000000
o--; //值变成-2
```
『布尔操作符』
1. 逻辑非操作符（!）：可以将一个值转为其对应的布尔值，同时使用两个逻辑非操作符，和Boolean()效果等同。
2. 逻辑与操作符（&&）
逻辑与操作符可以应用于任何类型的操作数，而不仅仅是布尔值；在有一个操作数不是布尔值的情况下，逻辑与操作符不一定返回布尔值；此时，遵循以下规则：
* 如果第一个操作数是对象，则返回第二个操作数；
* 如果第二个操作数是对象，则只有在第一个操作数的求值结果为true的情况下才会返回该对象；
* 如果两个操作数都是对象，则返回第二个操作数；
* 如果有一个操作数是null，则返回null；
* 如果有一个操作数是NaN，则返回NaN；
* 如果有一个操作数是undefined，则返回undefined；
逻辑与操作属于短路操作，即如果第一个操作数能决定结果，那么就不会再对第二个操作数求值.
```
{a:1} && {b:2} //值为{b:2}
{a:1} && null //值为null
{a:1} && undefined //值为undefined
{a:1} && NaN //值为NaN
```
3. 逻辑或操作符（||）
   与逻辑与操作符类似，如果有一个操作数不是布尔值，逻辑或也不一定返回布尔值；此时，遵循以下规则：
   * 如果第一个操作数是对象，则返回第一个操作数；
   * 如果第一个操作数的求值结果为false，则返回第二个操作数；
   * 如果两个操作数都是对象，则返回第一个操作数；
   * 如果两个操作数都是null，则返回null；
   * 如果两个操作数都是NaN，则返回NaN；
   * 如果两个操作数都是undefined，则返回undefined；
逻辑非也属于短路操作，如果第一个操作数的求值结果为true，就不会对第二个操作数求值了
「乘性操作符」
1. 乘法操作符
   * 如果操作数都是数值，执行常规的乘法计算
   * 如果一个操作数是NaN，则结果是NaN
   * Infinity与0相乘，结果是NaN
   * Infinity与非0相乘，结果是Infinity或-Infinity；Infinity与Infinity相乘，结果是Infinity
   * 如果有一个操作数不是数值，则在后台调用Number()将其转成数值，再遵循以上规则

```
var r = {a: 1}
r * 2 // NaN
```
2. 除法
   * 如果操作数都是数值，执行常规的除法计算
   * 如果一个操作数是NaN，则结果是NaN
   * 如果是Infinity被Infinity除，则结果是NaN
   * 如果是零被零除，则结果是NaN
   * 如果是非零的有限数被零除，则结果是Infinity或-Infinity，取决于有符号操作数的符号；
   * 如果是Infinity被任何非零数值除，则结果是Infinity或-Infinity，取决于有符号操作数的符号；
   * 如果有一个操作数不是数值，则在后台调用Number()将其转换为数值，然后再应用上面的规则
3. 加法
   * 如果一个操作数是NaN，则结果是NaN
   * 如果是Infinity加Infinity，则结果是Infinity
   * 如果是Infinity+(-Infinity)，则结果是NaN
   * 如果是-Infinity+(-Infinity)，则结果是-Infinity
   * 如果有一个操作数是字符串，则进行字符串拼接；如果有另一个操作数是对象、数值或布尔值，则调用它们的toString()方法取得相应的字符串值，再进行字符串拼接；如果是null||undefined，则分别调用String()函数并取得字符串"null"和"undefined"，再进行字符串拼接
```
5+5 //10
5+'5' //'55'

var num1 = 5
var num2 = 10
var message = "The sum of 5 and 10 is " + num1 + num2; // 'The sum of 5 and 10 is 510'
var message = "The sum of 5 and 10 is " + (num1 + num2); // 'The sum of 5 and 10 is 15'

var val
val + '5' // "undefined 5"
```
4. 减法
  * 如果两个操作符都是数值，则执行常规的算术减法操作并返回结果；
  * 如果有一个操作数是NaN，则结果是NaN；
  * 如果是Infinity减Infinity，结果是NaN；
  * 如果是-Infinity减-Infinity，结果是NaN；
  * 如果是Infinity减-Infinity，结果是Infinity；
  * 如果是-Infinity减Infinity，结果是-Infinity；
  * 如果有一个操作数是字符串、布尔值、null或undefined，则先在后台调用number()函数将其转为数值，然后再根据前面的规则执行减法计算。如果转换的结果是NaN，则减法的结果就是NaN
  * 如果有一个操作数是对象，则先用valueOf()取得表示该对象的数值。如果得到的值是NaN，则减法的结果就是NaN。如果对象没有valueOf()方法，则调用其toString()方法并将得到的字符串转换为数值。

```
5 - true // 4
NaN - 1 // NaN
5 - '2' // 3
5 + '2' // '52'
5 - null // 5
5 + null // 5

```

## 流控制语句
### if语句
if的condition（条件语句）可以是任意表达式，表达式的结果不一定是布尔值；es会自动调用Boolean()转换函数将表达式的结果转换为一个布尔值。
### switch语句
```
switch(expression) {
  case value: statement
    break;
  case value: statement
    break;
  case value: statement
    break;
    default: statement
}
```
如果表达式(expression)等于这个值(value)，则执行后面的语句(statement)
expression可以是常量，value可以是变量或表达式
switch语句比较时使用的是全等操作符
## 函数
### 传参
es函数不介意传递进来多少个参数，也不在乎传进来参数是什么数据类型。原因是es中的参数在内部是用一个数组arguments来表示的。

```
function doAdd(num1, num2) {
  arguments[1] = 10
  console.log('num2:', num2)
  console.log('arguments[1]:', arguments[1])
  num2 = 20
  console.log('num2:', num2)
  console.log('arguments[1]:', arguments[1])
}

doAdd(1, 2)
输出：
num2:10
arguments[1]:10
num2:20
arguments[1]:20

doAdd(1)
输出：
num2:undefined
arguments[1]:10
num2:
arguments[1]:10
```
如果只传入一个参数，那么arguments[1]设置的值不会反应到命名参数中。这是因为arguments对象的长度是由传入的参数个数决定的，不是由定义函数时的命名参数个数决定的。
> es中的所有参数传递的都是值，不可能通过引用传递参数。
### 没有重载
如果在es中定义了两个名字相同的函数，则该名字属于后定义的函数。

# 变量、作用域和内存问题
## 变量
### 保存方式
我们可以给引用类型动态的添加和删除属性，但不能动态的给基础类型值添加或删除属性。
```
var name = "Nicolas";
name.age = 20
alert(name.age) //undefined
```
### 复制变量值
复制基本类型的值，会在变量上创建一个新值，然后把该值复制到新变量分配的位置。
引用类型值的复制，复制的是指针，指向存储在堆中的一个对象。两个变量实际将引用同一个对象，改变一个变量，会影响另一个变量.

### 传递参数
es中所有函数的参数都是按值传递的，也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。
```
function setName(obj) {
  obj.name = "Nicolas"
  obj = new Object()
  obj.name = "Greg"
}

const obj = {}
setName(obj)
alert(obj.name) //"Nicolas"
```

### 检测类型
typeof用来检测基本数据类型。
如果变量的值是object或null，则typeof的返回值是"object"
instanceof操作符用来检测引用类型。

## 执行环境和作用域
执行环境定义了变量或函数有权访问的其他数据，每个执行环境都一个与之关联的变量对象，环境中定义的所有函数和变量都保存在这个对象中。
全局执行环境是最外围的一个执行环境，与宿主环境有关。web浏览器中，全局执行环境被认为是window对象。执行环境中的所有代码执行完毕后，该环境被销毁。
每个函数都有自己的执行环境。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。函数执行之后，栈将其环境弹出。
当代码在一个环境中执行时，会创建变量对象的一个作用域链，以确保执行环境有权访问的所有变量和函数有序访问。内部环境可以通过作用域链访问所有的外部环境，但外部环境不能访问内部环境中的任何变量和函数。

### 没有块级作用域
使用var声明的变量会被添加到最接近的执行环境中，在函数内部，最接近的环境就是函数的局部环境。
```
for(var i=0; i< 10; i++) {
  doSomething(i)
}
alert(i) //10
```
## 垃圾收集

* 垃圾收集器按照固定的时间间隔，周期性地执行这一操作。
* 标记清除：给内存中的所有变量都加上标记。
* 引用计数：跟踪记录每个值被引用的次数，释放引用次数为零的值所占用的内存。易导致循环引用





