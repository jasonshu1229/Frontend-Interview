/**
 * 把add函数编程柯里化函数形式
 * @param {*} a
 * @param {*} b
 * @param {*} c
 * @param {*} c
 */
function add(a, b, c) {
  return a + b + c;
}

/**
 *
 * @param {*} fn 回调函数fn: add
 * @param {*} args addCurrying 函数后面的参数(curryAdd函数参数)
 */
function currying(fn) {
  return function addCurrying(...args) {
    if (args.length === fn.length) {
      return fn.apply(this, args);
    } else {
      // 继续分步传递其余参数
      return function (...remainArgs) {
        return addCurrying.apply(this, args.concat(remainArgs));
      };
    }
  };
}

var curryAdd = currying(add);

console.log(curryAdd(10, 20, 30));
console.log(curryAdd(10, 20)(30));
console.log(curryAdd(10)(20)(30));
