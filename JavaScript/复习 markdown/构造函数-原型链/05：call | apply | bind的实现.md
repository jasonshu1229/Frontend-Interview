## call、apply、bind它们 究竟藏在哪里

所有函数能调call、apply. bind的方法前提：函数是Function的实例，而Function. prototype上面有这三个方法
```js
Function.prototype = {
  call,
  apply,
  bind
}
```

## call / apply

**用法：**第一个参数就是改变的this指向，写谁就是谁(特殊: 非严格模式下，传递null/undefined指向的也是window)

**区别：**执行函数，传递的参数方式有区别，call是一个个传递，apply是把需要传递的参数放到数组中整体传递

```JavaScript
func. call([context], 10, 20); 
func. apply([context], [10, 20])
```

## bind

**用法:**bind不是立即执行函数，属于预先改变this和传递一些内容 => "柯里化思想"<br>
**区别:**call/apply都是改变this的同时直接将函数执行，而bind需要手动执行<br>

```JavaScript
let obj = {
  fn(x, y) {
    console.log(this, x, y);
  }
}

obj. fn. call(); // window 严格模式下: undefined
obj. fn. call(null); // ... 
obj. fn. call(undefined); // ... 
obj. fn. call(window, 10, 20); // window
obj. fn. apply(window, [10, 20]); // window
```

### 例: 在1秒钟之后，执行fn函数，让其函数里的this变为window<br>

```JavaScript
错误写法:
setTimeout(obj. fn. call(window, 10, 20)); 
```
**原因：**fn. call()自动执行，执行之后将结果(window)赋值给setTimeout再让浏览器执行，显然是错误的，因setTimeout第一个参数应为要执行的**函数**, 而非window等表达式

```JavaScript
正确写法:
setTimeout(obj. fn. bind(window, 10, 20)); 
```

## call apply bind的实现

### 实现Function. prototype. bind（柯里化函数思想）

**注:**重写bind需要在**Function. prototype**定义，因为是Function原型上的方法 <br>

> <b>柯里化思想</b>: 一个大函数里面返回一个小函数，返回的小函数供外面调取使用，在执行大函数执行时形成的执行上下文不能销毁，形成闭包，保护大函数里面的变量，等到anonymous(下文提到)执行时，再调取大函数里面的变量

**基础版**

```JavaScript
~ function anonymous(proto) {

    // context: bind更改之后的this指向
    function bind(context) {
        // context may be null or undefined
        if (context == undefined) {
            context = window;
        }

        // arguments { 0:context, 1:10, 2:20, length:3}
        // 获取传递的实参集合
        var args = [].slice.call(arguments, 1);
        
        // 需要最终执行的函数(例: obj.fn)
        var _this = this;
        
        // bind()执行会返回一个新函数
        return function anonymous() {
             _this.apply(context, args);
        }
    }
    proto.bind = bind;

}(Function. prototype); 

let obj = {

    fn(x, y) {
        console.log(this, x, y);
    }

}
```

现在bind原理懂了之后，我们来回顾一下这个题<br>
<b>回顾: 在1秒钟之后，执行fn函数，让其函数里的this变为window</b><br>
bind结合setTimeout实现<br>
**原理:**<br>
1、1s之后先执行bind的返回结果anonymous <br>
2、在anonymous中再把需要执行的obj. fn执行，把之前存储的context/args传递给函数

```JavaScript
setTimeout(obj. fn. bind(window, 10, 20)); 
setTimeout(anonymous, 1000); 
```

**完整版**
```JavaScript
// document. body. onclick = obj. fn. bind(window, 10, 20); 
document. body. onclick = anonymous; 
```
<b>例</b>: 给当前元素的某个事件行为绑定方法，当事件触发执行完这个方法之后，方法中有一个默认事件对象ev(MouseEvent)，ev作为anonymous的形参对象anonymous(ev)，因为最终执行的是obj. fn，所以为了方便拿到ev
<br>

```JavaScript
~ function anonymous(proto) {

    // context: bind更改之后的this指向
    function bind(context) {
        // context may be null or undefined
        if (context == undefined) {
            context = window;
        }

        
        // arguments { 0:context, 1:10, 2:20, length:3}
        // 获取传递的实参集合
        var args = []. slice. call(arguments, 1); 
        
        需要最终执行的函数(例: obj. fn)
        var _this = this; 
        
        // bind()执行会返回一个新函数
        return function anonymous(ev) {
            args. push(ev); 
             _this. apply(context, args); 
        }
    }
    proto. bind = bind; 
}(Function. prototype); 

let obj = {

    fn(x, y,ev) {
        console.log(this, x, y,ev);
    }

}; 
```

由于anonymous不一定绑给谁，所以不一定有ev, 但也还有可能是其他东西, 所以... 

```JavaScript
... 

    return function anonymous() {
        var amArg = [].slice.call(arguments, 0);
        args = args.concat(amArg);
         _this.apply(context, args);
    }
    
    proto.bind = bind;

```

### bind核心逻辑(es6写法)

```JavaScript
function bind (context = window, ... args) {

    return (...amArg) => {
        args = args.concat(amArg);
        _this.apply(context, args);
    }

}
```
经测试:apply在传递多个参数的情况下，性能不如call，故改写call

