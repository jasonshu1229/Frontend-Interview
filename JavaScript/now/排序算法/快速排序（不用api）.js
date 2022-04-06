var arr = [3, 6, 2, 1, 7, 8, 4, 10, 9, 19, 14, 11];

/**
 * 快速排序 时间复杂度 O(nlogn)
 * @param {*} arr 待排序的数组
 * @param {*} l 左边界
 * @param {*} r 右边界
 */
var quickSort2 = function (arr, l, r) {
  if (l >= r) return;
  let x = l,
    y = r;
  let base = arr[l];

  while (x < y) {
    while (x < y && arr[y] >= base) y--; // 找到右边比基准小的值
    if (x < y) arr[x++] = arr[y]; // 放到左指针的位置

    while (x < y && arr[x] <= base) x++; // 找到左边大于基准的值
    if (x < y) arr[y--] = arr[x]; // 把左侧大于基准的值放到右指针的位置，右指针往左移动一下
  }

  arr[x] = base;

  quickSort2(arr, l, x - 1);
  quickSort2(arr, x + 1, r);
};

quickSort2(arr, 0, arr.length - 1);
console.log(arr);
