# langchain-examples

langchain.js 相关调研及其案例实现

## langchain

### examples

* llms - give your a name
  * Models + Prompts + Chains
* chat models - translation assistant
  * Models + Prompts + Chains
* chat - data analysis
  * Models + Prompts + Chains + Indexs + Memory
    * 数据向量化、问题向量化、相似性搜索（基于向量）
    * 接入 llm（openai）润色，生成目标结果
* chat - charts generate
  * Models + Prompts + Chains + Indexs + Memory
    * 数据向量化、问题向量化、相似性搜索（基于向量）
    * 接入 llm（openai）润色，生成目标结果
  
  * 支持多轮对话（加入上下文缓存）
    * memory 缓存历史对话记录，结合 openai 实现问题更正
    * 继续处理后续逻辑
    
### windows proxy

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
```

### how to use

#### create env file

部分案例使用本地 .env 文件，需要自主创建。

```bash
OPENAI_API_KEY=<your key>
```

### setup

```bash
pnpm install
```

### dev server

```bash
pnpm run dev
```

### production

```bash
pnpm run build
```

#### local preview

```bash
pnpm run preview
```

## vega-lite

## graphql

## cube.js