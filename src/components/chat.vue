<template>
    <div class="chat-room">
        <Header style="width: 100%;margin-bottom: 10px;"></Header>
        <div class="chat-window">
            <div class="chatBox" @wheel="handleScroll" ref="chat">
                <div class="main">
                    <aiMessage style="margin-bottom: 10px;" />
                    <div class="messages">
                        <div v-for="(message, index) in messages" :key="index" :class="['message',]">

                            <aiMessage v-if="message.sentBy == 'ai'"
                                :content="message.content ? message.content : answer" />
                                <!-- <MainMarkdownParser :data="message.content ? message.content : answer"></MainMarkdownParser> -->
                            <span v-if="message.sentBy == 'user'" class="content">{{ message.content }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="stop" @click="abortRequest" v-if="answer">
            <Svg name="stop" height="20px" width="20px" class="stopBtn">
                <template #content><span style="font-family: sans-serif;font-weight: bold;margin-left: 0.3rem;">停止</span></template>
            </Svg>
        </div>

        <div class="input-area">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
            <button @click="sendMessage" :style="disabled ? setUnallowToBtn() : ''">Send</button>

        </div>
    </div>
</template>

<script setup lang="ts">

import Svg from "@/components/svgComponent.vue"
import { ref, watch } from 'vue';
import aiMessage from './aiTro.vue';
import Header from "./Header.vue";
import MainMarkdownParser from "./MainMarkdownParser.vue";
// import { askAi } from './chat';
interface message {
    sentBy: string,
    content: string
}

const newMessage = ref('');
let answer = ref('')
let disabled = ref(false)

const messages = ref<any>([
    // { sentBy: 'ai', content: '我是一个综合型助手小秋，不会的问题都可以来问我呦 ٩(๑❛ᴗ❛๑)۶' },

]);

const setUnallowToBtn = () => {
    return {
        cursor: "not-allowed",
        backgroundColor: "#e0e0e0"
    }
}

const sendMessage = async () => {


    // console.log("messages", messages.value)
    if (newMessage.value.trim() !== '') {
        messages.value.push({
            sentBy: 'user',
            content: newMessage.value,
        });

    }
    let question = newMessage.value
    newMessage.value = '';
    await askAi(question, disabled, messages, answer)


};
const chat = ref<any>(null);
const abortController = ref<AbortController | null>(null)
let createDebounce: any = ""

function debounce(fn: Function, delay: number) {
    let timer: any
    function doFn(this: any, ...args: any[]) {
        let content: any = this
        timer = setInterval(() => {
            console.log(111)
            fn.apply(content, args)
        }, delay)
    }
    function stop() {
        clearInterval(timer)
    }
    return { doFn, stop }
}

// 滚动到底部函数
const scrollToBottom = () => {
    if (chat.value) {

        let top = chat.value.scrollHeight
        console.log("top", top, chat.value.scrollHeight)
        chat.value.scrollTop = top;

    }
};
// 监听聊天消息数组的变化
// watch(messages.value, () => {

//     scrollToBottom();
// });
const abortRequest = () => { 
    if (abortController.value) {
        abortController.value.abort(); // 中止请求
        abortController.value = null; // 清空引用
        messages.value[length - 1].content = answer.value
        answer.value = ""  //通过answer控制停止生成的按钮
    }
};
async function askAi(question: string, disabled: any, messages: any, answer: any) {
    const controller = new AbortController();
    console.log("controller", controller)
    abortController.value = controller;
    if (!question) {
        alert('Please enter a question!');
        return;
    }
    // Disable the button while fetching response
    disabled.value = true;
    messages.value.push({
        sentBy: 'ai',
        content: '',
    });
    const length = messages.value.length
    createDebounce = debounce(scrollToBottom, 1000)
    try {
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
            signal: abortController.value.signal,
        });
        if (!response.body) {
            throw new Error('No response body');
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        createDebounce.doFn()
        // Read the stream and display chunks as they arrive
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            answer.value += decoder.decode(value, { stream: true });

            // outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to bottom
        }
    } catch (error) {
        console.error('Error:', error);
        messages.value[length - 1].content = 'An error occurred while fetching the AI response.'
    } finally {
        abortController.value = null;
        disabled.value = false; // Re-enable the button
        messages.value[length - 1].content = answer.value
        answer.value = ""
        setTimeout(() => {
            createDebounce.stop()
            createDebounce = ''
        }, 1500)

    }

}
function handleScroll(event: any) {
    if (event.deltaY < 0 && createDebounce) {
        createDebounce.stop()
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
    height: 58px;
    z-index: 2;
}

.stop {
    width: 96%;
    height: 40px;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    position: fixed;
    bottom: 58px;
    z-index: 2;

}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
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

button {
    padding: 10px 20px;
    margin-left: 10px;
    border: none;
    background-color: #4caf50;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>