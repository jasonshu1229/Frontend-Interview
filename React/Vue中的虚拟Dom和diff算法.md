## 编者荐语：

使用过Vue和React的小伙伴肯定对虚拟Dom和diff算法很熟悉，它扮演着很重要的角色。

那么它们是又如何辅助我们开发者完成那些成就感爆棚的项目呢，就让本文带你一步一步搞懂它。

## 虚拟DOM

### 什么是虚拟DOM？

虚拟DOM（Virtual Dom），也就是我们常说的**虚拟节点**，是用JS对象来 **模拟真实DOM**中的节点，该对象 **包含了真实DOM的结构及其属性**，用于对比虚拟DOM和真实DOM的差异，从而进行**局部渲染**来达到**优化性能**的目的。

真实的元素节点：

``` html
<div id="wrap">
  <p class="title">Hello world!</p>  
</div>
```

VNode：

``` javascript
{
  tag: 'div',
  attrs: {
    id: 'wrap'
  },
  children: [{
    tag: 'p',
    text: 'Hello world!',
    attrs: {
      class: 'title',
    }
  }]
}
```

### 为什么使用虚拟DOM？

起初我们在使用JS/JQuery时，不可避免的会大量操作DOM，而DOM的变化又会引发回流或重绘，从而降低页面渲染性能。

那么怎样来减少对DOM的操作呢？

此时虚拟DOM应用而生，所以虚拟DOM出现的主要目的就是为了**减少频繁操作DOM而引起回流重绘所引发的性能问题的**！

### 虚拟DOM的作用是什么？

 <b>1.兼容性好：</b> 因为Vnode本质是JS对象，所以不管Node还是浏览器环境，都可以操作；

 <b>2.Dom可复用性增大：</b>减少了对Dom的操作。页面中的数据和状态变化，都通过Vnode **对比**，只需要在比对完之后 **更新DOM**，**不需要频繁** 操作，**提高了页面性能**；

### 虚拟DOM和真实DOM的区别？

* 虚拟DOM**不**会进行**回流**和**重绘**；

* 真实DOM在频繁操作时引发的回流重绘导致性能很低；

* 虚拟DOM频繁修改，然后一次性对比差异并修改真实DOM，最后进行依次回流重绘，减少了真实DOM中多次回流重绘引起的性能损耗；

* 虚拟DOM有效降低大面积的重绘与排版，因为是和真实DOM对比，更新差异部分，所以只渲染局部；

``` javascript
总损耗 = 真实DOM增删改 + (多节点) 回流 / 重绘; //计算使用真实DOM的损耗
总损耗 = 虚拟DOM增删改 + (diff对比) 真实DOM差异化增删改 + (较少节点) 回流 / 重绘; //计算使用虚拟DOM的损耗
```

可以发现，都是围绕频繁操作真实DOM引起回流重绘，导致页面性能损耗来说的。不过框架也不一定非要使用虚拟DOM，关键在于看是否频繁操作会引起大面积的DOM操作。

那么虚拟DOM究竟通过什么方式来减少了页面中频繁操作DOM呢？这就不得不去了解DOM Diff算法了。

## DIFF算法

当数据变化时，vue如何来更新视图的？其实很简单，一开始会根据真实DOM生成虚拟DOM，当虚拟DOM某个节点的数据改变后会生成一个新的Vnode，然后VNode和oldVnode对比，把不同的地方修改在真实DOM上，最后再使得oldVnode的值为Vnode。

> diff过程就是调用patch函数，比较新老节点，一边比较一边给真实DOM打补丁(patch)；

对照vue源码来解析一下，贴出核心代码，旨在简单明了讲述清楚，不然小编自己看着都头大了O(∩_∩)O

### patch

那么patch是怎样打补丁的？

``` javascript
//patch函数  oldVnode:老节点   vnode:新节点
function patch(oldVnode, vnode) {
  ...
  if (sameVnode(oldVnode, vnode)) {
    patchVnode(oldVnode, vnode) //如果新老节点是同一节点,那么进一步通过patchVnode来比较子节点
  } else {
    /* -----否则新节点直接替换老节点----- */
    const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
    let parentEle = api.parentNode(oEl) // 父元素
    createEle(vnode) // 根据Vnode生成新元素
    if (parentEle !== null) {
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
      api.removeChild(parentEle, oldVnode.el) // 移除以前的旧元素节点
      oldVnode = null
    }
  }
  ...
  return vnode
}

//判断两节点是否为同一节点
function sameVnode(a, b) {
  return (
    a.key === b.key && // key值
    a.tag === b.tag && // 标签名
    a.isComment === b.isComment && // 是否为注释节点
    // 是否都定义了data，data包含一些具体信息，例如onclick , style
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
  )
}
```

从上面可以看出，patch函数是通过判断新老节点是否为同一节点：

* 如果是同一节点，执行patchVnode进行子节点比较；
* 如果不是同一节点，新节点直接替换老节点；

那如果不是同一节点，但是它们子节点一样怎么办嘞？

> 要牢记：**diff是同层比较，不存在跨级比较的**！简单提一嘴，React中也是如此，它们只是针对同一层的节点进行比较。

### patchVnode

既然到了patchVnode方法，说明新老节点为同一节点，那么这个方法做了什么处理？

