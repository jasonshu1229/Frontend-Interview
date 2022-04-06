## 1.promise解决了哪些问题？

- 异步并发问题（Promise.all）
- 异步串行回调地狱问题（Promise的链式调用）
- 错误处理非常方便（catch方法）

### 问题1：异步并发问题

来看下面几句代码，假如想让两个文件的内容全部读取完毕之后，在控制台输出**两个文件读取完毕**

```js
const fs = require('fs').promises;

let getName = fs.readFile('./name.txt', 'utf8');
let getAge = fs.readFile('./age.txt', 'utf8');

console.log(getName);
console.log(getAge);

console.log('两个文件读取完毕');
/*
	Promise { <pending> }
	Promise { <pending> }
	两个文件读取完毕
*/
```

细心地小伙伴一看就能看出来，前面有两个`异步`任务，怎么可能会出错呢？

#### 问题1的解决方法

那我们来用`Promise.all`解决一下：

```js
const fs = require('fs').promises;

let getName = fs.readFile('./name.txt', 'utf8')
let getAge = fs.readFile('./age.txt', 'utf8')

let p = Promise.all([1, 2, getName, getAge, 3]).then(data => {
  console.log(data);
});
p.then(() => {
  console.log('两个文件读取完毕');
})

/*
	[ 1, 2, 'zf', '11', 3 ]
	两个文件读取完毕
*/
```

关于`Promise.all`，我们后面做详细讲解

### 问题2：异步串行回调地狱问题

下面代码中的两个文件，`name.txt`：age.txt，`age.txt`：11

根据`name.txt`文件的结果读取`age.txt`内容，最终返回`age.txt`内容

```js
fs.readFile('./name.txt', 'utf8', function (err, data) {
  fs.readFile(data, 'utf8', function (err, data) {
    console.log(data); // 11
  })
})
```

来用`Promise`的链式调用解决回调地狱问题的思路如下：

#### 问题2的解决方案

【链式调用解决回调地狱嵌套问题】

- 步骤1：先定义一些`read`函数，读取`name.txt`文件，成功后再读取`age.txt`内容

```js
read('./name.txt', 'utf8').then(data => {
	...
})
```

由于`read`函数有`then`方法，所以可知`read`是一个`Promise`实例对象

- 步骤2：定义`read`函数，返回一个新的`Promise`

```js
function read (...args) {
	return new Promise((resolve, reject) => {
		fs.readFile(...args, function (err, data) {
			if (err) reject(err);
      resolve(data); // 读取 name.txt文件内容成功
    })
  })
}
```

- 步骤3：在`read.then`方法中，取得返回的`data`，继续`read`下一个文件

```js
read('./name.txt', 'utf8').then(data => {
	return read(data, 'utf8');
})
```

【完整版流程】

```js
const fs = require('fs');

function read (...args) {
	return new Promise((resolve, reject) => {
		fs.readFile(...args, function (err, data) {
			if (err) reject(err);
      resolve(data); // 读取 name.txt文件内容成功
    })
  })
}

read('./name.txt', 'utf8').then(data => {
	return read(data, 'utf8');
}, err => {
	console.log(err); // 读取name.txt时的错误处理
}).then(data => {
	console.log(data); // 最终结果： 11
}, err => {
	console.log(err); // 读取age.txt时的错误处理
})
```

###  问题3：错误处理异常方便

在`Promise`出现之前，错误处理是基于回调函数的，同时也构成了回调地狱问题。看下面代码：

```js
fs.readFile('a.txt', 'utf8', function(err, data) {
	if (err) return console.log(err);
  fs.readFile('b.txt', 'utf8', function(err, data) {
    if (err) return console.log(err);
    fs.readFile('c.txt', 'utf8', function(err, data) {
    	if (err) return console.log(err);
	  })
  })
})
```

在`Promise`出来之后，我们可以通过`rejected`失败状态的时候，执行`onRecjected`失败的回调函数

```js
const fs = require('fs');

function read (...args) {
	return new Promise((resolve, reject) => {
		fs.readFile(...args, function (err, data) {
			if (err) reject(err);
      resolve(data); // 读取 name123.txt文件失败
    })
  })
}

// 读取 name123.txt 失败
read('./name123.txt', 'utf8').then(data => {
	return read(data, 'utf8');
}, err => {
	console.log(err, 'first error'); 
  // [Error: ENOENT: no such file or directory, open './name111.txt'] first error
}).then(data => {
	console.log(data); 
}, err => {
	console.log(err, 'second error'); 
})

// 读取 name.txt成功之后，读取 age.txt111内容失败
read('./name123.txt', 'utf8').then(data => {
	return read(data+111, 'utf8');
}, err => {
	console.log(err, 'first error'); 
}).then(data => {
	console.log(data); 
}, err => {
	console.log(err, 'second error'); 
  // [Error: ENOENT: no such file or directory, open './age.txt111'] second error
})
```

- 当我们读取`name123.txt`发现找不到时，会执行第一个 `err`的回调函数
- 当我们读取`name.txt`成功之后，紧接着读取第二个`age.txt111`文件失败之后，会执行第二个`err`的回调函数

这时候有的小伙伴就该想了，如果没有写`onRecjected`的失败 | 错误处理回调函数呢，是不是该用`catch`了呢？

答案是的，看下面代码：

```js
read('./name123.txt', 'utf8').then(data => {
	return read(data, 'utf8');
}).then(data => {
	console.log(data);
}).catch(err => {
  console.log(err); // [Error: ENOENT: no such file or directory, open './name123.txt']
})
```

如果在读取第一个`name123.txt`文件就失败的时候，又没有`onRecjected`的错误回调函数时，就会直接走到`catch`中，把前面的异常给捕获到。

但是如果在`catch`前面定义了`onRecjected`的错误回调函数时，就会先走它，请看下面代码：

```js
read('./name123.txt', 'utf8').then(data => {
	return read(data, 'utf8');
}).then(data => {
	console.log(data);
}, err => {
	console.log(err, 'second error'); // 读取age123.txt时的错误处理
  // [Error: ENOENT: no such file or directory, open './name123.txt']  second error
}).catch(err => {
  console.log(err); // return undefined
})
```

【综上所述】异步任务结合`Promise`时的错误处理，遵循了`就近法则`，从上到下，哪个错误处理的回调函数离的近就走哪个，都没有的话就执行`catch`捕获。

> 其实`catch`就是`then(null, err => {...} )`函数的别名，因为执行完`catch`的回调函数之后，相当于函数里面返回了`undefined`，会继续走到下一个`then`的成功回调函数中。（具体原因在后面的链式调用篇幅中详细说明）

## 2.promise的弊端，以及如何解决？

`promise`最大的弊端**依旧是基于原生的回调函数嵌套处理**

但是后来，我们可以基于`generator` + `async/await`处理

```js
fs.readFile('a.txt', 'utf8', function(err, data) {
	if (err) return console.log(err);
  
  fs.readFile('b.txt', 'utf8', function(err, data) {
    if (err) return console.log(err);
    
    fs.readFile('c.txt', 'utf8', function(err, data) {
    	if (err) return console.log(err);
      
      fs.readFile('c.txt', 'utf8', function(err, data) {
        if (err) return console.log(err);
      })
	  })
  })
})
```



