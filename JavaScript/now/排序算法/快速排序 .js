var arr = [3, 6, 2, 1, 7, 8, 4, 10, 9, 19, 14, 11];
/*
1.先对数组进行对半，找一个基准元素（或者任意找基准都可以）
2.然后遍历数组中的元素，与基准进行大小比较，如果比基准元素小的则放在left数组，比基准元素大的则放在right数组
3.最后进行递归调用，并将left、基准元素、right三者合并成一个数组返回即可。
*/
/**
 * 快速排序 时间复杂度 O(nlogn)
 * @param {*} arr
 */
var quickSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  }

  // 基准数可以选中间数也可默认数组第一个数
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];

  var left = [];
  var right = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(left).concat([pivot], quickSort(right));
};
const res = quickSort(arr);
console.log(res);
