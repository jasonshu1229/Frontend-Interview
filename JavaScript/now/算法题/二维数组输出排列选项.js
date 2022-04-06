/**
 * 给定二维数组 [['A','B'], ['a','b'], [1, 2]], 二维数组长度不限 ，
 * 输出所有的排列组合项，即['Aa1','Aa2','Ab1','Ab2','Ba1','Ba2','Bb1','Bb2']
 */

const solution = (arr) => {
  let res = [""];

  for (let i = 0; i < arr.length; i++) {
    res = getValues(res, arr[i]);
  }

  return res;
};

const getValues = (arr1, arr2) => {
  let arr = [];
  for (let i = 0; i < arr1.length; i++) {
    let val1 = arr1[i];
    for (let j = 0; j < arr2.length; j++) {
      let val2 = arr2[j];
      let val = val1 + val2;
      arr.push(val);
    }
  }
  return arr;
};

let res = solution([
  ["A", "B"],
  ["a", "b"],
  [1, 2],
]);
console.log(res);
