/*
  for in循环的机制：
    @1 优先迭代数字属性「无法解决」
    @2 会遍历所有私有和公有的可枚举属性「性能最差的循环 & 公有的属性我们一般是不需要迭代的」
      即使通过 !obj.hasOwnProperty筛选私有属性，也是浪费性能，因为它会一直在往上查找筛选非公有属性
    @3 无法迭代Symbol类型的私有属性 「告别 for in 循环」
    @4 封装eachObject

  for of循环的机制
    @1 Iterator迭代器
    @2 for of原理
    @3 让对象也可以使用for of循环

  扩展：各种循环的性能对比？
*/

let obj = {
  name: "lsh",
  age: 12,
  [Symbol("AA")]: 100,
  0: 10,
  1: 20,
};

Object.prototype.AAA = 200;
Object.prototype[10] = 300;

/*
for (let key in obj) {
  if (!obj.hasOwnProperty(key)) break; // 避免迭代公有属性
  console.log(key);
}
*/

/*
  0
  1
  name
  age
*/

// for in 循环应该替换成
// let keys = Object.getOwnPropertyNames(obj); // 获取所有非Symbol类型的私有属性，结果是个数组，数组中包含属性名
// keys = keys.concat(Object.getOwnPropertySymbols(obj)); // 拼接上所有Symbol类型的私有属性
// keys.forEach((key) => {
//   console.log(key, obj[key]);
// });

/**
 * 封装一个遍历对象所有私有属性和属性值的函数
 * @param {*} obj
 * @param {*} callback
 */
const eachObject = function eachObject(obj, callback) {
  if (!utils.isPlainObject(obj))
    throw new TypeError("obj must be an plain object");
  if (!utils.isFunction(callback)) callback = Function.prototype; // 匿名空函数

  let keys = Object.getOwnPropertyNames(obj).concat(
    Object.getOwnPropertySymbols(obj)
  );
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = obj[key];
    let result = callback(key, value);
    if (result === false) break;
  }

  return obj;
};

// 过滤属性名为数字的情况
eachObject(obj, (key, value) => {
  if (key === "name") return false;
  console.log(key, value);
});
