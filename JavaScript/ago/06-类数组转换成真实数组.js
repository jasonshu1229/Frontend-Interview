
/**
 * toArray: 转换为数组的方法
 *  @params 
 *    不固定数量，不固定类型
 *  @return
 *    [Array] 返回到的处理后的新数组
 */
let utils = (function () {

  function toArray() {
    // 多种方法实现
  }

  return {

  }
})();

let arr1 = utils.toArray(10, 20, 30); // => [10, 20, 30]
let arr2 = utils.toArray('A', 10, 20, 30); // => ['A', 10, 20, 30]

// 方法一： Es6的 ...剩余运算符
/*
let utils = (function () {
  function toArray(...args) {
    return args;
  }
  return {
    toArray;
  }
})();

let arr1 = utils.toArray(10, 20, 30); // => [10, 20, 30]
let arr2 = utils.toArray('A', 10, 20, 30); // => ['A', 10, 20, 30]

*/

// 当在函数参数中使用 ES6剩余运算符获取的参数集合本身（args）就已经是数组了

// 方法二： Es6  Array.from

let utils = (function () {

  function toArray() {
    
    // return [...arguments]
    return Array.from(arguments);
  }

  return {

  }
})();

// arguments是实参集合，获取的结果是一个类数组（箭头函数中没有arguments）
// 不能直接调取数组的方法（因为它不是Array的实例，而是Object的实例，因为其__proto__指向Object）

// 方法3 Array.prototype.slice.call()  浅克隆
let utils = (function () {

  function toArray() {
    // TODO: 原理： 只要把slice执行，让slice方法中的this变为arguments，
    // todo: 这样就可以把类数组转换为 数组了
    // 步骤： 1. 让slice执行  2.把this改变为 arguments
    // 前提：[].prototype.slice() 中传的参数，要有 length 属性，字符串 类数组可以，对象不可以

    /*
      [].forEach.call(argument, item => {
        console.log('循环输出类数组中的每一项', item)
      })
    */
    return Array.prototype.slice.call(arguments);
  }

  return {
    toArray
  }
})();

let arr1 = utils.toArray(10, 20, 30); // => [10, 20, 30]
let arr2 = utils.toArray('A', 10, 20, 30); // => ['A', 10, 20, 30]

// slice的实现过程
Array.prototype.slice = function slice() {
  // this 指的是 array
  let newArray;
  for(let i=0; i< this.length; i++) {
    newArray.push(this[i]);
  }
}

let array = [1,2,3];
array.slice() // => [1, 2, 3]