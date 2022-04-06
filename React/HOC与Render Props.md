## 编者荐语：

本文将介绍`React`组件逻辑复用的一些常用模式和技巧。包括一下几个方面：

- 什么是高阶组件`HOC`
- `HOC`解决了哪些问题
- 如何封装一个简单的高阶组件框架
- `HOC`在项目中常用的一些技巧和方法
- 什么是`Render Props`
- `Render Props`的特点和用法
- `Render Props `和`HOC React Hooks`相比，有哪些优劣（重要面试题）

## HOC高阶组件

> 高阶组件（HOC）：是React中用于`复用组件逻辑的一种高级技巧`。`HOC自身不是React API`的一部分，它是一种基于React的组合特性而形成的`设计模式`。

高阶组件可以看做`React`对`装饰器模式的一种实现`，具体而言，`高阶组件是参数作为组件，返回值为新组件的函数`。

### HOC解决的问题

- 抽离公共组件，实现组件代码复用，常见场景：页面复用。
- 条件渲染，控制组件的渲染逻辑（渲染劫持），常见场景：权限控制。
- 捕获/劫持被处理组件的生命周期，常见场景：组件渲染性能追踪、日志打点。

当我们项目中使用`高阶组件`开发时，能够让代码变得更加优雅，同时`增强代码的复用性和灵活性`，提升开发效率

### 高阶组件的基本框架

高阶组件的框架：

```js
export default (WrappedComponent) => {
	return class NewComponent extends React.Component {
		// 可以自定义逻辑
    // 比如给 WrappedComponent组件传递props和methods
    render () {
			return <WrappedComponent {...this.props}/>
    }
  }
}
```

如果自定义了`state`和`methods`可以通过下面方式传递到子组件中

```js
export default (WrappedComponent) => {
	return class NewComponent extends React.Component {
		state = {
      markTime: new Date().toLocaleTimeString(); // 获取组件当前渲染时的时间
    }
    printTime() {
      let myDate = new Date();
      let myTime= myDate.toLocaleTimeString(); 
      console.log('当前时间', myTime)
    }
    render () {
			return <WrappedComponent markTime={this.state.markTime} printTime={this.printTime}/>
    }
  }
}
```

这样在`WrappedComponent`组件中，如果是类组件就可以通过`this.props.markTime`获取，函数组件的话通过`props.markTime`来获取，方法获取和状态获取相同。

### HOC可以做什么

#### 属性代理——可操作所有传入的props

可以`读取、添加、编辑、删除传给 WrappedComponent 的 props(属性)`

**「场景描述」：** 给`Hello`组件传递`show，hide`方法，让其显示`Loading`加载框

```js
const loading = message => OldComponent => {
  return class extends React.Component {
    // 显示一个 Loading的div
    state = {
      show: () => {
        let div = document.createElement('div');
        div.innerHTML = `<p id="loading" style="position: absolute; z-index:10; top: 10; color: red; border: 1px solid #000">${message}</p>`
        document.body.appendChild(div);
      },
      hide: () => {
        document.getElementById('loading').remove();
      }
    }
    render() {
      return (
        <div>
          <OldComponent {...this.props} {...this.state}/>
        </div>
      )
    }
  }
}
function Hello(props) {
  return (
    <div>hello
      <button onClick={props.show}>show</button>
      <button onClick={props.hide}>hide</button>
    </div>
  )
}

let HightLoadingHello = loading('正在加载')(Hello);
ReactDom.render(<HightLoadingHello/>, document.getElementById('root'));
```

效果如图：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ginx76u2spg30g206ogpg.gif)

#### 抽离公共组件，最大化实现复用

**「场景描述」**： 统计每个组件的渲染时间

```js
class CalTimeComponent extends React.Component {
  componentWillMount() {
    this.start = Date.now(); // 初始渲染节点
  }
  componentDidMount() {
    console.log((Date.now() - this.start) + 'ms');
  }
  render() {
    return <div>calTimeComponent</div>
  }
}

ReactDom.render(<CalTimeComponent/>, document.getElementById('root'));
```

这样仅仅能计算当前组件的渲染时间，假如现在有这样一个需求，需要统计每个组件的渲染时间呢？

就应该想到把它抽离出去，比如：

```js
// CalTimeComponent.js
export default function CalTimeComponent(OldComponent) {
  return class extends React.Component {
    state = {
      markTime: new Date().toLocaleTimeString()
    }
    componentWillMount() {
      this.start = Date.now();
    }
    componentDidMount() {
      console.log((Date.now() - this.start) + 'ms');
    }
    printTime() {
      let myDate = new Date();
      let myTime= myDate.toLocaleTimeString(); 
      console.log('当前时间', myTime)
    }
    render() {
      return <OldComponent markTime={this.state.markTime} printTime={this.printTime}/>
    }
  }
}

// HelloComponent.js
import withTracker from '../../Components/CalTimeComponent.js';

class HelloComponent extends React.Component{
  render() {
    console.log(this.props);
    this.props.printTime()
    return <div>hello</div>
  }
}

let HighHelloComponent = CalTimeComponent(HelloComponent);
ReactDom.render(<HighHelloComponent/>, document.getElementById('root'));
```

这样就能最大化的实现`CalTimeComponent`组件复用了，把它引入到想要计算时间的组件里，并传入当前组件就好了。

## Render Props

**特点1**：`render props`指在一种`React`组件之间使用一个值为函数的`props`共享代码的简单技术。

**特点2**：具有`render props`的组件接收一个函数，该函数返回一个`React`元素并调用它而不是实现一个自己的渲染逻辑。

**特点3**：`render props`是一个用于告知组件需要渲染什么内容的函数（props）

