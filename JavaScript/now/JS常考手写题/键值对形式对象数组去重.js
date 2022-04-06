/*
  [{a:1, b:2},{a:1},{a:1}, {a:1, b:{c:1}}, {b:{c:1}, a:1}]
  => [{a:1, b:2}, {a:1}, {a:1, b:{c:1}}]
*/

var arr = [
  { a: 1, b: 2 },
  { a: 1 },
  { a: 1 },
  { a: 1, b: { c: 1 } },
  { b: { c: 1 }, a: 1 },
];

var keyArr = [
  { key: "01", value: "乐乐" },
  { key: "02", value: "博博" },
  { key: "03", value: "淘淘" },
  { key: "04", value: "哈哈" },
  { key: "01", value: "乐乐" },
];

/*
function arrayUnique(arr, name) {
  let obj = {},
    result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i].key]) {
      result.push(arr[i]);
      obj[arr[i].key] = true;
    }
  }
  return result;
}
*/

/**
 * 去除数组对象中含有相同属性 key 的元素
 * @param {*} arr
 * @param {*} name
 */
/*
  思路：判断当前数组成员的key是否存在于 obj 中
      如果已经存在，将这个 obj 中的key 设置为空，并且设置为 true
      如果不存在，obj 中的key 为当前数组成员的 key，并且值设置为 true,再将当前数组成员添加到返回值中
*/
function arrayUnique(arr, name) {
  let hash = {};
  return arr.reduce(function (item, next) {
    hash[next[name]] ? "" : (hash[next[name]] = true && item.push([next]));
    return item;
  }, []);
}
const res = arrayUnique(keyArr, "key");
console.log(res);

/*
[
  [ { key: '01', value: '乐乐' } ],
  [ { key: '02', value: '博博' } ],
  [ { key: '03', value: '淘淘' } ],
  [ { key: '04', value: '哈哈' } ]
]
*/

var arr2 = [
  { a: 1, b: 2 },
  { a: 1 },
  { a: 1 },
  { a: 1, b: { c: 1, d: { e: 1 } } },
  { b: { d: { e: 1 }, c: 1 }, a: 1 },
];

/**
 *
 * @param obj 对象
 * @returns 将对象按照key值进行排序
 */
function sortObject(obj) {
  var keyArr = [];
  for (var item in obj) {
    keyArr.push(item); //把所有的key放置在一个数组里面
  }
  keyArr.sort(); //排序，按照字符进行排序

  var newObj = {}; //还是json对象
  for (var i = 0; i < keyArr.length; i++) {
    newObj[keyArr[i]] = obj[keyArr[i]];
  }
  //处理成 键=值的数组形式。
  //console.log("值是:"+JSON.stringify(newObj));
  return newObj;
}

function uniqueArr(arr) {
  let res = [];
  let sortArr = []; //存储数组对象元素的键排序后的结果

  for (let i = 0; i < arr.length; i++) {
    sortArr.push(sortObject(arr[i]));
  }

  sortArr.forEach((item) => {
    if (typeof item === "object" && item !== null) {
      let temp = res.filter((i) => JSON.stringify(i) === JSON.stringify(item));
      if (temp.length === 0) {
        res.push(item);
      }
    }
  });

  return res;
}

const resArr = uniqueArr(arr);
console.log(resArr);
