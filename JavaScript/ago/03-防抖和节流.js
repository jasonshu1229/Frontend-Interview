/**
 * 实现函数的防抖（目的是频繁触发中只执行一次）
 * @param {*} func 需要执行的函数
 * @param {*} wait 检测防抖的间隔频率
 * @param {*} immediate 是否是立即执行（如果为TRUE是控制第一次触发的时候就执行函数，默认FALSE是以最后一次触发为准）
 * @return {可被调用执行的函数}
 */
// 以最后一次触发为准
function debounce(func, wait = 500, immediate = false) {
  let timer = null
  // console.log(this,'this') ----- window
  return function anonymous(...params) {
    clearTimeout(timer)
    // console.log(this,'this') ----- btn
    timer = setTimeout(_ => {
      // 在下一个500ms 执行func之前，将timer = null
      //（因为clearInterval只能清除定时器，但timer还有值）为了确保后续每一次执行都和最初结果一样，赋值为null
      // 也可以通过 timer 是否 为 null 是否有定时器
      timer = null  
      func.call(this, ...params)
    }, wait)
  }
}

// 以第一次触发为准
// (第一次点击，立即触发，随后立马接着点击，不会触发，除非超过间隔时间，重新触发函数)
function debounce(func, wait = 500, immediate = false) {
  let timer = null
  return function anonymous(...params) {
    // 第一点击 没有设置过任何定时器 timer就要为 null
    let now = immediate && !timer 
    clearTimeout(timer)
    timer = setTimeout(_ => {
      // 在下一个500ms 执行func之前，将timer = null
      //（因为clearInterval只能在系统内清除定时器，但timer还有值）为了确保后续每一次执行都和最初结果一样，赋值为null
      // 也可以通过 timer 是否 为 null 是否有定时器
      timer = null  
      !immediate ? func.call(this, ...params) : null
    }, wait)
    now ? func.call(this, ...params) : null
  }
}

function func() {
  console.log('ok')
}
btn.onclick = debounce(func, 500)

let timer = null 
    wait = 500

btn.onclick = function () {
  clearInterval(timer)
  timer = setTimeout(_ => {
    func()
  }, wait)
}

/**
 * 实现函数的节流 （目的是频繁触发中缩减频率）
 * @param {*} func 需要执行的函数
 * @param {*} wait 检测节流的间隔频率
 * @return {可被调用执行的函数}
 */
function throttle(func, wait) {
  let timer = null
      previous = 0  // 记录上一次操作的时间点
  return function anonymous(...params) {
    let now = new Date()  // 当前操作的时间点
        remaining = wait - (now - previous) // 剩下的时间
        // 两次间隔时间超过频率，把方法执行
        if (remaining <= 0) {
          // 此时已经执行func 函数，应该将上次触发函数的时间点 = now 现在触发的时间点
          clearTimeout(timer)
          timer = null
          previous = new Date()
          func.call(this, ...params)
        } else if(!timer){ 
          // 两次间隔的事件没有超过频率，说明还没有达到触发标准，设置定时器等待即可（还差多久等多久）
          timer = setTimeout( _ => {
            clearTimeout(timer)
            timer = null // 确保每次执行完的时候，timer 都清 0，回到初始状态
            previous = new Date()
            func.call(this, ...params)
          }, remaining)
        }
  }
}

function func() {
  console.log('ok')
}
btn.onclick = throttle(func, 500)