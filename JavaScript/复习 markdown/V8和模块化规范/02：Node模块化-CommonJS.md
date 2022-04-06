## 前言

本文将为大家透彻的介绍关于Node的模块化——CommonJS的一切。

看完本文可以掌握，以下几个方面：

- 什么是模块化，以及没有模块化会带来哪些问题，是如何解决的；
- JavaScript的设计缺陷；
- CommonJS规范；
  - 它的规范特性；
  - 如何配合Node完成模块化开发；
  - exports如何导出的；
  - `module.exports`是如何导出变量的，值类型和引用类型导出间的差异；
  - 从内存角度深度分析`module.exports`和`exports`又有怎样的区别和联系；
  - require的细节，以及模块的加载执行顺序；
- CommonJS的加载过程；
- CommonJS规范的本质；

## 一.什么是模块化？

在很多开发的情况下，我们都知道要使用模块化开发，那为什么要使用它呢？

而事实上，`模块化开发`最终的目的是将程序划分成`一个个小的结构`；

- 在这个结构中编写属于`自己的逻辑代码`，`有自己的作用域`，不会影响到其他的结构；
- 这个结构可以将自己希望暴露的`变量`、`函数`、`对象`等导出给其结构使用；
- 也可以通过某种方式，导入另外结构中的`变量`、`函数`、`对象`等；

上面说提到的`结构`，就是`模块`；

按照这种`结构`划分开发程序的过程，就是`模块化开发`的过程；

## 二.JavaScript设计缺陷

在网页开发的早期，由于JavaScript仅仅作为一种`脚本语言`，只能做一些简单的表单验证或动画实现等，它还是具有很多的缺陷问题的，比如：

- var定义的变量作用域问题；
- JavaScript的面向对象并不能像常规面向对象语言一样使用class；
- 在早期JavaScript并没有模块化的问题，所以也就没有对应的模块化解决方案；

但随着前端和JavaScript的快速发展，JavaScript代码变得越来越复杂了；

- ajax的出现，`前后端开发分离`，意味着后端返回数据后，我们需要通过`JavaScript进行前端页面的渲染`； 
- SPA的出现，前端页面变得更加复杂：包括`前端路由`、`状态管理`等等一系列复杂的需求需要通过JavaScript来实现；
- 包括Node的实现，JavaScript编写`复杂的后端程序`，没有模块化是致命的硬伤； 

所以，模块化已经是JavaScript一个非常迫切的需求： 

- 但是JavaScript本身，直到`ES6`（2015）才推出了自己的模块化方案； 

- 在此之前，为了让JavaScript支持模块化，涌现出了很多不同的模块化规范：`AMD、CMD、CommonJS`等；

到此，我们明白了为什么要用模块化开发？

那如果没有模块化会带来什么问题呢？

## 三.没有模块化的问题

当我们在公司面对一个大型的前端项目时，通常是多人开发的，会把不同的业务逻辑分步在多个文件夹当中。

### 2.1 没有模块化给项目带来的弊端

- 假设有两个人，分别是小豪和小红在开发一个项目
- 项目的目录结构是这样的

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkcc6xrad8j30fa0353yo.jpg)

小豪开发的`bar.js`文件

```js
var name = "小豪";

console.log("bar.js----", name);
```

小豪开发的`baz.js`文件

```js
console.log("baz.js----", name);
```

小红开发的`foo.js`文件

```js
var name = "小红";

console.log("foo.js----", name);
```

引用路径如下：

```js
<body>
  <script src="./bar.js"></script>
  <script src="./foo.js"></script>
  <script src="./baz.js"></script>
</body>
```

最后当我去执行的时候，却发现执行结果：

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkccaslaxyj30j001yaa3.jpg)

当我们看到这个结果，有的小伙伴可能就会惊讶，`baz.js`文件不是小豪写的么？为什么会输出小红的名字呢？

究其原因，我们才发现，其实`JavaScript`是没有模块化的概念（至少到现在为止还没有用到ES6规范），换句话说就是每个`.js`文件`并不是一个独立的模块，没有自己的作用域`，所以在`.js`文件中定义的变量，都是可以被其他的地方共享的，所以小豪开发的`baz.js`里面的name，其实访问的是小红重新声明的。

但是共享也有一点不好就是，项目的其他协作人员也可以随意的改变它们，显然这不是我们想要的。

