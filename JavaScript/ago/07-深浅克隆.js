// 浅克隆：只复制对象或数组的第一级内容
// 深克隆： 克隆后数组的每一级和原始数组或对象都没有关联

let obj = {
  a: 100,
  b: [10, 20, 30],
  c: {
    x: 10,
  },
  d: /^\d+$/,
  // d: function() {}
  // d: new Date()
  // d: BigInt('10')
  // d: Symbol('f')
};

// 实现对象的克隆
// 克隆： 内存地址是不一样的
// 浅克隆： Object.assign(); {...obj}
// let newObj = Object.assign({}, obj)
// console.log(newObj === obj); // false
// console.log(newObj.b === obj.b); // true

let arr = [
  10,
  [100, 200],
  {
    x: 10,
    y: 20,
  },
];

// TODO 暴力法：把原始数据直接变为字符串，再把字符串变为对象（此时浏览要重新开辟所有的内存空间），实现深度克隆/深拷贝
/*
  let newArr = JSON.parse(JSON.stringify(arr));
  console.log(newArr === arr); // false
  console.log(newArr[2] === arr[2]); // false
*/

// 弊端： 正则会变为空对象/函数直接消失/日期直接变成字符串/Symbol直接消失/BigInt('10')直接报错/undefined直接消失
// 原因： 不是JSON格式的对象，乱七八糟的格式当然不能被处理
// let newArr = JSON.parse(JSON.stringify(arr));
// console.log(newArr === arr); // false
// console.log(newArr[2] === arr[2]); // false

// 所以没有以上形式的属性时，可以用一些API方法

// -------------------------------------------------

// 实现数组的克隆
// 浅克隆： slice/concat
// forEach/map/reduce... 遍历也只遍历第一级
// let newArr = arr.slice();
// console.log(newArr === arr); // false
// console.log(newArr[2] === arr[2]) // true

// 实现一个 深克隆方法
// function cloneDeep(obj) {

//   if(obj===null) return null;
//   if(typeof obj !== 'object') return obj; // 函数不克隆

//   // 已经是引用类型了
//   const constructor = obj.constructor;
//   if(/^(RegExp|Date)$/i.test(constructor.name)) return new constructor(obj);

//   let clone = new constructor();

//   for (let key in obj) {
//     if (!obj.hasOwnProperty(key)) break;
//     clone[key] = cloneDeep(obj[key]);
//   }

//   return clone;
// }
const isObject = (target) =>
  (typeof target === "object" || typeof target === "function") &&
  target !== null;

function deepClone(target, map = new Map()) {
  // 先判断该引用类型是否被 拷贝过
  if (map.get(target)) {
    return target;
  }
  // 获取当前值的构造函数：获取它的类型
  let constructor = target.constructor;
  // 检测当前对象target是否与 正则、日期格式对象匹配
  if (/^(RegExp|Date)$/i.test(constructor.name)) {
    return new constructor(target); // 创建一个新的特殊对象(正则类/日期类)的实例
  }
  if (isObject(target)) {
    map.set(target, true); // 为循环引用的对象做标记
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}

let newArr = deepClone(arr);
// console.log(newArr === arr); // false
// console.log(newArr[2] === arr[2]); // false

let newObj = deepClone(obj);
// console.log(newObj === obj); // false
// console.log(newObj.d === obj.d); // false
console.log("obj", obj);
console.log("newObj", newObj);

// Object.keys(obj).forEach();
// Object.keys(obj)  只遍历私有属性 （原型上可能有公共的方法，其他人定义的）

// cloneDeep 的弊端，没有对循环引用形成的死递归做处理
