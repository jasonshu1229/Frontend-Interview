```js
function func(x, y, ev) {
	console.log(this, x, y, ev);
}

const obj = { name: "jason" };
```

执行**func**函数，并把里面的**this**改为**obj**

### 解决方案一：包一层匿名函数

```js
function func(x, y, ev) {
	console.log(this, x, y, ev);
}

const obj = { name: "jason" };

document.body.click = function anonymous (ev) {
	func.call(obj, 10, 20, ev);
}
```

### 解决方案二：调用bind函数

```js
function func(x, y, ev) {
	console.log(this, x, y, ev);
}

const obj = { name: "jason" };
document.body.click = func.bind(obj, 10, 20);
```

### 手动实现bind——es5

> **bind**：利用柯理化函数的编程思想，预先把`需要处理的函数/改变的this/传递的实参`等信息存储在闭包中，后期到达条件**（事件触发/定时器）**，先执行返回的匿名函数，在执行匿名函数的过程中，再去改变`this`等

```js
/**
 * this: 要处理的函数 func
 * context: 要改变的函数中的this指向 obj
 * params：要处理的函数传递的实参 [10, 20]
 */
Function.prototype._bind = function(context, ...params) {
  
  let _this = this; // this: 要处理的函数
  return function anonymous (...args) {
    // args： 可能传递的事件对象等信息 [MouseEvent]
    // this：匿名函数中的this是由当初绑定的位置 触发决定的 （总之不是要处理的函数func）
    // 所以需要_bind函数 刚进来时，保存要处理的函数 _this = this
    _this.call(context, ...params.concat(args));
  }
}
```

> 补充：匿名函数的`args`参数，有的时候可能是 ev，有的时候可能也没有，比如在定时器函数中

### 情况1：匿名函数绑定给事件时，args为 ev

```js
document.body.onClick = function anonymous (ev) {
  func.call(obj, 10, 20);
}
```

### 情况2：定时器中的bind返回的匿名函数没有args

```js
setTimeout(func.bind(obj, 10, 20), 1000); 

setTimeout(function anonymous () {
  ...
}, 1000);
```

