```js
function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function () {
  console.log('wangwang');
}
Dog.prototype.sayName = function () {
  console.log('my name is ' + this.name);
}
/*
let sanmao = new Dog('三毛');
sanmao.sayName();
sanmao.bark();
*/
function _new() {
  //=>完成你的代码
}
let sanmao = _new(Dog, '三毛');
sanmao.bark(); //=>"wangwang"
sanmao.sayName(); //=>"my name is 三毛"
console.log(sanmao instanceof Dog); //=>true
```

上面的代码为阿里的一道面试题，让我们自己来实现以下内置**new**的方法：

在实现之前，我们来回顾一下**new**的执行过程，都完成了什么

> 1. 创建一个Func类的实例对象 （实例.____proto__ = 类.prototype）
> 2. 把Func当做普通函数执行 （核心：让方法中的**this**指向创建类的实例）
> 3. 分析函数执行的返回值
>    - 没有返回值，或返回值是原始值类型，则默认都返回**创建的实例对象**
>    - 有返回值且是引用类型时，以函数自身返回的复杂类型值为主

### 实现基础版new

对照着下面没注释的代码，在回顾下，new的执行过程，照着执行过程，写出以下代码：

> 步骤1：创建一个Func的实例对象（实例.____proto____ = 类.prototype）
>
> 步骤2：把Func当做普通函数执行，并改变**this**指向
>
> 步骤3：分析函数的返回值

```js
/**
  * Func: 要操作的类（最后要创建这个类的实例）
  * args：存储未来传递给Func类的实参
  */
function _new(Func, ...args) {
  
  // 创建一个Func的实例对象（实例.____proto____ = 类.prototype）
  let obj = {};
  obj.__proto__ = Func.prototype;
  
  // 把Func当做普通函数执行，并改变**this**指向
  let result = Func.call(obj, ...args);
  
  // 分析函数的返回值
  if (result !== null && /^(object|function)$/.test(typeof result)) {
    return result;
	}
  return obj;
}
```

因为在IE浏览器中，禁止我们使用**____proto____**

（也可以理解为IE并没有给我们提供这个属性，防止手动去修改原型只想问题）

（然而谷歌浏览器实现**____proto___**机制，完成原型链查找）

### 优化版new

```js
let x = { name: "lsh" };
Object.create(x);

{}.__proto__ = x;
```

> 核心：Object.create ([ OBJECT ])
>
> - 创建一个空对象x，并且把**【OBJECT】**(这个值需要是一个对象)，作为新对象**x**的原型指向
> - **x.proto = [ OBJECT ]**
>
> 注意：
>
> ​	-  **Object.create(null)**：创建一个没有原型、原型链的空对象（不是任何类的实例）

那我们来基于这个核心点来优化一下：

```js
function _new(Func, ...args) {
  
  // let obj = {};
  // obj.__proto__ = Func.prototype;
  let obj = Object.create(Func.prototype);
  
  let result = Func.call(obj, ...args);
  
  if (result !== null && /^(object|function)$/.test(typeof result)) {
    return result;
  }
  return obj;
}
```

但是有的面试官，又会问，这个**Object.create()**在新版本中不支持怎么办？

那我们就自己给它实现一个呗？来看下面代码：

## Object.create的特点

来回顾一下**Object.create**创建对象和直接**let**一个**空对象**有什么区别？

```js
let obj1 = {};
console.log(Object.getPrototypeOf(obj1)); 
// { constructor: ƒ Object(), hasOwnProperty: ƒ hasOwnProperty() ...}

let obj2 = Object.create(null);
console.log(Object.getPrototypeOf(obj2)); // null
```

很明显看出，**Object.create(null)**创建的对象没有**任何属性**，是一个非常纯粹的对象

结合下面的实现来看，因为**（null）**传的是null，所以实例空对象的原型链指向为空，所以自然没有了原型属性

> `Object.getPrototypeOf()`：方法返回指定对象的原型。（内部Object.prototype上的属性）

## Object.create实现

我们写的这个方法不支持null的处理

回顾**Object.create()**的执行过程，对照着步骤：
把传递来的对象，当做空对象的原型链**____proto__**指向，所以选择，形参选择**prototype**更合适一些

> 步骤1：排除传入的对象是 null 和 非object 的情况
>
> 步骤2的目标： 让空对象的**____proto__**指向 传进来的 对象(**prototype**)
>
> - 创建一个(空)类，并且创建这个类的实例 （默认：实例.____proto___ = 类.prototype）
> - 然后让**类.prototype = 传进来的对象**(**prototype**)
> - 最后返回 new 类
>
> `发现此时返回的 new 类中，{}.__proto__ = 的对象 已经被改成了 传进来的对象`
>
> `所以 {}.__proto__ = prototype`

```js
Object.create() = function create(prototype) {
  // 排除传入的对象是 null 和 非object的情况
	if (prototype === null || typeof prototype !== 'object') {
    throw new TypeError(`Object prototype may only be an Object: ${prototype}`);
	}
  // 让空对象的 __proto__指向 传进来的 对象(prototype)
  // 目标 {}.__proto__ = prototype
  function Temp() {};
  Temp.prototype = prototype;
  return new Temp;
}
```

最终结果：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gi7mozdtlwj3090034t8u.jpg)