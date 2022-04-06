const list = [1, 2, 3];
const square = (num) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * num);
    }, 1000);
  });
};

/*
list.forEach(async (x) => {
  const res = await square(x);
  console.log(res);
});
*/

// 方案一：基于递归处理
const output = async function output() {
  let index = 0;
  if (index >= list.length) return;
  let x = list[index++],
    result;
  result = await square(x);
  console.log(result);
  output();
};

output();

// 方案二：基于 for await of 循环处理
/*
  触发 Symbol.asyncIterator这个方法执行（该方法遵循迭代器规范），返回迭代器对象
  每一轮循环都是返回 迭代器对象.next() -> {value: yield后处理的值(promise实例), done: false}
*/

const onByOneOutput = async function onByOneOutput() {
  let index = 0;
  list[Symbol.asyncIterator] = async function* () {
    yield square(list[index++]);
    yield square(list[index++]);
    yield square(list[index++]);
  };
  for await (let value of list) {
    console.log(value);
  }
};

onByOneOutput();
/*
1.代码运行后会输出什么结果？请写出来
  一秒后，三个异步微任务同时到达时间，分别输出 1 4 9
  原因：forEach循环是同步的，await操作是异步的，根据EventLoop事件循环机制，同步代码会瞬间执行3次，不会等待异步任务成功再执行，而是将异步任务放到异步任务队列当中

2.如果希望每隔1s输出一个结果，应该怎么改？请修改里面的代码
  方案一和方案二
*/
