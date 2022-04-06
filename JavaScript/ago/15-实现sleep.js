/**
 *
 * @param {*} fn 要执行的函数
 * @param {*} wait 等待的时间
 */
function sleep(wait) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });
}

let sayHello = (name) => console.log(`hello ${name}`);

async function autoRun() {
  await sleep(3000);
  let demo1 = sayHello("时光屋小豪");
  let demo2 = sayHello("掘友们");
  let demo3 = sayHello("aaa");
}

autoRun();

function sleep(fn, wait) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn);
    }, wait);
  });
}

let sayHello = (name) => console.log(`hello ${name}`);

async function autoRun() {
  let demo1 = await sleep(sayHello("aaa"), 3000);
  // let demo2 = await sleep(sayHello('bbb'), 3000);
  // let demo3 = await sleep(sayHello('ccc'), 3000);
}
autoRun();