```JavaScript
function bind (context = window, ... args) {

    return (...amArg) => {
        args = args.concat(amArg);
        _this.call(context, ...args);
    }

}
```

## es6实现Function. prototype. call/apply

以**obj. fn**. call(window, 10, 20)为例<br>

#### 原理:**context. $fn = this **<br>

#### 步骤:
1、把当前函数(要更改的函数obj. fn)，作为context一个属性，赋给this<br>
2、context. &fn()，this自然指向context<br>
3、防止对象属性被窜改，及时delete context. $fn<br>
4、call()执行之后应返回一个function，赋值给result<br>
PS:(如果在面试的时候想写详细点可以限定context数据类型为引用类型，排除掉基本类型的可能)<br>

```JavaScript
~ function anonymous(proto) {

    // 只有当context不传，或传undefined时，才是window
    // 所以应该null情况考虑进去
    function call(context = window, ...args) {
    
        context === null ? context = window : null;
        let type = typeof context;
        if (type !== "object" && type !== "function" && type !== "symbol"){
            // 基本类型值
            switch(type) {
                case 'number':
                    context = new Number(context);
                    break;
                case 'string':
                    context = new String(context);
                    break;
                case 'boolean':
                    context = new Boolean(context);
                    break;
            }
        };
        
        // 必须保证context是引用类型 (因为只有引用类型的属性上才能挂在this)
        // 如： fn.call(1,...)
        // this是call之前要执行的函数(obj.fn)
        context.$fn = this;  // 关键步骤
        let result = context.$fn(...args);
        delete context.$fn;
        return result;
    }
    proto.call = call; 
    
    function apply(context = window, args) {
        context.$fn = this;
        let result = context.$fn(...args);
        delete context.$fn;
        return result;
    }
    proto.apply = apply; 

}(Function. prototype); 

let obj = {

    fn(x, y) {
        console.log(this, x, y);
    }

}; 

obj. fn. call(window, 10, 20); // Window {parent: Window, opener: null, top: Window, length: 0, frames: Window,  …} 10 20
obj. fn. call(1, 10, 20); // Number {1, $fn: ƒ} 10 20
obj. fn. call(true, 10, 20); // Boolean {true, $fn: ƒ} 10 20

obj. fn. apply(true, [10, 20]); // Boolean {true}__proto__: Boolean[[PrimitiveValue]]: true (2) [10, 20] undefined
```

## 强化练习

* #### 如何调用 fn原型上的apply方法？

```JavaScript
// 原型方法
Function. prototype. apply = function (context = window, args) {
  // 只有当context不传，或传undefined时，才是window
  // 所以应该null情况考虑进去
  context === null ? context = window : null; 
  let type = typeof context; 
  if (type !== "object" && type !== "function" && type !== "symbol"){

      // 基本类型值
      switch(type) {
          case 'number':
              context = new Number(context);
              break;
      ...
      }

  }; 
  context. $fn = this; // this 即fn
  let result = context. $fn(... args); 
  delete context. $fn; 
  return result; 
}

function fn() {
  console. log(this, arguments)
}

// 对象属性方法
fn. apply = function () {
  console. log('inner apply')
}

// => 表示调用时Function. prototype函数，然后把Function. prototype里的this改变为fn
// => 故 与要求不符
// Function. prototype. apply(fn, [1, 2, 3, 4]) 

// call的作用
// 1、改变Function. prototype. apply中的this 指向为fn
// 2、把参数传递到. . apply函数中，将1设置为fn中的this
Function. prototype. apply. call(fn, 1, [2, 3, 4])  // [Number: 1] [Arguments] {'0': 2, '1': 3, '2': 4}

// 新写法 Reflect. apply 调的就是 原型上 的方法
Reflect. apply(fn, 1, [2, 3, 4])

```

* #### call的无限调用

```JavaScript
function call(context = window, ... args) {

    // 必须保证context是引用类型
    context.$fn = this;
    let result = context.$fn(...args);
    delete context.$fn;
    return result;

}

call 引用类型 堆地址AAAFFF000
```

```JavaScript
function fn1() { console. log(1); }
function fn2() { console. log(2); }
fn1. call(fn2); // 执行的是fn1 => 1
fn1. call. call(fn2); // 最终让fn2执行 => 2 (包括多个call)
Function. prototype. call(fn1); 
Function. prototype. call. call(fn1); 
```
<b>fn1. call. call(fn2); </b>

```JavaScript
1、先让最后一个call执行，
最后一个call中的this是fn1. call，context是fn2

    this => fn1.call => AAAFFF000
    context => fn2
    args => []

最后一个call开始执行

    fn2.$fn = AAAFFF000 
    result = fn2.$fn(...[]) (AAAFFF000) 执行,

接着让call第二次执行

    this => fn2
    context => undefined
    args => []
    undefined.$fn = fn2
    result = undefined.$fn => (fn2())
    

最终让fn2执行
```

## 写在最后

* 文中如有错误，欢迎在评论区指正，如果这篇文章帮到了你，欢迎点赞和关注