### 2.2 IIFE解决早期的模块化问题

所以，随着前端的发展，模块化变得必不可少，那么在早期是如何解决的呢？

在早期，因为**函数是有自己的作用域**，所以可以采用**立即函数调用表达式（IIFE）**，也就是**自执行函数**，把要供外界使用的变量作为**函数的返回结果**。

小豪——`bar.js`

```js
var moduleBar = (function () {
  var name = "小豪";
  var age = "18";

  console.log("bar.js----", name, age);

  return {
    name,
    age,
  };
})();
```

小豪——`baz.js`

```js
console.log("baz.js----", moduleBar.name);
console.log("baz.js----", moduleBar.age);
```

小红——`foo.js`

```js
(function () {
  var name = "小红";
  var age = 20;

  console.log("foo.js----", name, age);
})();
```

来看一下，解决之后的输出结果，原调用顺序不变；

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhq1yrlcdj30jq028mxa.jpg)

但是，这又带来了新的问题：

- 我必须记得每一个`模块中返回对象的命名`，才能在其他模块使用过程中正确的使用；
- 代码写起来`杂乱无章`，每个文件中的代码都需要包裹在一个匿名函数中来编写； 
- 在`没有合适的规范`情况下，每个人、每个公司都可能会任意命名、甚至出现模块名称相同的情况；

所以现在急需一个统一的规范，来解决这些缺陷问题，就此`CommonJS规范`问世了。

## 三.Node模块化开发——CommonJS规范

### 3.1 CommonJS规范特性

**CommonJS**是一个规范，最初提出来是在浏览器以外的地方使用，并且当时被命名为**ServerJS**，后来为了体现它的广泛性，修改为**CommonJS规范**。

- Node是CommonJS在服务器端一个具有代表性的实现；

- Browserify是CommonJS在浏览器中的一种实现；
- webpack打包工具具备对CommonJS的支持和转换； 

正是因为Node中对`CommonJS`进行了支持和实现，所以它具备以下几个特点；

- 在Node中`每一个js文件都是一个单独的模块`；
- 该模块中，包含`CommonJS规范的核心变量`: exports、module.exports、require；
- 使用核心变量，进行`模块化`开发；

> 无疑，模块化的核心是**导出**和**导入**，Node中对其进行了实现：

- exports和module.exports可以负责`对模块中的内容进行导出`；
- require函数可以帮助我们`导入其他模块（自定义模块、系统模块、第三方库模块）中的内容`；

### 3.2 CommonJS配合Node模块化开发

假设现在有两个文件：

`bar.js`

```js
const name = "时光屋小豪";
const age = 18;

function sayHello(name) {
  console.log("hello" + name);
}
```

`main.js`

```js
console.log(name);
console.log(age);
```

执行node main.js之后，会看到

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhtdd39f0j308303zgm3.jpg)

这是因为在当前`main.js`模块内，没有发现`name`这个变量；

这点与我们前面看到的明显不同，因为Node中每个js文件都是一个单独的模块。

那么如果要在别的文件内访问`bar.js`变量

- `bar.js`需要导出自己想要暴露的变量、函数、对象等等；
- `main.js`从`bar.js`引入想用的变量、函数、对象等等；

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhtr2rja9j30l007vq42.jpg)

### 3.3 exports导出

**exports是一个对象，我们可以在这个对象中添加很多个属性，添加的属性会导出**。

`bar.js`文件导出：

```js
const name = "时光屋小豪";
const age = 18;

function sayHello(name) {
  console.log("hello" + name);
}

exports.name = name;
exports.age = age;
exports.sayHello = sayHello;
```

`main.js`文件导入:

```js
const bar = require('./bar');

console.log(bar.name);  // 时光屋小豪
console.log(bar.age);   // 18
```

其中要注意的点：

- main.js中的`bar`变量等于`exports`对象；

  ```js
  bar = exports
  ```

- 所以我们通过`bar.xxx`来使用导出文件内的变量，比如name，age；

- `require`其实是一个`函数`，返回值是一个对象，值为“导出文件”的`exports`对象；

### 3.4 从内存角度分析bar和exports是同一个对象

在Node中，有一个特殊的全局对象，其实`exports`就是其中之一。

如果在文件内，不再使用`exports.xxx`的形式导出某个变量的话，其实`exports`就是一个空对象。

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhujdz6pwj304g0140so.jpg)

