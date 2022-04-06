const obj = {
  id: 1,
  name: "部门A",
  children: [
    {
      id: 2,
      name: "部门B",
      children: [
        { id: 4, name: "部门D" },
        { id: 5, name: "部门E" },
      ],
    },
    {
      id: 3,
      name: "部门C",
      children: [{ id: 6, name: "部门F" }],
    },
  ],
};

/**
 * 将树结构转换成数组形式输出
 * @param {*} root
 */
/*
  思路：
    1. 建立当前节点与父节点的Map映射关系
    2. 定义返回数组
    3. 广度优先遍历树节点，将树节点转换为 arrayItem，并push到arr中
      3.1 先将根节点入队再出队，然后从curNode中找到 id, name, children
      3.2 通过节点的映射关系找到 parentNode parentId，将节点转换为 arrayItem，并push
      3.3 再把子节点遍历入队，重复整个第三步的操作
*/
function treeToArr(root) {
  // 存储当前节点与父节点的映射关系
  const nodeToParent = new Map();

  let arr = [];

  // 广度优先遍历树节点(队列先进先出)
  let queue = [];
  queue.unshift(root); // 根节点入队

  while (queue.length > 0) {
    let curNode = queue.pop(); // 将(根)节点出队
    if (!curNode) return;
    const { id, name, children = [] } = curNode;

    // 将树节点转换为arrayItem，并push到arr
    const parentNode = nodeToParent.get(curNode); // 找到父节点
    const parentId = parentNode?.id || 0; // 找到arrayItem的parentId
    const item = { id, name, parentId };
    arr.push(item);

    // 把子节点遍历入队
    children.forEach((child) => {
      // 通过映射找到找到子节点的父节点
      // curNode 是 child 的父节点
      nodeToParent.set(child, curNode);
      // 入队
      queue.unshift(child);
    });
  }

  return arr;
}

const resArr = treeToArr(obj);
console.log(resArr);
/*
  [
    { id: 1, name: '部门A', parentId: 0 },
    { id: 2, name: '部门B', parentId: 1 },
    { id: 3, name: '部门C', parentId: 1 },
    { id: 4, name: '部门D', parentId: 2 },
    { id: 5, name: '部门E', parentId: 2 },
    { id: 6, name: '部门F', parentId: 3 }
  ]
*/
