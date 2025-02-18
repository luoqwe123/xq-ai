
import { ref } from "vue";
const abortController = ref<AbortController | null>(null)
const abortRequest = (isReply:any) => {
    if (abortController.value) {
        abortController.value.abort(); // 中止请求
        abortController.value = null; // 清空引用
        isReply.value = false;

    }
};
async function askAi(question: string, disabled: any, messages: any) {
    const controller = new AbortController();
    console.log("controller", controller)
    abortController.value = controller;
    if (!question) {
        alert('Please enter a question!');
        return;
    }
    // Disable the button while fetching response
    disabled.value = true;
    const length = messages.value.length
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
       
        // Read the stream and display chunks as they arrive
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            messages.value[length - 1].content += decoder.decode(value, { stream: true });
            // outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to bottom
        }
    } catch (error) {
        console.error('Error:', error);
        // messages.value[length - 1].content = 'An error occurred while fetching the AI response.'
    } finally {
        abortController.value = null;
        disabled.value = false; // Re-enable the button
    }

}
export {
    abortRequest,
    askAi
}