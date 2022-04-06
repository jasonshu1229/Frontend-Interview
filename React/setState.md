## setState的设计为什么是异步呢？

- **setState**设计为异步，可以显著的提升性能
  - 如果每次调用`setState`都进行一次更新，那么意味着`render`函数会被频繁地调用，界面重复渲染，降低开发效率
  - 最好的办法应该是：一次获取到多个更新，之后进行批量更新

- 如果同步更新了`state`（同步更新会有一点点延迟效果），但是还没有执行`render`函数，那么`state`和`props`不能保持同步
  - `state`和`props`不能保持一致性，会在开发中产生很多的问题

## setState什么时候是同步的？

- 情况一：在`setTimeout`中的更新：

```js
changeText() {
  // 情况一: 将setState放入到定时器中
  setTimeout(() => {
    this.setState({
      message: "你好啊,李银河"
    })
  }, 0);
}
```

- 情况二：原生DOM事件：

```js
componentDidMount() {
  document.getElementById("btn").addEventListener("click", (e) => {
    this.setState({
      message: "你好啊,李银河"
    })
  })
}
```

## setState一定是异步吗

分为两种情况

- 在**组件生命周期**或**React合成事件**中，setState是异步；
- 在**setTimeout**或者**原生dom事件**中，setState是同步；

## setState数据的合并

`setState`数据的合并不会覆盖原有属性，最终`state`状态里仍有两个属性`message`、`name`

```js
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Hello World",
      name: "coderwhy"
    }
  }

  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
        <h2>{this.state.name}</h2>
        <button onClick={e => this.changeText()}>改变文本</button>
      </div>
    )
  }

  changeText() {
    // 了解真相你才能获得真正的自由
    this.setState({
      message: "你好啊,李银河"
    });

    // Object.assign({}, this.state, {message: "你好啊,李银河"})
  }
}
```

## setState本身的合并

### 状态合并，不累加

```js
this.setState({
  counter: this.state.counter + 1
});
this.setState({
  counter: this.state.counter + 1
});
this.setState({
  counter: this.state.counter + 1
});
```

### 状态合并，并累加

```js
this.setState((prevState, props) => {
  return {
    counter: prevState.counter + 1
  }
});
this.setState((prevState, props) => {
  return {
    counter: prevState.counter + 1
  }
});
this.setState((prevState, props) => {
  return {
    counter: prevState.counter + 1
  }
});
```

