/*
  编写⼀个函数，实现查询数据中第三⼤的数值（数组中包含的数值不重复，并且数组⻓度⼤于 3），不允
  许对数组进⾏排序，⽐如：
  数组是 [1, 2, 3, 4, 5]，函数结果应该是 3
  数组是 [2, 6, 8, 4, 12, 20]，函数的结果应该是 8
  函数签名如下：
  function findThirdValue(arr: number[]) : number {
  查出 arr 中第三⼤的数值
  }
*/

var findThirdValue = function (arr) {
  let res = [].concat(arr.slice(0, 3)).sort((a, b) => a - b);
  for (let i = 3; i < arr.length; i++) {
    if (res[res.length - 1] < arr[i] || res[0] < arr[i]) {
      res.shift();
      res.push(arr[i]);
      res = res.sort((a, b) => a - b);
    }
  }

  return res[0];
};

/*
function findThirdValue(arr, k = 3) {
  let queue = [];

  arr.forEach((num) => {
    if (queue.length < k) {
      queue.push(num);
    } else if (Math.min(...queue) < num) {
      const index = queue.findIndex((item) => item === Math.min(...queue));
      queue[index] = num;
    }
  });
  return Math.min(...queue);
}
*/

const result1 = findThirdValue([2, 6, 8, 4, 12, 20]);
const result2 = findThirdValue([5, 3, 1, 2, 4]);
const result3 = findThirdValue([3, 0, 7, 23, 57, 2, 888, 33]);
console.log(result1);
console.log(result2);
console.log(result3);