``` javascript
function patchVnode(oldVnode, vnode) {
  const el = vnode.el = oldVnode.el //找到对应的真实DOM
  let i, oldCh = oldVnode.children,
    ch = vnode.children
  if (oldVnode === vnode) return //如果新老节点相同,直接返回
  if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
    //如果新老节点都有文本节点且不相等,那么新节点的文本节点替换老节点的文本节点
    api.setTextContent(el, vnode.text)
  } else {
    updateEle(el, vnode, oldVnode)
    if (oldCh && ch && oldCh !== ch) {
      //如果新老节点都有子节点,执行updateChildren比较子节点[很重要也很复杂,下面展开介绍]
      updateChildren(el, oldCh, ch)
    } else if (ch) {
      //如果新节点有子节点而老节点没有子节点,那么将新节点的子节点添加到老节点上
      createEle(vnode)
    } else if (oldCh) {
      //如果新节点没有子节点而老节点有子节点，那么删除老节点的子节点
      api.removeChildren(el)
    }
  }
}
```

如果两个节点不一样，直接用新节点替换老节点；

如果两个节点一样，

* ​	新老节点一样，直接返回；
*  老节点有子节点，新节点没有：删除老节点的子节点；
* ​	老节点没有子节点，新节点有子节点：新节点的子节点直接append到老节点；
* ​	都只有文本节点：直接用新节点的文本节点替换老的文本节点；
* ​	都有子节点：updateChildren

最复杂的情况也就是新老节点都有子节点，那么updateChildren是如何来处理这一问题的，该方法也是diff算法的核心，下面我们来了解一下！

### updateChildren

由于代码太多了，这里先做个概述。updateChildren方法的核心：

1. 提取出新老节点的子节点：新节点子节点ch和老节点子节点oldCh；
2. ch和oldCh分别设置StartIdx（指向头）和EndIdx（指向尾）变量，它们两两比较（按照sameNode方法），有四种方式来比较。如果4种方式都没有匹配成功，如果设置了key就通过key进行比较，在比较过程种startIdx++，endIdx--，一旦StartIdx > EndIdx表明ch或者oldCh至少有一个已经遍历完成，此时就会结束比较。

下面结合图来理解：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gi4nef9ewhj30hj0h20um.jpg)

第一步：

``` javascript
oldStartIdx = A, oldEndIdx = C;
newStartIdx = A, newEndIdx = D;
```

此时oldStartIdx和newStarIdx匹配，所以将dom中的A节点放到第一个位置，此时A已经在第一个位置，所以不做处理，此时真实DOM顺序：A  B  C；

第二步：

``` javascript
oldStartIdx = B, oldEndIdx = C;
newStartIdx = C, oldEndIdx = D;
```

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gi4nf4l6t9j30hj0eimyn.jpg)

此时oldEndIdx和newStartIdx匹配，将原本的C节点移动到A后面，此时真实DOM顺序：A   C   B；

第三步：

``` javascript
oldStartIdx = C, oldEndIdx = C;
newStartIdx = B, newEndIdx = D;
oldStartIdx++, oldEndIdx--;
oldStartIdx > oldEndIdx
```

此时遍历结束，oldCh已经遍历完，那么将剩余的ch节点根据自己的index插入到真实DOM中即可，此时真实DOM顺序：A  C  B  D；

所以匹配过程中判断结束有两个条件：

* oldStartIdx > oldEndIdx表示oldCh先遍历完成，如果ch有剩余节点就根据对应index添加到真实DOM中；
* newStartIdx > newEndIdx表示ch先遍历完成，那么就要在真实DOM中将多余节点删除掉；

看下图这个实例，就是新节点先遍历完成删除多余节点：

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gi4nfl391jj310g0fz782.jpg)

最后，在这些子节点sameVnode后如果满足条件继续执行patchVnode，层层递归，直到oldVnode和Vnode中所有子节点都比对完成，也就把所有的补丁都打好了，此时更新到视图。

## 总结

最后，用一张图来记忆整个Diff过程，希望你能有所收获！

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gi4nfrhiq4j315p0cggot.jpg)

## 彩蛋：React的diff算法

讲完了Vue的diff算法，让我们来对比一下React中的diff算法是什么样的呢？

### diff算法-三个设计思想

* 永远 **只比较同层节点**
* 不同的两个节点产生不同的dom树
* 通过 **key** 值指定哪些元素是相同的

### 具体流程

* 如果同层的两个节点 **不同**
  + 直接将 **原VDOM 树上该节点及该节点下所有的后代节点，全部替换为新的 VDOM 树上同一位置的节点**

* 如果同层的两个节点 **相同** ，
  + 都是 **DOM** 节点的话，直接更新DOM属性，以此类推，向下递归遍历子节点，通过元素上绑定的 **key** 值，所以一定要保证其唯一性，一般不采用数组下标作为 **key** 值，因为当数组元素发生变化时，index索引值也会跟着改变。
  + 都是 **组件节点** 的话，会保持当前组件实例不变，更新 **props** ，同时调用组件实例的 **componentWillReceiveProps()** 方法和 **shouldComponentUpdate()** 方法，根据其返回值决定是否调用 **render** 方法。 
  处理完该节点后，继续对子节点进行递归。

### 看完三件事❤

如果你觉得这篇内容对你还蛮有帮助，我想邀请你帮我三个小忙：

1. 点赞，转发，有你们的「 `在看` 」，才是我创造的动力。
2. 关注公众号 『 `前端时光屋` 』，不定期分享原创知识。
3. 同时可以期待后续文章ing🚀

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ghwblar34nj31yh0u04e7.jpg)
