



const checkAborted = (abortController,req) => {
  if (req.socket.destroyed || (req.connection && req.connection.destroyed) || (req.originalReq && req.originalReq.aborted)) {
    // console.log('请求已被中止');
    abortController.abort(); // 中止请求
    // res.end(); // 或者发送一个适当的响应
  }
};

const fetchStream = async (question, files, abortController, res, req,modelId) => {
  const url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
  const apiKey = process.env.OPENAI_API_KEY;
  // const obj =  files.map(file => {
  //     const imageFormat = file.type.split('/')[1] || 'jpeg'; // 从 type 获取格式（如 image/jpeg -> jpeg）
  //     const base64Image = file.data.toString('base64'); // Buffer 转为 Base64 字符串
  //     return {
  //       type: 'image_url',
  //       image_url: {
  //         url: `data:image/${imageFormat};base64,${base64Image}`,
  //       },
  //     };
  //   })
    
  const payload = {
    messages: [
      {
        role: 'system',
        content: 'You are a useful assistant',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: question
          },
          ...files.map(file => {
            const imageFormat = file.type.split('/')[1] || 'jpeg'; // 从 type 获取格式（如 image/jpeg -> jpeg）
            const base64Image = file.data.toString('base64'); // Buffer 转为 Base64 字符串
            return {
              type: 'image_url',
              image_url: {
                url: `data:image/${imageFormat};base64,${base64Image}`,
              },
            };
          }),
        ], // 用户输入的文本
      },
    ],
    // files: files.map(file => ({
    //     name: file.name,
    //     type: file.type,
    //     data: file.data.toString('base64'), // Buffer 转为 Base64 字符串
    // })),
    model: modelId, //ep-20250207171255-vnrmt
    stream: true, // 启用流式传输
    max_tokens: 2048,
  };

  // 请求配置
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json', // 使用 JSON 格式
    },
    body: JSON.stringify(payload),
    signal: abortController.signal, // 绑定 AbortController
  };

  try {
    // 发起 fetch 请求
    const response = await fetch(url, requestOptions);
    if(response.status === 400)   return res.status(400).json("该模型不支持上传文件😅!" );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 检查是否支持 SSE（Content-Type 应为 text/event-stream）
    if (!response.headers.get('content-type')?.includes('text/event-stream')) {
      throw new Error('Server does not support SSE');
    }

    // 获取响应体的 ReadableStream
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    while (true) {
      checkAborted(req);
      const { done, value } = await reader.read();
      if (done) {
        res.write('data: [DONE]\n\n');
        res.end();
        break;
      }

      // 解码流数据
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      // 解析每行 SSE 数据
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            // res.write('data: [DONE]\n\n');
            res.end();
            break;
          }
          try {
            let parsed = JSON.parse(data);
                      

            let content = parsed.choices?.[0]?.delta.content;
                       
            if (content === '') {
                           
              content = parsed.choices[0].delta.reasoning_content;
            }

            if (content) {
              res.write(`${content }`);
            }

            if (parsed.choices?.[0]?.finish_reason === 'top') {
              res.write('data: [DONE]\n\n');
              res.end();
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }


  } catch (error) {
    console.error('Fetch error:', error);
    res.write(`data: {"error": "${error.message}"}\n\n`);
    res.end();
  }
};

module.exports = fetchStream;