**特点4**：也是组件逻辑复用的一种实现方式

接下来，我通过一个例子带大家分别认识上面的四种特点

**「场景描述」：** 在多个组件内实时获取鼠标的x、y坐标

### 原生实现：不复用逻辑

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    }
  }
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        <h1>请移动鼠标</h1>
        <p>当前鼠标的位置是：x:{this.state.x} y:{this.state.y}</p>
      </div>
    )
  }
}

ReactDom.render(<MouseTracker/>, document.getElementById('root'));
```

上面，这是在一个组件内完成的，假如现在要在多个`div`内完成上面的逻辑该怎么办，就该想到`复用`了，看看`render prop`是怎么帮我们完成的？

###  Render Props

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    }
  }
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }
  render() {
    console.log(this.props)
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

ReactDom.render(
<MouseTracker render={
  props => (
    <React.Fragment>
      <h1>请移动鼠标</h1>
      <p>当前鼠标的位置是: x:{props.x} y:{props.y}</p>
    </React.Fragment>
  )
}></MouseTracker>, document.getElementById('root'));
```

注意：`render props` 是因为模式才被称为 `render props` ，你不一定要用名为 `render` 的 `props` 来使用这种模式。`render props` 是一个用于告知组件需要渲染什么内容的函数 `prop

那如果改写成高阶组件呢？

### 高阶组件写法

改写成高阶组件，并将公共组件抽离出去， `ShowPosition`子组件中可以拿到`withTracker`父组件中传递的x、y坐标值

```js
// withTracker.js
export default function withTracker (OldComponent) {
  return class MouseTracker extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
      }
    }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }
    render() {
      console.log(this.props)
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state}/>
        </div>
      )
    }
  }
}

// ShowPosition.js
import withTracker from '../../Components/withTracker.js';

function ShowPosition(props) {
  return (
    <React.Fragment>
      <h1>请移动鼠标</h1>
      <p>当前鼠标的位置是: x:{props.x} y:{props.y}</p>
    </React.Fragment>
  )
}

// 在 ShowPosition 组件中 可以拿到 withTracker 传递过来的坐标值
let HightShowPosition = withTracker(ShowPosition);

ReactDom.render(<HightShowPosition/>, document.getElementById('root'));
```

## hoc、render props、react-hooks的优劣如何？

#### HOC的优势：

- 抽离公共组件，实现组件代码复用，常见场景：页面复用。
- 条件渲染，控制组件的渲染逻辑（渲染劫持），常见场景：权限控制。
- 捕获/劫持被处理组件的生命周期，常见场景：组件渲染性能追踪、日志打点。
- 属性代理，可以给一些子组件传递层次比较远的属性，并按需求操作他们

#### HOC的缺陷：

- **扩展性限制**：`HOC`无法从外部访问子组件（被包裹组件`WrappedComponent`）的`state`，因此无法通过shouldComponentUpdate过滤掉不必要的更新（React支持ES6之后，提供了`React.pureComponent`来解决这个问题）
- **Ref传递问题**：`Ref`由于组件被高阶组件包裹，导致被隔断，需要后来的`React.forwardRef`来解决这个问题
- **层级嵌套**：`HOC`可能出现多层包裹组件的情况（一般不超过两层，否则不好维护）多层抽象增加了复杂度和理解成本
- **命名冲突**：如果高阶组件多次嵌套，没有使用`命名空间`的话会产生冲突，覆盖老属性

#### Render Props优点：

- 上述HOC的缺点，Render Props都可以解决

#### Render Props缺陷：

- **使用繁琐**：`HOC`只需要借助装饰器/高阶函数的特点就可以进行复用，而`Render Props`需要借助`回调嵌套`
- **嵌套过深**：`Render Props`虽然摆脱了组件多层嵌套的问题,但是转化为了`函数回调的嵌套`

#### React Hooks的优点（重点）：

- **简洁**：`React Hooks`解决了`HOC`和`Render Props`的嵌套问题,更加简洁
- **解耦**：`React Hooks`可以更方便地把 UI 和状态分离,做到更彻底的解耦
- **无影响复用组件逻辑**：`Hook` 使你在无需修改组件结构的情况下复用状态逻辑
- **函数友好**：React Hooks为函数组件而生,从而解决了类组件的几大问题
  - this 指向容易错误
  - 分割在不同声明周期中的逻辑使得代码难以理解和维护
  - 代码复用成本高（高阶组件容易使代码量剧增）

#### React Hooks的缺陷（重点）：

- 额外的学习成本（Functional Component 与 Class Component 之间的困惑）
- 写法上有限制（不能出现在条件、循环中，只能在最外层调用`Hooks`），并且写法限制增加了重构成本
- 破坏了`PureComponent、React.memo`浅比较的性能优化效果（为了取最新的props和state，每次render()都要重新创建事件处函数）（依赖项不变，可解决该问题）
- 使用不当，可能会造成`闭包陷阱`问题
- `React.memo`并不能完全替代`shouldComponentUpdate`（因为拿不到 state change，只针对 props change）

> 关于react-hooks的评价来源于官方[react-hooks RFC](https://github.com/reactjs/rfcs/blob/master/text/0068-react-hooks.md#drawbacks)

## 感谢大家

如果你觉得这篇内容对你挺有启发，我想邀请你帮我三个小忙：  

1.  点个「**在看**」，让更多的人也能看到这篇内容（喜欢不点在看，都是耍流氓 -\_-）

2.  欢迎加我微信「**Augenstern9728**」一起交流学习...

3.  关注公众号「**前端时光屋**」，持续为你推送精选好文。



![](https://tva1.sinaimg.cn/large/007S8ZIlly1gio0bzk75vj31c90mgtcd.jpg)

