

const apiKey = "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";
const apiUrl = "https://api.groq.com/openai/v1/chat/completions"; // Example API endpoint (check Groq docs)

async function ai(message) {
    const requestBody = {
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_completion_tokens: 1024,
        top_p: 1,
        stop: null,
        stream: false
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Error: Unable to get response.";
    }
}

// Example usage:
ai("how are you").then(response => console.log(response));
