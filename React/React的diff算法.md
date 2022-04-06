## 情况一：对比不同类型的元素

- 当节点为不同的元素，React会拆卸原有的树，并且建立起新的树；
  - 当一个元素从<a>变成<img>，从<Active>变成<Comment>，都会触发一个完整的重建流程；
  - 当卸载一棵树时，对应的DOM节点也会被销毁，组件实例将执行componentWillUnmount()方法；
  - 当建立一颗新的树时，对应的DOM节点会被创建以及插入到DOM中，组件实例将执行componentWillMount()方法，紧接着执行componentDidMount()方法；

- 比如下面的例子：
  - React会销毁Counter组件并且重新装载一个新的组件，而不会对Counter进行复用；

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gj1omwpfslj30gs0b074w.jpg" style="zoom:50%;" />

## 情况二：对比同一类型的元素

- 比对两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性；

- 比如下面的例子：

  - 通过比对这两个元素，React 知道只需要修改 DOM 元素上的 className 属性；

    ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gj1orkff7vj30e801s74g.jpg)

  - 当更新 style 属性时，React 仅更新有所更变的属性；

  - 通过比对这两个元素，React 知道只需要修改 DOM 元素上的 color 样式，无需修改 fontWeight；

    ![](https://tva1.sinaimg.cn/large/007S8ZIlly1gj1osf5j9vj30iy01u3yt.jpg)

- 如果是同类型的组件元素： 
  - 组件会保持不变，React会更新该组件的props，并且调用componentWillReceiveProps() 和 componentWillUpdate() 方法； 
  - 下一步，调用 render() 方法，diff 算法将在之前的结果以及新的结果中进行递归；

## 情况三：对子节点进行递归

- 在默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个mutation； 

  - 前面两个比较是完全相同的，所以不会产生mutation；

  - 最后一个比较，产生一个mutation，将其插入到新的

    DOM树中即可；

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gj1phf8qxcj308n08oaab.jpg" style="zoom: 80%;" />

- 但是如果我们是在中间插入一条数据：
  - React会对每一个子元素产生一个mutation，而不是保持 <li>星际穿越</li>和<li>盗梦空间</li>的不变；
  - 这种低效的比较方式会带来一定的性能问题；

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gj1pjrnss9j308q08n74m.jpg" style="zoom:80%;" />