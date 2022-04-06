function func(x, y, ev) {
  console.log(this, x, y, ev);
  console.log(typeof this)
}

const obj = { name: "jason" };

// document.body.click = func.bind(obj, 10, 20);

/**
 * this: 要处理的函数 func
 * context: 要改变的函数中的this指向 obj
 * params：要处理的函数传递的实参 [10, 20]
 */
Function.prototype._bind = function(context, ...params) {
  let _this = this; // this: 要处理的函数
  return function anonymous (...args) {
    // args： 可能传递的事件对象等信息 [MouseEvent] 
    // this：匿名函数中的this是由当初绑定的位置 触发决定的 （总之不是要处理的函数func）
    // 所以需要_bind函数 刚进来时，保存要处理的函数 _this = this
    _this.call(context, ...params.concat(args));
  }
}

func._bind(obj, 10, 20)();

// todo：匿名函数中的 args，有的时候可能是ev，有的时候可能也没有，比如在定时器中
// document.body.onClick = function anonymous (ev) {
//   func.call(obj, 10, 20);
// }
// setTimeout(func.bind(obj, 10, 20), 1000); // 定时器中的bind函数返回的匿名函数中，就不会有 args
// setTimeout(function anonymous () {
//   ...
// }, 1000);