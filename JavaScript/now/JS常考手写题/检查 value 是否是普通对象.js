/**
 * 检查 value 是否是普通对象。
 * 也就是说该对象由 Object 构造函数创建或者 [[Prototype]] 为空。
 * @param {*} obj
 */
const isPlainObject = function isPlainObject(obj) {
  let proto, Ctor;
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]")
    return false;

  proto = Object.getPrototypeOf(obj); // 返回指定对象的原型
  if (!proto) return true; // Object.create(null)
  Ctor =
    Object.prototype.hasOwnProperty.call(proto, "constructor") &&
    proto.constructor;
  return typeof Ctor === "function" && Ctor === Object;
};

const obj = {
  a: [1, 2, { a: 3, b: 4 }],
  b: 1,
  1: 100,
  x: {},
};

console.log(isPlainObject(obj)); // true
console.log(isPlainObject(obj.a)); // false
