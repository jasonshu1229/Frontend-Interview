## 编者荐语：
本文帮助大家从0了解什么是**immutable**，以及它有什么作用，是在什么背景下应运而生的。

最重要的是它是我们日常开发中常用的技术之一，与React配合使用的**immutable**能给我们开发者带来多大的遍历，本文会依次讲到。

## immutable出现的背景

在我们的日常开发中，我相信大家都遇到过一种困扰，那就是如何将后端返回的数据，深拷贝一份，再供我们自己使用呢？

如果用过**React**框架开发过项目的小伙伴，也一定记得**Redux**中的**reducer**是基于纯函数设计的，要求返回的状态数据(对象或数组)，需要先深拷贝一份（目的是：防止影响老状态），再根据自己的开发需求对其拷贝后的值操作？

来看下面这样一个例子：
```js
let list = [
  { name: 'house', age: 18}
]

let newList = [... list]; 
newList[0]. name = "xiaoming"; 

console. log(list[0]. name); // "xiaoming"
```
显然上面例子中的原数组**list**，被我们不轻易间串改了，其实原因很简单，就是因为ES6中的展开运算符**[... list]**是一个浅拷贝，浅拷贝的意思就是只复制对象或数组的第一级内容。

在上面中，可以发现经过展开运算符的浅拷贝，只复制了其内层引用类型的地址，当通过索引找到其引用地址，并改变它的时候，改的就是**list**原数组本身。

当然，有的小伙伴可以想到：当访问到对象的属性值的时候，将属性值再进行递归对比，这样就达到了深层对比的效果，但是想想一种极端的情况，就是在属性有一万条的时候，只有最后一个属性发生了变化，那我们就不得已将一万条属性都遍历。这是非常浪费性能的。

回到问题的本质，无论是直接用浅层比对，还是进行深层比对，我们最终想知道的就是原对象里的属性有无改变。

在这样的条件下，immutable 数据应运而生。

## 什么是immutable数据？

**immutable**数据一种利用**结构共享**形成的**持久化数据结构**，一旦有部分被修改，那么将会返回一个全新的对象，并且原来相同的节点会直接共享。

每次修改一个 immutable 对象时都会创建一个新的不可变的对象，在新对象上操作并 不会影响到原对象的数据。

具体点来说，**immutable** 对象数据内部采用是多叉树的结构，凡是有节点被改变，那么它和与它相关的所有**上级节点**都**更新**。

用一张动图来模拟一下这个过程：

![immutable修改节点更新引用过程](https://tva1.sinaimg.cn/large/007S8ZIlly1gi00wzlk6ug30gy0fwqv5.gif)

是吧！**只更新了父节点**，比直接比对所有的属性简直强太多，并且更新后返回了一个**全新的引用**，即使是浅比对也能感知到数据的改变。

因此，采用 **immutable** 既能够最大效率地更新数据结构，又能够和现有的 React中的 **PureComponent (memo)** 顺利对接，感知到状态的变化，是提高 **React 渲染性能的极佳方案**。

不过，immutable 也有一些被开发者吐槽的点，首先是 **immutable 对象**和 **JS 对象**要注意转换，不能混用，这个大家注意适当的时候调用 **toJS** 或者 **fromJS** 即可，问题并不大。

## immutable优化性能的方式

**immutable**实现的原理是：**持久化数据结构**，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了**避免deepCopy** 把所有节点都复制一遍带来的**性能损耗**。

**immutable**使用了**结构共享**，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

### immutable性能优化体现在哪里

![immutable优化性能](https://tva1.sinaimg.cn/large/007S8ZIlly1ghzxnbxwv1j30lv0avtab.jpg)

与React中的 **PureComponent(memo)** 相结合，我们知道**PureComponent**能够在内部帮我们比较**新props**跟**旧props**，**新state**和**旧state**，如果**值相等**或者**对象含有的相同的属性、且属性值相等**，便确定**shouldComponentUpdate**返回true或者false，从而判断是否再次渲染**render**函数。

看上述代码，我们可以看出来，当代码中使用**immutable**第三库的时候，可以精确地**深拷贝** a 对象，改**a对象**中的**select**属性赋值给**b**之后，并不会影响**原对象a**，而**b**的**select**属性变味了新值。

如果上述**select**属性给一个组件用，因为其值被改变了，导致**shouldComponentUpdate**应该返回true，而**filter**属性给另一个组件用，通过判断，并无变化，导致**shouldComponentUpdate**应该返回false，故此组件就避免了**重复的diff算法对比**，大大提高了React中的性能优化。

这么好用的第三方库，我们来看一下它的基本用法：

## immutable中常用类型

（1）Map() 包裹对象
```js
const { Map } = require('immutable'); 
const map1 = Map({ a: 1, b: 2, c: 3 }); 
const map2 = map1. set('b', 50); 

console. log(map1. get('b')); // 2
console. log(map2. get('b')); // 50
```

（2）List() 包裹数组
```js
const { List } = require('immutable'); 

const list1 = List([ 1, 2 ]); 
const list2 = list1. push(3, 4, 5); // [1, 2, 3, 4, 5]
const list3 = list2. unshift(0); // [0, 1, 2, 3, 4, 5]
const list4 = list1. concat(list2, list3); // [1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5]

//push, set, unshift or splice 都可以直接用，返回一个新的immutable对象
```

（3）merge() 连接对象 | concat() 连接数组
```js
const { Map, List } = require('immutable'); 

const map1 = Map({ a: 1, b: 2, c: 3, d: 4 }); 
const map2 = Map({ c: 10, a: 20, t: 30 }); 
const obj = { d: 100, o: 200, g: 300 }; 

const map3 = map1. merge(map2, obj); 
// Map { a: 20, b: 2, c: 10, d: 100, t: 30, o: 200, g: 300 }

const list1 = List([ 1, 2, 3 ]); 
const list2 = List([ 4, 5, 6 ]); 

const list3 = list1. concat(list2, array); 
// List [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

（4）toJS() 把immutable对象转换为js对象
```js
const { Map, List } = require('immutable'); 

const deep = Map({ a: 1, b: 2, c: List([ 3, 4, 5 ]) }); 
console. log(deep. toObject()); // { a: 1, b: 2, c: List [ 3, 4, 5 ] }
console. log(deep. toArray()); // [ 1, 2, List [ 3, 4, 5 ] ]
console. log(deep. toJS()); // { a: 1, b: 2, c: [ 3, 4, 5 ] }
JSON. stringify(deep); // '{"a":1, "b":2, "c":[3, 4, 5]}'
```

（5）fromJS() 包裹 js对象转换为immutable对象
```js
const { fromJS } = require('immutable'); 

const nested = fromJS({ a: { b: { c: [ 3, 4, 5 ] } } }); 
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ] } } }

