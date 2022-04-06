const EventEmitter = require('./events');
// const util = require('util');

function Child() {};

util.inherits(Child, EventEmitter);

let child = new Child();

const sleep = (name) => console.log(name, '在睡觉');
const eat = (name) => console.log(name, '在吃饭');

// 订阅事件： 事件的名称，回调函数
child.on('小孩淘气', sleep);
child.on('小孩淘气', eat);

// console.log(child._events);
// { '小孩淘气': [ [Function: sleep], [Function: eat] ] }

// 触发事件： 事件的名称，谁在调用，
child.emit('小孩淘气', '小明')