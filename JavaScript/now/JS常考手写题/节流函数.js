// 控制第一次触发或者不触发
/**
 * 实现 leading 功能
 * @param {*} fn
 * @param {*} interval
 * @param {*} options
 */
function throttle(fn, interval, options = { leading: true }) {
  const { leading } = options;
  let lastTime = 0; // 记录上一次的开始时间
  let timer = null;
  const _throttle = function (...args) {
    const nowTime = new Date().getTime();
    // 第一次不触发
    if (!lastTime && !leading) lastTime = nowTime;

    // 使用当前触发的时间和之前的时间间隔以及上一次开始的时间，计算出还剩余多长时间去触发函数
    const remainTime = interval - (nowTime - lastTime);

    if (remainTime <= 0) {
      fn.apply(this, args);
      // 保留上一次的触发时间
      lastTime = nowTime;
    } else if (!timer) {
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        fn.apply(this, args);
        lastTime = new Date().getTime();
      }, remainTime);
    }
  };

  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return _throttle;
}
