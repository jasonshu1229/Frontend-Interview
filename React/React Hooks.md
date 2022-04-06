## 认识Effect Hook

### Effect Hook的应用场景

- Effect Hook可以帮助我们完成一些类似于`class`中生命周期的功能；
- 在真实项目中，类似于网络请求，手动更新DOM、一些事件的监听，都是React更新DOM的一些副作用（Side Effects）;
- 组件逻辑的高度复用
- 性能优化

所以对于完成这些功能的Hook被称之为`Effect Hook`；

### Effect的基本使用

假如我们现在有一个需求：**页面的title总是显示counter的数字**;

class组件实现

```js
import React, { PureComponent } from 'react'

export default class CounterTitle01 extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0
    }
  }

  componentDidMount() {
    document.title = `当前计数: ${this.state.counter}`
  }

  componentDidUpdate() {
    document.title = `当前计数: ${this.state.counter}`
  }

  render() {
    return (
      <div>
        <h2>当前计数: {this.state.counter}</h2>
        <button onClick={e => this.increment()}>+1</button>
        <button onClick={e => this.decrement()}>-1</button>
      </div>
    )
  }

  increment() {
    this.setState({counter: this.state.counter + 1});
  }

  decrement() {
    this.setState({counter: this.state.counter - 1});
  }
}
```

这时候我们会发现

- `document.title` 的设置必须在两个生命周期中完成；
- 这是因为React的class组件并没有给我们提供一个统一的生命周期函数，可以让无论是否是第一次渲染都会执行的生命周期函数；

useEffect实现上述要需求：

```js
import React, { useState, useEffect } from 'react';

export default function CounterTitle02() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `当前计数: ${count}`;
  })

  return (
    <div>
      <h2>当前计数: {count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
      <button onClick={e => setCount(count - 1)}>-1</button>
    </div>
  )
}
```

#### useEffect的执行原理

- 通过useEffect的Hook，可以告诉React需要在渲染后执行某些操作；
- useEffect要求我们传入一个`回调函数`，在React执行完更新DOM操作之后，就`会回调这个函数`；
- 默认情况下，无论是第一次渲染之后，还是每次更新之后，都会执行这个 `回调函数`；

### Effect及时清除副作用

在class组件的编写过程中，某些副作用的代码，我们需要在componentWillUnmount中进行清除：

- 比如我们之前的事件总线或Redux中手动调用subscribe；
- 都需要在componentWillUnmount有对应的取消订阅；
- Effect Hook通过什么方式来模拟componentWillUnmount呢？

useEffect传入的`回调函数A本身`可以有一个返回值，这个返回值是`另外一个回调函数B`：

```js
type EffectCallback = () => (void | (() => void | undefined));
```

如果需要Effect清除副作用，类似于class组件中的componentWillUnmount里执行的功能，

我们可以这样写

```js
import React, { useState, useEffect } from 'react';

export default function EffectHookClear() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `当前计数: ${count}`;
    console.log("每次DOM更新时会回调");

    return () => {
      console.log("DOM被移除时会回调");
    }
  })

  return (
    <div>
      <h2>当前计数: {count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
      <button onClick={e => setCount(count - 1)}>-1</button>
    </div>
  )
}
```

#### Effect的清除机制

- 每个effect都可以返回一个清除函数；
- 它属于effect的一部分；

因此可以将`添加`和`移除订阅`的逻辑放在一起；

#### React何时清除effect？

- React会在组件更新和卸载的时候执行`清除操作`；
- effect在每次渲染的时候也都会执行；

### 多个Effect一起使用

使用Hook的其中一个目的就是解决class中生命周期经常将很多的逻辑放在一起的问题：

- 比如网络请求、事件监听、手动修改DOM，这些往往都会放在componentDidMount中；

使用Effect Hook，我们可以将它们分离到不同的useEffect中：

```js
import React, { useEffect } from 'react';

export default function MultiUseEffect() {
  useEffect(() => {
    console.log("网络请求");
  });

  useEffect(() => {
    console.log("修改DOM");
  })

  useEffect(() => {
    console.log("事件监听");

    return () => {
      console.log("取消监听");
    }
  })

  return (
    <div>
      <h2>MultiUseEffect</h2>
    </div>
  )
}
```

**Hook 允许我们按照代码的用途分离它们，** 而不是像生命周期函数那样：

React 将按照 effect 声明的顺序依次调用组件中的*每一个* effect；

### Effect Hookd的性能优化

假如在当前组件中，有一个计数器的计数state和登录状态的state

和分别用多个`useEffect`模拟了日常开发中的多个副作用`Side Effects`，分别有”修改DOM“，”订阅事件“，”网络请求“。

看看多个`useEffect`之间，是如何执行，且利用它的第二个参数进行优化的呢？

```js
export default function MultiEffectHookDemo() {
  const [count, setCount] = useState(0);
  const [isLogin, setIsLogin] = useState(true);

  // 当有多个useEffect时，按照useEffect 定义的顺序来执行
  useEffect(() => {
    console.log("修改DOM", count);
  }, [count]);

  useEffect(() => {
    console.log("订阅事件");
  }, []);

  useEffect(() => {
    console.log("网络请求");
  }, []);

  return (
    <>
      <h2>组件名：MultiEffectHookDemo</h2>
      <h3>计数器：{count}</h3>
      <button onClick={e => setCount(count + 1)}>+1</button>
      <h3>{isLogin ? "时光屋小豪" : "未登录"}</h3>
      <button onClick={e => setIsLogin(!isLogin)}>登录/注销</button>
    </>
  );
}
```

