let arr = [1, [2, [3, 4, 5]]];
let arr2 = [1, 2, [6, 9, 10]];
let arr3 = [12, 23, [34, 56, ,]];

console.log(arr3.flat()); // [ 12, 23, 34, 56 ]

// 方法一
arr = arr.flat(2); // 只展开两层
arr = arr.flat(Infinity); // 可展开任意深度的嵌套数组

// 方法二：
arr = arr.toString().split(',').map(item => parseFloat(item));
arr = JSON.stringify(arr).replace(/(\[|\])/g, '').split(',').map(item => parseFloat(item));

// 方法三：递归
function flatten() {
  _this = this;
  let res = [];
  let cycleArray = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        res = res.concat(flatten(arr[i]));
      } else {
        res.push(arr[i]);
      }
    }
  }
  cycleArray(_this);
  return res;
}

Array.prototype.flatten = flatten;
arr = arr.flatten();

// 方法四：reduce 函数迭代
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

const res = flatten(arr);
console.log(res); // [ 1, 2, 3, 4, 5 ]

// 方法五：reduce + concat (此情况只适用展开一层嵌套数组)
const res1 = arr.reduce((acc, val) => {
  return acc.concat(val);
}, []);
console.log(res1); // [ 1, 2, 6, 9, 10 ]

// 方法六：栈思想
function flat(arr) {
  const newArr = []; 
  const stack = [].concat(arr);  // 将数组元素拷贝至栈，直接赋值会改变原数组
  //如果栈不为空，则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop(); // 删除数组最后一个元素，并获取它
    if (Array.isArray(val)) {
      stack.push(...val); // 如果是数组再次入栈，并且展开了一层
    } else {
      newArr.unshift(val); // 如果不是数组就将其取出来放入结果数组中
    }
  }
  return newArr;
}

console.log(flat(arr));