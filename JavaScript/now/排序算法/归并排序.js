var arr = [3, 5, 2, 4, 1];

/**
 * 归并排序 时间复杂度 O(logn*n)
 * 思路：
 *    - 分：把数组劈成两半，再递归地对子数组进行“分”操作，
 *         直到分成一个个单独的数
 *    - 合：把两个数合并为有序数组，再对有序数组进行合并，
 *         直到全部子数组合并为一个完整数组
 
 *  合并两个有序数组的思路：
      - 新建一个空数组 res，用于存放最终排序后的数组
      - 比较两个有序数组的头部，较小者出队并推入 res 中
      - 如果两个数组还有值，就重复第二步
        等两个数组中的值都被推入到 res 中时，合并操作就算完成了
          
 * @param {*} arr 
 */
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid, arr.length);

  // 递归遍历到最后都是数，也是有序数组
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const res = [];

  while (left.length || right.length) {
    if (left.length && right.length) {
      res.push(left[0] < right[0] ? left.shift() : right.shift());
    } else if (left.length) {
      res.push(left.shift());
    } else if (right.length) {
      res.push(right.shift());
    }
  }

  return res;
}

const resArr = mergeSort(arr);
console.log(resArr);
