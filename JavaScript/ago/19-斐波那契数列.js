/*
  请实现一个fibonacci函数，要求实现以下功能
  斐波那契数列：[1, 1, 2, 3, 5, 8, 13, 21...]
  fibonacci(0) => 1
  fibonacci(4) => 5
  ...
*/

/**
 *
 * @param {*} n
 */
// function fibonacci(n) {
//   if (n <= 1) return 1;
//   let arr = [1, 1];
//   // i 要创建多少个元素
//   let i = n + 1 - 2;
//   while (i > 0) {
//     let a = arr[arr.length - 2];
//     let b = arr[arr.length - 1];
//     arr.push(a + b);
//     i--;
//   }
//   return arr[arr.length - 1];
// }

// 递归实现 方法1
// function fibonacci(count) {
//   function fn(count, curr = 1, next = 1) {
//     if (count === 0) {
//       return curr;
//     } else {
//       return fn(count - 1, next, curr + next);
//     }
//   }
//   return fn(count);
// }

// 递归实现 方法2
// function fibonacci(n) {
//   if (n - 2 >= 0) {
//     return fibonacci(n - 2) + fibonacci(n - 1);
//   } else {
//     return 1;
//   }
// }

// 非递归实现
function fibonacci(index) {
  if (index <= 1) return 1;
  let curr = 1;
  let next = 1;
  let sum;
  
  for (let j =2; j <= index; j++) {
    sum = curr + next;
    curr = next;
    next = sum;
  }
  return sum;
}

console.log(fibonacci(0));
console.log(fibonacci(1));
console.log(fibonacci(2));
console.log(fibonacci(3));
console.log(fibonacci(5));
