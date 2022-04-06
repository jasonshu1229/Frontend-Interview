## instanceof的机制

大家都知道**instanceof**是用来检测某个实例是否属于这个类，那么知道它的底层检测机制吗？

它检测的底层机制：

> 只要当前类的原型，出现在当前实例的原型链**____proto____**上，那么**instanceof**的结果就是true，否则就是false

### instanceof执行的步骤

**instanceof (instanceObject, classFunc)**

- **instanceObject**：要检测的实例对象
- **classFunc**：要检测类

> 步骤1：先取得当前类的原型，当前实例对象的原型链
>
> 步骤2：一直循环（执行原型链的查找机制）
>
> - 取得当前实例对象原型链的原型链（**proto = proto.____proto____**，沿着原型链一直向上查找）
>
> - 如果 当前实例的原型链**____proto__**上找到了当前类的原型**prototype**，则返回 true
> - 如果 一直找到**Object.prototype.____proto____ ==  null**，Object的基类(null)上面都没找到，则返回 false

### 手写instanceof实现原理

下面用代码来实现以上过程：

```js
function _instanceof (instanceObject, classFunc) {
	let classFunc = classFunc.prototype; // 取得当前类的原型
  let proto = instanceObject.__proto__; // 取得当前实例对象的原型链
  
  while (true) {
    if (proto === null) { // 找到了 Object的基类 Object.prototype.__proto__
      return false;
		};
    if (proto === classFunc) { // 在当前实例对象的原型链上，找到了当前类
      return true;
    }
    proto = proto.__proto__; // 沿着原型链__ptoto__一层一层向上查找
  }
}
```

但是这个方法中的 **____proto____**查找机制在IE浏览器中是不兼容的，所以我们会改写一下。

在改写之前，我们先学习一下 **Object.getPrototypeOf（）**的应用

> **Object.getPrototypeOf ( )：**用来获取某个实例对象的原型（内部**[[prototype]]**属性的值，包含**proto**属性）

所以，来用它改写一下：

```js
function _instanceof (instanceObject, classFunc) {
	let classFunc = classFunc.prototype; // 取得当前类的原型
  let proto = Object.getPrototypeOf(instanceObject); // 取得当前实例对象的原型链上的属性
  
  while (true) {
    if (proto === null) { // 找到了 Object的基类 Object.prototype.__proto__
      return false;
		};
    if (proto === classFunc) { // 在当前实例对象的原型链上，找到了当前类
      return true;
    }
    proto = Object.getPrototypeOf(proto); // 沿着原型链__ptoto__一层一层向上查找
  }
}
```

### Object.getPrototypeOf的应用

接下来，我们用自己写的方法，输出两道题

```js
console.log(_instanceof([12, 23], Array)); // true
console.log(_instanceof(/$/, Array)); // false
```

获取某个实例对象的原型

> **Object.getPrototypeOf （）**

```js
Object.getPrototypeOf(/$/); // {constructor: ƒ RegExp(), ..., __proto__: Object}
Object.getPrototypeOf(Object.getPrototypeOf(/$/)); // {constructor: ƒ Object(),  …}

Object.getPrototypeOf(Object.prototype); // null
```

通过查找正则实例对象的原型，就可以看出来是一层层向上查找，直到找到**Object.prototype.____proto____**

### instanceof是由什么实现的？

```js
console.log([] instanceof Array); // true
```

那我们就来dir（Array）一下，看看Array内置类的属性上都有什么

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gi7q3us0smj30rw0sa0xh.jpg" style="zoom:50%;" />

由上图可见在**Function.prototype**原型上：有一个**Symbol.hasInstance（）**方法

```js
console.log([] instanceof Array); // true

// 浏览器内部其实是基于 Symbol.hasInstance检测的  等同于
console.log(Array[Symbol.hasInstance]([])); // true
```

