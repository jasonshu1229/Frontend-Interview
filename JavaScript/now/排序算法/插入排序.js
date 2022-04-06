var arr = [3, 5, 2, 4, 1];

/**
 * 插入排序
 * @param {*} arr 需要排序的数组
 */
function insertionSort(arr) {
  var length = arr.length;
  var preIndex, current;

  for (var i = 1; i < length; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  console.log(arr);
  return arr;
}

// insertionSort(arr);
/*
  问题：为啥不是arr[preIndex = arr[preIndex + 1];
*/
