require('dotenv').config();
// const OpenAI = require("openai");
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
// const multer = require('multer');
const myFetch = require("./fetch");
// const path = require('path');
// const fs = require('fs').promises;
const app = express();


const aiModel = {
  'douBao-1.5-vision-pro': 'ep-20250405171635-nmdkl',
  'deepSeek-R1': 'ep-20250211161731-n8lcb'
};

const port = 3001;
// const openai = new OpenAI({
//   baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
//   apiKey: process.env.OPENAI_API_KEY
// });
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 配置 multer，指定文件存储路径
// const upload = multer();
// 确保存储目录存在
// const uploadDir = path.join(__dirname, 'uploads');


// app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for JSON body parsing and enabling CORS
// app.use(bodyParser.json());
app.use(cors());
// Endpoint to handle question from the front-end
app.post('/ask', async (req, res) => {
  const { question, files, model } = req.body;
  if (!question || !model) return res.status(400).json("参数错误😅!");
  // 处理文件（解码 Base64 并保存）
  let fileBuffers;


  if (Array.isArray(files)) {
    fileBuffers = files.map(file => ({
      name: file.name,
      type: file.type,
      data: Buffer.from(file.data, 'base64'),
    }));
  }else{
    return res.status(400).json("参数错误😅!");
  }



  const modelId = aiModel[model];
  // await Promise.all(
  //   fileBuffers.map(async (file) => {

  //     const filePath = path.join(uploadDir, file.name);
  //     await fs.writeFile(filePath, file.data);
  //   })
  // );

  if (!question) {
    return res.status(400).json("Question is required!");
  }
  // if(req.body.files){
  //   return res.status(400).json("暂时不支持文件😅!" );
  // }
  try {
  // console.log(userQuestion);
    const abortController = new AbortController();

    // const response = await openai.chat.completions.create(
    //   {
    //     messages: [
    //       {
    //         role: "system",
    //         content: `You are a useful assistant `
    //       },
    //       { role: "user", content: userQuestion }],
    //     model: "ep-20250211161731-n8lcb",
    //     stream: true, // Enable streaming  sse 流式传输
    //     max_tokens: 2048,
    //   },
    //   {
    //     signal: abortController.signal, // 将信号绑定到请求
    //   }
    // );
    await myFetch(question, fileBuffers, abortController, res, req, modelId);

    // Set headers for streaming response
    // res.setHeader('Content-Type', 'text/event-stream');
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Connection', 'keep-alive');


    // for await (const chunk of response.iterator()) {

    //   // console.log(chunk.choices[0]);
    //   let content = chunk.choices[0].delta.content;
    //   // console.log(content == "");
    //   if (content == "") {
    //     content = chunk.choices[0].delta.reasoning_content;
    //   }
    //   // Stream content to the client
    //   if (content) {
    //     res.write(`${content}`);
    //   }
    //   if(chunk.choices[0]['finish_reason'] == "top"){
    //     res.end();
    //   }
    // }
    // // Indicate the stream is done
    // // res.write(`data: [DONE]\n\n`);

  // res.end();
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to process the request." });
  }

});
app.get('/model', (req, res) => {
  res.json(aiModel);
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// 你是一位经验丰富的项目经理，对于用户每一次提出的问题，都不急于编写代码，更多是通过深思熟虑、结构化的推理以产生高质量的回答，探索更多的可能方案，并从中寻找最佳方你具备以下能力：
//                         ## 需求澄清
//                         1.能用自己的话清晰的复述用户提出的问题
//                         2.与用户建立高层级需求沟通
//                         3. 提供类比案例帮助用户启发思考
//                         4.使用问题链追问来深入用户潜在需求
//                         5. 解释主要挑战和限制条件
//                         6. 整个思考过程，你可以用提问的方式，补全你需要的资料和信息
//                         #＃ 方案探索
//                         1. 基于已有技术，探索多种可行的技术选型方
//                         2. 列出每种技术选型方案的优点、缺点、适用场景及成本
//                         3.优先考虑网络中已有的技术解决方案，避免重复造轮子
//                         4. 根据需求提供最优推荐，说明推荐理由及后续改进方向
//                         ##执行计划
//                         1. 基于推荐方案，制定系统架构、数据流及交
//                         2.使用敏捷方式管理，制定迭代计划
//                         3.明确每次迭代的目标及任务明细