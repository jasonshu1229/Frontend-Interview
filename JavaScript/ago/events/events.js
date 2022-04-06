// function EventEmitter() {
//   this._events = {}; // 默认给EventEmitter准备的
// }

// EventEmitter.prototype.on = function (eventName, callback) {
//   // 如果child上 不存在 _event属性，就往child上定义一个 {}
//   if (!this._events) {
//     this._events = {};
//   }
//   // 先去类中定义的对象查找 事件名称
//   //  没有的话，就需要去 定义一个数组，往里面插入回调函数
//   (this._events[eventName] || (this._events[eventName] = [])).push(callback);
// }

// EventEmitter.prototype.emit = function (...args) {

//   if (this._events && this._events[eventName]) {
//     this._events[eventName].forEach(event => {
//       event(...args);
//     })
//   }
// }

class EventEmitter {
  constructor() {
    // 事件对象，存放订阅的名字和事件
    this.events = {};
  }
  // 订阅事件的方法
  on(eventName,callback) {
    if (!this.events[eventName]) {
      // 注意时数据，一个名字可以订阅多个事件函数
      this.events[eventName] = [callback]
    } else  {
      // 存在则push到指定数组的尾部保存
      this.events[eventName].push(callback)
    }
  }
  // 触发事件的方法
  emit(eventName) {
    // 遍历执行所有订阅的事件
    this.events[eventName] && this.events[eventName].forEach(cb => cb());
  }
  // 移除订阅事件
  // removeListener(eventName, callback) {
  //   if (this.events[eventName]) {
  //     this.events[eventName] = this.events[eventName].filter(cb => cb != callback)
  //   }
  // }
  // // 只执行一次订阅的事件，然后移除
  // once(eventName,callback) {
  //   // 绑定的时fn, 执行的时候会触发fn函数
  //   let fn = () => {
  //     callback(); // fn函数中调用原有的callback
  //     this.removeListener(eventName,fn); // 删除fn, 再次执行的时候之后执行一次
  //   }
  //   this.on(eventName,fn)
  // }
}

// module.exports = EventEmitter;

let em = new EventEmitter();

function workDay() {
  console.log("每天工作");
}
function makeMoney() {
    console.log("赚100万");
}
function sayLove() {
  console.log("向喜欢的人示爱");
}
em.on("money",makeMoney);
em.on("love",sayLove);
em.on("work", workDay);

em.emit("money");
em.emit("love");  
em.emit("work");  