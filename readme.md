# 说明

本仓库用于练习重写重要的js函数。

1. 测试驱动开发
2. 使用typescript（部分）

## 使用

### 全局安装

```js
npm install -g ts-node
npm install -g typescript
```

### 运行测试用例

1. event-hub页面
  
进入相应的目录后运行测试用例
```
cd event-hub
ts-node ./index.test.ts
```

1. deepClone页面
   
进入相应的目录，安装相应依赖后运行测试用例
```
cd deep-clone
npm install
npm run test
```