

const getChatReply = async (message, history) => {

    try {
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                model: "llama3",
                messages: [
                    ...history,
                    {
                        role: "user",
                        content: message,
                    },
                ],
                stream: false,
             }),
        });
        const data = await response.json();
        console.log("Received chat reply from ollama:", data);
        return data.message.content;
    } catch (error) {
        console.error("Error fetching chat reply:", error);
        throw new Error("Error fetching chat reply");
    }
}

module.exports = {
    getChatReply,
};