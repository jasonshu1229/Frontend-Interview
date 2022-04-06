/*
 * 迭代器（Iterator）是一种机制(接口)：为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署Iterator接口，就可以完成遍历操作「for of循环」，依次处理该数据结构的所有成员
 *   + 拥有next方法用于依次遍历数据结构的成员
 *   + 每一次遍历返回的结果是一个对象 {done:false,value:xxx}
 *     + done:记录是否遍历完成
 *     + value:当前遍历的结果
 *
 * 拥有Symbol.iterator属性的数据结构(值)，被称为可被遍历的，可以基于for of循环处理
 *   + 数组
 *   + 部分类数组：arguments/NodeList/HTMLCollection...
 *   + String
 *   + Set
 *   + Map
 *   + generator object
 *   + ...
 *
 * 对象默认不具备Symbol.iterator，属于不可被遍历的数据结构
 */

let arr = [10, 20, 30, 40];

// for (let item of arr) {
//   console.log(item); // 10 20 30 40
// }

/*
  首先获取 Array原型上的 Symbol.iterator 属性，其属性值是函数，并且把它执行，拿到一个 itor 迭代器对象
    每一轮循环都是执行一次 itor.next() -> {done:false, value: 10}
    把value值给item，当done: true的时候，结束循环
*/

arr[Symbol.iterator] = function () {
  let self = this,
    index = 0;
  return {
    next() {
      if (index > self.length - 1) {
        return {
          done: true,
          value: undefined,
        };
      }
      return {
        done: false,
        value: self[index++],
      };
    },
  };
};

// for (let item of arr) {
//   console.log(item); // 10 20 30 40
// }

let obj = {
  name: "lsh",
  age: 12,
  [Symbol["aa"]]: 100,
  0: 20,
};

// for of 不能遍历对象，因为对象的原型上没有 Symbol.iterator 属性
// for (let item of obj) {
//   console.log(item); // Unexpected end of input
// }

Object.prototype[Symbol.iterator] = function () {
  let obj = this,
    keys = Object.getOwnPropertyNames(obj).concat(
      Object.getOwnPropertySymbols(obj)
    ),
    index = 0;

  return {
    next() {
      if (index > keys.length - 1) {
        return {
          done: true,
          value: undefined,
        };
      }
      return {
        done: false,
        value: obj[keys[index++]],
      };
    },
  };
};

// for (let item of obj) {
//   console.log(item);
// }
// 20
// lsh
// 12
// 100

let obj2 = {
  0: 10,
  1: 20,
  2: 30,
  length: 3,
};

// 如果是类数组对象，可直接继承数组的Symbol.iterator

obj[Symbol.iterator] = Array.prototype[Symbol.iterator];

for (let value of obj2) {
  console.log(value);
}
// 10
// 20
// 30
// 3
