/*
 Semantic/sɪˈmæntɪk/ Versioning是一个前端通用的版本定义规范。格式为“{MAJOR}.{MINOR}.{PATCH}-{alpha|beta|rc}.{number)"，要求实现compare(a,b)方法，比较ab两个版本大小。
   + 当a>b是返回1;
   + 当a=b是返回0;
   + 当a<b是返回-1;
   其中：rc>beta>alpha，major>minor>patch;
   例子：1.2.3<1.2.4<1.3.0-alpha.1<1.3.0-alpha.2<1.3.0-beta.1<1.3.0-rc.1<1.3.0
-9
 课后：
   输入: ['1.1', '2.3.3', '4.3.5', '0.3.1', '0.302.1', '4.20.0', '4.3.5.1', '1.2.3.4.5']
   输出: ['0.3.1', '0.302.1', '1.1', '1.2.3.4.5', '2.3.3', '4.3.5', '4.3.5.1', '4.20.0'] 
 */

const compareVersion = function compare(a, b) {
  let reg = /^\d+(\.\d+){2}(-(alpha|beta|rc)\.\d+)?$/i;
  let n = -1,
    diff,
    res;

  if (!reg.test(a) || !reg.test(b)) throw new TypeError("请输入正确的版本号");

  // 把字符串变成数组，对比每个索引上的字符
  a.split(/(?:\.|-)/g);
  b.split(/(?:\.|-)/g);
  // 基于递归进行版本号比较
  const recur = () => {
    n++;
    let item1 = a[n],
      item2 = b[n];

    // ['1', '3', '4']  ['1', '3', '4', 'beta', '1']
    if (!item1 || !item2) {
      // 有任意一项是不存在的
      res = !item1 && !item2 ? 0 : !item1 ? 1 : -1;
      return;
    }

    diff =
      isNaN(item1) || isNaN(item2) ? item1.localeCompare(item2) : item1 - item2;
    if (diff === 0) {
      // 当前比较是相等的，基于递归继续比较后面的
      recur();
      // 递归比较相等之后，便不用执行后面逻辑
      return;
    }
    res = diff > 0 ? 1 : -1;
  };

  recur();
  return res;
};

const result = compareVersion("1.01", "1.001");
console.log(result);
