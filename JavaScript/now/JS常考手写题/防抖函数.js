function debounce(fn, delay) {
  let timer = null; // 1. 定义一个定时器，用来保存上一次的定时器

  // 2. 真正的执行函数
  const _debounce = function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };

  return _debounce;
}

function debounce2(fn, delay, immediate = false) {
  let timer = null;
  let isInvoke = false; // 是否执行过

  const _debounce = function (...args) {
    if (timer) clearTimeout(timer);

    if (immediate && !isInvoke) {
      fn.apply(this, args);
      isInvoke = true;
    } else {
      // 延迟执行
      timer = setTimeout(() => {
        fn.apply(this, args);
        isInvoke = false;
      }, delay);
    }
  };

  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = null;
  };

  return _debounce;
}
