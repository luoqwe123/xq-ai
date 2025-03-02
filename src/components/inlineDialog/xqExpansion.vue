<template>
  <div class="expansion-container">
    <div class="dialog-overlay" @click="handleClose"></div>
    <div class="dialog-box" :style="isMobile ? mobileStyle() : computerStyle()"
         :class="isMobile ? 'slide-up' : 'fade-in '">
      <div class="dislog-header">
        <input type="text" @keyup.enter="chat()" style="width: 80%;border: none;padding-left: 10px;height: 28px;"
               placeholder="请输入您想询问的问题..." v-model="iptValue">
        <button style="border: 1px solid #ebebeb;background-color: white;border-radius: 5px;" v-if="!iptValue&&aiStore.isfinish">
          <kbd
            style="font-family: var(--font-sans);font-size: 12px;display: flex;justify-content: center;align-items: center;">
            <span :style="{ color: color, padding: '3px' }">Esc</span>
          </kbd>

        </button>
        <button v-if="iptValue || !aiStore.isfinish" style="width: 24px;height: 24px;border-radius: 50%;background-color: black;
        display: flex;justify-content: center;align-items: center;" @click="sendOrStop">
          <xqSvg :name=selectSvg fill="white" />
        </button>
      </div>
      <div class="dialog-main">
        <div class="suggestions" style="width: 100%;height: 32px;font-size: 12px;line-height: 32px;"
             :style="{ color: color }">
          {{ suggest }}
        </div>
        <template v-if="!messages.length">
          <div class="dialog-content" v-for="(item, index) in suggestionsArr" :key="index" @click="chat(item.content)">
            <Svg :name="item.icon"></Svg>
            <div style="font-size: 14px;color:#666666;margin-left: 12px;">{{ item.content }}</div>
          </div>
        </template>
        <template v-else>
          <aiMessage :content="messages[0].content"></aiMessage>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, defineEmits, ref, } from 'vue';
import Svg from '../svgComponent.vue';
import aiMessage from '../aiTro.vue';
import { askAi,abortRequest } from '@/utils/request';

import { useScreenSize } from "@/hooks/useScreenSize";
import { useAiStore } from '@/stores/aiAnswer';



withDefaults(defineProps<{
  color?: string
}>(), {
  color: "#8f8f8f"
});
interface messagesType {
  sentBy: string,
  content: string
}

const iptValue = ref('');
const messages = ref<messagesType[] | never>([]);
const suggest = ref<string>("Suggestions");

let { isMobile } = useScreenSize();
// console.log(isMobile.value);
const aiStore = useAiStore();

let emit = defineEmits(['closeDialog']);
function handleClose() {
  emit("closeDialog", '');

}
const selectSvg = computed(()=>{
  return aiStore.isfinish ? 'right': 'stop';
});

const mobileStyle = () => {

  return {
    'width': "100%",
    'left': "0px",
    "bottom": "0px",
    "height": '80%',
    "border-radius": "1rem 1rem 0 0"
  };
};
const computerStyle = () => {

  return {
    'width': "600px",
    'left': "calc(50% - 300px)",
    "bottom": "calc(50% - 230px)",
    'height': "460px"
  };
};

const suggestionsArr = ref([
  {
    icon: 'hi',
    content: "你好"
  },
  {
    icon: 'who',
    content: "你是谁"
  },
  {
    icon: 'help',
    content: "你能做什么"
  }

]);


function sendOrStop (){
  if(aiStore.isfinish) chat();
  else abortRequest();
}
function chat(question: string | void) {
  if (question) {
    iptValue.value = question;
  }
  if (!iptValue.value) {
    alert('Please enter a question!');
    return;
  }
  suggest.value = iptValue.value;
  iptValue.value = "";
  if (!messages.value.length) {
    messages.value.push({
      sentBy: "ai",
      content: ""
    });
  } else {
    messages.value[0].content = "";
  }
  askAi({ text: suggest.value }, true, messages);
}


</script>

<style scoped>
.expansion-container {
  width: 120%;
  height: 200vh;
  position: fixed;
  z-index: 10;

  left: -10px;
}

.dialog-overlay {
  width: 100%;
  height: 100%;
  /* background-color: hsl(0, 0%, 100% ,1); */
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-main {
  overflow-y: scroll;
  width: 100%;
  height: calc(100% - 53px);
  padding: 0px 12px
}

.dialog-box {
  position: fixed;
  z-index: 20;
  background-color: white;
  border-radius: 1rem;
  /* 圆角顶部 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;



}

.dislog-header {
  width: 100%;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  display: flex;
  padding: 0px 10px;
  align-items: center;
  height: 53px;
  justify-content: space-between;
  border-bottom: 1px solid #ebebeb;
}

.dialog-content {
  display: flex;
  align-items: center;
  width: 96%;
  height: 42px;
  padding-left: 10px;
  margin-left: 2%;
  border-radius: 6px;


}

.dialog-content:hover {
  background-color: #f2f2f2;
}

/* 对话框动画 */
.slide-up {
  animation: slide-up 0.3s ease-out;
}

.fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0%);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>