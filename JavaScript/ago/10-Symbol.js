/*
  let n = Symbol(),
      m = Symbol();
  console.log(n === m); // false

  n = Symbol('A');
  m = Symbol('A');
  console.log(n === m); // false
*/

/*
let n = Symbol('Key');
// 把n 作为obj的唯一属性

let obj = {
  name: "jason",
  age: 18,
  [n]: 100
}

console.log(obj); // { name: 'jason', age: 18, [Symbol(Key)]: 100 }
// console.log(obj[Symbol['key']]); // undefined

obj[Symbol('Key')] = 200;
// console.log(obj); // { name: 'jason', age: 18, [Symbol(Key)]: 100, [Symbol(Key)]: 200 }
console.log(obj[n])
*/

// let obj = {
//   0: 1,
//   1: 2,
//   length: 2,
//   [Symbol.iterator]: Array.prototype[Symbol.iterator]
// };

// for (let item of obj) {
// 	console.log(item); // 1 , 2
// }

let a = {
	value: 0,
  [Symbol.toPrimitive](hint) {
		console.log(hint); 
    // hint的三种情况
    // default：可能转换为数字，也可能是字符串
    // number:： 转换为字符串
    // string: 转换为字符串
    return ++this.value;
  }
}

a + 10
String(a);