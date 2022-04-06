let arr = [12, 23, 12, 15, 25, 23, 16, 25, 16];
/*
  // Set方案
  let setObj = new Set(arr); // Set(5) { 12, 23, 15, 25, 16 } 得到的是 set的实例对象
  // let newArr = [...setObj];
  let newArr = Array.from(setObj); // [ 12, 23, 15, 25, 16 ]
  console.log(newArr); // [ 12, 23, 15, 25, 16 ]
*/

// todo 类型1： 不创建新数组情况，在原数组上操作
// 拿出当前项和后面的内容进行比较 (取每个项开始比较的时候，不用取到数组最后一项，因为后面没有元素了)
// for(let i = 0; i < arr.length - 1; i++) {
//   let item = arr[i]; // 取得当前数组中的每一项
//   let remainArgs = arr.slice(i+1); // 从 i+1项开始截取数组中剩余元素，包括i+1位置的元素
//   if (remainArgs.indexOf(item) > -1) {
//     // 数组的后面元素 包含当前项，应该把当前项删除掉
//     arr.splice(i, 1); // 从索引为i的位置，删除一个元素
//     i--;
//   }
// }

// console.log(arr)

// 方法2 
/*
for(let i = 0; i < arr.length - 1; i++) {
  let item = arr[i]; // 取得当前数组中的每一项
  let remainArgs = arr.slice(i+1); // 从 i+1项开始截取数组中剩余元素，包括i+1位置的元素
  if (remainArgs.indexOf(item) > -1) {
    // 数组的后面元素 包含当前项，把当前项赋值 null
    arr[i] = null; // [null, null, 12, 15, null, 23, null, 25, 16]
  }
}
arr = arr.filter(item => item !== null);
console.log(arr); // [ 12, 15, 23, 25, 16 ]
*/

/*
let obj = {};
for (let i=0; i < arr.length; i++) {
  let item = arr[i]; // 取得当前项
  if (typeof obj[item] !== 'undefined') {
    // obj 中存在当前属性，则证明当前项 之前已经是 obj属性了
    // 删除当前项
    arr[i] = arr[arr.length-1];
    arr.length--;
    i--;
  }
  obj[item] = item; // obj {10: 10, 16: 16, 25: 25 ...}
}
obj = null; // 垃圾回收
console.log(arr);
*/


// arr.sort((a,b) => a-b);
// arrStr = arr.join('@') + '@';
// let reg = /(\d+@)\1*/g,
//     newArr = [];
//     /**
//      * val：reg正则捕获的内容
//      * group： 每次分组捕获的内容
//      */
// arrStr.replace(reg, (val, group1) => {
//   // console.log(val, group1);
//   /*
//     12@12@ 12@
//     15@ 15@
//     16@16@ 16@
//     23@23@ 23@
//     25@25@ 25@
//   */
// //  newArr.push(Number(group1.slice(0, group1.length-1)));
//  newArr.push(parseFloat(group1));
// })
// console.log(newArr); // [ 12, 15, 16, 23, 25 ]

for(let i = 0; i < arr.length - 1; i++) {
  let item = arr[i]; // 取得当前数组中的每一项
  let remainArgs = arr.slice(i+1); // 从 i+1项开始截取数组中剩余元素，包括i+1位置的元素
  if (remainArgs.indexOf(item) > -1) { // 数组的后面元素 包含当前项
    arr[i] = arr[arr.length - 1]; // 用数组最后一项替换当前项
    arr.length--; // 删除数组最后一项
    i--; // 仍从当前项开始比较
  }
}

console.log(arr); // [ 16, 23, 12, 15, 25 ]
