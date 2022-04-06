const arr = [
  { id: 1, name: "部门A", parentId: 0 },
  { id: 2, name: "部门B", parentId: 1 },
  { id: 3, name: "部门C", parentId: 1 },
  { id: 4, name: "部门D", parentId: 2 },
  { id: 5, name: "部门E", parentId: 2 },
  { id: 6, name: "部门F", parentId: 3 },
];

/**
 * 将数组转换为树结构输出
 * @param {*} arr
 */
/*
  思路：
    1. 新建存储id和树节点的映射(为了通过id，找到父节点)
    2. 声明树节点
    3. 遍历数组，每个元素生成 tree node
      3.1 解构数组元素，并生成 tree node
      3.2 通过当前的 parentId 找到父节点 parentNode
      3.3 并加入 parentNode 里的 children push 进去
    4. 最后返回 parentId 为0的 tree node，即为根节点
*/
function listToTree(arr) {
  // 存储id和treeNode的映射，
  const idToTreeNode = new Map();
  // 声明树节点
  let root = null;

  // 遍历数组，把每个元素都生成 treeNode
  arr.forEach((item) => {
    const { id, name, parentId } = item;

    // 每个元素都生成 treeNode，并加入 map
    const treeNode = { id, name };
    // 以id treeNode 键值对的形式存储
    idToTreeNode.set(id, treeNode);
    // 找到parentNode，并把children加入进去
    const parentNode = idToTreeNode.get(parentId);
    if (parentNode) {
      if (parentNode.children == null) parentNode.children = [];
      parentNode.children.push(treeNode);
    }

    // 头节点不能忘
    if (parentId === 0) root = treeNode;
  });

  return root;
}

const tree = listToTree(arr);
console.log(tree);
