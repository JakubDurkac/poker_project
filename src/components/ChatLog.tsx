import { useEffect, useRef, useState } from "react";
import { ChatMessage, ClientAttributes } from "../types";

interface Props {
  chatMessages: ChatMessage[];
  addChatMessage: (author: string, message: string) => void;
  clientAttributes: ClientAttributes;
}

const ChatLog = ({ chatMessages, addChatMessage, clientAttributes }: Props) => {
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addChatMessage(clientAttributes.name ?? "Guest", inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className="game-log-container">
      <div className="game-log-header">Chat Log</div>
      <div className="game-log-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className="game-log-line">
            {"> "}
            {msg.author === "system" ? (
              ""
            ) : (
              <>
                <span className="chat-message-author">{msg.author}</span>
                {": "}
              </>
            )}
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="game-log-chat">
        <input
          className="chat-input"
          type="text"
          placeholder="Chat with your opponents!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatLog;
