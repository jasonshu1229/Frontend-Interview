### call的出现

在讲**call**之前，我们先看下面这样代码：

```js
let obj = {
	name: 'OBJ'  
};

function fn (x, y) {
	console.log(this, x + y); 
  return '@';
}

console.log(obj.fn(10, 20)); // TypeError: obj.fn is not a function
```

我们可以发现，**obj**中并没有**fn**这个函数属性，所以会报错。

就是因为这一点给我们提供了**call**方法的实现思路，可以把**fn**函数当做**obj**的属性来执行，具体怎么实现会在下文解释。

### call的用法

用法：执行函数并改变this指向

- 第一个参数：要改变的函数中的this指向，写谁就是谁

（非严格模式下：传递 null，undefined指向的是window）

- 第二个参数：给函数传递的实参信息

```js
let obj = {
	name: 'OBJ'  
};

function fn (x, y) {
	console.log(this, x + y); 
  return '@';
}

let res = fn.call(obj, 10, 20);
console.log(res); // {name: "OBJ"} 30
```

> **fn.call**的执行过程
>
> 步骤1：fn 首先基于**____proto__**找到**Function.prototype.call**，并且让call方法执行
>
> 步骤2：**call**方法执行中（this：fn），把**fn**函数执行，并且把**fn中的实参**传递进去
>
> 步骤3：接受**fn**函数执行的返回结果，并把其返回结果作为**call**方法的返回值

### call的实现过程原理

根绝上面的执行过程，我们来归纳一下**call**的实现过程

> **call**实现原理 
>
> 如何让 **fn**中的this 变为 obj呢 
>
> 步骤1：**obj.fn（）**需要保证**fn**函数作为**obj**中某个成员的属性值（obj.fn ( ) ）
>
> 步骤2：赋值 **obj.fn = fn**，并且让**obj.fn（）**执行 
>
> ​	（把函数作为要改变的this对象的一个成员属性，然后基于对象的成员访问，执行函数，传递实参）
>
> 步骤3：**delete**成员属性，返回 **fn**函数的执行结果，作为**call**函数的返回值

### 简易版手写call

```js
/**
 * context: 要改变的函数中的this指向，写谁就是谁
 * args：传递给函数的实参信息
 * this：要处理的函数 fn
 */
Function.prototype.call = function(context, ...args) {
	//  null，undefined，和不传时，context为 window
  context = context == null ? window : context;
  
  let result;
  context['fn'] = this; // 把函数作为对象的某个成员值
  result = context['fn'](...args); // 把函数执行，此时函数中的this就是
	delete context['fn']; // 设置完成员属性后，删除
  return result;
}
```

细心地同学可以发现，在开头，用了两个**==**来取出 null 和 undefined的情况。

那是因为：

> 说明：null与undefined

```js
console.log(undefined == null); // true;
console.log(undefined === null); // false;
```

实现了我们自己的**call**方法后，试试是否有正确的输出结果：

```js
console.log(fn.call(obj, 10, 20)); 
// {name: "OBJ", fn: ƒ} 30
// @
```

从下图可以看出，先执行的**fn**函数，后删除的**成员属性**，但是在浏览器的控制台里输出的是最终结果。

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gi7wh9qro7j30ju07a758.jpg" style="zoom: 50%;" />

## 不完善地方

但是上面那个简写版仍有很多不足。比如：

#### 弊端1：context必须是对象类型

```js
let a = 10;

function fn (x, y) {
	console.log(this, x + y); 
  return '@';
}

let res = fn.call(a, 10, 20);
console.log(res);  // TypeError: context.fn is not a function
```

因为要改变的函数中的**this**值为，10，基础类型，所以不能往**基础类型**的值添加属性，

> 故要改变的**this**指向，必须为对象或函数类型！！

### 解决方法：把**基础类型**变为对象类型

```js
console.log(new Number(10));  // Number {10}
console.log(new String(""));  // String {""}

(10).constructor() => Number() { [native code] }
```

> **context.constructor( ) 当前值所属的类**
>
> **context  =  new context.constructor（context）**

```js
/**
 * context: 要改变的函数中的this指向，写谁就是谁
 * args：传递给函数的实参信息
 * this：要处理的函数 fn
 */
Function.prototype.call = function(context, ...args) {
	//  null，undefined，和不传时，context为 window
  context = context == null ? window : context;
  
  // 必须保证 context 是一个对象类型
  let contextType = typeof context;
  if (!/^(object|function)$/i.test(contextType)) {
  	context = new context.constructor(context); // 不适用于 Symbol/BigInt
	}
  
  let result;
  context['fn'] = this; // 把函数作为对象的某个成员值
  result = context['fn'](...args); // 把函数执行，此时函数中的this就是
	delete context['fn']; // 设置完成员属性后，删除
  return result;
}
```

但是如果`context`是**symbol或者bigInt**类型，是不允许被**new**的，比如看下面的图片：

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1giccizyierj30ou0g2jts.jpg" style="zoom:67%;" />

我们可以用：

>**Object (context)**：构造函数创建一个对象包装器，会根据给定的参数创建对象。 ———— MDN

## 最终完整版——call源码

```js
/**
 * context: 要改变的函数中的this指向，写谁就是谁
 * args：传递给函数的实参信息
 * this：要处理的函数 fn
 */
Function.prototype.call = function(context, ...args) {
	//  null，undefined，和不传时，context为 window
  context = context == null ? window : context;
  
  // 必须保证 context 是一个对象类型
  let contextType = typeof context;
  if (!/^(object|function)$/i.test(contextType)) {
  	context = Object(context);
	}
  
  let result;
  context['fn'] = this; // 把函数作为对象的某个成员值
  result = context['fn'](...args); // 把函数执行，此时函数中的this就是
	delete context['fn']; // 设置完成员属性后，删除
  return result;
}
```

