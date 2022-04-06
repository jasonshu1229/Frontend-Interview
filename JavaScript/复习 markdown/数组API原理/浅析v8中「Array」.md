## Array基础

### Array内置类构造函数上的方法

- Array.of
- Array.isArray
- Array.from

#### Array.of( )

理解：创建一个新的数组的实例，不考虑参数的数量或类型（和`Array`作比较）

语法：

```js
Array.of(element0[, element1[, ...[, elementN]]])
```

用法：

```js
Array.of(7); // [7]
Array.of('1', 2, '3', 4); // ["1", 2, "3", 4]

Array(7);          // [ , , , , , , ]
Array(1, 2, 3);    // [1, 2, 3]
```

两者区别：

 `Array.of()` 和 `Array` 构造函数之间的区别在于处理整数参数：`Array.of(7)` 创建一个具有单个元素 **7** 的数组，而 `Array(7)` 创建一个长度为7的空数组（**注意：**这是指一个有7个空位(empty)的数组，而不是由7个`undefined`组成的数组）。

「实现」

```js
if (!Array.of) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments); // 相当于浅拷贝，生成一个新数组
  };
}
```

#### Array.isArray( )

理解：**Array.isArray()** 用于确定传递的值是否是一个 `Array`

用法：

```js
// 下面的函数调用都返回 true
Array.isArray(new Array());
Array.isArray(new Array('a', 'b', 'c', 'd'))
Array.isArray(Array.prototype);  // 鲜为人知的事实：其实 Array.prototype 也是一个数组。
```

「实现」

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
```

#### Array.from( )

理解：`Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。

语法 | 参数：

```js
Array.from(arrayLike[, mapFn[, thisArg]])
```

- `arrayLike`：「必选」想要转换成数组的伪数组对象（arguments）或可迭代对象（Set，Map）（Symbol.iterator）
- `mapFn`：「可选」如果指定了该参数，新数组中的每个元素都会执行该回调函数
- `thisArg`：「可选」执行回调函数`mapFn`时的`this`对象

**对参数的描述：**

`Array.from()`方法有一个可选参数`mapFn`，它可以让我们在最后生成的数组上再执行一次`map`方法后再返回。相当于

`Array.from(obj).map(mapFn, thisArg)`

**用法示例**

**把String转换成数组**

```js
Array.from('foo');
// [ "f", "o", "o" ]
```

**从Set中去重并转换成数组**

```js
const set = new Set(['foo', 'bar', 'baz', 'foo']);
Array.from(set);
// [ "foo", "bar", "baz" ]
```

**从Map中生成数组**

```js
const map = new Map([[1, 2], [2, 4], [4, 8]]);
Array.from(map);
// [[1, 2], [2, 4], [4, 8]]

const mapper = new Map([['1', 'a'], ['2', 'b']]);
Array.from(mapper.values());
// ['a', 'b'];

Array.from(mapper.keys());
// ['1', '2'];
```

**从类数组对象中生成数组**

```js
const fn = () => {
  return Array.from(arguments);
}

fn(1, 2, 3);
// [1, 2, 3]
```

**数组去重合并**

```js
function combine() {
  let arr = [].concat().apply([], arguments); // 将类数组合并到一个新数组当中
  return Array.from(new Set(arr));
}

let a = [1, 2, 2], b = [2, 3, 3];
console.log(combine(m,n));  // [1, 2, 3]
```

**充分利用第三个参数，确定mapFn回调函数的this**

```js
const obj = {
  handle: x => x * 4;
}

Array.from([11, 22, 33], function (a) {
  return this.handle(a);
}, obj)

// [44, 88, 132]
```

**「v8的底层实现」**

**思路：**

- 判断`arrayLike`是否为空
- 判断`mapFn`是否为构造函数
  - 为构造函数时，每次遍历时，让arr[i] = mapFn(iValue,i)
  -  不是构造函数时，arr[i] = iValue

- 判断`thisArg`是否存在,存在的话 arr[i] = mapFn.call(thisArg, iValue,i)

