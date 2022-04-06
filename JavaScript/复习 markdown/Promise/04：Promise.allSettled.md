## 手动实现Promise.allSettled

> **MDN:** `Promise.allSettled()`方法返回一个在所有给定的promise都已经`fulfilled`或`rejected`后的promise，并带有一个对象数组，每个对象表示对应的promise结果。

> 当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个`promise`的结果时，通常使用它。

【译】`Promise.allSettled`跟`Promise.all`类似, 其参数接受一个`Promise`的数组, 返回一个新的`Promise`, 唯一的不同在于, 其不会进行短路, 也就是说当`Promise`全部处理完成后我们可以拿到每个`Promise`的状态, 而不管其是否处理成功。

### 用法 | 测试用例

```js
let fs = require('fs').promises;

let getName = fs.readFile('./name.txt', 'utf8'); // 读取文件成功
let getAge = fs.readFile('./age.txt', 'utf8');

Promise.allSettled([1, getName, getAge, 2]).then(data => {
	console.log(data);
});
// 输出结果
/*
	[
    { status: 'fulfilled', value: 1 },
    { status: 'fulfilled', value: 'zf' },
    { status: 'fulfilled', value: '11' },
    { status: 'fulfilled', value: 2 }
	]
*/

let getName = fs.readFile('./name123.txt', 'utf8'); // 读取文件失败
let getAge = fs.readFile('./age.txt', 'utf8');
// 输出结果
/*
	[
    { status: 'fulfilled', value: 1 },
    {
      status: 'rejected',
      value: [Error: ENOENT: no such file or directory, open './name123.txt'] {
        errno: -2,
        code: 'ENOENT',
        syscall: 'open',
        path: './name123.txt'
      }
    },
    { status: 'fulfilled', value: '11' },
    { status: 'fulfilled', value: 2 }
  ]
*/
```

### 实现

```js
function isPromise (val) {
  return typeof val.then === 'function'; // (123).then => undefined
}

Promise.allSettled = function(promises) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let times = 0;
    const setData = (index, data) => {
      arr[index] = data;
      if (++times === promises.length) {
        resolve(arr);
      }
      console.log('times', times)
    }

    for (let i = 0; i < promises.length; i++) {
      let current = promises[i];
      if (isPromise(current)) {
        current.then((data) => {
          setData(i, { status: 'fulfilled', value: data });
        }, err => {
          setData(i, { status: 'rejected', value: err })
        })
      } else {
        setData(i, { status: 'fulfilled', value: current })
      }
    }
  })
}
```

## 