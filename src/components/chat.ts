export const askAi = async (question: string, disabled: boolean, messages: any, answer: string) => {
    if (!question) {
        alert('Please enter a question!');
        return;
    }
    // Disable the button while fetching response
    disabled = true;
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
            answer += decoder.decode(value, { stream: true });
            console.log(answer)
            // outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to bottom
        }
    } catch (error) {
        console.error('Error:', error);
        messages.push({
            sentBy: 'ai',
            content: 'An error occurred while fetching the AI response.',
        });
    } finally {
        disabled = false; // Re-enable the button
    }
}