```js
Array.myfrom = (function () {
  const toStr = Object.prototype.toString
  const isCallable = fn => typeof fn === 'function' || toStr.call(fn) === '[object Function]'

  const toInteger = value => {
    const v = Number(value)
    if(isNaN(v))    return 0
    // 无穷大或者0 直接返回
    if(v === 0 || !isFinite(v)) return v
    return (v > 0 ? 1 : -1) * Math.floor(Math.abs(v))
  }
  // 最大的范围Number.MAX_SAFE_INTEGER
  const maxSafeInteger = Number.MAX_SAFE_INTEGER

  const toLength = value => {
    const len = toInteger(value)
    return Math.min(maxSafeInteger, Math.max(0, len))
  }
  return function myfrom (arrayLike/*, mapFn, thisArg*/) {
    const that = this
    if(arrayLike === null) throw new TypeError("Array.from requires an array-like object - not null or undefined")

    const items = Object(arrayLike) // 返回一个基本类型的包装对象（简言之引用类型）
    let thisArg = ''
    // 判断mapFn是否undefined, 这里最好不要直接使用undefined,因为undefined不是保留字,
    // 很有可能undefined是个值  最好用 void 0 或者 void undefined 
    const mapFn = arguments.length > 1 ? arguments[1] : void 0
    if( typeof mapFn !== 'undefined') {
      // 接下来判断第二个参数是不是构造函数
      if( !isCallable(mapFn) ) throw new TypeError("Array.from when provided mapFn must be a function")
      if( arguments.length > 2) thisArg = arguments[2]
    }
    const len = toLength(items.length)
    const arr = isCallable(that) ? Object(new that(len)) : new Array(len)

    let i = 0,
        iValue;
    while ( i < len) {
      iValue = items[i]
      if(mapFn) arr[i] = typeof thisArg === 'undefined' ? mapFn(iValue,i) : mapFn.call(thisArg, iValue, i)
      else 
        arr[i] = iValue
      i++
    }
    arr.length = len
    return arr
  }
})()
```

下面介绍的都是`Array.prototype原型`上的方法，也是一些经常用的方法

## Array常用方法

为了方便查找和记忆，将常用方法分为三类

- 数组可遍历方法
- 会修改原数组方法
- 返回新数组方法

### 遍历方法

js中遍历数组`并不会改变原始数组`的方法总共有12个：

```js
// ES5：
forEach、every、some、filter、map、reduce、reduceRight

// ES6:
find、findIndex、keys、values、entries
```

### forEach( )

**语法 | 参数**

```js
arr,forEach(callback(currentValue, index, array), thisArg)
```

- `callback`：数组中每个元素执行的函数，该函数接收`一至三个参数`
  - currentValue：数组中正在处理的当前元素
  - Index：「可选」数组中正在处理的当前元素的索引
  - array：「可选」`forEach()`方法正在操作的数组

- `thisArg`：「可选」当执行回调函数`callback`时，用作`this`的值

**特点**

- `forEach`不会改变原数组（除非原数组里面的元素被callback回调时改变，例如 shift）
- `forEach`的返回值为`undefined`
- `forEach`循环中，return语句无效
- `forEach`除了抛出异常以外，没有办法中止或跳出`forEach`循环，

**用法示例**

1. `forEach`中的callback回调，可能改变原数组

```js
var words = ['one', 'two', 'three', 'four'];
words.forEach(function(word) {
  console.log(word);
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four

console.log(words); // [ 'two', 'three', 'four' ]
```

当满足 `word = 'two'`条件时，数组的元素位置会向前移动，导致遍历数组，某个元素会被跳过，由于`index=1`时不会重复遍历，恰巧`three`是改变后数组的第`index=1`项。

2. 不对未初始化的值进行任何操作（稀疏数组）

```js
const arraySparse = [1,3,,7];
let numCallbackRuns = 0;

arraySparse.forEach(function(element){
  console.log(element);
  numCallbackRuns++;
});

console.log("numCallbackRuns: ", numCallbackRuns);

// 1
// 3
// 7
// numCallbackRuns: 3
```

3. 使用`forEach(callback, thisArg)`中的第二个参数

