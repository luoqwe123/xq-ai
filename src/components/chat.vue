<template>
    <div class="chat-room">
        <div class="chat-window" ref="chat">
            <aiMessage style="margin-bottom: 10px;" />
            <div class="messages">
                <div v-for="(message, index) in messages" :key="index" :class="['message',]">
                    <aiMessage v-if="message.sentBy == 'ai'" :content="message.content ? message.content : answer" />
                    <span v-if="message.sentBy == 'user'" class="content">{{ message.content }}</span>
                </div>
            </div>
            <p></p>
        </div>
        <div class="input-area">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
            <button @click="sendMessage" :style="disabled ? setUnallowToBtn() : ''">Send</button>
            <button @click="abortRequest" >Stop</button>
        </div>
    </div>
</template>

<script setup lang="ts">
//问题 不想发送了，中断生成，输入框

import { ref, watch } from 'vue';
import aiMessage from './aiTro.vue';
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

    answer.value = ""
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

// 滚动到底部函数
const scrollToBottom = () => {
    if (chat.value) {
        let top = chat.value.scrollHeight + 100
        // console.log("top", top, chat.value.scrollHeight)
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
    }
};
async function askAi(question: string, disabled: any, messages: any, answer: any) {
    const controller = new AbortController();
    console.log("controller",controller)
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
    try {
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
            signal: controller.signal,
        });
        if (!response.body) {
            throw new Error('No response body');
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let flag = true
        // Read the stream and display chunks as they arrive
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            answer.value += decoder.decode(value, { stream: true });
            if (flag && answer.value) {
                flag = false
                scrollToBottom();
            }
            // outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to bottom
        }
    } catch (error) {
        console.error('Error:', error);
        messages.value[length - 1].content = 'An error occurred while fetching the AI response.'
    } finally {
        abortController.value = null;
        disabled.value = false; // Re-enable the button
    }
    messages.value[length - 1].content = answer.value

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
}

.chat-window {
    flex: 1;

    overflow-y: auto;
    background-color: #fff;
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
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
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