<template>
    <div class="chat-room">
        <div class="chat-window">
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

        </div>
    </div>
</template>

<script setup lang="ts">
//问题 disabled 没生效，answer清除上一个问题答案的问题

import { ref } from 'vue';
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
    console.log("messages", messages.value)
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

async function askAi(question: string, disabled: any, messages: any, answer: any) {
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
        });
        if (!response.body) {
            throw new Error('No response body');
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
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
        messages.value[length-1].content = 'An error occurred while fetching the AI response.'
    } finally {
        disabled.value = false; // Re-enable the button
    }
     messages.value[length-1].content = answer.value
}

</script>

<style scoped>
.chat-room {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-between;
    background-color: #f2f2f2;
}

.chat-window {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
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
    background-color: #fff;
    border-top: 1px solid #ddd;
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