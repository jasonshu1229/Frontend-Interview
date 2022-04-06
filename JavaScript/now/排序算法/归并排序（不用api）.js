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
function mergeSort(arr, l, r) {
  // 递归的边界
  if (arr.length === 1) return arr;
  // 确定分界点
  let mid = Math.floor(arr.length / 2);
  // 递归排序左右两个区间
  mergeSort(arr, l, mid);
  mergeSort(arr, mid + 1, r);
  // 使用两个指针模拟左右两个数组的头元素
  let i = l, // 左面数组的第一个元素下标
    j = mid + 1; // 右面数组的第一个元素下标
  let temp = []; // 临时存储两个数组比较后的最小值
  let k = 0; // 表示临时数组里有几个元素，同时也是下标

  // 循环终止条件某个数组到头
  while (i <= mid && j <= r) {
    // 通过指针移动存储两个数组中的最小值，同时索引指针向后移动一位
    if (arr[i] <= arr[j]) temp[k++] = arr[i++];
    else temp[k++] = arr[j++];
  }

  // 可能有一边的数组没有遍历完，直接插入到临时数组的后面
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= r) temp[k++] = arr[j++];

  // 把结果放到原数组
  for (let k = 0, i = l; i <= r; k++, i++) {
    arr[i] = temp[k];
  }
}

mergeSort(arr, 0, arr.length);
console.log(arr);