模块之间的引用关系

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhueow2dhj30u00hbq50.jpg)

- 当我们在`main.js`中require导入的时候，它会去自动查找特殊的全局对象`exports`，并且把`require`函数的执行结果赋值给`bar`；
- `bar`和`exports`指向同一个引用（引用地址相同）；
- 如果发现`exports`上有变量，则会放到`bar`对象上，正因为这样我们才能从`bar`上读取想用的变量；

为了进一步论证，`bar`和`exports`是同一个对象：

我们加入定时器看看

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhumuppbwj30u00dedhz.jpg)

所以综上所述，`Node`中实现`CommonJS规范`的本质就是`对象的引用赋值`（浅拷贝本质）。

把`exports`对象的引用赋值`bar`对象上。

> **CommonJS规范**的本质就是对象的引用赋值

###  3.5 module.exports又是什么？

但是Node中我们经常使用`module.exports`导出东西，也会遇到这样的面试题：

`module.exports`和`exports`有什么关系或者区别呢？

### 3.6 require细节

**require本质**就是一个函数，可以帮助我们引入一个文件（模块）中导入的对象。

[require的查找规则](https://nodejs.org/dist/latest-v14.x/docs/api/modules.html#modules_all_together)https://nodejs.org/dist/latest-v14.x/docs/api/modules.html#modules_all_together

### 3.7 require模块的加载顺序

**结论一： 模块在被第一次引入时，模块中的js代码会被运行一次**

```js
// aaa.js

const name = 'coderwhy';

console.log("Hello aaa");

setTimeout(() => {
  console.log("setTimeout");
}, 1000);
```

```js
// main.js

const aaa = require('./aaa');
```

aaa.js中的代码在引入时会被运行一次

**结论二：模块被多次引入时，会缓存，最终只加载（运行）一次**

```js
// main.js
const aaa = require('./aaa');
const bbb = require('./bbb');
```

```js
/// aaa.js
const ccc = require("./ccc");
```

```js
// bbb.js
const ccc = require("./ccc");
```

```js
// ccc.js
console.log('ccc被加载');
```

ccc中的代码只会运行一次。

**为什么只会加载运行一次呢？**

- 每个模块对象module都有一个属性：loaded；
  - 为false表示还没有加载；
  - 为true表示已经加载；

**结论三：如果有循环引入，那么加载顺序是什么？**

如果出现下面模块的引用关系，那么加载顺序是什么呢？

- 这个其实是一种数据结构：图结构；
- 图结构在遍历的过程中，有深度优先搜索（DFS, depth first search）和广度优先搜索（BFS, breadth first search）；
- Node采用的是深度优先算法：main -> aaa -> ccc -> ddd -> eee ->bbb；

![多个模块的引入关系](https://tva1.sinaimg.cn/large/0081Kckwly1gki6i36wbrj30pw0by3zm.jpg)

## 四.module.exports

### 4.1 真正导出的是module.exports

以下是通过维基百科对CommonJS规范的解析：

- CommonJS中是没有module.exports的概念的；
- 但是为了实现模块的导出，Node中使用的是`Module`的类，每一个模块都是`Module`的一个实例`module`；

- 所以在Node中真正用于导出的其实根本不是`exports`，而是`module.exports`； 
- `exports`只是`module`上的一个对象

但是，为什么exports也可以导出呢？

- 这是因为`module`对象的`exports`属性是`exports`对象的一个引用；

- 等价于`module.exports = exports = main中的bar`（CommonJS内部封装）；

### 4.2 module.exports和exports有什么关系或者区别呢？

**联系**：**module.exports = exports**

进一步论证**module.exports = exports**

```js
// bar.js
const name = "时光屋小豪";

exports.name = name;

setTimeout(() => {
  module.exports.name = "哈哈哈";
  console.log("bar.js中1s之后", exports.name);
}, 1000);
```

```js
// main.js
const bar = require("./bar");

console.log("main.js", bar.name);

setTimeout((_) => {
  console.log("main.js中1s之后", bar.name);
}, 2000);
```

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhwswnu7bj305l026aa6.jpg)

在上面代码中，只要在`bar.js`中修改`exports`对象里的属性，导出的结果都会变，因为即使`真正导出的是 module.exports`，而`module.exports`和`exports`是都是相同的引用地址，改变了其中一个的属性，另一个也会跟着改变。

> **注意：真正导出的模块内容的核心其实是module.exports，只是为了实现CommonJS的规范，刚好module.exports对exports对象使用的是同一个引用而已**

![图解module.exports和exports联系](https://tva1.sinaimg.cn/large/0081Kckwly1gkhwwap84fj30uw0etdgy.jpg)

**区别**：有以下两点

那么如果，代码这样修改了：

![](https://tva1.sinaimg.cn/large/0081Kckwly1gkhx0fzp9sj30f60cw0uk.jpg)

- `module.exports` 也就和 `exports`没有任何关系了；
  - 无论`exports`怎么改，都不会影响最终的导出结果；

- 因为`module.exports = { xxx }`这样的形式，会在堆内存中新开辟出一块内存空间，会生成一个新的对象，用它取代之前的`exports`对象的导出
  - 那么也就意味着`require`导入的对象是新的对象；

![图解module.exports和exports的区别](https://tva1.sinaimg.cn/large/0081Kckwly1gkhy5jvr64j30nn0h4q4h.jpg)

讲完它们两个的区别，来看下面这两个例子，看看自己是否真正掌握了`module.exports`的用法

### 4.3 关于module.exports的练习题

练习1：导出的变量为**值类型**

```js
// bar.js
let name = "时光屋小豪";

setTimeout(() => {
  name = "123123";
}, 1000);

module.exports = {
  name: name,
  age: "20",
  sayHello: function (name) {
    console.log("你好" + name);
  },
};
```

```js
// main.js
const bar = require("./bar");

console.log("main.js", bar.name); // main.js 时光屋小豪

setTimeout(() => {
  console.log("main.js中2s后", bar.name); // main.js中2s后 时光屋小豪
}, 2000);
```

练习2：导出的变量为**引用类型**

```js
// bar.js
let info = {
  name: "时光屋小豪",
};

setTimeout(() => {
  info.name = "123123";
}, 1000);

module.exports = {
  info: info,
  age: "20",
  sayHello: function (name) {
    console.log("你好" + name);
  },
};
```

```js
// main.js
const bar = require("./bar");

console.log("main.js", bar.info.name); // main.js 时光屋小豪

setTimeout(() => {
  console.log("main.js中2s后", bar.info.name); // main.js中2s后 123123
}, 2000);
```

从`main.js`输出结果来看，定时器修改的`name`变量的结果，并没有影响`main.js`中导入的结果。

- 因为name为值类型，基本类型，一旦定义之后，就把其属性值，放到了`module.exports`的内存里（练1）
- 因为info为引用类型，所以`module.exports`里存放的是info的引用地址，所以由定时器更改的变量，会影响`main.js`导入的结果（练2）

![](https://tva1.sinaimg.cn/large/0081Kckwly1gki31uqm8uj31an0k1jwc.jpg)

## 五.CommonJS的加载过程

**CommonJS模块加载js文件的过程是运行时加载的，并且是同步的：**

- 运行时加载意味着是js引擎在执行js代码的过程中加载模块；
- 同步的就意味着一个文件没有加载结束之前，后面的代码都不会执行；

```js
const flag = true;

if (flag) {
  const foo = require('./foo');
  console.log("等require函数执行完毕后，再输出这句代码");
}
```

**CommonJS通过module.exports导出的是一个对象：**

- 导出的是一个对象意味着可以将这个对象的引用在其他模块中赋值给其他变量；
- 但是最终他们指向的都是同一个对象，那么一个变量修改了对象的属性，所有的地方都会被修改；

## 六.CommonJS规范的本质

> **CommonJS规范的本质就是对象的引用赋值**

## 后续文章

**《JavaScript模块化——ES Module》**

在下一篇文章中，

- 会重点讲解**ES Module规范**的一切；

- 及**CommonJS和ES Module**是如何交互的；

- 类比**CommonJS和ES Module**优缺点，如何完美的回答这道面试题；

## 感谢大家💛

如果你觉得这篇内容对你挺有启发，我想邀请你帮我三个小忙：  

1.  点个「**在看**」，让更多的人也能看到这篇内容（喜欢不点在看，都是耍流氓 -\_-）
2.  欢迎联系我噢，微信「**Augenstern9728**」，拉你进前端技术交流群。
3.  关注公众号「**前端时光屋**」，持续为你推送精选好文。



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gjliwnwwpyg30ku0egaan.gif)