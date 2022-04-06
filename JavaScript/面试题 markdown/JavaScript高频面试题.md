## 谈谈你对闭包的理解

### 什么是闭包？

函数执行形成一个`私有上下文`，如果当前私有上下文中的`私有变量`有被外界所占用，那么当前`私有上下文`就不能出栈释放，随之里面的`私有变量`就被保存起来了，不能被外界所干扰，操作里面的变量`不会影响外界`，这种机制叫闭包。

### 用一句话说一下你对闭包的理解

闭包是函数运行时所产生的机制，当函数执行会形成一个`全新的私有上下文`，可以保护里面的私有变量不受外界干扰。

### 闭包产生的原因？

首先要明白作用域链的概念，其实很简单，在ES5中只存在两种作用域————全局作用域和函数作用域，`当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链`，值得注意的是，每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。 



闭包产生的本质就是，当前环境中存在指向父级作用域的引用。举下面的例子来说明：

```js
function f1() {
  var a = 2
  function f2() {
    console.log(a);//2
  }
  return f2;
}
var x = f1();
x();
```

这里x会拿到父级作用域中的变量，输出2。因为在当前环境中，含有对f2的引用，f2恰恰引用了window、f1和f2的作用域。因此f2可以访问到f1的作用域的变量。

那是不是只有返回函数才算是产生了闭包呢？

回到闭包的本质，我们只需要让父级作用域的引用存在即可，因此我们还可以这么做：

```js
var f3;
function f1() {
  var a = 2
  f3 = function() {
    console.log(a);
  }
}
f1();
f3();
```

让f1执行，给f3赋值后，等于说现在`f3拥有了window、f1和f3本身这几个作用域的访问权限`，还是自底向上查找，`最近是在f1`中找到了a,因此输出2。

在这里是外面的变量`f3存在着父级作用域的引用`，因此产生了闭包，形式变了，本质没有改变。

### 闭包有哪些表现形式？

1. 在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。

```js
// 定时器
setTimeout(function timeHandler(){
  console.log('111');
}，100)

// 事件监听
$('#app').click(function(){
  console.log('DOM Listener');
})
```

2. IIFE(立即执行函数表达式)创建闭包, 保存了`全局作用域window`和`当前函数的作用域`，因此可以使用全局的变量。

```js
var a = 2;
(function IIFE(){
  // 输出2
  console.log(a);
})();
```



3. for循环中有异步任务，当每次for循环时，应该用立即执行函数把此时的i变量传递到定时器中

先来看下面这样一段代码，如何解决它？

```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function timer(){
    console.log(i)
  }, 0)
}
```

为什么会全部输出6？如何改进，让它输出1，2，3，4，5？(方法越多越好)

因为setTimeout为宏任务，由于JS中单线程eventLoop机制，在主线程同步任务执行完后才去执行宏任务，因此循环结束后setTimeout中的回调才依次执行，但输出i的时候当前作用域没有，往上一级再找，发现了i,此时循环已经结束，i变成了6。因此会全部输出6。

解决方案利用立即执行函数创建闭包的保存机制，把每次保存的`i变量`传递到定时器中

```js
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```

4. 柯理化/惰性函数/componse函数/释放不释放/垃圾回收机制，都是闭包的表现形式。

### 闭包的缺点是什么，怎么解决？

大量的是用闭包，会导致内存泄漏问题，导致当前上下文不能被出栈释放。

解决方案：

- 手动释放内存，其实就是解除占用（手动赋值为null即可）
- 堆内存的垃圾回收机制：
  - 引用计数（IE为主）：在某些情况下会导致计数混乱，这样会造成内存不能被释放（内存泄漏）
  - 检测引用(占用)/标记清除（谷歌为主）：浏览器在空闲时候会依次检测所有的堆内存，把没有被任何事物占用的内存释放掉，以此来优化内存。

## 常用的数据类型检测方法有哪些，以及它们的优缺点？

### 1. typeof 是否能正确判断类型？

对于原始类型来说，除了 null 都可以调用typeof显示正确的类型。

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
```

但对于引用数据类型，除了函数之外，都会显示`object`。

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

因此采用typeof判断对象数据类型是不合适的，采用`instanceof`会更好，`instanceof`的原理是基于原型链的查询，只要处于原型链中，判断永远为true

```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str1 = 'hello world'
str1 instanceof String // false

var str2 = new String('hello world')
str2 instanceof String // true
```

### 2. instanceof能否判断基本数据类型？

能。比如下面这种方式:

```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number'
  }
}
console.log(111 instanceof PrimitiveNumber) // true
```

> **Symbol.toPrimitive**： 该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值

> 其实在`数据类型类型转换时`的真正过程是，先调用`[Symbol.toPrimitive]`方法，再根据情况调用`obj.toString`和`obj.valueOf`将其转换为原始值类型

### 3. 能不能手动实现一下instanceof的功能？

核心: 原型链的向上查找。

```js
function _instanceof(left, right) {
	let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto === null) {
			return false;
    }
    if (proto === right.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}
```

## Object.is 和 === 的区别

- **===**：es5中的严格相等运算符
- **Object.is**：ES6中的严格相等运算符

```js
+0 === -0;  // true
NaN === NaN; // false

Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
```

