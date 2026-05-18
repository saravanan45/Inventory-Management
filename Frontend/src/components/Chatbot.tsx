import { useState } from "react";
import type { ChangeEvent } from "react";

import ChatLoadingIndicator from "./ChatLoadingIndicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hi, I am your inventory assistant. Ask me about stock or orders.",
  },
];

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    try {
        setIsLoading(true);
      const response = await fetch("http://localhost:3010/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history: allMessages }),
      });

      const data = await response.json();
      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
        setIsLoading(false);
    }
  };
  return (
    <div className="chatbot-overlay">
      <dialog open className="chatbot-dialog">
        <div className="chatbot-message-container">
          <div className="chatbot-messages">
            {allMessages.map((msg, index) => (
              <div className="messages-container" key={index}>
                <span className="msg-role">
                  {msg.role === "user" ? "User:" : "Bot:"}
                </span>
                <span className="msg-content">{msg.content}</span>
              </div>
            ))}
            {
                isLoading && (
                    <ChatLoadingIndicator />
                )
            }
          </div>
          <div className="chatbot-input-message-container">
            <input
              className="type-something-text-field"
              type="text"
              value={message}
              onChange={handleTextChange}
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="send-button">
              Send
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Chatbot;
