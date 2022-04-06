function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue, map = new WeakMap()) {
  if (originValue instanceof Set) {
    return new Set([...originValue]);
  }

  if (originValue instanceof Map) {
    return new Map([...originValue]);
  }

  if (typeof originValue === "symbol") {
    return Symbol(originValue.description);
  }

  if (typeof originValue === "function") {
    return originValue;
  }

  if (!isObject(originValue)) {
    return originValue;
  }

  // 避免循环引用，用set记录不重复
  if (map.has(originValue)) {
    return map.get(originValue);
  }

  let constructor = originValue.constructor;
  if (/^(RegExp|Date)$/i.test(constructor.name)) {
    return new constructor(originValue);
  }

  const newObj = Array.isArray(originValue) ? [] : {};
  map.set(originValue, newObj);
  for (const key in originValue) {
    newObj[key] = deepClone(originValue[key], map);
  }

  // 由于 Symbol 类型的 key 不能被拷贝，所以需要单独处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const skey of symbolKeys) {
    newObj[skey] = deepClone(originValue[skey], map);
  }

  return newObj;
}

let s1 = Symbol("aaa");
let s2 = Symbol("bbb");

let obj = {
  a: 100,
  b: [10, 20, 30],
  c: {
    x: 10,
  },
  foo: function (m, n) {
    console.log("foo function");
    console.log("100行逻辑代码");
    return 123;
  },
  // Symbol作为key和value
  [s1]: "abc",
  s2: s2,
  set: new Set(["aaa", "bbb", "ccc"]), // set map 不作处理 会变成普通空对象
  map: new Map([
    ["aaa", "abc"],
    ["bbb", "cba"],
  ]),
  d: /^\d+$/,
  f: new Date(),
  // d: BigInt('10')
};

obj.info = obj;

const newObj = deepClone(obj);
console.log(newObj);

obj.b = [11, 22, 33];
obj.c = {
  x: 20,
};

console.log(obj);
// console.log(newObj.info.info.info);
