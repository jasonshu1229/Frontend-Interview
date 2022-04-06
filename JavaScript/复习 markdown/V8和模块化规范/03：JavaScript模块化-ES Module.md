## 认识ES Module

在早期，JavaScript没有模块化一直是`它的痛点`，所以才会产生我们前面学习的社区规范：CommonJS、AMD、CMD等，所以在ES推出自己的模块化系统时，大家也是兴奋异常。

### ES Module和CommonJS的模块化有一些不同之处： 

- 一方面它使用了`import`和`export`关键字； 
- 另一方面它采用编译期的`静态分析`，并且也加入了`动态引用`的方式；

- ES Module模块采用`export`和`import`关键字来实现模块化：
  - `export`负责将模块内的内容导出；
  - `import`负责从其他模块导入内容；

- 了解：采用ES Module将自动采用严格模式：**use strict**

注意：不熟悉严格模式可以简单看一下MDN的解析：[MDN_严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)

注意，虽然JavaScript有模块化，但下面这种情况，不会使用`模块化`，而是当成一个普通的js文件执行：

```js
<!DOCTYPE html>
<html lang="en">
  ...
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

如果要把`index.js`当成模块化文件去执行

```js
<!DOCTYPE html>
<html lang="en">
  ...
  <body>
    <script src="./index.js" type="module"></script>
  </body>
</html>
```

如果直接在默认浏览器中打开`.html`文件运行代码，会报如下错误：

![](https://tva1.sinaimg.cn/large/0081Kckwly1gki49sv412j30z20420y3.jpg)

该错误在MDN上有给出解释：

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules
- 注意：如果通过本地加载Html文件（比如比如一个 file:// 路径的文件), 你将会遇到 CORS 错误，因 为Javascript 模块安全性需要。
- 需要通过一个服务器来测试，VSCode里直接使用Live Server插件就好了。

## export关键字

export关键字将一个模块中的变量、函数、类等导出；