Array.myfrom = (function () {
  const toStr = Object.prototype.toString
  const isCallable = fn => typeof fn === 'function' || toStr.call(fn) === '[object Function]'
  
  const toInteger = value => {
      const v = Number(value)
      if(isNaN(v))    return 0
      // 无穷大或者0 直接返回
      if(v === 0 || !isFinite(v)) return v
      return (v > 0 ? 1 : -1) * Math.floor(Math.abs(v))
  }
  // 最大的范围Number.MAX_SAFE_INTEGER
  const maxSafeInteger = Number.MAX_SAFE_INTEGER
  
  const toLength = value => {
      const len = toInteger(value)
      return Math.min(maxSafeInteger, Math.max(0, len))
  }
  return function myfrom (arrayLike/*, mapFn, thisArg*/) {
      const that = this
      console.log('this', that)
      if(arrayLike === null) throw new TypeError("Array.from requires an array-like object - not null or undefined")
      
      const items = Object(arrayLike)
      let thisArg = ''
      // 判断mapFn是否undefined, 这里最好不要直接使用undefined,因为undefined不是保留字,
      // 很有可能undefined是个值  最好用 void 0 或者 void undefined 
      const mapFn = arguments.length > 1 ? arguments[1] : void 0
      if( typeof mapFn !== 'undefined') {
          // 接下来判断第二个参数是不是构造函数
          if( !isCallable(mapFn) ) throw new TypeError("Array.from when provided mapFn must be a function")
          if( arguments.length > 2) thisArg = arguments[2]
      }
      const len = toLength(items.length)
      const arr = isCallable(that) ? Object(new that(len)) : new Array(len)

      let i = 0,
          iValue;
      while ( i < len) {
          iValue = items[i]
          if(mapFn) arr[i] = typeof thisArg === 'undefined' ? mapFn(iValue,i) : mapFn.call(thisArg, iValue, i)
          else 
              arr[i] = iValue
          i++
      }
      arr.length = len
      return arr
  }
})()

Array.myfrom('foo'); 
// [ "f", "o", "o" ]
