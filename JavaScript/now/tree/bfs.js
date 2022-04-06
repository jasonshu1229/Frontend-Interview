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

/*
  思路：
    1. 新建一个队列（先进先出），把根节点入队
    2. 把队头出队并访问
    3. 把队头的children 挨个入队
    4. 重复第二、三步直到队列为空
*/
const bfs = (root) => {
  const q = [root];
  while (q.length > 0) {
    const qHead = q.shift();
    console.log(qHead.val);
    qHead.children.forEach((child) => {
      q.push(child);
    });
  }
};

bfs(tree);
