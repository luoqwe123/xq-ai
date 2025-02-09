export async function askAi(question: string, disabled: any, messages: any, answer: any) {
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
        messages.value[length - 1].content = 'An error occurred while fetching the AI response.'
    } finally {
        disabled.value = false; // Re-enable the button
    }
    messages.value[length - 1].content = answer.value
}