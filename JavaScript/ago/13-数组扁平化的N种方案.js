let arr = [12, 23, [34, 56, [78, 90, 100, [110, 120, 130]]]];
// console.log(arr.flat());
// console.log(arr.flat(2));
// console.log(arr.flat(Infinity));
// console.log(arr.flat(0));
// console.log(arr.flat(-10));

let arr2 = [12, 23, [34, 56, ,]]
console.log(arr2.flat());

// let arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]]]
// 方案1：
// arr = arr.flat(2);
// arr = arr.flat(Infinity);

// 方案2：
// arr = arr.toString().split(',').map(item => parseFloat(item)); 
// arr = JSON.stringify(arr).replace(/(\[|\])/g, '').split(',').map(item => parseFloat(item));


// function myFlat() {
//   _this = this; // 保存 this：arr
//   let newArr = [];
//   // 循环arr中的每一项，把不是数组的元素存储到 newArr中
//   let cycleArray = (arr) => {
//     for (let i=0; i< arr.length; i++) {
//       let item = arr[i];
//       if (Array.isArray(item)) { // 元素是数组的话，继续循环遍历该数组
//         cycleArray(item);
//         continue;
//       } else{
//         newArr.push(item); // 不是数组的话，直接添加到新数组中
//       }
//     }
//   }
//   cycleArray(_this); // 循环数组里的每个元素
//   return newArr; // 返回新的数组对象
// }

// Array.prototype.myFlat = myFlat;

// arr = arr.myFlat();

// console.log(arr)

// const myFlat = (arr) => {
//   let newArr = [];
//   let cycleArray = (arr) => {
//     for(let i = 0; i < arr.length; i++) {
//       let item = arr[i];
//       if (Array.isArray(item)) {
//         cycleArray(item);
//         continue;
//       } else {
//         newArr.push(item);
//       }
//     }
//   }
//   cycleArray(arr);
//   return newArr;
// }

// console.log(myFlat(arr))

// const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]

// const myFlat = arr => {
//   return arr.reduce((pre, cur) => {
//     return pre.concat(Array.isArray(cur) ? myFlat(cur) : cur);
//   }, []);
// };


// arr.reduce((pre, cur) => {
//   return pre.concat(cur);
// }, []);


// console.log(myFlat(arr)); 

// let arr1 = [12, 23, [34, 56, [78, 90, 100, [110, 120, 130, 140]]]];
// // 栈思想
// function flat(arr) {
//   const newArr = []; 
//   const stack = [].concat(arr);  // 将数组元素拷贝至栈，直接赋值会改变原数组
//   //如果栈不为空，则循环遍历
//   while (stack.length !== 0) {
//     const val = stack.pop(); // 删除数组最后一个元素，并获取它
//     if (Array.isArray(val)) {
//       stack.push(...val); // 如果是数组再次入栈，并且展开了一层
//     } else {
//       newArr.unshift(val); // 如果不是数组就将其取出来放入结果数组中
//     }
//   }
//   return newArr;
// }

// console.log(flat(arr1));