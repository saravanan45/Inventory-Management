const ChatLoadingIndicator = () => {
    return (
        <div className="chat-loading-indicator">
            <div className="chat-skeleton-author"></div>
            <div className="chat-skeleton-message-container">
                <div className="chat-skeleton-message"></div>
                <div className="chat-skeleton-message"></div>
                <div className="chat-skeleton-message"></div>
                <div className="chat-skeleton-message"></div>
            </div>
        </div>
    )

}

export default ChatLoadingIndicator;