let fs = require("fs").promises;

// let getName = fs.readFile('./name123.txt', 'utf8');
// let getAge = fs.readFile('./age.txt', 'utf8');

Promise.prototype.finally = function (callback) {
  return this.then(
    (data) => {
      // 让函数执行 内部会调用方法，如果方法是promise，需要等待它完成
      // 如果当前promise执行时失败了，会把err传递到，err的回调函数中
      return Promise.resolve(callback()).then(() => data); // data 上一个promise的成功态
    },
    (err) => {
      return Promise.resolve(callback()).then(() => {
        throw err; // 把之前的失败的err，抛出去
      });
    }
  );
};

// API
Promise.reject(123)
  .finally((data) => {
    console.log(data); // undefined
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("resolve");
      }, 3000);
    });
  })
  .then(
    (data) => {
      console.log(data, "success");
    },
    (err) => {
      console.log(err, "err"); // 123 err
    }
  );
