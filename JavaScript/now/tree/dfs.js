const tree = {
  val: "a",
  children: [
    {
      val: "b",
      children: [
        {
          val: "d",
          children: [],
        },
        {
          val: "e",
          children: [],
        },
      ],
    },
    {
      val: "c",
      children: [
        {
          val: "f",
          children: [],
        },
        {
          val: "g",
          children: [],
        },
      ],
    },
  ],
};

const dfs = (root) => {
  // 1. 访问根节点
  console.log(root.val);
  // 2. 对root的children挨个进行深度优先遍历
  /*
    root.children.forEach((child) => {
      dfs(child);
    });
  */
  // 优化
  root.children.forEach(dfs);
};

dfs(tree);
