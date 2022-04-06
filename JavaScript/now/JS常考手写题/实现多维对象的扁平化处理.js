/*
 实现多维对象的扁平化处理 
 处理后的结果
    {   
        1: 100,
        'a.b': 1,  
        'a.c': 2, 
        'a.d.e': 3,
        'a.d[2]': 200,  
        'b[0]': 1, 
        'b[1]': 2,    
        'b[2].a': 3,   
        'b[2].b': 4,  
        'c': 1
    }
 
 课后思考：编写unflatten，实现一维转多维? 类似的还有 Qs.stringify/parse 或者 JSON.stringify/parse！
 */

const obj = {
  a: {
    b: 1,
    c: 2,
    d: { e: 3, 2: 200 },
  },
  b: [1, 2, { a: 3, b: 4 }],
  c: 1,
  1: 100,
  x: {},
};

/**
 * 封装一个遍历对象所有私有属性和属性值的函数
 * @param {*} obj
 * @param {*} callback
 */
const eachObject = function eachObject(obj, callback) {
  if (isPlainObject(obj)) throw new TypeError("obj must be an plain object");
  if (isFunction(callback)) callback = Function.prototype; // 匿名空函数

  let keys = Object.getOwnPropertyNames(obj).concat(
    Object.getOwnPropertySymbols(obj)
  );
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = obj[key];
    let result = callback(key, value);
    console.log("result", result);
    if (result === false) break;
  }

  return obj;
};

const { isPlainObject, isEmptyObject, each, isFunction } = utils;

const flatten = function (obj) {
  let result = {};
  const flat = function (obj, attr) {
    let isObject = isPlainObject(obj);
    let isArray = Array.isArray(obj);
    if (isObject || isArray) {
      if (isObject && isEmptyObject(obj)) {
        result[attr] = {};
        return;
      }
      if (isArray && obj.length === 0) {
        result[attr] = [];
        return;
      }
      each(obj, (value, key) => {
        let temp = isNaN(key) ? `.${key}` : `[${key}]`;
        flat(value, !attr ? key : attr + temp);
      });
      return;
    }
    //  不是对象或数组的话
    result[attr] = obj;
  };
  flat(obj, "");
  return result;
};

const res = flatten(obj);
console.log(res);

// 1: 100
// a.b: 1
// a.c: 2
// a.d.e: 3
// a.d[2]: 200
// b[0]: 1
// b[1]: 2
// b[2].a: 3
// b[2].b: 4
// c: 1
// x: {}
