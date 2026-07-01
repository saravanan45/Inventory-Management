import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";

import ChatbotHeader from "./ChatbotHeader";
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

const Chatbot = ({ handleChatbotClose }: { handleChatbotClose: () => void }) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesContainerRef.current) {
      return;
    }

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [allMessages, isLoading]);

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
      // const reply = "Here are the details for **Order 100**:\n\n---\n\n### **Order Summary**\n- **Order ID**: 100  \n- **User ID**: 36  \n- **Total Amount**: ₹19,726.91 (INR)  \n- **Status**: Cancelled  \n- **Payment Status**: Paid  \n- **Created At**: April 22, 2026, 14:17:50 UTC  \n- **Updated At**: May 12, 2026, 05:52:28 UTC  \n\n---\n\n### **Order Items**\n1. **Product 5**  \n   - SKU: SKU-0005  \n   - Quantity: 1  \n   - Price at Purchase: ₹256.83  \n\n2. **Product 8**  \n   - SKU: SKU-0008  \n   - Quantity: 5  \n   - Price at Purchase: ₹111.64  \n\n3. **Product 15**  \n   - SKU: SKU-0015  \n   - Quantity: 3  \n   - Price at Purchase: ₹904.56  \n\n4. **Product 26**  \n   - SKU: SKU-0026  \n   - Quantity: 1  \n   - Price at Purchase: ₹371.02  \n\n---\n\nLet me know if you need further assistance!";

      setAllMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: data.reply,
          // content: reply,
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter" && !isLoading) {
        handleSend();
    }
  };

  const handleClose = () => {
    setShowChatbot(false);
    handleChatbotClose();
  }

  return (
    <div className="chatbot-overlay">
      <dialog open={showChatbot} className="chatbot-dialog">
        <ChatbotHeader handleClose={handleClose}/>
        <div className="chatbot-message-container">
          <div className="chatbot-messages" ref={messagesContainerRef}>
            {allMessages.map((msg, index) => (
              <div className="messages-container" key={index}>
                <span className="msg-role">
                  {msg.role === "user" ? "User:" : "Bot:"}
                </span>
                <span className="msg-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </span>
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
              onKeyDown={handleKeyDown}
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
