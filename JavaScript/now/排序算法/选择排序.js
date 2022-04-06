const arr = [5, 4, 3, 2, 1];

/**
 * 选择排序 O(n^2)
 * 思路：
 *    找到数组中的最小值，选中它并将其放在第一位
 *    接着找到第二小的值，选中它并将其放在第二位
 *    以此类推，执行 n-1 轮
 * @param {*} arr
 */
const selectionSort = function (arr) {
  for (let i = 0; i < arr.length - 1; i += 1) {
    let indexMix = i;
    for (let j = i; j < arr.length; j += 1) {
      if (arr[j] < arr[indexMix]) {
        indexMix = j;
      }
    }
    if (indexMix !== i) {
      const temp = arr[i];
      arr[i] = arr[indexMix];
      arr[indexMix] = temp;
    }
  }
};

selectionSort(arr);
console.log(arr);

/*
  一开始的indexMix默认是0，后来就改成 i 了。
*/
