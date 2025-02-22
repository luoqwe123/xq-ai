<template>
    <div class="ai-chat-container">
        <!-- AI 回答 -->
        <div class="answer" v-if="answer">
            <strong>AI 回答：</strong>
            <div class="markdown-body" v-html="renderedAnswer"></div>
        </div>
        <p>{{ props.content }}</p>
        <!-- 按钮组 -->
        <div class="button-group">
            <button class="copy-button" @click="copyToClipboard" v-if="answer">
                {{ copySuccess ? "复制成功!" : "复制代码" }}
            </button>
            <button class="regenerate-button" @click="regenerateAnswer">
                重新生成
            </button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
const props =  withDefaults(defineProps<{
    content:string,
    fetchAnswer?:any,
    question?:any
}>(),{
    content:"",
    fetchAnswer:()=>{},
    question:''
})
// 初始化 marked 配置
marked.setOptions(<any>{
    highlight: function (code: any, lang: any) {
        if (hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    },
    breaks: true, // 支持换行
});
let renderedAnswer = computed(()=> marked(props.content))

console.log(marked('111'))
const answer = ref(""); // AI 返回的答案
const copySuccess = ref(false); // 复制状态

console.log(renderedAnswer)
// 获取 AI 回答
const regenerateAnswer = async () => {
    copySuccess.value = false; // 重置复制状态
    answer.value = ""; // 清空当前答案
    try {
        answer.value = await props.fetchAnswer(props.question); // 调用传入的函数获取答案
    } catch (error) {
        console.error("获取 AI 回答失败", error);
        answer.value = "获取回答时出错，请稍后重试。";
    }
};

// 复制内容到剪贴板
const copyToClipboard = () => {
    const tempElement = document.createElement("textarea");
    tempElement.value = answer.value;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
    copySuccess.value = true;

    // 重置复制状态
    setTimeout(() => {
        copySuccess.value = false;
    }, 2000);
};


</script>

<style scoped>
.ai-chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: Arial, sans-serif;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 问题样式 */
.question {
    margin-bottom: 1rem;
    color: #333;
}

/* 答案样式 */
.answer {
    margin-bottom: 1rem;
    color: #333;
}

/* 按钮组 */
.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.copy-button,
.regenerate-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.copy-button {
    background-color: #007bff;
    color: white;
}

.copy-button:hover {
    background-color: #0056b3;
}

.regenerate-button {
    background-color: #28a745;
    color: white;
}

.regenerate-button:hover {
    background-color: #218838;
}

/* Markdown 样式 */
.markdown-body {
    padding: 1rem;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
}

/* 代码块样式 */
.markdown-body pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
}

.markdown-body code {
    font-family: "Courier New", Courier, monospace;
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 14px;
}

.markdown-body pre code {
    background: none;
    padding: 0;
}
</style>