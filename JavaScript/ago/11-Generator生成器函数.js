// 实现迭代器
// function createIterator(items) {
//   let i = 0; // 计数器
//   return {
//     next() {
//       let done = (i >= items.length) // 数组内元素全部迭代完毕
//       let value = !done ? items[i++] : undefined;
//       return {
//         value,
//         done
//       }
//     }
//   }
// }

// let arr = [10, 20, 30];
// let it = createIterator(arr);


// let str = "abcd";
// let it = str[Symbol.iterator]();

// console.log(it.next())
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())

// function *generator() {
//   yield 1;
//   yield 2;
//   yield 3;
// }

// // 基于生成器函数执行的返回结果就是一个迭代器
// let g = generator();
// console.log(g)
// console.log(g.next()); 
// console.log(g.next()); 
// console.log(g.next()); 
// console.log(g.next()); 

function readFile(file) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(file);
    }, 1000);
	})
};

function asyncFunc(generator) {
	const iterator = generator(); // 接下来要执行next
  // data为第一次执行之后的返回结果，用于传给第二次执行
  const next = (data) => {
		let { value, done } = iterator.next(data); // 第二次执行，并接收第一次的请求结果 data
    console.log(value)
    if (done) return; // 执行完毕(到第三次)直接返回
    // 第一次执行next时，yield返回的 promise实例 赋值给了 value
    value.then(data => {
      next(data); // 当第一次value 执行完毕且成功时，执行下一步(并把第一次的结果传递下一步)
    });
  }
  next();
};

asyncFunc(function* () {
	// 生成器函数：控制代码一步步执行 
  let data = yield readFile(10); // 等这一步骤执行执行成功之后，再往下走，没执行完的时候，直接返回
  data = yield readFile(data + 10);
  return data;
})
