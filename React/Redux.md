在正式讲解`redux`原理之前，我先给大家用一个真实场景的例子描述`redux`究竟是什么东西？它的内部工作原理又是什么样的呢？

### redux结合真实场景介绍

​	现在有三个学生，他们都想改变自己校服的颜色，但是又不能直接涂改自己校服的颜色，只能把自己的意愿涂在操场中间的`小旗`上，每个路过的同学都能看到并且知道又有哪个小伙伴想把校服改成什么颜色了。

​	但是这个`小旗`又不能随意被任何人修改，所以需要找一个保护措施给它保护起来，这个东西就是仓库`store`（状态管理中心），但是`redux`的规范又说了，`小旗`的颜色状态不能自己改，需要由一个训练过的保安帮它修改，这个保安就是`reducer处理器`，这个`reducer处理器`只能听这三个学生的命令，当学生派发动作告诉`小旗`要变色的时候，只能交给`reducer`处理，我们把这个动作称为`action`，把这个派发过的过程称为`dispatch`。

​	当`redcuer`接受到学生A`dispatch`派发过来的动作，并改完颜色之后，它会返回一个最新的状态`return newState`，显然这个最新的状态是要传递给学生B和学生C的，但是需要学生们提前注册`subscribe()`好回调函数，订阅状态的变化事件，当状态变化之后，立刻通知他们，

​	`store`中的状态变化后，需要学生们通过`getState()`获取最新的状态。

### redux的工作流

用真实形象的案例来描述是最容易理解不过的了，为此，我对应案例画了下面的原型图

- 单向箭头表示组件只能单向派发动作经过外层`store`到`reducer`中，在`reducer`中改变状态

- 双向箭头表示组件可以从组件可以从`store`中获取最新状态，需要组件自己`监听回调函数`

![redux的工作原理](https://tva1.sinaimg.cn/large/007S8ZIlly1gii1ht06jyj30s10jgdiw.jpg)

根据上面简单大白话描述，先来归纳一下`redux的工作流`由哪几部分构成？

其实就是由两部分组成：

- 构成一：`Store仓库`向组件提供`dispatch()`，`subscibe()`和`getState()`方法
- 构成二：与公共状态交互的组件`React Component`

下面是`redux`的工作流图解：

![redux工作流](https://tva1.sinaimg.cn/large/007S8ZIlly1gii59yreubj30n00btmxx.jpg)

1. `React`组件内部触发修改状态的动作`action`，`dispatch(action)`到`Store`中的`reducer处理`
2. `reducer处理器`接受`老状态`改变之后并把`最新的状态`返回给`Store`中
3. 在组件中提前注册`subscribe()`好回调函数，通过`Store.getState()`获取最新的状态

`redux`工作流介绍完了，我们来动手试着写一下它吧~

### 实现一个简易版的redux

要想实现一个简易版的redux，就要根据它的工作流，分析出它的步骤

`redux`的核心有两个

- 第一个就是`createStore`创建出来的`store`，在上面我们分析了`store`中为我们提供了四样东西，分别是`dispatch()，subscribe()，getState()`它们三个方法和集中管理的`state`。
- 第二个就是`reducer`纯函数，接受老状态，返回新状态

> 注：全文以计数器的例子所线索，实现计数器的`add`和`minus`

那我们实现这两个核心点就好了

#### 步骤1： createStore

```js
function createStore(reducer) {
	let state;
  let listeners = []; // 存储组件的监听函数
  function getState() {
		return state;
  }
  function dispatch(action){
    state = reducer(state, action); //接受老状态，改变新状态
    listeners.forEach(listener => listener()); // 取出组件的监听回调，依次执行它们
	}
  function subscibe(listener) {
		listeners.push(listener); // 把监听函数保存在数组里
    return function unsubscibe() {
    	const index = currentListeners.indexOf(listener); // 找到组件注册的listener
      currentListeners.splice(index, 1); // 清除该索引位置上的回调函数
		}
  }
  return {
		getState,
    dispatch,
    subscribe
  }
}
```

### 步骤2：实现一个reducer

```js
function reducer(state = {number: 0}, action) {
	switch(action.type) {
    case ADD:
      return {number: state.number + 1}
    case MINUS:
      return {number: state.number - 1}
    default:
      return state; // 无action，返回默认老状态
  }
}
```

【完整版redux】

```js
const preloadedState = {number: 0};

function reducer(state = preloadedState, action) {
  switch(action.type) {
    case ADD:
      return {number: state.number + 1}
    case MINUS:
      return {number: state.number - 1}
    default:
      return state;
  }
}

/**
  * @param {*} reducer store中的执行器函数
  * @param {*} preloadedState 默认状态
 */
function createStore(reducer) {
	let state;
  let listeners = []; // 存储组件的监听函数
  function getState() {
		return state;
  }
  function dispatch(action){
    state = reducer(state, action); //接受老状态，返回新状态
    listeners.forEach(listener => listener()); // 取出组件的监听回调，依次执行它们
	}
  function subscibe(listener) {
		listeners.push(listener); // 把监听函数保存在数组里
    return function unsubscibe() {
    	const index = currentListeners.indexOf(listener); // 找到组件注册的listener
      currentListeners.splice(index, 1); // 清除该索引位置上的回调函数
		}
  }
  // todo: 默认派发一次，确认组件初始化时的默认状态，让默认值生效
  dispatch({ type: '@@redux/INIT '});
  
  const store = {
		getState,
    dispatch,
    subscribe
  }
  return store;
}

let store = createStore(reducer);
```

【结合React计数器案例】

```js
const ADD = 'ADD';
const MINUS = 'MINUS';

export default class Counter1 extends Component{
  state = {
    number: store.getState().number
  }
  componentWillMount() {
    // 当store中的状态变化之后，要重新注册回调函数监听，一旦组件状态的改变，立即更新组件的渲染
    this.unsubscribe = store.subscribe(() => {
      this.setState({number: store.getState().number});
    })
  }
  componentWillUnmount() {
    this.unsubscribe(); // 离开当前组件时，销毁注册的回调函数
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={() => store.dispatch({type: ADD})}>+</button>
        <button onClick={() => store.dispatch({type: MINUS})}>-</button>
      </div>
    )
  }
}
```

以上案例是单个`Count1`组件，在自己的生命周期里派发，接收，和更改状态，可以理解为整个`redux`定义在了一个组件里（`reducer()和createStore()`）

那么如果一旦在项目中，组件多了起来，我们就需要把`reducer`和`action`分类，分离出去。

> **redux规范**
>
> 因为`redux`规范中，规定只能有一个`store`仓库，只能有一个`reducer`和一个`state`，其余的`reducer`需要通过`combineReducers`合并起来

如果把`reducer`里面的判断类型都写在一起会很难维护，应该每个组件对应一个`reducer`，最后合并成一个`reducer`