```js
function Counter() {
  this.sum = 0;
  this.count = 0;
}
Counter.prototype.add = function(array) {
  array.forEach(function(entry) {
    this.sum += entry;
    ++this.count;
  }, this); // -- line: 9
  // ^---- Note
};

const obj = new Counter(); // this 指向 obj
obj.add([2, 5, 9]); // -- line: 14

obj.count; // 3 === (1 + 1 + 1)
obj.sum; // 16 === (2 + 5 + 9)
```

从上面代码中看出，第9行中传入的this，决定了forEach回调函数中this指向的问题。

第14行，obj调用了add方法，所以this指向的就是obj，也就是forEach中this指向的就是obj这个对象了。

> 注意： 如果使用[箭头函数表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)来传入函数参数， `thisArg` 参数会被忽略，因为箭头函数在词法上绑定了 [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 值。

4. `forEach`用every或some来中止循环

```js
var words = ['one', 'two', 5, 'three', 'four'];

words.every(everyVal => {
  console.log(everyVal)
  return typeof(everyVal) === "string"
});

// one two 5
```

**「v8的底层实现」**

```js
/**
  * Array.prototype.forEach(callback, thisArg)
  * 除了抛出异常外,无法终止或者跳出forEach()循环
  * 遍历数组
**/
Array.prototype.myforEach = function (callback, thisArg) {
  if( this == null ) throw new TypeError("this is null or not defined")
  let newArr = Object(this)
  let len = newArr.length 
  if( typeof callback !== 'function' ) throw new TypeError(callback + ' is not a function');
  let thatArg = arguments.length >= 2 ? arguments[1] : void 0
  let k = 0

  while( k < len ) {

    if(k in newArr){ 
      callback.call(thatArg, newArr[k], k, newArr);
    }
    k++
  }
  return void 0
}
```

**代码原理理解：**

- 无法中途退出循环，每次我们都是调用回调函数的，return只能退出本次回调，该方法返回的是`undefined`, 即使我们return 一个值也没有用
- `thisArg`改变的是回调函数中的this，从源码中可以看出来，还有就是如果回调函数是箭头函数的话，我们知道箭头函数是无法改变this的，所以会忽略`thisArg`

### every( )

**理解：** `every()` 方法测试一个数组内的所有元素是否都能通过某个`指定函数`的测试。它返回一个`布尔值`。

**语法：**

```js
arr.every(callback(element[, index[, array]])[, thisArg])
```

- `callback`：用来测试每个元素的函数，它可以接收三个参数：
  - `element`：「可选」用于测试的当前值。
  - `index`：「可选」用于测试的当前值的索引
  - `array`：调用every的当前数组

- `thisArg`：执行`callback`时使用的`this`值

**返回值**：布尔类型

**用法**

```js
function isBigEnough(element, index, array) {
  return element >= 10;
}
[12, 5, 8, 130, 44].every(isBigEnough);   // false
[12, 54, 18, 130, 44].every(isBigEnough); // true
```

**「v8的底层实现」**

```js
Array.prototype.myevery = function (callback, thisArg) {
  if( this == null ) throw new TypeError("this is null or not defined")
  let newArr = Object(this)
  let len = newArr.length 
  if( typeof callback !== 'function' ) throw new TypeError(callback + ' is not a function');
  let thatArg = arguments.length >= 2 ? arguments[1] : void 0
  let k = 0

  while( k < len ) {

    if(k in newArr){ 
      let testResult = callback.call(thatArg, newArr[k], k, newArr);
      if( !testResult ) return false
    }
    k++
  }
  return true
}
```

**代码原理理解**

- 为每个数组元素执行一次`callback`函数，直到找到一个会使`callback`返回的`false`的元素停止
- 如果每个数组元素执行`callback`后，都返回`true`，则返回`true`
- 不会改变原数组
- `every` 遍历的元素范围在第一次调用 `callback` 之前就已确定了。在调用 `every` 之后添加到数组中的元素不会被 `callback` 访问到。如果数组中存在的元素被更改，则他们传入 `callback` 的值是 `every` 访问到他们那一刻的值。那些被删除的元素或从来未被赋值的元素将不会被访问到。
- 如果有`thisArg`参数的话，则指向`callback` 被调用时的 `this` 值，在非严格模式下为全局对象，在严格模式下传入 `undefined`。

