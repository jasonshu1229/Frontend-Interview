### 1. 解释JavaScript的单线程模型，以及为什么会这样设计？setTimeout的延时为何做不到精确？

（1） JavaScript的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

（2）setTimeout 不精确是因为没有办法控制同步任务执行时间 如果同步任务超过定时时间 定时器会延后执行

### 5. 面试官：说一说react中的diff算法是怎么对比的？

#### diff算法 有三个设计思想：

- 永远只比较同层节点
- 不同的两个节点产生不同的dom树
- 通过`key`值指定哪些元素是相同的

#### 具体流程

- 如果同层的两个节点`不同`，直接将`原VDOM`树上该节点及该节点下所有的后代节点，全部替换为新的`VDOM`树上同一位置的接地那

- 如果同层的两个节点`相同`，

  - 都是`DOM`节点的话，直接更新DOM属性，以此类推，向下递归遍历子节点，通过元素上绑定的`key`值，所以一定要保证其唯一性，一般不采用数组下标作为`key`值，因为当数组元素发生变化时，index索引值也会跟着改变。

  - 都是`组件节点`的话，会保持当前组件实例不变，更新`props`，同时调用组件实例的`componentWillReceiveProps()`方法和`shouldComponentUpdate()`方法，根据其返回值决定是否调用`render`方法。 

    处理完该节点后，继续对子节点进行递归。

### 6. 面试官：说一说React中的渲染机制？

​	1）React采用虚拟DOM，在每次属性和状态发生变化是，render函数返回不同的元素树，然后对比返回的元素树和上次的渲染树之间的差异，并对差异部分进行更新，最后渲染成真实DOM元素。

​	2）`Reconciliation`是渲染中重要的阶段，称为`协调`阶段，其核心就是进行新旧DOM树的diff对比，利用`shouldComponentUpdate`中逻辑处理返回的true和false来判断是否需要更新，`从而优化了性能`。

​	3）另外`React.memo`也是基于`shouldComponentUpdate`的函数返回值来判断是否渲染函数组件的。

### 7. Hooks 可以实现Redux（useContext，useReducer）,但可以替代redux吗，说说原因？

- 首先 redux 有非常成熟的状态跟踪调试工具，也就是 chrome 浏览器的 redux-devtools 插件，至少到现在为止开发中很多的错误我都是通过它发现的。换而言之，它能够协助我们写出更利于维护的代码，并且在出现故障时快速找到问题的根源。

- 其次，redux 有非常成熟的数据模块化方案，不同模块的 reducer 直接导出，在全局的 store 中，调一下 redux 自带的 combineReducer 即可，目前从官方的角度看 hooks 这方面并不成熟。
- Redux 拥有成熟且强大的中间件功能，如 redux-logger, redux-thunk, redux-saga，用 hooks 实现中间件的功能就只能靠自己手动实现了。