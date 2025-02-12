// Please install OpenAI SDK first: `npm install openai`

const OpenAI = require("openai");
// const OPENAI_TEMPERATURE = 0.7;
// const OPENAI_MAX_TOKENS = 150;
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-c7b36faf54fc41e784516d893c3aa567'
});

async function main() {
  console.log(111)
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user", content: "hi"
      }
    ],
    model: "deepseek-reasoner",
    stream: true
  });
  console.log(completion.iterator())
  for await (const chunk of completion.iterator()) {
    console.log(chunk)
  }
  
}

main();