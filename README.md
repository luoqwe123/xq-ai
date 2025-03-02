<h1 align='center'>xq-LLM</h1>

​	这是一个调用deepseek-r1 api现实与 ai对话的大语言应用项目

## 技术栈

#### 前端

-   Vue3 + vite
- Pinia 状态管理工具
- Vitest  测试工具
- ESLint + Husky 

#### 后端

- node.js

## 快速开始

### 	安装依赖

```sh
pnpm install
```

### 	配置服务端 .env

```
cd app/server

echo '' > .env    //创建一个 .env 文件

OPENAI_API_KEY = *********  //你大模型的api_key
```



### 	启动服务

```sh
cd app/server

pnpm dev
```

### 	启动项目

```sh
pnpm dev
```

### 	项目打包

```sh
pnpm build
```

