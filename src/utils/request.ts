
import { ref } from "vue";
import { useAiStore } from "@/stores/aiAnswer";
import Expansion from "@/components/inlineDialog/expansion.vue";


const abortController = ref<AbortController | null>(null)
const abortRequest = (fn: Function) => {
    if (abortController.value) {
        abortController.value.abort(); // 中止请求
        abortController.value = null; // 清空引用
        fn()

    }
};
interface question {
    text: string,
    files?: any
}
async function askAi(question: question, expand: boolean, messages?: any) {
    let dataListStore = useAiStore()
    if (!expand) {
        dataListStore.addAnswer()
        dataListStore.changeFinish()
    }
    const formData = new FormData()
    formData.append("question", question.text)
    if (Array.isArray(question.files) && question.files.length) {
        question.files.forEach((el, index) => {
            formData.append(`files[${index}]`, el)
        });
    }
    
    const controller = new AbortController();
    // console.log("controller", controller)
    abortController.value = controller;
    if (!question.text) {
        alert('Please enter a question!');
        return;
    }
    // Disable the button while fetching response

    const length = messages?.value.length
    try {
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            body: formData,//JSON.stringify({ question }),
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
                alert(decoder.decode(value, { stream: true }))
                return
            }
            if (expand) {
                messages.value[length - 1].content += decoder.decode(value, { stream: true });
            } else {
                dataListStore.addValueToAnswer(decoder.decode(value, { stream: true }))
            }

            // outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to bottom
        }
    } catch (error) {
        console.error('Error:', error);
        // messages.value[length - 1].content = 'An error occurred while fetching the AI response.'
    } finally {
        abortController.value = null;
        !expand && dataListStore.changeFinish()
    }

}
export {
    abortRequest,
    askAi
}