const nested2 = nested. mergeDeep({ a: { b: { d: 6 } } }); 
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: 6 } } }

console. log(nested2. getIn([ 'a', 'b', 'd' ])); // 6
//如果取一级属性 直接通过get方法，如果取多级属性 getIn(["a", "b", "c"]])

// setIn 设置新的值
const nested3 = nested2. setIn([ 'a', 'b', 'd' ], "kerwin"); 
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: "kerwin" } } }

// updateIn 回调函数更新
const nested3 = nested2. updateIn([ 'a', 'b', 'd' ], value => value + 1); 
console. log(nested3); 
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: 7 } } }

const nested4 = nested3. updateIn([ 'a', 'b', 'c' ], list => list. push(6)); 
// Map { a: Map { b: Map { c: List [ 3, 4, 5, 6 ], d: 7 } } }
```

相对较全的**immutable**一些常用方法，都在这里给大家总结了，大家在项目中经常用就可以熟练掌握了。

## immutable的通用性

一句话总结：immutable适用于**任何**框架开发，只要是能引入第三方库的框架，都可以使用。

下面简单列举一下，我在React开发中**reducer**的简单使用情况：

## immutable+Redux的开发方式

情况1：未使用**immutable**时

下面的代码的情况十分危险，不建议这样用，因为一旦当**newStateList**中的类型较为复杂（包含引用类型），且需要修改**newStateList**时，就会发生报错，因为**[... xxx, ... xxx]**是浅拷贝，会影响原来的状态。

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghzyxiwfnsj31800kugpv.jpg)

情况2：使用**immutable**时

通过store中传递过来的老状态**prevState**先转化为**immutable**对象，对深拷贝之后的对象，再进行修改等操作时，不会影响原状态，最后再通过**toJS()**转换为js对象即可

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghzz22o7dlj31840ok797.jpg)

### 本文总结

> immutable并没有深层比较，因为深层比较的开销是很大的，immutable数据调用set方法修改的时候仅仅**修改本节点**和它上面所有的**相关上层节点**，保证了**不一样的引用**，也更新了数据。更重要的是，它避免了无关数据的比对，提高了性能。

### 看完三件事❤

如果你觉得这篇内容对你还蛮有帮助，我想邀请你帮我三个小忙：

1. 点赞，转发，有你们的「**在看**」，才是我创造的动力。
2. 关注公众号 『**前端时光屋**』，不定期分享原创知识。
3. 同时可以期待后续文章ing🚀

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghwblar34nj31yh0u04e7.jpg)