组件初始化阶段截图

![](https://tva1.sinaimg.cn/large/007S8ZIlly1girc5r2vn6j31au0i8q62.jpg)

`useEffect`会按照定义的顺序依次执行

其次`useEffect`内的回调函数会在组件初始化DOM完毕时执行，如果有第二个参数，根据依赖项的变化与否，确定是否`再`次触发第一个参数的回调函数

组件更新阶段——依赖项优化回调函数的执行频率

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gird4tn2b6g318s0gy4qp.gif)

从控制台输出的结果中可以出，当第一个`useEffect`有第二个参数`count`时，且订阅事件和网络请求的`useEffect`第二个参数为`[]`（依赖项不变时），仅触发”修改DOM“的回调函数。

到此，我们就可以通过第

> **useEffect**可以通过第二个参数`依赖项`的变化与否，来判断第一个参数的回调函数执行与不执行

## 认识useContext

#### 在之前的开发中，我们要在组件中使用共享的Context有两种方式：

- 类组件可以通过 `类名.contextType = MyContext`方式，在类中获取context；

- 多个Context或者在函数式组件中通过 `MyContext.Consumer` 方式共享context

#### 但是多个Context共享时的方式会存在大量的嵌套：

- Context Hook允许我们通过Hook来直接获取某个Context的值

现在结合下面的代码案例概括一下Context Hook的特点

#### 特点

- `useContext`需要接受一个自定义的`MyContext`对象，并返回由`MyContext.Provider`绑定的`value`属性

  - 该自定义的`MyContext`对象由`React.createContext`创建

  ```js
  const MyContext = createContext();
  
  const userValue = React.useContext(MyContext);
  ```

- `useContext(MyContext)`的值由最外层的`MyContext.Provider`绑定的`value`决定
  
  - `useContext(MyContext)`相当有`class`组件中的`<MyContext.Consumer>`

#### 核心

Context Hook允许我们通过Hook来直接获取某个Context的值。

```js
const value = useContext(myContext);
```

结合上面特点来看下面这样一个例子：

#### 应用

在`App.js`父组件中，使用Context Hook：

自定义两个`MyContext`分别是`userContext、ThemeContext`，然后在`userContext.Provider`和`themeContext.Provider`分别赋值其要传递给子组件的`value`属性

```js
import ContextHookDemo from "./04_useContext的使用/useContext的使用"

export const userContext = createContext();
export const ThemeContext = createContext();

export default function App() {
  return (
    <div>
      <userContext.Provider value={{name: "why", age: 18}}>
        <ThemeContext.Provider value={{fontSize: "30px", color: "red"}}>
          <ContextHookDemo/>
        </ThemeContext.Provider>
      </userContext.Provider>
    </div>
  );
}
```

在子组件中使用Context Hook：

```js
import React from "react";
import { userContext, ThemeContext } from "../App";

export default function ContextHookDemo() {
  const userValue = React.useContext(userContext);
  const themeValue = React.useContext(ThemeContext);

  console.log(userValue, themeValue);
  // {name: "why", age: 18} {fontSize: "30px", color: "red"}
  
  return (
    <>
      <h2>ContextHookDemo</h2>
    </>
  );
}
```

这样我们通过父组件导出的两个自定义`MyContext.Provider`标签上的`value`值获取要`共享的状态`。

**「注意事项」**

当组件上层最近的` <MyContext.Provider>` 更新时，该 Hook 会触发`重新渲染`，并使用最新传递给 MyContext provider 的`value` 属性。

## 认识Reducer

很多人看到useReducer的第一反应应该是redux的某个替代品，其实并不是。

### useReducer的语法糖——useState

useReducer仅仅是useState的一种替代方案：

- 在某些场景下，如果state的处理逻辑比较复杂，我们可以通过`useReducer`来对其进行拆分；（图1）
- 或者这次修改的state需要依赖之前的`state`时，也可以使用；（图1）

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1girpd7nw1ij312a0i077c.jpg" alt="图1"  />

![](https://tva1.sinaimg.cn/large/007S8ZIlly1girpl8df1ij31bo0n4gqq.jpg)

### useReducer不是redux替代品的原因

**数据是不会共享的，它们只是使用了相同的`reducer`的函数而已。**

所以，useReducer只是useState的一种替代品，并不能替代Redux。

如果要模拟`redux`的设计思想，需要用`useReducer`和`useContext`配合完成实现效果，其中

- `useReducer`负责对每个状态的逻辑和`dispatch(action)`的情况进行处理
- `useContext`负责提供共享的数据状态

### 手动实现useReducer

思想：接受老状态，执行`dispatch`函数把老状态传递到`reducer`中去修改。

```js
let lastState;
function useReducer(reducer, initialState) {
  lastState = lastState || initialState;

  function dispatch(action) {
    // 把老状态传递到reducer中去修改
    lastState = reducer(lastState, action);
    render();
  }
  return [lastState, dispatch];
}
```

