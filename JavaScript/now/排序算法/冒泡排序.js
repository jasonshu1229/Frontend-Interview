var arr2 = [3, 5, 2, 4, 1];

/**
 * 冒泡排序 复杂度 O(n^2) 性能最差
 * 步骤：
 *    比较所有相邻元素，如果第一个比第二个大，则交换它们
 *    一轮下来，可以保证最后一个数是最大的
 *    n个数,n-1轮可以排序完整
 * @param {*} arr
 */
function bubbleSort(arr) {
  // 外层循环控制循环 n-1 轮
  for (let i = 0; i < arr.length - 1; i += 1) {
    // 依次遍历每两个相邻的元素，每两两交换完，就减少一轮的比较
    for (let j = 0; j < arr.length - 1 - i; j += 1) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}
bubbleSort(arr2);
console.log(arr2);
