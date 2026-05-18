const ChatbotHeader = ({ handleClose }: { handleClose: () => void }) => {
    return (
        <div className="chatbot-header">
            <h2>Inventory Management Chatbot</h2>
            <button className="close-button" onClick={handleClose}>X</button>
        </div>
    );
};

export default ChatbotHeader;