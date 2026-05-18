const ChatService = require("../Service/ChatService");

const handleChat = async (req, res) => {
    const { message, history } = req.body;
    console.log("Received chat message:", message, "with history:", history);
    if (!message) return res.status(400).json({ error: "Message is required" });
    try {
        const reply = await ChatService.getChatReply(message, history);
        console.log("Chat reply:", reply);  
        return res.status(200).json({ reply });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    handleChat,
};