
import { defineStore } from "pinia";
import { ref,  } from "vue";
interface message {
    sentBy: string,
    content: content
}
interface content {
    text: string,
    files?: {
        name: string;
        url: string;
        file: File;
    }[]
}
export const useAiStore = defineStore("aiStore", () => {
  const messages = ref<message[]>([]);
  const useStopComp = ref<boolean>(false);
  const isfinish = ref<boolean>(true);
  const aiModel = ref<string>('');
  
  const addQuestion = (question:content)=>{
    messages.value.push({
      sentBy: 'user',
      content: question,
    });
  };
  const addAnswer = ()=>{
    messages.value.push({
      sentBy:'ai',
      content:{
        text:""
      }
    });
  };
  const addValueToAnswer = (value:string)=>{
    messages.value[messages.value.length-1].content.text += value;
  };
  const changeStopState = ()=>{
    // console.log(useStopComp.value);
    useStopComp.value = !useStopComp.value;
  };
  const changeFinish = ()=>{
    isfinish.value = !isfinish.value;
  };
  const reset = () => {
    messages.value = [];
    useStopComp.value = false;
    isfinish.value = true;
  };
  const changeModel = (model:string)=>{
    // console.log(model)
    aiModel.value = model;
  };
  return {
    messages,
    useStopComp,
    isfinish,
    aiModel,

    addQuestion,
    addAnswer,
    addValueToAnswer,
    changeStopState,
    changeFinish,
    reset,
    changeModel
  };
});