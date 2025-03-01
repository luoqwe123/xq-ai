<template>
  <div class="chat-room">
    <Header style="width: 100%;margin-bottom: 10px;"></Header>
    <div class="chat-window">
      <div class="chatBox" @wheel="stopScroll" ref="chat">
        <div class="main">
          <aiMessage style="margin-bottom: 10px;" />
          <div class="messages">
            <div v-for="(message, index) in dataListStore.messages" :key="index" :class="['message',]">
              <!-- <aiMessage v-if="message.sentBy == 'ai'" :content="message.content" /> -->
              <MainMarkdownParser v-if="message.sentBy == 'ai'" :data="message.content.text">
              </MainMarkdownParser>
              <div class="question content" style="display: flex;flex-direction: column;">
                <span v-if="message.sentBy == 'user'" >{{ message.content.text }}</span>
                <div class="image" style="display: flex;">
                  <img v-for="(item,index) in message.content.files" :src="item.url" alt="" :key="index" style="height: 50px;width: 50px;border-radius: 10px;margin-right: 6px;">
                </div>
                               
              </div>
                            
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="stop" @click="abortRequest(dataListStore.changeStopState)" v-if="dataListStore.useStopComp"
         :style="{ bottom: stopBottom + 'px' }">
      <Svg name="stop" height="20px" width="20px" class="stopBtn">
        <template #content><span
          style="font-family: sans-serif;font-weight: bold;margin-left: 0.3rem;">停止</span></template>
      </Svg>
    </div>
    <xqInput class="input-area"  @enter="sendMessage"
             v-model:stop-bottom="stopBottom"></xqInput>
    <!-- <div class="input-area" ref="inputArea">
            <textarea v-model="newMessage" @keyup.enter="sendMessage" @input="handleInput"
                placeholder="Type a message..." row="1" class="text"></textarea>
            

        </div> -->

    <!-- <button @click="sendMessage" :style="disabled ? setUnallowToBtn() : ''">Send</button> -->
  </div>
</template>

<script setup lang="ts">

import Svg from "@/components/svgComponent.vue";
import { ref,  watchEffect } from 'vue';
import aiMessage from './aiTro.vue';
import Header from "@/components/xqHeader.vue";
import MainMarkdownParser from "./MainMarkdownParser.vue";
import { abortRequest } from "@/utils/request";

import xqInput from "./xqInput.vue";
import { useAiStore } from "@/stores/aiAnswer";
const dataListStore = useAiStore();
// interface message {
//     sentBy: string,
//     content: string
// }
interface DebounceResult {
  doFn: (...args: unknown[]) => void; // 参数类型根据 fn 调整
  stop: () => void;
}
let createDebounce: DebounceResult | null = null;
const stopBottom = ref(80);
// const messages = ref<any>([
//   // { sentBy: 'ai', content: '我是一个综合型助手小秋，不会的问题都可以来问我呦 ٩(๑❛ᴗ❛๑)۶' },
// ]);
// const setUnallowToBtn = () => {
//     return {
//         cursor: "not-allowed",
//         backgroundColor: "#e0e0e0"
//     }
// }

const sendMessage = async () => {
  // console.log("messages", messages.value)

  // if (newMessage.value.trim() !== '') {
  //     messages.value.push({
  //         sentBy: 'user',
  //         content: newMessage.value,
  //     });
  // }
  // let question = newMessage.value
  // setInputEntry.value = true
  // isReply.value = true
  // messages.value.push({
  //     sentBy: 'ai',
  //     content: '',
  // });
  createDebounce = debounce(scrollToBottom, 1000);
  createDebounce.doFn();
  // await askAi({text:question,}, messages)
  // isReply.value = false

};
watchEffect(() => {
  if (dataListStore.isfinish && createDebounce) {
    setTimeout(() => {
      if(createDebounce) createDebounce.stop();
      createDebounce = null;
    }, 1500);
  }
});
const chat = ref<HTMLDivElement|null>(null);
function debounce(fn: (...args: unknown[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
   
  function doFn(this: unknown, ...args: unknown[]) {
   
    timer = setInterval(() => {
      fn.apply(this, args);
    }, delay);
  }
  function stop() {
    if (timer !== null) {
      clearTimeout(timer); // 使用 clearTimeout
      timer = null;
    }
  }
  return { doFn, stop };
}

// 滚动到底部函数
const scrollToBottom = () => {
  if (chat.value) {
        
    let top = chat.value.scrollHeight;
    //console.log("top", top, chat.value.scrollHeight)
    chat.value.scrollTop = top;
  }
};
// 监听聊天消息数组的变化
// watch(messages.value, () => {

//     scrollToBottom();
// });
function stopScroll(event: WheelEvent) {
  if (event.deltaY < 0 && createDebounce) {
    createDebounce.stop();
  }
}


</script>

<style scoped>
.chat-room {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-between;
    /* background-color: #f2f2f2; */
    width: 100%;
    align-items: center;
    padding-top: 1rem;
    overflow: hidden;
    padding: 0px;
}

.chat-window {
    flex: 1;
    background-color: #fff;
    width: 100%;
    overflow: hidden;
}

.chatBox {
    background-color: #fff;
    width: 100%;
    height: calc(100% - 80px);
    overflow-y: auto;
    display: flex;
    justify-content: center;
}

.main {
    height: 100%;
    width: 96%;
}

.messages {
    padding: 0;
    margin: 0;
    list-style: none;
    margin-bottom: 10px;
}

.message {
    display: flex;
    margin-bottom: 10px;
}

.message.sent-by-you {
    justify-content: flex-end;
    align-items: flex-end;
}

.message .content {
    max-width: 60%;
    padding: 10px;
    border-radius: 5px;
    background-color: #e0e0e0;
}

.message.sent-by-you .content {
    background-color: #4caf50;
    color: #fff;
}

.username {
    font-weight: bold;
    margin-right: 5px;
}

.input-area {
    display: flex;
    padding: 10px;
    justify-content: center;
    background-color: #fff;
    border-top: 1.6px solid #ddd;
    width: 96%;
    position: fixed;
    bottom: 0px;
    height: 80px;
    z-index: 2;

}

.stop {
    width: 96%;
    height: 40px;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    position: fixed;
    /* bottom: 58px; */
    z-index: 2;

}



.stopBtn {

    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    /* 轻微阴影效果 */
    transition: box-shadow 0.3s ease;
    /* 阴影过渡效果 */
    cursor: pointer;
    background-color: white;
    min-width: 90px;
    display: flex;
    justify-content: center;
    border-radius: 24px;
    height: 100%;
}

.stopBtn:hover {
    box-shadow: 0 0px 8px rgba(0, 0, 0, 0.2);
    /* 鼠标悬停时阴影加深 */
}

.stopBtn:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    /* 点击时阴影变浅 */
    transform: translateY(1px);
    /* 点击时按钮略微下移，增加交互感 */
}

/* button {
    padding: 0px 20px;
    margin-left: 10px;
    border: none;
    background-color: #4caf50;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
} */
</style>