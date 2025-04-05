
import { ref } from "vue";
import { useAiStore } from "@/stores/aiAnswer";
import type { MediaFile } from "@/components/xqInput.vue";
import { xidaMessage } from "xida-ui";


const abortController = ref<AbortController | null>(null);
const abortRequest = (fn?:()=> void) => {
  if (abortController.value) {
    abortController.value.abort(); // 中止请求
    abortController.value = null; // 清空引用
    fn?.();

  }
};
interface question {
    text: string,
    files?: MediaFile[]
}
interface messagesType{
  value:{
    sentBy:string,
    content:string
  }[]
 
}
async function askAi(question: question, expand: boolean, messages?:messagesType) {
  const dataListStore = useAiStore();
  dataListStore.changeFinish();
  if (!expand) {
    dataListStore.addAnswer();
  }
  // const formData = new FormData();
 
  if (!question.text.length) {
    
    xidaMessage(
      {
        content:'Please enter a question!',
        type:"danger"
      }
    );
    return;
  }
  const filePromises = question.files!.map(item =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(item.file);
    })
  );
  const fileBase64 = await Promise.all(filePromises);
  // console.log(dataListStore.aiModel)
  const payload = {
    question: question.text,
    files: fileBase64.map((data, index) => ({
      data: data.split(',')[1], // 移除前缀
      name: question.files![index].name,
      type: question.files![index].type,
    })),
    model: dataListStore.aiModel
  };

  
  // formData.append("question", question.text);
  // if (Array.isArray(question.files) && question.files.length) {
  //   question.files.forEach((el, index) => {
  //     formData.append(`files[${index}]`, el.file,el.name);
  //   });
  // }
  // console.log(formData.get("files[0]"))
  const controller = new AbortController();
  // console.log("controller", controller)
  abortController.value = controller;
 
  // Disable the button while fetching response

  const length = messages?.value.length;
  
  try {
    const response = await fetch(import.meta.env.VITE_GLOB_API_URL+'ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: abortController.value.signal,
    });
    if (!response.body) {
      throw new Error('No response body');
    }
    // console.log(response)
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Read the stream and display chunks as they arrive
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if(response.status == 400){
        xidaMessage({
          content:decoder.decode(value, { stream: true }),
          type:"danger"
        });
        return;
      }
      if (expand && messages?.value.length && length) {
        messages.value[length - 1].content += decoder.decode(value, { stream: true });
      } else {
        dataListStore.addValueToAnswer(decoder.decode(value, { stream: true }));
      }

      // outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to bottom
    }
  } catch (error) {
    return error;
    // console.error('Error:', error);
    // messages.value[length - 1].content = 'An error occurred while fetching the AI response.'
  } finally {
    abortController.value = null;
    dataListStore.changeFinish();
     
  }

}
export {
  abortRequest,
  askAi
};


